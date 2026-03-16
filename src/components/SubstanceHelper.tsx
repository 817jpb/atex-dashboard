import { substances } from "../data/substances"

type SubstanceHelperProps = {
  selectedSubstance: string
  onSubstanceChange: (name: string) => void
}

export default function SubstanceHelper({
  selectedSubstance,
  onSubstanceChange,
}: SubstanceHelperProps) {
  const selected =
    substances.find((s) => s.name === selectedSubstance) ?? substances[0]

  return (
    <div
      style={{
        border: "1px solid #d8dee8",
        borderRadius: "18px",
        padding: "22px",
        backgroundColor: "#ffffff",
        textAlign: "left",
        boxShadow: "0 10px 28px rgba(15, 23, 42, 0.06)",
      }}
    >
      <h2
        style={{
          marginTop: 0,
          marginBottom: "8px",
          fontSize: "26px",
          lineHeight: 1.2,
          color: "#12263f",
        }}
      >
        Substance Properties
      </h2>

      <p
        style={{
          marginTop: 0,
          marginBottom: "20px",
          color: "#5b6472",
          lineHeight: 1.6,
          fontSize: "15px",
        }}
      >
        Select a substance to auto-fill the temperature checker and review the
        typical hazardous area properties.
      </p>

      <label
        htmlFor="substance-select"
        style={{
          display: "block",
          marginBottom: "8px",
          fontWeight: 700,
          color: "#1f2937",
        }}
      >
        Substance
      </label>

      <select
        id="substance-select"
        value={selectedSubstance}
  onChange={(e) => onSubstanceChange(e.target.value)}
        style={{
          width: "100%",
          maxWidth: "340px",
          padding: "11px 13px",
          fontSize: "15px",
          borderRadius: "12px",
          border: "1px solid #cbd5e1",
          backgroundColor: "#ffffff",
          color: "#10233f",
          marginBottom: "20px",
        }}
      >
        {substances.map((s) => (
          <option key={s.name} value={s.name}>
            {s.name}
          </option>
        ))}
      </select>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: "14px",
        }}
      >
        <div
          style={{
            padding: "16px 18px",
            borderRadius: "16px",
            border: "1px solid #dde6f0",
            backgroundColor: "#f8fbff",
          }}
        >
          <strong>Group:</strong>
          <div style={{ marginTop: "6px" }}>{selected.group}</div>
        </div>

        <div
          style={{
            padding: "16px 18px",
            borderRadius: "16px",
            border: "1px solid #dde6f0",
            backgroundColor: "#f8fbff",
          }}
        >
          <strong>Auto-Ignition Temperature:</strong>
          <div style={{ marginTop: "6px" }}>{selected.autoIgnition}°C</div>
        </div>

        <div
          style={{
            padding: "16px 18px",
            borderRadius: "16px",
            border: "1px solid #dde6f0",
            backgroundColor: "#f8fbff",
          }}
        >
          <strong>Suggested Temperature Class:</strong>
          <div style={{ marginTop: "6px" }}>{selected.suggestedTClass}</div>
        </div>

        <div
          style={{
            padding: "16px 18px",
            borderRadius: "16px",
            border: "1px solid #dde6f0",
            backgroundColor: "#f8fbff",
          }}
        >
          <strong>Typical Protection:</strong>
          <div style={{ marginTop: "6px" }}>{selected.protection}</div>
        </div>
      </div>
    </div>
  )
}