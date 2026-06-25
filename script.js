/**
 * ============================================================
 * FNAF - GERADOR DE SENHAS
 * MEGA BRAIN ENGINE v2.0
 * ============================================================
 */

(function() {
    'use strict';

    // ------------------------------------------------------------
    // ESTADO DO JOGO
    // ------------------------------------------------------------
    const state = {
        coins: 0,
        totalSenhas: 0,
        upgrades: {
            slotExtra: false,
            cofreSecreto: false,
            turboGerador: false,
            visaoNoturna: false,
            goldenFreddy: false
        },
        historico: []
    };

    // ------------------------------------------------------------
    // DADOS DA LOJA
    // ------------------------------------------------------------
    const SHOP_ITEMS = [{
        id: 'slotExtra',
        emoji: '🎰',
        name: 'Slot Extra',
        price: 50,
        desc: '+2 caracteres no gerador',
        effect: () => {
            const slider = document.getElementById('lengthSlider');
            let val = parseInt(slider.value, 10);
            val = Math.min(val + 2, 32);
            slider.value = val;
            updateLengthDisplay();
            return '🎰 +2 caracteres adicionados!';
        }
    }, {
        id: 'cofreSecreto',
        emoji: '🔐',
        name: 'Cofre Secreto',
        price: 100,
        desc: 'Desbloqueia !@#$%^&*()',
        effect: () => {
            document.getElementById('chkSymbols').checked = true;
            return '🔐 Símbolos especiais desbloqueados!';
        }
    }, {
        id: 'turboGerador',
        emoji: '⚡',
        name: 'Turbo Gerador',
        price: 150,
        desc: 'Gera 3 senhas de uma vez',
        effect: () => {
            let count = 0;
            for (let i = 0; i < 3; i++) {
                const result = generatePassword(true);
                if (result) count++;
            }
            return `⚡ ${count} senhas geradas em turbo!`;
        }
    }, {
        id: 'visaoNoturna',
        emoji: '👁️',
        name: 'Visão Noturna',
        price: 200,
        desc: 'Dicas avançadas de segurança',
        effect: () => {
            const pwd = document.getElementById('passwordText').textContent;
            if (pwd && pwd.length > 2 && pwd !== '••••••••••••') {
                const len = pwd.length;
                const hasUpper = /[A-Z]/.test(pwd);
                const hasLower = /[a-z]/.test(pwd);
                const hasNumber = /[0-9]/.test(pwd);
                const hasSymbol = /[^A-Za-z0-9]/.test(pwd);
                let dicas = [];
                if (len < 12) dicas.push('🔸 Use 12+ caracteres');
                if (!hasUpper) dicas.push('🔸 Adicione letras maiúsculas');
                if (!hasLower) dicas.push('🔸 Adicione letras minúsculas');
                if (!hasNumber) dicas.push('🔸 Adicione números');
                if (!hasSymbol) dicas.push('🔸 Adicione símbolos especiais');
                if (dicas.length === 0) dicas.push('✅ Senha excelente! Continue assim!');
                alert('👁️ DICAS DE SEGURANÇA:\n\n' + dicas.join('\n'));
                return '👁️ Dicas de segurança mostradas!';
            }
            alert('👁️ Gere uma senha primeiro para receber dicas.');
            return '👁️ Gere uma senha primeiro!';
        }
    }, {
        id: 'goldenFreddy',
        emoji: '🕹️',
        name: 'Golden Freddy',
        price: 500,
        desc: 'Modo Ultra (32 chars, tudo ativo)',
        effect: () => {
            const slider = document.getElementById('lengthSlider');
            slider.value = 32;
            updateLengthDisplay();
            document.getElementById('chkUpper').checked = true;
            document.getElementById('chkLower').checked = true;
            document.getElementById('chkNumbers').checked = true;
            document.getElementById('chkSymbols').checked = true;
            generatePassword();
            return '🕹️ GOLDEN MODE ATIVADO! Senha ultra-segura!';
        }
    }];

    // ------------------------------------------------------------
    // DOM REFS
    // ------------------------------------------------------------
    const coinDisplay = document.getElementById('coinDisplay');
    const passwordText = document.getElementById('passwordText');
    const strengthFill = document.getElementById('strengthFill');
    const strengthLabel = document.getElementById('strengthLabel');
    const lengthSlider = document.getElementById('lengthSlider');
    const lengthDisplay = document.getElementById('lengthDisplay');
    const lengthLabel = document.getElementById('lengthLabel');
    const btnGenerate = document.getElementById('btnGenerate');
    const btnCopy = document.getElementById('btnCopy');
    const btnNew = document.getElementById('btnNew');
    const shopGrid = document.getElementById('shopGrid');
    const rewardPopup = document.getElementById('rewardPopup');
    const rewardAmount = document.getElementById('rewardAmount');
    const rewardDesc = document.getElementById('rewardDesc');
    const totalSenhasDisplay = document.getElementById('totalSenhas');
    const historicoCountDisplay = document.getElementById('historicoCount');

    // ------------------------------------------------------------
    // HELPERS
    // ------------------------------------------------------------
    function updateCoinDisplay() {
        coinDisplay.textContent = state.coins;
        // Animação de pulso
        coinDisplay.classList.remove('pulse');
        void coinDisplay.offsetWidth; // trigger reflow
        coinDisplay.classList.add('pulse');
    }

    function updateLengthDisplay() {
        const val = lengthSlider.value;
        lengthDisplay.textContent = val + ' caracteres';
        lengthLabel.textContent = val;
    }

    function updateStats() {
        totalSenhasDisplay.textContent = state.totalSenhas;
        historicoCountDisplay.textContent = state.historico.length;
    }

    // ------------------------------------------------------------
    // GERADOR DE SENHA (criptograficamente seguro)
    // ------------------------------------------------------------
    function generatePassword(silent = false) {
        const length = parseInt(lengthSlider.value, 10);
        const useUpper = document.getElementById('chkUpper').checked;
        const useLower = document.getElementById('chkLower').checked;
        const useNumbers = document.getElementById('chkNumbers').checked;
        const useSymbols = document.getElementById('chkSymbols').checked;

        let charset = '';
        if (useUpper) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
        if (useLower) charset += 'abcdefghijklmnopqrstuvwxyz';
        if (useNumbers) charset += '0123456789';
        if (useSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';

        if (charset.length === 0) {
            if (!silent) {
                alert('⚠️ Selecione pelo menos um tipo de caractere!');
            }
            return null;
        }

        // Gerador seguro usando crypto
        let pwd = '';
        const array = new Uint32Array(length);
        crypto.getRandomValues(array);
        for (let i = 0; i < length; i++) {
            pwd += charset[array[i] % charset.length];
        }

        passwordText.textContent = pwd;
        document.querySelector('.password-display').classList.add('has-password');
        state.totalSenhas++;

        // Calcula força
        const strength = calculateStrength(pwd, charset.length);
        updateStrengthBar(strength);

        // Calcula recompensa
        let reward = 10; // base

        if (length >= 16) reward += 15;
        if (length >= 24) reward += 10;
        if (useUpper && useLower && useNumbers && useSymbols) reward += 15;
        if (strength >= 80) reward += 20;
        if (strength >= 60) reward += 10;

        // Bônus Golden Freddy
        if (state.upgrades.goldenFreddy) reward += 50;

        // Bônus por senha com todos os tipos
        if (useUpper && useLower && useNumbers && useSymbols) {
            reward += 5;
        }

        state.coins += reward;
        updateCoinDisplay();

        // Mostra recompensa (se não for silencioso)
        if (!silent) {
            let msg = 'Senha gerada!';
            if (strength >= 80) msg = '💪 SENHA MUITO FORTE!';
            else if (strength >= 60) msg = '🔒 SENHA FORTE!';
            else if (strength >= 40) msg = '🔓 Senha média';
            else msg = '⚠️ Senha fraca';
            showReward(`+${reward} 🪙 ${msg}`, reward);
        }

        // Histórico
        state.historico.push({
            pwd,
            strength,
            reward,
            timestamp: Date.now()
        });
        if (state.historico.length > 50) state.historico.shift();
        updateStats();

        return pwd;
    }

    // ------------------------------------------------------------
    // CÁLCULO DE FORÇA
    // ------------------------------------------------------------
    function calculateStrength(pwd, charsetSize) {
        const len = pwd.length;
        if (len === 0) return 
