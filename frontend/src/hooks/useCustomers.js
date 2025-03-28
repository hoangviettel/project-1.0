import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchAllcustomers, fetchcustomersById, createcustomers, updatecustomers, deletecustomers } from '../api/customers.api.js';

export const useCustomers = ({ initialParams = { limit: 10, page: 1 } }) => {
	const queryClient = useQueryClient();
	const [params, setParams] = useState(initialParams);
	const { limit, page } = params;

	const { data: customers, isLoading, isError, error } = useQuery({
		queryKey: ['customers', limit, page],
		queryFn: () => fetchAllcustomers({ limit, page }),
		staleTime: 5 * 60 * 1000,
		keepPreviousData: true,
		retry: 1,
	});

	const createMutation = useMutation({
		mutationFn: createcustomers,
		onMutate: async (newcustomers) => {
			await queryClient.cancelQueries(['customers', limit, page]);
			const previousData = queryClient.getQueryData(['customers', limit, page]);
			queryClient.setQueryData(['customers', limit, page], (old) => {
				return { ...old, data: [...(old?.data || []), newcustomers] };
			});
			return { previousData };
		},
		onError: (err, newcustomers, context) => {
			queryClient.setQueryData(['customers', limit, page], context.previousData);
		},
		onSettled: () => queryClient.invalidateQueries(['customers', limit, page]),
	});

	const updateMutation = useMutation({
		mutationFn: ({ id, customers }) => updatecustomers(id, customers),
		onMutate: async ({ id, customers }) => {
			await queryClient.cancelQueries(['customers', limit, page]);
			const previousData = queryClient.getQueryData(['customers', limit, page]);
			queryClient.setQueryData(['customers', limit, page], (old) => {
				return { ...old, data: old.data.map(item => item.account_id === id ? { ...item, ...customers } : item) };
			});
			return { previousData };
		},
		onError: (err, variables, context) => {
			queryClient.setQueryData(['customers', limit, page], context.previousData);
		},
		onSettled: () => queryClient.invalidateQueries(['customers', limit, page]),
	});

	const deleteMutation = useMutation({
		mutationFn: deletecustomers,
		onMutate: async (id) => {
			await queryClient.cancelQueries(['customers', limit, page]);
			const previousData = queryClient.getQueryData(['customers', limit, page]);
			queryClient.setQueryData(['customers', limit, page], (old) => {
				return { ...old, data: old.data.filter(item => item.account_id !== id) };
			});
			return { previousData };
		},
		onError: (err, id, context) => {
			queryClient.setQueryData(['customers', limit, page], context.previousData);
		},
		onSettled: () => queryClient.invalidateQueries(['customers', limit, page]),
	});

	const setPage = (newPage) => setParams(prev => ({ ...prev, page: newPage }));
	const setLimit = (newLimit) => setParams(prev => ({ ...prev, limit: newLimit, page: 1 }));

	return {
		data: customers?.data || [],
		meta: customers?.meta || {},
		isLoading,
		isError,
		error,
		params,
		setPage,
		setLimit,
		createCustomersAsync: createMutation.mutateAsync,
		updateCustomersAsync: updateMutation.mutateAsync,
		deleteCustomersAsync: deleteMutation.mutateAsync,
		isCreating: createMutation.isLoading,
		isUpdating: updateMutation.isLoading,
		isDeleting: deleteMutation.isLoading,
	};
};
