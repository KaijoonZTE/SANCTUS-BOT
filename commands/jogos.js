async function handleJogos(comando, ctx) {
  const { reply, sock, from, sender, args, groupMembers, BOT_NAME, msg } = ctx;

  if (comando === 'menujogos') {
    await reply(`╔━᳀『 🎮 *MENU JOGOS* 』═᳀
⌬ /caraoucoroa
⌬ /ppt [pedra/papel/tesoura]
⌬ /dado
⌬ /verdadeoudesafio
⌬ /roleta
⌬ /fortunecookie
⌬ /shippar @pessoa1 @pessoa2
╚━═━═━═━═━═━═━═━═᳀
> © ${BOT_NAME}`);
    return true;
  }

  if (comando === 'caraoucoroa') {
    const resultado = Math.random() < 0.5 ? '🪙 *CARA*' : '🪙 *COROA*';
    await reply(`╔━᳀『 🪙 *CARA OU COROA* 』═᳀\n⌬ Resultado: ${resultado}!\n╚━═━═━═━═━═᳀\n> © ${BOT_NAME}`);
    return true;
  }

  if (comando === 'ppt') {
    const opcoes = ['pedra','papel','tesoura'];
    const bot = opcoes[Math.floor(Math.random() * 3)];
    const user = args[0]?.toLowerCase();
    if (!opcoes.includes(user)) { await reply('❌ Use: /ppt pedra | papel | tesoura'); return true; }
    const emojis = { pedra: '🪨', papel: '📄', tesoura: '✂️' };
    let resultado;
    if (user === bot) resultado = '🤝 *Empate!*';
    else if ((user === 'pedra' && bot === 'tesoura') || (user === 'papel' && bot === 'pedra') || (user === 'tesoura' && bot === 'papel')) resultado = '🏆 *Você ganhou!*';
    else resultado = '💀 *Bot ganhou!*';
    await reply(`╔━᳀『 ✂️ *PEDRA PAPEL TESOURA* 』═᳀\n⌬ Você: ${emojis[user]} ${user}\n⌬ Bot: ${emojis[bot]} ${bot}\n⌬ ${resultado}\n╚━═━═━═━═━═᳀\n> © ${BOT_NAME}`);
    return true;
  }

  if (comando === 'dado') {
    const resultado = Math.floor(Math.random() * 6) + 1;
    const dados = ['⚀','⚁','⚂','⚃','⚄','⚅'];
    await reply(`╔━᳀『 🎲 *DADO* 』═᳀\n⌬ ${dados[resultado-1]} Você tirou *${resultado}*!\n╚━═━═━═━═━═᳀\n> © ${BOT_NAME}`);
    return true;
  }

  if (comando === 'verdadeoudesafio') {
    const verdades = ['Qual seu maior segredo?','Já mentiu pra alguém que ama?','Tem crush aqui no grupo?','Qual a coisa mais estranha que já fez?'];
    const desafios = ['Manda um áudio cantando!','Manda sua foto agora!','Faz 10 flexões!','Escreve um poema pra pessoa do lado!'];
    const tipo = Math.random() < 0.5 ? 'VERDADE' : 'DESAFIO';
    const lista = tipo === 'VERDADE' ? verdades : desafios;
    const escolha = lista[Math.floor(Math.random() * lista.length)];
    await reply(`╔━᳀『 🎭 *${tipo}* 』═᳀\n⌬ ${escolha}\n╚━═━═━═━═━═᳀\n> © ${BOT_NAME}`);
    return true;
  }

  if (comando === 'roleta') {
    if (!groupMembers || groupMembers.length === 0) { await reply('❌ Só em grupos!'); return true; }
    const membros = groupMembers.filter(m => m.id !== ctx.sock.user.id);
    const escolhido = membros[Math.floor(Math.random() * membros.length)];
    await sock.sendMessage(from, {
      text: `╔━᳀『 🎰 *ROLETA RUSSA* 』═᳀\n⌬ 🔫 A roleta parou em...\n⌬ @${escolhido.id.split('@')[0]}! 💀\n╚━═━═━═━═━═᳀\n> © ${BOT_NAME}`,
      mentions: [escolhido.id]
    });
    return true;
  }

  if (comando === 'fortunecookie') {
    const fortunas = [
      'Hoje é um bom dia pra tomar decisões! 🍀',
      'Alguém está pensando em você agora! 💭',
      'Uma surpresa boa está a caminho! 🎁',
      'Cuidado com quem sorri demais hoje! 😅',
      'Seu esforço será recompensado em breve! ⭐',
      'Evite conflitos hoje, a paz vale mais! ☮️',
      'Algo novo e incrível está prestes a acontecer! 🚀'
    ];
    const fortuna = fortunas[Math.floor(Math.random() * fortunas.length)];
    await reply(`╔━᳀『 🥠 *FORTUNE COOKIE* 』═᳀\n⌬ ${fortuna}\n╚━═━═━═━═━═᳀\n> © ${BOT_NAME}`);
    return true;
  }

  if (comando === 'shippar') {
    const mencoes = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid || [];
    if (mencoes.length < 2) { await reply('❌ Marque 2 pessoas: /shippar @pessoa1 @pessoa2'); return true; }
    const ship = Math.floor(Math.random() * 101);
    let emoji = ship >= 80 ? '💘' : ship >= 60 ? '💕' : ship >= 40 ? '💛' : ship >= 20 ? '🤝' : '💔';
    await sock.sendMessage(from, {
      text: `╔━᳀『 💘 *SHIPPAR* 』═᳀\n⌬ @${mencoes[0].split('@')[0]} + @${mencoes[1].split('@')[0]}\n⌬ Compatibilidade: *${ship}%* ${emoji}\n${'█'.repeat(Math.floor(ship/10))}${'░'.repeat(10-Math.floor(ship/10))}\n╚━═━═━═━═━═᳀\n> © ${BOT_NAME}`,
      mentions: mencoes
    });
    return true;
  }

  return false;
}

module.exports = { handleJogos };
