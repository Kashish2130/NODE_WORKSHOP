//imports
import "dotenv/config";
import express from "express";
import { connect } from "mongoose";
import userRouter from "./routes/userRoute.js";
import authRouter from "./routes/authRoute.js";
import cors from "cors";
import jwt from "jsonwebtoken";
// import auth from "./middlewares/authMiddleware.js";
const server = express();

//db connection
main().catch((err) => {
  console.error("DB Connection failed: ", err);
});
async function main() {
  try {
    await connect(process.env.MONGO_URL);
    console.log("DB Connected !!");
  } catch (error) {
    console.error("Database connection error: ", error);
  }
}

//default route 
//(this API and the one "/" defined in the route is different because this means:
// http://localhost:8000/ 
//and the one defined in the routes means
//http://localhost:8000/api/users/
server.get("/", (req, res) => {
  res.send("Hello, world! The server is running.");
});

//middlewares
const auth = (req, res, next) => {
  try {
    const authHeader = req.get("Authorization");
    console.log("Authorization Header:", authHeader);
    if (!authHeader) {
      return res.status(401).json({ error: "Authorization header missing" });
    }

    const token = authHeader.split("Bearer ")[1];
    console.log("extracted token :", token);

    if (!token) {
      return res.status(401).json({ error: "Token missing or malformed" });
    }
    const decoded = jwt.verify(token, process.env.SECRET);
    console.log("Decoded Token:", decoded);

    req.user = decoded;
    next();
  } catch (err) {
    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Invalid token" });
    } else if (err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expired" });
    }
    return res.status(500).json({ error: "Internal server error" });
  }
};

server.use(cors());
server.use(express.json()); // this is for parsing the request coming in the json format into the object format
server.use('/api/auth', authRouter);
server.use('/api/users', auth, userRouter);

//starting the server
server.listen(process.env.PORT, () => {
  console.log(`server started at http://localhost:${process.env.PORT}/`);
});

//middleware
//apply middleware on routes /api/users
//now check in the postman if i am able to access any route without logging in or not
//ask chatgpt that how do i test this auth middleware is working or not
//next page -> fetch api of getallusers