import "./App.css"
import { useState } from "react"
import { zones } from "./data/zones"
import { mappingRules } from "./data/mappingRules"
import { usClassDivisions } from "./data/usClassDivisions"
import AtexCard from "./components/AtexCard"
import UsComparisonCard from "./components/USComparisonCard"
import MarkingInterpreter from "./components/MarkingInterpreter"
import ZoneSuitabilityCard from "./components/ZoneSuitabilityCard"

type HazardMode = "gas" | "dust" | "gas-dust"
type MainTab = "comparison" | "marking"

function App() {
  const gasZones = zones.filter((zone) => zone.hazardFamily === "gas")
  const dustZones = zones.filter((zone) => zone.hazardFamily === "dust")

  const [mainTab, setMainTab] = useState<MainTab>("comparison")
  const [hazardMode, setHazardMode] = useState<HazardMode>("gas")
  const [selectedGasZoneId, setSelectedGasZoneId] = useState(gasZones[0].id)
  const [selectedDustZoneId, setSelectedDustZoneId] = useState(dustZones[0].id)
  const [equipmentMarking, setEquipmentMarking] = useState("II 2G Ex db IIC T4 Gb")

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

  const tabButtonStyle = (isActive: boolean) => ({
    padding: "10px 16px",
    borderRadius: "10px",
    border: isActive ? "1px solid #2d6cdf" : "1px solid #cfcfcf",
    backgroundColor: isActive ? "#eaf2ff" : "#ffffff",
    color: isActive ? "#1f4fbf" : "#333333",
    fontWeight: isActive ? 700 : 600,
    cursor: "pointer",
    fontSize: "15px",
  })

  return (
    <div
      style={{
        padding: "24px",
        fontFamily: "Arial, sans-serif",
        maxWidth: "1200px",
        margin: "0 auto",
      }}
    >
      <h1 style={{ marginBottom: "8px" }}>ATEX Dashboard</h1>
      <p style={{ marginTop: 0, marginBottom: "24px", color: "#555" }}>
        Hazardous area comparison and equipment marking tools.
      </p>

      <div
        style={{
          display: "flex",
          gap: "12px",
          marginBottom: "24px",
          flexWrap: "wrap",
        }}
      >
        <button
          type="button"
          onClick={() => setMainTab("comparison")}
          style={tabButtonStyle(mainTab === "comparison")}
        >
          ATEX / Class-Div Comparison
        </button>

        <button
          type="button"
          onClick={() => setMainTab("marking")}
          style={tabButtonStyle(mainTab === "marking")}
        >
          Equipment Marking Tools
        </button>
      </div>

      {mainTab === "comparison" && (
        <>
          <h2>ATEX ↔ Class/Division Comparison</h2>

          <div style={{ marginBottom: "20px" }}>
            <label
              htmlFor="hazard-mode-select"
              style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}
            >
              Hazard Mode
            </label>

            <select
              id="hazard-mode-select"
              value={hazardMode}
              onChange={(event) => setHazardMode(event.target.value as HazardMode)}
              style={{ padding: "8px", minWidth: "280px", fontSize: "16px" }}
            >
              <option value="gas">Gas</option>
              <option value="dust">Dust</option>
              <option value="gas-dust">Gas + Dust</option>
            </select>
          </div>

          {hazardMode === "gas" && (
            <>
              <div style={{ marginBottom: "20px" }}>
                <label
                  htmlFor="gas-zone-select"
                  style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}
                >
                  Select ATEX Gas Zone
                </label>

                <select
                  id="gas-zone-select"
                  value={selectedGasZoneId}
                  onChange={(event) => setSelectedGasZoneId(event.target.value)}
                  style={{ padding: "8px", minWidth: "280px", fontSize: "16px" }}
                >
                  {gasZones.map((zone) => (
                    <option key={zone.id} value={zone.id}>
                      ATEX Zone {zone.zone} – GAS
                    </option>
                  ))}
                </select>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "20px",
                  alignItems: "start",
                }}
              >
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
              <div style={{ marginBottom: "20px" }}>
                <label
                  htmlFor="dust-zone-select"
                  style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}
                >
                  Select ATEX Dust Zone
                </label>

                <select
                  id="dust-zone-select"
                  value={selectedDustZoneId}
                  onChange={(event) => setSelectedDustZoneId(event.target.value)}
                  style={{ padding: "8px", minWidth: "280px", fontSize: "16px" }}
                >
                  {dustZones.map((zone) => (
                    <option key={zone.id} value={zone.id}>
                      ATEX Zone {zone.zone} – DUST
                    </option>
                  ))}
                </select>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "20px",
                  alignItems: "start",
                }}
              >
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
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "20px",
                  marginBottom: "20px",
                }}
              >
                <div>
                  <label
                    htmlFor="gas-zone-select-combined"
                    style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}
                  >
                    Select ATEX Gas Zone
                  </label>

                  <select
                    id="gas-zone-select-combined"
                    value={selectedGasZoneId}
                    onChange={(event) => setSelectedGasZoneId(event.target.value)}
                    style={{ padding: "8px", minWidth: "280px", fontSize: "16px" }}
                  >
                    {gasZones.map((zone) => (
                      <option key={zone.id} value={zone.id}>
                        ATEX Zone {zone.zone} – GAS
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    htmlFor="dust-zone-select-combined"
                    style={{ display: "block", marginBottom: "8px", fontWeight: "bold" }}
                  >
                    Select ATEX Dust Zone
                  </label>

                  <select
                    id="dust-zone-select-combined"
                    value={selectedDustZoneId}
                    onChange={(event) => setSelectedDustZoneId(event.target.value)}
                    style={{ padding: "8px", minWidth: "280px", fontSize: "16px" }}
                  >
                    {dustZones.map((zone) => (
                      <option key={zone.id} value={zone.id}>
                        ATEX Zone {zone.zone} – DUST
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "20px",
                  alignItems: "start",
                  marginBottom: "20px",
                }}
              >
                <AtexCard title="ATEX / IECEx Gas" selectedZone={selectedGasZone} />
                <AtexCard title="ATEX / IECEx Dust" selectedZone={selectedDustZone} />
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "20px",
                  alignItems: "start",
                  marginBottom: "20px",
                }}
              >
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

              <div
                style={{
                  border: "1px solid #ccc",
                  borderRadius: "12px",
                  padding: "20px",
                  backgroundColor: "#fff8e8",
                  textAlign: "left",
                }}
              >
                <h3>Combined Gas + Dust Considerations</h3>
                <ul style={{ paddingLeft: "20px", lineHeight: 1.6 }}>
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
                    Final equipment suitability depends on the full equipment marking, installation
                    method, and site basis of safety.
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
        <>
          <h2>Equipment Marking Tools</h2>
          <p style={{ marginTop: 0, marginBottom: "20px", color: "#555" }}>
            Interpret the marking and see which ATEX zones it may be suitable for.
          </p>

          <MarkingInterpreter
            marking={equipmentMarking}
            setMarking={setEquipmentMarking}
          />

          <ZoneSuitabilityCard marking={equipmentMarking} />
        </>
      )}
    </div>
  )
}

export default App