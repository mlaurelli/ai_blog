'use client';

import Layout from '@/components/Layout';
import { useLanguage } from '@/contexts/LanguageContext';

export default function AboutClient() {
  const { language } = useLanguage();

  if (language === 'it') {
    return (
      <Layout title="Chi Sono - Michele Laurelli | AI Blog">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8 pb-6 border-b-2 border-black dark:border-gray-600">
            <span className="text-xs uppercase tracking-widest font-semibold text-gray-500 dark:text-gray-400 border-b border-gray-400 dark:border-gray-600 pb-1 inline-block mb-4">
              Chi Sono
            </span>
            <h1 className="text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4 leading-tight">Michele Laurelli</h1>
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">AI Architect · Ricercatore · Builder</p>
            <p className="text-sm italic text-gray-600 dark:text-gray-400">Fondatore di Algoretico</p>
          </div>
          
          <div className="columns-1 md:columns-2 gap-8 text-justify">
            <p className="text-gray-700 dark:text-gray-300 mb-6 dropcap">
              Costruisco sistemi di intelligenza artificiale da zero. Non chatbot. Non wrapper. Non integrazioni. Architetture complete—reti neurali, 
              pipeline di training, motori di inferenza, agenti autonomi—progettate per organizzazioni che necessitano controllo assoluto sulla propria infrastruttura AI. 
              Il mio lavoro spazia dal controllo della fusione nucleare, all'automazione industriale, all'imaging medico, ai sistemi enterprise che non possono permettersi 
              di dipendere da API esterne o cedere la propria proprietà intellettuale a provider cloud.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4 break-after-avoid">Algoretico — Costruire Sistemi che Contano</h2>
            <p className="text-gray-700 mb-6">
              Dalla fondazione di Algoretico nel 2018, ho sviluppato architetture AI che risolvono problemi reali in ambienti esigenti. Le nostre innovazioni includono:
            </p>

            <p className="text-gray-700 mb-2">
              <strong>Talents</strong> — Un concetto rivoluzionario che introduce layer neurali persistenti che modellano come i modelli AI apprendono, si specializzano ed eccellono in domini specifici
            </p>

            <p className="text-gray-700 mb-2">
              <strong>Maestro</strong> — La prima architettura brevettata in Europa per l'orchestrazione di agenti AI autonomi
            </p>

            <p className="text-gray-700 mb-2">
              <strong>You Need No Data</strong> — Un framework per il training AI auto-supervisionato che permette di addestrare modelli AI con dati minimi o nulli
            </p>

            <p className="text-gray-700 mb-6">
              <strong>SPaaS</strong> — Software Production as a Service, che trasforma il modo in cui le organizzazioni costruiscono software attraverso l'automazione guidata dall'AI
            </p>

            <p className="text-gray-700 mb-6">
              Questi non sono concetti. Sono sistemi deployati: controllano reattori a fusione protone-boro con precisione al millisecondo, diagnosticano patologie 
              in scansioni mediche, orchestrano workflow industriali nella produzione dell'acciaio, e alimentano sistemi RAG enterprise con conoscenza proprietaria 
              che non lascia mai l'infrastruttura dell'organizzazione.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4 break-after-avoid">Ricerca alla Frontiera</h2>
            <p className="text-gray-700 mb-6">
              La mia ricerca esplora i confini tra possibilità teorica e realtà ingegneristica. Ho pubblicato lavori sul controllo autonomo per 
              la fusione nucleare, cancellazione di concetti conforme al GDPR in large language model, adaptive meta-domain transfer learning, e nuovi paradigmi 
              di training che sfidano le assunzioni convenzionali su ciò che le reti neurali richiedono per apprendere.
            </p>

            <p className="text-gray-700 mb-6">
              Progetti come PoAItry (la prima rete neurale di poesia italiana), DNART.io (arte AI da sequenze del genoma umano), e sistemi per 
              il riconoscimento delle emozioni e la fusione di sensori industriali dimostrano che la ricerca AI seria non richiede di scegliere tra profondità tecnica 
              ed esplorazione creativa.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4 break-after-avoid">Insegnare alla Prossima Generazione</h2>
            <p className="text-gray-700 mb-4">
              Insegno Machine Learning, Deep Learning e Natural Language Processing in tre università in Italia:
            </p>

            <p className="text-gray-700 mb-1">
              • Università Vita-Salute San Raffaele (Milano)
            </p>
            <p className="text-gray-700 mb-1">
              • Istituto Italiano di Criminologia (Vibo Valentia)
            </p>
            <p className="text-gray-700 mb-6">
              • Università Europea di Roma (Roma)
            </p>

            <p className="text-gray-700 mb-6">
              Il mio approccio combina rigore matematico con design pratico di sistemi. Gli studenti imparano ad architettare reti neurali, non solo ad importarle. 
              Capiscono la backpropagation implementandola, non guardando video. L'obiettivo non è creare utenti AI—è creare costruttori AI.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4 break-after-avoid">Attività di Advisory</h2>
            <p className="text-gray-700 mb-6">
              Fornisco consulenza a organizzazioni all'intersezione tra AI, energia e trasformazione industriale: l'European Fusion Association sull'integrazione AI 
              nella ricerca sulla fusione, Lagiste23 come CTO valutando investimenti tecnologici ad alto impatto, e Institut EuropIA su iniziative europee di etica e innovazione AI. 
              Il lavoro comporta tradurre capacità AI di frontiera in sistemi pratici che operano in ambienti regolamentati e ad alto rischio.
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4 break-after-avoid">Libri</h2>
            <p className="text-gray-700 mb-6">
              Ho scritto tre libri che esplorano l'AI da diverse prospettive—fondamenti tecnici, implicazioni sociali e applicazioni creative:
            </p>

            <p className="text-gray-700 mb-1">
              • <em>Alchimia</em> (2024) — Su AI, creatività e trasformazione
            </p>
            <p className="text-gray-700 mb-1">
              • <em>Intelligenza Artificiale e Criminologia</em> (2023) — AI nella criminologia e nei sistemi giudiziari
            </p>
            <p className="text-gray-700 mb-6">
              • <em>La Matematica dell'Intelligenza Artificiale</em> (2023) — Fondamenti matematici dell'AI
            </p>
            
            <h2 className="text-2xl font-bold mt-8 mb-4 break-after-avoid">Contatti</h2>
            <p className="text-gray-700 mb-2">
              <strong>Email:</strong> <a href="mailto:ciao@michelelaurelli.it" className="underline hover:text-black dark:hover:text-white">ciao@michelelaurelli.it</a>
            </p>
            <p className="text-gray-700 mb-6">
              <strong>Sito Web:</strong> <a href="https://www.michelelaurelli.it" target="_blank" rel="noopener noreferrer" className="underline hover:text-black dark:hover:text-white">www.michelelaurelli.it</a>
            </p>
          </div>
          
          <div className="mt-12 pt-8 border-t-2 border-black dark:border-gray-600 text-center">
            <p className="text-sm italic text-gray-600 dark:text-gray-400">
              Nato ad Albenga, 1991. Veleggio, tiro di scherma e passeggio con il mio Border Collie quando non sto architettando reti neurali.
            </p>
          </div>
        </div>
      </Layout>
    );
  }

  // English version (default)
  return (
    <Layout title="About Michele Laurelli | AI Blog">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8 pb-6 border-b-2 border-black dark:border-gray-600">
          <span className="text-xs uppercase tracking-widest font-semibold text-gray-500 dark:text-gray-400 border-b border-gray-400 dark:border-gray-600 pb-1 inline-block mb-4">
            About
          </span>
          <h1 className="text-5xl font-bold text-gray-900 dark:text-gray-100 mb-4 leading-tight">Michele Laurelli</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-2">AI Architect · Researcher · Builder</p>
          <p className="text-sm italic text-gray-600 dark:text-gray-400">Founder of Algoretico</p>
        </div>
        
        <div className="columns-1 md:columns-2 gap-8 text-justify">
          <p className="text-gray-700 dark:text-gray-300 mb-6 dropcap">
            I build artificial intelligence systems from the ground up. Not chatbots. Not wrappers. Not integrations. Complete architectures—neural networks, 
            training pipelines, inference engines, autonomous agents—designed for organizations that need absolute control over their AI infrastructure. 
            My work spans nuclear fusion control, industrial automation, medical imaging, and enterprise systems that cannot afford to depend on external APIs 
            or surrender their intellectual property to cloud providers.
          </p>
          
          <h2 className="text-2xl font-bold mt-8 mb-4 break-after-avoid">Algoretico — Building Systems That Matter</h2>
          <p className="text-gray-700 mb-6">
            Since founding Algoretico in 2018, I've developed AI architectures that solve real problems in demanding environments. Our innovations include:
          </p>

          <p className="text-gray-700 mb-2">
            <strong>Talents</strong> — A breakthrough concept introducing persistent neural layers that shape how AI models learn, specialize, and excel in specific domains
          </p>

          <p className="text-gray-700 mb-2">
            <strong>Maestro</strong> — The first European patented architecture for orchestrating autonomous AI agents
          </p>

          <p className="text-gray-700 mb-2">
            <strong>You Need No Data</strong> — A framework for self-supervised AI training that allows training AI models with minimal or no data at all
          </p>

          <p className="text-gray-700 mb-6">
            <strong>SPaaS</strong> — Software Production as a Service, transforming how organizations build software through AI-driven automation
          </p>

          <p className="text-gray-700 mb-6">
            These aren't concepts. They're deployed systems: controlling proton-boron fusion reactors at millisecond precision, diagnosing pathologies 
            in medical scans, orchestrating industrial workflows in steel manufacturing, and powering enterprise RAG systems with proprietary knowledge 
            that never leaves the organization's infrastructure.
          </p>
          
          <h2 className="text-2xl font-bold mt-8 mb-4 break-after-avoid">Research at the Frontier</h2>
          <p className="text-gray-700 mb-6">
            My research explores the boundaries between theoretical possibility and engineering reality. I've published work on autonomous control for 
            nuclear fusion, GDPR-compliant concept erasure in large language models, adaptive meta-domain transfer learning, and novel training 
            paradigms that challenge conventional assumptions about what neural networks require to learn.
          </p>

          <p className="text-gray-700 mb-6">
            Projects like PoAItry (the first Italian poetry neural network), DNART.io (AI art from human genome sequences), and systems for 
            emotion recognition and industrial sensor fusion demonstrate that serious AI research doesn't require choosing between technical depth 
            and creative exploration.
          </p>
          
          <h2 className="text-2xl font-bold mt-8 mb-4 break-after-avoid">Teaching the Next Generation</h2>
          <p className="text-gray-700 mb-4">
            I teach Machine Learning, Deep Learning, and Natural Language Processing at three universities across Italy:
          </p>

          <p className="text-gray-700 mb-1">
            • Università Vita-Salute San Raffaele (Milan)
          </p>
          <p className="text-gray-700 mb-1">
            • Istituto Italiano di Criminologia (Vibo Valentia)
          </p>
          <p className="text-gray-700 mb-6">
            • Università Europea di Roma (Rome)
          </p>

          <p className="text-gray-700 mb-6">
            My approach combines mathematical rigor with hands-on system design. Students learn to architect neural networks, not just import them. 
            They understand backpropagation by implementing it, not by watching videos. The goal isn't to create AI users—it's to create AI builders.
          </p>
          
          <h2 className="text-2xl font-bold mt-8 mb-4 break-after-avoid">Advisory Work</h2>
          <p className="text-gray-700 mb-6">
            I advise organizations at the intersection of AI, energy, and industrial transformation: the European Fusion Association on AI integration 
            in fusion research, Lagiste23 as CTO evaluating high-impact technology investments, and Institut EuropIA on European AI ethics and innovation 
            initiatives. The work involves translating frontier AI capabilities into practical systems that operate in regulated, high-stakes environments.
          </p>
          
          <h2 className="text-2xl font-bold mt-8 mb-4 break-after-avoid">Books</h2>
          <p className="text-gray-700 mb-6">
            I've written three books exploring AI from different perspectives—technical foundations, societal implications, and creative applications:
          </p>

          <p className="text-gray-700 mb-1">
            • <em>Alchimia</em> (2024) — On AI, creativity, and transformation
          </p>
          <p className="text-gray-700 mb-1">
            • <em>Intelligenza Artificiale e Criminologia</em> (2023) — AI in criminology and justice systems
          </p>
          <p className="text-gray-700 mb-6">
            • <em>La Matematica dell'Intelligenza Artificiale</em> (2023) — Mathematical foundations of AI
          </p>
          
          <h2 className="text-2xl font-bold mt-8 mb-4 break-after-avoid">Contact</h2>
          <p className="text-gray-700 mb-2">
            <strong>Email:</strong> <a href="mailto:ciao@michelelaurelli.it" className="underline hover:text-black dark:hover:text-white">ciao@michelelaurelli.it</a>
          </p>
          <p className="text-gray-700 mb-6">
            <strong>Website:</strong> <a href="https://www.michelelaurelli.it" target="_blank" rel="noopener noreferrer" className="underline hover:text-black dark:hover:text-white">www.michelelaurelli.it</a>
          </p>
        </div>
        
        <div className="mt-12 pt-8 border-t-2 border-black dark:border-gray-600 text-center">
          <p className="text-sm italic text-gray-600 dark:text-gray-400">
            Born in Albenga, 1991. I sail, fence, and walk with my Border Collie when I'm not architecting neural networks.
          </p>
        </div>
      </div>
    </Layout>
  );
}
