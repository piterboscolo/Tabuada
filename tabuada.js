let numeroAtual = 0;
let acertos = 0;
let totalPerguntas = 0;
let jogoIniciado = false;
let questoesErradas = [];
let modoRevisao = false;
let registroErros = [];

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
    } else if (numeroAtual > 10) {
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
        `<h2>Quanto é 3 x ${numeroAtual}?</h2>`;
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
    
    const respostaCorreta = 3 * numeroAtual;

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
        }
    } else {
        document.getElementById('feedback').innerHTML = 
            `❌ Ops! A resposta correta é ${respostaCorreta}`;
        document.getElementById('feedback').className = 'feedback incorrect';
        
        if (!modoRevisao) {
            if (!questoesErradas.includes(numeroAtual)) {
                questoesErradas.push(numeroAtual);
                // Registra o erro
                registroErros.push({
                    pergunta: `3 x ${numeroAtual}`,
                    respostaCorreta: respostaCorreta,
                    respostaUsuario: respostaUsuario
                });
            }
            numeroAtual++;
        }
    }

    if (!modoRevisao) totalPerguntas++;

    // Atualiza as estatísticas
    document.getElementById('acertos').textContent = acertos;
    document.getElementById('total').textContent = totalPerguntas;
    document.getElementById('porcentagem').textContent = 
        ((acertos / totalPerguntas) * 100).toFixed(1);

    // Gera nova pergunta após 1.5 segundos
    setTimeout(gerarNovaPergunta, 1500);
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
    
    let mensagemFinal = '🎉 Parabéns! Você completou a tabuada do 3!';
    
    if (registroErros.length > 0) {
        mensagemFinal += '\n\n' + mostrarResumoErros();
    }
    
    document.getElementById('feedback').innerHTML = mensagemFinal;
    document.getElementById('feedback').className = 'feedback correct';
    document.getElementById('iniciarBtn').textContent = 'Jogar Novamente';
}

// Adiciona evento de tecla Enter para verificar resposta
document.getElementById('resposta').addEventListener('keypress', function(e) {
    if (e.key === 'Enter' && jogoIniciado) {
        verificarResposta();
    }
});

// Inicia o jogo
gerarNovaPergunta();