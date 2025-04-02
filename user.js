const BASE_URL = 'http://localhost:8000'; // URL ของ API ของคุณ

window.onload = async () => {
    try {
        const response = await axios.get(`${BASE_URL}/users`); // ดึงข้อมูลผู้ใช้ทั้งหมด
        const users = response.data;

        // ค้นหา tbody ของตาราง
        const tableBody = document.getElementById('userTableBody');

        // แสดงข้อมูลผู้ใช้ในตาราง
        users.forEach(user => {
            const row = document.createElement('tr');
            
            row.innerHTML = `
                <td>${user.id}</td>
                <td>${user.firstName}</td>
                <td>${user.lastName}</td>
                <td>${user.age}</td>
                <td>${user.gender}</td>
                <td>${user.interests.join(', ')}</td>
                <td>${user.description}</td>
                <td>
                    <button onclick="editUser(${user.id})">Edit</button>
                    <button onclick="deleteUser(${user.id})">Delete</button>
                </td>
            `;

            tableBody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading users:', error);
    }
};

// ฟังก์ชันแก้ไขข้อมูลผู้ใช้
const editUser = (id) => {
    // ให้เปิดหน้าแก้ไข หรือทำการนำข้อมูลที่จะแก้ไขมาแสดง
    window.location.href = `editUser.html?id=${id}`;
};

// ฟังก์ชันลบข้อมูลผู้ใช้
const deleteUser = async (id) => {
    try {
        const response = await axios.delete(`${BASE_URL}/users/${id}`);
        alert('User deleted successfully');
        window.location.reload(); // รีโหลดข้อมูลใหม่หลังจากลบ
    } catch (error) {
        console.error('Error deleting user:', error);
        alert('Error deleting user');
    }
};
