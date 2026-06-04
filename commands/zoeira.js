const zoeiraMasc = ['gay','feio','lindo','burro','bebado','genio','gay2','burro2','inteligente','otaku','fiel','infiel','corno','gado','gostoso','feio2','rico','pobre','nazista','ladrao','safado','vesgo','bebado2','machista','homofobico','racista','chato','sortudo','azarado','forte','fraco','pegador','otario','macho','bobo','nerd2','preguicoso','trabalhador','brabo','lindo2','malandro','simpatico','engracado','charmoso','misterioso','carinhoso','ciumento','corajoso','covarde','esperto','talarico','chorao','brincalhao','bolsonarista','petista','comunista','traidor','bandido','cachorro','vagabundo','pilantra','mito','padrao','psicopata','fortao','magrelo','bombado','chefe','presidente','rei','patrao','playboy','zueiro','gamer','programador','visionario','billionario','poderoso','vencedor','senhor','fofoqueiro','dorminhoco','comilao','sedentario','atleta','estudioso','romantico','extrovertido','introvertido','calmo','nervoso','organizado','bagunceiro','economico','gastador','saudavel','religioso','ateu','aventureiro','caseiro','online','social','antisocial','popular','solitario','lider','seguidor','independente','criativo','sonhador','realista','otimista','pessimista','confiante','inseguro','maduro','infantil','serio','responsavel','irresponsavel'];

const zoeiraScan = ['crente','pecador','ciumao','possessivo','desapegado','sono','insone','dorminhoco2','viciado','viciada','viciadao','invejoso','invejosa','inveja'];

const zoeiraFem = ['lesbica','burra','linda','corna','gostosa','feia','rica','ladra','safada','vesga','bebada','homofobica','chata','sortuda','azarada','fraca','pegadora','otaria','boba','preguicosa','trabalhadora','braba','malandra','simpatica','engracada','charmosa','misteriosa','carinhosa','ciumenta','corajosa','esperta','talarica','chorona','brincalhona','traidora','bandida','cachorra','vagabunda','fortona','magrela','bombada','presidenta','rainha','patroa','programadora','visionaria','bilionaria','poderosa','vencedora','senhora','fofoqueira','dorminhoca','comilona','sedentaria','estudiosa','romantica','extrovertida','introvertida','calma','nervosa','organizada','bagunceira','economica','gastadora','supersticiosa','cetica','religiosa','ateia','moderna','conservadora','aventureira','caseira','solitaria','seguidora','criativa','sonhadora','insegura','madura','seria'];

const todosZoeira = [...zoeiraMasc, ...zoeiraScan, ...zoeiraFem];

function getPercent() {
  return Math.floor(Math.random() * 101);
}

async function handleZoeira(comando, ctx) {
  const { reply, sender, msg, BOT_NAME, sock, from } = ctx;

  if (comando === 'menuzoeira') {
    await reply(`╔━᳀『 *MENU ZOEIRA* 』═᳀
⌬ /gay
⌬ /feio
⌬ /lindo
⌬ /linda
⌬ /burro
⌬ /bebado
⌬ /genio
⌬ /rico
⌬ /pobre
⌬ /crente
⌬ /pecador
╚━═━═━═━═━═━═━═━═᳀
> © ${BOT_NAME}`);
    return true;
  }

  if (!todosZoeira.includes(comando)) return false;

  const mencao = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0] || sender;
  const nome = mencao.split('@')[0];
  const percent = getPercent();

  let emoji = '😂';
  if (percent >= 80) emoji = '💀';
  else if (percent >= 60) emoji = '😳';
  else if (percent >= 40) emoji = '😅';

  await sock.sendMessage(from, {
    text: `╔━᳀『 *SCANNER ${comando.toUpperCase()}* 』═᳀
⌬ *Usuário :* @${nome}
⌬ *Resultado :* ${percent}% ${emoji}
${'█'.repeat(Math.floor(percent/10))}${'░'.repeat(10-Math.floor(percent/10))} ${percent}%
╚━═━═━═━═━═━═━═━═᳀
> © ${BOT_NAME}`,
    mentions: [mencao]
  });

  return true;
}

module.exports = { handleZoeira };
