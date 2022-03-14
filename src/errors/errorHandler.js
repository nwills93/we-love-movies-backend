//middleware for all errors. defaults to '500' if no status is provided.

function errorHandler(error, request, response, next) {
    const { status = 500, message = "Something went wrong!" } = error;
    response.status(status).json({ error: message });
  }
  
  module.exports = errorHandler;
  