-- =============================================================================
-- Job Trackly — Complete Database Schema
-- All tables and columns consolidated from schema.sql + all migration files.
-- Run via:  npm run db:init
-- Reset via: npm run db:reset  (drops and recreates everything)
-- =============================================================================

CREATE DATABASE IF NOT EXISTS Job_Trackly
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE Job_Trackly;

-- ── Users ─────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id                  INT UNSIGNED   AUTO_INCREMENT PRIMARY KEY,
  first_name          VARCHAR(100)   NOT NULL,
  last_name           VARCHAR(100)   NOT NULL,
  email               VARCHAR(255)   NOT NULL UNIQUE,
  password_hash       VARCHAR(255)   NOT NULL,  -- empty string for OAuth-only accounts
  user_type           ENUM('College Student','Recent Graduate','Job Seeker')
                      NOT NULL DEFAULT 'College Student',
  university          VARCHAR(255)   DEFAULT NULL,
  graduation_year     YEAR           DEFAULT NULL,
  bio                 TEXT           DEFAULT NULL,
  phone               VARCHAR(50)    DEFAULT NULL,
  location            VARCHAR(255)   DEFAULT NULL,
  linkedin            VARCHAR(255)   DEFAULT NULL,
  github              VARCHAR(255)   DEFAULT NULL,
  portfolio           VARCHAR(255)   DEFAULT NULL,

  -- Follow-up reminder settings (migration.add.remainders.sql)
  reminder_enabled    TINYINT(1)             NOT NULL DEFAULT 0,
  reminder_days       TINYINT UNSIGNED        NOT NULL DEFAULT 7,
  reminder_frequency  ENUM('daily','weekly')  NOT NULL DEFAULT 'weekly',
  last_reminded_at    TIMESTAMP               NULL     DEFAULT NULL,

  -- Google Calendar integration (migration.gcal.sql)
  gcal_refresh_token  TEXT           NULL DEFAULT NULL,
  gcal_connected      TINYINT(1)     NOT NULL DEFAULT 0,

  created_at          TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at          TIMESTAMP      NOT NULL DEFAULT CURRENT_TIMESTAMP
                      ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_users_reminder (reminder_enabled, last_reminded_at)
);

-- ── Applications ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS applications (
  id           INT UNSIGNED  AUTO_INCREMENT PRIMARY KEY,
  user_id      INT UNSIGNED  NOT NULL,
  company      VARCHAR(255)  NOT NULL,
  role         VARCHAR(255)  NOT NULL,
  location     VARCHAR(255)  DEFAULT NULL,
  status       ENUM('Saved','Applied','Assessment','Interview','Offer','Rejected')
               NOT NULL DEFAULT 'Applied',
  priority     ENUM('Low','Medium','High')
               NOT NULL DEFAULT 'Medium',
  job_url      TEXT          DEFAULT NULL,
  job_type     ENUM('Full-time','Part-time','Internship','Contract','Freelance')
               DEFAULT NULL,
  salary       VARCHAR(100)  DEFAULT NULL,
  notes        TEXT          DEFAULT NULL,
  date_applied DATE          DEFAULT NULL,
  created_at   TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at   TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP
               ON UPDATE CURRENT_TIMESTAMP,

  CONSTRAINT fk_applications_user
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,

  INDEX idx_app_user_id     (user_id),
  INDEX idx_app_status      (status),
  INDEX idx_app_date        (date_applied),
  INDEX idx_app_user_status (user_id, status)  -- covers dashboard stats query
);

-- ── Timeline Events ────────────────────────────────────────────────────────────
-- One row per status change / activity on an application.
CREATE TABLE IF NOT EXISTS timeline_events (
  id             INT UNSIGNED  AUTO_INCREMENT PRIMARY KEY,
  application_id INT UNSIGNED  NOT NULL,
  status         ENUM('Saved','Applied','Assessment','Interview','Offer','Rejected','Note')
                 NOT NULL,
  note           TEXT          DEFAULT NULL,
  event_date     DATE          NOT NULL,
  created_at     TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_timeline_application
    FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE,

  INDEX idx_timeline_app_id (application_id),
  INDEX idx_timeline_date   (event_date)
);

-- ── Contacts ───────────────────────────────────────────────────────────────────
-- Recruiter / hiring-manager linked to an application.
CREATE TABLE IF NOT EXISTS contacts (
  id             INT UNSIGNED  AUTO_INCREMENT PRIMARY KEY,
  application_id INT UNSIGNED  NOT NULL,
  name           VARCHAR(255)  DEFAULT NULL,
  email          VARCHAR(255)  DEFAULT NULL,
  title          VARCHAR(255)  DEFAULT NULL,
  linkedin       VARCHAR(255)  DEFAULT NULL,
  created_at     TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_contacts_application
    FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE,

  INDEX idx_contacts_app_id (application_id)
);

-- ── Email OTPs (signup verification + password reset) ─────────────────────────
CREATE TABLE IF NOT EXISTS email_otps (
  id         INT UNSIGNED  AUTO_INCREMENT PRIMARY KEY,
  email      VARCHAR(255)  NOT NULL UNIQUE,
  otp_hash   VARCHAR(255)  NOT NULL,
  expires_at TIMESTAMP     NOT NULL,
  created_at TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,

  INDEX idx_otp_expires (expires_at)
);

-- ── Resumes ────────────────────────────────────────────────────────────────────
-- Metadata for resume files stored in S3 (migration.s3.sql adds s3_key, mime_type).
CREATE TABLE IF NOT EXISTS resumes (
  id             INT UNSIGNED  AUTO_INCREMENT PRIMARY KEY,
  user_id        INT UNSIGNED  NOT NULL,
  application_id INT UNSIGNED  DEFAULT NULL,
  filename       VARCHAR(255)  NOT NULL,    -- S3 object key (stored filename)
  s3_key         VARCHAR(500)  DEFAULT NULL, -- explicit S3 key (migration.s3.sql)
  original_name  VARCHAR(255)  NOT NULL,    -- original upload filename
  file_size      INT UNSIGNED  DEFAULT NULL,
  mime_type      VARCHAR(100)  DEFAULT NULL, -- migration.s3.sql
  created_at     TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_resumes_user
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_resumes_application
    FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE SET NULL,

  INDEX idx_resumes_user_id (user_id),
  INDEX idx_resumes_app_id  (application_id)
);

-- ── Google Calendar Events ─────────────────────────────────────────────────────
-- Tracks which GCal event IDs were created for each application (migration.gcal.sql).
CREATE TABLE IF NOT EXISTS gcal_events (
  id             INT UNSIGNED  AUTO_INCREMENT PRIMARY KEY,
  user_id        INT UNSIGNED  NOT NULL,
  application_id INT UNSIGNED  NOT NULL,
  event_type     ENUM('Applied','FollowUp','Interview','Offer') NOT NULL,
  gcal_event_id  VARCHAR(255)  NOT NULL,
  created_at     TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_gcal_user
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_gcal_app
    FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE,

  UNIQUE KEY uq_gcal_app_event (application_id, event_type),
  INDEX idx_gcal_user (user_id)
);

-- ── Referrals (global contact book per user) ──────────────────────────────────
CREATE TABLE IF NOT EXISTS referrals (
  id             INT UNSIGNED  AUTO_INCREMENT PRIMARY KEY,
  user_id        INT UNSIGNED  NOT NULL,
  name           VARCHAR(255)  NOT NULL,
  email          VARCHAR(255)  DEFAULT NULL,
  phone          VARCHAR(50)   DEFAULT NULL,
  title          VARCHAR(255)  DEFAULT NULL,
  company        VARCHAR(255)  DEFAULT NULL,
  linkedin       VARCHAR(255)  DEFAULT NULL,
  relationship   ENUM('Colleague','Friend','Alumni','Recruiter','Manager','Mentor','Other')
                 NOT NULL DEFAULT 'Other',
  strength       TINYINT UNSIGNED NOT NULL DEFAULT 3
                 CHECK (strength BETWEEN 1 AND 5),  -- 1 = weak, 5 = strong
  notes          TEXT          DEFAULT NULL,
  last_contacted DATE          DEFAULT NULL,
  created_at     TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at     TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP
                 ON UPDATE CURRENT_TIMESTAMP,

  CONSTRAINT fk_referrals_user
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,

  INDEX idx_referrals_user_id (user_id),
  INDEX idx_referrals_company (company)
);

-- ── Referral ↔ Application link (many-to-many) ────────────────────────────────
CREATE TABLE IF NOT EXISTS referral_applications (
  referral_id    INT UNSIGNED NOT NULL,
  application_id INT UNSIGNED NOT NULL,
  referred_at    DATE         DEFAULT NULL,

  PRIMARY KEY (referral_id, application_id),

  CONSTRAINT fk_refapp_referral
    FOREIGN KEY (referral_id) REFERENCES referrals(id) ON DELETE CASCADE,
  CONSTRAINT fk_refapp_application
    FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE
);

-- ── OAuth one-time codes ───────────────────────────────────────────────────────
-- Short-lived codes issued after Google OAuth. The frontend exchanges a code
-- for the real JWT via POST /api/auth/google/token. Codes expire in 60 s and
-- are deleted on first use so the JWT never appears in a redirect URL.
CREATE TABLE IF NOT EXISTS oauth_codes (
  code       CHAR(64)   NOT NULL PRIMARY KEY,
  token      TEXT       NOT NULL,
  user_json  TEXT       NOT NULL,
  expires_at TIMESTAMP  NOT NULL,

  INDEX idx_oauth_expires (expires_at)
);