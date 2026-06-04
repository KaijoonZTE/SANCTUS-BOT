const axios = require('axios');

async function handleDownloads(comando, ctx) {
  const { reply, sock, from, body, API, BOT_NAME, quoted } = ctx;

  const cmds = ['play','ytmp3','ytmp4','instagram','ig','tiktok','tt','twitter'];
  if (!cmds.includes(comando)) return false;

  if (!body) {
    await reply(`❌ Use: /${comando} [link ou nome]`);
    return true;
  }

  await reply('⏳ Processando...');

  try {
    let url = '';
    if (comando === 'play' || comando === 'ytmp3') {
      url = `${API}/api/downloads/ytmp3?url=${encodeURIComponent(body)}`;
    } else if (comando === 'ytmp4') {
      url = `${API}/api/downloads/ytmp4?url=${encodeURIComponent(body)}`;
    } else if (comando === 'instagram' || comando === 'ig') {
      url = `${API}/api/downloads/instagram?url=${encodeURIComponent(body)}`;
    } else if (comando === 'tiktok' || comando === 'tt') {
      url = `${API}/api/downloads/tiktok?url=${encodeURIComponent(body)}`;
    } else if (comando === 'twitter') {
      url = `${API}/api/downloads/twitter?url=${encodeURIComponent(body)}`;
    }

    const res = await axios.get(url);
    const data = res.data;

    if (data?.url) {
      if (comando === 'ytmp4') {
        await sock.sendMessage(from, { video: { url: data.url }, caption: data.title || '' }, { quoted });
      } else {
        await sock.sendMessage(from, { audio: { url: data.url }, mimetype: 'audio/mpeg', ptt: false }, { quoted });
      }
    } else {
      await reply('❌ Não consegui baixar. Tenta de novo!');
    }
  } catch {
    await reply('❌ Erro no download. Tenta de novo!');
  }

  return true;
}

module.exports = { handleDownloads };
