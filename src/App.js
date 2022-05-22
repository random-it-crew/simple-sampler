import React, { useState } from 'react'
import useMediaStream from './hooks/useMediaStream'
import { SamplePlayer } from './components/SamplePlayer'
import createAudioContext from './utils/createAudioContext'
import { Recorder } from './components/Recorder'


export const App = () => {
	const [audioContext] = useState(createAudioContext)
	const [sample, setSample] = useState(null)
	const mediaStream = useMediaStream(audioContext)

	return (
		<div>
			<Recorder audioCTX={audioContext} mediaStream={ mediaStream } setSample={ setSample }/>
			{ sample !== null && <a href={ sample.blobURL } download="sample.webm">download</a> }
			{ sample && <SamplePlayer sample={ sample } audioCTX={ audioContext }/> }
		</div>
	)
}
