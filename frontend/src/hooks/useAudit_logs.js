import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchAllaudit_logs, createaudit_logs, updateaudit_logs, deleteaudit_logs } from '../api/audit_logs.api.js';

export const useAudit_logs = ({ initialParams = { limit: 10, page: 1 } }) => {
	const queryClient = useQueryClient();
	const [params, setParams] = useState(initialParams);
	const { limit, page } = params;

	const { data: audit_logs, isLoading, isError, error } = useQuery({
		queryKey: ['audit_logs', limit, page],
		queryFn: () => fetchAllaudit_logs({ limit, page }),
		staleTime: 5 * 60 * 1000,
		keepPreviousData: true,
		retry: 1,
	});

	const createMutation = useMutation({
		mutationFn: createaudit_logs,
		onMutate: async (newaudit_logs) => {
			await queryClient.cancelQueries(['audit_logs', limit, page]);
			const previousData = queryClient.getQueryData(['audit_logs', limit, page]);
			queryClient.setQueryData(['audit_logs', limit, page], (old) => {
				return { ...old, data: [...(old?.data || []), newaudit_logs] };
			});
			return { previousData };
		},
		onError: (err, newaudit_logs, context) => {
			queryClient.setQueryData(['audit_logs', limit, page], context.previousData);
		},
		onSettled: () => queryClient.invalidateQueries(['audit_logs', limit, page]),
	});

	const updateMutation = useMutation({
		mutationFn: ({ id, audit_logs }) => updateaudit_logs(id, audit_logs),
		onMutate: async ({ id, audit_logs }) => {
			await queryClient.cancelQueries(['audit_logs', limit, page]);
			const previousData = queryClient.getQueryData(['audit_logs', limit, page]);
			queryClient.setQueryData(['audit_logs', limit, page], (old) => {
				return { ...old, data: old.data.map(item => item.account_id === id ? { ...item, ...audit_logs } : item) };
			});
			return { previousData };
		},
		onError: (err, variables, context) => {
			queryClient.setQueryData(['audit_logs', limit, page], context.previousData);
		},
		onSettled: () => queryClient.invalidateQueries(['audit_logs', limit, page]),
	});

	const deleteMutation = useMutation({
		mutationFn: deleteaudit_logs,
		onMutate: async (id) => {
			await queryClient.cancelQueries(['audit_logs', limit, page]);
			const previousData = queryClient.getQueryData(['audit_logs', limit, page]);
			queryClient.setQueryData(['audit_logs', limit, page], (old) => {
				return { ...old, data: old.data.filter(item => item.account_id !== id) };
			});
			return { previousData };
		},
		onError: (err, id, context) => {
			queryClient.setQueryData(['audit_logs', limit, page], context.previousData);
		},
		onSettled: () => queryClient.invalidateQueries(['audit_logs', limit, page]),
	});

	const setPage = (newPage) => setParams(prev => ({ ...prev, page: newPage }));
	const setLimit = (newLimit) => setParams(prev => ({ ...prev, limit: newLimit, page: 1 }));

	return {
		data: audit_logs?.data || [],
		meta: audit_logs?.meta || {},
		isLoading,
		isError,
		error,
		params,
		setPage,
		setLimit,
		createAudit_logsAsync: createMutation.mutateAsync,
		updateAudit_logsAsync: updateMutation.mutateAsync,
		deleteAudit_logsAsync: deleteMutation.mutateAsync,
		isCreating: createMutation.isLoading,
		isUpdating: updateMutation.isLoading,
		isDeleting: deleteMutation.isLoading,
	};
};
