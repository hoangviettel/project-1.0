import Transactions from '../models/transactions.model.js';
import logger from '../common/logger.js';

export const getAllTransactions = async ({ limit = 10, offset = 0 } = {}) => {
	try {
		const [data] = await Transactions.getAll({ limit, offset });
		const [countResult] = await Transactions.getCount();
		const total = countResult[0].total;
		return { data, total };
	} catch (error) {
		logger.error(`Get all transactions failed: ${error.message}`, { stack: error.stack });
		throw error;
	}
};

export const getTransactionsById = async (id) => {
	try {
		const [rows] = await Transactions.getById(id);
		return rows.length > 0 ? rows[0] : null;
	} catch (error) {
		logger.error(`Get transactions by ID failed: ${error.message}`, { id, stack: error.stack });
		throw error;
	}
};

export const createTransactions = async (transactions) => {
	try {
		if (!transactions || Object.keys(transactions).length === 0) {
			throw new Error('Data cannot be empty');
		}
		const [result] = await Transactions.insert(transactions);
		return { id: result.insertId, ...transactions };
	} catch (error) {
		logger.error(`Create transactions failed: ${error.message}`, { data: transactions, stack: error.stack });
		throw error;
	}
};

export const updateTransactions = async (id, transactions) => {
	try {
		if (!id) throw new Error('ID is required');
		if (!transactions || Object.keys(transactions).length === 0) {
			throw new Error('Update data cannot be empty');
		}
		const [result] = await Transactions.update(id, transactions);
		return result.affectedRows > 0;
	} catch (error) {
		logger.error(`Update transactions failed: ${error.message}`, { id, data: transactions, stack: error.stack });
		throw error;
	}
};

export const deleteTransactions = async (id) => {
	try {
		if (!id) throw new Error('ID is required');
		const [result] = await Transactions.delete(id);
		return result.affectedRows > 0;
	} catch (error) {
		logger.error(`Delete transactions failed: ${error.message}`, { id, stack: error.stack });
		throw error;
	}
};
