import React, { useEffect, useState } from 'react'
import { StaticWaveForm } from './StaticWaveForm'
import { Sound } from '../../utils/Sound'
import { PlayButton } from './PlayButton'
import { ProgressBar } from './ProgressBar'
import styled from 'styled-components'

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex: 1 1 0;
  flex-flow: row wrap;
  justify-content: center;
  align-content: center;
  
  
  @media screen and (min-width: 415px){
    max-height: calc(45px + 2vmin);
    -webkit-flex-direction: row;
    -ms-flex-direction: row;
    flex-direction: row;
    -webkit-flex: 1 1 0;
    -ms-flex: 1 1 0;
    flex: 1 1 0;
  }
`

const Button = styled.button`
	padding: 1vh;
	margin: 1vh;
`

export const SamplePlayer = ({ sample, audioCTX }) => {
	const [currentSample, setCurrentSample] = useState(null)
	const [playerStatus, setPlayerStatus] = useState('stopped')

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


	return (
		<div>
			<StaticWaveForm sample={ sample } audioCTX={ audioCTX }/>
			<ProgressBar sample={ currentSample }/>
			<ButtonContainer>
				<PlayButton sample={ currentSample } playerStatus={ playerStatus } setPlayerStatus={ setPlayerStatus }/>
				{ sample !== null && <a href={ sample.blobURL } download="sample.wav">
					<Button>download</Button>
				</a> }
			</ButtonContainer>

		</div>
	)
}
