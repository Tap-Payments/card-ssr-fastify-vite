const focusElementByRefiOS = (element: HTMLElement, time: number): NodeJS.Timeout => {
	const fakeInput = document.createElement('input')
	fakeInput.setAttribute('type', 'text')
	fakeInput.style.position = 'absolute'
	fakeInput.style.opacity = '0'
	fakeInput.style.height = '0'
	fakeInput.style.fontSize = '16px' // Disable auto zoom
	fakeInput.readOnly = true

	// You may need to append to another element depending on the browser's auto zoom/scroll behavior
	document.body.prepend(fakeInput)

	// Focus so that subsequent async focus will work
	fakeInput.focus()
	const timeout = setTimeout(() => {
		// Now we can focus on the target input
		element.focus()
		// Cleanup
		fakeInput.remove()
	}, time)

	return timeout
}

export default focusElementByRefiOS
