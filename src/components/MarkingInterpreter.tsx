import { useMemo } from "react"

type MarkingInterpreterProps = {
  marking: string
  setMarking: (value: string) => void
}

const tokenDictionary: Record<string, string> = {
  II: "Equipment Group II: surface industries",
  "1G": "Category 1G: very high protection for gas atmospheres, typically suitable for Zone 0",
  "2G": "Category 2G: high protection for gas atmospheres, typically suitable for Zone 1",
  "3G": "Category 3G: enhanced protection for gas atmospheres, typically suitable for Zone 2",
  "1D": "Category 1D: very high protection for dust atmospheres, typically suitable for Zone 20",
  "2D": "Category 2D: high protection for dust atmospheres, typically suitable for Zone 21",
  "3D": "Category 3D: enhanced protection for dust atmospheres, typically suitable for Zone 22",
  Ex: "Explosion-protected equipment marking",
  db: "Flameproof enclosure protection concept",
  eb: "Increased safety protection concept",
  ec: "Increased safety protection concept for lower-risk applications",
  ia: "Intrinsic safety suitable for the highest gas protection level",
  ib: "Intrinsic safety protection concept",
  ic: "Intrinsic safety for lower-risk applications",
  tb: "Protection by enclosure for dust",
  tc: "Protection by enclosure for dust in lower risk dust areas",
  IIC: "Gas group IIC: most demanding common gas subgroup in Group II",
  IIB: "Gas group IIB: medium gas subgroup in Group II",
  IIA: "Gas group IIA: less demanding gas subgroup in Group II",
  IIIC: "Dust group IIIC: conductive dust",
  IIIB: "Dust group IIIB: non-conductive dust",
  IIIA: "Dust group IIIA: combustible flyings",
  T1: "Maximum surface temperature 450°C",
  T2: "Maximum surface temperature 300°C",
  T3: "Maximum surface temperature 200°C",
  T4: "Maximum surface temperature 135°C",
  T5: "Maximum surface temperature 100°C",
  T6: "Maximum surface temperature 85°C",
  Ga: "EPL Ga: very high protection for gas atmospheres",
  Gb: "EPL Gb: high protection for gas atmospheres",
  Gc: "EPL Gc: enhanced protection for gas atmospheres",
  Da: "EPL Da: very high protection for dust atmospheres",
  Db: "EPL Db: high protection for dust atmospheres",
  Dc: "EPL Dc: enhanced protection for dust atmospheres",
}

function chipStyle(token: string): React.CSSProperties {
  const lower = token.toLowerCase()

  if (["ga", "gb", "gc", "da", "db", "dc"].includes(lower)) {
    return {
      backgroundColor: "#eef6ff",
      color: "#1d4f91",
      border: "1px solid #c8dcff",
    }
  }

  if (["ia", "ib", "ic", "db", "eb", "ec", "tb", "tc"].includes(lower)) {
    return {
      backgroundColor: "#effcf3",
      color: "#185c37",
      border: "1px solid #b7ebc6",
    }
  }

  if (/^t[1-6]$/i.test(token)) {
    return {
      backgroundColor: "#fff8eb",
      color: "#8a5a00",
      border: "1px solid #f4d39c",
    }
  }

  if (/^(iia|iib|iic|iiia|iiib|iiic)$/i.test(token)) {
    return {
      backgroundColor: "#f5f3ff",
      color: "#5b3ea8",
      border: "1px solid #ddd3ff",
    }
  }

  return {
    backgroundColor: "#f8fafc",
    color: "#334155",
    border: "1px solid #e2e8f0",
  }
}

function sectionCardStyle(): React.CSSProperties {
  return {
    padding: "16px",
    borderRadius: "12px",
    border: "1px solid #e2e8f0",
    backgroundColor: "#ffffff",
  }
}

function MarkingInterpreter({ marking, setMarking }: MarkingInterpreterProps) {
  const tokens = useMemo(() => {
    return marking
      .replace(/,/g, " ")
      .split(/\s+/)
      .map((token) => token.trim())
      .filter(Boolean)
  }, [marking])

  const groupedInterpretation = useMemo(() => {
    const equipmentGroup = tokens.filter((token) => token === "II")
    const category = tokens.filter((token) => /^(1G|2G|3G|1D|2D|3D)$/i.test(token))
    const exMarker = tokens.filter((token) => token === "Ex")
    const protectionConcepts = tokens.filter((token) =>
      /^(db|eb|ec|ia|ib|ic|tb|tc)$/i.test(token)
    )
    const gasOrDustGroup = tokens.filter((token) =>
      /^(IIA|IIB|IIC|IIIA|IIIB|IIIC)$/i.test(token)
    )
    const temperatureClass = tokens.filter((token) => /^T[1-6]$/i.test(token))
    const epl = tokens.filter((token) => /^(Ga|Gb|Gc|Da|Db|Dc)$/i.test(token))

    const recognised = new Set([
      ...equipmentGroup,
      ...category,
      ...exMarker,
      ...protectionConcepts,
      ...gasOrDustGroup,
      ...temperatureClass,
      ...epl,
    ])

    const ungrouped = tokens.filter((token) => !recognised.has(token))

    return {
      equipmentGroup,
      category,
      exMarker,
      protectionConcepts,
      gasOrDustGroup,
      temperatureClass,
      epl,
      ungrouped,
    }
  }, [tokens])

  const combinedProtectionExplanation = useMemo(() => {
    if (groupedInterpretation.protectionConcepts.length < 2) {
      return null
    }

    return `This marking combines multiple protection concepts: ${groupedInterpretation.protectionConcepts.join(
      " + "
    )}. In simple terms, that usually means different parts of the equipment are protected using different recognised methods, for example flameproof construction together with increased safety features.`
  }, [groupedInterpretation.protectionConcepts])

  const renderTokenList = (sectionTokens: string[]) => {
    if (sectionTokens.length === 0) {
      return <p style={{ margin: 0, color: "#64748b" }}>Not identified in this marking.</p>
    }

    return (
      <ul style={{ marginBottom: 0, lineHeight: 1.8, paddingLeft: "20px" }}>
        {sectionTokens.map((token, index) => (
          <li key={`${token}-${index}`}>
            <strong>{token}</strong>:{" "}
            {tokenDictionary[token] ?? "No interpretation stored yet for this token"}
          </li>
        ))}
      </ul>
    )
  }

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
      <h2 style={{ marginTop: 0, marginBottom: "8px", color: "#12263f" }}>
        Equipment Marking Interpreter
      </h2>

      <p style={{ marginTop: 0, marginBottom: "20px", color: "#5b6472", lineHeight: 1.6 }}>
        Paste an Ex marking and the dashboard will break it into the main engineering
        elements rather than just listing tokens one by one.
      </p>

      <label
        htmlFor="marking-input"
        style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}
      >
        Paste Ex Marking
      </label>

      <input
        id="marking-input"
        type="text"
        value={marking}
        onChange={(event) => setMarking(event.target.value)}
        style={{
          width: "100%",
          maxWidth: "760px",
          padding: "10px 12px",
          fontSize: "16px",
          marginBottom: "16px",
          borderRadius: "10px",
          border: "1px solid #cbd5e1",
        }}
      />

      <p style={{ marginTop: 0, marginBottom: "20px" }}>
        <strong>Example:</strong> <code>II 2G Ex db eb IIC T4 Gb</code>
      </p>

      <div
        style={{
          padding: "14px 16px",
          borderRadius: "12px",
          backgroundColor: "#f8fafc",
          border: "1px solid #e2e8f0",
          marginBottom: "18px",
        }}
      >
        <strong>Current marking:</strong>
        <div style={{ marginTop: "8px", fontFamily: "monospace", fontSize: "15px" }}>
          {marking || "No marking entered"}
        </div>
      </div>

      <div
        style={{
          padding: "14px 16px",
          borderRadius: "12px",
          backgroundColor: "#fbfcfe",
          border: "1px solid #e2e8f0",
          marginBottom: "18px",
        }}
      >
        <strong>Detected Tokens</strong>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "10px",
            marginTop: "12px",
          }}
        >
          {tokens.length > 0 ? (
            tokens.map((token, index) => (
              <span
                key={`${token}-chip-${index}`}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  padding: "7px 11px",
                  borderRadius: "999px",
                  fontSize: "14px",
                  fontWeight: 700,
                  ...chipStyle(token),
                }}
              >
                {token}
              </span>
            ))
          ) : (
            <span style={{ color: "#64748b" }}>No tokens detected yet.</span>
          )}
        </div>
      </div>

      {combinedProtectionExplanation && (
        <div
          style={{
            padding: "14px 16px",
            borderRadius: "12px",
            backgroundColor: "#eef6ff",
            border: "1px solid #c8dcff",
            marginBottom: "18px",
            lineHeight: 1.6,
          }}
        >
          <strong>Combined protection explanation:</strong>
          <div style={{ marginTop: "8px" }}>{combinedProtectionExplanation}</div>
        </div>
      )}

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "16px",
        }}
      >
        <div style={sectionCardStyle()}>
          <strong>Equipment Group</strong>
          <div style={{ marginTop: "10px" }}>{renderTokenList(groupedInterpretation.equipmentGroup)}</div>
        </div>

        <div style={sectionCardStyle()}>
          <strong>Category</strong>
          <div style={{ marginTop: "10px" }}>{renderTokenList(groupedInterpretation.category)}</div>
        </div>

        <div style={sectionCardStyle()}>
          <strong>Explosion Marking</strong>
          <div style={{ marginTop: "10px" }}>{renderTokenList(groupedInterpretation.exMarker)}</div>
        </div>

        <div style={sectionCardStyle()}>
          <strong>Protection Concepts</strong>
          <div style={{ marginTop: "10px" }}>
            {renderTokenList(groupedInterpretation.protectionConcepts)}
          </div>
        </div>

        <div style={sectionCardStyle()}>
          <strong>Gas / Dust Group</strong>
          <div style={{ marginTop: "10px" }}>
            {renderTokenList(groupedInterpretation.gasOrDustGroup)}
          </div>
        </div>

        <div style={sectionCardStyle()}>
          <strong>Temperature Class</strong>
          <div style={{ marginTop: "10px" }}>
            {renderTokenList(groupedInterpretation.temperatureClass)}
          </div>
        </div>

        <div style={sectionCardStyle()}>
          <strong>Equipment Protection Level</strong>
          <div style={{ marginTop: "10px" }}>{renderTokenList(groupedInterpretation.epl)}</div>
        </div>

        <div style={sectionCardStyle()}>
          <strong>Other / Unrecognised Tokens</strong>
          <div style={{ marginTop: "10px" }}>{renderTokenList(groupedInterpretation.ungrouped)}</div>
        </div>
      </div>
    </div>
  )
}

export default MarkingInterpreter