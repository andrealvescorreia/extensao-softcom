// CLIENTE SATISFEITO

const AREA_PARTNER_URL_PRODUCTION =
  "https://areapartner.softcomsistemas.com.br/";
const AREA_PARTNER_URL_ALTERNATIVE =
  "http://177.43.232.2:25123/area-partner/public/";

let AREA_PARTNER_BASE_URL = AREA_PARTNER_URL_PRODUCTION;

// Carregar URL da Area Partner do storage
chrome.storage.sync.get(["area-partner-use-alternative"], (result) => {
  const useAlternative = result["area-partner-use-alternative"] || false;
  AREA_PARTNER_BASE_URL = useAlternative
    ? AREA_PARTNER_URL_ALTERNATIVE
    : AREA_PARTNER_URL_PRODUCTION;

  // Atualizar href do ícone
  iconImg.href = AREA_PARTNER_BASE_URL;
});

function isDarkModeActive() {
  const target = document.body || document.documentElement;
  if (!target) return false;

  if (target.classList.contains("body--dark")) return true;
  return Boolean(document.querySelector(".body--dark"));
}

const iconImg = document.createElement("a");
iconImg.id = "softcom-header-icon";
iconImg.href = AREA_PARTNER_BASE_URL;
iconImg.target = "_blank";
iconImg.rel = "noopener noreferrer";
iconImg.style.cssText = `
  margin-left: 5px;
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

const btnOcorrencia = createAnchorButton(
  "softcom-ocorrencia-btn",
  "Criar OC.",
  journalPlusSVG,
);

const btnOCFinalizada = createAnchorButton(
  "softcom-ocorrencia-finalizada-btn",
  "OC. Finalizada",
  checkSVG,
);

// Criar ícone de help com interrogação
const helpIconOCFinalizada = document.createElement("span");
helpIconOCFinalizada.innerText = "?";
helpIconOCFinalizada.style.cssText = `
  align-items: center;
  color: white;
  font-size: 13px;
  font-weight: bold;
  cursor: help;
  position: absolute;
  margin-top: -18px;
  margin-right: -6px;
  text-shadow:
    -1px -1px 0 #000, 
     1px -1px 0 #000,
    -1px  1px 0 #000, 
     1px  1px 0 #000;
`;
helpIconOCFinalizada.title = "Clique aqui para mais informações.";
helpIconOCFinalizada.addEventListener("click", (e) => {
  e.preventDefault();
  e.stopPropagation();
  alert(`
    Captura horários de chegada e saída da conversa atual para preencher no formulário da OC. Funciona tanto com mensagens enviadas quanto com notas internas.
    O horário de chegada é identificado quando é usada uma das seguintes frases:
    ${arrivalMessages.map((msg) => `\n- "${msg}"`).join("")}
    O horário de saída é identificado quando é usada uma das seguintes frases:
    ${departureMessages.map((msg) => `\n- "${msg}"`).join("")}
    `);
});
btnOCFinalizada.appendChild(helpIconOCFinalizada);

const btnVerCliente = createAnchorButton(
  "softcom-ver-cliente-btn",
  "Ver Cliente",
  pencilSVG,
);

const btnVerProspectado = createAnchorButton(
  "softcom-ver-prospectado-btn",
  "Ver Prospectado",
  pencilSVG,
);

function applyStyleMode() {
  const isDarkMode = isDarkModeActive();
  btnOcorrencia.classList.toggle("dark-mode", isDarkMode);
  btnOCFinalizada.classList.toggle("dark-mode", isDarkMode);
  btnVerCliente.classList.toggle("dark-mode", isDarkMode);
  btnVerProspectado.classList.toggle("dark-mode", isDarkMode);
}

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

// Cache de preferências para acesso rápido
let buttonPreferences = {
  "toggle-btn-ocorrencia": true,
  "toggle-btn-ocorrencia-finalizada": true,
  "toggle-btn-ver-cliente": true,
  "toggle-btn-ver-prospectado": true,
};

// Carregar preferências inicialmente
function loadButtonPreferences() {
  chrome.storage.sync.get(Object.keys(buttonPreferences), (result) => {
    Object.keys(buttonPreferences).forEach((key) => {
      buttonPreferences[key] = result[key] !== false;
    });
    // Injetar após carregar preferências
    injectIntoHeader();
  });
}

function injectIntoHeader() {
  const header = getElementByXPath(clienteSatisfeitoHTMLSelectors.headerXPath);
  if (!header) return;

  // Usar cache de preferências (síncrono)
  const isOcorrenciaEnabled = buttonPreferences["toggle-btn-ocorrencia"];
  const isOCFinalizadaEnabled =
    buttonPreferences["toggle-btn-ocorrencia-finalizada"];
  const isVerClienteEnabled = buttonPreferences["toggle-btn-ver-cliente"];
  const isVerProspectadoEnabled =
    buttonPreferences["toggle-btn-ver-prospectado"];

  // Evita duplicação e respeita preferências
  if (!document.getElementById("softcom-header-icon")) {
    header.insertBefore(iconImg, header.children[1]);
  }

  // Criar OC
  if (isOcorrenciaEnabled) {
    if (!document.getElementById("softcom-ocorrencia-btn")) {
      header.insertBefore(btnOcorrencia, header.children[2]);
    }
  } else {
    const btn = document.getElementById("softcom-ocorrencia-btn");
    if (btn) btn.remove();
  }

  // OC Finalizada
  if (isOCFinalizadaEnabled) {
    if (!document.getElementById("softcom-ocorrencia-finalizada-btn")) {
      header.insertBefore(btnOCFinalizada, header.children[3]);
    }
  } else {
    const btn = document.getElementById("softcom-ocorrencia-finalizada-btn");
    if (btn) btn.remove();
  }

  // Ver Cliente
  if (isVerClienteEnabled) {
    if (!document.getElementById("softcom-ver-cliente-btn")) {
      header.insertBefore(btnVerCliente, header.children[4]);
    }
  } else {
    const btn = document.getElementById("softcom-ver-cliente-btn");
    if (btn) btn.remove();
  }

  // Ver Prospectado
  if (isVerProspectadoEnabled) {
    if (!document.getElementById("softcom-ver-prospectado-btn")) {
      header.insertBefore(btnVerProspectado, header.children[5]);
    }
  } else {
    const btn = document.getElementById("softcom-ver-prospectado-btn");
    if (btn) btn.remove();
  }
}

function captureClientName() {
  const nameElement = getElementByXPath(
    clienteSatisfeitoHTMLSelectors.clientNameXPath,
  );
  if (!nameElement) {
    alert("Nome do cliente: elemento HTML não encontrado.");
    return null;
  }
  return nameElement.innerHTML.trim().replace(/\p{Emoji}/gu, ""); //remove emojis
}

function captureClientCode() {
  const observacoesElement = document.querySelector(
    `[aria-label="${clienteSatisfeitoHTMLSelectors.clientObservacoesAriaLabel}"]`,
  );
  if (!observacoesElement) {
    alert("Observações: elemento HTML não encontrado.");
    return null;
  }

  const text = observacoesElement.value.trim();
  if (text.includes("\n")) {
    const lines = text.split("\n");
    const defaultChoice = "1";
    const choice = prompt(
      "Foram encontradas múltiplas linhas nas observações. Insira o número da linha que contém o código do cliente:\n" +
        lines.map((line, index) => `${index + 1}: ${line}`).join("\n"),
      defaultChoice,
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
    clienteSatisfeitoHTMLSelectors.clientPhoneXPath,
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
  const messages = document.querySelectorAll(
    clienteSatisfeitoHTMLSelectors.sentMessageClass,
  );

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
  if (
    arrivalTime &&
    departureTime &&
    timeHHMMToNumber(arrivalTime) > timeHHMMToNumber(departureTime)
  ) {
    alert(
      `Os horários capturados parecem estar incorretos (${arrivalTime} > ${departureTime}). Checar na conversa.`,
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

function getAudioSource(audioElement) {
  if (!audioElement) return null;
  let src =
    audioElement.currentSrc ||
    audioElement.src ||
    audioElement.querySelector("source")?.src;

  if (!src) {
    console.error("Áudio sem fonte identificada.");
    return null;
  }
  return src;
}
function getOggAudioSource(audioElement) {
  let src = getAudioSource(audioElement);
  if (!src) return null;
  return src.replaceAll("-converted.mp3", "");
}

async function transcribe(audioSrc) {
  const url =
    "https://vmm33rvll7.execute-api.us-east-2.amazonaws.com/prod/transcribe";

  const response = await fetch(url, {
    method: "POST",
    body: audioSrc,
  });
  const result = await response.json();
  return result;
}

function createSpeechToTextButton(audioElement) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "softcom-audio-btn";
  button.textContent = "Transcrever";
  button.style.cssText = `
    width: 82%;
    margin-top: 7px;
    margin-bottom: 3px;
    padding: 10px 5px;
    border-radius: 26px;
    border: none;
    background: #3970fcff;
    color: #fff;
    font-size: 14px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
  `;

  button.addEventListener("click", async () => {
    const src = getOggAudioSource(audioElement);
    if (!src) {
      console.error("Áudio sem fonte identificada.");
      return;
    }
    button.disabled = true;
    button.textContent = "Transcrevendo...";
    const result = await transcribe(src);
    button.textContent = "Transcrição concluida";
    button.disabled = false;
    const italicText = document.createElement("i");
    italicText.style.cssText = `
    margin-top: 5px;
    margin-bottom: 5px;
    `;
    italicText.textContent = result;
    const downloadElement = button.nextElementSibling;
    downloadElement.textContent = "";
    downloadElement.appendChild(italicText);
  });

  return button;
}

let isAddingAudioButtons = false;

function addSpeechToTextButtons() {
  if (isAddingAudioButtons) return;

  const audioElements = document.querySelectorAll(
    'audio[controls]:not([data-softcom-audio-button-attached="true"])',
  );

  if (!audioElements.length) return;

  isAddingAudioButtons = true;
  console.log(
    `Encontrados ${audioElements.length} elementos de áudio com controles sem botão na página.`,
  );

  audioElements.forEach((audioElement) => {
    const button = createSpeechToTextButton(audioElement);
    const audioGrandParent = audioElement.parentElement.parentElement;
    audioGrandParent.insertBefore(button, audioGrandParent.children[3]);
    audioElement.dataset.softcomAudioButtonAttached = "true";
  });

  isAddingAudioButtons = false;
}

function initAudioElementsObserver() {
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", addSpeechToTextButtons, {
      once: true,
    });
  } else {
    addSpeechToTextButtons();
  }

  const observer = new MutationObserver((mutations) => {
    if (isAddingAudioButtons) return;
    const hasNewAudio = mutations.some((mutation) =>
      Array.from(mutation.addedNodes || []).some(
        (node) =>
          node.nodeType === Node.ELEMENT_NODE &&
          (node.matches?.("audio[controls]") ||
            node.querySelector?.("audio[controls]")),
      ),
    );
    if (!hasNewAudio) return;
    addSpeechToTextButtons();
  });

  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
  });
}

btnOcorrencia.addEventListener("click", () => {
  const currentClientInfo = captureCurrentClientInfo();
  if (currentClientInfo.code === "") {
    btnOcorrencia.href = `${AREA_PARTNER_BASE_URL}cliente/index?&nome_cliente=${currentClientInfo.name}`;
    alert("Código do cliente não encontrado. Insira o código nas observações.");
    return;
  }
  btnOcorrencia.href = `${AREA_PARTNER_BASE_URL}agenda/form/id/${
    currentClientInfo.code
  }?name=${encodeURIComponent(
    currentClientInfo.name,
  )}&phone=${encodeURIComponent(currentClientInfo.phone)}&assunto=TEC REMOTO`;
});

btnOCFinalizada.addEventListener("click", () => {
  const currentClientInfo = captureCurrentClientInfo();
  const { arrivalTime, departureTime } = captureArrivalAndDepartureTime();
  if (currentClientInfo.code === "") {
    btnOCFinalizada.href = `${AREA_PARTNER_BASE_URL}cliente/index?&nome_cliente=${currentClientInfo.name}`;
    alert("Código do cliente não encontrado. Insira o código nas observações.");
    return;
  }
  btnOCFinalizada.href = `${AREA_PARTNER_BASE_URL}agenda/form/id/${
    currentClientInfo.code
  }?name=${encodeURIComponent(
    currentClientInfo.name,
  )}&phone=${encodeURIComponent(
    currentClientInfo.phone,
  )}&assunto=TEC REMOTO&arrivalTime=${encodeURIComponent(
    arrivalTime || "",
  )}&departureTime=${encodeURIComponent(departureTime || "")}`;
});

btnVerCliente.addEventListener("click", () => {
  const currentClientInfo = captureCurrentClientInfo();
  if (currentClientInfo.code === "") {
    btnVerCliente.href = `${AREA_PARTNER_BASE_URL}cliente/index?&nome_cliente=${currentClientInfo.name}`;
    alert("Código do cliente não encontrado. Insira o código nas observações.");
    return;
  }
  const url = `${AREA_PARTNER_BASE_URL}cliente/index/detail/id/${currentClientInfo.code}`;
  btnVerCliente.href = url;
});

btnVerProspectado.addEventListener("click", () => {
  const currentClientInfo = captureCurrentClientInfo();
  if (currentClientInfo.code === "") {
    btnVerProspectado.href = `${AREA_PARTNER_BASE_URL}comercial/prospectado?&nome_do_cliente=${currentClientInfo.name}`;
    alert(
      "Código do prospectado não encontrado. Insira o código nas observações.",
    );
    return;
  }
  const url = `${AREA_PARTNER_BASE_URL}comercial/prospectado/form/table/prospectado/id/${currentClientInfo.code}`;
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
    } else if (request.action === "updateButtonVisibility") {
      const { buttonId, isEnabled } = request;

      // Mapear buttonId para a chave de preferência
      const prefKeyMap = {
        btnOcorrencia: "toggle-btn-ocorrencia",
        btnOCFinalizada: "toggle-btn-ocorrencia-finalizada",
        btnVerCliente: "toggle-btn-ver-cliente",
        btnVerProspectado: "toggle-btn-ver-prospectado",
      };

      const prefKey = prefKeyMap[buttonId];
      if (prefKey) {
        // Atualizar cache localmente
        buttonPreferences[prefKey] = isEnabled;
        // Atualizar HTML instantaneamente
        injectIntoHeader();
      }
      sendResponse({ success: true });
    } else if (request.action === "updateAreaPartnerUrl") {
      const { useAlternative } = request;
      AREA_PARTNER_BASE_URL = useAlternative
        ? AREA_PARTNER_URL_ALTERNATIVE
        : AREA_PARTNER_URL_PRODUCTION;
      iconImg.href = AREA_PARTNER_BASE_URL;
      sendResponse({ success: true, url: AREA_PARTNER_BASE_URL });
    }
    sendResponse({ success: true });
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

function init() {
  function run() {
    applyStyleMode();
    loadButtonPreferences();
    observeDarkModeChanges();
    initAudioElementsObserver();
  }
  // Executa quando o DOM estiver pronto
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", run, { once: true });
  } else run();
}
init();
