import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import "./config/db";

import authRoutes from "./routes/auth.route";
import messageRoutes from "./routes/message.route";

import { app, server } from "./utils/socket";

app.set("trust proxy", 1);

app.use(express.json({ limit: "1mb" }));
const corsOptions = {
  origin: process.env.CLIENT_URL,
  credentials: true,
};

app.use(cors(corsOptions));

app.options("*", cors(corsOptions));

app.use(cookieParser());

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

app.get("/test-cookie", (req, res) => {
  res.cookie("test", "value", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });
  res.send("Test cookie sent");
});

server.listen(process.env.PORT, () => {
  console.log(`Server is running on ${process.env.PORT}`);
});
