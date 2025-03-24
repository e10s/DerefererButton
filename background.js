"use strict";

const storageKey = "I am working";
const rulesetId = "ruleset";

/* Convenience functions */
function onError(error) {
	console.log(`Error: ${error}`);
}

function peekStorage() {
	browser.storage.local.get(storageKey).then(console.log, onError);
}
/* */

function setWorkingIcon() {
	console.debug("Set working icon");

	browser.action.setTitle({ title: "Dereferer" });
	browser.action.setIcon({ path: "icons/deref-working-64.png" });
}
function setNotWorkingIcon() {
	console.debug("Set not-working icon");

	browser.action.setTitle({ title: "Dereferer, NOT Working" });
	browser.action.setIcon({ path: "icons/deref-notworking-64.png" });
}

function start() {
	console.debug("Start");

	browser.declarativeNetRequest.updateEnabledRulesets({
		enableRulesetIds: [rulesetId]
	}).then(setWorkingIcon, onError);
	browser.storage.local.set({ [storageKey]: true }).then(() => { }, onError);
}

function quit() {
	console.debug("Quit");

	browser.declarativeNetRequest.updateEnabledRulesets({
		disableRulesetIds: [rulesetId]
	}).then(setNotWorkingIcon, onError);
	browser.storage.local.set({ [storageKey]: false }).then(() => { }, onError);
}

browser.action.onClicked.addListener(tab => {
	function onGot(item) {
		if (item[storageKey]) {
			quit();
		}
		else {
			start();
		}
	}

	console.debug("Clicked");
	browser.storage.local.get(storageKey).then(onGot, onError);
});

function syncImpl(item) {
	if (item[storageKey]) {
		start();
	}
	else {
		quit();
	}
}

function sync() {
	browser.storage.local.get(storageKey).then(syncImpl, onError);
}

browser.runtime.onInstalled.addListener(() => { console.debug("onInstalled"); sync(); });
browser.runtime.onStartup.addListener(() => { console.debug("onStartup"); sync(); });
sync();
