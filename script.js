const cryptoList = document.querySelector('.crypto-list');
const coinsPerPage = 100;  // Coinpaprika permite hasta 5000 resultados, pero usaremos 100 para evitar problemas
let currentPage = 1;
let totalPages = 1; // Inicializamos con un valor por defecto

function fetchCoins(page) {
  // Obtener la lista de criptomonedas desde la API de Coinpaprika
  axios.get(`https://api.coinpaprika.com/v1/coins`, {
      params: {
        'limit': coinsPerPage,
        'page': page
      }
    })
    .then(response => {
      const coins = response.data;

      coins.forEach(coin => {
        const coinId = coin.id; // Obtener el ID de la moneda en Coinpaprika

        // Obtener el historial de precios del último mes
        const today = new Date();
        const fromDate = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate()); // Fecha de inicio: un mes atrás
        const toDate = today;
        const fromTimestamp = Math.floor(fromDate.getTime() / 1000);
        const toTimestamp = Math.floor(toDate.getTime() / 1000);

        axios.get(`https://api.coinpaprika.com/v1/coins/${coinId}/ohlcv/historical`, {
            params: {
              'start': fromTimestamp,
              'end': toTimestamp
            }
          })
          .then(response => {
            const history = response.data;

            // Crear un elemento para cada criptomoneda
            const cryptoItem = document.createElement('div');
            cryptoItem.classList.add('crypto-item');

            // Mostrar el logo (Coinpaprika no proporciona logos directamente, 
            // así que usaremos una imagen por defecto o buscar otra forma de obtenerla)
            const logo = document.createElement('img');
            logo.src = 'ruta/a/imagen/por/defecto.png'; // Reemplaza con la ruta de tu imagen
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

            // Mostrar el precio actual (Coinpaprika no proporciona el precio actual directamente, 
            // tendrías que obtenerlo de otro endpoint o calcularlo a partir del historial)
            // ...

            // Mostrar el cambio porcentual en las últimas 24 horas (no disponible directamente, 
            //  tendrías que calcularlo con los datos del historial)
            // ...

            // Mostrar la información del suministro (Coinpaprika proporciona esta información en otro endpoint)
            // ...

            // Crear la gráfica usando Chart.js
            const canvas = document.createElement('canvas');
            canvas.classList.add('crypto-chart');
            cryptoItem.appendChild(canvas);

            // Adaptar los datos del historial para Chart.js
            const prices = history.map(day => day.close); 
            const labels = history.map(day => new Date(day.time_open).toLocaleDateString()); 

            // ... (código para crear la gráfica similar al anterior)

            cryptoList.appendChild(cryptoItem);
          })
          .catch(error => {
            console.error("Error al obtener el historial de precios:", error);
          });
      });

      // Verificar si hay más páginas (Coinpaprika no proporciona el número total de páginas, 
      //  tendrías que obtener todas las monedas y calcularlo o usar una aproximación)
      // ...
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
