async function handleDiversao(comando, ctx) {
  const { reply, sock, from, sender, body, groupMembers, BOT_NAME, msg } = ctx;

  if (comando === 'menudiversao') {
    await reply(`╔━᳀『 😂 *MENU DIVERSÃO* 』═᳀
⌬ /piada
⌬ /curiosidade
⌬ /conselho
⌬ /motivacao
⌬ /horoscopo [signo]
⌬ /complimento @pessoa
⌬ /insulto @pessoa
╚━═━═━═━═━═━═━═━═᳀
> © ${BOT_NAME}`);
    return true;
  }

  if (comando === 'piada') {
    const piadas = [
      'Por que o espantalho ganhou um prêmio? Porque era outstanding em seu field! 🌾',
      'O que o zero disse pro oito? Bonito cinto! 😂',
      'Por que o livro de matemática estava triste? Tinha muitos problemas! 📚',
      'O que o pato disse pro outro pato? Quack! 🦆',
      'Por que o programador usa óculos? Por causa dos Java! 💻'
    ];
    await reply(`╔━᳀『 😂 *PIADA* 』═᳀\n⌬ ${piadas[Math.floor(Math.random() * piadas.length)]}\n╚━═━═━═━═━═᳀\n> © ${BOT_NAME}`);
    return true;
  }

  if (comando === 'curiosidade') {
    const curiosidades = [
      'Os polvos têm 3 corações! 🐙',
      'Uma colmeia de abelhas pode ter até 80.000 abelhas! 🐝',
      'O mel nunca estraga — mel de 3000 anos foi encontrado em tumbas egípcias! 🍯',
      'Os golfinhos dormem com um olho aberto! 🐬',
      'A língua azul do urso-panda é na verdade roxa! 🐼'
    ];
    await reply(`╔━᳀『 🧠 *CURIOSIDADE* 』═᳀\n⌬ ${curiosidades[Math.floor(Math.random() * curiosidades.length)]}\n╚━═━═━═━═━═᳀\n> © ${BOT_NAME}`);
    return true;
  }

  if (comando === 'conselho') {
    const conselhos = [
      'Beba água! Seu corpo precisa disso! 💧',
      'Durma bem, o descanso é produtividade! 😴',
      'Fale menos, ouça mais! 👂',
      'Invista em você antes de investir em outros! 💡',
      'Um passo de cada vez, Roma não foi construída em um dia! 🏛️'
    ];
    await reply(`╔━᳀『 💡 *CONSELHO* 』═᳀\n⌬ ${conselhos[Math.floor(Math.random() * conselhos.length)]}\n╚━═━═━═━═━═᳀\n> © ${BOT_NAME}`);
    return true;
  }

  if (comando === 'motivacao') {
    const motivacoes = [
      'Você é capaz de muito mais do que imagina! 🚀',
      'Cada dia é uma nova chance de ser melhor! ⭐',
      'Os obstáculos são degraus disfarçados! 💪',
      'Acredite no processo, os resultados vêm! 🎯',
      'Sua história ainda não terminou! ✍️'
    ];
    await reply(`╔━᳀『 🔥 *MOTIVAÇÃO* 』═᳀\n⌬ ${motivacoes[Math.floor(Math.random() * motivacoes.length)]}\n╚━═━═━═━═━═᳀\n> © ${BOT_NAME}`);
    return true;
  }

  if (comando === 'horoscopo') {
    const signos = ['aries','touro','gemeos','cancer','leao','virgem','libra','escorpiao','sagitario','capricornio','aquario','peixes'];
    const signo = body?.toLowerCase();
    if (!signo || !signos.includes(signo)) {
      await reply(`❌ Informe um signo!\nSignos: ${signos.join(', ')}`);
      return true;
    }
    const previsoes = [
      'Dia favorável para novos começos! ⭐',
      'Cuidado com decisões impulsivas hoje! ⚠️',
      'O amor está no ar para você! 💘',
      'Foco no trabalho trará bons resultados! 💼',
      'Uma surpresa financeira está a caminho! 💰'
    ];
    const prev = previsoes[Math.floor(Math.random() * previsoes.length)];
    await reply(`╔━᳀『 🔮 *HORÓSCOPO* 』═᳀\n⌬ *${signo.toUpperCase()}*\n⌬ ${prev}\n╚━═━═━═━═━═᳀\n> © ${BOT_NAME}`);
    return true;
  }

  if (comando === 'complimento') {
    const mencao = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || sender;
    const complimentos = [
      'é incrível e ilumina o ambiente! ✨',
      'tem um sorriso que alegra o dia! 😊',
      'é uma pessoa de coração enorme! 💖',
      'é inteligente e perspicaz! 🧠',
      'inspira todos ao redor! 🌟'
    ];
    const c = complimentos[Math.floor(Math.random() * complimentos.length)];
    await sock.sendMessage(from, {
      text: `╔━᳀『 💖 *COMPLIMENTO* 』═᳀\n⌬ @${mencao.split('@')[0]} ${c}\n╚━═━═━═━═━═᳀\n> © ${BOT_NAME}`,
      mentions: [mencao]
    });
    return true;
  }

  if (comando === 'insulto') {
    const mencao = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || sender;
    const insultos = [
      'esqueceu de usar o cérebro hoje! 🧠',
      'é lento que nem internet discada! 🐌',
      'confunde alho com bugalho! 😅',
      'foi o último da fila quando deram juízo! 😂',
      'faz papel de bobo com maestria! 🤡'
    ];
    const i = insultos[Math.floor(Math.random() * insultos.length)];
    await sock.sendMessage(from, {
      text: `╔━᳀『 😈 *INSULTO* 』═᳀\n⌬ @${mencao.split('@')[0]} ${i}\n╚━═━═━═━═━═᳀\n> © ${BOT_NAME}`,
      mentions: [mencao]
    });
    return true;
  }

  return false;
}

module.exports = { handleDiversao };
