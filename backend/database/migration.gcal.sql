USE Job_Trackly;

ALTER TABLE users
  ADD COLUMN gcal_refresh_token TEXT        NULL DEFAULT NULL,
  ADD COLUMN gcal_connected     TINYINT(1)  NOT NULL DEFAULT 0;

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