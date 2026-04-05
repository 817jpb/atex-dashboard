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

function UsComparisonCard({ title, mappedUS, mapping }: UsComparisonCardProps) {
  return (
    <div className="card card--gray">
      <h3>{title}</h3>

      {mappedUS.length > 0 ? (
        <ul>
          {mappedUS.map((us) => (
            <li key={us.id} className="us-card-item">
              <strong>
                Class {us.class} Division {us.division}
              </strong>
              <br />
              Hazard Family: {us.hazardFamily}
              <br />
              Description: {us.description}
              <br />
              Typical Meaning: {us.typicalMeaning}
            </li>
          ))}
        </ul>
      ) : (
        <p>No direct US Class/Division equivalent.</p>
      )}

      {mapping && (
        <p>
          <strong>Mapping Confidence:</strong> {mapping.confidence}
        </p>
      )}

      {mapping && (
        <p>
          <strong>Mapping Type:</strong> {mapping.mappingType}
        </p>
      )}

      {mapping && (
        <p>
          <strong>Rationale:</strong> {mapping.rationale}
        </p>
      )}

      {mapping?.warnings && (
        <div>
          <strong>Warnings:</strong>
          <ul>
            {mapping.warnings.map((warning) => (
              <li key={warning}>{warning}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default UsComparisonCard
