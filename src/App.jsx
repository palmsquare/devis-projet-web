import { useState, useEffect } from 'react'
import { 
  Mail, User, Globe, RefreshCw, Layout, Palette, 
  Zap, Calendar, Package, ChevronLeft, ChevronRight, 
  FileText, CheckCircle2, Sparkles, Code, MessageSquare,
  DollarSign, TrendingUp
} from 'lucide-react'
import './App.css'

function App() {
  const [currentStep, setCurrentStep] = useState(0)
  const [direction, setDirection] = useState('forward')
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [showError, setShowError] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [formData, setFormData] = useState({
    email: '',
    nom: '',
    prenom: '',
    typeProjet: '',
    urlSite: '',
    typeSite: '',
    nombrePages: '',
    niveauDesign: '',
    fonctionnalites: [],
    delais: '',
    besoinsComplementaires: [],
    informationsSupp: ''
  })

  // Calcul des prix
  const calculatePricing = () => {
    let prixFixe = 0
    let prixMensuel = 0

    // Prix de base selon le type de site
    if (formData.typeSite === 'landing') {
      prixFixe += 990
    } else if (formData.typeSite === 'vitrine') {
      prixFixe += 2490
    }

    // Niveau de design
    if (formData.niveauDesign === 'sur-mesure') {
      if (formData.typeSite === 'landing') {
        prixFixe += 500
      } else if (formData.typeSite === 'vitrine') {
        prixFixe += 1500
      }
    }

    // Fonctionnalités
    if (formData.fonctionnalites.includes('multilingue')) prixFixe += 250
    if (formData.fonctionnalites.includes('paiement')) prixFixe += 150
    if (formData.fonctionnalites.includes('newsletter')) prixFixe += 150
    if (formData.fonctionnalites.includes('crm')) prixFixe += 150

    // Besoins complémentaires
    if (formData.besoinsComplementaires.includes('charte')) prixFixe += 500
    if (formData.besoinsComplementaires.includes('logo')) prixFixe += 500
    if (formData.besoinsComplementaires.includes('redaction')) prixFixe += 500
    if (formData.besoinsComplementaires.includes('redactionPages')) prixFixe += 500
    if (formData.besoinsComplementaires.includes('maintenance')) prixMensuel += 50
    if (formData.besoinsComplementaires.includes('tma')) prixMensuel += 70
    if (formData.besoinsComplementaires.includes('hebergement')) prixMensuel += 10
    if (formData.besoinsComplementaires.includes('domaine')) prixFixe += 50
    if (formData.besoinsComplementaires.includes('email')) prixFixe += 50
    if (formData.besoinsComplementaires.includes('seo')) prixMensuel += 700
    // redactionArticles est à la demande, prix variable 50-100€/article
    if (formData.besoinsComplementaires.includes('ads')) prixMensuel += 500

    return { prixFixe, prixMensuel }
  }

  const pricing = calculatePricing()

  // Définition des étapes
  const steps = [
    {
      id: 'contact',
      title: 'Informations de contact',
      icon: Mail,
      component: ContactStep
    },
    {
      id: 'projet',
      title: 'Votre projet',
      icon: Globe,
      component: ProjetStep
    },
    {
      id: 'typeSite',
      title: 'Type de site souhaité',
      icon: Layout,
      component: TypeSiteStep
    },
    {
      id: 'nombrePages',
      title: 'Nombre de pages',
      icon: FileText,
      component: NombrePagesStep,
      condition: () => formData.typeSite === 'vitrine'
    },
    {
      id: 'design',
      title: 'Niveau de design',
      icon: Palette,
      component: DesignStep
    },
    {
      id: 'fonctionnalites',
      title: 'Fonctionnalités',
      icon: Zap,
      component: FonctionnalitesStep,
      condition: () => formData.typeSite === 'vitrine'
    },
    {
      id: 'delais',
      title: 'Délais',
      icon: Calendar,
      component: DelaisStep
    },
    {
      id: 'complementaires',
      title: 'Besoins complémentaires',
      icon: Package,
      component: ComplementairesStep
    },
    {
      id: 'infosSupp',
      title: 'Informations supplémentaires',
      icon: MessageSquare,
      component: InfosSuppStep
    }
  ]

  // Filtrer les étapes selon les conditions
  const activeSteps = steps.filter(step => !step.condition || step.condition())

  const currentStepData = activeSteps[currentStep]

  // Validation des champs obligatoires
  const validateCurrentStep = () => {
    const stepId = currentStepData.id
    
    switch(stepId) {
      case 'contact':
        if (!formData.email || !formData.nom || !formData.prenom) {
          setErrorMessage('Tous les champs sont obligatoires')
          return false
        }
        // Validation email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(formData.email)) {
          setErrorMessage('Veuillez entrer un email valide')
          return false
        }
        break
      
      case 'projet':
        if (!formData.typeProjet) {
          setErrorMessage('Veuillez sélectionner un type de projet')
          return false
        }
        if (formData.typeProjet === 'refonte' && !formData.urlSite) {
          setErrorMessage('Veuillez indiquer l\'URL de votre site actuel')
          return false
        }
        break
      
      case 'typeSite':
        if (!formData.typeSite) {
          setErrorMessage('Veuillez sélectionner un type de site')
          return false
        }
        break
      
      case 'nombrePages':
        if (!formData.nombrePages) {
          setErrorMessage('Veuillez sélectionner le nombre de pages')
          return false
        }
        break
      
      case 'design':
        if (!formData.niveauDesign) {
          setErrorMessage('Veuillez sélectionner un niveau de design')
          return false
        }
        break
      
      case 'delais':
        if (!formData.delais) {
          setErrorMessage('Veuillez sélectionner un délai')
          return false
        }
        break
    }
    
    return true
  }

  const goToNextStep = () => {
    if (validateCurrentStep()) {
      if (currentStep < activeSteps.length - 1) {
        setDirection('forward')
        setCurrentStep(currentStep + 1)
        setShowError(false)
        setErrorMessage('')
      }
    } else {
      setShowError(true)
      setTimeout(() => setShowError(false), 600)
    }
  }

  const goToPrevStep = () => {
    if (currentStep > 0) {
      setDirection('backward')
      setCurrentStep(currentStep - 1)
      setShowError(false)
      setErrorMessage('')
    }
  }

  const updateFormData = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    // Effacer l'erreur quand l'utilisateur modifie le formulaire
    if (showError) {
      setShowError(false)
      setErrorMessage('')
    }
  }

  const StepComponent = currentStepData.component

  // Si le formulaire a été soumis, afficher la page de remerciement
  if (isSubmitted) {
    return <ThankYouPage pricing={pricing} />
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        {/* Indicateur de progression */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-700 text-sm font-medium">
              Étape {currentStep + 1} sur {activeSteps.length}
            </span>
            <span className="text-gray-700 text-sm font-medium">
              {Math.round(((currentStep + 1) / activeSteps.length) * 100)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div 
              className="h-full rounded-full transition-all duration-500 ease-out"
              style={{ backgroundColor: '#ff00a7' }}
              style={{ width: `${((currentStep + 1) / activeSteps.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Carte principale */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          {/* En-tête de l'étape */}
          <div className="p-6" style={{ background: 'linear-gradient(to right, #ff00a7, #ff33b8)' }}>
            <div className="flex items-center gap-3 text-white">
              {currentStepData.icon && <currentStepData.icon className="w-8 h-8" />}
              <h2 className="text-2xl font-bold">{currentStepData.title}</h2>
            </div>
          </div>

          {/* Message d'erreur */}
          {showError && errorMessage && (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mx-8 mt-6 animate-fade-in">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <p className="text-sm font-medium text-red-800">{errorMessage}</p>
              </div>
            </div>
          )}

          {/* Contenu de l'étape */}
          <div className={`p-8 min-h-[400px] ${direction === 'forward' ? 'animate-slide-in' : 'animate-fade-in'}`}>
            <StepComponent 
              formData={formData}
              updateFormData={updateFormData}
              goToNext={goToNextStep}
            />
          </div>

          {/* Navigation */}
          <div className="border-t border-gray-200 p-6 bg-gray-50">
            <div className="flex justify-between items-center">
              <button
                onClick={goToPrevStep}
                disabled={currentStep === 0}
                className={`btn-secondary flex items-center gap-2 ${currentStep === 0 ? '!bg-gray-200 !text-gray-400 !border-gray-300' : ''}`}
              >
                <ChevronLeft className="w-5 h-5" />
                Retour
              </button>

              {currentStep === activeSteps.length - 1 ? (
                <button
                  onClick={() => {
                    if (validateCurrentStep()) {
                      console.log('Données du formulaire:', formData)
                      setIsSubmitted(true)
                    } else {
                      setShowError(true)
                      setTimeout(() => setShowError(false), 600)
                    }
                  }}
                  className="btn-primary flex items-center gap-2"
                >
                  <CheckCircle2 className="w-5 h-5" />
                  Envoyer ma demande
                </button>
              ) : (
                <button
                  onClick={goToNextStep}
                  className="btn-primary flex items-center gap-2"
                >
                  Suivant
                  <ChevronRight className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Affichage du total */}
        <div className="mt-6 bg-white rounded-xl shadow-lg p-6 animate-fade-in">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <DollarSign className="w-8 h-8" style={{ color: '#ff00a7' }} />
              <div>
                <h3 className="font-bold text-gray-800 text-lg">Estimation du projet</h3>
                <p className="text-sm text-gray-600">Mise à jour en temps réel</p>
              </div>
            </div>
            <div className="text-right">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold" style={{ color: '#ff00a7' }}>
                  {pricing.prixFixe.toLocaleString('fr-FR')} €
                </span>
                {pricing.prixMensuel > 0 && (
                  <span className="text-lg text-gray-600">
                    + {pricing.prixMensuel.toLocaleString('fr-FR')} €/mois
                  </span>
                )}
              </div>
              <div className="text-sm text-gray-500 mt-1">
                {pricing.prixMensuel > 0 ? (
                  <>
                    <span className="font-medium">Coût fixe:</span> {pricing.prixFixe.toLocaleString('fr-FR')} € • 
                    <span className="font-medium ml-1">Mensuel:</span> {pricing.prixMensuel.toLocaleString('fr-FR')} €
                  </>
                ) : (
                  <span className="font-medium">Coût fixe uniquement</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Composants pour chaque étape

function ContactStep({ formData, updateFormData }) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Email <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="email"
            required
            value={formData.email}
            onChange={(e) => updateFormData('email', e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            placeholder="votre.email@exemple.com"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Nom <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            required
            value={formData.nom}
            onChange={(e) => updateFormData('nom', e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            placeholder="Dupont"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Prénom <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            required
            value={formData.prenom}
            onChange={(e) => updateFormData('prenom', e.target.value)}
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
            placeholder="Marie"
          />
        </div>
      </div>
    </div>
  )
}

function ProjetStep({ formData, updateFormData, goToNext }) {
  const options = [
    { value: 'nouveau', label: 'Création d\'un nouveau site', icon: Sparkles },
    { value: 'refonte', label: 'Refonte d\'un site existant', icon: RefreshCw }
  ]

  const handleSelection = (value) => {
    updateFormData('typeProjet', value)
    // Si c'est "nouveau site", passer automatiquement à l'étape suivante
    if (value === 'nouveau') {
      setTimeout(() => goToNext(), 300)
    }
  }

  return (
    <div className="space-y-6">
      <p className="text-gray-700 font-medium mb-4">Quel est votre projet ? <span className="text-red-500">*</span></p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {options.map(option => (
          <button
            key={option.value}
            onClick={() => handleSelection(option.value)}
            className={`p-6 border-2 rounded-xl transition-all hover:scale-105 ${
              formData.typeProjet === option.value
                ? 'border-gray-200'
                : 'border-gray-200'
            }`}
          >
            <option.icon className={`w-12 h-12 mx-auto mb-3 ${
                formData.typeProjet === option.value ? 'text-gray-900' : 'text-gray-400'
            }`} />
            <p className={`font-medium ${
                formData.typeProjet === option.value ? 'text-gray-900' : 'text-gray-700'
            }`}>
              {option.label}
            </p>
          </button>
        ))}
      </div>

      {formData.typeProjet === 'refonte' && (
        <div className="mt-6 animate-fade-in">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Merci d'indiquer l'URL de votre site actuel <span className="text-red-500">*</span>
          </label>
          <div className="relative">
            <Globe className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="url"
              required
              value={formData.urlSite}
              onChange={(e) => updateFormData('urlSite', e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
              placeholder="https://www.monsite.fr"
            />
          </div>
        </div>
      )}
    </div>
  )
}

function TypeSiteStep({ formData, updateFormData }) {
  const options = [
    { 
      value: 'vitrine', 
      label: 'Site vitrine', 
      icon: Layout,
      description: 'Un site pour présenter votre activité',
      price: 2490
    },
    { 
      value: 'landing', 
      label: 'Landing page', 
      icon: FileText,
      description: 'Une page de vente optimisée',
      price: 990
    }
  ]

  return (
    <div className="space-y-6">
      <p className="text-gray-700 font-medium mb-4">
        Quel type de site web souhaitez-vous créer ? <span className="text-red-500">*</span>
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {options.map(option => (
          <button
            key={option.value}
            onClick={() => updateFormData('typeSite', option.value)}
            className={`p-6 border-2 rounded-xl transition-all hover:scale-105 ${
              formData.typeSite === option.value
                ? 'border-gray-200'
                : 'border-gray-200'
            }`}
          >
            <option.icon className={`w-12 h-12 mx-auto mb-3 ${
              formData.typeSite === option.value ? 'text-gray-900' : 'text-gray-400'
            }`} />
            <p className={`font-bold text-lg mb-1 ${
              formData.typeSite === option.value ? 'text-gray-900' : 'text-gray-700'
            }`}>
              {option.label}
            </p>
            <p className="text-sm text-gray-600 mb-2">{option.description}</p>
            <p className="text-xs text-gray-500 mb-1">À partir de :</p>
            <p className="text-xl font-bold" style={{ color: '#ff00a7' }}>{option.price} € HT</p>
          </button>
        ))}
      </div>
    </div>
  )
}

function NombrePagesStep({ formData, updateFormData }) {
  const options = [
    { 
      value: '1-5', 
      label: '1 à 5 pages',
      description: 'ex : Accueil, À propos, Blog, Contact, Article',
      icon: FileText
    },
    { 
      value: '6-8', 
      label: '6 à 8 pages',
      description: 'ex : + Formation, Ressources, Landing page complémentaire…',
      icon: FileText
    },
    { 
      value: '10+', 
      label: 'Plus de 10 pages',
      description: 'ex : Offres d\'emploi, services multiples, etc.',
      icon: FileText
    }
  ]

  return (
    <div className="space-y-6">
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-blue-800">
          💡 <span className="font-semibold">Un gabarit</span> = une mise en page unique réutilisable. 
          Exemple : accueil, à propos, contact, article de blog, etc.
        </p>
      </div>

      <p className="text-gray-700 font-medium mb-4">
        Combien de gabarits de pages comportera votre site ? <span className="text-red-500">*</span>
      </p>
      
      <div className="space-y-3">
        {options.map(option => (
          <button
            key={option.value}
            onClick={() => updateFormData('nombrePages', option.value)}
            className={`w-full p-5 border-2 rounded-xl transition-all hover:scale-102 text-left ${
              formData.nombrePages === option.value
                ? 'border-gray-200'
                : 'border-gray-200'
            }`}
          >
            <div className="flex items-start gap-4">
              <option.icon className={`w-8 h-8 flex-shrink-0 ${
                formData.nombrePages === option.value ? 'text-gray-900' : 'text-gray-400'
              }`} />
              <div>
                <p className={`font-bold mb-1 ${
                  formData.nombrePages === option.value ? 'text-gray-900' : 'text-gray-700'
                }`}>
                  {option.label}
                </p>
                <p className="text-sm text-gray-600">{option.description}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

function DesignStep({ formData, updateFormData }) {
  const options = [
    { 
      value: 'template', 
      label: 'Design à partir d\'un template ajusté',
      description: 'Un design adapté à votre image',
      icon: Layout,
      price: 0
    },
    { 
      value: 'sur-mesure', 
      label: 'Design sur mesure',
      description: 'Un design 100% sur mesure',
      icon: Palette,
      price: formData.typeSite === 'landing' ? 500 : 1500
    }
  ]

  return (
    <div className="space-y-6">
      <p className="text-gray-700 font-medium mb-4">
        Quel niveau de design souhaitez-vous ? <span className="text-red-500">*</span>
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {options.map(option => (
          <button
            key={option.value}
            onClick={() => updateFormData('niveauDesign', option.value)}
            className={`p-6 border-2 rounded-xl transition-all hover:scale-105 ${
              formData.niveauDesign === option.value
                ? 'border-gray-200'
                : 'border-gray-200'
            }`}
          >
            <option.icon className={`w-12 h-12 mx-auto mb-3 ${
              formData.niveauDesign === option.value ? 'text-gray-900' : 'text-gray-400'
            }`} />
            <p className={`font-bold text-lg mb-1 ${
              formData.niveauDesign === option.value ? 'text-gray-900' : 'text-gray-700'
            }`}>
              {option.label}
            </p>
            <p className="text-sm text-gray-600 mb-3">{option.description}</p>
            <p className={`text-lg font-bold ${option.price > 0 ? '' : 'text-green-600'}`} style={option.price > 0 ? { color: '#ff00a7' } : {}}>
              {option.price > 0 ? `+${option.price} €` : 'Inclus'}
            </p>
          </button>
        ))}
      </div>
    </div>
  )
}

function FonctionnalitesStep({ formData, updateFormData }) {
  const toggleFonctionnalite = (value) => {
    const current = formData.fonctionnalites || []
    if (current.includes(value)) {
      updateFormData('fonctionnalites', current.filter(f => f !== value))
    } else {
      updateFormData('fonctionnalites', [...current, value])
    }
  }

  const options = [
    { value: 'multilingue', label: 'Version multilingue', icon: Globe, price: 250 },
    { value: 'blog', label: 'Blog', icon: FileText, price: 0 },
    { value: 'paiement', label: 'Paiement en ligne', icon: DollarSign, price: 150 },
    { value: 'newsletter', label: 'Inscription à la newsletter', icon: Mail, price: 150 },
    { value: 'crm', label: 'Connexion à votre CRM (Brevo, HubSpot, Mailer Lite ou autre)', icon: Code, price: 150 }
  ]

  return (
    <div className="space-y-6">
      <p className="text-gray-700 font-medium mb-4">
        Quelles fonctionnalités souhaitez-vous intégrer à votre site ?
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {options.map(option => {
          const isSelected = formData.fonctionnalites?.includes(option.value)
          return (
            <button
              key={option.value}
              onClick={() => toggleFonctionnalite(option.value)}
              className={`p-5 border-2 rounded-xl transition-all hover:scale-105 text-left ${
                isSelected
                  ? 'border-indigo-600 bg-indigo-50'
                  : 'border-gray-200 hover:border-indigo-300'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <option.icon className={`w-8 h-8 flex-shrink-0 ${
                    isSelected ? 'text-gray-900' : 'text-gray-400'
                  }`} />
                  <div>
                    <p className={`font-bold ${
                      isSelected ? 'text-gray-900' : 'text-gray-700'
                    }`}>
                      {option.label}
                    </p>
                    <p className={`text-sm mt-1 ${
                      option.price > 0 ? 'font-medium' : 'text-green-600'
                    }`}>
                      {option.price > 0 ? `+${option.price} €` : 'Inclus'}
                    </p>
                  </div>
                </div>
                {isSelected && (
                  <CheckCircle2 className="w-6 h-6" style={{ color: '#ff00a7' }} />
                )}
              </div>
            </button>
          )
        })}
      </div>

      <div className="mt-6">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Autres fonctionnalités (à préciser)
        </label>
        <textarea
          value={formData.autresFonctionnalites || ''}
          onChange={(e) => updateFormData('autresFonctionnalites', e.target.value)}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
          rows="3"
          placeholder="Décrivez d'autres fonctionnalités dont vous auriez besoin..."
        />
      </div>
    </div>
  )
}

function DelaisStep({ formData, updateFormData }) {
  const options = [
    { value: 'rapide', label: 'Rapidement (dès que possible)', icon: Zap },
    { value: '1mois', label: 'D\'ici 1 mois', icon: Calendar },
    { value: '3mois', label: 'D\'ici 3 mois', icon: Calendar }
  ]

  return (
    <div className="space-y-6">
      <p className="text-gray-700 font-medium mb-4">
        Quand souhaitez-vous démarrer votre projet ? <span className="text-red-500">*</span>
      </p>
      
      <div className="space-y-3">
        {options.map(option => (
          <button
            key={option.value}
            onClick={() => updateFormData('delais', option.value)}
            className={`w-full p-5 border-2 rounded-xl transition-all hover:scale-102 ${
              formData.delais === option.value
                ? 'border-gray-200'
                : 'border-gray-200'
            }`}
          >
            <div className="flex items-center gap-4">
              <option.icon className={`w-10 h-10 ${
                formData.delais === option.value ? 'text-gray-900' : 'text-gray-400'
              }`} />
              <p className={`font-bold text-lg ${
                formData.delais === option.value ? 'text-gray-900' : 'text-gray-700'
              }`}>
                {option.label}
              </p>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

function ComplementairesStep({ formData, updateFormData }) {
  const toggleBesoin = (value) => {
    const current = formData.besoinsComplementaires || []
    if (current.includes(value)) {
      updateFormData('besoinsComplementaires', current.filter(b => b !== value))
    } else {
      updateFormData('besoinsComplementaires', [...current, value])
    }
  }

  const options = [
    { value: 'charte', label: 'Création d\'une nouvelle charte graphique', icon: Palette, price: 500, type: 'fixe' },
    { value: 'logo', label: 'Création de logo', icon: Sparkles, price: 500, type: 'fixe' },
    { value: 'redaction', label: 'Rédaction par un copywriter', icon: FileText, price: 500, type: 'fixe' },
    { value: 'redactionPages', label: 'Rédaction des pages par un copywriter', icon: FileText, price: 500, type: 'fixe', unit: '/page' },
    { value: 'maintenance', label: 'Maintenance du site', icon: Code, price: 50, type: 'mensuel' },
    { value: 'tma', label: 'Gestion du site après mise en ligne (TMA)', icon: Code, price: 70, type: 'mensuel' },
    { value: 'hebergement', label: 'Hébergement web', icon: Globe, price: 10, type: 'mensuel' },
    { value: 'domaine', label: 'Nom de domaine', icon: Globe, price: 50, type: 'fixe' },
    { value: 'email', label: 'Adresse mail pro (1 à 5)', icon: Mail, price: 50, type: 'fixe' },
    { value: 'seo', label: 'Stratégie SEO', icon: TrendingUp, price: 700, type: 'mensuel', note: 'À partir de' },
    { value: 'redactionArticles', label: 'Rédaction d\'article optimisé SEO', icon: FileText, price: 0, type: 'fixe', note: '50-100€/article' },
    { value: 'ads', label: 'Publicité en ligne (ADS) - Frais de gestion + budget ADS', icon: TrendingUp, price: 500, type: 'mensuel' }
  ]

  return (
    <div className="space-y-6">
      <p className="text-gray-700 font-medium mb-4">
        Souhaitez-vous que nous vous accompagnions sur d'autres aspects ?
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {options.map(option => {
          const isSelected = formData.besoinsComplementaires?.includes(option.value)
          return (
            <button
              key={option.value}
              onClick={() => toggleBesoin(option.value)}
              className={`p-5 border-2 rounded-xl transition-all hover:scale-105 text-left ${
                isSelected
                  ? 'border-indigo-600 bg-indigo-50'
                  : 'border-gray-200 hover:border-indigo-300'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <option.icon className={`w-8 h-8 flex-shrink-0 ${
                    isSelected ? 'text-gray-900' : 'text-gray-400'
                  }`} />
                  <div>
                    <p className={`font-bold text-sm mb-1 ${
                      isSelected ? 'text-gray-900' : 'text-gray-700'
                    }`}>
                      {option.label}
                    </p>
                    {option.note ? (
                      <p className="text-sm font-medium" style={{ color: '#ff00a7' }}>
                        {option.note === 'À partir de' ? `${option.note} ${option.price} €${option.type === 'mensuel' ? '/mois' : ''}` : option.note}
                      </p>
                    ) : option.price > 0 ? (
                      <p className="text-sm font-medium" style={{ color: '#ff00a7' }}>
                        +{option.price} €{option.type === 'mensuel' ? '/mois' : ''}{option.unit || ''}
                      </p>
                    ) : (
                      <p className="text-sm text-green-600">Sur devis</p>
                    )}
                  </div>
                </div>
                {isSelected && (
                  <CheckCircle2 className="w-6 h-6" style={{ color: '#ff00a7' }} />
                )}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}

function InfosSuppStep({ formData, updateFormData }) {
  return (
    <div className="space-y-6">
      <p className="text-gray-700 font-medium mb-4">
        Souhaitez-vous nous en dire plus sur votre projet ?
      </p>
      
      <textarea
        value={formData.informationsSupp}
        onChange={(e) => updateFormData('informationsSupp', e.target.value)}
        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent"
        rows="8"
        placeholder="Décrivez votre projet, vos besoins spécifiques, vos attentes, vos objectifs, votre public cible, etc."
      />

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mt-8">
        <div className="flex items-start gap-4">
          <CheckCircle2 className="w-8 h-8 text-blue-600 flex-shrink-0" />
          <div>
            <h3 className="font-bold text-blue-900 text-lg mb-2">Votre demande est prête !</h3>
            <p className="text-blue-800">
              Si vous souhaitez un devis plus ajusté, vous pouvez envoyer votre demande. Le calcul ci-dessous est approximatif et peut évoluer suite à nos échanges pour mieux répondre à vos besoins spécifiques.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

function ThankYouPage({ pricing }) {
  useEffect(() => {
    // Charger le script Cal.com
    const script = document.createElement('script')
    script.src = 'https://app.cal.com/embed/embed.js'
    script.async = true
    document.head.appendChild(script)

    script.onload = () => {
      // Initialiser Cal.com une fois le script chargé
      if (window.Cal) {
        window.Cal("init", "appel-de-decouverte", {origin:"https://app.cal.com"})
        
        window.Cal.ns["appel-de-decouverte"]("inline", {
          elementOrSelector:"#my-cal-inline-appel-de-decouverte",
          config: {"layout":"month_view"},
          calLink: "palmsquare/appel-de-decouverte",
        })

        window.Cal.ns["appel-de-decouverte"]("ui", {
          "cssVarsPerTheme":{
            "light":{"cal-brand":"#ea32a6"},
            "dark":{"cal-brand":"#fafafa"}
          },
          "hideEventTypeDetails":false,
          "layout":"month_view"
        })
      }
    }

    return () => {
      // Nettoyer le script lors du démontage
      if (script.parentNode) {
        script.parentNode.removeChild(script)
      }
    }
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-6xl">
        {/* En-tête de remerciement */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="mb-6">
            <CheckCircle2 className="w-20 h-20 text-white mx-auto mb-4" />
          </div>
          <h1 className="text-4xl font-bold text-white mb-3">
            Merci pour votre demande !
          </h1>
          <p className="text-white/90 text-xl mb-2">
            Votre demande de devis a bien été envoyée
          </p>
          <p className="text-white/80 text-lg">
            Estimation : <span className="font-bold">{pricing.prixFixe.toLocaleString('fr-FR')} € HT</span>
            {pricing.prixMensuel > 0 && (
              <span> + {pricing.prixMensuel.toLocaleString('fr-FR')} €/mois</span>
            )}
          </p>
        </div>

        {/* Section calendrier */}
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden mb-6">
          <div className="p-6" style={{ background: 'linear-gradient(to right, #ff00a7, #ff33b8)' }}>
            <div className="text-center text-white">
              <Calendar className="w-10 h-10 mx-auto mb-3" />
              <h2 className="text-2xl font-bold mb-2">Réservez un rendez-vous avec nous</h2>
              <p className="text-white/90">Gagnez du temps et planifiez directement un appel de découverte</p>
            </div>
          </div>

          <div className="p-6">
            <div style={{width:'100%', height:'800px', overflow:'scroll'}} id="my-cal-inline-appel-de-decouverte"></div>
          </div>
        </div>

        {/* Note finale */}
        <div className="text-center">
          <p className="text-white/80 text-sm">
            Nous reviendrons vers vous rapidement par email avec une proposition détaillée
          </p>
        </div>
      </div>
    </div>
  )
}

export default App

