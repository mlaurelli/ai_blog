# 📧 Newsletter Manager - Guida Utente

Sistema completo per creare e inviare newsletter personalizzate dal CMS Admin.

---

## ✨ Caratteristiche

- ✅ **Selezione articoli** - Scegli quali post includere nella newsletter
- ✅ **Generazione AI** - OpenAI (GPT-4o) genera oggetto e introduzione
- ✅ **Template AI Blog** - Design perfettamente integrato con lo stile del blog
- ✅ **Anteprima live** - Vedi esattamente come apparirà la newsletter
- ✅ **Invio Mailchimp** - Integrazione completa con Mailchimp API
- ✅ **Storico newsletter** - Tutte le newsletter inviate vengono salvate

---

## 🚀 Come Usare

### 1. Accedi alla Dashboard Admin
```
http://localhost:3000/admin/dashboard
```

### 2. Clicca su "Newsletter" 📧
Il pulsante blu con l'icona email nella dashboard.

### 3. Selezione Articoli
- **Colonna sinistra** mostra gli ultimi 20 articoli
- **Clicca sulle checkbox** per selezionare gli articoli da includere
- Il contatore in basso mostra quanti articoli hai selezionato

### 4. Genera Contenuto con AI
- Clicca sul pulsante viola **"Generate with AI"** ✨
- OpenAI (GPT-4o) creerà:
  - **Subject line** - Oggetto email ottimizzato (max 60 caratteri)
  - **Introduction** - Introduzione personalizzata 2-3 paragrafi

### 5. Personalizza (Opzionale)
- Puoi **modificare** manualmente l'oggetto e l'introduzione
- Il tono è già ottimizzato per il tuo brand (tecnico ma accessibile)

### 6. Anteprima
- Clicca **"Show Preview"** 👁️
- Vedi esattamente come apparirà la newsletter:
  - Header stile AI Blog (masthead con Playfair Display)
  - Introduzione con font Georgia
  - Ogni articolo con titolo, data, excerpt e CTA "Read Full Article"
  - Footer con links social e unsubscribe

### 7. Invia Newsletter
- Clicca **"Send Newsletter"** 📤
- Conferma l'invio
- La newsletter viene inviata tramite Mailchimp a tutti i subscribers
- Vedrai un messaggio di successo con il numero di destinatari

### 8. Storico
- In fondo alla pagina vedi tutte le **newsletter inviate**
- Ogni voce mostra:
  - Subject
  - Numero articoli
  - Numero destinatari
  - Data e ora invio

---

## 🎨 Template Newsletter

Il template HTML è in pieno stile **AI Blog**:

### Header
```
┌─────────────────────────────┐
│ Thursday, November 28, 2025 │
│                             │
│        AI Blog              │ ← Playfair Display 48px
│    by Michele Laurelli      │ ← Italic, bordered
└─────────────────────────────┘
```

### Introduzione
- Font: Georgia/Lora serif
- Line-height: 1.8 per leggibilità
- 2-3 paragrafi personalizzati

### Articoli
Ogni articolo include:
- **Titolo** - Playfair Display 24px, bold
- **Meta** - Data + autore, uppercase tracking
- **Excerpt** - Testo completo dell'estratto
- **CTA** - Bottone nero "Read Full Article →"

### Footer
- Background grigio chiaro
- Social links (Twitter, LinkedIn)
- Unsubscribe link (Mailchimp merge tags)

---

## 🔧 Configurazione

### Variabili d'Ambiente (`.env.local`)

```bash
# OpenAI API (per generazione contenuto)
OPENAI_API_KEY=your_openai_api_key

# Mailchimp Configuration
MAILCHIMP_API_KEY=your_mailchimp_api_key
MAILCHIMP_AUDIENCE_ID=your_audience_id
MAILCHIMP_SERVER_PREFIX=us14  # es. us1, us14, etc.
```

### Come Ottenere le Credenziali Mailchimp

1. **API Key**:
   - Vai su https://admin.mailchimp.com/account/api/
   - Crea una nuova API key
   - Copia e incolla in `MAILCHIMP_API_KEY`

2. **Audience ID**:
   - Vai su Audience → Settings → Audience name and defaults
   - Trovi "Audience ID" in alto
   - Copia e incolla in `MAILCHIMP_AUDIENCE_ID`

3. **Server Prefix**:
   - Guarda l'URL quando sei loggato in Mailchimp
   - Es. `https://us14.admin.mailchimp.com/...`
   - Il prefixo è la parte dopo `https://` (es. `us14`)
   - Inseriscilo in `MAILCHIMP_SERVER_PREFIX`

---

## 📂 File Creati

### API Endpoints
```
/api/newsletter              → GET/POST/DELETE newsletter
/api/newsletter/generate     → POST genera subject + intro con AI
/api/newsletter/send         → POST invia via Mailchimp
```

### Pagine Admin
```
/admin/newsletter            → Pagina principale newsletter manager
```

### Librerie
```
src/lib/newsletter.ts        → Funzioni helper + template HTML
```

### Dati
```
data/newsletters.json        → Storico newsletter inviate (auto-creato)
```

---

## 🎯 Workflow Completo

```
1. Login Admin → Dashboard
          ↓
2. Clicca "Newsletter" 📧
          ↓
3. Seleziona articoli (checkbox)
          ↓
4. Clicca "Generate with AI" ✨
          ↓
5. Rivedi/modifica oggetto e intro
          ↓
6. Clicca "Show Preview" 👁️
          ↓
7. Verifica anteprima newsletter
          ↓
8. Clicca "Send Newsletter" 📤
          ↓
9. Conferma invio
          ↓
10. Newsletter inviata! ✅
```

---

## 💡 Suggerimenti

### Frequenza Invio
- **Settimanale** - 3-5 articoli migliori della settimana
- **Mensile** - 5-10 articoli del mese + recap
- **On-demand** - Quando hai contenuti particolarmente rilevanti

### Selezione Articoli
- Varia i topic (non solo una categoria)
- Mix di articoli tecnici e accessibili
- Includi sempre almeno 2-3 articoli

### Oggetto Email
- Max 60 caratteri (viene troncato sui mobile)
- Include "AI" o topic chiave
- Evita caps lock e troppi emoji
- L'AI genera già ottimo oggetto, ma puoi personalizzare

### Introduzione
- 2-3 paragrafi max (non troppo lunga)
- Tono personale ma professionale
- Crea curiosità senza spoilerare troppo
- L'AI conosce già il tuo stile (tecnico ma accessibile)

---

## 🔍 Troubleshooting

### "Mailchimp credentials not configured"
- Verifica che tutte e 3 le variabili siano in `.env.local`
- Riavvia il dev server dopo aver modificato `.env.local`

### "Failed to generate newsletter content"
- Verifica che `OPENAI_API_KEY` sia valida
- Controlla di aver selezionato almeno 1 articolo

### "Failed to send campaign"
- Verifica API key Mailchimp
- Controlla che l'Audience ID sia corretto
- Assicurati che ci siano subscriber nell'audience

### Newsletter inviata ma non arriva
- Controlla spam folder
- Verifica che l'email sia nell'audience Mailchimp
- Controlla lo status della campagna in Mailchimp dashboard

---

## 📊 Statistiche

Dopo l'invio, puoi vedere statistiche in:
- **Mailchimp Dashboard** → Campaigns → Clicca sulla campagna
  - Open rate
  - Click rate
  - Bounce rate
  - Unsubscribe

---

## 🎨 Personalizzazione Template

Se vuoi modificare il design HTML, edita:
```typescript
src/lib/newsletter.ts
→ funzione generateNewsletterHTML()
```

Il template usa:
- **Playfair Display** per i titoli (come sul blog)
- **Lora/Georgia** per il body text
- **Colori**: #000000, #f5f5f0, #666666
- **Layout**: max-width 600px (email standard)
- **Border style**: Bold borders come sul blog

---

## ✅ Checklist Primo Invio

- [ ] Configurato `.env.local` con credenziali Mailchimp
- [ ] Verificato che ci siano subscriber in Mailchimp
- [ ] Testato generazione AI (serve OPENAI_API_KEY)
- [ ] Visto anteprima newsletter
- [ ] Inviato test email a te stesso (opzionale in Mailchimp)
- [ ] Pronto per l'invio a tutti i subscribers!

---

## 🚀 Pronto!

Il tuo **Newsletter Manager** è completo e funzionante!

**URL di test**: http://localhost:3000/admin/newsletter

**Domande?** Controlla i log del server per eventuali errori.
