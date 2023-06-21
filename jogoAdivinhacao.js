const prompt = require('prompt-sync')();
const fs = require('fs');

let jogador1 = {
  nome: '',
  pontos: 100,
  tentativas: 0,
};

let jogador2 = {
  nome: '',
  pontos: 100,
  tentativas: 0,
};

let recorde = 0;

function inicializarJogadores() {
  jogador1.nome = prompt('Digite o nome do jogador 1: ');
  jogador2.nome = prompt('Digite o nome do jogador 2: ');
  console.clear()

  const ranking = carregarRanking();
  if (ranking && ranking.length > 0) {
    recorde = ranking[0].pontos;
  } else {
    recorde = 0;
  }

  console.log('************************************');
  console.log('*** ADS 2023.1 - IFPI Campus Picos ***');
  console.log('** Bem vindo ao Jogo de Adivinhação **');
  console.log(`******* Alunos: ${jogador1.nome} e ${jogador2.nome} *******`);
  console.log(`* Recorde de pontos atual: ${recorde} pontos *`);
  console.log('************************************');
}
console.clear()

function gerarNumeroSecreto() {
  return Math.floor(Math.random() * 100);
}

function exibirPlacar() {
  console.log('\n*************** PLACAR ***************');
  console.log(`${jogador1.nome}: ${jogador1.pontos} pontos | ${jogador1.tentativas} tentativas`);
  console.log(`${jogador2.nome}: ${jogador2.pontos} pontos | ${jogador2.tentativas} tentativas`);
  console.log('***************************************\n');
}

function atualizarPlacar(jogadorAtual, pontos) {
  jogadorAtual.pontos -= pontos;
  if (jogadorAtual.pontos < 0) {
    jogadorAtual.pontos = 0;
  }
  jogadorAtual.tentativas++;
}

function ordenarRanking(ranking) {
  ranking.sort((a, b) => b.pontos - a.pontos);
}

function exibirRanking(ranking) {
  console.log('\n***********************************************************');
  console.log('RANKING DE PONTOS');
  console.log('***********************************************************');

  for (let i = 0; i < ranking.length; i++) {
    console.log(`${i + 1}º lugar: ${ranking[i].nome} com ${ranking[i].pontos} pontos`);
  }
}

function salvarRanking(ranking) {
  try {
    fs.writeFileSync('ranking.json', JSON.stringify(ranking), 'utf8');
  } catch (err) {
    console.error(err);
  }
}

function carregarRanking() {
  try {
    const rankingData = fs.readFileSync('ranking.json', 'utf8');
    return JSON.parse(rankingData);
  } catch (err) {
    return [];
  }
}

function jogoAdivinhacao() {
  inicializarJogadores();
  const ranking = carregarRanking();
  const numeroSecreto = gerarNumeroSecreto();
  console.log(numeroSecreto);
  let jogada = 1;

  while (true) {
    console.log(`Rodada ${jogada}`);
    exibirPlacar();

    let jogadorAtual;
    
    if (jogada % 2 === 1){
      jogadorAtual = jogador1
    }else {
      jogadorAtual = jogador2
    }

    const chute = parseInt(prompt(`[${jogadorAtual.nome}] Qual é o seu chute? `));
    console.log(`[${jogadorAtual.nome}] Seu chute foi ${chute}`);

    if (chute === numeroSecreto) {
      console.log('\n***********************************************************');
      console.log(`Parabéns ${jogadorAtual.nome}! Você acertou em ${jogadorAtual.tentativas + 1} tentativas.`);

      if (jogadorAtual.pontos > recorde) {
        console.log(`Você é o novo recordista com ${jogadorAtual.pontos} pontos.`);
        recorde = jogadorAtual.pontos;
      } else {
        console.log(`Sua pontuação foi ${jogadorAtual.pontos} pontos, ficando abaixo do recorde atual que é de ${recorde} pontos.`);
      }

      console.log('***********************************************************\n');

      ranking.push({ nome: jogadorAtual.nome, pontos: jogadorAtual.pontos });
      ordenarRanking(ranking);
      exibirRanking(ranking);
      salvarRanking(ranking);

      break;
    } else {
      if (chute < 0 || chute > 100) {
        console.log(`${jogadorAtual.nome}, você deve chutar um número entre 0 e 100.`);
        continue;
      }

      if (chute > numeroSecreto) {
        console.log(`${jogadorAtual.nome}, você errou! Seu chute foi maior que o número secreto.`);
      } else {
        console.log(`${jogadorAtual.nome}, você errou! Seu chute foi menor que o número secreto.`);
      }

      atualizarPlacar(jogadorAtual, 10);
      jogada++;
    }
  }
}

function jogarNovamente() {
  while (true) {
    jogoAdivinhacao();

    console.log('***********************************************************');
    console.log('***********************************************************');
    console.log('0 - Sair');
    console.log('1 - Jogar novamente');

    const opcao = parseInt(prompt('Escolha uma opção: '));
    if (opcao === 1) {
      jogador1.pontos = 100;
      jogador1.tentativas = 0;
      jogador2.pontos = 100;
      jogador2.tentativas = 0;
      continue;
    } else if (opcao === 0) {
      console.log('Você saiu do jogo');
      break;
    }
  }
}

jogarNovamente();