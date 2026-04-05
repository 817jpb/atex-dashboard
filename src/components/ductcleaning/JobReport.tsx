import type { AreaServiced, ConditionAfter, ConditionBefore, DuctCleaningJob, DuctType } from "./types"
import { saveJob } from "./store"

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

const CONDITION_AFTER_COLOUR: Record<ConditionAfter, { bg: string; border: string; color: string }> = {
  clean: { bg: "#d1fae5", border: "#a7f3d0", color: "#065f46" },
  satisfactory: { bg: "#dbeafe", border: "#93c5fd", color: "#1e40af" },
  requires_follow_up: { bg: "#fef3c7", border: "#fde68a", color: "#92400e" },
}

function formatDate(dateStr: string) {
  if (!dateStr) return "—"
  const d = new Date(dateStr)
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" })
}

function buildEmailBody(job: DuctCleaningJob): string {
  const lines: string[] = [
    `Dear ${job.customerName},`,
    ``,
    `Thank you for having us visit ${job.businessName ? job.businessName + " at " : ""}${job.siteAddress} on ${formatDate(job.visitDate)}.`,
    ``,
    `Please find below your duct cleaning service report.`,
    ``,
    `---- SERVICE REPORT ----`,
    ``,
    `Visit Date: ${formatDate(job.visitDate)}`,
    `Technician: ${job.technicianName}`,
    `Site: ${job.siteAddress}`,
    ``,
    `AREAS SERVICED:`,
  ]

  job.areasServiced.forEach((area, i) => {
    lines.push(``)
    lines.push(`  Area ${i + 1}: ${area.location}`)
    lines.push(`  Type: ${DUCT_TYPE_LABELS[area.ductType]}`)
    lines.push(`  Condition before: ${CONDITION_BEFORE_LABELS[area.conditionBefore]}`)
    lines.push(`  Condition after: ${CONDITION_AFTER_LABELS[area.conditionAfter]}`)
    if (area.lengthMetres) lines.push(`  Length cleaned: ${area.lengthMetres}m`)
    if (area.notes) lines.push(`  Notes: ${area.notes}`)
  })

  if (job.generalNotes) {
    lines.push(``, `GENERAL NOTES:`, job.generalNotes)
  }

  if (job.recommendations) {
    lines.push(``, `RECOMMENDATIONS:`, job.recommendations)
  }

  if (job.nextServiceDue) {
    lines.push(``, `NEXT SERVICE DUE: ${formatDate(job.nextServiceDue)}`)
  }

  lines.push(``, `---- END OF REPORT ----`, ``, `Kind regards,`, job.technicianName)

  return lines.join("\n")
}

function AreaRow({ area, index }: { area: AreaServiced; index: number }) {
  const colour = CONDITION_AFTER_COLOUR[area.conditionAfter]
  return (
    <div
      style={{
        border: "1px solid #dde6f0",
        borderRadius: "12px",
        padding: "16px",
        marginBottom: "12px",
        backgroundColor: "#fafcff",
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "10px" }}>
        <div>
          <span style={{ fontWeight: 700, color: "#10233f", fontSize: "15px" }}>
            Area {index + 1}: {area.location}
          </span>
          <span
            style={{
              marginLeft: "10px",
              fontSize: "12px",
              color: "#64748b",
              backgroundColor: "#f1f5fb",
              padding: "2px 8px",
              borderRadius: "6px",
            }}
          >
            {DUCT_TYPE_LABELS[area.ductType]}
          </span>
        </div>
        <span
          style={{
            fontSize: "12px",
            fontWeight: 700,
            padding: "4px 10px",
            borderRadius: "999px",
            backgroundColor: colour.bg,
            border: `1px solid ${colour.border}`,
            color: colour.color,
          }}
        >
          {CONDITION_AFTER_LABELS[area.conditionAfter]}
        </span>
      </div>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
          gap: "10px",
          fontSize: "13px",
          marginBottom: area.notes ? "10px" : 0,
        }}
      >
        <div>
          <span style={{ color: "#64748b", display: "block", marginBottom: "2px" }}>Before</span>
          <span style={{ color: "#374151", fontWeight: 600 }}>{CONDITION_BEFORE_LABELS[area.conditionBefore]}</span>
        </div>
        {area.lengthMetres && (
          <div>
            <span style={{ color: "#64748b", display: "block", marginBottom: "2px" }}>Length cleaned</span>
            <span style={{ color: "#374151", fontWeight: 600 }}>{area.lengthMetres} m</span>
          </div>
        )}
      </div>

      {area.notes && (
        <div
          style={{
            marginTop: "8px",
            padding: "10px 12px",
            borderRadius: "8px",
            backgroundColor: "#f1f5fb",
            fontSize: "13px",
            color: "#374151",
            lineHeight: 1.5,
          }}
        >
          {area.notes}
        </div>
      )}
    </div>
  )
}

const printStyles = `
@media print {
  body * { visibility: hidden; }
  #duct-report-printable, #duct-report-printable * { visibility: visible; }
  #duct-report-printable { position: absolute; left: 0; top: 0; width: 100%; }
  .no-print { display: none !important; }
}
`

export default function JobReport({
  job,
  onBack,
  onJobUpdated,
}: {
  job: DuctCleaningJob
  onBack: () => void
  onJobUpdated: (job: DuctCleaningJob) => void
}) {
  function handlePrint() {
    window.print()
  }

  function handleSendEmail() {
    const subject = encodeURIComponent(
      `Duct Cleaning Service Report — ${job.siteAddress} — ${formatDate(job.visitDate)}`
    )
    const body = encodeURIComponent(buildEmailBody(job))
    window.location.href = `mailto:${job.customerEmail}?subject=${subject}&body=${body}`

    const updated: DuctCleaningJob = { ...job, reportSentAt: new Date().toISOString() }
    saveJob(updated)
    onJobUpdated(updated)
  }

  return (
    <>
      <style>{printStyles}</style>

      {/* Toolbar */}
      <div
        className="no-print"
        style={{
          display: "flex",
          gap: "10px",
          alignItems: "center",
          flexWrap: "wrap",
          marginBottom: "24px",
        }}
      >
        <button
          onClick={onBack}
          style={{
            padding: "10px 16px",
            borderRadius: "10px",
            border: "1px solid #cbd5e1",
            background: "#ffffff",
            color: "#374151",
            fontWeight: 600,
            fontSize: "14px",
            cursor: "pointer",
          }}
        >
          ← Back
        </button>

        <button
          onClick={handlePrint}
          style={{
            padding: "10px 18px",
            borderRadius: "10px",
            border: "1px solid #a5b4fc",
            background: "#eef2ff",
            color: "#3730a3",
            fontWeight: 600,
            fontSize: "14px",
            cursor: "pointer",
          }}
        >
          Print / Save PDF
        </button>

        <button
          onClick={handleSendEmail}
          style={{
            padding: "10px 20px",
            borderRadius: "10px",
            border: "none",
            background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
            color: "#ffffff",
            fontWeight: 700,
            fontSize: "14px",
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(37,99,235,0.3)",
          }}
        >
          Send Report to Customer
        </button>

        {job.reportSentAt && (
          <span
            style={{
              fontSize: "13px",
              color: "#065f46",
              backgroundColor: "#d1fae5",
              padding: "5px 12px",
              borderRadius: "999px",
              border: "1px solid #a7f3d0",
              fontWeight: 600,
            }}
          >
            Report sent {formatDate(job.reportSentAt)}
          </span>
        )}
      </div>

      {/* Report */}
      <div
        id="duct-report-printable"
        style={{
          border: "1px solid #d8dee8",
          borderRadius: "18px",
          backgroundColor: "#ffffff",
          overflow: "hidden",
          boxShadow: "0 8px 32px rgba(15,23,42,0.08)",
        }}
      >
        {/* Header */}
        <div
          style={{
            background: "linear-gradient(135deg, #1e3a5f 0%, #12263f 100%)",
            color: "#ffffff",
            padding: "32px 36px",
          }}
        >
          <div style={{ fontSize: "13px", opacity: 0.7, marginBottom: "6px", letterSpacing: "0.08em", textTransform: "uppercase" }}>
            Duct Cleaning Service Report
          </div>
          <h2 style={{ margin: 0, fontSize: "26px", fontWeight: 700 }}>
            {job.businessName || job.customerName}
          </h2>
          <div style={{ marginTop: "6px", opacity: 0.85, fontSize: "15px" }}>
            {job.siteAddress}
          </div>

          <div
            style={{
              display: "flex",
              gap: "32px",
              marginTop: "22px",
              flexWrap: "wrap",
            }}
          >
            <div>
              <div style={{ fontSize: "11px", opacity: 0.6, marginBottom: "3px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Visit Date</div>
              <div style={{ fontWeight: 700 }}>{formatDate(job.visitDate)}</div>
            </div>
            <div>
              <div style={{ fontSize: "11px", opacity: 0.6, marginBottom: "3px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Technician</div>
              <div style={{ fontWeight: 700 }}>{job.technicianName}</div>
            </div>
            <div>
              <div style={{ fontSize: "11px", opacity: 0.6, marginBottom: "3px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Areas Serviced</div>
              <div style={{ fontWeight: 700 }}>{job.areasServiced.length}</div>
            </div>
            {job.nextServiceDue && (
              <div>
                <div style={{ fontSize: "11px", opacity: 0.6, marginBottom: "3px", textTransform: "uppercase", letterSpacing: "0.06em" }}>Next Service Due</div>
                <div style={{ fontWeight: 700 }}>{formatDate(job.nextServiceDue)}</div>
              </div>
            )}
          </div>
        </div>

        <div style={{ padding: "28px 36px" }}>
          {/* Customer info */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
              gap: "16px",
              marginBottom: "28px",
              padding: "18px",
              borderRadius: "12px",
              backgroundColor: "#f8fbff",
              border: "1px solid #dde6f0",
            }}
          >
            <div>
              <div style={{ fontSize: "11px", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "4px" }}>Customer</div>
              <div style={{ fontWeight: 700, color: "#10233f" }}>{job.customerName}</div>
            </div>
            {job.businessName && (
              <div>
                <div style={{ fontSize: "11px", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "4px" }}>Business</div>
                <div style={{ fontWeight: 700, color: "#10233f" }}>{job.businessName}</div>
              </div>
            )}
            <div>
              <div style={{ fontSize: "11px", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "4px" }}>Email</div>
              <div style={{ color: "#1d4ed8" }}>{job.customerEmail}</div>
            </div>
            {job.customerPhone && (
              <div>
                <div style={{ fontSize: "11px", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: "4px" }}>Phone</div>
                <div style={{ color: "#10233f" }}>{job.customerPhone}</div>
              </div>
            )}
          </div>

          {/* Areas */}
          <h3
            style={{
              margin: "0 0 16px",
              fontSize: "16px",
              fontWeight: 700,
              color: "#10233f",
              paddingBottom: "10px",
              borderBottom: "2px solid #e9eef5",
            }}
          >
            Areas Serviced
          </h3>

          {job.areasServiced.map((area, i) => (
            <AreaRow key={area.id} area={area} index={i} />
          ))}

          {/* Notes */}
          {(job.generalNotes || job.recommendations) && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px", marginTop: "24px" }}>
              {job.generalNotes && (
                <div
                  style={{
                    padding: "18px",
                    borderRadius: "12px",
                    border: "1px solid #dde6f0",
                    backgroundColor: "#f8fbff",
                  }}
                >
                  <div style={{ fontWeight: 700, color: "#10233f", marginBottom: "8px", fontSize: "14px" }}>General Notes</div>
                  <div style={{ color: "#374151", lineHeight: 1.6, fontSize: "14px", whiteSpace: "pre-wrap" }}>{job.generalNotes}</div>
                </div>
              )}
              {job.recommendations && (
                <div
                  style={{
                    padding: "18px",
                    borderRadius: "12px",
                    border: "1px solid #fde68a",
                    backgroundColor: "#fffbeb",
                  }}
                >
                  <div style={{ fontWeight: 700, color: "#92400e", marginBottom: "8px", fontSize: "14px" }}>Recommendations</div>
                  <div style={{ color: "#78350f", lineHeight: 1.6, fontSize: "14px", whiteSpace: "pre-wrap" }}>{job.recommendations}</div>
                </div>
              )}
            </div>
          )}

          {/* Footer */}
          <div
            style={{
              marginTop: "28px",
              paddingTop: "20px",
              borderTop: "1px solid #e9eef5",
              fontSize: "12px",
              color: "#94a3b8",
              display: "flex",
              justifyContent: "space-between",
              flexWrap: "wrap",
              gap: "8px",
            }}
          >
            <span>Report generated {new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" })}</span>
            <span>Job ref: {job.id.split("_")[1]}</span>
          </div>
        </div>
      </div>
    </>
  )
}
