const cryptoList = document.querySelector('.crypto-list');
const apiKey = '1261d646-613a-494e-867f-93f932991dcd'; // Tu API Key de CoinMarketCap
const coinsPerPage = 100; // El plan gratuito de CoinMarketCap permite un máximo de 100 monedas por página
let currentPage = 1;
let totalPages = 1;

function fetchCoins(page) {
  axios.get(`https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest`, {
    headers: {
      'X-CMC_PRO_API_KEY': apiKey
    },
    params: {
      'start': (page - 1) * coinsPerPage + 1,
      'limit': coinsPerPage,
      'convert': 'USD'
    }
  })
    .then(response => {
      const coins = response.data.data;

      coins.forEach(coin => {
        // Obtener el historial de precios del último mes (CoinMarketCap no ofrece una forma directa de obtener 
        // el historial de precios para un rango de fechas específico en el plan gratuito. 
        // Tendrías que obtener los datos día a día o usar otro servicio/API)

        // **Opción 1: Obtener los datos día a día (puede consumir mucha cuota)**
        const today = new Date();
        const fromDate = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate()); // Fecha de inicio: un mes atrás
        const toDate = today;
        const history = [];

        for (let d = fromDate; d <= toDate; d.setDate(d.getDate() + 1)) {
          const timestamp = Math.floor(d.getTime() / 1000);
          axios.get(`https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/historical`, {
            headers: {
              'X-CMC_PRO_API_KEY': apiKey
            },
            params: {
              'id': coin.id,
              'time_start': timestamp,
              'time_end': timestamp + 86400, // Un día después
              'convert': 'USD'
            }
          })
            .then(response => {
              const historicalData = response.data.data[coin.id].quotes[0].quote.USD;
              history.push({ time: timestamp, close: historicalData.close });
            })
            .catch(error => {
              console.error("Error al obtener el historial de precios:", error);
            });
        }

        // **Opción 2: Usar otro servicio/API para obtener el historial de precios**
        // ...

        // Crear un elemento para cada criptomoneda
        const cryptoItem = document.createElement('div');
        cryptoItem.classList.add('crypto-item');

        // Mostrar el logo (CoinMarketCap no proporciona logos directamente, tendrías que buscar otra forma 
        // de obtenerlos o usar una imagen por defecto)
        // **Opción 1: Usar una imagen por defecto**
        const logo = document.createElement('img');
        logo.src = 'ruta/a/imagen/por/defecto.png'; // Reemplaza con la ruta de tu imagen
        logo.alt = `${coin.name} logo`;
        cryptoItem.appendChild(logo);

        // **Opción 2: Buscar el logo en otra fuente (por ejemplo, CoinGecko)**
        // ...

        // Mostrar el nombre
        const name = document.createElement('h2');
        name.textContent = coin.name;
        cryptoItem.appendChild(name);

        // Mostrar el símbolo
        const symbol = document.createElement('p');
        symbol.textContent = coin.symbol;
        cryptoItem.appendChild(symbol);

        // Mostrar el precio actual
        const price = document.createElement('p');
        price.textContent = `Precio: $${coin.quote.USD.price.toFixed(2)}`;
        cryptoItem.appendChild(price);

        // Mostrar el cambio porcentual en las últimas 24 horas
        const priceChange = document.createElement('p');
        priceChange.textContent = `Cambio (24h): ${coin.quote.USD.percent_change_24h.toFixed(2)}%`;
        priceChange.style.color = coin.quote.USD.percent_change_24h >= 0 ? 'green' : 'red';
        cryptoItem.appendChild(priceChange);

        // Mostrar la información del suministro
        const supplyInfo = document.createElement('p');
        supplyInfo.innerHTML = `
          Suministro en circulación: ${coin.circulating_supply.toLocaleString()}<br>
          Suministro máximo: ${coin.max_supply ? coin.max_supply.toLocaleString() : '∞'}<br> 
          Suministro total: ${coin.total_supply.toLocaleString()}
        `;
        cryptoItem.appendChild(supplyInfo);

        // Crear la gráfica usando Chart.js (necesitas adaptar este código para usar los datos del historial 
        // de precios que hayas obtenido)
        const canvas = document.createElement('canvas');
        canvas.classList.add('crypto-chart');
        cryptoItem.appendChild(canvas);

        // ... (código para crear la gráfica usando los datos del historial de precios - similar al anterior)

        cryptoList.appendChild(cryptoItem);
      });

      // Verificar si hay más páginas
      if (coins.length === coinsPerPage) {
        currentPage++;
        fetchCoins(currentPage);
      }
    })
    .catch(error => {
      console.error("Error al obtener la lista de criptomonedas:", error);
    });
}

// Obtener el número total de páginas desde la API de CoinMarketCap (esta petición no consume cuota)
axios.get('https://pro-api.coinmarketcap.com/v1/cryptocurrency/map', {
  headers: {
    'X-CMC_PRO_API_KEY': apiKey
  }
})
  .then(response => {
    const totalCoins = response.data.data.length;
    totalPages = Math.ceil(totalCoins / coinsPerPage);
    fetchCoins(currentPage);
  })
  .catch(error => {
    console.error("Error al obtener la lista de todas las criptomonedas:", error);
  });
