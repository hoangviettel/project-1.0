import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { fetchAllwarehouses, fetchwarehousesById, createwarehouses, updatewarehouses, deletewarehouses } from '../api/warehouses.api.js';

export const useWarehouses = ({ initialParams = { limit: 10, page: 1 } }) => {
	const queryClient = useQueryClient();
	const [params, setParams] = useState(initialParams);
	const { limit, page } = params;

	const { data: warehouses, isLoading, isError, error } = useQuery({
		queryKey: ['warehouses', limit, page],
		queryFn: () => fetchAllwarehouses({ limit, page }),
		staleTime: 5 * 60 * 1000,
		keepPreviousData: true,
		retry: 1,
	});

	const createMutation = useMutation({
		mutationFn: createwarehouses,
		onMutate: async (newwarehouses) => {
			await queryClient.cancelQueries(['warehouses', limit, page]);
			const previousData = queryClient.getQueryData(['warehouses', limit, page]);
			queryClient.setQueryData(['warehouses', limit, page], (old) => {
				return { ...old, data: [...(old?.data || []), newwarehouses] };
			});
			return { previousData };
		},
		onError: (err, newwarehouses, context) => {
			queryClient.setQueryData(['warehouses', limit, page], context.previousData);
		},
		onSettled: () => queryClient.invalidateQueries(['warehouses', limit, page]),
	});

	const updateMutation = useMutation({
		mutationFn: ({ id, warehouses }) => updatewarehouses(id, warehouses),
		onMutate: async ({ id, warehouses }) => {
			await queryClient.cancelQueries(['warehouses', limit, page]);
			const previousData = queryClient.getQueryData(['warehouses', limit, page]);
			queryClient.setQueryData(['warehouses', limit, page], (old) => {
				return { ...old, data: old.data.map(item => item.account_id === id ? { ...item, ...warehouses } : item) };
			});
			return { previousData };
		},
		onError: (err, variables, context) => {
			queryClient.setQueryData(['warehouses', limit, page], context.previousData);
		},
		onSettled: () => queryClient.invalidateQueries(['warehouses', limit, page]),
	});

	const deleteMutation = useMutation({
		mutationFn: deletewarehouses,
		onMutate: async (id) => {
			await queryClient.cancelQueries(['warehouses', limit, page]);
			const previousData = queryClient.getQueryData(['warehouses', limit, page]);
			queryClient.setQueryData(['warehouses', limit, page], (old) => {
				return { ...old, data: old.data.filter(item => item.account_id !== id) };
			});
			return { previousData };
		},
		onError: (err, id, context) => {
			queryClient.setQueryData(['warehouses', limit, page], context.previousData);
		},
		onSettled: () => queryClient.invalidateQueries(['warehouses', limit, page]),
	});

	const setPage = (newPage) => setParams(prev => ({ ...prev, page: newPage }));
	const setLimit = (newLimit) => setParams(prev => ({ ...prev, limit: newLimit, page: 1 }));

	return {
		data: warehouses?.data || [],
		meta: warehouses?.meta || {},
		isLoading,
		isError,
		error,
		params,
		setPage,
		setLimit,
		createWarehousesAsync: createMutation.mutateAsync,
		updateWarehousesAsync: updateMutation.mutateAsync,
		deleteWarehousesAsync: deleteMutation.mutateAsync,
		isCreating: createMutation.isLoading,
		isUpdating: updateMutation.isLoading,
		isDeleting: deleteMutation.isLoading,
	};
};
