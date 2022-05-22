export class Recorder {
	constructor(audioContext, device, onStart, onStop, onSave, onData) {
		this.audioContext = audioContext
		this.device = device
		this.onStartCallback = onStart
		this.onStopCallback = onStop
		this.onSaveCallback = onSave
		this.onDataCallback = onData

		this.options = {
			mimeType: 'audio/webm',
			bufferSize: 2048,
			sampleRate: 44100
		}

		this.mediaRecorder = new MediaRecorder(this.device, this.options)
		this.startTime = null
		this.stream = null
		this.analyser = null
		this.chunks = []
	}

	clearData = () => {
		this.chunks = []
	}

	stopRecording = () => {
		this.recording = false
		if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
			this.mediaRecorder.stop()

			this.device.getAudioTracks().forEach(track => track.stop())
			this.mediaRecorder = null
			this.analyser = this.audioContext.createAnalyser()
		}
	}

	onStopRecorder = () => {
		const blob = new Blob(this.chunks, { type: this.options.mimeType })

		let blobObject = {
			blob,
			startTime: this.startTime,
			stopTime: Date.now(),
			options: this.options,
			blobURL: window.URL.createObjectURL(blob)
		}
		if (this.onStopCallback) {
			this.onStopCallback(blobObject)
		}
		if (this.onSaveCallback) {
			this.onSaveCallback(blobObject)
		}
		this.startTime = null
		this.clearData()
	}

	onDataAvailable = (event) => {
		if (event.data.size > 0) {
			this.chunks.push(event.data)
		}
		if (this.onDataCallback) {
			this.onDataCallback(event.data)
		}
	}

	startRecording = () => {
		this.recording = true
		this.startTime = Date.now()

		if (this.onStartCallback) {
			this.onStartCallback()
		}


		console.log(this.device)

		this.mediaRecorder.onstop = this.onStopRecorder

		this.mediaRecorder.ondataavailable = this.onDataAvailable

		this.audioContext.resume().then(() => {
			this.analyser = this.audioContext.createAnalyser()

			this.mediaRecorder.start(10)
			const source = this.audioContext.createMediaStreamSource(this.device)
			source.connect(this.analyser)
		})
	}
}
