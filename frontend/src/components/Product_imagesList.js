import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useProduct_images } from '../hooks/useProduct_images';
import SearchInput from '../components/common/SearchInput';
import SaveButton from '../components/common/SaveButton';
import DeleteButton from '../components/common/DeleteButton';

const Product_imagesList = () => {
	const {
		data,
		meta,
		isLoading,
		isError,
		error,
		params,
		setPage,
		setLimit,
		fetchProduct_imagesById,
		createProduct_imagesAsync,
		updateProduct_imagesAsync,
		deleteProduct_imagesAsync,
		isCreating,
		isUpdating,
		isDeleting,
	} = useProduct_images({ initialParams: { limit: 5, page: 1 } });

	const initialFormData = {
		image_id: '0',
		product_id: '0',
		image_url: '',
		is_primary: '0',
		created_at: '',
	};
	const [formData, setFormData] = useState(initialFormData);
	const [editId, setEditId] = useState(null);
	const [searchTerm, setSearchTerm] = useState('');

	const { data: product_imagesById, isLoading: isLoadingById } = useQuery({
		queryKey: ['product_images', editId],
		queryFn: () => fetchProduct_imagesById(editId),
		enabled: !!editId,
		staleTime: 5 * 60 * 1000,
		retry: 1,
	});

	const handleEdit = (id) => {
		setEditId(id);
	};

	if (product_imagesById && !isLoadingById && editId) {
		setFormData(product_imagesById);
	}

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData(prev => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			if (editId) {
				await updateProduct_imagesAsync({ id: editId, product_images: formData });
				setEditId(null);
			} else {
				await createProduct_imagesAsync(formData);
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
			<h1>Product_images List</h1>
			<SearchInput
				placeholder="Search product_images..."
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
					type="text"
					name="image_url"
					value={formData.image_url}
					placeholder="Image_url"
					onChange={handleInputChange}
				/>
				<input
					type="number"
					name="is_primary"
					value={formData.is_primary}
					placeholder="Is_primary"
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
					<li key={item.image_id}>
						{Object.values(item).join(' - ')}
						<SaveButton
							isEdit={true}
							onClick={() => handleEdit(item.image_id)}
							disabled={isCreating || isUpdating || isDeleting}
						/>
						<DeleteButton
							onClick={() => deleteProduct_imagesAsync(item.image_id)}
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

export default Product_imagesList;
