import type { DuctCleaningJob } from "./types"

const STORAGE_KEY = "duct_cleaning_jobs"

export function loadJobs(): DuctCleaningJob[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as DuctCleaningJob[]) : []
  } catch {
    return []
  }
}

export function saveJob(job: DuctCleaningJob): void {
  const jobs = loadJobs()
  const idx = jobs.findIndex((j) => j.id === job.id)
  if (idx >= 0) {
    jobs[idx] = job
  } else {
    jobs.unshift(job)
  }
  localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs))
}

export function deleteJob(id: string): void {
  const jobs = loadJobs().filter((j) => j.id !== id)
  localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs))
}

export function generateId(): string {
  return `job_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`
}
