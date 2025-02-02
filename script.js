const tableBody = document.getElementById('crypto-table').getElementsByTagName('tbody');

fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd')
  .then(response => response.json())
  .then(data => {
        data.forEach(coin => {
            const row = tableBody.insertRow();
            row.insertCell().textContent = coin.name;
            row.insertCell().textContent = coin.current_price;
            row.insertCell().textContent = coin.price_change_percentage_24h + '%';
            row.insertCell().textContent = coin.high_24h;
            row.insertCell().textContent = coin.low_24h;
            row.insertCell().textContent = coin.total_volume;
            row.insertCell().textContent = coin.market_cap;
            row.insertCell().textContent = coin.market_cap_rank;
            row.insertCell().textContent = coin.circulating_supply;
            row.insertCell().textContent = coin.max_supply? coin.max_supply: '-';

            // Calcular el porcentaje de suministro no utilizado
            let porcentajeNoUtilizado = 0;
            if (coin.circulating_supply && coin.max_supply) {
                porcentajeNoUtilizado = ((coin.max_supply - coin.circulating_supply) / coin.max_supply) * 100;
            }
            row.insertCell().textContent = porcentajeNoUtilizado.toFixed(2) + '%';

            // Mostrar la tendencia actual con flechas
            const trendCell = row.insertCell();
            if (coin.price_change_percentage_24h > 0) {
                trendCell.innerHTML = '<span style="color:green;">&#x25B2;</span>'; // Flecha verde hacia arriba
            } else {
                trendCell.innerHTML = '<span style="color:red;">&#x25BC;</span>'; // Flecha roja hacia abajo
            }

            // Obtener los días con valores máximos y mínimos de los últimos 12 meses
            // (requiere llamadas adicionales a la API y lógica para procesar los datos históricos)
            //...
        });
    });
