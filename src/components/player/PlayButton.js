import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

const Button = styled.button`
	padding: 1vh;
	margin: 1vh;
`

export const PlayButton = ({sample, playerStatus}) => {
	const [label, setLabel] = useState('play')

	useEffect(() => {
		const getLabel = () => {
			console.log(playerStatus)

			if (playerStatus === 'paused') {
				return 'resume'
			}
			if (playerStatus !== 'playing')
				return 'play'
			if (playerStatus === 'playing')
				return 'pause'
		}

		setLabel(getLabel())
	}, [playerStatus])

	return (
		<Button onClick={ async () => {
			if (sample) {
				if (playerStatus === 'playing') {
					sample.pause()
				} else if (playerStatus === 'paused' || playerStatus === 'stopped') {
					await sample.play()
				}
			}
		} }>
			{ label }
		</Button>
	)
}