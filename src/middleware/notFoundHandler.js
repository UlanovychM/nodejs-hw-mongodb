export const notFoundHandler = (req, res, next) => {
  if (next === 'fake') {
    next();
  }
  res.status(404).json({
    message: 'Route not found',
  });
};
