import React, { useEffect, useState } from "react";
import TaskList from "./components/TaskList";
import initialTasks from "./data/tasks.json"; // импорт JSON

type TaskType = {
  id: number;
  title: string;
  createdAt: Date;
  content?: string;
  deadline?: string;
  rating?: number;
  hoverRating?: number;
};

const App: React.FC = () => {
  const [tasks, setTasks] = useState<TaskType[]>([]);

  useEffect(() => {
    const loadedTasks: TaskType[] = initialTasks.map((task) => ({
      ...task,
      createdAt: new Date(task.createdAt),
    }));
    setTasks(loadedTasks);
  }, []);

  return (
    <div className="Container">
      <TaskList tasks={tasks} setTasks={setTasks} />
    </div>
  );
};

export default App;
