const ocorrenciaPredefinitions = [
  {
    name: "Gerar SPED",
    usuarioPartner: "(usuario_atual)",
    suporte: "Partner",
    faq: "4417",
    assunto: "TEC SPED",
    motivo: "Gerar SPED.",
    urgente: false,
    group: "Fiscal",
  },
  {
    name: "SPED Gerado",
    servicoRealizado: "SPED gerado e enviado a contabilidade.",
    usuarioPartner: "(usuario_atual)",
    group: "Fiscal",
  },

  {
    name: "SOFTCOMSHOP: Treinamento/Dúvida",
    faq: "8182",
    assunto: "TEC REMOTO",
    group: "Softcomshop",
  },
  {
    name: "INTERMITENCIA SOFTCOMSHOP",
    faq: "7529",
    assunto: "TEC REMOTO",
    group: "Softcomshop",
  },

  {
    name: "Softshop: Dúvida/treinamento",
    faq: "7777",
    assunto: "TEC REMOTO",
    group: "Softshop",
  },
  {
    name: "Softshop Não Abre",
    faq: "316",
    assunto: "TEC REMOTO",
    urgente: true,
    group: "Softshop",
  },
  {
    name: "Softshop: Instalação",
    faq: "8187",
    assunto: "TEC INSTALAÇÃO",
    group: "Softshop",
  },
  {
    name: "Softshop: Correções",
    faq: "3665",
    assunto: "TEC REMOTO",
    group: "Softshop",
  },
  {
    name: "Mudança RFC",
    faq: "3510",
    assunto: "TEC REMOTO",
    group: "Softshop",
  },

  {
    name: "PDV Parado",
    faq: "6337",
    assunto: "TEC REMOTO",
    group: "PDV",
    is: true,
  },
  {
    name: "PDV: Configurações",
    faq: "8017",
    assunto: "TEC REMOTO",
    group: "PDV",
  },
  {
    name: "PDV: NFCe pendente",
    faq: "3886",
    assunto: "TEC REMOTO",
    group: "PDV",
  },
  {
    name: "PDV: Dúvidas",
    faq: "4772",
    assunto: "TEC REMOTO",
    group: "PDV",
  },
  {
    name: "PIX > ANALISE",
    faq: "8031",
    assunto: "TEC REMOTO",
    group: "PDV",
  },
  {
    name: "TEF",
    faq: "3993",
    assunto: "TEC REMOTO",
    group: "PDV",
  },

  {
    name: "NFe: Atendimento",
    faq: "4416",
    assunto: "TEC REMOTO",
    group: "Fiscal",
  },
  {
    name: "Inutilizar numeração NFe",
    faq: "5890",
    assunto: "TEC REMOTO",
    group: "Fiscal",
  },
  {
    name: "MDFe: Atendimento",
    faq: "4415",
    assunto: "TEC REMOTO",
    group: "Fiscal",
  },

  {
    name: "SMART/Comanda",
    faq: "7844",
    group: "Módulos Softcom",
  },
  {
    name: "Meu Carrinho: Análise/Treinamento",
    faq: "7816",
    group: "Módulos Softcom",
  },
  {
    name: "Atendente BOT",
    faq: "7894",
    group: "Módulos Softcom",
  },
  {
    name: "Drica IA: Implantação",
    faq: "7766",
    group: "Módulos Softcom",
  },
  {
    name: "Venda Mais: Implantação",
    faq: "8216",
    group: "Módulos Softcom",
  },
  {
    name: "Quero Bônus: Implantação",
    faq: "8204",
    group: "Módulos Softcom",
  },

  {
    name: "Instalação Etiquetadora",
    faq: "8001",
    assunto: "TEC REMOTO",
    group: "Impressora",
  },
  {
    name: "Instalação Impressora",
    faq: "1035",
    assunto: "TEC REMOTO",
    group: "Impressora",
  },

  {
    name: "Atualização Certificado",
    usuarioPartner: "(usuario_atual)",
    suporte: "Partner",
    assunto: "TEC REMOTO",
    faq: "302",
    servicoRealizado:
      "Certificado digital atualizado e configurado no sistema.",
    group: "Outros",
  },

  {
    name: "OC duplicada",
    faq: "4709",
    group: "Outros",
  },
  {
    name: "Apoio Matriz",
    usuarioPartner: "[selecione]",
    suporte: "Apoio Tecnico",
    assunto: "APOIO",
    servicoRealizado: "",
    group: "Outros",
  },

  // exemplo com todos os campos preenchidos
  /*{
    name: "MODELO",
    usuarioPartner: "[selecione]",
    suporte: "Partner",
    assunto: "COBRAR",
    faq: '4417',
    motivo: "TESTE",
    modulo: "tef",
    exemplo: "ex",
    servicoRealizado: "FEITO",
    urgente: true,
    is: true,
    group: "Miscelânea",
  },*/
];
