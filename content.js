if (typeof chrome !== "undefined" && chrome.storage) {
	function applySavedColors() {
		chrome.storage.local.get(
			[
				"selectedBgColor",
				"yourDialogueColorsEnabled",
				"selectedTextColor",
				"gptTextColorsEnabled",
				"selectedGptTextColor",
			],
			(data) => {
				if (chrome.runtime.lastError) {
					console.error(
						"Error retrieving colors:",
						chrome.runtime.lastError
					);
					return;
				}

				changeYourDialogueColors(
					data.yourDialogueColorsEnabled ? data.selectedBgColor : "",
					data.yourDialogueColorsEnabled ? data.selectedTextColor : ""
				);

				changeGptTextColor(
					data.gptTextColorsEnabled ? data.selectedGptTextColor : ""
				);
			}
		);
	}

	function changeYourDialogueColors(bgColor, textColor) {
		const bgElements = document.getElementsByClassName("fbb737a4");
		for (let i = 0; i < bgElements.length; i++) {
			bgElements[i].style.transition =
				"background-color 0.1s ease-in-out";
			bgElements[i].style.backgroundColor = bgColor || ""; // Reset if empty
		}

		const textElements = document.getElementsByClassName("f9bf7997");
		for (let i = 0; i < textElements.length; i++) {
			textElements[i].style.transition = "color 0.1s ease-in-out";
			textElements[i].style.color = textColor || ""; // Reset if empty
		}
	}

	function changeGptTextColor(textColor) {
		const gptTextElements = document.getElementsByClassName("f9bf7997");
		for (let i = 0; i < gptTextElements.length; i++) {
			gptTextElements[i].style.transition = "color 0.5s ease-in-out";
			gptTextElements[i].style.color = textColor || ""; // Reset if empty

			// Add background and padding
			gptTextElements[i].style.background = "#171d35";
			gptTextElements[i].style.paddingBottom = "48px";
		}
	}

	// Apply saved colors when content script is loaded
	applySavedColors();

	// Listen for messages to update colors
	chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
		if (message.action === "changeColors") {
			changeYourDialogueColors(message.bgColor, message.textColor);
			changeGptTextColor(message.gptTextColor);
		}
	});

	// Observe new chat messages and apply colors
	const observer = new MutationObserver(() => {
		applySavedColors(); // Apply colors to new messages
	});

	observer.observe(document.body, { childList: true, subtree: true });
} else {
	console.error("chrome.storage is not available in this context.");
}