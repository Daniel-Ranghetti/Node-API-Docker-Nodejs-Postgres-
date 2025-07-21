// app/routes/user.routes.js
import express from "express";
import {
    allAccess,
    userBoard,
    moderatorBoard,
    adminBoard,
} from "../controllers/user.controller.js";
import { authJwt } from "../middlewares/index.js";
import * as authController from "../controllers/auth.controller.js";
 
const router = express.Router();
 
// Rotas de acesso padrão
router.get("/all", allAccess);
router.get("/user", [authJwt.verifyToken], userBoard);
router.get("/mod", [authJwt.verifyToken, authJwt.isModeratorOrAdmin], moderatorBoard);
router.get("/admin", [authJwt.verifyToken, authJwt.isAdmin], adminBoard);

// CRUD de usuários
router.get("/users", [authJwt.verifyToken], authController.getUsers);
router.get("/users/:userId", [authJwt.verifyToken], authController.getUser);
router.put("/users/:userId", [authJwt.verifyToken], authController.updateUser);
router.delete("/users/:userId", [authJwt.verifyToken], authController.deleteUser);
router.post("/signup", authController.signup);
router.post("/signin", authController.signin);

 
export default router;