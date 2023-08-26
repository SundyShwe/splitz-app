import express from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import connectDB from "./config/database.js";
import { ErrorResponse } from "./config/error.js";

//routers
import authRouter from "./Features/Auth/auth.router.js";
import groupsRouter from "./Features/Groups/groups.router.js";
import settlementsRouter from "./Features/Settlements/settlements.router.js";
import { checkToken } from "./Features/Auth/auth.middleware.js";

//initializationa
dotenv.config({ path: "./config/config.env" });
const port = process.env.PORT || 3000;

const app = express();
app.use(express.json());
app.use(cors());

//connect DB
connectDB();

//logging
if (process.env.NODE_ENV === "development") app.use(morgan("dev"));

// serving all reciept images
app.use(
  "/receipts",
  express.static(
    path.join(fileURLToPath(new URL(".", import.meta.url)), "uploads")
  )
);

//routing
app.use("/auth", authRouter);
app.use("/groups", checkToken, groupsRouter);
app.use("/settlements", checkToken, settlementsRouter);

// Catch all unhandled requests
app.all("*", async (req, res, next) =>
  next(new ErrorResponse(`Route not found`, 404))
);

// error handler
app.use((error, req, res, next) => {
  res.json({ success: false, data: error.message, status: error.status });
});

app.listen(port, () => {
  console.log(`Listing to ${port} on ${process.env.NODE_ENV}`);
});
