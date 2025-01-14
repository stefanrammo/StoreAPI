const jwt = require("jsonwebtoken");

// Admin authorization middleware
const verifyAdmin = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1]; // Bearer token format

  if (!token) {
    return res.status(403).send({ error: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    if (decoded.role !== "admin") {
      return res.status(403).send({ error: "You do not have admin privileges" });
    }

    req.user = decoded; // Attach user data to the request
    next();
  } catch (error) {
    console.error("Error verifying admin token:", error);
    res.status(401).send({ error: "Invalid or expired token" });
  }
};

// Customer authorization middleware
const verifyCustomer = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(403).send({ error: "No token provided" });
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    if (decoded.role !== "customer" && decoded.role !== "admin") {
      return res.status(403).send({ error: "Access denied" });
    }

    req.user = decoded; // Attach user data to the request
    next();
  } catch (error) {
    console.error("Error verifying customer token:", error);
    res.status(401).send({ error: "Invalid or expired token" });
  }
};

module.exports = { verifyAdmin, verifyCustomer };
