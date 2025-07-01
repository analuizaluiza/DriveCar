<template>
  <div class="feed-container">
    <header>
      <h1><span class="logo-font">DriveCar</span></h1>
      <nav>
        <router-link to="/profile">Perfil</router-link>
        <router-link to="/" @click="logout">Sair</router-link>
      </nav>
    </header>

    <main class="feed">
      <section class="search">
        <input
          type="text"
          v-model="searchTerm"
          @input="buscarCarros"
          placeholder="Buscar carros por modelo ou marca..."
          class="search-input"
        />
      </section>

      <section>
        <div v-if="loading" class="loading">Carregando carros...</div>

        <div v-else>
          <div v-if="cars.length === 0" class="sem-posts">
            Nenhum carro encontrado.
          </div>

          <div v-else>
            <router-link
              v-for="car in cars"
              :key="car.carId"
              :to="`/car/${car.carId}`"
              class="post-card"
              style="text-decoration: none; color: inherit"
            >
              <div class="post-image-wrapper">
                <img :src="car.image" :alt="car.model" class="post-image" />
              </div>
              <div class="post-body">
                <div class="caption">
                  <strong>{{ car.brand }} {{ car.model }}</strong
                  ><br />
                  Ano: {{ car.year }}<br />
                  Placa: {{ car.license_plate }}<br />
                  Preço por dia: R$ {{ car.daily_price }}
                </div>
              </div>
            </router-link>
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
    logout() {
      localStorage.removeItem("token");
      this.$router.push("/login");
    },
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
  },
  async created() {
    await this.buscarCarros();
  },
};
</script>

<style scoped>
.feed-container {
  background-color: #fafafa;
  min-height: 100vh;
  padding: 0;
  width: 100%;
  margin: 0 auto;
}

.topbar {
  width: 100%;
  background-color: #0e4079;
  border-bottom: 1px solid #dbdbdb;
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  position: sticky;
  top: 0;
  z-index: 10;
}

.search-input {
  padding: 6px 12px;
  border-radius: 8px;
  border: 1px solid #dbdbdb;
  font-size: 14px;
  flex: 1 1 200px;
  max-width: 300px;
  background-color: #fafafa;
}

.topbar-actions {
  display: flex;
  gap: 12px;
}

.profile-btn,
.logout-btn {
  background-color: transparent;
  border: none;
  color: #ffffff;
  font-weight: 600;
  cursor: pointer;
  font-size: 14px;
}

.feed {
  max-width: 1000px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.post-card {
  width: 100%;
  max-width: 900px;
  background-color: #fff;
  border: 1px solid #dbdbdb;
  border-radius: 6px;
  overflow: hidden;
  box-shadow: 0 2px 6px rgb(0 0 0 / 0.1);
  display: flex;
  flex-direction: column;
  margin-bottom: 24px;
}

.post-image-wrapper {
  width: 100%;
  height: 500px;
  background-color: #efefef;
}

.post-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.post-header {
  padding: 8px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.post-body {
  padding: 8px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.post-actions {
  display: flex;
  gap: 8px;
}

.caption {
  font-size: 12px;
  color: #262626;
  text-align: left;
  word-break: break-word;
}

.sem-posts {
  text-align: center;
  color: #999;
  font-size: 16px;
  margin-top: 20px;
}

.post-menu {
  background: transparent;
  border: none;
  font-size: 20px;
  line-height: 1;
  color: #262626;
  cursor: pointer;
  user-select: none;
}
</style>
