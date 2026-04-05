export type ConditionBefore = "poor" | "fair" | "good"
export type ConditionAfter = "clean" | "satisfactory" | "requires_follow_up"
export type DuctType = "supply" | "extract" | "kitchen_canopy" | "ventilation" | "other"

export interface AreaServiced {
  id: string
  location: string
  ductType: DuctType
  conditionBefore: ConditionBefore
  conditionAfter: ConditionAfter
  lengthMetres: string
  notes: string
}

export interface DuctCleaningJob {
  id: string
  createdAt: string
  // Customer
  customerName: string
  businessName: string
  customerEmail: string
  customerPhone: string
  siteAddress: string
  // Visit
  visitDate: string
  technicianName: string
  // Work
  areasServiced: AreaServiced[]
  generalNotes: string
  recommendations: string
  nextServiceDue: string
  // Status
  reportSentAt?: string
}
