const cantidadInput = document.getElementById('cantidad');
const monedaSelect = document.getElementById('moneda');
const calcularBtn = document.getElementById('calcularBtn');
const crypto1Input = document.getElementById('crypto1');
const inversion1Input = document.getElementById('inversion1');
const crypto2Input = document.getElementById('crypto2');
const inversion2Input = document.getElementById('inversion2');
const crypto3Input = document.getElementById('crypto3');
const inversion3Input = document.getElementById('inversion3');
const crypto4Input = document.getElementById('crypto4');
const inversion4Input = document.getElementById('inversion4');

calcularBtn.addEventListener('click', async () => {
    const cantidad = Number(cantidadInput.value);
    const moneda = monedaSelect.value;

    if (isNaN(cantidad) || cantidad <= 0) {
        alert('Por favor, introduce una cantidad válida.');
        return;
    }

    try {
        const response = await fetch('http://localhost:3001/api/recomendaciones', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ cantidad, moneda }),
        });

        const data = await response.json();
        console.log("Respuesta del servidor:", data);

        // Verificar si la respuesta tiene la estructura esperada
        if (data.respuesta && typeof data.respuesta === 'string') {
            try {
                const recomendaciones = JSON.parse(data.respuesta);

                if (recomendaciones.cortoPlazo && recomendaciones.medioPlazo && recomendaciones.largoPlazo) {
                  crypto1Input.value = recomendaciones.cortoPlazo[0].nombre;
                  inversion1Input.value = recomendaciones.cortoPlazo[0].cantidad + ' ' + moneda;

                  crypto2Input.value = recomendaciones.medioPlazo[0].nombre;
                  inversion2Input.value = recomendaciones.medioPlazo[0].cantidad + ' ' + moneda;

                  crypto3Input.value = recomendaciones.medioPlazo[1].nombre;
                  inversion3Input.value = recomendaciones.medioPlazo[1].cantidad + ' ' + moneda;

                  crypto4Input.value = recomendaciones.largoPlazo[0].nombre;
                  inversion4Input.value = recomendaciones.largoPlazo[0].cantidad + ' ' + moneda;
                } else {
                    console.error("La respuesta del servidor no tiene la estructura esperada.");
                    alert('Error al obtener recomendaciones. Por favor, inténtalo de nuevo.');
                }
            } catch (parseError) {
                console.error("Error al parsear la respuesta JSON:", parseError);
                alert('Error al obtener recomendaciones. Por favor, inténtalo de nuevo.');
            }
        } else {
            console.error("La respuesta del servidor no es válida.");
            alert('Error al obtener recomendaciones. Por favor, inténtalo de nuevo.');
        }

    } catch (error) {
        console.error("Error al obtener recomendaciones:", error);
        alert('Error al obtener recomendaciones. Por favor, inténtalo de nuevo.');
    }
});
