<template>
  <div class="register-container">
    <div class="register-box">
      <div class="register-header">
        <h2><span class="logo-font">DriveCar</span></h2>
        <p>Preencha os dados para se cadastrar</p>
      </div>
      <form @submit.prevent="register" class="register-form">
        <div class="input-group">
          <label for="nome">Nome completo</label>
          <input id="nome" v-model="nome" type="text" required />
        </div>

        <div class="input-group">
          <label for="email">Email</label>
          <input id="email" v-model="email" type="email" required />
        </div>

        <div class="input-group">
          <label for="senha">Senha</label>
          <div class="password-wrapper">
            <input
              :type="showPassword ? 'text' : 'password'"
              id="senha"
              v-model="senha"
              required
            />
            <button type="button" @click="showPassword = !showPassword">
              {{ showPassword ? "Esconder" : "Mostrar" }}
            </button>
          </div>
          <p class="password-hint">Mínimo de 8 caracteres</p>
        </div>

        <div class="input-group">
          <label for="confirmarSenha">Confirmar senha</label>
          <div class="password-wrapper">
            <input
              :type="showConfirmPassword ? 'text' : 'password'"
              id="confirmarSenha"
              v-model="confirmarSenha"
              required
            />
            <button
              type="button"
              @click="showConfirmPassword = !showConfirmPassword"
            >
              {{ showConfirmPassword ? "Esconder" : "Mostrar" }}
            </button>
          </div>
        </div>

        <button type="submit" class="submit-btn" :disabled="loading">
          {{ loading ? "Carregando..." : "Cadastrar" }}
        </button>

        <p class="message error" v-if="erro">{{ erro }}</p>
        <p class="message success" v-if="sucesso">{{ sucesso }}</p>
      </form>

      <div class="login-link">
        Já tem uma conta? <router-link to="/login">Entrar</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "RegisterView",
  data() {
    return {
      nome: "",
      email: "",
      senha: "",
      confirmarSenha: "",
      aceitouTermos: false,
      erro: "",
      sucesso: "",
      showPassword: false,
      showConfirmPassword: false,
      loading: false,
    };
  },
  methods: {
    async register() {
      this.erro = "";
      this.sucesso = "";
      this.loading = true;

      if (this.senha !== this.confirmarSenha) {
        this.erro = "As senhas não coincidem.";
        this.loading = false;
        return;
      }

      if (this.senha.length < 8) {
        this.erro = "A senha deve ter no mínimo 8 caracteres.";
        this.loading = false;
        return;
      }

      try {
        const res = await axios.post("http://localhost:3000/register", {
          name: this.nome,
          email: this.email,
          password: this.senha,
        });

        this.sucesso = "Cadastro realizado com sucesso!";
        localStorage.setItem("token", res.data.access_token);
        setTimeout(() => this.$router.push("/perfil"), 2000);
      } catch (err) {
        this.erro = err.response?.data?.error || "Erro ao cadastrar.";
      } finally {
        this.loading = false;
      }
    },
  },
};
</script>

<style scoped>
.register-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 120px);
  background-color: #f9f9f9;
  padding: 20px;
}

.register-box {
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
  padding: 40px;
  max-width: 440px;
  width: 100%;
}

.register-header h2 {
  margin: 0 0 8px;
  font-size: 28px;
  color: #0e4079;
}

.register-header p {
  font-size: 16px;
  color: #555;
}

.register-form {
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
  padding-right: 80px; /* espaço para o botão */
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

.password-hint {
  font-size: 12px;
  color: #888;
  margin-top: 4px;
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

.message.success {
  background-color: #d4edda;
  color: #155724;
  border: 1px solid #c3e6cb;
}

.login-link {
  margin-top: 24px;
  text-align: center;
  font-size: 14px;
  color: #555;
}

.login-link a {
  color: #0e4079;
  text-decoration: none;
  font-weight: bold;
}
</style>
