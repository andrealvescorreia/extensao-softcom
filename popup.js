const searchButton = document.getElementById("searchButton");
const searchButtonFullName = document.getElementById("searchButtonFullName");

const clienteSatisfeitoSection = document.getElementById(
  "cliente-satisfeito-section",
);
const areaPartnerSection = document.getElementById("area-partner-section");

// Verificar URL atual e mostrar/ocultar seções
chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
  if (tabs[0]) {
    const currentUrl = tabs[0].url;

    // Mostrar seção Cliente Satisfeito apenas se estiver na página correta
    if (currentUrl.includes("chat.clientesatisfeito.com.br")) {
      clienteSatisfeitoSection.style.display = "block";
    } else {
      clienteSatisfeitoSection.style.display = "none";
    }

    // Mostrar seção Area Partner apenas se estiver na página correta
    if (currentUrl.includes("areapartner.softcomsistemas.com.br")) {
      areaPartnerSection.style.display = "block";
    } else {
      areaPartnerSection.style.display = "none";
    }
  }
});

function searchClientByNameOnAreaPartner(clientName) {
  chrome.storage.sync.get(["area-partner-use-alternative"], (result) => {
    const useAlternative = result["area-partner-use-alternative"] || false;
    const baseUrl = useAlternative
      ? AREA_PARTNER_URL_ALTERNATIVE
      : AREA_PARTNER_URL_PRODUCTION;
    const url = `${baseUrl}cliente/index?&nome_cliente=${clientName}`;

    chrome.tabs.create({ url: url });
  });
}

function handleAction(action, supportedUrl) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (!tabs[0]) return;
    // Verifica se está na página correta para a ação
    if (!tabs[0].url.includes(supportedUrl)) {
      alert("Disponivel apenas na pagina " + supportedUrl);
      return;
    }

    // Enviar mensagem ao content script da aba ativa
    chrome.tabs.sendMessage(tabs[0].id, { action }, (response) => {
      if (chrome.runtime.lastError) {
        console.log("Erro ao enviar mensagem:", chrome.runtime.lastError);
        alert("Erro ao enviar mensagem. Tente recarregar a pagina.");
        return;
      }
      if (
        action === "searchButtonClicked" ||
        action === "searchButtonFullNameClicked"
      ) {
        searchClientByNameOnAreaPartner(response.clientName);
      }
    });
  });
}

searchButton.addEventListener("click", () => {
  handleAction("searchButtonClicked", "chat.clientesatisfeito.com.br");
});

searchButtonFullName.addEventListener("click", () => {
  handleAction("searchButtonFullNameClicked", "chat.clientesatisfeito.com.br");
});

// Menu de opções de botões
const buttonToggles = {
  "toggle-btn-ocorrencia": "btnOcorrencia",
  "toggle-btn-ocorrencia-finalizada": "btnOCFinalizada",
  "toggle-btn-ver-cliente": "btnVerCliente",
  "toggle-btn-ver-prospectado": "btnVerProspectado",
};

// Restaurar estado dos toggles ao abrir popup
function restoreButtonToggleStates() {
  chrome.storage.sync.get(Object.keys(buttonToggles), (result) => {
    Object.keys(buttonToggles).forEach((toggleId) => {
      const checkbox = document.getElementById(toggleId);
      const isEnabled = result[toggleId] !== false; // Padrão: true
      checkbox.checked = isEnabled;
    });
  });
}

// Salvar estado e notificar content script
function setupButtonToggleListeners() {
  Object.keys(buttonToggles).forEach((toggleId) => {
    const checkbox = document.getElementById(toggleId);
    checkbox.addEventListener("change", () => {
      const buttonId = buttonToggles[toggleId];
      const isEnabled = checkbox.checked;

      // Salvar no chrome.storage.sync
      chrome.storage.sync.set({ [toggleId]: isEnabled });

      // Notificar o content script para atualizar a visibilidade
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0] && tabs[0].url.includes("chat.clientesatisfeito.com.br")) {
          chrome.tabs
            .sendMessage(tabs[0].id, {
              action: "updateButtonVisibility",
              buttonId: buttonId,
              isEnabled: isEnabled,
            })
            .catch(() => {
              // Silenciosamente ignora se a aba não tem o content script
            });
        }
      });
    });
  });
}

restoreButtonToggleStates();
setupButtonToggleListeners();

// Gerenciar URL da Area Partner
const AREA_PARTNER_URL_PRODUCTION =
  "https://areapartner.softcomsistemas.com.br";
const AREA_PARTNER_URL_ALTERNATIVE =
  "http://177.43.232.2:25123/area-partner/public";

const toggleAreaPartnerUrl = document.getElementById("toggle-area-partner-url");
const currentUrlDisplay = document.getElementById("current-url-display");

// Restaurar estado do toggle de URL
function restoreUrlToggleState() {
  chrome.storage.sync.get(["area-partner-use-alternative"], (result) => {
    const useAlternative = result["area-partner-use-alternative"] || false;
    toggleAreaPartnerUrl.checked = useAlternative;
    updateUrlDisplay(useAlternative);
  });
}

// Atualizar display da URL atual
function updateUrlDisplay(useAlternative) {
  const url = useAlternative
    ? AREA_PARTNER_URL_ALTERNATIVE
    : AREA_PARTNER_URL_PRODUCTION;
  currentUrlDisplay.textContent = `URL atual: ${url}`;
}

// Listener para mudanças no toggle
toggleAreaPartnerUrl.addEventListener("change", () => {
  const useAlternative = toggleAreaPartnerUrl.checked;

  // Salvar no storage
  chrome.storage.sync.set({ "area-partner-use-alternative": useAlternative });

  // Atualizar display
  updateUrlDisplay(useAlternative);

  // Notificar todos os content scripts ativos
  chrome.tabs.query({}, (tabs) => {
    tabs.forEach((tab) => {
      if (tab.url && tab.url.includes("chat.clientesatisfeito.com.br")) {
        chrome.tabs
          .sendMessage(tab.id, {
            action: "updateAreaPartnerUrl",
            useAlternative: useAlternative,
          })
          .catch(() => {
            // Ignora erros se a aba não tem content script
          });
      }
    });
  });
});

restoreUrlToggleState();

// Gerenciar toggle de mover painel ao topo
const toggleMovePanelToTop = document.getElementById(
  "toggle-move-panel-to-top",
);

// Restaurar estado do toggle
function restoreMovePanelToggleState() {
  chrome.storage.sync.get(["move-panel-to-top-enabled"], (result) => {
    const isEnabled =
      result["move-panel-to-top-enabled"] !== false &&
      result["move-panel-to-top-enabled"] !== undefined; // Padrão: false
    toggleMovePanelToTop.checked = isEnabled;
  });
}

// Listener para mudanças no toggle
toggleMovePanelToTop.addEventListener("change", () => {
  const isEnabled = toggleMovePanelToTop.checked;

  // Salvar no storage
  chrome.storage.sync.set({ "move-panel-to-top-enabled": isEnabled });

  // Notificar todos os content scripts ativos
  chrome.tabs.query({}, (tabs) => {
    tabs.forEach((tab) => {
      if (tab.url && tab.url.includes("areapartner.softcomsistemas.com.br")) {
        chrome.tabs
          .sendMessage(tab.id, {
            action: "toggleMovePanelToTop",
            isEnabled: isEnabled,
          })
          .catch(() => {
            // Ignora erros se a aba não tem content script
          });
      }
    });
  });
});

restoreMovePanelToggleState();

// Gerenciar toggle de poços largos
const toggleWidePanels = document.getElementById("toggle-wide-panels");

// Restaurar estado do toggle
function restoreWidePanelsToggleState() {
  chrome.storage.sync.get(["wide-panels-enabled"], (result) => {
    const isEnabled =
      result["wide-panels-enabled"] !== false &&
      result["wide-panels-enabled"] !== undefined; // Padrão: false
    toggleWidePanels.checked = isEnabled;
  });
}

// Listener para mudanças no toggle
toggleWidePanels.addEventListener("change", () => {
  const isEnabled = toggleWidePanels.checked;

  // Salvar no storage
  chrome.storage.sync.set({ "wide-panels-enabled": isEnabled });

  // Notificar todos os content scripts ativos
  chrome.tabs.query({}, (tabs) => {
    tabs.forEach((tab) => {
      if (tab.url && tab.url.includes("areapartner.softcomsistemas.com.br")) {
        chrome.tabs
          .sendMessage(tab.id, {
            action: "toggleWidePanels",
            isEnabled: isEnabled,
          })
          .catch(() => {
            // Ignora erros se a aba não tem content script
          });
      }
    });
  });
});

restoreWidePanelsToggleState();
