import useRecorder from '../hooks/useRecorder'
import React, { useEffect } from 'react'
import { LiveWaveForm } from './LiveWaveForm'

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
			<button
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
			</button>
			{ isRecording && <LiveWaveForm audioCTX={ audioCTX } mediaStream={ mediaStream }/> }
		</div>
	)
}