import { verifyToken } from "../utils/token.js";

const authMiddleware = (req, res, next) => {
    try{
        console.log("Authorization header:", req.headers.authorization);
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            return res.status(401).json({
                message: "Authorization failed - [Missing token]"
            });
        }

        const token = authHeader.split(" ")[1];
        const decoded = verifyToken(token);

        req.user = decoded;

        console.log(`[INFO] Authorization successful..`);
        next();
    }
    catch (error) {
        return res.status(401).json({
            message: "Invalid or expired token - [...Please login again...]",
        });
    }
};

export default authMiddleware;