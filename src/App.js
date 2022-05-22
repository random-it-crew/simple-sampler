import React, { useEffect, useState } from 'react'
import createAudioContext from './utils/createAudioContext'
import { Recorder } from './tools/Recorder'


export const App = () => {
	const [audioContext] = useState(createAudioContext)
	const [device, setDevice] = useState(null)
	const [recorder, setRecorder] = useState(null)
	const [sample, setSample] = useState(null)
	const [currentChunks, setCurrentChunks] = useState([])


	useEffect(() => {
		let dev = null

		const setAudioDevice = async () => {
			dev = await navigator.mediaDevices.getUserMedia({
				audio: true,
				video: false
			})


			setDevice(dev)
		}

		setAudioDevice()

		return () => {
			if (dev !== null) {
				dev.getTracks().forEach(track => track.stop())
			}
		}
	}, [])


	useEffect(() => {
		if (audioContext && device) {
			setRecorder(
				new Recorder(
					audioContext,
					device,
					() => {
						console.log('started recording')
						setCurrentChunks([])
					},
					() => {
						console.log('stopped recording')
					},
					(blobObj) => {
						console.log('onSave : ', blobObj)
						setSample(blobObj)
					},
					(chunks) => {
						console.log('onData')
						setCurrentChunks(prev_chunks => {

							prev_chunks.push(chunks)
							return prev_chunks
						})
					}
				)
			)
		}
	}, [audioContext, device])

	return (
		<div>
			<button
				onClick={ () => {
					if (recorder) {
						if (recorder.recording) {
							recorder.stopRecording()
						} else {
							recorder.startRecording()
						}
					}
				} }
			>
				start / stop recording
			</button>
			{ sample !== null && <a href={sample.blobURL} download='sample.webm'>download</a> }
		</div>
	)
}
