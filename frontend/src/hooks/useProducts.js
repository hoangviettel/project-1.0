import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchAllproducts, fetchproductsById, createproducts, updateproducts, deleteproducts } from '../api/products.api.js';

export const useProducts = ({ initialParams = { limit: 10, page: 1 } }) => {
	const queryClient = useQueryClient();
	const [params, setParams] = useState(initialParams);
	const { limit, page } = params;

	const { data: products, isLoading, isError, error } = useQuery({
		queryKey: ['products', limit, page],
		queryFn: () => fetchAllproducts({ limit, page }),
		staleTime: 5 * 60 * 1000,
		keepPreviousData: true,
		retry: 1,
	});

	const createMutation = useMutation({
		mutationFn: createproducts,
		onMutate: async (newproducts) => {
			await queryClient.cancelQueries(['products', limit, page]);
			const previousData = queryClient.getQueryData(['products', limit, page]);
			queryClient.setQueryData(['products', limit, page], (old) => {
				return { ...old, data: [...(old?.data || []), newproducts] };
			});
			return { previousData };
		},
		onError: (err, newproducts, context) => {
			queryClient.setQueryData(['products', limit, page], context.previousData);
		},
		onSettled: () => queryClient.invalidateQueries(['products', limit, page]),
	});

	const updateMutation = useMutation({
		mutationFn: ({ id, products }) => updateproducts(id, products),
		onMutate: async ({ id, products }) => {
			await queryClient.cancelQueries(['products', limit, page]);
			const previousData = queryClient.getQueryData(['products', limit, page]);
			queryClient.setQueryData(['products', limit, page], (old) => {
				return { ...old, data: old.data.map(item => item.account_id === id ? { ...item, ...products } : item) };
			});
			return { previousData };
		},
		onError: (err, variables, context) => {
			queryClient.setQueryData(['products', limit, page], context.previousData);
		},
		onSettled: () => queryClient.invalidateQueries(['products', limit, page]),
	});

	const deleteMutation = useMutation({
		mutationFn: deleteproducts,
		onMutate: async (id) => {
			await queryClient.cancelQueries(['products', limit, page]);
			const previousData = queryClient.getQueryData(['products', limit, page]);
			queryClient.setQueryData(['products', limit, page], (old) => {
				return { ...old, data: old.data.filter(item => item.account_id !== id) };
			});
			return { previousData };
		},
		onError: (err, id, context) => {
			queryClient.setQueryData(['products', limit, page], context.previousData);
		},
		onSettled: () => queryClient.invalidateQueries(['products', limit, page]),
	});

	const setPage = (newPage) => setParams(prev => ({ ...prev, page: newPage }));
	const setLimit = (newLimit) => setParams(prev => ({ ...prev, limit: newLimit, page: 1 }));

	return {
		data: products?.data || [],
		meta: products?.meta || {},
		isLoading,
		isError,
		error,
		params,
		setPage,
		setLimit,
		createProductsAsync: createMutation.mutateAsync,
		updateProductsAsync: updateMutation.mutateAsync,
		deleteProductsAsync: deleteMutation.mutateAsync,
		isCreating: createMutation.isLoading,
		isUpdating: updateMutation.isLoading,
		isDeleting: deleteMutation.isLoading,
	};
};
