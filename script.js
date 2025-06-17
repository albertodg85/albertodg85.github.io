const cryptoList = document.querySelector('.crypto-list');
const coinsPerPage = 50; // Reducimos el número de monedas por página para optimizar
let currentPage = 1;
let totalPages = 1; // Inicializamos con un valor por defecto

function fetchCoins(page) {
  // Obtener la lista de criptomonedas, el precio actual y la información del suministro
  axios.get(`https://api.coinpaprika.com/v1/tickers`, {
      params: {
        'limit': coinsPerPage,
        'page': page,
        'quotes': 'USD',
        'additional_fields': 'market_cap_usd'
      }
    })
  .then(response => {
      const coins = response.data;

      // Verifica si 'coins' es un array antes de usar forEach
      if (Array.isArray(coins)) {

        // Obtener el historial de precios de todas las monedas en una sola petición
        const coinIds = coins.map(coin => coin.id).join(',');
        const today = new Date();
        const fromDate = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate()); // Fecha de inicio: un mes atrás
        const toDate = today;
        const fromTimestamp = Math.floor(fromDate.getTime() / 1000);
        const toTimestamp = Math.floor(toDate.getTime() / 1000);

        axios.get(`https://api.coinpaprika.com/v1/tickers/historical`, {
            params: {
              'coins': coinIds,
              'start': fromTimestamp,
              'end': toTimestamp,
              'interval': '1d' // Obtener datos diarios
            }
          })
        .then(response => {
            const historyData = response.data;

            coins.forEach(coin => {
              const coinId = coin.id;
              const history = historyData.filter(item => item.id === coinId); // Filtrar el historial para la moneda actual

              // Crear un elemento para cada criptomoneda
              const cryptoItem = document.createElement('div');
              cryptoItem.classList.add('crypto-item');

              // Mostrar el logo (Coinpaprika no proporciona logos directamente, 
              // así que usaremos una imagen por defecto o buscar otra forma de obtenerla)
              const logo = document.createElement('img');
              // Coinpaprika no ofrece un logo directamente, usamos un placeholder
              logo.src = 'https://via.placeholder.com/50';
              logo.alt = `${coin.name} logo`;
              cryptoItem.appendChild(logo);

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
              price.textContent = `Precio: $${coin.quotes.USD.price.toFixed(2)}`;
              cryptoItem.appendChild(price);

              // Mostrar el cambio porcentual en las últimas 24 horas (calcular a partir del historial)
              const priceChange = document.createElement('p');
              if (history.length > 1) {
                const yesterdayPrice = history[history.length - 2].close;
                const priceChangePercent = ((coin.quotes.USD.price - yesterdayPrice) / yesterdayPrice) * 100;
                priceChange.textContent = `Cambio (24h): ${priceChangePercent.toFixed(2)}%`;
                priceChange.style.color = priceChangePercent >= 0? 'green': 'red';
              } else {
                priceChange.textContent = 'Cambio (24h): No disponible';
              }
              cryptoItem.appendChild(priceChange);

              // Mostrar la información del suministro
              const supplyInfo = document.createElement('p');
              supplyInfo.innerHTML = `
                Capitalización de mercado: ${coin.market_cap_usd.toLocaleString()}
              `;
              cryptoItem.appendChild(supplyInfo);

              // Crear la gráfica usando Chart.js
              const canvas = document.createElement('canvas');
              canvas.classList.add('crypto-chart');
              cryptoItem.appendChild(canvas);

              // Adaptar los datos del historial para Chart.js
              const prices = history.map(day => day.close);
              const labels = history.map(day => new Date(day.time_open).toLocaleDateString());

              const chartData = {
                labels: labels,
                datasets: [{
                  label: 'Precio',
                  data: prices,
                  borderColor: 'blue',
                  fill: false,
                  tension: 0.1
                }]
              };

              new Chart(canvas, {
                type: 'line',
                data: chartData,
                options: {
                  elements: {
                    point: {
                      radius: 0 // Eliminar los puntos de la gráfica
                    }
                  },
                  scales: {
                    x: {
                      ticks: {
                        maxTicksLimit: 10 // Limitar el número de etiquetas en el eje X
                      }
                    }
                  }
                }
              });

              cryptoList.appendChild(cryptoItem);
            });
          })
        .catch(error => {
            console.error("Error al obtener el historial de precios:", error);
          });
      } else {
        console.error("La respuesta de la API no es un array:", coins);
      }

      // Verificar si hay más páginas (Coinpaprika no proporciona el número total de páginas, 
      //  tendrías que obtener todas las monedas y calcularlo o usar una aproximación)
      if (coins.length === coinsPerPage) {
        currentPage++;
        fetchCoins(currentPage);
      }
    })
  .catch(error => {
      console.error("Error al obtener la lista de criptomonedas:", error);
    });
}

// Obtener el número total de criptomonedas desde la API de Coinpaprika
axios.get('https://api.coinpaprika.com/v1/coins') // Obtener todas las monedas para calcular totalPages
.then(response => {
    const totalCoins = response.data.length;
    totalPages = Math.ceil(totalCoins / coinsPerPage);
    fetchCoins(currentPage);
  })
.catch(error => {
    console.error("Error al obtener la lista de todas las criptomonedas:", error);
  });
