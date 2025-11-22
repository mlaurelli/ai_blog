export type GlossaryTerm = {
  slug: string;
  language: 'en' | 'it';
  term: string;
  category: string;
  pronunciation?: string;
  definition: string;
  explanation: string;
  examples?: string[];
  relatedTerms?: string[];
  etymology?: string;
};

export const glossaryTerms: GlossaryTerm[] = [
  // Neural Network - EN
  {
    slug: 'neural-network',
    language: 'en',
    term: 'Neural Network',
    category: 'Architecture',
    pronunciation: '/ˈnjʊərəl ˈnetwɜːrk/',
    definition: 'A computational model inspired by biological neural networks, consisting of interconnected nodes (neurons) that process information.',
    explanation: `A neural network is a machine learning model inspired by the human brain's structure. It consists of layers of interconnected nodes (neurons) that process and transform input data to produce output predictions.

## Architecture
Neural networks typically have:
- **Input Layer**: Receives raw data
- **Hidden Layers**: Process and transform data
- **Output Layer**: Produces final predictions

## Training
Networks learn through backpropagation, adjusting weights to minimize error between predictions and actual outputs.`,
    examples: ['Image classification', 'Speech recognition', 'Natural language processing'],
    relatedTerms: ['deep-learning', 'backpropagation', 'activation-function'],
  },

  // Transfer Learning - IT
  {
    slug: 'transfer-learning',
    language: 'it',
    term: 'Transfer Learning',
    category: 'Addestramento',
    definition: 'Una tecnica dove la conoscenza appresa da un task viene applicata a un task diverso ma correlato, riducendo tempo di training e requisiti dati.',
    explanation: `Il transfer learning sfrutta modelli pre-addestrati. Approccio comune: usare un modello addestrato su grande dataset (es. ImageNet) come punto di partenza per task specifico.`,
    examples: ['Usare ResNet pre-addestrato per classificazione immagini mediche', 'Fine-tuning di BERT per sentiment analysis', 'Adattare GPT per generazione codice'],
    relatedTerms: ['fine-tuning', 'pre-training', 'neural-network'],
  },

  {
    slug: 'rete-convoluzionale',
    language: 'it',
    term: 'Rete Convoluzionale',
    category: 'Architettura',
    pronunciation: '/ˈrete konvolutsjoːnale/',
    definition: `Una rete convoluzionale è un tipo di rete neurale progettata per elaborare dati strutturati in griglie, come immagini, attraverso l'uso di operazioni di convoluzione.`,
    explanation: `# Rete Convoluzionale

## Introduzione
Le reti convoluzionali (CNN, dall'inglese Convolutional Neural Networks) sono un'architettura di apprendimento profondo ampiamente utilizzata nel campo della visione artificiale e nel trattamento di dati simili a immagini. Queste reti sono particolarmente efficaci nell'estrazione di caratteristiche da dati ad alta dimensione, come le immagini, grazie alla loro capacità di mantenere le relazioni spaziali interne.

## Come Funziona
Una rete convoluzionale è composta da vari strati, ognuno dei quali svolge un ruolo specifico nell'elaborazione dei dati. La struttura tipica di una CNN include:
- **Strati di convoluzione**: Questi strati applicano filtri (o kernel) ai dati in ingresso per estrarre caratteristiche. Ogni filtro è ottimizzato per riconoscere un certo tipo di caratteristica, come bordi o texture.
- **Strati di pooling**: Questi strati riducono la dimensionalità dei dati, mantenendo le caratteristiche più significative. L'operazione di pooling più comune è il max pooling, che seleziona il valore massimo da un certo riquadro dell'immagine.
- **Strati completamente connessi**: Alla fine della rete, uno o più strati completamente connessi elaborano le informazioni estratte e producono le classificazioni finali. Questi strati sono simili a quelli delle reti neurali tradizionali, dove ogni neurone è connesso a tutti i neuroni del livello successivo.

## Caratteristiche Chiave
Le reti convoluzionali presentano diverse caratteristiche distintive:
- **Invarianza alla traslazione**: Grazie all'uso della convoluzione e del pooling, le CNN possono riconoscere oggetti anche se si trovano in posizioni diverse nell'immagine.
- **Condivisione dei pesi**: I filtri utilizzati nella convoluzione hanno pesi condivisi, riducendo così il numero totale di parametri da apprendere e migliorando l'efficienza computazionale.
- **Gerarchia delle caratteristiche**: Le CNN apprendono a riconoscere caratteristiche sempre più astratte man mano che i dati passano attraverso i vari strati, partendo da bordi e forme semplici fino ad arrivare a oggetti complessi.

## Applicazioni
Le reti convoluzionali vengono utilizzate in una vasta gamma di applicazioni, tra cui:
- **Riconoscimento facciale**: Le CNN possono essere addestrate a identificare volti umani in immagini e video.
- **Classificazione delle immagini**: Utilizzate in sistemi di classificazione automatica delle immagini, come Google Images.
- **Riconoscimento degli oggetti**: Implementate in tecnologie di guida autonoma per identificare pedoni, veicoli e segnali stradali.
- **Segmentazione semantica**: Utilizzate per segmentare un'immagine in parti significative, utile in ambiti come la medicina per l'analisi delle immagini radiologiche.

## Vantaggi e Limitazioni
### Vantaggi
- **Efficacia nella gestione di dati visivi**: Le CNN raggiungono prestazioni superiori rispetto ad altri algoritmi nel riconoscimento di immagini.
- **Automazione dell'estrazione delle caratteristiche**: Non è necessario progettare manualmente le caratteristiche, poiché le CNN sono in grado di apprenderle autonomamente.

### Limitazioni
- **Richiesta di grandi quantità di dati**: Le CNN necessitano di grandi set di dati etichettati per un addestramento efficace.
- **Computazionalmente costose**: L'addestramento di reti convoluzionali richiede risorse computazionali significative, incluse GPU avanzate.

## Conclusione
Le reti convoluzionali hanno rivoluzionato il campo dell'intelligenza artificiale, in particolare nella visione artificiale. La loro capacità di apprendere automaticamente le caratteristiche dai dati ha aperto la strada a numerose innovazioni in vari settori, dal riconoscimento facciale alla guida autonoma.`,
    examples: [
      'Un sistema di riconoscimento facciale che utilizza una CNN per identificare gli individui in tempo reale.',
      'Un\'applicazione di classificazione delle immagini che sfrutta le CNN per organizzare le fotografie in base al contenuto.',
      'Un software di diagnostica medica che utilizza reti convoluzionali per analizzare le immagini radiologiche e identificare anomalie.'
    ],
    relatedTerms: ['rete-neurale', 'deep-learning', 'visione-artificiale'],
    etymology: 'Il termine \'rete convoluzionale\' deriva dalla parola \'convoluzione\', che indica un\'operazione matematica fondamentale utilizzata per l\'estrazione delle caratteristiche nelle reti neurali. L\'architettura è stata ispirata dal modo in cui il cervello umano elabora le informazioni visive.',
  },

  {
    slug: 'self-attention',
    language: 'it',
    term: 'Self Attention',
    category: 'Tecnica',
    pronunciation: '/sɛlf əˈtɛnʃən/',
    definition: `Il self attention è un meccanismo di attenzione utilizzato nei modelli di deep learning che consente a una rete neurale di pesare l'importanza di diverse parti di un input rispetto ad altre, facilitando così l'elaborazione delle informazioni in contesti complessi.`,
    explanation: `# Introduzione
Il **self attention** è una tecnica fondamentale introdotta nel contesto delle reti neurali, particolarmente nei modelli di linguaggio e visione artificiale. Questo meccanismo permette ai modelli di considerare le relazioni tra elementi all'interno di una singola sequenza di dati, migliorando notevolmente la loro capacità di comprensione e generazione.

# Come Funziona
Il processo di self attention può essere suddiviso in più passaggi:
1. **Input**: Un set di vettori di input è preso in considerazione, dove ogni vettore rappresenta un elemento della sequenza.
2. **Calcolo dei Pesi**: Per ciascun vettore, vengono calcolati tre componenti: le *query*, le *key* e i *value*. Le query e le key vengono utilizzate per determinare l'importanza relativa degli elementi, mentre i value rappresentano l'informazione da aggregare.
3. **Attenzione**: Viene calcolata una matrice di attenzione, utilizzando il prodotto scalare tra query e key, seguito da una normalizzazione tramite softmax. Questo produce pesi che indicano quanto ogni elemento della sequenza dovrebbe influenzare l'output finale.
4. **Aggregazione**: I pesi ottenuti vengono usati per aggregare i value, producendo così un output che tiene conto delle relazioni contestuali tra gli elementi.

# Caratteristiche Chiave
- **Contesto Dinamico**: A differenza delle reti neurali tradizionali, il self attention consente una ponderazione dinamica in base al contesto, migliorando la comprensione semantica.
- **Scalabilità**: Può essere applicato a sequenze di lunghezza variabile, rendendolo adatto a vari tipi di dati.
- **Parallelizzazione**: Il calcolo della matrice di attenzione può essere parallelizzato, riducendo i tempi di addestramento rispetto ad approcci sequenziali.

# Applicazioni
Il self attention trova applicazione in diverse aree, tra cui:
- **Traduzione Automatica**: Utilizzato in modelli come il Transformer, migliora la qualità delle traduzioni considerando il contesto globale delle frasi.
- **Elaborazione del Linguaggio Naturale (NLP)**: Impiegato in modelli di linguaggio per la generazione di testo e l'analisi del sentiment.
- **Visione Artificiale**: Applicato in reti neurali per migliorare la classificazione delle immagini e l'individuazione di oggetti.

# Vantaggi e Limitazioni
## Vantaggi
- **Flessibilità**: Adatta facilmente a diversi formati di input senza necessità di modifiche strutturali.
- **Efficienza**: La capacità di elaborare informazioni in parallelo consente modelli più veloci e scalabili.

## Limitazioni
- **Costo Computazionale**: Per sequenze molto lunghe, il costo computazionale cresce quadraticamente, rendendo difficile l'applicazione su dati di grandi dimensioni.
- **Overfitting**: Se non gestito correttamente, il modello potrebbe sovraccaricarsi di informazioni, influenzando negativamente le prestazioni su dati non visti.
`,
    examples: [
      'Un modello di traduzione automatica che utilizza self attention per migliorare la comprensione del contesto nella traduzione di frasi complesse.',
      'Un sistema di raccomandazione che applica self attention per analizzare le preferenze degli utenti e suggerire contenuti personalizzati.',
      'Un modello di generazione di testo che sfrutta self attention per creare narrazioni coerenti e fluide basate su prompt iniziali.'
    ],
    relatedTerms: ['transformer', 'attention-mechanism', 'deep-learning'],
    etymology: 'Il termine \'self attention\' deriva dall\'idea di attenzione applicata a se stessa, in cui ogni parte di un input può influenzare l\'interpretazione di altre parti all\'interno della stessa sequenza.',
  }
];

// Dynamic glossary loading from JSON file
function loadGlossaryTerms(): GlossaryTerm[] {
  // Only load from filesystem on server-side
  if (typeof window === 'undefined') {
    try {
      const fs = require('fs');
      const path = require('path');
      const glossaryPath = path.join(process.cwd(), 'data', 'glossary.json');
      
      // Read JSON file
      const fileContent = fs.readFileSync(glossaryPath, 'utf-8');
      const termsArray = JSON.parse(fileContent);
      return termsArray;
    } catch (e) {
      console.error('Error loading glossary from JSON:', e);
      // Fallback to hardcoded terms if JSON file doesn't exist
      return glossaryTerms;
    }
  }
  // Client-side: return hardcoded terms as fallback
  return glossaryTerms;
}

// Helper functions
export function getAllTerms(lang: 'en' | 'it' = 'en'): GlossaryTerm[] {
  return loadGlossaryTerms()
    .filter(term => term.language === lang)
    .sort((a, b) => a.term.localeCompare(b.term));
}

export function getTermBySlug(slug: string, lang: 'en' | 'it' = 'en'): GlossaryTerm | undefined {
  return loadGlossaryTerms().find(term => term.slug === slug && term.language === lang);
}

export function getTermsByCategory(category: string, lang: 'en' | 'it' = 'en'): GlossaryTerm[] {
  return loadGlossaryTerms()
    .filter(term => term.language === lang && term.category === category)
    .sort((a, b) => a.term.localeCompare(b.term));
}

export function getAllCategories(lang: 'en' | 'it' = 'en'): string[] {
  const terms = loadGlossaryTerms().filter(term => term.language === lang);
  return [...new Set(terms.map(term => term.category))].sort();
}

export function searchTerms(query: string, lang: 'en' | 'it' = 'en'): GlossaryTerm[] {
  const lowercaseQuery = query.toLowerCase();
  return loadGlossaryTerms()
    .filter(term => 
      term.language === lang && (
        term.term.toLowerCase().includes(lowercaseQuery) ||
        term.definition.toLowerCase().includes(lowercaseQuery)
      )
    )
    .sort((a, b) => a.term.localeCompare(b.term));
}

// For admin: get ALL terms without language filter
export function getAllTermsAdmin(): GlossaryTerm[] {
  return loadGlossaryTerms()
    .sort((a, b) => a.term.localeCompare(b.term));
}
