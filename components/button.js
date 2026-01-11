function createButton(id, text) {
  const button = document.createElement("button");
  button.type = "button";
  button.id = id;
  button.textContent = text;
  button.style.cssText = `
    cursor: pointer;
    text-decoration: none;
    padding: 6px 10px;
    border: 3px solid #f8ac59;
    border-radius: 4px;
    color: #000000ff; 
    background: #ffffffff;
    margin: 4px;
    width: fit-content;
  `;

  button.target = "_blank";
  button.rel = "noopener noreferrer";

  // Hover effects for btnOcorrencia
  button.style.transition = "all 0.2s ease";
  button.addEventListener("mouseenter", () => {
    button.style.transform = "translateY(-1px)";
    button.style.boxShadow = "0 4px 8px rgba(15, 13, 8, 0.15)";
    button.style.backgroundColor = "#f3f3f3ff";
  });
  button.addEventListener("mouseleave", () => {
    button.style.transform = "translateY(0)";
    button.style.boxShadow = "0 2px 4px rgba(0,0,0,0.1)";
    button.style.backgroundColor = "#ffffffff";
  });

  // Click effect
  button.addEventListener("mousedown", () => {
    button.style.transform = "scale(0.95)";
    button.style.boxShadow = "0 1px 2px rgba(0,0,0,0.2)";
  });
  button.addEventListener("mouseup", () => {
    button.style.transform = "translateY(-1px)";
    button.style.boxShadow = "0 4px 8px rgba(15, 13, 8, 0.15)";
  });

  return button;
}
