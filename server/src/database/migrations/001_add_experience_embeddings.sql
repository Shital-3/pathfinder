USE pathfinder;

-- Idempotent migration for existing Phase 5 databases.
SET @has_embedding = (
  SELECT COUNT(*) FROM information_schema.columns
  WHERE table_schema = DATABASE() AND table_name = 'experiences' AND column_name = 'embedding_json'
);
SET @sql = IF(@has_embedding = 0,
  'ALTER TABLE experiences ADD COLUMN embedding_json JSON NULL AFTER lesson',
  'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @has_status_index = (
  SELECT COUNT(*) FROM information_schema.statistics
  WHERE table_schema = DATABASE() AND table_name = 'experiences' AND index_name = 'idx_experiences_status_created'
);
SET @sql = IF(@has_status_index = 0,
  'CREATE INDEX idx_experiences_status_created ON experiences (status, created_at)',
  'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @has_dilemma_index = (
  SELECT COUNT(*) FROM information_schema.statistics
  WHERE table_schema = DATABASE() AND table_name = 'experiences' AND index_name = 'idx_experiences_dilemma_decision_status'
);
SET @sql = IF(@has_dilemma_index = 0,
  'CREATE INDEX idx_experiences_dilemma_decision_status ON experiences (dilemma_id, decision, status)',
  'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
