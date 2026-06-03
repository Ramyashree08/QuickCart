let orders = JSON.parse(
    localStorage.getItem("orders")
) || [];

let html = "";

orders.forEach(product => {

    html += `

        <div>

            <h3>${product.name}</h3>

            <p>₹${product.price}</p>

        </div>

    `;
});

document.getElementById("orders")
.innerHTML = html;