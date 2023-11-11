<template>
  <div id="search-bar">
    <div class="left-container">
      <label class="label" for="search-input">País</label>
      <input
        type="text"
        id="search-input"
        placeholder="Escribe el país que deseas ver"
        v-model="searchQuery"
        @click="handleSearchClick"
      />
    </div>
    <div class="right-container">
      <button @click="handleSearch">
        <i class="fa-solid fa-magnifying-glass" style="color: #ffffff"></i>
        Buscar
      </button>
    </div>
    <FilterContent
      v-if="showFilterContent"
      @continents-selected="handleContinentsSelected"
    />
  </div>
</template>

<script>
import FilterContent from "@/components/SearchBar/FilterContent.vue";

export default {
  components: {
    FilterContent,
  },
  data() {
    return {
      searchQuery: "",
      showFilterContent: false,
      selectedContinents: [],
    };
  },
  methods: {
    handleContinentsSelected(continents) {
      this.selectedContinents = continents;
      this.$emit("continents-selected", continents);
      // Agregar la emisión del evento también para MainContent
      this.$emit("continents-selected-main", continents);
    },

    handleSearch() {
      // Implementa la lógica de búsqueda aquí
      console.log("Búsqueda:", this.searchQuery);
    },
    handleSearchClick() {
      this.showFilterContent = !this.showFilterContent;
      console.log("hola");
      if (this.showFilterContent) {
        // Agregar un escuchador de eventos para cerrar FilterContent al hacer clic fuera de él
        document.addEventListener("click", this.handleDocumentClick);
      } else {
        // Remover el escuchador de eventos cuando se cierra FilterContent
        document.removeEventListener("click", this.handleDocumentClick);
      }
    },
    handleDocumentClick(event) {
      // Cerrar FilterContent si se hace clic fuera de él
      const searchBar = this.$el;
      if (!searchBar.contains(event.target)) {
        this.showFilterContent = false;
        document.removeEventListener("click", this.handleDocumentClick);
      }
    },
  },
  beforeUnmount() {
    // Remover el escuchador de eventos al destruir el componente
    document.removeEventListener("click", this.handleDocumentClick);
  },
  watch: {
    searchQuery(newVal) {
      console.log("Search Query Changed in SearchBar:", newVal);
      this.$emit("search-query-updated", newVal);
    },
  },
};
</script>

<style src="./SearchBar.css" scoped></style>
