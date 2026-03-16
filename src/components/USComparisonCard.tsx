type UsClassDivisionRecord = {
  id: string
  system: "US"
  class: "I" | "II" | "III"
  division: "1" | "2"
  hazardFamily: "gas" | "dust" | "fibres"
  description: string
  typicalMeaning: string
  nearestAtexEquivalent: string[]
  comparisonConfidence: "high" | "medium" | "low"
  notes: string[]
}

type MappingRuleRecord = {
  id: string
  sourceSystem: "ATEX" | "US"
  sourceKey: string
  targetSystem: "ATEX" | "US"
  targetKeys: string[]
  confidence: "high" | "medium" | "low"
  mappingType: "nearest-equivalent" | "conditional" | "not-direct"
  rationale: string
  warnings: string[]
}

type UsComparisonCardProps = {
  title: string
  mappedUS: UsClassDivisionRecord[]
  mapping: MappingRuleRecord | undefined
}

function confidenceStyle(confidence: "high" | "medium" | "low") {
  if (confidence === "high") {
    return {
      background: "#eafaf0",
      color: "#1f7a3d",
      border: "1px solid #b7e3c3",
    }
  }

  if (confidence === "medium") {
    return {
      background: "#fff8eb",
      color: "#8a5a00",
      border: "1px solid #f4d39c",
    }
  }

  return {
    background: "#fff1f1",
    color: "#9f1d1d",
    border: "1px solid #f3b3b3",
  }
}

function UsComparisonCard({ title, mappedUS, mapping }: UsComparisonCardProps) {
  return (
    <div
      style={{
        border: "1px solid #d8dee8",
        borderRadius: "16px",
        padding: "20px",
        backgroundColor: "#ffffff",
        textAlign: "left",
        boxShadow: "0 6px 18px rgba(15, 23, 42, 0.06)",
      }}
    >
      <h3 style={{ marginTop: 0, marginBottom: "14px" }}>{title}</h3>

      {mappedUS.length > 0 ? (
        <div style={{ display: "grid", gap: "14px" }}>
          {mappedUS.map((us) => (
            <div
              key={us.id}
              style={{
                padding: "14px 16px",
                borderRadius: "12px",
                border: "1px solid #e2e8f0",
                backgroundColor: "#f8fafc",
              }}
            >
              <div style={{ fontWeight: 700, marginBottom: "6px" }}>
                Class {us.class} Division {us.division}
              </div>

              <div style={{ fontSize: "14px", color: "#475569", lineHeight: 1.6 }}>
                <div>
                  <strong>Hazard Family:</strong> {us.hazardFamily}
                </div>

                <div>
                  <strong>Description:</strong> {us.description}
                </div>

                <div>
                  <strong>Typical Meaning:</strong> {us.typicalMeaning}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p>No direct US Class/Division equivalent.</p>
      )}

      {mapping && (
        <div style={{ marginTop: "18px" }}>
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              padding: "6px 12px",
              borderRadius: "999px",
              fontWeight: 700,
              fontSize: "14px",
              marginBottom: "12px",
              ...confidenceStyle(mapping.confidence),
            }}
          >
            Mapping Confidence: {mapping.confidence}
          </div>

          <p style={{ margin: "6px 0" }}>
            <strong>Mapping Type:</strong> {mapping.mappingType}
          </p>

          <p style={{ margin: "6px 0", lineHeight: 1.6 }}>
            <strong>Rationale:</strong> {mapping.rationale}
          </p>

          {mapping.warnings?.length > 0 && (
            <div style={{ marginTop: "12px" }}>
              <strong>Warnings</strong>

              <ul style={{ lineHeight: 1.7 }}>
                {mapping.warnings.map((warning) => (
                  <li key={warning}>{warning}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default UsComparisonCard