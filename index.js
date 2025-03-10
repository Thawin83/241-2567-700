const BASE_URL = "http://localhost:8000";
let mode = "CREATE";
let selectedId = "";

window.onload = async () => {
  const urlPaeams = new URLSearchParams(window.location.search);
  const id = urlParams.get("id");
  console.log("id", id);
  if (id) {
    mode = "EDIT";
    selectedId = id;

    try {
      const response = await axios.get(`${BASE_URL}/users/${id}`);
      const user = response.data;

      let firstnameDOM = document.querySelector("input[name=firstname]");
      let lastnameDOM = document.querySelector("input[name=lastname]");
      let ageDOM = document.querySelector("input[name=age]");
      let genderDOMs = document.querySelector("input[name=gender]:checked");
      let interestDOMs = document.querySelectorAll(
        "input[name=interest]:checked"
      );
      let descriptionDOM = document.querySelector("textarea[name=description]");

      firstnameDOM.value = user.firstname;
      lastnameDOM.value = user.lastname;
      ageDOM.value = user.age;
      descriptionDOM.value = user.description;

      for (let i = 0; i < genderDOMs.length; i++) {
        if (genderDOMs[i].value == user.gender) {
          genderDOMs[i].checked = true;
        }
      }
      for (let i = 0; i < interestDOMs.length; i++) {
        if (user.interests.includes(interestDOMs[i].value)){
            interestDOMs[i].checked = true;
        }   
    }
    
} catch (error) {
      console.log("error", error);
    }
  }
};

const validateData = (userData) => {
  let errors = [];
  if (!userData.firstname) {
    errors.push("กรุณากรอกชื่อ");
  }
  if (!userData.lastname) {
    errors.push("กรุณากรอกนามสกุล");
  }
  if (!userData.age) {
    errors.push("กรุณากรอกอายุ");
  }
  if (!userData.gender) {
    errors.push("กรุณาเลือกเพศ");
  }
  if (!userData.interests) {
    errors.push("กรุณาเลือกความสนใจ");
  }
  if (!userData.description) {
    errors.push("กรุณากรอกคำอธิบาย");
  }
  return errors;
};

const submitData = async () => {
  let firstnameDOM = document.querySelector("input[name=firstname]");
  let lastnameDOM = document.querySelector("input[name=lastname]");
  let ageDOM = document.querySelector("input[name=age]");
  let genderDOM = document.querySelector("input[name=gender]:checked") || {};
  let interestDOM =
    document.querySelectorAll("input[name=interest]:checked") || {};
  let descriptionDOM = document.querySelector("textarea[name=description]");
  let messageDOM = document.getElementById("message");

  try {
    let interest = "";
    for (let i = 0; i < interestDOM.length; i++) {
      interest += interestDOM[i].value;
      if (i != interestDOM.length - 1) {
        interest += ",";
      }
    }

    let userData = {
      firstname: firstnameDOM.value,
      lastname: lastnameDOM.value,
      age: ageDOM.value,
      gender: genderDOM.value,
      description: descriptionDOM.value,
      interests: interest,
    };

    console.log("submitData", userData);

    const errors = validateData(userData); // ตรวจสอบข้อมูล

    if (errors.length > 0) {
      throw {
        message: "กรุณากรอกข้อมูลให้ครบถ้วน",
        errors: errors,
      };
    }
    let message = 'บันทึกข้อมูลเรียบร้อย'
    if (mode == 'CREATE') {
        const response = await axios.post(`${BASE_URL}/users`, userData);
        console.log('response', response.data);
    } else {
        const response = await axios.put(`${BASE_URL}/users/${selectedId}`, userData);
        message = 'แก้ไขข้อมูลสเรียบร้อย'
        console.log('response', response.data);
    }


    messageDOM.innerText = message
    messageDOM.className = 'message success'
  } catch (error) {
    console.log('error message', error.message);
    console.log('error', error.errors);

    // ถ้ามี error.response
    if (error.response) {
      console.log("error.response", error.response.data.message);
      error.message = error.response.data.message;
      error.errors = error.response.data.errors;
    }

    let htmlData = "<div>";
    htmlData += `<div>${error.message}</div>`;
    htmlData += "<ul>";
    for (let i = 0; i < error.errors.length; i++) {
      htmlData += `<li>${error.errors[i]}</li>`;
    }
    htmlData += "</ul>";
    htmlData += "</div>";

    messageDOM.innerHTML = htmlData;
    messageDOM.className = "message danger";
  }
};

const express = require("express");
const bodyParser = require("body-parser");
const mysql = require("mysql2/promise");
const cors = require("cors");

const app = express();

const port = 8000;
app.use(bodyParser.json());

app.use(cors());
let users = [];

let conn = null;
const initMySQL = async () => {
  conn = await mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "root",
    database: "webdb",
    port: 8830,
  });
};

// path = GET /users สำหรับ get users ทั้งหมดที่บันทึกไว้
app.get("/users", async (req, res) => {
  const results = await conn.query("SELECT * FROM users");
  res.json(results[0]);
});

// path = POST /users สำหรับสร้าง users ใหม่บันทึกเข้าไป
app.post("/users", async (req, res) => {
  try {
    let user = req.body;
    const results = await conn.query("INSERT INTO users SET ?", user);
    res.json({
      message: "Create user successfully",
      data: results[0],
    });
  } catch (error) {
    console.error("error: ", error.message);
    res.status(500).json({
      message: "something went wrong",
      errorMessage: error.message,
    });
  }
});

// path = GET /users/:id สำหรับดึง users รายคนออกมา
app.get("/users/:id", async (req, res) => {
  try {
    let id = req.params.id;
    const results = await conn.query("SELECT * FROM users WHERE id = ?", id);
    if (results[0].length > 0) {
      res.json(results[0][0]);
    } else {
      throw new Error("user not found");
    }
    res.json(results[0][0]);
  } catch (error) {
    console.error("error: ", error.message);
    res.status(500).json({
      message: "something went wrong",
      errorMessage: error.message,
    });
  }
});

//path: PUT /users/:id สำหรับแก้ไข users รายคน (ตาม id ที่บันทึกเข้าไป)
app.put("/users/:id", async (req, res) => {
  try {
    let id = req.params.id;
    let updateUser = req.body;
    const results = await conn.query("UPDATE users SET ? WHERE id = ?", [
      updateUser,
      id,
    ]);
    res.json({
      message: "Create user successfully",
      data: results[0],
    });
  } catch (error) {
    console.error("error: ", error.message);
    res.status(500).json({
      message: "something went wrong",
      errorMessage: error.message,
    });
  }
});

//path: DELETE /users/:id สำหรับลบ users รายคน (ตาม id ที่บันทึกเข้าไป)
app.delete("/users/:id", async (req, res) => {
  try {
    let id = req.params.id;
    const results = await conn.query("DELETE users WHERE id = ?", parseInt(id));
    res.json({
      message: "Delete user successfully",
      data: results[0],
    });
  } catch (error) {
    console.error("error: ", error.message);
    res.status(500).json({
      message: "something went wrong",
      errorMessage: error.message,
    });
  }
});
app.listen(port, async (req, res) => {
  await initMySQL();
});
