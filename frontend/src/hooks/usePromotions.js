import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchAllpromotions, fetchpromotionsById, createpromotions, updatepromotions, deletepromotions } from '../api/promotions.api.js';

export const usePromotions = ({ initialParams = { limit: 10, page: 1 } }) => {
	const queryClient = useQueryClient();
	const [params, setParams] = useState(initialParams);
	const { limit, page } = params;

	const { data: promotions, isLoading, isError, error } = useQuery({
		queryKey: ['promotions', limit, page],
		queryFn: () => fetchAllpromotions({ limit, page }),
		staleTime: 5 * 60 * 1000,
		keepPreviousData: true,
		retry: 1,
	});

	const createMutation = useMutation({
		mutationFn: createpromotions,
		onMutate: async (newpromotions) => {
			await queryClient.cancelQueries(['promotions', limit, page]);
			const previousData = queryClient.getQueryData(['promotions', limit, page]);
			queryClient.setQueryData(['promotions', limit, page], (old) => {
				return { ...old, data: [...(old?.data || []), newpromotions] };
			});
			return { previousData };
		},
		onError: (err, newpromotions, context) => {
			queryClient.setQueryData(['promotions', limit, page], context.previousData);
		},
		onSettled: () => queryClient.invalidateQueries(['promotions', limit, page]),
	});

	const updateMutation = useMutation({
		mutationFn: ({ id, promotions }) => updatepromotions(id, promotions),
		onMutate: async ({ id, promotions }) => {
			await queryClient.cancelQueries(['promotions', limit, page]);
			const previousData = queryClient.getQueryData(['promotions', limit, page]);
			queryClient.setQueryData(['promotions', limit, page], (old) => {
				return { ...old, data: old.data.map(item => item.account_id === id ? { ...item, ...promotions } : item) };
			});
			return { previousData };
		},
		onError: (err, variables, context) => {
			queryClient.setQueryData(['promotions', limit, page], context.previousData);
		},
		onSettled: () => queryClient.invalidateQueries(['promotions', limit, page]),
	});

	const deleteMutation = useMutation({
		mutationFn: deletepromotions,
		onMutate: async (id) => {
			await queryClient.cancelQueries(['promotions', limit, page]);
			const previousData = queryClient.getQueryData(['promotions', limit, page]);
			queryClient.setQueryData(['promotions', limit, page], (old) => {
				return { ...old, data: old.data.filter(item => item.account_id !== id) };
			});
			return { previousData };
		},
		onError: (err, id, context) => {
			queryClient.setQueryData(['promotions', limit, page], context.previousData);
		},
		onSettled: () => queryClient.invalidateQueries(['promotions', limit, page]),
	});

	const setPage = (newPage) => setParams(prev => ({ ...prev, page: newPage }));
	const setLimit = (newLimit) => setParams(prev => ({ ...prev, limit: newLimit, page: 1 }));

	return {
		data: promotions?.data || [],
		meta: promotions?.meta || {},
		isLoading,
		isError,
		error,
		params,
		setPage,
		setLimit,
		createPromotionsAsync: createMutation.mutateAsync,
		updatePromotionsAsync: updateMutation.mutateAsync,
		deletePromotionsAsync: deleteMutation.mutateAsync,
		isCreating: createMutation.isLoading,
		isUpdating: updateMutation.isLoading,
		isDeleting: deleteMutation.isLoading,
	};
};
