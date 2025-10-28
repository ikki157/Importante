// --- Configuração das Legendas ---
const legendas = [
    "Quero falar algo sério para você",
    "Já está praticamente escancarado que sinto algo por você",
    "Você é uma pessoa incrível",
    "Sei que você é um pouco mais velha que eu, mas isso não faz diferença",
    "Eu quero estar ao seu lado para agregar e não o oposto",
    "Quero te apoiar e te conhecer melhor a cada dia",
    "Mas veja, eu sou um bom partido kkkkkkkk",
    "Sou fiel e sempre vou te apoiar e quando você precisar estarei lá",
    "E também sei cozinhar arroz e feijão, e trocar tomadas kkkkkkk",
    "Então minha pergunta para você é...",
    "Você me daria a oportunidade de termos algo juntos?",
    "Luma você quer namorar comigo?"
];

let indexLegenda = 0;
const subtitleElement = document.getElementById('subtitles');

// Elementos do overlay de início
const startOverlay = document.getElementById('startOverlay');
const startButton = document.getElementById('startButton');

function mostrarProximaLegenda() {
    if (indexLegenda < legendas.length) {
        subtitleElement.style.opacity = '0'; // Começa apagado

        setTimeout(() => {
            subtitleElement.innerText = legendas[indexLegenda];
            subtitleElement.style.opacity = '1'; // Aparece
            indexLegenda++;
        }, 500); // Tempo para apagar (fade out)

        // Define o tempo que a legenda fica na tela
        setTimeout(mostrarProximaLegenda, 5000); // Próxima legenda em 5 segundos
    } else {
        // Quando acabarem as legendas, mostra os botões (se já não estiverem visíveis)
        document.getElementById('buttons').style.display = 'block';
    }
}

// Função que desmuta a música com fade (reutilizável)
function unmuteWithFade(){
    try{
        // garante que o áudio esteja tocando
        musica.play().catch(()=>{});
        musica.muted = false;
        musica.volume = 0;

        const fadeDuration = 800; // ms
        const steps = 16;
        let current = 0;
        const stepTime = Math.max(10, Math.floor(fadeDuration / steps));
        const iv = setInterval(()=>{
            current++;
            musica.volume = Math.min(1, current/steps);
            if(current >= steps){
                clearInterval(iv);
                musica.volume = 1;
            }
        }, stepTime);
    }catch(e){
        try{ musica.muted = false; musica.play().catch(()=>{}); }catch(e){}
    }
}

// --- Configuração dos Botões ---
const btnSim = document.getElementById('btnSim');
const btnNao = document.getElementById('btnNao');
const resultadoElement = document.getElementById('resultado');
const buttonsElement = document.getElementById('buttons');
const musica = document.getElementById('musicaFundo');
const mainContainer = document.getElementById('mainContainer'); // Pega o container principal
const deletingDataElement = document.getElementById('deletingData'); // Pega a mensagem piscando

let cliquesNoNao = 0;

// --- Lógica do Botão SIM ---
btnSim.addEventListener('click', () => {
    // Esconde legendas e botões
    subtitleElement.style.display = 'none';
    buttonsElement.style.display = 'none';

    // Mostra mensagem de sucesso
    resultadoElement.innerHTML = "ISSO AI!!! 🎉<br>Agora você ganhou oficialmente um litro de açaí (e meu coração)! kkkkkkkkkkk, obrigado por me dá uma chance.";
    resultadoElement.style.display = 'block';
    resultadoElement.innerHTML = resultadoElement.innerHTML.replace(/\n/g, '<br>');

    // Toca som de fogos (arquivo `fogos.mp3` se existir, senão sintetizado)
    playFireworksSound();

    // Ativa os fogos de artifício!
    dispararFogos();
});

// --- Lógica do Botão NÃO (ATUALIZADA) ---
btnNao.addEventListener('click', () => {
    cliquesNoNao++;

    if (cliquesNoNao === 1) {
        resultadoElement.innerText = "Tem certeza? 🥺 Pensa bem, não vai ganhar açaí...";
        // Move o botão "Não" de lugar para dificultar (opcional engraçado)
        btnNao.style.position = 'absolute';
        btnNao.style.top = `${Math.random() * 80 + 10}%`;
        btnNao.style.left = `${Math.random() * 80 + 10}%`;
    } else if (cliquesNoNao === 2) {
        resultadoElement.innerText = "Última chance! O açaí tá garantido se clicar no verde!";
        btnNao.innerText = "Insisto no Não";
    } else {
        // --- AÇÃO ATUALIZADA ---
        // 1. Fade out suave da música
        try {
            // tenta reduzir o volume em 400ms
            const fadeDuration = 400;
            const initialVolume = musica.volume ?? 1;
            const steps = 8;
            const stepTime = fadeDuration / steps;
            let currentStep = 0;
            const fadeInterval = setInterval(() => {
                currentStep++;
                musica.volume = Math.max(0, initialVolume * (1 - currentStep / steps));
                if (currentStep >= steps) {
                    clearInterval(fadeInterval);
                    musica.pause();
                    musica.volume = initialVolume; // reseta pra caso volte
                }
            }, stepTime);
        } catch (e) {
            musica.pause();
        }

        // 2. Escurece o fundo suavemente (vai usar a transição do CSS)
        document.body.style.background = '#000';

        // 3. Some com o container principal (o retângulo branco)
        mainContainer.style.opacity = '0';
        setTimeout(() => { // Espera a animação de sumir terminar
             mainContainer.style.display = 'none';
        }, 500);

        // 4. Inicia a sequência de apagar dados (contagem regressiva + última chance)
        startDeleteSequence();
    }
});

// --- Função dos Fogos (Confetti) ---
function dispararFogos() {
    const canvas = document.getElementById('confetti-canvas');
    const myConfetti = confetti.create(canvas, {
        resize: true,
        useWorker: true
    });

    function animacaoFogos() {
        myConfetti({ particleCount: 150, spread: 180, origin: { y: 0.6 } });
        myConfetti({ particleCount: 100, angle: 60, spread: 55, origin: { x: 0 } });
        myConfetti({ particleCount: 100, angle: 120, spread: 55, origin: { x: 1 } });
    }

    animacaoFogos();
    setTimeout(animacaoFogos, 1000);
    setTimeout(animacaoFogos, 2000);
}

// --- Início ---

// Inicializa a música em modo mutado para permitir autoplay em navegadores modernos
function initMusicAutoplayMuted(){
    try{
        musica.muted = true; // começa mutado para permitir autoplay
        // tenta tocar (deve funcionar quando mutado)
        musica.play().catch(()=>{
            // se ainda assim falhar, aceitaremos a primeira interação do usuário
            // nada extra aqui — a função unmute lidará com o play quando necessário
        });
        // Ao primeiro clique do usuário, desmutar com um fade-in suave (fallback)
        document.body.addEventListener('click', unmuteWithFade, { once: true });
    }catch(e){
        // fallback: tenta tocar quando o usuário clicar
        document.body.addEventListener('click', () => musica.play(), { once: true });
    }
}

initMusicAutoplayMuted();

// Esconde os botões iniciais (aparecem depois das legendas)
buttonsElement.style.display = 'none';

// Handler do botão de início — inicia a música e revela o conteúdo
function startExperience(){
    // evita múltiplos cliques
    if(startOverlay) startOverlay.style.display = 'none';

    // desmuta e faz fade
    unmuteWithFade();

    // revela o conteúdo e inicia as legendas um pouco depois
    if(mainContainer){
        mainContainer.style.display = 'block';
        // pequena espera visual antes de iniciar as legendas
        setTimeout(mostrarProximaLegenda, 600);
    } else {
        // fallback caso mainContainer não exista
        setTimeout(mostrarProximaLegenda, 600);
    }
}

if(startButton){
    startButton.addEventListener('click', (e)=>{
        e.preventDefault();
        // remove o listener de body para evitar duplicidade
        try{ document.body.removeEventListener('click', unmuteWithFade); }catch(e){}
        startExperience();
    });
}

// --- Som sintetizado para a ação de apagar dados ---
function playDeleteSound(){
    // Tenta tocar o arquivo perigo.mp3 (elemento <audio>), senão usa WebAudio sintetizado como fallback
    const perigoEl = document.getElementById('perigoAudio');
    if (perigoEl && typeof perigoEl.play === 'function') {
        try {
            perigoEl.currentTime = 0;
            perigoEl.play().catch(err => {
                // se houver erro (por exemplo autoplay bloqueado), usa fallback sintetizado
                console.warn('Falha ao tocar perigo.mp3, usando fallback sintetizado.', err);
                synthDeleteSound();
            });
            return;
        } catch (e) {
            console.warn('Erro ao iniciar perigo.mp3, usando fallback sintetizado.', e);
        }
    }

    // Fallback sintetizado
    synthDeleteSound();
}

function synthDeleteSound(){
    try{
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const ctx = new AudioContext();

        // efeito curto: oscilador para criar um 'whoosh' descendente
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(800, ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.45);

        // envelope
        gain.gain.setValueAtTime(0, ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.9, ctx.currentTime + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);

        osc.connect(gain).connect(ctx.destination);
        osc.start(ctx.currentTime);
        osc.stop(ctx.currentTime + 0.55);

        // fecha o contexto depois do som para liberar recursos
        setTimeout(()=>{
            try{ ctx.close(); }catch(e){}
        },700);
    }catch(e){
        // fallback silencioso se WebAudio não estiver disponível
        console.warn('WebAudio não disponível para o som de apagar dados', e);
    }
}

// --- Som de fogos (SIM) ---
function playFireworksSound(){
    const fogosEl = document.getElementById('fogosAudio');
    if (fogosEl && typeof fogosEl.play === 'function'){
        try{
            fogosEl.currentTime = 0;
            fogosEl.play().catch(err=>{
                console.warn('Falha ao tocar fogos.mp3, usando fallback sintetizado.', err);
                synthFireworksSound();
            });
            return;
        }catch(e){
            console.warn('Erro ao iniciar fogos.mp3, usando fallback sintetizado.', e);
        }
    }
    synthFireworksSound();
}

function synthFireworksSound(){
    try{
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        const ctx = new AudioContext();

        // cria três curtos bursts com frequências diferentes para simular fogos
        const now = ctx.currentTime;
        const bursts = [0, 0.08, 0.18];
        bursts.forEach((startOffset, i) => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = i === 1 ? 'triangle' : 'sine';
            const baseFreq = 400 + i * 180 + Math.random() * 120;
            osc.frequency.setValueAtTime(baseFreq, now + startOffset);
            osc.frequency.exponentialRampToValueAtTime(baseFreq * 0.35, now + startOffset + 0.25);

            gain.gain.setValueAtTime(0.0001, now + startOffset);
            gain.gain.exponentialRampToValueAtTime(0.9, now + startOffset + 0.01);
            gain.gain.exponentialRampToValueAtTime(0.0001, now + startOffset + 0.4 + Math.random()*0.2);

            osc.connect(gain).connect(ctx.destination);
            osc.start(now + startOffset);
            osc.stop(now + startOffset + 0.6 + Math.random()*0.2);
        });

        // fecha o contexto depois dos sons
        setTimeout(()=>{ try{ ctx.close(); }catch(e){} }, 1200);
    }catch(e){
        console.warn('WebAudio não disponível para som de fogos', e);
    }
}

// ------- Lógica e controle da sequência de exclusão -------
let _deleteInterval = null;
let _deleteSeconds = 5;
let _previousBodyBackground = '';

function startDeleteSequence(){
    if(!deletingDataElement) return;

    // guarda background para poder restaurar caso o usuário cancele
    _previousBodyBackground = document.body.style.background || '';

    // efeito de piscar único
    deletingDataElement.classList.add('flash-once');
    deletingDataElement.style.display = 'block';
    // remove a classe de flash depois da animação
    setTimeout(()=> deletingDataElement.classList.remove('flash-once'), 400);

    // mostra aviso inicial com contador
    setTimeout(()=>{
        deletingDataElement.innerHTML = `
            <div class="notice">Dados serão apagados em <span class="countdown-num">${_deleteSeconds}</span> segundos</div>
            <button id="lastChanceSim" class="last-chance">Última chance: SIM</button>
        `;

        const lastBtn = document.getElementById('lastChanceSim');
        if(lastBtn){
            lastBtn.addEventListener('click', (e)=>{
                e.preventDefault();
                // usuário escolheu a última chance: cancela exclusão e executa o mesmo fluxo do SIM
                cancelDeleteSequence(true);
                document.body.style.background = 'linear-gradient(180deg,#ff6b9a,#e9447a)';
            });
        }

        // inicia contagem regressiva
        const countdownEl = deletingDataElement.querySelector('.countdown-num');
        let seconds = _deleteSeconds;
        // atualiza inicialmente (já foi preenchido)
        if(countdownEl) countdownEl.innerText = seconds;
        _deleteInterval = setInterval(()=>{
            seconds--;
            if(countdownEl) countdownEl.innerText = seconds;
            if(seconds <= 0){
                clearInterval(_deleteInterval);
                _deleteInterval = null;
                // mostra mensagem final e executa exclusão
                deletingDataElement.innerHTML = '<div class="notice">⚠️ APAGANDO DADOS ⚠️</div>';
                // toca som de perigo e, após um pequeno atraso, tenta fechar/limpar o site
                playDeleteSound();
                setTimeout(()=>{
                    // tentativa de fechar a janela (pode não funcionar em todas as situações)
                    try{ window.close(); }catch(e){}
                    // alternativa: redireciona para about:blank e limpa o conteúdo
                    try{ document.documentElement.innerHTML = ''; window.location.href = 'about:blank'; }catch(e){}
                }, 2000);
            }
        }, 1000);

    }, 420); // espera terminar o flash
}

function cancelDeleteSequence(triggerSimBehavior = false){
    // limpa timers
    if(_deleteInterval){ clearInterval(_deleteInterval); _deleteInterval = null; }

    // restaura visual
    deletingDataElement.style.display = 'none';
    deletingDataElement.innerHTML = '';
    // restaura background
    if(_previousBodyBackground !== undefined) document.body.style.background = _previousBodyBackground;

    // restaura container principal
    if(mainContainer){
        mainContainer.style.display = 'block';
        // animação suave de entrada
        setTimeout(()=> mainContainer.style.opacity = '1', 50);
    }

    // reinicia contagem de cliques de 'Não'
    cliquesNoNao = 0;

    // se o cancel foi por clicar no botão SIM da tela de exclusão, executa comportamento de SIM
    if(triggerSimBehavior){
        // esconde legendas e botões
        subtitleElement.style.display = 'none';
        buttonsElement.style.display = 'none';
        // mostra resultado positivo
        resultadoElement.innerHTML = "ISSO AI!!! 🎉<br>Você cancelou a exclusão — Agora você ganhou oficialmente um litro de açaí (e meu coração)! kkkkkkkkkkk, obrigado por me dá uma chance.";
        resultadoElement.style.display = 'block';
        // toca fogos e anima confetti
        playFireworksSound();
        dispararFogos();
    }
}
