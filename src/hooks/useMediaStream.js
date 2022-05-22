import { useEffect, useState } from 'react'

export default function useMediaStream() {
	const [mediaStream, setMediaStream] = useState(null)

	useEffect(() => {
		let cleanup

		const setAudioDevice = async () => {
			const stream = await navigator.mediaDevices.getUserMedia({
				audio: true,
				video: false
			})

			cleanup = () => {
				stream.getTracks().forEach(track => track.stop())
			}
			setMediaStream(stream)
		}

		setAudioDevice()

		return () => {
			if (typeof cleanup === 'function')
				cleanup()
		}
	}, [])

	return mediaStream
}