import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchAllproduct_images, fetchproduct_imagesById, createproduct_images, updateproduct_images, deleteproduct_images } from '../api/product_images.api.js';

export const useProduct_images = ({ initialParams = { limit: 10, page: 1 } }) => {
	const queryClient = useQueryClient();
	const [params, setParams] = useState(initialParams);
	const { limit, page } = params;

	const { data: product_images, isLoading, isError, error } = useQuery({
		queryKey: ['product_images', limit, page],
		queryFn: () => fetchAllproduct_images({ limit, page }),
		staleTime: 5 * 60 * 1000,
		keepPreviousData: true,
		retry: 1,
	});

	const createMutation = useMutation({
		mutationFn: createproduct_images,
		onMutate: async (newproduct_images) => {
			await queryClient.cancelQueries(['product_images', limit, page]);
			const previousData = queryClient.getQueryData(['product_images', limit, page]);
			queryClient.setQueryData(['product_images', limit, page], (old) => {
				return { ...old, data: [...(old?.data || []), newproduct_images] };
			});
			return { previousData };
		},
		onError: (err, newproduct_images, context) => {
			queryClient.setQueryData(['product_images', limit, page], context.previousData);
		},
		onSettled: () => queryClient.invalidateQueries(['product_images', limit, page]),
	});

	const updateMutation = useMutation({
		mutationFn: ({ id, product_images }) => updateproduct_images(id, product_images),
		onMutate: async ({ id, product_images }) => {
			await queryClient.cancelQueries(['product_images', limit, page]);
			const previousData = queryClient.getQueryData(['product_images', limit, page]);
			queryClient.setQueryData(['product_images', limit, page], (old) => {
				return { ...old, data: old.data.map(item => item.account_id === id ? { ...item, ...product_images } : item) };
			});
			return { previousData };
		},
		onError: (err, variables, context) => {
			queryClient.setQueryData(['product_images', limit, page], context.previousData);
		},
		onSettled: () => queryClient.invalidateQueries(['product_images', limit, page]),
	});

	const deleteMutation = useMutation({
		mutationFn: deleteproduct_images,
		onMutate: async (id) => {
			await queryClient.cancelQueries(['product_images', limit, page]);
			const previousData = queryClient.getQueryData(['product_images', limit, page]);
			queryClient.setQueryData(['product_images', limit, page], (old) => {
				return { ...old, data: old.data.filter(item => item.account_id !== id) };
			});
			return { previousData };
		},
		onError: (err, id, context) => {
			queryClient.setQueryData(['product_images', limit, page], context.previousData);
		},
		onSettled: () => queryClient.invalidateQueries(['product_images', limit, page]),
	});

	const setPage = (newPage) => setParams(prev => ({ ...prev, page: newPage }));
	const setLimit = (newLimit) => setParams(prev => ({ ...prev, limit: newLimit, page: 1 }));

	return {
		data: product_images?.data || [],
		meta: product_images?.meta || {},
		isLoading,
		isError,
		error,
		params,
		setPage,
		setLimit,
		createProduct_imagesAsync: createMutation.mutateAsync,
		updateProduct_imagesAsync: updateMutation.mutateAsync,
		deleteProduct_imagesAsync: deleteMutation.mutateAsync,
		isCreating: createMutation.isLoading,
		isUpdating: updateMutation.isLoading,
		isDeleting: deleteMutation.isLoading,
	};
};
