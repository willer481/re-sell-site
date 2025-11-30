const express = require('express');
const { MongoClient, ObjectId } = require('mongodb');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables (like MongoDB URI) from a .env file
dotenv.config();

const app = express();
const port = 3000;

// Middleware: Allows the server to read JSON and form data
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (your HTML, CSS, JS, and image files) from the 'public' folder
app.use(express.static(path.join(__dirname, 'public'))); 

// MongoDB Connection URI (Get this from MongoDB Atlas)
const uri = process.env.MONGO_URI; 
const client = new MongoClient(uri);

let db; // Variable to hold our database reference

async function connectToDb() {
    try {
        await client.connect();
        db = client.db('ConsoleShop');
        console.log("Successfully connected to MongoDB!");
        
        // Start the server ONLY after the database is connected
        app.listen(port, () => {
            console.log(`Server running at http://localhost:${port}`);
        });

    } catch (error) {
        console.error("Failed to connect to the database:", error);
        process.exit(1);
    }
}

connectToDb();

// --- API Endpoints ---

// 1. POST Route: Handles the "Add New Item" form submission (Admin Panel)
app.post('/api/items', async (req, res) => {
    const newItem = {
        title: req.body.title,
        price: parseFloat(req.body.price),
        condition: req.body.condition,
        description: req.body.description,
        // Split the image URLs textarea into an array
        images: req.body.imageUrls ? req.body.imageUrls.split('\n').map(url => url.trim()) : []
    };

    if (!db) {
        return res.status(500).send({ message: "Database connection lost." });
    }

    try {
        await db.collection('consoles').insertOne(newItem);
        // Redirect the admin back to the form with a success message (if you add client-side handling)
        res.redirect('/admin-add-item.html'); 

    } catch (error) {
        console.error("Error inserting item:", error);
        res.status(500).send({ message: "Failed to add item." });
    }
});

// 2. GET Route: Retrieves ALL items for the public shop home page
app.get('/api/items', async (req, res) => {
    if (!db) {
        return res.status(500).send({ message: "Database connection lost." });
    }
    try {
        const items = await db.collection('consoles').find({}).toArray();
        res.json(items);

    } catch (error) {
        console.error("Error fetching items:", error);
        res.status(500).send({ message: "Failed to fetch items." });
    }
});

// 3. GET Route: Retrieves a SINGLE item's JSON data for the dynamic item page script
app.get('/api/item/:id', async (req, res) => {
    if (!db) {
        return res.status(500).send({ message: "Database connection lost." });
    }
    
    const itemId = req.params.id;
    try {
        const objectId = new ObjectId(itemId);
        const item = await db.collection('consoles').findOne({ _id: objectId });

        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }
        
        res.json(item); 

    } catch (error) {
        console.error("Error fetching single item:", error);
        res.status(400).json({ message: "Invalid ID format" });
    }
});

// 4. GET Route: Serves the dynamic Item Page template
// This must be last because it uses a wildcard ':id'
app.get('/item/:id', (req, res) => {
    // Serve the generic item page template file
    res.sendFile(path.join(__dirname, 'public', 'item-template.html'));
});
