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
			// Apply the GPT text color as the background color
			gptTextElements[i].style.backgroundColor = gptTextColor || "";

			// Add padding: 48px
			gptTextElements[i].style.padding = "48px";

			// Calculate and apply a contrasting text color
			const contrastColor = getContrastColor(gptTextColor);
			gptTextElements[i].style.color = contrastColor;
		}

		// Apply the GPT text color to .md-code-block
		const mdCodeBlocks = document.getElementsByClassName("md-code-block");
		for (let i = 0; i < mdCodeBlocks.length; i++) {
			mdCodeBlocks[i].style.backgroundColor = gptTextColor || "";
		}

		// Apply a darker background color to .md-code-block > pre
		const darkerColor = darkenColor(gptTextColor, 20); // Darken by 20%
		const mdCodeBlockPres = document.querySelectorAll(".md-code-block > pre");
		for (let i = 0; i < mdCodeBlockPres.length; i++) {
			mdCodeBlockPres[i].style.backgroundColor = darkerColor || "";
		}

		// Apply the GPT text color to .c3ecdb44
		const c3ecdb44Elements = document.getElementsByClassName("c3ecdb44");
		for (let i = 0; i < c3ecdb44Elements.length; i++) {
			c3ecdb44Elements[i].style.backgroundColor = gptTextColor || "";
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
			gptTextElements[i].style.padding = ""; // Remove padding
			gptTextElements[i].style.color = ""; // Revert to default text color
		}

		// Revert .md-code-block to the default color
		const mdCodeBlocks = document.getElementsByClassName("md-code-block");
		for (let i = 0; i < mdCodeBlocks.length; i++) {
			mdCodeBlocks[i].style.backgroundColor = "";
		}

		// Revert .md-code-block > pre to the default color
		const mdCodeBlockPres = document.querySelectorAll(".md-code-block > pre");
		for (let i = 0; i < mdCodeBlockPres.length; i++) {
			mdCodeBlockPres[i].style.backgroundColor = "";
		}

		// Revert .c3ecdb44 to the default color
		const c3ecdb44Elements = document.getElementsByClassName("c3ecdb44");
		for (let i = 0; i < c3ecdb44Elements.length; i++) {
			c3ecdb44Elements[i].style.backgroundColor = "";
		}
	}

	// Function to calculate a contrasting text color
	function getContrastColor(hexColor) {
		// Remove the '#' if it exists
		hexColor = hexColor.replace(/^#/, "");

		// Parse the hex color into RGB components
		const r = parseInt(hexColor.substring(0, 2), 16);
		const g = parseInt(hexColor.substring(2, 4), 16);
		const b = parseInt(hexColor.substring(4, 6), 16);

		// Calculate luminance (perceived brightness)
		const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

		// Return black or white based on luminance
		return luminance > 0.5 ? "#000000" : "#ffffff";
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

	// Listen for messages to update colors
	chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
		if (message.action === "changeColors") {
			changeYourDialogueColors(message.bgColor);
			changeGptTextColor(message.gptTextColor);
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