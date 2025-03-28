import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchAllorders, fetchordersById, createorders, updateorders, deleteorders } from '../api/orders.api.js';

export const useOrders = ({ initialParams = { limit: 10, page: 1 } }) => {
	const queryClient = useQueryClient();
	const [params, setParams] = useState(initialParams);
	const { limit, page } = params;

	const { data: orders, isLoading, isError, error } = useQuery({
		queryKey: ['orders', limit, page],
		queryFn: () => fetchAllorders({ limit, page }),
		staleTime: 5 * 60 * 1000,
		keepPreviousData: true,
		retry: 1,
	});

	const createMutation = useMutation({
		mutationFn: createorders,
		onMutate: async (neworders) => {
			await queryClient.cancelQueries(['orders', limit, page]);
			const previousData = queryClient.getQueryData(['orders', limit, page]);
			queryClient.setQueryData(['orders', limit, page], (old) => {
				return { ...old, data: [...(old?.data || []), neworders] };
			});
			return { previousData };
		},
		onError: (err, neworders, context) => {
			queryClient.setQueryData(['orders', limit, page], context.previousData);
		},
		onSettled: () => queryClient.invalidateQueries(['orders', limit, page]),
	});

	const updateMutation = useMutation({
		mutationFn: ({ id, orders }) => updateorders(id, orders),
		onMutate: async ({ id, orders }) => {
			await queryClient.cancelQueries(['orders', limit, page]);
			const previousData = queryClient.getQueryData(['orders', limit, page]);
			queryClient.setQueryData(['orders', limit, page], (old) => {
				return { ...old, data: old.data.map(item => item.account_id === id ? { ...item, ...orders } : item) };
			});
			return { previousData };
		},
		onError: (err, variables, context) => {
			queryClient.setQueryData(['orders', limit, page], context.previousData);
		},
		onSettled: () => queryClient.invalidateQueries(['orders', limit, page]),
	});

	const deleteMutation = useMutation({
		mutationFn: deleteorders,
		onMutate: async (id) => {
			await queryClient.cancelQueries(['orders', limit, page]);
			const previousData = queryClient.getQueryData(['orders', limit, page]);
			queryClient.setQueryData(['orders', limit, page], (old) => {
				return { ...old, data: old.data.filter(item => item.account_id !== id) };
			});
			return { previousData };
		},
		onError: (err, id, context) => {
			queryClient.setQueryData(['orders', limit, page], context.previousData);
		},
		onSettled: () => queryClient.invalidateQueries(['orders', limit, page]),
	});

	const setPage = (newPage) => setParams(prev => ({ ...prev, page: newPage }));
	const setLimit = (newLimit) => setParams(prev => ({ ...prev, limit: newLimit, page: 1 }));

	return {
		data: orders?.data || [],
		meta: orders?.meta || {},
		isLoading,
		isError,
		error,
		params,
		setPage,
		setLimit,
		createOrdersAsync: createMutation.mutateAsync,
		updateOrdersAsync: updateMutation.mutateAsync,
		deleteOrdersAsync: deleteMutation.mutateAsync,
		isCreating: createMutation.isLoading,
		isUpdating: updateMutation.isLoading,
		isDeleting: deleteMutation.isLoading,
	};
};
