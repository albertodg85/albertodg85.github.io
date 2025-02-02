const apiUrl = 'https://api.coincap.io/v2/assets';
const cryptoTable = document.getElementById('cryptoTable');
const cryptoTableBody = cryptoTable.getElementsByTagName('tbody');
const loadingMessage = document.getElementById('loading');
const filterInput = document.getElementById('filter');
const sortSelect = document.getElementById('sort');

let cryptoDataCache =;

async function getCryptoData() {
    try {
        const response = await fetch(apiUrl);
        const dataWrapper = await response.json();
        const data = dataWrapper.data;
        cryptoDataCache = data;
        return data;
    } catch (error) {
        console.error('Error al obtener datos:', error);
        return;
    }
}

function displayCryptoData(data) {
    cryptoTableBody.innerHTML = '';

    data.forEach(coin => {
        const row = cryptoTableBody.insertRow();
        const symbolCell = row.insertCell();
        const nameCell = row.insertCell();
        const priceCell = row.insertCell();
        const marketCapCell = row.insertCell();
        const circulatingSupplyCell = row.insertCell();
        const maxSupplyCell = row.insertCell();
        const remainingSupplyCell = row.insertCell();
        const marketCapRankCell = row.insertCell();
        const buyPercentageCell = row.insertCell();
        const sellPercentageCell = row.insertCell();
        const change24hCell = row.insertCell();
        const volume24hCell = row.insertCell();

        symbolCell.textContent = coin.symbol;
        nameCell.textContent = coin.name;
        priceCell.textContent = Number(coin.priceUsd).toLocaleString('en-US', { style: 'currency', currency: 'USD' });
        marketCapCell.textContent = Number(coin.marketCapUsd).toLocaleString('en-US', { style: 'currency', currency: 'USD' });

        // Datos adicionales (manejar valores nulos o indefinidos)
        circulatingSupplyCell.textContent = coin.circulatingSupply? Number(coin.circulatingSupply).toLocaleString(): '-';
        maxSupplyCell.textContent = coin.maxSupply? Number(coin.maxSupply).toLocaleString(): '-';
        remainingSupplyCell.textContent = (coin.maxSupply && coin.circulatingSupply)? Number(coin.maxSupply - coin.circulatingSupply).toLocaleString(): '-';

        // Obtener el ranking de la propiedad 'rank'
        marketCapRankCell.textContent = coin.rank? Number(coin.rank): '-';

        buyPercentageCell.textContent = '-';
        sellPercentageCell.textContent = '-';

        // Obtener el cambio en 24h de la propiedad 'changePercent24Hr'
        change24hCell.textContent = Number(coin.changePercent24Hr).toFixed(2) + '%';
        volume24hCell.textContent = Number(coin.volumeUsd24Hr).toLocaleString('en-US', { style: 'currency', currency: 'USD' });

        // Estilos
        if (Number(coin.changePercent24Hr) > 0) {
            change24hCell.style.color = 'green';
        } else if (Number(coin.changePercent24Hr) < 0) {
            change24hCell.style.color = 'red';
        }
    });
}

function filterData(data, searchTerm) {
    const result = data.filter(coin => {
        const name = coin.name.toLowerCase();
        const symbol = coin.symbol.toLowerCase();
        return name.includes(searchTerm) || symbol.includes(searchTerm);
    });
    return result;
}

// Función corregida para la ordenación
function sortData(data, sortKey) {
    const [field, order] = sortKey.split('_');

    const result = data.sort((a, b) => {
        let valueA = a[field];
        let valueB = b[field];

        if (valueA === null || valueA === undefined) valueA = -Infinity;
        if (valueB === null || valueB === undefined) valueB = -Infinity;

        // Manejar la ordenación de cadenas sin eliminar caracteres
        if (typeof valueA === 'string' && typeof valueB === 'string') {
            valueA = valueA.toLowerCase();
            valueB = valueB.toLowerCase();
            return order === 'asc'? valueA.localeCompare(valueB): valueB.localeCompare(valueA);
        } else {
            // Si no son cadenas, convertir a número para la ordenación
            valueA = Number(valueA);
            valueB = Number(valueB);
            return order === 'asc'? valueA - valueB: valueB - valueA;
        }
    });
    return result;
}

async function loadAndDisplayData() {
    try {
        loadingMessage.style.display = 'block';
        cryptoTable.style.display = 'none';

        const cryptoData = await getCryptoData();

        let filteredData = cryptoData;
        const searchTerm = filterInput.value.toLowerCase();
        if (searchTerm) {
            filteredData = filterData(filteredData, searchTerm);
        }

        const sortKey = sortSelect.value;
        const sortedData = sortData(filteredData, sortKey);

        displayCryptoData(sortedData);

    } catch (error) {
        console.error('Error al cargar datos:', error);
    } finally {
        loadingMessage.style.display = 'none';
        cryptoTable.style.display = 'table';
    }
}

filterInput.addEventListener('input', () => {
    loadAndDisplayData();
});

sortSelect.addEventListener('change', () => {
    loadAndDisplayData();
});

document.addEventListener('DOMContentLoaded', loadAndDisplayData);
