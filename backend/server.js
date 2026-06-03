const mongoose = require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/quickcart")
.then(() => console.log("MongoDB Connected"))
.catch(err => console.log(err));

// Schema
const UserSchema = new mongoose.Schema({
    username: String,
    password: String
});

// Model
const User = mongoose.model("User", UserSchema);

const express = require("express");
const cors = require("cors");

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

const CartSchema = new mongoose.Schema({
    username: String,
    items: [
        {
            name: String,
            price: Number,
            quantity: Number
        }
    ]
});

const Cart = mongoose.model("Cart", CartSchema);

const OrderSchema = new mongoose.Schema({
    username: String,
    items: [
        {
            name: String,
            price: Number,
            quantity: Number
        }
    ],
    date: {
        type: Date,
        default: Date.now
    }
});


// Products API
app.get("/products", async (req, res) => {

    const defaultProducts = [

        {
            name: "Mobile",
            price: 15000,
            image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9",
            category: "Electronics"
        },

        {
            name: "Laptop",
            price: 50000,
            image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853",
            category: "Electronics"
        },

        {
            name: "Headphones",
            price: 2000,
            image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e",
            category: "Accessories"
        },

        {
            name: "Smart Watch",
            price: 3000,
            image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30",
            category: "Fashion"
        },

        {
            name: "Tablet",
            price: 20000,
            image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0",
            category: "Electronics"
        },

        {
            name: "Camera",
            price: 25000,
            image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32",
            category: "Electronics"
        },

        {
            name: "Speaker",
            price: 1500,
            image: "https://images.unsplash.com/photo-1545454675-3531b543be5d",
            category: "Accessories"
        },

        {
            name: "Keyboard",
            price: 800,
            image: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae",
            category: "Accessories"
        },

        {
            name: "Mouse",
            price: 500,
            image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46",
            category: "Accessories"
        },

        {
            name: "Gaming Mouse",
            price: 2500,
            image: "https://images.unsplash.com/photo-1613141411244-0e4ac259d217",
            category: "Gaming"
        },

        {
            name: "Gaming Chair",
            price: 12000,
            image: "https://images.unsplash.com/photo-1598550476439-6847785fcea6",
            category: "Gaming"
        },

         {
            name: "Gaming Headset",
            price: 15500,
            image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS2a-1vU-wPMeosQeWJDPsRAxUmFV7KXlEA3w&s",
            category: "Gaming"
        },

        {
            name: "Gaming Keyboard",
            price: 20000,
            image: "https://thumbs.dreamstime.com/b/gaming-keyboard-rgb-light-white-mechanical-backlight-212226943.jpg",
            category: "Gaming"
        },

        {
            name: "Monitor",
            price: 10000,
            image: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf",
            category: "Computers"
        },

        {
            name: "CPU Cabinet",
            price: 7000,
            image: "https://images.unsplash.com/photo-1587202372775-e229f172b9d7",
            category: "Computers"
        },

        {
            name: "Bluetooth Speaker",
            price: 3500,
            image: "https://images.unsplash.com/photo-1589003077984-894e133dabab",
            category: "Audio"
        },

        {
            name: "Wireless Earbuds",
            price: 4500,
            image: "https://images.unsplash.com/photo-1590658268037-6bf12165a8df",
            category: "Audio"
        },

        {
            name: "Smart Bulb",
            price: 1200,
            image: "https://encrypted-tbn1.gstatic.com/shopping?q=tbn:ANd9GcQ_wGg3q_DhMz5C-2vdweTctmUx4Wsyo7MulfxzY9MnAezW8b7IEP0goHBfZ0ZVM-vpAwQSExX1tkVyrUt0JAbguNxqVX49AcC6eWKzFW2AAvQC4yldyCu6UA",
            category: "Smart Devices"
        },

        {
            name: "Mobile Charger",
            price: 800,
            image: "https://img.magnific.com/free-vector/smartphone-with-charger-electric-socket-color-background-realistic-vector-illustration_1284-80308.jpg?semt=ais_hybrid&w=740&q=80",
            category: "Electronics"
        },

        {
            name: "Mobile Cover",
            price: 400,
            image: "https://www.wecool.in/cdn/shop/products/1_a5abf881-a7f8-4b77-b9fb-50153ccffeb2.jpg?v=1650948678",
            category: "Electronics"
        },

        {
            name: "Smart Door Lock",
            price: 8500,
            image: "https://images.unsplash.com/photo-1558002038-1055907df827",
            category: "Smart Devices"
        },

        {
            name: "Smart Camera",
            price: 6500,
            image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32",
            category: "Smart Devices"
        },

        {
            name: "Smart Plug",
            price: 999,
            image: "https://images.unsplash.com/photo-1580894908361-967195033215",
            category: "Smart Devices"
        },

        {
            name: "Fitness Band",
            price: 2499,
            image: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6",
            category: "Smart Devices"
        },


        {
            name: "T-Shirt",
            price: 999,
            image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab",
            category: "Fashion"
        },

        {
            name: "Jeans",
            price: 1999,
            image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246",
            category: "Fashion"
        },

        {
            name: "Sneakers",
            price: 2999,
            image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
            category: "Fashion"
        },

        {
            name: "Handbag",
            price: 2499,
            image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3",
            category: "Fashion"
        },

        {
            name: "Sunglasses",
            price: 1499,
            image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083",
            category: "Fashion"
        },

        {
            name: "Jacket",
            price: 3999,
            image: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b",
            category: "Fashion"
        },

        {
            name: "Apple",
            price: 120,
            image: "https://tse2.mm.bing.net/th/id/OIP.jLHhBCVdjSOFgzGqoNNezwHaE8?pid=Api&P=0&h=180",
            category: "Groceries"
        },

        {
            name: "Tea Powder",
            price: 180,
            image: "https://5.imimg.com/data5/SELLER/Default/2021/8/IB/HN/PG/218089/tea-powder-1000x1000.jpg",
            category: "Groceries"
        },

        {
            name: "Rice",
            price: 950,
            image: "https://tse1.mm.bing.net/th/id/OIP.YILjSXdSOXalnyHorp5BRwHaE8?pid=Api&P=0&h=180",
            category: "Groceries"
        },

        {
            name: "Paneer",
            price: 100,
            image: "https://facts.net/wp-content/uploads/2023/05/paneer-cheese.jpeg",
            category: "Groceries"
        },


    ];

    try {

        const adminProducts = await Product.find();

        const allProducts = [...defaultProducts, ...adminProducts];

        res.json(allProducts);

    } catch (error) {

        res.send("Error fetching products ❌");

    }

});

// Register API
app.post("/register", async (req, res) => {
    const { username, password } = req.body;

    try {
        const newUser = new User({ username, password });
        await newUser.save();

        console.log(" REGISTERED USER: ");
        console.log("Username:", username);
        console.log("Password:", password);

        res.send("User Registered Successfully ✅");
    } catch (error) {
        console.log(" REGISTERED ERROR:", error);
        res.send("Error registering user ❌");
    }
});

// Login API
app.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username, password });

        if (user) {
            console.log("LOGIN SUCCESS: ");
            console.log("Username:", username);
            console.log("Password:", password);

            res.send("Login Successful ✅");
        } else {
            console.log("LOGIN FAILED: ");
            console.log("Username:", username);
            console.log("Password:", password);

            res.send("Invalid Credentials ❌");
        }
    } catch (error) {
        res.send("Error in login ❌");
    }
});

app.post("/cart", async (req, res) => {
    const { username, items } = req.body;

    try {
        let userCart = await Cart.findOne({ username });

        if (userCart) {
            userCart.items = items;
            await userCart.save();
        } else {
            const newCart = new Cart({ username, items });
            await newCart.save();
        }

        res.send("Cart saved ✅");
    } catch (error) {
        res.send("Error saving cart ❌");
    }
});

app.post("/order", async (req, res) => {
    const { username, items } = req.body;

    try {
        const newOrder = new Order({ username, items });
        await newOrder.save();

        res.send("Order placed successfully ✅");
    } catch (error) {
        res.send("Error placing order ❌");
    }
});

app.post("/add-product", async (req, res) => {

    const newProduct = new Product({

        name: req.body.name,
        price: req.body.price,
        image: req.body.image,
        category: req.body.category

    });

    await newProduct.save();

    res.json({
        message: "Product Added Successfully"
    });

});

app.delete("/delete-product/:id", async (req, res) => {
    try {
        await Product.findByIdAndDelete(req.params.id);

        res.json({
            message: "Product deleted successfully"
        });

    } catch (error) {
        console.log(error);
        res.send("Error deleting product ❌");
    }
});

app.get("/cart/:username", async (req, res) => {
    const { username } = req.params;

    try {
        const userCart = await Cart.findOne({ username });

        if (userCart) {
            res.json(userCart.items);
        } else {
            res.json([]);
        }
    } catch (error) {
        res.send("Error fetching cart ❌");
    }
});

app.get("/", (req, res) => {
    res.send("QuickCart Backend Running ");
});

// Start Server
app.listen(5000, () => {
    console.log("Server running on http://localhost:5000");
});

const Order = mongoose.model("Order", OrderSchema);

const ProductSchema = new mongoose.Schema({

    name: String,
    price: Number,
    image: String,
    category: String

});

const Product = mongoose.model("Product", ProductSchema);