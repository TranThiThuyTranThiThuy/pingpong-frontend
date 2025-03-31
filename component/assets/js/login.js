document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const emailInput = document.getElementById('email');
            const passwordInput = document.getElementById('password');

            if (!emailInput || !passwordInput) {
                console.error("Một hoặc nhiều phần tử input không tồn tại.");
                alert("Lỗi: Vui lòng kiểm tra lại form.");
                return;
            }

            const email = emailInput.value;
            const password = passwordInput.value;

            try {
                const response = await fetch('http://localhost:3000/auth/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password }),
                });

                const data = await response.json();
                if (response.ok) {
                    const token = data.token;
                    const userId = data.user.userId; // Lấy user_id từ response

                    localStorage.setItem('token', token);
                    localStorage.setItem('userId', userId); // Lưu user_id vào localStorage

                    window.location.href = `/component/navigation/pages/index.html?userId=${userId}`; // Chuyển hướng đến trang chủ với user_id
                } else {
                    alert(data.message);
                }
            } catch (error) {
                console.error('Lỗi đăng nhập:', error);
                alert('Lỗi đăng nhập. Vui lòng thử lại!');
            }
        });
    } else {
        console.error("Không tìm thấy form đăng nhập.");
    }
});