import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchAllorder_promotions, fetchorder_promotionsById, createorder_promotions, updateorder_promotions, deleteorder_promotions } from '../api/order_promotions.api.js';

export const useOrder_promotions = ({ initialParams = { limit: 10, page: 1 } }) => {
	const queryClient = useQueryClient();
	const [params, setParams] = useState(initialParams);
	const { limit, page } = params;

	const { data: order_promotions, isLoading, isError, error } = useQuery({
		queryKey: ['order_promotions', limit, page],
		queryFn: () => fetchAllorder_promotions({ limit, page }),
		staleTime: 5 * 60 * 1000,
		keepPreviousData: true,
		retry: 1,
	});

	const createMutation = useMutation({
		mutationFn: createorder_promotions,
		onMutate: async (neworder_promotions) => {
			await queryClient.cancelQueries(['order_promotions', limit, page]);
			const previousData = queryClient.getQueryData(['order_promotions', limit, page]);
			queryClient.setQueryData(['order_promotions', limit, page], (old) => {
				return { ...old, data: [...(old?.data || []), neworder_promotions] };
			});
			return { previousData };
		},
		onError: (err, neworder_promotions, context) => {
			queryClient.setQueryData(['order_promotions', limit, page], context.previousData);
		},
		onSettled: () => queryClient.invalidateQueries(['order_promotions', limit, page]),
	});

	const updateMutation = useMutation({
		mutationFn: ({ id, order_promotions }) => updateorder_promotions(id, order_promotions),
		onMutate: async ({ id, order_promotions }) => {
			await queryClient.cancelQueries(['order_promotions', limit, page]);
			const previousData = queryClient.getQueryData(['order_promotions', limit, page]);
			queryClient.setQueryData(['order_promotions', limit, page], (old) => {
				return { ...old, data: old.data.map(item => item.account_id === id ? { ...item, ...order_promotions } : item) };
			});
			return { previousData };
		},
		onError: (err, variables, context) => {
			queryClient.setQueryData(['order_promotions', limit, page], context.previousData);
		},
		onSettled: () => queryClient.invalidateQueries(['order_promotions', limit, page]),
	});

	const deleteMutation = useMutation({
		mutationFn: deleteorder_promotions,
		onMutate: async (id) => {
			await queryClient.cancelQueries(['order_promotions', limit, page]);
			const previousData = queryClient.getQueryData(['order_promotions', limit, page]);
			queryClient.setQueryData(['order_promotions', limit, page], (old) => {
				return { ...old, data: old.data.filter(item => item.account_id !== id) };
			});
			return { previousData };
		},
		onError: (err, id, context) => {
			queryClient.setQueryData(['order_promotions', limit, page], context.previousData);
		},
		onSettled: () => queryClient.invalidateQueries(['order_promotions', limit, page]),
	});

	const setPage = (newPage) => setParams(prev => ({ ...prev, page: newPage }));
	const setLimit = (newLimit) => setParams(prev => ({ ...prev, limit: newLimit, page: 1 }));

	return {
		data: order_promotions?.data || [],
		meta: order_promotions?.meta || {},
		isLoading,
		isError,
		error,
		params,
		setPage,
		setLimit,
		createOrder_promotionsAsync: createMutation.mutateAsync,
		updateOrder_promotionsAsync: updateMutation.mutateAsync,
		deleteOrder_promotionsAsync: deleteMutation.mutateAsync,
		isCreating: createMutation.isLoading,
		isUpdating: updateMutation.isLoading,
		isDeleting: deleteMutation.isLoading,
	};
};
