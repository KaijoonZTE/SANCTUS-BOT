async function handleDono(comando, ctx) {
  const { reply, sender, BOT_NAME, DONO } = ctx;
  const isDono = sender.includes(DONO);

  if (comando === 'menudono') {
    if (!isDono) { await reply('❌ Esse menu é só pro dono!'); return true; }
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
╚━═━═━═━═━═━═━═━═᳀
> © ${BOT_NAME}`);
    return true;
  }

  return false;
}

module.exports = { handleDono };
