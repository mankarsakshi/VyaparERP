const { getDB } = require('../database/db');

/**
 * Format Date objects to YYYY-MM-DD string
 */
function formatRowDates(row) {
    if (!row) return row;
    const formatSingle = (val) => {
        if (!val) return val;
        if (val instanceof Date) {
            const y = val.getFullYear();
            const m = String(val.getMonth() + 1).padStart(2, '0');
            const d = String(val.getDate()).padStart(2, '0');
            return `${y}-${m}-${d}`;
        }
        if (typeof val === 'string' && val.length >= 10) {
            return val.substring(0, 10);
        }
        return val;
    };

    return {
        ...row,
        start_date: formatSingle(row.start_date),
        end_date: formatSingle(row.end_date)
    };
}

/**
 * Helper to dynamically calculate current standard Indian Financial Year (1 April - 31 March)
 * from current system date with zero hardcoded dummy values.
 */
function calculateSystemFinancialYear(date = new Date()) {
    const curYear = date.getFullYear();
    const curMonth = date.getMonth() + 1; // 1 to 12

    const startYear = curMonth >= 4 ? curYear : curYear - 1;
    const endYear = startYear + 1;

    const shortStart = String(startYear).slice(-2);
    const shortEnd = String(endYear).slice(-2);

    return {
        fy_name: `${startYear}-${endYear}`,
        fy_code: `FY${shortStart}-${shortEnd}`,
        start_date: `${startYear}-04-01`,
        end_date: `${endYear}-03-31`,
        assessment_year: `${endYear}-${endYear + 1}`,
        is_active: 1,
        is_default: 1,
        is_locked: 0,
        description: 'Auto-detected system default financial year'
    };
}

const FinancialYear = {
    /**
     * Auto-detect or retrieve active financial year:
     * 1. FIRST: If user already has an active chosen default year (is_default = 1), return it.
     * 2. SECOND: If no default is set, auto-detect FY covering current system date (CURDATE()), setting it as default.
     * 3. THIRD: If no FY covers today's system date, calculate 1 April to 31 March FY and insert for new user.
     */
    findOrCreateCurrentFY: async (userId) => {
        const db = getDB();

        // 1. FIRST PRIORITY: Return the user's active/default chosen financial year
        const [defaultRows] = await db.query(
            `SELECT * FROM financial_years WHERE user_id = ? AND is_default = 1 LIMIT 1`,
            [userId]
        );

        if (defaultRows.length > 0) {
            return formatRowDates(defaultRows[0]);
        }

        // 2. SECOND PRIORITY: Match financial year covering current system date
        const [matchingDates] = await db.query(
            `SELECT * FROM financial_years 
             WHERE user_id = ? AND start_date <= CURDATE() AND end_date >= CURDATE() 
             LIMIT 1`,
            [userId]
        );

        if (matchingDates.length > 0) {
            const currentMatch = matchingDates[0];
            await db.query(`UPDATE financial_years SET is_default = 0 WHERE user_id = ?`, [userId]);
            await db.query(`UPDATE financial_years SET is_default = 1 WHERE id = ?`, [currentMatch.id]);
            currentMatch.is_default = 1;
            return formatRowDates(currentMatch);
        }

        // 3. THIRD: If no FY covers today's system date, calculate standard 1 April to 31 March FY
        const calc = calculateSystemFinancialYear(new Date());

        // Check if by name it exists
        const [byName] = await db.query(
            `SELECT * FROM financial_years WHERE user_id = ? AND fy_name = ? LIMIT 1`,
            [userId, calc.fy_name]
        );

        if (byName.length > 0) {
            const match = byName[0];
            await db.query(`UPDATE financial_years SET is_default = 0 WHERE user_id = ?`, [userId]);
            await db.query(`UPDATE financial_years SET is_default = 1 WHERE id = ?`, [match.id]);
            match.is_default = 1;
            return formatRowDates(match);
        }

        // 4. New user: Dynamically insert calculated 1 April to 31 March current FY
        const [insertResult] = await db.query(
            `INSERT INTO financial_years (user_id, fy_name, fy_code, start_date, end_date, assessment_year, is_active, is_default, is_locked, description)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                userId,
                calc.fy_name,
                calc.fy_code,
                calc.start_date,
                calc.end_date,
                calc.assessment_year,
                calc.is_active,
                calc.is_default,
                calc.is_locked,
                calc.description
            ]
        );

        const [created] = await db.query(
            `SELECT * FROM financial_years WHERE id = ?`,
            [insertResult.insertId]
        );

        return formatRowDates(created[0]);
    },

    /**
     * Check if a proposed date range overlaps with any existing financial year for this user
     */
    checkDateOverlap: async (userId, startDate, endDate, excludeId = null) => {
        const db = getDB();
        let sql = `
            SELECT id, fy_name, fy_code, start_date, end_date
            FROM financial_years
            WHERE user_id = ?
              AND start_date <= ?
              AND end_date >= ?
        `;
        const params = [userId, endDate, startDate];

        if (excludeId) {
            sql += ` AND id != ?`;
            params.push(excludeId);
        }

        const [rows] = await db.query(sql, params);
        return rows.map(formatRowDates);
    },

    /**
     * Check duplicate name or code for this user
     */
    checkDuplicate: async (userId, fyName, fyCode, excludeId = null) => {
        const db = getDB();
        let sql = `
            SELECT id, fy_name, fy_code
            FROM financial_years
            WHERE user_id = ?
              AND (LOWER(fy_name) = LOWER(?) OR LOWER(fy_code) = LOWER(?))
        `;
        const params = [userId, fyName ? fyName.trim() : '', fyCode ? fyCode.trim() : ''];

        if (excludeId) {
            sql += ` AND id != ?`;
            params.push(excludeId);
        }

        const [rows] = await db.query(sql, params);
        return rows;
    },

    /**
     * Get all financial years for a user
     */
    getAllFY: async (userId) => {
        const db = getDB();
        const sql = `
            SELECT id, user_id, fy_name, fy_code, start_date, end_date, assessment_year,
                   is_active, is_default, is_locked, description, created_at, updated_at
            FROM financial_years
            WHERE user_id = ?
            ORDER BY start_date DESC
        `;
        const [rows] = await db.query(sql, [userId]);
        return rows.map(formatRowDates);
    },

    /**
     * Get single financial year by ID
     */
    getFYById: async (id, userId) => {
        const db = getDB();
        const sql = `
            SELECT id, user_id, fy_name, fy_code, start_date, end_date, assessment_year,
                   is_active, is_default, is_locked, description, created_at, updated_at
            FROM financial_years
            WHERE id = ? AND user_id = ?
        `;
        const [rows] = await db.query(sql, [id, userId]);
        return rows[0] ? formatRowDates(rows[0]) : null;
    },

    /**
     * Get financial year covering a specific calendar date (YYYY-MM-DD)
     */
    getFYByDate: async (userId, dateStr) => {
        const db = getDB();
        const sql = `
            SELECT id, user_id, fy_name, fy_code, start_date, end_date, assessment_year,
                   is_active, is_default, is_locked, description, created_at, updated_at
            FROM financial_years
            WHERE user_id = ?
              AND start_date <= ?
              AND end_date >= ?
            LIMIT 1
        `;
        const [rows] = await db.query(sql, [userId, dateStr, dateStr]);
        return rows[0] ? formatRowDates(rows[0]) : null;
    },

    /**
     * Get active default financial year
     */
    getActiveFY: async (userId) => {
        const db = getDB();
        const sql = `
            SELECT id, user_id, fy_name, fy_code, start_date, end_date, assessment_year,
                   is_active, is_default, is_locked, description, created_at, updated_at
            FROM financial_years
            WHERE user_id = ? AND is_default = 1
            LIMIT 1
        `;
        const [rows] = await db.query(sql, [userId]);
        return rows[0] ? formatRowDates(rows[0]) : null;
    },

    /**
     * Set a financial year as active default
     */
    setActiveFY: async (id, userId) => {
        const db = getDB();
        // Reset all other records to is_default = 0
        await db.query(`UPDATE financial_years SET is_default = 0 WHERE user_id = ?`, [userId]);
        // Set selected record to is_default = 1
        await db.query(`UPDATE financial_years SET is_default = 1 WHERE id = ? AND user_id = ?`, [id, userId]);

        const [updated] = await db.query(
            `SELECT * FROM financial_years WHERE id = ? AND user_id = ?`,
            [id, userId]
        );
        return updated[0] ? formatRowDates(updated[0]) : null;
    },

    /**
     * Create a new financial year
     */
    createFY: async (userId, data) => {
        const db = getDB();
        const {
            fy_name,
            fy_code,
            start_date,
            end_date,
            assessment_year,
            is_active = 1,
            is_default = 0,
            is_locked = 0,
            description = null
        } = data;

        if (is_default) {
            await db.query(`UPDATE financial_years SET is_default = 0 WHERE user_id = ?`, [userId]);
        }

        const sql = `
            INSERT INTO financial_years
            (user_id, fy_name, fy_code, start_date, end_date, assessment_year, is_active, is_default, is_locked, description)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const [result] = await db.query(sql, [
            userId,
            fy_name.trim(),
            fy_code.trim(),
            start_date,
            end_date,
            assessment_year ? assessment_year.trim() : null,
            is_active ? 1 : 0,
            is_default ? 1 : 0,
            is_locked ? 1 : 0,
            description ? description.trim() : null
        ]);

        const [created] = await db.query(`SELECT * FROM financial_years WHERE id = ?`, [result.insertId]);
        return formatRowDates(created[0]);
    },

    /**
     * Update an existing financial year
     */
    updateFY: async (id, userId, data) => {
        const db = getDB();
        const {
            fy_name,
            fy_code,
            start_date,
            end_date,
            assessment_year,
            is_active,
            is_default,
            is_locked,
            description
        } = data;

        if (is_default) {
            await db.query(`UPDATE financial_years SET is_default = 0 WHERE user_id = ?`, [userId]);
        }

        const sql = `
            UPDATE financial_years
            SET fy_name = COALESCE(?, fy_name),
                fy_code = COALESCE(?, fy_code),
                start_date = COALESCE(?, start_date),
                end_date = COALESCE(?, end_date),
                assessment_year = COALESCE(?, assessment_year),
                is_active = COALESCE(?, is_active),
                is_default = COALESCE(?, is_default),
                is_locked = COALESCE(?, is_locked),
                description = COALESCE(?, description)
            WHERE id = ? AND user_id = ?
        `;

        await db.query(sql, [
            fy_name !== undefined ? fy_name.trim() : null,
            fy_code !== undefined ? fy_code.trim() : null,
            start_date !== undefined ? start_date : null,
            end_date !== undefined ? end_date : null,
            assessment_year !== undefined ? assessment_year : null,
            is_active !== undefined ? (is_active ? 1 : 0) : null,
            is_default !== undefined ? (is_default ? 1 : 0) : null,
            is_locked !== undefined ? (is_locked ? 1 : 0) : null,
            description !== undefined ? description : null,
            id,
            userId
        ]);

        const [updated] = await db.query(`SELECT * FROM financial_years WHERE id = ? AND user_id = ?`, [id, userId]);
        return formatRowDates(updated[0]);
    },

    /**
     * Delete a financial year
     */
    deleteFY: async (id, userId) => {
        const db = getDB();
        const [result] = await db.query(
            `DELETE FROM financial_years WHERE id = ? AND user_id = ?`,
            [id, userId]
        );
        return result.affectedRows > 0;
    }
};

module.exports = FinancialYear;
