import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchAllpayment_methods, fetchpayment_methodsById, createpayment_methods, updatepayment_methods, deletepayment_methods } from '../api/payment_methods.api.js';

export const usePayment_methods = ({ initialParams = { limit: 10, page: 1 } }) => {
	const queryClient = useQueryClient();
	const [params, setParams] = useState(initialParams);
	const { limit, page } = params;

	const { data: payment_methods, isLoading, isError, error } = useQuery({
		queryKey: ['payment_methods', limit, page],
		queryFn: () => fetchAllpayment_methods({ limit, page }),
		staleTime: 5 * 60 * 1000,
		keepPreviousData: true,
		retry: 1,
	});

	const createMutation = useMutation({
		mutationFn: createpayment_methods,
		onMutate: async (newpayment_methods) => {
			await queryClient.cancelQueries(['payment_methods', limit, page]);
			const previousData = queryClient.getQueryData(['payment_methods', limit, page]);
			queryClient.setQueryData(['payment_methods', limit, page], (old) => {
				return { ...old, data: [...(old?.data || []), newpayment_methods] };
			});
			return { previousData };
		},
		onError: (err, newpayment_methods, context) => {
			queryClient.setQueryData(['payment_methods', limit, page], context.previousData);
		},
		onSettled: () => queryClient.invalidateQueries(['payment_methods', limit, page]),
	});

	const updateMutation = useMutation({
		mutationFn: ({ id, payment_methods }) => updatepayment_methods(id, payment_methods),
		onMutate: async ({ id, payment_methods }) => {
			await queryClient.cancelQueries(['payment_methods', limit, page]);
			const previousData = queryClient.getQueryData(['payment_methods', limit, page]);
			queryClient.setQueryData(['payment_methods', limit, page], (old) => {
				return { ...old, data: old.data.map(item => item.account_id === id ? { ...item, ...payment_methods } : item) };
			});
			return { previousData };
		},
		onError: (err, variables, context) => {
			queryClient.setQueryData(['payment_methods', limit, page], context.previousData);
		},
		onSettled: () => queryClient.invalidateQueries(['payment_methods', limit, page]),
	});

	const deleteMutation = useMutation({
		mutationFn: deletepayment_methods,
		onMutate: async (id) => {
			await queryClient.cancelQueries(['payment_methods', limit, page]);
			const previousData = queryClient.getQueryData(['payment_methods', limit, page]);
			queryClient.setQueryData(['payment_methods', limit, page], (old) => {
				return { ...old, data: old.data.filter(item => item.account_id !== id) };
			});
			return { previousData };
		},
		onError: (err, id, context) => {
			queryClient.setQueryData(['payment_methods', limit, page], context.previousData);
		},
		onSettled: () => queryClient.invalidateQueries(['payment_methods', limit, page]),
	});

	const setPage = (newPage) => setParams(prev => ({ ...prev, page: newPage }));
	const setLimit = (newLimit) => setParams(prev => ({ ...prev, limit: newLimit, page: 1 }));

	return {
		data: payment_methods?.data || [],
		meta: payment_methods?.meta || {},
		isLoading,
		isError,
		error,
		params,
		setPage,
		setLimit,
		createPayment_methodsAsync: createMutation.mutateAsync,
		updatePayment_methodsAsync: updateMutation.mutateAsync,
		deletePayment_methodsAsync: deleteMutation.mutateAsync,
		isCreating: createMutation.isLoading,
		isUpdating: updateMutation.isLoading,
		isDeleting: deleteMutation.isLoading,
	};
};
