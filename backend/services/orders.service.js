import Orders from '../models/orders.model.js';
import logger from '../common/logger.js';

export const getAllOrders = async ({ limit = 10, offset = 0 } = {}) => {
	try {
		const [data] = await Orders.getAll({ limit, offset });
		const [countResult] = await Orders.getCount();
		const total = countResult[0].total;
		return { data, total };
	} catch (error) {
		logger.error(`Get all orders failed: ${error.message}`, { stack: error.stack });
		throw error;
	}
};

export const getOrdersById = async (id) => {
	try {
		const [rows] = await Orders.getById(id);
		return rows.length > 0 ? rows[0] : null;
	} catch (error) {
		logger.error(`Get orders by ID failed: ${error.message}`, { id, stack: error.stack });
		throw error;
	}
};

export const createOrders = async (orders) => {
	try {
		if (!orders || Object.keys(orders).length === 0) {
			throw new Error('Data cannot be empty');
		}
		const [result] = await Orders.insert(orders);
		return { id: result.insertId, ...orders };
	} catch (error) {
		logger.error(`Create orders failed: ${error.message}`, { data: orders, stack: error.stack });
		throw error;
	}
};

export const updateOrders = async (id, orders) => {
	try {
		if (!id) throw new Error('ID is required');
		if (!orders || Object.keys(orders).length === 0) {
			throw new Error('Update data cannot be empty');
		}
		const [result] = await Orders.update(id, orders);
		return result.affectedRows > 0;
	} catch (error) {
		logger.error(`Update orders failed: ${error.message}`, { id, data: orders, stack: error.stack });
		throw error;
	}
};

export const deleteOrders = async (id) => {
	try {
		if (!id) throw new Error('ID is required');
		const [result] = await Orders.delete(id);
		return result.affectedRows > 0;
	} catch (error) {
		logger.error(`Delete orders failed: ${error.message}`, { id, stack: error.stack });
		throw error;
	}
};
