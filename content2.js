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
    const selectSupport = document.getElementById("suportes");
    const selectSubject = document.getElementById("assunto");
    const selectUser = document.getElementById("usuario_partner_id");
    const textareaReason = getElementByXPath(
      '//*[@id="filter"]/div[2]/div/form/div[7]/textarea'
    );
    if (!selectSupport || !selectSubject || !selectUser || !textareaReason) {
      throw new Error("Elemento html não encontrado.");
    }
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
