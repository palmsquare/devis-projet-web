// Vercel Serverless Function pour envoyer les emails
// Documentation: https://vercel.com/docs/functions/serverless-functions

export default async function handler(req, res) {
  // Autoriser les requêtes CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const formData = req.body;

    // Configuration Resend
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    const YOUR_EMAIL = process.env.YOUR_EMAIL || 'contact@votre-domaine.com';

    if (!RESEND_API_KEY) {
      // Mode développement : log les données
      console.log('📧 Email à envoyer (mode dev):', JSON.stringify(formData, null, 2));
      return res.status(200).json({ 
        success: true, 
        message: 'Email logged in development mode. Configure RESEND_API_KEY for production.',
        data: formData
      });
    }

    // Import dynamique de Resend
    const { Resend } = await import('resend');
    const resend = new Resend(RESEND_API_KEY);

    // Formatage HTML du récapitulatif
    const formatHTML = (data) => {
      return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #ff00a7;">Nouvelle demande de devis</h2>
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Contact</h3>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Nom:</strong> ${data.nom}</p>
            <p><strong>Prénom:</strong> ${data.prenom}</p>
          </div>
          <div style="background: #f5f5f5; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="color: #333; margin-top: 0;">Détails du projet</h3>
            <p><strong>Type:</strong> ${data.typeProjet === 'nouveau' ? 'Création d\'un nouveau site' : 'Refonte d\'un site existant'}</p>
            ${data.urlSite ? `<p><strong>URL actuelle:</strong> <a href="${data.urlSite}">${data.urlSite}</a></p>` : ''}
            <p><strong>Type de site:</strong> ${data.typeSite === 'landing' ? 'Landing page' : 'Site vitrine'}</p>
            ${data.nombrePages ? `<p><strong>Nombre de pages:</strong> ${data.nombrePages}</p>` : ''}
            <p><strong>Design:</strong> ${data.niveauDesign === 'template' ? 'Template ajusté' : 'Sur mesure'}</p>
            ${data.fonctionnalites && data.fonctionnalites.length > 0 ? `<p><strong>Fonctionnalités:</strong> ${data.fonctionnalites.join(', ')}</p>` : ''}
            <p><strong>Délais:</strong> ${data.delais === 'rapide' ? 'Rapidement' : data.delais === '1mois' ? 'D\'ici 1 mois' : 'D\'ici 3 mois'}</p>
            ${data.besoinsComplementaires && data.besoinsComplementaires.length > 0 ? `<p><strong>Besoins complémentaires:</strong> ${data.besoinsComplementaires.join(', ')}</p>` : ''}
            ${data.informationsSupp ? `<div style="margin-top: 15px;"><strong>Informations supplémentaires:</strong><br><p style="white-space: pre-wrap; background: white; padding: 10px; border-radius: 4px;">${data.informationsSupp}</p></div>` : ''}
          </div>
        </div>
      `;
    };

    // Email pour vous (notification)
    await resend.emails.send({
      from: 'Devis Web <onboarding@resend.dev>', // Remplacez par votre domaine vérifié sur Resend
      to: YOUR_EMAIL,
      subject: `🚀 Nouvelle demande de devis - ${formData.prenom} ${formData.nom}`,
      html: formatHTML(formData)
    });

    // Email de confirmation pour le client
    await resend.emails.send({
      from: 'Devis Web <onboarding@resend.dev>',
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
    console.error('❌ Error sending email:', error);
    return res.status(500).json({ 
      error: 'Failed to send email', 
      details: error.message 
    });
  }
}
