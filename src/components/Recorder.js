import useRecorder from '../hooks/useRecorder'
import React, { useEffect } from 'react'

export const Recorder = ({ mediaStream, setSample }) => {
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
						} else {
							recorder.stop()
						}
					}
				} }
			>
				{ isRecording ? 'stop recording' : 'start recording' }
			</button>
		</div>
	)
}