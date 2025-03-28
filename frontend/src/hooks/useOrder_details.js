import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchAllorder_details, fetchorder_detailsById, createorder_details, updateorder_details, deleteorder_details } from '../api/order_details.api.js';

export const useOrder_details = ({ initialParams = { limit: 10, page: 1 } }) => {
	const queryClient = useQueryClient();
	const [params, setParams] = useState(initialParams);
	const { limit, page } = params;

	const { data: order_details, isLoading, isError, error } = useQuery({
		queryKey: ['order_details', limit, page],
		queryFn: () => fetchAllorder_details({ limit, page }),
		staleTime: 5 * 60 * 1000,
		keepPreviousData: true,
		retry: 1,
	});

	const createMutation = useMutation({
		mutationFn: createorder_details,
		onMutate: async (neworder_details) => {
			await queryClient.cancelQueries(['order_details', limit, page]);
			const previousData = queryClient.getQueryData(['order_details', limit, page]);
			queryClient.setQueryData(['order_details', limit, page], (old) => {
				return { ...old, data: [...(old?.data || []), neworder_details] };
			});
			return { previousData };
		},
		onError: (err, neworder_details, context) => {
			queryClient.setQueryData(['order_details', limit, page], context.previousData);
		},
		onSettled: () => queryClient.invalidateQueries(['order_details', limit, page]),
	});

	const updateMutation = useMutation({
		mutationFn: ({ id, order_details }) => updateorder_details(id, order_details),
		onMutate: async ({ id, order_details }) => {
			await queryClient.cancelQueries(['order_details', limit, page]);
			const previousData = queryClient.getQueryData(['order_details', limit, page]);
			queryClient.setQueryData(['order_details', limit, page], (old) => {
				return { ...old, data: old.data.map(item => item.account_id === id ? { ...item, ...order_details } : item) };
			});
			return { previousData };
		},
		onError: (err, variables, context) => {
			queryClient.setQueryData(['order_details', limit, page], context.previousData);
		},
		onSettled: () => queryClient.invalidateQueries(['order_details', limit, page]),
	});

	const deleteMutation = useMutation({
		mutationFn: deleteorder_details,
		onMutate: async (id) => {
			await queryClient.cancelQueries(['order_details', limit, page]);
			const previousData = queryClient.getQueryData(['order_details', limit, page]);
			queryClient.setQueryData(['order_details', limit, page], (old) => {
				return { ...old, data: old.data.filter(item => item.account_id !== id) };
			});
			return { previousData };
		},
		onError: (err, id, context) => {
			queryClient.setQueryData(['order_details', limit, page], context.previousData);
		},
		onSettled: () => queryClient.invalidateQueries(['order_details', limit, page]),
	});

	const setPage = (newPage) => setParams(prev => ({ ...prev, page: newPage }));
	const setLimit = (newLimit) => setParams(prev => ({ ...prev, limit: newLimit, page: 1 }));

	return {
		data: order_details?.data || [],
		meta: order_details?.meta || {},
		isLoading,
		isError,
		error,
		params,
		setPage,
		setLimit,
		createOrder_detailsAsync: createMutation.mutateAsync,
		updateOrder_detailsAsync: updateMutation.mutateAsync,
		deleteOrder_detailsAsync: deleteMutation.mutateAsync,
		isCreating: createMutation.isLoading,
		isUpdating: updateMutation.isLoading,
		isDeleting: deleteMutation.isLoading,
	};
};
