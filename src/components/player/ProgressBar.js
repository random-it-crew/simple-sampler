import React, { useEffect, useState } from 'react'

import styled from 'styled-components'

const Container = styled.div`
    height: 20px;
    width: 98%;
    background-color: #e0e0de;
    border-radius: 50px;
    margin: 10px;
`

const Filler = styled.div.attrs(props => ({ style: { width: props.progress + '%' } }))`
    height: 100%;
    background-color: darkGreen;
    border-radius: inherit;
    text-align: right;
`

const Label = styled.span`
    color: white;
    font-weight: bold;
    font-size: calc(5px + 1vmin);
    vertical-align: top;
`

export const ProgressBar = ({ sample }) => {
	const [progress, setProgress] = useState(0)
	const [elapsed, setElapsed] = useState(0)

	useEffect(() => {
		if (!sample)
			return

		let frameID

		const updateProgress = () => {
			frameID = requestAnimationFrame(updateProgress)

			const progress = (sample.getElapsedTime() / sample.getDuration()) * 100

			setElapsed(sample.getElapsedTime())
			setProgress(progress > 100 ? 100 : progress)
		}

		updateProgress()

		return () => {
			cancelAnimationFrame(frameID)
		}
	}, [sample])

	if (!sample)
		return <div/>

	return (
		<div>
			<Container>
				<Filler progress={ progress }>
					<Label>
						{ elapsed.toFixed(1) }/{ sample.getDuration().toFixed(1) }s
					</Label>
				</Filler>
			</Container>
		</div>
	)
}