import app from "./app.js";
import connectDB from "./config/database.config.js";










const port = 3000;

connectDB().then(() => {
    app.listen( port, () => {
        console.log("Server is running on port 3000");
    });
}).catch((error) => {
    console.error(`Error: ${error.message}`);
    process.exit(1);
});


