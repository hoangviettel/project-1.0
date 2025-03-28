import Customers from '../models/customers.model.js';
import logger from '../common/logger.js';

export const getAllCustomers = async ({ limit = 10, offset = 0 } = {}) => {
	try {
		const [data] = await Customers.getAll({ limit, offset });
		const [countResult] = await Customers.getCount();
		const total = countResult[0].total;
		return { data, total };
	} catch (error) {
		logger.error(`Get all customers failed: ${error.message}`, { stack: error.stack });
		throw error;
	}
};

export const getCustomersById = async (id) => {
	try {
		const [rows] = await Customers.getById(id);
		return rows.length > 0 ? rows[0] : null;
	} catch (error) {
		logger.error(`Get customers by ID failed: ${error.message}`, { id, stack: error.stack });
		throw error;
	}
};

export const createCustomers = async (customers) => {
	try {
		if (!customers || Object.keys(customers).length === 0) {
			throw new Error('Data cannot be empty');
		}
		const [result] = await Customers.insert(customers);
		return { id: result.insertId, ...customers };
	} catch (error) {
		logger.error(`Create customers failed: ${error.message}`, { data: customers, stack: error.stack });
		throw error;
	}
};

export const updateCustomers = async (id, customers) => {
	try {
		if (!id) throw new Error('ID is required');
		if (!customers || Object.keys(customers).length === 0) {
			throw new Error('Update data cannot be empty');
		}
		const [result] = await Customers.update(id, customers);
		return result.affectedRows > 0;
	} catch (error) {
		logger.error(`Update customers failed: ${error.message}`, { id, data: customers, stack: error.stack });
		throw error;
	}
};

export const deleteCustomers = async (id) => {
	try {
		if (!id) throw new Error('ID is required');
		const [result] = await Customers.delete(id);
		return result.affectedRows > 0;
	} catch (error) {
		logger.error(`Delete customers failed: ${error.message}`, { id, stack: error.stack });
		throw error;
	}
};
