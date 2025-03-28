import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useBrands } from '../hooks/useBrands';
import SearchInput from '../components/common/SearchInput';
import SaveButton from '../components/common/SaveButton';
import DeleteButton from '../components/common/DeleteButton';

const BrandsList = () => {
	const {
		data,
		meta,
		isLoading,
		isError,
		error,
		params,
		setPage,
		setLimit,
		fetchBrandsById,
		createBrandsAsync,
		updateBrandsAsync,
		deleteBrandsAsync,
		isCreating,
		isUpdating,
		isDeleting,
	} = useBrands({ initialParams: { limit: 5, page: 1 } });

	const initialFormData = {
		brand_id: '0',
		brand_name: '',
		created_at: '',
	};
	const [formData, setFormData] = useState(initialFormData);
	const [editId, setEditId] = useState(null);
	const [searchTerm, setSearchTerm] = useState('');

	const { data: brandsById, isLoading: isLoadingById } = useQuery({
		queryKey: ['brands', editId],
		queryFn: () => fetchBrandsById(editId),
		enabled: !!editId,
		staleTime: 5 * 60 * 1000,
		retry: 1,
	});

	const handleEdit = (id) => {
		setEditId(id);
	};

	if (brandsById && !isLoadingById && editId) {
		setFormData(brandsById);
	}

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData(prev => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			if (editId) {
				await updateBrandsAsync({ id: editId, brands: formData });
				setEditId(null);
			} else {
				await createBrandsAsync(formData);
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
			<h1>Brands List</h1>
			<SearchInput
				placeholder="Search brands..."
				value={searchTerm}
				onChange={(e) => setSearchTerm(e.target.value)}
			/>
			<form onSubmit={handleSubmit}>
				<input
					type="text"
					name="brand_name"
					value={formData.brand_name}
					placeholder="Brand_name"
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
					<li key={item.brand_id}>
						{Object.values(item).join(' - ')}
						<SaveButton
							isEdit={true}
							onClick={() => handleEdit(item.brand_id)}
							disabled={isCreating || isUpdating || isDeleting}
						/>
						<DeleteButton
							onClick={() => deleteBrandsAsync(item.brand_id)}
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

export default BrandsList;
