import React, { useEffect, useState } from 'react'

export const SamplePlayer = ({ sample, audioCTX }) => {
	const [isPlaying, setIsPlaying] = useState(false)
	const [source, setSource] = useState(null)
	const [played, setPlayed] = useState(false)


	useEffect(() => {
		const createSourceBuffer = async () => {
			if (audioCTX && sample) {
				const buffer = await (new Response(sample.blob)).arrayBuffer()
				const audioBuffer = await audioCTX.context.decodeAudioData(buffer)
				const newSource = audioCTX.context.createBufferSource()

				newSource.onended = () => {
					setIsPlaying(false)
					setSource(null)
					setPlayed(false)
				}

				newSource.buffer = audioBuffer
				newSource.connect(audioCTX.context.destination)
				setSource(newSource)
				setPlayed(false)
			}
		}

		if (!source) {
			createSourceBuffer()
		}
	}, [source, audioCTX, sample])

	useEffect(() => {
		if (source) {
			if (isPlaying && !played) {
				console.log(source, isPlaying, played)
				source.start()
				setPlayed(true)
			} else if (!isPlaying && played) {
				source.stop()
				setSource(null)
				setPlayed(false)
			}
		}

	}, [isPlaying, played, source])

	return (
		<div>
			<button onClick={ () => setIsPlaying(!isPlaying) }>
				{ isPlaying ? 'stop' : 'play' }
			</button>
		</div>
	)
}
