import React from "react"
import { determineAtexZonesFromMarking } from "../data/atexZoneRules"

type Props = {
  marking: string
}

function ZoneBadge({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        display: "inline-block",
        padding: "8px 14px",
        marginRight: "10px",
        marginBottom: "10px",
        borderRadius: "20px",
        backgroundColor: "#d9f7e8",
        border: "1px solid #7ed4a5",
        fontWeight: 600,
        fontSize: "14px",
      }}
    >
      {children}
    </span>
  )
}

export default function ZoneSuitabilityCard({ marking }: Props) {
  const result = determineAtexZonesFromMarking(marking)

  const hasGas = result.gas.length > 0
  const hasDust = result.dust.length > 0

  return (
    <div
      style={{
        border: "1px solid #ccc",
        borderRadius: "12px",
        padding: "22px",
        backgroundColor: "#f6f9ff",
        textAlign: "left",
        marginTop: "28px",
      }}
    >
      <h2 style={{ marginBottom: "12px" }}>Permitted ATEX Zones</h2>

      <p style={{ marginBottom: "18px", color: "#444" }}>
        Determined from equipment category and EPL contained in the marking.
      </p>

      {/* Gas Zones */}
      {hasGas && (
        <div style={{ marginBottom: "20px" }}>
          <h3 style={{ marginBottom: "10px" }}>Gas Atmosphere</h3>

          <div style={{ marginBottom: "10px" }}>
            {result.gas.map((zone) => (
              <ZoneBadge key={zone}>{zone}</ZoneBadge>
            ))}
          </div>

          <div style={{ fontSize: "13px", color: "#666" }}>
            Category: {result.matched.gasCategory ?? "—"} | EPL:{" "}
            {result.matched.gasEpl ?? "—"}
          </div>
        </div>
      )}

      {/* Dust Zones */}
      {hasDust && (
        <div style={{ marginBottom: "20px" }}>
          <h3 style={{ marginBottom: "10px" }}>Dust Atmosphere</h3>

          <div style={{ marginBottom: "10px" }}>
            {result.dust.map((zone) => (
              <ZoneBadge key={zone}>{zone}</ZoneBadge>
            ))}
          </div>

          <div style={{ fontSize: "13px", color: "#666" }}>
            Category: {result.matched.dustCategory ?? "—"} | EPL:{" "}
            {result.matched.dustEpl ?? "—"}
          </div>
        </div>
      )}

      {!hasGas && !hasDust && (
        <div
          style={{
            padding: "14px",
            backgroundColor: "#fff3cd",
            border: "1px solid #ffe08a",
            borderRadius: "8px",
            marginBottom: "20px",
          }}
        >
          No ATEX category or EPL detected in this marking.
        </div>
      )}

      {result.notes.length > 0 && (
        <div
          style={{
            marginTop: "20px",
            padding: "16px",
            backgroundColor: "#ffffff",
            borderRadius: "10px",
            border: "1px solid #ddd",
          }}
        >
          <strong>Interpretation notes</strong>

          <ul style={{ marginTop: "10px", paddingLeft: "20px" }}>
            {result.notes.map((note) => (
              <li key={note} style={{ marginBottom: "6px" }}>
                {note}
              </li>
            ))}
          </ul>
        </div>
      )}

      <div
        style={{
          marginTop: "20px",
          padding: "14px",
          backgroundColor: "#eef5ff",
          border: "1px solid #c9d8ff",
          borderRadius: "8px",
          fontSize: "13px",
        }}
      >
        Zone suitability must still be verified against the installation
        conditions, including gas/dust type, temperature class, ambient range,
        protection concept and special conditions of use.
      </div>
    </div>
  )
}