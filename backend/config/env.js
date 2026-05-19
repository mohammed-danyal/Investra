const validateEnv = () => {
  const required = ["MONGO_URL", "JWT_SECRET"];
  const missing = required.filter((key) => !process.env[key]);

  if (missing.length > 0) {
    console.error(`FATAL ERROR: Missing required environment variables: ${missing.join(", ")}`);
    process.exit(1);
  }
};

module.exports = validateEnv;
