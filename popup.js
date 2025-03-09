document.addEventListener("DOMContentLoaded", () => {
	const bgColorPicker = document.getElementById("bgColorPicker");
	const textColorPicker = document.getElementById("textColorPicker");
	const gptTextColorPicker = document.getElementById("gptTextColorPicker");
	const yourDialogueColorToggle = document.getElementById("yourDialogueColorToggle");
	const gptTextColorToggle = document.getElementById("gptTextColorToggle");
	const defaultButton = document.getElementById("defaultButton");

	// Load settings from storage
	chrome.storage.local.get(
		[
			"selectedBgColor",
			"selectedTextColor",
			"yourDialogueColorsEnabled",
			"gptTextColorsEnabled",
			"selectedGptTextColor",
		],
		(data) => {
			if (data.selectedBgColor) bgColorPicker.value = data.selectedBgColor;
			if (data.selectedTextColor) textColorPicker.value = data.selectedTextColor;
			if (data.selectedGptTextColor) gptTextColorPicker.value = data.selectedGptTextColor;
			yourDialogueColorToggle.checked = data.yourDialogueColorsEnabled ?? true;
			gptTextColorToggle.checked = data.gptTextColorsEnabled ?? true;
		}
	);

	function updateColors() {
		const bgColor = yourDialogueColorToggle.checked ? bgColorPicker.value : "";
		const textColor = yourDialogueColorToggle.checked ? textColorPicker.value : "";
		const gptTextColor = gptTextColorToggle.checked ? gptTextColorPicker.value : "";

		chrome.storage.local.set({
			selectedBgColor: bgColorPicker.value,
			selectedTextColor: textColorPicker.value,
			selectedGptTextColor: gptTextColorPicker.value,
			yourDialogueColorsEnabled: yourDialogueColorToggle.checked,
			gptTextColorsEnabled: gptTextColorToggle.checked,
		});

		chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
			chrome.tabs.sendMessage(tabs[0].id, {
				action: "changeColors",
				bgColor,
				textColor,
				gptTextColor,
			});
		});
	}

	// Event listeners
	bgColorPicker.addEventListener("input", updateColors);
	textColorPicker.addEventListener("input", updateColors);
	gptTextColorPicker.addEventListener("input", updateColors);
	yourDialogueColorToggle.addEventListener("change", updateColors);
	gptTextColorToggle.addEventListener("change", updateColors);

	// Default button
	defaultButton.addEventListener("click", () => {
		chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
			chrome.tabs.sendMessage(tabs[0].id, {
				action: "defaultColors",
			});
		});
	});
});