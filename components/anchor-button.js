function createAnchorButton(id, text, icon) {
  const button = document.createElement("a");
  button.id = id;
  button.textContent = text;
  button.style.cssText = `
    z-index: 1000;
    cursor: pointer;
    text-decoration: none;
    margin-left: 8px;
    padding: 6px 10px;
    border: 2px solid #b38600ff;
    border-radius: 4px;
    background: #000000ff; 
    color: #FFC107;
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
