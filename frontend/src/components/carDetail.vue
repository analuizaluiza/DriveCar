<template>
  <div class="car-detail-container">
    <header>
      <h1><span class="logo-font">DriveCar</span></h1>
      <router-link to="/home" class="btn">Voltar</router-link>
    </header>

    <main v-if="carro" class="car-detail">
      <div class="image-wrapper">
        <img
          v-if="carro && carro.image"
          :src="formatImageUrl(carro.image)"
          :alt="carro.model"
        />
        <div v-else class="no-image">Imagem não disponível</div>
      </div>
      <div class="info">
        <h2>{{ carro.brand }} {{ carro.model }}</h2>
        <p><strong>Ano:</strong> {{ carro.year }}</p>
        <p><strong>Placa:</strong> {{ carro.license_plate }}</p>
        <p><strong>Preço por dia:</strong> R$ {{ carro.daily_price }}</p>
        <p>
          <strong>Descrição:</strong>
          {{ carro.description || "Sem descrição." }}
        </p>
      </div>
      <router-link :to="`/api/bookings/${carro.carId}`" class="reserve-button">
        Reservar este carro
      </router-link>
    </main>

    <div v-else class="loading">Carregando detalhes...</div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "CarDetailView",
  data() {
    return {
      carro: null,
    };
  },
  async created() {
    const id = this.$route.params.id;
    try {
      const res = await axios.get(`http://localhost:3000/api/cars/${id}`);
      this.carro = res.data;
    } catch (err) {
      console.error("Erro ao carregar detalhes do carro:", err);
    }
  },
  methods: {
    formatImageUrl(imagePath) {
      if (!imagePath) return ""; // imagem vazia
      return imagePath.startsWith("http")
        ? imagePath
        : `http://localhost:3000${imagePath}`;
    },
  },
};
</script>

<style scoped>
.image-wrapper {
  width: 100%;
  height: 400px;
  background: #eee;
  margin-bottom: 1rem;
}
.image-wrapper img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
.car-detail .info {
  font-size: 16px;
  color: #333;
}
.loading {
  text-align: center;
  font-size: 18px;
  margin-top: 50px;
}
.reserve-button {
  display: inline-block;
  padding: 10px 20px;
  background-color: #2c3e50;
  color: #fff;
  text-decoration: none;
  border-radius: 8px;
  margin-top: 1rem;
  transition: background-color 0.3s;
}

.reserve-button:hover {
  background-color: #1a242f;
}
</style>
