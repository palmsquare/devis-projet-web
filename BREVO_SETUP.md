# 📧 Configuration Brevo pour l'envoi d'emails

## Guide étape par étape

### 1. Créer un compte Brevo

1. Allez sur [https://www.brevo.com](https://www.brevo.com)
2. Créez un compte gratuit (300 emails/jour)
3. Confirmez votre email

### 2. Obtenir votre clé API

1. Une fois connecté, allez dans **Settings** (Paramètres)
2. Cliquez sur **SMTP & API** dans le menu de gauche
3. Allez dans l'onglet **API Keys**
4. Cliquez sur **Generate a new API key**
5. Donnez-lui un nom (ex: "Devis Web App")
6. **Copiez la clé API** (format: `xkeysib-xxxxxxxxxxxx...`)
   ⚠️ **Important** : Vous ne pourrez plus la voir après, sauvegardez-la !

### 3. Vérifier votre domaine d'envoi (Recommandé)

1. Dans Brevo, allez dans **Settings > Senders & IP**
2. Cliquez sur **Verify a domain** ou **Add a sender**
3. Si vous avez un domaine :
   - Ajoutez votre domaine (ex: `palmsquare.fr`)
   - Ajoutez les enregistrements DNS demandés dans votre hébergeur
   - Attendez la vérification
4. Si vous n'avez pas de domaine :
   - Utilisez l'email par défaut fourni par Brevo (sera limité)

### 4. Configurer les variables d'environnement dans Vercel

1. Allez sur [vercel.com](https://vercel.com) et connectez-vous
2. Sélectionnez votre projet `devis-projet-web`
3. Allez dans **Settings** > **Environment Variables**
4. Ajoutez ces variables (cliquez sur **Add New** pour chacune) :

#### Variable 1 : BREVO_API_KEY (obligatoire)
- **Key** : `BREVO_API_KEY`
- **Value** : Votre clé API Brevo (ex: `xkeysib-xxxxxxxxxxxx...`)
- **Environment** : Sélectionnez tous (Production, Preview, Development)

#### Variable 2 : YOUR_EMAIL (obligatoire)
- **Key** : `YOUR_EMAIL`
- **Value** : Votre email pour recevoir les notifications (ex: `keziah@palmsquare.fr`)
- **Environment** : Sélectionnez tous

#### Variable 3 : BREVO_FROM_EMAIL (optionnel mais recommandé)
- **Key** : `BREVO_FROM_EMAIL`
- **Value** : L'email expéditeur (doit être vérifié dans Brevo)
  - Si domaine vérifié : `contact@palmsquare.fr` ou `noreply@palmsquare.fr`
  - Sinon : utilisez l'email fourni par Brevo
- **Environment** : Sélectionnez tous

#### Variable 4 : BREVO_FROM_NAME (optionnel)
- **Key** : `BREVO_FROM_NAME`
- **Value** : `Palmsquare` ou `Devis Web`
- **Environment** : Sélectionnez tous

### 5. Redéployer sur Vercel

Après avoir ajouté les variables :
1. Allez dans **Deployments**
2. Cliquez sur **Redeploy** sur le dernier déploiement
3. Ou faites un nouveau commit et push sur GitHub

### 6. Tester l'envoi d'emails

1. Remplissez le formulaire de devis sur votre site
2. Envoyez la demande
3. Vérifiez :
   - ✅ Vous recevez un email de notification
   - ✅ Le client reçoit un email de confirmation
4. Si ça ne fonctionne pas, vérifiez les **Logs** dans Vercel (Functions)

## 🔧 Résolution de problèmes

### Les emails ne sont pas envoyés

1. **Vérifiez les logs Vercel** :
   - Allez dans votre projet Vercel
   - **Deployments** > Cliquez sur un déploiement > **Functions** > `/api/send-email`
   - Regardez les erreurs dans les logs

2. **Vérifiez les variables d'environnement** :
   - Assurez-vous qu'elles sont bien définies
   - Vérifiez qu'elles sont dans tous les environnements

3. **Vérifiez votre clé API Brevo** :
   - Testez-la dans [Brevo API tester](https://developers.brevo.com/api-reference#/operations/sendTransacEmail)

4. **Vérifiez l'email expéditeur** :
   - Il doit être vérifié dans Brevo
   - Vérifiez dans **Settings > Senders & IP**

### Mode développement (sans Brevo)

Si vous n'avez pas encore configuré Brevo, l'application fonctionnera en mode "log" :
- Les données seront affichées dans les logs Vercel
- Aucun email ne sera envoyé
- Un message indiquera que la clé API doit être configurée

## 📚 Documentation utile

- [Documentation API Brevo](https://developers.brevo.com/)
- [SDK Node.js Brevo](https://github.com/getbrevo/brevo-nodejs)
- [Limites du plan gratuit](https://www.brevo.com/pricing/) : 300 emails/jour

## ✅ Checklist de configuration

- [ ] Compte Brevo créé
- [ ] Clé API générée et copiée
- [ ] Domaine vérifié (optionnel mais recommandé)
- [ ] Variables d'environnement ajoutées dans Vercel :
  - [ ] BREVO_API_KEY
  - [ ] YOUR_EMAIL
  - [ ] BREVO_FROM_EMAIL (optionnel)
  - [ ] BREVO_FROM_NAME (optionnel)
- [ ] Projet redéployé sur Vercel
- [ ] Test d'envoi réussi

