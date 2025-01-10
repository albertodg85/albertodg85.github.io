const apiUrl = 'https://api.coincap.io/v2/assets'; // URL de la API de CoinCap
const cryptoTable = document.getElementById('cryptoTable');
const cryptoTableBody = document.getElementById('cryptoTable').getElementsByTagName('tbody')[0];
const loadingMessage = document.getElementById('loading');
const filterInput = document.getElementById('filter');
const sortSelect = document.getElementById('sort');

let cryptoDataCache = []; // Variable global para almacenar los datos en caché

// Función para obtener los datos de las criptomonedas
async function getCryptoData() {
  try {
    const response = await fetch(apiUrl);
    const dataWrapper = await response.json();
    const data = dataWrapper.data; // Los datos están dentro de un objeto "data"
    console.log("Datos de criptomonedas:", data);
    cryptoDataCache = data; // Almacenar los datos en la caché
    return data;
  } catch (error) {
    console.error('Error al obtener datos de criptomonedas:', error);
    return [];
  }
}

// Función para mostrar los datos en la tabla
function displayCryptoData(data) {
  console.log('Entrando en displayCryptoData');
  console.log('Datos a mostrar:', data);
  cryptoTableBody.innerHTML = '';

  data.forEach(coin => {
    let row = cryptoTableBody.insertRow();
    let symbolCell = row.insertCell();
    let nameCell = row.insertCell();
    let priceCell = row.insertCell();
    let marketCapCell = row.insertCell();
    let change24hCell = row.insertCell();
    let volume24hCell = row.insertCell();

    symbolCell.textContent = coin.symbol;
    nameCell.textContent = coin.name;
    priceCell.textContent = Number(coin.priceUsd).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    marketCapCell.textContent = Number(coin.marketCapUsd).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    change24hCell.textContent = Number(coin.changePercent24Hr).toFixed(2) + '%';
    volume24hCell.textContent = Number(coin.volumeUsd24Hr).toLocaleString('en-US', { style: 'currency', currency: 'USD' });

    // Añadir color a la celda del cambio de precio en 24h
    if (Number(coin.changePercent24Hr) > 0) {
      change24hCell.style.color = 'green';
    } else if (Number(coin.changePercent24Hr) < 0) {
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

        // Manejar valores nulos o indefinidos
        if (valueA === null || valueA === undefined) valueA = -Infinity;
        if (valueB === null || valueB === undefined) valueB = -Infinity;

        // Manejar casos especiales para la ordenación
        if (field === 'name' || field === 'symbol') {
            valueA = valueA.toLowerCase();
            valueB = valueB.toLowerCase();
            // Ordenación de cadenas
            if (order === 'asc') {
                return valueA.localeCompare(valueB);
            } else {
                return valueB.localeCompare(valueA);
            }
        } else if (field === 'priceUsd' || field === 'marketCapUsd' || field === 'volumeUsd24Hr') {
            valueA = Number(valueA);
            valueB = Number(valueB);
            // Ordenación numérica
            if (order === 'asc') {
                return valueA - valueB;
            } else {
                return valueB - valueA;
            }
        } else {
          // Ordenación por defecto (si el campo no se reconoce)
          if (order === 'asc') {
            return String(valueA).localeCompare(String(valueB));
          } else {
            return String(valueB).localeCompare(String(valueA));
          }
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

    // Obtenemos y almacenamos los datos de las criptomonedas
    const cryptoData = await getCryptoData();
    console.log('cryptoData después de getCryptoData:', cryptoData);

    // Filtramos y ordenamos los datos
    let filteredData = cryptoData;
    const searchTerm = filterInput.value.toLowerCase();
    if (searchTerm) {
      filteredData = filterData(filteredData, searchTerm);
      console.log('filteredData después de filterData:', filteredData);
    }

    const sortKey = sortSelect.value;
    const sortedData = sortData(filteredData, sortKey);
    console.log('sortedData después de sortData:', sortedData);

    // Mostramos los datos en la tabla
    displayCryptoData(sortedData);

  } catch (error) {
    console.error('Error al cargar los datos:', error);
    let row = cryptoTableBody.insertRow();
    let errorCell = row.insertCell();
    errorCell.colSpan = 6;
    errorCell.textContent = "Error al cargar los datos. Por favor, inténtalo de nuevo más tarde.";
  } finally {
    loadingMessage.style.display = 'none';
    // Forzar la visibilidad de la tabla y sus filas
    cryptoTable.style.display = 'table';
    cryptoTable.style.visibility = 'visible';
    for (let i = 0; i < cryptoTable.rows.length; i++) {
        cryptoTable.rows[i].style.display = 'table-row';
        cryptoTable.rows[i].style.visibility = 'visible';
        for (let j = 0; j < cryptoTable.rows[i].cells.length; j++){
            cryptoTable.rows[i].cells[j].style.display = 'table-cell';
            cryptoTable.rows[i].cells[j].style.visibility = 'visible';
        }
    }
    console.log('Tabla visible:', cryptoTable.style.display !== 'none');
    console.log("Tabla computed display:", getComputedStyle(cryptoTable).display);
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
