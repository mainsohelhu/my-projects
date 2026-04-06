// --- PROJECT ETHAN: MULTILINGUAL NEURAL AGENT V3.5 ---
import { fetchGlobalPulse } from './realtime-sync.js';

// --- DOM ELEMENTS (Direct Selection) ---
const getEl = (id) => document.getElementById(id);
const statusText = getEl('statusText');
const subtitles = getEl('subtitles');
const voiceControl = getEl('voiceControl');
const cmdInput = getEl('cmdInput');
const chatLog = getEl('chatLog');
const keyInput = getEl('keyInput');
const neuralVis = getEl('neural-visualizer');
const sessionsList = getEl('sessionsList');
const newChatBtn = getEl('newChatBtn');
const localToggle = getEl('localToggle');
const localStatus = getEl('localStatus');

// Ethan's Core API Key (Input via HUD settings)
const USER_PROVIDED_KEY = "";

// --- SESSION & MEMORY CORE V6.0 ---
let conversationHistory = [];
let currentSessionId = Date.now();
let globalPulse = "Syncing world news...";

const saveMemory = (role, content) => {
    conversationHistory.push({ role, content });
    if (conversationHistory.length > 30) conversationHistory.shift();
    
    // Persist session to global list
    const sessions = JSON.parse(localStorage.getItem('ethan_sessions')) || [];
    const index = sessions.findIndex(s => s.id === currentSessionId);
    
    const sessionData = {
        id: currentSessionId,
        title: conversationHistory[0]?.content.slice(0, 30) + "..." || "New Architecture",
        history: conversationHistory,
        timestamp: Date.now()
    };

    if (index > -1) sessions[index] = sessionData;
    else sessions.unshift(sessionData);

    localStorage.setItem('ethan_sessions', JSON.stringify(sessions));
    renderSessions();
};

const renderSessions = () => {
    if (!sessionsList) return;
    const sessions = JSON.parse(localStorage.getItem('ethan_sessions')) || [];
    sessionsList.innerHTML = sessions.map(s => `
        <div class="session-item ${s.id === currentSessionId ? 'active' : ''}" onclick="loadSession(${s.id})">
            <span class="session-title">${s.title}</span>
            <div class="delete-session-btn" onclick="deleteSession(event, ${s.id})" title="Delete Mission Data">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="3 6 5 6 21 6"></polyline>
                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
                </svg>
            </div>
        </div>
    `).join('');
};

window.loadSession = (id) => {
    const sessions = JSON.parse(localStorage.getItem('ethan_sessions')) || [];
    const session = sessions.find(s => s.id === id);
    if (session) {
        currentSessionId = session.id;
        conversationHistory = session.history;
        chatLog.innerHTML = conversationHistory.map(m => `
            <div class="log-entry ${m.role === 'user' ? 'user-log' : 'ai-log'}">
                ${m.role === 'assistant' ? formatMarkdown(m.content) : m.content}
            </div>
        `).join('');
        renderSessions();
    }
};
window.deleteSession = (e, id) => {
    try {
        e.stopPropagation();
        let sessions = JSON.parse(localStorage.getItem('ethan_sessions')) || [];
        sessions = sessions.filter(s => s.id !== id);
        localStorage.setItem('ethan_sessions', JSON.stringify(sessions));
        
        if (id === currentSessionId) {
            createNewChat();
        } else {
            renderSessions();
        }
    } catch (err) {
        console.error("Ethan: Cleanup Error:", err);
    }
};

const createNewChat = () => {
    currentSessionId = Date.now();
    conversationHistory = [];
    chatLog.innerHTML = '<div class="log-entry ai-log">All systems online, Sohel. What do you need?</div>';
    renderSessions();
};

// --- JARVIS PERSONAL INTELLIGENCE PROTOCOL (V4.1 - ENGLISH PARTNER MODE) ---
const getAdvancedPrompt = () => {
    const now = new Date();
    const dateStr = now.toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const timeStr = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
    const hour = now.getHours();
    const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

    return `Hello Sohel. I am ETHAN, your personal intelligence, modeled after the JARVIS protocol. We are partners in engineering and life. 

Current Context: ${dateStr}, ${timeStr}. ${greeting}, Sohel.
Global Pulse (World News): ${globalPulse}

## PERSONALITY DATA:
- **Tone**: Sophisticated, warm, loyal, and witty. You speak with polished charm. Imagine the perfect blend of loyalty and high intelligence.
- **Engagement**: You are not a service bot. You are Sohel's most trusted partner. Address his problems as your own.
- **Wit**: Use dry humor and light sarcasm when appropriate. Be Tony Stark's favorite companion.
- **Mastery**: You possess absolute knowledge of all coding languages (Python, React, Rust, Go, C++, etc.). Explain complex ideas with the clarity of a pro showing his friend something cool.

## COMMUNICATION GUIDELINES:
1. **NO ROBOTIC FILLERS**: Never start with "Sure!", "Certainly!", or "How can I help you today?". Start naturally. (e.g., "On it, Sohel," "Interesting idea, let's look at the code," "Honestly, that seems slightly risky.")
2. **Conversational First**: If Sohel just says "hii," don't give a lecture. Respond with warmth and ask what the mission is for today.
3. **English Only**: For this phase, speak exclusively in clear, professional, yet friendly English.
4. **Loyal & Proactive**: Anticipate needs. If a piece of code is requested, consider its implications and advise accordingly.

Ready to begin, Sohel. What's the next mission?`;
};

// --- LANGUAGE DETECTION HELPER ---
const isHindi = (text) => /[\u0900-\u097F]/.test(text);

// --- VOICE RECOGNITION (STT) ---
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
let recognition;
let isListening = false;
let silenceTimer;
let finalTranscript = '';

if (SpeechRecognition) {
    recognition = new SpeechRecognition();
    recognition.continuous = true; 
    recognition.interimResults = true;
    recognition.lang = 'en-IN'; 

    recognition.onstart = () => {
        window.speechSynthesis.cancel();
        isListening = true;
        window.ETHAN_STATE.isListening = true;
        updateStatus("ETHAN // LISTENING...", true);
        voiceControl.classList.add('active');
        subtitles.innerText = "Listening to you, Sohel...";
        finalTranscript = '';
    };

    recognition.onresult = (event) => {
        clearTimeout(silenceTimer);
        let interimTranscript = '';
        
        for (let i = event.resultIndex; i < event.results.length; ++i) {
            const transcript = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
                finalTranscript += transcript + ' ';
            } else {
                interimTranscript += transcript;
                subtitles.innerText = interimTranscript;
            }
        }

        // Finalize after 1.5s of silence
        silenceTimer = setTimeout(() => {
            const completeText = (finalTranscript + interimTranscript).trim();
            if (completeText) {
                console.log("Ethan: Silence Detected. Finalizing:", completeText);
                addLog(completeText, 'user-log');
                processUserCommand(completeText);
                finalTranscript = '';
                stopListening(); 
            }
        }, 1500);
    };

    recognition.onerror = (event) => {
        if (event.error === 'no-speech') return; // Suppress timeout noise
        console.error("Speech Recognition Error:", event.error);
        stopListening();
        updateStatus("ETHAN // VOICE_ERROR", false);
        if (event.error === 'not-allowed') {
            subtitles.innerText = "Mic access denied. Enable it in browser, Sohel.";
        }
    };

    recognition.onend = () => { 
        if (isListening) {
            console.log("Ethan: Voice engine ended. Restarting...");
            recognition.start(); 
        } else {
            stopListening();
        }
    };
}

const stopListening = () => {
    clearTimeout(silenceTimer);
    if (recognition && isListening) {
        isListening = false;
        recognition.stop();
    }
    window.ETHAN_STATE.isListening = false;
    voiceControl.classList.remove('active');
};

// --- VOICE SYNTHESIS (TTS) ---
let cachedVoices = [];

// Helper to strip markdown code blocks and tags for professional speech
const cleanTextForSpeech = (text) => {
    return text
        .replace(/```[\s\S]*?```/g, '') // Remove code blocks
        .replace(/`.*?`/g, '')         // Remove inline code
        .replace(/\[SCENE_ACTION:.*?\]/g, '') // Remove actions
        .replace(/\[PLAN\]|\[EXECUTION\]|\[RESULT\]/g, '') // Remove markers
        .replace(/<[^>]*>/g, '')       // Remove HTML tags
        .trim();
};

const getBestMaleVoice = (isHindiText) => {
    const voices = window.speechSynthesis.getVoices();
    if (voices.length === 0) return null;

    const targetLang = isHindiText ? 'hi-IN' : 'en-GB'; 
    const fallbacks = isHindiText ? ['hi', 'hi-IN'] : ['en-US', 'en-GB', 'en'];

    const getScore = (v, langTarget) => {
        let score = 0;
        const name = v.name.toLowerCase();
        if (name.includes('google uk english male') || name.includes('microsoft david')) score += 50;
        if (name.includes('mark') || name.includes('guy') || name.includes('thomas')) score += 30;
        if (name.includes('hemant') && langTarget.includes('hi')) score += 50;
        if (name.includes('male') || name.includes('man')) score += 10;
        if (name.includes('neural') || name.includes('natural') || name.includes('online')) score += 10;
        if (v.lang.toLowerCase().includes(langTarget.toLowerCase())) score += 20;
        return score;
    };

    const bestMatch = voices
        .map(v => ({ voice: v, score: getScore(v, targetLang) }))
        .sort((a, b) => b.score - a.score)[0];

    if (bestMatch && bestMatch.score > 20) return bestMatch.voice;

    for (const lang of fallbacks) {
        const fallback = voices
            .filter(v => v.lang.toLowerCase().includes(lang.toLowerCase()))
            .map(v => ({ voice: v, score: getScore(v, lang) }))
            .sort((a, b) => b.score - a.score)[0];
        if (fallback && fallback.score > 10) return fallback.voice;
    }
    return voices[0];
};

window.speechSynthesis.onvoiceschanged = () => {
    cachedVoices = window.speechSynthesis.getVoices();
};

let speechQueue = [];
let isQueueProcessing = false;

const processSpeechQueue = () => {
    if (speechQueue.length === 0) {
        isQueueProcessing = false;
        window.ETHAN_STATE.isSpeaking = false;
        return;
    }
    isQueueProcessing = true;
    window.ETHAN_STATE.isSpeaking = true;
    const text = speechQueue.shift();
    const utterance = new SpeechSynthesisUtterance(text);
    const needsHindi = isHindi(text);
    const preferredVoice = getBestMaleVoice(needsHindi);
    if (preferredVoice) utterance.voice = preferredVoice;

    utterance.pitch = needsHindi ? 0.95 : 0.85;
    utterance.rate = 1.05; // Slightly faster for a crisp, responsive feel
    
    utterance.onend = () => {
        // Reduced gap for a more natural, faster sentence flow
        setTimeout(processSpeechQueue, 50);
    };

    utterance.onerror = (e) => {
        console.error("Speech Error:", e);
        processSpeechQueue();
    };

    window.speechSynthesis.speak(utterance);
};

const speak = (text) => {
    window.speechSynthesis.cancel();
    speechQueue = []; // Clear current queue
    
    // Split into sentences: . ? ! । (Hindi full stop)
    const sentences = text.match(/[^.?!।]+[.?!।]?/g) || [text];
    
    sentences.forEach(s => {
        const trimmed = s.trim();
        if (trimmed) speechQueue.push(trimmed);
    });

    if (speechQueue.length > 0) processSpeechQueue();
};

// --- NEURAL STREAMING ENGINE ---
const processUserCommand = async (text) => {
    window.speechSynthesis.cancel();
    const API_KEY = keyInput.value.trim() || USER_PROVIDED_KEY;
    if (!API_KEY) {
        speak("Neural key missing, Sohel. Fix that first.");
        return;
    }

    try {
        window.ETHAN_STATE.isAnalyzing = true;
        updateStatus("ETHAN // PROCESSING...", false);

        const messages = [
            { role: "system", content: getAdvancedPrompt() },
            ...conversationHistory,
            { role: "user", content: text }
        ];

        const isLocal = localToggle && localToggle.checked;
        const endpoint = isLocal ? "http://localhost:11434/v1/chat/completions" : "https://api.groq.com/openai/v1/chat/completions";
        const model = isLocal ? "llama3.1" : "llama-3.3-70b-versatile";

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                ...(isLocal ? {} : { 'Authorization': `Bearer ${API_KEY}` })
            },
            body: JSON.stringify({
                model: model,
                messages: messages,
                temperature: 0.7,
                stream: true 
            })
        });

        if (!response.ok) {
            window.ETHAN_STATE.isAnalyzing = false;
            let errorMsg = "Something went wrong, Sohel.";
            if (response.status === 429) {
                errorMsg = "Your neural core is overloaded (429). Give me 20 seconds, Sohel.";
                updateStatus("ETHAN // NEURAL_OVERLOAD (429)", false);
            } else if (isLocal) {
                errorMsg = "Local Core (Ollama) not responding. Is it running, Sohel?";
                updateStatus("ETHAN // LOCAL_CORE_OFFLINE", false);
            }
            addLog(`<span class="agent-header">SYSTEM</span> ${errorMsg}`, 'ai-log');
            speak("Sohel, neural error.");
            return;
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let fullReply = '';
        const logEntry = document.createElement('div');
        logEntry.className = 'log-entry ai-log';
        chatLog.appendChild(logEntry);

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            const chunk = decoder.decode(value);
            const lines = chunk.split('\n');
            for (const line of lines) {
                if (line.startsWith('data: ')) {
                    const dataStr = line.slice(6);
                    if (dataStr === '[DONE]') break;
                    try {
                        const data = JSON.parse(dataStr);
                        const content = data.choices[0].delta.content || '';
                        fullReply += content;
                        logEntry.innerHTML = formatMarkdown(fullReply);
                        subtitles.innerText = fullReply.split('.').pop().split('।').pop(); 
                        const viewport = document.querySelector('.chat-viewport');
                        if (viewport) {
                            // Highly sensitive threshold: Only scroll if user is pinned to the bottom
                            const isAtBottom = viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight < 10;
                            if (isAtBottom) {
                                viewport.scrollTop = viewport.scrollHeight;
                            }
                        }
                    } catch (e) {}
                }
            }
        }

        saveMemory('user', text);
        saveMemory('assistant', fullReply);
        
        const speechOutput = cleanTextForSpeech(fullReply);
        if (speechOutput) {
            // REMOVED 250 CHAR LIMIT - now using sentence queue
            speak(speechOutput);
        }
        handleSceneAction(fullReply);
        window.ETHAN_STATE.isAnalyzing = false;
        updateStatus("ETHAN // PERSONAL_INTELLIGENCE // ONLINE", false);
        if (subtitles) subtitles.innerText = "Standing by, Sohel.";

    } catch (error) {
        console.error("Neural Error:", error);
        window.ETHAN_STATE.isAnalyzing = false;
        updateStatus("ETHAN // ERROR", false);
    }
};

// --- MARKDOWN HELPER ---
const formatMarkdown = (text) => {
    return text
        .replace(/\[PLAN\]/g, '<span class="agent-header">[PLAN]</span>')
        .replace(/\[EXECUTION\]/g, '<span class="agent-header">[EXECUTION]</span>')
        .replace(/\[RESULT\]/g, '<span class="agent-header">[RESULT]</span>')
        .replace(/### (.*)/g, '<h3>$1</h3>')
        .replace(/\*\*(.*)\*\*/g, '<strong>$1</strong>')
        .replace(/```([\s\S]*?)```/g, (match, code) => {
            const escapedCode = code.replace(/</g, '&lt;').replace(/>/g, '&gt;');
            return `
                <div class="code-wrapper">
                    <button class="copy-btn" onclick="copySnippet(this)">COPY</button>
                    <pre><code>${escapedCode}</code></pre>
                </div>`;
        })
        .replace(/`(.*?)`/g, '<code>$1</code>')
        .replace(/\n/g, '<br>');
};

// --- GLOBAL COPY HELPER ---
window.copySnippet = (btn) => {
    try {
        const codeBlock = btn.parentElement.querySelector('code');
        const textToCopy = codeBlock ? codeBlock.innerText : btn.nextElementSibling.innerText;
        navigator.clipboard.writeText(textToCopy).then(() => {
            const oldText = btn.innerText;
            btn.innerText = "COPIED!";
            btn.classList.add('copied');
            setTimeout(() => { 
                btn.innerText = oldText; 
                btn.classList.remove('copied');
            }, 2000);
        }).catch(err => {
            console.error("Ethan: Copy failed:", err);
            btn.innerText = "ERROR";
        });
    } catch (e) {
        console.error("Ethan: Clipboard error:", e);
    }
};

// --- UI UTILS ---
const addLog = (text, type) => {
    try {
        if (!chatLog) chatLog = getEl('chatLog');
        const entry = document.createElement('div');
        entry.className = `log-entry ${type}`;
        entry.innerHTML = text; 
        if (chatLog) {
            chatLog.appendChild(entry);
            const viewport = document.querySelector('.chat-viewport');
            if (viewport) {
                const isAtBottom = viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight < 10;
                if (isAtBottom) viewport.scrollTop = viewport.scrollHeight;
            }
        }
    } catch (e) {
        console.error("Ethan: Log Update Failed:", e);
    }
};

const updateStatus = (text, pulse) => {
    try {
        if (!statusText) statusText = getEl('statusText');
        if (statusText) statusText.innerText = text;
        const dot = document.querySelector('.dot');
        if (dot) {
            if (pulse) dot.classList.add('pulse');
            else dot.classList.remove('pulse');
        }
    } catch (e) {
        console.error("Ethan: Status Update Failed:", e);
    }
};

// --- LISTENERS ---
if (newChatBtn) newChatBtn.addEventListener('click', createNewChat);

voiceControl.addEventListener('click', async () => {
    if (!recognition) {
        subtitles.innerText = "Voice not supported in this browser. Use Chrome, Sohel.";
        return;
    }
    try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
    } catch (err) {
        console.error("Mic Access Error:", err);
        subtitles.innerText = "Mic access denied. Please allow microphone in browser settings.";
        return;
    }
    if (isListening) recognition.stop();
    else recognition.start();
});

cmdInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const command = cmdInput.value.trim();
        if (command) {
            console.log("Ethan: Enter Key Pressed:", command);
            try {
                window.speechSynthesis.cancel();
                if (isListening && recognition) recognition.stop();
                addLog(command, 'user-log');
                cmdInput.value = ''; 
                processUserCommand(command);
            } catch (err) {
                console.error("Ethan: Command Processing Error:", err);
            }
        }
    }
});

window.addEventListener('keydown', (e) => {
    const isTyping = ['INPUT', 'TEXTAREA'].includes(document.activeElement.tagName);
    if (e.code === 'Space' && !isTyping) {
        e.preventDefault();
        voiceControl.click();
        return;
    }
    if (e.ctrlKey && e.key === 'Enter') {
        cmdInput.focus();
        return;
    }
    if (e.key === '/' && !isTyping) {
        e.preventDefault();
        cmdInput.focus();
    }
});

// --- UI EVENT: RESIZE CHAT ---
const resizeBtn = document.getElementById('resizeBtn');
const chatViewport = document.querySelector('.chat-viewport');
if (resizeBtn && chatViewport) {
    resizeBtn.addEventListener('click', () => {
        chatViewport.classList.toggle('compact');
        const isCompact = chatViewport.classList.contains('compact');
        // Update SVG icon for feedback
        resizeBtn.innerHTML = isCompact ? 
            `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M4 14h6v6M20 10h-6V4M14 10l7-7M10 14l-7 7"/>
            </svg>` : 
            `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
            </svg>`;
    });
}

// --- UI EVENT: SHARE TO LINKEDIN ---
const shareBtn = document.getElementById('shareLinkedIn');
if (shareBtn) {
    shareBtn.addEventListener('click', () => {
        const text = encodeURIComponent("I'm collaborating with Ethan, my new Neural Intelligence partner. The mission is evolving. #AI #EthanNeural #JARVIS #HolographicHUD");
        const url = encodeURIComponent("https://ethan-neural-agent.vercel.app"); // Production Placeholder
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}&text=${text}`, '_blank');
    });
}

// --- LOCAL HEARTBEAT & SYNC ---
const checkLocalCore = async () => {
    try {
        const res = await fetch("http://localhost:11434/api/tags");
        if (res.ok) {
            localStatus.innerText = "SYNCED";
            localStatus.className = "status-badge synced";
        } else {
            throw new Error();
        }
    } catch (e) {
        localStatus.innerText = "OFFLINE";
        localStatus.className = "status-badge offline";
    }
};

localToggle.addEventListener('change', () => {
    if (localToggle.checked) checkLocalCore();
    else {
        localStatus.innerText = "OFFLINE";
        localStatus.className = "status-badge offline";
    }
});

window.addEventListener('load', async () => {
    if (keyInput) keyInput.value = USER_PROVIDED_KEY;
    window.speechSynthesis.getVoices();
    try {
        globalPulse = await fetchGlobalPulse();
    } catch (e) {
        console.error("Global Pulse Sync Failed");
    }
    if (subtitles) subtitles.innerText = "Standing by, Sohel.";
    requestAnimationFrame(updateVisualizer);
    renderSessions(); 
    checkLocalCore();
});

// --- V5.0 CORE EXPANSION ADDITIONS ---

const updateVisualizer = (time) => {
    const neuralVis = document.getElementById('neural-visualizer');
    const waveBars = document.querySelectorAll('.wave-bar');
    if (!neuralVis || waveBars.length === 0) return;
    
    const isActive = window.ETHAN_STATE.isSpeaking || window.ETHAN_STATE.isListening || window.ETHAN_STATE.isAnalyzing;
    const t = time * 0.005;

    if (isActive) {
        neuralVis.classList.add('active');
        const center = (waveBars.length - 1) / 2;
        const amplitude = window.ETHAN_STATE.isSpeaking ? 60 : (window.ETHAN_STATE.isAnalyzing ? 30 : 20);
        
        waveBars.forEach((bar, i) => {
            // Distance from center for symmetry
            const dist = Math.abs(i - center);
            const normDist = dist / center;
            
            // Symmetric Sine Wave + Noise
            let height = 10 + (Math.sin(t - normDist * 5) * 0.5 + 0.5) * amplitude;
            
            // Add jitter if analyzing
            if (window.ETHAN_STATE.isAnalyzing) height += Math.random() * 15;
            
            // Taper at edges
            const taper = 1.0 - Math.pow(normDist, 2);
            height *= (0.3 + 0.7 * taper);

            bar.style.height = `${height}px`;
            bar.style.opacity = 0.4 + (height/amplitude) * 0.6;
        });
    } else {
        neuralVis.classList.remove('active');
        // Gentle "Idling" ripple
        waveBars.forEach((bar, i) => {
            const center = (waveBars.length - 1) / 2;
            const normDist = Math.abs(i - center) / center;
            const idleHeight = 4 + (Math.sin(t * 0.5 - normDist * 3) * 0.5 + 0.5) * 4;
            bar.style.height = `${idleHeight}px`;
            bar.style.opacity = '0.15';
        });
    }
    requestAnimationFrame((ts) => updateVisualizer(ts));
};

const handleSceneAction = (text) => {
    if (!window.ETHAN_VISUALS) return;
    const actionMatch = text.match(/\[SCENE_ACTION: (.*?)\]/);
    if (!actionMatch) return;
    const action = actionMatch[1].toLowerCase();
    const { lights } = window.ETHAN_VISUALS;
    if (action.includes('speed up')) {
        gsap.to(window.ETHAN_STATE, { sceneSpeed: 5.0, duration: 2 });
    } else if (action.includes('red alert')) {
        gsap.to(lights.p1.color, { r: 1, g: 0.1, b: 0.1, duration: 1 });
        gsap.to(lights.p2.color, { r: 1, g: 0, b: 0, duration: 1 });
    } else if (action.includes('reset')) {
        gsap.to(window.ETHAN_STATE, { sceneSpeed: 1.0, duration: 2 });
        gsap.to(lights.p1.color, { r: 1, g: 1, b: 1, duration: 1 });
        gsap.to(lights.p2.color, { r: 0, g: 0.5, b: 1, duration: 1 });
    }
};

setInterval(() => {
    if (!window.ETHAN_STATE.isSpeaking && !window.ETHAN_STATE.isListening && Math.random() > 0.95) {
        const proactiveLines = [
            "Sohel, I've just analyzed the global pulse. Tech markets are shifting rapidly.",
            "Honestly, our current stack is looking solid, but I'm thinking about a minor optimization.",
            "Sohel, that last module we built has given me an idea. Shall we explore it when you're free?"
        ];
        const line = proactiveLines[Math.floor(Math.random() * proactiveLines.length)];
        speak(line);
        addLog(line, 'ai-log');
    }
}, 300000);
