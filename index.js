/*const http = require('http'); // Import Node.js core module

const host = 'localhost'; // Localhost
const port = 8000; // Port number

// เมื่อเปิด เว็บไปที่ http://localhost:8000/ จะเรียกใช้งาน function requireListener
const requireListener = function (req, res) {
  res.writeHead(200);
  res.end('My first server!');
}

const server = http.createServer(requireListener);
server.listen(port, host, () => {
          console.log(`Server is running on http://${host}:${port}`);
});*/

const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const app = express();
const port = 8000;

app.use(bodyParser.json());

let users = []

let conn = null
const initMySQL = async () => {
  conn = await mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'webdb',
    port: 8820
  })
}

/*
app.get('/testdbnew', async (req, res) => {

  try {
      const result = await conn.query('SELECT * FROM users')
      res.json(result[0])
  } catch (error) {
      console.log('error', error.message)
      res.status(500).json({error: 'Error fetching users'})
  }
})
*/

/*
GET /users สำหรับ get users ทั้งหมดที่บันทึกไว้
POST /users สำหรับสร้าง users ใหม่บันทึกเข้าไป
GET /users/:id สำหรับดึง users รายคนออกมา
PUT /users/:id สำหรับแก้ไข users รายคน (ตาม id ที่บันทุกเข้าไป)
DELETE /users/:id สำหรับลบ users รายคน (ตาม id ที่บันทุกเข้าไป)
*/

//path: GET /users สำหรับแสดงข้อมูล user ทั้งหมดที่บันทึกไว้
app.get('/users', async (req, res) => {
  const result = await conn.query('SELECT * FROM users')
  res.json(result[0])
})

//path: POST /users ใช้สำหรับสร้างข้อมูล user ใหม่บันทึกเข้าไป
app.post('/users', async (req, res) => {
  let user = req.body;
  const result = await conn.query('INSERT INTO users SET ?', user)
  console.log('result', result)
  res.json({
    message: 'Create user successfully',
    data: result[0]
  })
})

//path: GET /users/:id สำหรับดึง user รายคนออกมา
app.get('/users/:id', (req, res) => {
  let id = req.params.id;
  // ค้นหา user หรือ index ที่ต้องการดึงข้อมูล
  let selectedIndex = users.findIndex(user => user.id == id)
  res.json(users[selectedIndex])
})

//path: PUT /user/:id ใช้สำหรับแก้ไขข้อมูล user โดยใช้ id เป็นตัวระบุ
app.put('/user/:id', (req, res) => {
  let id = req.params.id;
  let updateUser = req.body;

  // ค้นหา user ที่ต้องการแก้ไข
  let selectedIndex = users.findIndex(user => user.id == id )

  users[selectedIndex].firstname = updateUser.firstname || users[selectedIndex].firstname
  users[selectedIndex].lastname = updateUser.lastname || users[selectedIndex].lastname
  users[selectedIndex].age = updateUser.age || users[selectedIndex].age
  users[selectedIndex].gender = updateUser.gender || users[selectedIndex].gender

  res.json({
    message: 'Update user successfully.',
    data: {
      user: updateUser,
      indexUpdated: selectedIndex
    }
  })
})

//path: DELETE /user/:id ใช้สำหรับลบข้อมูล user โดยใช้ id เป็นตัวระบุ
app.delete('/user/:id', (req, res) => {
  let id = req.params.id;

  //หา index ของ user ที่ต้องการลบ
  let selectedIndex = users.findIndex(user => user.id == id)

  //ลบ
  users.splice(selectedIndex, 1)
  res.json({
    message: 'Delete user successfully.',
    indexDeleted: selectedIndex
  })
})

app.listen(port, async (req, res) => {
  await initMySQL()
  console.log('Http Server is running on port' + port);
});