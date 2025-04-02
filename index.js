const BASE_URL = 'http://localhost:8000';
let mode = 'CREATE'; // default mode
let selectedID = '';

window.onload = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    console.log('id', id);
    
    if (id) {
        mode = 'EDIT';
        selectedID = id;

        // 1. ดึง user ที่ต้องการแก้ไข
        try {
            const response = await axios.get(`${BASE_URL}/users/${id}`);
            console.log('data', response.data);
            const user = response.data;

            // 2. นำข้อมูล user ที่ดึงมา ใส่ใน input ที่มี
            let firstNameDOM = document.querySelector("input[name=firstName]");
            let lastNameDOM = document.querySelector("input[name=lastName]");
            let ageDOM = document.querySelector("input[name=age]");
            let descriptionDOM = document.querySelector("textarea[name='description']");

            firstNameDOM.value = user.firstName;
            lastNameDOM.value = user.lastName;
            ageDOM.value = user.age;
            descriptionDOM.value = user.description;

            // เลือกเพศ
            let genderDOMs = document.querySelectorAll("input[name=gender]");
            let interestDOMs = document.querySelectorAll("input[name=interest]");
            
            genderDOMs.forEach(genderDOM => {
                if (genderDOM.value === user.gender) {
                    genderDOM.checked = true;
                }
            });

            // เลือกงานอดิเรก
            interestDOMs.forEach(interestDOM => {
                if (user.interests.includes(interestDOM.value)) {
                    interestDOM.checked = true;
                }
            });
        } catch (error) {
            console.log('error', error);
            alert('ไม่สามารถดึงข้อมูลผู้ใช้ได้');
        }
    }
};

const validateData = (userData) => {
    let errors = [];
    if (!userData.firstName) errors.push('กรุณากรอกชื่อ');
    if (!userData.lastName) errors.push('กรุณากรอกนามสกุล');
    if (!userData.age) errors.push('กรุณากรอกอายุ');
    if (!userData.gender) errors.push('กรุณาเลือกเพศ');
    if (!userData.interests) errors.push('กรุณาเลือกงานอดิเรก');
    return errors;
};

const submitData = async () => {
    let firstNameDOM = document.querySelector("input[name=firstName]");
    let lastNameDOM = document.querySelector("input[name=lastName]");
    let ageDOM = document.querySelector("input[name=age]");
    let genderDOM = document.querySelector("input[name=gender]:checked") || {};
    let interestDOMs = document.querySelectorAll("input[name=interest]:checked") || {};
    let descriptionDOM = document.querySelector("textarea[name='description']");
    let messageDOM = document.getElementById('message');

    try {
        // สร้าง string ของ interests
        let interest = '';
        interestDOMs.forEach((interestDOM, index) => {
            interest += interestDOM.value;
            if (index !== interestDOMs.length - 1) {
                interest += ', ';
            }
        });

        // ข้อมูลที่จะส่ง
        let userData = {
            firstName: firstNameDOM.value,
            lastName: lastNameDOM.value,
            age: ageDOM.value,
            gender: genderDOM.value,
            description: descriptionDOM.value,
            interests: interest
        };

        // ตรวจสอบข้อมูลก่อนส่ง
        let errors = validateData(userData);
        if (errors.length > 0) {
            throw {
                message: 'กรุณากรอกข้อมูลให้ครบถ้วน',
                errors: errors
            };
        }

        let message = 'บันทึกข้อมูลเรียบร้อย';
        if (mode === 'CREATE') {
            // ส่งข้อมูลไปสร้างผู้ใช้ใหม่
            const response = await axios.post(`${BASE_URL}/users`, userData);
            console.log('response', response.data);
        } else {
            // ส่งข้อมูลไปแก้ไขผู้ใช้
            const response = await axios.put(`${BASE_URL}/users/${selectedID}`, userData);
            message = 'แก้ไขข้อมูลเรียบร้อย';
            console.log('response', response.data);
        }

        // แสดงข้อความสำเร็จ
        messageDOM.innerText = message;
        messageDOM.className = "message success";
    } catch (error) {
        console.log('error message', error.message);

        // แสดงข้อผิดพลาดที่เกิดขึ้น
        let htmlData = '<div>';
        htmlData += '<div>' + error.message + '</div>';
        htmlData += '<ul>';

        if (error.errors) {
            error.errors.forEach(err => {
                htmlData += '<li>' + err + '</li>';
            });
        }

        htmlData += '</ul>';
        htmlData += '</div>';

        messageDOM.innerHTML = htmlData;
        messageDOM.className = 'message danger';
    }
};
