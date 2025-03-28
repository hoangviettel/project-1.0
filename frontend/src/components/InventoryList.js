import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useInventory } from '../hooks/useInventory';
import SearchInput from '../components/common/SearchInput';
import SaveButton from '../components/common/SaveButton';
import DeleteButton from '../components/common/DeleteButton';

const InventoryList = () => {
	const {
		data,
		meta,
		isLoading,
		isError,
		error,
		params,
		setPage,
		setLimit,
		fetchInventoryById,
		createInventoryAsync,
		updateInventoryAsync,
		deleteInventoryAsync,
		isCreating,
		isUpdating,
		isDeleting,
	} = useInventory({ initialParams: { limit: 5, page: 1 } });

	const initialFormData = {
		inventory_id: '0',
		product_id: '0',
		warehouse_id: '0',
		stock: '0',
		last_updated: '',
	};
	const [formData, setFormData] = useState(initialFormData);
	const [editId, setEditId] = useState(null);
	const [searchTerm, setSearchTerm] = useState('');

	const { data: inventoryById, isLoading: isLoadingById } = useQuery({
		queryKey: ['inventory', editId],
		queryFn: () => fetchInventoryById(editId),
		enabled: !!editId,
		staleTime: 5 * 60 * 1000,
		retry: 1,
	});

	const handleEdit = (id) => {
		setEditId(id);
	};

	if (inventoryById && !isLoadingById && editId) {
		setFormData(inventoryById);
	}

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData(prev => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			if (editId) {
				await updateInventoryAsync({ id: editId, inventory: formData });
				setEditId(null);
			} else {
				await createInventoryAsync(formData);
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
			<h1>Inventory List</h1>
			<SearchInput
				placeholder="Search inventory..."
				value={searchTerm}
				onChange={(e) => setSearchTerm(e.target.value)}
			/>
			<form onSubmit={handleSubmit}>
				<input
					type="number"
					name="product_id"
					value={formData.product_id}
					placeholder="Product_id"
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
					type="number"
					name="stock"
					value={formData.stock}
					placeholder="Stock"
					onChange={handleInputChange}
				/>
				<input
					type="datetime-local"
					name="last_updated"
					value={formData.last_updated}
					placeholder="Last_updated"
					onChange={handleInputChange}
				/>
				<SaveButton
					isLoading={isCreating || isUpdating}
					isEdit={!!editId}
				/>
			</form>
			<ul>
				{filteredData.map(item => (
					<li key={item.inventory_id}>
						{Object.values(item).join(' - ')}
						<SaveButton
							isEdit={true}
							onClick={() => handleEdit(item.inventory_id)}
							disabled={isCreating || isUpdating || isDeleting}
						/>
						<DeleteButton
							onClick={() => deleteInventoryAsync(item.inventory_id)}
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

export default InventoryList;
