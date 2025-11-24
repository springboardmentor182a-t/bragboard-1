import React, { useState } from "react";

// Sample task data
const INIT_TASKS = [
  { id: 1, name: "Prepare quarterly report", deadline: "Today", progress: 70, priority: "High", owner: "Vaishnavi", done: false },
  { id: 2, name: "UI Review Workshop", deadline: "Tomorrow", progress: 20, priority: "Medium", owner: "Rahul", done: false },
  { id: 3, name: "API Integration", deadline: "Friday", progress: 100, priority: "Low", owner: "Priya", done: true },
];

// List of priority colors
const priorityColors = {
  High: "var(--accent)",
  Medium: "#e3a500",
  Low: "#09848e"
};

function Tasks() {
  const [tasks, setTasks] = useState(INIT_TASKS);
  const [newTask, setNewTask] = useState({ name: "", deadline: "", priority: "Medium", owner: "" });

  // Add new task demo
  function handleAddTask(e) {
    e.preventDefault();
    if (!newTask.name) return;
    setTasks([
      ...tasks,
      {
        ...newTask,
        id: tasks.length + 1,
        progress: 0,
        done: false
      }
    ]);
    setNewTask({ name: "", deadline: "", priority: "Medium", owner: "" });
  }

  function markTaskDone(id) {
    setTasks(tasks.map(t => t.id === id ? { ...t, done: !t.done, progress: t.done ? 0 : 100 } : t));
  }

  return (
    <div>
      <h3>Tasks & Projects</h3>

      {/* New task form */}
      <form onSubmit={handleAddTask} style={{ marginBottom: 24, background: "var(--card-bg)", padding: "18px", borderRadius: "8px" }}>
        <strong>Add New Task:</strong><br />
        <input
          type="text"
          placeholder="Task name"
          value={newTask.name}
          onChange={e => setNewTask({ ...newTask, name: e.target.value })}
          style={{ marginRight: 10, width: 120 }}
        />
        <input
          type="text"
          placeholder="Deadline"
          value={newTask.deadline}
          onChange={e => setNewTask({ ...newTask, deadline: e.target.value })}
          style={{ marginRight: 10, width: 90 }}
        />
        <input
          type="text"
          placeholder="Owner"
          value={newTask.owner}
          onChange={e => setNewTask({ ...newTask, owner: e.target.value })}
          style={{ marginRight: 10, width: 90 }}
        />
        <select
          value={newTask.priority}
          onChange={e => setNewTask({ ...newTask, priority: e.target.value })}
          style={{ marginRight: 10 }}
        >
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
        <button type="submit">Add</button>
      </form>

      {/* Task cards */}
      <ul style={{ listStyle: "none", paddingLeft: 0 }}>
        {tasks.map(task => (
          <li key={task.id} style={{
            background: "var(--card-bg)",
            border: "1px solid #89017720",
            borderRadius: "10px",
            padding: "16px 18px",
            marginBottom: "18px",
            color: "var(--text)"
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <strong>{task.name}</strong>
              <span style={{
                fontSize: "0.9em",
                color: priorityColors[task.priority],
                fontWeight: 600,
                border: "1px solid #e6d6fa",
                background: "#e7deff80",
                borderRadius: 6,
                padding: "2px 10px"
              }}>{task.priority} Priority</span>
            </div>
            <div>
              <span>Deadline: <strong>{task.deadline}</strong></span>
              <span style={{ marginLeft: 32 }}>Owner: <strong>{task.owner}</strong></span>
            </div>
            {/* Progress bar */}
            <div style={{
              background: "var(--main-bg)",
              height: "13px",
              borderRadius: "4px",
              marginTop: "10px",
              width: "100%",
              boxShadow: "0 1px 5px #2221"
            }}>
              <div style={{
                background: task.done ? "#098048" : "var(--accent)",
                height: "13px",
                borderRadius: "4px",
                width: `${task.progress}%`,
                transition: "width .4s"
              }}></div>
            </div>
            {/* Status & actions */}
            <div style={{ marginTop: 7 }}>
              <span style={{
                fontSize: "0.95em",
                color: task.done ? "#098048" : (task.progress > 80 ? "#e79b07" : "#800080"),
                fontWeight: 600
              }}>
                {task.done ? "Done" : (
                  task.progress >= 100
                  ? "Ready for review"
                  : task.progress > 80
                  ? "Due Soon"
                  : "In Progress"
                )}
              </span>
              <span style={{ marginLeft: 24 }}>
                <button
                  onClick={() => markTaskDone(task.id)}
                  style={{
                    background: task.done ? "#eee" : "var(--btn-bg)",
                    color: task.done ? "#222" : "#fff",
                    border: "none",
                    borderRadius: "5px",
                    padding: "5px 14px",
                    marginLeft: "8px"
                  }}>
                  {task.done ? "Mark Undone" : "Mark Done"}
                </button>
              </span>
              <span style={{ marginLeft: 18, fontSize: "0.92em", color: "#999" }}>
                Progress: {task.progress}%
              </span>
            </div>
          </li>
        ))}
      </ul>
      <p style={{ marginTop: "5px" }}>
        You can manage tasks, assign priority and owner, update progress, and organize your team projects here.<br />
        Kanban/project board view, meeting scheduling, and subtasks coming soon!
      </p>
    </div>
  );
}

export default Tasks;
