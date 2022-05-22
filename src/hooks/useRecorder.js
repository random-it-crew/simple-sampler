import { MediaRecorder } from 'extendable-media-recorder'
import { useEffect, useRef, useState } from 'react'

export default function useRecorder({ mediaStream, onDataAvailable }) {
	const [recorder, setRecorder] = useState(null)
	const [isRecording, setIsRecording] = useState(false)
	const [sample, setSample] = useState(null)
	const chunks = useRef([])

	useEffect(() => {
		const options = {
			mimeType: 'audio/wav'
		}

		let cleanup
		let startTime

		if (mediaStream) {
			const mediaRecorder = new MediaRecorder(mediaStream, options)

			cleanup = () => {
				if (mediaRecorder.state === 'recording')
					mediaRecorder.stop()
			}

			mediaRecorder.onstart = () => {
				console.log('started recording')
				startTime = Date.now()
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
				startTime = null
				setSample(blobObject)
			}

			mediaRecorder.ondataavailable = (event) => {
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
	}, [mediaStream, onDataAvailable])

	return {
		recorder,
		isRecording,
		sample
	}
}