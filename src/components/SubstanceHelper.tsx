import {
  substances,
  elastomerRatingLabel,
  elastomerRatingColor,
  elastomerRatingBg,
  elastomerRatingBorder,
} from "../data/substances"

type SubstanceHelperProps = {
  selectedSubstance: string
  onSubstanceChange: (name: string) => void
}

const tileStyle: React.CSSProperties = {
  padding: "14px 16px",
  borderRadius: "12px",
  border: "1px solid #dde6f0",
  backgroundColor: "#f8fbff",
}

export default function SubstanceHelper({
  selectedSubstance,
  onSubstanceChange,
}: SubstanceHelperProps) {
  const selected = substances.find((s) => s.name === selectedSubstance) ?? substances[0]

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
        style={{ marginTop: 0, marginBottom: "8px", fontSize: "26px", lineHeight: 1.2, color: "#12263f" }}
      >
        Substance Properties
      </h2>

      <p style={{ marginTop: 0, marginBottom: "20px", color: "#5b6472", lineHeight: 1.6, fontSize: "15px" }}>
        Select a substance to auto-fill the temperature checker and review hazardous area
        and elastomer compatibility properties.
      </p>

      <label
        htmlFor="substance-select"
        style={{ display: "block", marginBottom: "8px", fontWeight: 700, color: "#1f2937" }}
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

      {/* Flammability / ATEX properties */}
      <div style={{ fontWeight: 700, color: "#12263f", marginBottom: "10px" }}>
        Flammability &amp; ATEX Properties
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
          gap: "12px",
          marginBottom: "22px",
        }}
      >
        <div style={tileStyle}>
          <div style={{ fontSize: "12px", color: "#64748b", fontWeight: 600, marginBottom: "4px" }}>
            FLAMMABLE
          </div>
          <div style={{ fontWeight: 700, color: selected.isFlammable ? "#9f1d1d" : "#185c37" }}>
            {selected.isFlammable ? "Yes" : "No"}
          </div>
        </div>

        <div style={tileStyle}>
          <div style={{ fontSize: "12px", color: "#64748b", fontWeight: 600, marginBottom: "4px" }}>
            FLASH POINT
          </div>
          <div style={{ fontWeight: 700, color: "#10233f" }}>
            {selected.flashPoint !== null ? `${selected.flashPoint}°C` : "N/A"}
          </div>
        </div>

        <div style={tileStyle}>
          <div style={{ fontSize: "12px", color: "#64748b", fontWeight: 600, marginBottom: "4px" }}>
            AUTO-IGNITION
          </div>
          <div style={{ fontWeight: 700, color: "#10233f" }}>{selected.autoIgnition}°C</div>
        </div>

        <div style={tileStyle}>
          <div style={{ fontSize: "12px", color: "#64748b", fontWeight: 600, marginBottom: "4px" }}>
            GAS GROUP
          </div>
          <div style={{ fontWeight: 700, color: "#10233f" }}>
            {selected.gasGroup ?? "N/A"}
          </div>
        </div>

        <div style={tileStyle}>
          <div style={{ fontSize: "12px", color: "#64748b", fontWeight: 600, marginBottom: "4px" }}>
            LEL / UEL
          </div>
          <div style={{ fontWeight: 700, color: "#10233f" }}>
            {selected.lel !== null && selected.uel !== null
              ? `${selected.lel}% / ${selected.uel}%`
              : "N/A"}
          </div>
        </div>
      </div>

      {/* Elastomer compatibility */}
      <div style={{ fontWeight: 700, color: "#12263f", marginBottom: "10px" }}>
        Elastomer Compatibility
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "12px", marginBottom: "18px" }}>
        {(["epdm", "fkm", "ffkm"] as const).map((e) => {
          const rating = selected.elastomers[e]
          return (
            <div
              key={e}
              style={{
                padding: "14px 16px",
                borderRadius: "12px",
                border: `1px solid ${elastomerRatingBorder[rating]}`,
                backgroundColor: elastomerRatingBg[rating],
              }}
            >
              <div style={{ fontSize: "12px", fontWeight: 700, color: "#64748b", marginBottom: "4px" }}>
                {e.toUpperCase()}
              </div>
              <div style={{ fontWeight: 700, color: elastomerRatingColor[rating] }}>
                {elastomerRatingLabel[rating]}
              </div>
            </div>
          )
        })}
      </div>

      {/* Notes */}
      {selected.notes.length > 0 && (
        <ul style={{ margin: 0, paddingLeft: "20px", lineHeight: 1.7, fontSize: "13px", color: "#475569" }}>
          {selected.notes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      )}
    </div>
  )
}
