// Obtener la lista de criptomonedas desde la API de CoinGecko
fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=10&page=1&sparkline=true')
  .then(response => response.json())
  .then(coins => {
    const cryptoList = document.querySelector('.crypto-list');

    coins.forEach(coin => {
      // Crear un elemento para cada criptomoneda
      const cryptoItem = document.createElement('div');
      cryptoItem.classList.add('crypto-item');

      // Mostrar el logo
      const logo = document.createElement('img');
      logo.src = coin.image; // Usar la propiedad 'image' del objeto 'coin'
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

      // Crear la gráfica usando Chart.js
      const canvas = document.createElement('canvas');
      canvas.classList.add('crypto-chart');
      cryptoItem.appendChild(canvas);

      const chartData = {
        labels: [], // Eje X (se puede dejar vacío o rellenar con fechas)
        datasets: [{
          label: 'Precio',
          data: coin.sparkline_in_7d.price, // Datos del precio de los últimos 7 días
          borderColor: 'blue',
          fill: false
        }]
      };

      new Chart(canvas, {
        type: 'line',
        data: chartData
      });

      cryptoList.appendChild(cryptoItem);
    });
  });
