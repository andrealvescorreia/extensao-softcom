// CLIENTE SATISFEITO

const clientNameXPath = "//*[@id='InfoCabecalhoChat']/div[1]";
const clientObservacoesAriaLabel = "Observações";
const clientPhoneXPath =
  '//*[@id="q-app"]/div/div/div/div/div/div[3]/aside/div/div[1]/div[2]/div/div/div/div[1]/div/div/div[1]/div/div[2]/div[2]/span[1]';
const headerXPath = '//*[@id="q-app"]/div/div/div/div/div/header/div';

const btnOcorrencia = createButton(
  "softcom-ocorrencia-btn",
  "Criar Ocorrência",
  journalPlusSVG
);

const btnVerCliente = createButton(
  "softcom-ver-cliente-btn",
  "Ver Cliente",
  pencilSVG
);

const iconImg = document.createElement("img");
iconImg.src = chrome.runtime.getURL("icon.png");
iconImg.alt = "Softcom Extensão";
iconImg.style.cssText = `
  width: 32px;
  height: 32px;
  margin-left: 8px;
  cursor: pointer;
`;
iconImg.id = "softcom-header-icon";

function injectIntoHeader() {
  const header = getElementByXPath(headerXPath);
  if (!header) return;

  // Evita duplicação
  if (!document.getElementById("softcom-header-icon")) {
    header.insertBefore(iconImg, header.children[1]);
  }
  if (!document.getElementById("softcom-ocorrencia-btn")) {
    header.insertBefore(btnOcorrencia, header.children[2]);
  }
  if (!document.getElementById("softcom-ver-cliente-btn")) {
    header.insertBefore(btnVerCliente, header.children[3]);
  }
}

// Executa quando o DOM estiver pronto
function initHeaderInjection() {
  const run = () => injectIntoHeader();

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run, { once: true });
  } else run();

  // Mantém para páginas SPA (DOM muda depois)
  const mo = new MutationObserver(() => injectIntoHeader());
  mo.observe(document.documentElement, { childList: true, subtree: true });
}

function captureClientName() {
  const chatClientNameElement = getElementByXPath(clientNameXPath);
  if (!chatClientNameElement) {
    alert("Nome do cliente: elemento HTML não encontrado.");
    return null;
  }
  return chatClientNameElement.innerHTML.trim().replace(/\p{Emoji}/gu, ""); //remove emojis
}

function captureClientCode() {
  const chatClientObservacoesElement = document.querySelector(
    `[aria-label="${clientObservacoesAriaLabel}"]`
  );
  if (!chatClientObservacoesElement) {
    alert("Observações: elemento HTML não encontrado.");
    return null;
  }
  return chatClientObservacoesElement.value.trim();
}

function captureClientPhone() {
  const chatClientPhoneElement = getElementByXPath(clientPhoneXPath);
  if (!chatClientPhoneElement) {
    alert("Telefone do cliente: elemento HTML não encontrado.");
    return null;
  }
  return chatClientPhoneElement.innerHTML.trim();
}

function captureCurrentClientInfo() {
  const client = {
    name: captureClientName(),
    code: captureClientCode(),
    phone: captureClientPhone(),
  };
  setCurrentClientInfo(client);
  return client;
}

btnOcorrencia.addEventListener("click", () => {
  const currentClientInfo = captureCurrentClientInfo();
  if (currentClientInfo.code === "") {
    btnOcorrencia.href = undefined;
    alert("Código do cliente não encontrado. Insira o código nas observações.");
    return;
  }
  const url = `https://areapartner.softcomsistemas.com.br/agenda/form/id/${currentClientInfo.code}`;
  btnOcorrencia.href = url;
});

btnVerCliente.addEventListener("click", () => {
  const currentClientInfo = captureCurrentClientInfo();
  if (currentClientInfo.code === "") {
    btnVerCliente.href = undefined;
    alert("Código do cliente não encontrado. Insira o código nas observações.");
    return;
  }
  const url = `https://areapartner.softcomsistemas.com.br/cliente/index/detail/id/${currentClientInfo.code}`;
  btnVerCliente.href = url;
});

// Escutar cliques dos botões vindos do popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  try {
    const clientInfo = captureCurrentClientInfo();

    if (request.action === "searchButtonClicked") {
      const nameParts = clientInfo.name.split(" ");
      nameParts.shift();
      if (nameParts[0] === "-") nameParts.shift();

      sendResponse({
        success: true,
        clientName: nameParts.join(" "),
      });
    } else if (request.action === "searchButtonFullNameClicked") {
      sendResponse({
        success: true,
        clientName: clientInfo.name,
      });
    }
  } catch (error) {
    console.error("[Content1] Erro ao processar ação:", error);
    sendResponse({
      success: false,
      message: "Erro ao processar ação",
      error: error.message,
    });
  }

  return true;
});

initHeaderInjection();
