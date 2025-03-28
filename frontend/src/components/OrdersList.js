import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useOrders } from '../hooks/useOrders';
import SearchInput from '../components/common/SearchInput';
import SaveButton from '../components/common/SaveButton';
import DeleteButton from '../components/common/DeleteButton';

const OrdersList = () => {
	const {
		data,
		meta,
		isLoading,
		isError,
		error,
		params,
		setPage,
		setLimit,
		fetchOrdersById,
		createOrdersAsync,
		updateOrdersAsync,
		deleteOrdersAsync,
		isCreating,
		isUpdating,
		isDeleting,
	} = useOrders({ initialParams: { limit: 5, page: 1 } });

	const initialFormData = {
		order_id: '0',
		customer_id: '0',
		staff_id: '0',
		total_amount: '0',
		order_status: '',
		shipping_method_id: '0',
		shipping_address: '',
		method_id: '0',
		payment_status: '',
		created_at: '',
		updated_at: '',
	};
	const [formData, setFormData] = useState(initialFormData);
	const [editId, setEditId] = useState(null);
	const [searchTerm, setSearchTerm] = useState('');

	const { data: ordersById, isLoading: isLoadingById } = useQuery({
		queryKey: ['orders', editId],
		queryFn: () => fetchOrdersById(editId),
		enabled: !!editId,
		staleTime: 5 * 60 * 1000,
		retry: 1,
	});

	const handleEdit = (id) => {
		setEditId(id);
	};

	if (ordersById && !isLoadingById && editId) {
		setFormData(ordersById);
	}

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData(prev => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			if (editId) {
				await updateOrdersAsync({ id: editId, orders: formData });
				setEditId(null);
			} else {
				await createOrdersAsync(formData);
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
			<h1>Orders List</h1>
			<SearchInput
				placeholder="Search orders..."
				value={searchTerm}
				onChange={(e) => setSearchTerm(e.target.value)}
			/>
			<form onSubmit={handleSubmit}>
				<input
					type="number"
					name="customer_id"
					value={formData.customer_id}
					placeholder="Customer_id"
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
				<select
					name="order_status"
					value={formData.order_status}
					onChange={handleInputChange}
				>
					<option value="pending">pending</option>
					<option value="processing">processing</option>
					<option value="shipped">shipped</option>
					<option value="delivered">delivered</option>
					<option value="cancelled">cancelled</option>
				</select>
				<input
					type="number"
					name="shipping_method_id"
					value={formData.shipping_method_id}
					placeholder="Shipping_method_id"
					onChange={handleInputChange}
				/>
				<input
					type="text"
					name="shipping_address"
					value={formData.shipping_address}
					placeholder="Shipping_address"
					onChange={handleInputChange}
				/>
				<input
					type="number"
					name="method_id"
					value={formData.method_id}
					placeholder="Method_id"
					onChange={handleInputChange}
				/>
				<select
					name="payment_status"
					value={formData.payment_status}
					onChange={handleInputChange}
				>
					<option value="unpaid">unpaid</option>
					<option value="paid">paid</option>
					<option value="failed">failed</option>
				</select>
				<input
					type="datetime-local"
					name="created_at"
					value={formData.created_at}
					placeholder="Created_at"
					onChange={handleInputChange}
				/>
				<input
					type="datetime-local"
					name="updated_at"
					value={formData.updated_at}
					placeholder="Updated_at"
					onChange={handleInputChange}
				/>
				<SaveButton
					isLoading={isCreating || isUpdating}
					isEdit={!!editId}
				/>
			</form>
			<ul>
				{filteredData.map(item => (
					<li key={item.order_id}>
						{Object.values(item).join(' - ')}
						<SaveButton
							isEdit={true}
							onClick={() => handleEdit(item.order_id)}
							disabled={isCreating || isUpdating || isDeleting}
						/>
						<DeleteButton
							onClick={() => deleteOrdersAsync(item.order_id)}
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

export default OrdersList;
