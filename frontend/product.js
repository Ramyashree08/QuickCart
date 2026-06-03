let currentProductName = "";
const params = new URLSearchParams(window.location.search);

const productName = params.get("name");

fetch("http://localhost:5000/products")

.then(res => res.json())

.then(products => {

    // Find product using NAME
    const product = products.find(
        p => p.name == productName
    );

    // Product not found
    if(!product){

        document.getElementById("productDetails")
        .innerHTML = "<h1>Product Not Found</h1>";

        return;
    }

    // Show product details
    showProduct(product);

    // Show recommendations
    showRecommendedProducts(
        products,
        product.category,
        product.name
    );
    
    showRecentProducts();

    showReviews();

});

// SHOW PRODUCT DETAILS

function showProduct(product){

    currentProductName = product.name;

    saveRecentProduct(product);

    document.getElementById("productDetails")
    .innerHTML = `

        <div>

            <img src="${product.image}" width="300">

            <h1>${product.name}</h1>

            <h2>₹${product.price}</h2>

            <h3>⭐ 4.5 Rating</h3>

            <p>
                High quality product with fast delivery.
            </p>

            <button>
                Add To Cart
            </button>

        </div>

    `;
}



// SHOW RECOMMENDED PRODUCTS

function showRecommendedProducts(
    products,
    currentCategory,
    currentName
){

    const recommended = products.filter(product =>

        product.category === currentCategory &&
        product.name !== currentName

    );

    let html = "";

    recommended.forEach(product => {

        html += `

            <div>

                <a href="product.html?name=${product.name}">

                    <img src="${product.image}" width="150">

                </a>

                <h3>${product.name}</h3>

                <p>₹${product.price}</p>

            </div>

        `;
    });

    document.getElementById(
        "recommendedProducts"
    ).innerHTML = html;
}

function showRecentProducts(){

    const recentProducts = JSON.parse(
        localStorage.getItem("recentProducts")
    ) || [];

    let html = "";

    recentProducts.forEach(product => {

        html += `

            <div>

                <a href="product.html?name=${product.name}">

                    <img src="${product.image}" width="120">

                </a>

                <h3>${product.name}</h3>

                <p>₹${product.price}</p>

            </div>

        `;
    });

    document.getElementById(
        "recentProducts"
    ).innerHTML = html;
}

function saveRecentProduct(product){

    let recentProducts = JSON.parse(
        localStorage.getItem("recentProducts")
    ) || [];

    // Remove duplicate products
    recentProducts = recentProducts.filter(
        p => p.name !== product.name
    );

    // Add newest product
    recentProducts.unshift(product);

    // Keep only 5 products
    recentProducts = recentProducts.slice(0, 5);

    localStorage.setItem(
        "recentProducts",
        JSON.stringify(recentProducts)
    );
}

function addReview() {

    alert("Review button clicked");

    const reviewText =
        document.getElementById("reviewInput").value;

    if (!reviewText) return;

    let reviews = JSON.parse(
        localStorage.getItem("reviews")
    ) || {};

    if (!reviews[currentProductName]) {

        reviews[currentProductName] = [];

    }

    reviews[currentProductName].push(reviewText);

    localStorage.setItem(
        "reviews",
        JSON.stringify(reviews)
    );
    console.log("Saved Review For:", currentProductName);

    showReviews();

    document.getElementById("reviewInput").value = "";
}

function showReviews() {

    console.log("Current Product:", currentProductName);

    let reviews = JSON.parse(
        localStorage.getItem("reviews")
    ) || {};

    console.log("All Reviews:", reviews);

    let productReviews =
        reviews[currentProductName] || [];

    console.log("Product Reviews:", productReviews);

    let html = "";

    productReviews.forEach(review => {

        html += `
            <p>⭐⭐⭐⭐⭐ ${review}</p>
        `;
    });

    document.getElementById("reviews")
    .innerHTML = html;
}