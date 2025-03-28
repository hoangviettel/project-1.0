import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchAlltransactions, fetchtransactionsById, createtransactions, updatetransactions, deletetransactions } from '../api/transactions.api.js';

export const useTransactions = ({ initialParams = { limit: 10, page: 1 } }) => {
	const queryClient = useQueryClient();
	const [params, setParams] = useState(initialParams);
	const { limit, page } = params;

	const { data: transactions, isLoading, isError, error } = useQuery({
		queryKey: ['transactions', limit, page],
		queryFn: () => fetchAlltransactions({ limit, page }),
		staleTime: 5 * 60 * 1000,
		keepPreviousData: true,
		retry: 1,
	});

	const createMutation = useMutation({
		mutationFn: createtransactions,
		onMutate: async (newtransactions) => {
			await queryClient.cancelQueries(['transactions', limit, page]);
			const previousData = queryClient.getQueryData(['transactions', limit, page]);
			queryClient.setQueryData(['transactions', limit, page], (old) => {
				return { ...old, data: [...(old?.data || []), newtransactions] };
			});
			return { previousData };
		},
		onError: (err, newtransactions, context) => {
			queryClient.setQueryData(['transactions', limit, page], context.previousData);
		},
		onSettled: () => queryClient.invalidateQueries(['transactions', limit, page]),
	});

	const updateMutation = useMutation({
		mutationFn: ({ id, transactions }) => updatetransactions(id, transactions),
		onMutate: async ({ id, transactions }) => {
			await queryClient.cancelQueries(['transactions', limit, page]);
			const previousData = queryClient.getQueryData(['transactions', limit, page]);
			queryClient.setQueryData(['transactions', limit, page], (old) => {
				return { ...old, data: old.data.map(item => item.account_id === id ? { ...item, ...transactions } : item) };
			});
			return { previousData };
		},
		onError: (err, variables, context) => {
			queryClient.setQueryData(['transactions', limit, page], context.previousData);
		},
		onSettled: () => queryClient.invalidateQueries(['transactions', limit, page]),
	});

	const deleteMutation = useMutation({
		mutationFn: deletetransactions,
		onMutate: async (id) => {
			await queryClient.cancelQueries(['transactions', limit, page]);
			const previousData = queryClient.getQueryData(['transactions', limit, page]);
			queryClient.setQueryData(['transactions', limit, page], (old) => {
				return { ...old, data: old.data.filter(item => item.account_id !== id) };
			});
			return { previousData };
		},
		onError: (err, id, context) => {
			queryClient.setQueryData(['transactions', limit, page], context.previousData);
		},
		onSettled: () => queryClient.invalidateQueries(['transactions', limit, page]),
	});

	const setPage = (newPage) => setParams(prev => ({ ...prev, page: newPage }));
	const setLimit = (newLimit) => setParams(prev => ({ ...prev, limit: newLimit, page: 1 }));

	return {
		data: transactions?.data || [],
		meta: transactions?.meta || {},
		isLoading,
		isError,
		error,
		params,
		setPage,
		setLimit,
		createTransactionsAsync: createMutation.mutateAsync,
		updateTransactionsAsync: updateMutation.mutateAsync,
		deleteTransactionsAsync: deleteMutation.mutateAsync,
		isCreating: createMutation.isLoading,
		isUpdating: updateMutation.isLoading,
		isDeleting: deleteMutation.isLoading,
	};
};
