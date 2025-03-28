import { getAllImport_invoices, getImport_invoicesById, createImport_invoices, updateImport_invoices, deleteImport_invoices } from '../services/import_invoices.service.js';
import logger from '../common/logger.js';

export const getAll = async (req, res) => {
	const { limit = 10, page = 1 } = req.query;
	const offset = (page - 1) * limit;
	try {
		const { data, total } = await getAllImport_invoices({ limit: parseInt(limit), offset: parseInt(offset) });
		res.status(200).json({ data, meta: { limit: parseInt(limit), page: parseInt(page), total } });
	} catch (error) {
		logger.error(`Get all import_invoices failed: ${error.message}`, { query: req.query, stack: error.stack });
		if (error.message === 'Database error: ER_NO_SUCH_TABLE') {
			res.status(400).json({ message: 'Table import_invoices does not exist' });
		} else if (error.message.includes('Database error')) {
			res.status(500).json({ message: 'Database error occurred' });
		} else {
			res.status(500).json({ message: `Error fetching import_invoices: ${error.message}` });
		}
	}
};

export const getById = async (req, res) => {
	const { id } = req.params;
	try {
		const data = await getImport_invoicesById(id);
		if (!data) return res.status(404).json({ message: `import_invoices not found with ID: ${id}` });
		res.status(200).json({ data });
	} catch (error) {
		logger.error(`Get import_invoices by ID failed: ${error.message}`, { id, stack: error.stack });
		res.status(500).json({ message: `Error fetching import_invoices: ${error.message}` });
	}
};

export const insert = async (req, res) => {
	const import_invoices = req.body;
	try {
		const data = await createImport_invoices(import_invoices);
		res.status(201).json({ data });
	} catch (error) {
		logger.error(`Insert import_invoices failed: ${error.message}`, { data: import_invoices, stack: error.stack });
		if (error.code === 'ER_DUP_ENTRY') {
			res.status(409).json({ message: `import_invoices already exists` });
		} else if (error.message === 'Data cannot be empty') {
			res.status(400).json({ message: 'Data cannot be empty' });
		} else {
			res.status(400).json({ message: `Error inserting import_invoices: ${error.message}` });
		}
	}
};

export const update = async (req, res) => {
	const { id } = req.params;
	const import_invoices = req.body;
	try {
		const success = await updateImport_invoices(id, import_invoices);
		if (!success) return res.status(404).json({ message: `import_invoices not found with ID: ${id}` });
		res.status(200).json({ message: 'Updated successfully' });
	} catch (error) {
		logger.error(`Update import_invoices failed: ${error.message}`, { id, data: import_invoices, stack: error.stack });
		if (error.message === 'ID is required') {
			res.status(400).json({ message: 'ID is required' });
		} else if (error.message === 'Update data cannot be empty') {
			res.status(400).json({ message: 'Update data cannot be empty' });
		} else {
			res.status(400).json({ message: `Error updating import_invoices: ${error.message}` });
		}
	}
};

export const deleteimport_invoices = async (req, res) => {
	const { id } = req.params;
	try {
		const success = await deleteImport_invoices(id);
		if (!success) return res.status(404).json({ message: `import_invoices not found with ID: ${id}` });
		res.status(200).json({ message: 'Deleted successfully' });
	} catch (error) {
		logger.error(`Delete import_invoices failed: ${error.message}`, { id, stack: error.stack });
		if (error.message === 'ID is required') {
			res.status(400).json({ message: 'ID is required' });
		} else {
			res.status(400).json({ message: `Error deleting import_invoices: ${error.message}` });
		}
	}
};
