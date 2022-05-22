import React, { useEffect, useState } from 'react'
import { WaveForm } from './WaveForm'


export const LiveWaveForm = ({ audioContext, device }) => {
	const [audioData, setAudioData] = useState(new Uint8Array(0))
	const [analizerData, setAnalyserData] = useState(new Uint8Array(0))
	const [analizer, setAnalizer] = useState(null)
	const [source, setSource] = useState(null)


	useEffect(() => {
		setAnalizer(audioContext.createAnalyser())
	}, [audioContext])

	useEffect(() => {
		setSource(() => audioContext.createMediaStreamSource(device))
	}, [audioContext, device])

	useEffect(() => {
		if (analizer !== null)
			setAnalyserData(new Uint8Array(analizer.frequencyBinCount))
	}, [analizer])

	useEffect(() => {
		if (source !== null && analizer !== null)
			source.connect(analizer)
	}, [source, analizer])

	useEffect(() => {
		let frame = null

		const tick = () => {
			if (analizer !== null) {
				analizer.getByteTimeDomainData(analizerData)
				setAudioData(analizerData)
			}
			frame = requestAnimationFrame(tick)
		}
		frame = requestAnimationFrame(tick)

		return () => {
			if (frame !== null)
				cancelAnimationFrame(frame)
			if (analizer !== null)
				analizer.disconnect()
			if (source !== null)
				source.disconnect()
		}
	}, [analizer, analizerData, source])

	return <WaveForm audioData={ audioData }/>
}

LiveWaveForm.propTypes = {
	audioContext: AudioContext,
	device: MediaStream
}