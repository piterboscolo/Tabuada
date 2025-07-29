let numeroAtual = 0;
let acertos = 0;
let totalPerguntas = 0;
let jogoIniciado = false;
let questoesErradas = [];
let modoRevisao = false;
let registroErros = [];
let tabuadaAtual = 1;

// Função para iniciar ou reiniciar o jogo
function iniciarJogo() {
    // Reseta as estatísticas
    acertos = 0;
    totalPerguntas = 0;
    jogoIniciado = true;
    numeroAtual = 0;
    questoesErradas = [];
    registroErros = [];
    modoRevisao = false;
    
    // Obtém a tabuada selecionada
    tabuadaAtual = parseInt(document.getElementById('tabuadaSelector').value);
    
    // Atualiza a interface
    document.getElementById('acertos').textContent = '0';
    document.getElementById('total').textContent = '0';
    document.getElementById('porcentagem').textContent = '0';
    document.getElementById('feedback').innerHTML = '';
    document.getElementById('feedback').className = 'feedback';
    
    // Mostra os elementos do jogo
    document.getElementById('pergunta').classList.remove('hidden');
    document.getElementById('inputContainer').classList.remove('hidden');
    document.getElementById('verificarBtn').classList.remove('hidden');
    
    // Muda o texto do botão
    document.getElementById('iniciarBtn').textContent = 'Reiniciar';
    
    // Desabilita o seletor de tabuada durante o jogo
    document.getElementById('tabuadaSelector').disabled = true;
    
    // Gera a primeira pergunta
    gerarNovaPergunta();
    document.getElementById('resposta').focus();
}

// Função para gerar nova pergunta
function gerarNovaPergunta() {
    if (!jogoIniciado) return;
    
    if (modoRevisao) {
        if (questoesErradas.length === 0) {
            finalizarJogo();
            return;
        }
        numeroAtual = questoesErradas[0];
    } else if (numeroAtual >= 10) {
        if (questoesErradas.length > 0) {
            modoRevisao = true;
            document.getElementById('feedback').innerHTML = 
                '📝 Hora de revisar as questões que você errou!';
            document.getElementById('feedback').className = 'feedback';
            numeroAtual = questoesErradas[0];
        } else {
            finalizarJogo();
            return;
        }
    }

    document.getElementById('pergunta').innerHTML = 
        `<h2>Quanto é ${tabuadaAtual} x ${numeroAtual}?</h2>`;
    document.getElementById('resposta').value = '';
    document.getElementById('resposta').focus();
}

// Função para verificar a resposta
function verificarResposta() {
    if (!jogoIniciado) return;
    
    const respostaUsuario = parseInt(document.getElementById('resposta').value);
    if (isNaN(respostaUsuario)) {
        document.getElementById('feedback').innerHTML = 
            'Por favor, digite um número!';
        document.getElementById('feedback').className = 'feedback incorrect';
        return;
    }
    
    const respostaCorreta = tabuadaAtual * numeroAtual;

    if (respostaUsuario === respostaCorreta) {
        acertos++;
        document.getElementById('feedback').innerHTML = 
            '✨ Parabéns! Você acertou!';
        document.getElementById('feedback').className = 'feedback correct';
        
        if (modoRevisao) {
            // Remove a questão da lista de erros
            questoesErradas.shift();
        } else {
            numeroAtual++;
            totalPerguntas++;
        }
        
        // Atualiza as estatísticas
        atualizarEstatisticas();
        
        // Gera nova pergunta após 1.5 segundos
        setTimeout(gerarNovaPergunta, 1500);
    } else {
        document.getElementById('feedback').innerHTML = 
            `❌ Ops! A resposta correta é ${respostaCorreta}`;
        document.getElementById('feedback').className = 'feedback incorrect';
        
        // Rola a tela até o campo de resposta
        document.getElementById('resposta').scrollIntoView({ 
            behavior: 'smooth',
            block: 'center'
        });
        
        if (!modoRevisao) {
            if (!questoesErradas.includes(numeroAtual)) {
                questoesErradas.push(numeroAtual);
                // Registra o erro
                registroErros.push({
                    pergunta: `${tabuadaAtual} x ${numeroAtual}`,
                    respostaCorreta: respostaCorreta,
                    respostaUsuario: respostaUsuario
                });
            }
            
            // Atualiza as estatísticas
            totalPerguntas++;
            atualizarEstatisticas();
            
            // Passa para o próximo número após 1.5 segundos
            setTimeout(() => {
                numeroAtual++;
                gerarNovaPergunta();
            }, 1500);
        } else {
            // Em modo revisão, apenas gera nova pergunta após 1.5 segundos
            setTimeout(gerarNovaPergunta, 1500);
        }
    }
}

// Função para atualizar as estatísticas na tela
function atualizarEstatisticas() {
    document.getElementById('acertos').textContent = acertos;
    document.getElementById('total').textContent = totalPerguntas;
    const porcentagem = totalPerguntas > 0 ? ((acertos / totalPerguntas) * 100).toFixed(1) : '0';
    document.getElementById('porcentagem').textContent = porcentagem;
}

// Função para mostrar o resumo dos erros
function mostrarResumoErros() {
    let resumo = '<div class="resumo-erros">\n';
    resumo += '<h3>Resumo dos Erros:</h3>\n';
    
    registroErros.forEach(erro => {
        resumo += `<p>Na pergunta ${erro.pergunta}:\n`;
        resumo += `- Sua resposta: ${erro.respostaUsuario}\n`;
        resumo += `- Resposta correta: ${erro.respostaCorreta}</p>\n`;
    });
    
    resumo += '</div>';
    return resumo;
}

// Função para finalizar o jogo
function finalizarJogo() {
    jogoIniciado = false;
    document.getElementById('pergunta').classList.add('hidden');
    document.getElementById('inputContainer').classList.add('hidden');
    document.getElementById('verificarBtn').classList.add('hidden');
    document.getElementById('tabuadaSelector').disabled = false;
    
    let mensagemFinal = `🎉 Parabéns! Você completou a tabuada do ${tabuadaAtual}!`;
    
    if (registroErros.length > 0) {
        mensagemFinal += '\n\n' + mostrarResumoErros();
    } else {
        mensagemFinal += '\n\nVocê não cometeu nenhum erro! 🌟';
    }
    
    document.getElementById('feedback').innerHTML = mensagemFinal;
    document.getElementById('feedback').className = 'feedback correct';
}

// Limita o input para no máximo 2 dígitos
document.getElementById('resposta').addEventListener('input', function(e) {
    if (this.value.length > 2) {
        this.value = this.value.slice(0, 2);
    }
});

// Adiciona evento para tecla Enter
document.getElementById('resposta').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        verificarResposta();
    }
});

// Inicia o jogo
gerarNovaPergunta();