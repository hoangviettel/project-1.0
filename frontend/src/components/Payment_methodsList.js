import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { usePayment_methods } from '../hooks/usePayment_methods';
import SearchInput from '../components/common/SearchInput';
import SaveButton from '../components/common/SaveButton';
import DeleteButton from '../components/common/DeleteButton';

const Payment_methodsList = () => {
	const {
		data,
		meta,
		isLoading,
		isError,
		error,
		params,
		setPage,
		setLimit,
		fetchPayment_methodsById,
		createPayment_methodsAsync,
		updatePayment_methodsAsync,
		deletePayment_methodsAsync,
		isCreating,
		isUpdating,
		isDeleting,
	} = usePayment_methods({ initialParams: { limit: 5, page: 1 } });

	const initialFormData = {
		method_id: '0',
		method_name: '',
		description: '',
		is_active: '0',
		created_at: '',
	};
	const [formData, setFormData] = useState(initialFormData);
	const [editId, setEditId] = useState(null);
	const [searchTerm, setSearchTerm] = useState('');

	const { data: payment_methodsById, isLoading: isLoadingById } = useQuery({
		queryKey: ['payment_methods', editId],
		queryFn: () => fetchPayment_methodsById(editId),
		enabled: !!editId,
		staleTime: 5 * 60 * 1000,
		retry: 1,
	});

	const handleEdit = (id) => {
		setEditId(id);
	};

	if (payment_methodsById && !isLoadingById && editId) {
		setFormData(payment_methodsById);
	}

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData(prev => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			if (editId) {
				await updatePayment_methodsAsync({ id: editId, payment_methods: formData });
				setEditId(null);
			} else {
				await createPayment_methodsAsync(formData);
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
			<h1>Payment_methods List</h1>
			<SearchInput
				placeholder="Search payment_methods..."
				value={searchTerm}
				onChange={(e) => setSearchTerm(e.target.value)}
			/>
			<form onSubmit={handleSubmit}>
				<input
					type="text"
					name="method_name"
					value={formData.method_name}
					placeholder="Method_name"
					onChange={handleInputChange}
				/>
				<input
					type="text"
					name="description"
					value={formData.description}
					placeholder="Description"
					onChange={handleInputChange}
				/>
				<input
					type="number"
					name="is_active"
					value={formData.is_active}
					placeholder="Is_active"
					onChange={handleInputChange}
				/>
				<input
					type="datetime-local"
					name="created_at"
					value={formData.created_at}
					placeholder="Created_at"
					onChange={handleInputChange}
				/>
				<SaveButton
					isLoading={isCreating || isUpdating}
					isEdit={!!editId}
				/>
			</form>
			<ul>
				{filteredData.map(item => (
					<li key={item.method_id}>
						{Object.values(item).join(' - ')}
						<SaveButton
							isEdit={true}
							onClick={() => handleEdit(item.method_id)}
							disabled={isCreating || isUpdating || isDeleting}
						/>
						<DeleteButton
							onClick={() => deletePayment_methodsAsync(item.method_id)}
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

export default Payment_methodsList;
