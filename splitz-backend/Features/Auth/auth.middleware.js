import jwt from "jsonwebtoken";

export const checkToken = async (req, res, next) => {
  try {
    const header = req.headers["authorization"];
    if (!header) {
      throw new error("No Token Found");
    }

    const token = header.split(" ")[1];
    if (!token) {
      throw new error("Invalid Token");
    }

    const decoded_token = jwt.verify(token, process.env.JWT_PRIVATE_KEY);
    if (!decoded_token) throw new error("Incorrect Token Signature");

    req.token = decoded_token;
    next();
  } catch (err) {
    console.log(err);
    next(err);
  }
};
