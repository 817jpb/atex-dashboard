import { useState, useMemo } from "react"
import { products, assessProduct } from "../data/products"
import type { ProductSuitabilityResult, AtmosphereSuitability } from "../data/products"

type Standard = "atex" | "nec"

// NEC Class/Division → approximate ATEX zone
function necToAtexZones(
  gasDiv: string | null,
  dustDiv: string | null,
): { gasZone: string | null; dustZone: string | null } {
  const gasZone =
    gasDiv === "1" ? "1"
    : gasDiv === "2" ? "2"
    : null
  const dustZone =
    dustDiv === "1" ? "21"
    : dustDiv === "2" ? "22"
    : null
  return { gasZone, dustZone }
}

// ─── Sub-components ───────────────────────────────────────────────────────────

const statusConfig = {
  suitable: {
    label: "Certified Suitable",
    color: "#185c37",
    bg: "#effcf3",
    border: "#b7ebc6",
    icon: "✓",
  },
  "self-assess": {
    label: "Manual — Self-Assessment Required",
    color: "#8a5a00",
    bg: "#fff8eb",
    border: "#f4d39c",
    icon: "⚠",
  },
  "not-suitable": {
    label: "Not Suitable",
    color: "#9f1d1d",
    bg: "#fff1f1",
    border: "#f3b3b3",
    icon: "✗",
  },
}

const atmosphereLabels: Record<AtmosphereSuitability, string> = {
  "suitable": "✓ Certified",
  "self-assess": "⚠ Self-assess",
  "not-suitable": "✗ Not suitable",
  "not-required": "— Not required",
}

const atmosphereColors: Record<AtmosphereSuitability, string> = {
  "suitable": "#185c37",
  "self-assess": "#8a5a00",
  "not-suitable": "#9f1d1d",
  "not-required": "#64748b",
}

function ProductCard({ result, showGas, showDust }: {
  result: ProductSuitabilityResult
  showGas: boolean
  showDust: boolean
}) {
  const [expanded, setExpanded] = useState(false)
  const { product } = result
  const status = statusConfig[result.overall]

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
      {/* Header */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "16px 20px",
          backgroundColor: status.bg,
          borderBottom: `1px solid ${status.border}`,
          flexWrap: "wrap",
          gap: "10px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <span
            style={{
              fontSize: "20px",
              fontWeight: 700,
              color: status.color,
              minWidth: "24px",
            }}
          >
            {status.icon}
          </span>
          <div>
            <div style={{ fontWeight: 700, fontSize: "16px", color: "#10233f" }}>
              {product.name}
            </div>
            <div style={{ fontSize: "13px", color: status.color, fontWeight: 600, marginTop: "2px" }}>
              {status.label}
            </div>
          </div>
        </div>

        {/* Atmosphere badges */}
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {showGas && (
            <span
              style={{
                fontSize: "12px",
                fontWeight: 700,
                padding: "4px 10px",
                borderRadius: "999px",
                border: "1px solid #e2e8f0",
                backgroundColor: "#f8fafc",
                color: atmosphereColors[result.gas],
              }}
            >
              Gas: {atmosphereLabels[result.gas]}
            </span>
          )}
          {showDust && (
            <span
              style={{
                fontSize: "12px",
                fontWeight: 700,
                padding: "4px 10px",
                borderRadius: "999px",
                border: "1px solid #e2e8f0",
                backgroundColor: "#f8fafc",
                color: atmosphereColors[result.dust],
              }}
            >
              Dust: {atmosphereLabels[result.dust]}
            </span>
          )}
        </div>
      </div>

      {/* Expandable detail */}
      <div style={{ padding: "14px 20px" }}>
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          style={{
            background: "none",
            border: "none",
            padding: 0,
            cursor: "pointer",
            color: "#2d6cdf",
            fontSize: "13px",
            fontWeight: 600,
          }}
        >
          {expanded ? "▲ Hide details" : "▼ Show details"}
        </button>

        {expanded && (
          <div style={{ marginTop: "14px", display: "grid", gap: "10px" }}>
            {/* ATEX markings for automated products */}
            {product.variant === "automated" && (
              <>
                {product.markingsUnconfirmed && (
                  <div
                    style={{
                      padding: "10px 14px",
                      borderRadius: "8px",
                      backgroundColor: "#fff8eb",
                      border: "1px solid #f4d39c",
                      fontSize: "13px",
                      color: "#8a5a00",
                      fontWeight: 600,
                    }}
                  >
                    ⚠ ATEX markings below are placeholders pending certificate confirmation.
                    Do not use for formal compliance purposes until confirmed.
                  </div>
                )}

                {product.atexGasMarking && (
                  <div style={{ fontSize: "14px" }}>
                    <strong>Gas marking:</strong>{" "}
                    <code
                      style={{
                        padding: "3px 8px",
                        borderRadius: "6px",
                        backgroundColor: "#f4f6fb",
                        fontSize: "13px",
                      }}
                    >
                      {product.atexGasMarking}
                    </code>
                    {product.atexGasZone && (
                      <span style={{ marginLeft: "8px", color: "#64748b", fontSize: "13px" }}>
                        (Rated Zone {product.atexGasZone} gas and less hazardous)
                      </span>
                    )}
                  </div>
                )}

                {product.atexDustMarking && (
                  <div style={{ fontSize: "14px" }}>
                    <strong>Dust marking:</strong>{" "}
                    <code
                      style={{
                        padding: "3px 8px",
                        borderRadius: "6px",
                        backgroundColor: "#f4f6fb",
                        fontSize: "13px",
                      }}
                    >
                      {product.atexDustMarking}
                    </code>
                    {product.atexDustZone && (
                      <span style={{ marginLeft: "8px", color: "#64748b", fontSize: "13px" }}>
                        (Rated Zone {product.atexDustZone} dust and less hazardous)
                      </span>
                    )}
                  </div>
                )}
              </>
            )}

            {/* Notes */}
            {product.notes.length > 0 && (
              <ul
                style={{
                  margin: 0,
                  paddingLeft: "20px",
                  lineHeight: 1.7,
                  fontSize: "13px",
                  color: "#475569",
                }}
              >
                {product.notes.map((note) => (
                  <li key={note}>{note}</li>
                ))}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function ProductSelector() {
  const [standard, setStandard] = useState<Standard>("atex")

  // ATEX inputs
  const [atexGasZone, setAtexGasZone] = useState<string>("none")
  const [atexDustZone, setAtexDustZone] = useState<string>("none")

  // NEC inputs
  const [necGasDiv, setNecGasDiv] = useState<string>("none")
  const [necDustDiv, setNecDustDiv] = useState<string>("none")

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

  const hasRequirement = requiredGasZone !== null || requiredDustZone !== null

  const results = useMemo(() => {
    if (!hasRequirement) return []
    return products.map((p) => assessProduct(p, requiredGasZone, requiredDustZone))
  }, [hasRequirement, requiredGasZone, requiredDustZone])

  const suitable = results.filter((r) => r.overall === "suitable")
  const selfAssess = results.filter((r) => r.overall === "self-assess")
  const notSuitable = results.filter((r) => r.overall === "not-suitable")

  const showGas = requiredGasZone !== null
  const showDust = requiredDustZone !== null

  const selectStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px 12px",
    fontSize: "15px",
    borderRadius: "10px",
    border: "1px solid #cbd5e1",
    backgroundColor: "#ffffff",
    color: "#10233f",
  }

  const panelStyle: React.CSSProperties = {
    border: "1px solid #d8dee8",
    borderRadius: "16px",
    padding: "22px",
    backgroundColor: "#ffffff",
    boxShadow: "0 6px 18px rgba(15,23,42,0.06)",
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

  return (
    <div style={{ display: "grid", gap: "20px" }}>
      {/* Input panel */}
      <div style={panelStyle}>
        <h2 style={{ marginTop: 0, marginBottom: "8px", color: "#12263f" }}>
          Product Suitability Selector
        </h2>
        <p style={{ marginTop: 0, marginBottom: "22px", color: "#5b6472", lineHeight: 1.6 }}>
          Enter the customer's hazardous area requirements to see which products
          are suitable for their installation.
        </p>

        {/* Standard toggle */}
        <div style={{ marginBottom: "22px" }}>
          <div style={{ fontWeight: 700, color: "#1f2937", marginBottom: "10px" }}>
            Customer Standard
          </div>
          <div style={{ display: "flex", gap: "10px" }}>
            <button type="button" style={tabBtnStyle(standard === "atex")} onClick={() => setStandard("atex")}>
              ATEX / IECEx
            </button>
            <button type="button" style={tabBtnStyle(standard === "nec")} onClick={() => setStandard("nec")}>
              NEC (US Class/Division)
            </button>
          </div>
        </div>

        {/* ATEX inputs */}
        {standard === "atex" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px" }}>
            <div>
              <label htmlFor="req-gas-zone" style={{ display: "block", marginBottom: "8px", fontWeight: 700, color: "#1f2937" }}>
                Gas Zone
              </label>
              <select id="req-gas-zone" value={atexGasZone} onChange={(e) => setAtexGasZone(e.target.value)} style={selectStyle}>
                <option value="none">No gas hazard</option>
                <option value="0">Zone 0 — Continuous gas hazard</option>
                <option value="1">Zone 1 — Likely gas hazard</option>
                <option value="2">Zone 2 — Infrequent gas hazard</option>
              </select>
            </div>

            <div>
              <label htmlFor="req-dust-zone" style={{ display: "block", marginBottom: "8px", fontWeight: 700, color: "#1f2937" }}>
                Dust Zone
              </label>
              <select id="req-dust-zone" value={atexDustZone} onChange={(e) => setAtexDustZone(e.target.value)} style={selectStyle}>
                <option value="none">No dust hazard</option>
                <option value="20">Zone 20 — Continuous dust hazard</option>
                <option value="21">Zone 21 — Likely dust hazard</option>
                <option value="22">Zone 22 — Infrequent dust hazard</option>
              </select>
            </div>
          </div>
        )}

        {/* NEC inputs */}
        {standard === "nec" && (
          <>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "16px" }}>
              <div>
                <label htmlFor="req-nec-gas" style={{ display: "block", marginBottom: "8px", fontWeight: 700, color: "#1f2937" }}>
                  Gas (Class I)
                </label>
                <select id="req-nec-gas" value={necGasDiv} onChange={(e) => setNecGasDiv(e.target.value)} style={selectStyle}>
                  <option value="none">No gas hazard</option>
                  <option value="1">Class I Division 1 — Likely gas hazard</option>
                  <option value="2">Class I Division 2 — Infrequent gas hazard</option>
                </select>
              </div>

              <div>
                <label htmlFor="req-nec-dust" style={{ display: "block", marginBottom: "8px", fontWeight: 700, color: "#1f2937" }}>
                  Dust (Class II)
                </label>
                <select id="req-nec-dust" value={necDustDiv} onChange={(e) => setNecDustDiv(e.target.value)} style={selectStyle}>
                  <option value="none">No dust hazard</option>
                  <option value="1">Class II Division 1 — Likely dust hazard</option>
                  <option value="2">Class II Division 2 — Infrequent dust hazard</option>
                </select>
              </div>
            </div>

            <div
              style={{
                marginTop: "14px",
                padding: "10px 14px",
                borderRadius: "8px",
                backgroundColor: "#eef5ff",
                border: "1px solid #c9d8ff",
                fontSize: "13px",
                color: "#4f5d6b",
              }}
            >
              NEC zones are converted to approximate ATEX equivalents for matching:
              Class I Div 1 ≈ Zone 1, Class I Div 2 ≈ Zone 2,
              Class II Div 1 ≈ Zone 21, Class II Div 2 ≈ Zone 22.
            </div>
          </>
        )}
      </div>

      {/* Results */}
      {!hasRequirement && (
        <div
          style={{
            ...panelStyle,
            textAlign: "center",
            padding: "40px 22px",
            color: "#64748b",
          }}
        >
          Select at least one hazard zone above to see product recommendations.
        </div>
      )}

      {hasRequirement && (
        <div style={{ display: "grid", gap: "20px" }}>
          {/* Summary bar */}
          <div
            style={{
              ...panelStyle,
              padding: "16px 22px",
              display: "flex",
              flexWrap: "wrap",
              gap: "18px",
              alignItems: "center",
            }}
          >
            <span style={{ fontWeight: 700, color: "#12263f" }}>
              Results for:{" "}
              {[
                requiredGasZone && `Gas Zone ${requiredGasZone}`,
                requiredDustZone && `Dust Zone ${requiredDustZone}`,
              ]
                .filter(Boolean)
                .join(" + ")}
              {standard === "nec" && " (converted from NEC)"}
            </span>
            <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
              <span style={{ color: "#185c37", fontWeight: 600, fontSize: "14px" }}>
                ✓ {suitable.length} certified suitable
              </span>
              <span style={{ color: "#8a5a00", fontWeight: 600, fontSize: "14px" }}>
                ⚠ {selfAssess.length} manual / self-assess
              </span>
              <span style={{ color: "#9f1d1d", fontWeight: 600, fontSize: "14px" }}>
                ✗ {notSuitable.length} not suitable
              </span>
            </div>
          </div>

          {/* Certified suitable */}
          {suitable.length > 0 && (
            <div>
              <h3 style={{ marginTop: 0, marginBottom: "12px", color: "#12263f" }}>
                Certified Suitable
              </h3>
              <div style={{ display: "grid", gap: "12px" }}>
                {suitable.map((r) => (
                  <ProductCard key={r.product.id} result={r} showGas={showGas} showDust={showDust} />
                ))}
              </div>
            </div>
          )}

          {/* Manual / self-assess */}
          {selfAssess.length > 0 && (
            <div>
              <h3 style={{ marginTop: 0, marginBottom: "12px", color: "#12263f" }}>
                Manual Products — Customer Self-Assessment Required
              </h3>
              <div style={{ display: "grid", gap: "12px" }}>
                {selfAssess.map((r) => (
                  <ProductCard key={r.product.id} result={r} showGas={showGas} showDust={showDust} />
                ))}
              </div>
            </div>
          )}

          {/* Not suitable */}
          {notSuitable.length > 0 && (
            <div>
              <h3 style={{ marginTop: 0, marginBottom: "12px", color: "#12263f" }}>
                Not Suitable
              </h3>
              <div style={{ display: "grid", gap: "12px" }}>
                {notSuitable.map((r) => (
                  <ProductCard key={r.product.id} result={r} showGas={showGas} showDust={showDust} />
                ))}
              </div>
            </div>
          )}

          {/* Footer disclaimer */}
          <div
            style={{
              padding: "14px 18px",
              borderRadius: "12px",
              backgroundColor: "#f8fafc",
              border: "1px solid #e2e8f0",
              fontSize: "13px",
              color: "#4f5d6b",
              lineHeight: 1.7,
            }}
          >
            <strong>Important:</strong> This tool provides a first-pass indication only. Final
            equipment suitability must be confirmed against the full ATEX certificate, installation
            conditions, gas/dust group, temperature class, and any special conditions of use.
            Always consult the relevant certificate and a competent person before specifying
            equipment for hazardous areas.
          </div>
        </div>
      )}
    </div>
  )
}
