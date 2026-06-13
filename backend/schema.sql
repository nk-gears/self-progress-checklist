-- Self Progress Checklist – DB Schema
-- Table prefix: spc_
-- Run once on a fresh database. For existing servers, use the ALTER TABLE lines at the bottom.

CREATE TABLE IF NOT EXISTS spc_users (
  id           INT AUTO_INCREMENT PRIMARY KEY,
  email        VARCHAR(255) NOT NULL UNIQUE,
  display_name VARCHAR(255) DEFAULT NULL,
  centre_name  VARCHAR(255) DEFAULT '',
  created_at   TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS spc_tokens (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  user_id    INT NOT NULL,
  token      VARCHAR(64) NOT NULL UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES spc_users(id) ON DELETE CASCADE
);

-- One row per user per day. All checklist items stored as columns for easy querying.
CREATE TABLE IF NOT EXISTS spc_daily_entries (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  user_id     INT NOT NULL,
  entry_date  DATE NOT NULL,

  -- 1. Gyan (Knowledge)
  gyan_murali        TINYINT(1)     NOT NULL DEFAULT 0,
  gyan_murali_stars  TINYINT        NOT NULL DEFAULT 0,  -- 1–5, 0 = not rated
  gyan_revision      TINYINT(1)     NOT NULL DEFAULT 0,

  -- 2. Yog (Yoga)
  yog_amritvela        TINYINT(1)   NOT NULL DEFAULT 0,
  yog_amritvela_stars  TINYINT      NOT NULL DEFAULT 0,
  yog_extra_hours      DECIMAL(4,1) NOT NULL DEFAULT 0,  -- additional yoga hours (10 pts each)
  yog_traffic_control  TINYINT(1)   NOT NULL DEFAULT 0,
  yog_traffic_stars    TINYINT      NOT NULL DEFAULT 0,

  -- 3. Dharana (Sanskar Parivartan)
  dharana_aim            VARCHAR(500) NOT NULL DEFAULT '',
  dharana_morning_pledge TINYINT(1)  NOT NULL DEFAULT 0,
  dharana_night_check    TINYINT(1)  NOT NULL DEFAULT 0,
  dharana_night_stars    TINYINT     NOT NULL DEFAULT 0,

  -- 4. Seva (Service)
  seva_done   TINYINT(1) NOT NULL DEFAULT 0,
  seva_stars  TINYINT    NOT NULL DEFAULT 0,

  total_points INT  NOT NULL DEFAULT 0,
  remarks      TEXT NOT NULL DEFAULT '',

  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  UNIQUE KEY unique_user_date (user_id, entry_date),
  FOREIGN KEY (user_id) REFERENCES spc_users(id) ON DELETE CASCADE
);

-- ── Migrations (run on existing server if schema already exists) ──────────────
-- ALTER TABLE spc_users ADD COLUMN centre_name VARCHAR(255) DEFAULT '';
