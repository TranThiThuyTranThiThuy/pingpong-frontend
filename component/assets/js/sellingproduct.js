document.addEventListener("DOMContentLoaded", () => {
    const productList = document.getElementById("product-list");
    const categoryButtons = document.querySelectorAll(".category-button");
    const categoryInputs = document.querySelectorAll(".category-input");

    // 🟢 Danh sách danh mục (map key -> ID)
    const categoryMap = {
        "bo-vot": 1,
        "cot-vot": 2,
        "mat-vot": 3
    };

    // 🟢 Mặc định hiển thị sản phẩm "Bộ vợt" khi trang load
    window.onload = () => fetchProducts("bo-vot");

    // 🟢 Xử lý sự kiện khi click vào nút danh mục
    categoryButtons.forEach(button => {
        button.addEventListener("click", () => {
            fetchProducts(button.getAttribute("data-category"));
        });
    });

    // 🟢 Xử lý khi chọn danh mục bằng radio button
    categoryInputs.forEach(input => {
        input.addEventListener("change", function () {
            fetchProducts(this.id);
        });
    });

    // 🟢 Hàm gọi API lấy sản phẩm theo danh mục
    async function fetchProducts(categoryKey) {
        try {
            const categoryId = categoryMap[categoryKey];
            if (!categoryId) {
                throw new Error("Danh mục không hợp lệ!");
            }

            console.log(`📢 Đang tải sản phẩm cho danh mục: ${categoryKey} (ID: ${categoryId})`);

            const response = await fetch(`http://localhost:3000/products/top-selling?category_id=${categoryId}`);

            if (!response.ok) {
                // Kiểm tra kiểu nội dung phản hồi
                const contentType = response.headers.get("content-type");
                if (contentType && contentType.includes("application/json")) {
                    // Nếu là JSON, lấy thông tin lỗi chi tiết
                    const errorData = await response.json();
                    throw new Error(`Lỗi API: ${response.status} ${response.statusText} - ${errorData.message || "Không có thông tin lỗi chi tiết"}`);
                } else {
                    // Nếu không phải JSON, lấy nội dung phản hồi dưới dạng văn bản
                    const errorText = await response.text();
                    throw new Error(`Lỗi API: ${response.status} ${response.statusText} - ${errorText}`);
                }
            }

            // Kiểm tra kiểu nội dung phản hồi trước khi phân tích cú pháp JSON
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                const products = await response.json();
                console.log("📦 Dữ liệu sản phẩm nhận được:", products);

                if (products.length === 0) {
                    productList.innerHTML = `<p class="no-products">Không có sản phẩm nào trong danh mục này!</p>`;
                } else {
                    productList.innerHTML = products.map(product => `
                        <div class="product-card">
                            <img src="${product.image_url || './assets/imgs/no-image.png'}" alt="${product.product_name}">
                            <h3>${product.product_name}</h3>
                            <p>${parseInt(product.price).toLocaleString()} VND</p>
                            <p>Đã bán: ${product.total_sold ?? 0}</p>
                            <button class="buy-btn">Mua ngay</button>
                        </div>
                    `).join('');
                }
            } else {
                // Nếu không phải JSON, hiển thị thông báo lỗi
                const responseText = await response.text();
                console.error("❌ Phản hồi không phải JSON:", responseText);
                productList.innerHTML = `<p class="error-message">Lỗi: Phản hồi từ server không hợp lệ.</p>`;
            }

        } catch (error) {
            console.error("❌ Lỗi khi lấy sản phẩm:", error);
            productList.innerHTML = `<p class="error-message">${error.message || "Lỗi khi tải sản phẩm. Vui lòng thử lại!"}</p>`;
        }
    }
});