const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');

const app = express();
app.use(cors());
app.use(express.json());

const SECRET_KEY = 'super_secret_lab_key';

let users = [];
let enrollments = [];

let courses = [
    { id: 1, title: 'Основи Node.js', description: 'Базовий курс з бекенд розробки', rating: 0, reviews: [] },
    { id: 2, title: 'React для початківців', description: 'Створення SPA додатків', rating: 0, reviews: [] },
    { id: 3, title: 'Просунутий JavaScript', description: 'Замикання, проміси, event loop', rating: 0, reviews: [] },
    { id: 4, title: 'Бази даних MongoDB', description: 'Робота з NoSQL', rating: 0, reviews: [] },
    { id: 5, title: 'Основи Python', description: 'Швидкий старт для розробників', rating: 0, reviews: [] },
    { id: 6, title: 'Архітектура ПЗ', description: 'Паттерни проектування та принципи SOLID', rating: 0, reviews: [] },
    { id: 7, title: 'DevOps для новачків', description: 'Docker, CI/CD, базове налаштування серверів', rating: 0, reviews: [] }
];

let programs = [
    { id: 1, title: 'Fullstack Розробник', courses: [1, 2, 3, 4] },
    { id: 2, title: 'Backend Спеціаліст', courses: [1, 4, 5, 6, 7] }
];

let teachers = [
    { id: 1, name: 'Іван Петренко', bio: 'Senior Node.js Developer, 10 років досвіду' },
    { id: 2, name: 'Олена Коваленко', bio: 'React Lead у великій аутсорс-компанії' },
    { id: 3, name: 'Дмитро Сидоренко', bio: 'DevOps Engineer, фахівець з інфраструктури' }
];

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.sendStatus(401);

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};

app.post('/api/register', (req, res) => {
    const { username, password } = req.body;
    if (users.find(u => u.username === username)) {
        return res.status(400).json({ message: 'Користувач вже існує' });
    }
    const user = { id: users.length + 1, username, password };
    users.push(user);
    res.json({ message: 'Реєстрація успішна' });
});

app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const user = users.find(u => u.username === username && u.password === password);
    if (user) {
        const accessToken = jwt.sign({ username: user.username, id: user.id }, SECRET_KEY);
        res.json({ accessToken });
    } else {
        res.status(401).json({ message: 'Невірний логін або пароль' });
    }
});

app.get('/api/courses', (req, res) => {
    res.json(courses);
});

app.get('/api/programs', (req, res) => {
    res.json(programs);
});

app.get('/api/teachers', (req, res) => {
    res.json(teachers);
});

app.get('/api/my-courses', authenticateToken, (req, res) => {
    const myEnrollments = enrollments.filter(e => e.userId === req.user.id);
    const myCourseIds = myEnrollments.map(e => e.courseId);
    const myCoursesList = courses.filter(c => myCourseIds.includes(c.id));
    res.json(myCoursesList);
});

app.post('/api/courses/:id/enroll', authenticateToken, (req, res) => {
    const courseId = parseInt(req.params.id);

    const alreadyEnrolled = enrollments.find(e => e.userId === req.user.id && e.courseId === courseId);
    if (alreadyEnrolled) {
        return res.status(400).json({ message: 'Ви вже зареєстровані на цьому курсі!' });
    }

    enrollments.push({ userId: req.user.id, courseId });
    res.json({ message: 'Ви успішно записані на курс!' });
});

app.post('/api/courses/:id/reviews', authenticateToken, (req, res) => {
    const courseId = parseInt(req.params.id);
    const { text, rating } = req.body;
    const course = courses.find(c => c.id === courseId);

    if (course) {
        course.reviews.push({ user: req.user.username, text, rating });
        const totalRating = course.reviews.reduce((sum, rev) => sum + rev.rating, 0);
        course.rating = (totalRating / course.reviews.length).toFixed(1);
        res.json({ message: 'Відгук додано', course });
    } else {
        res.status(404).json({ message: 'Курс не знайдено' });
    }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));