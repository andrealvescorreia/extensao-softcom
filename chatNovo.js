const chatAntigoController = new ChatClientController({
  headerIdentifier: {
    type: SelectorType.XPATH,
    identifier: '//*[@id="q-app"]/div/header/div/div/div[1]',
  },
  clientNameIdentifier: {
    type: SelectorType.XPATH,
    identifier:
      '//*[@id="fullscreen-content"]/div/div[1]/div/div/div[1]/div[2]/div[1]',
  },
  clientPhoneIdentifier: {
    type: SelectorType.XPATH,
    identifier:
      '//*[@id="fullscreen-content"]/div/div[1]/div/div/div[1]/div[2]/div[2]/div',
  },
  clientObservationsIdentifier: {
    type: SelectorType.ARIALABEL,
    identifier: "Observações",
  },
  darkModeClass: "body--dark",
});

chatAntigoController.init();
