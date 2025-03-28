import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useImport_invoices } from '../hooks/useImport_invoices';
import SearchInput from '../components/common/SearchInput';
import SaveButton from '../components/common/SaveButton';
import DeleteButton from '../components/common/DeleteButton';

const Import_invoicesList = () => {
	const {
		data,
		meta,
		isLoading,
		isError,
		error,
		params,
		setPage,
		setLimit,
		fetchImport_invoicesById,
		createImport_invoicesAsync,
		updateImport_invoicesAsync,
		deleteImport_invoicesAsync,
		isCreating,
		isUpdating,
		isDeleting,
	} = useImport_invoices({ initialParams: { limit: 5, page: 1 } });

	const initialFormData = {
		invoice_id: '0',
		supplier_id: '0',
		staff_id: '0',
		total_amount: '0',
		invoice_date: '',
		warehouse_id: '0',
		created_at: '',
	};
	const [formData, setFormData] = useState(initialFormData);
	const [editId, setEditId] = useState(null);
	const [searchTerm, setSearchTerm] = useState('');

	const { data: import_invoicesById, isLoading: isLoadingById } = useQuery({
		queryKey: ['import_invoices', editId],
		queryFn: () => fetchImport_invoicesById(editId),
		enabled: !!editId,
		staleTime: 5 * 60 * 1000,
		retry: 1,
	});

	const handleEdit = (id) => {
		setEditId(id);
	};

	if (import_invoicesById && !isLoadingById && editId) {
		setFormData(import_invoicesById);
	}

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData(prev => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			if (editId) {
				await updateImport_invoicesAsync({ id: editId, import_invoices: formData });
				setEditId(null);
			} else {
				await createImport_invoicesAsync(formData);
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
			<h1>Import_invoices List</h1>
			<SearchInput
				placeholder="Search import_invoices..."
				value={searchTerm}
				onChange={(e) => setSearchTerm(e.target.value)}
			/>
			<form onSubmit={handleSubmit}>
				<input
					type="number"
					name="supplier_id"
					value={formData.supplier_id}
					placeholder="Supplier_id"
					onChange={handleInputChange}
				/>
				<input
					type="number"
					name="staff_id"
					value={formData.staff_id}
					placeholder="Staff_id"
					onChange={handleInputChange}
				/>
				<input
					type="number"
					name="total_amount"
					value={formData.total_amount}
					placeholder="Total_amount"
					onChange={handleInputChange}
				/>
				<input
					type="datetime-local"
					name="invoice_date"
					value={formData.invoice_date}
					placeholder="Invoice_date"
					onChange={handleInputChange}
				/>
				<input
					type="number"
					name="warehouse_id"
					value={formData.warehouse_id}
					placeholder="Warehouse_id"
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
					<li key={item.invoice_id}>
						{Object.values(item).join(' - ')}
						<SaveButton
							isEdit={true}
							onClick={() => handleEdit(item.invoice_id)}
							disabled={isCreating || isUpdating || isDeleting}
						/>
						<DeleteButton
							onClick={() => deleteImport_invoicesAsync(item.invoice_id)}
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

export default Import_invoicesList;
