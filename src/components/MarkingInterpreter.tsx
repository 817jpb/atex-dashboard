import { useMemo } from "react"

type InterpretationItem = {
  token: string
  meaning: string
}

type MarkingInterpreterProps = {
  marking: string
  setMarking: (value: string) => void
}

const tokenDictionary: Record<string, string> = {
  "II": "Equipment Group II: surface industries",
  "1G": "Category 1G: very high protection for gas atmospheres, typically suitable for Zone 0",
  "2G": "Category 2G: high protection for gas atmospheres, typically suitable for Zone 1",
  "3G": "Category 3G: enhanced protection for gas atmospheres, typically suitable for Zone 2",
  "1D": "Category 1D: very high protection for dust atmospheres, typically suitable for Zone 20",
  "2D": "Category 2D: high protection for dust atmospheres, typically suitable for Zone 21",
  "3D": "Category 3D: enhanced protection for dust atmospheres, typically suitable for Zone 22",
  "Ex": "Explosion-protected equipment marking",
  "db": "Ex db: flameproof enclosure protection concept",
  "eb": "Ex eb: increased safety protection concept",
  "ib": "Ex ib: intrinsic safety protection concept",
  "ia": "Ex ia: intrinsic safety suitable for the highest gas protection level",
  "tb": "Ex tb: protection by enclosure for dust",
  "tc": "Ex tc: protection by enclosure for dust, lower risk dust areas",
  "IIC": "Gas group IIC: most demanding common gas subgroup in Group II",
  "IIB": "Gas group IIB: medium gas subgroup in Group II",
  "IIA": "Gas group IIA: less demanding gas subgroup in Group II",
  "IIIC": "Dust group IIIC: conductive dust",
  "IIIB": "Dust group IIIB: non-conductive dust",
  "IIIA": "Dust group IIIA: combustible flyings",
  "T1": "Temperature class T1: maximum surface temperature 450°C",
  "T2": "Temperature class T2: maximum surface temperature 300°C",
  "T3": "Temperature class T3: maximum surface temperature 200°C",
  "T4": "Temperature class T4: maximum surface temperature 135°C",
  "T5": "Temperature class T5: maximum surface temperature 100°C",
  "T6": "Temperature class T6: maximum surface temperature 85°C",
  "Ga": "EPL Ga: very high protection for gas atmospheres",
  "Gb": "EPL Gb: high protection for gas atmospheres",
  "Gc": "EPL Gc: enhanced protection for gas atmospheres",
  "Da": "EPL Da: very high protection for dust atmospheres",
  "Db": "EPL Db: high protection for dust atmospheres",
  "Dc": "EPL Dc: enhanced protection for dust atmospheres",
}

function MarkingInterpreter({ marking, setMarking }: MarkingInterpreterProps) {
  const isEmpty = marking.trim().length === 0

  const interpretedItems = useMemo((): InterpretationItem[] => {
    if (isEmpty) return []

    const tokens = marking
      .replace(/,/g, " ")
      .split(/\s+/)
      .map((token) => token.trim())
      .filter(Boolean)

    return tokens.map((token) => ({
      token,
      meaning: tokenDictionary[token] ?? "No interpretation stored yet for this token",
    }))
  }, [marking, isEmpty])

  return (
    <div className="card card--green">
      <h2>Equipment Marking Interpreter</h2>

      <label htmlFor="marking-input" className="marking-label">
        Paste Ex Marking
      </label>

      <input
        id="marking-input"
        type="text"
        value={marking}
        onChange={(event) => setMarking(event.target.value)}
        className="marking-input"
        placeholder="e.g. II 2G Ex db IIC T4 Gb"
        aria-label="Equipment marking input"
      />

      <p>
        <strong>Example:</strong> <code>II 2G Ex db IIC T4 Gb</code>
      </p>

      {isEmpty ? (
        <p className="marking-empty">Enter a marking above to see an interpretation.</p>
      ) : (
        <div>
          <strong>Interpretation:</strong>
          <ul>
            {interpretedItems.map((item, index) => (
              <li key={`${item.token}-${index}`}>
                <strong>{item.token}:</strong> {item.meaning}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default MarkingInterpreter
