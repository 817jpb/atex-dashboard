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

  return (
    <div className="app-container">
      <h1>ATEX Dashboard</h1>
      <p className="app-subtitle">
        Hazardous area comparison and equipment marking tools.
      </p>

      <div className="tab-bar">
        <button
          type="button"
          onClick={() => setMainTab("comparison")}
          className={`tab-btn${mainTab === "comparison" ? " tab-btn--active" : ""}`}
        >
          ATEX / Class-Div Comparison
        </button>

        <button
          type="button"
          onClick={() => setMainTab("marking")}
          className={`tab-btn${mainTab === "marking" ? " tab-btn--active" : ""}`}
        >
          Equipment Marking Tools
        </button>
      </div>

      {mainTab === "comparison" && (
        <>
          <h2>ATEX ↔ Class/Division Comparison</h2>

          <div className="form-group">
            <label htmlFor="hazard-mode-select" className="form-label">
              Hazard Mode
            </label>

            <select
              id="hazard-mode-select"
              value={hazardMode}
              onChange={(event) => setHazardMode(event.target.value as HazardMode)}
              className="form-select"
            >
              <option value="gas">Gas</option>
              <option value="dust">Dust</option>
              <option value="gas-dust">Gas + Dust</option>
            </select>
          </div>

          {hazardMode === "gas" && (
            <>
              <div className="form-group">
                <label htmlFor="gas-zone-select" className="form-label">
                  Select ATEX Gas Zone
                </label>

                <select
                  id="gas-zone-select"
                  value={selectedGasZoneId}
                  onChange={(event) => setSelectedGasZoneId(event.target.value)}
                  className="form-select"
                >
                  {gasZones.map((zone) => (
                    <option key={zone.id} value={zone.id}>
                      ATEX Zone {zone.zone} – GAS
                    </option>
                  ))}
                </select>
              </div>

              <div className="two-col-grid">
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
              <div className="form-group">
                <label htmlFor="dust-zone-select" className="form-label">
                  Select ATEX Dust Zone
                </label>

                <select
                  id="dust-zone-select"
                  value={selectedDustZoneId}
                  onChange={(event) => setSelectedDustZoneId(event.target.value)}
                  className="form-select"
                >
                  {dustZones.map((zone) => (
                    <option key={zone.id} value={zone.id}>
                      ATEX Zone {zone.zone} – DUST
                    </option>
                  ))}
                </select>
              </div>

              <div className="two-col-grid">
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
              <div className="two-col-grid two-col-grid--mb">
                <div>
                  <label htmlFor="gas-zone-select-combined" className="form-label">
                    Select ATEX Gas Zone
                  </label>

                  <select
                    id="gas-zone-select-combined"
                    value={selectedGasZoneId}
                    onChange={(event) => setSelectedGasZoneId(event.target.value)}
                    className="form-select"
                  >
                    {gasZones.map((zone) => (
                      <option key={zone.id} value={zone.id}>
                        ATEX Zone {zone.zone} – GAS
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="dust-zone-select-combined" className="form-label">
                    Select ATEX Dust Zone
                  </label>

                  <select
                    id="dust-zone-select-combined"
                    value={selectedDustZoneId}
                    onChange={(event) => setSelectedDustZoneId(event.target.value)}
                    className="form-select"
                  >
                    {dustZones.map((zone) => (
                      <option key={zone.id} value={zone.id}>
                        ATEX Zone {zone.zone} – DUST
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="two-col-grid two-col-grid--mb">
                <AtexCard title="ATEX / IECEx Gas" selectedZone={selectedGasZone} />
                <AtexCard title="ATEX / IECEx Dust" selectedZone={selectedDustZone} />
              </div>

              <div className="two-col-grid two-col-grid--mb">
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

              <div className="card card--warning">
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
          <p className="app-subtitle">
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
