// ... (resto del código) ...

// Función principal para cargar y mostrar los datos
async function loadAndDisplayData() {
  console.log('Entrando en loadAndDisplayData');
  try {
    loadingMessage.style.display = 'block';
    cryptoTable.style.display = 'none';

    // Primero, obtenemos y almacenamos los datos de las criptomonedas
    const cryptoData = await getCryptoData();
    console.log('cryptoData después de getCryptoData:', cryptoData);

    // Luego, obtenemos las monedas en tendencia
    const trendingCoins = await getTrendingCoins();
    console.log('trendingCoins después de getTrendingCoins:', trendingCoins);

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

    // Comprobación adicional: Verificar el estado de la tabla después de que se supone que se muestra
    console.log("Tabla visible:", cryptoTable.style.display !== 'none');
    console.log("Tabla computed display:", getComputedStyle(cryptoTable).display);
  }
}

// ... (resto del código) ...
