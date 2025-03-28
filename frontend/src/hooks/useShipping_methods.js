import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchAllshipping_methods, fetchshipping_methodsById, createshipping_methods, updateshipping_methods, deleteshipping_methods } from '../api/shipping_methods.api.js';

export const useShipping_methods = ({ initialParams = { limit: 10, page: 1 } }) => {
	const queryClient = useQueryClient();
	const [params, setParams] = useState(initialParams);
	const { limit, page } = params;

	const { data: shipping_methods, isLoading, isError, error } = useQuery({
		queryKey: ['shipping_methods', limit, page],
		queryFn: () => fetchAllshipping_methods({ limit, page }),
		staleTime: 5 * 60 * 1000,
		keepPreviousData: true,
		retry: 1,
	});

	const createMutation = useMutation({
		mutationFn: createshipping_methods,
		onMutate: async (newshipping_methods) => {
			await queryClient.cancelQueries(['shipping_methods', limit, page]);
			const previousData = queryClient.getQueryData(['shipping_methods', limit, page]);
			queryClient.setQueryData(['shipping_methods', limit, page], (old) => {
				return { ...old, data: [...(old?.data || []), newshipping_methods] };
			});
			return { previousData };
		},
		onError: (err, newshipping_methods, context) => {
			queryClient.setQueryData(['shipping_methods', limit, page], context.previousData);
		},
		onSettled: () => queryClient.invalidateQueries(['shipping_methods', limit, page]),
	});

	const updateMutation = useMutation({
		mutationFn: ({ id, shipping_methods }) => updateshipping_methods(id, shipping_methods),
		onMutate: async ({ id, shipping_methods }) => {
			await queryClient.cancelQueries(['shipping_methods', limit, page]);
			const previousData = queryClient.getQueryData(['shipping_methods', limit, page]);
			queryClient.setQueryData(['shipping_methods', limit, page], (old) => {
				return { ...old, data: old.data.map(item => item.account_id === id ? { ...item, ...shipping_methods } : item) };
			});
			return { previousData };
		},
		onError: (err, variables, context) => {
			queryClient.setQueryData(['shipping_methods', limit, page], context.previousData);
		},
		onSettled: () => queryClient.invalidateQueries(['shipping_methods', limit, page]),
	});

	const deleteMutation = useMutation({
		mutationFn: deleteshipping_methods,
		onMutate: async (id) => {
			await queryClient.cancelQueries(['shipping_methods', limit, page]);
			const previousData = queryClient.getQueryData(['shipping_methods', limit, page]);
			queryClient.setQueryData(['shipping_methods', limit, page], (old) => {
				return { ...old, data: old.data.filter(item => item.account_id !== id) };
			});
			return { previousData };
		},
		onError: (err, id, context) => {
			queryClient.setQueryData(['shipping_methods', limit, page], context.previousData);
		},
		onSettled: () => queryClient.invalidateQueries(['shipping_methods', limit, page]),
	});

	const setPage = (newPage) => setParams(prev => ({ ...prev, page: newPage }));
	const setLimit = (newLimit) => setParams(prev => ({ ...prev, limit: newLimit, page: 1 }));

	return {
		data: shipping_methods?.data || [],
		meta: shipping_methods?.meta || {},
		isLoading,
		isError,
		error,
		params,
		setPage,
		setLimit,
		createShipping_methodsAsync: createMutation.mutateAsync,
		updateShipping_methodsAsync: updateMutation.mutateAsync,
		deleteShipping_methodsAsync: deleteMutation.mutateAsync,
		isCreating: createMutation.isLoading,
		isUpdating: updateMutation.isLoading,
		isDeleting: deleteMutation.isLoading,
	};
};
