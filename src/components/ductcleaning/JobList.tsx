import { useState } from "react"
import type { DuctCleaningJob } from "./types"
import { deleteJob } from "./store"

function formatDate(dateStr: string) {
  if (!dateStr) return "—"
  const d = new Date(dateStr)
  return d.toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
}

const s = {
  searchInput: {
    width: "100%",
    padding: "11px 14px",
    fontSize: "15px",
    borderRadius: "12px",
    border: "1px solid #cbd5e1",
    backgroundColor: "#ffffff",
    color: "#10233f",
    boxSizing: "border-box" as const,
    marginBottom: "18px",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse" as const,
    fontSize: "14px",
  },
  th: {
    textAlign: "left" as const,
    padding: "10px 14px",
    backgroundColor: "#f1f5fb",
    color: "#374151",
    fontWeight: 700,
    fontSize: "12px",
    textTransform: "uppercase" as const,
    letterSpacing: "0.05em",
    borderBottom: "2px solid #dde6f0",
  },
  td: {
    padding: "12px 14px",
    borderBottom: "1px solid #edf2f7",
    color: "#1f2937",
    verticalAlign: "middle" as const,
  },
  trHover: {
    backgroundColor: "#f8fbff",
    cursor: "pointer",
  },
  badge: (sent: boolean) => ({
    display: "inline-block",
    padding: "3px 10px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: 700,
    backgroundColor: sent ? "#d1fae5" : "#fef3c7",
    color: sent ? "#065f46" : "#92400e",
    border: sent ? "1px solid #a7f3d0" : "1px solid #fde68a",
  }),
  btnView: {
    padding: "6px 14px",
    borderRadius: "8px",
    border: "1px solid #93c5fd",
    background: "#eff6ff",
    color: "#1d4ed8",
    fontWeight: 600,
    fontSize: "13px",
    cursor: "pointer",
    marginRight: "6px",
  },
  btnDelete: {
    padding: "6px 12px",
    borderRadius: "8px",
    border: "1px solid #fca5a5",
    background: "#fff1f1",
    color: "#b91c1c",
    fontWeight: 600,
    fontSize: "13px",
    cursor: "pointer",
  },
  empty: {
    textAlign: "center" as const,
    padding: "48px 20px",
    color: "#64748b",
  },
}

export default function JobList({
  jobs,
  onView,
  onJobsChanged,
}: {
  jobs: DuctCleaningJob[]
  onView: (id: string) => void
  onJobsChanged: () => void
}) {
  const [search, setSearch] = useState("")
  const [hovered, setHovered] = useState<string | null>(null)

  const filtered = jobs.filter((j) => {
    const q = search.toLowerCase()
    return (
      j.customerName.toLowerCase().includes(q) ||
      j.businessName.toLowerCase().includes(q) ||
      j.siteAddress.toLowerCase().includes(q) ||
      j.technicianName.toLowerCase().includes(q)
    )
  })

  function handleDelete(id: string, name: string) {
    if (window.confirm(`Delete job for "${name}"? This cannot be undone.`)) {
      deleteJob(id)
      onJobsChanged()
    }
  }

  if (jobs.length === 0) {
    return (
      <div style={s.empty}>
        <div style={{ fontSize: "40px", marginBottom: "12px" }}>📋</div>
        <div style={{ fontWeight: 700, fontSize: "17px", marginBottom: "8px" }}>No jobs logged yet</div>
        <div>Use "New Job" to log your first duct cleaning visit.</div>
      </div>
    )
  }

  return (
    <div>
      <input
        style={s.searchInput}
        type="search"
        placeholder="Search by customer, business, site or technician..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {filtered.length === 0 ? (
        <div style={s.empty}>No jobs match your search.</div>
      ) : (
        <div style={{ overflowX: "auto" }}>
          <table style={s.table}>
            <thead>
              <tr>
                <th style={s.th}>Visit Date</th>
                <th style={s.th}>Customer</th>
                <th style={s.th}>Business</th>
                <th style={s.th}>Site Address</th>
                <th style={s.th}>Technician</th>
                <th style={s.th}>Areas</th>
                <th style={s.th}>Report</th>
                <th style={s.th}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((job) => (
                <tr
                  key={job.id}
                  style={hovered === job.id ? { ...s.trHover } : {}}
                  onMouseEnter={() => setHovered(job.id)}
                  onMouseLeave={() => setHovered(null)}
                >
                  <td style={s.td}>{formatDate(job.visitDate)}</td>
                  <td style={s.td}>{job.customerName}</td>
                  <td style={{ ...s.td, color: "#64748b" }}>{job.businessName || "—"}</td>
                  <td style={{ ...s.td, maxWidth: "180px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{job.siteAddress}</td>
                  <td style={s.td}>{job.technicianName}</td>
                  <td style={{ ...s.td, textAlign: "center" as const }}>{job.areasServiced.length}</td>
                  <td style={s.td}>
                    <span style={s.badge(!!job.reportSentAt)}>
                      {job.reportSentAt ? "Sent" : "Pending"}
                    </span>
                  </td>
                  <td style={s.td}>
                    <button style={s.btnView} onClick={() => onView(job.id)}>
                      View
                    </button>
                    <button style={s.btnDelete} onClick={() => handleDelete(job.id, job.customerName)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
