import db from '../common/db.js';
import logger from '../common/logger.js';

class Import_invoice_details {
	constructor(import_invoice_details) {
		this.detail_id = import_invoice_details.detail_id;
		this.invoice_id = import_invoice_details.invoice_id;
		this.product_id = import_invoice_details.product_id;
		this.quantity = import_invoice_details.quantity;
		this.price = import_invoice_details.price;
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
		const sql = 'SELECT * FROM import_invoice_details LIMIT ? OFFSET ?';
		const result = await this.query(sql, [limit, offset]);
		return result;
	}

	static async getCount() {
		const sql = 'SELECT COUNT(*) as total FROM import_invoice_details';
		return await this.query(sql);
	}

	static async getById(id) {
		const sql = 'SELECT * FROM import_invoice_details WHERE detail_id = ?';
		const result = await this.query(sql, [id]);
		return result;
	}

	static async insert(import_invoice_details) {
		const sql = 'INSERT INTO import_invoice_details SET ?';
		return await this.query(sql, import_invoice_details);
	}

	static async update(id, import_invoice_details) {
		const sql = 'UPDATE import_invoice_details SET ? WHERE detail_id = ?';
		return await this.query(sql, [import_invoice_details, id]);
	}

	static async delete(id) {
		const sql = 'DELETE FROM import_invoice_details WHERE detail_id = ?';
		return await this.query(sql, [id]);
	}
}

export default Import_invoice_details;
