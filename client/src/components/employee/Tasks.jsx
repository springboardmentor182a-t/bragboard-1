import React, { useState } from "react";

// Sample task data
const INIT_TASKS = [
  { id: 1, name: "Prepare quarterly report", deadline: "Today", progress: 70, priority: "High", owner: "Vaishnavi", done: false },
  { id: 2, name: "UI Review Workshop", deadline: "Tomorrow", progress: 20, priority: "Medium", owner: "Rahul", done: false },
  { id: 3, name: "API Integration", deadline: "Friday", progress: 100, priority: "Low", owner: "Priya", done: true },
];

const priorityColors = {
  High: "#d32f2f",
  Medium: "#f9a825",
  Low: "#2e7d32"
};

function Tasks() {
  const [tasks, setTasks] = useState(INIT_TASKS);
  const [newTask, setNewTask] = useState({ name: "", deadline: "", priority: "Medium", owner: "" });

  function handleAddTask(e) {
    e.preventDefault();
    if (!newTask.name.trim()) return;

    setTasks([
      ...tasks,
      { ...newTask, id: tasks.length + 1, progress: 0, done: false }
    ]);

    setNewTask({ name: "", deadline: "", priority: "Medium", owner: "" });
  }

  function markTaskDone(id) {
    setTasks(tasks.map(t =>
      t.id === id
        ? { ...t, done: !t.done, progress: t.done ? 0 : 100 }
        : t
    ));
  }

  return (
    <div style={{ paddingRight: 20, color: "#333333" }}>
      <h2 style={{ marginBottom: "18px" }}>🗂️ Tasks & Projects</h2>

      {/* Add New Task Form */}
      <form
        onSubmit={handleAddTask}
        style={{
          padding: "20px",
          background: "#ffffff",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          marginBottom: "30px"
        }}
      >
        <h3 style={{ marginBottom: "10px" }}>Add New Task</h3>

        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <input
            type="text"
            placeholder="Task name"
            value={newTask.name}
            onChange={e => setNewTask({ ...newTask, name: e.target.value })}
            style={inputBox}
          />

          <input
            type="text"
            placeholder="Deadline"
            value={newTask.deadline}
            onChange={e => setNewTask({ ...newTask, deadline: e.target.value })}
            style={inputBox}
          />

          <input
            type="text"
            placeholder="Owner"
            value={newTask.owner}
            onChange={e => setNewTask({ ...newTask, owner: e.target.value })}
            style={inputBox}
          />

          <select
            value={newTask.priority}
            onChange={e => setNewTask({ ...newTask, priority: e.target.value })}
            style={{ ...inputBox, width: 140 }}
          >
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>

          <button
            type="submit"
            style={{
              background: "#6a0dad",
              color: "#fff",
              border: "none",
              padding: "10px 18px",
              borderRadius: "8px",
              cursor: "pointer",
              fontWeight: 600
            }}
          >
            + Add Task
          </button>
        </div>
      </form>

      {/* Task Cards */}
      {tasks.map(task => (
        <div
          key={task.id}
          style={{
            background: "#ffffff",
            padding: "20px",
            borderRadius: "12px",
            marginBottom: "20px",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)"
          }}
        >
          {/* Title Row */}
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <strong style={{ fontSize: "1.1rem" }}>{task.name}</strong>

            <span style={{
              background: priorityColors[task.priority] + "22",
              color: priorityColors[task.priority],
              border: `1px solid ${priorityColors[task.priority]}55`,
              padding: "4px 12px",
              borderRadius: "8px",
              fontWeight: 600,
              fontSize: "0.9em"
            }}>
              {task.priority}
            </span>
          </div>

          {/* Info */}
          <div style={{ marginTop: "6px", color: "#555" }}>
            Deadline: <strong>{task.deadline}</strong>  
            <span style={{ marginLeft: "22px" }}>
              Owner: <strong>{task.owner}</strong>
            </span>
          </div>

          {/* Progress Bar */}
          <div style={{
            marginTop: "12px",
            height: "12px",
            background: "#ececec",
            borderRadius: "6px",
            overflow: "hidden"
          }}>
            <div style={{
              height: "100%",
              width: `${task.progress}%`,
              background: task.done ? "#2e7d32" : "#6a0dad",
              transition: "0.3s"
            }}></div>
          </div>

          {/* Status Row */}
          <div style={{ marginTop: "10px" }}>
            <span style={{
              fontWeight: 600,
              color: task.done ? "#2e7d32" : task.progress > 80 ? "#e3a500" : "#6a0dad"
            }}>
              {task.done
                ? "Completed"
                : task.progress >= 100 ? "Ready for Review"
                : task.progress > 80 ? "Due Soon"
                : "In Progress"}
            </span>

            <button
              onClick={() => markTaskDone(task.id)}
              style={{
                marginLeft: "20px",
                background: task.done ? "#ccc" : "#6a0dad",
                color: task.done ? "#000" : "#fff",
                border: "none",
                borderRadius: "6px",
                padding: "6px 16px",
                cursor: "pointer",
                fontWeight: 600
              }}
            >
              {task.done ? "Mark Undone" : "Mark Done"}
            </button>

            <span style={{ marginLeft: "20px", color: "#777" }}>
              Progress: {task.progress}%
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

const inputBox = {
  padding: "10px",
  borderRadius: "8px",
  border: "1px solid #ddd",
  width: 160,
  fontSize: "0.9rem"
};

export default Tasks;
