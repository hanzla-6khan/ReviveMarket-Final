require("dotenv").config();

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");
const authRouter = require("./routes/authRoutes");
const productRouter = require("./routes/productRoutes");
const orderRouter = require("./routes/orderRoutes");
const userRouter = require("./routes/userRoutes");
const eventRouter = require("./routes/eventRoutes");
const chatRouter = require("./routes/messageRoutes");

// socket.io
const { initializeSocket } = require("./config/socket");
const http = require("http");

const app = express();
const server = http.createServer(app);

// Initialize Socket.IO
initializeSocket(server);

//  1. middleware
app.use(cors());
app.use(express.json());

// 2. routes
app.use("/api/auth", authRouter);
app.use("/api/products", productRouter);
app.use("/api/orders", orderRouter);
app.use("/api/users", userRouter);
app.use("/api/events", eventRouter);
app.use("/api/chat", chatRouter);

// 3. Connect to DB
connectDB();

// 4. listen to server
const PORT = 5000;
server.listen(PORT, () => console.log(`Server started on port ${PORT}`));

// 5 Global Error Handler
app.use((err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
});
