// CLIENTE SATISFEITO
const clientNameXPath = "//*[@id='InfoCabecalhoChat']/div[1]";

// Escutar cliques dos botões vindos do popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  try {
    const chatClientNameElement = getElementByXPath(clientNameXPath);
    if (!chatClientNameElement) {
      throw new Error("Elemento do nome do cliente não encontrado.");
    }
    let chatClientName = chatClientNameElement.innerText;

    if (request.action === "searchButtonClicked") {
      const nameParts = chatClientName.split(" ");
      nameParts.shift();
      if (nameParts[0] === "-") nameParts.shift();
      chatClientName = nameParts.join(" ");

      sendResponse({
        success: true,
        message: "Ação processada no content1.js",
        clientName: chatClientName,
      });
    } else if (request.action === "searchButtonFullNameClicked") {
      sendResponse({
        success: true,
        message: "Ação processada no content1.js",
        clientName: chatClientName,
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
