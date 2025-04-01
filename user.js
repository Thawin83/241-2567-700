const BASE_URL = 'http://localhost:8000';

window.onload = async () => {
    await loadData();
};

const loadData = async () => {
    console.log('User page loaded');

    try {
        // 1. Load users ทั้งหมด
        const response = await axios.get(`${BASE_URL}/users`);
        const users = response.data;
        console.log(users);

        // 2. ค้นหา table body และเคลียร์ข้อมูลเก่า
        const tableBody = document.getElementById('userTableBody');
        tableBody.innerHTML = '';

        users.forEach(user => {
            const row = document.createElement('tr');

            // คอลัมน์ข้อมูลผู้ใช้
            row.innerHTML = `
                <td>${user.id}</td>
                <td>${user.firstName}</td>
                <td>${user.lastName}</td>
                <td>${user.age}</td>
                <td>${user.gender}</td>
                <td>${user.interests}</td>
                <td>${user.description}</td>
                <td>
                    <a href="index.html?id=${user.id}">
                        <button class="edit">Edit</button>
                    </a>
                    <button class="delete" data-id="${user.id}">Delete</button>
                </td>
            `;

            // ปุ่ม Delete
            const deleteButton = row.querySelector('.delete');
            deleteButton.addEventListener('click', async (event) => {
                const id = event.target.dataset.id;
                deleteButton.disabled = true; // ปิดปุ่ม Delete ชั่วคราว
                try {
                    await axios.delete(`${BASE_URL}/users/${id}`);
                    await loadData(); // โหลดข้อมูลใหม่
                } catch (error) {
                    console.error('Error deleting user:', error);
                } finally {
                    deleteButton.disabled = false; // เปิดปุ่ม Delete อีกครั้ง
                }
            });

            tableBody.appendChild(row);
        });

    } catch (error) {
        console.error('Error loading users:', error);
    }
};