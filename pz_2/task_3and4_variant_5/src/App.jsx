import React, { useState } from "react";
import "./App.css";

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userProfile, setUserProfile] = useState({
    username: "",
    password: "",
  });

  const [tasks, setTasks] = useState([]);
  const [newTaskText, setNewTaskText] = useState("");
  const [newTaskTag, setNewTaskTag] = useState("");

  const handleRegister = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    setUserProfile({
      username: formData.get("username"),
      password: formData.get("password"),
    });
    setIsAuthenticated(true);
  };

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    setUserProfile({
      ...userProfile,
      password: formData.get("newPassword"),
    });
    alert("Пароль успішно змінено!");
  };

  const addTask = () => {
    if (newTaskText.trim() === "") return;
    const newTask = {
      id: Date.now(),
      text: newTaskText,
      tag: newTaskTag || "Загальне",
    };
    setTasks([...tasks, newTask]);
    setNewTaskText("");
    setNewTaskTag("");
  };

  if (!isAuthenticated) {
    return (
      <div className="auth-container">
        <h2>Реєстрація (Рівень 4)</h2>
        <form onSubmit={handleRegister}>
          <input name="username" placeholder="Ім'я користувача" required />
          <input
            name="password"
            type="password"
            placeholder="Пароль"
            required
          />
          <button type="submit">Зареєструватися</button>
        </form>
      </div>
    );
  }

  return (
    <div className="board-container">
      <header>
        <h2>Вітаємо, {userProfile.username}!</h2>
        <form onSubmit={handleUpdateProfile} style={{ marginBottom: "20px" }}>
          <input
            name="newPassword"
            type="password"
            placeholder="Новий пароль"
            required
          />
          <button type="submit">Оновити пароль</button>
        </form>
      </header>

      <main>
        <h3>Інтерактивна дошка завдань (Рівень 3)</h3>
        <div className="task-inputs">
          <input
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            placeholder="Опис завдання..."
          />
          <input
            value={newTaskTag}
            onChange={(e) => setNewTaskTag(e.target.value)}
            placeholder="Тег (напр. Терміново)"
          />
          <button onClick={addTask}>Додати завдання</button>
        </div>

        <ul className="task-list">
          {tasks.map((task) => (
            <li
              key={task.id}
              style={{
                border: "1px solid #ccc",
                margin: "10px 0",
                padding: "10px",
              }}
            >
              <strong>{task.text}</strong>
              <span className="task-tag">#{task.tag}</span>
            </li>
          ))}
        </ul>
      </main>
    </div>
  );
}
