document.addEventListener("DOMContentLoaded", () => {
	const bgColorPicker = document.getElementById("bgColorPicker");
	const gptTextColorPicker = document.getElementById("gptTextColorPicker");
	const toggleButton = document.getElementById("toggleButton");
	const defaultButton = document.getElementById("defaultButton");

	let isOn = true; // Initially, the button is "on"

	// Load settings from storage
	chrome.storage.local.get(
		[
			"selectedBgColor",
			"selectedGptTextColor",
			"isOn",
		],
		(data) => {
			if (data.selectedBgColor) bgColorPicker.value = data.selectedBgColor;
			if (data.selectedGptTextColor) gptTextColorPicker.value = data.selectedGptTextColor;
			isOn = data.isOn ?? true; // Default to "on"
			updateToggleButton();
		}
	);

	// Update the toggle button text and state
	function updateToggleButton() {
		if (isOn) {
			toggleButton.textContent = "On";
			toggleButton.classList.remove("off");
			defaultButton.disabled = false;
		} else {
			toggleButton.textContent = "Off";
			toggleButton.classList.add("off");
			defaultButton.disabled = true;
		}
	}

	// Toggle button click handler
	toggleButton.addEventListener("click", () => {
		isOn = !isOn; // Toggle the state
		updateToggleButton();

		// Save the state to storage
		chrome.storage.local.set({ isOn });

		// Send a message to the content script to update colors
		chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
			chrome.tabs.sendMessage(tabs[0].id, {
				action: "toggleColors",
				isOn,
				bgColor: isOn ? bgColorPicker.value : "",
				gptTextColor: isOn ? gptTextColorPicker.value : "",
			});
		});
	});

	// Default button click handler
	defaultButton.addEventListener("click", () => {
		chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
			chrome.tabs.sendMessage(tabs[0].id, {
				action: "defaultColors",
			});
		});
	});

	// Color picker change handlers
	bgColorPicker.addEventListener("input", updateColors);
	gptTextColorPicker.addEventListener("input", updateColors);

	// Function to update colors
	function updateColors() {
		if (!isOn) return; // Do nothing if the button is "off"

		chrome.storage.local.set({
			selectedBgColor: bgColorPicker.value,
			selectedGptTextColor: gptTextColorPicker.value,
		});

		chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
			chrome.tabs.sendMessage(tabs[0].id, {
				action: "changeColors",
				bgColor: bgColorPicker.value,
				gptTextColor: gptTextColorPicker.value,
			});
		});
	}
});