const validateData = (userData) => {
    let errors = []

    if (!userData.firstName) {
        errors.push('กรุณากรอกชื่อ')
    }
    if (!userData.lastName) {
        errors.push('กรุณากรอกนามสกุล')
    }
    if (!userData.age) {
    errors.push('กรุณากรอกอายุ')
    }
    if (!userData.gerder) {
        errors.push('กรุณาเลือกเพศ')
    }
    if (!userData.interests) {
        errors.push('กรุณาเลือกความสนใจ')
    }
    if (!userData.description) {
        errors.push('กรุณากรอกคำอธิบาย')
    }
    return errors 
}

const submitData = async() => {
    let firstNameDOM = document.querySelector('input[name="firstname"]');
    let lastNameDOM = document.querySelector('input[name="lastname"]');
    let ageDOM = document.querySelector('input[name="age"]');
    let genderDOM = document.querySelector('input[name="gender"]:checked') || {}
    let interestDOMs = document.querySelector('input[name="interest"]:checked') || {}
    let descriptionDOM = document.querySelector('textarea[name="description"]');

    let messageDOM = document.getElementById('message');

    try {
        let interest= ''
        for (let i = 0; i < interestDOMs.length; i++){
            interest += interestDOMs[i].value
            if (i != interestDOMs.length - 1){
                interest += ','
        }
    }
    
    let userData= {
        firstName: firstNameDOM.value,
        lastName: lastNameDOM.value,
        age: ageDOM.value,
        gender: genderDOM.value,
        description: descriptionDOM.value,
        interests: interest
    }
    console.log('submitData',userData);
/*
        const errors = validateData(userData)
        if(errors.length > 0) {
           //มี error
           throw {
            message: 'กรุณากรอกข้อมูลให้ครบถ้วน',
            errors: errors
           }
        }
*/
        const response = axios.post('http://localhost:8000/users',userData)
        console.log('response',response.data);
        messageDOM.innerText = 'บันทึกข้อมูลเรียบร้อย'
        messageDOM.className = 'message success'
    } catch (error) {
        console.log('error message',error.message);
        console.log('error',error.errors);
        
        if (error.response) {
            console.log(error.response);
            error.message = error.response.data.message
            error.errors = error.response.data.errors
        }
        

        let htmlData = '<div>'
        htmlData += `<div> ${error.message} </div>`
        htmlData += '<ul>'
        for (let i = 0; i< error.errors.length; i++) {
            htmlData += `<li> ${error.errors[i]}</li>`        
        }
        htmlData += '</ul>'
        htmlData += '</div>'
        messageDOM.innerText = 'บันทึกข้อมูลไม่สำเร็จ'
        messageDOM.className = 'message danger'
    } 
}
