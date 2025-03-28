import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useUsers } from '../hooks/useUsers';
import SearchInput from '../components/common/SearchInput';
import SaveButton from '../components/common/SaveButton';
import DeleteButton from '../components/common/DeleteButton';

const UsersList = () => {
	const {
		data,
		meta,
		isLoading,
		isError,
		error,
		params,
		setPage,
		setLimit,
		fetchUsersById,
		createUsersAsync,
		updateUsersAsync,
		deleteUsersAsync,
		isCreating,
		isUpdating,
		isDeleting,
	} = useUsers({ initialParams: { limit: 5, page: 1 } });

	const initialFormData = {
		account_id: '0',
		username: '',
		email: '',
		password_hash: '',
		full_name: '',
		birth_date: '',
		gender: '',
		phone: '',
		address: '',
		role: '',
		created_at: '',
		updated_at: '',
	};
	const [formData, setFormData] = useState(initialFormData);
	const [editId, setEditId] = useState(null);
	const [searchTerm, setSearchTerm] = useState('');

	const { data: usersById, isLoading: isLoadingById } = useQuery({
		queryKey: ['users', editId],
		queryFn: () => fetchUsersById(editId),
		enabled: !!editId,
		staleTime: 5 * 60 * 1000,
		retry: 1,
	});

	const handleEdit = (id) => {
		setEditId(id);
	};

	if (usersById && !isLoadingById && editId) {
		setFormData(usersById);
	}

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData(prev => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			if (editId) {
				await updateUsersAsync({ id: editId, users: formData });
				setEditId(null);
			} else {
				await createUsersAsync(formData);
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
			<h1>Users List</h1>
			<SearchInput
				placeholder="Search users..."
				value={searchTerm}
				onChange={(e) => setSearchTerm(e.target.value)}
			/>
			<form onSubmit={handleSubmit}>
				<input
					type="text"
					name="username"
					value={formData.username}
					placeholder="Username"
					onChange={handleInputChange}
				/>
				<input
					type="text"
					name="email"
					value={formData.email}
					placeholder="Email"
					onChange={handleInputChange}
				/>
				<input
					type="text"
					name="password_hash"
					value={formData.password_hash}
					placeholder="Password_hash"
					onChange={handleInputChange}
				/>
				<input
					type="text"
					name="full_name"
					value={formData.full_name}
					placeholder="Full_name"
					onChange={handleInputChange}
				/>
				<input
					type="date"
					name="birth_date"
					value={formData.birth_date}
					placeholder="Birth_date"
					onChange={handleInputChange}
				/>
				<select
					name="gender"
					value={formData.gender}
					onChange={handleInputChange}
				>
					<option value="nam">nam</option>
					<option value="nữ">nữ</option>
				</select>
				<input
					type="text"
					name="phone"
					value={formData.phone}
					placeholder="Phone"
					onChange={handleInputChange}
				/>
				<input
					type="text"
					name="address"
					value={formData.address}
					placeholder="Address"
					onChange={handleInputChange}
				/>
				<select
					name="role"
					value={formData.role}
					onChange={handleInputChange}
				>
					<option value="admin">admin</option>
					<option value="staff">staff</option>
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
					<li key={item.account_id}>
						{Object.values(item).join(' - ')}
						<SaveButton
							isEdit={true}
							onClick={() => handleEdit(item.account_id)}
							disabled={isCreating || isUpdating || isDeleting}
						/>
						<DeleteButton
							onClick={() => deleteUsersAsync(item.account_id)}
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

export default UsersList;
