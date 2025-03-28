import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchAllinventory, fetchinventoryById, createinventory, updateinventory, deleteinventory } from '../api/inventory.api.js';

export const useInventory = ({ initialParams = { limit: 10, page: 1 } }) => {
	const queryClient = useQueryClient();
	const [params, setParams] = useState(initialParams);
	const { limit, page } = params;

	const { data: inventory, isLoading, isError, error } = useQuery({
		queryKey: ['inventory', limit, page],
		queryFn: () => fetchAllinventory({ limit, page }),
		staleTime: 5 * 60 * 1000,
		keepPreviousData: true,
		retry: 1,
	});

	const createMutation = useMutation({
		mutationFn: createinventory,
		onMutate: async (newinventory) => {
			await queryClient.cancelQueries(['inventory', limit, page]);
			const previousData = queryClient.getQueryData(['inventory', limit, page]);
			queryClient.setQueryData(['inventory', limit, page], (old) => {
				return { ...old, data: [...(old?.data || []), newinventory] };
			});
			return { previousData };
		},
		onError: (err, newinventory, context) => {
			queryClient.setQueryData(['inventory', limit, page], context.previousData);
		},
		onSettled: () => queryClient.invalidateQueries(['inventory', limit, page]),
	});

	const updateMutation = useMutation({
		mutationFn: ({ id, inventory }) => updateinventory(id, inventory),
		onMutate: async ({ id, inventory }) => {
			await queryClient.cancelQueries(['inventory', limit, page]);
			const previousData = queryClient.getQueryData(['inventory', limit, page]);
			queryClient.setQueryData(['inventory', limit, page], (old) => {
				return { ...old, data: old.data.map(item => item.account_id === id ? { ...item, ...inventory } : item) };
			});
			return { previousData };
		},
		onError: (err, variables, context) => {
			queryClient.setQueryData(['inventory', limit, page], context.previousData);
		},
		onSettled: () => queryClient.invalidateQueries(['inventory', limit, page]),
	});

	const deleteMutation = useMutation({
		mutationFn: deleteinventory,
		onMutate: async (id) => {
			await queryClient.cancelQueries(['inventory', limit, page]);
			const previousData = queryClient.getQueryData(['inventory', limit, page]);
			queryClient.setQueryData(['inventory', limit, page], (old) => {
				return { ...old, data: old.data.filter(item => item.account_id !== id) };
			});
			return { previousData };
		},
		onError: (err, id, context) => {
			queryClient.setQueryData(['inventory', limit, page], context.previousData);
		},
		onSettled: () => queryClient.invalidateQueries(['inventory', limit, page]),
	});

	const setPage = (newPage) => setParams(prev => ({ ...prev, page: newPage }));
	const setLimit = (newLimit) => setParams(prev => ({ ...prev, limit: newLimit, page: 1 }));

	return {
		data: inventory?.data || [],
		meta: inventory?.meta || {},
		isLoading,
		isError,
		error,
		params,
		setPage,
		setLimit,
		createInventoryAsync: createMutation.mutateAsync,
		updateInventoryAsync: updateMutation.mutateAsync,
		deleteInventoryAsync: deleteMutation.mutateAsync,
		isCreating: createMutation.isLoading,
		isUpdating: updateMutation.isLoading,
		isDeleting: deleteMutation.isLoading,
	};
};
