const clienteSatisfeitoHTMLSelectors = {
  headerXPath: "//*[@id='q-app']/div/div/div/div/div/header/div",
  clientNameXPath: "//*[@id='InfoCabecalhoChat']/div[1]",
  clientPhoneXPath:
    "//*[@id='q-app']/div/div/div/div/div/div[3]/aside/div/div[1]/div[2]/div/div/div/div[1]/div/div/div[1]/div/div[2]/div[2]/span[1]",
  clientObservacoesAriaLabel: "Observações",
  sentMessageClass: ".q-message-text-content--sent",
};

const areaPartnerHTMLSelectors = {
  // NAV ELEMENTS
  userNameClass: ".user-name",

  // FORM FIELDS
  accordionId: "accordion",
  solicitanteName: "Solicitante",
  dddName: "txtDDDContato",
  foneName: "txtFoneContato",
  suporteId: "suportes",
  assuntoId: "assunto",
  usuarioPartnerId: "usuario_partner_id",
  motivoName: "motivo",
  moduloName: "modulo",
  exemploName: "exemplo",
  horaChegadaName: "HoraChegada",
  horaSaidaName: "HoraSaida",
  servicoRealizadoName: "ServiçoRealizado",
  alternativeServicoRealizadoName: "servico_realizado",
  urgenteXPath: '//*[@id="filter"]/div[2]/div/form/div[18]/input',
  IsXPath: "//*[@id='filter']/div[2]/div/form/div[19]/input",

  // CLIENT INFO
  cnpjName: "cnpj",
  identificacaoLiXPath: "/html/body/div[1]/main/div[2]/div[2]/ul/li[1]",
};
