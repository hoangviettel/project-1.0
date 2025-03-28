import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchAllcart_items, createcart_items, updatecart_items, deletecart_items } from '../api/cart_items.api.js';

export const useCart_items = ({ initialParams = { limit: 10, page: 1 } }) => {
	const queryClient = useQueryClient();
	const [params, setParams] = useState(initialParams);
	const { limit, page } = params;

	const { data: cart_items, isLoading, isError, error } = useQuery({
		queryKey: ['cart_items', limit, page],
		queryFn: () => fetchAllcart_items({ limit, page }),
		staleTime: 5 * 60 * 1000,
		keepPreviousData: true,
		retry: 1,
	});

	const createMutation = useMutation({
		mutationFn: createcart_items,
		onMutate: async (newcart_items) => {
			await queryClient.cancelQueries(['cart_items', limit, page]);
			const previousData = queryClient.getQueryData(['cart_items', limit, page]);
			queryClient.setQueryData(['cart_items', limit, page], (old) => {
				return { ...old, data: [...(old?.data || []), newcart_items] };
			});
			return { previousData };
		},
		onError: (err, newcart_items, context) => {
			queryClient.setQueryData(['cart_items', limit, page], context.previousData);
		},
		onSettled: () => queryClient.invalidateQueries(['cart_items', limit, page]),
	});

	const updateMutation = useMutation({
		mutationFn: ({ id, cart_items }) => updatecart_items(id, cart_items),
		onMutate: async ({ id, cart_items }) => {
			await queryClient.cancelQueries(['cart_items', limit, page]);
			const previousData = queryClient.getQueryData(['cart_items', limit, page]);
			queryClient.setQueryData(['cart_items', limit, page], (old) => {
				return { ...old, data: old.data.map(item => item.account_id === id ? { ...item, ...cart_items } : item) };
			});
			return { previousData };
		},
		onError: (err, variables, context) => {
			queryClient.setQueryData(['cart_items', limit, page], context.previousData);
		},
		onSettled: () => queryClient.invalidateQueries(['cart_items', limit, page]),
	});

	const deleteMutation = useMutation({
		mutationFn: deletecart_items,
		onMutate: async (id) => {
			await queryClient.cancelQueries(['cart_items', limit, page]);
			const previousData = queryClient.getQueryData(['cart_items', limit, page]);
			queryClient.setQueryData(['cart_items', limit, page], (old) => {
				return { ...old, data: old.data.filter(item => item.account_id !== id) };
			});
			return { previousData };
		},
		onError: (err, id, context) => {
			queryClient.setQueryData(['cart_items', limit, page], context.previousData);
		},
		onSettled: () => queryClient.invalidateQueries(['cart_items', limit, page]),
	});

	const setPage = (newPage) => setParams(prev => ({ ...prev, page: newPage }));
	const setLimit = (newLimit) => setParams(prev => ({ ...prev, limit: newLimit, page: 1 }));

	return {
		data: cart_items?.data || [],
		meta: cart_items?.meta || {},
		isLoading,
		isError,
		error,
		params,
		setPage,
		setLimit,
		createCart_itemsAsync: createMutation.mutateAsync,
		updateCart_itemsAsync: updateMutation.mutateAsync,
		deleteCart_itemsAsync: deleteMutation.mutateAsync,
		isCreating: createMutation.isLoading,
		isUpdating: updateMutation.isLoading,
		isDeleting: deleteMutation.isLoading,
	};
};
