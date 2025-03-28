import db from '../common/db.js';
import logger from '../common/logger.js';

class Audit_logs {
	constructor(audit_logs) {
		this.log_id = audit_logs.log_id;
		this.table_name = audit_logs.table_name;
		this.action = audit_logs.action;
		this.record_id = audit_logs.record_id;
		this.staff_id = audit_logs.staff_id;
		this.details = audit_logs.details;
		this.created_at = audit_logs.created_at;
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
		const sql = 'SELECT * FROM audit_logs LIMIT ? OFFSET ?';
		const result = await this.query(sql, [limit, offset]);
		return result;
	}

	static async getCount() {
		const sql = 'SELECT COUNT(*) as total FROM audit_logs';
		return await this.query(sql);
	}

	static async getById(id) {
		const sql = 'SELECT * FROM audit_logs WHERE log_id = ?';
		const result = await this.query(sql, [id]);
		return result;
	}

	static async insert(audit_logs) {
		const sql = 'INSERT INTO audit_logs SET ?';
		return await this.query(sql, audit_logs);
	}

	static async update(id, audit_logs) {
		const sql = 'UPDATE audit_logs SET ? WHERE log_id = ?';
		return await this.query(sql, [audit_logs, id]);
	}

	static async delete(id) {
		const sql = 'DELETE FROM audit_logs WHERE log_id = ?';
		return await this.query(sql, [id]);
	}
}

export default Audit_logs;
