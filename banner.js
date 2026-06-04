const chalk = require('chalk');

async function showBanner() {
  console.clear();
  console.log(chalk.green(`
███████╗ █████╗ ███╗  ██╗ ██████╗████████╗██╗   ██╗███████╗
██╔════╝██╔══██╗████╗ ██║██╔════╝╚══██╔══╝██║   ██║██╔════╝
███████╗███████║██╔██╗██║██║        ██║   ██║   ██║███████╗
╚════██║██╔══██║██║╚████║██║        ██║   ██║   ██║╚════██║
███████║██║  ██║██║ ╚███║╚██████╗   ██║   ╚██████╔╝███████║
╚══════╝╚═╝  ╚═╝╚═╝  ╚══╝ ╚═════╝  ╚═╝    ╚═════╝ ╚══════╝
  `));
  console.log(chalk.cyan('        👑 S4NCTUS_BOT v1.5.0 by Neuromancer 👑\n'));
}

function showOnline(VERSION, PREFIX, CREATOR) {
  console.log(chalk.green('✅ Bot Online!'));
  console.log(chalk.cyan(`👑 Nome: S4NCTUS_BOT`));
  console.log(chalk.cyan(`⚡ Versão: ${VERSION}`));
  console.log(chalk.cyan(`🔧 Prefix: ${PREFIX}`));
  console.log(chalk.cyan(`🧠 Creator: ${CREATOR}\n`));
}

function logMensagem(from, sender, text) {
  if (!text) return;
  const num = sender.split('@')[0];
  const grupo = from.endsWith('@g.us') ? '👥' : '👤';
  console.log(chalk.gray(`${grupo} ${num}: ${text}`));
}

module.exports = { showBanner, showOnline, logMensagem };
