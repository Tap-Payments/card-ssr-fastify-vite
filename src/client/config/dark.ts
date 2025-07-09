export const DarkThemeObject = {
	Click2Pay: {
		Separator: {
			backgroundColor: 'rgba(200, 200, 200, 0.60)'
		}
	},
	GlobalValues: {
		Colors: {
			apricot30: '#ffbe604C',
			azure: '#009aff',
			black: '#000000',
			black15: '#00000026',
			black30: '#00000026',
			black50: '#00000080',
			brownGrey: '#98989f',
			brownGreyFive: '#aeaeae',
			brownGreyFour: '#a6a6a6',
			brownGreySeven: '#7e7e7e',
			brownGreySix: '#a7a7a7',
			brownGreyThree: '#ababab',
			brownGreyTwo: '#b2b2b2',
			cancelBorder: '#DEDEDE',
			cardPlaceHolder: '#CFCFCF',
			cherryRed: '#e12131',
			cherryRed10: '#e1213119',
			cherryRed20: '#e12132',
			clear: '#00000000',
			deepSkyBlue: '#007aff',
			deepSkyBlue15: '#007aff26',
			greyishBrown: '#ffffff',
			greyishBrown2: '#C1C1C1',
			lightPeach: '#98989f',
			lightPeriwinkle: '#d9d9da',
			orange: '#ea611c',
			paleLilac: '#e4e4e5',
			reddishOrange20: '#ea672433',
			veryLightPinkThree: '#2C2A29',
			veryLightPinkTwo: '#404043',
			vibrantGreen: '#2ace00',
			vibrantGreenTwo: '#00d300',
			white: '#1c1c1e',
			white30: '#ffffff4D',
			white78: '#f9f9f9C6',
			white80: '#ffffffcc',
			whiteTwo: '#211F1F'
		}
	},
	Hints: {
		Error: {
			actionButtonTextColor: 'clear',
			actionButtonTextFont: 'Lato-Regular,12',
			backgroundColor: 'linear-gradient(0deg, rgba(234, 97, 28, 0.8), rgba(234, 97, 28, 0.8)), #000000',
			borderColor: 'cherryRed20',
			textColor: '#FBDFD2',
			textFont: 'lato-Regular,12'
		},
		Warning: {
			actionButtonTextColor: 'clear',
			actionButtonTextFont: 'Lato-Regular,12',
			backgroundColor: '#EA611CCC',
			borderColor: 'reddishOrange20',
			textColor: '#FBDFD2',
			textFont: 'Lato-Regular,12'
		}
	},
	cardPhoneList: {
		weAcceptLabel: {
			textColor: 'greyishBrown2',
			textFont: 'Lato-Regular,10'
		}
	},
	inlineCard: {
		blur3dsoverlay: {
			tint: '#000000',
			tintAlpha: 0.1
		},
		clearImage: {
			image: 'clearFormIcon',
			tint: 'cardPlaceHolder',
			width: 32
		},
		closeSavedCardIcon: 'closeSavedCardInputIconArrow',
		commonAttributes: {
			backgroundColor: 'black',
			borderColor: 'clear',
			borderWidth: 0,
			cornerRadius: 8,
			cvvPlaceHolder: 'cvv',
			itemSpacing: 5,
			savedCardCvvUnderLineColor: '#CFCFCF',
			shadow: {
				color: 'black30',
				offsetHeight: 0,
				offsetWidth: 0,
				opacity: 1,
				radius: 8
			},
			widthMargin: 7
		},
		saveCardForTapOption: {
			infoButtonTintColor: '#626262',
			labelTextColor: '#7E7E7E',
			labelTextFont: 'Lato-Light,12',
			saveButtonActivatedTintColor: 'azure',
			saveButtonDeactivatedTintColor: '#626262',
			tooltip: {
				borderColor: '#FFFFFFBA',
				subTitleColor: '#FFFFFFB2',
				subTitleFont: 'Lato-Light,13',
				titleColor: '#FFFFFF',
				titleFont: 'Lato,17'
			}
		},
		saveCardOption: {
			labelTextColor: 'greyishBrown',
			labelTextFont: 'Lato-Light,14',
			switchOnThumbColor: '#2ACE00',
			switchThumbColor: 'greyishBrown',
			switchTintColor: 'white'
		},
		textFields: {
			errorTextColor: '#CFCFCF',
			font: 'Lato-Regular,14',
			placeHolderColor: '#CFCFCF',
			placeHolderFont: 'Lato-Light,14',
			saveCardFontDots: 'Lato-Bold,24',
			textColor: '#CFCFCF'
		}
	},
	itemsList: {
		backgroundColor: 'white',
		item: {
			backgroundColor: 'white',
			calculatedPriceLabelColor: 'brownGrey',
			calculatedPriceLabelFont: 'Lato-Regular,12',
			count: {
				backgroundColor: 'whiteTwo',
				countLabelColor: 'brownGrey',
				countLabelFont: 'Lato-Regular,12'
			},
			descLabelColor: 'brownGrey',
			descLabelFont: 'Lato-Light,12',
			descriptionBackgroundColor: 'white',
			priceLabelColor: 'greyishBrown',
			priceLabelFont: 'Lato-Regular,14',
			titleLabelColor: 'greyishBrown',
			titleLabelFont: 'Lato-Regular,16'
		},
		separatorColor: 'veryLightPinkTwo'
	},
	tapSeparationLine: {
		backgroundColor: 'veryLightPinkTwo',
		height: 1,
		initialTrailingConstraint: 0
	}
} as const
