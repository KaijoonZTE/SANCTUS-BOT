const antiApagadoAtivo = {};
const antiEditadoAtivo = {};
const msgCache = {};

function toggleAntiApagado(from, val) { antiApagadoAtivo[from] = val; }
function isAntiApagadoAtivo(from) { return !!antiApagadoAtivo[from]; }
function toggleAntiEditado(from, val) { antiEditadoAtivo[from] = val; }
function isAntiEditadoAtivo(from) { return !!antiEditadoAtivo[from]; }
function cacheMensagem(id, msg) { msgCache[id] = msg; }
function getMensagemCache(id) { return msgCache[id]; }

async function handleMensagemApagada(sock, update, BOT_NAME) {
  for (const key of update.keys) {
    const from = key.remoteJid;
    const isGroup = from?.endsWith('@g.us');
    if (!isGroup) return;
    if (!isAntiApagadoAtivo(from)) return;

    const cached = getMensagemCache(key.id);
    if (!cached) return;

    const sender = cached.key.participant || cached.key.remoteJid;
    const num = sender.split('@')[0];
    const texto = cached.message?.conversation || cached.message?.extendedTextMessage?.text;

    if (texto) {
      await sock.sendMessage(from, {
        text: `╔━᳀『 🗑️ *ANTI-APAGADO* 』═᳀\n⌬ @${num} apagou uma mensagem!\n⌬ *Conteúdo:* ${texto}\n╚━═━═━═━═━═᳀\n> © ${BOT_NAME}`,
        mentions: [sender]
      }).catch(() => {});
    }
  }
}

async function handleMensagemEditada(sock, msg, BOT_NAME) {
  const from = msg.key.remoteJid;
  const isGroup = from?.endsWith('@g.us');
  if (!isGroup) return;
  if (!isAntiEditadoAtivo(from)) return;

  const sender = msg.key.participant || msg.key.remoteJid;
  const num = sender.split('@')[0];
  const original = getMensagemCache(msg.key.id);
  const textoOriginal = original?.message?.conversation || original?.message?.extendedTextMessage?.text;
  const textoNovo = msg.message?.conversation || '?';

  if (textoOriginal) {
    await sock.sendMessage(from, {
      text: `╔━᳀『 ✏️ *ANTI-EDITADO* 』═᳀\n⌬ @${num} editou uma mensagem!\n⌬ *Original:* ${textoOriginal}\n⌬ *Novo:* ${textoNovo}\n╚━═━═━═━═━═᳀\n> © ${BOT_NAME}`,
      mentions: [sender]
    }).catch(() => {});
  }
}

async function handleSegurancaComando(comando, ctx) {
  const { reply, sock, from, args, body, isAdmin, BOT_NAME, sender, groupMembers, DONO } = ctx;
  const isDono = sender.includes(DONO);

  if (comando === 'menuseguranca') {
    await reply(`╔━᳀『 🔐 *MENU SEGURANÇA* 』═᳀
⌬ /antiapagado on/off
⌬ /antieditado on/off
⌬ /statusgp [mensagem]
╚━═━═━═━═━═━═━═━═᳀
> © ${BOT_NAME}`);
    return true;
  }

  if (comando === 'antiapagado') {
    if (!isAdmin && !isDono) { await reply('❌ Só admin ou dono!'); return true; }
    const acao = args[0];
    if (acao === 'on') {
      toggleAntiApagado(from, true);
      await reply(`╔━᳀『 🗑️ *ANTI-APAGADO* 』═᳀\n⌬ Ativado!\n╚━═━═━═━═━═᳀\n> © ${BOT_NAME}`);
    } else {
      toggleAntiApagado(from, false);
      await reply('✅ Anti-apagado desativado!');
    }
    return true;
  }

  if (comando === 'antieditado') {
    if (!isAdmin && !isDono) { await reply('❌ Só admin ou dono!'); return true; }
    const acao = args[0];
    if (acao === 'on') {
      toggleAntiEditado(from, true);
      await reply(`╔━᳀『 ✏️ *ANTI-EDITADO* 』═᳀\n⌬ Ativado!\n╚━═━═━═━═━═᳀\n> © ${BOT_NAME}`);
    } else {
      toggleAntiEditado(from, false);
      await reply('✅ Anti-editado desativado!');
    }
    return true;
  }

  if (comando === 'statusgp') {
    if (!isAdmin && !isDono) { await reply('❌ Só admin ou dono!'); return true; }
    if (!body) { await reply('❌ /statusgp [mensagem]'); return true; }
    await sock.sendMessage('status@broadcast', {
      text: body
    }, { statusJidList: groupMembers?.map(m => m.id) || [] });
    await reply('✅ Status postado!');
    return true;
  }

  return false;
}

module.exports = { handleSegurancaComando, handleMensagemApagada, handleMensagemEditada, cacheMensagem };
