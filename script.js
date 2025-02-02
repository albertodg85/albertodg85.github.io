// Obtener la lista de las 50 criptomonedas más negociadas desde la API de CoinGecko
fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=50&page=1&sparkline=true')
  .then(response => response.json())
  .then(coins => {
    const cryptoList = document.querySelector('.crypto-list');

    coins.forEach(coin => {
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

      // Crear la gráfica usando Chart.js
      const canvas = document.createElement('canvas');
      canvas.classList.add('crypto-chart');
      cryptoItem.appendChild(canvas);

      // Generar etiquetas para el eje X (fechas de los últimos 7 días)
      const labels = [];
      const today = new Date();
      for (let i = 6; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(today.getDate() - i);
        // Formatear la fecha como 'YYYY-MM-DD'
        labels.push(date.toISOString().slice(0, 10));
      }

      // Verificar si hay datos de precios
      if (coin.sparkline_in_7d.price && coin.sparkline_in_7d.price.length > 0) {
        const chartData = {
          labels: labels, // Usar las fechas generadas como etiquetas
          datasets: [{
            label: 'Precio',
            data: coin.sparkline_in_7d.price,
            borderColor: 'blue',
            fill: false
          }]
        };

        new Chart(canvas, {
          type: 'line',
          data: chartData
        });
      } else {
        // Mostrar un mensaje si no hay datos de precios
        const noDataMessage = document.createElement('p');
        noDataMessage.textContent = "No hay datos de precios disponibles.";
        cryptoItem.appendChild(noDataMessage);
      }

      cryptoList.appendChild(cryptoItem);
    });
  });
