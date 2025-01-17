// import from external packages
import express from "express";
import { config } from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

// create an express app
const app = express();

// config the .env file
config();

// Define __dirname for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// import port from .env file
const PORT = process.env.PORT || 5000;

// import static files
app.use(express.static(path.join(__dirname, "public")));

// app.use(express.static(path.join(__dirname, "client", "build")));
app.get("/", (req, res) => {
  res.send("Hello World");
});

// listen to the port
app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`);
});
