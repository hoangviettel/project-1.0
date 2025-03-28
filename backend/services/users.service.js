import Users from '../models/users.model.js';
import logger from '../common/logger.js';

export const getAllUsers = async ({ limit = 10, offset = 0 } = {}) => {
	try {
		const [data] = await Users.getAll({ limit, offset });
		const [countResult] = await Users.getCount();
		const total = countResult[0].total;
		return { data, total };
	} catch (error) {
		logger.error(`Get all users failed: ${error.message}`, { stack: error.stack });
		throw error;
	}
};

export const getUsersById = async (id) => {
	try {
		const [rows] = await Users.getById(id);
		return rows.length > 0 ? rows[0] : null;
	} catch (error) {
		logger.error(`Get users by ID failed: ${error.message}`, { id, stack: error.stack });
		throw error;
	}
};

export const createUsers = async (users) => {
	try {
		if (!users || Object.keys(users).length === 0) {
			throw new Error('Data cannot be empty');
		}
		const [result] = await Users.insert(users);
		return { id: result.insertId, ...users };
	} catch (error) {
		logger.error(`Create users failed: ${error.message}`, { data: users, stack: error.stack });
		throw error;
	}
};

export const updateUsers = async (id, users) => {
	try {
		if (!id) throw new Error('ID is required');
		if (!users || Object.keys(users).length === 0) {
			throw new Error('Update data cannot be empty');
		}
		const [result] = await Users.update(id, users);
		return result.affectedRows > 0;
	} catch (error) {
		logger.error(`Update users failed: ${error.message}`, { id, data: users, stack: error.stack });
		throw error;
	}
};

export const deleteUsers = async (id) => {
	try {
		if (!id) throw new Error('ID is required');
		const [result] = await Users.delete(id);
		return result.affectedRows > 0;
	} catch (error) {
		logger.error(`Delete users failed: ${error.message}`, { id, stack: error.stack });
		throw error;
	}
};
