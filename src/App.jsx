import React, { useState, useEffect } from 'react'
import LandingPage from './pages/LandingPage'
import CockpitPage from './pages/CockpitPage'
import LexiconModal from './components/LexiconModal'

export default function App() {
  // Sync state with URL hash (#cockpit vs root)
  const [currentRoute, setCurrentRoute] = useState(() => {
    return window.location.hash === '#cockpit' ? 'cockpit' : 'landing'
  })
  const [selectedEncounterId, setSelectedEncounterId] = useState(null)
  const [isLexiconModalOpen, setIsLexiconModalOpen] = useState(false)

  // Listen to browser hash changes (support back / forward navigation)
  useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#cockpit') {
        setCurrentRoute('cockpit')
      } else {
        setCurrentRoute('landing')
      }
    }

    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  const navigateToCockpit = (encounterId = null) => {
    if (encounterId) {
      setSelectedEncounterId(encounterId)
    }
    window.location.hash = '#cockpit'
    setCurrentRoute('cockpit')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const navigateToLanding = () => {
    window.location.hash = ''
    setCurrentRoute('landing')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      {currentRoute === 'cockpit' ? (
        <CockpitPage
          onBackToLanding={navigateToLanding}
          initialEncounterId={selectedEncounterId}
        />
      ) : (
        <LandingPage
          onLaunchCockpit={() => navigateToCockpit()}
          onOpenLexicon={() => setIsLexiconModalOpen(true)}
          onSelectEncounter={(id) => navigateToCockpit(id)}
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
