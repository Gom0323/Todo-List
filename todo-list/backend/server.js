const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 4000;

app.use(bodyParser.json());
app.use(cors());

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'dltmdwns12',
    database: 'Todo_List'
});

connection.connect((err) => {
    if (err) throw err;
    console.log('Connected to MySQL database');
});

// 특정 날짜의 할 일들을 가져오는 기존 엔드포인트
app.get('/todos/:date', (req, res) => {
    const { date } = req.params;
    console.log(`Fetching todos for date: ${date}`);  // 디버깅용 로그 추가
    connection.query('SELECT * FROM todos WHERE DATE(created_at) = ?', [date], (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).send('Server error');
        } else {
            console.log('Query results:', results);  // 쿼리 결과 출력
            res.json(results);
        }
    });
});

// 모든 할 일 데이터를 가져오는 새로운 엔드포인트 추가
app.get('/todos', (req, res) => {
    console.log(`Fetching all todos`);  // 디버깅용 로그 추가
    connection.query('SELECT * FROM todos', (err, results) => {
        if (err) {
            console.error('Error executing query:', err);
            res.status(500).send('Server error');
        } else {
            console.log('Query results:', results);  // 쿼리 결과 출력
            res.json(results);
        }
    });
});

app.post('/todos', (req, res) => {
    const { text, created_at } = req.body;
    const todo = { text, completed: false, created_at };
    connection.query('INSERT INTO todos SET ?', todo, (err, results) => {
        if (err) throw err;
        res.json({ id: results.insertId, ...todo });
    });
});

app.put('/todos/:id', (req, res) => {
    const { id } = req.params;
    const { completed } = req.body;
    connection.query('UPDATE todos SET completed = ? WHERE id = ?', [completed, id], (err) => {
        if (err) throw err;
        res.sendStatus(200);
    });
});

app.delete('/todos/:id', (req, res) => {
    const { id } = req.params;
    connection.query('DELETE FROM todos WHERE id = ?', [id], (err) => {
        if (err) throw err;
        res.sendStatus(200);
    });
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
