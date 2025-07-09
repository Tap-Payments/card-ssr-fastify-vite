interface input {
	isUserDoneTyping: boolean
	isValid: boolean
	errorMessage: string | null
}

export interface ResponseTypeI {
	card: {
		number: input
		date: input
		cvv: input
		name: input
		/**  false indicates not all card input are valid and complete, or true if all are valid */
		isAllInputsValid: boolean
	}
}
