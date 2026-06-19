const SelectorType = Object.freeze({
  XPATH: "XPATH",
  ID: "ID",
  CLASSNAME: "CLASSNAME",
  ARIALABEL: "ARIALABEL",
});

class HTMLElementIdentifier {
  constructor(type, identifier) {
    this.type = type;
    this.identifier = identifier;
  }
}

function getHTMLElement(elIdentifier) {
  switch (elIdentifier.type) {
    case SelectorType.XPATH:
      return getElementByXPath(elIdentifier.identifier);
    case SelectorType.CLASSNAME:
      return document.querySelector("." + elIdentifier.identifier);
    case SelectorType.ID:
      return document.getElementById(elIdentifier.identifier);
    case SelectorType.ARIALABEL:
      return document.querySelector(
        `[aria-label="${elIdentifier.identifier}"]`,
      );
    default:
      return null;
  }
}

function getElementByXPath(path) {
  return document.evaluate(
    path,
    document,
    null,
    XPathResult.FIRST_ORDERED_NODE_TYPE,
    null,
  ).singleNodeValue;
}

/*
ex:
let header = new HTMLElementIdentifier(
  SelectorType.XPATH, 
  '//*[@id="q-app"]/div/div/div/div/div/header/div'
);
*/
