async function handleExtras(comando, ctx) {
  const { reply, sock, from, sender, body, args, groupMembers, BOT_NAME } = ctx;

  if (comando === 'menuextras') {
    await reply(`╔━᳀『 ⚡ *MENU EXTRAS* 』═᳀
⌬ /calcular [expressão]
⌬ /gerarsenha [tamanho]
⌬ /inverter [texto]
⌬ /contar [texto]
⌬ /maiusculo [texto]
⌬ /minusculo [texto]
⌬ /emojirandom
⌬ /horario
⌬ /datahoje
⌬ /quemsoumes
╚━═━═━═━═━═━═━═━═᳀
> © ${BOT_NAME}`);
    return true;
  }

  if (comando === 'calcular') {
    if (!body) return reply('❌ /calcular [expressão] ex: 2+2') && true;
    try {
      const resultado = Function('"use strict"; return (' + body.replace(/[^0-9+\-*/.() ]/g, '') + ')')();
      await reply(`╔━᳀『 🧮 *CALCULADORA* 』═᳀\n⌬ ${body} = *${resultado}*\n╚━═━═━═━═━═᳀\n> © ${BOT_NAME}`);
    } catch {
      await reply('❌ Expressão inválida!');
    }
    return true;
  }

  if (comando === 'gerarsenha') {
    const tam = parseInt(args[0]) || 12;
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%&*';
    let senha = '';
    for (let i = 0; i < Math.min(tam, 32); i++) senha += chars[Math.floor(Math.random() * chars.length)];
    await reply(`╔━᳀『 🔑 *SENHA GERADA* 』═᳀\n⌬ \`${senha}\`\n⌬ Tamanho: ${senha.length} chars\n╚━═━═━═━═━═᳀\n> © ${BOT_NAME}`);
    return true;
  }

  if (comando === 'inverter') {
    if (!body) return reply('❌ /inverter [texto]') && true;
    await reply(`╔━᳀『 🔄 *INVERTER* 』═᳀\n⌬ ${body.split('').reverse().join('')}\n╚━═━═━═━═━═᳀\n> © ${BOT_NAME}`);
    return true;
  }

  if (comando === 'contar') {
    if (!body) return reply('❌ /contar [texto]') && true;
    const palavras = body.trim().split(/\s+/).length;
    await reply(`╔━᳀『 🔢 *CONTADOR* 』═᳀\n⌬ Letras: ${body.length}\n⌬ Palavras: ${palavras}\n╚━═━═━═━═━═᳀\n> © ${BOT_NAME}`);
    return true;
  }

  if (comando === 'maiusculo') {
    if (!body) return reply('❌ /maiusculo [texto]') && true;
    await reply(`╔━᳀『 🔠 *MAIÚSCULO* 』═᳀\n⌬ ${body.toUpperCase()}\n╚━═━═━═━═━═᳀\n> © ${BOT_NAME}`);
    return true;
  }

  if (comando === 'minusculo') {
    if (!body) return reply('❌ /minusculo [texto]') && true;
    await reply(`╔━᳀『 🔡 *MINÚSCULO* 』═᳀\n⌬ ${body.toLowerCase()}\n╚━═━═━═━═━═᳀\n> © ${BOT_NAME}`);
    return true;
  }

  if (comando === 'emojirandom') {
    const emojis = ['🔥','💀','👑','⚡','🎯','💎','🌙','⭐','🎲','🤖','👾','🎭','🦋','🌈','💫'];
    const escolhidos = Array.from({length: 5}, () => emojis[Math.floor(Math.random() * emojis.length)]);
    await reply(`╔━᳀『 🎲 *EMOJI RANDOM* 』═᳀\n⌬ ${escolhidos.join(' ')}\n╚━═━═━═━═━═᳀\n> © ${BOT_NAME}`);
    return true;
  }

  if (comando === 'horario') {
    const agora = new Date().toLocaleTimeString('pt-BR', { timeZone: 'Africa/Maputo' });
    await reply(`╔━᳀『 🕐 *HORÁRIO* 』═᳀\n⌬ ${agora} (Moçambique)\n╚━═━═━═━═━═᳀\n> © ${BOT_NAME}`);
    return true;
  }

  if (comando === 'datahoje') {
    const hoje = new Date().toLocaleDateString('pt-BR', { timeZone: 'Africa/Maputo', weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    await reply(`╔━᳀『 📅 *DATA* 』═᳀\n⌬ ${hoje}\n╚━═━═━═━═━═᳀\n> © ${BOT_NAME}`);
    return true;
  }

  if (comando === 'quemsoumes') {
    if (!groupMembers || groupMembers.length === 0) { await reply('❌ Só em grupos!'); return true; }
    const escolhido = groupMembers[Math.floor(Math.random() * groupMembers.length)];
    const personalidades = ['O Palhaço do grupo 🤡','O Quieto misterioso 👀','O Fofoqueiro 👄','O Mais corajoso 💪','O Filósofo 🧠','O Dorminhoco 😴','O Estressado ⚡','O Mais gente boa 😇'];
    const p = personalidades[Math.floor(Math.random() * personalidades.length)];
    await sock.sendMessage(from, {
      text: `╔━᳀『 🎭 *QUEM SOUMES* 』═᳀\n⌬ @${escolhido.id.split('@')[0]} é...\n⌬ *${p}*\n╚━═━═━═━═━═᳀\n> © ${BOT_NAME}`,
      mentions: [escolhido.id]
    });
    return true;
  }

  return false;
}

module.exports = { handleExtras };
