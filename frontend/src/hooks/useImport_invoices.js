import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchAllimport_invoices, fetchimport_invoicesById, createimport_invoices, updateimport_invoices, deleteimport_invoices } from '../api/import_invoices.api.js';

export const useImport_invoices = ({ initialParams = { limit: 10, page: 1 } }) => {
	const queryClient = useQueryClient();
	const [params, setParams] = useState(initialParams);
	const { limit, page } = params;

	const { data: import_invoices, isLoading, isError, error } = useQuery({
		queryKey: ['import_invoices', limit, page],
		queryFn: () => fetchAllimport_invoices({ limit, page }),
		staleTime: 5 * 60 * 1000,
		keepPreviousData: true,
		retry: 1,
	});

	const createMutation = useMutation({
		mutationFn: createimport_invoices,
		onMutate: async (newimport_invoices) => {
			await queryClient.cancelQueries(['import_invoices', limit, page]);
			const previousData = queryClient.getQueryData(['import_invoices', limit, page]);
			queryClient.setQueryData(['import_invoices', limit, page], (old) => {
				return { ...old, data: [...(old?.data || []), newimport_invoices] };
			});
			return { previousData };
		},
		onError: (err, newimport_invoices, context) => {
			queryClient.setQueryData(['import_invoices', limit, page], context.previousData);
		},
		onSettled: () => queryClient.invalidateQueries(['import_invoices', limit, page]),
	});

	const updateMutation = useMutation({
		mutationFn: ({ id, import_invoices }) => updateimport_invoices(id, import_invoices),
		onMutate: async ({ id, import_invoices }) => {
			await queryClient.cancelQueries(['import_invoices', limit, page]);
			const previousData = queryClient.getQueryData(['import_invoices', limit, page]);
			queryClient.setQueryData(['import_invoices', limit, page], (old) => {
				return { ...old, data: old.data.map(item => item.account_id === id ? { ...item, ...import_invoices } : item) };
			});
			return { previousData };
		},
		onError: (err, variables, context) => {
			queryClient.setQueryData(['import_invoices', limit, page], context.previousData);
		},
		onSettled: () => queryClient.invalidateQueries(['import_invoices', limit, page]),
	});

	const deleteMutation = useMutation({
		mutationFn: deleteimport_invoices,
		onMutate: async (id) => {
			await queryClient.cancelQueries(['import_invoices', limit, page]);
			const previousData = queryClient.getQueryData(['import_invoices', limit, page]);
			queryClient.setQueryData(['import_invoices', limit, page], (old) => {
				return { ...old, data: old.data.filter(item => item.account_id !== id) };
			});
			return { previousData };
		},
		onError: (err, id, context) => {
			queryClient.setQueryData(['import_invoices', limit, page], context.previousData);
		},
		onSettled: () => queryClient.invalidateQueries(['import_invoices', limit, page]),
	});

	const setPage = (newPage) => setParams(prev => ({ ...prev, page: newPage }));
	const setLimit = (newLimit) => setParams(prev => ({ ...prev, limit: newLimit, page: 1 }));

	return {
		data: import_invoices?.data || [],
		meta: import_invoices?.meta || {},
		isLoading,
		isError,
		error,
		params,
		setPage,
		setLimit,
		createImport_invoicesAsync: createMutation.mutateAsync,
		updateImport_invoicesAsync: updateMutation.mutateAsync,
		deleteImport_invoicesAsync: deleteMutation.mutateAsync,
		isCreating: createMutation.isLoading,
		isUpdating: updateMutation.isLoading,
		isDeleting: deleteMutation.isLoading,
	};
};
