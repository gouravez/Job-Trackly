USE Job_Trackly;

ALTER TABLE users
  ADD COLUMN reminder_enabled    TINYINT(1)             NOT NULL DEFAULT 0,
  ADD COLUMN reminder_days       TINYINT UNSIGNED        NOT NULL DEFAULT 7,
  ADD COLUMN reminder_frequency  ENUM('daily','weekly')  NOT NULL DEFAULT 'weekly',
  ADD COLUMN last_reminded_at    TIMESTAMP               NULL     DEFAULT NULL;

CREATE INDEX idx_users_reminder ON users (reminder_enabled, last_reminded_at);