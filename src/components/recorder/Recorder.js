import useRecorder from '../../hooks/useRecorder'
import React, { useEffect } from 'react'
import { LiveWaveForm } from './LiveWaveForm'
import styled from 'styled-components'

const Button = styled.button`
	padding: 1vh;
	margin: 2vh;
`

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

export const Recorder = ({ mediaStream, audioCTX, setSample }) => {
	const {
		recorder,
		isRecording,
		sample
	} = useRecorder({ mediaStream })

	useEffect(() => {
		setSample(sample)
	}, [sample, setSample])


	return (
		<div>
			<Container>
				<Button
					onClick={ () => {
						if (recorder) {
							if (!isRecording) {
								recorder.start(10)
								setSample(null)
							} else {
								recorder.stop()
							}
						}
					} }
				>
					{ isRecording ? 'stop recording' : 'start recording' }
				</Button>
			</Container>
			{ isRecording && <LiveWaveForm audioCTX={ audioCTX } mediaStream={ mediaStream }/> }
		</div>
	)
}