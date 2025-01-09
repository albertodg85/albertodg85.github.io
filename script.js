const apiUrl = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false&locale=es';
const cryptoTable = document.getElementById('cryptoTable').getElementsByTagName('tbody')[0];

fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
        data.forEach(coin => {
            let row = cryptoTable.insertRow();
            let symbolCell = row.insertCell();
            let nameCell = row.insertCell();
            let priceCell = row.insertCell();
            let marketCapCell = row.insertCell();
            let change24hCell = row.insertCell();
            let volume24hCell = row.insertCell();

            symbolCell.textContent = coin.symbol.toUpperCase();
            nameCell.textContent = coin.name;
            priceCell.textContent = coin.current_price.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
            marketCapCell.textContent = coin.market_cap.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
            change24hCell.textContent = coin.price_change_percentage_24h.toFixed(2) + '%';
            volume24hCell.textContent = coin.total_volume.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

            // Añadir color a la celda del cambio de precio en 24h
            if (coin.price_change_percentage_24h > 0) {
                change24hCell.style.color = 'green';
            } else if (coin.price_change_percentage_24h < 0) {
                change24hCell.style.color = 'red';
            }
        });
    })
    .catch(error => {
        console.error('Error fetching data:', error);
        // En caso de error, mostrar un mensaje en la página
        let row = cryptoTable.insertRow();
        let errorCell = row.insertCell();
        errorCell.colSpan = 6; // Ocupa todas las columnas
        errorCell.textContent = "Error al cargar los datos. Por favor, inténtalo de nuevo más tarde.";
    });
