import React, { useEffect, useRef, useState } from 'react'
import createAudioContext from './utils/createAudioContext'


export const App = () => {
	const [audioContext] = useState(createAudioContext)
	const [device, setDevice] = useState(null)
	const [recorder, setRecorder] = useState(null)
	const [sample, setSample] = useState(null)
	const [recording, setRecording] = useState(false)


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
		let startTime = null
		let currentChunks = []
		
		const options = {
			mimeType: 'audio/webm',
			bufferSize: 2048,
			sampleRate: 44100
		}

		if (audioContext && device) {
			const mediaRecorder = new MediaRecorder(device, options)

			mediaRecorder.onstart = () => {
				startTime = Date.now()
				currentChunks = []
			}

			mediaRecorder.onstop = () => {
				console.log('stopped recording')
				const blob = new Blob(currentChunks, { type: 'audio/webm' })

				let blobObject = {
					blob,
					startTime: startTime,
					stopTime: Date.now(),
					options: options,
					blobURL: window.URL.createObjectURL(blob)
				}

				console.log(blobObject)

				startTime = null
				setSample(blobObject)
			}

			mediaRecorder.ondataavailable = (event) => {
				console.log('data_available')

				if (event.data.size > 0) {
					currentChunks.push(event.data)
				}
			}
			setRecorder(mediaRecorder)
		}
	}, [audioContext, device])

	return (
		<div>
			<button
				onClick={ () => {
					if (recorder) {
						if (!recording) {
							recorder.start(10)
						} else {
							recorder.stop()
						}
						setRecording(!recording)
					}
				} }
			>
				start / stop recording
			</button>
			{ sample !== null && <a href={ sample.blobURL } download="sample.webm">download</a> }
		</div>
	)
}
