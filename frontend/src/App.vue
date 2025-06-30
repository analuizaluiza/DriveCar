<template>
  <div id="app">
    <!-- Aqui será renderizado o conteúdo de cada rota -->
    <router-view />

    <footer>
      <div class="footer-column">
        <h3>DriveCar</h3>
        <p>Facilitando as suas viagens.</p>
      </div>
      <div class="footer-bottom">
        © 2025 DriveCar. Todos os direitos reservados.
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  name: "App",
};
</script>

<style></style>
