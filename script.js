document.addEventListener('DOMContentLoaded', () => {
  const listEl = document.getElementById('script-list');
  const outputEl = document.getElementById('output');

  function loadScripts() {
    fetch('/api/scripts')
      .then(res => res.json())
      .then(scripts => {
        listEl.innerHTML = '';
        scripts.forEach(name => {
          const li = document.createElement('li');
          li.textContent = name;
          li.addEventListener('click', () => runScript(name));
          listEl.appendChild(li);
        });
      })
      .catch(err => {
        outputEl.textContent = 'Error al cargar los scripts';
      });
  }

  function runScript(name) {
    outputEl.textContent = 'Ejecutando ' + name + '...';
    fetch('/api/run/' + encodeURIComponent(name), { method: 'POST' })
      .then(res => res.json())
      .then(result => {
        outputEl.textContent = (result.stdout || '') + (result.stderr ? '\n' + result.stderr : '');
      })
      .catch(err => {
        outputEl.textContent = 'Error al ejecutar el script';
      });
  }

  loadScripts();
});
