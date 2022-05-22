import { register } from 'extendable-media-recorder'
import { connect } from 'extendable-media-recorder-wav-encoder'
import { useEffect, useState } from 'react'

export default function useMediaStream(audioCTX) {
	const [mediaStream, setMediaStream] = useState(null)
	const [registered, setRegistered] = useState(false)

	useEffect(() => {
		let cleanup

		const setAudioDevice = async () => {
			if (!registered) {
				await register(await connect())  // register wav codec
				setRegistered(true)
			}
			const stream = await navigator.mediaDevices.getUserMedia({
				audio: true,
				video: false
			})

			await audioCTX.context.resume()


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
	}, [registered, audioCTX])

	return mediaStream
}