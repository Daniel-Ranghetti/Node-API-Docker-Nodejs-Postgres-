// app/controllers/auth.controller.js
import db from "../models/index.js";
import authConfig from "../config/auth.config.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const User = db.user;

// GET all users
export const getUsers = async (req, res) => {
  try {
    const users = await User.findAll();
    res.status(200).json({ users });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// GET user by id
export const getUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.userId);
    if (!user) return res.status(404).json({ message: "User not found!" });
    res.status(200).json({ user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// SIGNUP user
export const signup = async (req, res) => {
  try {
    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    const validRoles = ["user", "moderator", "admin"];
    const role = validRoles.includes(req.body.role) ? req.body.role : "user";
    const user = await User.create({
      username: req.body.username,
      email: req.body.email,
      password: hashedPassword,
      role: role || 'user',
    });
    res.status(201).json({ message: 'Usuário criado com sucesso!', user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// UPDATE user
export const updateUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.userId); // usuário do token
    const targetUser = await User.findByPk(req.params.userId); // usuário que será editado

    if (!targetUser) return res.status(404).json({ message: 'User not found!' });

    // Só o admin ou o próprio usuário podem editar
    if (user.role !== 'admin' && user.id !== targetUser.id) {
      return res.status(403).json({ message: 'Unauthorized to update this user' });
    }

    // Atualiza os campos
    targetUser.username = req.body.username || targetUser.username;
    targetUser.email = req.body.email || targetUser.email;
    targetUser.role = req.body.role || targetUser.role;

    if (req.body.password) {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);
      targetUser.password = hashedPassword;
    }

    await targetUser.save();

    res.status(200).json({ message: 'User updated!', targetUser });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// DELETE user
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.userId);
    if (!user) return res.status(404).json({ message: 'User not found!' });
    await user.destroy();
    res.status(200).json({ message: 'User deleted!' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// SIGNIN user
export const signin = async (req, res) => {
  try {
    const user = await User.findOne({ where: { username: req.body.username } });
    if (!user) return res.status(404).json({ message: "User Not found." });

    const passwordIsValid = await bcrypt.compare(req.body.password, user.password);
    if (!passwordIsValid) return res.status(401).json({ accessToken: null, message: "Invalid Password!" });

    const token = jwt.sign({ id: user.id }, authConfig.secret, { expiresIn: 86400 });

    res.status(200).json({
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      accessToken: token,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
