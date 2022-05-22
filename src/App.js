import React, { useState } from 'react'
import useMediaStream from './hooks/useMediaStream'
import { SamplePlayer } from './components/player/SamplePlayer'
import createAudioContext from './utils/createAudioContext'
import { Recorder } from './components/recorder/Recorder'


export const App = () => {
	const [audioContext] = useState(createAudioContext)
	const [sample, setSample] = useState(null)
	const mediaStream = useMediaStream(audioContext)

	return (
		<div>
			<Recorder audioCTX={audioContext} mediaStream={ mediaStream } setSample={ setSample }/>
			{ sample && <SamplePlayer sample={ sample } audioCTX={ audioContext }/> }
		</div>
	)
}
