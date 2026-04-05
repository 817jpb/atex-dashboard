import { useState, useMemo } from "react"
import { products, assessProduct, requiredTClassFromAit } from "../data/products"
import type { ProductSuitabilityResult, CheckResult, GasGroup, TClass } from "../data/products"
import {
  substances,
  elastomerRatingLabel,
  elastomerRatingColor,
  elastomerRatingBg,
  elastomerRatingBorder,
} from "../data/substances"
import type { Substance } from "../data/substances"

type Standard = "atex" | "nec"

// NEC Class/Division → approximate ATEX zone
function necToAtexZones(
  gasDiv: string | null,
  dustDiv: string | null,
): { gasZone: string | null; dustZone: string | null } {
  return {
    gasZone: gasDiv === "1" ? "1" : gasDiv === "2" ? "2" : null,
    dustZone: dustDiv === "1" ? "21" : dustDiv === "2" ? "22" : null,
  }
}

// ─── Styles ───────────────────────────────────────────────────────────────────

const panelStyle: React.CSSProperties = {
  border: "1px solid #d8dee8",
  borderRadius: "16px",
  padding: "22px",
  backgroundColor: "#ffffff",
  boxShadow: "0 6px 18px rgba(15,23,42,0.06)",
}

const selectStyle: React.CSSProperties = {
  width: "100%",
  padding: "10px 12px",
  fontSize: "15px",
  borderRadius: "10px",
  border: "1px solid #cbd5e1",
  backgroundColor: "#ffffff",
  color: "#10233f",
}

const sectionLabel: React.CSSProperties = {
  fontWeight: 700,
  color: "#1f2937",
  marginBottom: "8px",
  display: "block",
}

const tabBtnStyle = (active: boolean): React.CSSProperties => ({
  padding: "9px 20px",
  borderRadius: "10px",
  border: active ? "1px solid #2d6cdf" : "1px solid #d8dee8",
  background: active ? "linear-gradient(135deg, #edf4ff, #e5efff)" : "#f8fafc",
  color: active ? "#1746a2" : "#475569",
  fontWeight: active ? 700 : 600,
  cursor: "pointer",
  fontSize: "14px",
})

const statusConfig = {
  suitable: { label: "Certified Suitable", color: "#185c37", bg: "#effcf3", border: "#b7ebc6", icon: "✓" },
  "self-assess": { label: "Manual — Self-Assessment Required", color: "#8a5a00", bg: "#fff8eb", border: "#f4d39c", icon: "⚠" },
  "not-suitable": { label: "Not Suitable", color: "#9f1d1d", bg: "#fff1f1", border: "#f3b3b3", icon: "✗" },
}

const checkLabels: Record<CheckResult, string> = {
  suitable: "✓ Meets requirement",
  "self-assess": "⚠ Self-assess",
  "not-suitable": "✗ Does not meet requirement",
  "not-required": "— Not checked",
}

const checkColors: Record<CheckResult, string> = {
  suitable: "#185c37",
  "self-assess": "#8a5a00",
  "not-suitable": "#9f1d1d",
  "not-required": "#94a3b8",
}

// ─── ProductCard ──────────────────────────────────────────────────────────────

function ProductCard({
  result,
  showGas,
  showDust,
  showGasGroup,
  showTClass,
}: {
  result: ProductSuitabilityResult
  showGas: boolean
  showDust: boolean
  showGasGroup: boolean
  showTClass: boolean
}) {
  const [expanded, setExpanded] = useState(false)
  const { product } = result
  const status = statusConfig[result.overall]

  const checks = [
    showGas && { label: "Gas Zone", value: result.gas },
    showDust && { label: "Dust Zone", value: result.dust },
    showGasGroup && { label: "Gas Group", value: result.gasGroup },
    showTClass && { label: "Temperature Class", value: result.tClass },
  ].filter(Boolean) as { label: string; value: CheckResult }[]

  return (
    <div
      style={{
        border: `1px solid ${status.border}`,
        borderRadius: "14px",
        overflow: "hidden",
        backgroundColor: "#ffffff",
        boxShadow: "0 4px 14px rgba(15,23,42,0.06)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "14px 18px",
          backgroundColor: status.bg,
          borderBottom: `1px solid ${status.border}`,
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span style={{ fontSize: "20px", fontWeight: 700, color: status.color }}>{status.icon}</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: "16px", color: "#10233f" }}>{product.name}</div>
            <div style={{ fontSize: "13px", color: status.color, fontWeight: 600, marginTop: "2px" }}>
              {status.label}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {checks.map(({ label, value }) => (
            <span
              key={label}
              style={{
                fontSize: "12px",
                fontWeight: 600,
                padding: "4px 10px",
                borderRadius: "999px",
                border: "1px solid #e2e8f0",
                backgroundColor: "#f8fafc",
                color: checkColors[value],
              }}
            >
              {label}: {checkLabels[value]}
            </span>
          ))}
        </div>
      </div>

      <div style={{ padding: "12px 18px" }}>
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          style={{ background: "none", border: "none", padding: 0, cursor: "pointer", color: "#2d6cdf", fontSize: "13px", fontWeight: 600 }}
        >
          {expanded ? "▲ Hide details" : "▼ Show details"}
        </button>

        {expanded && (
          <div style={{ marginTop: "12px", display: "grid", gap: "10px" }}>
            {product.variant === "automated" && (
              <>
                {product.markingsUnconfirmed && (
                  <div style={{ padding: "10px 14px", borderRadius: "8px", backgroundColor: "#fff8eb", border: "1px solid #f4d39c", fontSize: "13px", color: "#8a5a00", fontWeight: 600 }}>
                    ⚠ ATEX markings below are placeholders pending certificate confirmation.
                  </div>
                )}
                {product.atexGasMarking && (
                  <div style={{ fontSize: "14px" }}>
                    <strong>Gas marking:</strong>{" "}
                    <code style={{ padding: "3px 8px", borderRadius: "6px", backgroundColor: "#f4f6fb", fontSize: "13px" }}>
                      {product.atexGasMarking}
                    </code>
                    {product.atexGasZone && (
                      <span style={{ marginLeft: "8px", color: "#64748b", fontSize: "13px" }}>
                        (Zone {product.atexGasZone} gas · {product.atexGasGroup} · {product.atexTClass})
                      </span>
                    )}
                  </div>
                )}
                {product.atexDustMarking && (
                  <div style={{ fontSize: "14px" }}>
                    <strong>Dust marking:</strong>{" "}
                    <code style={{ padding: "3px 8px", borderRadius: "6px", backgroundColor: "#f4f6fb", fontSize: "13px" }}>
                      {product.atexDustMarking}
                    </code>
                    {product.atexDustZone && (
                      <span style={{ marginLeft: "8px", color: "#64748b", fontSize: "13px" }}>
                        (Zone {product.atexDustZone} dust)
                      </span>
                    )}
                  </div>
                )}
              </>
            )}
            {product.notes.length > 0 && (
              <ul style={{ margin: 0, paddingLeft: "20px", lineHeight: 1.7, fontSize: "13px", color: "#475569" }}>
                {product.notes.map((note) => <li key={note}>{note}</li>)}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── ElastomerPanel ───────────────────────────────────────────────────────────

function ElastomerPanel({ substance }: { substance: Substance }) {
  return (
    <div style={panelStyle}>
      <h3 style={{ marginTop: 0, marginBottom: "6px", color: "#12263f" }}>
        Elastomer Compatibility — {substance.name}
      </h3>
      <p style={{ marginTop: 0, marginBottom: "16px", color: "#5b6472", fontSize: "14px", lineHeight: 1.6 }}>
        Seal material suitability for direct contact with this substance.
        Always confirm with supplier data sheets for your specific application.
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px", marginBottom: "14px" }}>
        {(["epdm", "fkm", "ffkm"] as const).map((e) => {
          const rating = substance.elastomers[e]
          return (
            <div
              key={e}
              style={{
                padding: "16px",
                borderRadius: "12px",
                border: `1px solid ${elastomerRatingBorder[rating]}`,
                backgroundColor: elastomerRatingBg[rating],
              }}
            >
              <div style={{ fontSize: "13px", fontWeight: 700, color: "#64748b", marginBottom: "6px" }}>
                {e.toUpperCase()}
              </div>
              <div style={{ fontWeight: 700, fontSize: "15px", color: elastomerRatingColor[rating] }}>
                {elastomerRatingLabel[rating]}
              </div>
            </div>
          )
        })}
      </div>

      {substance.notes.length > 0 && (
        <ul style={{ margin: 0, paddingLeft: "20px", lineHeight: 1.7, fontSize: "13px", color: "#475569" }}>
          {substance.notes.map((note) => <li key={note}>{note}</li>)}
        </ul>
      )}
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function ProductSelector() {
  const [standard, setStandard] = useState<Standard>("atex")

  // ATEX zone inputs
  const [atexGasZone, setAtexGasZone] = useState<string>("none")
  const [atexDustZone, setAtexDustZone] = useState<string>("none")

  // NEC inputs
  const [necGasDiv, setNecGasDiv] = useState<string>("none")
  const [necDustDiv, setNecDustDiv] = useState<string>("none")

  // Substance input
  const [selectedSubstanceName, setSelectedSubstanceName] = useState<string>("none")
  const selectedSubstance = substances.find((s) => s.name === selectedSubstanceName) ?? null

  // Derive zone requirements
  const { requiredGasZone, requiredDustZone } = useMemo(() => {
    if (standard === "atex") {
      return {
        requiredGasZone: atexGasZone === "none" ? null : atexGasZone,
        requiredDustZone: atexDustZone === "none" ? null : atexDustZone,
      }
    }
    const { gasZone, dustZone } = necToAtexZones(
      necGasDiv === "none" ? null : necGasDiv,
      necDustDiv === "none" ? null : necDustDiv,
    )
    return { requiredGasZone: gasZone, requiredDustZone: dustZone }
  }, [standard, atexGasZone, atexDustZone, necGasDiv, necDustDiv])

  // Derive substance requirements
  const { requiredGasGroup, requiredTClass } = useMemo((): {
    requiredGasGroup: GasGroup | null
    requiredTClass: TClass | null
  } => {
    if (!selectedSubstance || !selectedSubstance.isFlammable) {
      return { requiredGasGroup: null, requiredTClass: null }
    }
    return {
      requiredGasGroup: selectedSubstance.gasGroup,
      requiredTClass: requiredTClassFromAit(selectedSubstance.autoIgnition),
    }
  }, [selectedSubstance])

  const hasRequirement =
    requiredGasZone !== null ||
    requiredDustZone !== null ||
    requiredGasGroup !== null ||
    requiredTClass !== null

  const results = useMemo(() => {
    if (!hasRequirement) return []
    return products.map((p) =>
      assessProduct(p, requiredGasZone, requiredDustZone, requiredGasGroup, requiredTClass)
    )
  }, [hasRequirement, requiredGasZone, requiredDustZone, requiredGasGroup, requiredTClass])

  const suitable = results.filter((r) => r.overall === "suitable")
  const selfAssess = results.filter((r) => r.overall === "self-assess")
  const notSuitable = results.filter((r) => r.overall === "not-suitable")

  const showGas = requiredGasZone !== null
  const showDust = requiredDustZone !== null
  const showGasGroup = requiredGasGroup !== null
  const showTClass = requiredTClass !== null

  return (
    <div style={{ display: "grid", gap: "20px" }}>
      {/* ── Input panel ──────────────────────────────────────────────────── */}
      <div style={panelStyle}>
        <h2 style={{ marginTop: 0, marginBottom: "6px", color: "#12263f" }}>
          Product Suitability Selector
        </h2>
        <p style={{ marginTop: 0, marginBottom: "24px", color: "#5b6472", lineHeight: 1.6 }}>
          Enter the customer's area classification and / or process substance to see
          which products are suitable and which elastomer to specify.
        </p>

        {/* Step 1: Area classification */}
        <div style={{ marginBottom: "26px" }}>
          <div style={{ fontWeight: 700, color: "#12263f", marginBottom: "12px", fontSize: "15px" }}>
            Step 1 — Area Classification (optional)
          </div>

          <div style={{ display: "flex", gap: "10px", marginBottom: "16px" }}>
            <button type="button" style={tabBtnStyle(standard === "atex")} onClick={() => setStandard("atex")}>
              ATEX / IECEx
            </button>
            <button type="button" style={tabBtnStyle(standard === "nec")} onClick={() => setStandard("nec")}>
              NEC (US Class/Division)
            </button>
          </div>

          {standard === "atex" && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "14px" }}>
              <div>
                <label htmlFor="req-gas-zone" style={sectionLabel}>Gas Zone</label>
                <select id="req-gas-zone" value={atexGasZone} onChange={(e) => setAtexGasZone(e.target.value)} style={selectStyle}>
                  <option value="none">No gas hazard / not specified</option>
                  <option value="0">Zone 0 — Continuous gas hazard</option>
                  <option value="1">Zone 1 — Likely gas hazard</option>
                  <option value="2">Zone 2 — Infrequent gas hazard</option>
                </select>
              </div>
              <div>
                <label htmlFor="req-dust-zone" style={sectionLabel}>Dust Zone</label>
                <select id="req-dust-zone" value={atexDustZone} onChange={(e) => setAtexDustZone(e.target.value)} style={selectStyle}>
                  <option value="none">No dust hazard / not specified</option>
                  <option value="20">Zone 20 — Continuous dust hazard</option>
                  <option value="21">Zone 21 — Likely dust hazard</option>
                  <option value="22">Zone 22 — Infrequent dust hazard</option>
                </select>
              </div>
            </div>
          )}

          {standard === "nec" && (
            <>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "14px" }}>
                <div>
                  <label htmlFor="req-nec-gas" style={sectionLabel}>Gas (Class I)</label>
                  <select id="req-nec-gas" value={necGasDiv} onChange={(e) => setNecGasDiv(e.target.value)} style={selectStyle}>
                    <option value="none">No gas hazard / not specified</option>
                    <option value="1">Class I Division 1 — Likely gas hazard</option>
                    <option value="2">Class I Division 2 — Infrequent gas hazard</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="req-nec-dust" style={sectionLabel}>Dust (Class II)</label>
                  <select id="req-nec-dust" value={necDustDiv} onChange={(e) => setNecDustDiv(e.target.value)} style={selectStyle}>
                    <option value="none">No dust hazard / not specified</option>
                    <option value="1">Class II Division 1 — Likely dust hazard</option>
                    <option value="2">Class II Division 2 — Infrequent dust hazard</option>
                  </select>
                </div>
              </div>
              <div style={{ marginTop: "12px", padding: "10px 14px", borderRadius: "8px", backgroundColor: "#eef5ff", border: "1px solid #c9d8ff", fontSize: "13px", color: "#4f5d6b" }}>
                NEC converted to approximate ATEX equivalents: Class I Div 1 ≈ Zone 1 · Class I Div 2 ≈ Zone 2 · Class II Div 1 ≈ Zone 21 · Class II Div 2 ≈ Zone 22
              </div>
            </>
          )}
        </div>

        {/* Step 2: Process substance */}
        <div>
          <div style={{ fontWeight: 700, color: "#12263f", marginBottom: "4px", fontSize: "15px" }}>
            Step 2 — Process Substance (optional)
          </div>
          <p style={{ marginTop: 0, marginBottom: "12px", color: "#5b6472", fontSize: "13px", lineHeight: 1.6 }}>
            Select the solvent or substance in contact with the equipment internals.
            This drives gas group and temperature class requirements, and shows elastomer compatibility.
          </p>

          <select
            id="substance-select"
            value={selectedSubstanceName}
            onChange={(e) => setSelectedSubstanceName(e.target.value)}
            style={{ ...selectStyle, maxWidth: "380px" }}
          >
            <option value="none">No substance selected</option>
            <optgroup label="Pharmaceutical / Cleanroom Solvents">
              {substances.filter((s) => s.type === "gas" && !["Hydrogen", "Methane", "Propane"].includes(s.name)).map((s) => (
                <option key={s.name} value={s.name}>{s.name}</option>
              ))}
            </optgroup>
            <optgroup label="Industrial Gases">
              {substances.filter((s) => ["Hydrogen", "Methane", "Propane"].includes(s.name)).map((s) => (
                <option key={s.name} value={s.name}>{s.name}</option>
              ))}
            </optgroup>
            <optgroup label="Dusts">
              {substances.filter((s) => s.type === "dust").map((s) => (
                <option key={s.name} value={s.name}>{s.name}</option>
              ))}
            </optgroup>
          </select>

          {/* Substance-derived requirements summary */}
          {selectedSubstance && (
            <div
              style={{
                marginTop: "14px",
                padding: "14px 16px",
                borderRadius: "12px",
                backgroundColor: selectedSubstance.isFlammable ? "#fff8eb" : "#f0fdf4",
                border: `1px solid ${selectedSubstance.isFlammable ? "#f4d39c" : "#b7ebc6"}`,
                fontSize: "14px",
                lineHeight: 1.7,
              }}
            >
              {selectedSubstance.isFlammable ? (
                <>
                  <strong>{selectedSubstance.name}</strong> is flammable —
                  gas group <strong>{selectedSubstance.gasGroup}</strong>,
                  auto-ignition <strong>{selectedSubstance.autoIgnition}°C</strong>,
                  flash point <strong>{selectedSubstance.flashPoint !== null ? `${selectedSubstance.flashPoint}°C` : "N/A"}</strong>.
                  {requiredTClass && (
                    <> Minimum equipment T-class required: <strong>{requiredTClass}</strong>.</>
                  )}
                </>
              ) : (
                <>
                  <strong>{selectedSubstance.name}</strong> is not classified as flammable under normal conditions —
                  no gas group or T-class requirement is added. Elastomer compatibility is still shown below.
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* ── Prompt if nothing entered ─────────────────────────────────────── */}
      {!hasRequirement && !selectedSubstance && (
        <div style={{ ...panelStyle, textAlign: "center", padding: "40px 22px", color: "#64748b" }}>
          Complete Step 1 or Step 2 above to see product recommendations.
        </div>
      )}

      {/* ── Elastomer panel (shown whenever a substance is selected) ──────── */}
      {selectedSubstance && <ElastomerPanel substance={selectedSubstance} />}

      {/* ── Product results ───────────────────────────────────────────────── */}
      {hasRequirement && (
        <div style={{ display: "grid", gap: "20px" }}>
          {/* Summary bar */}
          <div style={{ ...panelStyle, padding: "14px 20px", display: "flex", flexWrap: "wrap", gap: "16px", alignItems: "center" }}>
            <span style={{ fontWeight: 700, color: "#12263f" }}>
              Matching:{" "}
              {[
                requiredGasZone && `Gas Zone ${requiredGasZone}`,
                requiredDustZone && `Dust Zone ${requiredDustZone}`,
                requiredGasGroup && `Gas Group ${requiredGasGroup}`,
                requiredTClass && `T-class ≥ ${requiredTClass}`,
              ].filter(Boolean).join(" · ")}
              {standard === "nec" && " (converted from NEC)"}
            </span>
            <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
              <span style={{ color: "#185c37", fontWeight: 600, fontSize: "14px" }}>✓ {suitable.length} certified suitable</span>
              <span style={{ color: "#8a5a00", fontWeight: 600, fontSize: "14px" }}>⚠ {selfAssess.length} manual / self-assess</span>
              <span style={{ color: "#9f1d1d", fontWeight: 600, fontSize: "14px" }}>✗ {notSuitable.length} not suitable</span>
            </div>
          </div>

          {suitable.length > 0 && (
            <div>
              <h3 style={{ marginTop: 0, marginBottom: "12px", color: "#12263f" }}>Certified Suitable</h3>
              <div style={{ display: "grid", gap: "12px" }}>
                {suitable.map((r) => (
                  <ProductCard key={r.product.id} result={r} showGas={showGas} showDust={showDust} showGasGroup={showGasGroup} showTClass={showTClass} />
                ))}
              </div>
            </div>
          )}

          {selfAssess.length > 0 && (
            <div>
              <h3 style={{ marginTop: 0, marginBottom: "12px", color: "#12263f" }}>Manual Products — Customer Self-Assessment Required</h3>
              <div style={{ display: "grid", gap: "12px" }}>
                {selfAssess.map((r) => (
                  <ProductCard key={r.product.id} result={r} showGas={showGas} showDust={showDust} showGasGroup={showGasGroup} showTClass={showTClass} />
                ))}
              </div>
            </div>
          )}

          {notSuitable.length > 0 && (
            <div>
              <h3 style={{ marginTop: 0, marginBottom: "12px", color: "#12263f" }}>Not Suitable</h3>
              <div style={{ display: "grid", gap: "12px" }}>
                {notSuitable.map((r) => (
                  <ProductCard key={r.product.id} result={r} showGas={showGas} showDust={showDust} showGasGroup={showGasGroup} showTClass={showTClass} />
                ))}
              </div>
            </div>
          )}

          <div style={{ padding: "14px 18px", borderRadius: "12px", backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", fontSize: "13px", color: "#4f5d6b", lineHeight: 1.7 }}>
            <strong>Important:</strong> This tool provides a first-pass indication only. Final suitability
            must be confirmed against the full ATEX certificate, installation conditions, gas/dust group,
            temperature class, and any special conditions of use. Always consult the certificate and a
            competent person before specifying equipment for hazardous areas.
          </div>
        </div>
      )}
    </div>
  )
}
