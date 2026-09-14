import React, { useState, useEffect } from 'react'
import LandingPage from './pages/LandingPage'
import CockpitPage from './pages/CockpitPage'
import DocsPage from './pages/DocsPage'
import LexiconModal from './components/LexiconModal'

export default function App() {
  // Sync state with URL hash (#workspace or #cockpit, #docs vs root)
  const [currentRoute, setCurrentRoute] = useState(() => {
    const hash = window.location.hash
    if (hash === '#workspace' || hash === '#cockpit') return 'workspace'
    if (hash === '#docs' || hash === '#documentation') return 'docs'
    return 'landing'
  })
  const [selectedEncounterId, setSelectedEncounterId] = useState(null)
  const [isLexiconModalOpen, setIsLexiconModalOpen] = useState(false)

  // Listen to browser hash changes (support back / forward navigation)
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash
      if (hash === '#workspace' || hash === '#cockpit') {
        setCurrentRoute('workspace')
      } else if (hash === '#docs' || hash === '#documentation') {
        setCurrentRoute('docs')
      } else {
        setCurrentRoute('landing')
      }
    }

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  const navigateToWorkspace = (encounterId = null) => {
    if (encounterId) {
      setSelectedEncounterId(encounterId)
    }
    window.location.hash = '#workspace'
    setCurrentRoute('workspace')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const navigateToDocs = () => {
    window.location.hash = '#docs'
    setCurrentRoute('docs')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const navigateToLanding = () => {
    window.location.hash = ''
    setCurrentRoute('landing')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      {currentRoute === 'workspace' && (
        <CockpitPage
          onBackToLanding={navigateToLanding}
          onNavigateToDocs={navigateToDocs}
          initialEncounterId={selectedEncounterId}
        />
      )}
      {currentRoute === 'docs' && (
        <DocsPage
          onBackToLanding={navigateToLanding}
          onLaunchWorkspace={navigateToWorkspace}
          onSelectEncounter={(id) => navigateToWorkspace(id)}
        />
      )}
      {currentRoute === 'landing' && (
        <LandingPage
          onLaunchWorkspace={() => navigateToWorkspace()}
          onLaunchCockpit={() => navigateToWorkspace()}
          onNavigateToDocs={navigateToDocs}
          onOpenLexicon={() => setIsLexiconModalOpen(true)}
          onSelectEncounter={(id) => navigateToWorkspace(id)}
        />
      )}

      {/* Global Lexicon Modal accessible from Landing Page */}
      <LexiconModal
        isOpen={isLexiconModalOpen}
        onClose={() => setIsLexiconModalOpen(false)}
      />
    </>
  )
}
