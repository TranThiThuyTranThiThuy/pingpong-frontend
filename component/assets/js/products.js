document.addEventListener("DOMContentLoaded", function () {
    const urlParams = new URLSearchParams(window.location.search);
    let category = "";

    // Xác định danh mục dựa trên file hiện tại
    if (window.location.pathname.includes("Blades.html")) {
        category = "blades";
    } else if (window.location.pathname.includes("Rubbers.html")) {
        category = "rubbers";
    }

    if (category) {
        fetchProducts(category);
    }
});

function fetchProducts(category) {
    fetch(`http://localhost:5000/api/products?category=${category}`)
        .then(response => response.json())
        .then(data => renderProducts(data))
        .catch(error => console.error("Lỗi khi lấy dữ liệu:", error));
}

function renderProducts(products) {
    const productContainer = document.querySelector(".product-container");
    productContainer.innerHTML = ""; // Xóa nội dung cũ

    products.forEach(product => {
        const productCard = document.createElement("div");
        productCard.classList.add("product-card");

        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h3>${product.name}</h3>
            <p class="price">${product.price} VND</p>
            <button>Mua ngay</button>
        `;

        productContainer.appendChild(productCard);
    });
}
