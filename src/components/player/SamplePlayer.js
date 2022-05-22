import React, { useEffect, useState } from 'react'
import { StaticWaveForm } from './StaticWaveForm'
import { Sound } from '../../utils/Sound'

export const SamplePlayer = ({ sample, audioCTX }) => {
	const [currentSample, setCurrentSample] = useState(null)
	const [playerStatus, setPlayerStatus] = useState('stopped')
	const [label, setLabel] = useState('play')

	useEffect(() => {
		let cleanup

		const createSound = async () => {
			if (audioCTX && sample) {
				const onPause = () => setPlayerStatus('paused')
				const onPlay = () => setPlayerStatus('playing')
				const onEnded = () => setPlayerStatus('stopped')

				const sound = new Sound(audioCTX, sample, onPlay, onPause, onEnded)


				cleanup = () => {
					sound.stop()
				}

				setCurrentSample(sound)
			}
		}

		createSound()

		return () => {
			if (typeof cleanup === 'function')
				cleanup()
		}
	}, [audioCTX, sample])

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
		<div>
			<StaticWaveForm sample={ sample } audioCTX={ audioCTX }/>
			<button onClick={ async () => {
				if (currentSample) {
					if (playerStatus === 'playing') {
						currentSample.pause()
					} else if (playerStatus === 'paused' || playerStatus === 'stopped') {
						console.log(playerStatus)
						await currentSample.play()
						setPlayerStatus('playing')
					}
				}
			} }>
				{ label }
			</button>
		</div>
	)
}
