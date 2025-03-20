function listener(details) {
	return { requestHeaders: details.requestHeaders.filter(header => header.name.toLowerCase() !== "referer") };
}

function quit() {
	browser.action.setTitle({ title: "Dereferer, NOT Working" });
	browser.action.setIcon({ path: "icons/deref-notworking-64.png" });
	browser.webRequest.onBeforeSendHeaders.removeListener(listener);
}

function start() {
	browser.action.setTitle({ title: "Dereferer" });
	browser.action.setIcon({ path: "icons/deref-working-64.png" });
	browser.webRequest.onBeforeSendHeaders.addListener(
		listener,
		{ urls: ["http://*/*", "https://*/*"] },
		["blocking", "requestHeaders"]
	);
}

browser.action.onClicked.addListener(tab => {
	browser.webRequest.onBeforeSendHeaders.hasListener(listener) ? quit() : start();
});

start();
