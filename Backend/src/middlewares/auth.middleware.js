import jwt from "jsonwebtoken";
const tokenBlacklistModel = require("../models/blacklist.model");

async function authUser(req, res, next) {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).json({
      message: "Token not provided.",
    });
  }

  const isTokenBlacklisted = await tokenBlacklistModel.findOne({
    token,
  });

  if (isTokenBlacklisted) {
    return res.status(401).json({
      message: "token is invalid",
    });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // It returns the payload if the user exist..else throw the error so use try and catch..

    req.user = decoded;

    next();
  } catch (err) {
    return res.status(401).json({
      message: "Invalid token.",
    });
  }
}

export { authUser };
