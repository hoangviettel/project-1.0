import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchAllcategories, fetchcategoriesById, createcategories, updatecategories, deletecategories } from '../api/categories.api.js';

export const useCategories = ({ initialParams = { limit: 10, page: 1 } }) => {
	const queryClient = useQueryClient();
	const [params, setParams] = useState(initialParams);
	const { limit, page } = params;

	const { data: categories, isLoading, isError, error } = useQuery({
		queryKey: ['categories', limit, page],
		queryFn: () => fetchAllcategories({ limit, page }),
		staleTime: 5 * 60 * 1000,
		keepPreviousData: true,
		retry: 1,
	});

	const createMutation = useMutation({
		mutationFn: createcategories,
		onMutate: async (newcategories) => {
			await queryClient.cancelQueries(['categories', limit, page]);
			const previousData = queryClient.getQueryData(['categories', limit, page]);
			queryClient.setQueryData(['categories', limit, page], (old) => {
				return { ...old, data: [...(old?.data || []), newcategories] };
			});
			return { previousData };
		},
		onError: (err, newcategories, context) => {
			queryClient.setQueryData(['categories', limit, page], context.previousData);
		},
		onSettled: () => queryClient.invalidateQueries(['categories', limit, page]),
	});

	const updateMutation = useMutation({
		mutationFn: ({ id, categories }) => updatecategories(id, categories),
		onMutate: async ({ id, categories }) => {
			await queryClient.cancelQueries(['categories', limit, page]);
			const previousData = queryClient.getQueryData(['categories', limit, page]);
			queryClient.setQueryData(['categories', limit, page], (old) => {
				return { ...old, data: old.data.map(item => item.account_id === id ? { ...item, ...categories } : item) };
			});
			return { previousData };
		},
		onError: (err, variables, context) => {
			queryClient.setQueryData(['categories', limit, page], context.previousData);
		},
		onSettled: () => queryClient.invalidateQueries(['categories', limit, page]),
	});

	const deleteMutation = useMutation({
		mutationFn: deletecategories,
		onMutate: async (id) => {
			await queryClient.cancelQueries(['categories', limit, page]);
			const previousData = queryClient.getQueryData(['categories', limit, page]);
			queryClient.setQueryData(['categories', limit, page], (old) => {
				return { ...old, data: old.data.filter(item => item.account_id !== id) };
			});
			return { previousData };
		},
		onError: (err, id, context) => {
			queryClient.setQueryData(['categories', limit, page], context.previousData);
		},
		onSettled: () => queryClient.invalidateQueries(['categories', limit, page]),
	});

	const setPage = (newPage) => setParams(prev => ({ ...prev, page: newPage }));
	const setLimit = (newLimit) => setParams(prev => ({ ...prev, limit: newLimit, page: 1 }));

	return {
		data: categories?.data || [],
		meta: categories?.meta || {},
		isLoading,
		isError,
		error,
		params,
		setPage,
		setLimit,
		createCategoriesAsync: createMutation.mutateAsync,
		updateCategoriesAsync: updateMutation.mutateAsync,
		deleteCategoriesAsync: deleteMutation.mutateAsync,
		isCreating: createMutation.isLoading,
		isUpdating: updateMutation.isLoading,
		isDeleting: deleteMutation.isLoading,
	};
};
