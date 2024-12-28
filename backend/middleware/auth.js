const jwt = require('jsonwebtoken');

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Unauthorized: No token provided' });
  }

  try {
    // Decode the token to check expiration
    const jwtPayload = jwt.decode(token);

    // Handle cases where decoding fails
    if (!jwtPayload || !jwtPayload.exp) {
      return res.status(401).json({ message: 'Unauthorized: Invalid token payload' });
    }

    // Check if the token is expired
    const isExpired = Date.now() >= jwtPayload.exp * 1000;
    if (isExpired) {
      return res.status(401).json({ message: 'Unauthorized: Token has expired' });
    }

    // Verify the token for signature validity
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach user data to the request
    req.user = decoded;

    // Pass control to the next middleware or route handler
    next();
  } catch (error) {
    return res.status(401).json({
      message: 'Unauthorized: Invalid token',
      error: error.message,
    });
  }
};


module.exports = authenticateToken;
