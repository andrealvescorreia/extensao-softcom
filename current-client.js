function setCurrentClientInfo({ name, code, phone }) {
  chrome.storage.local.set({ currentClientInfo: { name, code, phone } });
}

function getCurrentClientInfo(callback) {
  chrome.storage.local.get("currentClientInfo", (res) => {
    callback(res.currentClientInfo);
  });
}
