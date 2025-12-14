// AREA PARTNER

function changeSelectedOption(selectElement, optionText) {
  const option = Array.from(selectElement.options).find(
    (opt) => opt.text === optionText
  );
  selectElement.selectedIndex = option.index;

  // Disparar evento 'change' para o Select detectar a mudança
  selectElement.dispatchEvent(new Event("change", { bubbles: true }));
}

// Escutar cliques dos botões vindos do popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  try {
    const selectSupport = document.getElementById(
      areaPartnerHTMLIdentifiers.suporteId
    );
    const selectSubject = document.getElementById(
      areaPartnerHTMLIdentifiers.assuntoId
    );
    const selectUser = document.getElementById(
      areaPartnerHTMLIdentifiers.userId
    );
    const textareaReason = document.getElementsByName(
      areaPartnerHTMLIdentifiers.motivoName
    )[0];
    const textAreaSolicitante = document.getElementsByName(
      areaPartnerHTMLIdentifiers.solicitanteName
    )[0];
    const textAreaDDD = document.getElementsByName(
      areaPartnerHTMLIdentifiers.dddName
    )[0];
    const textAreaFone = document.getElementsByName(
      areaPartnerHTMLIdentifiers.foneName
    )[0];
    const urgenteSwitch = getElementByXPath(
      areaPartnerHTMLIdentifiers.urgenteXPath
    );
    if (
      !selectSupport ||
      !selectSubject ||
      !selectUser ||
      !textareaReason ||
      !urgenteSwitch ||
      !textAreaSolicitante ||
      !textAreaDDD ||
      !textAreaFone
    ) {
      throw new Error("Elemento html não encontrado.");
    }
    getCurrentClientInfo((clientInfo) => {
      textAreaSolicitante.value = clientInfo.name;
      const ddd = clientInfo.phone.slice(2, 4);
      textAreaDDD.value = ddd;
      const fone = clientInfo.phone.slice(4);
      textAreaFone.value = fone;
    });
    if (request.action === "sped") {
      textareaReason.value = "gerar SPED.";
      changeSelectedOption(selectSupport, "Partner");
      changeSelectedOption(selectSubject, "TEC SPED");
      changeSelectedOption(selectUser, "[selecione]");
    }
    if (request.action === "apoio") {
      textareaReason.value =
        "DEMANDA ENCAMINHADA PARA A MATRIZ POIS ESTAMOS COM A EQUIPE TÉC. REDUZDA E SEM O TEC. INTERNO NO MOMENTO.";

      changeSelectedOption(selectSupport, "Apoio Tecnico");
      changeSelectedOption(selectSubject, "APOIO");
      changeSelectedOption(selectUser, "[selecione]");
      !urgenteSwitch.checked ? urgenteSwitch.click() : null;
    }
  } catch (error) {
    console.error("[Content2] Erro ao processar ação:", error);
    sendResponse({
      success: false,
      message: "Erro ao processar ação",
      error: error.message,
    });
  }

  return true;
});
