const chatAntigoController = new ChatClientController({
  headerIdentifier: {
    type: SelectorType.XPATH,
    identifier: '//*[@id="q-app"]/div/div/div/div/div/header/div/div[1]',
  },
  clientNameIdentifier: {
    type: SelectorType.XPATH,
    identifier: "//*[@id='InfoCabecalhoChat']/div[1]",
  },
  clientPhoneIdentifier: {
    type: SelectorType.XPATH,
    identifier:
      "//*[@id='q-app']/div/div/div/div/div/div[3]/aside/div/div[1]/div[2]/div/div/div/div[1]/div/div/div[1]/div/div[2]/div[2]/span[1]",
  },
  clientObservationsIdentifier: {
    type: SelectorType.ARIALABEL,
    identifier: "Observações",
  },
  darkModeClass: "body--dark",
});

chatAntigoController.init();
