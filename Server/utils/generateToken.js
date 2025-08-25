import jwt from "jsonwebtoken";

const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },          // payload
    process.env.JWT_SECRET,  // secret
    { expiresIn: "7d" }      // optional: token expiration
  );
};

export default generateToken;
