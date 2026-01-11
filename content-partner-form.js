// AREA PARTNER FORMULARIO DE OCORRÊNCIA

function changeSelectedOption(selectElement, optionText) {
  const option = Array.from(selectElement.options).find(
    (opt) => opt.text === optionText
  );
  selectElement.selectedIndex = option.index;

  // Disparar evento 'change' para o Select detectar a mudança
  selectElement.dispatchEvent(new Event("change", { bubbles: true }));
}

function solicitanteInfoFromUrl() {
  const textAreaSolicitante = document.getElementsByName(
    areaPartnerHTMLSelectors.solicitanteName
  )[0];
  if (!textAreaSolicitante) {
    alert("Nome do solicitante: elemento HTML não encontrado.");
    return;
  }
  const textAreaDDD = document.getElementsByName(
    areaPartnerHTMLSelectors.dddName
  )[0];
  if (!textAreaDDD) {
    alert("DDD: elemento HTML não encontrado.");
    return;
  }
  const textAreaFone = document.getElementsByName(
    areaPartnerHTMLSelectors.foneName
  )[0];
  if (!textAreaFone) {
    alert("Fone: elemento HTML não encontrado.");
    return;
  }
  const textAreaHoraChegada = document.getElementsByName(
    areaPartnerHTMLSelectors.horaChegadaName
  )[0];
  if (!textAreaHoraChegada) {
    alert("Hora de chegada: elemento HTML não encontrado.");
    return;
  }
  const textAreaHoraSaida = document.getElementsByName(
    areaPartnerHTMLSelectors.horaSaidaName
  )[0];
  if (!textAreaHoraSaida) {
    alert("Hora de saída: elemento HTML não encontrado.");
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const clientName = params.get("name");
  textAreaSolicitante.value = clientName ? decodeURIComponent(clientName) : "";
  const phone = params.get("phone")
    ? decodeURIComponent(params.get("phone"))
    : "";
  const ddd = phone.slice(2, 4);
  textAreaDDD.value = ddd;
  const fone = phone.slice(4);
  textAreaFone.value = fone;
  const selectSubject = document.getElementById(
    areaPartnerHTMLSelectors.assuntoId
  );
  if (selectSubject) {
    const selected = decodeURIComponent(params.get("assunto"));
    changeSelectedOption(selectSubject, selected.trim());
  }
  textAreaHoraChegada.value = params.get("arrivalTime")
    ? decodeURIComponent(params.get("arrivalTime"))
    : "";
  textAreaHoraSaida.value = params.get("departureTime")
    ? decodeURIComponent(params.get("departureTime"))
    : "";
}
solicitanteInfoFromUrl();

function applyPredefinition(pred) {
  try {
    const selectors = areaPartnerHTMLSelectors;
    const elements = {
      support: document.getElementById(selectors.suporteId),
      subject: document.getElementById(selectors.assuntoId),
      user: document.getElementById(selectors.usuarioPartnerId),
      reason: document.getElementsByName(selectors.motivoName)[0],
      urgent: getElementByXPath(selectors.urgenteXPath),
      is: getElementByXPath(selectors.IsXPath),
      workDone: document.getElementsByName(selectors.servicoRealizadoName)[0],
      module: document.getElementsByName(selectors.moduloName)[0],
      example: document.getElementsByName(selectors.exemploName)[0],
    };

    if (
      !elements.support ||
      !elements.subject ||
      !elements.user ||
      !elements.reason ||
      !elements.urgent ||
      !elements.is ||
      !elements.workDone
    ) {
      throw new Error("Elemento html não encontrado.");
    }

    if (pred.motivo !== undefined && elements.reason.value !== pred.motivo) {
      const shouldOverwrite =
        !elements.reason.value ||
        confirm(
          "Isso irá sobrescrever o texto já existente em 'Motivo'. Deseja continuar?"
        );
      if (shouldOverwrite) {
        elements.reason.value = pred.motivo;
      }
    }
    if (pred.suporte !== undefined)
      changeSelectedOption(elements.support, pred.suporte);
    if (pred.assunto !== undefined)
      changeSelectedOption(elements.subject, pred.assunto);
    if (pred.usuarioPartner !== undefined)
      changeSelectedOption(elements.user, pred.usuarioPartner);
    if (pred.urgente !== undefined && pred.urgente !== elements.urgent.checked)
      elements.urgent.click();
    if (pred.is !== undefined && pred.is !== elements.is.checked)
      elements.is.click();
    if (
      pred.servicoRealizado !== undefined &&
      elements.workDone.value !== pred.servicoRealizado
    ) {
      const shouldOverwrite =
        !elements.workDone.value ||
        confirm(
          "Isso irá sobrescrever o texto já existente em 'Serviço Realizado'. Deseja continuar?"
        );
      if (shouldOverwrite) {
        elements.workDone.value = pred.servicoRealizado;
      }
    }
    if (pred.modulo !== undefined) elements.module.value = pred.modulo;
    if (pred.exemplo !== undefined) elements.example.value = pred.exemplo;
  } catch (error) {
    console.error(
      "[Content-Predefinições] Erro ao aplicar predefinição:",
      error
    );
    alert("Erro ao aplicar predefinição: " + error.message);
  }
}

let buttons = [];
ocorrenciaPredefinitions.forEach((pred) => {
  const btn = createButton(pred.name + "PredefinitionBtn", pred.name);
  btn.onclick = () => applyPredefinition(pred);
  buttons.push(btn);
});

const predefiniitonsContainer = document.createElement("div");
predefiniitonsContainer.class = "panel-body";
buttons.forEach((btn) => predefiniitonsContainer.appendChild(btn));

const accordion = document.getElementById(areaPartnerHTMLSelectors.accordionId);
if (accordion) {
  const newElement = document.createElement("div");
  newElement.className = "accordion-item";
  const collapseFour = document.createElement("div");
  collapseFour.id = "collapseFour";
  collapseFour.className = "panel-collapse collapse";
  collapseFour.setAttribute("role", "tabpanel");
  collapseFour.setAttribute("aria-labelledby", "headingFour");
  collapseFour.appendChild(predefiniitonsContainer);

  newElement.innerHTML = `
    
    <div class="panel panel-default">
      <div class="panel-heading" role="tab" id="headingFour">
      <a role="button" data-toggle="collapse" data-parent="#accordion" href="#collapseFour" aria-expanded="true" aria-controls="collapseFour">
        <h4 class="panel-title">Predefinições
          <img width="18" src="img/menu_down.png" align="right">
        </h4>
      </a>
      </div>
    </div>
  `;
  newElement.appendChild(collapseFour);
  accordion.appendChild(newElement);
}
