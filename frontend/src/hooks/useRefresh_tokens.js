import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchAllrefresh_tokens, fetchrefresh_tokensById, createrefresh_tokens, updaterefresh_tokens, deleterefresh_tokens } from '../api/refresh_tokens.api.js';

export const useRefresh_tokens = ({ initialParams = { limit: 10, page: 1 } }) => {
	const queryClient = useQueryClient();
	const [params, setParams] = useState(initialParams);
	const { limit, page } = params;

	const { data: refresh_tokens, isLoading, isError, error } = useQuery({
		queryKey: ['refresh_tokens', limit, page],
		queryFn: () => fetchAllrefresh_tokens({ limit, page }),
		staleTime: 5 * 60 * 1000,
		keepPreviousData: true,
		retry: 1,
	});

	const createMutation = useMutation({
		mutationFn: createrefresh_tokens,
		onMutate: async (newrefresh_tokens) => {
			await queryClient.cancelQueries(['refresh_tokens', limit, page]);
			const previousData = queryClient.getQueryData(['refresh_tokens', limit, page]);
			queryClient.setQueryData(['refresh_tokens', limit, page], (old) => {
				return { ...old, data: [...(old?.data || []), newrefresh_tokens] };
			});
			return { previousData };
		},
		onError: (err, newrefresh_tokens, context) => {
			queryClient.setQueryData(['refresh_tokens', limit, page], context.previousData);
		},
		onSettled: () => queryClient.invalidateQueries(['refresh_tokens', limit, page]),
	});

	const updateMutation = useMutation({
		mutationFn: ({ id, refresh_tokens }) => updaterefresh_tokens(id, refresh_tokens),
		onMutate: async ({ id, refresh_tokens }) => {
			await queryClient.cancelQueries(['refresh_tokens', limit, page]);
			const previousData = queryClient.getQueryData(['refresh_tokens', limit, page]);
			queryClient.setQueryData(['refresh_tokens', limit, page], (old) => {
				return { ...old, data: old.data.map(item => item.account_id === id ? { ...item, ...refresh_tokens } : item) };
			});
			return { previousData };
		},
		onError: (err, variables, context) => {
			queryClient.setQueryData(['refresh_tokens', limit, page], context.previousData);
		},
		onSettled: () => queryClient.invalidateQueries(['refresh_tokens', limit, page]),
	});

	const deleteMutation = useMutation({
		mutationFn: deleterefresh_tokens,
		onMutate: async (id) => {
			await queryClient.cancelQueries(['refresh_tokens', limit, page]);
			const previousData = queryClient.getQueryData(['refresh_tokens', limit, page]);
			queryClient.setQueryData(['refresh_tokens', limit, page], (old) => {
				return { ...old, data: old.data.filter(item => item.account_id !== id) };
			});
			return { previousData };
		},
		onError: (err, id, context) => {
			queryClient.setQueryData(['refresh_tokens', limit, page], context.previousData);
		},
		onSettled: () => queryClient.invalidateQueries(['refresh_tokens', limit, page]),
	});

	const setPage = (newPage) => setParams(prev => ({ ...prev, page: newPage }));
	const setLimit = (newLimit) => setParams(prev => ({ ...prev, limit: newLimit, page: 1 }));

	return {
		data: refresh_tokens?.data || [],
		meta: refresh_tokens?.meta || {},
		isLoading,
		isError,
		error,
		params,
		setPage,
		setLimit,
		createRefresh_tokensAsync: createMutation.mutateAsync,
		updateRefresh_tokensAsync: updateMutation.mutateAsync,
		deleteRefresh_tokensAsync: deleteMutation.mutateAsync,
		isCreating: createMutation.isLoading,
		isUpdating: updateMutation.isLoading,
		isDeleting: deleteMutation.isLoading,
	};
};
