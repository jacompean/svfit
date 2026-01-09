import React from 'react'

export default function StatCard({ label, value, hint }) {
  return (
    <div className="sv-card p-4">
      <div className="text-sv-muted text-sm">{label}</div>
      <div className="text-2xl font-extrabold mt-1">{value}</div>
      {hint ? <div className="text-xs text-sv-muted mt-1">{hint}</div> : null}
    </div>
  )
}
