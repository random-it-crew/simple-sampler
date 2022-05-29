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
				startTime = Date.now()
				chunks.current = []
				setIsRecording(true)
			}

			mediaRecorder.onstop = () => {
				const blob = new Blob(chunks.current, { type: 'audio/webm' })

				let blobObject = {
					blob,
					startTime: startTime,
					stopTime: Date.now(),
					options: options,
					filename: 'sample.wav'
				}

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