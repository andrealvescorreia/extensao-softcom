const chatAntigoController = new ChatClientController(
  {
    type: SelectorType.XPATH,
    identifier: '//*[@id="q-app"]/div/div/div/div/div/header/div',
  },
  {
    type: SelectorType.XPATH,
    identifier: "//*[@id='InfoCabecalhoChat']/div[1]",
  },
  {
    type: SelectorType.XPATH,
    identifier:
      "//*[@id='q-app']/div/div/div/div/div/div[3]/aside/div/div[1]/div[2]/div/div/div/div[1]/div/div/div[1]/div/div[2]/div[2]/span[1]",
  },
  {
    type: SelectorType.ARIALABEL,
    identifier: "Observações",
  },
  "body--dark",
);
