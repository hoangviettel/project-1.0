import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useImport_invoice_details } from '../hooks/useImport_invoice_details';
import SearchInput from '../components/common/SearchInput';
import SaveButton from '../components/common/SaveButton';
import DeleteButton from '../components/common/DeleteButton';

const Import_invoice_detailsList = () => {
	const {
		data,
		meta,
		isLoading,
		isError,
		error,
		params,
		setPage,
		setLimit,
		fetchImport_invoice_detailsById,
		createImport_invoice_detailsAsync,
		updateImport_invoice_detailsAsync,
		deleteImport_invoice_detailsAsync,
		isCreating,
		isUpdating,
		isDeleting,
	} = useImport_invoice_details({ initialParams: { limit: 5, page: 1 } });

	const initialFormData = {
		detail_id: '0',
		invoice_id: '0',
		product_id: '0',
		quantity: '0',
		price: '0',
	};
	const [formData, setFormData] = useState(initialFormData);
	const [editId, setEditId] = useState(null);
	const [searchTerm, setSearchTerm] = useState('');

	const { data: import_invoice_detailsById, isLoading: isLoadingById } = useQuery({
		queryKey: ['import_invoice_details', editId],
		queryFn: () => fetchImport_invoice_detailsById(editId),
		enabled: !!editId,
		staleTime: 5 * 60 * 1000,
		retry: 1,
	});

	const handleEdit = (id) => {
		setEditId(id);
	};

	if (import_invoice_detailsById && !isLoadingById && editId) {
		setFormData(import_invoice_detailsById);
	}

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData(prev => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			if (editId) {
				await updateImport_invoice_detailsAsync({ id: editId, import_invoice_details: formData });
				setEditId(null);
			} else {
				await createImport_invoice_detailsAsync(formData);
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
			<h1>Import_invoice_details List</h1>
			<SearchInput
				placeholder="Search import_invoice_details..."
				value={searchTerm}
				onChange={(e) => setSearchTerm(e.target.value)}
			/>
			<form onSubmit={handleSubmit}>
				<input
					type="number"
					name="invoice_id"
					value={formData.invoice_id}
					placeholder="Invoice_id"
					onChange={handleInputChange}
				/>
				<input
					type="number"
					name="product_id"
					value={formData.product_id}
					placeholder="Product_id"
					onChange={handleInputChange}
				/>
				<input
					type="number"
					name="quantity"
					value={formData.quantity}
					placeholder="Quantity"
					onChange={handleInputChange}
				/>
				<input
					type="number"
					name="price"
					value={formData.price}
					placeholder="Price"
					onChange={handleInputChange}
				/>
				<SaveButton
					isLoading={isCreating || isUpdating}
					isEdit={!!editId}
				/>
			</form>
			<ul>
				{filteredData.map(item => (
					<li key={item.detail_id}>
						{Object.values(item).join(' - ')}
						<SaveButton
							isEdit={true}
							onClick={() => handleEdit(item.detail_id)}
							disabled={isCreating || isUpdating || isDeleting}
						/>
						<DeleteButton
							onClick={() => deleteImport_invoice_detailsAsync(item.detail_id)}
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

export default Import_invoice_detailsList;
