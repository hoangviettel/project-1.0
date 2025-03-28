import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useCart_items } from '../hooks/useCart_items';
import SearchInput from '../components/common/SearchInput';
import SaveButton from '../components/common/SaveButton';
import DeleteButton from '../components/common/DeleteButton';

const Cart_itemsList = () => {
	const {
		data,
		meta,
		isLoading,
		isError,
		error,
		params,
		setPage,
		setLimit,
		fetchCart_itemsById,
		createCart_itemsAsync,
		updateCart_itemsAsync,
		deleteCart_itemsAsync,
		isCreating,
		isUpdating,
		isDeleting,
	} = useCart_items({ initialParams: { limit: 5, page: 1 } });

	const initialFormData = {
		cart_item_id: '0',
		cart_id: '0',
		product_id: '0',
		quantity: '0',
	};
	const [formData, setFormData] = useState(initialFormData);
	const [editId, setEditId] = useState(null);
	const [searchTerm, setSearchTerm] = useState('');

	const { data: cart_itemsById, isLoading: isLoadingById } = useQuery({
		queryKey: ['cart_items', editId],
		queryFn: () => fetchCart_itemsById(editId),
		enabled: !!editId,
		staleTime: 5 * 60 * 1000,
		retry: 1,
	});

	const handleEdit = (id) => {
		setEditId(id);
	};

	if (cart_itemsById && !isLoadingById && editId) {
		setFormData(cart_itemsById);
	}

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData(prev => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			if (editId) {
				await updateCart_itemsAsync({ id: editId, cart_items: formData });
				setEditId(null);
			} else {
				await createCart_itemsAsync(formData);
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
			<h1>Cart_items List</h1>
			<SearchInput
				placeholder="Search cart_items..."
				value={searchTerm}
				onChange={(e) => setSearchTerm(e.target.value)}
			/>
			<form onSubmit={handleSubmit}>
				<input
					type="number"
					name="cart_id"
					value={formData.cart_id}
					placeholder="Cart_id"
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
				<SaveButton
					isLoading={isCreating || isUpdating}
					isEdit={!!editId}
				/>
			</form>
			<ul>
				{filteredData.map(item => (
					<li key={item.cart_item_id}>
						{Object.values(item).join(' - ')}
						<SaveButton
							isEdit={true}
							onClick={() => handleEdit(item.cart_item_id)}
							disabled={isCreating || isUpdating || isDeleting}
						/>
						<DeleteButton
							onClick={() => deleteCart_itemsAsync(item.cart_item_id)}
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

export default Cart_itemsList;
