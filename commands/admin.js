const { toggleAntilink } = require('./antilink');
const msgContagem = {};
const msgUltimaAtividade = {};
const muteGrupos = {};

async function handleAdmin(comando, ctx) {
  const { reply, sock, from, args, isGroup, isAdmin, isBotAdmin, groupMembers, groupMetadata, BOT_NAME, msg, sender, DONO } = ctx;
  const isDono = sender.includes(DONO);

  if (isGroup) {
    if (!msgContagem[from]) msgContagem[from] = {};
    if (!msgContagem[from][sender]) msgContagem[from][sender] = 0;
    msgContagem[from][sender]++;
    if (!msgUltimaAtividade[from]) msgUltimaAtividade[from] = {};
    msgUltimaAtividade[from][sender] = Date.now();
  }

  const mencao = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];

  const adminCmds = ['ban','kick','promover','rebaixar','mute','unmute','del','marcar','totag','taginvisivel','sorteio','linkgp','antilink','grupo','nuke','vercontas','rankativos','rankinativos','infogp'];
  if (!adminCmds.includes(comando)) return false;

  if (!isGroup) { await reply('❌ Só funciona em grupos!'); return true; }
  if (!isAdmin && !isDono) { await reply('❌ Você precisa ser admin!'); return true; }

  if (comando === 'ban' || comando === 'kick') {
    if (!mencao) return reply(`❌ Marque alguém: /${comando} @pessoa`) && true;
    if (!isBotAdmin) return reply('❌ Preciso ser admin pra remover!') && true;
    await sock.groupParticipantsUpdate(from, [mencao], 'remove');
    await reply(`╔━᳀『 *BAN* 』═᳀\n⌬ @${mencao.split('@')[0]} foi removido! 🔨\n╚━═━═━═━═━═᳀\n> © ${BOT_NAME}`);
    return true;
  }

  if (comando === 'promover') {
    if (!mencao) return reply('❌ /promover @pessoa') && true;
    if (!isBotAdmin) return reply('❌ Preciso ser admin!') && true;
    await sock.groupParticipantsUpdate(from, [mencao], 'promote');
    await reply(`╔━᳀『 *PROMOÇÃO* 』═᳀\n⌬ @${mencao.split('@')[0]} virou admin! 👑\n╚━═━═━═━═━═᳀\n> © ${BOT_NAME}`);
    return true;
  }

  if (comando === 'rebaixar') {
    if (!mencao) return reply('❌ /rebaixar @pessoa') && true;
    if (!isBotAdmin) return reply('❌ Preciso ser admin!') && true;
    await sock.groupParticipantsUpdate(from, [mencao], 'demote');
    await reply(`╔━᳀『 *REBAIXAMENTO* 』═᳀\n⌬ @${mencao.split('@')[0]} perdeu o admin! 📉\n╚━═━═━═━═━═᳀\n> © ${BOT_NAME}`);
    return true;
  }

  if (comando === 'mute') {
    if (!isBotAdmin) return reply('❌ Preciso ser admin!') && true;
    muteGrupos[from] = true;
    await sock.groupSettingUpdate(from, 'announcement');
    await reply(`╔━᳀『 *MUTE* 』═᳀\n⌬ Grupo mutado! 🔇\n╚━═━═━═━═━═᳀\n> © ${BOT_NAME}`);
    return true;
  }

  if (comando === 'unmute') {
    if (!isBotAdmin) return reply('❌ Preciso ser admin!') && true;
    muteGrupos[from] = false;
    await sock.groupSettingUpdate(from, 'not_announcement');
    await reply(`╔━᳀『 *UNMUTE* 』═᳀\n⌬ Grupo desmutado! 🔊\n╚━═━═━═━═━═᳀\n> © ${BOT_NAME}`);
    return true;
  }

  if (comando === 'del') {
    const quotedId = msg.message?.extendedTextMessage?.contextInfo?.stanzaId;
    const quotedParticipant = msg.message?.extendedTextMessage?.contextInfo?.participant;
    if (!quotedId) return reply('❌ Responda a mensagem que quer deletar!') && true;
    if (!isBotAdmin) return reply('❌ Preciso ser admin!') && true;
    await sock.sendMessage(from, {
      delete: { remoteJid: from, fromMe: false, id: quotedId, participant: quotedParticipant }
    });
    return true;
  }

  if (comando === 'marcar' || comando === 'totag') {
    const todos = groupMembers.map(m => m.id);
    const nomes = todos.map(m => `@${m.split('@')[0]}`).join('\n');
    await sock.sendMessage(from, {
      text: `╔━᳀『 *MARCANDO TODOS* 』═᳀\n${nomes}\n╚━═━═━═━═━═᳀\n> © ${BOT_NAME}`,
      mentions: todos
    });
    return true;
  }

  if (comando === 'taginvisivel') {
    const todos = groupMembers.map(m => m.id);
    const textoBase = ctx.body || '‌';
    const textoInvisivel = todos.map(() => '@\u200b').join('');
    await sock.sendMessage(from, {
      text: `${textoBase}\n${textoInvisivel}`,
      mentions: todos
    });
    return true;
  }

  if (comando === 'sorteio') {
    const membros = groupMembers.filter(m => m.id !== sock.user.id);
    const sorteado = membros[Math.floor(Math.random() * membros.length)];
    await sock.sendMessage(from, {
      text: `╔━᳀『 *SORTEIO* 』═᳀\n⌬ 🎉 @${sorteado.id.split('@')[0]}\n╚━═━═━═━═━═᳀\n> © ${BOT_NAME}`,
      mentions: [sorteado.id]
    });
    return true;
  }

  if (comando === 'linkgp') {
    if (!isBotAdmin) return reply('❌ Preciso ser admin!') && true;
    const link = await sock.groupInviteCode(from);
    await reply(`╔━᳀『 *LINK DO GRUPO* 』═᳀\n⌬ https://chat.whatsapp.com/${link}\n╚━═━═━═━═━═᳀\n> © ${BOT_NAME}`);
    return true;
  }

  if (comando === 'grupo') {
    if (!isBotAdmin) return reply('❌ Preciso ser admin!') && true;
    const acao = args[0];
    if (acao === 'a' || acao === 'abrir') {
      await sock.groupSettingUpdate(from, 'not_announcement');
      await reply('✅ Grupo aberto!');
    } else if (acao === 'f' || acao === 'fechar') {
      await sock.groupSettingUpdate(from, 'announcement');
      await reply('🔒 Grupo fechado!');
    } else {
      await reply('❌ Use: /grupo a (abrir) ou /grupo f (fechar)');
    }
    return true;
  }

  if (comando === 'antilink') {
    const acao = args[0];
    if (acao === 'on') {
      toggleAntilink(from, true);
      await reply(`╔━᳀〖 ⚠️ *ANTILINK* 〗═᳀\n⌬ Antilink *ATIVADO*! 🔒\n⌬ Links deletados\n⌬ 3 avisos = ban\n╚━═━═━═━═━═᳀\n> © ${BOT_NAME}`);
    } else {
      toggleAntilink(from, false);
      await reply('✅ Antilink desativado!');
    }
    return true;
  }

  if (comando === 'nuke') {
    if (!isBotAdmin) return reply('❌ Preciso ser admin!') && true;
    await reply('💣 Verificando inativos dos últimos 7 dias...');
    const umaSemana = 7 * 24 * 60 * 60 * 1000;
    const agora = Date.now();
    const atividade = msgUltimaAtividade[from] || {};
    const inativos = groupMembers.filter(m => {
      if (m.admin) return false;
      if (m.id === sock.user.id) return false;
      const ultima = atividade[m.id];
      if (!ultima) return true;
      return (agora - ultima) > umaSemana;
    });
    if (inativos.length === 0) { await reply('✅ Nenhum inativo!'); return true; }
    const lista = inativos.map(m => `@${m.id.split('@')[0]}`).join('\n');
    await sock.sendMessage(from, {
      text: `╔━᳀『 *NUKE* 』═᳀\n⌬ Removendo ${inativos.length} inativos:\n\n${lista}\n╚━═━═━═━═━═᳀\n> © ${BOT_NAME}`,
      mentions: inativos.map(m => m.id)
    });
    let removidos = 0;
    for (const m of inativos) {
      await sock.groupParticipantsUpdate(from, [m.id], 'remove').catch(() => {});
      removidos++;
      await new Promise(r => setTimeout(r, 800));
    }
    await reply(`╔━᳀『 *NUKE CONCLUÍDO* 』═᳀\n⌬ ${removidos} removidos! 💣\n╚━═━═━═━═━═᳀\n> © ${BOT_NAME}`);
    return true;
  }

  if (comando === 'vercontas') {
    const lista = groupMembers.map((m, i) => `⌬ ${i+1}. +${m.id.split('@')[0]}${m.admin ? ' 👑' : ''}`).join('\n');
    await reply(`╔━᳀『 *CONTAS NO GRUPO* 』═᳀\n${lista}\n⌬ Total: ${groupMembers.length}\n╚━═━═━═━═━═᳀\n> © ${BOT_NAME}`);
    return true;
  }

  if (comando === 'rankativos') {
    const contagem = msgContagem[from] || {};
    const sorted = Object.entries(contagem).sort((a,b) => b[1]-a[1]).slice(0,5);
    if (sorted.length === 0) { await reply('❌ Nenhum dado ainda!'); return true; }
    const medalhas = ['🥇','🥈','🥉','4️⃣','5️⃣'];
    let texto = `╔━᳀『 *RANK ATIVOS* 』═᳀\n`;
    sorted.forEach(([id, qtd], i) => { texto += `⌬ ${medalhas[i]} @${id.split('@')[0]} - ${qtd} msgs\n`; });
    texto += `╚━═━═━═━═━═᳀\n> © ${BOT_NAME}`;
    await sock.sendMessage(from, { text: texto, mentions: sorted.map(([id]) => id) });
    return true;
  }

  if (comando === 'rankinativos') {
    const agora = Date.now();
    const atividade = msgUltimaAtividade[from] || {};
    const todos = groupMembers.filter(m => !m.admin && m.id !== sock.user.id);
    const comDias = todos.map(m => {
      const ultima = atividade[m.id];
      const dias = ultima ? Math.floor((agora - ultima) / 86400000) : 99;
      return { id: m.id, dias };
    }).sort((a,b) => b.dias - a.dias).slice(0,5);
    const medalhas = ['🥇','🥈','🥉','4️⃣','5️⃣'];
    let texto = `╔━᳀『 *RANK INATIVOS* 』═᳀\n`;
    comDias.forEach(({ id, dias }, i) => {
      texto += `⌬ ${medalhas[i]} @${id.split('@')[0]} - ${dias >= 99 ? 'nunca enviou' : `${dias} dias`}\n`;
    });
    texto += `╚━═━═━═━═━═᳀\n> © ${BOT_NAME}`;
    await sock.sendMessage(from, { text: texto, mentions: comDias.map(m => m.id) });
    return true;
  }

  if (comando === 'infogp') {
    if (!groupMetadata) { await reply('❌ Erro ao buscar info!'); return true; }
    const admins = groupMembers.filter(m => m.admin).map(m => `+${m.id.split('@')[0]}`).join(', ');
    await reply(`╔━᳀『 *INFO DO GRUPO* 』═᳀
⌬ *Nome:* ${groupMetadata.subject}
⌬ *Membros:* ${groupMembers.length}
⌬ *Admins:* ${admins}
⌬ *Criado:* ${new Date(groupMetadata.creation * 1000).toLocaleDateString('pt-BR')}
⌬ *Desc:* ${groupMetadata.desc || 'Sem descrição'}
╚━═━═━═━═━═᳀
> © ${BOT_NAME}`);
    return true;
  }

  return false;
}

module.exports = { handleAdmin, msgContagem, msgUltimaAtividade };
