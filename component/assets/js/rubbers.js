document.addEventListener("DOMContentLoaded", () => {
    const productList = document.getElementById("product-list");
    const categoryButtons = document.querySelectorAll(".blade-sidebar a");
    const categoryInputs = document.querySelectorAll(".category-input");

    // 🟢 Danh sách danh mục (map key -> {categoryId, type})
    const categoryMap = {
        "Tất cả": { categoryId: 3, type: "" },
        "Butterfly": { categoryId: 3, type: "Butterfly" },
        "DHS": { categoryId: 3, type: "DHS" },
        "Stiga": { categoryId: 3, type: "Stiga" },
        "Yasaka": { categoryId: 3, type: "Yasaka" },
        "Donic": { categoryId: 3, type: "Donic" },
        "Nitaku": { categoryId: 3, type: "Nitaku" },
        "Andro": { categoryId: 3, type: "Andro" }
    };

    // 🟢 Mặc định hiển thị sản phẩm "Tất cả" khi trang load
    window.onload = () => fetchProducts("Tất cả");

    // 🟢 Xử lý sự kiện khi click vào nút danh mục
    categoryButtons.forEach(button => {
        button.addEventListener("click", (event) => {
            event.preventDefault();
            fetchProducts(button.getAttribute("data-category"));
        });
    });

    // 🟢 Xử lý khi chọn danh mục bằng radio button (nếu cần)
    categoryInputs.forEach(input => {
        input.addEventListener("change", function () {
            fetchProducts(this.id);
        });
    });

    // 🟢 Hàm gọi API lấy sản phẩm theo danh mục và type
    async function fetchProducts(categoryKey) {
        try {
            const categoryData = categoryMap[categoryKey];
            if (!categoryData) {
                throw new Error("Danh mục không hợp lệ!");
            }

            console.log(`📢 Đang tải sản phẩm cho danh mục: ${categoryKey} (ID: ${categoryData.categoryId}, Type: ${categoryData.type})`);

            let url = `http://localhost:3000/products/by-category?category_id=${categoryData.categoryId}`;
            if (categoryData.type) {
                url += `&type=${categoryData.type}`;
            }

            const response = await fetch(url);

            if (!response.ok) {
                const contentType = response.headers.get("content-type");
                if (contentType && contentType.includes("application/json")) {
                    const errorData = await response.json();
                    throw new Error(`Lỗi API: ${response.status} ${response.statusText} - ${errorData.message || "Không có thông tin lỗi chi tiết"}`);
                } else {
                    const errorText = await response.text();
                    throw new Error(`Lỗi API: ${response.status} ${response.statusText} - ${errorText}`);
                }
            }

            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                const products = await response.json();
                console.log("📦 Dữ liệu sản phẩm nhận được:", products);

                if (products.length === 0) {
                    productList.innerHTML = `<p class="no-products">Không có sản phẩm nào trong danh mục này!</p>`;
                } else {
                    productList.innerHTML = products.map(product => `
                        <div class="product-card">
                            <img src="${product.image_url ? `http://localhost:3000/images/${product.image_url}` : './assets/imgs/no-image.png'}" alt="${product.product_name}">
                            <h3>${product.product_name}</h3>
                            <p>${parseInt(product.price).toLocaleString()} VND</p>
                            <p>Tồn kho: ${product.stock}</p>
                            <button class="buy-btn">Mua ngay</button>
                        </div>
                    `).join('');
                }
            } else {
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