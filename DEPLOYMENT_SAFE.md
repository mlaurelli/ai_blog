# 🔒 Safe Deployment Process

## ⚠️ CRITICAL: Protezione Dati di Produzione

**I contenuti sul server di produzione sono SEMPRE la fonte di verità (source of truth).**

Ogni deploy DEVE seguire questo processo per evitare perdita di dati.

---

## 🚀 Come Fare Deploy Sicuro

### Metodo 1: Script Automatico (CONSIGLIATO)

```bash
chmod +x scripts/safe-deploy.sh
./scripts/safe-deploy.sh
```

Lo script esegue automaticamente:
1. ✅ Backup dei dati di produzione
2. ✅ Sync locale con i dati di produzione
3. ✅ Commit e push su GitHub
4. ✅ Deploy sul server

---

### Metodo 2: Manuale (Solo se necessario)

**Step 1: Backup Dati Produzione**
```bash
scp ubuntu@51.178.31.160:/home/ubuntu/michelelaurelli.it/data/*.json ./backups/
```

**Step 2: Sync Locale**
```bash
cp ./backups/*.json ./data/
git add data/*.json
git commit -m "Sync production data"
git push origin main
```

**Step 3: Deploy**
```bash
ssh ubuntu@51.178.31.160
cd /home/ubuntu/michelelaurelli.it
git stash
git pull origin main
npm install
npm run build
pm2 restart all
```

---

## 📁 Struttura Backup

```
backups/
├── 20251125_105900/    # Timestamp folder
│   ├── posts.json
│   ├── authors.json
│   └── glossary.json
└── 20251125_110500/
    ├── posts.json
    ├── authors.json
    └── glossary.json
```

---

## ⚠️ REGOLE IMPORTANTI

### ❌ NON FARE MAI:
- ❌ `git pull` sul server senza prima fare backup
- ❌ Modificare file JSON in locale senza sincronizzare con produzione
- ❌ Fare deploy senza verificare che i dati locali siano aggiornati

### ✅ SEMPRE FARE:
- ✅ Usare `safe-deploy.sh` per ogni deploy
- ✅ Verificare che i backup siano salvati
- ✅ Controllare che git sia sincronizzato prima del deploy

---

## 🔧 Configurazione Server

Il server ha già questi comandi configurati:

```bash
# Per vedere lo stato
pm2 list

# Per vedere i logs
pm2 logs

# Per riavviare
pm2 restart all

# Per vedere le modifiche ai dati
cd /home/ubuntu/michelelaurelli.it
git status
```

---

## 📊 Monitoraggio

Dopo ogni deploy verificare:
- ✅ Build completata senza errori
- ✅ PM2 applicazioni online
- ✅ Sito raggiungibile su https://michelelaurelli.it
- ✅ Contenuti visualizzati correttamente

---

## 🆘 Ripristino da Backup

In caso di problemi:

```bash
# 1. Trovare il backup
ls -la backups/

# 2. Ripristinare i file
cp backups/TIMESTAMP/*.json data/

# 3. Committare
git add data/*.json
git commit -m "Restore from backup TIMESTAMP"
git push origin main

# 4. Deploy
./scripts/safe-deploy.sh
```

---

## 📝 Note

- I backup vengono salvati in `backups/` (aggiunto a .gitignore)
- Ogni backup ha un timestamp univoco
- I backup più vecchi di 30 giorni possono essere rimossi manualmente
- In caso di dubbi, SEMPRE fare backup prima di procedere

---

**🔥 RICORDA: Non possiamo MAI permetterci di perdere i contenuti di produzione!**
