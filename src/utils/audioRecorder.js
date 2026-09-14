/**
 * Curie Clinical Audio Capture Engine
 * Captures 16kHz mono audio via Web Audio API, tracks RMS level,
 * and encodes to uncompressed 16-bit PCM WAV.
 */

export class ClinicalAudioRecorder {
  constructor(onAudioLevel = null) {
    this.onAudioLevel = onAudioLevel;
    this.mediaStream = null;
    this.audioContext = null;
    this.analyser = null;
    this.scriptProcessor = null;
    this.isRecording = false;
    this.audioChunks = [];
    this.sampleRate = 16000;
    this.startTime = 0;
    this.animFrameId = null;
  }

  async start() {
    this.audioChunks = [];
    this.isRecording = true;
    this.startTime = Date.now();

    this.mediaStream = await navigator.mediaDevices.getUserMedia({
      audio: {
        channelCount: 1,
        sampleRate: this.sampleRate,
        echoCancellation: true,
        noiseSuppression: true,
        autoGainControl: true,
      },
    });

    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    this.audioContext = new AudioContextClass({ sampleRate: this.sampleRate });
    const source = this.audioContext.createMediaStreamSource(this.mediaStream);

    this.analyser = this.audioContext.createAnalyser();
    this.analyser.fftSize = 256;
    this.analyser.smoothingTimeConstant = 0.8;
    source.connect(this.analyser);

    // Buffer size 4096 gives ~256ms frames at 16kHz
    const bufferSize = 4096;
    this.scriptProcessor = this.audioContext.createScriptProcessor(bufferSize, 1, 1);
    
    this.scriptProcessor.onaudioprocess = (e) => {
      if (!this.isRecording) return;
      const channelData = e.inputBuffer.getChannelData(0);
      this.audioChunks.push(new Float32Array(channelData));
    };

    source.connect(this.scriptProcessor);
    this.scriptProcessor.connect(this.audioContext.destination);

    this._trackVolume();
  }

  _trackVolume() {
    if (!this.isRecording || !this.analyser) return;

    const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(dataArray);

    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
      sum += dataArray[i];
    }
    const avg = sum / dataArray.length;
    const normalizedLevel = Math.min(1, avg / 128);

    if (this.onAudioLevel) {
      this.onAudioLevel(normalizedLevel, dataArray);
    }

    this.animFrameId = requestAnimationFrame(() => this._trackVolume());
  }

  async stop() {
    this.isRecording = false;
    const duration = (Date.now() - this.startTime) / 1000;

    if (this.animFrameId) {
      cancelAnimationFrame(this.animFrameId);
      this.animFrameId = null;
    }

    if (this.scriptProcessor) {
      this.scriptProcessor.disconnect();
      this.scriptProcessor = null;
    }

    if (this.audioContext && this.audioContext.state !== 'closed') {
      await this.audioContext.close();
      this.audioContext = null;
    }

    if (this.mediaStream) {
      this.mediaStream.getTracks().forEach((track) => track.stop());
      this.mediaStream = null;
    }

    // Combine Float32 chunks
    let totalLength = 0;
    for (const chunk of this.audioChunks) {
      totalLength += chunk.length;
    }

    const merged = new Float32Array(totalLength);
    let offset = 0;
    for (const chunk of this.audioChunks) {
      merged.set(chunk, offset);
      offset += chunk.length;
    }

    // Convert to 16-bit PCM WAV Blob
    const wavBlob = this._encodeWAV(merged, this.sampleRate);
    const audioUrl = URL.createObjectURL(wavBlob);

    return {
      blob: wavBlob,
      url: audioUrl,
      duration: duration.toFixed(1) + 's',
      durationSec: duration,
      sampleCount: totalLength,
    };
  }

  _encodeWAV(samples, sampleRate) {
    const buffer = new ArrayBuffer(44 + samples.length * 2);
    const view = new DataView(buffer);

    // RIFF identifier
    this._writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + samples.length * 2, true);
    this._writeString(view, 8, 'WAVE');

    // Format chunk identifier
    this._writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true); // format chunk size
    view.setUint16(20, 1, true); // PCM format
    view.setUint16(22, 1, true); // Mono channel
    view.setUint32(24, sampleRate, true); // Sample rate
    view.setUint32(28, sampleRate * 2, true); // Byte rate (SampleRate * 16-bit / 8)
    view.setUint16(32, 2, true); // Block align
    view.setUint16(34, 16, true); // Bits per sample

    // Data chunk identifier
    this._writeString(view, 36, 'data');
    view.setUint32(40, samples.length * 2, true);

    // Write PCM samples (convert Float32 [-1.0, 1.0] to Int16 [-32768, 32767])
    let index = 44;
    for (let i = 0; i < samples.length; i++) {
      let s = Math.max(-1, Math.min(1, samples[i]));
      view.setInt16(index, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
      index += 2;
    }

    return new Blob([view], { type: 'audio/wav' });
  }

  _writeString(view, offset, string) {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  }
}
