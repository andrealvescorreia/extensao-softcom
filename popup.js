const searchButton = document.getElementById("searchButton");
const searchButtonFullName = document.getElementById("searchButtonFullName");

const clienteSatisfeitoSection = document.getElementById(
  "cliente-satisfeito-section"
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
  const url = `https://areapartner.softcomsistemas.com.br/cliente/index?&nome_cliente=${clientName}`;

  chrome.tabs.create({ url: url });
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
