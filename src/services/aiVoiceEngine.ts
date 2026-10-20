import type { NavTab } from '../types';

export type VoiceActionType =
  | 'NEXT_SONG'
  | 'PREV_SONG'
  | 'PLAY_MUSIC'
  | 'PAUSE_MUSIC'
  | 'TOGGLE_PLAY'
  | 'MUTE_MUSIC'
  | 'UNMUTE_MUSIC'
  | 'VOLUME_UP'
  | 'VOLUME_DOWN'
  | 'NAV_TAB'
  | 'OPEN_CONTACT'
  | 'OPEN_SETTINGS'
  | 'OPEN_NOTIFICATIONS'
  | 'CLOSE_MODAL'
  | 'LOCK_DASHBOARD'
  | 'SCROLL_DOWN'
  | 'SCROLL_UP'
  | 'CONVERSATION'
  | 'UNKNOWN';

export interface VoiceCommandResult {
  type: VoiceActionType;
  tab?: NavTab;
  displayText: string;
  speechReply: string;
  matchedPhrase?: string;
}

/**
 * Natural Language / Oral Command Interpreter
 * Clean and fast regex matcher supporting English, Hindi, and Hinglish.
 */
export function interpretVoiceCommand(input: string): VoiceCommandResult {
  const text = input
    .toLowerCase()
    .replace(/[.,?!/#!$%^&*;:{}=\-_`~()]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (!text) {
    return {
      type: 'UNKNOWN',
      displayText: 'Kuch sunai nahi diya. Please command boliye.',
      speechReply: 'Please speak a command.',
    };
  }

  // 1. Next / Change Song
  if (
    /(?:next|change|skip|dusra|doosra|agla|aglaa)\s*(?:the|this|a)?\s*(?:song|track|gaana|gana|music)?/i.test(text) ||
    /(?:song|track|gaana|gana)\s*(?:change|badlo|badal|next|skip)/i.test(text) ||
    /(?:badal|badlo)\s*(?:gaana|gana|song)/i.test(text) ||
    /(?:chalao|bajao)\s*(?:agla|dusra|doosra|next)\s*(?:song|gaana|gana)?/i.test(text) ||
    text === 'next' ||
    text === 'skip' ||
    text === 'change'
  ) {
    return {
      type: 'NEXT_SONG',
      displayText: '⏭️ Changing to the next track...',
      speechReply: 'Playing next song!',
      matchedPhrase: text,
    };
  }

  // 2. Previous / Back Song
  if (
    /(?:prev|previous|back|pichla|pichhla|purana)\s*(?:the|this|a)?\s*(?:song|track|gaana|gana|music)?/i.test(text) ||
    /(?:song|track|gaana|gana)\s*(?:previous|back|pichla|pichhla)/i.test(text) ||
    text === 'previous' ||
    text === 'back'
  ) {
    return {
      type: 'PREV_SONG',
      displayText: '⏮️ Playing previous track...',
      speechReply: 'Playing previous song!',
      matchedPhrase: text,
    };
  }

  // 3. Play / Resume Music
  if (
    /(?:play|resume|start|chalao|bajao|shuru)\s*(?:the|this|a)?\s*(?:song|music|track|gaana|gana)?/i.test(text) ||
    /(?:gaana|gana|music|song)\s*(?:chalao|bajao|play|start)/i.test(text) ||
    text === 'play' ||
    text === 'resume'
  ) {
    return {
      type: 'PLAY_MUSIC',
      displayText: '▶️ Resuming music playback...',
      speechReply: 'Playing music!',
      matchedPhrase: text,
    };
  }

  // 4. Pause / Stop Music
  if (
    /(?:pause|stop|roko|ruk|band)\s*(?:the|this|a)?\s*(?:song|music|track|gaana|gana)?/i.test(text) ||
    /(?:gaana|gana|music|song)\s*(?:roko|rok|pause|stop|band)/i.test(text) ||
    text === 'pause' ||
    text === 'stop' ||
    text === 'ruko'
  ) {
    return {
      type: 'PAUSE_MUSIC',
      displayText: '⏸️ Pausing music playback...',
      speechReply: 'Music paused.',
      matchedPhrase: text,
    };
  }

  // 5. Volume & Mute Controls
  if (/(?:unmute|awaaz\s*kholo|awaaz\s*chalu)/i.test(text)) {
    return {
      type: 'UNMUTE_MUSIC',
      displayText: '🔊 Audio unmuted.',
      speechReply: 'Unmuted.',
      matchedPhrase: text,
    };
  }

  if (/(?:mute|awaaz\s*band|silent|chup)/i.test(text)) {
    return {
      type: 'MUTE_MUSIC',
      displayText: '🔇 Audio muted.',
      speechReply: 'Muted.',
      matchedPhrase: text,
    };
  }

  if (
    /(?:volume|awaaz|sound)\s*(?:up|badhao|high|tej)/i.test(text) ||
    /(?:increase|badhao)\s*(?:the)?\s*(?:volume|awaaz)/i.test(text) ||
    text === 'louder'
  ) {
    return {
      type: 'VOLUME_UP',
      displayText: '🔊 Volume increased.',
      speechReply: 'Volume up.',
      matchedPhrase: text,
    };
  }

  if (
    /(?:volume|awaaz|sound)\s*(?:down|kam|low|dheema)/i.test(text) ||
    /(?:decrease|kam\s*karo)\s*(?:the)?\s*(?:volume|awaaz)/i.test(text) ||
    text === 'softer'
  ) {
    return {
      type: 'VOLUME_DOWN',
      displayText: '🔉 Volume decreased.',
      speechReply: 'Volume down.',
      matchedPhrase: text,
    };
  }

  // 6. Navigation Tabs
  if (/(?:project|projects|portfolio|kaam)/i.test(text)) {
    return {
      type: 'NAV_TAB',
      tab: 'Projects',
      displayText: '💼 Opening Projects Portfolio...',
      speechReply: 'Opening Projects.',
      matchedPhrase: text,
    };
  }

  if (/(?:note|notes|notepad|diary|likhna)/i.test(text)) {
    return {
      type: 'NAV_TAB',
      tab: 'Notepad',
      displayText: '📝 Opening Quick Notepad...',
      speechReply: 'Opening Notepad.',
      matchedPhrase: text,
    };
  }

  if (/(?:video|videos|youtube|watch)/i.test(text)) {
    return {
      type: 'NAV_TAB',
      tab: 'Videos',
      displayText: '🎬 Opening Videos Hub...',
      speechReply: 'Opening Videos.',
      matchedPhrase: text,
    };
  }

  if (
    /(?:open|kholo|show|dikhao|go\s*to)\s*(?:the)?\s*music/i.test(text) ||
    /(?:music|songs)\s*(?:tab|section|view|page|player)/i.test(text)
  ) {
    return {
      type: 'NAV_TAB',
      tab: 'Music',
      displayText: '🎵 Opening Music Station...',
      speechReply: 'Opening Music.',
      matchedPhrase: text,
    };
  }

  if (/(?:dashboard|home|main\s*page|shuruat)/i.test(text)) {
    return {
      type: 'NAV_TAB',
      tab: 'Dashboard',
      displayText: '📊 Navigating to Dashboard...',
      speechReply: 'Opening Dashboard.',
      matchedPhrase: text,
    };
  }

  if (/(?:friend|friends|dost)/i.test(text)) {
    return {
      type: 'NAV_TAB',
      tab: 'Friend List',
      displayText: '👥 Opening Friends List...',
      speechReply: 'Opening Friends.',
      matchedPhrase: text,
    };
  }

  if (/(?:gallery|photos|pictures|tasveer)/i.test(text)) {
    return {
      type: 'NAV_TAB',
      tab: 'Gallery',
      displayText: '🖼️ Opening Photo Gallery...',
      speechReply: 'Opening Gallery.',
      matchedPhrase: text,
    };
  }

  if (/(?:travel|trips|ghoomna)/i.test(text)) {
    return {
      type: 'NAV_TAB',
      tab: 'Travel',
      displayText: '✈️ Opening Travel Log...',
      speechReply: 'Opening Travel.',
      matchedPhrase: text,
    };
  }

  if (/(?:dream|dreams|sapne)/i.test(text)) {
    return {
      type: 'NAV_TAB',
      tab: 'Dreams',
      displayText: '✨ Opening Dreams & Goals...',
      speechReply: 'Opening Dreams.',
      matchedPhrase: text,
    };
  }

  if (/(?:task|tasks|todo)/i.test(text)) {
    return {
      type: 'NAV_TAB',
      tab: 'Task',
      displayText: '✅ Opening Tasks & Todo...',
      speechReply: 'Opening Tasks.',
      matchedPhrase: text,
    };
  }

  // 7. Modals
  if (/(?:contact|hire|mail|message|sampark)/i.test(text)) {
    return {
      type: 'OPEN_CONTACT',
      displayText: '📬 Opening Contact Dialog...',
      speechReply: 'Opening contact form.',
      matchedPhrase: text,
    };
  }

  if (/(?:setting|settings|profile)/i.test(text)) {
    return {
      type: 'OPEN_SETTINGS',
      displayText: '⚙️ Opening Settings...',
      speechReply: 'Opening settings.',
      matchedPhrase: text,
    };
  }

  if (/(?:notification|notifications|bell|alerts)/i.test(text)) {
    return {
      type: 'OPEN_NOTIFICATIONS',
      displayText: '🔔 Opening Notifications...',
      speechReply: 'Opening notifications.',
      matchedPhrase: text,
    };
  }

  if (/(?:close|cancel|dismiss|band\s*karo|hatao)/i.test(text)) {
    return {
      type: 'CLOSE_MODAL',
      displayText: '✖️ Closing active modal...',
      speechReply: 'Closing dialog.',
      matchedPhrase: text,
    };
  }

  // 8. Scroll & System
  if (/(?:scroll|page)\s*(?:down|niche)/i.test(text) || text === 'scroll') {
    return {
      type: 'SCROLL_DOWN',
      displayText: '⬇️ Scrolling down...',
      speechReply: 'Scrolling down.',
      matchedPhrase: text,
    };
  }

  if (/(?:scroll|page)\s*(?:up|upar|top)/i.test(text) || text === 'top') {
    return {
      type: 'SCROLL_UP',
      displayText: '⬆️ Scrolling to top...',
      speechReply: 'Scrolling to top.',
      matchedPhrase: text,
    };
  }

  if (/(?:lock|logout|band\s*kar\s*do)/i.test(text)) {
    return {
      type: 'LOCK_DASHBOARD',
      displayText: '🔒 Locking dashboard...',
      speechReply: 'Locking dashboard.',
      matchedPhrase: text,
    };
  }

  // 9. Conversational
  if (/(?:who\s*are\s*you|tum\s*kaun\s*ho|what\s*is\s*your\s*name)/i.test(text)) {
    return {
      type: 'CONVERSATION',
      displayText:
        '🤖 Main Crowz AI hoon! Aap bol kar gaana change kar sakte hain, projects khol sakte hain, ya notepad use kar sakte hain.',
      speechReply:
        'I am Crowz AI assistant. Tell me to change song, open projects, or open notepad.',
      matchedPhrase: text,
    };
  }

  if (/(?:who\s*is\s*shorin|who\s*is\s*shubhav|shorin\s*kaun)/i.test(text)) {
    return {
      type: 'CONVERSATION',
      displayText:
        '👨‍💻 Shubhav Kumar (Shorin) is a full-stack developer who created this portfolio dashboard!',
      speechReply: 'Shubhav Kumar, also known as Shorin, created this dashboard.',
      matchedPhrase: text,
    };
  }

  return {
    type: 'UNKNOWN',
    displayText: `❓ Heard: "${input}". Try saying: "Change song", "Open projects", or "Open notepad".`,
    speechReply: `Try saying change song, open projects, or pause music.`,
    matchedPhrase: text,
  };
}

/**
 * Speech Synthesis Helper (Text to Voice)
 */
export function speakVoiceFeedback(text: string, enabled = true): void {
  if (!enabled || typeof window === 'undefined' || !('speechSynthesis' in window)) {
    return;
  }

  try {
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 1.05;
    utterance.pitch = 1.0;
    utterance.volume = 0.9;

    const voices = window.speechSynthesis.getVoices();
    const preferredVoice =
      voices.find(
        (v) =>
          (v.lang.includes('en-IN') || v.lang.includes('en-US')) &&
          (v.name.includes('Natural') ||
            v.name.includes('Google') ||
            v.name.includes('Samantha') ||
            v.name.includes('Zira'))
      ) ||
      voices.find((v) => v.lang.startsWith('en')) ||
      voices[0];

    if (preferredVoice) {
      utterance.voice = preferredVoice;
    }

    window.speechSynthesis.speak(utterance);
  } catch (err) {
    console.warn('Speech synthesis error:', err);
  }
}
