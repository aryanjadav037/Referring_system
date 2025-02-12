import jwt from "jsonwebtoken";

const key = process.env.JWT_SECRET || "my_secret_key"; 

// export const authMiddleware = (req, res, next) => {
//     try {
//         const token = req.header("Authorization").split(' ')[1];
//         if (!token) {
//             return res.status(401).json({ msg: "Access Denied! No token provided." });
//         }

//         const verified = jwt.verify(token, key);
//         req.user = verified; 
//         next();
//     } catch (error) {
//         return res.status(403).json({ msg: "Invalid or expired token" });
//     }
// };

export const authMiddleware = (req, res, next) => {
    const token = req.cookies.access_token;
    if (!token) {
      return res.sendStatus(403);
    }
    try {
      const data = jwt.verify(token, key);
      req.userId = data.id;
      return next();
    } catch {
      return res
      .sendStatus(403);
    }
  };
