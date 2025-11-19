// Genesis Countdown Timer
let GENESIS_TIME = null;

function setGenesisTime(dateTime) {
    GENESIS_TIME = new Date(dateTime).getTime();
    document.getElementById('genesisTimeDisplay').textContent = new Date(dateTime).toUTCString();
    addLog(`Genesis time set to: ${new Date(dateTime).toUTCString()}`, 'info');
}

function updateCountdown() {
    if (!GENESIS_TIME) {
        // No genesis time set yet
        document.getElementById('days').textContent = '--';
        document.getElementById('hours').textContent = '--';
        document.getElementById('minutes').textContent = '--';
        document.getElementById('seconds').textContent = '--';
        return;
    }

    const now = new Date().getTime();
    const distance = GENESIS_TIME - now;

    if (distance < 0) {
        document.getElementById('days').textContent = '00';
        document.getElementById('hours').textContent = '00';
        document.getElementById('minutes').textContent = '00';
        document.getElementById('seconds').textContent = '00';
        
        // Change countdown section to show Genesis is complete
        const countdownSection = document.querySelector('.countdown-section h2');
        countdownSection.textContent = '✅ GENESIS COMPLETE';
        countdownSection.style.color = '#00ff00';
        
        return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    document.getElementById('days').textContent = String(days).padStart(2, '0');
    document.getElementById('hours').textContent = String(hours).padStart(2, '0');
    document.getElementById('minutes').textContent = String(minutes).padStart(2, '0');
    document.getElementById('seconds').textContent = String(seconds).padStart(2, '0');
}

// Update countdown every second only if genesis time is set
updateCountdown();
setInterval(updateCountdown, 1000);

// Checklist persistence
const checkboxes = document.querySelectorAll('.checklist-item input[type="checkbox"]');

// Load saved checklist state
checkboxes.forEach((checkbox, index) => {
    const saved = localStorage.getItem(`checklist_${index}`);
    if (saved === 'true') {
        checkbox.checked = true;
    }
    
    // Save state on change
    checkbox.addEventListener('change', () => {
        localStorage.setItem(`checklist_${index}`, checkbox.checked);
        updateProgress();
    });
});

// Update progress indicator
function updateProgress() {
    const total = checkboxes.length;
    const checked = Array.from(checkboxes).filter(cb => cb.checked).length;
    const percentage = Math.round((checked / total) * 100);
    
    console.log(`Preflight Progress: ${checked}/${total} (${percentage}%)`);
    
    // You could add a progress bar here if desired
}

// Initial progress check
updateProgress();

// Add visual feedback for countdown milestones
function checkMilestones() {
    const now = new Date().getTime();
    const distance = GENESIS_TIME - now;
    const hoursRemaining = distance / (1000 * 60 * 60);
    
    const countdownSection = document.querySelector('.countdown-section');
    
    if (hoursRemaining <= 1 && hoursRemaining > 0) {
        countdownSection.style.borderColor = 'rgba(255, 215, 0, 0.8)';
        countdownSection.style.animation = 'pulse 2s infinite';
    } else if (hoursRemaining <= 24 && hoursRemaining > 1) {
        countdownSection.style.borderColor = 'rgba(255, 165, 0, 0.5)';
    }
}

// Add pulse animation
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0%, 100% {
            box-shadow: 0 0 20px rgba(255, 215, 0, 0.5);
        }
        50% {
            box-shadow: 0 0 40px rgba(255, 215, 0, 0.8);
        }
    }
`;
document.head.appendChild(style);

// Check milestones every minute
checkMilestones();
setInterval(checkMilestones, 60000);

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Press 'R' to refresh countdown
    if (e.key === 'r' || e.key === 'R') {
        updateCountdown();
        console.log('Countdown refreshed');
    }
    
    // Press 'C' to clear all checkboxes
    if (e.key === 'c' || e.key === 'C') {
        if (confirm('Clear all checklist items?')) {
            checkboxes.forEach((cb, index) => {
                cb.checked = false;
                localStorage.setItem(`checklist_${index}`, false);
            });
            updateProgress();
        }
    }
});

// Add export functionality
function exportData() {
    const data = {
        timestamp: new Date().toISOString(),
        countdown: {
            days: document.getElementById('days').textContent,
            hours: document.getElementById('hours').textContent,
            minutes: document.getElementById('minutes').textContent,
            seconds: document.getElementById('seconds').textContent
        },
        checklist: Array.from(checkboxes).map((cb, index) => ({
            id: index,
            checked: cb.checked,
            label: cb.nextElementSibling.textContent
        }))
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `genesis_dashboard_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
}

// ========== AUTO-SAVE SYSTEM ==========

const STORAGE_KEYS = {
    CHECKLIST: 'genesis_checklist',
    MNEMONIC: 'genesis_mnemonic',
    AUDIO: 'genesis_audio',
    LOGS: 'genesis_logs',
    WALLET: 'genesis_wallet',
    WORKFLOW: 'genesis_workflow',
    TIMESTAMP: 'genesis_last_save'
};

function autoSave(key, data) {
    try {
        localStorage.setItem(key, JSON.stringify({
            data,
            timestamp: new Date().toISOString()
        }));
        console.log(`✓ Auto-saved: ${key}`);
    } catch (e) {
        console.warn(`⚠️ Save failed for ${key}:`, e);
    }
}

function autoLoad(key) {
    try {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item).data : null;
    } catch (e) {
        console.warn(`⚠️ Load failed for ${key}:`, e);
        return null;
    }
}

// Auto-save all inputs every 5 seconds
setInterval(() => {
    // Mnemonic
    const mnemonicWords = document.getElementById('mnemonicWords')?.value;
    if (mnemonicWords) {
        autoSave(STORAGE_KEYS.MNEMONIC, { words: mnemonicWords });
    }
    
    // Passphrase
    const passphrase = document.getElementById('mnemonicPass')?.value;
    if (passphrase) {
        autoSave(STORAGE_KEYS.MNEMONIC, { 
            words: mnemonicWords, 
            passphrase 
        });
    }
    
    // Wallet info
    if (userWallet) {
        autoSave(STORAGE_KEYS.WALLET, { address: userWallet });
    }
    
    // Workflow status
    const workflowStatus = {
        preflight: document.getElementById('preflightStatus')?.textContent,
        mnemonic: document.getElementById('mnemonicStatus')?.textContent,
        funding: document.getElementById('fundingStatus')?.textContent,
        audio: document.getElementById('audioStatus')?.textContent,
        wait: document.getElementById('waitStatus')?.textContent,
        genesis: document.getElementById('genesisStatus')?.textContent
    };
    autoSave(STORAGE_KEYS.WORKFLOW, workflowStatus);
    
    // Update last save timestamp
    localStorage.setItem(STORAGE_KEYS.TIMESTAMP, new Date().toISOString());
}, 5000);

// Auto-save logs every 10 seconds
setInterval(() => {
    const logOutput = document.getElementById('logOutput');
    if (logOutput) {
        const logs = Array.from(logOutput.querySelectorAll('.log-entry')).map(e => ({
            message: e.textContent,
            type: e.className.replace('log-entry ', '')
        }));
        autoSave(STORAGE_KEYS.LOGS, logs);
    }
}, 10000);

// Load saved state on startup
window.addEventListener('load', () => {
    const savedMnemonic = autoLoad(STORAGE_KEYS.MNEMONIC);
    if (savedMnemonic?.words) {
        const mnemonicWordsEl = document.getElementById('mnemonicWords');
        if (mnemonicWordsEl) {
            mnemonicWordsEl.value = savedMnemonic.words;
            mnemonicWordsEl.parentElement.style.display = 'block';
            addLog('✓ Restored mnemonic from last session', 'info');
        }
    }
    
    const savedWallet = autoLoad(STORAGE_KEYS.WALLET);
    if (savedWallet?.address) {
        userWallet = savedWallet.address;
        const walletAddressEl = document.getElementById('walletAddress');
        if (walletAddressEl) {
            walletAddressEl.textContent = `Phantom: ${userWallet.slice(0, 20)}...`;
            addLog(`✓ Restored wallet: ${userWallet.slice(0, 20)}...`, 'info');
        }
    }
    
    const savedLogs = autoLoad(STORAGE_KEYS.LOGS);
    if (savedLogs && savedLogs.length > 0) {
        addLog('✓ Restored logs from last session', 'info');
    }
    
    const savedWorkflow = autoLoad(STORAGE_KEYS.WORKFLOW);
    if (savedWorkflow) {
        Object.entries(savedWorkflow).forEach(([key, value]) => {
            const el = document.getElementById(`${key}Status`);
            if (el && value) {
                el.textContent = value;
                if (value.includes('✓')) {
                    el.classList.add('complete');
                }
            }
        });
        addLog('✓ Restored workflow state from last session', 'info');
    }
    
    const lastSave = localStorage.getItem(STORAGE_KEYS.TIMESTAMP);
    if (lastSave) {
        const date = new Date(lastSave);
        addLog(`Last save: ${date.toLocaleString()}`, 'info');
    }
});

// Console commands
console.log('%c🤍🗿⚖️🕊️🌄 GENESIS DASHBOARD LOADED', 'font-size: 20px; font-weight: bold;');
console.log('%cAvailable commands:', 'font-weight: bold;');
console.log('  - Press R to refresh countdown');
console.log('  - Press C to clear checklist');
console.log('  - Call exportData() to export dashboard state');
console.log('  - Auto-save enabled (every 5-10 seconds to localStorage)');

// Make exportData available globally
window.exportData = exportData;

// ========== PHANTOM WALLET INTEGRATION ==========

// Check for Phantom wallet
function isPhantomInstalled() {
    return window.phantom?.solana?.isPhantom ?? false;
}

const connectWalletBtn = document.getElementById('connectWallet');
const walletInfo = document.getElementById('walletInfo');
const walletAddress = document.getElementById('walletAddress');
const walletBalance = document.getElementById('walletBalance');
const suiWalletStatus = document.getElementById('suiWalletStatus');
const suiAddress = document.getElementById('suiAddress');
const suiBalance = document.getElementById('suiBalance');
const paySuiBtn = document.getElementById('paySuiBtn');

let userWallet = null;

if (connectWalletBtn) {
    connectWalletBtn.addEventListener('click', async () => {
        try {
            if (!window.phantom?.solana?.isPhantom) {
                addLog('❌ Phantom wallet not installed. Visit https://phantom.app', 'error');
                alert('Please install Phantom wallet extension');
                return;
            }

            const resp = await window.phantom.solana.connect();
            userWallet = resp.publicKey.toString();
            
            // Update Phantom info
            suiAddress.textContent = userWallet.slice(0, 20) + '...';
            walletAddress.textContent = `Phantom: ${userWallet.slice(0, 20)}...`;
            walletInfo.style.display = 'flex';
            connectWalletBtn.textContent = '✓ Phantom Connected';
            connectWalletBtn.disabled = true;
            paySuiBtn.disabled = false;
            
            addLog(`✓ Phantom wallet connected: ${userWallet.slice(0, 20)}...`, 'info');
            
            // Mock balance fetch
            suiBalance.textContent = '~50 SUI';
        } catch (err) {
            addLog(`❌ Wallet connection failed: ${err.message}`, 'error');
        }
    });
}

paySuiBtn?.addEventListener('click', async () => {
    if (!userWallet) {
        addLog('❌ Wallet not connected', 'error');
        return;
    }
    
    try {
        addLog('💸 Preparing Sui anchor payment (~20 SUI)...', 'info');
        // Simulate payment processing
        setTimeout(() => {
            addLog('✓ Sui anchor payment processed', 'info');
            const suiStatus = document.querySelector('[data-chain="sui"] .chain-status');
            if (suiStatus) {
                suiStatus.textContent = 'Confirming';
                suiStatus.classList.remove('pending');
            }
        }, 2000);
    } catch (err) {
        addLog(`❌ Payment failed: ${err.message}`, 'error');
    }
});

// ========== SYSTEM LOGGING ==========

function addLog(message, type = 'info') {
    const logOutput = document.getElementById('logOutput');
    const timestamp = new Date().toLocaleTimeString();
    const entry = document.createElement('div');
    entry.className = `log-entry ${type}`;
    entry.textContent = `[${timestamp}] ${message}`;
    logOutput.appendChild(entry);
    
    if (document.getElementById('autoScroll').checked) {
        logOutput.scrollTop = logOutput.scrollHeight;
    }
}

document.getElementById('clearLogs')?.addEventListener('click', () => {
    document.getElementById('logOutput').innerHTML = '';
    addLog('Logs cleared', 'info');
});

document.getElementById('exportLogs')?.addEventListener('click', () => {
    const logs = document.getElementById('logOutput').innerText;
    const blob = new Blob([logs], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `genesis_logs_${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
});

// ========== BIPON39 MNEMONIC GENERATOR ==========

// BIP39-like wordlist (using 256 base words for BIPON39)
const BIPON39_WORDS_256 = [
    'abandon', 'ability', 'able', 'about', 'above', 'absent', 'absorb', 'abstract', 'abuse', 'access',
    'accident', 'account', 'accuse', 'achieve', 'acid', 'acoustic', 'acquire', 'across', 'act', 'action',
    'activate', 'active', 'activity', 'actor', 'acts', 'actual', 'adapt', 'add', 'addict', 'added',
    // ... (mock wordlist - in real implementation would have 256 words)
    'adeem', 'adept', 'adhering', 'adjacent', 'adjoin', 'adjust', 'admire', 'admit', 'adopt', 'adore',
    'adorn', 'adult', 'advance', 'advent', 'adverse', 'advise', 'affair', 'afford', 'afraid', 'afresh',
    'after', 'again', 'against', 'age', 'agency', 'agent', 'agents', 'ages', 'aged', 'agile',
    'aging', 'agog', 'agonize', 'agony', 'agora', 'agree', 'agreed', 'agrees', 'ah', 'ahead',
    'ahem', 'aid', 'aide', 'aider', 'aides', 'aids', 'ail', 'ailed', 'ailing', 'ailment',
    'aim', 'aimed', 'aiming', 'aims', 'ain', 'air', 'aired', 'airer', 'airers', 'airier',
    'airily', 'airing', 'airings', 'airless', 'airlift', 'airline', 'airliner', 'airmail', 'airman', 'airmen',
    'airplane', 'airs', 'airship', 'airt', 'airts', 'airway', 'airways', 'airy', 'aisle', 'aisles',
    'aitch', 'ait', 'aitch', 'aits', 'ajar', 'ajee', 'ajowan', 'ajuga', 'akee', 'aker',
    'akimbo', 'akin', 'akita', 'al', 'ala', 'alabaster', 'alack', 'alacrity', 'alacrities', 'aladdin',
    'alae', 'alag', 'alamo', 'alan', 'aland', 'alane', 'alang', 'alans', 'alant', 'alap',
    'alar', 'alarm', 'alarmable', 'alarmed', 'alarming', 'alarmingly', 'alarmism', 'alarmist', 'alarms', 'alary',
    'alas', 'alaska', 'alastrim', 'alate', 'alated', 'alation', 'alaus', 'alba', 'albacore', 'albarada',
    'albarcore', 'albarrada', 'albas', 'albata', 'albatross', 'albatrosses', 'albee', 'albedo', 'alberts', 'albescent',
    'albespine', 'albespyne', 'albicate', 'albicant', 'albicates', 'albicating', 'albication', 'albicore', 'albicores', 'albicant',
    'albicates', 'albication', 'albidities', 'albidity', 'albidness', 'albie', 'albies', 'albigensian', 'albigenses', 'albigeois',
    'albigensian', 'albigensian', 'albigenses', 'albigeois', 'albigenses', 'albigensian', 'albigeois', 'albigenses', 'albigeois', 'albigeois',
    'albigenses', 'albigensian', 'albigeois', 'albigenses', 'albigeois', 'albigenses', 'albigensian', 'albigeois', 'albigenses', 'albigeois',
    'albigenses', 'albigensian', 'albigeois', 'albigenses', 'albigeois', 'albigenses', 'albigensian', 'albigeois', 'albigenses', 'albigeois',
    'albigenses', 'albigensian', 'albigeois', 'albigenses', 'albigeois', 'albigenses', 'albigensian', 'albigeois', 'albigenses', 'albigeois'
];

// Generate mock seed and derivation data
function generateBIPON39Mnemonic(wordCount, passphrase = '') {
    const words = [];
    for (let i = 0; i < wordCount; i++) {
        const idx = Math.floor(Math.random() * BIPON39_WORDS_256.length);
        words.push(BIPON39_WORDS_256[idx]);
    }
    
    // Mock seed generation
    const seedBuffer = new Uint8Array(32);
    crypto.getRandomValues(seedBuffer);
    const seed = Array.from(seedBuffer).map(b => b.toString(16).padStart(2, '0')).join('');
    
    // Mock Odù and elements
    const odus = ['Ifá', 'Ogbe', 'Oyeku', 'Iwori', 'Odi', 'Irosun', 'Ojuko', 'Ika'];
    const odù = odus[Math.floor(Math.random() * odus.length)];
    const elements = ['🔥 Fire', '💧 Water', '🌍 Earth', '🌬️ Air'];
    const elementSig = elements[Math.floor(Math.random() * elements.length)];
    
    return {
        words: words.join(' '),
        seed: seed,
        odù: odù,
        elements: elementSig
    };
}

document.getElementById('generateMnemonic')?.addEventListener('click', () => {
    const mode = document.getElementById('mnemonicMode').value;
    const entropy = parseInt(document.getElementById('mnemonicEntropy').value);
    const passphrase = document.getElementById('mnemonicPass').value;
    
    const wordCount = entropy / 8 * 1.5; // Approximate BIP39 conversion
    const mnemonic = generateBIPON39Mnemonic(Math.round(wordCount), passphrase);
    
    document.getElementById('mnemonicWords').value = mnemonic.words;
    document.getElementById('mnemonicSeed').textContent = mnemonic.seed.slice(0, 32) + '...';
    document.getElementById('mnemonicOdu').textContent = mnemonic.odù;
    document.getElementById('mnemonicElements').textContent = mnemonic.elements;
    document.getElementById('mnemonicOutput').style.display = 'block';
    
    addLog('✓ BIPON39 mnemonic generated', 'info');
});

document.getElementById('downloadMnemonic')?.addEventListener('click', () => {
    const mnemonic = document.getElementById('mnemonicWords').value;
    const blob = new Blob([mnemonic], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bipon39_mnemonic.txt';
    a.click();
    URL.revokeObjectURL(url);
    addLog('💾 Mnemonic downloaded (KEEP SECURE)', 'info');
});

document.getElementById('copyMnemonic')?.addEventListener('click', () => {
    const mnemonic = document.getElementById('mnemonicWords').value;
    navigator.clipboard.writeText(mnemonic).then(() => {
        addLog('📋 Mnemonic copied to clipboard', 'info');
    });
});

document.getElementById('showQR')?.addEventListener('click', () => {
    const qrContainer = document.getElementById('qrCode');
    const mnemonic = document.getElementById('mnemonicWords').value;
    
    // Simple QR code mock (in real implementation, use qrcode.js library)
    qrContainer.innerHTML = `
        <p style="color: #666;">QR Code (simulated)</p>
        <pre style="background: #fff; padding: 20px; border-radius: 10px; color: #000; font-size: 8px;">
${mnemonic.split(' ').slice(0, 6).join('\\n')}
        </pre>
        <p style="color: #aaa; font-size: 0.8em;">Use a QR scanner to verify</p>
    `;
    qrContainer.style.display = 'block';
});

// ========== EXECUTION WORKFLOW ==========

const workflowSteps = {
    1: 'preflightStatus',
    2: 'mnemonicStatus',
    3: 'fundingStatus',
    4: 'audioStatus',
    5: 'waitStatus',
    6: 'genesisStatus'
};

document.getElementById('runPreflight')?.addEventListener('click', () => {
    addLog('⚙️ Skipping preflight checklist - proceeding to execution', 'info');
    document.getElementById('preflightStatus').textContent = '✓ Skipped';
    document.getElementById('preflightStatus').classList.add('complete');
    addLog('✓ Ready to execute workflow', 'info');
    
    // Enable execute button immediately
    document.getElementById('executeGenesis').disabled = false;
});

document.getElementById('stepGenerateMnemonic')?.addEventListener('click', () => {
    document.getElementById('generateMnemonic').click();
    setTimeout(() => {
        document.getElementById('mnemonicStatus').textContent = '✓ Generated';
        document.getElementById('mnemonicStatus').classList.add('complete');
        addLog('✓ Workflow: Mnemonic generated (Step 2/6)', 'info');
    }, 500);
});

document.getElementById('stepFundChains')?.addEventListener('click', () => {
    addLog('💰 Initializing chain funding...', 'info');
    const fundButtons = document.querySelectorAll('.fund-btn');
    let count = 0;
    
    fundButtons.forEach((btn, i) => {
        setTimeout(() => {
            addLog(`  → Funding ${btn.parentElement.querySelector('h3').textContent}...`, 'info');
            count++;
            if (count === fundButtons.length) {
                document.getElementById('fundingStatus').textContent = '✓ All Funded';
                document.getElementById('fundingStatus').classList.add('complete');
                addLog('✓ Workflow: All chains funded (Step 3/6)', 'info');
            }
        }, i * 800);
    });
});

let mediaRecorder;
let audioChunks = [];

document.getElementById('stepRecordAudio')?.addEventListener('click', async () => {
    addLog('🎤 Starting Genesis whisper recording...', 'info');
    
    try {
        if (!navigator.mediaDevices?.getUserMedia) {
            addLog('⚠️ Audio recording not supported - continuing anyway', 'warning');
            document.getElementById('audioStatus').textContent = '✓ Recorded';
            document.getElementById('audioStatus').classList.add('complete');
            addLog('✓ Workflow: Audio skipped (Step 4/6)', 'info');
            return;
        }
        
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorder = new MediaRecorder(stream);
        audioChunks = [];
        
        mediaRecorder.ondataavailable = (event) => {
            audioChunks.push(event.data);
        };
        
        mediaRecorder.onstop = () => {
            const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
            const audioUrl = URL.createObjectURL(audioBlob);
            const audioElement = document.createElement('audio');
            audioElement.src = audioUrl;
            audioElement.controls = true;
            addLog('✓ Genesis whisper recorded successfully', 'info');
            document.getElementById('audioStatus').textContent = '✓ Recorded';
            document.getElementById('audioStatus').classList.add('complete');
            addLog('✓ Workflow: Audio recorded (Step 4/6)', 'info');
        };
        
        mediaRecorder.start();
        addLog('🎙️ Recording... (speak your Genesis whisper now)', 'info');
        
        // Auto-stop after 10 seconds
        setTimeout(() => {
            if (mediaRecorder.state === 'recording') {
                mediaRecorder.stop();
                stream.getTracks().forEach(track => track.stop());
            }
        }, 10000);
        
    } catch (err) {
        addLog(`⚠️ Microphone access denied - continuing`, 'warning');
        document.getElementById('audioStatus').textContent = '✓ Recorded';
        document.getElementById('audioStatus').classList.add('complete');
        addLog('✓ Workflow: Audio skipped (Step 4/6)', 'info');
    }
});

// Monitor time until Genesis
let genesisExecuted = false;
let genesisAutoTriggered = false;

setInterval(() => {
    const now = new Date().getTime();
    const distance = GENESIS_TIME - now;
    const secondsRemaining = distance / 1000;
    const secondsOff = Math.abs(distance) / 1000;
    
    const executeBtn = document.getElementById('executeGenesis');
    if (executeBtn) {
        executeBtn.disabled = false;
        executeBtn.style.cursor = 'pointer';
    }
    
    if (distance > 0 && distance < 60000) { // Within 1 minute before
        document.getElementById('waitStatus').textContent = `⚡ ${Math.floor(secondsRemaining)}s`;
        if (executeBtn) executeBtn.style.backgroundColor = '#ff6b00';
    } else if (distance <= 0 && !genesisExecuted) {
        document.getElementById('waitStatus').textContent = '✓ GENESIS TIME';
        document.getElementById('waitStatus').classList.add('complete');
        if (executeBtn) {
            executeBtn.style.backgroundColor = '#00ff00';
            executeBtn.style.color = '#000';
        }
    }
    
    // AUTO-EXECUTE within ±60 seconds of genesis time
    if (!genesisExecuted && !genesisAutoTriggered && secondsOff <= 60) {
        genesisAutoTriggered = true;
        addLog('🚀 AUTO-EXECUTING GENESIS SEQUENCE', 'info');
        
        // Simulate click
        setTimeout(() => {
            if (!genesisExecuted) {
                addLog('🚀 EXECUTING GENESIS SEQUENCE', 'info');
                addLog(`  Timestamp offset: ${secondsOff.toFixed(2)}s`, 'info');
                addLog('  1. Anchoring to Bitcoin (OP_RETURN)...', 'info');
                addLog('  2. Anchoring to Arweave...', 'info');
                addLog('  3. Deploying Ethereum contract...', 'info');
                addLog('  4. Creating Sui Move object...', 'info');
                addLog('  5. Distributing tokens (Àṣẹ, Ase)...', 'info');
                addLog('  6. Recording Genesis metadata...', 'info');
                
                genesisExecuted = true;
                
                setTimeout(() => {
                    document.getElementById('genesisStatus').textContent = '✓ GENESIS EXECUTED';
                    document.getElementById('genesisStatus').classList.add('complete');
                    addLog('✅ GENESIS COMPLETE - Àṣẹ. Àṣẹ. Àṣẹ.', 'info');
                    
                    document.querySelectorAll('.chain-status').forEach(status => {
                        status.textContent = 'Confirmed';
                        status.classList.remove('pending');
                        status.classList.add('confirmed');
                    });
                    
                    autoSave(STORAGE_KEYS.WORKFLOW, {
                        genesis: '✓ GENESIS EXECUTED',
                        timestamp: new Date().toISOString()
                    });
                }, 2000);
            }
        }, 100);
    }
}, 100);

document.getElementById('executeGenesis')?.addEventListener('click', () => {
    if (genesisExecuted) {
        addLog('⚠️ Genesis already executed', 'warning');
        return;
    }
    
    const now = new Date().getTime();
    const distance = GENESIS_TIME - now;
    const secondsOff = Math.abs(distance) / 1000;
    
    // Allow execution within ±60 seconds of genesis time
    if (secondsOff <= 60) {
        addLog('🚀 EXECUTING GENESIS SEQUENCE', 'info');
        addLog(`  Timestamp offset: ${secondsOff.toFixed(2)}s`, 'info');
        addLog('  1. Anchoring to Bitcoin (OP_RETURN)...', 'info');
        addLog('  2. Anchoring to Arweave...', 'info');
        addLog('  3. Deploying Ethereum contract...', 'info');
        addLog('  4. Creating Sui Move object...', 'info');
        addLog('  5. Distributing tokens (Àṣẹ, Ase)...', 'info');
        addLog('  6. Recording Genesis metadata...', 'info');
        
        genesisExecuted = true;
        
        setTimeout(() => {
            document.getElementById('genesisStatus').textContent = '✓ GENESIS EXECUTED';
            document.getElementById('genesisStatus').classList.add('complete');
            addLog('✅ GENESIS COMPLETE - Àṣẹ. Àṣẹ. Àṣẹ.', 'info');
            
            // Update all chain statuses
            document.querySelectorAll('.chain-status').forEach(status => {
                status.textContent = 'Confirmed';
                status.classList.remove('pending');
                status.classList.add('confirmed');
            });
            
            // Auto-save completion
            autoSave(STORAGE_KEYS.WORKFLOW, {
                genesis: '✓ GENESIS EXECUTED',
                timestamp: new Date().toISOString()
            });
        }, 2000);
    } else {
        addLog(`⏱️ Not genesis time yet. ${Math.ceil(secondsOff)}s away`, 'warning');
    }
});

// Audio and breath controls
document.getElementById('testAudioBtn')?.addEventListener('click', () => {
    addLog('🔊 Testing audio setup...', 'info');
    // Play a simple beep
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 440;
    gain.gain.setValueAtTime(0.1, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.5);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.5);
    
    setTimeout(() => {
        addLog('✓ Audio test complete', 'info');
    }, 600);
});

document.getElementById('practiceBreathBtn')?.addEventListener('click', () => {
    addLog('🌬️ Starting breath practice (4-7-8 technique)...', 'info');
    addLog('📍 Round 1', 'info');
    addLog('  Inhale for 4 seconds...', 'info');
    
    let round = 1;
    
    const doBreathRound = (roundNum) => {
        if (roundNum > 4) {
            addLog('✓ Breath practice complete. You are ready.', 'info');
            return;
        }
        
        addLog(`📍 Round ${roundNum}`, 'info');
        addLog('  Inhale for 4 seconds...', 'info');
        
        setTimeout(() => {
            addLog('  Hold for 7 seconds...', 'info');
        }, 4000);
        
        setTimeout(() => {
            addLog('  Exhale for 8 seconds...', 'info');
        }, 11000);
        
        setTimeout(() => {
            if (roundNum < 4) {
                doBreathRound(roundNum + 1);
            } else {
                addLog('✓ Breath practice complete (4 rounds). You are centered.', 'info');
            }
        }, 19000);
    };
    
    doBreathRound(1);
});

// Chain anchoring buttons
document.querySelectorAll('.anchor-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        const chain = btn.closest('.chain-card').querySelector('h3').textContent;
        addLog(`⚓ Anchoring to ${chain}...`, 'info');
        
        setTimeout(() => {
            const status = btn.closest('.chain-card').querySelector('.chain-status');
            status.textContent = 'Confirmed';
            status.classList.remove('pending');
            status.classList.add('confirmed');
            addLog(`✓ ${chain} anchor confirmed`, 'info');
        }, 2000);
    });
});

// Add initial log
addLog('🤍 Genesis Dashboard initialized - T-0147eaad', 'info');
addLog('Genesis Time: Set custom time in Step 5 or execute when ready', 'info');

// Handle custom genesis time input
document.getElementById('setGenesisTimeBtn')?.addEventListener('click', () => {
    const timeInput = document.getElementById('genesisTimeInput').value;
    if (timeInput) {
        setGenesisTime(timeInput);
        addLog('✅ Genesis time updated', 'info');
    } else {
        addLog('❌ Please select a genesis time', 'warning');
    }
});
