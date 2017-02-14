function listener(details) {
	return { requestHeaders: details.requestHeaders.filter(header => header.name.toLowerCase() !== "referer") };
}

function quit() {
	browser.browserAction.setTitle({ title: "Dereferer, NOT Working" });
	browser.browserAction.setIcon({ path: "icons/deref-notworking-64.png" });
	browser.webRequest.onBeforeSendHeaders.removeListener(listener);
}

function start() {
	browser.browserAction.setTitle({ title: "Dereferer" });
	browser.browserAction.setIcon({ path: "icons/deref-working-64.png" });
	browser.webRequest.onBeforeSendHeaders.addListener(
		listener,
		{ urls: ["http://*/*", "https://*/*"] },
		["blocking", "requestHeaders"]
	);
}

browser.browserAction.onClicked.addListener(tab => {
	browser.webRequest.onBeforeSendHeaders.hasListener(listener) ? quit() : start();
});

start();
