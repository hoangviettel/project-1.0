import { getAllSuppliers, getSuppliersById, createSuppliers, updateSuppliers, deleteSuppliers } from '../services/suppliers.service.js';
import logger from '../common/logger.js';

export const getAll = async (req, res) => {
	const { limit = 10, page = 1 } = req.query;
	const offset = (page - 1) * limit;
	try {
		const { data, total } = await getAllSuppliers({ limit: parseInt(limit), offset: parseInt(offset) });
		res.status(200).json({ data, meta: { limit: parseInt(limit), page: parseInt(page), total } });
	} catch (error) {
		logger.error(`Get all suppliers failed: ${error.message}`, { query: req.query, stack: error.stack });
		if (error.message === 'Database error: ER_NO_SUCH_TABLE') {
			res.status(400).json({ message: 'Table suppliers does not exist' });
		} else if (error.message.includes('Database error')) {
			res.status(500).json({ message: 'Database error occurred' });
		} else {
			res.status(500).json({ message: `Error fetching suppliers: ${error.message}` });
		}
	}
};

export const getById = async (req, res) => {
	const { id } = req.params;
	try {
		const data = await getSuppliersById(id);
		if (!data) return res.status(404).json({ message: `suppliers not found with ID: ${id}` });
		res.status(200).json({ data });
	} catch (error) {
		logger.error(`Get suppliers by ID failed: ${error.message}`, { id, stack: error.stack });
		res.status(500).json({ message: `Error fetching suppliers: ${error.message}` });
	}
};

export const insert = async (req, res) => {
	const suppliers = req.body;
	try {
		const data = await createSuppliers(suppliers);
		res.status(201).json({ data });
	} catch (error) {
		logger.error(`Insert suppliers failed: ${error.message}`, { data: suppliers, stack: error.stack });
		if (error.code === 'ER_DUP_ENTRY') {
			res.status(409).json({ message: `suppliers already exists` });
		} else if (error.message === 'Data cannot be empty') {
			res.status(400).json({ message: 'Data cannot be empty' });
		} else {
			res.status(400).json({ message: `Error inserting suppliers: ${error.message}` });
		}
	}
};

export const update = async (req, res) => {
	const { id } = req.params;
	const suppliers = req.body;
	try {
		const success = await updateSuppliers(id, suppliers);
		if (!success) return res.status(404).json({ message: `suppliers not found with ID: ${id}` });
		res.status(200).json({ message: 'Updated successfully' });
	} catch (error) {
		logger.error(`Update suppliers failed: ${error.message}`, { id, data: suppliers, stack: error.stack });
		if (error.message === 'ID is required') {
			res.status(400).json({ message: 'ID is required' });
		} else if (error.message === 'Update data cannot be empty') {
			res.status(400).json({ message: 'Update data cannot be empty' });
		} else {
			res.status(400).json({ message: `Error updating suppliers: ${error.message}` });
		}
	}
};

export const deletesuppliers = async (req, res) => {
	const { id } = req.params;
	try {
		const success = await deleteSuppliers(id);
		if (!success) return res.status(404).json({ message: `suppliers not found with ID: ${id}` });
		res.status(200).json({ message: 'Deleted successfully' });
	} catch (error) {
		logger.error(`Delete suppliers failed: ${error.message}`, { id, stack: error.stack });
		if (error.message === 'ID is required') {
			res.status(400).json({ message: 'ID is required' });
		} else {
			res.status(400).json({ message: `Error deleting suppliers: ${error.message}` });
		}
	}
};
