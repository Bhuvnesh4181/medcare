const protect = (req, res, next) => {
  // Check if user is authenticated (using Passport's isAuthenticated method)
  if (req.isAuthenticated()) {
      return next(); // User is authenticated, proceed to next middleware/route handler
  }
  
  // If user is not authenticated, send error response
  res.status(401).json({ message: 'Not authorized, please login' });
};

module.exports = {
  protect
}; 