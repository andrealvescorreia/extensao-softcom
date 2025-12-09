const searchButton = document.getElementById("searchButton");
const searchButtonFullName = document.getElementById("searchButtonFullName");
const sped = document.getElementById("sped");
const apoio = document.getElementById("apoio");

function searchNameOnAreaPartner(clientName) {
  const url = `https://areapartner.softcomsistemas.com.br/cliente/index?&nome_cliente=${clientName}`;

  chrome.tabs.create({ url: url });
}

function handleSearch(action) {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (!tabs[0]) return;
    // Verificar se está na página de chat
    if (!tabs[0].url.includes("chat.clientesatisfeito.com.br")) {
      alert("Disponivel apenas na pagina chat.clientesatisfeito.com.br");
      return;
    }

    // Enviar mensagem ao content script da aba ativa
    chrome.tabs.sendMessage(tabs[0].id, { action }, (response) => {
      if (chrome.runtime.lastError) {
        console.log("Erro ao enviar mensagem:", chrome.runtime.lastError);
        alert("Erro ao enviar mensagem. Tente recarregar a pagina.");
        return;
      }
      searchNameOnAreaPartner(response.clientName);
    });
  });
}

searchButton.addEventListener("click", () => {
  handleSearch("searchButtonClicked");
});

searchButtonFullName.addEventListener("click", () => {
  handleSearch("searchButtonFullNameClicked");
});

sped.addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (!tabs[0]) return;
    // Verificar se está na página da area partner
    if (!tabs[0].url.includes("areapartner.softcomsistemas.com.br/")) {
      alert("Disponivel apenas na pagina areapartner.softcomsistemas.com.br/");
      return;
    }

    // Enviar mensagem ao content script da aba ativa
    chrome.tabs.sendMessage(tabs[0].id, { action: "sped" }, (response) => {
      if (chrome.runtime.lastError) {
        console.log("Erro ao enviar mensagem:", chrome.runtime.lastError);
        alert("Erro ao enviar mensagem. Tente recarregar a pagina.");
        return;
      }
      console.log(response);
    });
  });
});

apoio.addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (!tabs[0]) return;
    // Verificar se está na página da area partner
    if (!tabs[0].url.includes("areapartner.softcomsistemas.com.br/")) {
      alert("Disponivel apenas na pagina areapartner.softcomsistemas.com.br/");
      return;
    }

    // Enviar mensagem ao content script da aba ativa
    chrome.tabs.sendMessage(tabs[0].id, { action: "apoio" }, (response) => {
      if (chrome.runtime.lastError) {
        console.log("Erro ao enviar mensagem:", chrome.runtime.lastError);
        alert("Erro ao enviar mensagem. Tente recarregar a pagina.");
        return;
      }
      console.log(response);
    });
  });
});
