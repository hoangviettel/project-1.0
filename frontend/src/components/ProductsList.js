import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useProducts } from '../hooks/useProducts';
import SearchInput from '../components/common/SearchInput';
import SaveButton from '../components/common/SaveButton';
import DeleteButton from '../components/common/DeleteButton';

const ProductsList = () => {
	const {
		data,
		meta,
		isLoading,
		isError,
		error,
		params,
		setPage,
		setLimit,
		fetchProductsById,
		createProductsAsync,
		updateProductsAsync,
		deleteProductsAsync,
		isCreating,
		isUpdating,
		isDeleting,
	} = useProducts({ initialParams: { limit: 5, page: 1 } });

	const initialFormData = {
		product_id: '0',
		product_name: '',
		brand_id: '0',
		category_id: '0',
		price: '0',
		discount_price: '0',
		description: '',
		specifications: '',
		created_at: '',
		updated_at: '',
	};
	const [formData, setFormData] = useState(initialFormData);
	const [editId, setEditId] = useState(null);
	const [searchTerm, setSearchTerm] = useState('');

	const { data: productsById, isLoading: isLoadingById } = useQuery({
		queryKey: ['products', editId],
		queryFn: () => fetchProductsById(editId),
		enabled: !!editId,
		staleTime: 5 * 60 * 1000,
		retry: 1,
	});

	const handleEdit = (id) => {
		setEditId(id);
	};

	if (productsById && !isLoadingById && editId) {
		setFormData(productsById);
	}

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData(prev => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			if (editId) {
				await updateProductsAsync({ id: editId, products: formData });
				setEditId(null);
			} else {
				await createProductsAsync(formData);
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
			<h1>Products List</h1>
			<SearchInput
				placeholder="Search products..."
				value={searchTerm}
				onChange={(e) => setSearchTerm(e.target.value)}
			/>
			<form onSubmit={handleSubmit}>
				<input
					type="text"
					name="product_name"
					value={formData.product_name}
					placeholder="Product_name"
					onChange={handleInputChange}
				/>
				<input
					type="number"
					name="brand_id"
					value={formData.brand_id}
					placeholder="Brand_id"
					onChange={handleInputChange}
				/>
				<input
					type="number"
					name="category_id"
					value={formData.category_id}
					placeholder="Category_id"
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
					name="discount_price"
					value={formData.discount_price}
					placeholder="Discount_price"
					onChange={handleInputChange}
				/>
				<input
					type="text"
					name="description"
					value={formData.description}
					placeholder="Description"
					onChange={handleInputChange}
				/>
				<input
					type="text"
					name="specifications"
					value={formData.specifications}
					placeholder="Specifications"
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
					<li key={item.product_id}>
						{Object.values(item).join(' - ')}
						<SaveButton
							isEdit={true}
							onClick={() => handleEdit(item.product_id)}
							disabled={isCreating || isUpdating || isDeleting}
						/>
						<DeleteButton
							onClick={() => deleteProductsAsync(item.product_id)}
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

export default ProductsList;
