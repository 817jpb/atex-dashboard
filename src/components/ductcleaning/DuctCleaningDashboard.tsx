import { useState, useCallback } from "react"
import type { DuctCleaningJob } from "./types"
import { loadJobs, saveJob } from "./store"
import NewJobForm from "./NewJobForm"
import JobList from "./JobList"
import JobReport from "./JobReport"

type View = "list" | "new" | "report"

const s = {
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    flexWrap: "wrap" as const,
    gap: "12px",
    marginBottom: "24px",
  },
  tabBar: {
    display: "flex",
    gap: "8px",
    padding: "8px",
    borderRadius: "14px",
    backgroundColor: "#ffffff",
    border: "1px solid #d8dee8",
    boxShadow: "0 4px 12px rgba(15,23,42,0.05)",
  },
  tab: (active: boolean): React.CSSProperties => ({
    padding: "10px 18px",
    borderRadius: "10px",
    border: active ? "1px solid #2d6cdf" : "1px solid transparent",
    background: active ? "linear-gradient(135deg, #edf4ff 0%, #e5efff 100%)" : "transparent",
    color: active ? "#1746a2" : "#475569",
    fontWeight: active ? 700 : 600,
    cursor: "pointer",
    fontSize: "14px",
  }),
  btnNew: {
    padding: "11px 22px",
    borderRadius: "10px",
    border: "none",
    background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
    color: "#ffffff",
    fontWeight: 700,
    fontSize: "14px",
    cursor: "pointer",
    boxShadow: "0 4px 12px rgba(37,99,235,0.25)",
  },
  panel: {
    border: "1px solid #d8dee8",
    borderRadius: "18px",
    padding: "28px",
    backgroundColor: "#ffffff",
    boxShadow: "0 8px 28px rgba(15,23,42,0.06)",
  },
  statsBar: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(130px, 1fr))",
    gap: "12px",
    marginBottom: "20px",
  },
  statTile: {
    padding: "14px 16px",
    borderRadius: "12px",
    border: "1px solid #dde6f0",
    backgroundColor: "#f8fbff",
    textAlign: "center" as const,
  },
}

export default function DuctCleaningDashboard() {
  const [jobs, setJobs] = useState<DuctCleaningJob[]>(() => loadJobs())
  const [view, setView] = useState<View>("list")
  const [activeJobId, setActiveJobId] = useState<string | null>(null)

  const reload = useCallback(() => setJobs(loadJobs()), [])

  function viewReport(id: string) {
    setActiveJobId(id)
    setView("report")
  }

  function handleSaved(id: string) {
    reload()
    viewReport(id)
  }

  function handleJobUpdated(updated: DuctCleaningJob) {
    saveJob(updated)
    reload()
  }

  const activeJob = jobs.find((j) => j.id === activeJobId) ?? null

  const sentCount = jobs.filter((j) => j.reportSentAt).length
  const pendingCount = jobs.length - sentCount

  return (
    <div>
      <div style={s.header}>
        <div style={s.tabBar}>
          <button style={s.tab(view === "list")} onClick={() => setView("list")}>
            All Jobs {jobs.length > 0 && `(${jobs.length})`}
          </button>
          <button style={s.tab(view === "new")} onClick={() => setView("new")}>
            New Job
          </button>
          {view === "report" && activeJob && (
            <button style={s.tab(true)}>
              Report — {activeJob.customerName}
            </button>
          )}
        </div>

        {view !== "new" && (
          <button style={s.btnNew} onClick={() => setView("new")}>
            + Log New Job
          </button>
        )}
      </div>

      {view === "list" && (
        <>
          {jobs.length > 0 && (
            <div style={s.statsBar}>
              <div style={s.statTile}>
                <div style={{ fontSize: "26px", fontWeight: 700, color: "#10233f" }}>{jobs.length}</div>
                <div style={{ fontSize: "12px", color: "#64748b", marginTop: "2px" }}>Total Jobs</div>
              </div>
              <div style={s.statTile}>
                <div style={{ fontSize: "26px", fontWeight: 700, color: "#065f46" }}>{sentCount}</div>
                <div style={{ fontSize: "12px", color: "#64748b", marginTop: "2px" }}>Reports Sent</div>
              </div>
              <div style={s.statTile}>
                <div style={{ fontSize: "26px", fontWeight: 700, color: "#92400e" }}>{pendingCount}</div>
                <div style={{ fontSize: "12px", color: "#64748b", marginTop: "2px" }}>Pending Send</div>
              </div>
            </div>
          )}
          <div style={s.panel}>
            <JobList jobs={jobs} onView={viewReport} onJobsChanged={reload} />
          </div>
        </>
      )}

      {view === "new" && (
        <div style={s.panel}>
          <h2 style={{ marginTop: 0, marginBottom: "24px", fontSize: "22px", color: "#10233f" }}>
            Log New Duct Cleaning Job
          </h2>
          <NewJobForm onSaved={handleSaved} />
        </div>
      )}

      {view === "report" && activeJob && (
        <JobReport
          job={activeJob}
          onBack={() => setView("list")}
          onJobUpdated={handleJobUpdated}
        />
      )}
    </div>
  )
}
