<template>
  <div class="reserva-container">
    <header>
      <h1><span class="logo-font">DriveCar</span></h1>
      <nav>
        <router-link to="/home" class="btn">Voltar</router-link>
      </nav>
    </header>

    <main>
      <h2>Reserva de Carro</h2>

      <div v-if="carro" class="car-info">
        <p><strong>Modelo:</strong> {{ carro.brand }} {{ carro.model }}</p>
        <p><strong>Preço por dia:</strong> R$ {{ carro.daily_price }}</p>
      </div>

      <form @submit.prevent="fazerReserva">
        <label>Data de início:</label>
        <input type="date" v-model="startDate" required />

        <label>Data de término:</label>
        <input type="date" v-model="endDate" required />

        <div v-if="precoTotal > 0" class="total">
          Valor total: <strong>R$ {{ precoTotal }}</strong>
        </div>

        <button type="submit" class="btn">Confirmar Reserva</button>
      </form>

      <p v-if="mensagem" class="mensagem">{{ mensagem }}</p>
    </main>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "ReservaView",
  data() {
    return {
      carro: null,
      startDate: "",
      endDate: "",
      mensagem: "",
      precoTotal: 0,
    };
  },
  watch: {
    startDate: "atualizarPreco",
    endDate: "atualizarPreco",
  },
  async created() {
    const id = this.$route.params.id;
    try {
      const res = await axios.get(`http://localhost:3000/api/cars/${id}`);
      this.carro = res.data;
    } catch (err) {
      console.error("Erro ao buscar carro:", err);
    }
  },
  methods: {
    atualizarPreco() {
      if (this.startDate && this.endDate && this.carro) {
        const start = new Date(this.startDate);
        const end = new Date(this.endDate);
        start.setHours(0, 0, 0, 0);
        end.setHours(0, 0, 0, 0);
        const diff = (end - start) / (1000 * 60 * 60 * 24);
        this.precoTotal =
          diff > 0 ? Math.ceil(diff * this.carro.daily_price) : 0;
      } else {
        this.precoTotal = 0;
      }
    },

    async fazerReserva() {
      try {
        const token = localStorage.getItem("token");
        await axios.post(
          "http://localhost:3000/api/bookings",
          {
            carId: this.carro._carId || this.carro.carId,
            start_date: this.startDate,
            end_date: this.endDate,
            total_price: this.precoTotal,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        this.mensagem = "Reserva realizada com sucesso!";
        setTimeout(() => {
          this.$router.push("/");
        }, 2000);
      } catch (err) {
        console.error("Erro ao reservar:", err);
        this.mensagem = "Erro ao realizar a reserva.";
      }
    },
  },
};
</script>

<style scoped>
.reserva-container {
  min-height: 100vh;
  background-color: #f9f9f9;
}

header {
  background-color: #0e4079;
  color: white;
  padding: 20px 40px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
}

.logo-font {
  font-family: "Satisfy", cursive;
  font-size: 32px;
}

main {
  max-width: 600px;
  margin: 40px auto;
  background-color: #fff;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

h2 {
  margin-bottom: 20px;
  font-size: 24px;
  text-align: center;
}

.car-info {
  background-color: #f8f8f8;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 20px;
  font-size: 16px;
}

form label {
  display: block;
  margin-top: 16px;
  font-weight: 600;
}

input[type="date"] {
  width: 100%;
  padding: 8px;
  margin-top: 6px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.total {
  margin-top: 16px;
  font-size: 18px;
  font-weight: bold;
  color: #2c3e50;
}

.btn {
  display: inline-block;
  background-color: #0e4079;
  color: white;
  padding: 10px 20px;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  margin-top: 20px;
  font-weight: 600;
  text-decoration: none;
  transition: background-color 0.3s;
}

.btn:hover {
  background-color: #072847;
}

.mensagem {
  margin-top: 20px;
  font-weight: bold;
  color: green;
  text-align: center;
}
</style>
