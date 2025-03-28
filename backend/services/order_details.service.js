import Order_details from '../models/order_details.model.js';
import logger from '../common/logger.js';

export const getAllOrder_details = async ({ limit = 10, offset = 0 } = {}) => {
	try {
		const [data] = await Order_details.getAll({ limit, offset });
		const [countResult] = await Order_details.getCount();
		const total = countResult[0].total;
		return { data, total };
	} catch (error) {
		logger.error(`Get all order_details failed: ${error.message}`, { stack: error.stack });
		throw error;
	}
};

export const getOrder_detailsById = async (id) => {
	try {
		const [rows] = await Order_details.getById(id);
		return rows.length > 0 ? rows[0] : null;
	} catch (error) {
		logger.error(`Get order_details by ID failed: ${error.message}`, { id, stack: error.stack });
		throw error;
	}
};

export const createOrder_details = async (order_details) => {
	try {
		if (!order_details || Object.keys(order_details).length === 0) {
			throw new Error('Data cannot be empty');
		}
		const [result] = await Order_details.insert(order_details);
		return { id: result.insertId, ...order_details };
	} catch (error) {
		logger.error(`Create order_details failed: ${error.message}`, { data: order_details, stack: error.stack });
		throw error;
	}
};

export const updateOrder_details = async (id, order_details) => {
	try {
		if (!id) throw new Error('ID is required');
		if (!order_details || Object.keys(order_details).length === 0) {
			throw new Error('Update data cannot be empty');
		}
		const [result] = await Order_details.update(id, order_details);
		return result.affectedRows > 0;
	} catch (error) {
		logger.error(`Update order_details failed: ${error.message}`, { id, data: order_details, stack: error.stack });
		throw error;
	}
};

export const deleteOrder_details = async (id) => {
	try {
		if (!id) throw new Error('ID is required');
		const [result] = await Order_details.delete(id);
		return result.affectedRows > 0;
	} catch (error) {
		logger.error(`Delete order_details failed: ${error.message}`, { id, stack: error.stack });
		throw error;
	}
};
