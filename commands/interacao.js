const interacaoCmds = ['chute','chutar','tapa','tapar','soco','socar','beijo','beijar','beijob','beijarb','abraco','abracar','mata','matar','cafune','morder','mordida','lamber','lambida'];

const interacaoDesativada = {};

function desativarInteracao(from, cmd) {
  if (!interacaoDesativada[from]) interacaoDesativada[from] = [];
  if (!interacaoDesativada[from].includes(cmd)) interacaoDesativada[from].push(cmd);
}

function ativarInteracao(from, cmd) {
  if (!interacaoDesativada[from]) return;
  interacaoDesativada[from] = interacaoDesativada[from].filter(c => c !== cmd);
}

async function handleInteracao(comando, ctx) {
  const { reply, sender, msg, BOT_NAME, sock, from, args, isAdmin, isGroup, DONO } = ctx;
  const isDono = sender.includes(DONO);

  if (comando === 'menuinteracao') {
    await reply(`╔━᳀『 *MENU INTERAÇÃO* 』═᳀
⌬ /chute @pessoa
⌬ /tapa @pessoa
⌬ /soco @pessoa
⌬ /beijo @pessoa
⌬ /abraco @pessoa
⌬ /mata @pessoa
⌬ /cafune @pessoa
⌬ /morder @pessoa
⌬ /lamber @pessoa
╚━═━═━═━═━═━═━═━═᳀

╔━᳀『 *CONTROLE* 』═᳀
⌬ /desativarinter [cmd]
⌬ /ativarinter [cmd]
⌬ /statusinter
╚━═━═━═━═━═━═━═━═᳀
> © ${BOT_NAME}`);
    return true;
  }

  if (comando === 'desativarinter') {
    if (!isAdmin && !isDono) { await reply('❌ Só admin ou dono!'); return true; }
    const cmd = args[0]?.toLowerCase();
    if (!cmd || !interacaoCmds.includes(cmd)) {
      await reply(`❌ Comando inválido!\nBrincadeiras: ${interacaoCmds.join(', ')}`);
      return true;
    }
    desativarInteracao(from, cmd);
    await reply(`╔━᳀『 🔒 *INTERAÇÃO* 』═᳀\n⌬ /${cmd} desativado!\n╚━═━═━═━═━═᳀\n> © ${BOT_NAME}`);
    return true;
  }

  if (comando === 'ativarinter') {
    if (!isAdmin && !isDono) { await reply('❌ Só admin ou dono!'); return true; }
    const cmd = args[0]?.toLowerCase();
    if (!cmd || !interacaoCmds.includes(cmd)) {
      await reply(`❌ Comando inválido!\nBrincadeiras: ${interacaoCmds.join(', ')}`);
      return true;
    }
    ativarInteracao(from, cmd);
    await reply(`╔━᳀『 ✅ *INTERAÇÃO* 』═᳀\n⌬ /${cmd} ativado!\n╚━═━═━═━═━═᳀\n> © ${BOT_NAME}`);
    return true;
  }

  if (comando === 'statusinter') {
    const desativadas = interacaoDesativada[from] || [];
    const lista = interacaoCmds.map(c => `⌬ ${desativadas.includes(c) ? '🔴' : '🟢'} /${c}`).join('\n');
    await reply(`╔━᳀『 📊 *STATUS INTERAÇÕES* 』═᳀\n${lista}\n╚━═━═━═━═━═᳀\n> © ${BOT_NAME}`);
    return true;
  }

  if (!interacaoCmds.includes(comando)) return false;

  if (isGroup && interacaoDesativada[from]?.includes(comando)) {
    await reply(`❌ A brincadeira /${comando} está desativada!`);
    return true;
  }

  const mencao = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
  const remetente = sender.split('@')[0];

  if (!mencao) {
    await reply(`❌ Marque alguém!\nEx: /${comando} @pessoa`);
    return true;
  }

  const alvo = mencao.split('@')[0];

  const acoes = {
    chute: `👟 @${remetente} chutou @${alvo} com força!`,
    chutar: `👟 @${remetente} chutou @${alvo} com força!`,
    tapa: `👋 @${remetente} deu um tapa em @${alvo}!`,
    tapar: `👋 @${remetente} deu um tapa em @${alvo}!`,
    soco: `👊 @${remetente} deu um soco em @${alvo}!`,
    socar: `👊 @${remetente} deu um soco em @${alvo}!`,
    beijo: `💋 @${remetente} beijou @${alvo}!`,
    beijar: `💋 @${remetente} beijou @${alvo}!`,
    beijob: `😘 @${remetente} deu um beijo na bochecha de @${alvo}!`,
    beijarb: `😘 @${remetente} deu um beijo na bochecha de @${alvo}!`,
    abraco: `🤗 @${remetente} abraçou @${alvo} com carinho!`,
    abracar: `🤗 @${remetente} abraçou @${alvo} com carinho!`,
    mata: `💀 @${remetente} eliminou @${alvo} do mapa!`,
    matar: `💀 @${remetente} eliminou @${alvo} do mapa!`,
    cafune: `🥰 @${remetente} fez cafuné em @${alvo}!`,
    morder: `😬 @${remetente} mordeu @${alvo}!`,
    mordida: `😬 @${remetente} mordeu @${alvo}!`,
    lamber: `👅 @${remetente} lambeu @${alvo}!`,
    lambida: `👅 @${remetente} lambeu @${alvo}!`,
  };

  await sock.sendMessage(from, {
    text: `╔━᳀『 *INTERAÇÃO* 』═᳀\n⌬ ${acoes[comando]}\n╚━═━═━═━═━═━═━═━═᳀\n> © ${BOT_NAME}`,
    mentions: [sender, mencao]
  });

  return true;
}

module.exports = { handleInteracao };
