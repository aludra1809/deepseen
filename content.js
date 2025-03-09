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

	function changeGptTextColor(gptTextColor) {
		const gptTextElements = document.getElementsByClassName("f9bf7997");
		for (let i = 0; i < gptTextElements.length; i++) {
			// Apply the GPT text color as the background color
			gptTextElements[i].style.background = gptTextColor || ""; // Reset if empty

			// Add padding-bottom and padding-top
			gptTextElements[i].style.paddingBottom = "30px";
			gptTextElements[i].style.paddingTop = "30px";

			// Optional: Add a smooth transition for the background color
			gptTextElements[i].style.transition = "background 0.5s ease-in-out";
		}

		// Apply the GPT text color to elements with the class .f6004764
		const f6004764Elements = document.getElementsByClassName("f6004764");
		for (let i = 0; i < f6004764Elements.length; i++) {
			f6004764Elements[i].style.backgroundColor = gptTextColor || ""; // Reset if empty
			f6004764Elements[i].style.transition = "background-color 0.5s ease-in-out"; // Optional transition
		}

		// Darken the GPT text color for .md-code-block
		const darkenedColor = darkenColor(gptTextColor, 20); // Darken by 20%

		// Change the background color of .md-code-block elements
		const mdCodeBlocks = document.getElementsByClassName("md-code-block");
		for (let i = 0; i < mdCodeBlocks.length; i++) {
			mdCodeBlocks[i].style.backgroundColor = darkenedColor || ""; // Reset if empty
			mdCodeBlocks[i].style.transition = "background-color 0.5s ease-in-out"; // Optional transition
		}
	}

	// Function to apply default colors
	function applyDefaultColors() {
		const defaultUserBgColor = "rgb(84, 93, 39)";
		const defaultGptBgColor = "rgb(42, 61, 71)";

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

		// Apply default colors to .f6004764
		const f6004764Elements = document.getElementsByClassName("f6004764");
		for (let i = 0; i < f6004764Elements.length; i++) {
			f6004764Elements[i].style.backgroundColor = defaultGptBgColor;
		}

		// Apply default colors to .md-code-block
		const mdCodeBlocks = document.getElementsByClassName("md-code-block");
		for (let i = 0; i < mdCodeBlocks.length; i++) {
			mdCodeBlocks[i].style.backgroundColor = defaultGptBgColor;
		}
	}

	// Function to darken a hex color
	function darkenColor(hex, percent) {
		// Remove the '#' if it exists
		hex = hex.replace(/^#/, "");

		// Parse the hex color into RGB components
		let r = parseInt(hex.substring(0, 2), 16);
		let g = parseInt(hex.substring(2, 4), 16);
		let b = parseInt(hex.substring(4, 6), 16);

		// Darken each component by the specified percentage
		r = Math.floor(r * (1 - percent / 100));
		g = Math.floor(g * (1 - percent / 100));
		b = Math.floor(b * (1 - percent / 100));

		// Ensure the values stay within the valid range (0-255)
		r = Math.max(0, Math.min(255, r));
		g = Math.max(0, Math.min(255, g));
		b = Math.max(0, Math.min(255, b));

		// Convert the darkened RGB values back to a hex color
		return `#${((1 << 24) | (r << 16) | (g << 8) | b).toString(16).slice(1)}`;
	}

	// Apply saved colors when content script is loaded
	applySavedColors();

	// Listen for messages to update colors
	chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
		if (message.action === "changeColors") {
			changeYourDialogueColors(message.bgColor, message.textColor);
			changeGptTextColor(message.gptTextColor);
		} else if (message.action === "defaultColors") {
			applyDefaultColors();
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