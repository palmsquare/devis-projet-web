# Configuration de l'envoi d'emails

## Option 1 : Utiliser Resend (Recommandé)

1. Créez un compte sur [Resend.com](https://resend.com)
2. Obtenez votre clé API dans les paramètres
3. Ajoutez les variables d'environnement dans Vercel :
   - `RESEND_API_KEY` : Votre clé API Resend
   - `YOUR_EMAIL` : L'email où recevoir les notifications (ex: contact@votredomaine.com)

4. Installez Resend :
```bash
npm install resend
```

## Option 2 : Utiliser FormSubmit (Simple, gratuit)

Modifiez la fonction `handleSubmit` dans `src/App.jsx` :

```javascript
const handleSubmit = async () => {
  setIsSending(true)
  try {
    // Utiliser FormSubmit (remplacez par votre email)
    const response = await fetch('https://formsubmit.co/ajax/VOTRE_EMAIL@exemple.com', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        name: `${formData.prenom} ${formData.nom}`,
        email: formData.email,
        subject: 'Nouvelle demande de devis',
        message: JSON.stringify(formData, null, 2)
      })
    })

    const data = await response.json()
    
    if (response.ok) {
      setIsSubmitted(true)
      setShowRecap(false)
    } else {
      throw new Error('Erreur lors de l\'envoi')
    }
  } catch (error) {
    console.error('Error:', error)
    setIsSubmitted(true)
    setShowRecap(false)
  } finally {
    setIsSending(false)
  }
}
```

## Option 3 : Webhook personnalisé

Vous pouvez remplacer l'appel API par votre propre endpoint webhook.

