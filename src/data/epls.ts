export type EplRecord = {
  id: string
  hazardFamily: "gas" | "dust"
  epl: string
  protectionLevel: string
  typicalAreaSuitability: string[]
  notes: string[]
}

export const epls: EplRecord[] = [
  {
    id: "epl-ga",
    hazardFamily: "gas",
    epl: "Ga",
    protectionLevel: "Very high protection for gas atmospheres",
    typicalAreaSuitability: ["Zone 0", "Zone 1", "Zone 2"],
    notes: [
      "Suitable for the highest-risk gas zones.",
      "Commonly associated with Category 1G equipment."
    ]
  },
  {
    id: "epl-gb",
    hazardFamily: "gas",
    epl: "Gb",
    protectionLevel: "High protection for gas atmospheres",
    typicalAreaSuitability: ["Zone 1", "Zone 2"],
    notes: [
      "Commonly associated with Category 2G equipment."
    ]
  },
  {
    id: "epl-gc",
    hazardFamily: "gas",
    epl: "Gc",
    protectionLevel: "Enhanced protection for gas atmospheres",
    typicalAreaSuitability: ["Zone 2"],
    notes: [
      "Commonly associated with Category 3G equipment."
    ]
  },
  {
    id: "epl-da",
    hazardFamily: "dust",
    epl: "Da",
    protectionLevel: "Very high protection for dust atmospheres",
    typicalAreaSuitability: ["Zone 20", "Zone 21", "Zone 22"],
    notes: [
      "Commonly associated with Category 1D equipment."
    ]
  },
  {
    id: "epl-db",
    hazardFamily: "dust",
    epl: "Db",
    protectionLevel: "High protection for dust atmospheres",
    typicalAreaSuitability: ["Zone 21", "Zone 22"],
    notes: [
      "Commonly associated with Category 2D equipment."
    ]
  },
  {
    id: "epl-dc",
    hazardFamily: "dust",
    epl: "Dc",
    protectionLevel: "Enhanced protection for dust atmospheres",
    typicalAreaSuitability: ["Zone 22"],
    notes: [
      "Commonly associated with Category 3D equipment."
    ]
  }
]