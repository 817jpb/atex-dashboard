import { useState } from "react"
import type { AreaServiced, ConditionAfter, ConditionBefore, DuctCleaningJob, DuctType } from "./types"
import { generateId, saveJob } from "./store"

const DUCT_TYPE_LABELS: Record<DuctType, string> = {
  supply: "Supply",
  extract: "Extract",
  kitchen_canopy: "Kitchen Canopy",
  ventilation: "Ventilation",
  other: "Other",
}

const CONDITION_BEFORE_LABELS: Record<ConditionBefore, string> = {
  poor: "Poor — heavily soiled",
  fair: "Fair — moderate build-up",
  good: "Good — light soiling",
}

const CONDITION_AFTER_LABELS: Record<ConditionAfter, string> = {
  clean: "Clean — fully cleared",
  satisfactory: "Satisfactory — within acceptable limits",
  requires_follow_up: "Requires follow-up",
}

function emptyArea(): AreaServiced {
  return {
    id: generateId(),
    location: "",
    ductType: "extract",
    conditionBefore: "fair",
    conditionAfter: "clean",
    lengthMetres: "",
    notes: "",
  }
}

const s = {
  label: {
    display: "block",
    marginBottom: "6px",
    fontWeight: 700,
    fontSize: "13px",
    color: "#374151",
    textTransform: "uppercase" as const,
    letterSpacing: "0.04em",
  },
  input: {
    width: "100%",
    padding: "10px 12px",
    fontSize: "15px",
    borderRadius: "10px",
    border: "1px solid #cbd5e1",
    backgroundColor: "#ffffff",
    color: "#10233f",
    boxSizing: "border-box" as const,
  },
  select: {
    width: "100%",
    padding: "10px 12px",
    fontSize: "15px",
    borderRadius: "10px",
    border: "1px solid #cbd5e1",
    backgroundColor: "#ffffff",
    color: "#10233f",
    boxSizing: "border-box" as const,
  },
  textarea: {
    width: "100%",
    padding: "10px 12px",
    fontSize: "15px",
    borderRadius: "10px",
    border: "1px solid #cbd5e1",
    backgroundColor: "#ffffff",
    color: "#10233f",
    resize: "vertical" as const,
    minHeight: "80px",
    boxSizing: "border-box" as const,
  },
  fieldGroup: {
    marginBottom: "18px",
  },
  sectionTitle: {
    fontSize: "17px",
    fontWeight: 700,
    color: "#10233f",
    marginTop: 0,
    marginBottom: "16px",
    paddingBottom: "10px",
    borderBottom: "2px solid #e9eef5",
  },
  panel: {
    border: "1px solid #d8dee8",
    borderRadius: "16px",
    padding: "22px",
    backgroundColor: "#ffffff",
    boxShadow: "0 4px 16px rgba(15,23,42,0.06)",
    marginBottom: "20px",
  },
  areaCard: {
    border: "1px solid #dde6f0",
    borderRadius: "14px",
    padding: "18px",
    backgroundColor: "#f8fbff",
    marginBottom: "14px",
    position: "relative" as const,
  },
  grid2: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "16px",
  },
  grid3: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
    gap: "16px",
  },
  btnPrimary: {
    padding: "13px 28px",
    borderRadius: "12px",
    border: "none",
    background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
    color: "#ffffff",
    fontWeight: 700,
    fontSize: "15px",
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(37,99,235,0.3)",
  },
  btnSecondary: {
    padding: "10px 18px",
    borderRadius: "10px",
    border: "1px solid #cbd5e1",
    background: "#ffffff",
    color: "#374151",
    fontWeight: 600,
    fontSize: "14px",
    cursor: "pointer",
  },
  btnDanger: {
    padding: "6px 12px",
    borderRadius: "8px",
    border: "1px solid #fca5a5",
    background: "#fff1f1",
    color: "#b91c1c",
    fontWeight: 600,
    fontSize: "13px",
    cursor: "pointer",
    position: "absolute" as const,
    top: "14px",
    right: "14px",
  },
  btnAdd: {
    padding: "10px 18px",
    borderRadius: "10px",
    border: "2px dashed #93c5fd",
    background: "#eff6ff",
    color: "#1d4ed8",
    fontWeight: 600,
    fontSize: "14px",
    cursor: "pointer",
    width: "100%",
  },
}

export default function NewJobForm({ onSaved }: { onSaved: (id: string) => void }) {
  const today = new Date().toISOString().split("T")[0]

  const [customerName, setCustomerName] = useState("")
  const [businessName, setBusinessName] = useState("")
  const [customerEmail, setCustomerEmail] = useState("")
  const [customerPhone, setCustomerPhone] = useState("")
  const [siteAddress, setSiteAddress] = useState("")
  const [visitDate, setVisitDate] = useState(today)
  const [technicianName, setTechnicianName] = useState("")
  const [areas, setAreas] = useState<AreaServiced[]>([emptyArea()])
  const [generalNotes, setGeneralNotes] = useState("")
  const [recommendations, setRecommendations] = useState("")
  const [nextServiceDue, setNextServiceDue] = useState("")
  const [errors, setErrors] = useState<string[]>([])

  function updateArea(id: string, patch: Partial<AreaServiced>) {
    setAreas((prev) => prev.map((a) => (a.id === id ? { ...a, ...patch } : a)))
  }

  function removeArea(id: string) {
    setAreas((prev) => prev.filter((a) => a.id !== id))
  }

  function validate(): string[] {
    const errs: string[] = []
    if (!customerName.trim()) errs.push("Customer name is required.")
    if (!customerEmail.trim()) errs.push("Customer email is required.")
    if (!siteAddress.trim()) errs.push("Site address is required.")
    if (!visitDate) errs.push("Visit date is required.")
    if (!technicianName.trim()) errs.push("Technician name is required.")
    if (areas.length === 0) errs.push("At least one area serviced is required.")
    areas.forEach((a, i) => {
      if (!a.location.trim()) errs.push(`Area ${i + 1}: location is required.`)
    })
    return errs
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate()
    if (errs.length > 0) {
      setErrors(errs)
      return
    }
    setErrors([])
    const job: DuctCleaningJob = {
      id: generateId(),
      createdAt: new Date().toISOString(),
      customerName: customerName.trim(),
      businessName: businessName.trim(),
      customerEmail: customerEmail.trim(),
      customerPhone: customerPhone.trim(),
      siteAddress: siteAddress.trim(),
      visitDate,
      technicianName: technicianName.trim(),
      areasServiced: areas,
      generalNotes: generalNotes.trim(),
      recommendations: recommendations.trim(),
      nextServiceDue: nextServiceDue.trim(),
    }
    saveJob(job)
    onSaved(job.id)
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      {errors.length > 0 && (
        <div
          style={{
            marginBottom: "20px",
            padding: "14px 18px",
            borderRadius: "12px",
            border: "1px solid #fca5a5",
            backgroundColor: "#fff1f1",
            color: "#b91c1c",
          }}
        >
          <strong>Please fix the following:</strong>
          <ul style={{ margin: "8px 0 0", paddingLeft: "20px" }}>
            {errors.map((err) => (
              <li key={err}>{err}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Customer */}
      <div style={s.panel}>
        <h3 style={s.sectionTitle}>Customer Details</h3>
        <div style={s.grid2}>
          <div style={s.fieldGroup}>
            <label style={s.label}>Customer Name *</label>
            <input style={s.input} value={customerName} onChange={(e) => setCustomerName(e.target.value)} placeholder="John Smith" />
          </div>
          <div style={s.fieldGroup}>
            <label style={s.label}>Business Name</label>
            <input style={s.input} value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="Smith & Co Ltd" />
          </div>
          <div style={s.fieldGroup}>
            <label style={s.label}>Email Address *</label>
            <input style={s.input} type="email" value={customerEmail} onChange={(e) => setCustomerEmail(e.target.value)} placeholder="john@example.com" />
          </div>
          <div style={s.fieldGroup}>
            <label style={s.label}>Phone Number</label>
            <input style={s.input} type="tel" value={customerPhone} onChange={(e) => setCustomerPhone(e.target.value)} placeholder="07700 900000" />
          </div>
        </div>
        <div style={s.fieldGroup}>
          <label style={s.label}>Site Address *</label>
          <input style={s.input} value={siteAddress} onChange={(e) => setSiteAddress(e.target.value)} placeholder="123 High Street, Town, AB1 2CD" />
        </div>
      </div>

      {/* Visit */}
      <div style={s.panel}>
        <h3 style={s.sectionTitle}>Visit Details</h3>
        <div style={s.grid2}>
          <div style={s.fieldGroup}>
            <label style={s.label}>Visit Date *</label>
            <input style={s.input} type="date" value={visitDate} onChange={(e) => setVisitDate(e.target.value)} />
          </div>
          <div style={s.fieldGroup}>
            <label style={s.label}>Technician Name *</label>
            <input style={s.input} value={technicianName} onChange={(e) => setTechnicianName(e.target.value)} placeholder="Your name" />
          </div>
        </div>
      </div>

      {/* Areas */}
      <div style={s.panel}>
        <h3 style={s.sectionTitle}>Areas Serviced</h3>

        {areas.map((area, idx) => (
          <div key={area.id} style={s.areaCard}>
            <strong style={{ display: "block", marginBottom: "14px", color: "#12263f" }}>
              Area {idx + 1}
            </strong>

            {areas.length > 1 && (
              <button type="button" style={s.btnDanger} onClick={() => removeArea(area.id)}>
                Remove
              </button>
            )}

            <div style={s.grid2}>
              <div style={s.fieldGroup}>
                <label style={s.label}>Location / Description *</label>
                <input
                  style={s.input}
                  value={area.location}
                  onChange={(e) => updateArea(area.id, { location: e.target.value })}
                  placeholder="e.g. Kitchen extraction, Ground floor corridor"
                />
              </div>
              <div style={s.fieldGroup}>
                <label style={s.label}>Duct Type</label>
                <select style={s.select} value={area.ductType} onChange={(e) => updateArea(area.id, { ductType: e.target.value as DuctType })}>
                  {(Object.keys(DUCT_TYPE_LABELS) as DuctType[]).map((k) => (
                    <option key={k} value={k}>{DUCT_TYPE_LABELS[k]}</option>
                  ))}
                </select>
              </div>
            </div>

            <div style={s.grid3}>
              <div style={s.fieldGroup}>
                <label style={s.label}>Condition Before</label>
                <select style={s.select} value={area.conditionBefore} onChange={(e) => updateArea(area.id, { conditionBefore: e.target.value as ConditionBefore })}>
                  {(Object.keys(CONDITION_BEFORE_LABELS) as ConditionBefore[]).map((k) => (
                    <option key={k} value={k}>{CONDITION_BEFORE_LABELS[k]}</option>
                  ))}
                </select>
              </div>
              <div style={s.fieldGroup}>
                <label style={s.label}>Condition After</label>
                <select style={s.select} value={area.conditionAfter} onChange={(e) => updateArea(area.id, { conditionAfter: e.target.value as ConditionAfter })}>
                  {(Object.keys(CONDITION_AFTER_LABELS) as ConditionAfter[]).map((k) => (
                    <option key={k} value={k}>{CONDITION_AFTER_LABELS[k]}</option>
                  ))}
                </select>
              </div>
              <div style={s.fieldGroup}>
                <label style={s.label}>Length Cleaned (m)</label>
                <input
                  style={s.input}
                  type="number"
                  min="0"
                  step="0.5"
                  value={area.lengthMetres}
                  onChange={(e) => updateArea(area.id, { lengthMetres: e.target.value })}
                  placeholder="e.g. 12"
                />
              </div>
            </div>

            <div style={s.fieldGroup}>
              <label style={s.label}>Area Notes</label>
              <textarea
                style={s.textarea}
                value={area.notes}
                onChange={(e) => updateArea(area.id, { notes: e.target.value })}
                placeholder="Any specific observations for this area..."
              />
            </div>
          </div>
        ))}

        <button type="button" style={s.btnAdd} onClick={() => setAreas((prev) => [...prev, emptyArea()])}>
          + Add Another Area
        </button>
      </div>

      {/* Notes & Recommendations */}
      <div style={s.panel}>
        <h3 style={s.sectionTitle}>Notes & Recommendations</h3>
        <div style={s.fieldGroup}>
          <label style={s.label}>General Notes</label>
          <textarea
            style={s.textarea}
            value={generalNotes}
            onChange={(e) => setGeneralNotes(e.target.value)}
            placeholder="Overall observations about the site or the work carried out..."
          />
        </div>
        <div style={s.fieldGroup}>
          <label style={s.label}>Recommendations</label>
          <textarea
            style={s.textarea}
            value={recommendations}
            onChange={(e) => setRecommendations(e.target.value)}
            placeholder="Any remedial actions, repairs, or follow-up work recommended..."
          />
        </div>
        <div style={{ maxWidth: "260px" }}>
          <label style={s.label}>Next Service Due</label>
          <input style={s.input} type="date" value={nextServiceDue} onChange={(e) => setNextServiceDue(e.target.value)} />
        </div>
      </div>

      <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
        <button type="submit" style={s.btnPrimary}>
          Save Job & View Report
        </button>
        <span style={{ color: "#64748b", fontSize: "14px" }}>
          Report can be sent to customer from the next screen.
        </span>
      </div>
    </form>
  )
}
