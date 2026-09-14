import React from 'react'

export default function CurieLogo({ className = 'w-8 h-8', ...props }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 144 155"
      className={className}
      fill="none"
      {...props}
    >
      <path
        fill="#1A2631"
        d="m72 9c-35.7 0-69.1 30.3-69.1 68.5 0 36.1 28.1 68.4 67 68.4 37.5 0 66-28.2 69.2-62.1 3.6-38.8-27.6-74.8-67.1-74.8zm2.3 122.6c-32.1 0.8-56.6-22.8-56.8-53.8-0.1-26.2 23.3-54.3 54.3-54.5 26.7-0.1 54.7 21.6 54.7 54.2 0 25-19.1 52.4-52.2 54.1z"
      />
      <rect fill="#0C9B68" x="30.2" y="67.1" width="9.6" height="21.1" rx="2" />
      <rect fill="#0C9B68" x="49" y="42.4" width="9.7" height="70.6" rx="2" />
      <rect fill="#50BB83" x="67.5" y="51.4" width="9.4" height="51.4" rx="2" />
      <rect fill="#50BB83" x="86" y="61.2" width="9.4" height="33.1" rx="2" />
      <rect fill="#50BB83" x="104.3" y="71.3" width="9.4" height="12.5" rx="2" />
    </svg>
  )
}
