import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import './App.css';

const API_URL = 'http://localhost:3000/api';

function App() {
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  const logout = () => {
    setToken('');
    localStorage.removeItem('token');
  };

  return (
    <Router>
      <div>
        <nav style={{ padding: '15px', background: '#333', color: 'white', marginBottom: '20px', display: 'flex', gap: '15px' }}>
          <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>Каталог Курсів</Link>
          <Link to="/programs" style={{ color: 'white', textDecoration: 'none' }}>Програми</Link>
          <Link to="/teachers" style={{ color: 'white', textDecoration: 'none' }}>Викладачі</Link>

          {token && <Link to="/my-courses" style={{ color: '#4CAF50', textDecoration: 'none', fontWeight: 'bold' }}>Мої Курси</Link>}

          <div style={{ marginLeft: 'auto' }}>
            {!token ? (
              <Link to="/login" style={{ color: 'white', textDecoration: 'none' }}>Увійти</Link>
            ) : (
              <button onClick={logout} style={{ background: '#f44336', color: 'white', border: 'none', padding: '5px 10px', cursor: 'pointer' }}>Вийти</button>
            )}
          </div>
        </nav>

        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <Routes>
            <Route path="/" element={<Courses token={token} />} />
            <Route path="/programs" element={<Programs />} />
            <Route path="/teachers" element={<Teachers />} />
            <Route path="/my-courses" element={<MyCourses token={token} />} />
            <Route path="/login" element={<Login setToken={setToken} />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

function Courses({ token }) {
  const [courses, setCourses] = useState([]);
  const [reviewTexts, setReviewTexts] = useState({});
  const [reviewRatings, setReviewRatings] = useState({});

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    const res = await axios.get(`${API_URL}/courses`);
    setCourses(res.data);
  };

  const enroll = async (id) => {
    try {
      const res = await axios.post(`${API_URL}/courses/${id}/enroll`, {}, { headers: { Authorization: `Bearer ${token}` } });
      alert(res.data.message);
    } catch (e) {
      if (e.response && e.response.status === 400) {
        alert(e.response.data.message); // Вже зареєстровані
      } else {
        alert('Помилка! Будь ласка, увійдіть в систему.');
      }
    }
  };

  const submitReview = async (id) => {
    const text = reviewTexts[id] || '';
    const rating = reviewRatings[id] || 5;
    try {
      await axios.post(`${API_URL}/courses/${id}/reviews`,
        { text, rating: Number(rating) },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setReviewTexts({ ...reviewTexts, [id]: '' });
      fetchCourses();
    } catch (e) {
      alert('Помилка авторизації. Увійдіть, щоб залишити відгук.');
    }
  };

  return (
    <div>
      <h2>Каталог доступних курсів</h2>
      {courses.map(c => (
        <div key={c.id} style={{ border: '1px solid #ccc', borderRadius: '8px', margin: '15px 0', padding: '15px', background: '#f9f9f9' }}>
          <h3 style={{ margin: '0 0 10px 0' }}>{c.title} <span style={{ color: '#ff9800' }}>★ {c.rating}</span></h3>
          <p>{c.description}</p>
          <button onClick={() => enroll(c.id)} style={{ padding: '8px 15px', background: '#2196F3', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Записатися на курс</button>

          <div style={{ marginTop: '15px', borderTop: '1px dashed #ccc', paddingTop: '10px' }}>
            <h4>Відгуки:</h4>
            {c.reviews.length === 0 ? <p style={{ color: '#777' }}>Відгуків ще немає.</p> : c.reviews.map((r, i) => <p key={i}><b>{r.user}</b>: {r.text} ({r.rating}★)</p>)}

            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <input placeholder="Ваш відгук" value={reviewTexts[c.id] || ''} onChange={e => setReviewTexts({...reviewTexts, [c.id]: e.target.value})} style={{ flex: 1, padding: '5px' }} />
              <select value={reviewRatings[c.id] || 5} onChange={e => setReviewRatings({...reviewRatings, [c.id]: e.target.value})} style={{ padding: '5px' }}>
                <option value="5">5</option><option value="4">4</option><option value="3">3</option><option value="2">2</option><option value="1">1</option>
              </select>
              <button onClick={() => submitReview(c.id)}>Надіслати</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function MyCourses({ token }) {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    if (token) {
      axios.get(`${API_URL}/my-courses`, { headers: { Authorization: `Bearer ${token}` } })
        .then(res => setCourses(res.data))
        .catch(() => alert('Помилка завантаження ваших курсів'));
    }
  }, [token]);

  if (!token) return <h3>Будь ласка, увійдіть в систему, щоб переглянути свої курси.</h3>;

  return (
    <div>
      <h2>Мої Курси</h2>
      {courses.length === 0 ? <p>Ви ще не записалися на жоден курс.</p> : courses.map(c => (
        <div key={c.id} style={{ border: '2px solid #4CAF50', borderRadius: '8px', margin: '15px 0', padding: '15px' }}>
          <h3 style={{ margin: '0' }}>{c.title}</h3>
          <p>Ви успішно проходите цей курс!</p>
        </div>
      ))}
    </div>
  );
}

function Programs() {
  const [programs, setPrograms] = useState([]);
  useEffect(() => { axios.get(`${API_URL}/programs`).then(res => setPrograms(res.data)); }, []);
  return (
    <div>
      <h2>Навчальні Програми</h2>
      {programs.map(p => (
        <div key={p.id} style={{ border: '1px solid #666', margin: '10px 0', padding: '15px' }}>
          <h3>{p.title}</h3>
          <p>ID курсів у програмі: {p.courses.join(', ')}</p>
        </div>
      ))}
    </div>
  );
}

function Teachers() {
  const [teachers, setTeachers] = useState([]);
  useEffect(() => { axios.get(`${API_URL}/teachers`).then(res => setTeachers(res.data)); }, []);
  return (
    <div>
      <h2>Викладацький склад</h2>
      {teachers.map(t => (
        <div key={t.id} style={{ borderLeft: '4px solid #2196F3', margin: '10px 0', padding: '10px 15px', background: '#f0f8ff' }}>
          <h3 style={{ margin: '0 0 5px 0' }}>{t.name}</h3>
          <p style={{ margin: '0', fontStyle: 'italic' }}>{t.bio}</p>
        </div>
      ))}
    </div>
  );
}

function Login({ setToken }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleAction = async (isLogin) => {
    const endpoint = isLogin ? '/login' : '/register';
    try {
      const res = await axios.post(`${API_URL}${endpoint}`, { username, password });
      if (isLogin) {
        setToken(res.data.accessToken);
        localStorage.setItem('token', res.data.accessToken);
        navigate('/my-courses');
      } else {
        alert('Зареєстровано! Тепер натисніть "Увійти".');
      }
    } catch (e) {
      alert(e.response?.data?.message || 'Помилка з\'єднання');
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '300px', margin: '0 auto', textAlign: 'center' }}>
      <h2>Вхід в систему</h2>
      <input placeholder="Логін" value={username} onChange={e => setUsername(e.target.value)} style={{ width: '100%', padding: '10px', marginBottom: '10px' }} />
      <input type="password" placeholder="Пароль" value={password} onChange={e => setPassword(e.target.value)} style={{ width: '100%', padding: '10px', marginBottom: '10px' }} />
      <button onClick={() => handleAction(true)} style={{ width: '100%', padding: '10px', background: '#2196F3', color: 'white', border: 'none', marginBottom: '10px' }}>Увійти</button>
      <button onClick={() => handleAction(false)} style={{ width: '100%', padding: '10px', background: '#eee', border: '1px solid #ccc' }}>Зареєструватися</button>
    </div>
  );
}

export default App;