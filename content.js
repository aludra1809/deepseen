if (typeof chrome !== "undefined" && chrome.storage) {
	function applySavedColors() {
		chrome.storage.local.get(
			[
				"selectedBgColor",
				"selectedGptTextColor",
				"isOn",
			],
			(data) => {
				if (chrome.runtime.lastError) {
					console.error(
						"Error retrieving colors:",
						chrome.runtime.lastError
					);
					return;
				}

				if (data.isOn) {
					changeYourDialogueColors(data.selectedBgColor);
					changeGptTextColor(data.selectedGptTextColor);
				} else {
					revertToDefaultColors();
				}
			}
		);
	}

	function changeYourDialogueColors(bgColor) {
		const bgElements = document.getElementsByClassName("fbb737a4");
		for (let i = 0; i < bgElements.length; i++) {
			bgElements[i].style.backgroundColor = bgColor || "";
		}
	}

	function changeGptTextColor(gptTextColor) {
		const gptTextElements = document.getElementsByClassName("f9bf7997");
		for (let i = 0; i < gptTextElements.length; i++) {
			gptTextElements[i].style.backgroundColor = gptTextColor || "";
		}
	}

	function revertToDefaultColors() {
		// Revert to the default colors provided by the web server
		const bgElements = document.getElementsByClassName("fbb737a4");
		for (let i = 0; i < bgElements.length; i++) {
			bgElements[i].style.backgroundColor = "";
		}

		const gptTextElements = document.getElementsByClassName("f9bf7997");
		for (let i = 0; i < gptTextElements.length; i++) {
			gptTextElements[i].style.backgroundColor = "";
		}
	}

	function applyDefaultColors() {
		const defaultUserBgColor = "rgb(84, 93, 39)";
		const defaultGptBgColor = "rgb(42, 61, 71)";

		// Save default colors to storage
		chrome.storage.local.set({
			selectedBgColor: defaultUserBgColor,
			selectedGptTextColor: defaultGptBgColor,
			isOn: true, // Ensure the toggle is "on" after applying defaults
		});

		// Apply default colors to user part
		const userBgElements = document.getElementsByClassName("fbb737a4");
		for (let i = 0; i < userBgElements.length; i++) {
			userBgElements[i].style.backgroundColor = defaultUserBgColor;
		}

		// Apply default colors to GPT part
		const gptBgElements = document.getElementsByClassName("f9bf7997");
		for (let i = 0; i < gptBgElements.length; i++) {
			gptBgElements[i].style.backgroundColor = defaultGptBgColor;
		}
	}

	// Listen for messages to update colors
	chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
		if (message.action === "changeColors") {
			changeYourDialogueColors(message.bgColor);
			changeGptTextColor(message.gptTextColor);
		} else if (message.action === "defaultColors") {
			applyDefaultColors();
		} else if (message.action === "toggleColors") {
			if (message.isOn) {
				changeYourDialogueColors(message.bgColor);
				changeGptTextColor(message.gptTextColor);
			} else {
				revertToDefaultColors();
			}
		}
	});

	// Observe new chat messages and apply colors
	const observer = new MutationObserver(() => {
		applySavedColors();
	});

	observer.observe(document.body, { childList: true, subtree: true });
} else {
	console.error("chrome.storage is not available in this context.");
}