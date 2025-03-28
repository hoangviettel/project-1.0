import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchAllusers, fetchusersById, createusers, updateusers, deleteusers } from '../api/users.api.js';

export const useUsers = ({ initialParams = { limit: 10, page: 1 } }) => {
	const queryClient = useQueryClient();
	const [params, setParams] = useState(initialParams);
	const { limit, page } = params;

	const { data: users, isLoading, isError, error } = useQuery({
		queryKey: ['users', limit, page],
		queryFn: () => fetchAllusers({ limit, page }),
		staleTime: 5 * 60 * 1000,
		keepPreviousData: true,
		retry: 1,
	});

	const createMutation = useMutation({
		mutationFn: createusers,
		onMutate: async (newusers) => {
			await queryClient.cancelQueries(['users', limit, page]);
			const previousData = queryClient.getQueryData(['users', limit, page]);
			queryClient.setQueryData(['users', limit, page], (old) => {
				return { ...old, data: [...(old?.data || []), newusers] };
			});
			return { previousData };
		},
		onError: (err, newusers, context) => {
			queryClient.setQueryData(['users', limit, page], context.previousData);
		},
		onSettled: () => queryClient.invalidateQueries(['users', limit, page]),
	});

	const updateMutation = useMutation({
		mutationFn: ({ id, users }) => updateusers(id, users),
		onMutate: async ({ id, users }) => {
			await queryClient.cancelQueries(['users', limit, page]);
			const previousData = queryClient.getQueryData(['users', limit, page]);
			queryClient.setQueryData(['users', limit, page], (old) => {
				return { ...old, data: old.data.map(item => item.account_id === id ? { ...item, ...users } : item) };
			});
			return { previousData };
		},
		onError: (err, variables, context) => {
			queryClient.setQueryData(['users', limit, page], context.previousData);
		},
		onSettled: () => queryClient.invalidateQueries(['users', limit, page]),
	});

	const deleteMutation = useMutation({
		mutationFn: deleteusers,
		onMutate: async (id) => {
			await queryClient.cancelQueries(['users', limit, page]);
			const previousData = queryClient.getQueryData(['users', limit, page]);
			queryClient.setQueryData(['users', limit, page], (old) => {
				return { ...old, data: old.data.filter(item => item.account_id !== id) };
			});
			return { previousData };
		},
		onError: (err, id, context) => {
			queryClient.setQueryData(['users', limit, page], context.previousData);
		},
		onSettled: () => queryClient.invalidateQueries(['users', limit, page]),
	});

	const setPage = (newPage) => setParams(prev => ({ ...prev, page: newPage }));
	const setLimit = (newLimit) => setParams(prev => ({ ...prev, limit: newLimit, page: 1 }));

	return {
		data: users?.data || [],
		meta: users?.meta || {},
		isLoading,
		isError,
		error,
		params,
		setPage,
		setLimit,
		createUsersAsync: createMutation.mutateAsync,
		updateUsersAsync: updateMutation.mutateAsync,
		deleteUsersAsync: deleteMutation.mutateAsync,
		isCreating: createMutation.isLoading,
		isUpdating: updateMutation.isLoading,
		isDeleting: deleteMutation.isLoading,
	};
};
