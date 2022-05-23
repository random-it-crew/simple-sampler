import React, { useEffect, useState } from 'react'
import { StaticWaveForm } from './StaticWaveForm'
import { Sound } from '../../utils/Sound'
import { PlayButton } from './PlayButton'
import { ProgressBar } from './ProgressBar'
import styled from 'styled-components'

const Container = styled.div`
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

const Input = styled.input`
	padding: 1vh;
	margin: 1vh;
`

export const SamplePlayer = ({ sample, audioCTX }) => {
	const [currentSample, setCurrentSample] = useState(null)
	const [playerStatus, setPlayerStatus] = useState('stopped')
	const [filename, setFilename] = useState(sample.filename)

	useEffect(() => {
		const onPause = () => setPlayerStatus('paused')
		const onPlay = () => setPlayerStatus('playing')
		const onEnded = () => setPlayerStatus('stopped')

		const sound = new Sound(audioCTX, sample, onPlay, onPause, onEnded)

		setCurrentSample(sound)

		return () => {
			sound.stop()
		}
	}, [audioCTX, sample])


	return (
		<div>
			<StaticWaveForm
				sample={ sample }
				audioCTX={ audioCTX }
				currentSample={ currentSample }
				onWaveFormClick={ (progress) => {
					currentSample.setOffset(currentSample.getDuration() * progress)
				} }/>
			<ProgressBar
				sample={ currentSample }
				onProgressBarClick={ (progress) => {
					currentSample.setOffset(currentSample.getDuration() * progress)
				} }/>
			<Container>
				<PlayButton sample={ currentSample } playerStatus={ playerStatus }/>
				<a
					href={ sample.blobURL }
					download={ filename.indexOf('.wav') !== -1 ? filename : filename + '.wav' }
				>
					<Button>download</Button>
				</a>
				<Input
					type={ 'text' }
					value={ filename }
					onChange={ (event) => {
						setFilename(event.target.value)
					} }
				/>
			</Container>

		</div>
	)
}
