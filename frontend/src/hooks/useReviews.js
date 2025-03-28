import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchAllreviews, fetchreviewsById, createreviews, updatereviews, deletereviews } from '../api/reviews.api.js';

export const useReviews = ({ initialParams = { limit: 10, page: 1 } }) => {
	const queryClient = useQueryClient();
	const [params, setParams] = useState(initialParams);
	const { limit, page } = params;

	const { data: reviews, isLoading, isError, error } = useQuery({
		queryKey: ['reviews', limit, page],
		queryFn: () => fetchAllreviews({ limit, page }),
		staleTime: 5 * 60 * 1000,
		keepPreviousData: true,
		retry: 1,
	});

	const createMutation = useMutation({
		mutationFn: createreviews,
		onMutate: async (newreviews) => {
			await queryClient.cancelQueries(['reviews', limit, page]);
			const previousData = queryClient.getQueryData(['reviews', limit, page]);
			queryClient.setQueryData(['reviews', limit, page], (old) => {
				return { ...old, data: [...(old?.data || []), newreviews] };
			});
			return { previousData };
		},
		onError: (err, newreviews, context) => {
			queryClient.setQueryData(['reviews', limit, page], context.previousData);
		},
		onSettled: () => queryClient.invalidateQueries(['reviews', limit, page]),
	});

	const updateMutation = useMutation({
		mutationFn: ({ id, reviews }) => updatereviews(id, reviews),
		onMutate: async ({ id, reviews }) => {
			await queryClient.cancelQueries(['reviews', limit, page]);
			const previousData = queryClient.getQueryData(['reviews', limit, page]);
			queryClient.setQueryData(['reviews', limit, page], (old) => {
				return { ...old, data: old.data.map(item => item.account_id === id ? { ...item, ...reviews } : item) };
			});
			return { previousData };
		},
		onError: (err, variables, context) => {
			queryClient.setQueryData(['reviews', limit, page], context.previousData);
		},
		onSettled: () => queryClient.invalidateQueries(['reviews', limit, page]),
	});

	const deleteMutation = useMutation({
		mutationFn: deletereviews,
		onMutate: async (id) => {
			await queryClient.cancelQueries(['reviews', limit, page]);
			const previousData = queryClient.getQueryData(['reviews', limit, page]);
			queryClient.setQueryData(['reviews', limit, page], (old) => {
				return { ...old, data: old.data.filter(item => item.account_id !== id) };
			});
			return { previousData };
		},
		onError: (err, id, context) => {
			queryClient.setQueryData(['reviews', limit, page], context.previousData);
		},
		onSettled: () => queryClient.invalidateQueries(['reviews', limit, page]),
	});

	const setPage = (newPage) => setParams(prev => ({ ...prev, page: newPage }));
	const setLimit = (newLimit) => setParams(prev => ({ ...prev, limit: newLimit, page: 1 }));

	return {
		data: reviews?.data || [],
		meta: reviews?.meta || {},
		isLoading,
		isError,
		error,
		params,
		setPage,
		setLimit,
		createReviewsAsync: createMutation.mutateAsync,
		updateReviewsAsync: updateMutation.mutateAsync,
		deleteReviewsAsync: deleteMutation.mutateAsync,
		isCreating: createMutation.isLoading,
		isUpdating: updateMutation.isLoading,
		isDeleting: deleteMutation.isLoading,
	};
};
