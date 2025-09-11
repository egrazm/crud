// app.js
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import expressLayouts from "express-ejs-layouts";
import router from "./routes/index.js";

const app = express();
const PORT = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middlewares
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use((req, _res, next) => {           // 👈 logger para ver qué llega
  console.log(req.method, req.url);
  next();
});

// EJS + layouts
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "public")));
app.set("layout", "layout"); 
app.use(expressLayouts);

// Rutas
app.use("/", router);

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
