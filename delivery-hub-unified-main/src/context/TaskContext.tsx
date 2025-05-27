import React, { createContext, useContext, useState, useMemo, ReactNode } from "react";

// Define your Task type
export interface Task {
  id: string;
  title: string;
  status: "active" | "completed";
  // Add other fields as needed
}

// Define context type
interface TaskContextType {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  activeTasks: Task[];
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const TaskProvider = ({ children }: { children: ReactNode }) => {
  const [tasks, setTasks] = useState<Task[]>([]);

  const activeTasks = useMemo(
    () => tasks.filter(task => task.status === "active"),
    [tasks]
  );

  return (
    <TaskContext.Provider value={{ tasks, setTasks, activeTasks }}>
      {children}
    </TaskContext.Provider>
  );
};

export const useTask = (): TaskContextType => {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error("useTask must be used within a TaskProvider");
  }
  return context;
};
