import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useOrder_promotions } from '../hooks/useOrder_promotions';
import SearchInput from '../components/common/SearchInput';
import SaveButton from '../components/common/SaveButton';
import DeleteButton from '../components/common/DeleteButton';

const Order_promotionsList = () => {
	const {
		data,
		meta,
		isLoading,
		isError,
		error,
		params,
		setPage,
		setLimit,
		fetchOrder_promotionsById,
		createOrder_promotionsAsync,
		updateOrder_promotionsAsync,
		deleteOrder_promotionsAsync,
		isCreating,
		isUpdating,
		isDeleting,
	} = useOrder_promotions({ initialParams: { limit: 5, page: 1 } });

	const initialFormData = {
		order_promotion_id: '0',
		order_id: '0',
		promotion_id: '0',
		applied_discount: '0',
	};
	const [formData, setFormData] = useState(initialFormData);
	const [editId, setEditId] = useState(null);
	const [searchTerm, setSearchTerm] = useState('');

	const { data: order_promotionsById, isLoading: isLoadingById } = useQuery({
		queryKey: ['order_promotions', editId],
		queryFn: () => fetchOrder_promotionsById(editId),
		enabled: !!editId,
		staleTime: 5 * 60 * 1000,
		retry: 1,
	});

	const handleEdit = (id) => {
		setEditId(id);
	};

	if (order_promotionsById && !isLoadingById && editId) {
		setFormData(order_promotionsById);
	}

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData(prev => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			if (editId) {
				await updateOrder_promotionsAsync({ id: editId, order_promotions: formData });
				setEditId(null);
			} else {
				await createOrder_promotionsAsync(formData);
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
			<h1>Order_promotions List</h1>
			<SearchInput
				placeholder="Search order_promotions..."
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
					name="promotion_id"
					value={formData.promotion_id}
					placeholder="Promotion_id"
					onChange={handleInputChange}
				/>
				<input
					type="number"
					name="applied_discount"
					value={formData.applied_discount}
					placeholder="Applied_discount"
					onChange={handleInputChange}
				/>
				<SaveButton
					isLoading={isCreating || isUpdating}
					isEdit={!!editId}
				/>
			</form>
			<ul>
				{filteredData.map(item => (
					<li key={item.order_promotion_id}>
						{Object.values(item).join(' - ')}
						<SaveButton
							isEdit={true}
							onClick={() => handleEdit(item.order_promotion_id)}
							disabled={isCreating || isUpdating || isDeleting}
						/>
						<DeleteButton
							onClick={() => deleteOrder_promotionsAsync(item.order_promotion_id)}
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

export default Order_promotionsList;
