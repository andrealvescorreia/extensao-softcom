// AREA PARTNER CLIENTE

async function copyToClipboard(cleanText) {
  try {
    // Tentar usar a API Clipboard (funciona em HTTPS)
    if (navigator.clipboard && navigator.clipboard.writeText) {
      await navigator.clipboard.writeText(cleanText);
      console.log("Text copied to clipboard");
    } else {
      // Fallback para HTTP e navegadores antigos
      const textArea = document.createElement("textarea");
      textArea.value = cleanText;
      textArea.style.position = "fixed";
      textArea.style.left = "-999999px";
      textArea.style.top = "-999999px";
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();

      const successful = document.execCommand("copy");
      document.body.removeChild(textArea);

      if (!successful) {
        throw new Error("Fallback: Copy command was unsuccessful");
      }
    }
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

function showCopyFeedback(button) {
  const tooltip = document.createElement("div");
  tooltip.textContent = "Copiado!";
  tooltip.style.position = "absolute";
  tooltip.style.bottom = "100%";
  tooltip.style.left = "50%";
  tooltip.style.transform = "translateX(-50%)";
  tooltip.style.backgroundColor = "#ebebebff";
  tooltip.style.padding = "8px 12px";
  tooltip.style.borderRadius = "4px";
  tooltip.style.fontSize = "12px";
  tooltip.style.whiteSpace = "nowrap";
  tooltip.style.zIndex = "10000";
  tooltip.style.marginBottom = "5px";

  button.appendChild(tooltip);

  setTimeout(() => {
    tooltip.remove();
  }, 1500);
}

function injectCopyButton() {
  const cnpjInput = document.getElementsByName(
    areaPartnerHTMLSelectors.cnpjName,
  )[0];

  if (!cnpjInput) {
    alert("CNPJ: elemento HTML não encontrado.");
    return;
  }

  copyButton.onclick = () => {
    const text = cnpjInput.value;
    const cleanText = text.replace(/\D/g, "");
    copyToClipboard(cleanText);
    showCopyFeedback(copyButton);
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
  areaPartnerHTMLSelectors.identificacaoLiXPath,
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
