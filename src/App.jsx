import React, { useState, useEffect } from 'react'
import LandingPage from './pages/LandingPage'
import CockpitPage from './pages/CockpitPage'
import LexiconModal from './components/LexiconModal'

export default function App() {
  // Sync state with URL hash (#workspace or #cockpit vs root)
  const [currentRoute, setCurrentRoute] = useState(() => {
    return window.location.hash === '#workspace' || window.location.hash === '#cockpit' ? 'workspace' : 'landing'
  })
  const [selectedEncounterId, setSelectedEncounterId] = useState(null)
  const [isLexiconModalOpen, setIsLexiconModalOpen] = useState(false)

  // Listen to browser hash changes (support back / forward navigation)
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#workspace' || window.location.hash === '#cockpit') {
        setCurrentRoute('workspace')
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

  const navigateToLanding = () => {
    window.location.hash = ''
    setCurrentRoute('landing')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      {currentRoute === 'workspace' ? (
        <CockpitPage
          onBackToLanding={navigateToLanding}
          initialEncounterId={selectedEncounterId}
        />
      ) : (
        <LandingPage
          onLaunchWorkspace={() => navigateToWorkspace()}
          onLaunchCockpit={() => navigateToWorkspace()}
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
