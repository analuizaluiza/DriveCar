<template>
  <div class="perfil-container">
    <router-link to="/home" class="btn-voltar">← Voltar</router-link>
    <header class="perfil-header">
      <div class="avatar">
        {{ (usuario.name || "").charAt(0).toUpperCase() }}
      </div>
      <div class="perfil-info">
        <div class="top-info">
          <h2 class="username">{{ usuario.name }}</h2>
          <button class="edit-btn" @click="modoEdicao = !modoEdicao">
            Editar Perfil
          </button>
          <button class="logout-btn" @click="logout">Sair</button>
          <button class="delete-btn" @click="deletarPerfil">
            Deletar Conta
          </button>
        </div>
      </div>
    </header>

    <div v-if="modoEdicao" class="edit-form">
      <input type="text" v-model="usuario.name" placeholder="Novo nome" />
      <input type="email" v-model="usuario.email" placeholder="Novo email" />
      <input
        type="password"
        v-model="usuario.senha"
        placeholder="Nova senha (opcional)"
      />
      <button class="save-btn" @click="atualizarPerfil">Salvar</button>
      <button class="save-btn" @click="modoEdicao = false">Cancelar</button>
      <p v-if="mensagem">{{ mensagem }}</p>
    </div>

    <section class="reservas-section">
      <h3>Minhas Reservas</h3>
      <div v-if="reservas.length === 0">Nenhuma reserva encontrada.</div>
      <ul v-else>
        <li
          v-for="reserva in reservas"
          :key="reserva.bookingId"
          class="reserva-item"
        >
          <p>
            <strong>Carro:</strong> {{ reserva.model }} - {{ reserva.brand }}
          </p>
          <p>
            <strong> Data de Início: </strong>
            {{ formatarData(reserva.start_date) }}
          </p>
          <p>
            <strong>Data de Fim:</strong>
            {{ formatarData(reserva.end_date) }}
          </p>
          <p><strong>Valor Total:</strong> R$ {{ reserva.total_price }}</p>
        </li>
      </ul>
    </section>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "ProfileView",
  data() {
    return {
      usuario: {
        name: "",
        email: "",
        senha: "",
      },
      modoEdicao: false,
      mensagem: "",
      reservas: [],
    };
  },
  mounted() {
    this.carregarPerfil();
    this.carregarReservas();
  },
  methods: {
    formatarData(dataISO) {
      return new Date(dataISO).toLocaleDateString("pt-BR", {
        timeZone: "UTC",
      });
    },
    async carregarPerfil() {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:3000/api/user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        this.usuario.name = res.data.name;
        this.usuario.email = res.data.email;
      } catch (erro) {
        console.error("Erro ao carregar perfil:", erro);
      }
    },
    async carregarReservas() {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("http://localhost:3000/api/bookings", {
          headers: { Authorization: `Bearer ${token}` },
        });
        console.log("RESERVAS RECEBIDAS:", res.data);

        this.reservas = res.data;
      } catch (erro) {
        console.error("Erro ao carregar reservas:", erro);
      }
    },
    async atualizarPerfil() {
      try {
        const token = localStorage.getItem("token");
        const payload = { name: this.usuario.name, email: this.usuario.email };
        if (this.usuario.senha) payload.password = this.usuario.senha;

        await axios.put("http://localhost:3000/api/user", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });

        this.mensagem = "Perfil atualizado com sucesso!";
        this.usuario.senha = "";
        this.modoEdicao = false;
      } catch (erro) {
        console.error("Erro ao atualizar perfil:", erro);
        this.mensagem = "Erro ao atualizar.";
      }
    },
    async deletarPerfil() {
      if (!confirm("Tem certeza que deseja deletar sua conta?")) return;

      try {
        const token = localStorage.getItem("token");
        await axios.delete("http://localhost:3000/api/user", {
          headers: { Authorization: `Bearer ${token}` },
        });
        this.mensagem = "Conta deletada. Redirecionando...";
        localStorage.removeItem("token");
        setTimeout(() => this.$router.push("/register"), 2000);
      } catch (erro) {
        console.error("Erro ao deletar perfil:", erro);
        this.mensagem = "Erro ao deletar conta.";
      }
    },
    logout() {
      localStorage.removeItem("token");
      this.$router.push("/login");
    },
  },
};
</script>

<style scoped>
.reservas-section ul {
  list-style-type: none;
  padding-left: 0;
}

.perfil-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 24px 16px;
  min-height: calc(100vh - 60px);
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  background-color: #f4f7fa;
}

.perfil-header {
  display: flex;
  align-items: center;
  gap: 24px;
  margin-bottom: 32px;
  background-color: #ffffff;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.avatar {
  width: 100px;
  height: 100px;
  background-color: #0e4079;
  border-radius: 50%;
  color: white;
  font-weight: bold;
  font-size: 36px;
  display: flex;
  justify-content: center;
  align-items: center;
  user-select: none;
}

.perfil-info {
  flex: 1;
}

.top-info {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 12px;
}

.username {
  font-size: 26px;
  color: #333333;
  font-weight: 600;
}

.edit-btn,
.logout-btn,
.delete-btn {
  background-color: #0e4079;
  border: none;
  color: white;
  border-radius: 6px;
  padding: 8px 16px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.edit-btn:hover,
.logout-btn:hover,
.delete-btn:hover {
  background-color: #08315e;
}

.edit-form {
  background-color: #ffffff;
  border: 1px solid #dbdbdb;
  padding: 24px;
  border-radius: 12px;
  margin-top: 20px;
  max-width: 500px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.edit-form input {
  width: 90%;
  padding: 12px;
  margin-bottom: 16px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 14px;
}

.edit-form button {
  background-color: #0e4079;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 6px;
  cursor: pointer;
  font-size: 14px;
  margin-right: 8px;
  transition: background-color 0.3s;
}

.edit-form button:hover {
  background-color: #08315e;
}

.reservas-section {
  margin-top: 40px;
}

.reservas-section h3 {
  font-size: 24px;
  margin-bottom: 16px;
  color: #0e4079;
}

.reserva-item {
  background-color: #ffffff;
  border: 1px solid #dbdbdb;
  padding: 20px;
  border-radius: 12px;
  margin-bottom: 16px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
}

.reserva-item p {
  margin: 4px 0;
}

.btn-voltar {
  display: inline-block;
  margin-bottom: 24px;
  color: #0e4079;
  font-weight: bold;
  cursor: pointer;
  text-decoration: none;
}

.btn-voltar:hover {
  text-decoration: underline;
}
</style>
