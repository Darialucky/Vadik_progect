export const notFoundHandler = (req, res, next) => {
  res.status(404).json({
    status: 404,
    massege: 'Route not found',
  });
  next();
};
