import express from "express";
import cors from "cors";
import db from "./models/index.js";
import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";

const app = express();

const corsOptions = {
    origin: "http://localhost:8081",
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas básicas
app.get("/", (req, res) => {
    res.json({ message: "Welcome to the Node.js JWT Authentication application." });
});

// Rotas da API
app.use("/api/auth", authRoutes);
app.use("/api", userRoutes);

const PORT = process.env.PORT || 8080;

db.sequelize.sync({ force: false }).then(() => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}.`);
    });
});
