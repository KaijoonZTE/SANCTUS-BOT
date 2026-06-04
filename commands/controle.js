const botBloqueado = { ativo: false };
const soadmAtivo = {};
const menusDesativados = {};

function isBotBloqueado() { return botBloqueado.ativo; }
function setSoadm(from, val) { soadmAtivo[from] = val; }
function isSoadm(from) { return !!soadmAtivo[from]; }
function menuDesativado(from, menu) { return menusDesativados[from]?.includes(menu); }

async function handleControle(comando, ctx) {
  const { reply, from, args, isAdmin, BOT_NAME, sender, DONO } = ctx;
  const isDono = sender.includes(DONO);

  if (comando === 'bangp') {
    if (!isDono) return false;
    botBloqueado.ativo = true;
    await reply(`╔━᳀『 🔒 *BANGP* 』═᳀\n⌬ Bot bloqueado!\n⌬ Só o dono pode usar.\n╚━═━═━═━═━═᳀\n> © ${BOT_NAME}`);
    return true;
  }

  if (comando === 'bangpoff') {
    if (!isDono) return false;
    botBloqueado.ativo = false;
    await reply(`╔━᳀『 🔓 *BANGP OFF* 』═᳀\n⌬ Bot liberado!\n╚━═━═━═━═━═᳀\n> © ${BOT_NAME}`);
    return true;
  }

  if (comando === 'soadm') {
    if (!isDono && !isAdmin) { await reply('❌ Sem permissão!'); return true; }
    const acao = args[0];
    if (acao === 'on') {
      setSoadm(from, true);
      await reply(`╔━᳀『 👑 *SOADM* 』═᳀\n⌬ Apenas admins podem usar o bot!\n╚━═━═━═━═━═᳀\n> © ${BOT_NAME}`);
    } else {
      setSoadm(from, false);
      await reply(`╔━᳀『 👑 *SOADM* 』═᳀\n⌬ Todos podem usar o bot!\n╚━═━═━═━═━═᳀\n> © ${BOT_NAME}`);
    }
    return true;
  }

  if (comando === 'desativar') {
    if (!isDono && !isAdmin) { await reply('❌ Sem permissão!'); return true; }
    const menu = args[0];
    if (!menu) return reply('❌ /desativar [menu]') && true;
    if (!menusDesativados[from]) menusDesativados[from] = [];
    if (!menusDesativados[from].includes(menu)) menusDesativados[from].push(menu);
    await reply(`╔━᳀『 🔒 *DESATIVAR* 』═᳀\n⌬ Menu *${menu}* desativado!\n╚━═━═━═━═━═᳀\n> © ${BOT_NAME}`);
    return true;
  }

  if (comando === 'ativar') {
    if (!isDono && !isAdmin) { await reply('❌ Sem permissão!'); return true; }
    const menu = args[0];
    if (!menu) return reply('❌ /ativar [menu]') && true;
    if (menusDesativados[from]) menusDesativados[from] = menusDesativados[from].filter(m => m !== menu);
    await reply(`╔━᳀『 ✅ *ATIVAR* 』═᳀\n⌬ Menu *${menu}* ativado!\n╚━═━═━═━═━═᳀\n> © ${BOT_NAME}`);
    return true;
  }

  if (comando === 'menusstatus') {
    if (!isDono && !isAdmin) { await reply('❌ Sem permissão!'); return true; }
    const desativados = menusDesativados[from] || [];
    const todos = ['jogos','diversao','downloads','zoeira','ranks','ia','admin','interacao'];
    const lista = todos.map(m => `⌬ ${desativados.includes(m) ? '🔴' : '🟢'} ${m}`).join('\n');
    await reply(`╔━᳀『 📊 *STATUS DOS MENUS* 』═᳀\n${lista}\n╚━═━═━═━═━═᳀\n> © ${BOT_NAME}`);
    return true;
  }

  return false;
}

module.exports = { handleControle, isBotBloqueado, isSoadm, menuDesativado };
