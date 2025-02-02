const cryptoList = document.querySelector('.crypto-list');
const coinsPerPage = 250; // Número máximo de monedas por página permitido por la API
let currentPage = 1;
let totalPages = 1; // Inicializamos con un valor por defecto

function fetchCoins(page) {
  axios.get(`https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=${coinsPerPage}&page=${page}&sparkline=false`)
    .then(response => {
      const coins = response.data;

      coins.forEach(coin => {
        // Obtener el historial de precios del último mes
        const today = new Date();
        const fromDate = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate()); // Fecha de inicio: un mes atrás
        const toDate = today;
        const fromTimestamp = Math.floor(fromDate.getTime() / 1000);
        const toTimestamp = Math.floor(toDate.getTime() / 1000);

        axios.get(`https://api.coingecko.com/api/v3/coins/${coin.id}/market_chart/range?vs_currency=usd&from=${fromTimestamp}&to=${toTimestamp}`)
          .then(response => {
            const history = response.data;
            // Crear un elemento para cada criptomoneda
            const cryptoItem = document.createElement('div');
            cryptoItem.classList.add('crypto-item');

            // Mostrar el logo
            const logo = document.createElement('img');
            logo.src = coin.image;
            logo.alt = `${coin.name} logo`;
            cryptoItem.appendChild(logo);

            // Mostrar el nombre
            const name = document.createElement('h2');
            name.textContent = coin.name;
            cryptoItem.appendChild(name);

            // Mostrar el símbolo
            const symbol = document.createElement('p');
            symbol.textContent = coin.symbol.toUpperCase();
            cryptoItem.appendChild(symbol);

            // Mostrar el precio actual
            const price = document.createElement('p');
            price.textContent = `Precio: $${coin.current_price.toFixed(2)}`;
            cryptoItem.appendChild(price);

            // Mostrar el cambio porcentual en las últimas 24 horas
            const priceChange = document.createElement('p');
            priceChange.textContent = `Cambio (24h): ${coin.price_change_percentage_24h.toFixed(2)}%`;
            priceChange.style.color = coin.price_change_percentage_24h >= 0 ? 'green' : 'red';
            cryptoItem.appendChild(priceChange);

            // Calcular el suministro que falta y el porcentaje que queda por consumir
            const circulatingSupply = coin.circulating_supply;
            const totalSupply = coin.total_supply;
            const maxSupply = coin.max_supply; // Obtener el suministro máximo
            const remainingSupply = totalSupply - circulatingSupply;
            const remainingPercentage = (remainingSupply / totalSupply) * 100;

            // Mostrar la información del suministro
            const supplyInfo = document.createElement('p');
            supplyInfo.innerHTML = `
              Suministro en circulación: ${circulatingSupply.toLocaleString()}<br>
              Suministro máximo: ${maxSupply ? maxSupply.toLocaleString() : '∞'}<br> 
              Suministro restante: ${remainingSupply.toLocaleString()}<br>
              Porcentaje restante: ${remainingPercentage.toFixed(2)}%
            `;
            cryptoItem.appendChild(supplyInfo);

            // Crear la gráfica usando Chart.js
            const canvas = document.createElement('canvas');
            canvas.classList.add('crypto-chart');
            cryptoItem.appendChild(canvas);

            const prices = history.prices.map(price => price[1]); // Obtener los precios del historial

            // Calcular máximo y mínimo
            const maxPrice = Math.max(...prices);
            const minPrice = Math.min(...prices);
            const maxIndex = prices.indexOf(maxPrice);
            const minIndex = prices.indexOf(minPrice);
            const maxDate = new Date(history.prices[maxIndex][0]).toLocaleDateString();
            const minDate = new Date(history.prices[minIndex][0]).toLocaleDateString();

            // Generar etiquetas para el eje X (fechas)
            const labels = history.prices.map(price => new Date(price[0]).toLocaleDateString());

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
                },
                plugins: {
                  annotation: {
                    annotations: {
                      // Marcar solo el máximo en verde
                      max: {
                        type: 'point',
                        xValue: maxDate,
                        yValue: maxPrice,
                        backgroundColor: 'green',
                        radius: 5,
                        label: {
                          content: `Máximo: ${maxPrice.toFixed(2)} (${maxDate})`,
                          enabled: true,
                          position: 'top'
                        }
                      },
                      // Marcar solo el mínimo en rojo
                      min: {
                        type: 'point',
                        xValue: minDate,
                        yValue: minPrice,
                        backgroundColor: 'red',
                        radius: 5,
                        label: {
                          content: `Mínimo: ${minPrice.toFixed(2)} (${minDate})`,
                          enabled: true,
                          position: 'bottom'
                        }
                      }
                    }
                  }
                }
              }
            });

            cryptoList.appendChild(cryptoItem);
          })
          .catch(error => {
            console.error("Error al obtener el historial de precios:", error);
          });
      });

      // Verificar si hay más páginas
      if (page < totalPages) {
        setTimeout(() => {
          currentPage++;
          fetchCoins(currentPage);
        }, 1000); // Esperar 1 segundo antes de la siguiente petición
      }
    })
    .catch(error => {
      console.error("Error al obtener la lista de criptomonedas:", error);
    });
}

// Obtener el número total de páginas desde la API
axios.get('https://api.coingecko.com/api/v3/coins/list')
  .then(response => {
    const allCoins = response.data;
    totalPages = Math.ceil(allCoins.length / coinsPerPage);
    fetchCoins(currentPage);
  })
  .catch(error => {
    console.error("Error al obtener la lista de todas las criptomonedas:", error);
  });
