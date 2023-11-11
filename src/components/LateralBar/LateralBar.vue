<!-- LateralBar.vue -->
<template>
  <!-- Barra lateral -->
  <aside class="lateral-bar">
    <!-- Botón del logo -->
    <button
      @click="handleButtonClick('logo')"
      class="logo-button"
      id="logo-button"
    >
      Logo
    </button>

    <!-- Botones de navegación -->
    <button
      @click="handleButtonClick('home')"
      :class="{ active: activeButton === 'home' }"
      class="custom-button"
    >
      HOME
    </button>
    <button
      @click="handleButtonClick('firstview')"
      :class="{ active: activeButton === 'firstview' }"
      class="custom-button"
    >
      Vista 1
    </button>
    <button
      @click="handleButtonClick('secondview')"
      :class="{ active: activeButton === 'secondview' }"
      class="custom-button"
    >
      Vista 2
    </button>
  </aside>
</template>

<script>
export default {
  data() {
    return {
      activeButton: "home",
    };
  },
  methods: {
    // Maneja el clic en los botones de la barra lateral
    handleButtonClick(button) {
      this.activeButton = button;
      this.$emit("button-click", button);
    },
  },
};
</script>

<style src="./LateralBar.css" scoped></style>
