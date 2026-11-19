/* ============================================================
   Guilherme Balestrin — portfolio, JS puro, sem dependências
   1) i18n PT/EN   2) hero CRT arrastável   3) frase animada por scroll
   4) janelas com abas  5) roda de interesses  6) reveals, FAQ, form
   ============================================================ */
(() => {
"use strict";

/* ---------- CONFIG (edite aqui) ---------- */
const CONFIG = {
  email: "guibalestrin@hotmail.com"
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
  h1:"Guilherme Balestrin, 19 anos. 4 anos de experiência em marketing digital e aluno de Administração de Empresas no Insper.",
  ch1_k:"Olá, eu sou", ch1_v:"4 anos de experiência em marketing digital",
  ch2_k:"Faculdade", ch2_b:"Administração<br>de Empresas", ch2_v:"Graduação em São Paulo",
  ch3_k:"O que eu faço", ch3_b:"Tráfego, copy<br>e sites", ch3_v:"Do anúncio à página de venda",
  hint_drag:"Arraste para olhar em volta", stp1:"TikTok Studio", stp2:"Amazon Associados", cta1:"Ver trabalhos", cta2:"Falar comigo", hint_scroll:"Role para mudar de canal", rail:["Olá","Faculdade","Serviços"],
  hit_msg:"Por favor, não bata nele.",
  story_sr:"eu crio funis, sites e campanhas que vendem",
  work_h:"Trabalhos",
  p1_t:"Dropshipping", p1_l:"Tudo começou em 2022, com uma loja online. Demorou 1 ano até a primeira venda. Pelo caminho, um vídeo no TikTok passou de 2,3 milhões de views.", p1_k:"E-commerce e tráfego orgânico",
  p2_t:"Infoprodutos", p2_l:"Depois criei meu próprio produto, montei a operação inteira e passei a vender com anúncios pagos.", p2_k:"Produto digital, funil e tráfego pago",
  p3_t:"Meta e TikTok Ads", p3_l:"Campanhas no Meta Ads e no TikTok Ads: segmentação de público, testes A/B e otimização de verba para trazer o cliente certo.", p3_k:"Meta Ads, TikTok Ads e tráfego pago",
  tabs_drop:["Vídeo viral","TikTok","Shopify","Amazon","Vendas"], tabs_info:["Vendas","E-books"], tabs_meta:["Públicos","Verba"],
  sub_drop:["views. O vídeo da garrafinha na escola, o produto que eu vendia.","novos seguidores e 132K curtidas no mesmo vídeo (TikTok Studio).","sessões em uma semana na loja Shopify, com R$161,49 em vendas, 3 pedidos.","de conversão em links de afiliado: 38 cliques, 6 pedidos, R$169,72.","venda paga no crédito (Yampi) + Reel com 5 mil curtidas."], big_drop:["2,3M","+3.375","944","15,79%","R$155,96"],
  sub_info:["notificações reais de Venda Aprovada e Pix Gerado no Kiwify.","capas e páginas dos e-books que eu vendia. Design e texto meus."], big_info:["Kiwify","E‑books"], sub_meta:["Segmentação para falar com quem compra","Verba otimizada com base nas métricas"],
  nav_jn:"Minha história", jn_k:"Fora do trabalho", jn_t:"Repetir até ficar bom.",
  jn_l:"Quase tudo o que eu sei fazer bem veio da mesma regra: fazer a mesma coisa de novo e de novo, enquanto o resto desiste.",
  jn1_t:"Quase fui pro player de CS2.",
  jn1_p1:"Joguei mais de 3 mil horas de CS2. Eu via minha evolução de perto e era bom naquilo. Ali eu entendi que talento não é dom: ele nasce de repetir a mesma coisa muitas vezes enquanto os outros estão desistindo.",
  jn1_p2:"Por isso eu acredito que, em tudo o que eu me dedicar com energia e tempo suficientes, eu sou capaz de chegar lá. Foi a mesma conta nos negócios: demorou 1 ano até a primeira venda e eu continuei.",
  jn1_big:"3.000+", jn1_bigl:"horas de CS2", jn1_yt:"Alguns vídeos meus no YouTube",
  jn2_t:"Não tenho vergonha de aparecer.",
  jn2_p1:"Eu criei conteúdo no meu perfil pessoal, de frente para a câmera. Uma das séries foi o “Do Zero ao Milhão”, em que eu mostrava o dia a dia construindo minha loja: anúncios, copy, treino, estudo e devocional.",
  jn2_p2:"Quem vende para gente precisa saber ser visto por gente. Gravar, errar em público e continuar é parte do treino.",
  jn2_cap:"Dia 5 da série “Do Zero ao Milhão”, no meu perfil pessoal. Toque para ouvir.",
  jn3_t:"Gosto de desafio. O de agora é o russo.",
  jn3_p1:"Estou estudando russo e já saí do zero: hoje estou no nível básico. Alfabeto novo, sons novos. Escolhi justamente porque é difícil.",
  jn3_p2:"É a mesma regra de sempre. Não existe atalho, existe repetição até soltar.",
  jn3_ru:"privet = oi", jn3_rul:"Estudando russo agora",
  jn4_t:"Leio para entender gente.", jn4_p:"Gosto de ler sobre neurociência, psicologia e filosofia. Quero entender como as pessoas pensam, sentem e decidem, porque todo negócio bom começa aí.",
  jn4_c1:"Neurociência", jn4_c2:"Psicologia", jn4_c3:"Filosofia",
  jn5_t:"Sou cristão.", jn5_p:"Minha fé aparece no jeito como eu ajo e trabalho. Nos meus vídeos, o devocional fazia parte do dia, junto com o trabalho.",
  xp_k:"Experiência prática", xp_t:"O que eu já fiz, na prática.", xp_l:"Do anúncio ao funil, sempre em projeto próprio e com resultado que dá para conferir.",
  xp1_tag:"Projeto próprio", xp1_t:"Fundador e operador de e‑commerce (dropshipping)", xp1_d:"Criei e gerenciei a loja inteira, do marketing às vendas.",
  xp1_b1:"Campanhas no Meta Ads e TikTok Ads: segmentação de público, testes A/B e otimização de verba.",
  xp1_b2:"Conteúdo orgânico com foco em conversão, com um vídeo que passou de 2,3 milhões de views no TikTok.",
  xp1_b3:"Parcerias com micro influenciadores: busca de perfis, briefing e acompanhamento das entregas.",
  xp1_b5:"Resultado: mais de 20 vendas e produto validado no mercado.",
  xp2_tag:"Projeto próprio · Caverna de Alexandria", xp2_t:"Fundador · Marca e comunidade", xp2_d:"Criei uma marca própria para vender meus infoprodutos de educação e desenvolvimento pessoal.",
  xp2_b1:"Branding: nome, identidade e mensagem pensados para que todos os meus infoprodutos vendessem sob a mesma marca, com mais confiança.",
  xp2_b2:"A ideia era ir além do produto: construir uma comunidade em torno da marca, reunindo pessoas com a mesma mentalidade de estudo, disciplina e crescimento.",
  xp2_b3:"Conteúdo nas redes, funis de venda, copy e automações com Typebot para atrair esse público e transformar seguidores em clientes.",
  xp3_tag:"Experiência pontual", xp3_t:"Afiliado digital", xp3_d:"Plataformas de infoprodutos.",
  xp3_b1:"Atuei como afiliado para validar estratégias de tráfego e depois migrei para construir uma marca própria.",
  xp_tools:"Ferramentas", xp_lang:"Idiomas", xp_l1:"Português (nativo)", xp_l2:"Inglês (fluente)", xp_l3:"Russo (básico)",
  jn1_evo:"evolução, hora após hora", awp_fire:"Clique para atirar", jn5_cap:"Meu devocional, num dos vídeos.",
  xp_s1:"vendas", xp_s2:"views em um vídeo", xp_s3:"produto validado",
  sv_a:"Tudo o que eu", sv_b:"faço.", sv_lede:"Do primeiro anúncio ao site no ar, eu cuido do caminho inteiro do cliente.",
  s1_n:"Tráfego", s1_l:"Pago e orgânico, do teste à escala.", s1_1:"Meta Ads e TikTok Ads", s1_2:"Testes A/B", s1_3:"Conteúdo orgânico", s1_4:"Análise de métricas",
  s2_n:"Copy & persuasão", s2_l:"Palavras que levam à decisão.", s2_1:"Copywriting", s2_2:"Páginas de venda", s2_3:"Anúncios", s2_4:"Psicologia aplicada",
  s3_n:"Design & sites", s3_l:"Visual claro, site que converte.", s3_1:"Sites e apps", s3_2:"Landing pages", s3_3:"Branding", s3_4:"Identidade",
  s4_n:"Funis & produto", s4_l:"Da ideia à operação rodando.", s4_1:"Infoprodutos", s4_2:"Funis e jornada do cliente", s4_3:"Automação com Typebot", s4_4:"Parcerias com influenciadores",
  bf_t:"Vamos conversar", bf_l:"Tem uma oportunidade ligada a marketing digital, tráfego ou conteúdo? Conte aqui. Eu respondo.", bf_name:"Nome", bf_email:"E-mail", bf_need:"Do que você precisa?",
  pill_site:"Site", pill_traffic:"Tráfego", pill_copy:"Copy", pill_funnel:"Funil", pill_other:"Outro", bf_about:"Conte mais", bf_send:"Dobrar e enviar", pill_cr:"Branding", bf_co:"Empresa", bf_opt:"Opcional", bf_kind:"Tipo de oportunidade", kind_1:"Estágio", kind_2:"Freela", kind_3:"Projeto", kind_4:"Parceria", bf_sent:"Tá na caixa.", bf_sent_n:"Abri seu app de e-mail com a mensagem pronta. É só apertar enviar.", bf_again:"Escrever outra",
  bf_err:"Preencha nome e um e-mail válido.", bf_ok:"Abrindo seu app de e-mail…", bf_subject:"Contato pelo portfólio", bf_body_need:"Preciso de",
  rg_ask:"Minha proposta", rg_say:"Aberto a oportunidades alinhadas ao que eu gosto e já fiz.", rg_book:"Remoto ou híbrido, em São Paulo",
  fq_t:"Perguntas, respondidas.",
  q1:"Quem é você?", a1:"Guilherme, 19 anos. Comecei no marketing digital em 2022, com dropshipping, e depois fiz infoprodutos. Hoje estudo Administração de Empresas no Insper.",
  q2:"O que você já fez?", a2:"Montei e operei uma loja de dropshipping do zero, com campanhas no Meta Ads e TikTok Ads e parcerias com micro influenciadores, e passei de 20 vendas. Depois criei a Caverna de Alexandria, uma marca para vender meus infoprodutos e reunir uma comunidade de pessoas com a mesma mentalidade. Também já criei conteúdo no meu perfil pessoal.",
  q3:"O que te interessa além de marketing?", a3:"Liderança, gestão de pessoas, linguagem corporal e psicologia nas vendas. Todo negócio depende de entender como as pessoas decidem.",
  q4:"Como começamos?", a4:"Preencha o formulário acima ou me escreva por e-mail. Eu respondo.",
  ft_say:"Marketing digital e<br>Administração de Empresas.", ft_top:"Voltar ao topo ↑", copied:"Copiado",
  stk:{app_in:"IN.",app_swap:"InsperSwap",app_pz:"Presenza",traffic:"Tráfego pago",copy:"Copywriting",design:"Design",meta:"Meta Ads",funnel:"Funis",persuasion:"Persuasão",leader:"Liderança",body:"Linguagem corporal",psych:"Psicologia de vendas",insper:"Insper",y2022:"4 anos de experiência",organic:"Tráfego orgânico"},
  tip_help:"Teclas e gestos",
  mq_t:"Plataformas por onde já passei",
  st_t:"Números de verdade.", st_l:"Prints e métricas das minhas próprias operações. Sem maquiagem.",
  st1:"views em um único vídeo no TikTok", st1s:"Maio/2023, dropshipping",
  st2:"curtidas no mesmo vídeo", st2s:"Produto que eu vendia",
  st3:"novos seguidores vindos dele", st3s:"Dados do TikTok Studio",
  st4:"de conversão em links de afiliado", st4s:"Amazon Associados: 38 cliques, 6 pedidos",
  hp_t:"Teclas e gestos", hp_keys:"Atalhos de uma tecla", hp_close:"Fechar",
  hp_rows:[["Arrastar","Olhar em volta (ou mover os adesivos)"],["3 cliques no monitor","Não faça isso."],["1 – 3","Trocar de canal"],["L","Idioma PT / EN"],["M","Reduzir movimento"],["?","Esta ajuda"],["Shift + rolar","Mover o mundo na horizontal"]],
  ab_k:"Sobre mim", ab_t:"Oi, eu sou o Guilherme.",
  ab_c1:"19 anos", ab_c2:"4 anos de experiência", ab_c3:"Administração de Empresas",
  ab_p1:"Tenho 19 anos e comecei no marketing digital em 2022. Primeiro com dropshipping, onde demorou 1 ano até a primeira venda, depois com infoprodutos. Aprendi fazendo: tráfego pago e orgânico, copy, design, persuasão, conteúdo e Meta Ads.",
  ab_p2:"Em um desses projetos criei um produto do zero, montei a operação e vendi com anúncios pagos. Foi assim que passei a enxergar o funil inteiro e a jornada do cliente.",
  ab_p3:"Hoje estudo Administração de Empresas no Insper e gosto de desafio: estou estudando russo, leio sobre neurociência, psicologia e filosofia e sigo uma regra simples, repetir até ficar bom. O que mais me puxa é liderança, gestão de pessoas, linguagem corporal e psicologia nas vendas, porque todo negócio bom começa em entender gente. Sou cristão, e isso aparece no jeito como eu ajo e trabalho.",
  ab_f1:"Administração de Empresas", ab_f2:"Empresa júnior de consultoria",
  ij_k:"Experiência", ij_t:"Consultoria de verdade, na Insper Jr.",
  ij_l:"Na faculdade entrei na Insper Jr, a empresa júnior de consultoria do Insper. Lá vivi, na prática, os 4 escopos de um projeto de consultoria.",
  ij1_t:"Mercadológico", ij1_d:"Entender mercado, concorrência e público antes de qualquer decisão.",
  ij2_t:"Operacional", ij2_d:"Mapear processos, achar gargalos e organizar como o trabalho acontece.",
  ij3_t:"Marketing", ij3_d:"Posicionamento, marca e a forma como o negócio chega até o cliente.",
  ij4_t:"Financeiro", ij4_d:"Custos, projeções e viabilidade: o que faz o número fechar.",
  ij_gt:"O que isso agregou", ij_g:"Eu vinha do marketing digital, olhando para o anúncio e o funil. A consultoria mostrou o resto do mapa. Hoje enxergo o negócio inteiro (mercado, operação, marketing e números) e como uma parte mexe na outra.",
  ij_st:"Skills que ganhei", ij_chips:["Visão estratégica","Análise de mercado","Estruturação de processos","Viabilidade financeira","Comunicação com cliente","Trabalho em equipe","Gestão de projetos","Apresentação de resultados"],
  kf_k:"Evento", kf_t:"Kiwify Festival 2023.", kf_l:"Fui ao maior evento de infoprodutos do Brasil e vi de perto como quem vende na internet pensa, vende e escala.", kf_c1:"No palco da Kiwify", kf_c2:"Plateia lotada, palco verde", nav_kf:"Kiwify Festival",
  nav_projects:"Projetos", ab_gt:"Um pouco mais de mim", g1:"Escritório é onde der.", g2:"Quando pede formalidade.", g3:"Rotina de faculdade.",
  vn_k:"Projetos paralelos", vn_t:"Ideias que viram produto.",
  vn_l:"Além do marketing e da faculdade, gosto de pegar uma ideia, desenhar a solução e colocar no ar. Estes são projetos que construí por conta própria.",
  in_s:"Projeto atual, em construção",
  in_l:"Uma rede social fechada para quem estuda no Insper: o que está acontecendo no campus, só para quem é de dentro. Hoje está com lista de espera aberta.",
  in_f1:"Spotted anônimo", in_f2:"Festas e lotes", in_f3:"Caronas", in_f4:"Dúvidas da turma", in_f5:"Quem mora perto", in_f6:"Fila do Sodexo",
  in_n:"Entrada só com e-mail do Insper, sem senha.", in_cta:"Ver o IN.",
  sw_s:"No ar, projeto independente",
  sw_l:"Plataforma que junta alunos que querem trocar de turma e encontra as melhores combinações: diretas, em grupo ou em ciclo, para ajudar o máximo de gente.",
  sw_1:"Informe semestre, curso, turma atual e para onde quer ir.", sw_2:"O algoritmo procura o melhor match: direto, em grupo ou em ciclo.", sw_3:"Acompanhe o status e combine a troca com quem fechou match.",
  sw_n:"Projeto de alunos, sem fins lucrativos e sem vínculo oficial com o Insper.", sw_cta:"Ver o InsperSwap",
  sw_c1:"Match direto", sw_c2:"Em grupo", sw_c3:"Em ciclo",
  pz_s:"MVP com web app e API",
  pz_l:"Um consultor de look masculino digital. A tese: as pessoas te julgam em segundos, e a roupa define esse julgamento. O app mostra como cada look será percebido e deixa você montar o seu, peça por peça.",
  pz_f1:"Guarda-roupa digital", pz_f2:"6 ocasiões", pz_f3:"6 estilos", pz_f4:"Nível de presença e impacto", pz_f5:"Modo Análise e Construir", pz_f6:"Como você será percebido",
  pz_n:"Também criei a identidade visual (Ônix, Ouro Antigo e Marfim) e o manual do código. O motor de recomendação por regras é isolado e pronto para plugar IA.",
  pz_cta:"Quer ver? Me chama", pz_chip_k:"PRESENÇA", pz_chip_v:"Médio",
  nav_cr:"Caverna",
  cr_k:"Caverna de Alexandria, minha marca", cr_t:"Criei uma marca para vender meus infoprodutos. E uma comunidade em volta dela.",
  cr_l:"Em vez de lançar produtos soltos, criei a Caverna de Alexandria: uma marca que reunia meus e-books sob a mesma ideia de estudo, disciplina e crescimento. O plano era juntar, em volta dela, pessoas com a mesma mentalidade.",
  cr_c_tag:"A ideia", cr_c_t:"Mais que um produto: uma marca e uma comunidade.",
  cr_c1_t:"Uma marca, vários produtos", cr_c1:"Todos os infoprodutos saíam com o mesmo nome e a mesma cara. Quem confiava em um já chegava confiando no próximo.",
  cr_c2_t:"Uma mentalidade", cr_c2:"A marca representava um jeito de pensar: estudar, ter disciplina e sair do automático. Quem se identificava, se sentia em casa.",
  cr_c3_t:"Uma comunidade", cr_c3:"O produto era a porta de entrada. O destino era uma comunidade de pessoas com a mesma mentalidade, crescendo juntas.",
  cr_s_tag:"A marca falando", cr_s_t:"Como a marca conversava com quem pensava igual.",
  cr_s1_t:"Gancho que contradiz", cr_s1:"Abre negando o que ele já acredita (“não é a aparência”). A curiosidade segura a leitura nos primeiros segundos.",
  cr_s2_t:"Espelho", cr_s2:"Os quatro rostos mostram como o perfil dele é classificado. Ele se reconhece sem eu precisar acusar ninguém.",
  cr_s3_t:"Contraste visual", cr_s3:"A mesma foto com duas leituras, lado a lado. O olho entende a ideia antes de ler o texto.",
  cr_s4_t:"Dar nome ao inimigo", cr_s4:"“O Perfil Genérico™” transforma uma sensação vaga num conceito com nome, fácil de lembrar e de repetir.",
  cr_s5_t:"Virada sem promessa fácil", cr_s5:"Fecha mudando o jeito de enxergar o problema, sem prometer resultado mágico. Mais confiança, menos cara de golpe.",
  cr_b_tag:"Os produtos", cr_b_t:"Os infoprodutos que eu vendia sob a marca.", cr_b_l:"Toque numa capa para ver de perto. Cada um tem conceito visual próprio, mas todos falam a mesma língua da marca.", cr_pages:"+2 páginas", cr_b4:"31 Lições Estoicas",
  cr_i_tag:"Identidade de marca", cr_i_t:"Uma identidade própria, reconhecível.", cr_i_l:"Paleta 90% escuro e 10% dourado, Playfair com Inter, conceitos de logo, voz da marca e templates de conteúdo. É o que faz tudo ter cara de uma marca só.",
  title:"Guilherme Balestrin | Marketing digital e Administração",
  desc:"Guilherme Balestrin, 19. 4 anos de experiência em marketing digital: tráfego, copy, design e sites. Administração de Empresas no Insper.",
  story:["eu","crio","funis","sites","e","campanhas","que","VENDEM"]
},
en: {
  skip:"Skip to content", nav_work:"Work", nav_about:"About", nav_services:"Services", nav_contact:"Contact", nav_faq:"FAQ",
  tip_still:"Reduce motion",
  h1:"Guilherme Balestrin, 19. 4 years of digital marketing experience, studying Business Administration at Insper.",
  ch1_k:"Hi, I'm", ch1_v:"4 years of digital marketing experience",
  ch2_k:"College", ch2_b:"Business<br>Administration", ch2_v:"Undergraduate, São Paulo",
  ch3_k:"What I do", ch3_b:"Traffic, copy<br>and websites", ch3_v:"From the ad to the sales page",
  hint_drag:"Drag to look around", stp1:"TikTok Studio", stp2:"Amazon Associates", cta1:"See my work", cta2:"Talk to me", hint_scroll:"Scroll to change channel", rail:["Hello","College","Skills"],
  hit_msg:"Please do not hit it.",
  story_sr:"I create funnels, websites and campaigns that sell",
  work_h:"Work",
  p1_t:"Dropshipping", p1_l:"It all started in 2022, with an online store. It took 1 year to get my first sale. Along the way, a TikTok video passed 2.3 million views.", p1_k:"E-commerce and organic traffic",
  p2_t:"Info products", p2_l:"Then I built my own product, set up the whole operation and started selling with paid ads.", p2_k:"Digital product, funnel and paid traffic",
  p3_t:"Meta and TikTok Ads", p3_l:"Campaigns on Meta Ads and TikTok Ads: audience targeting, A/B testing and budget optimization to bring in the right customer.", p3_k:"Meta Ads, TikTok Ads and paid traffic",
  tabs_drop:["Viral video","TikTok","Shopify","Amazon","Sales"], tabs_info:["Sales","E-books"], tabs_meta:["Audiences","Budget"],
  sub_drop:["views. The school bottle video, the product I was selling.","new followers and 132K likes on the same video (TikTok Studio).","sessions in one week on the Shopify store, with R$161.49 in sales, 3 orders.","conversion on affiliate links: 38 clicks, 6 orders, R$169.72.","a sale paid by credit card (Yampi) + a Reel with 5K likes."], big_drop:["2.3M","+3,375","944","15.79%","R$155.96"],
  sub_info:["real Approved Sale and Pix Generated notifications from Kiwify.","covers and pages of the e-books I sold. My design and my copy."], big_info:["Kiwify","E‑books"], sub_meta:["Targeting to reach the people who buy","Budget optimized from the metrics"],
  nav_jn:"My story", jn_k:"Off the clock", jn_t:"Repeat until you're good.",
  jn_l:"Almost everything I do well came from the same rule: do the same thing again and again while everyone else quits.",
  jn1_t:"I almost went pro in CS2.",
  jn1_p1:"I played over 3,000 hours of CS2. I watched myself improve up close, and I was good at it. That's where I learned talent isn't a gift: it comes from repeating the same thing many times while everyone else is giving up.",
  jn1_p2:"That's why I believe that in anything I put enough energy and time into, I can get there. Same math in business: it took 1 year to my first sale and I kept going.",
  jn1_big:"3,000+", jn1_bigl:"hours of CS2", jn1_yt:"Some of my videos on YouTube",
  jn2_t:"I'm not ashamed to show up.",
  jn2_p1:"I made content on my personal profile, in front of the camera. One of the series was “From Zero to a Million”, where I showed the day to day of building my store: ads, copy, workouts, studying and devotional time.",
  jn2_p2:"If you sell to people, you need to be comfortable being seen by people. Recording, getting it wrong in public and keeping going is part of the training.",
  jn2_cap:"Day 5 of the “From Zero to a Million” series, on my personal profile. Tap to hear it.",
  jn3_t:"I like a challenge. Right now it's Russian.",
  jn3_p1:"I'm studying Russian and I'm already past zero: I'm at a basic level now. New alphabet, new sounds. I picked it precisely because it's hard.",
  jn3_p2:"Same rule as always. There's no shortcut, only repetition until it flows.",
  jn3_ru:"privet = hi", jn3_rul:"Studying Russian right now",
  jn4_t:"I read to understand people.", jn4_p:"I like reading about neuroscience, psychology and philosophy. I want to understand how people think, feel and decide, because every good business starts there.",
  jn4_c1:"Neuroscience", jn4_c2:"Psychology", jn4_c3:"Philosophy",
  jn5_t:"I'm a Christian.", jn5_p:"My faith shows in how I act and work. In my videos, devotional time was part of the day, right alongside the work.",
  xp_k:"Hands-on experience", xp_t:"What I've actually done.", xp_l:"From the ad to the funnel, always on my own projects and with results you can check.",
  xp1_tag:"Own project", xp1_t:"Founder and operator of a dropshipping e‑commerce", xp1_d:"I built and managed the whole store, from marketing to sales.",
  xp1_b1:"Meta Ads and TikTok Ads campaigns: audience targeting, A/B testing and budget optimization.",
  xp1_b2:"Organic content built for conversion, with a video that passed 2.3 million views on TikTok.",
  xp1_b3:"Micro-influencer partnerships: finding profiles, briefing and following the deliveries.",
  xp1_b5:"Result: over 20 sales and a product validated in the market.",
  xp2_tag:"Own project · Caverna de Alexandria", xp2_t:"Founder · Brand and community", xp2_d:"I built my own brand to sell my info products in education and personal development.",
  xp2_b1:"Branding: name, identity and message designed so all my info products could sell under one brand, with more trust.",
  xp2_b2:"The idea was to go beyond the product: build a community around the brand, bringing together people with the same mindset of study, discipline and growth.",
  xp2_b3:"Social content, sales funnels, copy and Typebot automations to attract that audience and turn followers into customers.",
  xp3_tag:"One-off experience", xp3_t:"Digital affiliate", xp3_d:"Info product platforms.",
  xp3_b1:"I worked as an affiliate to validate traffic strategies, then moved on to building my own brand.",
  xp_tools:"Tools", xp_lang:"Languages", xp_l1:"Portuguese (native)", xp_l2:"English (fluent)", xp_l3:"Russian (basic)",
  jn1_evo:"progress, hour after hour", awp_fire:"Click to fire", jn5_cap:"My devotional time, in one of the videos.",
  xp_s1:"sales", xp_s2:"views on one video", xp_s3:"product validated",
  sv_a:"Everything I", sv_b:"do.", sv_lede:"From the first ad to the live site, I take care of the customer's whole path.",
  s1_n:"Traffic", s1_l:"Paid and organic, from test to scale.", s1_1:"Meta Ads and TikTok Ads", s1_2:"A/B tests", s1_3:"Organic content", s1_4:"Metrics analysis",
  s2_n:"Copy & persuasion", s2_l:"Words that lead to a decision.", s2_1:"Copywriting", s2_2:"Sales pages", s2_3:"Ads", s2_4:"Applied psychology",
  s3_n:"Design & sites", s3_l:"Clear visuals, a site that converts.", s3_1:"Sites and apps", s3_2:"Landing pages", s3_3:"Branding", s3_4:"Identity",
  s4_n:"Funnels & product", s4_l:"From idea to a running operation.", s4_1:"Info products", s4_2:"Funnels and customer journey", s4_3:"Automation with Typebot", s4_4:"Influencer partnerships",
  bf_t:"Let's talk", bf_l:"Got an opportunity in digital marketing, traffic or content? Tell me here. I'll write back.", bf_name:"Name", bf_email:"Email", bf_need:"What do you need?",
  pill_site:"Website", pill_traffic:"Traffic", pill_copy:"Copy", pill_funnel:"Funnel", pill_other:"Other", bf_about:"Tell me more", bf_send:"Fold & send", pill_cr:"Branding", bf_co:"Company", bf_opt:"Optional", bf_kind:"Type of opportunity", kind_1:"Internship", kind_2:"Freelance", kind_3:"Project", kind_4:"Partnership", bf_sent:"It's in the box.", bf_sent_n:"I opened your email app with the message ready. Just hit send.", bf_again:"Write another",
  bf_err:"Please add your name and a valid email.", bf_ok:"Opening your email app…", bf_subject:"Contact from portfolio", bf_body_need:"I need",
  rg_ask:"My proposal", rg_say:"Open to opportunities aligned with what I like and have done.", rg_book:"Remote or hybrid, São Paulo",
  fq_t:"Questions, answered.",
  q1:"Who are you?", a1:"Guilherme, 19. I started in digital marketing in 2022 with dropshipping, then moved on to info products. Today I study Business Administration at Insper.",
  q2:"What have you done?", a2:"I built and ran a dropshipping store from scratch, with Meta Ads and TikTok Ads campaigns and micro-influencer partnerships, and passed 20 sales. Then I created Caverna de Alexandria, a brand to sell my info products and bring together a community of like-minded people. I also made content on my personal profile.",
  q3:"What else are you into?", a3:"Leadership, people management, body language and sales psychology. Every business depends on understanding how people decide.",
  q4:"How do we start?", a4:"Fill in the form above or email me. I'll write back.",
  ft_say:"Digital marketing and<br>Business Administration.", ft_top:"Back to top ↑", copied:"Copied",
  stk:{app_in:"IN.",app_swap:"InsperSwap",app_pz:"Presenza",traffic:"Paid traffic",copy:"Copywriting",design:"Design",meta:"Meta Ads",funnel:"Funnels",persuasion:"Persuasion",leader:"Leadership",body:"Body language",psych:"Sales psychology",insper:"Insper",y2022:"4 years of experience",organic:"Organic traffic"},
  tip_help:"Keys & gestures",
  mq_t:"Platforms I've worked on",
  st_t:"Real numbers.", st_l:"Screenshots and metrics from my own operations. No makeup.",
  st1:"views on a single TikTok video", st1s:"May 2023, dropshipping",
  st2:"likes on the same video", st2s:"A product I was selling",
  st3:"new followers from it", st3s:"TikTok Studio data",
  st4:"conversion on affiliate links", st4s:"Amazon Associates: 38 clicks, 6 orders",
  hp_t:"Keys & gestures", hp_keys:"Single-key shortcuts", hp_close:"Close",
  hp_rows:[["Drag","Look around (or move the stickers)"],["3 clicks on the TV","Please don't."],["1 – 3","Switch channel"],["L","Language PT / EN"],["M","Reduce motion"],["?","This help"],["Shift + scroll","Pan the world sideways"]],
  ab_k:"About me", ab_t:"Hi, I'm Guilherme.",
  ab_c1:"19 y/o", ab_c2:"4 years of experience", ab_c3:"Business Administration",
  ab_p1:"I'm 19 and started in digital marketing in 2022. First with dropshipping, where it took 1 year to get my first sale, then info products. I learned by doing: paid and organic traffic, copy, design, persuasion, content and Meta Ads.",
  ab_p2:"In one of those projects I built a product from scratch, set up the operation and sold it with paid ads. That's how I started seeing the whole funnel and the customer journey.",
  ab_p3:"Today I study Business Administration at Insper and I like a challenge: I'm studying Russian, I read about neuroscience, psychology and philosophy, and I follow a simple rule, repeat until I'm good. What pulls me most is leadership, people management, body language and sales psychology, because every good business starts with understanding people. I'm a Christian, and that shows in how I act and work.",
  ab_f1:"Business Administration", ab_f2:"Junior consulting company",
  ij_k:"Experience", ij_t:"Real consulting, at Insper Jr.",
  ij_l:"In college I joined Insper Jr, Insper's junior consulting company. There I lived, hands-on, the 4 scopes of a consulting project.",
  ij1_t:"Market", ij1_d:"Understand the market, competitors and audience before any decision.",
  ij2_t:"Operations", ij2_d:"Map processes, find bottlenecks and organize how the work gets done.",
  ij3_t:"Marketing", ij3_d:"Positioning, brand and how the business reaches the customer.",
  ij4_t:"Finance", ij4_d:"Costs, projections and viability: what makes the numbers work.",
  ij_gt:"What it added", ij_g:"I came from digital marketing, looking at the ad and the funnel. Consulting showed me the rest of the map. Now I see the whole business (market, operations, marketing and numbers) and how each part moves the others.",
  ij_st:"Skills I gained", ij_chips:["Strategic thinking","Market analysis","Process design","Financial viability","Client communication","Teamwork","Project management","Presenting results"],
  kf_k:"Event", kf_t:"Kiwify Festival 2023.", kf_l:"I went to Brazil's biggest info-product event and saw up close how people who sell online think, sell and scale.", kf_c1:"At the Kiwify stage", kf_c2:"Packed crowd, green stage", nav_kf:"Kiwify Festival",
  nav_projects:"Projects", ab_gt:"A little more of me", g1:"Office is wherever it works.", g2:"When it calls for a suit.", g3:"College routine.",
  vn_k:"Side projects", vn_t:"Ideas that become products.",
  vn_l:"Beyond marketing and college, I like to take an idea, design the solution and put it live. These are projects I built on my own.",
  in_s:"Current project, in the making",
  in_l:"A closed social network for people who study at Insper: what's happening on campus, only for those inside. It currently has an open waitlist.",
  in_f1:"Anonymous Spotted", in_f2:"Parties & tickets", in_f3:"Rides", in_f4:"Class questions", in_f5:"Who lives nearby", in_f6:"Cafeteria queue",
  in_n:"Sign-in with your Insper email only, no password.", in_cta:"See IN.",
  sw_s:"Live, independent project",
  sw_l:"A platform that brings together students who want to swap classes and finds the best matches: direct, group or cycle, to help as many people as possible.",
  sw_1:"Enter semester, course, current class and where you want to go.", sw_2:"The algorithm finds the best match: direct, group or cycle.", sw_3:"Track the status and arrange the swap with whoever matched.",
  sw_n:"A student project, non-profit and with no official link to Insper.", sw_cta:"See InsperSwap",
  sw_c1:"Direct match", sw_c2:"Group", sw_c3:"Cycle",
  pz_s:"MVP com web app e API",
  pz_l:"A digital menswear look consultant. The thesis: people judge you in seconds, and your clothes shape that judgment. The app shows how each look will be perceived and lets you build yours, piece by piece.",
  pz_f1:"Digital wardrobe", pz_f2:"6 occasions", pz_f3:"6 styles", pz_f4:"Presence & impact level", pz_f5:"Analysis & Build modes", pz_f6:"How you'll be perceived",
  pz_n:"I also created the visual identity (Onyx, Antique Gold and Ivory) and the code manual. The rule-based recommendation engine is isolated and ready to plug in AI.",
  pz_cta:"Want to see it? Message me", pz_chip_k:"PRESENCE", pz_chip_v:"Medium",
  nav_cr:"Caverna",
  cr_k:"Caverna de Alexandria, my brand", cr_t:"I built a brand to sell my info products. And a community around it.",
  cr_l:"Instead of launching loose products, I created Caverna de Alexandria: a brand that brought my e-books together under one idea of study, discipline and growth. The plan was to gather people with the same mindset around it.",
  cr_c_tag:"The idea", cr_c_t:"More than a product: a brand and a community.",
  cr_c1_t:"One brand, many products", cr_c1:"Every info product came out with the same name and look. Whoever trusted one already trusted the next.",
  cr_c2_t:"A mindset", cr_c2:"The brand stood for a way of thinking: study, discipline and getting out of autopilot. Whoever related to it felt at home.",
  cr_c3_t:"A community", cr_c3:"The product was the way in. The goal was a community of like-minded people, growing together.",
  cr_s_tag:"The brand speaking", cr_s_t:"How the brand talked to people who thought alike.",
  cr_s1_t:"A hook that contradicts", cr_s1:"It opens by denying what he already believes (“it's not your looks”). Curiosity holds the read in the first seconds.",
  cr_s2_t:"Mirror", cr_s2:"The four faces show how his profile gets classified. He recognizes himself without me accusing anyone.",
  cr_s3_t:"Visual contrast", cr_s3:"The same photo with two readings, side by side. The eye gets the idea before reading the text.",
  cr_s4_t:"Name the enemy", cr_s4:"“The Generic Profile™” turns a vague feeling into a named concept, easy to remember and repeat.",
  cr_s5_t:"A turn without easy promises", cr_s5:"It closes by changing how he sees the problem, with no magic result promised. More trust, less scam vibe.",
  cr_b_tag:"The products", cr_b_t:"The info products I sold under the brand.", cr_b_l:"Tap a cover to see it up close. Each has its own visual concept, but they all speak the brand's language.", cr_pages:"+2 pages", cr_b4:"31 Stoic Lessons",
  cr_i_tag:"Brand identity", cr_i_t:"Its own identity, easy to recognize.", cr_i_l:"A 90% dark and 10% gold palette, Playfair with Inter, logo concepts, brand voice and content templates. It's what makes everything look like one brand.",
  title:"Guilherme Balestrin | Digital marketing and Business Administration",
  desc:"Guilherme Balestrin, 19. 4 years of digital marketing experience: traffic, copy, design and websites. Business Administration at Insper.",
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
const track = $("#heroTrack"), rail = $("#rail");

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
  if (rail.children.length) paintRail();
  if (flash && !root.dataset.still) { tv.classList.remove("is-flicker"); void tv.offsetWidth; tv.classList.add("is-flicker"); }
  syncChVideo();
}
setCh(0, false);
/* o scroll troca de canal: o hero fica fixo (sticky) dentro de uma pista alta */
const trackRange = () => Math.max(1, track.offsetHeight - hero.offsetHeight);
function goCh(i) {
  i = (i + NCH) % NCH;
  const top = track.getBoundingClientRect().top + scrollY;
  scrollTo({ top: top + (i + .5) / NCH * trackRange() });
}
function buildRail() {
  rail.textContent = "";
  T[lang].rail.forEach((name, i) => {
    const b = mk("button", "rail-i"); b.type = "button"; b.dataset.i = i;
    b.setAttribute("aria-label", "CH 0" + (i + 1) + ", " + name);
    b.append(mk("b", "", "0" + (i + 1)), mk("span", "", name));
    b.addEventListener("click", e => { e.stopPropagation(); goCh(i); });
    b.addEventListener("pointerdown", e => e.stopPropagation());
    rail.appendChild(b);
  });
  paintRail();
}
function paintRail() { [...rail.children].forEach((b, i) => { b.classList.toggle("on", i === chIdx); if (i === chIdx) b.setAttribute("aria-current", "true"); else b.removeAttribute("aria-current"); }); }
function chFromScroll() {
  const p = clamp01(-track.getBoundingClientRect().top / trackRange());
  hero.classList.toggle("scrolled", p > .015);
  const i = Math.min(NCH - 1, Math.floor(p * NCH));
  if (i !== chIdx && !rolling) setCh(i);
}
const knob = $(".tv-knob");
if (knob) { knob.style.pointerEvents = "auto"; knob.style.cursor = "pointer"; knob.setAttribute("role", "button"); knob.setAttribute("tabindex", "0"); knob.setAttribute("aria-label", "Channel");
  knob.addEventListener("click", e => { e.stopPropagation(); goCh(chIdx + 1); });
  knob.addEventListener("keydown", e => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); goCh(chIdx + 1); } });
  knob.addEventListener("pointerdown", e => e.stopPropagation()); }

/* stickers (arrastáveis, com inércia) */
const STK = [
  { k:"traffic", fx:.2, fy:.27, r:-5, c:"" },     { k:"copy", fx:.8, fy:.26, r:4, c:"alt" },
  { k:"design", fx:.84, fy:.6, r:-3, c:"ink" },   { k:"meta", fx:.16, fy:.58, r:3, c:"alt" },
  { k:"funnel", fx:.27, fy:.82, r:-3, c:"" },     { k:"persuasion", fx:.73, fy:.82, r:3, c:"ink" },
  { k:"insper", fx:.35, fy:.13, r:-3, c:"" },     { k:"y2022", fx:.65, fy:.13, r:3, c:"alt" },
];
const ICO = {
  traffic:'<path d="m3 11 18-5v12L3 14v-3z"/><path d="M11.6 16.8a3 3 0 1 1-5.8-1.6"/>',
  copy:'<path d="M12 20h9"/><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z"/>',
  design:'<path d="m12 19 7-7 3 3-7 7-3-3z"/><path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="m2 2 7.6 7.6"/><circle cx="11" cy="11" r="2"/>',
  meta:'<path d="M2 12c0-3 2-6 4.5-6C9 6 11 12 12 12s3-6 5.5-6C20 6 22 9 22 12s-2 6-4.5 6C15 18 13 12 12 12s-3 6-5.5 6C4 18 2 15 2 12z"/>',
  funnel:'<path d="M22 3H2l8 9.46V19l4 2v-8.54L22 3z"/>',
  persuasion:'<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/>',
  body:'<circle cx="12" cy="4" r="2"/><path d="m5 8 7 1 7-1M12 9v5m0 0-3 7m3-7 3 7"/>',
  psych:'<path d="M15 14c.2-1 .7-1.7 1.5-2.5 1-.9 1.5-2.2 1.5-3.5A6 6 0 0 0 6 8c0 1 .2 2.2 1.5 3.5.7.7 1.3 1.5 1.5 2.5"/><path d="M9 18h6M10 22h4"/>',
  leader:'<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>',
  insper:'<path d="M22 10 12 5 2 10l10 5 10-5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>',
  y2022:'<rect width="18" height="18" x="3" y="4" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',
  organic:'<path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"/><path d="M2 21c0-3 1.85-5.36 5.08-6"/>',
  app_in:'<path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.07-2.14-.22-4.05 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.15.43-2.3 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>',
  app_swap:'<path d="M8 3 4 7l4 4M4 7h16M16 21l4-4-4-4M20 17H4"/>',
  app_pz:'<path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"/><path d="M3 6h18M16 10a4 4 0 0 1-8 0"/>'
};
const SVGNS = "http://www.w3.org/2000/svg";
const stickersEl = $("#stickers");
const stickers = STK.map(s => {
  const el = mk("div", "sticker " + s.c); el.setAttribute("role", "note");
  if (!s.img) { const sv = document.createElementNS(SVGNS, "svg"); sv.setAttribute("viewBox", "0 0 24 24"); sv.setAttribute("class", "stk-ico"); sv.setAttribute("aria-hidden", "true"); sv.innerHTML = ICO[s.k] || ""; el.append(sv, mk("span", "stk-t")); }
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
/* no celular, empurra os stickers para fora da faixa onde fica a TV */
function stkY(fy) { return vw < 700 && fy > .18 && fy < .82 ? (fy < .5 ? fy * .45 : 1 - (1 - fy) * .45) : fy; }
const MOB = { traffic:[.28,.15], copy:[.72,.23], design:[.72,.73], meta:[.28,.81] };
function layoutStickers() { stickers.forEach(o => { const m = vw < 700; const mp = MOB[o.k]; o.el.style.display = m && !mp ? "none" : ""; o.x = (m && mp ? mp[0] : o.fx) * vw; o.y = (m && mp ? mp[1] : stkY(o.fy)) * vh; o.vx = o.vy = 0; paintSticker(o); }); }

/* pan (arrastar para olhar em volta) */
function bounds() { return { x: vw * .38, y: vh * .32 }; }
function paintWorld() {
  layers.forEach(l => { l.el.style.transform = `translate3d(${pan.x * l.d}px,${pan.y * l.d}px,0)`; });
}
function hideHint() { if (!draghint.classList.contains("gone")) { draghint.classList.add("gone"); store.set("gb-hint", "1"); } }
if (store.get("gb-hint")) draghint.classList.add("gone");
hero.addEventListener("pointerdown", e => {
  if (e.target.closest(".dock") || e.target.closest(".sticker") || e.target.closest(".rail") || e.target.closest(".hero-cta")) return;
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
const smEls = $$(".sm");
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
  smEls.forEach(el => { const e = still ? 1 : clamp01((Tt - parseFloat(el.dataset.at)) / .9), k = easeOut(e); el.style.opacity = k * (1 - o * .8); el.style.transform = `translateY(${(1 - k) * 44}px) rotate(var(--r)) scale(${.82 + .18 * k})`; });
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
    { g:"linear-gradient(135deg,#1a1408,#6b5220)", src:"assets/cr-7erros.webp", ar:"700/1049" }
  ] },
  meta: { items: [
    { g:"linear-gradient(135deg,#7b2ff7,#f107a3)", mock:"funnel" },
    { g:"linear-gradient(135deg,#ff9500,#ff3b30)", mock:"bars" }
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
      sc.setAttribute("role", "img"); sc.setAttribute("aria-label", n + ": " + (bigs[i] || "") + " " + subs[i]);
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
  let k = 0;
  txt.split(" ").forEach((word, wi, arr) => {
    const w = mk("span", "tw"); w.setAttribute("aria-hidden", "true");
    [...word].forEach(c => { const s = mk("span", "tc", c); s.style.setProperty("--k", k++); w.appendChild(s); });
    el.appendChild(w); if (wi < arr.length - 1) { el.appendChild(document.createTextNode(" ")); k++; }
  });
  if (root.dataset.still) el.classList.add("in"); else io.unobserve(el), io.observe(el);
}

/* FAQ */
$$(".fq-q button").forEach(btn => btn.addEventListener("click", () => {
  const item = btn.closest(".fq-item"), open = !item.classList.contains("open");
  item.classList.toggle("open", open); btn.setAttribute("aria-expanded", open);
}));

/* form: folha → envelope → caixa de correio (estilo wowww.art) → mailto */
const bf = $("#bf"), bfNote = $("#bf-note"), bfSent = $("#bf-sent"), bfLayout = $(".bf-layout"), mb = $("#mb");
new IntersectionObserver(([en], ob) => { if (en.isIntersecting) { bfLayout.dataset.seen = ""; ob.disconnect(); } }, { threshold: .15 }).observe(bfLayout);
const ENV_SVG = '<svg viewBox="0 0 150 96"><rect x=".75" y=".75" width="148.5" height="94.5" rx="7" fill="#fff" stroke="#d9d9de" stroke-width="1.5"/><path d="M1 94 63 46M149 94 87 46" stroke="#e3e3e8" stroke-width="1.5" fill="none"/><rect x="114" y="12" width="22" height="26" rx="3" fill="#dfcd2e"/><path d="M129 21a5 5 0 1 0 0 8v-3h-3" fill="none" stroke="#000" stroke-width="2" stroke-linecap="round"/><path class="flap" d="M1 1 75 54 149 1Z" fill="#f5f5f7" stroke="#d9d9de" stroke-width="1.5" stroke-linejoin="round"/></svg>';
const wait = ms => new Promise(r => setTimeout(r, ms));
function bfFly() {
  return new Promise(async done => {
    const fr = bf.getBoundingClientRect(), sl = $(".mb-slot", mb).getBoundingClientRect();
    const slotOnScreen = sl.top > 0 && sl.bottom < innerHeight && sl.width > 0;
    if (root.dataset.still || reduceMQ.matches || !slotOnScreen) { bf.dataset.phase = "send"; await wait(260); return done(); }
    const env = mk("div", "bf-env"); env.innerHTML = ENV_SVG; document.body.appendChild(env);
    const x0 = fr.left + fr.width / 2 - 75, y0 = Math.min(Math.max(fr.top + fr.height / 2, 140), innerHeight - 140) - 48;
    const s1 = sl.width / 150, x1 = sl.left + sl.width / 2 - 75, y1 = sl.top + sl.height / 2 - 48;
    const at = (x, y, s, r) => `translate(${x}px,${y}px) rotate(${r}deg) scale(${s})`;
    bf.dataset.phase = "send";
    await env.animate([{ transform: at(x0, y0 + 40, 1.9, 0), opacity: 0 }, { transform: at(x0, y0, 1, 0), opacity: 1 }], { duration: 420, easing: "cubic-bezier(.22,1,.36,1)", fill: "forwards" }).finished;
    env.dataset.closed = ""; await wait(360);
    const mx = (x0 + x1) / 2, my = Math.min(y0, y1) - Math.min(160, innerHeight * .18);
    await env.animate([
      { transform: at(x0, y0, 1, 0) },
      { transform: at(mx, my, .78, -14), offset: .5 },
      { transform: at(x1, y1 - 40, s1 * 1.05, -2), offset: .82 },
      { transform: at(x1, y1 - 6, s1, 0), opacity: 1, offset: .9 },
      { transform: at(x1, y1 + 4, s1 * .95, 0), opacity: 0 }
    ], { duration: 1150, easing: "cubic-bezier(.45,0,.25,1)", fill: "forwards" }).finished;
    env.remove(); done();
  });
}
async function bfSend(e) {
  e.preventDefault();
  const f = new FormData(bf);
  if (f.get("website")) return;
  const name = (f.get("name") || "").trim(), mail = (f.get("email") || "").trim();
  if (!name || !/^\S+@\S+\.\S+$/.test(mail)) {
    bfNote.textContent = T[lang].bf_err; bfNote.className = "bf-note err";
    const btn = $(".bf-send", bf); btn.classList.remove("bf-shake"); void btn.offsetWidth; btn.classList.add("bf-shake");
    return;
  }
  bfNote.textContent = ""; bfNote.className = "bf-note";
  const what = f.getAll("what").join(", "), kind = f.get("kind") || "", co = (f.get("company") || "").trim(), about = (f.get("about") || "").trim();
  const body = `${name} <${mail}>${co ? "\n" + co : ""}\n${kind ? T[lang].bf_kind + ": " + kind + "\n" : ""}${what ? T[lang].bf_body_need + ": " + what + "\n" : ""}\n${about}`;
  await bfFly();
  mb.dataset.flag = ""; mb.classList.remove("bump"); void mb.offsetWidth; mb.classList.add("bump");
  bfSent.inert = false; bf.inert = true; bfSent.dataset.in = "";
  setTimeout(() => $("#bf-again").focus({ preventScroll: true }), 700);
  location.href = `mailto:${CONFIG.email}?subject=${encodeURIComponent(T[lang].bf_subject)}&body=${encodeURIComponent(body)}`;
}
bf.addEventListener("submit", bfSend);
$("#bf-again").addEventListener("click", () => {
  bf.reset(); delete bfSent.dataset.in; bfSent.inert = true; bf.inert = false;
  delete mb.dataset.flag; bf.dataset.phase = "edit";
  setTimeout(() => $(".bf-input", bf).focus({ preventScroll: true }), 300);
});
function splitBf() {
  const h = $("#bf-title"); if (!h) return;
  const words = h.textContent.trim().split(/\s+/);
  h.setAttribute("aria-label", words.join(" "));
  h.innerHTML = words.map((w, i) => `<span class="w" aria-hidden="true" style="--w:${i}"><span>${w}</span></span>`).join(" ");
}

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
  splitBf();
  document.title = T[l].title; $('meta[name="description"]').setAttribute("content", T[l].desc);
  stickers.forEach(o => { if (!o.img) o.el.querySelector(".stk-t").textContent = T[l].stk[o.k]; });
  buildRail();
  $("#mail-t").textContent = CONFIG.email; mailBtn.dataset.copied = T[l].copied;
  $("#btn-still").setAttribute("aria-label", T[l].tip_still);
  buildWork(); splitCTA(); buildStory();
  buildHelp(); setCounters(false); buildChips();
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
  else if (/^[1-9]$/.test(k) && +k <= NCH) goCh(+k - 1);
});

/* hero some/escala ao rolar + dock adaptativo */
const sheet = $(".sheet"), footer = $(".ft");
function heroScroll() {
  const y = scrollY;
  $("#progress").style.transform = `scaleX(${clamp01(y / Math.max(1, document.documentElement.scrollHeight - vh))})`;
  chFromScroll();
  const st = sheet.getBoundingClientRect().top, ft = footer.getBoundingClientRect().top;
  document.body.classList.toggle("on-light", st < 40 && ft > 40);
}
addEventListener("scroll", heroScroll, { passive: true });
addEventListener("resize", () => { vw = innerWidth; vh = innerHeight; layoutStickers(); layoutStory(); heroScroll(); });

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


/* vídeo do "Do Zero ao Milhão": só carrega/toca quando está na tela */
const zv = $("#zvid");
if (zv) {
  const zsync = on => { if (on) { if (!zv.getAttribute("src")) zv.src = zv.dataset.src; if (!root.dataset.still && !document.hidden) zv.play().catch(() => {}); } else zv.pause(); };
  new IntersectionObserver(([en]) => zsync(en.isIntersecting), { threshold: .5 }).observe(zv);
}
/* chips de skills + reveals genéricos (.rv) */
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
/* ============================================================
   7) CAVERNA: lightbox das imagens
   ============================================================ */
const lb = $("#lb"), lbIn = $("#lb-in");
$$("[data-lb]").forEach(b => b.addEventListener("click", () => {
  lbIn.textContent = "";
  const alt = ($("img", b) || {}).alt || "";
  b.dataset.lb.split("|").forEach(src => { const im = mk("img"); im.src = src; im.alt = alt; im.decoding = "async"; lbIn.appendChild(im); });
  lbIn.scrollTop = 0; lb.showModal(); root.classList.add("lb-open");
}));
$("#lb-x").addEventListener("click", () => lb.close());
lb.addEventListener("click", e => { if (e.target === lb || e.target === lbIn) lb.close(); });
lb.addEventListener("close", () => root.classList.remove("lb-open"));

setLang(lang);
layoutStickers(); paintWorld(); heroScroll();
requestAnimationFrame(heroTick); requestAnimationFrame(storyTick);
if (document.fonts && document.fonts.ready) document.fonts.ready.then(() => { layoutStory(); renderStory(true); });
})();
