
import { useState } from "react";

const scripts = ["hola", "procesar", "resumen","aleatorio"];

function App() {
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  const runScript = async (name) => {
    setLoading(true);
    setOutput("");
    const res = await fetch("https://albertodg85-github-io-1.onrender.com/run", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ script_name: name }),
    });
    const data = await res.json();
    setOutput(data.output);
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-white text-black font-mono p-4">
      <h1 className="text-2xl border-b border-black mb-4">Panel de Scripts</h1>
      <div className="grid grid-cols-3 gap-4">
        {scripts.map((s) => (
          <button
            key={s}
            onClick={() => runScript(s)}
            className="border border-black p-2 hover:bg-black hover:text-white transition"
          >
            Ejecutar: {s}
          </button>
        ))}
      </div>
      <div className="mt-6 border-t border-black pt-4">
        <h2 className="text-xl mb-2">Salida:</h2>
        {loading ? <p>Ejecutando...</p> : <pre>{output}</pre>}
      </div>
    </div>
  );
}

export default App;
