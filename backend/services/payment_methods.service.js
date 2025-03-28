import Payment_methods from '../models/payment_methods.model.js';
import logger from '../common/logger.js';

export const getAllPayment_methods = async ({ limit = 10, offset = 0 } = {}) => {
	try {
		const [data] = await Payment_methods.getAll({ limit, offset });
		const [countResult] = await Payment_methods.getCount();
		const total = countResult[0].total;
		return { data, total };
	} catch (error) {
		logger.error(`Get all payment_methods failed: ${error.message}`, { stack: error.stack });
		throw error;
	}
};

export const getPayment_methodsById = async (id) => {
	try {
		const [rows] = await Payment_methods.getById(id);
		return rows.length > 0 ? rows[0] : null;
	} catch (error) {
		logger.error(`Get payment_methods by ID failed: ${error.message}`, { id, stack: error.stack });
		throw error;
	}
};

export const createPayment_methods = async (payment_methods) => {
	try {
		if (!payment_methods || Object.keys(payment_methods).length === 0) {
			throw new Error('Data cannot be empty');
		}
		const [result] = await Payment_methods.insert(payment_methods);
		return { id: result.insertId, ...payment_methods };
	} catch (error) {
		logger.error(`Create payment_methods failed: ${error.message}`, { data: payment_methods, stack: error.stack });
		throw error;
	}
};

export const updatePayment_methods = async (id, payment_methods) => {
	try {
		if (!id) throw new Error('ID is required');
		if (!payment_methods || Object.keys(payment_methods).length === 0) {
			throw new Error('Update data cannot be empty');
		}
		const [result] = await Payment_methods.update(id, payment_methods);
		return result.affectedRows > 0;
	} catch (error) {
		logger.error(`Update payment_methods failed: ${error.message}`, { id, data: payment_methods, stack: error.stack });
		throw error;
	}
};

export const deletePayment_methods = async (id) => {
	try {
		if (!id) throw new Error('ID is required');
		const [result] = await Payment_methods.delete(id);
		return result.affectedRows > 0;
	} catch (error) {
		logger.error(`Delete payment_methods failed: ${error.message}`, { id, stack: error.stack });
		throw error;
	}
};
