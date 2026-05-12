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
        is_completed INTEGER DEFAULT 0,
        completed_at TEXT
      );
    `);

    // Add completed_at column if it doesn't exist (for existing databases)
    try {
      await db.execAsync('ALTER TABLE tasks ADD COLUMN completed_at TEXT');
    } catch (e) {
      // Column might already exist
    }

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
  if (!db) await initDatabase();
  return await db.getAllAsync('SELECT * FROM tasks ORDER BY id DESC');
};

export const addTask = async (title, description, due_date, category) => {
  if (!db) await initDatabase();
  return await db.runAsync(
    'INSERT INTO tasks (title, description, due_date, category) VALUES (?, ?, ?, ?)',
    [title, description, due_date, category]
  );
};

export const toggleTaskStatus = async (id, currentStatus) => {
  if (!db) await initDatabase();
  const newStatus = currentStatus === 0 ? 1 : 0;
  const completedAt = newStatus === 1 ? new Date().toISOString() : null;
  return await db.runAsync(
    'UPDATE tasks SET is_completed = ?, completed_at = ? WHERE id = ?', 
    [newStatus, completedAt, id]
  );
};

export const updatePassword = async (newPassword) => {
  if (!db) await initDatabase();
  return await db.runAsync('UPDATE settings SET value = ? WHERE key = ?', [newPassword, 'password']);
};

export const getPassword = async () => {
  if (!db) await initDatabase();
  const result = await db.getFirstAsync('SELECT value FROM settings WHERE key = ?', ['password']);
  return result ? result.value : 'user';
};

export const getSummary = async () => {
  if (!db) {
    await initDatabase();
  }
  const all = await db.getAllAsync('SELECT * FROM tasks');
  const dailyStats = [];
  
  // Get the current week (Monday to Sunday)
  const current = new Date();
  const dayOfWeek = current.getDay(); // 0 is Sunday
  const diffToMonday = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
  const monday = new Date(current);
  monday.setDate(current.getDate() + diffToMonday);
  monday.setHours(0, 0, 0, 0);

  const days = ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min'];
  
  for (let i = 0; i < 7; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    const localDateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
    const dayName = days[i];
    
    // Filter tasks that are DUE on this day (comparing in local time)
    const tasksDueThisDay = all.filter(t => {
      if (!t.due_date) return false;
      const taskDate = new Date(t.due_date);
      const taskDateStr = `${taskDate.getFullYear()}-${String(taskDate.getMonth() + 1).padStart(2, '0')}-${String(taskDate.getDate()).padStart(2, '0')}`;
      return taskDateStr === localDateStr;
    });

    const count = tasksDueThisDay.length;
    const completedCount = tasksDueThisDay.filter(t => t.is_completed === 1).length;
    
    // Also fix late calculation to use local dates
    const lateCount = tasksDueThisDay.filter(t => {
      if (t.is_completed !== 1 || !t.completed_at) return false;
      return t.completed_at > t.due_date;
    }).length;
    
    const today = new Date();
    const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`;

    dailyStats.push({ 
      day: dayName, 
      count: count, 
      completedCount, 
      lateCount,
      isToday: localDateStr === todayStr
    });
  }

  const summary = {
    totalSelesai: all.filter(t => t.is_completed === 1).length,
    totalBelum: all.filter(t => t.is_completed === 0).length,
    totalPenting: all.filter(t => t.category === 'PENTING').length,
    totalBiasa: all.filter(t => t.category === 'BIASA').length,
    dailyStats
  };

  return summary;
};
