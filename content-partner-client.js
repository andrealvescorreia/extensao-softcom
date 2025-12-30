// AREA PARTNER CLIENTE

const cnpjInput = document.getElementsByName(
    areaPartnerHTMLIdentifiers.cnpjName
)[0];

if (!cnpjInput) {
    alert("CNPJ: elemento HTML não encontrado.");
}

async function copyToClipboard() {
  const textElement = document.getElementById('cnpj');
  const text = textElement.value;
    const cleanText = text.replace(/\D/g, '');
  try {
    await navigator.clipboard.writeText(cleanText);
    console.log('Text copied to clipboard');
    
  } catch (err) {
    console.error('Failed to copy text: ', err);
  }
}

// Criar botão "Copiar"
const copyButton = document.createElement('button');
copyButton.type = 'button';
copyButton.title = 'Copiar CNPJ';
copyButton.style.position = 'absolute';
copyButton.style.right = '1px';
copyButton.style.top = '50%';
copyButton.style.transform = 'translateY(-55%)';
copyButton.style.border = 'none';
copyButton.style.background = 'transparent';
copyButton.style.cursor = 'pointer';
copyButton.style.padding = '5px 10px';


const svgIconElement = document.createElement("img");
svgIconElement.src = "data:image/svg+xml;base64," + btoa(copySvg);

svgIconElement.style.width = "18px";
svgIconElement.style.height = "18px";
copyButton.appendChild(svgIconElement);



copyButton.addEventListener('click', copyToClipboard);

// Envolver o input em um container com position relative
const inputWrapper = document.createElement('div');
inputWrapper.style.position = 'relative';
inputWrapper.style.display = 'inline-block';
inputWrapper.style.width = '100%';

cnpjInput.parentNode.insertBefore(inputWrapper, cnpjInput);
inputWrapper.appendChild(cnpjInput);
inputWrapper.appendChild(copyButton);

