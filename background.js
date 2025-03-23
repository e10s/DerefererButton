"use strict";

const storageKey = "I am working";

/* Convenience functions */
function onError(error) {
	console.log(`Error: ${error}`);
}

function peekStorage() {
	browser.storage.local.get(storageKey).then(console.log, onError);
}
/* */

function listener(details) {
	return { requestHeaders: details.requestHeaders.filter(header => header.name.toLowerCase() !== "referer") };
}

function quitImpl() {
	browser.action.setTitle({ title: "Dereferer, NOT Working" });
	browser.action.setIcon({ path: "icons/deref-notworking-64.png" });

	browser.webRequest.onBeforeSendHeaders.removeListener(listener);
}

function startImpl() {
	browser.action.setTitle({ title: "Dereferer" });
	browser.action.setIcon({ path: "icons/deref-working-64.png" });

	browser.webRequest.onBeforeSendHeaders.addListener(
		listener,
		{ urls: ["http://*/*", "https://*/*"] },
		["blocking", "requestHeaders"]
	);
}

function quit() {
	console.debug("Quit");
	browser.storage.local.set({ [storageKey]: false }).then(quitImpl, onError);
}

function start() {
	console.debug("Start");
	browser.storage.local.set({ [storageKey]: true }).then(startImpl, onError);
}

browser.action.onClicked.addListener(tab => {
	function onGot(item) {
		if (item[storageKey]) {
			console.debug("Going to quit.");

			quit();
		}
		else {
			console.debug("Going to start.");

			start();
		}
	}

	console.debug("Button is clicked.");
	browser.storage.local.get(storageKey).then(onGot, onError);
});

function init() {
	function onGot(item) {
		if (storageKey in item) {
			console.debug("Storage is being used.");

			if (item[storageKey]) {
				start();
			}
			else {
				quit();
			}
		}
		else {
			console.debug("Storage is empty.");
			start();
		}
	}

	console.debug("Background script is called.");
	browser.storage.local.get(storageKey).then(onGot, onError);
}

init();