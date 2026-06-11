import pool from "../lib/db.js";
import { AppError } from "../middleware/error.middleware.js";

// ---------------------------------------------------------------------------
// Helper — map a raw DB row to a camelCase object the frontend expects.
// ---------------------------------------------------------------------------
function toApp(row) {
  return {
    id: row.id,
    company: row.company,
    role: row.role,
    location: row.location,
    status: row.status,
    priority: row.priority,
    jobUrl: row.job_url,
    jobType: row.job_type,
    salary: row.salary,
    notes: row.notes,
    dateApplied: row.date_applied,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// ── Get all ─────────────────────────────────────────────────────────────────
export async function getAll(userId) {
  const [rows] = await pool.query(
    `SELECT * FROM applications WHERE user_id = ? ORDER BY created_at DESC`,
    [userId],
  );
  return rows.map(toApp);
}

// ── Get one ─────────────────────────────────────────────────────────────────
export async function getOne(userId, id) {
  const [rows] = await pool.query(
    `SELECT * FROM applications WHERE id = ? AND user_id = ?`,
    [id, userId],
  );
  if (!rows[0]) throw new AppError("Application not found", 404);
  return toApp(rows[0]);
}

// ── Create ──────────────────────────────────────────────────────────────────
export async function create(userId, data) {
  const {
    company,
    role,
    location,
    status,
    priority,
    jobUrl,
    jobType,
    salary,
    notes,
    dateApplied,
  } = data;

  const [result] = await pool.query(
    `INSERT INTO applications
       (user_id, company, role, location, status, priority,
        job_url, job_type, salary, notes, date_applied)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      userId,
      company,
      role,
      location ?? null,
      status ?? "Applied",
      priority ?? "Medium",
      jobUrl || null,
      jobType ?? null,
      salary ?? null,
      notes ?? null,
      dateApplied ?? null,
    ],
  );

  return getOne(userId, result.insertId);
}

// ── Update ──────────────────────────────────────────────────────────────────
export async function update(userId, id, data) {
  // Ensure it exists and belongs to this user first
  await getOne(userId, id);

  const fields = [];
  const values = [];

  const MAP = {
    company: "company",
    role: "role",
    location: "location",
    status: "status",
    priority: "priority",
    jobUrl: "job_url",
    jobType: "job_type",
    salary: "salary",
    notes: "notes",
    dateApplied: "date_applied",
  };

  for (const [key, col] of Object.entries(MAP)) {
    if (data[key] !== undefined) {
      // console.log(`Updating ${col} to ${data[key]}`);
      fields.push(`${col} = ?`);
      values.push(data[key] === '' ? null : data[key]);
    }
  }

  if (fields.length === 0) throw new AppError("No fields to update", 422);

  values.push(id, userId);
  await pool.query(
    `UPDATE applications SET ${fields.join(", ")} WHERE id = ? AND user_id = ?`,
    values,
  );

  return getOne(userId, id);
}

// ── Delete ──────────────────────────────────────────────────────────────────
export async function remove(userId, id) {
  await getOne(userId, id);
  await pool.query(`DELETE FROM applications WHERE id = ? AND user_id = ?`, [
    id,
    userId,
  ]);
}

// ── Stats (for dashboard) ───────────────────────────────────────────────────
export async function getStats(userId) {
  const [rows] = await pool.query(
    `SELECT status, COUNT(*) AS count
     FROM applications
     WHERE user_id = ?
     GROUP BY status`,
    [userId],
  );

  const counts = {
    Saved: 0,
    Applied: 0,
    Assessment: 0,
    Interview: 0,
    Offer: 0,
    Rejected: 0,
  };
  for (const row of rows) counts[row.status] = Number(row.count);
  const total = Object.values(counts).reduce((a, b) => a + b, 0);

  return { total, ...counts };
}
