const userSchema = `
  CREATE TABLE IF NOT EXISTS users (
      userId INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
      email VARCHAR(255) NOT NULL,
      password VARCHAR(255) NOT NULL,
      name VARCHAR(255) NOT NULL
  );
`;

module.exports = userSchema;
