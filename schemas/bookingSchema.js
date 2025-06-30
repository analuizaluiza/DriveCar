const bookingSchema = `
  CREATE TABLE IF NOT EXISTS bookings (
    bookingId INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id INT UNSIGNED NOT NULL,
    car_id INT UNSIGNED NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    total_price DECIMAL(10,2) NOT NULL,
    status ENUM('active', 'cancelled', 'completed') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    cancelled_at TIMESTAMP NULL DEFAULT NULL,

    
    FOREIGN KEY (user_id) REFERENCES users(userId) ON DELETE CASCADE ON UPDATE CASCADE,
    FOREIGN KEY (car_id) REFERENCES cars(carId) ON DELETE CASCADE ON UPDATE CASCADE
  );
`;

module.exports = bookingSchema;
