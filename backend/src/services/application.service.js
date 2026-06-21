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
    contactName: row.contact_name,
    contactEmail: row.contact_email,
    contactTitle: row.contact_title,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

// ---------------------------------------------------------------------------
// Default activity-log text per status — used when we auto-record a
// timeline_events row on creation or status change.
// ---------------------------------------------------------------------------
const STATUS_ACTIVITY_TEXT = {
  Saved: "Job saved",
  Applied: "Application submitted",
  Assessment: "Assessment completed",
  Interview: "Status changed to Interview",
  Offer: "Status changed to Offer",
  Rejected: "Status changed to Rejected",
};

async function addTimelineEvent(applicationId, status, note = null) {
  await pool.query(
    `INSERT INTO timeline_events (application_id, status, note, event_date)
     VALUES (?, ?, ?, CURDATE())`,
    [applicationId, status, note ?? STATUS_ACTIVITY_TEXT[status] ?? null],
  );
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
    contactName,
    contactEmail,
    contactTitle,
  } = data;

  const [result] = await pool.query(
    `INSERT INTO applications
       (user_id, company, role, location, status, priority,
        job_url, job_type, salary, notes, date_applied,
        contact_name, contact_email, contact_title)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
      contactName || null,
      contactEmail || null,
      contactTitle || null,
    ],
  );

  const initialStatus = status ?? "Applied";
  await addTimelineEvent(result.insertId, initialStatus);

  return getOne(userId, result.insertId);
}

// ── Timeline (activity history) ─────────────────────────────────────────────
export async function getTimeline(userId, id) {
  await getOne(userId, id); // ownership check + 404 if not found

  const [rows] = await pool.query(
    `SELECT id, status, note, event_date, created_at
     FROM timeline_events
     WHERE application_id = ?
     ORDER BY event_date DESC, created_at DESC`,
    [id],
  );

  return rows.map((r) => ({
    id: r.id,
    status: r.status,
    note: r.note,
    eventDate: r.event_date,
    createdAt: r.created_at,
  }));
}

// ── Update ──────────────────────────────────────────────────────────────────
export async function update(userId, id, data) {
  // Ensure it exists and belongs to this user first
  const existing = await getOne(userId, id);

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
    contactName: "contact_name",
    contactEmail: "contact_email",
    contactTitle: "contact_title",
  };

  for (const [key, col] of Object.entries(MAP)) {
    if (data[key] !== undefined) {
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

  if (data.status !== undefined && data.status !== existing.status) {
    await addTimelineEvent(id, data.status);
  }

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