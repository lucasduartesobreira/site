CREATE TABLE IF NOT EXISTS posts(
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL CHECK (title != ''),
  subtitle TEXT NOT NULL CHECK (subtitle != ''),
  published_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  last_version INTEGER DEFAULT 1,
  summary TEXT NOT NULL CHECK (title != ''),
  icon TEXT
);

CREATE TABLE IF NOT EXISTS posts_content(
  post_id INTEGER REFERENCES posts(id),
  version INTEGER DEFAULT 1,
  content TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
