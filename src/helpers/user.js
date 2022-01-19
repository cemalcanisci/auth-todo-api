function convertUser(user) {
    const { id, firstName, lastName, email } = user;
    return {
      id,
      firstName,
      lastName,
      email,
    };
  }

  module.exports={
    convertUser
  }