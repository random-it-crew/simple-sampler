import { useEffect, useRef, useState } from 'react'

export default function useRecorder({ mediaStream, onDataAvailable }) {
	const [recorder, setRecorder] = useState(null)
	const [startTime, setStartTime] = useState(null)
	const [isRecording, setIsRecording] = useState(false)
	const [sample, setSample] = useState(null)
	const chunks = useRef([])

	useEffect(() => {
		const options = {
			mimeType: 'audio/webm',
			bufferSize: 2048,
			sampleRate: 44100
		}

		let cleanup

		if (mediaStream) {
			const mediaRecorder = new MediaRecorder(mediaStream, options)

			cleanup = () => {
				if (mediaRecorder.state === 'recording')
					mediaRecorder.stop()
			}

			mediaRecorder.onstart = () => {
				console.log('started recording')
				setStartTime(Date.now())
				chunks.current = []
				setIsRecording(true)
			}

			mediaRecorder.onstop = () => {
				console.log('stopped recording')
				const blob = new Blob(chunks.current, { type: 'audio/webm' })

				let blobObject = {
					blob,
					startTime: startTime,
					stopTime: Date.now(),
					options: options,
					blobURL: window.URL.createObjectURL(blob)
				}

				console.log(blobObject)

				setIsRecording(false)
				setStartTime(null)
				setSample(blobObject)
			}

			mediaRecorder.ondataavailable = (event) => {
				console.log('data_available')

				onDataAvailable?.(event)

				if (event.data.size > 0) {
					chunks.current.push(event.data)
				}
			}
			setRecorder(mediaRecorder)
		}

		return () => {
			if (typeof cleanup === 'function')
				cleanup()
		}
	}, [mediaStream, onDataAvailable, startTime])

	return {
		recorder,
		startTime,
		isRecording,
		sample
	}
}