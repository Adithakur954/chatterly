// utils/asyncHandler.js

const asyncHandler = (requestHandler) => (req, res, next) => {
  try {
    requestHandler(req, res, next);
  } catch (error) {
    next(error);
  }
};

export { asyncHandler };