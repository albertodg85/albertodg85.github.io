const apiUrl = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false&locale=es';
const trendingApiUrl = 'https://api.coingecko.com/api/v3/search/trending';
const cryptoTable = document.getElementById('cryptoTable').getElementsByTagName('tbody')[0];
const loadingMessage = document.getElementById('loading');
const filterInput = document.getElementById('filter');
const sortSelect = document.getElementById('sort');

let cryptoDataCache = []; // Variable global para almacenar los datos en caché

// Función para obtener las monedas en tendencia
async function getTrendingCoins() {
    try {
        const response = await fetch(trendingApiUrl);
        const data = await response.json();
        console.log("Monedas en tendencia:", data);
        return data.coins.map(coin => coin.item.symbol.toLowerCase());
    } catch (error) {
        console.error('Error fetching trending coins:', error);
        return [];
    }
}

// Función para obtener los datos de las criptomonedas
async function getCryptoData() {
  try {
    const response = await fetch(apiUrl);
    const data = await response.json();
    console.log("Datos de criptomonedas:", data);
    cryptoDataCache = data; // Almacenar los datos en la caché
    return data;
  } catch (error) {
    console.error('Error al obtener datos de criptomonedas:', error);
    return [];
  }
}

// Función para mostrar los datos en la tabla
function displayCryptoData(data, trendingCoins) {
  console.log('Entrando en displayCryptoData');
  console.log('Datos a mostrar:', data);
  console.log('Monedas en tendencia:', trendingCoins);
  cryptoTable.innerHTML = '';

  data.forEach(coin => {
    let row = cryptoTable.insertRow();
    let symbolCell = row.insertCell();
    let nameCell = row.insertCell();
    let priceCell = row.insertCell();
    let marketCapCell = row.insertCell();
    let change24hCell = row.insertCell();
    let volume24hCell = row.insertCell();
    let trendCell = row.insertCell();

    symbolCell.textContent = coin.symbol.toUpperCase();
    nameCell.textContent = coin.name;
    priceCell.textContent = coin.current_price.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    marketCapCell.textContent = coin.market_cap.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    change24hCell.textContent = coin.price_change_percentage_24h.toFixed(2) + '%';
    volume24hCell.textContent = coin.total_volume.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

    if (trendingCoins.includes(coin.symbol.toLowerCase())) {
      trendCell.textContent = '🔥';
    } else {
      trendCell.textContent = '';
    }

    if (coin.price_change_percentage_24h > 0) {
      change24hCell.style.color = 'green';
    } else if (coin.price_change_percentage_24h < 0) {
      change24hCell.style.color = 'red';
    }
  });
  console.log('Saliendo de displayCryptoData');
}

// Función para filtrar los datos
function filterData(data, searchTerm) {
    console.log('Entrando en filterData');
    console.log('Datos a filtrar:', data);
    console.log('Término de búsqueda:', searchTerm);
    const result = data.filter(coin => {
        const name = coin.name.toLowerCase();
        const symbol = coin.symbol.toLowerCase();
        return name.includes(searchTerm) || symbol.includes(searchTerm);
    });
    console.log('Resultado del filtrado:', result);
    return result;
}

// Función para ordenar los datos
function sortData(data, sortKey) {
    console.log('Entrando en sortData');
    console.log('Datos a ordenar:', data);
    console.log('Clave de ordenación:', sortKey);
    const [field, order] = sortKey.split('_');

    const result = data.sort((a, b) => {
        let valueA = a[field];
        let valueB = b[field];

        // Manejar casos especiales para la ordenación
        if (field === 'name') {
          valueA = valueA.toLowerCase();
          valueB = valueB.toLowerCase();
        } else if (field === 'current_price' || field === 'market_cap' || field === 'total_volume') {
          valueA = Number(valueA);
          valueB = Number(valueB);
        }

        if (order === 'asc') {
            return valueA > valueB ? 1 : -1;
        } else {
            return valueA < valueB ? 1 : -1;
        }
    });
    console.log('Resultado de la ordenación:', result);
    return result;
}

// Función principal para cargar y mostrar los datos
async function loadAndDisplayData() {
  console.log('Entrando en loadAndDisplayData');
  try {
    loadingMessage.style.display = 'block';
    cryptoTable.style.display = 'none';

    const [cryptoData, trendingCoins] = await Promise.all([
      getCryptoData(),
      getTrendingCoins()
    ]);

    console.log('Datos de cryptoData:', cryptoData);
    console.log('Datos de trendingCoins:', trendingCoins);

    let filteredData = cryptoData;
    const searchTerm = filterInput.value.toLowerCase();
    if (searchTerm) {
      filteredData = filterData(filteredData, searchTerm);
    }

    const sortKey = sortSelect.value;
    const sortedData = sortData(filteredData, sortKey);

    displayCryptoData(sortedData, trendingCoins);
  } catch (error) {
    console.error('Error al cargar los datos:', error);
    let row = cryptoTable.insertRow();
    let errorCell = row.insertCell();
    errorCell.colSpan = 7;
    errorCell.textContent = "Error al cargar los datos. Por favor, inténtalo de nuevo más tarde.";
  } finally {
    loadingMessage.style.display = 'none';
    cryptoTable.style.display = 'table';
    console.log('Saliendo de loadAndDisplayData');
  }
}

// Evento 'input' para el campo de filtro
filterInput.addEventListener('input', () => {
  loadAndDisplayData();
});

// Evento 'change' para el select de ordenación
sortSelect.addEventListener('change', () => {
  loadAndDisplayData();
});

// Cargar los datos al inicio
document.addEventListener('DOMContentLoaded', loadAndDisplayData);
