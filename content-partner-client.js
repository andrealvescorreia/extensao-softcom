// AREA PARTNER CLIENTE

async function copyToClipboard(cleanText) {
  try {
    await navigator.clipboard.writeText(cleanText);
    console.log("Text copied to clipboard");
  } catch (err) {
    console.error("Failed to copy text: ", err);
  }
}

// Criar botão "Copiar"
const copyButton = document.createElement("button");
copyButton.type = "button";
copyButton.title = "Copiar CNPJ";
copyButton.style.position = "absolute";
copyButton.style.right = "1px";
copyButton.style.top = "50%";
copyButton.style.transform = "translateY(-55%)";
copyButton.style.border = "none";
copyButton.style.background = "transparent";
copyButton.style.cursor = "pointer";
copyButton.style.padding = "5px 10px";

const svgIconElement = document.createElement("img");
svgIconElement.src = "data:image/svg+xml;base64," + btoa(copySvg);

svgIconElement.style.width = "18px";
svgIconElement.style.height = "18px";
copyButton.appendChild(svgIconElement);

// Envolver o input em um container com position relative
const inputWrapper = document.createElement("div");
inputWrapper.style.position = "relative";
inputWrapper.style.display = "inline-block";
inputWrapper.style.width = "100%";

function injectCopyButton() {
  const cnpjInput = document.getElementsByName(
    areaPartnerHTMLIdentifiers.cnpjName
  )[0];

  if (!cnpjInput) {
    alert("CNPJ: elemento HTML não encontrado.");
    return;
  }
  copyButton.addEventListener("click", () => {
    const text = cnpjInput.value;
    const cleanText = text.replace(/\D/g, "");
    copyToClipboard(cleanText);
  });
  cnpjInput.parentNode.insertBefore(inputWrapper, cnpjInput);
  inputWrapper.appendChild(cnpjInput);
  inputWrapper.appendChild(copyButton);
}
injectCopyButton();
