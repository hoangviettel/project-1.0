import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { usePromotions } from '../hooks/usePromotions';
import SearchInput from '../components/common/SearchInput';
import SaveButton from '../components/common/SaveButton';
import DeleteButton from '../components/common/DeleteButton';

const PromotionsList = () => {
	const {
		data,
		meta,
		isLoading,
		isError,
		error,
		params,
		setPage,
		setLimit,
		fetchPromotionsById,
		createPromotionsAsync,
		updatePromotionsAsync,
		deletePromotionsAsync,
		isCreating,
		isUpdating,
		isDeleting,
	} = usePromotions({ initialParams: { limit: 5, page: 1 } });

	const initialFormData = {
		promotion_id: '0',
		promotion_code: '',
		description: '',
		discount_type: '',
		discount_value: '0',
		min_order_value: '0',
		start_date: '',
		end_date: '',
		is_active: '0',
		created_at: '',
		updated_at: '',
	};
	const [formData, setFormData] = useState(initialFormData);
	const [editId, setEditId] = useState(null);
	const [searchTerm, setSearchTerm] = useState('');

	const { data: promotionsById, isLoading: isLoadingById } = useQuery({
		queryKey: ['promotions', editId],
		queryFn: () => fetchPromotionsById(editId),
		enabled: !!editId,
		staleTime: 5 * 60 * 1000,
		retry: 1,
	});

	const handleEdit = (id) => {
		setEditId(id);
	};

	if (promotionsById && !isLoadingById && editId) {
		setFormData(promotionsById);
	}

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData(prev => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			if (editId) {
				await updatePromotionsAsync({ id: editId, promotions: formData });
				setEditId(null);
			} else {
				await createPromotionsAsync(formData);
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
			<h1>Promotions List</h1>
			<SearchInput
				placeholder="Search promotions..."
				value={searchTerm}
				onChange={(e) => setSearchTerm(e.target.value)}
			/>
			<form onSubmit={handleSubmit}>
				<input
					type="text"
					name="promotion_code"
					value={formData.promotion_code}
					placeholder="Promotion_code"
					onChange={handleInputChange}
				/>
				<input
					type="text"
					name="description"
					value={formData.description}
					placeholder="Description"
					onChange={handleInputChange}
				/>
				<select
					name="discount_type"
					value={formData.discount_type}
					onChange={handleInputChange}
				>
					<option value="percentage">percentage</option>
					<option value="fixed">fixed</option>
				</select>
				<input
					type="number"
					name="discount_value"
					value={formData.discount_value}
					placeholder="Discount_value"
					onChange={handleInputChange}
				/>
				<input
					type="number"
					name="min_order_value"
					value={formData.min_order_value}
					placeholder="Min_order_value"
					onChange={handleInputChange}
				/>
				<input
					type="datetime-local"
					name="start_date"
					value={formData.start_date}
					placeholder="Start_date"
					onChange={handleInputChange}
				/>
				<input
					type="datetime-local"
					name="end_date"
					value={formData.end_date}
					placeholder="End_date"
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
					<li key={item.promotion_id}>
						{Object.values(item).join(' - ')}
						<SaveButton
							isEdit={true}
							onClick={() => handleEdit(item.promotion_id)}
							disabled={isCreating || isUpdating || isDeleting}
						/>
						<DeleteButton
							onClick={() => deletePromotionsAsync(item.promotion_id)}
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

export default PromotionsList;
