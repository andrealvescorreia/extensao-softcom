// CLIENTE SATISFEITO

function isDarkModeActive() {
  const target = document.body || document.documentElement;
  if (!target) return false;

  if (target.classList.contains("body--dark")) return true;
  return Boolean(document.querySelector(".body--dark"));
}

const btnOcorrencia = createAnchorButton(
  "softcom-ocorrencia-btn",
  "Criar OC.",
  journalPlusSVG
);

const btnOCFinalizada = createAnchorButton(
  "softcom-ocorrencia-finalizada-btn",
  "OC. Finalizada",
  checkSVG
);

btnOCFinalizada.title =
  "Criar OC. já finalizada. Capta horário de chegada e saída a partir do histórico da conversa.";

const btnVerCliente = createAnchorButton(
  "softcom-ver-cliente-btn",
  "Ver Cliente",
  pencilSVG
);

const btnVerProspectado = createAnchorButton(
  "softcom-ver-prospectado-btn",
  "Ver Prospectado",
  pencilSVG
);

function applyStyleMode() {
  const isDarkMode = isDarkModeActive();
  btnOcorrencia.classList.toggle("dark-mode", isDarkMode);
  btnOCFinalizada.classList.toggle("dark-mode", isDarkMode);
  btnVerCliente.classList.toggle("dark-mode", isDarkMode);
  btnVerProspectado.classList.toggle("dark-mode", isDarkMode);
}
applyStyleMode();

// Observer para monitorar mudanças no modo escuro
function observeDarkModeChanges() {
  const bodyElement = document.body || document.documentElement;
  const observer = new MutationObserver(() => {
    applyStyleMode();
  });

  observer.observe(bodyElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
}

const iconImg = document.createElement("a");
iconImg.id = "softcom-header-icon";
iconImg.href = "https://areapartner.softcomsistemas.com.br/";
iconImg.target = "_blank";
iconImg.rel = "noopener noreferrer";
iconImg.style.cssText = `
  margin-left: 8px;
  margin-right: 5px;
  cursor: pointer;
  display: flex;
  align-items: center;
`;

const img = document.createElement("img");
img.src = chrome.runtime.getURL("icon.png");
img.alt = "Softcom Extensão";
img.style.cssText = `
  width: 32px;
  height: 32px;
`;
iconImg.appendChild(img);

function injectIntoHeader() {
  const header = getElementByXPath(clienteSatisfeitoHTMLSelectors.headerXPath);
  if (!header) return;

  // Evita duplicação
  if (!document.getElementById("softcom-header-icon")) {
    header.insertBefore(iconImg, header.children[1]);
  }
  if (!document.getElementById("softcom-ocorrencia-btn")) {
    header.insertBefore(btnOcorrencia, header.children[2]);
  }
  if (!document.getElementById("softcom-ocorrencia-finalizada-btn")) {
    header.insertBefore(btnOCFinalizada, header.children[3]);
  }
  if (!document.getElementById("softcom-ver-cliente-btn")) {
    header.insertBefore(btnVerCliente, header.children[4]);
  }
  if (!document.getElementById("softcom-ver-prospectado-btn")) {
    header.insertBefore(btnVerProspectado, header.children[5]);
  }
}

// Executa quando o DOM estiver pronto
function initHeaderInjection() {
  const run = () => {
    injectIntoHeader();
    observeDarkModeChanges();
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run, { once: true });
  } else run();

  // Mantém para páginas SPA (DOM muda depois)
  const mo = new MutationObserver(() => injectIntoHeader());
  mo.observe(document.documentElement, { childList: true, subtree: true });
}

function captureClientName() {
  const nameElement = getElementByXPath(
    clienteSatisfeitoHTMLSelectors.clientNameXPath
  );
  if (!nameElement) {
    alert("Nome do cliente: elemento HTML não encontrado.");
    return null;
  }
  return nameElement.innerHTML.trim().replace(/\p{Emoji}/gu, ""); //remove emojis
}

function captureClientCode() {
  const observacoesElement = document.querySelector(
    `[aria-label="${clienteSatisfeitoHTMLSelectors.clientObservacoesAriaLabel}"]`
  );
  if (!observacoesElement) {
    alert("Observações: elemento HTML não encontrado.");
    return null;
  }

  const text = observacoesElement.value.trim();
  if (text.includes("\n")) {
    const lines = text.split("\n");
    const choice = prompt(
      "Foram encontradas múltiplas linhas nas observações. Insira o número da linha que contém o código do cliente:\n" +
        lines.map((line, index) => `${index + 1}: ${line}`).join("\n"),
      "1"
    );
    if (choice !== null) {
      const lineNumber = parseInt(choice, 10);
      if (!isNaN(lineNumber) && lineNumber > 0 && lineNumber <= lines.length) {
        return lines[lineNumber - 1].trim();
      } else {
        alert("Número de linha inválido.");
        return null;
      }
    } else {
      return null;
    }
  }

  return text;
}

function captureClientPhone() {
  const phoneElement = getElementByXPath(
    clienteSatisfeitoHTMLSelectors.clientPhoneXPath
  );
  if (!phoneElement) {
    alert("Telefone do cliente: elemento HTML não encontrado.");
    return null;
  }
  return phoneElement.innerHTML.trim();
}

function timeHHMMToNumber(timeStr) {
  if (typeof timeStr !== "string") return null;
  const newStr = timeStr.replace(":", "");
  const timeNum = parseInt(newStr, 10);
  return isNaN(timeNum) ? null : timeNum;
}

function captureArrivalAndDepartureTime() {
  let arrivalTime = null;
  let departureTime = null;
  const messages = document.querySelectorAll(".q-message-text-content--sent");

  for (let i = messages.length - 1; i >= 0; i--) {
    const messageElement = messages[i];
    const lines = messageElement.innerText.split("\n");
    if (arrivalMessages.includes(lines[2]) && !arrivalTime) {
      arrivalTime = lines[3];
    }
    if (departureMessages.includes(lines[2]) && !departureTime) {
      departureTime = lines[3];
    }
  }
  if (!arrivalTime) {
    alert("Horário de chegada: não foi possível identificar na conversa.");
  }
  if (!departureTime) {
    alert("Horário de saída: não foi possível identificar na conversa.");
  }
  if (timeHHMMToNumber(arrivalTime) > timeHHMMToNumber(departureTime)) {
    alert(
      `Os horários capturados parecem estar incorretos (${arrivalTime} > ${departureTime}). Checar na conversa.`
    );
  }
  return { arrivalTime, departureTime };
}

function captureCurrentClientInfo() {
  const client = {
    name: captureClientName(),
    code: captureClientCode(),
    phone: captureClientPhone(),
  };
  return client;
}

btnOcorrencia.addEventListener("click", () => {
  const currentClientInfo = captureCurrentClientInfo();
  if (currentClientInfo.code === "") {
    btnOcorrencia.href = `https://areapartner.softcomsistemas.com.br/cliente/index?&nome_cliente=${currentClientInfo.name}`;
    alert("Código do cliente não encontrado. Insira o código nas observações.");
    return;
  }
  btnOcorrencia.href = `https://areapartner.softcomsistemas.com.br/agenda/form/id/${
    currentClientInfo.code
  }?name=${encodeURIComponent(
    currentClientInfo.name
  )}&phone=${encodeURIComponent(currentClientInfo.phone)}&assunto=TEC REMOTO`;
});

btnOCFinalizada.addEventListener("click", () => {
  const currentClientInfo = captureCurrentClientInfo();
  const { arrivalTime, departureTime } = captureArrivalAndDepartureTime();
  if (currentClientInfo.code === "") {
    btnOCFinalizada.href = `https://areapartner.softcomsistemas.com.br/cliente/index?&nome_cliente=${currentClientInfo.name}`;
    alert("Código do cliente não encontrado. Insira o código nas observações.");
    return;
  }
  btnOCFinalizada.href = `https://areapartner.softcomsistemas.com.br/agenda/form/id/${
    currentClientInfo.code
  }?name=${encodeURIComponent(
    currentClientInfo.name
  )}&phone=${encodeURIComponent(
    currentClientInfo.phone
  )}&assunto=TEC REMOTO&arrivalTime=${encodeURIComponent(
    arrivalTime || ""
  )}&departureTime=${encodeURIComponent(departureTime || "")}`;
});

btnVerCliente.addEventListener("click", () => {
  const currentClientInfo = captureCurrentClientInfo();
  if (currentClientInfo.code === "") {
    btnVerCliente.href = `https://areapartner.softcomsistemas.com.br/cliente/index?&nome_cliente=${currentClientInfo.name}`;
    alert("Código do cliente não encontrado. Insira o código nas observações.");
    return;
  }
  const url = `https://areapartner.softcomsistemas.com.br/cliente/index/detail/id/${currentClientInfo.code}`;
  btnVerCliente.href = url;
});

btnVerProspectado.addEventListener("click", () => {
  const currentClientInfo = captureCurrentClientInfo();
  if (currentClientInfo.code === "") {
    btnVerProspectado.href = `https://areapartner.softcomsistemas.com.br/comercial/prospectado?&nome_do_cliente=${currentClientInfo.name}`;
    alert(
      "Código do prospectado não encontrado. Insira o código nas observações."
    );
    return;
  }
  const url = `https://areapartner.softcomsistemas.com.br/comercial/prospectado/form/table/prospectado/id/${currentClientInfo.code}`;
  btnVerProspectado.href = url;
});

// Escutar cliques dos botões vindos do popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  try {
    const clientName = captureClientName();

    if (request.action === "searchButtonClicked") {
      const nameParts = clientName.split(" ");
      nameParts.shift();
      if (nameParts[0] === "-") nameParts.shift();

      sendResponse({
        success: true,
        clientName: nameParts.join(" "),
      });
    } else if (request.action === "searchButtonFullNameClicked") {
      sendResponse({
        success: true,
        clientName: clientName,
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
