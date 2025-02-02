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
    const moneda = monedaSelect
