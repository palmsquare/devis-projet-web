<?php
/**
 * Shortcode WordPress pour intégrer l'application de devis en plein écran
 * 
 * Installation:
 * 1. Copiez ce code dans le fichier functions.php de votre thème enfant
 * 2. Utilisez [devis_app] dans n'importe quelle page ou article WordPress
 * 
 * Options disponibles:
 * [devis_app] - Affiche l'application avec l'URL par défaut
 * [devis_app url="https://votre-app.vercel.app"] - URL personnalisée
 * [devis_app height="100vh"] - Hauteur personnalisée (défaut: 100vh)
 */

function embed_devis_app_shortcode($atts) {
    // Récupération des attributs avec valeurs par défaut
    $atts = shortcode_atts(array(
        'url' => 'https://devis-projet-web.vercel.app', // Remplacez par votre URL Vercel
        'height' => '100vh',
        'width' => '100%'
    ), $atts);
    
    // Génération du HTML avec iframe en plein écran
    $output = '<div style="position: relative; width: ' . esc_attr($atts['width']) . '; height: ' . esc_attr($atts['height']) . '; min-height: 800px; margin: 0; padding: 0; overflow: hidden; background: white; border: none;">
        <iframe 
            src="' . esc_url($atts['url']) . '" 
            style="width: 100%; height: 100%; border: none; display: block;"
            frameborder="0"
            allowfullscreen
            loading="lazy"
            title="Simulateur de devis">
        </iframe>
    </div>';
    
    return $output;
}
add_shortcode('devis_app', 'embed_devis_app_shortcode');

/**
 * Option: Si vous voulez que ça prenne tout l'écran (fixe)
 * Décommentez cette version à la place de celle ci-dessus
 */
/*
function embed_devis_app_shortcode($atts) {
    $atts = shortcode_atts(array(
        'url' => 'https://devis-projet-web.vercel.app',
    ), $atts);
    
    // Style pour masquer le header/footer WordPress si nécessaire
    $output = '<style>
        .devis-fullscreen-wrapper {
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            z-index: 9999;
            border: none;
            overflow: hidden;
            background: white;
        }
        .devis-fullscreen-wrapper iframe {
            width: 100%;
            height: 100%;
            border: none;
        }
    </style>';
    
    $output .= '<div class="devis-fullscreen-wrapper">
        <iframe 
            src="' . esc_url($atts['url']) . '" 
            frameborder="0"
            allowfullscreen
            loading="lazy"
            title="Simulateur de devis">
        </iframe>
    </div>';
    
    return $output;
}
add_shortcode('devis_app', 'embed_devis_app_shortcode');
*/

