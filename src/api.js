// api.js
import axios from "axios";

const countriesApiUrl = "https://countries.trevorblades.com/";
const pixabayApiUrl = "https://pixabay.com/api/";
const pixabayApiKey = "40600818-75992f2fcdc24684ac3a885fb";

export const fetchData = async (query) => {
  try {
    const response = await axios.post(countriesApiUrl, { query });
    return response.data.data;
  } catch (error) {
    console.error("Error al hacer la solicitud a la API de países.", error);
    throw new Error("Error al hacer la solicitud a la API de países.");
  }
};

export const fetchPixabayImage = async (countryName) => {
  const apiUrl = `${pixabayApiUrl}?key=${pixabayApiKey}&q=${countryName}&image_type=photo&orientation=horizontal&per_page=3`;

  try {
    // Introduce un retraso artificial de 500 ms antes de realizar la solicitud a Pixabay
    await new Promise((resolve) => setTimeout(resolve, 100));

    const response = await axios.get(apiUrl);

    if (response.data.hits.length > 0) {
      // Puedes personalizar cómo eliges la imagen de la respuesta aquí.
      // En este ejemplo, simplemente se elige la primera imagen.
      return response.data.hits[0].largeImageURL;
    } else {
      return ""; // Si no se encuentra ninguna imagen
    }
  } catch (error) {
    console.error("Error al obtener la imagen de Pixabay", error);
    throw new Error("Error al obtener la imagen de Pixabay.");
  }
};

export const generateContinentImage = async (continentName) => {
  const apiUrl = `${pixabayApiUrl}?key=${pixabayApiKey}&q=${continentName}&image_type=photo&orientation=horizontal&per_page=3`;

  try {
    // Introduce un retraso artificial de 500 ms antes de realizar la solicitud a Pixabay
    await new Promise((resolve) => setTimeout(resolve, 500));

    const response = await axios.get(apiUrl);

    if (response.data.hits.length > 0) {
      // Puedes personalizar cómo eliges la imagen de la respuesta aquí.
      // En este ejemplo, simplemente se elige la primera imagen.
      return response.data.hits[0].largeImageURL;
    } else {
      console.log(`No se encontró una imagen para ${continentName}`);
      return ""; // Si no se encuentra ninguna imagen
    }
  } catch (error) {
    console.error(`Error al obtener la imagen para ${continentName}`, error);

    if (error.response) {
      // La solicitud fue realizada y el servidor respondió con un código de estado diferente de 2xx
      console.error(`Código de estado: ${error.response.status}`);
      console.error(`Respuesta del servidor:`, error.response.data);
    } else if (error.request) {
      // La solicitud fue realizada pero no se recibió respuesta
      console.error(`No se recibió respuesta del servidor`);
    } else {
      // Ocurrió un error al configurar la solicitud o al procesar la respuesta
      console.error(
        `Error al configurar la solicitud o procesar la respuesta:`,
        error.message
      );
    }

    throw new Error(`Error al obtener la imagen para ${continentName}.`);
  }
};
