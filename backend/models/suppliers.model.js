import db from '../common/db.js';
import logger from '../common/logger.js';

class Suppliers {
	constructor(suppliers) {
		this.supplier_id = suppliers.supplier_id;
		this.supplier_name = suppliers.supplier_name;
		this.contact_name = suppliers.contact_name;
		this.phone = suppliers.phone;
		this.email = suppliers.email;
		this.address = suppliers.address;
		this.created_at = suppliers.created_at;
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
		const sql = 'SELECT * FROM suppliers LIMIT ? OFFSET ?';
		const result = await this.query(sql, [limit, offset]);
		return result;
	}

	static async getCount() {
		const sql = 'SELECT COUNT(*) as total FROM suppliers';
		return await this.query(sql);
	}

	static async getById(id) {
		const sql = 'SELECT * FROM suppliers WHERE supplier_id = ?';
		const result = await this.query(sql, [id]);
		return result;
	}

	static async insert(suppliers) {
		const sql = 'INSERT INTO suppliers SET ?';
		return await this.query(sql, suppliers);
	}

	static async update(id, suppliers) {
		const sql = 'UPDATE suppliers SET ? WHERE supplier_id = ?';
		return await this.query(sql, [suppliers, id]);
	}

	static async delete(id) {
		const sql = 'DELETE FROM suppliers WHERE supplier_id = ?';
		return await this.query(sql, [id]);
	}
}

export default Suppliers;
