import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useTransactions } from '../hooks/useTransactions';
import SearchInput from '../components/common/SearchInput';
import SaveButton from '../components/common/SaveButton';
import DeleteButton from '../components/common/DeleteButton';

const TransactionsList = () => {
	const {
		data,
		meta,
		isLoading,
		isError,
		error,
		params,
		setPage,
		setLimit,
		fetchTransactionsById,
		createTransactionsAsync,
		updateTransactionsAsync,
		deleteTransactionsAsync,
		isCreating,
		isUpdating,
		isDeleting,
	} = useTransactions({ initialParams: { limit: 5, page: 1 } });

	const initialFormData = {
		transaction_id: '0',
		order_id: '0',
		method_id: '0',
		amount: '0',
		transaction_status: '',
		transaction_date: '',
		transaction_code: '',
	};
	const [formData, setFormData] = useState(initialFormData);
	const [editId, setEditId] = useState(null);
	const [searchTerm, setSearchTerm] = useState('');

	const { data: transactionsById, isLoading: isLoadingById } = useQuery({
		queryKey: ['transactions', editId],
		queryFn: () => fetchTransactionsById(editId),
		enabled: !!editId,
		staleTime: 5 * 60 * 1000,
		retry: 1,
	});

	const handleEdit = (id) => {
		setEditId(id);
	};

	if (transactionsById && !isLoadingById && editId) {
		setFormData(transactionsById);
	}

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData(prev => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			if (editId) {
				await updateTransactionsAsync({ id: editId, transactions: formData });
				setEditId(null);
			} else {
				await createTransactionsAsync(formData);
			}
			setFormData(initialFormData);
		} catch (error) {
			console.error('Form submission error:', error);
		}
	};

	const filteredData = (data || []).filter(item =>
		Object.values(item).some(value => value && value.toString().toLowerCase().includes(searchTerm.toLowerCase()))
	);

	if (isLoading) return <div>Loading...</div>;
	if (isError) return <div>Error: {error?.message || 'An error occurred'}</div>;

	return (
		<div>
			<h1>Transactions List</h1>
			<SearchInput
				placeholder="Search transactions..."
				value={searchTerm}
				onChange={(e) => setSearchTerm(e.target.value)}
			/>
			<form onSubmit={handleSubmit}>
				<input
					type="number"
					name="order_id"
					value={formData.order_id}
					placeholder="Order_id"
					onChange={handleInputChange}
				/>
				<input
					type="number"
					name="method_id"
					value={formData.method_id}
					placeholder="Method_id"
					onChange={handleInputChange}
				/>
				<input
					type="number"
					name="amount"
					value={formData.amount}
					placeholder="Amount"
					onChange={handleInputChange}
				/>
				<select
					name="transaction_status"
					value={formData.transaction_status}
					onChange={handleInputChange}
				>
					<option value="pending">pending</option>
					<option value="success">success</option>
					<option value="failed">failed</option>
				</select>
				<input
					type="datetime-local"
					name="transaction_date"
					value={formData.transaction_date}
					placeholder="Transaction_date"
					onChange={handleInputChange}
				/>
				<input
					type="text"
					name="transaction_code"
					value={formData.transaction_code}
					placeholder="Transaction_code"
					onChange={handleInputChange}
				/>
				<SaveButton
					isLoading={isCreating || isUpdating}
					isEdit={!!editId}
				/>
			</form>
			<ul>
				{filteredData.map(item => (
					<li key={item.transaction_id}>
						{Object.values(item).join(' - ')}
						<SaveButton
							isEdit={true}
							onClick={() => handleEdit(item.transaction_id)}
							disabled={isCreating || isUpdating || isDeleting}
						/>
						<DeleteButton
							onClick={() => deleteTransactionsAsync(item.transaction_id)}
							isLoading={isDeleting}
							disabled={isCreating || isUpdating || isDeleting}
						/>
					</li>
				))}
			</ul>
			<div>
				<button
					onClick={() => setPage(params.page - 1)}
					disabled={params.page === 1}
				>Previous</button>
				<button onClick={() => setPage(params.page + 1)}>Next</button>
				<select
					value={params.limit}
					onChange={(e) => setLimit(Number(e.target.value))}
				>
					<option value={5}>5</option>
					<option value={10}>10</option>
					<option value={20}>20</option>
				</select>
				<p>Total: {meta.total || 'N/A'}</p>
			</div>
		</div>
	);
};

export default TransactionsList;
