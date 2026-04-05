import React from "react"
import { determineAtexZonesFromMarking } from "../data/atexZoneRules"

type Props = {
  marking: string
}

function ZoneBadge({ children }: { children: React.ReactNode }) {
  return <span className="zone-badge">{children}</span>
}

export default function ZoneSuitabilityCard({ marking }: Props) {
  const result = determineAtexZonesFromMarking(marking)

  const hasGas = result.gas.length > 0
  const hasDust = result.dust.length > 0

  return (
    <div className="card card--light-blue">
      <h2>Permitted ATEX Zones</h2>

      <p className="zone-meta" style={{ marginBottom: "18px" }}>
        Determined from equipment category and EPL contained in the marking.
      </p>

      {hasGas && (
        <div className="zone-section">
          <h3>Gas Atmosphere</h3>

          <div>
            {result.gas.map((zone) => (
              <ZoneBadge key={zone}>{zone}</ZoneBadge>
            ))}
          </div>

          <div className="zone-meta">
            Category: {result.matched.gasCategory ?? "—"} | EPL:{" "}
            {result.matched.gasEpl ?? "—"}
          </div>
        </div>
      )}

      {hasDust && (
        <div className="zone-section">
          <h3>Dust Atmosphere</h3>

          <div>
            {result.dust.map((zone) => (
              <ZoneBadge key={zone}>{zone}</ZoneBadge>
            ))}
          </div>

          <div className="zone-meta">
            Category: {result.matched.dustCategory ?? "—"} | EPL:{" "}
            {result.matched.dustEpl ?? "—"}
          </div>
        </div>
      )}

      {!hasGas && !hasDust && (
        <div className="no-zones-warning">
          No ATEX category or EPL detected in this marking.
        </div>
      )}

      {result.notes.length > 0 && (
        <div className="interpretation-notes">
          <strong>Interpretation notes</strong>
          <ul>
            {result.notes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </div>
      )}

      <div className="disclaimer-box">
        Zone suitability must still be verified against the installation
        conditions, including gas/dust type, temperature class, ambient range,
        protection concept and special conditions of use.
      </div>
    </div>
  )
}
