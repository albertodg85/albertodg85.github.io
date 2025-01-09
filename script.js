const apiUrl = 'https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false&locale=es';
const trendingApiUrl = 'https://api.coingecko.com/api/v3/search/trending';
const cryptoTable = document.getElementById('cryptoTable').getElementsByTagName('tbody')[0];

// Función para obtener las monedas en tendencia
async function getTrendingCoins() {
    try {
        const response = await fetch(trendingApiUrl);
        const data = await response.json();
        return data.coins.map(coin => coin.item.id);
    } catch (error) {
        console.error('Error fetching trending coins:', error);
        return [];
    }
}

// Función principal para obtener los datos de las criptomonedas y mostrarlos en la tabla
async function displayCryptoData() {
    try {
        const [cryptoData, trendingCoins] = await Promise.all([
            fetch(apiUrl).then(response => response.json()),
            getTrendingCoins()
        ]);

        cryptoData.forEach(coin => {
            let row = cryptoTable.insertRow();
            let symbolCell = row.insertCell();
            let nameCell = row.insertCell();
            let priceCell = row.insertCell();
            let marketCapCell = row.insertCell();
            let change24hCell = row.insertCell();
            let volume24hCell = row.insertCell();
            let trendCell = row.insertCell();

            symbolCell.textContent = coin.symbol.toUpperCase();
            nameCell.textContent = coin.name;
            priceCell.textContent = coin.current_price.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
            marketCapCell.textContent = coin.market_cap.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
            change24hCell.textContent = coin.price_change_percentage_24h.toFixed(2) + '%';
            volume24hCell.textContent = coin.total_volume.toLocaleString('en-US', { style: 'currency', currency: 'USD' });

            // Marcar la moneda como en tendencia
            if (trendingCoins.includes(coin.id)) {
                trendCell.textContent = '🔥';
            } else {
                trendCell.textContent = '';
            }

            if (coin.price_change_percentage_24h > 0) {
                change24hCell.style.color = 'green';
            } else if (coin.price_change_percentage_24h < 0) {
                change24hCell.style.color = 'red';
            }
        });
    } catch (error) {
        console.error('Error fetching data:', error);
        let row = cryptoTable.insertRow();
        let errorCell = row.insertCell();
        errorCell.colSpan = 7;
        errorCell.textContent = "Error al cargar los datos. Por favor, inténtalo de nuevo más tarde.";
    }
}

// Añadir la nueva columna de tendencia al encabezado de la tabla
document.addEventListener('DOMContentLoaded', () => {
    displayCryptoData();
});
