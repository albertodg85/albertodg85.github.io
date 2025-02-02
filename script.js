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

        // Función para obtener el precio de un día específico
        const getHistoricalPrice = (timestamp) => {
          return axios.get(`https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/historical`, {
            headers: {
              'X-CMC_PRO_API_KEY': apiKey
            },
            params: {
              'id': coin.id,
              'time_start': timestamp,
              'time_end': timestamp + 86400, // Un día después
              'convert': 'USD'
            }
          });
        };

        // Crear un array de promesas para las peticiones del historial
        const promises = [];
        for (let d = fromDate; d <= toDate; d.setDate(d.getDate() + 1)) {
          const timestamp = Math.floor(d.getTime() / 1000);
          promises.push(getHistoricalPrice(timestamp));
        }

        // Ejecutar todas las promesas en paralelo y procesar las respuestas
        Promise.all(promises)
          .then(responses => {
            responses.forEach(response => {
              const historicalData = response.data.data[coin.id].quotes[0].quote.USD;
              history.push({
                time: historicalData.timestamp,
                close: historicalData.close
              });
            });

            // ... (código para crear los elementos HTML - igual que antes)
            // ... (código para calcular y mostrar la información del suministro - igual que antes)


            // Crear la gráfica usando Chart.js (necesitas adaptar este código para usar los datos del historial 
            // de precios que hayas obtenido)
            const canvas = document.createElement('canvas');
            canvas.classList.add('crypto-chart');
            cryptoItem.appendChild(canvas);

            // ... (código para crear la gráfica usando los datos del historial de precios - similar al anterior)

            cryptoList.appendChild(cryptoItem);

          })
          .catch(error => {
            console.error("Error al obtener el historial de precios:", error);
          });

        // **Opción 2: Usar otro servicio/API para obtener el historial de precios**
        // ...


      });

      // Verificar si hay más páginas
      if (page < totalPages) {
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
