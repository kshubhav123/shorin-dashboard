import React, { useState, useEffect, useRef } from 'react';
import {
  Mic,
  Sparkles,
  Volume2,
  VolumeX,
  X,
  Send,
  HelpCircle,
  CheckCircle2,
  AlertCircle,
  Radio,
  Music,
  Folder,
  StickyNote,
  Video,
  Mail,
  Lock,
} from 'lucide-react';
import type { NavTab } from '../../types';
import { useMusic } from '../../context/MusicContext';
import {
  interpretVoiceCommand,
  speakVoiceFeedback,
  type VoiceCommandResult,
} from '../../services/aiVoiceEngine';

interface AIVoiceAssistantProps {
  currentTab: NavTab;
  onSelectTab: (tab: NavTab) => void;
  onOpenContact: () => void;
  onOpenSettings: () => void;
  onOpenNotifications: () => void;
  onCloseModals: () => void;
  onLogout: () => void;
  isOpenExternal?: boolean;
  onCloseExternal?: () => void;
}

export const AIVoiceAssistant: React.FC<AIVoiceAssistantProps> = ({
  currentTab: _currentTab,
  onSelectTab,
  onOpenContact,
  onOpenSettings,
  onOpenNotifications,
  onCloseModals,
  onLogout,
  isOpenExternal,
  onCloseExternal,
}) => {
  const {
    togglePlayPause,
    nextSong,
    prevSong,
    toggleMute,
    volume,
    setVolume,
  } = useMusic();

  const [isOpen, setIsOpen] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [speechSupported, setSpeechSupported] = useState(true);
  const [voiceVoiceEnabled, setVoiceFeedbackEnabled] = useState(true);
  const [textInput, setTextInput] = useState('');
  const [lastTranscript, setLastTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [lastResult, setLastResult] = useState<VoiceCommandResult | null>(null);
  const [isExecuting, setIsExecuting] = useState(false);
  const [micError, setMicError] = useState<string | null>(null);

  const recognitionRef = useRef<any>(null);
  const accumulatedSpeechRef = useRef<string>('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync external open trigger (e.g. from Header button)
  useEffect(() => {
    if (typeof isOpenExternal === 'boolean') {
      setIsOpen(isOpenExternal);
      if (isOpenExternal) {
        setTimeout(() => startListening(), 250);
      }
    }
  }, [isOpenExternal]);

  const handleClose = () => {
    stopListening();
    setIsOpen(false);
    if (onCloseExternal) onCloseExternal();
  };

  /**
   * Execute oral or clicked command cleanly
   */
  const executeCommand = (commandText: string) => {
    const clean = commandText.trim();
    if (!clean) return;

    setIsExecuting(true);
    setLastTranscript(clean);
    setInterimTranscript('');
    accumulatedSpeechRef.current = '';

    const result = interpretVoiceCommand(clean);
    setLastResult(result);

    // Short spoken confirmation
    if (voiceVoiceEnabled && result.speechReply) {
      speakVoiceFeedback(result.speechReply, true);
    }

    // Perform software action
    switch (result.type) {
      case 'NEXT_SONG':
        nextSong();
        break;

      case 'PREV_SONG':
        prevSong();
        break;

      case 'PLAY_MUSIC':
      case 'PAUSE_MUSIC':
      case 'TOGGLE_PLAY':
        togglePlayPause();
        break;

      case 'MUTE_MUSIC':
      case 'UNMUTE_MUSIC':
        toggleMute();
        break;

      case 'VOLUME_UP':
        setVolume(Math.min(1, volume + 0.15));
        break;

      case 'VOLUME_DOWN':
        setVolume(Math.max(0, volume - 0.15));
        break;

      case 'NAV_TAB':
        if (result.tab) {
          onSelectTab(result.tab);
        }
        break;

      case 'OPEN_CONTACT':
        onOpenContact();
        break;

      case 'OPEN_SETTINGS':
        onOpenSettings();
        break;

      case 'OPEN_NOTIFICATIONS':
        onOpenNotifications();
        break;

      case 'CLOSE_MODAL':
        onCloseModals();
        break;

      case 'LOCK_DASHBOARD':
        onLogout();
        break;

      case 'SCROLL_DOWN':
        window.scrollBy({ top: 400, behavior: 'smooth' });
        break;

      case 'SCROLL_UP':
        window.scrollTo({ top: 0, behavior: 'smooth' });
        break;

      default:
        break;
    }

    setTimeout(() => {
      setIsExecuting(false);
    }, 1200);
  };

  /**
   * Simple 1-Click Push-to-Talk Speech Recognition
   */
  const startListening = async () => {
    const SpeechRecognition =
      (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechSupported(false);
      return;
    }

    // Stop existing instance
    if (recognitionRef.current) {
      try {
        recognitionRef.current.abort();
      } catch {}
      recognitionRef.current = null;
    }

    // Request mic access cleanly
    if (navigator.mediaDevices?.getUserMedia) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        stream.getTracks().forEach((t) => t.stop());
        setMicError(null);
      } catch (err: any) {
        if (err.name === 'NotAllowedError') {
          setMicError('Microphone blocked. Please allow mic access in your browser address bar.');
          return;
        }
      }
    }

    try {
      const recognition = new SpeechRecognition();
      // Single clean session: stops automatically once you finish speaking
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-IN'; // Works best for Indian English, Hindi & Hinglish
      recognition.maxAlternatives = 1;

      accumulatedSpeechRef.current = '';

      recognition.onstart = () => {
        setIsListening(true);
        setInterimTranscript('');
        setMicError(null);
      };

      recognition.onresult = (event: any) => {
        let interim = '';
        let final = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          const chunk = event.results[i][0]?.transcript || '';
          if (event.results[i].isFinal) {
            final += chunk;
          } else {
            interim += chunk;
          }
        }

        if (interim) {
          setInterimTranscript(interim);
          accumulatedSpeechRef.current = interim;
        }

        if (final.trim()) {
          accumulatedSpeechRef.current = final.trim();
          executeCommand(final.trim());
        }
      };

      recognition.onerror = (event: any) => {
        if (event.error === 'not-allowed') {
          setMicError('Microphone permission blocked. Please allow mic in browser settings.');
        }
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
        // Fallback: If interim speech was recorded but final event wasn't fired, execute accumulated speech
        if (accumulatedSpeechRef.current.trim() && !lastTranscript) {
          executeCommand(accumulatedSpeechRef.current.trim());
        }
      };

      recognition.start();
      recognitionRef.current = recognition;
    } catch (e) {
      console.warn('Speech recognition start error:', e);
      setIsListening(false);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {}
      recognitionRef.current = null;
    }
    setIsListening(false);
  };

  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {}
      }
    };
  }, []);

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textInput.trim()) return;
    executeCommand(textInput);
    setTextInput('');
  };

  const quickCommands = [
    { label: 'Next Song ⏭️', action: 'next song', icon: <Music size={13} /> },
    { label: 'Pause / Play ⏯️', action: 'play music', icon: <Radio size={13} /> },
    { label: 'Open Projects 💼', action: 'open projects', icon: <Folder size={13} /> },
    { label: 'Open Notepad 📝', action: 'open notepad', icon: <StickyNote size={13} /> },
    { label: 'Open Videos 🎬', action: 'open videos', icon: <Video size={13} /> },
    { label: 'Contact Shorin 📬', action: 'open contact', icon: <Mail size={13} /> },
    { label: 'Lock Screen 🔒', action: 'lock dashboard', icon: <Lock size={13} /> },
  ];

  return (
    <>
      {/* 1. Floating AI Assistant Button (Simple & Clean) */}
      {!isOpen && (
        <div className="fixed bottom-20 md:bottom-7 left-4 sm:left-6 z-40">
          <button
            onClick={() => {
              setIsOpen(true);
              setTimeout(() => startListening(), 200);
            }}
            className="group relative flex items-center gap-2.5 px-3.5 py-2.5 sm:px-4 sm:py-3 rounded-full bg-[#111827]/95 hover:bg-[#1F2937] text-white border border-white/15 backdrop-blur-xl shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
            title="Crowz AI Voice Assistant • Tap to Speak"
          >
            {/* Glowing Accent */}
            <span className="absolute -inset-1 rounded-full bg-gradient-to-r from-[#14B8A6] to-[#DF886F] opacity-30 group-hover:opacity-60 blur-xs transition-opacity" />

            <div className="relative flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-gradient-to-tr from-[#14B8A6] to-[#0D9488] text-white shadow-md shadow-[#14B8A6]/30">
              <Sparkles size={16} />
            </div>

            <div className="relative flex flex-col text-left pr-1">
              <span className="font-display font-bold text-xs sm:text-sm tracking-tight text-white">
                Crowz AI
              </span>
              <span className="text-[10px] text-neutral-400 font-medium">
                Tap to Speak
              </span>
            </div>

            <div className="relative pl-1 border-l border-white/10 text-[#14B8A6]">
              <Mic size={15} />
            </div>
          </button>
        </div>
      )}

      {/* 2. Simple & Sleek Voice Assistant Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-6 bg-black/60 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md bg-[#0E131F]/95 backdrop-blur-2xl border border-white/15 rounded-[28px] sm:rounded-[32px] p-5 sm:p-6 shadow-2xl text-white overflow-hidden animate-slideUp">
            
            {/* Ambient Background Glow */}
            <div className="absolute -top-20 -left-20 w-48 h-48 bg-[#14B8A6]/20 rounded-full blur-[70px] pointer-events-none" />
            <div className="absolute -bottom-20 -right-20 w-48 h-48 bg-[#DF886F]/20 rounded-full blur-[70px] pointer-events-none" />

            {/* Header */}
            <div className="relative flex items-center justify-between pb-3.5 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#14B8A6] to-[#0D9488] flex items-center justify-center shadow-md shadow-[#14B8A6]/30">
                  <Sparkles size={18} className="text-white" />
                </div>
                <div>
                  <h3 className="font-display font-bold text-base sm:text-lg text-white tracking-tight">
                    Voice Assistant
                  </h3>
                  <p className="text-[11px] text-neutral-400">
                    {isListening ? (
                      <span className="text-[#14B8A6] font-semibold">🎙️ Sun raha hoon... Boliye</span>
                    ) : isExecuting ? (
                      <span className="text-amber-400 font-semibold">Executing command...</span>
                    ) : (
                      <span>Tap mic and speak your command</span>
                    )}
                  </p>
                </div>
              </div>

              {/* Controls: Mute voice replies & Close */}
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setVoiceFeedbackEnabled(!voiceVoiceEnabled)}
                  className={`p-2 rounded-xl transition-all cursor-pointer ${
                    voiceVoiceEnabled
                      ? 'bg-white/10 text-[#14B8A6] hover:bg-white/15'
                      : 'bg-white/5 text-neutral-500 hover:text-white'
                  }`}
                  title={voiceVoiceEnabled ? 'Voice reply ON' : 'Voice reply OFF'}
                >
                  {voiceVoiceEnabled ? <Volume2 size={16} /> : <VolumeX size={16} />}
                </button>

                <button
                  type="button"
                  onClick={handleClose}
                  className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-neutral-400 hover:text-white transition-all cursor-pointer"
                  title="Close"
                >
                  <X size={16} />
                </button>
              </div>
            </div>

            {/* Central Big Interactive Mic Button */}
            <div className="relative py-6 flex flex-col items-center justify-center text-center">
              
              {/* Pulsing Ring when Active */}
              <div className="relative mb-4 flex items-center justify-center">
                {isListening && (
                  <>
                    <span className="absolute w-24 h-24 rounded-full bg-[#14B8A6]/20 animate-ping pointer-events-none" />
                    <span className="absolute w-20 h-20 rounded-full bg-[#14B8A6]/30 animate-pulse pointer-events-none" />
                  </>
                )}

                <button
                  type="button"
                  onClick={toggleListening}
                  className={`relative z-10 w-18 h-18 rounded-full flex items-center justify-center shadow-2xl transition-all duration-200 cursor-pointer ${
                    isListening
                      ? 'bg-[#14B8A6] text-white scale-110 shadow-lg shadow-[#14B8A6]/50 ring-4 ring-[#14B8A6]/30'
                      : 'bg-[#1B2234] hover:bg-[#232C42] text-[#14B8A6] hover:scale-105 active:scale-95 border border-white/10'
                  }`}
                  title={isListening ? 'Listening... Tap to stop' : 'Tap to Speak'}
                >
                  {isListening ? (
                    <Mic size={30} className="animate-pulse" />
                  ) : (
                    <Mic size={28} />
                  )}
                </button>
              </div>

              {/* Instructions */}
              <div className="space-y-1 max-w-xs">
                <p className="font-semibold text-xs text-neutral-200">
                  {isListening ? (
                    <span className="text-[#14B8A6] font-bold">
                      Boliye, sun raha hoon...
                    </span>
                  ) : (
                    <span>Click mic above & say:</span>
                  )}
                </p>
                <p className="text-[12px] text-neutral-400">
                  <span className="text-white font-medium">"Change song"</span> •{' '}
                  <span className="text-white font-medium">"Open projects"</span> •{' '}
                  <span className="text-white font-medium">"Open notepad"</span>
                </p>
              </div>

              {/* Audio Soundwaves Animation */}
              {isListening && (
                <div className="flex items-center gap-1 mt-3 h-5">
                  {[40, 75, 50, 95, 60, 90, 45, 80, 55, 70].map((h, i) => (
                    <span
                      key={i}
                      className="w-1 bg-[#14B8A6] rounded-full animate-pulse"
                      style={{
                        height: `${h}%`,
                        animationDuration: `${0.35 + (i % 4) * 0.15}s`,
                      }}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Error Message if Mic Blocked */}
            {micError && (
              <div className="mb-3.5 p-2.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
                <AlertCircle size={15} className="shrink-0 text-red-400" />
                <span>{micError}</span>
              </div>
            )}

            {/* Live Transcript / Result Feedback */}
            {(interimTranscript || lastTranscript || lastResult) && (
              <div className="mb-3.5 p-3 rounded-2xl bg-white/5 border border-white/10 space-y-1.5 text-xs">
                {/* Heard speech */}
                <div className="flex items-start gap-1.5">
                  <span className="text-neutral-400 font-semibold uppercase tracking-wider text-[10px] shrink-0 pt-0.5">
                    Heard:
                  </span>
                  <p className="text-white font-medium italic">
                    "{interimTranscript || lastTranscript}"
                  </p>
                </div>

                {/* AI execution feedback */}
                {lastResult && (
                  <div className="flex items-center gap-1.5 pt-1.5 border-t border-white/10 text-xs text-[#14B8A6] font-medium">
                    {lastResult.type !== 'UNKNOWN' ? (
                      <CheckCircle2 size={14} className="shrink-0" />
                    ) : (
                      <AlertCircle size={14} className="shrink-0 text-amber-400" />
                    )}
                    <span>{lastResult.displayText}</span>
                  </div>
                )}
              </div>
            )}

            {/* Quick 1-Click Action Chips */}
            <div className="space-y-1.5 mb-3.5">
              <span className="text-[10.5px] font-semibold uppercase tracking-wider text-neutral-400 flex items-center gap-1">
                <HelpCircle size={11} className="text-[#14B8A6]" />
                <span>Quick Actions (Bol sakte hain ya click karein):</span>
              </span>
              <div className="flex flex-wrap gap-1.5">
                {quickCommands.map((cmd) => (
                  <button
                    key={cmd.action}
                    type="button"
                    onClick={() => {
                      executeCommand(cmd.action);
                    }}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-neutral-300 hover:text-white text-xs font-medium transition-all active:scale-95 cursor-pointer"
                  >
                    <span className="text-[#14B8A6]">{cmd.icon}</span>
                    <span>{cmd.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Manual Text Command Input */}
            <form onSubmit={handleFormSubmit} className="relative flex items-center">
              <input
                ref={inputRef}
                type="text"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder="Or type here: 'change song', 'open projects'..."
                className="w-full bg-[#080B12] text-white placeholder-neutral-500 text-xs rounded-xl pl-3.5 pr-10 py-2.5 border border-white/10 focus:border-[#14B8A6] focus:outline-hidden transition-all shadow-inner"
              />
              <button
                type="submit"
                disabled={!textInput.trim()}
                className="absolute right-1.5 p-1.5 rounded-lg bg-[#14B8A6] hover:bg-[#0D9488] disabled:opacity-30 disabled:cursor-not-allowed text-white transition-all cursor-pointer"
                title="Send Command"
              >
                <Send size={13} />
              </button>
            </form>

            {!speechSupported && (
              <p className="mt-2 text-[10.5px] text-amber-400 text-center">
                Speech recognition not supported in this browser. Please type commands above.
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
};

export default AIVoiceAssistant;
