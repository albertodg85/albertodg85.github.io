document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.getElementById('crypto-table').getElementsByTagName('tbody');

    fetch('https://api.coincap.io/v2/assets')
      .then(response => response.json())
      .then(data => {
            data.data.forEach(coin => {  // Asegúrate de acceder a la propiedad 'data' dentro del objeto de respuesta
                const row = tableBody.insertRow();
                row.insertCell().textContent = coin.name;
                row.insertCell().textContent = Number(coin.priceUsd).toFixed(2);  // Convertir a número y formatear a 2 decimales
                row.insertCell().textContent = Number(coin.changePercent24Hr).toFixed(2) + '%';  // Convertir a número y formatear a 2 decimales
                //... (obtener y mostrar los demás datos)

                // Calcular el porcentaje de suministro no utilizado
                let porcentajeNoUtilizado = 0;
                if (coin.supply && coin.maxSupply) {
                    porcentajeNoUtilizado = ((coin.maxSupply - coin.supply) / coin.maxSupply) * 100;
                }
                row.insertCell().textContent = porcentajeNoUtilizado.toFixed(2) + '%';

                // Mostrar la tendencia actual con flechas
                const trendCell = row.insertCell();
                if (Number(coin.changePercent24Hr) > 0) {
                    trendCell.innerHTML = '<span style="color:green;">&#x25B2;</span>'; // Flecha verde hacia arriba
                } else {
                    trendCell.innerHTML = '<span style="color:red;">&#x25BC;</span>'; // Flecha roja hacia abajo
                }

                // Obtener los días con valores máximos y mínimos de los últimos 12 meses
                // (requiere llamadas adicionales a la API y lógica para procesar los datos históricos)
                //...
            });
        })
      .catch(error => {
            console.error('Error al obtener los datos:', error);
        });
});
