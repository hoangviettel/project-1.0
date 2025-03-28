import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAudit_logs } from '../hooks/useAudit_logs';
import SearchInput from '../components/common/SearchInput';
import SaveButton from '../components/common/SaveButton';
import DeleteButton from '../components/common/DeleteButton';

const Audit_logsList = () => {
	const {
		data,
		meta,
		isLoading,
		isError,
		error,
		params,
		setPage,
		setLimit,
		fetchAudit_logsById,
		createAudit_logsAsync,
		updateAudit_logsAsync,
		deleteAudit_logsAsync,
		isCreating,
		isUpdating,
		isDeleting,
	} = useAudit_logs({ initialParams: { limit: 5, page: 1 } });

	const initialFormData = {
		log_id: '0',
		table_name: '',
		action: '',
		record_id: '0',
		staff_id: '0',
		details: '',
		created_at: '',
	};
	const [formData, setFormData] = useState(initialFormData);
	const [editId, setEditId] = useState(null);
	const [searchTerm, setSearchTerm] = useState('');

	const { data: audit_logsById, isLoading: isLoadingById } = useQuery({
		queryKey: ['audit_logs', editId],
		queryFn: () => fetchAudit_logsById(editId),
		enabled: !!editId,
		staleTime: 5 * 60 * 1000,
		retry: 1,
	});

	const handleEdit = (id) => {
		setEditId(id);
	};

	if (audit_logsById && !isLoadingById && editId) {
		setFormData(audit_logsById);
	}

	const handleInputChange = (e) => {
		const { name, value } = e.target;
		setFormData(prev => ({ ...prev, [name]: value }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			if (editId) {
				await updateAudit_logsAsync({ id: editId, audit_logs: formData });
				setEditId(null);
			} else {
				await createAudit_logsAsync(formData);
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
			<h1>Audit_logs List</h1>
			<SearchInput
				placeholder="Search audit_logs..."
				value={searchTerm}
				onChange={(e) => setSearchTerm(e.target.value)}
			/>
			<form onSubmit={handleSubmit}>
				<input
					type="text"
					name="table_name"
					value={formData.table_name}
					placeholder="Table_name"
					onChange={handleInputChange}
				/>
				<select
					name="action"
					value={formData.action}
					onChange={handleInputChange}
				>
					<option value="insert">insert</option>
					<option value="update">update</option>
					<option value="delete">delete</option>
				</select>
				<input
					type="number"
					name="record_id"
					value={formData.record_id}
					placeholder="Record_id"
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
					type="text"
					name="details"
					value={formData.details}
					placeholder="Details"
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
					<li key={item.log_id}>
						{Object.values(item).join(' - ')}
						<SaveButton
							isEdit={true}
							onClick={() => handleEdit(item.log_id)}
							disabled={isCreating || isUpdating || isDeleting}
						/>
						<DeleteButton
							onClick={() => deleteAudit_logsAsync(item.log_id)}
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

export default Audit_logsList;
