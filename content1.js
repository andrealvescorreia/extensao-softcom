// CLIENTE SATISFEITO
const clientNameXPath = "//*[@id='InfoCabecalhoChat']/div[1]";
const clientObservacoesAriaLabel = "Observações";

// Escutar cliques dos botões vindos do popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  try {
    const chatClientNameElement = getElementByXPath(clientNameXPath);
    const chatClientObservacoesElement = document.querySelector(
      `[aria-label="${clientObservacoesAriaLabel}"]`
    );
    if (!chatClientNameElement) {
      throw new Error("Elemento do nome do cliente não encontrado.");
    }
    if (!chatClientObservacoesElement) {
      throw new Error("Elemento das observações do cliente não encontrado.");
    }
    let chatClientName = chatClientNameElement.innerText;

    if (request.action === "searchButtonClicked") {
      const nameParts = chatClientName.split(" ");
      nameParts.shift();
      if (nameParts[0] === "-") nameParts.shift();
      chatClientName = nameParts.join(" ");

      sendResponse({
        success: true,
        clientName: chatClientName,
      });
    } else if (request.action === "searchButtonFullNameClicked") {
      sendResponse({
        success: true,
        clientName: chatClientName,
      });
    } else if (request.action === "buttonSearchByCodeClicked") {
      sendResponse({
        success: true,
        clientCode: chatClientObservacoesElement.value,
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
