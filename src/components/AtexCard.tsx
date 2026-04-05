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

function AtexCard({ title, selectedZone }: AtexCardProps) {
  if (!selectedZone) {
    return <p>No zone selected.</p>
  }

  return (
    <div className="card card--blue">
      <h3>{title}</h3>

      <p>
        <strong>Zone:</strong> {selectedZone.zone}
      </p>

      <p>
        <strong>Hazard Family:</strong> {selectedZone.hazardFamily}
      </p>

      <p>
        <strong>Description:</strong> {selectedZone.description}
      </p>

      <p>
        <strong>Likely Presence:</strong> {selectedZone.likelyPresence}
      </p>

      <p>
        <strong>Minimum Category:</strong> {selectedZone.minimumCategory}
      </p>

      <p>
        <strong>Minimum EPL:</strong> {selectedZone.minimumEpl}
      </p>

      <div className="card__detail">
        <strong>Typical Equipment Marking Expectation:</strong>

        {selectedZone.hazardFamily === "gas" && (
          <ul>
            <li>Group II equipment (surface industries)</li>
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
          <ul>
            <li>Group II equipment (surface industries)</li>
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

      <div>
        <strong>Common Protection Types:</strong>
        <ul>
          {selectedZone.commonProtectionTypes.map((protectionType) => (
            <li key={protectionType}>{protectionType}</li>
          ))}
        </ul>
      </div>

      <div>
        <strong>Notes:</strong>
        <ul>
          {selectedZone.notes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      </div>
    </div>
  )
}

export default AtexCard
