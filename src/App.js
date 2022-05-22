import React from 'react'
import useMediaStream from './hooks/useMediaStream'
import useRecorder from './hooks/useRecorder'


export const App = () => {
	const mediaStream = useMediaStream()
	const {
		recorder,
		isRecording,
		sample
	} = useRecorder({ mediaStream })

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
				start / stop recording
			</button>
			{ sample !== null && <a href={ sample.blobURL } download="sample.webm">download</a> }
		</div>
	)
}
