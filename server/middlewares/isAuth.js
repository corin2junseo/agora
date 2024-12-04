import jwt from "jsonwebtoken";
import { User } from "../models/User.js";

export const isAuth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(403).json({
        message: "Please Login",
      });
    }

    const decodedData = jwt.verify(token, process.env.Jwt_Sec);
    console.log("Decoded Data:", decodedData); // 디코드된 데이터 로그

    req.user = await User.findById(decodedData._id).select("-password");

    if (!req.user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    console.log("Authenticated User:", req.user); // 인증된 사용자 로그
    next();
  } catch (error) {
    console.error("Auth Error:", error); // 오류 로그
    res.status(500).json({
      message: "Login First",
    });
  }
};


export const isAdmin = (req, res, next) => {
  try {
    if (!req.user) {
      return res.status(403).json({
        message: "User not authenticated",
      });
    }

    if (req.user.role !== "admin") {
      return res.status(403).json({
        message: "You are not authorized to access this resource.",
      });
    }

    next();
  } catch (error) {
    console.error("Admin Check Error:", error); // 오류 로그
    res.status(500).json({
      message: "Internal server error",
    });
  }
};
