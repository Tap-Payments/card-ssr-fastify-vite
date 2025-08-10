import React, { PropsWithChildren, useEffect, useMemo } from 'react'

const FirstTruthyOf = (props: PropsWithChildren) => {
	const { children } = props

	const childrenLength = React.Children.count(children)

	useEffect(() => {
		if (childrenLength > 1) return
		console.warn("'FirstTruthyOf' is useful with multiple children\n")
	}, [childrenLength])

	const firstTruthy = useMemo(() => React.Children.toArray(children).find(Boolean), [children])

	return (firstTruthy || null) as JSX.Element
}

export default FirstTruthyOf
