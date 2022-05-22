import React, {useEffect, useState} from 'react'
import useMediaStream from './hooks/useMediaStream'
import useRecorder from './hooks/useRecorder'
import createAudioContext from "./utils/createAudioContext";


export const App = () => {
	const [audioContext] = useState(createAudioContext);
	const [canvasRef, setCanvasRef] = useState(null);
	const mediaStream = useMediaStream()
	const {
		recorder,
		isRecording,
		sample
	} = useRecorder({ mediaStream })

	useEffect(() => {
		if (!canvasRef || !audioContext || !mediaStream) {
			return;
		}

		var analyser = audioContext.createAnalyser();

		const microphone = audioContext.createMediaStreamSource(mediaStream);
		microphone.connect(analyser);
		analyser.fftSize = 2048;
		var bufferLength = analyser.frequencyBinCount;
		var dataArray = new Uint8Array(bufferLength);
		analyser.getByteTimeDomainData(dataArray);

		var canvasCtx = canvasRef.getContext('2d');
		var HEIGHT = canvasRef.height;
		var WIDTH = canvasRef.width;

		let drawVisual;
		function draw() {

			drawVisual = requestAnimationFrame(draw);

			analyser.getByteTimeDomainData(dataArray);

			canvasCtx.fillStyle = 'rgb(200, 200, 200)';
			canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

			canvasCtx.lineWidth = 1;
			canvasCtx.strokeStyle = 'rgb(0, 0, 0)';

			canvasCtx.beginPath();

			var sliceWidth = WIDTH * 1.0 / bufferLength;
			var x = 0;

			for(var i = 0; i < bufferLength; i++) {

				var v = dataArray[i] / 128.0;
				var y = v * HEIGHT/2;

				if(i === 0) {
					canvasCtx.moveTo(x, y);
				} else {
					canvasCtx.lineTo(x, y);
				}

				x += sliceWidth;
			}

			canvasCtx.lineTo(canvasRef.width, canvasRef.height/2);
			canvasCtx.stroke();
		};

		draw();

		return () => {
			cancelAnimationFrame(drawVisual)
		}
	}, [audioContext, canvasRef, mediaStream])

	return (
		<div>
			<canvas ref={setCanvasRef} height={100} width={400}/>
			<button
				onClick={ () => {
					if (recorder) {
						if (!isRecording) {
							recorder.start(10)
						} else {
							recorder.stop()
						}
					}
				} }
			>
				start / stop recording
			</button>
			{ sample !== null && <a href={ sample.blobURL } download="sample.webm">download</a> }
		</div>
	)
}
