## Study Area Schema Update

This update introduces a new table, `focus_sessions`, to store data from the Study Area feature.

### SQL Statement

```sql
CREATE TABLE focus_sessions (
  id TEXT PRIMARY KEY NOT NULL,
  user_id INTEGER NOT NULL,
  start_time INTEGER NOT NULL,
  end_time INTEGER,
  duration INTEGER NOT NULL,
  notes TEXT,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

### Instructions

To apply this update, execute the SQL statement above against your SQLite database. This will create the new `focus_sessions` table, enabling the Study Area feature to store session data.
