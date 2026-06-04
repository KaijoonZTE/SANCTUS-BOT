const antilinkAtivo = {};
const avisos = {};

function toggleAntilink(from, val) { antilinkAtivo[from] = val; }
function isAntilinkAtivo(from) { return !!antilinkAtivo[from]; }

async function handleAntilink(msg, sock, from, sender, members, BOT_NAME) {
  if (!isAntilinkAtivo(from)) return false;

  const text = msg.message?.conversation || msg.message?.extendedTextMessage?.text || '';
  const temLink = /(https?:\/\/|chat\.whatsapp\.com\/|wa\.me\/)/i.test(text);
  if (!temLink) return false;

  const isAdmin = members.find(p => p.id === sender)?.admin != null;
  const isBotAdmin = members.find(p => p.id === sock.user.id)?.admin != null;
  if (isAdmin) return false;

  try {
    await sock.sendMessage(from, { delete: msg.key });
  } catch {}

  if (!avisos[from]) avisos[from] = {};
  if (!avisos[from][sender]) avisos[from][sender] = 0;
  avisos[from][sender]++;

  const num = sender.split('@')[0];
  const qtd = avisos[from][sender];

  if (qtd >= 3 && isBotAdmin) {
    await sock.groupParticipantsUpdate(from, [sender], 'remove').catch(() => {});
    await sock.sendMessage(from, {
      text: `╔━᳀『 🔨 *ANTILINK* 』═᳀\n⌬ @${num} foi banido por enviar links!\n╚━═━═━═━═━═᳀\n> © ${BOT_NAME}`,
      mentions: [sender]
    });
    avisos[from][sender] = 0;
  } else {
    await sock.sendMessage(from, {
      text: `╔━᳀『 ⚠️ *ANTILINK* 』═᳀\n⌬ @${num} não envie links!\n⌬ Aviso ${qtd}/3\n╚━═━═━═━═━═᳀\n> © ${BOT_NAME}`,
      mentions: [sender]
    });
  }

  return true;
}

module.exports = { handleAntilink, toggleAntilink, isAntilinkAtivo };
