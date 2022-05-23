export class Sound {
	constructor(audioCTX, sample, onPlay, onPause, onEnded) {
		this.audioCTX = audioCTX
		this.sample = sample
		this.status = 'stopped'
		this.startedAt = 0
		this.elapsed = 0

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
		this.source.start(0, this.elapsed)
		this.startedAt = this.audioCTX.context.currentTime - this.elapsed
		this.status = 'playing'

		this.source.onended = () => {

			if (this.status === 'playing' && this.source)
				this.stop()

			if (this.status === 'stopped' && this.onEnded) {
				this.onEnded()
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

	getDuration = () => {
		if (this.duration)
			return this.duration
		return 0
	}
}