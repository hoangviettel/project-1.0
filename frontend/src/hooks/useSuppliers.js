import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchAllsuppliers, fetchsuppliersById, createsuppliers, updatesuppliers, deletesuppliers } from '../api/suppliers.api.js';

export const useSuppliers = ({ initialParams = { limit: 10, page: 1 } }) => {
	const queryClient = useQueryClient();
	const [params, setParams] = useState(initialParams);
	const { limit, page } = params;

	const { data: suppliers, isLoading, isError, error } = useQuery({
		queryKey: ['suppliers', limit, page],
		queryFn: () => fetchAllsuppliers({ limit, page }),
		staleTime: 5 * 60 * 1000,
		keepPreviousData: true,
		retry: 1,
	});

	const createMutation = useMutation({
		mutationFn: createsuppliers,
		onMutate: async (newsuppliers) => {
			await queryClient.cancelQueries(['suppliers', limit, page]);
			const previousData = queryClient.getQueryData(['suppliers', limit, page]);
			queryClient.setQueryData(['suppliers', limit, page], (old) => {
				return { ...old, data: [...(old?.data || []), newsuppliers] };
			});
			return { previousData };
		},
		onError: (err, newsuppliers, context) => {
			queryClient.setQueryData(['suppliers', limit, page], context.previousData);
		},
		onSettled: () => queryClient.invalidateQueries(['suppliers', limit, page]),
	});

	const updateMutation = useMutation({
		mutationFn: ({ id, suppliers }) => updatesuppliers(id, suppliers),
		onMutate: async ({ id, suppliers }) => {
			await queryClient.cancelQueries(['suppliers', limit, page]);
			const previousData = queryClient.getQueryData(['suppliers', limit, page]);
			queryClient.setQueryData(['suppliers', limit, page], (old) => {
				return { ...old, data: old.data.map(item => item.account_id === id ? { ...item, ...suppliers } : item) };
			});
			return { previousData };
		},
		onError: (err, variables, context) => {
			queryClient.setQueryData(['suppliers', limit, page], context.previousData);
		},
		onSettled: () => queryClient.invalidateQueries(['suppliers', limit, page]),
	});

	const deleteMutation = useMutation({
		mutationFn: deletesuppliers,
		onMutate: async (id) => {
			await queryClient.cancelQueries(['suppliers', limit, page]);
			const previousData = queryClient.getQueryData(['suppliers', limit, page]);
			queryClient.setQueryData(['suppliers', limit, page], (old) => {
				return { ...old, data: old.data.filter(item => item.account_id !== id) };
			});
			return { previousData };
		},
		onError: (err, id, context) => {
			queryClient.setQueryData(['suppliers', limit, page], context.previousData);
		},
		onSettled: () => queryClient.invalidateQueries(['suppliers', limit, page]),
	});

	const setPage = (newPage) => setParams(prev => ({ ...prev, page: newPage }));
	const setLimit = (newLimit) => setParams(prev => ({ ...prev, limit: newLimit, page: 1 }));

	return {
		data: suppliers?.data || [],
		meta: suppliers?.meta || {},
		isLoading,
		isError,
		error,
		params,
		setPage,
		setLimit,
		createSuppliersAsync: createMutation.mutateAsync,
		updateSuppliersAsync: updateMutation.mutateAsync,
		deleteSuppliersAsync: deleteMutation.mutateAsync,
		isCreating: createMutation.isLoading,
		isUpdating: updateMutation.isLoading,
		isDeleting: deleteMutation.isLoading,
	};
};
