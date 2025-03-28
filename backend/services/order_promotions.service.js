import Order_promotions from '../models/order_promotions.model.js';
import logger from '../common/logger.js';

export const getAllOrder_promotions = async ({ limit = 10, offset = 0 } = {}) => {
	try {
		const [data] = await Order_promotions.getAll({ limit, offset });
		const [countResult] = await Order_promotions.getCount();
		const total = countResult[0].total;
		return { data, total };
	} catch (error) {
		logger.error(`Get all order_promotions failed: ${error.message}`, { stack: error.stack });
		throw error;
	}
};

export const getOrder_promotionsById = async (id) => {
	try {
		const [rows] = await Order_promotions.getById(id);
		return rows.length > 0 ? rows[0] : null;
	} catch (error) {
		logger.error(`Get order_promotions by ID failed: ${error.message}`, { id, stack: error.stack });
		throw error;
	}
};

export const createOrder_promotions = async (order_promotions) => {
	try {
		if (!order_promotions || Object.keys(order_promotions).length === 0) {
			throw new Error('Data cannot be empty');
		}
		const [result] = await Order_promotions.insert(order_promotions);
		return { id: result.insertId, ...order_promotions };
	} catch (error) {
		logger.error(`Create order_promotions failed: ${error.message}`, { data: order_promotions, stack: error.stack });
		throw error;
	}
};

export const updateOrder_promotions = async (id, order_promotions) => {
	try {
		if (!id) throw new Error('ID is required');
		if (!order_promotions || Object.keys(order_promotions).length === 0) {
			throw new Error('Update data cannot be empty');
		}
		const [result] = await Order_promotions.update(id, order_promotions);
		return result.affectedRows > 0;
	} catch (error) {
		logger.error(`Update order_promotions failed: ${error.message}`, { id, data: order_promotions, stack: error.stack });
		throw error;
	}
};

export const deleteOrder_promotions = async (id) => {
	try {
		if (!id) throw new Error('ID is required');
		const [result] = await Order_promotions.delete(id);
		return result.affectedRows > 0;
	} catch (error) {
		logger.error(`Delete order_promotions failed: ${error.message}`, { id, stack: error.stack });
		throw error;
	}
};
