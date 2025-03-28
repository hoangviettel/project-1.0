import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchAllimport_invoice_details, fetchimport_invoice_detailsById, createimport_invoice_details, updateimport_invoice_details, deleteimport_invoice_details } from '../api/import_invoice_details.api.js';

export const useImport_invoice_details = ({ initialParams = { limit: 10, page: 1 } }) => {
	const queryClient = useQueryClient();
	const [params, setParams] = useState(initialParams);
	const { limit, page } = params;

	const { data: import_invoice_details, isLoading, isError, error } = useQuery({
		queryKey: ['import_invoice_details', limit, page],
		queryFn: () => fetchAllimport_invoice_details({ limit, page }),
		staleTime: 5 * 60 * 1000,
		keepPreviousData: true,
		retry: 1,
	});

	const createMutation = useMutation({
		mutationFn: createimport_invoice_details,
		onMutate: async (newimport_invoice_details) => {
			await queryClient.cancelQueries(['import_invoice_details', limit, page]);
			const previousData = queryClient.getQueryData(['import_invoice_details', limit, page]);
			queryClient.setQueryData(['import_invoice_details', limit, page], (old) => {
				return { ...old, data: [...(old?.data || []), newimport_invoice_details] };
			});
			return { previousData };
		},
		onError: (err, newimport_invoice_details, context) => {
			queryClient.setQueryData(['import_invoice_details', limit, page], context.previousData);
		},
		onSettled: () => queryClient.invalidateQueries(['import_invoice_details', limit, page]),
	});

	const updateMutation = useMutation({
		mutationFn: ({ id, import_invoice_details }) => updateimport_invoice_details(id, import_invoice_details),
		onMutate: async ({ id, import_invoice_details }) => {
			await queryClient.cancelQueries(['import_invoice_details', limit, page]);
			const previousData = queryClient.getQueryData(['import_invoice_details', limit, page]);
			queryClient.setQueryData(['import_invoice_details', limit, page], (old) => {
				return { ...old, data: old.data.map(item => item.account_id === id ? { ...item, ...import_invoice_details } : item) };
			});
			return { previousData };
		},
		onError: (err, variables, context) => {
			queryClient.setQueryData(['import_invoice_details', limit, page], context.previousData);
		},
		onSettled: () => queryClient.invalidateQueries(['import_invoice_details', limit, page]),
	});

	const deleteMutation = useMutation({
		mutationFn: deleteimport_invoice_details,
		onMutate: async (id) => {
			await queryClient.cancelQueries(['import_invoice_details', limit, page]);
			const previousData = queryClient.getQueryData(['import_invoice_details', limit, page]);
			queryClient.setQueryData(['import_invoice_details', limit, page], (old) => {
				return { ...old, data: old.data.filter(item => item.account_id !== id) };
			});
			return { previousData };
		},
		onError: (err, id, context) => {
			queryClient.setQueryData(['import_invoice_details', limit, page], context.previousData);
		},
		onSettled: () => queryClient.invalidateQueries(['import_invoice_details', limit, page]),
	});

	const setPage = (newPage) => setParams(prev => ({ ...prev, page: newPage }));
	const setLimit = (newLimit) => setParams(prev => ({ ...prev, limit: newLimit, page: 1 }));

	return {
		data: import_invoice_details?.data || [],
		meta: import_invoice_details?.meta || {},
		isLoading,
		isError,
		error,
		params,
		setPage,
		setLimit,
		createImport_invoice_detailsAsync: createMutation.mutateAsync,
		updateImport_invoice_detailsAsync: updateMutation.mutateAsync,
		deleteImport_invoice_detailsAsync: deleteMutation.mutateAsync,
		isCreating: createMutation.isLoading,
		isUpdating: updateMutation.isLoading,
		isDeleting: deleteMutation.isLoading,
	};
};
