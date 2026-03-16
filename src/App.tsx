import "./App.css"
import { useMemo, useState } from "react"
import { zones } from "./data/zones"
import { mappingRules } from "./data/mappingRules"
import { usClassDivisions } from "./data/usClassDivisions"
import AtexCard from "./components/AtexCard"
import UsComparisonCard from "./components/USComparisonCard"
import MarkingInterpreter from "./components/MarkingInterpreter"
import ZoneSuitabilityCard from "./components/ZoneSuitabilityCard"

type HazardMode = "gas" | "dust" | "gas-dust"
type MainTab = "overview" | "marking" | "zone" | "temperature"

type TemperatureClass = "T1" | "T2" | "T3" | "T4" | "T5" | "T6"

const appShellStyle: React.CSSProperties = {
  padding: "24px",
  fontFamily: "Arial, sans-serif",
  maxWidth: "1200px",
  margin: "0 auto",
}

const gridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
  gap: "20px",
  alignItems: "start",
}

const panelStyle: React.CSSProperties = {
  border: "1px solid #d8dee8",
  borderRadius: "16px",
  padding: "20px",
  backgroundColor: "#ffffff",
  textAlign: "left",
  boxShadow: "0 6px 18px rgba(15, 23, 42, 0.06)",
}

const sectionTitleStyle: React.CSSProperties = {
  marginTop: 0,
  marginBottom: "8px",
  fontSize: "24px",
}

const sectionIntroStyle: React.CSSProperties = {
  marginTop: 0,
  marginBottom: "20px",
  color: "#5b6472",
  lineHeight: 1.5,
}

const fieldLabelStyle: React.CSSProperties = {
  display: "block",
  marginBottom: "8px",
  fontWeight: 700,
  color: "#1f2937",
}

const selectStyle: React.CSSProperties = {
  width: "100%",
  maxWidth: "340px",
  padding: "10px 12px",
  fontSize: "15px",
  borderRadius: "10px",
  border: "1px solid #cbd5e1",
  backgroundColor: "#ffffff",
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  maxWidth: "420px",
  padding: "10px 12px",
  fontSize: "15px",
  borderRadius: "10px",
  border: "1px solid #cbd5e1",
  backgroundColor: "#ffffff",
}

const tClassMaxSurfaceTemp: Record<TemperatureClass, number> = {
  T1: 450,
  T2: 300,
  T3: 200,
  T4: 135,
  T5: 100,
  T6: 85,
}

function getRequiredTClass(autoIgnitionTemp: number): TemperatureClass | null {
  const ordered: TemperatureClass[] = ["T6", "T5", "T4", "T3", "T2", "T1"]

  for (const tClass of ordered) {
    if (tClassMaxSurfaceTemp[tClass] < autoIgnitionTemp) {
      return tClass
    }
  }

  return null
}

function getMarkingTClass(marking: string): TemperatureClass | null {
  const match = marking.match(/\bT[1-6]\b/i)
  return match ? (match[0].toUpperCase() as TemperatureClass) : null
}

function TemperatureClassTool({
  marking,
}: {
  marking: string
}) {
  const [gasType, setGasType] = useState("Hydrogen")
  const [autoIgnitionTemp, setAutoIgnitionTemp] = useState("560")

  const parsedTemp = Number(autoIgnitionTemp)

  const result = useMemo(() => {
    if (!Number.isFinite(parsedTemp) || parsedTemp <= 0) {
      return {
        status: "warning" as const,
        title: "Enter a valid auto-ignition temperature.",
        body: "The temperature must be a number greater than zero.",
      }
    }

    const requiredTClass = getRequiredTClass(parsedTemp)

    if (!requiredTClass) {
      return {
        status: "fail" as const,
        title: "No standard T-class is suitable.",
        body: `The auto-ignition temperature of ${parsedTemp}°C is too low for standard T1 to T6 equipment classification. This would need more detailed engineering review.`,
      }
    }

    const equipmentTClass = getMarkingTClass(marking)

    if (!equipmentTClass) {
      return {
        status: "warning" as const,
        title: `Required T-class: ${requiredTClass} or better.`,
        body: `The entered marking does not currently include a recognised T-class token. Add a marking such as T4 or T5 to complete the check.`,
      }
    }

    const equipmentLimit = tClassMaxSurfaceTemp[equipmentTClass]
    const requiredLimit = tClassMaxSurfaceTemp[requiredTClass]
    const isSuitable = equipmentLimit <= requiredLimit

    if (isSuitable) {
      return {
        status: "pass" as const,
        title: "✓ Equipment temperature class is suitable.",
        body: `Required class is ${requiredTClass} or better for ${gasType} at ${parsedTemp}°C auto-ignition temperature. Equipment marking ${equipmentTClass} has a maximum surface temperature of ${equipmentLimit}°C, which is below the gas auto-ignition temperature.`,
      }
    }

    return {
      status: "fail" as const,
      title: "✖ Equipment temperature class is not suitable.",
      body: `Required class is ${requiredTClass} or better for ${gasType} at ${parsedTemp}°C auto-ignition temperature. Equipment marking ${equipmentTClass} allows up to ${equipmentLimit}°C, which is too high for this duty.`,
    }
  }, [gasType, marking, parsedTemp])

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
    <div style={panelStyle}>
      <h2 style={sectionTitleStyle}>Temperature Class Checker</h2>
      <p style={sectionIntroStyle}>
        Check whether the equipment T-class in the marking is suitable for the gas
        auto-ignition temperature.
      </p>

      <div style={gridStyle}>
        <div>
          <label htmlFor="gas-type-input" style={fieldLabelStyle}>
            Gas Type
          </label>
          <input
            id="gas-type-input"
            type="text"
            value={gasType}
            onChange={(event) => setGasType(event.target.value)}
            style={inputStyle}
          />
        </div>

        <div>
          <label htmlFor="ait-input" style={fieldLabelStyle}>
            Auto-Ignition Temperature (°C)
          </label>
          <input
            id="ait-input"
            type="number"
            value={autoIgnitionTemp}
            onChange={(event) => setAutoIgnitionTemp(event.target.value)}
            style={inputStyle}
          />
        </div>
      </div>

      <div
        style={{
          marginTop: "18px",
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
          marginTop: "18px",
          padding: "16px",
          borderRadius: "12px",
          ...resultStyle[result.status],
        }}
      >
        <div style={{ fontWeight: 700, marginBottom: "8px" }}>{result.title}</div>
        <div style={{ lineHeight: 1.6 }}>{result.body}</div>
      </div>

      <div style={{ marginTop: "18px", color: "#5b6472", lineHeight: 1.6 }}>
        <strong>Typical T-class limits:</strong> T1 450°C, T2 300°C, T3 200°C, T4 135°C,
        T5 100°C, T6 85°C.
      </div>
    </div>
  )
}

function App() {
  const gasZones = zones.filter((zone) => zone.hazardFamily === "gas")
  const dustZones = zones.filter((zone) => zone.hazardFamily === "dust")

  const [mainTab, setMainTab] = useState<MainTab>("overview")
  const [hazardMode, setHazardMode] = useState<HazardMode>("gas")
  const [selectedGasZoneId, setSelectedGasZoneId] = useState(gasZones[0].id)
  const [selectedDustZoneId, setSelectedDustZoneId] = useState(dustZones[0].id)
  const [equipmentMarking, setEquipmentMarking] = useState("II 2G Ex db eb IIC T4 Gb")

  const selectedGasZone = gasZones.find((zone) => zone.id === selectedGasZoneId)
  const selectedDustZone = dustZones.find((zone) => zone.id === selectedDustZoneId)

  const gasMapping = mappingRules.find(
    (rule) => rule.sourceSystem === "ATEX" && rule.sourceKey === selectedGasZoneId
  )

  const dustMapping = mappingRules.find(
    (rule) => rule.sourceSystem === "ATEX" && rule.sourceKey === selectedDustZoneId
  )

  const mappedGasUS = gasMapping
    ? usClassDivisions.filter((us) => gasMapping.targetKeys.includes(us.id))
    : []

  const mappedDustUS = dustMapping
    ? usClassDivisions.filter((us) => dustMapping.targetKeys.includes(us.id))
    : []

  const tabButtonStyle = (isActive: boolean): React.CSSProperties => ({
    padding: "10px 16px",
    borderRadius: "12px",
    border: isActive ? "1px solid #2d6cdf" : "1px solid #d3dae6",
    backgroundColor: isActive ? "#eaf2ff" : "#ffffff",
    color: isActive ? "#1f4fbf" : "#334155",
    fontWeight: isActive ? 700 : 600,
    cursor: "pointer",
    fontSize: "15px",
    boxShadow: isActive ? "0 6px 14px rgba(45, 108, 223, 0.12)" : "none",
  })

  return (
    <div style={appShellStyle}>
      <h1 style={{ marginBottom: "8px" }}>ATEX Dashboard</h1>
      <p style={{ marginTop: 0, marginBottom: "24px", color: "#555", lineHeight: 1.6 }}>
        Hazardous area reference, equipment marking interpretation, and quick engineering
        suitability tools.
      </p>

      <div
        style={{
          display: "flex",
          gap: "12px",
          marginBottom: "28px",
          flexWrap: "wrap",
        }}
      >
        <button
          type="button"
          onClick={() => setMainTab("overview")}
          style={tabButtonStyle(mainTab === "overview")}
        >
          Overview
        </button>

        <button
          type="button"
          onClick={() => setMainTab("marking")}
          style={tabButtonStyle(mainTab === "marking")}
        >
          Marking Interpreter
        </button>

        <button
          type="button"
          onClick={() => setMainTab("zone")}
          style={tabButtonStyle(mainTab === "zone")}
        >
          Zone Suitability
        </button>

        <button
          type="button"
          onClick={() => setMainTab("temperature")}
          style={tabButtonStyle(mainTab === "temperature")}
        >
          Temperature Class
        </button>
      </div>

      {mainTab === "overview" && (
        <>
          <h2 style={sectionTitleStyle}>ATEX ↔ Class/Division Comparison</h2>
          <p style={sectionIntroStyle}>
            Compare gas and dust zoning against the nearest US Class/Division approach and
            review typical marking expectations.
          </p>

          <div style={{ ...panelStyle, marginBottom: "20px" }}>
            <label htmlFor="hazard-mode-select" style={fieldLabelStyle}>
              Hazard Mode
            </label>

            <select
              id="hazard-mode-select"
              value={hazardMode}
              onChange={(event) => setHazardMode(event.target.value as HazardMode)}
              style={selectStyle}
            >
              <option value="gas">Gas</option>
              <option value="dust">Dust</option>
              <option value="gas-dust">Gas + Dust</option>
            </select>
          </div>

          {hazardMode === "gas" && (
            <>
              <div style={{ ...panelStyle, marginBottom: "20px" }}>
                <label htmlFor="gas-zone-select" style={fieldLabelStyle}>
                  Select ATEX Gas Zone
                </label>

                <select
                  id="gas-zone-select"
                  value={selectedGasZoneId}
                  onChange={(event) => setSelectedGasZoneId(event.target.value)}
                  style={selectStyle}
                >
                  {gasZones.map((zone) => (
                    <option key={zone.id} value={zone.id}>
                      ATEX Zone {zone.zone} – GAS
                    </option>
                  ))}
                </select>
              </div>

              <div style={gridStyle}>
                <AtexCard title="ATEX / IECEx Gas" selectedZone={selectedGasZone} />
                <UsComparisonCard
                  title="Nearest US Class/Division Equivalent"
                  mappedUS={mappedGasUS}
                  mapping={gasMapping}
                />
              </div>
            </>
          )}

          {hazardMode === "dust" && (
            <>
              <div style={{ ...panelStyle, marginBottom: "20px" }}>
                <label htmlFor="dust-zone-select" style={fieldLabelStyle}>
                  Select ATEX Dust Zone
                </label>

                <select
                  id="dust-zone-select"
                  value={selectedDustZoneId}
                  onChange={(event) => setSelectedDustZoneId(event.target.value)}
                  style={selectStyle}
                >
                  {dustZones.map((zone) => (
                    <option key={zone.id} value={zone.id}>
                      ATEX Zone {zone.zone} – DUST
                    </option>
                  ))}
                </select>
              </div>

              <div style={gridStyle}>
                <AtexCard title="ATEX / IECEx Dust" selectedZone={selectedDustZone} />
                <UsComparisonCard
                  title="Nearest US Class/Division Equivalent"
                  mappedUS={mappedDustUS}
                  mapping={dustMapping}
                />
              </div>
            </>
          )}

          {hazardMode === "gas-dust" && (
            <>
              <div style={{ ...gridStyle, marginBottom: "20px" }}>
                <div style={panelStyle}>
                  <label htmlFor="gas-zone-select-combined" style={fieldLabelStyle}>
                    Select ATEX Gas Zone
                  </label>

                  <select
                    id="gas-zone-select-combined"
                    value={selectedGasZoneId}
                    onChange={(event) => setSelectedGasZoneId(event.target.value)}
                    style={selectStyle}
                  >
                    {gasZones.map((zone) => (
                      <option key={zone.id} value={zone.id}>
                        ATEX Zone {zone.zone} – GAS
                      </option>
                    ))}
                  </select>
                </div>

                <div style={panelStyle}>
                  <label htmlFor="dust-zone-select-combined" style={fieldLabelStyle}>
                    Select ATEX Dust Zone
                  </label>

                  <select
                    id="dust-zone-select-combined"
                    value={selectedDustZoneId}
                    onChange={(event) => setSelectedDustZoneId(event.target.value)}
                    style={selectStyle}
                  >
                    {dustZones.map((zone) => (
                      <option key={zone.id} value={zone.id}>
                        ATEX Zone {zone.zone} – DUST
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div style={{ ...gridStyle, marginBottom: "20px" }}>
                <AtexCard title="ATEX / IECEx Gas" selectedZone={selectedGasZone} />
                <AtexCard title="ATEX / IECEx Dust" selectedZone={selectedDustZone} />
              </div>

              <div style={{ ...gridStyle, marginBottom: "20px" }}>
                <UsComparisonCard
                  title="Nearest US Gas Equivalent"
                  mappedUS={mappedGasUS}
                  mapping={gasMapping}
                />

                <UsComparisonCard
                  title="Nearest US Dust Equivalent"
                  mappedUS={mappedDustUS}
                  mapping={dustMapping}
                />
              </div>

              <div style={panelStyle}>
                <h3 style={{ marginTop: 0 }}>Combined Gas + Dust Considerations</h3>
                <ul style={{ paddingLeft: "20px", lineHeight: 1.7, marginBottom: 0 }}>
                  <li>
                    Equipment may need suitable certification and marking for both gas and dust
                    hazards.
                  </li>
                  <li>
                    Do not assume gas-certified equipment is automatically suitable for dust
                    service.
                  </li>
                  <li>
                    Check gas group, dust group, and temperature or maximum surface temperature
                    requirements separately.
                  </li>
                  <li>
                    Final equipment suitability depends on the full equipment marking,
                    installation method, and site basis of safety.
                  </li>
                  <li>
                    Where both gas and dust risks exist, the final selection may need to satisfy
                    the more onerous requirements from each hazard family.
                  </li>
                </ul>
              </div>
            </>
          )}
        </>
      )}

      {mainTab === "marking" && (
        <MarkingInterpreter marking={equipmentMarking} setMarking={setEquipmentMarking} />
      )}

      {mainTab === "zone" && (
        <>
          <div style={{ ...panelStyle, marginBottom: "20px" }}>
            <h2 style={sectionTitleStyle}>Zone Suitability</h2>
            <p style={sectionIntroStyle}>
              Use the entered marking below as the basis for the suitability check.
            </p>

            <label htmlFor="shared-marking-input" style={fieldLabelStyle}>
              Equipment Marking
            </label>

            <input
              id="shared-marking-input"
              type="text"
              value={equipmentMarking}
              onChange={(event) => setEquipmentMarking(event.target.value)}
              style={{ ...inputStyle, maxWidth: "720px" }}
            />
          </div>

          <ZoneSuitabilityCard marking={equipmentMarking} />
        </>
      )}

      {mainTab === "temperature" && <TemperatureClassTool marking={equipmentMarking} />}
    </div>
  )
}

export default App