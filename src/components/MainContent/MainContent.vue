<template>
  <div>
    <div class="main-content">
      <!-- Loop through the countries -->
      <div
        v-for="country in filteredCountries"
        :key="country.name"
        class="country-card"
        @click="selectCountry(country)"
      >
        <!-- Large image -->
        <div class="country-large-image">
          <!-- Utiliza la imagen obtenida de la API de Pixabay o la bandera en caso de que no haya resultados -->
          <img
            :src="country.largeImageUrl || country.flagUrl"
            alt="Country Image"
            class="country-image"
          />
        </div>

        <!-- Small image -->
        <div class="country-small-image">
          <img :src="country.flagUrl" alt="Country Flag" class="country-flag" />
        </div>

        <!-- Country information -->
        <div class="country-info">
          <h2 class="country-name">{{ country.formattedName }}</h2>
          <p class="country-continent">{{ country.continent }}</p>
        </div>
      </div>
    </div>
    <div id="country-detail-container" v-if="selectedCountry">
      <CountryDetail
        :selectedCountryName="selectedCountry.formattedName"
        :selectedCountryContinent="selectedCountry.continent"
        :selectedCountryImage="selectedCountry.largeImageUrl"
        @hide-country-detail="updateShowCountryDetail"
      />
    </div>
  </div>
</template>

<script>
import { ref, watch, getCurrentInstance } from "vue";
import { fetchPixabayImage } from "@/api";
import CountryDetail from "@/components/MainContent/CountryDetail/CountryDetail.vue";

export default {
  components: {
    CountryDetail,
  },
  props: {
    countriesData: Array,
    countries: Array,
    selectedContinents: Array,
    searchQuery: String,
  },

  setup(props) {
    const filteredCountries = ref([]);
    const selectedCountry = ref(null);
    const showCountryDetail = ref(true);

    const updateShowCountryDetail = (value) => {
      showCountryDetail.value = value;
      console.log("Valor de showCountryDetail en MainContent:", value);

      const countryDetailContainer = document.getElementById(
        "country-detail-container"
      );
      if (countryDetailContainer) {
        countryDetailContainer.style.display = value ? "block" : "none";

        // Agregar o quitar la clase "expanded-width" según el valor
        document
          .querySelector(".main-content")
          .classList.toggle("expanded-width", value);
      }
    };

    console.log("Data received in MainContent:", props.countriesData);

    const { emit } = getCurrentInstance();

    const selectCountry = (country) => {
      selectedCountry.value = country;
      updateShowCountryDetail(true); // Cambiar el valor a true
      document.querySelector(".main-content").classList.add("expanded-width");

      console.log("Small Image URL in MainContent:", country.smallImageUrl);
      // Emitir el evento con el ID del país seleccionado
      emit("country-selected", {
        name: country.formattedName,
        selectedContinent: country.continent,
        largeImageUrl: country.largeImageUrl,
        smallImageUrl: country.smallImageUrl,
      });
    };

    const formatCountryName = async (name) => {
      const regex = /,|\(|\)|\band\b/g;
      const cleanedName = name.replace(regex, " ");
      const words = cleanedName.split(" ");
      const formattedName = words.slice(0, 2).join(" ");
      return formattedName;
    };

    const updatePixabayImages = async () => {
      for (const country of props.countries) {
        try {
          const formattedName = await formatCountryName(country.name);
          const largeImageUrl = await fetchPixabayImage(formattedName);
          country.largeImageUrl = largeImageUrl || country.flagUrl;
          country.formattedName = formattedName;
        } catch (error) {
          console.error(
            `Error al obtener la imagen de Pixabay para ${country.name}`,
            error
          );
          country.largeImageUrl = country.flagUrl;
          country.formattedName = "";
        }
      }
    };

    const filterCountriesByContinentsAndText = () => {
      const searchText = props.searchQuery.toLowerCase();

      if (props.selectedContinents.length > 0) {
        // Filtra los países por continentes seleccionados y texto de búsqueda
        filteredCountries.value = props.countries.filter(
          (country) =>
            props.selectedContinents.includes(country.continent) &&
            country.formattedName?.toLowerCase().includes(searchText)
        );
      } else {
        // Si no hay continentes seleccionados, muestra todos los países que coinciden con el texto
        filteredCountries.value = props.countries.filter((country) =>
          country.formattedName?.toLowerCase().includes(searchText)
        );
      }
    };

    // Agrega un watcher para selectedContinents
    watch(
      () => props.selectedContinents,
      () => {
        console.log("Selected Continents:", props.selectedContinents.slice());
        // Filtra los países cuando cambian los continentes seleccionados
        filterCountriesByContinentsAndText();
      }
    );

    // Agrega un watcher para searchQuery
    watch(
      () => props.searchQuery,
      (newVal) => {
        console.log("Search Query Changed in MainContent:", newVal);
        // Filtra los países cuando cambia la búsqueda
        filterCountriesByContinentsAndText();
      }
    );

    // Llama a updatePixabayImages en el ciclo de vida mounted
    watch(
      () => props.countries,
      () => {
        updatePixabayImages();
        // Filtra los países cuando cambia la lista de países
        filterCountriesByContinentsAndText();
      },
      { deep: true }
    );

    // Inicialmente, muestra todos los países
    filterCountriesByContinentsAndText();

    return {
      filteredCountries,
      selectedCountry,
      selectCountry,
      showCountryDetail,
      updateShowCountryDetail,
    };
  },
};
</script>

<style src="./MainContent.css" scoped></style>
