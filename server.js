// server.js (Top of the file)
// ...
const { MongoClient, ObjectId } = require('mongodb'); // <-- MAKE SURE TO UPDATE THIS LINE
const dotenv = require('dotenv');
// ...// server.js (After the other routes)

// (D) GET Route: Retrieves a single item by its ID for the dedicated item page
app.get('/item/:id', async (req, res) => {
    if (!db) {
        return res.status(500).send("Database connection lost.");
    }

    // 1. Get the unique ID from the URL path
    const itemId = req.params.id;

    try {
        // 2. Validate the ID format
        const objectId = new ObjectId(itemId);

        // 3. Query the database for the specific item
        const item = await db.collection('consoles').findOne({ _id: objectId });

        if (!item) {
            // If item not found, send a 404 error
            return res.status(404).sendFile(__dirname + '/public/404.html'); 
            // NOTE: You would need to create a simple 404.html page in your public folder
        }

        // 4. Render the Item Page dynamically
        // Since we are using Express, the cleanest way to render dynamic HTML is 
        // by using a templating engine (like EJS or Handlebars).
        
        // **FOR NOW (BASIC METHOD):** We'll send the data as JSON and let client-side JS render it.
        // In a full application, you would replace this with a proper templating engine.
        // For simplicity, we'll send the client the HTML template AND the data.

        // For this step, we'll just send the item details and let the client-side code handle rendering.
        // A better approach is to render the HTML on the server, but that requires EJS setup.
        
        // Serve the static item page template, and let client-side JS fetch details
        res.sendFile(__dirname + '/public/item-template.html');

    } catch (error) {
        console.error("Error fetching single item:", error);
        // If the ID is invalid (e.g., wrong length), it's a 400 Bad Request
        res.status(400).send("Invalid item ID format.");
    }
});
