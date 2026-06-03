let cart = [];
alert("JS Loaded");

function addToCart(product, price) {

    let existingItem = cart.find(item => item.name === product);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: product,
            price: price,
            quantity: 1
        });
    }

    displayCart();
    saveCart();
}

function displayCart() {
    let cartDiv = document.getElementById("cart");
    let total = 0;

    cartDiv.innerHTML = "<h3>Cart Items</h3>";

    cart.forEach((item, index) => {
        total += item.price * item.quantity;

        cartDiv.innerHTML += `
            <p>
                ${item.name} - ₹${item.price} × ${item.quantity}
                <button onclick="increaseQty(${index})">+</button>
                <button onclick="decreaseQty(${index})">-</button>
                <button onclick="removeItem(${index})">Remove</button>
            </p>
        `;
    });

    cartDiv.innerHTML += `<h3>Total: ₹${total}</h3>`;
}

function increaseQty(index) {
    cart[index].quantity++;
    displayCart();
}

function decreaseQty(index) {
    if (cart[index].quantity > 1) {
        cart[index].quantity--;
    } else {
        cart.splice(index, 1);
    }

    displayCart();
}

function removeItem(index) {
    cart.splice(index, 1);
    displayCart();
}

async function loginUser(event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
    });

    const result = await response.text();

    if (result.includes("Successful")) {
         alert(result);

        // Save user (optional but useful)
        localStorage.setItem("user", username);

        // Redirect to home page
        window.location.href = "index.html";
    } else {
    alert(result);
    }
}

async function registerUser(event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;

    if(username === "" || password === "") {
        alert("Please fill all fields");
        return;
    }

    const response = await fetch("http://localhost:5000/register", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ username, password })
    });

    const result = await response.text();
    alert(result);

    window.location.href = "login.html";
}

// ===== ADMIN LOGIN =====
function login() {
    let user = document.getElementById("username").value;
    let pass = document.getElementById("password").value;

    if (user === "admin" && pass === "1234") {
        localStorage.setItem("adminLoggedIn", "true");
        window.location.href = "admin.html";
    } else {
        alert("Invalid Login!");
    }
}

function adminLogout() {
    localStorage.removeItem("adminLoggedIn");
    window.location.href = "adminlogin.html";
}

loadAdminProducts();

async function loadAdminProducts() {
    const res = await fetch("http://localhost:5000/products");
    const data = await res.json();

    let container = document.getElementById("admin-product-list");

    if (!container) return;

    container.innerHTML = "";

    data.forEach(product => {

        container.innerHTML += `
            <div>
                <img src="${product.image}" width="80">

                <p>${product.name} - ₹${product.price}</p>

                ${product._id ? `
                    <button onclick="deleteProduct('${product._id}')">
                        Delete
                    </button>
                ` : ""}

                <hr>
            </div>
        `;
    });
}

function deleteProduct(id) {
    fetch(`http://localhost:5000/delete-product/${id}`, {
        method: "DELETE"
    })
    .then(res => res.json())
    .then(data => {
        alert(data.message);
        loadAdminProducts(); // refresh list
    })
    .catch(err => console.log(err));
}

function searchProduct() {

    let input = document.getElementById("searchBox")
        .value
        .toLowerCase();

    let filteredProducts = allProducts.filter(product =>

        product.name
        .toLowerCase()
        .includes(input)

    );

    displayProducts(filteredProducts);
}

let allProducts = [];

async function loadProducts() {

    const response = await fetch("http://localhost:5000/products");

    const data = await response.json();

    allProducts = data;

    displayProducts(data);
}

function displayProducts(products) {

    console.log("displayProducts running");

    let productContainer =
    document.getElementById("product-list");

    productContainer.innerHTML = "";

    products.forEach(product => {

        productContainer.innerHTML += `

        <div class="product">

           <a href="product.html?name=${product.name}">
                <img src="${product.image}" width="150">
            </a>

            <h3>${product.name}</h3>

            <p>Category: ${product.category}</p>

            <p>Price: ₹${product.price}</p>

            <button onclick="addToCart('${product.name}', ${product.price}); showRecommendedProducts('${product.category}', '${product.name}')">
                Add to Cart
            </button>

            <button onclick="addToWishlist(
                '${product.name}',
                ${product.price},
                '${product.image}'
            )">
                ❤️ Wishlist
            </button>

        </div>

        `;

    });
}

const searchInput = document.getElementById("searchBox");

searchInput.addEventListener("input", () => {

    let value = searchInput.value.toLowerCase();

    let suggestionHTML = "";

    let filteredProducts = allProducts.filter(product =>

        product.name
        .toLowerCase()
        .includes(value)

    );

    filteredProducts.forEach(product => {

        suggestionHTML += `
           <p onclick="selectSuggestion('${product.name}')">
                ${product.name}
            </p>
        `;
    });

    document.getElementById("suggestions")
    .innerHTML = suggestionHTML;

});

function selectSuggestion(productName) {

    document.getElementById("searchBox").value = productName;

    searchProduct();

    document.getElementById("suggestions").innerHTML = "";
}

function showRecommendedProducts(currentCategory, currentName) {

    const recommendedContainer =
        document.getElementById("recommendedProducts");

    recommendedContainer.innerHTML = "";

   const recommended = allProducts.filter(product =>

    product.category === currentCategory &&
    product.name !== currentName

);

    recommended.forEach(product => {

        recommendedContainer.innerHTML += `

            <div class="product-card">

                <img src="${product.image}" width="150">

                <h3>${product.name}</h3>

                <p>₹${product.price}</p>

            </div>

        `;
    });
}

function filterProducts(category) {

    if(category === "All") {

        displayProducts(allProducts);

    }

    else {

        let filteredProducts =
        allProducts.filter(product =>
            product.category === category
        );

        displayProducts(filteredProducts);
    }
}

loadProducts();

async function loadCart() {
    let user = localStorage.getItem("user");

    if (!user) return;

    const response = await fetch(`http://localhost:5000/cart/${user}`);
    const data = await response.json();

    cart = data;
    displayCart();
}

loadCart();

let user = localStorage.getItem("user");
if (user) {
    document.getElementById("user-info").innerHTML =
        `Welcome ${user} | <button onclick="logout()">Logout</button>`;
}

function logout() {
    localStorage.removeItem("user");
    alert("Logged out successfully");
    window.location.href = "login.html";
}

function saveCart() {

    let user = localStorage.getItem("user");

    // Save to LocalStorage
    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );

    // Save to backend
    fetch("http://localhost:5000/cart", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            username: user,
            items: cart
        })
    });

}
function placeOrder() {

    let cart = JSON.parse(
        localStorage.getItem("cart")
    ) || [];

    console.log("Cart:", cart);

    let orders = JSON.parse(
        localStorage.getItem("orders")
    ) || [];

    orders.push(...cart);

    localStorage.setItem(
        "orders",
        JSON.stringify(orders)
    );

    alert("Order Placed Successfully!");

    localStorage.removeItem("cart");

    document.getElementById("cart").innerHTML = "";
}

function addProduct() {

    let name = document.getElementById("pname").value;
    let price = document.getElementById("pprice").value;
    let image = document.getElementById("pimage").value;
    let category = document.getElementById("pcategory").value;

    fetch("http://localhost:5000/add-product", {

        method: "POST",

        headers: {
            "Content-Type": "application/json"
        },

        body: JSON.stringify({
            name,
            price,
            image,
            category
        })

    })

    .then(res => res.json())

    .then(data => {

        alert(data.message);

    })

    .catch(err => {
        console.log(err);
    });

}
function addToWishlist(name, price, image) {

    let wishlist = JSON.parse(
        localStorage.getItem("wishlist")
    ) || [];

    const product = {
        name,
        price,
        image
    };

    wishlist.push(product);

    localStorage.setItem(
        "wishlist",
        JSON.stringify(wishlist)
    );

    alert("Added to Wishlist ❤️");
}
function generateDescription() {

    const name =
        document.getElementById("pname").value;

    const category =
        document.getElementById("pcategory").value;

    let description = "";

    if(category === "Electronics") {

        description =
        `${name} is a high-performance electronic product with advanced technology and excellent user experience.`;

    }
    else if(category === "Fashion") {

        description =
        `${name} is a stylish fashion product designed for comfort and modern trends.`;

    }
    else if(category === "Gaming") {

        description =
        `${name} provides an immersive gaming experience with powerful performance and reliability.`;

    }
    else {

        description =
        `${name} is a quality product suitable for everyday use.`;

    }

    document.getElementById("description").value =
        description;
}

function sendMessage() {

    const input =
        document.getElementById("userMessage");

    const message =
        input.value.toLowerCase();

    let response = "";

    // Special AI recommendations

    if(message.includes("mobile")) {

        const mobile = allProducts.find(product =>
            product.name.toLowerCase().includes("mobile")
        );

        if(mobile){
            response =
            `📱 I recommend Mobile products from Electronics category. ${mobile.name} is available for ₹${mobile.price}`;
        }
        else{
            response =
            "📱 I recommend Mobile products from Electronics category.";
        }
    }

    else if(message.includes("laptop")) {

        const laptop = allProducts.find(product =>
            product.name.toLowerCase().includes("laptop")
        );

        if(laptop){
            response =
            `💻 Laptops are available in the Computers category. ${laptop.name} is available for ₹${laptop.price}`;
        }
        else{
            response =
            "💻 Laptops are available in the Computers category.";
        }
    }

    else if(message.includes("gaming")) {

        response =
        "🎮 I recommend Gaming Mouse, Gaming Keyboard, and Gaming Headsets.";
    }

    else if(message.includes("headphone")) {

        response =
        "🎧 Check our Audio category for headphones and earphones.";
    }

    else {

        const foundProduct = allProducts.find(product =>

            product.name.toLowerCase().includes(message)

        );

        if(foundProduct){

            response =
            `${foundProduct.name} is available for ₹${foundProduct.price}`;

        }
        else{

            response =
            "🤖 Sorry, I couldn't find that product. Try Mobile, Laptop, Gaming, or Headphones.";

        }
    }

    document.getElementById("chatbox")
    .innerHTML += `

        <p><b>You:</b> ${input.value}</p>

        <p><b>Bot:</b> ${response}</p>

        <hr>

    `;

    input.value = "";
}