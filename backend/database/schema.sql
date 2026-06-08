-- =============================================================================
-- Job Trackly — Database Schema
-- Run via:  npm run db:init
-- Reset via: npm run db:reset  (drops and recreates everything)
-- =============================================================================

CREATE DATABASE IF NOT EXISTS Job_Trackly
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE Job_Trackly;

-- ── Users ─────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS users (
  id              INT UNSIGNED  AUTO_INCREMENT PRIMARY KEY,
  first_name      VARCHAR(100)  NOT NULL,
  last_name       VARCHAR(100)  NOT NULL,
  email           VARCHAR(255)  NOT NULL UNIQUE,
  password_hash   VARCHAR(255)  NOT NULL,
  user_type       ENUM('College Student','Recent Graduate','Job Seeker')
                  NOT NULL DEFAULT 'College Student',
  university      VARCHAR(255)  DEFAULT NULL,
  graduation_year YEAR          DEFAULT NULL,
  bio             TEXT          DEFAULT NULL,
  phone           VARCHAR(50)   DEFAULT NULL,
  location        VARCHAR(255)  DEFAULT NULL,
  linkedin        VARCHAR(255)  DEFAULT NULL,
  github          VARCHAR(255)  DEFAULT NULL,
  portfolio       VARCHAR(255)  DEFAULT NULL,
  created_at      TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP
                  ON UPDATE CURRENT_TIMESTAMP
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

  INDEX idx_app_user_id   (user_id),
  INDEX idx_app_status    (status),
  INDEX idx_app_date      (date_applied),
  INDEX idx_app_user_status (user_id, status)   -- covers dashboard stats query
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

-- ── Resumes ────────────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS resumes (
  id             INT UNSIGNED  AUTO_INCREMENT PRIMARY KEY,
  user_id        INT UNSIGNED  NOT NULL,
  application_id INT UNSIGNED  DEFAULT NULL,
  filename       VARCHAR(255)  NOT NULL,   -- stored filename on disk / cloud
  original_name  VARCHAR(255)  NOT NULL,   -- original upload filename
  file_size      INT UNSIGNED  DEFAULT NULL,
  created_at     TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,

  CONSTRAINT fk_resumes_user
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  CONSTRAINT fk_resumes_application
    FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE SET NULL,

  INDEX idx_resumes_user_id (user_id),
  INDEX idx_resumes_app_id  (application_id)
);