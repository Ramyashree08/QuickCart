let wishlist = JSON.parse(
    localStorage.getItem("wishlist")
) || [];

let html = "";

wishlist.forEach(product => {

    html += `

        <div>

            <img src="${product.image}" width="150">

            <h3>${product.name}</h3>

            <p>₹${product.price}</p>

        </div>

    `;
});

document.getElementById(
    "wishlistProducts"
).innerHTML = html;