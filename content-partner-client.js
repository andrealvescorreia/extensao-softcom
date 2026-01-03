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
copyButton.style.transform = "translateY(-25%) translateX(-25%)";
copyButton.style.border = "none";
copyButton.style.background = "transparent";
copyButton.style.cursor = "pointer";
copyButton.style.padding = "5px 10px";

const svgIconElement = document.createElement("img");
svgIconElement.src = "data:image/svg+xml;base64," + btoa(copySvg);

svgIconElement.style.width = "18px";
svgIconElement.style.height = "18px";
copyButton.appendChild(svgIconElement);

function injectCopyButton() {
  const cnpjInput = document.getElementsByName(
    areaPartnerHTMLIdentifiers.cnpjName
  )[0];

  if (!cnpjInput) {
    alert("CNPJ: elemento HTML não encontrado.");
    return;
  }

  copyButton.onclick = () => {
    const text = cnpjInput.value;
    const cleanText = text.replace(/\D/g, "");
    copyToClipboard(cleanText);
  };

  const parent = cnpjInput.parentElement;
  if (!parent) {
    console.warn("CNPJ: elemento pai não encontrado para posicionar o botão.");
    return;
  }
  parent.appendChild(copyButton);
}
injectCopyButton();

const identificacaoLi = getElementByXPath(
  areaPartnerHTMLIdentifiers.identificacaoLiXPath
);

if (identificacaoLi) {
  const observer = new MutationObserver((mutationsList) => {
    for (const mutation of mutationsList) {
      if (
        mutation.type === "attributes" &&
        mutation.attributeName === "class"
      ) {
        const newClass = identificacaoLi.className;
        if (newClass.includes("active")) {
          setTimeout(function () {
            // Re-inject the copy button when the "Identificação" tab becomes active
            injectCopyButton();
          }, 1000);
        }
      }
    }
  });

  observer.observe(identificacaoLi, {
    attributes: true,
    attributeFilter: ["class"],
    attributeOldValue: true,
  });
}
