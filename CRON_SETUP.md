# 🕐 Cron Job Setup - Daily Paper Import

## Configurazione Automatica Import Paper

Il sistema importa automaticamente nuovi paper da arXiv ogni giorno a mezzanotte.

---

## 📋 Setup Sul Server

### 1. Rendere lo script eseguibile

```bash
ssh ubuntu@51.178.31.160
cd /home/ubuntu/michelelaurelli.it
chmod +x scripts/run-daily-import.sh
```

### 2. Configurare il Cron Job

```bash
# Aprire l'editor crontab
crontab -e

# Aggiungere questa riga (esegue ogni giorno a mezzanotte):
0 0 * * * /home/ubuntu/michelelaurelli.it/scripts/run-daily-import.sh >> /home/ubuntu/michelelaurelli.it/logs/daily-import.log 2>&1
```

### 3. Creare la directory per i log

```bash
mkdir -p /home/ubuntu/michelelaurelli.it/logs
```

---

## 🔧 Come Funziona

**Ogni giorno a mezzanotte:**

1. 🔍 **Fetch** - Scarica gli ultimi 30 paper da arXiv
2. 🔎 **Check** - Verifica quali sono nuovi (non già presenti)
3. 🤖 **AI Explanation** - Genera spiegazioni AI per i nuovi paper
4. 💾 **Save** - Aggiunge i nuovi paper a `data/papers.json`
5. 📝 **Commit** - Fa commit e push su GitHub
6. 🔨 **Build** - Rebuilda l'app Next.js
7. 🔄 **Restart** - Riavvia PM2

---

## 📊 Monitoraggio

### Visualizzare i log

```bash
# Ultimi log
tail -f /home/ubuntu/michelelaurelli.it/logs/daily-import.log

# Ultimi 50 righe
tail -n 50 /home/ubuntu/michelelaurelli.it/logs/daily-import.log

# Cerca errori
grep -i error /home/ubuntu/michelelaurelli.it/logs/daily-import.log
```

### Verificare lo stato del cron job

```bash
# Lista cron jobs attivi
crontab -l

# Verificare se il cron service è attivo
sudo systemctl status cron
```

---

## 🧪 Test Manuale

Puoi testare lo script manualmente senza aspettare la mezzanotte:

```bash
# SSH nel server
ssh ubuntu@51.178.31.160

# Esegui lo script
cd /home/ubuntu/michelelaurelli.it
./scripts/run-daily-import.sh
```

Oppure in locale:

```bash
npm run daily-import-papers
```

---

## ⚙️ Configurazione Cron

Il formato cron `0 0 * * *` significa:

- `0` = minuto 0
- `0` = ora 0 (mezzanotte)
- `*` = ogni giorno del mese
- `*` = ogni mese
- `*` = ogni giorno della settimana

### Altri esempi di scheduling:

```bash
# Ogni 6 ore
0 */6 * * * /path/to/script.sh

# Ogni lunedì a mezzanotte
0 0 * * 1 /path/to/script.sh

# Due volte al giorno (mezzanotte e mezzogiorno)
0 0,12 * * * /path/to/script.sh
```

---

## 🔒 Sicurezza

- ✅ Lo script usa le variabili d'ambiente da `.env.local` (già presente sul server)
- ✅ La OpenAI API key è protetta e non esposta nei log
- ✅ I commit sono automatici ma firmati con le credenziali git del server

---

## 🐛 Troubleshooting

### Il cron non si esegue

1. Verificare che il cron service sia attivo: `sudo systemctl status cron`
2. Controllare i permessi dello script: `ls -la scripts/run-daily-import.sh`
3. Verificare il path nel crontab: `crontab -l`

### Errori nei log

1. Controllare i log: `tail -f logs/daily-import.log`
2. Verificare le variabili d'ambiente sul server
3. Testare manualmente: `./scripts/run-daily-import.sh`

### Nessun nuovo paper importato

È normale! Lo script importa solo paper **nuovi**. Se arXiv non ha pubblicato nuovi paper AI nelle ultime 24 ore, lo script terminerà senza importare nulla.

---

## 📈 Statistiche

Lo script importa mediamente:
- **5-15 nuovi paper al giorno** (dipende dall'attività su arXiv)
- **Tempo esecuzione**: 30-90 secondi (dipende dal numero di nuovi paper)
- **API calls**: 1 fetch arXiv + 1 OpenAI call per paper nuovo
