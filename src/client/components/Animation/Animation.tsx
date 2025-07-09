import React, { useRef } from 'react'
import { easeIn, easeOut, motion, useInView } from 'framer-motion'

type Props = {
	children: React.ReactNode
	duration?: number
	id?: string
}
function Animation({ children, duration, id }: Props) {
	return (
		<motion.div
			id={id || `card-animation`}
			variants={{
				initial: {
					height: 0,
					opacity: 0,
					transition: {
						duration: duration ?? 1,
						ease: easeIn
					}
				},
				animate: {
					height: 'auto',
					opacity: 1,
					transition: {
						duration: duration ?? 1,
						ease: easeIn
					}
				},
				exit: {
					height: 0,
					opacity: 0,
					transition: {
						duration: duration ? duration : 1,
						ease: easeOut
					}
				}
			}}
			initial={'initial'}
			animate={'animate'}
			exit={'exit'}
		>
			{children}
		</motion.div>
	)
}

export default React.memo(Animation)

type OpacityProps = {
	children: React.ReactNode
	id?: string
}
export const Opacity = ({ children, id }: OpacityProps) => {
	const ref = useRef(null)
	const isInView = useInView(ref)
	const variants = {
		open: { opacity: 1, transition: { duration: 0.5, ease: easeIn } },
		closed: { opacity: 0, transition: { duration: 0.4, ease: easeOut } }
	}

	return (
		<motion.span
			ref={ref}
			style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
			id={id}
			variants={variants}
			initial={'closed'}
			animate={isInView ? 'open' : 'closed'}
			exit={'closed'}
		>
			{children}
		</motion.span>
	)
}
