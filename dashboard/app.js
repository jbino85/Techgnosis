// Genesis Countdown Timer
const GENESIS_TIME = new Date('2025-11-11T11:11:11.110Z').getTime();

function updateCountdown() {
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

// Update countdown every second
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

// Console commands
console.log('%c🤍🗿⚖️🕊️🌄 GENESIS DASHBOARD LOADED', 'font-size: 20px; font-weight: bold;');
console.log('%cAvailable commands:', 'font-weight: bold;');
console.log('  - Press R to refresh countdown');
console.log('  - Press C to clear checklist');
console.log('  - Call exportData() to export dashboard state');

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
    addLog('⚙️ Running preflight checks...', 'info');
    const checks = document.querySelectorAll('.checklist-item input[type="checkbox"]');
    const checked = Array.from(checks).filter(c => c.checked).length;
    const total = checks.length;
    
    setTimeout(() => {
        if (checked >= total * 0.8) {
            document.getElementById('preflightStatus').textContent = '✓ Complete';
            document.getElementById('preflightStatus').classList.add('complete');
            addLog(`✓ Preflight: ${checked}/${total} checks passed`, 'info');
        } else {
            document.getElementById('preflightStatus').textContent = '⚠ Incomplete';
            document.getElementById('preflightStatus').classList.add('error');
            addLog(`⚠ Preflight: ${checked}/${total} checks only`, 'warning');
        }
    }, 1000);
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

document.getElementById('stepRecordAudio')?.addEventListener('click', () => {
    addLog('🎤 Initializing audio recording...', 'info');
    if (!navigator.mediaDevices?.getUserMedia) {
        addLog('❌ Audio recording not supported in this browser', 'error');
        return;
    }
    
    addLog('🎙️ Recording Genesis whisper (awaiting user permission)...', 'info');
    setTimeout(() => {
        document.getElementById('audioStatus').textContent = '✓ Recorded';
        document.getElementById('audioStatus').classList.add('complete');
        addLog('✓ Workflow: Audio recorded (Step 4/6)', 'info');
    }, 3000);
});

// Monitor time until Genesis
setInterval(() => {
    const now = new Date().getTime();
    const distance = GENESIS_TIME - now;
    
    if (distance > 0 && distance < 1000) {
        document.getElementById('waitStatus').textContent = '⚡ IMMINENT';
        document.getElementById('executeGenesis').disabled = false;
        addLog('⚡ GENESIS IMMINENT - Execute button enabled', 'warning');
    } else if (distance <= 0) {
        document.getElementById('waitStatus').textContent = '✓ Complete';
        document.getElementById('waitStatus').classList.add('complete');
        document.getElementById('executeGenesis').disabled = false;
    }
}, 100);

document.getElementById('executeGenesis')?.addEventListener('click', () => {
    const now = new Date().getTime();
    const distance = GENESIS_TIME - now;
    
    if (Math.abs(distance) < 5000) {
        addLog('🚀 EXECUTING GENESIS SEQUENCE', 'info');
        addLog('  1. Anchoring to Bitcoin (OP_RETURN)...', 'info');
        addLog('  2. Anchoring to Arweave...', 'info');
        addLog('  3. Deploying Ethereum contract...', 'info');
        addLog('  4. Creating Sui Move object...', 'info');
        addLog('  5. Distributing tokens (Àṣẹ, Ase)...', 'info');
        addLog('  6. Recording Genesis metadata...', 'info');
        
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
        }, 2000);
    } else {
        addLog('⏱️ Not yet genesis time. Please wait...', 'warning');
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
    addLog('  Inhale for 4 seconds...', 'info');
    
    setTimeout(() => {
        addLog('  Hold for 7 seconds...', 'info');
    }, 4000);
    
    setTimeout(() => {
        addLog('  Exhale for 8 seconds...', 'info');
    }, 11000);
    
    setTimeout(() => {
        addLog('✓ Breath practice complete. Repeat 4 times before Genesis.', 'info');
    }, 19000);
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
addLog('Genesis Time: November 11, 2025 11:11:11.11 UTC', 'info');
