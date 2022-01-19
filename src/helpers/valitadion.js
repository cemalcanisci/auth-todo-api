function errorMessage(errorList) {
  let message;
  if (errorList.errors && Array.isArray(errorList.errors)) {
    message = errorList.errors[0].message;
  } else {
    message = errorList.message;
  }
  return { message, success: false };
}

function checkRequiredFields(requiredObject) {
  let nullValue;
  Object.keys(requiredObject).forEach((value) => {
    if (!requiredObject[value]) {
      nullValue = value;
    }
  });
  if (nullValue) {
    return {
      success: false,
      message: `${nullValue} is required`,
    };
  } else {
    return {
      success: true,
    };
  }
}

module.exports = {
  errorMessage,
  checkRequiredFields,
};
