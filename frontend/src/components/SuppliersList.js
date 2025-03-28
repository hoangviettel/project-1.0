import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSuppliers } from '../hooks/useSuppliers';
import SearchInput from '../components/common/SearchInput';
import SaveButton from '../components/common/SaveButton';
import DeleteButton from '../components/common/DeleteButton';

const SuppliersList = () => {
	const {
		data,
		meta,
		isLoading,
		isError,
		error,
		params,
		setPage,
		setLimit,
		fetchSuppliersById,
		createSuppliersAsync,
		updateSuppliersAsync,
		deleteSuppliersAsync,
		isCreating,
		isUpdating,
		isDeleting,
	} = useSuppliers({ initialParams: { limit: 5, page: 1 } });

	const initialFormData = {
		supplier_id: '0',
		supplier_name: '',
		contact_name: '',
		phone: '',
		email: '',
		address: '',
		created_at: '',
	};
	const [formData, setFormData] = useState(initialFormData);
	const [editId, setEditId] = useState(null);
	const [searchTerm, setSearchTerm] = useState('');

	const { data: suppliersById, isLoading: isLoadingById } = useQuery({
		queryKey: ['suppliers', editId],
		queryFn: () => fetchSuppliersById(editId),
		enabled: !!editId,
		staleTime: 5 * 60 * 1000,
		retry: 1,
	});

	const handleEdit = (id) => {
		setEditId(id);
	};

	if (suppliersById && !isLoadingById && editId) {
		setFormData(suppliersById);
	}

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData(prev => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			if (editId) {
				await updateSuppliersAsync({ id: editId, suppliers: formData });
				setEditId(null);
			} else {
				await createSuppliersAsync(formData);
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
			<h1>Suppliers List</h1>
			<SearchInput
				placeholder="Search suppliers..."
				value={searchTerm}
				onChange={(e) => setSearchTerm(e.target.value)}
			/>
			<form onSubmit={handleSubmit}>
				<input
					type="text"
					name="supplier_name"
					value={formData.supplier_name}
					placeholder="Supplier_name"
					onChange={handleInputChange}
				/>
				<input
					type="text"
					name="contact_name"
					value={formData.contact_name}
					placeholder="Contact_name"
					onChange={handleInputChange}
				/>
				<input
					type="text"
					name="phone"
					value={formData.phone}
					placeholder="Phone"
					onChange={handleInputChange}
				/>
				<input
					type="text"
					name="email"
					value={formData.email}
					placeholder="Email"
					onChange={handleInputChange}
				/>
				<input
					type="text"
					name="address"
					value={formData.address}
					placeholder="Address"
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
					<li key={item.supplier_id}>
						{Object.values(item).join(' - ')}
						<SaveButton
							isEdit={true}
							onClick={() => handleEdit(item.supplier_id)}
							disabled={isCreating || isUpdating || isDeleting}
						/>
						<DeleteButton
							onClick={() => deleteSuppliersAsync(item.supplier_id)}
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

export default SuppliersList;
