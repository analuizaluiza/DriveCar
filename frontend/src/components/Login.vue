<template>
  <div class="login-container">
    <div class="login-box">
      <div class="login-header">
        <h2><span class="logo-font">DriveCar</span></h2>
        <p>Faça login para acessar sua conta</p>
      </div>
      <form @submit.prevent="login" class="login-form">
        <div class="input-group">
          <label for="email">Email</label>
          <input
            id="email"
            type="email"
            v-model="email"
            placeholder="seu@email.com"
            required
          />
        </div>

        <div class="input-group">
          <label for="senha">Senha</label>
          <div class="password-wrapper">
            <input
              id="senha"
              :type="showPassword ? 'text' : 'password'"
              v-model="senha"
              placeholder="Digite sua senha"
              required
            />
            <button type="button" @click="showPassword = !showPassword">
              {{ showPassword ? "Esconder" : "Mostrar" }}
            </button>
          </div>
        </div>

        <div class="options">
          <a href="#" class="forgot-link">Esqueceu a senha?</a>
        </div>

        <button type="submit" class="submit-btn" :disabled="loading">
          {{ loading ? "Carregando..." : "Entrar" }}
        </button>

        <p v-if="erro" class="message error">
          {{ erro }}
        </p>
      </form>

      <div class="register-link">
        Não tem uma conta? <router-link to="/register">Cadastre-se</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "LoginView",
  data() {
    return {
      email: "",
      senha: "",
      erro: "",
      showPassword: false,
      loading: false,
    };
  },
  methods: {
    async login() {
      this.loading = true;
      this.erro = "";

      try {
        const res = await axios.post("http://localhost:3000/login", {
          email: this.email,
          password: this.senha,
        });

        localStorage.setItem("token", res.data.access_token);

        // 🔍 Aqui pegamos o redirect da query string
        const redirect = this.$route.query.redirect;

        if (redirect) {
          this.$router.push(redirect); // volta pra onde tentou ir
        } else {
          this.$router.push("/home"); // login normal
        }
      } catch (err) {
        this.erro =
          err.response?.data?.error ||
          "Email ou senha inválidos. Por favor, tente novamente.";
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 120px);
  background-color: #f9f9f9;
  padding: 20px;
}

.login-box {
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
  padding: 40px;
  max-width: 440px;
  width: 100%;
}

.login-header h2 {
  margin: 0 0 8px;
  font-size: 28px;
  color: #0e4079;
}

.login-header p {
  font-size: 16px;
  color: #555;
}

.login-form {
  margin-top: 30px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.input-group {
  display: flex;
  flex-direction: column;
}

.input-group label {
  font-size: 14px;
  font-weight: 500;
  margin-bottom: 6px;
  color: #333;
}

.input-group input {
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 8px;
  font-size: 15px;
  transition: 0.2s ease-in-out;
}

.input-group input:focus {
  border-color: #0e4079;
  outline: none;
  box-shadow: 0 0 0 3px rgba(57, 126, 230, 0.144);
}

.password-wrapper {
  position: relative;
}

.password-wrapper input {
  width: 100%;
  padding-right: 80px;
  box-sizing: border-box;
}

.password-wrapper button {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: none;
  border: none;
  font-size: 13px;
  color: #666;
  cursor: pointer;
}

.options {
  text-align: right;
  font-size: 14px;
}

.forgot-link {
  color: #0e4079;
  text-decoration: none;
}

.submit-btn {
  background-color: #0e4079;
  color: white;
  padding: 12px;
  border: none;
  border-radius: 8px;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.3s;
}

.submit-btn:hover {
  background-color: #021830;
}

.submit-btn:disabled {
  background-color: #ccc;
  cursor: not-allowed;
}

.message {
  margin-top: 10px;
  font-size: 14px;
  padding: 10px;
  border-radius: 6px;
}

.message.error {
  background-color: #fdecea;
  color: #e63946;
  border: 1px solid #f5c2c7;
}

.register-link {
  margin-top: 24px;
  text-align: center;
  font-size: 14px;
  color: #555;
}

.register-link a {
  color: #0e4079;
  text-decoration: none;
  font-weight: bold;
}
</style>
