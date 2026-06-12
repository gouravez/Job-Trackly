-- =============================================================================
-- Migration: Referral Network
-- Adds a user-level referrals table so contacts can exist independently
-- of any single application and be linked across many.
-- Run: paste into MySQL or add to your db:init script.
-- =============================================================================

USE Job_Trackly;

-- ── Referrals (global contact book per user) ──────────────────────────────────
CREATE TABLE IF NOT EXISTS referrals (
  id              INT UNSIGNED  AUTO_INCREMENT PRIMARY KEY,
  user_id         INT UNSIGNED  NOT NULL,

  -- Who they are
  name            VARCHAR(255)  NOT NULL,
  email           VARCHAR(255)  DEFAULT NULL,
  phone           VARCHAR(50)   DEFAULT NULL,
  title           VARCHAR(255)  DEFAULT NULL,   -- e.g. "Senior Engineer"
  company         VARCHAR(255)  DEFAULT NULL,   -- where they currently work
  linkedin        VARCHAR(255)  DEFAULT NULL,

  -- Relationship
  relationship    ENUM('Colleague','Friend','Alumni','Recruiter','Manager','Mentor','Other')
                  NOT NULL DEFAULT 'Other',
  strength        TINYINT UNSIGNED NOT NULL DEFAULT 3
                  CHECK (strength BETWEEN 1 AND 5),  -- 1=weak, 5=strong
  notes           TEXT          DEFAULT NULL,   -- anything extra

  -- Metadata
  last_contacted  DATE          DEFAULT NULL,
  created_at      TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at      TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP
                  ON UPDATE CURRENT_TIMESTAMP,

  CONSTRAINT fk_referrals_user
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,

  INDEX idx_referrals_user_id (user_id),
  INDEX idx_referrals_company (company)
);

-- ── Link table: referrals ↔ applications (many-to-many) ──────────────────────
CREATE TABLE IF NOT EXISTS referral_applications (
  referral_id    INT UNSIGNED NOT NULL,
  application_id INT UNSIGNED NOT NULL,
  referred_at    DATE         DEFAULT NULL,   -- when they referred you for this role

  PRIMARY KEY (referral_id, application_id),

  CONSTRAINT fk_refapp_referral
    FOREIGN KEY (referral_id) REFERENCES referrals(id) ON DELETE CASCADE,
  CONSTRAINT fk_refapp_application
    FOREIGN KEY (application_id) REFERENCES applications(id) ON DELETE CASCADE
);