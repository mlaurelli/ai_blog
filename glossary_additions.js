  // Deep Learning - EN
  {
    slug: 'deep-learning',
    language: 'en',
    term: 'Deep Learning',
    category: 'Field',
    definition: 'A subset of machine learning using neural networks with multiple layers to learn hierarchical data representations.',
    explanation: `Deep Learning revolutionized AI by automatically learning features from raw data. Networks with many layers can learn increasingly abstract representations.`,
    examples: ['Image classification with CNNs', 'Text generation with transformers', 'Protein structure prediction'],
    relatedTerms: ['neural-network', 'machine-learning', 'transformer'],
  },

  // Deep Learning - IT
  {
    slug: 'deep-learning',
    language: 'it',
    term: 'Deep Learning',
    category: 'Campo',
    definition: 'Un sottoinsieme del machine learning che usa reti neurali con molteplici layer per apprendere rappresentazioni gerarchiche.',
    explanation: `Il Deep Learning ha rivoluzionato l'AI apprendendo automaticamente feature dai dati grezzi. Reti con molti layer possono apprendere rappresentazioni sempre più astratte.`,
    examples: ['Classificazione immagini con CNN', 'Generazione testo con transformer', 'Predizione strutture proteiche'],
    relatedTerms: ['neural-network', 'machine-learning', 'transformer'],
  },

  // Machine Learning - EN
  {
    slug: 'machine-learning',
    language: 'en',
    term: 'Machine Learning',
    category: 'Field',
    definition: 'A branch of AI focused on building systems that learn from data and improve performance without explicit programming.',
    explanation: `Machine Learning enables computers to learn patterns from data. Three main types: supervised learning (labeled data), unsupervised learning (unlabeled data), and reinforcement learning (reward-based).`,
    examples: ['Spam email filtering', 'Product recommendations', 'Fraud detection'],
    relatedTerms: ['deep-learning', 'supervised-learning', 'neural-network'],
  },

  // Machine Learning - IT
  {
    slug: 'machine-learning',
    language: 'it',
    term: 'Machine Learning',
    category: 'Campo',
    definition: 'Un ramo dell\'AI focalizzato sulla costruzione di sistemi che apprendono dai dati e migliorano senza programmazione esplicita.',
    explanation: `Il Machine Learning consente ai computer di apprendere pattern dai dati. Tre tipi principali: supervised learning (dati etichettati), unsupervised learning (dati non etichettati), e reinforcement learning (basato su ricompense).`,
    examples: ['Filtraggio email spam', 'Raccomandazioni prodotti', 'Rilevamento frodi'],
    relatedTerms: ['deep-learning', 'supervised-learning', 'neural-network'],
  },

  // Token - EN
  {
    slug: 'token',
    language: 'en',
    term: 'Token',
    category: 'NLP',
    pronunciation: '/ˈtoʊkən/',
    definition: 'The basic unit of text that a language model processes, typically a word, subword, or character.',
    explanation: `Tokens are how language models "see" text. Tokenization breaks text into manageable pieces. Common methods include word-level, subword (BPE, WordPiece), and character-level tokenization.`,
    examples: ['Word "understanding" might be split into tokens: "under", "stand", "ing"', 'GPT uses ~50,000 token vocabulary', 'Special tokens like [CLS], [SEP] in BERT'],
    relatedTerms: ['tokenization', 'large-language-model', 'embedding'],
  },

  // Token - IT
  {
    slug: 'token',
    language: 'it',
    term: 'Token',
    category: 'NLP',
    pronunciation: '/ˈtoʊkən/',
    definition: 'L\'unità base di testo che un modello linguistico elabora, tipicamente una parola, sottoparola o carattere.',
    explanation: `I token sono il modo in cui i modelli linguistici "vedono" il testo. La tokenizzazione divide il testo in pezzi gestibili. Metodi comuni includono tokenizzazione a livello di parola, sottoparola (BPE, WordPiece) e carattere.`,
    examples: ['La parola "comprensione" potrebbe essere divisa in token: "com", "pren", "sione"', 'GPT usa ~50,000 token di vocabolario', 'Token speciali come [CLS], [SEP] in BERT'],
    relatedTerms: ['tokenization', 'large-language-model', 'embedding'],
  },

  // Embedding - EN
  {
    slug: 'embedding',
    language: 'en',
    term: 'Embedding',
    category: 'NLP',
    pronunciation: '/ɪmˈbedɪŋ/',
    definition: 'A learned vector representation that maps discrete objects (words, images, users) into a continuous vector space where similar items are close together.',
    explanation: `Embeddings convert categorical data into dense numerical vectors. Words with similar meanings have similar embeddings. Enables mathematical operations on concepts.`,
    examples: ['Word2Vec creating 300-dimensional vectors for words', 'BERT contextual embeddings that change based on context', 'Image embeddings from CNN final layers'],
    relatedTerms: ['vector', 'token', 'representation-learning'],
  },

  // Embedding - IT
  {
    slug: 'embedding',
    language: 'it',
    term: 'Embedding',
    category: 'NLP',
    pronunciation: '/ɪmˈbedɪŋ/',
    definition: 'Una rappresentazione vettoriale appresa che mappa oggetti discreti (parole, immagini, utenti) in uno spazio vettoriale continuo dove elementi simili sono vicini.',
    explanation: `Gli embedding convertono dati categorici in vettori numerici densi. Parole con significati simili hanno embedding simili. Consente operazioni matematiche su concetti.`,
    examples: ['Word2Vec che crea vettori 300-dimensionali per parole', 'Embedding contestuali BERT che cambiano in base al contesto', 'Embedding immagini dai layer finali CNN'],
    relatedTerms: ['vector', 'token', 'representation-learning'],
  },

  // CNN - EN
  {
    slug: 'cnn',
    language: 'en',
    term: 'Convolutional Neural Network (CNN)',
    category: 'Architecture',
    pronunciation: '/kənˌvəluːʃənl ˈnjʊərəl ˈnetwɜːrk/',
    definition: 'A specialized neural network architecture designed for processing grid-like data such as images, using convolutional layers that learn spatial hierarchies.',
    explanation: `CNNs revolutionized computer vision. Key components: convolutional layers (feature extraction), pooling layers (downsampling), and fully connected layers (classification).`,
    examples: ['AlexNet winning ImageNet 2012', 'ResNet with 152 layers for image classification', 'YOLO for real-time object detection'],
    relatedTerms: ['neural-network', 'computer-vision', 'convolution'],
  },

  // CNN - IT
  {
    slug: 'cnn',
    language: 'it',
    term: 'Rete Neurale Convoluzionale (CNN)',
    category: 'Architettura',
    pronunciation: '/kənˌvəluːʃənl ˈnjʊərəl ˈnetwɜːrk/',
    definition: 'Un\'architettura di rete neurale specializzata per elaborare dati a griglia come immagini, usando layer convoluzionali che apprendono gerarchie spaziali.',
    explanation: `Le CNN hanno rivoluzionato la computer vision. Componenti chiave: layer convoluzionali (estrazione feature), layer di pooling (downsampling), e layer fully connected (classificazione).`,
    examples: ['AlexNet vincitore ImageNet 2012', 'ResNet con 152 layer per classificazione immagini', 'YOLO per object detection real-time'],
    relatedTerms: ['neural-network', 'computer-vision', 'convolution'],
  },

  // Attention Mechanism - EN
  {
    slug: 'attention-mechanism',
    language: 'en',
    term: 'Attention Mechanism',
    category: 'Architecture',
    definition: 'A technique that allows neural networks to focus on relevant parts of the input when producing an output, weighing different parts differently.',
    explanation: `Attention enables models to dynamically focus on important information. Self-attention (used in Transformers) allows each element to attend to all other elements in parallel.`,
    examples: ['Machine translation attending to relevant source words', 'Image captioning focusing on relevant image regions', 'Multi-head attention in GPT and BERT'],
    relatedTerms: ['transformer', 'self-attention', 'neural-network'],
  },

  // Attention Mechanism - IT
  {
    slug: 'attention-mechanism',
    language: 'it',
    term: 'Meccanismo di Attention',
    category: 'Architettura',
    definition: 'Una tecnica che consente alle reti neurali di concentrarsi su parti rilevanti dell\'input quando producono un output, pesando parti diverse in modo diverso.',
    explanation: `L'attention consente ai modelli di concentrarsi dinamicamente su informazioni importanti. La self-attention (usata nei Transformer) consente a ogni elemento di attendere tutti gli altri elementi in parallelo.`,
    examples: ['Traduzione automatica che si concentra su parole sorgente rilevanti', 'Image captioning che si focalizza su regioni immagine rilevanti', 'Multi-head attention in GPT e BERT'],
    relatedTerms: ['transformer', 'self-attention', 'neural-network'],
  },

  // Loss Function - EN
  {
    slug: 'loss-function',
    language: 'en',
    term: 'Loss Function',
    category: 'Training',
    definition: 'A mathematical function that measures how far a model\'s predictions are from the actual target values, guiding the learning process.',
    explanation: `The loss function quantifies model error. Common types: Cross-entropy loss (classification), Mean Squared Error (regression), Custom losses for specific tasks.`,
    examples: ['Binary cross-entropy for spam classification', 'MSE for house price prediction', 'Contrastive loss for learning embeddings'],
    relatedTerms: ['backpropagation', 'optimization', 'gradient-descent'],
  },

  // Loss Function - IT
  {
    slug: 'loss-function',
    language: 'it',
    term: 'Funzione di Loss',
    category: 'Addestramento',
    definition: 'Una funzione matematica che misura quanto le predizioni di un modello sono lontane dai valori target reali, guidando il processo di apprendimento.',
    explanation: `La loss function quantifica l'errore del modello. Tipi comuni: Cross-entropy loss (classificazione), Mean Squared Error (regressione), Loss custom per task specifici.`,
    examples: ['Binary cross-entropy per classificazione spam', 'MSE per predizione prezzi case', 'Contrastive loss per apprendere embedding'],
    relatedTerms: ['backpropagation', 'optimization', 'gradient-descent'],
  },

  // Epoch - EN
  {
    slug: 'epoch',
    language: 'en',
    term: 'Epoch',
    category: 'Training',
    pronunciation: '/ˈiːpɒk/',
    definition: 'One complete pass through the entire training dataset during the training process of a machine learning model.',
    explanation: `Training typically involves multiple epochs. Each epoch allows the model to learn from all training examples. Too few epochs: underfitting. Too many: overfitting.`,
    examples: ['Training for 10 epochs on 50,000 images', 'Early stopping at epoch 15 when validation loss stops improving', 'Learning rate decay after each epoch'],
    relatedTerms: ['batch', 'iteration', 'training'],
  },

  // Epoch - IT
  {
    slug: 'epoch',
    language: 'it',
    term: 'Epoca',
    category: 'Addestramento',
    pronunciation: '/ˈiːpɒk/',
    definition: 'Un passaggio completo attraverso l\'intero dataset di training durante il processo di addestramento di un modello di machine learning.',
    explanation: `Il training tipicamente coinvolge epoche multiple. Ogni epoca consente al modello di apprendere da tutti gli esempi di training. Troppo poche epoche: underfitting. Troppe: overfitting.`,
    examples: ['Training per 10 epoche su 50,000 immagini', 'Early stopping all\'epoca 15 quando la validation loss smette di migliorare', 'Decay del learning rate dopo ogni epoca'],
    relatedTerms: ['batch', 'iteration', 'training'],
  },

  // Hyperparameter - EN
  {
    slug: 'hyperparameter',
    language: 'en',
    term: 'Hyperparameter',
    category: 'Training',
    definition: 'A configuration setting that controls the learning process but is not learned from data, set before training begins.',
    explanation: `Hyperparameters shape how a model learns. Examples: learning rate, batch size, number of layers, dropout rate. Tuning hyperparameters is crucial for performance.`,
    examples: ['Learning rate: 0.001 vs 0.1 dramatically affects training', 'Batch size: 32 vs 256 impacts convergence speed', 'Number of hidden layers: 3 vs 10 affects model capacity'],
    relatedTerms: ['learning-rate', 'optimization', 'training'],
  },

  // Hyperparameter - IT
  {
    slug: 'hyperparameter',
    language: 'it',
    term: 'Iperparametro',
    category: 'Addestramento',
    definition: 'Un\'impostazione di configurazione che controlla il processo di apprendimento ma non viene appresa dai dati, impostata prima dell\'inizio del training.',
    explanation: `Gli iperparametri modellano come un modello apprende. Esempi: learning rate, batch size, numero di layer, dropout rate. Il tuning degli iperparametri è cruciale per le prestazioni.`,
    examples: ['Learning rate: 0.001 vs 0.1 influenza dramatically il training', 'Batch size: 32 vs 256 impatta la velocità di convergenza', 'Numero di layer nascosti: 3 vs 10 influenza la capacità del modello'],
    relatedTerms: ['learning-rate', 'optimization', 'training'],
  },

  // Dropout - EN
  {
    slug: 'dropout',
    language: 'en',
    term: 'Dropout',
    category: 'Regularization',
    definition: 'A regularization technique that randomly deactivates a fraction of neurons during training to prevent overfitting.',
    explanation: `Dropout forces the network to learn robust features by preventing co-adaptation of neurons. Typically applied with probability 0.2-0.5. Disabled during inference.`,
    examples: ['Adding dropout(0.5) after dense layers in neural networks', 'Preventing overfitting in deep networks', 'DropConnect as a variant dropping connections instead of neurons'],
    relatedTerms: ['overfitting', 'regularization', 'neural-network'],
  },

  // Dropout - IT
  {
    slug: 'dropout',
    language: 'it',
    term: 'Dropout',
    category: 'Regolarizzazione',
    definition: 'Una tecnica di regolarizzazione che disattiva casualmente una frazione di neuroni durante il training per prevenire l\'overfitting.',
    explanation: `Il dropout forza la rete ad apprendere feature robuste prevenendo la co-adattazione dei neuroni. Tipicamente applicato con probabilità 0.2-0.5. Disabilitato durante l\'inference.`,
    examples: ['Aggiungere dropout(0.5) dopo layer densi nelle reti neurali', 'Prevenire overfitting in reti profonde', 'DropConnect come variante che rimuove connessioni invece di neuroni'],
    relatedTerms: ['overfitting', 'regularization', 'neural-network'],
  },

  // Transfer Learning - EN
  {
    slug: 'transfer-learning',
    language: 'en',
    term: 'Transfer Learning',
    category: 'Training',
    definition: 'A technique where knowledge learned from one task is applied to a different but related task, reducing training time and data requirements.',
    explanation: `Transfer learning leverages pre-trained models. Common approach: use a model trained on large dataset (e.g., ImageNet) as starting point for specific task.`,
    examples: ['Using pre-trained ResNet for medical image classification', 'Fine-tuning BERT for sentiment analysis', 'Adapting GPT for code generation'],
    relatedTerms: ['fine-tuning', 'pre-training', 'neural-network'],
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
