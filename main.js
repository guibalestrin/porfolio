/* ============================================================
   Guilherme Balestrin — portfolio · JS puro, sem dependências
   1) i18n PT/EN   2) hero CRT arrastável   3) frase animada por scroll
   4) janelas com abas  5) roda de interesses  6) reveals, FAQ, form
   ============================================================ */
(() => {
"use strict";

/* ---------- CONFIG (edite aqui) ---------- */
const CONFIG = {
  email: "seu-email@exemplo.com"   // TODO: troque pelo seu e-mail real
};

/* ---------- utilidades ---------- */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const mk = (tag, cls, txt) => { const e = document.createElement(tag); if (cls) e.className = cls; if (txt != null) e.textContent = txt; return e; };
const clamp01 = x => x < 0 ? 0 : x > 1 ? 1 : x;
const span = (e, a, b) => clamp01((e - a) / (b - a));
const lerp = (a, b, t) => a + (b - a) * t;
const easeOut = t => 1 - Math.pow(1 - t, 3);
const easeInOut = t => t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
const smooth = (a, b, x) => { const t = span(x, a, b); return t * t * (3 - 2 * t); };
const settle = (t, s = 1.3) => t >= 1 ? 1 : 1 + (s + 1) * Math.pow(t - 1, 3) + s * Math.pow(t - 1, 2);
const store = {
  get(k) { try { return localStorage.getItem(k); } catch (_) { return null; } },
  set(k, v) { try { localStorage.setItem(k, v); } catch (_) {} }
};
const root = document.documentElement;
const reduceMQ = matchMedia("(prefers-reduced-motion: reduce)");

/* ============================================================
   1) i18n
   ============================================================ */
const T = {
pt: {
  skip:"Pular para o conteúdo", nav_work:"Trabalhos", nav_about:"Sobre", nav_services:"O que faço", nav_contact:"Contato", nav_faq:"FAQ",
  tip_still:"Reduzir movimento",
  h1:"Guilherme Balestrin, 19 anos. Marketing digital desde 2022 e aluno de Administração no Insper.",
  ch1_k:"CANAL 01 · OLÁ", ch1_v:"19 anos · marketing digital",
  ch2_k:"CANAL 02 · FACULDADE", ch2_b:"ADMINIS&shy;TRAÇÃO",
  ch3_k:"CANAL 03 · DESDE 2022", ch3_b:"TRÁFEGO<br>COPY · SITES", ch3_v:"dropshipping → infoprodutos",
  hint_drag:"Arraste para olhar em volta", hint_scroll:"Role",
  hit_msg:"Por favor, não bata nele.",
  story_sr:"eu crio funis, sites e campanhas que vendem",
  work_h:"Trabalhos",
  p1_t:"Dropshipping", p1_l:"Onde tudo começou, em 2022: lojas online e tráfego orgânico — com um vídeo que passou de 2,3 milhões de views no TikTok.", p1_k:"E-commerce · Tráfego orgânico",
  p2_t:"Infoprodutos", p2_l:"Criei um produto do zero, montei toda a operação e vendi com campanhas pagas.", p2_k:"Produto digital · Funil · Tráfego pago",
  p3_t:"Sites em WordPress", p3_l:"Páginas de venda e sites pensados para a jornada do cliente, do primeiro clique à compra.", p3_k:"Web · Design · Copy",
  tabs_drop:["Vídeo viral","TikTok","Shopify","Amazon","Vendas"], tabs_info:["Vendas","Funil","Campanhas"], tabs_wp:["Páginas","Design","Copy"],
  sub_drop:["views. O vídeo da garrafinha na escola — o produto que eu vendia.","novos seguidores e 132K curtidas no mesmo vídeo (TikTok Studio).","sessões em uma semana na loja Shopify · R$161,49 em vendas, 3 pedidos.","de conversão em links de afiliado: 38 cliques, 6 pedidos, R$169,72.","venda paga no crédito (Yampi) + Reel com 5 mil curtidas."], big_drop:["2,3M","+3.375","944","15,79%","R$155,96"],
  sub_info:["notificações reais de Venda Aprovada e Pix Gerado no Kiwify.","Da atenção à compra","Tráfego pago em escala"], big_info:["Kiwify","",""], sub_wp:["Páginas que convertem","Visual com intenção","Texto que persuade"],
  rw_sr:"O que me move", rw_head:"Entender gente é o negócio.", rw_sub:"Toque em um rosto.",
  rw:[
    {t:"Liderança", x:"Quero entender o que faz um time seguir alguém — e como isso se aprende."},
    {t:"Gestão de pessoas", x:"Empresas são feitas de gente. Resultado vem de pessoas bem geridas."},
    {t:"Linguagem corporal", x:"O que a pessoa não diz muitas vezes conta mais do que o que ela diz."},
    {t:"Psicologia nas vendas", x:"Venda é decisão humana. Entender o porquê vale mais que qualquer script."},
    {t:"Persuasão", x:"Copy boa é clareza, emoção e o próximo passo certo."},
    {t:"Funil & jornada", x:"Cada clique é uma etapa da jornada do cliente. Eu desenho o caminho todo."}
  ],
  sv_a:"Tudo o que eu", sv_b:"faço.", sv_lede:"Do primeiro anúncio ao site no ar — com a visão completa do funil e da jornada do cliente.",
  s1_n:"Tráfego", s1_l:"Pago e orgânico, do teste à escala.", s1_1:"Campanhas pagas", s1_2:"Orgânico", s1_3:"Conteúdo", s1_4:"Análise",
  s2_n:"Copy & persuasão", s2_l:"Palavras que levam à decisão.", s2_1:"Copywriting", s2_2:"Páginas de venda", s2_3:"Anúncios", s2_4:"Psicologia aplicada",
  s3_n:"Design & sites", s3_l:"Visual claro, site que converte.", s3_1:"WordPress", s3_2:"Landing pages", s3_3:"Criativos", s3_4:"Identidade",
  s4_n:"Funis & produto", s4_l:"Da ideia à operação rodando.", s4_1:"Infoprodutos", s4_2:"Estrutura de funil", s4_3:"Jornada do cliente", s4_4:"Operação",
  bf_t:"Vamos conversar", bf_l:"Conte o que você está construindo. Eu respondo.", bf_name:"Nome", bf_email:"E-mail", bf_need:"Do que você precisa?",
  pill_site:"Site", pill_traffic:"Tráfego", pill_copy:"Copy", pill_funnel:"Funil", pill_other:"Outro", bf_about:"Conte mais", bf_send:"Enviar",
  bf_err:"Preencha nome e um e-mail válido.", bf_ok:"Abrindo seu app de e-mail…", bf_subject:"Contato pelo portfólio", bf_body_need:"Preciso de",
  rg_ask:"Tem uma ideia?", rg_say:"Vamos fazer vender.", rg_book:"Aberto a conversas",
  fq_t:"Perguntas, respondidas.",
  q1:"Quem é você?", a1:"Guilherme, 19 anos. Desde 2022 trabalho com marketing digital — primeiro dropshipping, depois infoprodutos — e agora estudo Administração no Insper.",
  q2:"O que você já fez?", a2:"Lojas de dropshipping com tráfego orgânico e um infoproduto criado do zero, com operação estruturada e vendas por campanhas pagas. Também crio sites em WordPress.",
  q3:"O que te interessa além de marketing?", a3:"Liderança, gestão de pessoas, linguagem corporal e psicologia aplicada às vendas. Entender o comportamento humano é a base de qualquer negócio.",
  q4:"Como começamos?", a4:"Preencha o formulário acima ou escreva direto por e-mail.",
  ft_say:"Marketing digital com<br>visão de gestão.", ft_loc:"Administração", ft_top:"Voltar ao topo ↑", copied:"Copiado",
  stk:{app_in:"IN.",app_swap:"InsperSwap",app_pz:"Presenza",traffic:"Tráfego pago",copy:"Copywriting",design:"Design",wp:"WordPress",funnel:"Funis",persuasion:"Persuasão",leader:"Liderança",body:"Linguagem corporal",psych:"Psicologia de vendas",insper:"Insper",y2022:"Desde 2022",organic:"Tráfego orgânico"},
  tip_help:"Teclas e gestos",
  ch4_k:"CANAL 04 · TIKTOK", ch4_b:"2,3M<br>VIEWS", ch4_v:"o vídeo da garrafinha",
  ch5_k:"CANAL 05 · LOJA", ch5_b:"944<br>SESSÕES", ch5_v:"numa semana · 3 pedidos",
  mq_t:"Plataformas por onde já passei",
  st_t:"Números de verdade.", st_l:"Métricas e prints das minhas próprias operações — sem enfeite.",
  st1:"views em um único vídeo no TikTok", st1s:"Maio/2023 · dropshipping",
  st2:"curtidas no mesmo vídeo", st2s:"Produto que eu vendia",
  st3:"novos seguidores vindos dele", st3s:"Dados do TikTok Studio",
  st4:"de conversão em links de afiliado", st4s:"Amazon Associados · 38 cliques, 6 pedidos",
  hp_t:"Teclas e gestos", hp_keys:"Atalhos de uma tecla", hp_close:"Fechar",
  hp_rows:[["Arrastar","Olhar em volta (ou mover os adesivos)"],["3 cliques no monitor","Não faça isso."],["1 – 5","Trocar de canal"],["L","Idioma PT / EN"],["M","Reduzir movimento"],["?","Esta ajuda"],["Shift + rolar","Mover o mundo na horizontal"]],
  ab_k:"Sobre mim", ab_t:"Oi, eu sou o Guilherme.",
  ab_c1:"19 anos", ab_c2:"Marketing digital desde 2022", ab_c3:"Administração",
  ab_p1:"Tenho 19 anos e, desde 2022, construo minha experiência no marketing digital: primeiro com dropshipping, agora com infoprodutos. Aprendi na prática tráfego pago e orgânico, copywriting, design, persuasão, produção de conteúdo e criação de sites em WordPress.",
  ab_p2:"Criei um produto do zero, estruturei toda a operação e vendi com campanhas pagas — o que me deu uma visão completa de funis e da jornada do cliente.",
  ab_p3:"Hoje estudo Administração no Insper e estou explorando e direcionando o que vem a seguir. Me interesso por liderança, gestão de pessoas, linguagem corporal e psicologia aplicada às vendas: entender o comportamento humano é um dos pilares de qualquer negócio bem-sucedido.",
  ab_f1:"Administração, em exploração e direcionamento", ab_f2:"Empresa júnior de consultoria",
  ij_k:"Experiência", ij_t:"Consultoria de verdade, na Insper Jr.",
  ij_l:"Tive a oportunidade de participar da Insper Jr, a empresa júnior de consultoria do Insper. Lá aprendi, na prática, os 4 escopos de um projeto de consultoria.",
  ij1_t:"Mercadológico", ij1_d:"Entender mercado, concorrência e público antes de qualquer decisão.",
  ij2_t:"Operacional", ij2_d:"Mapear processos, achar gargalos e organizar como o trabalho acontece.",
  ij3_t:"Marketing", ij3_d:"Posicionamento, marca e a forma como o negócio chega até o cliente.",
  ij4_t:"Financeiro", ij4_d:"Custos, projeções e viabilidade: o que faz o número fechar.",
  ij_gt:"O que isso agregou", ij_g:"Eu já vinha do marketing digital, olhando para o anúncio e o funil. A consultoria abriu o resto do mapa: agora enxergo o negócio inteiro — mercado, operação, marketing e números — e entendo como cada parte afeta as outras.",
  ij_st:"Skills que ganhei", ij_chips:["Visão estratégica","Análise de mercado","Estruturação de processos","Viabilidade financeira","Comunicação com cliente","Trabalho em equipe","Gestão de projetos","Apresentação de resultados"],
  nav_projects:"Projetos", ab_gt:"Um pouco mais de mim", g1:"Escritório é onde der.", g2:"Quando pede formalidade.", g3:"Rotina de faculdade.",
  vn_k:"Projetos paralelos", vn_t:"Ideias que viram produto.",
  vn_l:"Além do marketing e da faculdade, eu gosto de pegar uma ideia, desenhar a solução e colocar no ar. Estes são os projetos que construí em paralelo.",
  in_s:"Projeto atual · em construção",
  in_l:"Uma rede social fechada para quem estuda no Insper: o que está acontecendo no campus, só para quem é de dentro. Hoje está com lista de espera aberta.",
  in_f1:"Spotted anônimo", in_f2:"Festas e lotes", in_f3:"Caronas", in_f4:"Dúvidas da turma", in_f5:"Quem mora perto", in_f6:"Fila do Sodexo",
  in_n:"Entrada só com e-mail do Insper, sem senha.", in_cta:"Ver o IN.",
  sw_s:"No ar · projeto independente",
  sw_l:"Plataforma que conecta alunos que querem trocar de turma e encontra as melhores combinações — diretas, em grupo ou em ciclo — para beneficiar o máximo de pessoas.",
  sw_1:"Informe semestre, curso, turma atual e para onde quer ir.", sw_2:"O algoritmo procura o melhor match: direto, em grupo ou em ciclo.", sw_3:"Acompanhe o status e combine a troca com quem fechou match.",
  sw_n:"Projeto de alunos, sem fins lucrativos e sem vínculo oficial com o Insper.", sw_cta:"Ver o InsperSwap",
  sw_c1:"Match direto", sw_c2:"Em grupo", sw_c3:"Em ciclo",
  pz_s:"MVP · web app + API",
  pz_l:"Um consultor de look masculino digital. A tese: as pessoas te julgam em segundos, e a roupa define esse julgamento. O app mostra como cada look será percebido e deixa você montar o seu, peça por peça.",
  pz_f1:"Guarda-roupa digital", pz_f2:"6 ocasiões", pz_f3:"6 estilos", pz_f4:"Nível de presença e impacto", pz_f5:"Modo Análise e Construir", pz_f6:"Como você será percebido",
  pz_n:"Também criei a identidade visual (Ônix, Ouro Antigo e Marfim) e o manual do código. O motor de recomendação por regras é isolado e pronto para plugar IA.",
  pz_cta:"Quer ver? Me chama", pz_chip_k:"PRESENÇA", pz_chip_v:"Médio",
  nav_me:"Autoconhecimento",
  me_k:"Autoconhecimento", me_t:"Eu me conheço — e levo isso a sério.",
  me_l:"Passei por um processo de orientação profissional e mapeei forças, pontos de atenção, valores e critérios de carreira. Está aqui, sem filtro: é assim que eu decido e aonde quero chegar.",
  me_str_t:"Forças",
  me_str:["Ambicioso","Autêntico","Corajoso","Tolerante a risco","Empático","Autodidata","Mentalidade de crescimento","Observador de comportamento","Pensador estratégico","Conector de pessoas","Curioso intelectualmente","Proativo","Versátil","Adaptável socialmente","Humilde","Inteligência emocional","Movido por propósito","Autocorreção de rota"],
  me_wk_t:"Pontos de atenção",
  me_wk:["Foco disperso","Dificuldade de me comprometer com um só caminho","Execução inconsistente","Interesses voláteis","Autocobrança alta","Tendência a idealizar"],
  me_wk_n:"Sei onde eu travo. Meu antídoto: critérios escritos, metas com prazo e projetos que eu realmente coloco no ar.",
  me_ba_t:"Antes × depois da orientação", me_ba_s:"Minha autoavaliação, de 0 a 10", me_ba_avg:"6,2 → 8,3", me_ba_avgl:"média dos 14 itens", me_ba_b:"Antes", me_ba_a:"Depois",
  me_ba:[["Saber o que busco em uma profissão",3,10],["Distinguir meus valores",7,10],["Identificar minhas habilidades",5,9],["Identificar meus interesses",6,9],["Usar estratégias para decidir",7,9],["Ter hábito de reflexão contínua",5,7],["Entender como o mercado funciona",4,6],["Conhecer profissões e tendências",2,5]],
  me_ba_foot:"Maior salto: saber o que busco em uma carreira (3 → 10). Onde ainda quero evoluir: visão de mercado e tendências das áreas que considero.",
  me_cr_t:"Meus critérios de carreira", me_cr_s:"Os 10 que mais pesam, em ordem de prioridade",
  me_cr:["Ajudar as pessoas","Enfrentar desafios","Aconselhar","Liberdade","Estabilidade financeira","Desenvolver habilidades","Comportamento humano","Gerenciar pessoas","Networking profissional","Viajar a trabalho"],
  me_pa_t:"Caminhos que pesei", me_pa_s:"Ranking de uma balança que cruza critérios e profissões",
  me_pa:[[1,"Administração"],[2,"Estrategista digital"],[2,"Gestão de marketing e vendas"],[3,"Vendedor"],[4,"Produtor de conteúdo"],[5,"Analista de investimentos"],[6,"Comércio exterior"]],
  me_dc_t:"Como eu decido", me_dc_l:"O que se repete nas minhas escolhas: experimentar coisas novas e ficar com o que é bom, e servir o outro. Meus valores são o filtro.",
  me_dc:[["2022","Entrar no marketing digital","Sempre pensei em como ganhar dinheiro. Senti que estava crescendo e tinha propósito: aprendi a lidar com gente, pesquisar e filtrar informação."],["2023","Escrever um livro","Sintetizar e comunicar o que aprendo, gerando valor e autoridade. Ainda preciso me especializar e viver um pouco mais para fechá-lo."],["Rússia","Estudar russo e mochilar pelo Leste Europeu","Região mais barata e com uma cultura bem diferente da ocidental, com gente que agrega. Experiência de vida, repertório e desafios que fortalecem."],["Agora","Criar uma comunidade com amigos","O que mais me dá propósito é servir o outro. Estamos pensando em uma startup: começaria online, o ideal é presencial."]],
  me_ct_t:"Curtograma", me_ct_l:"O que eu gosto de fazer, e o que ainda faço pouco.", me_ct_a:"Gosto e faço", me_ct_b:"Gosto e quero fazer mais",
  me_ct1:["Estudar o que me interessa","Academia","Andar de bicicleta","Viajar","Ajudar os outros","Ensinar"],
  me_ct2:["Liderar","Trabalhar em grupo","Vendas","Persuadir","Socializar","Ler","Cozinhar","Documentários"],
  me_gl_t:"Metas", me_gl_s:"Até 2029 eu fecho a graduação. Depois, o resto da lista.", me_gl_a:"Até 2029", me_gl_b:"Depois de 2029",
  me_gl1:[["Russo C1/C2",0],["Participar de 1 entidade: Insper Jr",1],["Intercâmbio / mochilão na Rússia",0],["Curso de comunicação e oratória",0],["Curso de barman",0],["Curso de finanças e investimentos",0],["Ler 50 livros",0]],
  me_gl2:["Ironman","Teologia","Latim","Grego","Arte marcial","Viajar o mundo","Aprender um instrumento","Escrever um livro"],
  title:"Guilherme Balestrin — Marketing digital & Administração",
  desc:"Guilherme Balestrin, 19. Marketing digital desde 2022: tráfego, copy, design e sites. Administração no Insper.",
  story:["eu","crio","funis","sites","e","campanhas","que","VENDEM"]
},
en: {
  skip:"Skip to content", nav_work:"Work", nav_about:"About", nav_services:"Services", nav_contact:"Contact", nav_faq:"FAQ",
  tip_still:"Reduce motion",
  h1:"Guilherme Balestrin, 19. Digital marketing since 2022, studying Business Administration at Insper.",
  ch1_k:"CHANNEL 01 · HELLO", ch1_v:"19 y/o · digital marketing",
  ch2_k:"CHANNEL 02 · COLLEGE", ch2_b:"BUSINESS<br>ADMIN",
  ch3_k:"CHANNEL 03 · SINCE 2022", ch3_b:"TRAFFIC<br>COPY · SITES", ch3_v:"dropshipping → info products",
  hint_drag:"Drag to look around", hint_scroll:"Scroll",
  hit_msg:"Please do not hit it.",
  story_sr:"I create funnels, websites and campaigns that sell",
  work_h:"Work",
  p1_t:"Dropshipping", p1_l:"Where it all began, in 2022: online stores and organic traffic — with a video that passed 2.3 million views on TikTok.", p1_k:"E-commerce · Organic traffic",
  p2_t:"Info products", p2_l:"I built a product from scratch, set up the whole operation and sold it with paid campaigns.", p2_k:"Digital product · Funnel · Paid traffic",
  p3_t:"WordPress sites", p3_l:"Sales pages and sites built around the customer journey, from first click to checkout.", p3_k:"Web · Design · Copy",
  tabs_drop:["Viral video","TikTok","Shopify","Amazon","Sales"], tabs_info:["Sales","Funnel","Campaigns"], tabs_wp:["Pages","Design","Copy"],
  sub_drop:["views. The school bottle video — the product I was selling.","new followers and 132K likes on the same video (TikTok Studio).","sessions in one week on the Shopify store · R$161.49 in sales, 3 orders.","conversion on affiliate links: 38 clicks, 6 orders, R$169.72.","a sale paid by credit card (Yampi) + a Reel with 5K likes."], big_drop:["2.3M","+3,375","944","15.79%","R$155.96"],
  sub_info:["real Approved Sale and Pix Generated notifications from Kiwify.","From attention to purchase","Paid traffic at scale"], big_info:["Kiwify","",""], sub_wp:["Pages that convert","Design with intent","Copy that persuades"],
  rw_sr:"What drives me", rw_head:"Understanding people is the business.", rw_sub:"Tap a face.",
  rw:[
    {t:"Leadership", x:"I want to understand what makes a team follow someone — and how that is learned."},
    {t:"People management", x:"Companies are made of people. Results come from people who are well led."},
    {t:"Body language", x:"What someone doesn't say often tells you more than what they do."},
    {t:"Sales psychology", x:"Selling is a human decision. Knowing the why beats any script."},
    {t:"Persuasion", x:"Good copy is clarity, emotion and the right next step."},
    {t:"Funnel & journey", x:"Every click is a step in the customer journey. I design the whole path."}
  ],
  sv_a:"Everything I", sv_b:"do.", sv_lede:"From the first ad to the live site — with the full view of the funnel and the customer journey.",
  s1_n:"Traffic", s1_l:"Paid and organic, from test to scale.", s1_1:"Paid campaigns", s1_2:"Organic", s1_3:"Content", s1_4:"Analysis",
  s2_n:"Copy & persuasion", s2_l:"Words that lead to a decision.", s2_1:"Copywriting", s2_2:"Sales pages", s2_3:"Ads", s2_4:"Applied psychology",
  s3_n:"Design & sites", s3_l:"Clear visuals, a site that converts.", s3_1:"WordPress", s3_2:"Landing pages", s3_3:"Creatives", s3_4:"Identity",
  s4_n:"Funnels & product", s4_l:"From idea to a running operation.", s4_1:"Info products", s4_2:"Funnel structure", s4_3:"Customer journey", s4_4:"Operations",
  bf_t:"Let's talk", bf_l:"Tell me what you're building. I'll write back.", bf_name:"Name", bf_email:"Email", bf_need:"What do you need?",
  pill_site:"Website", pill_traffic:"Traffic", pill_copy:"Copy", pill_funnel:"Funnel", pill_other:"Other", bf_about:"Tell me more", bf_send:"Send",
  bf_err:"Please add your name and a valid email.", bf_ok:"Opening your email app…", bf_subject:"Contact from portfolio", bf_body_need:"I need",
  rg_ask:"Got an idea?", rg_say:"Let's make it sell.", rg_book:"Open to conversations",
  fq_t:"Questions, answered.",
  q1:"Who are you?", a1:"Guilherme, 19. Since 2022 I've worked in digital marketing — first dropshipping, then info products — and I'm now studying Business Administration at Insper.",
  q2:"What have you done?", a2:"Dropshipping stores driven by organic traffic, and an info product built from scratch with a structured operation and sales through paid campaigns. I also build WordPress sites.",
  q3:"What else are you into?", a3:"Leadership, people management, body language and psychology applied to sales. Understanding human behavior is the base of any business.",
  q4:"How do we start?", a4:"Fill in the form above or email me directly.",
  ft_say:"Digital marketing with<br>a management mindset.", ft_loc:"Business Administration", ft_top:"Back to top ↑", copied:"Copied",
  stk:{app_in:"IN.",app_swap:"InsperSwap",app_pz:"Presenza",traffic:"Paid traffic",copy:"Copywriting",design:"Design",wp:"WordPress",funnel:"Funnels",persuasion:"Persuasion",leader:"Leadership",body:"Body language",psych:"Sales psychology",insper:"Insper",y2022:"Since 2022",organic:"Organic traffic"},
  tip_help:"Keys & gestures",
  ch4_k:"CHANNEL 04 · TIKTOK", ch4_b:"2.3M<br>VIEWS", ch4_v:"the school bottle video",
  ch5_k:"CHANNEL 05 · STORE", ch5_b:"944<br>SESSIONS", ch5_v:"in one week · 3 orders",
  mq_t:"Platforms I've worked on",
  st_t:"Real numbers.", st_l:"Metrics and screenshots from my own operations — no polish.",
  st1:"views on a single TikTok video", st1s:"May 2023 · dropshipping",
  st2:"likes on the same video", st2s:"A product I was selling",
  st3:"new followers from it", st3s:"TikTok Studio data",
  st4:"conversion on affiliate links", st4s:"Amazon Associates · 38 clicks, 6 orders",
  hp_t:"Keys & gestures", hp_keys:"Single-key shortcuts", hp_close:"Close",
  hp_rows:[["Drag","Look around (or move the stickers)"],["3 clicks on the TV","Please don't."],["1 – 5","Switch channel"],["L","Language PT / EN"],["M","Reduce motion"],["?","This help"],["Shift + scroll","Pan the world sideways"]],
  ab_k:"About me", ab_t:"Hi, I'm Guilherme.",
  ab_c1:"19 y/o", ab_c2:"Digital marketing since 2022", ab_c3:"Business Admin",
  ab_p1:"I'm 19 and since 2022 I've been building my experience in digital marketing: first dropshipping, now info products. I learned paid and organic traffic, copywriting, design, persuasion, content production and WordPress sites by doing.",
  ab_p2:"I built a product from scratch, structured the whole operation and sold it with paid campaigns — which gave me a full view of funnels and the customer journey.",
  ab_p3:"Today I study Business Administration at Insper and I'm exploring what comes next. I'm into leadership, people management, body language and psychology applied to sales: understanding human behavior is one of the pillars of any successful business.",
  ab_f1:"Business Administration, exploring and finding direction", ab_f2:"Junior consulting company",
  ij_k:"Experience", ij_t:"Real consulting, at Insper Jr.",
  ij_l:"I had the opportunity to take part in Insper Jr, Insper's junior consulting company. There I learned, hands-on, the 4 scopes of a consulting project.",
  ij1_t:"Market", ij1_d:"Understand the market, competitors and audience before any decision.",
  ij2_t:"Operations", ij2_d:"Map processes, find bottlenecks and organize how the work gets done.",
  ij3_t:"Marketing", ij3_d:"Positioning, brand and how the business reaches the customer.",
  ij4_t:"Finance", ij4_d:"Costs, projections and viability: what makes the numbers work.",
  ij_gt:"What it added", ij_g:"I came from digital marketing, looking at the ad and the funnel. Consulting opened up the rest of the map: now I see the whole business — market, operations, marketing and numbers — and how each part affects the others.",
  ij_st:"Skills I gained", ij_chips:["Strategic thinking","Market analysis","Process design","Financial viability","Client communication","Teamwork","Project management","Presenting results"],
  nav_projects:"Projects", ab_gt:"A little more of me", g1:"Office is wherever it works.", g2:"When it calls for a suit.", g3:"College routine.",
  vn_k:"Side projects", vn_t:"Ideas that become products.",
  vn_l:"Beyond marketing and college, I like to take an idea, design the solution and put it live. These are the projects I built on the side.",
  in_s:"Current project · in the making",
  in_l:"A closed social network for people who study at Insper: what's happening on campus, only for those inside. It currently has an open waitlist.",
  in_f1:"Anonymous Spotted", in_f2:"Parties & tickets", in_f3:"Rides", in_f4:"Class questions", in_f5:"Who lives nearby", in_f6:"Cafeteria queue",
  in_n:"Sign-in with your Insper email only, no password.", in_cta:"See IN.",
  sw_s:"Live · independent project",
  sw_l:"A platform that connects students who want to swap classes and finds the best matches — direct, group or cycle — to benefit as many people as possible.",
  sw_1:"Enter semester, course, current class and where you want to go.", sw_2:"The algorithm finds the best match: direct, group or cycle.", sw_3:"Track the status and arrange the swap with whoever matched.",
  sw_n:"A student project, non-profit and with no official link to Insper.", sw_cta:"See InsperSwap",
  sw_c1:"Direct match", sw_c2:"Group", sw_c3:"Cycle",
  pz_s:"MVP · web app + API",
  pz_l:"A digital menswear look consultant. The thesis: people judge you in seconds, and your clothes shape that judgment. The app shows how each look will be perceived and lets you build yours, piece by piece.",
  pz_f1:"Digital wardrobe", pz_f2:"6 occasions", pz_f3:"6 styles", pz_f4:"Presence & impact level", pz_f5:"Analysis & Build modes", pz_f6:"How you'll be perceived",
  pz_n:"I also created the visual identity (Onyx, Antique Gold and Ivory) and the code manual. The rule-based recommendation engine is isolated and ready to plug in AI.",
  pz_cta:"Want to see it? Message me", pz_chip_k:"PRESENCE", pz_chip_v:"Medium",
  nav_me:"Self-knowledge",
  me_k:"Self-knowledge", me_t:"I know myself — and I take it seriously.",
  me_l:"I went through a career-guidance process and mapped my strengths, watch-outs, values and career criteria. It's all here, unfiltered: this is how I decide and where I'm headed.",
  me_str_t:"Strengths",
  me_str:["Ambitious","Authentic","Courageous","Risk-tolerant","Empathetic","Self-taught","Growth mindset","Behavior observer","Strategic thinker","People connector","Intellectually curious","Proactive","Versatile","Socially adaptable","Humble","Emotional intelligence","Purpose-driven","Self-correcting course"],
  me_wk_t:"Watch-outs",
  me_wk:["Scattered focus","Hard to commit to a single path","Inconsistent execution","Volatile interests","High self-pressure","Prone to idealizing"],
  me_wk_n:"I know where I get stuck. My antidote: written criteria, deadlines on goals and projects I actually put live.",
  me_ba_t:"Before × after the guidance process", me_ba_s:"My self-assessment, 0 to 10", me_ba_avg:"6.2 → 8.3", me_ba_avgl:"average across 14 items", me_ba_b:"Before", me_ba_a:"After",
  me_ba:[["Knowing what I look for in a profession",3,10],["Telling my values apart",7,10],["Identifying my skills",5,9],["Identifying my interests",6,9],["Using strategies to decide",7,9],["Habit of ongoing reflection",5,7],["Understanding how the market works",4,6],["Knowing professions and trends",2,5]],
  me_ba_foot:"Biggest jump: knowing what I look for in a career (3 → 10). Where I still want to grow: market vision and trends in the fields I'm considering.",
  me_cr_t:"My career criteria", me_cr_s:"The 10 that weigh the most, in priority order",
  me_cr:["Helping people","Facing challenges","Advising","Freedom","Financial stability","Developing skills","Human behavior","Managing people","Professional networking","Traveling for work"],
  me_pa_t:"Paths I weighed", me_pa_s:"Ranking from a scale that crosses criteria and professions",
  me_pa:[[1,"Business administration"],[2,"Digital strategist"],[2,"Marketing & sales management"],[3,"Salesperson"],[4,"Content producer"],[5,"Investment analyst"],[6,"Foreign trade"]],
  me_dc_t:"How I decide", me_dc_l:"What repeats in my choices: trying new things and keeping what's good, and serving others. My values are the filter.",
  me_dc:[["2022","Starting digital marketing","I've always thought about how to make money. I felt I was growing and had purpose: I learned to deal with people, research and filter information."],["2023","Writing a book","To synthesize and communicate what I learn, creating value and authority. I still need to specialize and live a bit more to finish it."],["Russia","Studying Russian and backpacking Eastern Europe","A cheaper region with a culture very different from the Western one, with people who add to my life. Life experience, repertoire and challenges that make me stronger."],["Now","Building a community with friends","What gives me the most purpose is serving others. We're thinking about a startup: it'd start online, ideally in person."]],
  me_ct_t:"Like-o-gram", me_ct_l:"What I like doing, and what I still do too little.", me_ct_a:"I like it and do it", me_ct_b:"I like it and want more",
  me_ct1:["Studying what interests me","Gym","Cycling","Traveling","Helping others","Teaching"],
  me_ct2:["Leading","Working in a team","Sales","Persuading","Socializing","Reading","Cooking","Documentaries"],
  me_gl_t:"Goals", me_gl_s:"By 2029 I finish college. After that, the rest of the list.", me_gl_a:"By 2029", me_gl_b:"After 2029",
  me_gl1:[["Russian C1/C2",0],["Take part in 1 organization: Insper Jr",1],["Exchange / backpacking in Russia",0],["Communication & public speaking course",0],["Bartending course",0],["Finance & investing course",0],["Read 50 books",0]],
  me_gl2:["Ironman","Theology","Latin","Greek","Martial art","Travel the world","Learn a musical instrument","Write a book"],
  title:"Guilherme Balestrin — Digital marketing & Business Administration",
  desc:"Guilherme Balestrin, 19. Digital marketing since 2022: traffic, copy, design and websites. Business Administration at Insper.",
  story:["I","create","funnels","websites","and","campaigns","that","SELL"]
}};

let lang = store.get("gb-lang");
if (lang !== "pt" && lang !== "en") lang = (navigator.language || "pt").toLowerCase().startsWith("pt") ? "pt" : "en";

/* ============================================================
   2) HERO — monitor CRT + mundo arrastável + stickers
   ============================================================ */
const hero = $("#top"), world = $("#world"), tv = $("#tv"), strip = $("#strip"), noiseC = $("#noise"), sysmsg = $("#sysmsg"), draghint = $("#draghint"), tvch = $("#tvch");
const layers = $$(".layer", world).map(el => ({ el, d: parseFloat(el.dataset.depth) || 1 }));
let vw = innerWidth, vh = innerHeight;
let pan = { x: 0, y: 0, vx: 0, vy: 0, drag: false, lx: 0, ly: 0, moved: 0 };
let heroVisible = true, chIdx = 0, rolling = false;

/* canais: clona 3→6 para o "roll" voltar ao mesmo canal sem salto */
const NCH = $$(".ch", strip).length;
$$(".ch", strip).forEach(c => strip.appendChild(c.cloneNode(true)));
$$(".ch", strip).forEach((c, i) => { c.style.top = (i * 100) + "%"; if (i >= NCH) c.setAttribute("aria-hidden", "true"); });
strip.style.setProperty("--roll", (NCH * 100) + "%");
/* só o vídeo do canal ativo carrega/toca (economiza banda e CPU) */
function syncChVideo() {
  [...strip.children].forEach((ch, idx) => {
    const v = ch.querySelector("video"); if (!v) return;
    const on = idx === chIdx && heroVisible && !root.dataset.still && !document.hidden && !rolling;
    if (on) { if (!v.getAttribute("src") && v.dataset.src) v.src = v.dataset.src; v.play().catch(() => {}); } else v.pause();
  });
}
function setCh(i, flash = true) {
  chIdx = (i + NCH) % NCH;
  strip.style.setProperty("--y0", (-chIdx * 100) + "%");
  strip.style.transform = `translateY(${-chIdx * 100}%)`;
  tvch.textContent = "CH 0" + (chIdx + 1);
  if (flash && !root.dataset.still) { tv.classList.remove("is-flicker"); void tv.offsetWidth; tv.classList.add("is-flicker"); }
  syncChVideo();
}
setCh(0, false);
setInterval(() => { if (heroVisible && !pan.drag && !rolling && !root.dataset.still && !document.hidden) setCh(chIdx + 1); }, 5600);
const knob = $(".tv-knob");
if (knob) { knob.style.pointerEvents = "auto"; knob.style.cursor = "pointer"; knob.setAttribute("role", "button"); knob.setAttribute("tabindex", "0"); knob.setAttribute("aria-label", "Channel");
  knob.addEventListener("click", e => { e.stopPropagation(); setCh(chIdx + 1); });
  knob.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setCh(chIdx + 1); } });
  knob.addEventListener("pointerdown", e => e.stopPropagation()); }

/* stickers (arrastáveis, com inércia) */
const STK = [
  { k:"traffic", fx:.14, fy:.22, r:-6, c:"" },   { k:"copy", fx:.80, fy:.18, r:5, c:"alt" },
  { k:"design", fx:.88, fy:.62, r:-4, c:"ink" },  { k:"wp", fx:.07, fy:.66, r:4, c:"alt" },
  { k:"funnel", fx:.24, fy:.86, r:-3, c:"" },     { k:"persuasion", fx:.72, fy:.86, r:3, c:"ink" },
  { k:"body", fx:-.16, fy:.42, r:-5, c:"" },      { k:"psych", fx:1.16, fy:.38, r:4, c:"alt" },
  { k:"leader", fx:.2, fy:-.12, r:3, c:"ink" },   { k:"insper", fx:.62, fy:-.14, r:-4, c:"" },
  { k:"y2022", fx:.48, fy:1.16, r:2, c:"alt" },   { k:"organic", fx:-.08, fy:1.05, r:-3, c:"ink" },
  { k:"app_in", fx:.62, fy:-.1, r:3, c:"ink" }, { k:"app_swap", fx:1.12, fy:.78, r:-5, c:"" }, { k:"app_pz", fx:-.12, fy:.82, r:4, c:"alt" },
  { k:"ph_cut", img:"assets/cut-daily.webp", fx:.2, fy:.56, r:-3, c:"photo cut" }, { k:"ph_work", img:"assets/g-work.webp", fx:.68, fy:1.1, r:4, c:"photo" },
  { k:"ph_tiktok", img:"assets/tiktok.webp", fx:.91, fy:.40, r:5, c:"photo" },  { k:"ph_kiwify", img:"assets/kiwify.webp", fx:.09, fy:.42, r:-5, c:"photo" },
  { k:"ph_me", img:"assets/me-sq.webp", cap:"Guilherme, 19", fx:.33, fy:.11, r:-4, c:"photo me" },  { k:"ph_amazon", img:"assets/amazon.webp", fx:.40, fy:1.12, r:3, c:"photo" },  { k:"ph_shop", img:"assets/shopify.webp", fx:.74, fy:-.14, r:-4, c:"photo" }
];
const stickersEl = $("#stickers");
const stickers = STK.map(s => {
  const el = mk("div", "sticker " + s.c); el.setAttribute("role", "note");
  if (s.img) { const im = mk("img"); im.src = s.img; im.alt = ""; im.draggable = false; im.loading = "lazy"; el.appendChild(im); if (s.cap) el.appendChild(mk("span", "cap", s.cap)); }
  stickersEl.appendChild(el);
  const o = { ...s, el, x: s.fx * vw, y: s.fy * vh, vx: 0, vy: 0, drag: false };
  bindSticker(o); return o;
});
function paintSticker(o) { o.el.style.transform = `translate(${o.x}px,${o.y}px) translate(-50%,-50%) rotate(${o.r}deg)`; }
function bindSticker(o) {
  let ox = 0, oy = 0, lx = 0, ly = 0, lt = 0;
  o.el.addEventListener("pointerdown", e => {
    e.stopPropagation(); o.drag = true; o.vx = o.vy = 0; o.el.classList.add("drag"); o.el.setPointerCapture(e.pointerId);
    const d = layers.find(l => l.el === stickersEl).d;
    ox = e.clientX - pan.x * d - o.x; oy = e.clientY - pan.y * d - o.y; lx = e.clientX; ly = e.clientY; lt = performance.now();
    o.el.parentNode.appendChild(o.el); hideHint();
  });
  o.el.addEventListener("pointermove", e => {
    if (!o.drag) return;
    const d = layers.find(l => l.el === stickersEl).d, now = performance.now(), dt = Math.max(1, now - lt);
    o.x = e.clientX - pan.x * d - ox; o.y = e.clientY - pan.y * d - oy;
    o.vx = lerp(o.vx, (e.clientX - lx) / dt * 16, .5); o.vy = lerp(o.vy, (e.clientY - ly) / dt * 16, .5);
    lx = e.clientX; ly = e.clientY; lt = now; paintSticker(o);
  });
  const up = () => { o.drag = false; o.el.classList.remove("drag"); if (root.dataset.still) o.vx = o.vy = 0; };
  o.el.addEventListener("pointerup", up); o.el.addEventListener("pointercancel", up);
}
function layoutStickers() { stickers.forEach(o => { o.x = o.fx * vw; o.y = o.fy * vh; o.vx = o.vy = 0; paintSticker(o); }); }

/* pan (arrastar para olhar em volta) */
function bounds() { return { x: vw * .38, y: vh * .32 }; }
function paintWorld() {
  layers.forEach(l => { l.el.style.transform = `translate3d(${pan.x * l.d}px,${pan.y * l.d}px,0)`; });
}
function hideHint() { if (!draghint.classList.contains("gone")) { draghint.classList.add("gone"); store.set("gb-hint", "1"); } }
if (store.get("gb-hint")) draghint.classList.add("gone");
hero.addEventListener("pointerdown", e => {
  if (e.target.closest(".dock") || e.target.closest(".sticker")) return;
  pan.downOnTv = !!e.target.closest("#tv");
  pan.drag = true; pan.lx = e.clientX; pan.ly = e.clientY; pan.moved = 0; pan.vx = pan.vy = 0;
  hero.classList.add("dragging"); hero.setPointerCapture(e.pointerId);
});
hero.addEventListener("pointermove", e => {
  if (!pan.drag) return;
  const dx = e.clientX - pan.lx, dy = e.clientY - pan.ly; pan.lx = e.clientX; pan.ly = e.clientY;
  pan.moved += Math.abs(dx) + Math.abs(dy);
  const b = bounds();
  pan.x = Math.max(-b.x, Math.min(b.x, pan.x + dx)); pan.y = Math.max(-b.y, Math.min(b.y, pan.y + dy));
  pan.vx = lerp(pan.vx, dx, .4); pan.vy = lerp(pan.vy, dy, .4);
  if (pan.moved > 10) hideHint();
  paintWorld();
});
const hitTimes = [];
function panEnd(e) {
  if (!pan.drag) return; pan.drag = false; hero.classList.remove("dragging");
  if (e && e.type === "pointerup" && pan.moved < 6 && pan.downOnTv) hit();
  if (root.dataset.still) pan.vx = pan.vy = 0;
}
hero.addEventListener("pointerup", panEnd); hero.addEventListener("pointercancel", panEnd);
hero.addEventListener("wheel", e => { if (e.shiftKey) { e.preventDefault(); const b = bounds(); pan.x = Math.max(-b.x, Math.min(b.x, pan.x - e.deltaY)); paintWorld(); } }, { passive: false });

/* bater no monitor → vertical roll */
let msgT = 0;
function say(txt, ms = 2600) { sysmsg.textContent = txt; sysmsg.classList.add("on"); clearTimeout(msgT); msgT = setTimeout(() => sysmsg.classList.remove("on"), ms); }
function hit() {
  if (rolling) return;
  const now = performance.now(); hitTimes.push(now);
  while (hitTimes.length && now - hitTimes[0] > 1500) hitTimes.shift();
  if (root.dataset.still) { if (hitTimes.length >= 3) { say(T[lang].hit_msg); hitTimes.length = 0; } return; }
  if (hitTimes.length >= 3) { hitTimes.length = 0; roll(); return; }
  tv.animate([{ transform: "translateY(0)" }, { transform: `translateY(${-2 - hitTimes.length * 1.5}px)` }, { transform: "translateY(0)" }], { duration: 200, easing: "ease-out" });
  tv.classList.remove("is-flicker"); void tv.offsetWidth; tv.classList.add("is-flicker");
}
function roll() {
  rolling = true; root.dataset.breaking = "1"; syncChVideo();
  strip.style.setProperty("--y0", (-chIdx * 100) + "%");
  tv.classList.add("is-rolling");
  setTimeout(() => { delete root.dataset.breaking; }, 620);
  setTimeout(() => { tv.classList.remove("is-rolling"); rolling = false; say(T[lang].hit_msg); syncChVideo(); }, 1200);
}

/* ruído de TV (canvas minúsculo) */
const nctx = noiseC.getContext("2d"), nimg = nctx.createImageData(noiseC.width, noiseC.height);
function drawNoise() {
  const d = nimg.data;
  for (let i = 0; i < d.length; i += 4) { const v = Math.random() * 255 | 0; d[i] = d[i + 1] = d[i + 2] = v; d[i + 3] = 255; }
  nctx.putImageData(nimg, 0, 0);
}

/* loop do hero (só roda quando visível) */
let frame = 0;
function heroTick() {
  if (heroVisible && !document.hidden) {
    frame++;
    if (!pan.drag && (Math.abs(pan.vx) > .05 || Math.abs(pan.vy) > .05)) {
      const b = bounds();
      pan.x += pan.vx; pan.y += pan.vy; pan.vx *= .93; pan.vy *= .93;
      if (pan.x > b.x || pan.x < -b.x) { pan.x = Math.max(-b.x, Math.min(b.x, pan.x)); pan.vx = 0; }
      if (pan.y > b.y || pan.y < -b.y) { pan.y = Math.max(-b.y, Math.min(b.y, pan.y)); pan.vy = 0; }
      paintWorld();
    }
    stickers.forEach(o => {
      if (o.drag || (Math.abs(o.vx) < .05 && Math.abs(o.vy) < .05)) return;
      o.x += o.vx; o.y += o.vy; o.vx *= .94; o.vy *= .94;
      const mx = vw * 1.4, my = vh * 1.3;
      if (o.x < -vw * .4 || o.x > mx) { o.vx *= -.5; o.x = Math.max(-vw * .4, Math.min(mx, o.x)); }
      if (o.y < -vh * .3 || o.y > my) { o.vy *= -.5; o.y = Math.max(-vh * .3, Math.min(my, o.y)); }
      paintSticker(o);
    });
    if (!root.dataset.still && frame % 4 === 0) drawNoise();
  }
  requestAnimationFrame(heroTick);
}
new IntersectionObserver(([en]) => { heroVisible = en.isIntersecting; syncChVideo(); }, { threshold: 0 }).observe(hero);
document.addEventListener("visibilitychange", () => { syncChVideo(); Object.values(pjState).forEach(x => x.sync && x.sync()); });

/* ============================================================
   3) STORY — frase animada por scroll
   ============================================================ */
const story = $("#story"), sentence = $("#sentence");
const TOTAL = 10;
const TIMING = [["rise",0,1],["reel",.5,1.3],["frame",1.4,2.4],["type",3.6,1.8],["drop",5,.9],["wipe",5.4,1.6],["rise",6.4,.8],["chrome",6.9,1.8]];
const LINES = [[0,1,2],[3,4,5],[6,7]];
const SUFFIX = { 2: "," };
const tilt = { x: 0, y: 0, tx: 0, ty: 0 };
let words = [], storyVisible = false, sp = 0, spTarget = 0;

const FX = {
  rise(text) {
    const el = mk("span", "word", text);
    return { el, layout() {}, update(e) { const k = easeOut(span(e, 0, .8)); el.style.opacity = easeOut(span(e, 0, .6)); el.style.filter = k >= 1 ? "" : `blur(${(1 - k) * 14}px)`; el.style.transform = `translateY(${(1 - k) * .4}em)`; } };
  },
  reel(text) {
    const el = mk("span", "word"), reels = [];
    const abc = "abcdefghijklmnopqrstuvwxyz"; let seed = text.length * 7 + 3;
    const rnd = () => { seed = (seed * 9301 + 49297) % 233280; return seed / 233280; };
    [...text].forEach((ch, i) => {
      const r = mk("span", "reel"), size = mk("span", "reel-size", ch), col = mk("span", "reel-col");
      size.style.visibility = "hidden"; col.style.position = "absolute"; col.style.left = "0"; col.style.top = "0"; col.style.width = "100%";
      const n = 5 + (i % 2);
      for (let j = 0; j < n; j++) col.appendChild(mk("span", "", j === n - 1 ? ch : abc[Math.floor(rnd() * 26)]));
      r.append(size, col); el.appendChild(r); reels.push({ col, n });
    });
    return { el, layout() {}, update(e) {
      el.style.opacity = Math.min(1, e * 12);
      reels.forEach((r, i) => { const k = easeInOut(span(e, i * .08, .7 + i * .05)); r.col.style.transform = `translateY(${-(r.n - 1) * 1.12 * k}em)`; });
    } };
  },
  drop(text) {
    const el = mk("span", "word", text);
    return { el, layout() {}, update(e) { const s = settle(span(e, 0, .85), 1.7); el.style.opacity = smooth(0, .15, e); el.style.transform = `translateY(${-(1 - s) * 1.3}em)`; } };
  },
  wipe(text) {
    const el = mk("span", "word wipe", text);
    return { el, layout() {}, update(e) { const k = easeOut(span(e, 0, .6)); el.style.opacity = easeOut(span(e, 0, .5)); el.style.transform = `translateY(${(1 - k) * .3}em)`; el.style.backgroundPosition = `${easeInOut(span(e, .35, 1)) * 100}% 0`; } };
  },
  type(text) {
    const el = mk("span", "word"), chs = [...text].map(c => { const s = mk("span", "ch-l", c); el.appendChild(s); return s; }), caret = mk("span", "caret");
    el.appendChild(caret);
    let xs = [], last = -1, t0 = 0;
    return { el, layout() { xs = [chs[0].offsetLeft, ...chs.map(c => c.offsetLeft + c.offsetWidth)]; },
      update(e, now) {
        const n = chs.length, h = clamp01((e - .08) / .78) * n;
        chs.forEach((c, i) => { const a = clamp01(h - i), s = settle(a, .9); c.style.opacity = clamp01(a * 4); c.style.transform = `translateY(${(1 - s) * .12}em) scale(${lerp(.55, 1, s)})`; });
        if (e !== last) { last = e; t0 = now; }
        const d = Math.min(n - 1, Math.floor(h)), x = xs.length ? lerp(xs[d], xs[d + 1], easeInOut(clamp01(h - d))) : 0;
        const u = now - t0 - .45, blink = u > 0 ? clamp01(.5 + 1.6 * Math.cos(2 * Math.PI * u / 1.05)) : 1;
        caret.style.opacity = smooth(0, .06, e) * (1 - smooth(.9, .99, e)) * blink; caret.style.transform = `translateX(${x}px)`;
      } };
  },
  frame(text) {
    const el = mk("span", "word"), fill = mk("span", "frame-fill", text), line = mk("span", "frame-line", text), box = mk("span", "frame-box");
    const hs = [0, 1, 2, 3].map(() => mk("span", "frame-handle")), dims = mk("span", "frame-dims");
    const cur = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    cur.setAttribute("viewBox", "0 0 24 24"); cur.setAttribute("width", "22"); cur.setAttribute("height", "22"); cur.setAttribute("class", "frame-cursor");
    cur.style.cssText = "position:absolute;top:0;left:0;z-index:4;pointer-events:none;opacity:0;overflow:visible;filter:drop-shadow(0 1px 2px rgba(0,0,0,.4));transform-origin:0 0";
    cur.innerHTML = '<path d="M4 2l16 9-7 2-3 7z" fill="#fff" stroke="#000" stroke-width="1.5" stroke-linejoin="round"/>';
    el.append(fill, line, box, ...hs, dims, cur);
    let c = 0, h = 0, u = 1;
    return { el,
      layout() { c = el.offsetWidth; h = el.offsetHeight; u = parseFloat(getComputedStyle(el).fontSize) || 100; },
      update(e) {
        const m = -.05 * u, g = 0, x = c + .05 * u, y = h;
        const b = easeInOut(span(e, .17, .44)), M = easeInOut(span(e, .19, .46));
        const v = lerp(m, x, b), A = lerp(g, y, M);
        fill.style.opacity = smooth(0, .12, e);
        Object.assign(box.style, { opacity: e > .16 ? 1 : 0, transform: `translate(${m}px,${g}px)`, width: (v - m) + "px", height: (A - g) + "px" });
        dims.textContent = `${Math.round(v - m)} × ${Math.round(A - g)}`;
        dims.style.opacity = smooth(.17, .22, e) * (1 - smooth(.5, .6, e));
        dims.style.transform = `translate(${(m + v) / 2}px,${A + .14 * u}px) translateX(-50%)`;
        const j = settle(span(e, .44, .62), .8);
        hs.forEach((hd, i) => { const px = i % 2 ? x : m, py = i < 2 ? g : y; hd.style.opacity = e > .44 ? 1 : 0; hd.style.transform = `translate(${px}px,${py}px) translate(-50%,-50%) scale(${j})`; });
        const k = easeInOut(span(e, .42, .66));
        line.style.clipPath = `inset(-.3em ${(1 - k) * 100}% -.3em -.3em)`;
        line.style.opacity = 1 - smooth(.84, .98, e) * 0; // permanece invertido: texto preto no branco
        let p;
        if (e < .16) { const t = easeOut(span(e, 0, .16)), a = [m - 1.4 * u, y + 1.1 * u], ct = [m - 1.2 * u, g + .2 * u], s = 1 - t; p = [0, 1].map(q => s * s * a[q] + 2 * s * t * ct[q] + t * t * [m, g][q]); }
        else p = [v, A];
        const E = e > .16 && e < .46 ? .86 + .14 * (1 - settle(clamp01((e - .16) / .06), .6)) : 1;
        cur.style.opacity = smooth(0, .05, e) * (1 - smooth(.62, .72, e));
        cur.style.transform = `translate(${p[0]}px,${p[1]}px) scale(${E})`;
      } };
  },
  chrome(text) {
    const el = mk("span", "word chrome"), N = 16, letters = [];
    [...text].forEach(ch => {
      const L = mk("span", "chrome-letter"), B = mk("span", "chrome-block");
      for (let i = 0; i < N; i++) { const l = mk("span", "chrome-layer", ch); const t = i / (N - 1); const g = Math.round(lerp(150, 34, t)); l.style.color = `rgb(${g},${g + 3},${g + 8})`; l.style.transform = `translateZ(${-(i + 1) * 1.6}px)`; B.appendChild(l); }
      B.append(mk("span", "chrome-face", ch), mk("span", "chrome-glint", ch)); L.appendChild(B); el.appendChild(L); letters.push(B);
    });
    el.style.perspective = "900px";
    return { el, layout() {}, update(e) {
      letters.forEach((B, i) => {
        const t = span(e, i * .08, i * .08 + .55), s = settle(t, 1.1), fin = smooth(.55, .8, e);
        B.style.opacity = smooth(0, .08, t);
        B.style.transform = `rotateY(${(1 - s) * -100 + tilt.x * 12 * fin}deg) rotateX(${(1 - s) * 40 - tilt.y * 8 * fin}deg) scale(${lerp(.7, 1, s)})`;
        const gl = $(".chrome-glint", B); gl.style.opacity = smooth(.72, .8, e) * (1 - smooth(.97, 1, e));
        gl.style.backgroundPosition = `${lerp(150, -50, span(e, .72 + i * .015, .98))}% 0`;
      });
    } };
  }
};

function buildStory() {
  sentence.textContent = ""; words = [];
  const txt = T[lang].story;
  LINES.forEach(idxs => {
    const line = mk("span", "line");
    idxs.forEach((wi, n) => {
      const [fx, at, len] = TIMING[wi], b = FX[fx](txt[wi]);
      const item = { ...b, at, len, suf: null };
      line.appendChild(b.el);
      if (SUFFIX[wi]) { item.suf = mk("span", "suf", SUFFIX[wi]); line.appendChild(item.suf); }
      if (n < idxs.length - 1) line.appendChild(document.createTextNode(" "));
      words.push(item);
    });
    sentence.appendChild(line);
  });
  $("#story-sr").textContent = T[lang].story_sr;
  layoutStory(); renderStory(true);
}
function layoutStory() { words.forEach(w => w.layout()); }
function storyProgress() {
  const r = story.getBoundingClientRect(), total = story.offsetHeight - innerHeight;
  return clamp01(-r.top / Math.max(1, total));
}
function renderStory(force) {
  const now = performance.now() / 1000;
  const still = !!root.dataset.still;
  const Tt = still ? TOTAL : sp * TOTAL;
  words.forEach(w => { const e = clamp01((Tt - w.at) / w.len); w.update(e, now); if (w.suf) w.suf.style.opacity = smooth(.1, .4, e); });
  const o = still ? 0 : easeInOut(span(Tt, 9.1, TOTAL));
  sentence.style.opacity = 1 - o * .8; sentence.style.transform = `scale(${1 - o * .06})`;
  sentence.setAttribute("data-ready", "");
}
const tiltMove = e => { tilt.tx = e.clientX / innerWidth * 2 - 1; tilt.ty = e.clientY / innerHeight * 2 - 1; };
addEventListener("pointermove", tiltMove, { passive: true });
new IntersectionObserver(([en]) => { storyVisible = en.isIntersecting; }, { rootMargin: "20% 0px" }).observe(story);
function storyTick() {
  if (storyVisible && !document.hidden && !root.dataset.still) {
    spTarget = storyProgress();
    const d = spTarget - sp; sp += Math.abs(d) < .0003 ? d : d * .22;
    tilt.x = lerp(tilt.x, tilt.tx, .08); tilt.y = lerp(tilt.y, tilt.ty, .08);
    renderStory();
  }
  requestAnimationFrame(storyTick);
}

/* ============================================================
   4) WORK — janelas com abas (telas geradas em CSS)
   ============================================================ */
const G = ["linear-gradient(135deg,#ff6a3d,#ff2d55)","linear-gradient(135deg,#0a84ff,#5ac8fa)","linear-gradient(135deg,#7b36ff,#ff2d92)","linear-gradient(135deg,#ff9500,#ffcc00)","linear-gradient(135deg,#00b894,#0a84ff)"];
const PJ = {
  drop: { items: [
    { g:G[0], v:1, src:"assets/bottle.mp4", poster:"assets/bottle.jpg", ar:"540/960" },
    { g:G[1], src:"assets/tiktok.webp", ar:"591/1280" },
    { g:G[2], v:1, src:"assets/dashboard.mp4", poster:"assets/dashboard.jpg", ar:"16/9", w:57, tw:33 },
    { g:G[3], src:"assets/amazon.webp", ar:"591/1280" },
    { g:G[4], src:"assets/notifs.webp", ar:"591/246", w:40, tw:42 }
  ] },
  info: { items: [
    { g:"linear-gradient(135deg,#0b8a5a,#19c37d)", src:"assets/kiwify.webp", ar:"591/813" },
    { g:"linear-gradient(135deg,#00b894,#0a84ff)", mock:"funnel" },
    { g:"linear-gradient(135deg,#ff9500,#ff3b30)", mock:"bars" }
  ] },
  wp: { items: [
    { g:"linear-gradient(135deg,#1f2a44,#4a6fa5)", mock:"cards" },
    { g:"linear-gradient(135deg,#f9d423,#ff4e50)", mock:"lines" },
    { g:"linear-gradient(135deg,#5856d6,#af52de)", mock:"lines" }
  ] }
};
const pjState = {};
function mockHTML(kind, title, sub, i) {
  const nav = '<div class="m-nav"><i></i><i></i><i></i><i></i></div>';
  const head = `${nav}<div class="m-sub">${sub}</div>`;
  const big = `<div class="m-big">${title}</div>`;
  if (kind === "cards") return head + `<div class="m-card" style="left:5cqw;top:24cqw;width:27cqw;height:24cqw"></div><div class="m-card" style="left:35cqw;top:24cqw;width:27cqw;height:24cqw"></div><div class="m-card" style="left:65cqw;top:24cqw;width:30cqw;height:24cqw"></div><div class="m-pill" style="right:5cqw;top:14cqw">Shop →</div>` + big;
  if (kind === "bars") { const h = [8,14,11,20,16,26,31].map((v, j) => `<i style="height:${v + (i * 2 + j) % 5}cqw;opacity:${.4 + j * .09}"></i>`).join(""); return head + `<div class="m-bars" style="right:6cqw;top:14cqw;height:34cqw;align-items:flex-end">${h}</div>` + big; }
  if (kind === "funnel") return head + [0,1,2,3].map(j => `<div class="m-card" style="left:${5 + j * 4}cqw;top:${22 + j * 8.6}cqw;width:${62 - j * 12}cqw;height:6.6cqw"></div>`).join("") + `<div class="m-pill" style="right:6cqw;top:16cqw">→ R$</div>` + big;
  return head + `<div class="m-line" style="left:5cqw;top:26cqw;width:56cqw"></div><div class="m-line" style="left:5cqw;top:31cqw;width:44cqw"></div><div class="m-line" style="left:5cqw;top:36cqw;width:50cqw"></div><div class="m-pill" style="left:5cqw;top:43cqw">${["Ver agora","Saiba mais","Começar"][i % 3]} →</div>` + big;
}
function mediaHTML(it, big, sub) {
  const pos = it.w ? `width:${it.w}cqw;top:50%;translate:0 -50%;` : `height:88%;top:6%;`;
  const inner = it.v ? `<video muted loop playsinline preload="none" poster="${it.poster}" data-src="${it.src}"></video>` : `<img src="${it.src}" alt="" loading="lazy" draggable="false">`;
  return `<div class="m-text" style="width:${it.tw || 42}cqw"><b>${big}</b><span>${sub}</span></div><div class="m-phone" style="--ar:${it.ar};${pos}">${inner}</div>`;
}
function buildWork() {
  $$(".pj").forEach(art => {
    const key = art.dataset.pj, tabsEl = $(".pj-tabs", art), screen = $(".pj-screen", art), P = PJ[key];
    const names = T[lang]["tabs_" + key], subs = T[lang]["sub_" + key], bigs = T[lang]["big_" + key] || [];
    const cur = pjState[key] ? pjState[key].i : 0;
    tabsEl.textContent = ""; screen.textContent = "";
    tabsEl.setAttribute("role", "tablist"); tabsEl.setAttribute("aria-label", $(".pj-app span:last-child", art).textContent);
    names.forEach((n, i) => {
      const it = P.items[i];
      const b = mk("button", "pj-tab", n); b.type = "button"; b.setAttribute("role", "tab");
      b.addEventListener("click", () => { select(i); if (pjState[key]) pjState[key].auto = false; });
      b.addEventListener("keydown", e => { if (e.key === "ArrowRight" || e.key === "ArrowLeft") { e.preventDefault(); select((pjState[key].i + (e.key === "ArrowRight" ? 1 : names.length - 1)) % names.length); tabsEl.children[pjState[key].i].focus(); pjState[key].auto = false; } });
      tabsEl.appendChild(b);
      const sc = mk("div", "scr" + (it.mock ? "" : " media")); sc.style.background = it.g;
      sc.innerHTML = it.mock ? mockHTML(it.mock, n, subs[i], i) : mediaHTML(it, bigs[i] || n, subs[i]);
      sc.setAttribute("role", "img"); sc.setAttribute("aria-label", n + " — " + (bigs[i] || "") + " " + subs[i]);
      screen.appendChild(sc);
    });
    function select(i) {
      pjState[key].i = i;
      [...tabsEl.children].forEach((b, j) => { b.setAttribute("aria-selected", j === i); b.tabIndex = j === i ? 0 : -1; });
      [...screen.children].forEach((sc, j) => { if (j === i) sc.setAttribute("data-on", ""); else sc.removeAttribute("data-on"); });
      pjState[key].sync();
    }
    pjState[key] = pjState[key] || { i: 0, auto: true, visible: false };
    pjState[key].select = select; pjState[key].n = names.length;
    pjState[key].sync = () => { /* só toca o vídeo da aba ativa quando visível */
      [...screen.children].forEach((sc, j) => { const v = $("video", sc); if (!v) return;
        if (j === pjState[key].i && pjState[key].visible && !root.dataset.still && !document.hidden) { if (!v.getAttribute("src")) v.src = v.dataset.src; v.play().catch(() => {}); } else v.pause(); });
    };
    select(cur);
  });
}
setInterval(() => { if (root.dataset.still || document.hidden) return; Object.values(pjState).forEach(x => { if (x.auto && x.visible) x.select((x.i + 1) % x.n); }); }, 5600);

/* ============================================================
   5) ROLA — roda de interesses com balões estilo iMessage
   ============================================================ */
const wheel = $("#rw-wheel"), rwStage = $("#rw-stage");
const FACES = [["🧭","#ffd6a5","#ffadad"],["👥","#caffbf","#9bf6ff"],["🕴️","#bdb2ff","#ffc6ff"],["🧠","#a0c4ff","#9bf6ff"],["🎯","#fdffb6","#ffd6a5"],["🧩","#ffc6ff","#a0c4ff"]];
let seats = [], theta = 0, hot = -1, rwVisible = false, resumeAt = 0, rwW = 0;
function buildWheel() {
  wheel.textContent = ""; seats = [];
  T[lang].rw.forEach((r, i) => {
    const seat = mk("div", "rw-seat"), face = mk("button", "rw-face", FACES[i][0]), bub = mk("div", "rw-bubble");
    face.type = "button"; face.style.setProperty("--a", FACES[i][1]); face.style.setProperty("--b", FACES[i][2]); face.setAttribute("aria-label", r.t);
    bub.innerHTML = `<b></b><span></span>`; $("b", bub).textContent = r.t; $("span", bub).textContent = r.x;
    seat.append(face, bub); wheel.appendChild(seat); seats.push(seat);
    face.addEventListener("click", e => { e.stopPropagation(); setHot(hot === i ? -1 : i); });
  });
  layoutWheel(); paintWheel();
}
function setHot(i) {
  hot = i; rwStage.classList.toggle("is-focused", i >= 0);
  seats.forEach((s, j) => s.classList.toggle("is-hot", j === i));
  if (i >= 0) { const s = seats[i]; theta = ((theta % 360) + 360) % 360; }
  resumeAt = performance.now() + 4500;
}
document.addEventListener("click", e => { if (hot >= 0 && !e.target.closest(".rw-face")) setHot(-1); });
document.addEventListener("keydown", e => { if (e.key === "Escape" && hot >= 0) setHot(-1); });
function layoutWheel() { rwW = rwStage.clientWidth; }
function paintWheel() {
  const R = Math.min(560, rwW * .7), cx = rwW / 2, cy = R + 80, n = seats.length;
  rwStage.style.setProperty("--R", R + "px");
  seats.forEach((s, i) => {
    const a = (theta + i * (360 / n)) * Math.PI / 180, x = cx + R * Math.sin(a), y = cy - R * Math.cos(a);
    s.style.transform = `translate(${x}px,${y}px)`; s.dataset.side = x > cx ? "left" : "right";
    s.style.opacity = hot >= 0 ? "" : String(clamp01(Math.cos(a) * 1.6 + .6));
    s.style.pointerEvents = Math.cos(a) > -.1 ? "auto" : "none";
  });
}
let lastW = performance.now();
function wheelTick(now) {
  const dt = Math.min(64, now - lastW) / 1000; lastW = now;
  if (rwVisible && !document.hidden) {
    if (hot < 0 && !root.dataset.still && now > resumeAt) { theta += dt * 7; paintWheel(); }
    else if (hot >= 0 && !root.dataset.still && now > resumeAt + 4000) { /* mantém */ }
  }
  requestAnimationFrame(wheelTick);
}
new IntersectionObserver(([en]) => { rwVisible = en.isIntersecting; }, { threshold: 0 }).observe(rwStage);

/* ============================================================
   6) reveals, FAQ, form, copiar e-mail, dock, idioma
   ============================================================ */
const io = new IntersectionObserver(es => es.forEach(en => {
  const t = en.target;
  if (t.matches(".pj")) { const s = pjState[t.dataset.pj]; if (s) { s.visible = en.isIntersecting; s.sync && s.sync(); } if (en.isIntersecting) t.setAttribute("data-in", ""); }
  if (en.isIntersecting) { if (t.matches(".sv")) t.classList.add("in"); if (t.matches("#rg-say")) t.classList.add("in"); }
}), { threshold: .25 });
$$(".pj, .sv, #rg-say").forEach(el => io.observe(el));

function splitCTA() {
  const el = $("#rg-say"), txt = T[lang].rg_say; el.textContent = ""; el.classList.remove("in"); el.setAttribute("aria-label", txt);
  [...txt].forEach((c, i) => { const s = mk("span", "tc", c === " " ? " " : c); s.style.setProperty("--k", i); s.setAttribute("aria-hidden", "true"); el.appendChild(s); });
  if (root.dataset.still) el.classList.add("in"); else io.unobserve(el), io.observe(el);
}

/* FAQ */
$$(".fq-q button").forEach(btn => btn.addEventListener("click", () => {
  const item = btn.closest(".fq-item"), open = !item.classList.contains("open");
  item.classList.toggle("open", open); btn.setAttribute("aria-expanded", open);
}));

/* form → mailto */
const bf = $("#bf"), bfNote = $("#bf-note");
bf.addEventListener("submit", e => {
  e.preventDefault();
  const f = new FormData(bf);
  if (f.get("website")) return;
  const name = (f.get("name") || "").trim(), mail = (f.get("email") || "").trim();
  if (!name || !/^\S+@\S+\.\S+$/.test(mail)) { bfNote.textContent = T[lang].bf_err; bfNote.className = "bf-note err"; return; }
  const what = f.getAll("what").join(", "), about = (f.get("about") || "").trim();
  const body = `${name} <${mail}>\n${what ? T[lang].bf_body_need + ": " + what + "\n" : ""}\n${about}`;
  bfNote.className = "bf-note"; bfNote.textContent = T[lang].bf_ok;
  location.href = `mailto:${CONFIG.email}?subject=${encodeURIComponent(T[lang].bf_subject)}&body=${encodeURIComponent(body)}`;
});

/* copiar e-mail */
const mailBtn = $("#mail");
mailBtn.addEventListener("click", async () => {
  try { await navigator.clipboard.writeText(CONFIG.email); } catch (_) { const r = document.createRange(); r.selectNodeContents($("#mail-t")); const s = getSelection(); s.removeAllRanges(); s.addRange(r); }
  mailBtn.classList.add("copied"); setTimeout(() => mailBtn.classList.remove("copied"), 1600);
});
$("#ft-top").addEventListener("click", () => scrollTo({ top: 0, behavior: root.dataset.still ? "auto" : "smooth" }));

/* idioma */
function setLang(l) {
  lang = l; store.set("gb-lang", l);
  root.lang = l === "pt" ? "pt-BR" : "en"; root.dataset.lang = l;
  $$("[data-i]").forEach(el => { const v = T[l][el.dataset.i]; if (typeof v === "string") el.innerHTML = v; });
  document.title = T[l].title; $('meta[name="description"]').setAttribute("content", T[l].desc);
  stickers.forEach(o => { if (!o.img) o.el.textContent = T[l].stk[o.k]; });
  $("#mail-t").textContent = CONFIG.email; mailBtn.dataset.copied = T[l].copied;
  $("#btn-still").setAttribute("aria-label", T[l].tip_still);
  buildWork(); buildWheel(); splitCTA(); buildStory();
  buildHelp(); setCounters(false); buildChips(); buildMe();
}
$("#btn-lang").addEventListener("click", () => setLang(lang === "pt" ? "en" : "pt"));

/* modo reduzido */
function setStill(on, persist = true) {
  if (on) root.dataset.still = "1"; else delete root.dataset.still;
  $("#btn-still").setAttribute("aria-pressed", on);
  if (persist) store.set("gb-still", on ? "1" : "0");
  if (on) { pan.x = pan.y = pan.vx = pan.vy = 0; paintWorld(); }
  renderStory(true); splitCTA(); heroScroll(); syncChVideo(); Object.values(pjState).forEach(x => x.sync && x.sync()); setCounters(false);
}
$("#btn-still").addEventListener("click", () => setStill(!root.dataset.still));

/* atalhos de uma tecla (ntch-like): L idioma · M movimento · 1-3 canais */
addEventListener("keydown", e => {
  if (e.metaKey || e.ctrlKey || e.altKey || /^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName)) return;
  const k = e.key.toLowerCase();
  if (k === "?" || (k === "h" && keysOn)) { openHelp(); return; }
  if (!keysOn) return;
  if (k === "l") setLang(lang === "pt" ? "en" : "pt");
  else if (k === "m") setStill(!root.dataset.still);
  else if (/^[1-9]$/.test(k) && +k <= NCH) setCh(+k - 1);
});

/* hero some/escala ao rolar + dock adaptativo */
const sheet = $(".sheet"), footer = $(".ft");
function heroScroll() {
  const y = scrollY, p = clamp01(y / vh);
  $("#progress").style.transform = `scaleX(${clamp01(y / Math.max(1, document.documentElement.scrollHeight - vh))})`;
  if (root.dataset.still) { hero.style.transform = ""; hero.style.opacity = ""; }
  else { hero.style.transform = `scale(${1 - p * .08})`; hero.style.opacity = String(1 - p * .85); }
  const st = sheet.getBoundingClientRect().top, ft = footer.getBoundingClientRect().top;
  document.body.classList.toggle("on-light", st < 40 && ft > 40);
}
addEventListener("scroll", heroScroll, { passive: true });
addEventListener("resize", () => { vw = innerWidth; vh = innerHeight; layoutStickers(); layoutStory(); layoutWheel(); paintWheel(); heroScroll(); });

/* ---------- contadores animados (padrão "stats" do 21st) ---------- */
const counted = new WeakSet();
const fmtN = (v, dec) => new Intl.NumberFormat(lang === "pt" ? "pt-BR" : "en-US", { minimumFractionDigits: dec, maximumFractionDigits: dec }).format(v);
function paintCounter(el, v) { el.textContent = (el.dataset.pre || "") + fmtN(v, +el.dataset.dec) + (el.dataset.suf || ""); }
function setCounters(animate) { $$(".st-num").forEach(el => { if (counted.has(el) || !animate) paintCounter(el, +el.dataset.to); }); }
const cio = new IntersectionObserver(es => es.forEach(en => {
  if (!en.isIntersecting || counted.has(en.target)) return;
  const el = en.target; counted.add(el); cio.unobserve(el);
  if (root.dataset.still) { paintCounter(el, +el.dataset.to); return; }
  const to = +el.dataset.to, t0 = performance.now(), D = 1500;
  (function step(now) { const t = clamp01((now - t0) / D); paintCounter(el, to * easeOut(t)); if (t < 1) requestAnimationFrame(step); })(t0);
}), { threshold: .6 });
$$(".st-num").forEach(el => { paintCounter(el, 0); cio.observe(el); });

/* ---------- spotlight que segue o mouse (cards) ---------- */
$$("[data-spot]").forEach(el => {
  el.addEventListener("pointermove", e => { const r = el.getBoundingClientRect(); el.style.setProperty("--mx", (e.clientX - r.left) + "px"); el.style.setProperty("--my", (e.clientY - r.top) + "px"); });
});
/* tilt sutil nas janelas */
$$(".pj-window").forEach(el => {
  el.addEventListener("pointermove", e => { if (root.dataset.still || e.pointerType === "touch") return; const r = el.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5; el.style.transform = `perspective(1200px) rotateY(${x * 4}deg) rotateX(${-y * 4}deg)`; });
  el.addEventListener("pointerleave", () => { el.style.transform = ""; });
});
/* marquee: duplica a lista para loop contínuo */
{ const ml = $("#mq-list"); if (ml) { const c = ml.cloneNode(true); c.removeAttribute("id"); c.setAttribute("aria-hidden", "true"); ml.parentNode.appendChild(c); } }

/* chips de skills + reveals genéricos (.rv) */
/* ---------- autoconhecimento ---------- */
function buildMe() {
  const t = T[lang];
  const fill = (id, items, fn) => { const ul = $(id); ul.textContent = ""; items.forEach((x, i) => { const li = fn(x, i); li.style.setProperty("--k", i); ul.appendChild(li); }); };
  fill("#me-str", t.me_str, x => mk("li", "", x));
  fill("#me-wk", t.me_wk, x => mk("li", "", x));
  fill("#me-bars", t.me_ba, ([l, a, d]) => {
    const li = mk("li", "me-bar"); li.style.setProperty("--a", a); li.style.setProperty("--d", d);
    li.append(mk("span", "me-bar-l", l), mk("span", "me-bar-t"), mk("b", "me-bar-n", a + " → " + d));
    const tr = li.querySelector(".me-bar-t"); tr.append(mk("i", "b0"), mk("i", "b1"));
    return li;
  });
  fill("#me-cr", t.me_cr, x => mk("li", "", x));
  fill("#me-pa", t.me_pa, ([n, x]) => { const li = mk("li"); li.append(mk("b", "", n + "º"), mk("span", "", x)); return li; });
  fill("#me-dc", t.me_dc, ([y, h, p]) => { const li = mk("li"); li.append(mk("small", "", y), mk("h4", "", h), mk("p", "", p)); return li; });
  fill("#me-ct1", t.me_ct1, x => mk("li", "", x));
  fill("#me-ct2", t.me_ct2, x => mk("li", "", x));
  fill("#me-gl1", t.me_gl1, ([x, done]) => mk("li", done ? "done" : "", x));
  fill("#me-gl2", t.me_gl2, x => mk("li", "", x));
}
function buildChips() { const ul = $("#ij-chips"); ul.textContent = ""; T[lang].ij_chips.forEach((c, i) => { const li = mk("li", "", c); li.style.setProperty("--k", i); ul.appendChild(li); }); }
const rvio = new IntersectionObserver(es => es.forEach(en => { if (en.isIntersecting) { en.target.classList.add("in"); rvio.unobserve(en.target); } }), { threshold: .15 });
$$(".rv").forEach(el => rvio.observe(el));

/* ---------- painel "teclas e gestos" (ntch) ---------- */
const help = $("#help"); let keysOn = store.get("gb-keys") !== "0";
function buildHelp() { const ul = $("#help-list"); ul.textContent = ""; T[lang].hp_rows.forEach(([k, d]) => { const li = mk("li"); li.appendChild(mk("kbd", "", k)); li.appendChild(mk("span", "", d)); ul.appendChild(li); }); paintKeys(); }
function paintKeys() { $("#help-keys").setAttribute("aria-pressed", keysOn); $("#help-keys-s").textContent = keysOn ? "on" : "off"; }
function openHelp() { if (help.open) return; if (help.showModal) help.showModal(); else help.setAttribute("open", ""); }
$("#btn-help").addEventListener("click", openHelp);
$("#help-close").addEventListener("click", () => help.close());
help.addEventListener("click", e => { if (e.target === help) help.close(); });
$("#help-keys").addEventListener("click", () => { keysOn = !keysOn; store.set("gb-keys", keysOn ? "1" : "0"); paintKeys(); });

/* ---------- init ---------- */
const savedStill = store.get("gb-still");
if (savedStill === "1" || (savedStill == null && reduceMQ.matches)) { root.dataset.still = "1"; $("#btn-still").setAttribute("aria-pressed", "true"); }
setLang(lang);
layoutStickers(); paintWorld(); heroScroll();
requestAnimationFrame(heroTick); requestAnimationFrame(storyTick); requestAnimationFrame(wheelTick);
if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { layoutStory(); renderStory(true); layoutWheel(); paintWheel(); });
})();
