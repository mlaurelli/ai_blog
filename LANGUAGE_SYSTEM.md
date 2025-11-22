# Sistema Multi-Lingua - Guida Completa

## ✅ Sistema Implementato

Il blog ora supporta completamente **Inglese e Italiano** con:

1. **Switcher lingua nell'header** (EN/IT)
2. **Post specifici per lingua** o **bilingue**
3. **Filtro automatico** - i post vengono mostrati solo nella lingua attiva
4. **CMS con selezione lingua** per creare/modificare post

---

## 🎯 Come Funziona

### **Tipi di Post**

Quando crei/modifichi un post nel CMS, puoi scegliere:

1. **Both English and Italian (Bilingue)** - `language: 'both'`
   - Appare sia nel sito EN che IT
   - Mostra lo stesso contenuto in entrambe le lingue
   - Ideale per contenuti tecnici universali

2. **English Only** - `language: 'en'`
   - Appare SOLO quando l'utente seleziona EN
   - Invisibile nel sito IT

3. **Italian Only** - `language: 'it'`
   - Appare SOLO quando l'utente seleziona IT
   - Invisibile nel sito EN

---

## 📝 Creare Post nel CMS

### **Nuovo Post**

1. Vai su `/admin/posts/new`
2. Seleziona la lingua dal dropdown:
   - `Both English and Italian (Bilingue)` ← **Default, raccomandato**
   - `English Only (Solo Inglese)`
   - `Italian Only (Solo Italiano)`
3. Compila i campi normalmente
4. Salva

### **Modifica Post Esistente**

1. Vai su `/admin/posts/edit/[slug]`
2. Cambia la lingua se necessario
3. Salva

---

## 🔧 Come Funziona Tecnicamente

### **Struttura Post**

Ogni post ha ora un campo `language`:

```typescript
{
  slug: 'my-post',
  language: 'both', // 'en' | 'it' | 'both'
  title: 'My Title',
  excerpt: '...',
  content: `...`,
  // ... altri campi
}
```

### **Filtro Automatico**

La funzione `getAllPosts(lang)` filtra automaticamente:

```typescript
export function getAllPosts(lang: 'en' | 'it' = 'en'): Post[] {
  return loadPosts()
    .filter(post => post.language === 'both' || post.language === lang)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .map(post => getLocalizedPost(post, lang));
}
```

**Esempi:**
- Utente seleziona **EN** → Vede post con `language: 'en'` e `language: 'both'`
- Utente seleziona **IT** → Vede post con `language: 'it'` e `language: 'both'`

---

## 🌍 Sistema di Traduzione (Opzionale)

Per post **bilingue** (`language: 'both'`), puoi aggiungere traduzioni italiane:

```typescript
{
  slug: 'my-bilingual-post',
  language: 'both',
  
  // Inglese (richiesto)
  title: 'My English Title',
  excerpt: 'English excerpt...',
  content: `English content...`,
  tags: ['AI', 'Tech'],
  
  // Italiano (opzionale)
  titleIt: 'Il Mio Titolo Italiano',
  excerptIt: 'Estratto italiano...',
  contentIt: `Contenuto italiano...`,
  tagsIt: ['IA', 'Tecnologia']
}
```

**Quando l'utente seleziona IT:**
- Se `titleIt` esiste → Usa `titleIt`
- Altrimenti → Usa `title` (inglese)

Questo permette traduzioni **graduali** - non devi tradurre tutto subito!

---

## 📊 Stato Attuale

### **Tutti i 10 post esistenti:**

Hanno `language: 'both'` → Visibili in entrambe le lingue

### **Prossimi passi:**

1. **Post solo in italiano?** Crea nuovi post con `language: 'it'`
2. **Post solo in inglese?** Crea nuovi post con `language: 'en'`
3. **Traduzioni?** Aggiungi `titleIt`, `contentIt`, ecc. ai post `'both'`

---

## 🚀 Esempi Pratici

### **Scenario 1: Post Tecnico Bilingue**

```typescript
{
  slug: 'new-ai-architecture',
  language: 'both', // Appare in EN e IT
  title: 'Revolutionary AI Architecture',
  excerpt: 'Technical details...',
  content: `...`,
  tags: ['AI', 'Architecture']
}
```

✅ Utente EN → Vede il post in inglese  
✅ Utente IT → Vede il post in inglese (nessuna traduzione)

### **Scenario 2: Articolo Solo Italiano**

```typescript
{
  slug: 'intelligenza-artificiale-italia',
  language: 'it', // Solo IT
  title: 'L\'IA in Italia: Opportunità e Sfide',
  excerpt: 'Analisi del mercato italiano...',
  content: `...`,
  tags: ['IA', 'Italia', 'Mercato']
}
```

❌ Utente EN → **Non vede il post**  
✅ Utente IT → Vede il post

### **Scenario 3: Post Bilingue Tradotto**

```typescript
{
  slug: 'future-of-ai',
  language: 'both',
  
  title: 'The Future of AI',
  titleIt: 'Il Futuro dell\'IA',
  
  excerpt: 'Where AI is heading...',
  excerptIt: 'Dove si dirige l\'IA...',
  
  content: `Full English content...`,
  contentIt: `Contenuto italiano completo...`,
  
  tags: ['AI', 'Future'],
  tagsIt: ['IA', 'Futuro']
}
```

✅ Utente EN → Vede titolo, estratto e contenuto in inglese  
✅ Utente IT → Vede titolo, estratto e contenuto in italiano

---

## 💡 Best Practices

### **Quando usare `'both'`:**
- Post tecnici universali
- Tutorial e guide
- Ricerche e papers
- Contenuti che non richiedono localizzazione culturale

### **Quando usare `'en'` o `'it'`:**
- News locali (es: "AI in Italia")
- Contenuti culturalmente specifici
- Analisi di mercati locali
- Interviste in lingua specifica

### **Quando tradurre:**
- Post di alto valore
- Contenuti evergreen
- Guide fondamentali
- Post popolari

---

## 🎨 UI/UX

### **Language Switcher:**
- Posizionato nell'header (top-right)
- Bottoni **EN** / **IT**
- Salva preferenza in localStorage
- Cambio istantaneo senza reload

### **Utente Experience:**
1. Utente arriva sul sito → Vede inglese (default)
2. Clicca **IT** → Sito passa a italiano
3. Alcuni post spariscono (quelli solo EN)
4. Navigazione continua → Preferenza salvata
5. Ritorna domani → Ancora in italiano

---

## ✨ Vantaggi

1. **Flessibilità** - Mix di post monolingua e bilingue
2. **SEO-Friendly** - Stesso URL per entrambe le lingue
3. **Manutenzione semplice** - Un file, nessun routing complesso
4. **CMS integrato** - Selezione lingua nel form
5. **Graduale** - Traduci quando serve, non tutto subito

---

## 🛠️ API Changes

Le API ora accettano il campo `language`:

```javascript
// POST /api/posts
{
  "slug": "new-post",
  "language": "both", // o "en" o "it"
  "title": "...",
  // ... altri campi
}

// PUT /api/posts/[slug]
{
  "language": "it", // Cambia lingua del post
  // ... altri campi
}
```

---

## 📝 Note Tecniche

- **Type-safe:** TypeScript ti avvisa se `language` manca
- **Backward compatible:** Post vecchi senza `language` vengono trattati come `'both'`
- **Performance:** Nessun overhead - filtraggio in memoria
- **Cache:** Sistema di cache esistente funziona normalmente

---

## 🎯 Riassunto

**Sistema multi-lingua completo implementato!**

✅ Switcher EN/IT nell'header  
✅ Post specifici per lingua (en/it/both)  
✅ Filtro automatico per lingua attiva  
✅ CMS con selezione lingua  
✅ Sistema di traduzioni opzionale  
✅ Tutti i 10 post esistenti configurati come bilingue  

**Ready to go!** 🚀
