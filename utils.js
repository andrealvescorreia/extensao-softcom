// Funções utilitárias compartilhadas entre content scripts
function getElementByXPath(path) {
  return document.evaluate(
    path,
    document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null
  ).singleNodeValue;
}

const journalPlusSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#FFC107" class="bi bi-journal-plus" viewBox="0 0 16 16">
  <path fill-rule="evenodd" d="M8 5.5a.5.5 0 0 1 .5.5v1.5H10a.5.5 0 0 1 0 1H8.5V10a.5.5 0 0 1-1 0V8.5H6a.5.5 0 0 1 0-1h1.5V6a.5.5 0 0 1 .5-.5z"/>
  <path d="M3 0h10a2 2 0 0 1 2 2v12a2 2 0 0
  1-2 2H3a2 2 0 0 1-2-2v-1h1v1a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H3a1 1 0 0 0-1 1v1H1V2a2 2 0 0 1 2-2z"/>
  <path d="M1 4v-.5a.5.5 0 0 1 1 0V4h.5a.5.5 0 0 1 0 1H2v.5a.5.5 0 0 1-1 0V5h-.5a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0V7h.5a.5.5 0 0 1 0 1H2v.5a.5.5 0 0 1-1 0V8h-.5a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0v.5h.5a.5.5 0 0 1 0 1H2v.5a.5.5 0 0 1-1 0v-.5h-.5a.5.5 0 0 1 0-1H1z"/>
</svg>`;

const pencilSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#FFC107" class="bi bi-pencil" viewBox="0 0 16 16">
  <path d="M12.146.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1 0 .708l-10 10a.5.5 0 0 1-.168.11l-5 2a.5.5 0 0 1-.65-.65l2-5a.5.5 0 0 1 .11-.168l10-10zM11.207 2.5 13.5 4.793 14.793 3.5 12.5 1.207l-1.293 1.293zm1.586 3L10.5 3.207 4 9.707V10h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.293l6.5-6.5zm-9.761 5.175L3 11.207l-.896.358.358-.896z"/>
</svg>`;

function createButton(id, text, icon) {
  const button = document.createElement("a");
  button.id = id;
  button.textContent = text;
  button.style.cssText = `
    z-index: 1000;
    cursor: pointer;
    text-decoration: none;
    margin-left: 8px;
    padding: 6px 10px;
    border: 1px solid #000;
    border-radius: 4px;
    background: #000000ff; color: #FFC107;
    display: flex;
    align-items: center;
    gap: 5px;
    flex-direction: row-reverse;
  `;

  button.target = "_blank";
  button.rel = "noopener noreferrer";

  // Hover effects for btnOcorrencia
  button.style.transition = "all 0.2s ease";
  button.addEventListener("mouseenter", () => {
    button.style.transform = "translateY(-1px)";
    button.style.boxShadow = "0 4px 8px rgba(15, 13, 8, 0.15)";
    button.style.backgroundColor = "#1a1410ff";
  });
  button.addEventListener("mouseleave", () => {
    button.style.transform = "translateY(0)";
    button.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
    button.style.backgroundColor = "#000000ff";
  });
  if (icon !== undefined) {
    const svgIconElement = document.createElement("img");
    svgIconElement.src = "data:image/svg+xml;base64," + btoa(icon);

    svgIconElement.style.width = "15px";
    svgIconElement.style.height = "15px";
    button.appendChild(svgIconElement);
  }

  return button;
}
