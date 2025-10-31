// API Route Vercel pour envoyer les emails
// Documentation: https://vercel.com/docs/functions

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const formData = req.body;

    // Configuration Resend - Remplacez par votre clé API
    // Obtenez votre clé sur https://resend.com/api-keys
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const YOUR_EMAIL = process.env.YOUR_EMAIL || 'contact@votre-domaine.com';

    if (!RESEND_API_KEY) {
      // Si pas de Resend, utilisez un webhook simple ou envoi via SMTP
      console.log('Email à envoyer:', formData);
      // Pour l'instant, on log juste les données
      return res.status(200).json({ 
        success: true, 
        message: 'Email logged (configure Resend API key for actual sending)' 
      });
    }

    const { Resend } = require('resend');
    const resend = new Resend(RESEND_API_KEY);

    // Formatage des données du formulaire
    const formatFormData = (data) => {
      let formatted = '';

      formatted += `📧 Contact:\n`;
      formatted += `   Email: ${data.email}\n`;
      formatted += `   Nom: ${data.nom}\n`;
      formatted += `   Prénom: ${data.prenom}\n\n`;

      formatted += `🎯 Projet:\n`;
      formatted += `   Type: ${data.typeProjet === 'nouveau' ? 'Création d\'un nouveau site' : 'Refonte d\'un site existant'}\n`;
      if (data.urlSite) {
        formatted += `   URL actuelle: ${data.urlSite}\n`;
      }
      formatted += `   Type de site: ${data.typeSite === 'landing' ? 'Landing page' : 'Site vitrine'}\n`;
      if (data.nombrePages) {
        formatted += `   Nombre de pages: ${data.nombrePages}\n`;
      }
      formatted += `   Design: ${data.niveauDesign === 'template' ? 'Template ajusté' : 'Sur mesure'}\n`;
      if (data.fonctionnalites && data.fonctionnalites.length > 0) {
        formatted += `   Fonctionnalités: ${data.fonctionnalites.join(', ')}\n`;
      }
      formatted += `   Délais: ${data.delais}\n`;
      if (data.besoinsComplementaires && data.besoinsComplementaires.length > 0) {
        formatted += `   Besoins complémentaires: ${data.besoinsComplementaires.join(', ')}\n`;
      }
      if (data.informationsSupp) {
        formatted += `   Informations supplémentaires: ${data.informationsSupp}\n`;
      }

      return formatted;
    };

    // Email pour vous (notification)
    const emailContent = formatFormData(formData);
    
    await resend.emails.send({
      from: 'Devis Web <onboarding@resend.dev>', // Remplacez par votre domaine vérifié
      to: YOUR_EMAIL,
      subject: `Nouvelle demande de devis - ${formData.prenom} ${formData.nom}`,
      text: emailContent,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #ff00a7;">Nouvelle demande de devis</h2>
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Contact</h3>
            <p><strong>Email:</strong> ${formData.email}</p>
            <p><strong>Nom:</strong> ${formData.nom}</p>
            <p><strong>Prénom:</strong> ${formData.prenom}</p>
          </div>
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>Détails du projet</h3>
            <p><strong>Type:</strong> ${formData.typeProjet === 'nouveau' ? 'Création d\'un nouveau site' : 'Refonte d\'un site existant'}</p>
            ${formData.urlSite ? `<p><strong>URL actuelle:</strong> ${formData.urlSite}</p>` : ''}
            <p><strong>Type de site:</strong> ${formData.typeSite === 'landing' ? 'Landing page' : 'Site vitrine'}</p>
            ${formData.nombrePages ? `<p><strong>Nombre de pages:</strong> ${formData.nombrePages}</p>` : ''}
            <p><strong>Design:</strong> ${formData.niveauDesign === 'template' ? 'Template ajusté' : 'Sur mesure'}</p>
            ${formData.fonctionnalites && formData.fonctionnalites.length > 0 ? `<p><strong>Fonctionnalités:</strong> ${formData.fonctionnalites.join(', ')}</p>` : ''}
            <p><strong>Délais:</strong> ${formData.delais}</p>
            ${formData.besoinsComplementaires && formData.besoinsComplementaires.length > 0 ? `<p><strong>Besoins complémentaires:</strong> ${formData.besoinsComplementaires.join(', ')}</p>` : ''}
            ${formData.informationsSupp ? `<p><strong>Informations supplémentaires:</strong><br>${formData.informationsSupp}</p>` : ''}
          </div>
        </div>
      `
    });

    // Email de confirmation pour le client
    await resend.emails.send({
      from: 'Devis Web <onboarding@resend.dev>', // Remplacez par votre domaine vérifié
      to: formData.email,
      subject: 'Merci pour votre demande de devis',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #ff00a7;">Merci pour votre demande, ${formData.prenom} !</h2>
          <p>Nous avons bien reçu votre demande de devis et nous reviendrons vers vous rapidement avec une proposition détaillée.</p>
          <p>À bientôt,<br>L'équipe</p>
        </div>
      `
    });

    return res.status(200).json({ success: true, message: 'Emails sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    return res.status(500).json({ error: 'Failed to send email', details: error.message });
  }
}

