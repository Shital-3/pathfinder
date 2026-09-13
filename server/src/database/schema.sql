CREATE DATABASE IF NOT EXISTS pathfinder
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE pathfinder;

CREATE TABLE IF NOT EXISTS users (
  id CHAR(36) PRIMARY KEY,
  email VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(120) NOT NULL,
  role ENUM('USER', 'ADMIN') NOT NULL DEFAULT 'USER',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS categories (
  id CHAR(36) PRIMARY KEY,
  name VARCHAR(80) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS dilemmas (
  id CHAR(36) PRIMARY KEY,
  slug VARCHAR(160) NOT NULL UNIQUE,
  category_id CHAR(36) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  context TEXT NULL,
  status ENUM('DRAFT', 'PUBLISHED') NOT NULL DEFAULT 'PUBLISHED',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_dilemmas_category FOREIGN KEY (category_id) REFERENCES categories(id),
  INDEX idx_dilemmas_category (category_id),
  INDEX idx_dilemmas_status (status)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS dilemma_options (
  id CHAR(36) PRIMARY KEY,
  dilemma_id CHAR(36) NOT NULL,
  label VARCHAR(120) NOT NULL,
  display_order INT NOT NULL DEFAULT 0,
  CONSTRAINT fk_dilemma_options_dilemma FOREIGN KEY (dilemma_id) REFERENCES dilemmas(id) ON DELETE CASCADE,
  UNIQUE KEY uq_dilemma_option (dilemma_id, label)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS tags (
  id CHAR(36) PRIMARY KEY,
  name VARCHAR(80) NOT NULL UNIQUE,
  slug VARCHAR(100) NOT NULL UNIQUE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS dilemma_tags (
  dilemma_id CHAR(36) NOT NULL,
  tag_id CHAR(36) NOT NULL,
  PRIMARY KEY (dilemma_id, tag_id),
  CONSTRAINT fk_dilemma_tags_dilemma FOREIGN KEY (dilemma_id) REFERENCES dilemmas(id) ON DELETE CASCADE,
  CONSTRAINT fk_dilemma_tags_tag FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS contributors (
  id CHAR(36) PRIMARY KEY,
  user_id CHAR(36) NULL UNIQUE,
  name VARCHAR(120) NOT NULL,
  initials VARCHAR(8) NOT NULL,
  role_title VARCHAR(160) NOT NULL,
  bio TEXT NOT NULL,
  class_year SMALLINT NULL,
  background VARCHAR(255) NULL,
  location VARCHAR(160) NULL,
  verified BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_contributors_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS contributor_tags (
  contributor_id CHAR(36) NOT NULL,
  tag_id CHAR(36) NOT NULL,
  PRIMARY KEY (contributor_id, tag_id),
  CONSTRAINT fk_contributor_tags_contributor FOREIGN KEY (contributor_id) REFERENCES contributors(id) ON DELETE CASCADE,
  CONSTRAINT fk_contributor_tags_tag FOREIGN KEY (tag_id) REFERENCES tags(id) ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS experiences (
  id CHAR(36) PRIMARY KEY,
  author_user_id CHAR(36) NULL,
  contributor_id CHAR(36) NULL,
  dilemma_id CHAR(36) NOT NULL,
  author_name VARCHAR(120) NOT NULL,
  author_role VARCHAR(160) NOT NULL,
  graduation_year SMALLINT NULL,
  decision VARCHAR(120) NOT NULL,
  quote VARCHAR(500) NULL,
  body TEXT NULL,
  background TEXT NOT NULL,
  context TEXT NOT NULL,
  why_choice TEXT NOT NULL,
  what_did TEXT NOT NULL,
  what_worked TEXT NOT NULL,
  what_did_not TEXT NOT NULL,
  what_would_do_differently TEXT NOT NULL,
  outcome TEXT NOT NULL,
  lesson TEXT NOT NULL,
  embedding_json JSON NULL,
  status ENUM('PENDING', 'PUBLISHED', 'REJECTED') NOT NULL DEFAULT 'PENDING',
  moderation_note TEXT NULL,
  reviewed_by CHAR(36) NULL,
  reviewed_at TIMESTAMP NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  CONSTRAINT fk_experiences_author FOREIGN KEY (author_user_id) REFERENCES users(id) ON DELETE SET NULL,
  CONSTRAINT fk_experiences_contributor FOREIGN KEY (contributor_id) REFERENCES contributors(id) ON DELETE SET NULL,
  CONSTRAINT fk_experiences_dilemma FOREIGN KEY (dilemma_id) REFERENCES dilemmas(id),
  CONSTRAINT fk_experiences_reviewer FOREIGN KEY (reviewed_by) REFERENCES users(id) ON DELETE SET NULL,
  INDEX idx_experiences_dilemma_status (dilemma_id, status),
  INDEX idx_experiences_contributor_status (contributor_id, status),
  INDEX idx_experiences_created_at (created_at),
  INDEX idx_experiences_status_created (status, created_at),
  INDEX idx_experiences_dilemma_decision_status (dilemma_id, decision, status)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS dilemma_tradeoffs (
  id CHAR(36) PRIMARY KEY,
  dilemma_id CHAR(36) NOT NULL,
  metric VARCHAR(160) NOT NULL,
  left_value VARCHAR(120) NOT NULL,
  right_value VARCHAR(120) NOT NULL,
  display_order INT NOT NULL DEFAULT 0,
  CONSTRAINT fk_dilemma_tradeoffs_dilemma FOREIGN KEY (dilemma_id) REFERENCES dilemmas(id) ON DELETE CASCADE,
  INDEX idx_dilemma_tradeoffs_order (dilemma_id, display_order)
) ENGINE=InnoDB;
