import * as SQLite from 'expo-sqlite';

let db;

export const initDatabase = async () => {
  try {
    db = await SQLite.openDatabaseAsync('agenda_nusantara.db');
    
    // Create Tasks table
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS tasks (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        title TEXT NOT NULL,
        description TEXT,
        due_date TEXT,
        category TEXT, -- 'PENTING' or 'BIASA'
        is_completed INTEGER DEFAULT 0
      );
    `);

    // Create Settings table for password
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS settings (
        key TEXT PRIMARY KEY,
        value TEXT
      );
    `);

    // Set default password if not exists
    const result = await db.getFirstAsync('SELECT * FROM settings WHERE key = ?', ['password']);
    if (!result) {
      await db.runAsync('INSERT INTO settings (key, value) VALUES (?, ?)', ['password', 'user']);
    }

    console.log('Database initialized successfully');
    return db;
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

export const getTasks = async () => {
  return await db.getAllAsync('SELECT * FROM tasks ORDER BY id DESC');
};

export const addTask = async (title, description, due_date, category) => {
  return await db.runAsync(
    'INSERT INTO tasks (title, description, due_date, category) VALUES (?, ?, ?, ?)',
    [title, description, due_date, category]
  );
};

export const toggleTaskStatus = async (id, currentStatus) => {
  const newStatus = currentStatus === 0 ? 1 : 0;
  return await db.runAsync('UPDATE tasks SET is_completed = ? WHERE id = ?', [newStatus, id]);
};

export const updatePassword = async (newPassword) => {
  return await db.runAsync('UPDATE settings SET value = ? WHERE key = ?', [newPassword, 'password']);
};

export const getPassword = async () => {
  const result = await db.getFirstAsync('SELECT value FROM settings WHERE key = ?', ['password']);
  return result ? result.value : 'user';
};

export const getSummary = async () => {
  const all = await db.getAllAsync('SELECT category, is_completed FROM tasks');
  
  const summary = {
    totalSelesai: all.filter(t => t.is_completed === 1).length,
    totalBelum: all.filter(t => t.is_completed === 0).length,
    totalPenting: all.filter(t => t.category === 'PENTING').length,
    totalBiasa: all.filter(t => t.category === 'BIASA').length,
    dailyStats: [] // Simplified for now
  };

  return summary;
};
