module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: ["airbnb-base", "prettier"],
  parserOptions: {
    ecmaVersion: "latest",
  },
  rules: {
    "import/no-unresolved": 0,
    "import/extensions": 0,
    "import/prefer-default-export": 0,
  },
};
