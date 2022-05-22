class AudioCTX {
  constructor() {
    const AudioContext = window.AudioContext || window.webkitAudioContext

    this.context = new AudioContext()
    this.analizer = this.context.createAnalyser()
  }

  resetAnalizer = () => {
    this.analizer = this.context.createAnalyser()
  }
}

const createAudioContext = () => {
  return new AudioCTX()
}

export default createAudioContext
