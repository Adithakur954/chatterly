// utils/asyncHandler.js

const asyncHandler = (requestHandler) => {
  return (req, res, next) => {
    Promise
      .resolve(requestHandler(req, res, next))
      .catch(next); // shorthand: next(err)
  };
};

export { asyncHandler };
