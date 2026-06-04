async function handleRanks(comando, ctx) {
  const { reply, BOT_NAME } = ctx;

  if (comando === 'menuranks') {
    await reply(`╔━᳀『 🏆 *MENU RANKS* 』═᳀
⌬ /rankativos
⌬ /rankinativos
⌬ /vercontas
╚━═━═━═━═━═━═━═━═᳀
> © ${BOT_NAME}`);
    return true;
  }

  return false;
}

module.exports = { handleRanks };
