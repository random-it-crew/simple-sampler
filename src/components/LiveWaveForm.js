import useWindowDimensions from '../hooks/useWindowDimensions'
import React, { useEffect, useState } from 'react'

export const LiveWaveForm = ({ mediaStream, audioCTX }) => {
	const { width } = useWindowDimensions()
	const [canvasRef, setCanvasRef] = useState(null)


	useEffect(() => {
		if (!canvasRef || !audioCTX || !mediaStream) {
			return
		}

		let drawVisual
		let source = audioCTX.context.createMediaStreamSource(mediaStream)
		let analyser = audioCTX.analizer

		analyser.fftSize = 2048
		source.connect(analyser)

		let bufferLength = analyser.frequencyBinCount
		let dataArray = new Uint8Array(bufferLength)
		analyser.getByteTimeDomainData(dataArray)

		let canvasCtx = canvasRef.getContext('2d')
		let HEIGHT = canvasRef.height
		let WIDTH = canvasRef.width

		function draw() {
			drawVisual = requestAnimationFrame(draw)

			analyser.getByteTimeDomainData(dataArray)

			canvasCtx.fillStyle = 'rgb(255, 23, 23)'
			canvasCtx.fillRect(0, 0, WIDTH, HEIGHT)

			canvasCtx.lineWidth = 3
			canvasCtx.strokeStyle = 'rgb(255, 255, 255)'

			canvasCtx.beginPath()

			let sliceWidth = WIDTH * 1.0 / bufferLength
			let x = 0

			for (let i = 0; i < bufferLength; i++) {
				let v = dataArray[i] / 128.0
				let y = v * HEIGHT / 2

				if (i === 0) {
					canvasCtx.moveTo(x, y)
				} else {
					canvasCtx.lineTo(x, y)
				}

				x += sliceWidth
			}

			canvasCtx.lineTo(canvasRef.width, canvasRef.height / 2)
			canvasCtx.stroke()
		}

		draw()

		return () => {
			cancelAnimationFrame(drawVisual)
		}
	}, [audioCTX, canvasRef, mediaStream])

	return <canvas ref={ setCanvasRef } height={ 200 } width={ width }/>
}