const apiKey = 'a14e00b6a3524ab3bc87818dcbd0a9eb'; // API key proporcionada
const noticiasContainer = document.getElementById('noticias-container');

async function obtenerNoticiasCrypto() {
    const url = `https://newsapi.org/v2/everything?q=crypto&searchIn=title&sortBy=publishedAt&language=es&apiKey=${apiKey}`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if (data.status === 'ok') {
            mostrarNoticias(data.articles);
        } else {
            console.error('Error al obtener noticias:', data.message);
            noticiasContainer.innerHTML = '<p>Error al cargar las noticias.</p>';
        }
    } catch (error) {
        console.error('Error al obtener noticias:', error);
        noticiasContainer.innerHTML = '<p>Error al cargar las noticias.</p>';
    }
}

function mostrarNoticias(articulos) {
    noticiasContainer.innerHTML = '';

    if (articulos.length === 0) {
        noticiasContainer.innerHTML = '<p>No se encontraron noticias.</p>';
        return;
    }

    const listaNoticias = document.createElement('ul');
    articulos.forEach(articulo => {
        const listItem = document.createElement('li');
        const enlace = document.createElement('a');
        enlace.href = articulo.url;
        enlace.textContent = articulo.title;
        enlace.target = '_blank'; // Abrir en una nueva pestaña
        listItem.appendChild(enlace);
        listaNoticias.appendChild(listItem);
    });

    noticiasContainer.appendChild(listaNoticias);
}

document.addEventListener('DOMContentLoaded', obtenerNoticiasCrypto);
