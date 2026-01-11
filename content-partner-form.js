// AREA PARTNER FORMULARIO DE OCORRÊNCIA

// Helper para buscar elemento por name ignorando maiúsculas/minúsculas
function getElementByNameIgnoreCase(name) {
  const allElements = document.querySelectorAll("[name]");
  return Array.from(allElements).find(
    (el) => el.getAttribute("name").toLowerCase() === name.toLowerCase()
  );
}

function changeSelectedOption(selectElement, optionText) {
  const option = Array.from(selectElement.options).find(
    (opt) => opt.text === optionText
  );
  selectElement.selectedIndex = option.index;

  // Disparar evento 'change' para o Select detectar a mudança
  selectElement.dispatchEvent(new Event("change", { bubbles: true }));
}

function solicitanteInfoFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const clientName = decodeURIComponent(params.get("name"));
  if (clientName !== "null" && clientName) {
    const textAreaSolicitante = getElementByNameIgnoreCase(
      areaPartnerHTMLSelectors.solicitanteName
    );
    if (textAreaSolicitante) {
      textAreaSolicitante.value = clientName;
    } else {
      console.error("Nome do solicitante: elemento HTML não encontrado.");
    }
  }

  const phone = decodeURIComponent(params.get("phone"));
  if (phone !== "null" && phone) {
    const textAreaDDD = getElementByNameIgnoreCase(
      areaPartnerHTMLSelectors.dddName
    );
    const textAreaFone = getElementByNameIgnoreCase(
      areaPartnerHTMLSelectors.foneName
    );
    if (textAreaDDD && textAreaFone) {
      const ddd = phone.slice(2, 4);
      textAreaDDD.value = ddd;
      const fone = phone.slice(4);
      textAreaFone.value = fone;
    } else {
      console.error("Telefone: elemento HTML não encontrado.");
    }
  }

  const selected = decodeURIComponent(params.get("assunto"));
  if (selected !== "null" && selected) {
    console.log("reuw");
    const selectSubject = document.getElementById(
      areaPartnerHTMLSelectors.assuntoId
    );
    if (selectSubject) {
      changeSelectedOption(selectSubject, selected.trim());
    } else {
      console.error("Assunto: elemento HTML não encontrado.");
    }
  }

  const arrivalTime = decodeURIComponent(params.get("arrivalTime"));
  if (arrivalTime !== "null" && arrivalTime) {
    const textAreaHoraChegada = getElementByNameIgnoreCase(
      areaPartnerHTMLSelectors.horaChegadaName
    );
    if (textAreaHoraChegada) {
      textAreaHoraChegada.value = arrivalTime;
    } else {
      console.error("Hora de chegada: elemento HTML não encontrado.");
    }
  }

  const departureTime = decodeURIComponent(params.get("departureTime"));
  if (departureTime !== "null" && departureTime) {
    const textAreaHoraSaida = getElementByNameIgnoreCase(
      areaPartnerHTMLSelectors.horaSaidaName
    );
    if (textAreaHoraSaida) {
      textAreaHoraSaida.value = departureTime;
    } else {
      console.error("Hora de saída: elemento HTML não encontrado.");
    }
  }
}
solicitanteInfoFromUrl();

function applyPredefinition(pred) {
  try {
    const selectors = areaPartnerHTMLSelectors;
    const elements = {
      support: document.getElementById(selectors.suporteId),
      subject: document.getElementById(selectors.assuntoId),
      user: document.getElementById(selectors.usuarioPartnerId),
      reason: getElementByNameIgnoreCase(selectors.motivoName),
      urgent: getElementByXPath(selectors.urgenteXPath),
      is: getElementByXPath(selectors.IsXPath),
      workDone:
        getElementByNameIgnoreCase(selectors.servicoRealizadoName) ||
        getElementByNameIgnoreCase(selectors.alternativeServicoRealizadoName),
      module: getElementByNameIgnoreCase(selectors.moduloName),
      example: getElementByNameIgnoreCase(selectors.exemploName),
    };
    if (
      pred.motivo !== undefined &&
      elements.reason &&
      elements.reason.value !== pred.motivo
    ) {
      const shouldOverwrite =
        !elements.reason.value ||
        confirm(
          "Isso irá sobrescrever o texto já existente em 'Motivo'. Deseja continuar?"
        );
      if (shouldOverwrite) {
        elements.reason.value = pred.motivo;
      }
    }
    if (pred.suporte !== undefined && elements.support)
      changeSelectedOption(elements.support, pred.suporte);
    if (pred.assunto !== undefined && elements.subject)
      changeSelectedOption(elements.subject, pred.assunto);
    if (pred.usuarioPartner !== undefined && elements.user)
      changeSelectedOption(elements.user, pred.usuarioPartner);
    if (
      pred.urgente !== undefined &&
      elements.urgent &&
      pred.urgente !== elements.urgent.checked
    )
      elements.urgent.click();
    if (pred.is !== undefined && elements.is && pred.is !== elements.is.checked)
      elements.is.click();
    if (
      pred.servicoRealizado !== undefined &&
      elements.workDone &&
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
    if (pred.modulo !== undefined && elements.module)
      elements.module.value = pred.modulo;
    if (pred.exemplo !== undefined && elements.example)
      elements.example.value = pred.exemplo;
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

function createPredefinitionsElement() {
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
  return newElement;
}

const predefinitionsElements = createPredefinitionsElement();
if (accordion) {
  accordion.appendChild(predefinitionsElements);
} else {
  const sibling = document.querySelectorAll(".panel")[1];
  sibling.parentNode.insertBefore(predefinitionsElements, sibling);
}
