const { makeWASocket, useMultiFileAuthState, DisconnectReason, fetchLatestBaileysVersion } = require('@whiskeysockets/baileys');
const axios = require('axios');
const { showBanner, showOnline, logMensagem } = require('./banner');

const API = 'http://localhost:20026';
const PREFIX = '/';
const BOT_NAME = '👑 S4NCTUS_BOT 👑';
const CREATOR = '𝙽𝚎𝚞𝚛𝚘𝚖𝚊𝚗𝚌𝚎𝚛';
const VERSION = '1.5.0';
const DONO = '258855218418';

const { handleDownloads } = require('./commands/downloads');
const { handleZoeira } = require('./commands/zoeira');
const { handleAdmin } = require('./commands/admin');
const { handleControle, isBotBloqueado, isSoadm } = require('./commands/controle');
const { handleExtras } = require('./commands/extras');
const { handleJogos } = require('./commands/jogos');
const { handleDiversao } = require('./commands/diversao');
const { handleSegurancaComando, handleMensagemApagada, handleMensagemEditada, cacheMensagem } = require('./commands/seguranca');
const { handleAntilink } = require('./commands/antilink');
const { handleInteracao } = require('./commands/interacao');
const { handleRanks } = require('./commands/ranks');
const { handleDono } = require('./commands/dono');

const startTime = Date.now();

function getRuntime() {
  const diff = Date.now() - startTime;
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  return `${h}h ${m}m ${s}s`;
}

const legendaBV = {};
const legendaSaiu = {};
const fotoMenu = {};

const palavrasFlerte = ['te amo','amor','gostosa','gostoso','linda','lindo','saudade','paixao','paixão','namora','namorar','fica comigo','me beija','te quero','meu bem','meu amor','crush'];

async function startBot() {
  await showBanner();

  const { state, saveCreds } = await useMultiFileAuthState('./session');
  const { version } = await fetchLatestBaileysVersion();

  const sock = makeWASocket({
    version,
    auth: state,
    printQRInTerminal: false,
    logger: require('pino')({ level: 'silent' }),
  });

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', ({ connection, lastDisconnect }) => {
    if (connection === 'open') {
      showOnline(VERSION, PREFIX, CREATOR);
    } else if (connection === 'close') {
      const code = lastDisconnect?.error?.output?.statusCode;
      if (code !== DisconnectReason.loggedOut) {
        console.log('🔄 Reconectando...');
        startBot();
      }
    }
  });

  sock.ev.on('group-participants.update', async ({ id, participants, action, author }) => {
    const meta = await sock.groupMetadata(id).catch(() => null);
    if (!meta) return;
    const nome = meta.subject;

    if (action === 'add') {
      for (const p of participants) {
        const num = (typeof p === 'string' ? p : p.id).split('@')[0];
        const jid = typeof p === 'string' ? p : p.id;
        const texto = legendaBV[id]
          ? legendaBV[id].replace('{num}', `@${num}`).replace('{grupo}', nome)
          : `╔━᳀『 *BEM VINDO* 』═᳀\n⌬ Seja bem vindo(a) @${num}! 🎉\n⌬ *Grupo :* ${nome}\n⌬ Use /menu pra ver os comandos!\n╚━═━═━═━═━═━═━═━═᳀\n> © ${BOT_NAME}`;
        await sock.sendMessage(id, { text: texto, mentions: [jid] });
      }
    }

    if (action === 'remove') {
      for (const p of participants) {
        const num = (typeof p === 'string' ? p : p.id).split('@')[0];
        const jid = typeof p === 'string' ? p : p.id;
        const texto = legendaSaiu[id]
          ? legendaSaiu[id].replace('{num}', `@${num}`).replace('{grupo}', nome)
          : `╔━᳀『 *SAÍDA* 』═᳀\n⌬ @${num} saiu do grupo! 👋\n⌬ *Grupo :* ${nome}\n╚━═━═━═━═━═━═━═━═᳀\n> © ${BOT_NAME}`;
        await sock.sendMessage(id, { text: texto, mentions: [jid] });

        if (author) {
          const adminNum = author.split('@')[0];
          await sock.sendMessage(id, {
            text: `╔━᳀『 🔨 *ANTI-BAN* 』═᳀\n⌬ @${num} foi removido!\n⌬ *Por:* @${adminNum}\n╚━═━═━═━═━═━═━═━═᳀\n> © ${BOT_NAME}`,
            mentions: [jid, author]
          });
        }
      }
    }
  });

  sock.ev.on('messages.delete', async (update) => {
    await handleMensagemApagada(sock, update, BOT_NAME);
  });

  sock.ev.on('messages.upsert', async ({ messages, type }) => {
    if (type !== 'notify') return;
    const msg = messages[0];
    if (!msg.message) return;

    const from = msg.key.remoteJid;
    const isGroup = from.endsWith('@g.us');
    const sender = msg.key.participant || msg.key.remoteJid;
    const text = msg.message.conversation || msg.message.extendedTextMessage?.text || '';
    const quoted = msg;

    cacheMensagem(msg.key.id, msg);

    if (msg.message?.editedMessage || msg.message?.protocolMessage?.type === 14) {
      await handleMensagemEditada(sock, msg, BOT_NAME);
      return;
    }

    if (msg.key.fromMe) return;

    if (isGroup) {
      const meta2 = await sock.groupMetadata(from).catch(() => null);
      const members2 = meta2?.participants || [];
      const bloqueou = await handleAntilink(msg, sock, from, sender, members2, BOT_NAME);
      if (bloqueou) return;
    }

    logMensagem(from, sender, text);

    const botJid = sock.user.id;
    const mencionouBot = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.includes(botJid);

    if (isGroup && text && !text.startsWith(PREFIX)) {
      const emojisReacao = ['🔥','👀','😂','💀','👑','⚡','😎','🤝','💯','😅'];
      const emoji = emojisReacao[Math.floor(Math.random() * emojisReacao.length)];
      await sock.sendMessage(from, { react: { text: emoji, key: msg.key } }).catch(() => {});
    }

    const textLower = text.toLowerCase();
    const temFlerte = palavrasFlerte.some(p => textLower.includes(p));
    if (temFlerte && isGroup) {
      const num = sender.split('@')[0];
      const frasesRomanticas = [
        `Ai @${num}... você faz meu processador acelerar! 💘`,
        `@${num} para com isso que eu sou um bot, não aguento! 🥰`,
        `Meu coração digital disparou por sua causa @${num} 💓`,
        `@${num} se eu tivesse corpo, seria todo seu! 😍`,
        `Que fofura @${num}, mas cuidado que me apaixono! 💞`
      ];
      const frase = frasesRomanticas[Math.floor(Math.random() * frasesRomanticas.length)];
      await sock.sendMessage(from, { text: frase, mentions: [sender] });
      try {
        const ttsRes = await axios.get(`${API}/api/tts?text=${encodeURIComponent(frase)}&lang=pt`, { responseType: 'arraybuffer' });
        if (ttsRes.data) {
          await sock.sendMessage(from, { audio: Buffer.from(ttsRes.data), mimetype: 'audio/mpeg', ptt: true }, { quoted: msg });
        }
      } catch {}
      return;
    }

    if (mencionouBot && text && !text.startsWith(PREFIX)) {
      try {
        const res = await axios.get(`${API}/api/ias/gpt?q=${encodeURIComponent(text)}`);
        const resposta = res.data?.response || res.data?.result || 'Não entendi, fala de novo!';
        await sock.sendMessage(from, { text: resposta }, { quoted: msg });
      } catch {
        await sock.sendMessage(from, { text: '❌ Erro ao processar!' }, { quoted: msg });
      }
      return;
    }

    if (!text.startsWith(PREFIX)) return;

    const isDono = sender.includes(DONO);
    if (isBotBloqueado() && !isDono) return;

    const [cmd, ...args] = text.slice(1).trim().split(' ');
    const comando = cmd.toLowerCase();
    const body = args.join(' ');

    const reply = (txt) => sock.sendMessage(from, { text: txt }, { quoted });
    const sendMsg = (txt) => sock.sendMessage(from, { text: txt });

    let groupMetadata = null;
    let groupMembers = [];
    let isAdmin = false;
    let isBotAdmin = false;

    if (isGroup) {
      try {
        groupMetadata = await sock.groupMetadata(from);
        groupMembers = groupMetadata.participants;
        isAdmin = groupMembers.find(p => p.id === sender)?.admin != null;
        isBotAdmin = groupMembers.find(p => p.id === sock.user.id)?.admin != null;
      } catch {}
    }

    if (isGroup && isSoadm(from) && !isAdmin && !isDono) return;

    const ctx = { sock, msg, from, sender, isGroup, args, body, reply, sendMsg, quoted, groupMetadata, groupMembers, isAdmin, isBotAdmin, API, BOT_NAME, CREATOR, VERSION, getRuntime, DONO };

    if (comando === 'fotomenu') {
      if (!isDono && !isAdmin) { await reply('❌ Só admin ou dono!'); return; }
      const imgMsg = msg.message?.imageMessage || msg.message?.extendedTextMessage?.contextInfo?.quotedMessage?.imageMessage;
      if (!imgMsg) { await reply('❌ Envia uma foto com /fotomenu ou responde uma imagem!'); return; }
      const buffer = await sock.downloadMediaMessage(msg);
      fotoMenu[from] = buffer;
      await reply('✅ Foto do menu definida!');
      return;
    }

    if (['menu', 'start', 'ajuda'].includes(comando)) {
      const textoMenu = `╔━᳀『 Fᴏɴᴛᴇs ᴅᴏ Bᴏᴛ 』═᳀
⌬ *Creator :* ${CREATOR}
⌬ *BotNome :* ${BOT_NAME}
⌬ *Version :* ${VERSION}
⌬ *Runtime :* ${getRuntime()}
╚═━═━═━═━═━═━═━═━═᳀
© ${BOT_NAME}

╔━᳀『 *CATEGORIAS* 』═᳀
⌬ /menudownloads
⌬ /menuzoeira
⌬ /menuranks
⌬ /menuinteracao
⌬ /menuadmin
⌬ /menudono
⌬ /menuia
╚═━═━═━═━═━═━═━═━═᳀
> © ${BOT_NAME}`;

      if (fotoMenu[from]) {
        await sock.sendMessage(from, { image: fotoMenu[from], caption: textoMenu }, { quoted });
      } else {
        await reply(textoMenu);
      }
      return;
    }

    if (comando === 'ping') {
      const start = Date.now();
      await reply(`╔━᳀『 *PING* 』═᳀\n⌬ *Status :* Online ✅\n⌬ *Ping :* ${Date.now() - start}ms\n⌬ *Runtime :* ${getRuntime()}\n╚═━═━═━═━═━═━═━═━═᳀\n> © ${BOT_NAME}`);
      return;
    }

    if (comando === 'menudownloads') {
      await reply(`╔━᳀『 *MENU DOWNLOADS* 』═᳀\n⌬ /play\n⌬ /ytmp3\n⌬ /ytmp4\n⌬ /instagram\n⌬ /ig\n⌬ /tiktok\n⌬ /tt\n⌬ /twitter\n╚═━═━═━═━═━═━═━═━═━═᳀\n> © ${BOT_NAME}`);
      return;
    }

    if (comando === 'menuia') {
      await reply(`╔━᳀『 *MENU IA* 』═᳀\n⌬ /ia [pergunta]\n⌬ /gpt [pergunta]\n⌬ Mencione o bot pra ele responder\n╚═━═━═━═━═━═━═━═━═━═᳀\n> © ${BOT_NAME}`);
      return;
    }

    if (comando === 'menuadmin') {
      if (!isAdmin && !isDono) return reply('❌ Esse menu é só pra admins!');
      await reply(`╔━᳀『 *MENU ADMIN* 』═᳀
⌬ /ban @pessoa
⌬ /promover @pessoa
⌬ /rebaixar @pessoa
⌬ /mute — /unmute
⌬ /del
⌬ /totag — /taginvisivel
⌬ /sorteio
⌬ /linkgp
⌬ /grupo a/f
⌬ /antilink on/off
⌬ /nuke
⌬ /vercontas
⌬ /rankativos — /rankinativos
⌬ /infogp
⌬ /fotomenu
⌬ /antiapagado on/off
⌬ /antieditado on/off
⌬ /menuseguranca
╚═━═━═━═━═━═━═━═━═━═᳀
> © ${BOT_NAME}`);
      return;
    }

    if (comando === 'menudono') {
      if (!isDono) return reply('❌ Esse menu é só pro dono!');
      await reply(`╔━᳀『 *MENU DONO* 』═᳀
⌬ /bangp — /bangpoff
⌬ /soadm on/off
⌬ /desativar [menu]
⌬ /ativar [menu]
⌬ /fotomenu
⌬ /statusgp [msg]
⌬ /antiapagado on/off
⌬ /antieditado on/off
⌬ /menuseguranca
╚═━═━═━═━═━═━═━═━═━═᳀
> © ${BOT_NAME}`);
      return;
    }

    if (comando === 'legendabv') {
      if (!body) return reply('❌ /legendabv [texto] — use {num} e {grupo}') && true;
      legendaBV[from] = body;
      await reply(`✅ Legenda de boas vindas definida!\n\n${body}`);
      return;
    }

    if (comando === 'legendasaiu') {
      if (!body) return reply('❌ /legendasaiu [texto] — use {num} e {grupo}') && true;
      legendaSaiu[from] = body;
      await reply(`✅ Legenda de saída definida!\n\n${body}`);
      return;
    }

    if (await handleDownloads(comando, ctx)) return;
    if (await handleZoeira(comando, ctx)) return;
    if (await handleRanks(comando, ctx)) return;
    if (await handleInteracao(comando, ctx)) return;
    if (await handleJogos(comando, ctx)) return;
    if (await handleDiversao(comando, ctx)) return;
    if (await handleSegurancaComando(comando, ctx)) return;
    if (await handleAdmin(comando, ctx)) return;
    if (await handleControle(comando, ctx)) return;
    if (await handleExtras(comando, ctx)) return;
    if (await handleDono(comando, ctx)) return;

    if (['ia', 'gpt'].includes(comando)) {
      if (!body) return reply('❌ Faz uma pergunta: /ia [pergunta]');
      await reply('🤖 Pensando...');
      try {
        const res = await axios.get(`${API}/api/ias/gpt?q=${encodeURIComponent(body)}`);
        await reply(`╔━᳀『 *S4NCTUS IA* 』═᳀\n\n${res.data?.response || res.data?.result || JSON.stringify(res.data)}\n╚═━═━═━═━═━═━═━═━═᳀\n> © ${BOT_NAME}`);
      } catch {
        await reply('❌ Erro na IA. Tenta de novo!');
      }
      return;
    }
  });
}

startBot();
