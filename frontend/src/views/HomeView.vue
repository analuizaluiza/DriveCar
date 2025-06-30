<template>
  <div id="app">
    <header>
      <h1><span class="logo-font">DriveCar</span></h1>
      <nav>
        <router-link to="/login">Login</router-link>
      </nav>
    </header>

    <main>
      <h1>Encontre o carro perfeito para sua viagem!</h1>
      <p>Alugue veículos com conforto e segurança para suas aventuras.</p>
      <p>Cadastre-se e fique por dentro de todas as novidades!</p>
      <router-link to="/register" class="btn btn-primary">
        Cadastrar
      </router-link>

      <section class="search">
        <input
          type="text"
          v-model="searchTerm"
          @input="buscarCarros"
          placeholder="Buscar carros por modelo ou marca..."
        />
      </section>

      <section class="feed">
        <h2>Carros Disponíveis para Aluguel</h2>

        <div v-if="loading" class="loading">Carregando carros...</div>

        <div v-else-if="cars.length === 0" class="empty-message">
          Nenhum carro disponível no momento.
        </div>

        <div v-else class="card-container">
          <div
            v-for="(car, index) in cars"
            :key="car.carId"
            class="card"
            @click="tentarReservar(car.carId)"
            role="button"
            tabindex="0"
            @keyup.enter="tentarReservar(car.carId)"
          >
            <img
              :src="car.image || getDefaultImage(index)"
              :alt="car.brand + ' ' + car.model"
            />
            <h3>{{ car.brand }} {{ car.model }}</h3>
            <p class="price">Alugue por R$ {{ car.daily_price }}/dia</p>
            <button
              class="btn-reservar"
              @click.stop="tentarReservar(car.carId)"
            >
              Reservar
            </button>
          </div>
        </div>
      </section>
    </main>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "HomeView",
  data() {
    return {
      cars: [],
      loading: false,
      searchTerm: "",
    };
  },
  methods: {
    async buscarCarros() {
      this.loading = true;
      try {
        let url = "/api/cars";
        if (this.searchTerm.trim() !== "") {
          url = `/api/cars/search?q=${encodeURIComponent(this.searchTerm)}`;
        }
        const res = await axios.get(url);
        this.cars = res.data;
      } catch (error) {
        console.error("Erro ao buscar carros:", error);
        this.cars = [];
      } finally {
        this.loading = false;
      }
    },

    getDefaultImage(index) {
      const defaultImages = [
        "https://source.unsplash.com/400x300/?car,suv",
        "https://source.unsplash.com/400x300/?car,sport",
        "https://source.unsplash.com/400x300/?car,luxury",
      ];
      return defaultImages[index % defaultImages.length];
    },

    tentarReservar(carId) {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Você precisa estar cadastrado e logado para reservar um carro.");
        this.$router.push("/register");
        return;
      }
      this.$router.push(`/car/${carId}`);
    },
  },
  async created() {
    await this.buscarCarros();
  },
};
</script>

<style>
.search input {
  width: 100%;
  padding: 0.5rem 1rem;
  margin-bottom: 1rem;
  margin-top: 1rem;
  font-size: 1rem;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.price {
  font-size: 1.1rem;
  color: #333;
  margin-bottom: 1rem;
}

.btn-reservar {
  background-color: #0e4079;
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.6rem 1.2rem;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s;
  margin: 0 auto 20px auto;
  width: 350px;
}

.btn-reservar:hover {
  background-color: #08315e;
}

.loading,
.empty-message {
  font-size: 1.2rem;
  color: #666;
  text-align: center;
  padding: 2rem 0;
}
</style>
