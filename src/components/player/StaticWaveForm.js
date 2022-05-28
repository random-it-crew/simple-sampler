import React, { useEffect, useState } from 'react'
import useWindowDimensions from '../../hooks/useWindowDimensions'
import styled from 'styled-components'


const padding = 10

const CanvasContainer = styled.div`
	padding-left: ${padding}px;
	padding-right: ${padding}px;
`


export const StaticWaveForm = ({
								   audioCTX, sample, currentSample, onWaveFormClick, setMouseDown, onMouseMove, points
}) => {
	const [canvasRef, setCanvasRef] = useState(null)
	const [canvasCtx, setCanvasCtx] = useState(null)
	const [imageData, setImageData] = useState(null)
	const [start, end] = points
	const { width: windowWidth } = useWindowDimensions()

	useEffect(() => {
		if (!canvasRef || !canvasCtx || !audioCTX || !sample)
			return

		const filterData = (audioBuffer) => {
			const rawData = audioBuffer.getChannelData(0) // We only need to work with one channel of data
			const samples = rawData.length / 15 // Number of samples we want to have in our final data set
			const blockSize = Math.floor(rawData.length / samples) // the number of samples in each subdivision
			const filteredData = []
			for (let i = 0; i < samples; i++) {
				let blockStart = blockSize * i // the location of the first sample in the block
				let sum = 0
				for (let j = 0; j < blockSize; j++) {
					sum = sum + Math.abs(rawData[blockStart + j]) // find the sum of all the samples in the block
				}
				filteredData.push(sum / blockSize) // divide the sum by the block size to get the average
			}
			return filteredData
		}

		const normalizeData = (filteredData) => {
			const multiplier = Math.pow(Math.max(...filteredData), -1)
			return filteredData.map((n) => n * multiplier)
		}

		const draw = (normalizedData) => {
			// set up the canvas


			canvasRef.width = canvasRef.offsetWidth
			canvasRef.height = canvasRef.offsetHeight

			const sampleStart = canvasRef.width * start
			const sampleEnd = canvasRef.width - (sampleStart + canvasRef.width * (1 - end))
			const endWidth = sampleEnd + sampleStart

			// fill up to starting point
			canvasCtx.fillStyle = 'rgb(44, 55, 44)'
			canvasCtx.fillRect(0, 0, sampleStart, canvasRef.height)

			// fill playable area
			canvasCtx.fillStyle = 'rgb(66, 66, 88)'
			canvasCtx.fillRect(canvasRef.width * start, 0, sampleEnd, canvasRef.height)

			// fill up to end point
			canvasCtx.fillStyle = 'rgb(44, 55, 44)'
			canvasCtx.fillRect(endWidth, 0, canvasRef.width - endWidth, canvasRef.height)

			canvasCtx.translate(0, canvasRef.offsetHeight / 2)

			const width = canvasRef.offsetWidth / normalizedData.length

			for (let i = 0; i < normalizedData.length; i++) {
				const x = width * i
				let height = normalizedData[i] * canvasRef.offsetHeight
				if (height < 0) {
					height = 0
				} else if (height > canvasRef.offsetHeight / 2) {
					height = height > canvasRef.offsetHeight / 2
				}

				drawLineSegment(canvasCtx, x, height, width, (i + 1) % 2)
			}
			setImageData(canvasCtx.getImageData(0, 0, canvasRef.width, canvasRef.height))
		}

		const drawLineSegment = (ctx, x, height, width, isEven) => {
			canvasCtx.lineWidth = 1 // how thick the line is
			canvasCtx.strokeStyle = 'rgb(255, 255, 255)'
			canvasCtx.beginPath()
			height = isEven ? height : -height

			canvasCtx.moveTo(x, 0)
			canvasCtx.lineTo(x + width / 2, height)
			canvasCtx.lineTo(x + width, 0)
			canvasCtx.stroke()
		}

		const drawAudio = async () => {
			const buffer = await (new Response(sample.blob)).arrayBuffer()
			const audioBuffer = await audioCTX.context.decodeAudioData(buffer)

			draw(normalizeData(filterData(audioBuffer)))
		}

		drawAudio()
	}, [audioCTX, sample, canvasRef, windowWidth, canvasCtx, start, end])


	useEffect(() => {
		if (!canvasRef || !audioCTX || !sample || !currentSample)
			return

		setCanvasCtx(canvasRef.getContext('2d'))
	}, [audioCTX, sample, canvasRef, currentSample])


	useEffect(() => {
		if (!currentSample || !canvasCtx || !imageData)
			return

		let frameID
		const updateCursor = () => {
			frameID = requestAnimationFrame(updateCursor)
			canvasCtx.putImageData(imageData, 0, 0)

			const cursorPos = currentSample.getCursorPosition() * canvasRef.width
			canvasCtx.lineWidth = 3 // how thick the line is
			canvasCtx.strokeStyle = 'rgb(75, 75, 75)'
			canvasCtx.beginPath()

			canvasCtx.moveTo(cursorPos, -canvasRef.height)
			canvasCtx.lineTo(cursorPos, canvasRef.height)
			canvasCtx.stroke()
		}

		updateCursor()

		return () => {
			cancelAnimationFrame(frameID)
		}
	}, [currentSample, canvasRef, canvasCtx, imageData])


	return (
		<CanvasContainer>
			<canvas
				ref={ setCanvasRef }
				height={ 200 }
				width={ windowWidth - (2 * padding) }
				onMouseDown={ () => setMouseDown(true) }
				onMouseUp={ () => setMouseDown(false) }
				onMouseLeave={ () => setMouseDown(false) }
				onMouseMove={ (event) => {
					const rect = event.currentTarget.getBoundingClientRect()
					const x = event.clientX - rect.left

					onMouseMove(x / (rect.right - rect.left))
				} }
				onClick={
					(event) => {
						const rect = event.currentTarget.getBoundingClientRect()
						const x = event.clientX - rect.left

						onWaveFormClick(x / (rect.right - rect.left))
					}
				}
			/>
		</CanvasContainer>
	)
}