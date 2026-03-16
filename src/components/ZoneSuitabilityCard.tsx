import { useMemo, useState } from "react"

type AtmosphereType = "gas" | "dust"
type GasZone = "0" | "1" | "2"
type DustZone = "20" | "21" | "22"

type ZoneSuitabilityCardProps = {
  marking: string
}

type Epl = "Ga" | "Gb" | "Gc" | "Da" | "Db" | "Dc"
type BasisSource = "epl" | "category" | "protection" | "none"

function getZoneBadgeStyle(zone: string) {
  if (zone === "0" || zone === "20") {
    return {
      backgroundColor: "#fde8e8",
      color: "#b42318",
      border: "1px solid #f5b5b5",
      label: "Continuous hazard",
    }
  }

  if (zone === "1" || zone === "21") {
    return {
      backgroundColor: "#fff3e0",
      color: "#b45309",
      border: "1px solid #f2c27f",
      label: "Likely hazard",
    }
  }

  return {
    backgroundColor: "#eafaf0",
    color: "#1f7a3d",
    border: "1px solid #b7e3c3",
    label: "Infrequent hazard",
  }
}

function extractEpls(marking: string): Epl[] {
  const matches = marking.match(/\b(Ga|Gb|Gc|Da|Db|Dc)\b/g)
  if (!matches) return []
  return matches as Epl[]
}

function extractCategory(marking: string): string | null {
  const match = marking.match(/\b(1G|2G|3G|1D|2D|3D)\b/i)
  return match ? match[1].toUpperCase() : null
}

function extractProtectionConcepts(marking: string): string[] {
  const matches = marking.match(/\b(ia|ib|ic)\b/gi)
  if (!matches) return []
  return matches.map((m) => m.toLowerCase())
}

function getAllowedZonesFromEpl(epl: Epl): string[] {
  switch (epl) {
    case "Ga":
      return ["0", "1", "2"]
    case "Gb":
      return ["1", "2"]
    case "Gc":
      return ["2"]
    case "Da":
      return ["20", "21", "22"]
    case "Db":
      return ["21", "22"]
    case "Dc":
      return ["22"]
  }
}

function getAllowedZonesFromCategory(category: string): string[] {
  switch (category) {
    case "1G":
      return ["0", "1", "2"]
    case "2G":
      return ["1", "2"]
    case "3G":
      return ["2"]
    case "1D":
      return ["20", "21", "22"]
    case "2D":
      return ["21", "22"]
    case "3D":
      return ["22"]
    default:
      return []
  }
}

function getAllowedZonesFromProtection(concept: string): string[] {
  switch (concept) {
    case "ia":
      return ["0", "1", "2"]
    case "ib":
      return ["1", "2"]
    case "ic":
      return ["2"]
    default:
      return []
  }
}

function getRequiredLevelForZone(atmosphere: AtmosphereType, zone: string) {
  if (atmosphere === "gas") {
    switch (zone) {
      case "0":
        return {
          preferredBasis: "Ga / 1G / ia",
          explanation: "Zone 0 gas areas normally require the highest level of protection.",
        }
      case "1":
        return {
          preferredBasis: "Gb / 2G / ib",
          explanation: "Zone 1 gas areas require high protection suitable for likely hazardous atmospheres in normal operation.",
        }
      default:
        return {
          preferredBasis: "Gc / 3G / ic",
          explanation: "Zone 2 gas areas allow equipment intended for infrequent hazardous atmospheres.",
        }
    }
  }

  switch (zone) {
    case "20":
      return {
        preferredBasis: "Da / 1D",
        explanation: "Zone 20 dust areas normally require the highest level of dust protection.",
      }
    case "21":
      return {
        preferredBasis: "Db / 2D",
        explanation: "Zone 21 dust areas require high protection for likely hazardous dust atmospheres.",
      }
    default:
      return {
        preferredBasis: "Dc / 3D",
        explanation: "Zone 22 dust areas allow equipment intended for infrequent hazardous dust atmospheres.",
      }
  }
}

function describeBasis(source: BasisSource, tokens: string[], atmosphere: AtmosphereType) {
  if (source === "epl") {
    return `The marking provides EPL ${tokens.join(", ")} for ${atmosphere} atmospheres.`
  }

  if (source === "protection") {
    return `The marking provides intrinsic safety protection concept ${tokens.join(
      ", "
    )} for gas atmospheres.`
  }

  if (source === "category") {
    return `The marking provides ATEX category ${tokens[0]} for ${atmosphere} atmospheres.`
  }

  return "No recognised suitability basis was found in the marking."
}

function getBestBasis(marking: string, atmosphere: AtmosphereType) {
  const epls = extractEpls(marking)
  const category = extractCategory(marking)
  const protectionConcepts = extractProtectionConcepts(marking)

  const relevantEpls =
    atmosphere === "gas"
      ? epls.filter((epl) => epl.startsWith("G"))
      : epls.filter((epl) => epl.startsWith("D"))

  if (relevantEpls.length > 0) {
    const allowedZones = Array.from(
      new Set(relevantEpls.flatMap((epl) => getAllowedZonesFromEpl(epl)))
    )

    return {
      source: "epl" as BasisSource,
      tokens: relevantEpls,
      allowedZones,
    }
  }

  if (atmosphere === "gas" && protectionConcepts.length > 0) {
    const allowedZones = Array.from(
      new Set(
        protectionConcepts.flatMap((concept) =>
          getAllowedZonesFromProtection(concept)
        )
      )
    )

    return {
      source: "protection" as BasisSource,
      tokens: protectionConcepts,
      allowedZones,
    }
  }

  if (
    category &&
    ((atmosphere === "gas" && category.endsWith("G")) ||
      (atmosphere === "dust" && category.endsWith("D")))
  ) {
    return {
      source: "category" as BasisSource,
      tokens: [category],
      allowedZones: getAllowedZonesFromCategory(category),
    }
  }

  return {
    source: "none" as BasisSource,
    tokens: [],
    allowedZones: [],
  }
}

function ZoneSuitabilityCard({ marking }: ZoneSuitabilityCardProps) {
  const [atmosphere, setAtmosphere] = useState<AtmosphereType>("gas")
  const [gasZone, setGasZone] = useState<GasZone>("1")
  const [dustZone, setDustZone] = useState<DustZone>("21")

  const selectedZone = atmosphere === "gas" ? gasZone : dustZone
  const zoneBadgeStyle = getZoneBadgeStyle(selectedZone)

  const result = useMemo(() => {
    const trimmedMarking = marking.trim()
    const requiredLevel = getRequiredLevelForZone(atmosphere, selectedZone)

    if (!trimmedMarking) {
      return {
        status: "warning" as const,
        title: "Enter an equipment marking first.",
        body: "A suitability check needs a full equipment marking so the dashboard can look for EPL, category, or protection concept information.",
        requirement: `Zone ${selectedZone} typically expects ${requiredLevel.preferredBasis}. ${requiredLevel.explanation}`,
      }
    }

    const basis = getBestBasis(trimmedMarking, atmosphere)

    if (basis.source === "none") {
      return {
        status: "warning" as const,
        title: "No usable zone suitability token found.",
        body:
          atmosphere === "gas"
            ? "The marking does not include a recognised gas EPL (Ga, Gb, Gc), gas category (1G, 2G, 3G), or intrinsic safety protection concept (ia, ib, ic)."
            : "The marking does not include a recognised dust EPL (Da, Db, Dc) or dust category (1D, 2D, 3D).",
        requirement: `Zone ${selectedZone} typically expects ${requiredLevel.preferredBasis}. ${requiredLevel.explanation}`,
      }
    }

    const isSuitable = basis.allowedZones.includes(selectedZone)
    const basisDescription = describeBasis(basis.source, basis.tokens, atmosphere)

    if (isSuitable) {
      return {
        status: "pass" as const,
        title: "✓ Suitable",
        body: `${basisDescription} It is suitable for Zone ${basis.allowedZones.join(
          ", "
        )}. Zone ${selectedZone} is included, so this marking is acceptable on the rule-of-thumb basis used here.`,
        requirement: `Zone ${selectedZone} typically expects ${requiredLevel.preferredBasis}. ${requiredLevel.explanation}`,
      }
    }

    return {
      status: "fail" as const,
      title: "✖ Not Suitable",
      body: `${basisDescription} It is only suitable for Zone ${basis.allowedZones.join(
        ", "
      )}. Zone ${selectedZone} is more onerous than that, so this marking does not meet the rule-of-thumb requirement.`,
      requirement: `Zone ${selectedZone} typically expects ${requiredLevel.preferredBasis}. ${requiredLevel.explanation}`,
    }
  }, [atmosphere, marking, selectedZone])

  const resultStyle: Record<"pass" | "fail" | "warning", React.CSSProperties> = {
    pass: {
      border: "1px solid #b7ebc6",
      backgroundColor: "#effcf3",
      color: "#185c37",
    },
    fail: {
      border: "1px solid #f3b3b3",
      backgroundColor: "#fff1f1",
      color: "#9f1d1d",
    },
    warning: {
      border: "1px solid #f4d39c",
      backgroundColor: "#fff8eb",
      color: "#8a5a00",
    },
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
      <h2 style={{ marginTop: 0, marginBottom: "8px" }}>Zone Suitability Checker</h2>

      <p style={{ marginTop: 0, marginBottom: "20px", color: "#5b6472", lineHeight: 1.6 }}>
        Check whether the entered equipment marking is suitable for the selected installation zone.
      </p>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "16px",
          marginBottom: "18px",
        }}
      >
        <div>
          <label
            htmlFor="atmosphere-select"
            style={{ display: "block", marginBottom: "8px", fontWeight: 700 }}
          >
            Atmosphere Type
          </label>

          <select
            id="atmosphere-select"
            value={atmosphere}
            onChange={(event) => setAtmosphere(event.target.value as AtmosphereType)}
            style={{
              width: "100%",
              padding: "10px 12px",
              fontSize: "15px",
              borderRadius: "10px",
              border: "1px solid #cbd5e1",
              backgroundColor: "#ffffff",
            }}
          >
            <option value="gas">Gas</option>
            <option value="dust">Dust</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="zone-select"
            style={{ display: "block", marginBottom: "8px", fontWeight: 700 }}
          >
            Installation Zone
          </label>

          {atmosphere === "gas" ? (
            <select
              id="zone-select"
              value={gasZone}
              onChange={(event) => setGasZone(event.target.value as GasZone)}
              style={{
                width: "100%",
                padding: "10px 12px",
                fontSize: "15px",
                borderRadius: "10px",
                border: "1px solid #cbd5e1",
                backgroundColor: "#ffffff",
              }}
            >
              <option value="0">Zone 0</option>
              <option value="1">Zone 1</option>
              <option value="2">Zone 2</option>
            </select>
          ) : (
            <select
              id="zone-select"
              value={dustZone}
              onChange={(event) => setDustZone(event.target.value as DustZone)}
              style={{
                width: "100%",
                padding: "10px 12px",
                fontSize: "15px",
                borderRadius: "10px",
                border: "1px solid #cbd5e1",
                backgroundColor: "#ffffff",
              }}
            >
              <option value="20">Zone 20</option>
              <option value="21">Zone 21</option>
              <option value="22">Zone 22</option>
            </select>
          )}
        </div>
      </div>

      <div
        style={{
          display: "inline-flex",
          alignItems: "center",
          gap: "8px",
          padding: "8px 12px",
          borderRadius: "999px",
          fontWeight: 700,
          marginBottom: "18px",
          ...zoneBadgeStyle,
        }}
      >
        <span>Zone {selectedZone}</span>
        <span style={{ opacity: 0.8 }}>•</span>
        <span>{zoneBadgeStyle.label}</span>
      </div>

      <div
        style={{
          marginBottom: "18px",
          padding: "14px 16px",
          borderRadius: "12px",
          backgroundColor: "#f8fafc",
          border: "1px solid #e2e8f0",
        }}
      >
        <strong>Equipment marking being checked:</strong>
        <div style={{ marginTop: "8px", fontFamily: "monospace", fontSize: "15px" }}>
          {marking || "No marking entered"}
        </div>
      </div>

      <div
        style={{
          marginBottom: "18px",
          padding: "14px 16px",
          borderRadius: "12px",
          backgroundColor: "#f8fafc",
          border: "1px solid #e2e8f0",
          lineHeight: 1.6,
        }}
      >
        <strong>Zone requirement:</strong>
        <div style={{ marginTop: "8px" }}>{result.requirement}</div>
      </div>

      <div
        style={{
          padding: "16px",
          borderRadius: "12px",
          ...resultStyle[result.status],
        }}
      >
        <div style={{ fontWeight: 700, marginBottom: "8px" }}>{result.title}</div>
        <div style={{ lineHeight: 1.6 }}>{result.body}</div>
      </div>

      <div
        style={{
          marginTop: "18px",
          padding: "14px 16px",
          borderRadius: "12px",
          backgroundColor: "#f8fafc",
          border: "1px solid #e2e8f0",
          lineHeight: 1.7,
        }}
      >
        <strong>Rule of thumb used:</strong>
        <ul style={{ marginBottom: 0 }}>
          <li>Ga → Zone 0, 1, 2</li>
          <li>Gb → Zone 1, 2</li>
          <li>Gc → Zone 2</li>
          <li>Da → Zone 20, 21, 22</li>
          <li>Db → Zone 21, 22</li>
          <li>Dc → Zone 22</li>
          <li>ia → Zone 0, 1, 2</li>
          <li>ib → Zone 1, 2</li>
          <li>ic → Zone 2</li>
        </ul>
      </div>
    </div>
  )
}

export default ZoneSuitabilityCard