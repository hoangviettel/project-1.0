import db from '../common/db.js';
import logger from '../common/logger.js';

class Import_invoices {
	constructor(import_invoices) {
		this.invoice_id = import_invoices.invoice_id;
		this.supplier_id = import_invoices.supplier_id;
		this.staff_id = import_invoices.staff_id;
		this.total_amount = import_invoices.total_amount;
		this.invoice_date = import_invoices.invoice_date;
		this.warehouse_id = import_invoices.warehouse_id;
		this.created_at = import_invoices.created_at;
	}

	static async query(sql, params) {
		try {{
			return await db.query(sql, params);
		}} catch (error) {
			logger.error(`Database query error: ${error.message}`, { sql, params, stack: error.stack });
			throw new Error(`Database error: ${error.message}`);
		}
	}

	static async getAll({ limit = 10, offset = 0 } = {}) {
		const sql = 'SELECT * FROM import_invoices LIMIT ? OFFSET ?';
		const result = await this.query(sql, [limit, offset]);
		return result;
	}

	static async getCount() {
		const sql = 'SELECT COUNT(*) as total FROM import_invoices';
		return await this.query(sql);
	}

	static async getById(id) {
		const sql = 'SELECT * FROM import_invoices WHERE invoice_id = ?';
		const result = await this.query(sql, [id]);
		return result;
	}

	static async insert(import_invoices) {
		const sql = 'INSERT INTO import_invoices SET ?';
		return await this.query(sql, import_invoices);
	}

	static async update(id, import_invoices) {
		const sql = 'UPDATE import_invoices SET ? WHERE invoice_id = ?';
		return await this.query(sql, [import_invoices, id]);
	}

	static async delete(id) {
		const sql = 'DELETE FROM import_invoices WHERE invoice_id = ?';
		return await this.query(sql, [id]);
	}
}

export default Import_invoices;
