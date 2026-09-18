/**
 * Speech synthesis & recognition helpers for FinBot Voice Mode
 */

class VoiceService {
  private synth: SpeechSynthesis | null = null;
  private currentUtterance: SpeechSynthesisUtterance | null = null;
  private recognition: any = null;
  private isListeningState = false;

  constructor() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      this.synth = window.speechSynthesis;
    }
  }

  public speak(
    text: string,
    callbacks?: {
      onStart?: () => void;
      onEnd?: () => void;
      onError?: (err: any) => void;
    }
  ): void {
    if (!this.synth) {
      callbacks?.onEnd?.();
      return;
    }

    this.stopSpeaking();

    const utterance = new SpeechSynthesisUtterance(text);
    this.currentUtterance = utterance;

    utterance.rate = 1.0;
    utterance.pitch = 1.05; // warm, friendly tone
    utterance.lang = 'en-US';

    // Pick a natural English voice if available
    const voices = this.synth.getVoices();
    const preferredVoice = voices.find(
      (v) =>
        v.lang.startsWith('en') &&
        (v.name.includes('Natural') ||
          v.name.includes('Samantha') ||
          v.name.includes('Google') ||
          v.name.includes('Karen') ||
          v.name.includes('Daniel') ||
          v.name.includes('Ava'))
    ) || voices.find((v) => v.lang.startsWith('en'));

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    utterance.onstart = () => {
      callbacks?.onStart?.();
    };

    utterance.onend = () => {
      this.currentUtterance = null;
      callbacks?.onEnd?.();
    };

    utterance.onerror = (e) => {
      this.currentUtterance = null;
      callbacks?.onError?.(e);
      callbacks?.onEnd?.();
    };

    try {
      this.synth.speak(utterance);
    } catch (err) {
      console.warn('Speech synthesis error:', err);
      callbacks?.onEnd?.();
    }
  }

  public stopSpeaking(): void {
    if (this.synth) {
      this.synth.cancel();
      this.currentUtterance = null;
    }
  }

  public isSpeaking(): boolean {
    return !!(this.synth && this.synth.speaking);
  }

  public isRecognitionSupported(): boolean {
    return (
      typeof window !== 'undefined' &&
      ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window)
    );
  }

  public startListening(
    onResult: (transcript: string) => void,
    callbacks?: {
      onStart?: () => void;
      onEnd?: () => void;
      onError?: (error: any) => void;
    }
  ): boolean {
    if (!this.isRecognitionSupported()) {
      callbacks?.onError?.(new Error('Speech recognition not supported in this browser'));
      return false;
    }

    try {
      this.stopListening();

      // @ts-ignore
      const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRec();
      this.recognition.continuous = false;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';

      this.recognition.onstart = () => {
        this.isListeningState = true;
        callbacks?.onStart?.();
      };

      this.recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        const transcript = finalTranscript || interimTranscript;
        if (transcript) {
          onResult(transcript);
        }
      };

      this.recognition.onerror = (event: any) => {
        console.warn('Speech recognition error:', event.error);
        this.isListeningState = false;
        callbacks?.onError?.(event.error);
      };

      this.recognition.onend = () => {
        this.isListeningState = false;
        callbacks?.onEnd?.();
      };

      this.recognition.start();
      return true;
    } catch (err) {
      console.error('Failed to start speech recognition:', err);
      this.isListeningState = false;
      callbacks?.onError?.(err);
      return false;
    }
  }

  public stopListening(): void {
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch {
        // ignore
      }
      this.recognition = null;
    }
    this.isListeningState = false;
  }

  public isListening(): boolean {
    return this.isListeningState;
  }
}

export const voiceService = new VoiceService();
