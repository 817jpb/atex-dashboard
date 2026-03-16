type ZoneRecord = {
  id: string
  system: "ATEX"
  hazardFamily: "gas" | "dust"
  zone: "0" | "1" | "2" | "20" | "21" | "22"
  description: string
  likelyPresence: string
  minimumCategory: string
  minimumEpl: string
  commonProtectionTypes: string[]
  notes: string[]
}

type AtexCardProps = {
  title: string
  selectedZone: ZoneRecord | undefined
}

function getZoneBadgeStyle(zone: ZoneRecord["zone"]) {
  if (zone === "0" || zone === "20") {
    return {
      backgroundColor: "#fde8e8",
      color: "#b42318",
      border: "1px solid #f5b5b5",
      label: "Continuous hazard",
      icon: "🔴",
    }
  }

  if (zone === "1" || zone === "21") {
    return {
      backgroundColor: "#fff3e0",
      color: "#b45309",
      border: "1px solid #f2c27f",
      label: "Likely hazard",
      icon: "🟠",
    }
  }

  return {
    backgroundColor: "#eafaf0",
    color: "#1f7a3d",
    border: "1px solid #b7e3c3",
    label: "Infrequent hazard",
    icon: "🟢",
  }
}

function sectionCardStyle(): React.CSSProperties {
  return {
    marginTop: "18px",
    padding: "14px 16px",
    borderRadius: "12px",
    backgroundColor: "#f8fafc",
    border: "1px solid #e2e8f0",
  }
}

function AtexCard({ title, selectedZone }: AtexCardProps) {
  if (!selectedZone) {
    return <p>No zone selected.</p>
  }

  const badgeStyle = getZoneBadgeStyle(selectedZone.zone)

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
      <h3 style={{ marginTop: 0, marginBottom: "14px", color: "#12263f" }}>{title}</h3>

      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          padding: "8px 12px",
          borderRadius: "999px",
          fontWeight: 700,
          marginBottom: "18px",
          ...badgeStyle,
        }}
      >
        <span>{badgeStyle.icon}</span>
        <span>Zone {selectedZone.zone}</span>
        <span style={{ opacity: 0.65 }}>•</span>
        <span>{badgeStyle.label}</span>
      </div>

      <div style={{ display: "grid", gap: "12px", color: "#334155" }}>
        <p style={{ margin: 0 }}>
          <strong>Hazard Family:</strong> {selectedZone.hazardFamily}
        </p>

        <p style={{ margin: 0 }}>
          <strong>Description:</strong> {selectedZone.description}
        </p>

        <p style={{ margin: 0 }}>
          <strong>Likely Presence:</strong> {selectedZone.likelyPresence}
        </p>

        <p style={{ margin: 0 }}>
          <strong>Minimum Category:</strong> {selectedZone.minimumCategory}
        </p>

        <p style={{ margin: 0 }}>
          <strong>Minimum EPL:</strong> {selectedZone.minimumEpl}
        </p>
      </div>

      <div style={sectionCardStyle()}>
        <strong style={{ color: "#12263f" }}>Typical Equipment Marking Expectation</strong>

        {selectedZone.hazardFamily === "gas" && (
          <ul style={{ marginBottom: 0, lineHeight: 1.8, marginTop: "10px" }}>
            <li>Group II equipment for surface industries</li>
            <li>Category {selectedZone.minimumCategory}</li>
            <li>
              Typical marking example:{" "}
              <code>
                II {selectedZone.minimumCategory} Ex db IIC T4 {selectedZone.minimumEpl}
              </code>
            </li>
          </ul>
        )}

        {selectedZone.hazardFamily === "dust" && (
          <ul style={{ marginBottom: 0, lineHeight: 1.8, marginTop: "10px" }}>
            <li>Group II equipment for surface industries</li>
            <li>Category {selectedZone.minimumCategory}</li>
            <li>
              Typical marking example:{" "}
              <code>
                II {selectedZone.minimumCategory} Ex tb IIIC T135°C {selectedZone.minimumEpl}
              </code>
            </li>
          </ul>
        )}
      </div>

      <div style={sectionCardStyle()}>
        <strong style={{ color: "#12263f" }}>Common Protection Types</strong>
        <ul style={{ lineHeight: 1.8, marginBottom: 0, marginTop: "10px" }}>
          {selectedZone.commonProtectionTypes.map((protectionType) => (
            <li key={protectionType}>{protectionType}</li>
          ))}
        </ul>
      </div>

      <div style={sectionCardStyle()}>
        <strong style={{ color: "#12263f" }}>Notes</strong>
        <ul style={{ lineHeight: 1.8, marginBottom: 0, marginTop: "10px" }}>
          {selectedZone.notes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default AtexCard