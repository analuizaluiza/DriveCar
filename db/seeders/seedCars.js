const carSeedRows = [
  ["Toyota", "Corolla", 2020, "ABC1234", 1, 150.0, "https://s2-autoesporte.glbimg.com/73kXinHvt2BntljaJpbL7S6_8jY=/1200x/smart/filters:cover():strip_icc()/i.s3.glbimg.com/v1/AUTH_cf9d035bf26b4646b105bd958f32089d/internal_photos/bs/2021/q/9/kuBBhASjiPov0txZpMVw/corollaxeifrente.jpg"],
  ["Honda", "Civic", 2021, "XYZ9876", 1, 180.0, "https://image1.mobiauto.com.br/images/api/images/v1.0/285723747/transform/fl_progressive,f_webp,q_70,w_600"],
  ["Ford", "Focus", 2019, "LMN4567", 1, 120.0, "https://image1.mobiauto.com.br/images/api/images/v1.0/52392437/transform/fl_progressive,f_webp,q_80"],
  ["Chevrolet", "Onix", 2022, "QRS2345", 1, 200.0, "https://blog.karvi.com.br/wp-content/uploads/2021/12/novo-onix.jpg"]
];

const carInsertSQL = `
  INSERT INTO cars
    (brand, model, year, license_plate, is_active, daily_price, image)
  VALUES (?, ?, ?, ?, ?, ?, ?);
`;

async function seedCars(connection) {
  const [[{ count }]] = await connection.query(
    "SELECT COUNT(*) AS count FROM cars"
  );

  if (count === 0) {
    for (const car of carSeedRows) {
      await connection.query(carInsertSQL, car);
    }
    console.log("🚗 Seed de carros concluído.");
  } else {
    console.log(`ℹ️ Seed de carros ignorado (já possui ${count} registros).`);
  }
}

module.exports = seedCars;
