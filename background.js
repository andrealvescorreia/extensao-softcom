chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.sync.set({ enabled: true });
  console.log("Extensão instalada. Ativada por padrão.");
});
