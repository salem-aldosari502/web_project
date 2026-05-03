const express = require("express");
const route = express.Router();
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

const {
    signupUser,
    loginUser,
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser
} = require("../controllers/userController");


route.post("/signup", signupUser);
route.post("/login", loginUser);

route.get("/all", protect, authorizeRoles("admin"), getAllUsers);
route.get("/:id", protect, getUserById);
route.put("/:id", protect, updateUser);
route.delete("/:id", protect, deleteUser);

module.exports = route;
