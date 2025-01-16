import User from '../models/userModel.js';
import jwt from "jsonwebtoken";
import { hashSync, compareSync } from "bcrypt";

//signup
export const createUser = async (req, res) => {
    try {
        const { firstname, lastname, email, password } = req.body;

        // Hash the password
        const hash = hashSync(password, 10);

        // Generate JWT token
        const token = jwt.sign({ email }, process.env.SECRET, { expiresIn: "1h" });

        // Create a new user object with hashed password and token
        const newUser = new User({
            firstname,
            lastname,
            email,
            password: hash,
            token,
        });

        // Save the user to the database
        const savedUser = await newUser.save();

        // Respond with the saved user details in case you want to display it on the frontend somewhere(excluding sensitive information like the hashed password)
        res.status(200).json({
            user: {
                id: savedUser._id,
                firstname: savedUser.firstname,
                lastname: savedUser.lastname,
                email: savedUser.email,
            },
            token,
        });
    }
    catch (err) {
        console.error("Error creating user:", err);
        res.status(500).json({ message: "Error creating user", error: err.message });
    }
};

//login
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if the user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Validate password
        const isPasswordValid = compareSync(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate a token
        const token = jwt.sign({ email }, process.env.SECRET, { expiresIn: "1h" });
        res.status(200).json({ user: { id: user._id, email: user.email }, token });

    } catch (error) {
        res.status(500).json({ message: 'Error logging in', error });
    }
};