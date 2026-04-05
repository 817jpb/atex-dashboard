import "./App.css"
import { useMemo, useState } from "react"
import DuctCleaningDashboard from "./components/ductcleaning/DuctCleaningDashboard"
import { zones } from "./data/zones"
import { mappingRules } from "./data/mappingRules"
import { usClassDivisions } from "./data/usClassDivisions"
import AtexCard from "./components/AtexCard"
import UsComparisonCard from "./components/USComparisonCard"
import MarkingInterpreter from "./components/MarkingInterpreter"
import ZoneSuitabilityCard from "./components/ZoneSuitabilityCard"
import SubstanceHelper from "./components/SubstanceHelper"
import ProductSelector from "./components/ProductSelector"
import { substances } from "./data/substances"

type HazardMode = "gas" | "dust" | "gas-dust"
type MainTab = "overview" | "marking" | "zone" | "temperature" | "products" | "ductcleaning"

type TemperatureClass = "T1" | "T2" | "T3" | "T4" | "T5" | "T6"

const pageStyle: React.CSSProperties = {
  minHeight: "100vh",
  background:
    "linear-gradient(180deg, #f4f7fb 0%, #eef3f9 100%)",
  padding: "32px 20px 48px",
  boxSizing: "border-box",
}

const appShellStyle: React.CSSProperties = {
  fontFamily: "Arial, sans-serif",
  maxWidth: "1240px",
  margin: "0 auto",
}

const heroStyle: React.CSSProperties = {
  border: "1px solid #d9e2ec",
  borderRadius: "24px",
  padding: "28px 28px 24px",
  background:
    "linear-gradient(135deg, #ffffff 0%, #f8fbff 100%)",
  boxShadow: "0 16px 40px rgba(15, 23, 42, 0.08)",
  marginBottom: "24px",
}

const heroTitleStyle: React.CSSProperties = {
  margin: 0,
  fontSize: "34px",
  lineHeight: 1.1,
  color: "#10233f",
}

const heroSubtitleStyle: React.CSSProperties = {
  marginTop: "12px",
  marginBottom: "18px",
  color: "#526071",
  lineHeight: 1.7,
  maxWidth: "860px",
  fontSize: "16px",
}

const heroBadgeRowStyle: React.CSSProperties = {
  display: "flex",
  flexWrap: "wrap",
  gap: "10px",
}

const heroBadgeStyle: React.CSSProperties = {
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  padding: "8px 12px",
  borderRadius: "999px",
  border: "1px solid #d7e4f4",
  backgroundColor: "#f8fbff",
  color: "#27496d",
  fontSize: "14px",
  fontWeight: 700,
}

const tabBarWrapStyle: React.CSSProperties = {
  marginBottom: "26px",
}

const tabBarStyle: React.CSSProperties = {
  display: "flex",
  gap: "10px",
  flexWrap: "wrap",
  padding: "10px",
  borderRadius: "18px",
  backgroundColor: "#ffffff",
  border: "1px solid #d8dee8",
  boxShadow: "0 10px 24px rgba(15, 23, 42, 0.05)",
}

const contentSectionStyle: React.CSSProperties = {
  display: "grid",
  gap: "20px",
}

const gridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
  gap: "20px",
  alignItems: "start",
}

const panelStyle: React.CSSProperties = {
  border: "1px solid #d8dee8",
  borderRadius: "18px",
  padding: "22px",
  backgroundColor: "#ffffff",
  textAlign: "left",
  boxShadow: "0 10px 28px rgba(15, 23, 42, 0.06)",
}

const softPanelStyle: React.CSSProperties = {
  ...panelStyle,
  background: "linear-gradient(180deg, #ffffff 0%, #fbfcfe 100%)",
}

const sectionTitleStyle: React.CSSProperties = {
  marginTop: 0,
  marginBottom: "8px",
  fontSize: "26px",
  lineHeight: 1.2,
  color: "#12263f",
}

const sectionIntroStyle: React.CSSProperties = {
  marginTop: 0,
  marginBottom: "20px",
  color: "#5b6472",
  lineHeight: 1.6,
  fontSize: "15px",
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
  padding: "11px 13px",
  fontSize: "15px",
  borderRadius: "12px",
  border: "1px solid #cbd5e1",
  backgroundColor: "#ffffff",
  color: "#10233f",
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  maxWidth: "420px",
  padding: "11px 13px",
  fontSize: "15px",
  borderRadius: "12px",
  border: "1px solid #cbd5e1",
  backgroundColor: "#ffffff",
  color: "#10233f",
}

const infoGridStyle: React.CSSProperties = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
  gap: "14px",
}

const infoTileStyle: React.CSSProperties = {
  padding: "16px 18px",
  borderRadius: "16px",
  border: "1px solid #dde6f0",
  backgroundColor: "#f8fbff",
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
  const ordered: TemperatureClass[] = ["T1", "T2", "T3", "T4", "T5", "T6"]

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
  gasType,
  setGasType,
  autoIgnitionTemp,
  setAutoIgnitionTemp,
}: {
  marking: string
  gasType: string
  setGasType: (value: string) => void
  autoIgnitionTemp: string
  setAutoIgnitionTemp: (value: string) => void
}) {

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
    <div style={softPanelStyle}>
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
          padding: "16px 18px",
          borderRadius: "14px",
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
          padding: "18px",
          borderRadius: "14px",
          ...resultStyle[result.status],
        }}
      >
        <div style={{ fontWeight: 700, marginBottom: "8px" }}>{result.title}</div>
        <div style={{ lineHeight: 1.7 }}>{result.body}</div>
      </div>

      <div
        style={{
          marginTop: "18px",
          padding: "16px 18px",
          borderRadius: "14px",
          backgroundColor: "#f8fbff",
          border: "1px solid #dde6f0",
          color: "#4f5d6b",
          lineHeight: 1.7,
        }}
      >
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
  const [selectedSubstance, setSelectedSubstance] = useState("Hydrogen")
  const [gasType, setGasType] = useState("Hydrogen")
  const [autoIgnitionTemp, setAutoIgnitionTemp] = useState("560")

  const handleSubstanceChange = (name: string) => {
    setSelectedSubstance(name)
    const substance = substances.find((s) => s.name === name)
    if (!substance) return
    setGasType(substance.name)
    setAutoIgnitionTemp(String(substance.autoIgnition))
  }

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
    padding: "12px 18px",
    borderRadius: "14px",
    border: isActive ? "1px solid #2d6cdf" : "1px solid transparent",
    background: isActive
      ? "linear-gradient(135deg, #edf4ff 0%, #e5efff 100%)"
      : "transparent",
    color: isActive ? "#1746a2" : "#475569",
    fontWeight: isActive ? 700 : 600,
    cursor: "pointer",
    fontSize: "15px",
    boxShadow: isActive ? "0 10px 20px rgba(45, 108, 223, 0.12)" : "none",
  })

  return (
    <div style={pageStyle}>
      <div style={appShellStyle}>
        <div style={heroStyle}>
          <h1 style={heroTitleStyle}>ATEX Dashboard</h1>
          <p style={heroSubtitleStyle}>
            Hazardous area reference, equipment marking interpretation, and quick
            engineering suitability tools for gas and dust applications.
          </p>

          <div style={heroBadgeRowStyle}>
            <div style={heroBadgeStyle}>ATEX / IECEx reference</div>
            <div style={heroBadgeStyle}>US Class / Division comparison</div>
            <div style={heroBadgeStyle}>Marking interpretation</div>
            <div style={heroBadgeStyle}>Zone suitability checks</div>
            <div style={heroBadgeStyle}>Temperature class support</div>
            <div style={heroBadgeStyle}>Product suitability selector</div>
          </div>
        </div>

        <div style={tabBarWrapStyle}>
          <div style={tabBarStyle}>
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

            <button
              type="button"
              onClick={() => setMainTab("products")}
              style={tabButtonStyle(mainTab === "products")}
            >
              Product Selector
            </button>

            <button
              type="button"
              onClick={() => setMainTab("ductcleaning")}
              style={tabButtonStyle(mainTab === "ductcleaning")}
            >
              Duct Cleaning Logger
            </button>
          </div>
        </div>

        {mainTab === "overview" && (
          <div style={contentSectionStyle}>
            <div style={softPanelStyle}>
              <h2 style={sectionTitleStyle}>ATEX ↔ Class/Division Comparison</h2>
              <p style={sectionIntroStyle}>
                Compare gas and dust zoning against the nearest US Class/Division
                approach and review typical marking expectations.
              </p>

              <div style={infoGridStyle}>
                <div style={infoTileStyle}>
                  <div style={{ fontWeight: 700, marginBottom: "6px", color: "#12263f" }}>
                    Zone 0 / 20
                  </div>
                  <div style={{ color: "#5b6472", lineHeight: 1.6 }}>
                    Continuous or long-duration presence of explosive atmosphere.
                  </div>
                </div>

                <div style={infoTileStyle}>
                  <div style={{ fontWeight: 700, marginBottom: "6px", color: "#12263f" }}>
                    Zone 1 / 21
                  </div>
                  <div style={{ color: "#5b6472", lineHeight: 1.6 }}>
                    Hazard likely in normal operation.
                  </div>
                </div>

                <div style={infoTileStyle}>
                  <div style={{ fontWeight: 700, marginBottom: "6px", color: "#12263f" }}>
                    Zone 2 / 22
                  </div>
                  <div style={{ color: "#5b6472", lineHeight: 1.6 }}>
                    Hazard infrequent and short duration.
                  </div>
                </div>
              </div>
            </div>

            <div style={softPanelStyle}>
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
                <div style={softPanelStyle}>
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
                <div style={softPanelStyle}>
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
                <div style={gridStyle}>
                  <div style={softPanelStyle}>
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

                  <div style={softPanelStyle}>
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

                <div style={gridStyle}>
                  <AtexCard title="ATEX / IECEx Gas" selectedZone={selectedGasZone} />
                  <AtexCard title="ATEX / IECEx Dust" selectedZone={selectedDustZone} />
                </div>

                <div style={gridStyle}>
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

                <div style={softPanelStyle}>
                  <h3 style={{ marginTop: 0, marginBottom: "10px", color: "#12263f" }}>
                    Combined Gas + Dust Considerations
                  </h3>
                  <ul style={{ paddingLeft: "20px", lineHeight: 1.8, marginBottom: 0 }}>
                    <li>
                      Equipment may need suitable certification and marking for both gas
                      and dust hazards.
                    </li>
                    <li>
                      Do not assume gas-certified equipment is automatically suitable for
                      dust service.
                    </li>
                    <li>
                      Check gas group, dust group, and temperature or maximum surface
                      temperature requirements separately.
                    </li>
                    <li>
                      Final equipment suitability depends on the full equipment marking,
                      installation method, and site basis of safety.
                    </li>
                    <li>
                      Where both gas and dust risks exist, the final selection may need to
                      satisfy the more onerous requirements from each hazard family.
                    </li>
                  </ul>
                </div>
              </>
            )}
          </div>
        )}

        {mainTab === "marking" && (
          <div style={contentSectionStyle}>
            <div style={softPanelStyle}>
              <h2 style={sectionTitleStyle}>Equipment Marking Interpreter</h2>
              <p style={sectionIntroStyle}>
                Break down the marking into recognisable engineering elements and review
                how the certificate wording maps to practical selection decisions.
              </p>
            </div>

            <MarkingInterpreter
              marking={equipmentMarking}
              setMarking={setEquipmentMarking}
            />
          </div>
        )}

        {mainTab === "zone" && (
          <div style={contentSectionStyle}>
            <div style={softPanelStyle}>
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
                style={{ ...inputStyle, maxWidth: "760px" }}
              />
            </div>

            <ZoneSuitabilityCard marking={equipmentMarking} />
          </div>
        )}

        {mainTab === "temperature" && (
  <div style={contentSectionStyle}>
    <div style={softPanelStyle}>
      <h2 style={sectionTitleStyle}>Temperature Class</h2>
      <p style={sectionIntroStyle}>
        Check whether the entered T-class is suitable for the gas
        auto-ignition temperature and review the expected temperature limit.
      </p>
    </div>

    <TemperatureClassTool
  marking={equipmentMarking}
  gasType={gasType}
  setGasType={setGasType}
  autoIgnitionTemp={autoIgnitionTemp}
  setAutoIgnitionTemp={setAutoIgnitionTemp}
/>

<SubstanceHelper
  selectedSubstance={selectedSubstance}
  onSubstanceChange={handleSubstanceChange}
/>
  </div>
)}

        {mainTab === "products" && (
          <div style={contentSectionStyle}>
            <ProductSelector />
          </div>
        )}

        {mainTab === "ductcleaning" && (
          <div style={contentSectionStyle}>
            <DuctCleaningDashboard />
          </div>
        )}
      </div>
    </div>
  )
}

export default App