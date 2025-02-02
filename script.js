const cryptoList = document.querySelector('.crypto-list');
const coinsPerPage = 200; // CryptoCompare permite hasta 2000 resultados por página, pero usaremos 200 para evitar problemas
let currentPage = 1;
let totalPages = 1; // Inicializamos con un valor por defecto

function fetchCoins(page) {
  // Obtener la lista de criptomonedas desde la API de CryptoCompare
  axios.get(`https://min-api.cryptocompare.com/data/top/mktcapfull?limit=${coinsPerPage}&tsym=USD&page=${page}`)
    .then(response => {
      const coins = response.data.Data;

      coins.forEach(coin => {
        const coinId = coin.CoinInfo.Name; // Obtener el ID de la moneda en CryptoCompare

        // Obtener el historial de precios del último mes
        const today = new Date();
        const fromDate = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate()); // Fecha de inicio: un mes atrás
        const toDate = today;
        const fromTimestamp = Math.floor(fromDate.getTime() / 1000);
        const toTimestamp = Math.floor(toDate.getTime() / 1000);

        axios.get(`https://min-api.cryptocompare.com/data/v2/histoday?fsym=${coinId}&tsym=USD&limit=30&toTs=${toTimestamp}`)
          .then(response => {
            const history = response.data.Data.Data; // Obtener los datos del historial

            // Crear un elemento para cada criptomoneda
            const cryptoItem = document.createElement('div');
            cryptoItem.classList.add('crypto-item');

            // Mostrar el logo (CryptoCompare no proporciona logos directamente, 
            // así que usaremos una imagen por defecto o buscar otra forma de obtenerla)
            const logo = document.createElement('img');
            logo.src = 'ruta/a/imagen/por/defecto.png'; // Reemplaza con la ruta de tu imagen
            logo.alt = `${coin.CoinInfo.FullName} logo`;
            cryptoItem.appendChild(logo);

            // Mostrar el nombre
            const name = document.createElement('h2');
            name.textContent = coin.CoinInfo.FullName;
            cryptoItem.appendChild(name);

            // Mostrar el símbolo
            const symbol = document.createElement('p');
            symbol.textContent = coin.CoinInfo.Name;
            cryptoItem.appendChild(symbol);

            // Mostrar el precio actual
            const price = document.createElement('p');
            price.textContent = `Precio: $${coin.DISPLAY.USD.PRICE}`;
            cryptoItem.appendChild(price);

            // Mostrar el cambio porcentual en las últimas 24 horas (no disponible directamente, 
            //  tendrías que calcularlo con los datos del historial)
            // ...

            // Calcular el suministro que falta y el porcentaje que queda por consumir (no disponible directamente,
            //  tendrías que buscar otra fuente de datos o usar una aproximación)
            // ...

            // Mostrar la información del suministro
            // ...

            // Crear la gráfica usando Chart.js
            const canvas = document.createElement('canvas');
            canvas.classList.add('crypto-chart');
            cryptoItem.appendChild(canvas);

            const prices = history.map(day => day.close); // Obtener los precios del historial

            // Calcular máximo y mínimo
            // ... (código para calcular máximo y mínimo similar al anterior)

            // Generar etiquetas para el eje X (fechas)
            const labels = history.map(day => new Date(day.time * 1000).toLocaleDateString()); 

            // ... (código para crear la gráfica similar al anterior)

            cryptoList.appendChild(cryptoItem);
          })
          .catch(error => {
            console.error("Error al obtener el historial de precios:", error);
          });
      });

      // Verificar si hay más páginas (ajustar según la respuesta de la API de CryptoCompare)
      if (page < totalPages) {
        currentPage++;
        fetchCoins(currentPage);
      }
    })
    .catch(error => {
      console.error("Error al obtener la lista de criptomonedas:", error);
    });
}

// Obtener el número total de criptomonedas desde la API de CryptoCompare
axios.get('https://min-api.cryptocompare.com/data/top/mktcapfull?limit=2000&tsym=USD') // Obtener todas las monedas para calcular totalPages
  .then(response => {
    const totalCoins = response.data.Data.length;
    totalPages = Math.ceil(totalCoins / coinsPerPage);
    fetchCoins(currentPage);
  })
  .catch(error => {
    console.error("Error al obtener la lista de todas las criptomonedas:", error);
  });
