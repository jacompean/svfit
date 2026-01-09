import React from 'react'

export default function Logo({ size = 40 }) {
  return (
    <div className="flex items-center gap-3">
      <img
        src="/logo-svfit.jpeg"
        alt="SVFIT"
        style={{ width: size, height: size }}
        className="rounded-xl border border-sv-border object-cover"
      />
      <div className="leading-tight">
        <div className="font-black tracking-tight">SVFIT</div>
        <div className="text-xs text-sv-muted">Gym Portal</div>
      </div>
    </div>
  )
}
