document.addEventListener('DOMContentLoaded', function() {
    const registerForm = document.getElementById('registerForm');

    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const fullNameInput = document.getElementById('full_name'); // Sử dụng 'full_name'
            const emailInput = document.getElementById('email');
            const passwordInput = document.getElementById('password');
            const confirmPasswordInput = document.getElementById('confirmPassword');

            if (!fullNameInput || !emailInput || !passwordInput || !confirmPasswordInput) {
                console.error("Một hoặc nhiều phần tử input không tồn tại.");
                alert("Lỗi: Vui lòng kiểm tra lại form.");
                return;
            }

            const fullName = fullNameInput.value;
            const email = emailInput.value;
            const password = passwordInput.value;
            const confirmPassword = confirmPasswordInput.value;

            if (password !== confirmPassword) {
                alert('Mật khẩu không khớp!');
                return;
            }

            try {
                const response = await fetch('http://localhost:3000/auth/register', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ fullName, email, password }),
                });

                const data = await response.json();
                if (response.ok) {
                    alert(data.message);
                    window.location.href = '../login/login.html';
                } else {
                    alert(data.message);
                }
            } catch (error) {
                console.error('Lỗi đăng ký:', error);
                alert('Lỗi đăng ký. Vui lòng thử lại!');
            }
        });
    } else {
        console.error("Không tìm thấy form đăng ký.");
    }
});