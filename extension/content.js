console.log("[Lembrei] script iniciado");

(function () {
  var texto = document.body ? document.body.innerText : "";

  console.log("[Lembrei] texto extraído");
  console.log("[Lembrei] preview:", texto.slice(0, 200));

  chrome.runtime.sendMessage({
    tipo: "texto-extraido",
    url: window.location.href,
    titulo: document.title,
    preview: texto.slice(0, 200),
    textoCompleto: texto,
  });
})();