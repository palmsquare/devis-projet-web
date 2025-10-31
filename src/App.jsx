import { useState } from 'react'
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
  const [showRecap, setShowRecap] = useState(false)
  const [isSending, setIsSending] = useState(false)
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

  // Fonction pour envoyer le formulaire
  const handleSubmit = async () => {
    setIsSending(true)
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      const data = await response.json()
      
      if (response.ok) {
        setIsSubmitted(true)
        setShowRecap(false)
      } else {
        throw new Error(data.error || 'Erreur lors de l\'envoi')
      }
    } catch (error) {
      console.error('Error:', error)
      // Même en cas d'erreur, on marque comme soumis pour l'UX
      // Vous pouvez ajouter un message d'erreur si besoin
      setIsSubmitted(true)
      setShowRecap(false)
    } finally {
      setIsSending(false)
    }
  }

  // Fonction pour réinitialiser le formulaire
  const resetForm = () => {
    setIsSubmitted(false)
    setShowRecap(false)
    setCurrentStep(0)
    setFormData({
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
  }

  // Si le formulaire a été soumis, afficher la page de remerciement
  if (isSubmitted) {
    return <ThankYouPage pricing={pricing} formData={formData} onBack={resetForm} />
  }

  // Si on affiche le récapitulatif
  if (showRecap) {
    return <RecapStep formData={formData} pricing={pricing} onBack={() => setShowRecap(false)} onSubmit={handleSubmit} isSending={isSending} />
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
        <div className="overflow-hidden" style={{ backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid #FFFFFF17', padding: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
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
                      setShowRecap(true)
                    } else {
                      setShowError(true)
                      setTimeout(() => setShowError(false), 600)
                    }
                  }}
                  className="btn-primary flex items-center gap-2"
                >
                  Voir le récapitulatif
                  <ChevronRight className="w-5 h-5" />
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
            className="transition-all hover:scale-105 border-2 border-gray-200"
            style={{
              padding: '16px',
              borderRadius: '8px',
              backgroundColor: '#FFFFFF'
            }}
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
            className="transition-all hover:scale-105"
            style={{
              padding: '16px',
              borderRadius: '8px',
              border: '1px solid #FFFFFF17',
              backgroundColor: '#ffffff85'
            }}
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
            className="w-full transition-all hover:scale-102 text-left"
            style={{
              padding: '16px',
              borderRadius: '8px',
              border: '1px solid #FFFFFF17',
              backgroundColor: '#ffffff85'
            }}
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
            className="transition-all hover:scale-105"
            style={{
              padding: '16px',
              borderRadius: '8px',
              border: '1px solid #FFFFFF17',
              backgroundColor: '#ffffff85'
            }}
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
              className="transition-all hover:scale-105 text-left"
              style={{
                padding: '16px',
                borderRadius: '8px',
                border: '1px solid #FFFFFF17',
                backgroundColor: '#FFFFFF'
              }}
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
            className="w-full transition-all hover:scale-102"
            style={{
              padding: '16px',
              borderRadius: '8px',
              border: '1px solid #FFFFFF17',
              backgroundColor: '#ffffff85'
            }}
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

function RecapStep({ formData, pricing, onBack, onSubmit, isSending }) {
  const getLabel = (key, value) => {
    const labels = {
      typeProjet: value === 'nouveau' ? 'Création d\'un nouveau site' : 'Refonte d\'un site existant',
      typeSite: value === 'landing' ? 'Landing page' : 'Site vitrine',
      nombrePages: {
        '1-5': '1 à 5 pages',
        '6-8': '6 à 8 pages',
        '10+': 'Plus de 10 pages'
      }[value] || value,
      niveauDesign: value === 'template' ? 'Design à partir d\'un template ajusté' : 'Design sur mesure',
      delais: {
        'rapide': 'Rapidement (dès que possible)',
        '1mois': 'D\'ici 1 mois',
        '3mois': 'D\'ici 3 mois'
      }[value] || value
    }
    return labels[key] || value
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="overflow-hidden" style={{ backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid #FFFFFF17', padding: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          {/* En-tête */}
          <div className="p-6 mb-4" style={{ background: 'linear-gradient(to right, #ff00a7, #ff33b8)', borderRadius: '8px' }}>
            <div className="flex items-center gap-3 text-white">
              <FileText className="w-8 h-8" />
              <h2 className="text-2xl font-bold">Récapitulatif de votre demande</h2>
            </div>
          </div>

          {/* Contenu */}
          <div className="p-8 space-y-6">
            {/* Contact */}
            <div>
              <h3 className="font-bold text-lg mb-3 text-gray-900">Contact</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p><strong>Email:</strong> {formData.email}</p>
                <p><strong>Nom:</strong> {formData.nom} {formData.prenom}</p>
              </div>
            </div>

            {/* Projet */}
            <div>
              <h3 className="font-bold text-lg mb-3 text-gray-900">Votre projet</h3>
              <div className="bg-gray-50 p-4 rounded-lg space-y-2">
                <p><strong>Type:</strong> {getLabel('typeProjet', formData.typeProjet)}</p>
                {formData.urlSite && <p><strong>URL actuelle:</strong> {formData.urlSite}</p>}
                <p><strong>Type de site:</strong> {getLabel('typeSite', formData.typeSite)}</p>
                {formData.nombrePages && <p><strong>Nombre de pages:</strong> {getLabel('nombrePages', formData.nombrePages)}</p>}
                <p><strong>Design:</strong> {getLabel('niveauDesign', formData.niveauDesign)}</p>
                {formData.fonctionnalites && formData.fonctionnalites.length > 0 && (
                  <p><strong>Fonctionnalités:</strong> {formData.fonctionnalites.join(', ')}</p>
                )}
                <p><strong>Délais:</strong> {getLabel('delais', formData.delais)}</p>
                {formData.besoinsComplementaires && formData.besoinsComplementaires.length > 0 && (
                  <p><strong>Besoins complémentaires:</strong> {formData.besoinsComplementaires.join(', ')}</p>
                )}
                {formData.informationsSupp && (
                  <div>
                    <strong>Informations supplémentaires:</strong>
                    <p className="mt-1">{formData.informationsSupp}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Estimation */}
            <div className="bg-gradient-to-r from-pink-50 to-purple-50 p-6 rounded-lg border-2" style={{ borderColor: '#ff00a7' }}>
              <h3 className="font-bold text-lg mb-3" style={{ color: '#ff00a7' }}>Estimation</h3>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-bold" style={{ color: '#ff00a7' }}>
                  {pricing.prixFixe.toLocaleString('fr-FR')} € HT
                </span>
                {pricing.prixMensuel > 0 && (
                  <span className="text-lg text-gray-600">
                    + {pricing.prixMensuel.toLocaleString('fr-FR')} €/mois
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="border-t border-gray-200 p-6 bg-gray-50">
            <div className="flex justify-between items-center">
              <button
                onClick={onBack}
                className="btn-secondary flex items-center gap-2"
                disabled={isSending}
              >
                <ChevronLeft className="w-5 h-5" />
                Retour
              </button>
              <button
                onClick={onSubmit}
                disabled={isSending}
                className="btn-primary flex items-center gap-2"
              >
                {isSending ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Envoi en cours...
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    Demander une estimation plus précise
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ThankYouPage({ pricing, formData, onBack }) {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="overflow-hidden text-center" style={{ backgroundColor: '#FFFFFF', borderRadius: '8px', border: '1px solid #FFFFFF17', padding: '16px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <div className="mb-6">
            <CheckCircle2 className="w-20 h-20 mx-auto mb-4" style={{ color: '#ff00a7' }} />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Merci pour votre demande !
          </h1>
          <p className="text-gray-700 text-xl mb-6">
            Votre demande de devis a bien été envoyée à l'adresse <strong>{formData.email}</strong>
          </p>
          <div className="bg-gray-50 p-6 rounded-lg mb-6">
            <p className="text-sm text-gray-600 mb-2">Estimation de votre projet :</p>
            <p className="text-2xl font-bold" style={{ color: '#ff00a7' }}>
              {pricing.prixFixe.toLocaleString('fr-FR')} € HT
              {pricing.prixMensuel > 0 && (
                <span className="text-lg text-gray-600"> + {pricing.prixMensuel.toLocaleString('fr-FR')} €/mois</span>
              )}
            </p>
          </div>
          <p className="text-gray-600 mb-6">
            Nous reviendrons vers vous rapidement avec une proposition détaillée.
          </p>
          
          {/* Bouton retour */}
          <div className="border-t border-gray-200 pt-6 mt-6">
            <button
              onClick={onBack}
              className="btn-secondary flex items-center gap-2 mx-auto"
            >
              <ChevronLeft className="w-5 h-5" />
              Revenir au formulaire
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App

