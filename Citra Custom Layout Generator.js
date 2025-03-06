import wixWindow from 'wix-window'; // Used for copy button functionality

var displayScreenX = 0, displayScreenY = 0; // Initialize variable to be set from 'Display Resolution' user input field
var maxScreensScale = 1; // Initialize scale as 1x the original 3DS resolution
var topScreenScale = 1; // Initialize bottom screen scale for Side by Side layout as 1x the original 3DS resolution
var topScreenScaledX = 0, topScreenScaledY = 0; // Initialize scaled 3DS resolution for the custom layout's top screen
var pixelGap = 0; // Initialize variable to be set from 'Pixel Gap' user input field
var bottomScreenScaledX = 0, bottomScreenScaledY = 0; // Initialize scaled 3DS resolution for the custom layout's bottom screen
var coordTop_Top = 0, coordTop_Bottom = 0, coordTop_Left = 0, coordTop_Right = 0; // Initialize pixel coordinates for custom layout's top screen
var coordBottom_Top = 0, coordBottom_Bottom = 0, coordBottom_Left = 0, coordBottom_Right = 0; // Initialize pixel coordinates for custom layout's bottom screen
var isWidthValid = true; // Initialize variable used to signal when custom width user input is valid
var isHeightValid = true; // Initialize variable used to signal when custom height user input is valid
var isPixelGapValid = true; // Initialize variable used to signal when pixel gap user input is valid
var widthErrorMsg = "", heightErrorMsg = "", pixelGapErrorMsg = "";
let floatOptions = { "duration": 500, "direction": "left" } // Options for float animation to be used with error message(s)
let slideInOptions = { "duration": 300 }; // Options for slide-in animation to be used with the guide

function landscapeCalcPixelCoords() {
	coordTop_Left = Math.trunc((displayScreenX / 2) - (topScreenScaledX / 2)); // Calculate pixel offsets for top & bottom screens, result will center both the top & bottom screens
	coordTop_Right = Math.trunc((displayScreenX / 2) + (topScreenScaledX / 2));
	coordBottom_Left = Math.trunc((displayScreenX / 2) - (bottomScreenScaledX / 2));
	coordBottom_Right = Math.trunc((displayScreenX / 2) + (bottomScreenScaledX / 2));

	if (pixelGap != 0) coordBottom_Top = topScreenScaledY + pixelGap;
	else coordBottom_Top = topScreenScaledY; // Handles case when there's no pixel gap

	coordBottom_Bottom = coordBottom_Top + topScreenScaledY;
		
	if ($w('#citraVersion').value == "unofficial") { // Generate text to paste into qt-config.ini, config.ini, or citra-mmj.ini file, depending on the 'Citra Version' field
		$w('#outputLayout').value = "custom_layout=true" +
		"\nlandscape_top_top=0" + 
		"\nlandscape_top_bottom=" + topScreenScaledY +
		"\nlandscape_top_left=" + coordTop_Left +
		"\nlandscape_top_right=" + coordTop_Right +
		"\nlandscape_bottom_top=" + coordBottom_Top + 
		"\nlandscape_bottom_bottom=" + coordBottom_Bottom + 
		"\nlandscape_bottom_left=" + coordBottom_Left +
		"\nlandscape_bottom_right=" + coordBottom_Right; 
	}
	else {
		$w('#outputLayout').value = "custom_layout=true" +
		"\ncustom_top_top\\default=false\ncustom_top_top=0" + 
		"\ncustom_top_bottom\\default=false\ncustom_top_bottom=" + topScreenScaledY + 
		"\ncustom_top_left\\default=false\ncustom_top_left=" + coordTop_Left +
		"\ncustom_top_right\\default=false\ncustom_top_right=" + coordTop_Right + 
		"\ncustom_bottom_top\\default=false\ncustom_bottom_top=" + coordBottom_Top + 
		"\ncustom_bottom_bottom\\default=false\ncustom_bottom_bottom=" + coordBottom_Bottom +
		"\ncustom_bottom_left\\default=false\ncustom_bottom_left=" + coordBottom_Left +
		"\ncustom_bottom_right\\default=false\ncustom_bottom_right=" + coordBottom_Right;
	}
}

function sideBySideCalcPixelCoords() {
	if ($w('#overlapSidebySideScreens').checked == true) { // Overlap screens Side by Side calculation
		coordTop_Top = 0;
		coordTop_Bottom = topScreenScaledY;
		coordTop_Left = Math.trunc((displayScreenX - topScreenScaledX) / 2);
		coordTop_Right = coordTop_Left + topScreenScaledX;
		coordBottom_Left =  coordTop_Right - bottomScreenScaledX;
		coordBottom_Right = coordTop_Right;

		switch($w('#bottomScreenPosition').value) {
			case "topPosition": // Move bottom screen to the top-most area of the top screen
			coordBottom_Top = coordTop_Top;
			coordBottom_Bottom = coordBottom_Top + bottomScreenScaledY;
			break;

			case "centerPosition": // Set the bottom screen position midway through the top screen
			coordBottom_Top = Math.trunc(displayScreenY / 2) - Math.trunc(bottomScreenScaledY / 2);
			coordBottom_Bottom = coordBottom_Top + bottomScreenScaledY;
			break;

			case "bottomPosition": // Move bottom screen to the bottom-most area of the top screen
			coordBottom_Top = coordTop_Bottom - bottomScreenScaledY;
			coordBottom_Bottom = coordTop_Bottom;
			break;
		}
	}
	else if ($w('#overlapSidebySideScreens').checked == false) { // Normal Side by Side layout calculation
		coordTop_Top = Math.trunc((displayScreenY - topScreenScaledY) / 2);
		coordTop_Bottom = coordTop_Top + topScreenScaledY;
		coordTop_Left = 0;
		coordTop_Right = topScreenScaledX;

		switch($w('#bottomScreenPosition').value) {
			case "topPosition": // Move bottom screen to the top-most area of the top screen
			coordBottom_Top = coordTop_Top;
			coordBottom_Bottom = coordBottom_Top + bottomScreenScaledY;
			break;

			case "centerPosition": // Set the bottom screen position midway through the top screen
			coordBottom_Top = Math.trunc((displayScreenY - bottomScreenScaledY) / 2);
			coordBottom_Bottom = coordBottom_Top + bottomScreenScaledY;
			break;

			case "bottomPosition": // Move bottom screen to the bottom-most area of the top screen
			coordBottom_Top = Math.trunc(displayScreenY - bottomScreenScaledY - coordTop_Top);
			coordBottom_Bottom = coordTop_Bottom;
			break;
		}

		if (pixelGap != 0) coordBottom_Left = topScreenScaledX + pixelGap;
		else coordBottom_Left = topScreenScaledX;

		coordBottom_Right = coordBottom_Left + bottomScreenScaledX;
	}	

	if ($w('#citraVersion').value == "unofficial") {
		$w('#outputLayout').value = "custom_layout=true" +
		"\nlandscape_top_top=" + coordTop_Top +
		"\nlandscape_top_bottom=" + coordTop_Bottom + 
		"\nlandscape_top_left=" + coordTop_Left +
		"\nlandscape_top_right=" + coordTop_Right+
		"\nlandscape_bottom_top=" + coordBottom_Top +
		"\nlandscape_bottom_bottom=" + coordBottom_Bottom + 
		"\nlandscape_bottom_left=" + coordBottom_Left +
		"\nlandscape_bottom_right=" + coordBottom_Right;
	}
	else {
		$w('#outputLayout').value = "custom_layout=true" +
		"\ncustom_top_top\\default=false\ncustom_top_top=" + coordTop_Top +
		"\ncustom_top_bottom\\default=false\ncustom_top_bottom=" + coordTop_Bottom +
		"\ncustom_top_left\\default=false\ncustom_top_left=" + coordTop_Left +
		"\ncustom_top_right\\default=false\ncustom_top_right=" + coordTop_Right +
		"\ncustom_bottom_top\\default=false\ncustom_bottom_top=" + coordBottom_Top +
		"\ncustom_bottom_bottom\\default=false\ncustom_bottom_bottom=" + coordBottom_Bottom +
		"\ncustom_bottom_left\\default=false\ncustom_bottom_left=" + coordBottom_Left +
		"\ncustom_bottom_right\\default=false\ncustom_bottom_right=" + coordBottom_Right;
	}
}

function portraitCalcPixelCoords() {
	coordTop_Top = Math.trunc((displayScreenX - (topScreenScaledY * 2) - pixelGap) / 2);
	coordTop_Bottom = Math.trunc(coordTop_Top + topScreenScaledY);
	coordBottom_Left = Math.trunc(bottomScreenScaledY - (displayScreenY / 2));
	coordBottom_Right = coordBottom_Left + bottomScreenScaledX;

	if (pixelGap != 0) coordBottom_Top = coordTop_Bottom + pixelGap;
	else coordBottom_Top = coordTop_Bottom + 1;

	coordBottom_Bottom = coordBottom_Top + topScreenScaledY;
	
	if ($w('#citraVersion').value == "unofficial") {
		$w('#outputLayout').value = "custom_layout=true" +
		"\nportrait_top_top=" + coordTop_Top +
		"\nportrait_top_bottom=" + coordTop_Bottom + 
		"\nportrait_top_left=0" +
		"\nportrait_top_right=" + displayScreenY +
		"\nportrait_bottom_top=" + coordBottom_Top + 
		"\nportrait_bottom_bottom=" + coordBottom_Bottom + 
		"\nportrait_bottom_left=" + coordBottom_Left +
		"\nportrait_bottom_right=" + coordBottom_Right;
	}
	else {
		$w('#outputLayout').value = "custom_layout=true" +
		"\ncustom_top_top\\default=false\ncustom_top_top=" + coordTop_Top +
		"\ncustom_top_bottom\\default=false\ncustom_top_bottom=" + coordTop_Bottom + 
		"\ncustom_top_left\\default=false\ncustom_top_left=0" +
		"\ncustom_top_right\\default=false\ncustom_top_right=" + displayScreenY +
		"\ncustom_bottom_top\\default=false\ncustom_bottom_top=" + coordBottom_Top + 
		"\ncustom_bottom_bottom\\default=false\ncustom_bottom_bottom=" + coordBottom_Bottom + 
		"\ncustom_bottom_left\\default=false\ncustom_bottom_left=" + coordBottom_Left +
		"\ncustom_bottom_right\\default=false\ncustom_bottom_right=" + coordBottom_Right;
	}
}

function generateLayout() {
	$w('#generate').onClick( () =>  { // Validate user input before generating text the user will copy from the custom layout output field
		$w('#errorMsgs').hide(); // Temporarily reset & hide error messages, reset validity variable, & reset output field when 'Generate' button is pressed until after validating user input 
		$w('#errorMsgs').text = ""; // Reset error messages, set it to blank
		$w('#outputLayout').value = ""; // Reset output box
		
		widthErrorMsg = "";
		heightErrorMsg = "";
		pixelGapErrorMsg = "";

		errorMessages(); // Call function that handles form validation errors

		if (isWidthValid == true && isHeightValid == true && isPixelGapValid == true) {
			maxScreensScale = 1; // Reset variables involved with calculations to prevent incorrect output
			topScreenScale = 1;
			topScreenScaledX = 0;
			topScreenScaledY = 0;
			bottomScreenScaledX = 0;
			bottomScreenScaledY = 0;

			if ($w('#res').value == "1080p") displayScreenX = 1920, displayScreenY = 1080; // Set Display resolution X by Y based on user input
			else if ($w('#res').value == "1440p") displayScreenX = 2560, displayScreenY = 1440;
			else if ($w('#res').value == "2160p") displayScreenX = 3840, displayScreenY = 2160;
			else {
				displayScreenX = Math.trunc(parseInt($w('#customWidth').value));
				displayScreenY = Math.trunc(parseInt($w('#customHeight').value));
			}

			pixelGap = Math.trunc(parseInt($w('#pixelGap').value)); // Set desired pixel gap based on user input

			switch ($w('#orientation').value) { // Set the maximum scale for the 3DS top & bottom screens depending on user's display screen resolution
				case "landscape":
					while (true) { // Keep looping until reaching the else statement, to stop scaling
						if ((maxScreensScale + 0.1) * 240 * 2 + pixelGap <= displayScreenY) { // + 0.1 to make sure screen sizes don't exceed monitor width
							maxScreensScale+= 0.1; // + 0.1 so both screens scale by the same amount, ex. 0.01 wouldn't scale by the same amount on both screens
							continue;
						}
						else {
							topScreenScaledX = Math.trunc(maxScreensScale * 400);
							topScreenScaledY = Math.trunc(maxScreensScale * 240);
							break;
						}
					}

					bottomScreenScaledX = Math.trunc(maxScreensScale * 320); // Bottom screen will use the same scale amount as Top Screen
					bottomScreenScaledY = Math.trunc(maxScreensScale * 240);
					
					landscapeCalcPixelCoords(); // Calculate pixel coordinates in landscape orientation
					break;
			
				case "sideBySide":
					if ($w('#overlapSidebySideScreens').checked == true) { // Overlap screens calculation
						// Only calculate top screen scale amount if bottom screen is the original resolution of 320x240
						// Top screen won't exceed display x by y resolution, with respect to pixel gap & bottom screen 320 px width
						while (true) { // Plus 320 because of bottom screen original X resolution
							if ((Math.trunc(((topScreenScale + 0.1) * 400)) <= displayScreenX) && (Math.trunc(((topScreenScale + 0.1) * 240)) <= displayScreenY)) {
								maxScreensScale+= 0.1;
								topScreenScale+= 0.1;
								continue;
							}
							else break;
						}
					}
					else if ($w('#overlapSidebySideScreens').checked == false) { // Normal Side by Side calculation
						while (true) { // Calculate maximum scale such that the height of top & bottom screens are the same
							if ((Math.trunc(((maxScreensScale + 0.1) * 400) + ((maxScreensScale + 0.1) * 320) + pixelGap) <= displayScreenX)) {
								maxScreensScale+= 0.1;
								continue;
							}
							else break;
						}

						// Only calculate top screen scale amount if bottom screen is the original resolution of 320x240
						// Top screen won't exceed display x by y resolution, with respect to pixel gap & bottom screen 320 px width
						while (true) { // Plus 320 because of bottom screen original X resolution
							if ((Math.trunc(((topScreenScale + 0.1) * 400) + 320 + pixelGap) <= displayScreenX) && (Math.trunc(((topScreenScale + 0.1) * 240)) <= displayScreenY)) {
								topScreenScale+= 0.1;
								continue;
							}
							else break;
						}
					}

					switch ($w('#bottomScale').value) {
						case "minimumScale": // When user selects 'Minimum' Bottom Scale
						topScreenScaledX = Math.trunc(topScreenScale * 400);
						topScreenScaledY = Math.trunc(topScreenScale * 240);
						bottomScreenScaledX = 320;
						bottomScreenScaledY = 240;
						break;

						case "mediumScale": // When user selects 'Medium' Bottom Scale, get the average of 'Minimum' & 'Maximum' scale factors
						topScreenScaledX = Math.trunc(((maxScreensScale + topScreenScale) / 2) * 400);
						topScreenScaledY = Math.trunc(((maxScreensScale + topScreenScale) / 2) * 240);
						bottomScreenScaledX = Math.trunc(((maxScreensScale + 1.0) / 2) * 320); // + 1.0 since original screen scale wasn't scaled, aka times 1
						bottomScreenScaledY = Math.trunc(((maxScreensScale + 1.0) / 2 ) * 240);
						break;

						case "maximumScale": // When user selects 'Maximum' Bottom Scale
						topScreenScaledX = Math.trunc(maxScreensScale * 400);
						topScreenScaledY = Math.trunc(maxScreensScale * 240);
						bottomScreenScaledX = Math.trunc(maxScreensScale * 320);
						bottomScreenScaledY = Math.trunc(maxScreensScale * 240);
						break;
					}

					sideBySideCalcPixelCoords(); // Calculate pixel coordinates in side by side orientation
					break;
				
				case "portrait":
					while (true) { 
						if (maxScreensScale * 400 <= displayScreenY && maxScreensScale * 240 <= displayScreenX) {
							maxScreensScale+= 0.1;
							continue;
						}
						else {
							topScreenScaledX = Math.trunc(maxScreensScale * 400);
							topScreenScaledY = Math.trunc(maxScreensScale * 240);
							break;
						}
					}
					bottomScreenScaledX = Math.trunc(maxScreensScale * 320);
					bottomScreenScaledY = Math.trunc(maxScreensScale * 240);
					
					portraitCalcPixelCoords(); // Calculate pixel coordinates in portrait orientation
					break;
			}
		}
	})
}

function errorMessages() { // Validation covers instances where the width/height/pixel gap is out of range or using invalid characters
	if (parseInt($w('#customWidth').value) < 720) { // 720 because of adding 400 & 320 from top & bottom screen width, it isn't practical for a user to use a screen width less than that
		widthErrorMsg = "Custom width should be at least 720\n";
		isWidthValid = false;
	}
	else if (Number.isNaN(parseInt($w('#customWidth').value))) {
		widthErrorMsg = "Enter a valid custom screen width value\n";
		isWidthValid = false;
	}

	if (parseInt($w('#customHeight').value) < 480) { // 480 because of adding 240 from top & bottom screen height, it isn't practical for a user to use a screen height less than that
		heightErrorMsg = "Custom height should be at least 480\n";
		isHeightValid = false;
	}
	else if (Number.isNaN(parseInt($w('#customHeight').value))) {
		heightErrorMsg = "Enter a valid custom screen height value\n";
		isHeightValid = false;
	}

	if (parseInt($w('#pixelGap').value) < 0 || parseInt($w('#pixelGap').value) > 128) {
		pixelGapErrorMsg = "Pixel gap should be 0-128px\n";
		isPixelGapValid = false;
	}
	else if (Number.isNaN(parseInt($w('#pixelGap').value))) {
		pixelGapErrorMsg = "Enter a valid pixel gap value\n";
		isPixelGapValid = false;
	}

	$w('#errorMsgs').text += widthErrorMsg + heightErrorMsg + pixelGapErrorMsg;
	$w('#errorMsgs').show("float", floatOptions);
}

$w.onReady(function () {
	$w('#customWidth').hide(); 	// Hide custom width/height fields on page load
	$w('#xLabel').hide();
	$w('#customHeight').hide();
	$w('#bottomScaleLabel').hide();
	$w('#bottomScale').hide();
	$w('#bottomPositionLabel').hide();
	$w('#bottomScreenPosition').hide();
	$w('#overlapSidebySideScreens').hide();
	$w('#errorMsgs').hide(); // Hide error message field & set output field to blank on page load
	$w('#guide').hide();
	$w('#outputLayout').value = "";

	$w('#guideToggle').onClick( () => { // Show instructions to user when the 'Guide' button is pressed, hide them when pressed again
		if ($w('#guide').hidden == true) $w('#guide').show("slide", slideInOptions);
		else ($w('#guide').hide("slide", slideInOptions));
	});

	generateLayout(); // Call function that handles generating the custom layout output

	$w("#copyOutput").onClick(() => {  // Copy button functionality, instead of user selecting the output manually and copying it
		let output = $w("#outputLayout").value;
		if(output != "") {
			wixWindow.copyToClipboard(output).then(() => {
				$w("#copyOutput").disable();
				$w("#copyOutput").label = 'Copied!'; // Tell the user that the output has been copied
				copiedToCopyLabel(); // Call function to return button text back to default
			});
		}
	});
});

export function res_change(event) { // Show/Hide 'Width' & 'Height' input fields when "Custom" is selected from 'Display Resolution', reset width/height values when hidden
	if (event.target.selectedIndex === 3) {
		isWidthValid = true;
		isHeightValid = true;
		$w('#customWidth').show();
		$w('#xLabel').show();
		$w('#customHeight').show();
	}
	else {
		isWidthValid = true;
		isHeightValid = true;
		$w('#customWidth').hide();
		$w('#customWidth').value = "1920";
		$w('#customWidth').style.borderColor = "#919191";
		$w('#customHeight').hide();
		$w('#customHeight').value = "1080";
		$w('#customHeight').style.borderColor = "#919191";
		$w('#xLabel').hide();
		if (widthErrorMsg.length > 0 || heightErrorMsg.length > 0) { // Clear error messages for custom width & height
			$w('#errorMsgs').text == "";
			$w('#errorMsgs').hide("float", floatOptions);
		}
	}
}

export function orientation_change(event) { // Show 'Bottom Scale' & 'Bottom Position' UI elements when 'Side by Side' is selected in 'Layout'
	if (event.target.selectedIndex == 1) {
		$w('#bottomScaleLabel').show();
		$w('#bottomScale').show();
		$w('#bottomPositionLabel').show();
		$w('#bottomScreenPosition').show();
		$w('#overlapSidebySideScreens').show();
	}
	else { // Hide 'Bottom Scale', 'Bottom Position', 'Overlap Screens' UI elements when 'Side by Side' is not selected in 'Layout', set scale & position to default values
		$w('#bottomScale').hide();
		$w('#bottomScaleLabel').hide();
		$w('#bottomPositionLabel').hide();
		$w('#bottomScreenPosition').hide();
		$w('#bottomScale').selectedIndex = 0;
		$w('#bottomScreenPosition').selectedIndex = 1;
		$w('#overlapSidebySideScreens').hide();
		$w('#overlapSidebySideScreens').checked == false;
	}
}

export function bottomScale_change(event) { // Show 'Bottom Position' UI elements when 'Minimum' or 'Medium' is selected in 'Bottom Scale'
	if (event.target.selectedIndex == 0 || event.target.selectedIndex == 1) {
		$w('#bottomPositionLabel').show();
		$w('#bottomScreenPosition').show();
	}
	else { // Hide 'Bottom Position' UI elements when 'Maximum' is selected in 'Bottom Scale', since top & bottom screen will have the same height, reset position value
		$w('#bottomPositionLabel').hide();
		$w('#bottomScreenPosition').hide();
		$w('#bottomScreenPosition').selectedIndex = 1;
	}
}

export function customWidth_input(event) { // Manually sets the border color of the custom width or height to red when either field is empty, otherwise reset to the default color on valid input, Wix only does this automatically for required fields
	if($w('#customWidth').value.length == 0) $w('#customWidth').style.borderColor = "red";
	else $w('#customWidth').style.borderColor = "#919191";

	if((parseInt($w('#customWidth').value) >= 720) && widthErrorMsg.length > 0) { // Remove custom width error message when width field is updated with a valid input
		isWidthValid = true; // Temporarily set variable to true (default value) until changed to false in validation
		widthErrorMsg = "";
		$w('#errorMsgs').text = "";
		$w('#errorMsgs').text += widthErrorMsg + heightErrorMsg + pixelGapErrorMsg;
		$w('#errorMsgs').show("float", floatOptions);
	}
}

export function customHeight_input(event) { // Remove custom height error message when height field is updated with a valid input
	if($w('#customHeight').value.length == 0) $w('#customHeight').style.borderColor = "red";
	else $w('#customHeight').style.borderColor = "#919191";
	
	if((parseInt($w('#customWidth').value) >= 480) && heightErrorMsg.length > 0) {
		isHeightValid = true;
		heightErrorMsg = "";
		$w('#errorMsgs').text = "";
		$w('#errorMsgs').text += widthErrorMsg + heightErrorMsg + pixelGapErrorMsg;
		$w('#errorMsgs').show("float", floatOptions);
	}
}

export function pixelGap_input(event) { // Remove pixel gap error message when pixel gap field is updated with a valid input
	if((parseInt($w('#pixelGap').value) >= 0 || parseInt($w('#pixelGap').value) <= 128) && pixelGapErrorMsg.length > 0) {
		isPixelGapValid = true; 
		pixelGapErrorMsg = "";
		$w('#errorMsgs').text = "";
		$w('#errorMsgs').text += widthErrorMsg + heightErrorMsg + pixelGapErrorMsg;
		$w('#errorMsgs').show("float", floatOptions);
	}

	if(parseInt($w('#pixelGap').value) > 0) { // Hide the overlap screens checkbox if using the pixel gap, show it again only if there's no pixel gap when selecting Side by Side layout
		$w('#overlapSidebySideScreens').hide();
		$w('#overlapSidebySideScreens').checked = false;
	}
	else if (parseInt($w('#pixelGap').value) == 0 && $w('#orientation').selectedIndex == 1)
		$w('#overlapSidebySideScreens').show();
}

function copiedToCopyLabel() { // Function for changing the copy button text from 'Copied!' back to 'Copy'
    if ($w("#copyOutput").disable()) {
        setTimeout(function () {
            $w("#copyOutput").enable();
            $w("#copyOutput").label = 'Copy';
        }, 1750)
    }
}

export function overlapSidebySideScreens_click(event) { // Hide Pixel Gap UI when using Overlap Screens for Side by Side layout
	if ($w('#overlapSidebySideScreens').checked) {
		$w('#pixelGapLabel').hide();
		$w('#pixelGap').hide();
		$w('#pixelGap').value = "0";
	}
	else {
		$w('#pixelGapLabel').show();
		$w('#pixelGap').show();
	}
}

export function reset_click(event) { // Reset button function, sets all the fields to default values
	$w('#customWidth').hide(); 	
	$w('#customWidth').value = "1920";
	$w('#xLabel').hide();
	$w('#customHeight').hide();
	$w('#customHeight').value = "1080";
	$w('#res').selectedIndex = 0;
	$w('#orientation').selectedIndex = 0;
	$w('#pixelGap').show();
	$w('#pixelGap').value = "0";
	$w('#bottomScaleLabel').hide();
	$w('#bottomScale').hide();
	$w('#bottomScale').selectedIndex = 0;
	$w('#bottomPositionLabel').hide();
	$w('#bottomScreenPosition').hide();
	$w('#bottomScreenPosition').selectedIndex = 1;
	$w('#overlapSidebySideScreens').hide();
	$w('#overlapSidebySideScreens').checked = false;
	$w('#citraVersion').selectedIndex = 0;
	$w('#errorMsgs').hide();
	$w('#errorMsgs').text = "";
	$w('#guide').hide();
	$w('#outputLayout').value = "";
}