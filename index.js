//const { count } = require("console");
//const { response } = require("express");
const BASE_URL = 'http://localhost:8000'
let mode = 'CREATE' //default mode
let selectedID = ''

window.onload = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id')
    console.log('id', id);
    if (id) {
        mode = 'EDIT'
        selectedID = id

        //1. ดึง user ที่ต้องการแก้ไข
         try {
            const response = await axios.get(`${BASE_URL}/users/${id}`);
            console.log('data', response.data);
            const user = response.data;
            
            //2. นำข้อมูล user ที่ดึงมา ใส่ใน input ที่มี
            let firstNameDOM = document.querySelector("input[name=firstName]")
            let lastNameDOM = document.querySelector("input[name=lastName]")
            let ageDOM = document.querySelector("input[name=age]")
            let descriptionDOM = document.querySelector("textarea[name='description']")

            firstNameDOM.value = user.firstName
            lastNameDOM.value = user.lastName
            ageDOM.value = user.age
            descriptionDOM.value = user.description

            
            let genderDOMs = document.querySelectorAll("input[name=gender]")
            let interestDOMs = document.querySelectorAll("input[name=interest]")

            for (let i =0; i < genderDOMs.length; i++) {
                if (genderDOMs[i].value == user.gender) {
                    genderDOMs[i].checked = true
                }
            }
            
            for (let i =0; i < interestDOMs.length; i++) {
                if (user.interests.includes(interestDOMs[i].value)) {
                    interestDOMs[i].checked = true
                }
            }

         } catch (error) { 
            console.log('error', error);
         }
        
    }
}

const validateData = (userData) => {
    let errors = [];
    if (!userData.firstName) {
        errors.push('กรุณากรอกชื่อ');
    }
    if (!userData.lastName) {
        errors.push('กรุณากรอกนามสกุล');
    }
    if (!userData.age) {
        errors.push('กรุณากรอกอายุ');
    }
    if (!userData.gender) {
        errors.push('กรุณาเลือกเพศ');
    }
    if (!userData.interests) {
        errors.push('กรุณาเลือกงานอดิเรก');
    }
    return errors;
};

const submitData = async () => {
    let firstNameDOM = document.querySelector("input[name=firstName]");
    let lastNameDOM = document.querySelector("input[name=lastName]");
    let ageDOM = document.querySelector("input[name=age]");
    let genderDOM = document.querySelector("input[name=gender]:checked") || {}
    let interestDOMs = document.querySelectorAll("input[name=interest]:checked") || {}
    let descriptionDOM = document.querySelector("textarea[name='description']");

    let messageDOM = document.getElementById('message');
    
    try {
    let interest = '';
    for (let i = 0; i < interestDOMs.length; i++) {
        interest += interestDOMs[i].value 
        if (i != interestDOMs.length - 1) {
            interest += ', '
        }
    }


    let userData = {
        firstName: firstNameDOM.value,
        lastName: lastNameDOM.value,
        age: ageDOM.value,
        gender: genderDOM.value,
        description: descriptionDOM.value,
        interests: interest
    }

    console.log('submitData', userData);

        let message = 'บันทึกข้อมูลเรียบร้อย'
        if (mode == 'CREATE') {
            const response = await axios.post(`${BASE_URL}/users`, userData)
            console.log('response', response.data);

        }else {
            const response = await axios.put(`${BASE_URL}/users/${selectedID}`, userData)
            message = 'แก้ไขข้อมูลเรียบร้อย'
            console.log('response', response.data);
        }

        messageDOM.innerText = message
        messageDOM.className = "message sussess"
      
    } catch (error) {
        console.log('error message', error.message);
        console.log('error', error.errors);

        if (error.response) {
            console.log(error.response);
            error.message = error.response.data.message;
            error.errors = error.response.data.errors;
        }

       
        let htmlData = '<div>';  
        htmlData += '<div>' + error.message + '</div>';
        htmlData += '<ul>';
        
        for (let i = 0; i < error.errors.length; i++) {
            htmlData += '<li>' + error.errors[i] + '</li>';
        }
        htmlData += '</ul>'; 
        htmlData += '</div>';

        messageDOM.innerHTML = htmlData;
        messageDOM.className = 'message danger';
    }

    
}