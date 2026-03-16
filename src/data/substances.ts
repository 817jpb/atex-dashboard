export interface Substance {
  name: string
  type: "gas" | "dust"
  group: string
  autoIgnition: number
  suggestedTClass: string
  protection: string
}

export const substances: Substance[] = [
  {
    name: "Hydrogen",
    type: "gas",
    group: "IIC",
    autoIgnition: 560,
    suggestedTClass: "T1",
    protection: "Ex ia / Ex d"
  },
  {
    name: "Methane",
    type: "gas",
    group: "IIA",
    autoIgnition: 537,
    suggestedTClass: "T1",
    protection: "Ex d / Ex e"
  },
  {
    name: "Propane",
    type: "gas",
    group: "IIA",
    autoIgnition: 470,
    suggestedTClass: "T1",
    protection: "Ex d / Ex e"
  },
  {
    name: "Acetone",
    type: "gas",
    group: "IIB",
    autoIgnition: 465,
    suggestedTClass: "T1",
    protection: "Ex d / Ex ib"
  },
  {
    name: "Flour Dust",
    type: "dust",
    group: "IIIB",
    autoIgnition: 380,
    suggestedTClass: "T2",
    protection: "Ex tb / Ex tc"
  }
]