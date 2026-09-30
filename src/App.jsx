import React, { useState, useEffect } from 'react'
import LandingPage from './pages/LandingPage'
import MeetingCapturePage from './pages/MeetingCapturePage'
import MeetingResultsPage from './pages/MeetingResultsPage'
import DocsPage from './pages/DocsPage'

export default function App() {
  const [currentRoute, setCurrentRoute] = useState(() => {
    const hash = window.location.hash
    if (hash === '#capture' || hash === '#meeting') return 'capture'
    if (hash === '#results') return 'results'
    if (hash === '#docs') return 'docs'
    return 'landing'
  })

  const [meetingData, setMeetingData] = useState(null)

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash
      if (hash === '#capture' || hash === '#meeting') {
        setCurrentRoute('capture')
      } else if (hash === '#results') {
        setCurrentRoute('results')
      } else if (hash === '#docs') {
        setCurrentRoute('docs')
      } else {
        setCurrentRoute('landing')
      }
    }
    window.addEventListener('hashchange', handleHashChange)
    return () => window.removeEventListener('hashchange', handleHashChange)
  }, [])

  const navigateToLanding = () => {
    window.location.hash = ''
    setCurrentRoute('landing')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const navigateToCapture = () => {
    window.location.hash = '#capture'
    setCurrentRoute('capture')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const navigateToDocs = () => {
    window.location.hash = '#docs'
    setCurrentRoute('docs')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const navigateToResults = (data) => {
    setMeetingData(data)
    window.location.hash = '#results'
    setCurrentRoute('results')
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <>
      {currentRoute === 'landing' && (
        <LandingPage
          onLaunchMeeting={navigateToCapture}
          onNavigateToDocs={navigateToDocs}
        />
      )}

      {currentRoute === 'capture' && (
        <MeetingCapturePage
          onBackToLanding={navigateToLanding}
          onNavigateToResults={navigateToResults}
          onNavigateToDocs={navigateToDocs}
        />
      )}

      {currentRoute === 'results' && meetingData && (
        <MeetingResultsPage
          meetingData={meetingData}
          onNewMeeting={navigateToCapture}
          onBackToLanding={navigateToLanding}
          onNavigateToDocs={navigateToDocs}
        />
      )}

      {currentRoute === 'results' && !meetingData && (
        // Guard: if someone navigates to #results with no data, go back to capture
        <MeetingCapturePage
          onBackToLanding={navigateToLanding}
          onNavigateToResults={navigateToResults}
          onNavigateToDocs={navigateToDocs}
        />
      )}

      {currentRoute === 'docs' && (
        <DocsPage
          onBackToHome={navigateToLanding}
          onLaunchMeeting={navigateToCapture}
        />
      )}
    </>
  )
}
