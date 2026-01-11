const ANCHOR_BUTTON_STYLE_ID = "softcom-anchor-button-style";

function ensureAnchorButtonStyles() {
  if (document.getElementById(ANCHOR_BUTTON_STYLE_ID)) return;

  const style = document.createElement("style");
  style.id = ANCHOR_BUTTON_STYLE_ID;
  style.textContent = `
    .softcom-anchor-button {
      z-index: 1000;
      cursor: pointer;
      text-decoration: none;
      margin-left: 8px;
      padding: 6px 10px;
      border-radius: 4px;
      display: flex;
      align-items: center;
      gap: 5px;
      flex-direction: row-reverse;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
      transition: all 0.2s ease;
    }
    .softcom-anchor-button {
      border: 2px solid #b38600;
      background: #fec400;
      color: #000000;
    }

    .softcom-anchor-button.dark-mode {
      border: 2px solid #b38600;
      background: #000;
      color: #ffc107;
    }

    .softcom-anchor-button:hover {
      transform: translateY(-1px);
      box-shadow: 0 4px 8px rgba(15, 13, 8, 0.15);
    }

    .softcom-anchor-button svg {
      width: 15px;
      height: 15px;
      fill: black;
    }

    .softcom-anchor-button.dark-mode svg {
      fill: #ffc107;
    }S
  `;
  document.head.appendChild(style);
}

function createAnchorButton(id, text, icon) {
  ensureAnchorButtonStyles();

  const button = document.createElement("a");
  button.id = id;
  button.textContent = text;
  button.className = "softcom-anchor-button";
  button.target = "_blank";
  button.rel = "noopener noreferrer";

  if (icon !== undefined) {
    const svgContainer = document.createElement("div");
    svgContainer.innerHTML = icon;
    const svgElement = svgContainer.querySelector("svg");
    if (svgElement) {
      button.appendChild(svgElement);
    }
  }

  return button;
}
