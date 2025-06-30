const carSchema = `
  CREATE TABLE IF NOT EXISTS cars (
    carId INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    brand VARCHAR(100) NOT NULL,
    model VARCHAR(100) NOT NULL,
    year INT NOT NULL,
    license_plate VARCHAR(20) NOT NULL UNIQUE,
    is_active BOOLEAN DEFAULT TRUE,
    daily_price DECIMAL(10,2) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    image VARCHAR(255)
  );
`;

module.exports = carSchema;