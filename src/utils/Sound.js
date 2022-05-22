export class Sound {
	constructor(audioCTX, sample, onPlay, onPause, onEnded) {
		this.audioCTX = audioCTX
		this.sample = sample
		this.playing = false
		this.startedAt = 0
		this.elapsed = 0
		this.source = null
		this.onEnded = onEnded
		this.onPlay = onPlay
		this.onPause = onPause
	}

	play = async () => {
		const buffer = await (new Response(this.sample.blob)).arrayBuffer()
		const audioBuffer = await this.audioCTX.context.decodeAudioData(buffer)
		this.source = this.audioCTX.context.createBufferSource()

		this.source.buffer = audioBuffer
		this.source.connect(this.audioCTX.context.destination)
		this.source.start(0, this.elapsed)

		this.startedAt = this.audioCTX.context.currentTime

		this.source.onended = () => {
			if (this.playing) {
				this.stop()
			}
		}
		this.onPlay?.()
		this.playing = true
	}

	pause = () => {
		this.stop(true)
		this.elapsed = this.audioCTX.context.currentTime - this.startedAt
		this.onPause?.()
	}

	stop = (ignoreHandler) => {
		this.playing = false

		if (this.source) {
			this.source.disconnect()
			this.source.stop()
			this.source = null
		}

		if (!ignoreHandler) {
			this.startedAt = 0
			this.elapsed = 0
			this.onEnded?.()
		}
	}

	getElapsedTime = () => {
		if (this.elapsed)
			return this.elapsed
		else if (this.startedAt)
			return this.audioCTX.context.currentTime - this.startedAt
		return 0
	}

	getDuration = () => {
		if (this.source.buffer)
			return this.source.buffer.duration
		return 0
	}
}