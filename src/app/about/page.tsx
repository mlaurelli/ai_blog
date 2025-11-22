import Layout from '@/components/Layout';
import type { Metadata } from 'next';
import { seoSettings } from '@/lib/seo';

export const metadata: Metadata = {
  title: 'About Michele Laurelli - AI Architect & Researcher',
  description: 'AI architect building complete intelligence systems from neural networks to autonomous agents. Founder of Algoretico, specializing in private AI infrastructure for demanding environments.',
  keywords: [
    ...seoSettings.keywords,
    'Michele Laurelli',
    'AI Architect',
    'Algoretico',
    'AI Researcher',
    'Private AI',
    'Neural Networks',
    'Autonomous Agents',
  ],
  openGraph: {
    title: 'About Michele Laurelli - AI Architect',
    description: 'Building AI systems that matter. Complete architectures for organizations that need absolute control.',
    url: `${seoSettings.siteUrl}/about`,
    type: 'profile',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1200&h=630&fit=crop',
        width: 1200,
        height: 630,
        alt: 'Michele Laurelli - AI Architect',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'About Michele Laurelli - AI Architect',
    description: 'Building AI systems that matter. Complete architectures for organizations that need absolute control.',
  },
  alternates: {
    canonical: `${seoSettings.siteUrl}/about`,
  },
};

export default function About() {
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
