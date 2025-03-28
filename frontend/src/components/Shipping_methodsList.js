import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useShipping_methods } from '../hooks/useShipping_methods';
import SearchInput from '../components/common/SearchInput';
import SaveButton from '../components/common/SaveButton';
import DeleteButton from '../components/common/DeleteButton';

const Shipping_methodsList = () => {
	const {
		data,
		meta,
		isLoading,
		isError,
		error,
		params,
		setPage,
		setLimit,
		fetchShipping_methodsById,
		createShipping_methodsAsync,
		updateShipping_methodsAsync,
		deleteShipping_methodsAsync,
		isCreating,
		isUpdating,
		isDeleting,
	} = useShipping_methods({ initialParams: { limit: 5, page: 1 } });

	const initialFormData = {
		shipping_method_id: '0',
		method_name: '',
		cost: '0',
		estimated_delivery_time: '0',
		is_active: '0',
		created_at: '',
	};
	const [formData, setFormData] = useState(initialFormData);
	const [editId, setEditId] = useState(null);
	const [searchTerm, setSearchTerm] = useState('');

	const { data: shipping_methodsById, isLoading: isLoadingById } = useQuery({
		queryKey: ['shipping_methods', editId],
		queryFn: () => fetchShipping_methodsById(editId),
		enabled: !!editId,
		staleTime: 5 * 60 * 1000,
		retry: 1,
	});

	const handleEdit = (id) => {
		setEditId(id);
	};

	if (shipping_methodsById && !isLoadingById && editId) {
		setFormData(shipping_methodsById);
	}

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData(prev => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			if (editId) {
				await updateShipping_methodsAsync({ id: editId, shipping_methods: formData });
				setEditId(null);
			} else {
				await createShipping_methodsAsync(formData);
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
			<h1>Shipping_methods List</h1>
			<SearchInput
				placeholder="Search shipping_methods..."
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
					type="number"
					name="cost"
					value={formData.cost}
					placeholder="Cost"
					onChange={handleInputChange}
				/>
				<input
					type="number"
					name="estimated_delivery_time"
					value={formData.estimated_delivery_time}
					placeholder="Estimated_delivery_time"
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
					<li key={item.shipping_method_id}>
						{Object.values(item).join(' - ')}
						<SaveButton
							isEdit={true}
							onClick={() => handleEdit(item.shipping_method_id)}
							disabled={isCreating || isUpdating || isDeleting}
						/>
						<DeleteButton
							onClick={() => deleteShipping_methodsAsync(item.shipping_method_id)}
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

export default Shipping_methodsList;
