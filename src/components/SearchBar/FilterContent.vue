<template>
  <div id="filter-content">
    <div class="header">
      <div class="title">Filtrar por continentes</div>
      <div class="clear" @click="handleClear">Limpiar</div>
    </div>
    <div class="main-filter">
      <div
        v-for="continent in continentsWithCountries"
        :key="continent.name"
        class="card"
        :class="{ selected: continent.isSelected }"
        @click="toggleSelect(continent)"
      >
        <img
          :src="continent.imageUrl"
          alt="Continent Image"
          class="continent-image"
          :class="{ selected: continent.isSelected }"
        />
        <div class="continent-name">{{ continent.name }}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { generateContinentImage } from "@/api.js";

export default {
  data() {
    return {
      continentsWithCountries: [],
    };
  },
  computed: {
    selectedContinents() {
      return this.continentsWithCountries
        .filter((continent) => continent.isSelected)
        .map((continent) => continent.name);
    },
  },
  async created() {
    await this.fetchContinents();
  },
  methods: {
    toggleSelect(continent) {
      continent.isSelected = !continent.isSelected;

      // Emitir un evento con la lista completa de continentes seleccionados
      const selectedContinents = this.continentsWithCountries
        .filter((continent) => continent.isSelected)
        .map((continent) => continent.name);

      this.$emit("continents-selected", selectedContinents);

      // Devolver el array completo a toggleSelect
      return selectedContinents;
    },
    async fetchContinents() {
      try {
        const response = await fetch("https://restcountries.com/v2/all");
        const data = await response.json();

        this.continentsWithCountries = data
          .filter((country) => country.region)
          .reduce((continents, country) => {
            const existingContinent = continents.find(
              (continent) => continent.name === country.region
            );

            if (existingContinent) {
              existingContinent.countries.push(country.name);
            } else {
              continents.push({
                name: country.region,
                countries: [country.name],
                imageUrl: "",
                isSelected: false, // Nuevo campo para rastrear la selección
              });
            }

            return continents;
          }, [])
          .filter((continent) => continent.countries.length > 1);

        await this.fetchContinentImages();
      } catch (error) {
        console.error("Error fetching continents:", error);
      }
    },
    async fetchContinentImages() {
      for (const continent of this.continentsWithCountries) {
        try {
          const imageUrl = await generateContinentImage(continent.name);
          continent.imageUrl = imageUrl;
        } catch (error) {
          console.error(`Error obtaining image for ${continent.name}`, error);
        }
      }
    },
    async handleClear() {
      // Limpiar los elementos del array y obtener el array resultante
      this.continentsWithCountries.forEach(
        (continent) => (continent.isSelected = false)
      );

      // Emitir el array limpio
      this.$emit("continents-selected", []);
      console.log("Clear filters");

      // Devolver el array limpio a toggleSelect
      return [];
    },
  },
};
</script>

<style src="./FilterContent.css" scoped></style>
