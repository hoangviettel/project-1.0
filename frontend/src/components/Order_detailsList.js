import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useOrder_details } from '../hooks/useOrder_details';
import SearchInput from '../components/common/SearchInput';
import SaveButton from '../components/common/SaveButton';
import DeleteButton from '../components/common/DeleteButton';

const Order_detailsList = () => {
	const {
		data,
		meta,
		isLoading,
		isError,
		error,
		params,
		setPage,
		setLimit,
		fetchOrder_detailsById,
		createOrder_detailsAsync,
		updateOrder_detailsAsync,
		deleteOrder_detailsAsync,
		isCreating,
		isUpdating,
		isDeleting,
	} = useOrder_details({ initialParams: { limit: 5, page: 1 } });

	const initialFormData = {
		detail_id: '0',
		order_id: '0',
		product_id: '0',
		quantity: '0',
		price: '0',
		warehouse_id: '0',
	};
	const [formData, setFormData] = useState(initialFormData);
	const [editId, setEditId] = useState(null);
	const [searchTerm, setSearchTerm] = useState('');

	const { data: order_detailsById, isLoading: isLoadingById } = useQuery({
		queryKey: ['order_details', editId],
		queryFn: () => fetchOrder_detailsById(editId),
		enabled: !!editId,
		staleTime: 5 * 60 * 1000,
		retry: 1,
	});

	const handleEdit = (id) => {
		setEditId(id);
	};

	if (order_detailsById && !isLoadingById && editId) {
		setFormData(order_detailsById);
	}

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData(prev => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			if (editId) {
				await updateOrder_detailsAsync({ id: editId, order_details: formData });
				setEditId(null);
			} else {
				await createOrder_detailsAsync(formData);
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
			<h1>Order_details List</h1>
			<SearchInput
				placeholder="Search order_details..."
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
				<input
					type="number"
					name="warehouse_id"
					value={formData.warehouse_id}
					placeholder="Warehouse_id"
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
							onClick={() => deleteOrder_detailsAsync(item.detail_id)}
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

export default Order_detailsList;
