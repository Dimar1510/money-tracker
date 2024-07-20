const errorMessage = (statusCode, message) => {
  const error = new Error();
  error.statusCode = statusCode;
  console.log(message);
  return error;
};

module.exports = errorMessage;
