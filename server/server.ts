import express from "express";
import sqlite3 from "sqlite3";
import cors from "cors";

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

const db = new sqlite3.Database("./server/data.db", (err) => {
  if (err) console.error("DB connection error:", err.message);
  else console.log("Connected to SQLite database.");
});

db.run(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY,
    title TEXT NOT NULL,
    createdAt TEXT NOT NULL,
    content TEXT,
    deadline TEXT
  )
`);

db.run(`
  CREATE TABLE IF NOT EXISTS ratings (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    taskId INTEGER NOT NULL,
    rating INTEGER NOT NULL,
    FOREIGN KEY (taskId) REFERENCES tasks(id)
  )
`);

type CountRow = { count: number };

db.get<CountRow>("SELECT COUNT(*) as count FROM tasks", (err, row) => {
  if (err) {
    console.error("Ошибка подсчёта задач:", err.message);
    return;
  }
  if (row && row.count === 0) {
    const initialTasks = [
      {
        id: 1,
        title: "Project Topic: Set up the React project.",
        createdAt: "2025-07-10T10:00:00Z",
        content: "Initialize a new React application using either Create React App or Vite...",
        deadline: null,
      },
      {
        id: 2,
        title: "Project Topic: Create components.",
        createdAt: "2025-07-09T09:00:00Z",
        content: "Develop key components such as the task list...",
        deadline: null,
      },
      // Добавь остальные задачи по аналогии
    ];

    const insert = db.prepare(
      `INSERT INTO tasks (id, title, createdAt, content, deadline) VALUES (?, ?, ?, ?, ?)`
    );
    initialTasks.forEach((task) => {
      insert.run(task.id, task.title, task.createdAt, task.content, task.deadline);
    });
    insert.finalize();
    console.log("Initial tasks inserted into database.");
  }
});

// Тип для строки задачи с рейтингом из базы
type TaskRow = {
  id: number;
  title: string;
  createdAt: string;
  content: string | null;
  deadline: string | null;
  avgRating: number | null;
};

// Получить все задачи с усреднённым рейтингом (если есть)
app.get("/api/tasks", (_req, res) => {
  const sql = `
    SELECT t.*, AVG(r.rating) as avgRating
    FROM tasks t
    LEFT JOIN ratings r ON t.id = r.taskId
    GROUP BY t.id
  `;
  db.all<TaskRow[]>(sql, [], (err, rows) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    const tasks = rows.map((row) => ({
      id: row.id,
      title: row.title,
      createdAt: new Date(row.createdAt),
      content: row.content,
      deadline: row.deadline,
      rating: row.avgRating !== null ? Number(row.avgRating) : undefined,
    }));
    res.json(tasks);
  });
});

// Сохранить рейтинг
app.post("/api/ratings", (req, res) => {
  const { taskId, rating } = req.body;
  if (typeof taskId !== "number" || typeof rating !== "number") {
    return res.status(400).json({ error: "Invalid taskId or rating" });
  }
  db.run(
    "INSERT INTO ratings (taskId, rating) VALUES (?, ?)",
    [taskId, rating],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID });
    }
  );
});

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
