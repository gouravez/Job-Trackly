import bcrypt from "bcryptjs";
import pool from "../lib/db.js";
import { signToken } from "../lib/jwt.js";
import { AppError } from "../middleware/error.middleware.js";

// ---------------------------------------------------------------------------
// All business logic lives here — controllers just call these functions.
// ---------------------------------------------------------------------------

export async function signup({
  firstName,
  lastName,
  email,
  password,
  userType,
  university,
  graduationYear,
}) {
  // 1. Check email not already taken
  const [existing] = await pool.query("SELECT id FROM users WHERE email = ?", [
    email,
  ]);
  if (existing.length > 0) {
    throw new AppError("An account with this email already exists", 409);
  }

  // 2. Hash password
  const passwordHash = await bcrypt.hash(password, 12);

  // 3. Insert user
  const [result] = await pool.query(
    `INSERT INTO users
      (first_name, last_name, email, password_hash, user_type, university, graduation_year)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      firstName,
      lastName,
      email,
      passwordHash,
      userType,
      university ?? null,
      graduationYear ?? null,
    ],
  );

  const userId = result.insertId;

  // 4. Sign token
  const token = signToken({ userId, email });

  return {
    token,
    user: {
      id: userId,
      firstName,
      lastName,
      name: `${firstName} ${lastName}`,
      email,
      userType,
    },
  };
}

export async function signin({ email, password }) {
  // 1. Find user
  const [rows] = await pool.query(
    "SELECT id, first_name, last_name, email, password_hash, user_type FROM users WHERE email = ?",
    [email],
  );

  const user = rows[0];
  if (!user) {
    // Same error for wrong email or wrong password — prevents user enumeration
    throw new AppError("Invalid email or password", 401);
  }

  // 2. Compare password
  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    throw new AppError("Invalid email or password", 401);
  }

  // 3. Sign token
  const token = signToken({ userId: user.id, email: user.email });

  return {
    token,
    user: {
      id: user.id,
      firstName: user.first_name,
      lastName: user.last_name,
      name: `${user.first_name} ${user.last_name}`,
      email: user.email,
      userType: user.user_type,
    },
  };
}

export async function getMe(userId) {
  const [rows] = await pool.query(
    `SELECT
       id, first_name, last_name, email, user_type,
       university, graduation_year, bio, phone,
       location, linkedin, github, portfolio,
       created_at
     FROM users WHERE id = ?`,
    [userId],
  );

  if (!rows[0]) throw new AppError("User not found", 404);

  const u = rows[0];
  return {
    id: u.id,
    firstName: u.first_name,
    lastName: u.last_name,
    email: u.email,
    userType: u.user_type,
    university: u.university,
    graduationYear: u.graduation_year,
    bio: u.bio,
    phone: u.phone,
    location: u.location,
    linkedin: u.linkedin,
    github: u.github,
    portfolio: u.portfolio,
    createdAt: u.created_at,
  };
}