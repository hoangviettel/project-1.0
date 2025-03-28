import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchAllcarts, createcarts, updatecarts, deletecarts } from '../api/carts.api.js';

export const useCarts = ({ initialParams = { limit: 10, page: 1 } }) => {
	const queryClient = useQueryClient();
	const [params, setParams] = useState(initialParams);
	const { limit, page } = params;

	const { data: carts, isLoading, isError, error } = useQuery({
		queryKey: ['carts', limit, page],
		queryFn: () => fetchAllcarts({ limit, page }),
		staleTime: 5 * 60 * 1000,
		keepPreviousData: true,
		retry: 1,
	});

	const createMutation = useMutation({
		mutationFn: createcarts,
		onMutate: async (newcarts) => {
			await queryClient.cancelQueries(['carts', limit, page]);
			const previousData = queryClient.getQueryData(['carts', limit, page]);
			queryClient.setQueryData(['carts', limit, page], (old) => {
				return { ...old, data: [...(old?.data || []), newcarts] };
			});
			return { previousData };
		},
		onError: (err, newcarts, context) => {
			queryClient.setQueryData(['carts', limit, page], context.previousData);
		},
		onSettled: () => queryClient.invalidateQueries(['carts', limit, page]),
	});

	const updateMutation = useMutation({
		mutationFn: ({ id, carts }) => updatecarts(id, carts),
		onMutate: async ({ id, carts }) => {
			await queryClient.cancelQueries(['carts', limit, page]);
			const previousData = queryClient.getQueryData(['carts', limit, page]);
			queryClient.setQueryData(['carts', limit, page], (old) => {
				return { ...old, data: old.data.map(item => item.account_id === id ? { ...item, ...carts } : item) };
			});
			return { previousData };
		},
		onError: (err, variables, context) => {
			queryClient.setQueryData(['carts', limit, page], context.previousData);
		},
		onSettled: () => queryClient.invalidateQueries(['carts', limit, page]),
	});

	const deleteMutation = useMutation({
		mutationFn: deletecarts,
		onMutate: async (id) => {
			await queryClient.cancelQueries(['carts', limit, page]);
			const previousData = queryClient.getQueryData(['carts', limit, page]);
			queryClient.setQueryData(['carts', limit, page], (old) => {
				return { ...old, data: old.data.filter(item => item.account_id !== id) };
			});
			return { previousData };
		},
		onError: (err, id, context) => {
			queryClient.setQueryData(['carts', limit, page], context.previousData);
		},
		onSettled: () => queryClient.invalidateQueries(['carts', limit, page]),
	});

	const setPage = (newPage) => setParams(prev => ({ ...prev, page: newPage }));
	const setLimit = (newLimit) => setParams(prev => ({ ...prev, limit: newLimit, page: 1 }));

	return {
		data: carts?.data || [],
		meta: carts?.meta || {},
		isLoading,
		isError,
		error,
		params,
		setPage,
		setLimit,
		createCartsAsync: createMutation.mutateAsync,
		updateCartsAsync: updateMutation.mutateAsync,
		deleteCartsAsync: deleteMutation.mutateAsync,
		isCreating: createMutation.isLoading,
		isUpdating: updateMutation.isLoading,
		isDeleting: deleteMutation.isLoading,
	};
};
