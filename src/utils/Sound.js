export class Sound {
	constructor(audioCTX, sample, onPlay, onPause, onEnded) {
		this.audioCTX = audioCTX
		this.sample = sample
		this.status = 'stopped'
		this.startedAt = 0
		this.elapsed = 0

		this.startPoint = 0
		this.endPoint = 1
		this.loop = false

		this.onEnded = onEnded
		this.onPlay = onPlay
		this.onPause = onPause

		this.source = null
		this.audioBuffer = null

		this.getSampleDuration(sample)
	}

	getSampleDuration = async (sample) => {
		const buffer = await (new Response(sample.blob)).arrayBuffer()
		const audioBuffer = await this.audioCTX.context.decodeAudioData(buffer)
		this.duration = audioBuffer.duration

		if (!this.audioBuffer)
			this.audioBuffer = audioBuffer
	}

	setOffset = async (offset) => {
		this.elapsed = offset

		if (this.status === 'playing') {
			this.pause()
			this.elapsed = offset
			await new Promise(resolve => setTimeout(resolve, 30)) // allow source.onended to get called
			await this.play()
		}
	}

	play = async () => {
		if (!this.audioBuffer) {
			const buffer = await (new Response(this.sample.blob)).arrayBuffer()
			this.audioBuffer = await this.audioCTX.context.decodeAudioData(buffer)
		}


		this.source = this.audioCTX.context.createBufferSource()
		this.source.buffer = this.audioBuffer
		this.source.connect(this.audioCTX.context.destination)

		this.source.start(0, this.elapsed + (this.duration * this.startPoint), (this.getDuration() - this.elapsed) || 0)
		this.startedAt = this.audioCTX.context.currentTime - this.elapsed
		this.status = 'playing'

		this.source.onended = () => {
			if (this.status === 'playing' && this.source)
				this.stop()

			if (this.status === 'stopped' && this.onEnded) {
				this.onEnded()
			}

			if (this.loop && this.status === 'stopped') {
				this.status = 'playing'
				this.setOffset(0)
			}
		}

		this.onPlay?.()
	}

	stopReplay = () => {
		if (this.source) {
			this.source.disconnect()
			this.source.stop()
			this.source = null
		}
	}

	pause = () => {
		this.status = 'paused'
		this.stopReplay()
		this.elapsed = this.audioCTX.context.currentTime - this.startedAt
		this.onPause?.()
	}

	stop = () => {
		this.status = 'stopped'
		this.stopReplay()
		this.startedAt = 0
		this.elapsed = 0
	}

	getElapsedTime = () => {
		if (this.status !== 'playing' && this.elapsed)
			return this.elapsed
		else if (this.startedAt)
			return this.audioCTX.context.currentTime - this.startedAt
		return 0
	}

	getCursorPosition = () => {
		return (this.duration * this.startPoint + this.getElapsedTime()) / this.duration
	}

	getDuration = () => {
		if (this.duration) {
			const start = this.duration * this.startPoint
			const end = this.duration * this.endPoint

			return end - start
		}
		return 0
	}

	getTruncatedBuffer = () => {
		if (!this.audioBuffer)
			return null

		const start = (this.duration * this.startPoint)
		const end = (this.duration * (1 - (1 - this.endPoint) - this.startPoint))

		const startOffset = this.audioBuffer.sampleRate * start
		const endOffset = startOffset + (this.audioBuffer.sampleRate * end)
		const frameCount = endOffset - startOffset

		let newBuff = null

		try {
			const tmpBuff = new Float32Array(frameCount)

			newBuff = this.audioCTX.context.createBuffer(
				this.audioBuffer.numberOfChannels,
				endOffset - startOffset,
				this.audioBuffer.sampleRate
			)

			for (let chann = 0; chann < this.audioBuffer.numberOfChannels; chann += 1) {
				this.audioBuffer.copyFromChannel(tmpBuff, chann, startOffset)
				newBuff.copyToChannel(tmpBuff, chann, 0)
			}
		} catch (err) {
			console.error(err)
		}

		return newBuff
	}
}