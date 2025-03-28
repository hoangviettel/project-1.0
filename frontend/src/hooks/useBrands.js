import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchAllbrands, createbrands, updatebrands, deletebrands } from '../api/brands.api.js';

export const useBrands = ({ initialParams = { limit: 10, page: 1 } }) => {
	const queryClient = useQueryClient();
	const [params, setParams] = useState(initialParams);
	const { limit, page } = params;

	const { data: brands, isLoading, isError, error } = useQuery({
		queryKey: ['brands', limit, page],
		queryFn: () => fetchAllbrands({ limit, page }),
		staleTime: 5 * 60 * 1000,
		keepPreviousData: true,
		retry: 1,
	});

	const createMutation = useMutation({
		mutationFn: createbrands,
		onMutate: async (newbrands) => {
			await queryClient.cancelQueries(['brands', limit, page]);
			const previousData = queryClient.getQueryData(['brands', limit, page]);
			queryClient.setQueryData(['brands', limit, page], (old) => {
				return { ...old, data: [...(old?.data || []), newbrands] };
			});
			return { previousData };
		},
		onError: (err, newbrands, context) => {
			queryClient.setQueryData(['brands', limit, page], context.previousData);
		},
		onSettled: () => queryClient.invalidateQueries(['brands', limit, page]),
	});

	const updateMutation = useMutation({
		mutationFn: ({ id, brands }) => updatebrands(id, brands),
		onMutate: async ({ id, brands }) => {
			await queryClient.cancelQueries(['brands', limit, page]);
			const previousData = queryClient.getQueryData(['brands', limit, page]);
			queryClient.setQueryData(['brands', limit, page], (old) => {
				return { ...old, data: old.data.map(item => item.account_id === id ? { ...item, ...brands } : item) };
			});
			return { previousData };
		},
		onError: (err, variables, context) => {
			queryClient.setQueryData(['brands', limit, page], context.previousData);
		},
		onSettled: () => queryClient.invalidateQueries(['brands', limit, page]),
	});

	const deleteMutation = useMutation({
		mutationFn: deletebrands,
		onMutate: async (id) => {
			await queryClient.cancelQueries(['brands', limit, page]);
			const previousData = queryClient.getQueryData(['brands', limit, page]);
			queryClient.setQueryData(['brands', limit, page], (old) => {
				return { ...old, data: old.data.filter(item => item.account_id !== id) };
			});
			return { previousData };
		},
		onError: (err, id, context) => {
			queryClient.setQueryData(['brands', limit, page], context.previousData);
		},
		onSettled: () => queryClient.invalidateQueries(['brands', limit, page]),
	});

	const setPage = (newPage) => setParams(prev => ({ ...prev, page: newPage }));
	const setLimit = (newLimit) => setParams(prev => ({ ...prev, limit: newLimit, page: 1 }));

	return {
		data: brands?.data || [],
		meta: brands?.meta || {},
		isLoading,
		isError,
		error,
		params,
		setPage,
		setLimit,
		createBrandsAsync: createMutation.mutateAsync,
		updateBrandsAsync: updateMutation.mutateAsync,
		deleteBrandsAsync: deleteMutation.mutateAsync,
		isCreating: createMutation.isLoading,
		isUpdating: updateMutation.isLoading,
		isDeleting: deleteMutation.isLoading,
	};
};
