<!-- App.vue -->
<template>
  <div id="app">
    <div class="container">
      <LateralBar @button-click="handleButtonClick" />
      <div class="content-container">
        <SearchBar
          v-if="showSearchBar"
          @continents-selected="handleContinentsSelected"
          @search-query-updated="handleSearchQueryUpdate"
        />
        <MainContent
          v-if="showMainContent"
          :countries="countries"
          :selectedContinents="selectedContinents"
          :search-query="searchQuery"
        />
        <FirstView v-if="showFirstView" />
        <SecondView v-if="showSecondView" />

        <!-- Otros componentes según sea necesario -->
      </div>
    </div>
  </div>
</template>

<script>
import LateralBar from "@/components/LateralBar/LateralBar.vue";
import SearchBar from "@/components/SearchBar/SearchBar.vue";
import MainContent from "@/components/MainContent/MainContent.vue";
import FirstView from "@/components/FirstView/FirstView.vue";
import SecondView from "@/components/SecondView/SecondView.vue";

export default {
  components: {
    LateralBar,
    SearchBar,
    MainContent,
    FirstView,
    SecondView,
  },
  data() {
    return {
      showSearchBar: true,
      showMainContent: true,
      showFirstView: false,
      showSecondView: false,
      countries: [],
      selectedContinents: [],
      searchQuery: "",
    };
  },
  created() {
    console.log("Components are always visible.");

    // Fetch data for MainContent if needed
    fetch("https://restcountries.com/v2/all")
      .then((response) => response.json())
      .then((data) => {
        this.countries = data.map((country) => ({
          name: country.name,
          continent: country.region,
          flagUrl: country.flags.png,
          imageUrl: country.flags.svg,
        }));
      })
      .catch((error) => console.error("Error fetching countries:", error));
  },
  methods: {
    handleButtonClick(button) {
      if (button === "home") {
        this.showSearchBar = true;
        this.showMainContent = true;
        this.showFirstView = false;
        this.showSecondView = false;
      } else if (button === "firstview") {
        this.showSearchBar = false;
        this.showMainContent = false;
        this.showFirstView = true;
        this.showSecondView = false;
      } else if (button === "secondview") {
        this.showSearchBar = false;
        this.showMainContent = false;
        this.showFirstView = false;
        this.showSecondView = true;
      }
    },
    handleContinentsSelected(continents) {
      this.selectedContinents = continents;
    },
    handleSearchQueryUpdate(query) {
      console.log("Search Query Updated in App.vue:", query);
      this.searchQuery = query;
      this.$emit("search-query-updated", query);
      // Nueva emisión del evento para MainContent
      this.$emit("search-query-app-updated", query);
    },
  },
};
</script>

<style scoped>
#app {
  height: 100%;
  overflow: hidden;
  background-color: #e3f4ff;
}

.container {
  display: flex;
}

.content-container {
  flex: 1;
  overflow: hidden;
  background-color: #e3f4ff;
}
</style>
