<template>
  <!-- Vista de detalle del país -->
  <div class="country-detail">
    <!-- Botón para cerrar la vista de detalle -->
    <button @click="hideCountryDetail">X</button>

    <!-- Imagen grande del país -->
    <img
      :src="selectedCountryImage"
      alt="Country Image"
      class="country-image-top"
    />

    <!-- Contenedor para la bandera y la información del país -->
    <div class="country-info-container">
      <!-- Div para la bandera (ocupa el 30% del ancho) -->
      <div class="flag-container">
        <img
          v-if="selectedCountry"
          :src="selectedCountry.flagUrl"
          alt="Country Flag"
          class="country-flag"
        />
      </div>

      <!-- Div para el nombre y el continente (ocupa el 70% del ancho) -->
      <div class="text-container">
        <!-- Div para el nombre (50% del ancho de text-container) -->
        <div id="country-name">{{ selectedCountryName }}</div>

        <!-- Div para el continente (50% del ancho de text-container) -->
        <div id="country-continent">{{ selectedCountryContinent }}</div>
      </div>
    </div>

    <!-- Sección para información adicional del país -->
    <div v-if="allCountries && allCountries.length > 0">
      <div id="conteiner-1">
        <div id="country-capital">Capital:</div>
        <div id="country-capital-dato">
          {{ getCapital(selectedCountryName) }}
        </div>
      </div>
      <div id="conteiner-2">
        <div id="country-moneda">Moneda:</div>
        <div id="country-moneda-dato">{{ getMoneda(selectedCountryName) }}</div>
      </div>
      <div id="conteiner-3">
        <div id="country-language">Lenguaje:</div>
        <div id="country-language-dato">
          {{ getLanguage(selectedCountryName) }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  props: {
    selectedCountryName: String,
    selectedCountryContinent: String,
    selectedCountryImage: String,
  },
  data() {
    return {
      allCountries: null,
      selectedCountry: null,
      showCountryDetail: true,
    };
  },
  watch: {
    selectedCountryName: "fetchCountryDetails",
  },
  created() {
    // Realiza la solicitud a la API para obtener todos los países
    this.fetchAllCountries();
  },
  methods: {
    // Método para ocultar la vista de detalle del país
    hideCountryDetail() {
      // Cambia el valor de showCountryDetail a false
      this.showCountryDetail = false;

      // Imprime el valor actual de showCountryDetail en la consola
      console.log(
        "Valor actual desde countrydetail showCountryDetail:",
        this.showCountryDetail
      );

      // Emite un evento llamado 'hide-country-detail' con el valor actual de showCountryDetail
      this.$emit("hide-country-detail", this.showCountryDetail);
    },

    // Método asincrónico para obtener detalles del país seleccionado
    async fetchCountryDetails() {
      try {
        // Realiza una solicitud para obtener detalles del país por su nombre
        const response = await fetch(
          `https://restcountries.com/v2/name/${this.selectedCountryName}`
        );
        const data = await response.json();
        const country = data[0];

        if (country) {
          // Obtiene la bandera desde la API
          const flagResponse = await fetch(
            `https://restcountries.com/v2/name/${this.selectedCountryName}`
          );
          const flagData = await flagResponse.json();

          // Asigna los detalles del país a selectedCountry
          this.selectedCountry = {
            name: country.name,
            flagUrl: flagData?.flags?.png || country.flags?.png,
            largeImageUrl: country.flags?.svg,
            capital: country.capital,
            currency: country.currencies?.[0]?.name,
            // Agrega más detalles según sea necesario
          };
        } else {
          // Muestra un error si no se encuentra información para el país
          console.error(
            "No se encontró información para el país:",
            this.selectedCountryName
          );
        }
      } catch (error) {
        // Muestra un error si hay problemas al obtener detalles del país
        console.error("Error al obtener detalles del país:", error);
      }
    },

    // Método asincrónico para obtener la lista de todos los países
    async fetchAllCountries() {
      try {
        // Realiza una solicitud para obtener la lista de países
        const response = await axios.post(
          "https://countries.trevorblades.com/",
          {
            query: `
              query {
                countries {
                  code
                  name
                  capital
                  currency
                  languages {
                    name
                  }
                  # Agrega más campos según sea necesario
                }
              }
            `,
          }
        );

        // Almacena la lista de países en la variable allCountries
        this.allCountries = response.data.data.countries;

        // Imprime el contenido de allCountries en la consola
        console.log("Contenido de allCountries:", this.allCountries);
      } catch (error) {
        // Muestra un error si hay problemas al obtener la lista de países
        console.error("Error al obtener la lista de países:", error);
      }
    },

    // Método para obtener la capital del país por su nombre
    getCapital(countryName) {
      // Busca el país por nombre en el array allCountries
      const foundCountry = this.allCountries.find(
        (country) => country.name === countryName
      );

      // Devuelve la capital si se encuentra, de lo contrario, devuelve un mensaje
      return foundCountry ? foundCountry.capital : "No se encontró la capital";
    },

    // Método para obtener la moneda del país por su nombre
    getMoneda(countryName) {
      // Busca el país por nombre en el array allCountries
      const foundCountry = this.allCountries.find(
        (country) => country.name === countryName
      );

      // Devuelve la moneda si se encuentra, de lo contrario, devuelve un mensaje
      return foundCountry ? foundCountry.currency : "No se encontró la moneda";
    },

    // Método para obtener el idioma del país por su nombre
    getLanguage(countryName) {
      // Busca el país por nombre en el array allCountries
      const foundCountry = this.allCountries.find(
        (country) => country.name === countryName
      );

      // Devuelve el idioma si se encuentra, de lo contrario, devuelve un mensaje
      return foundCountry
        ? foundCountry.languages?.map((lang) => lang.name).join(", ")
        : "No se encontró el idioma";
    },
  },
};
</script>

<style src="./CountryDetail.css" scoped></style>
