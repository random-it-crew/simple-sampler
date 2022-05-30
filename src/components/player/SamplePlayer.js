import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import PropTypes from 'prop-types'
import toWav from 'audiobuffer-to-wav'

import { AudioCTX } from '../../utils/createAudioContext'
import { Sound } from '../../utils/Sound'
import { StaticWaveForm } from './StaticWaveForm'
import { PlayButton } from './PlayButton'
import { ProgressBar } from './ProgressBar'
import { MultiRangeSlider } from '../MultiRangeSlider'
import { LoopCheckBox } from './LoopCheckBox'

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
	const [mouseDown, setMouseDown] = useState(false)
	const [points, setPoints] = useState([0, 1])

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

	useEffect(() => {
		if (!currentSample)
			return

		currentSample.startPoint = points[0]
		currentSample.endPoint = points[1]

		if (currentSample.endPoint < currentSample.getCursorPosition()) {
			currentSample.stop()
		}
	}, [currentSample, points])

	const onMouseMove = (progress) => {
		if (!currentSample)
			return

		if (mouseDown) {
			currentSample.setOffset(currentSample.getDuration() * (progress <= 0 ? 0.01 : progress))
		}
	}

	const onWaveCLick = (progress) => {
		if (progress < points[0])
			currentSample.setOffset(0)
		else if (progress > points[1])
			currentSample.setOffset(currentSample.getDuration())
		else
			currentSample.setOffset(currentSample.getDuration() * progress)
	}

	const downloadSample = async () => {
		const buff = await currentSample.getTruncatedBuffer()
		const wav = toWav(buff)
		const blob = new window.Blob([new DataView(wav)], {
			mimeType: 'audio/wav'
		})

		const a = document.createElement('a')
		document.body.appendChild(a)
		a.style = 'display: none'
		a.href = window.URL.createObjectURL(blob)
		a.download = filename.indexOf('.wav') !== -1 ? filename : filename + '.wav'
		a.click()
		window.URL.revokeObjectURL(a.href)
	}


	const onSliderData = (data) => {
		const { min, max } = data

		if (min / 100 !== points[0] || max / 100 !== points[1])

			setPoints([min / 100, max / 100])
	}

	return (
		<div>
			<MultiRangeSlider min={ 0 } max={ 100 } onChange={ onSliderData } />
			<StaticWaveForm
				sample={ sample }
				audioCTX={ audioCTX }
				setMouseDown={ setMouseDown }
				onMouseMove={ onMouseMove }
				currentSample={ currentSample }
				points={ points }
				onWaveFormClick={ onWaveCLick }/>
			<ProgressBar
				sample={ currentSample }
				setMouseDown={ setMouseDown }
				onMouseMove={ onMouseMove }
				onProgressBarClick={ (progress) => {
					currentSample.setOffset(currentSample.getDuration() * progress)
				} }/>
			<Container>
				<PlayButton sample={ currentSample } playerStatus={ playerStatus }/>
				<LoopCheckBox onChange={ (loop) => {
					if (currentSample)
						currentSample.loop = loop
				} }/>
				<Button onClick={ downloadSample }>download</Button>
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


SamplePlayer.propTypes = {
	audioCTX: AudioCTX,
	sample: PropTypes.shape({
		blob: Blob,
		filename: PropTypes.string

	})
}