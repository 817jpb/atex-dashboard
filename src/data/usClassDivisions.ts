export type UsClassDivisionRecord = {
  id: string
  system: "US"
  class: "I" | "II" | "III"
  division: "1" | "2"
  hazardFamily: "gas" | "dust" | "fibres"
  description: string
  typicalMeaning: string
  nearestAtexEquivalent: string[]
  comparisonConfidence: "high" | "medium" | "low"
  notes: string[]
}

export const usClassDivisions: UsClassDivisionRecord[] = [
  {
    id: "us-class-i-div-1",
    system: "US",
    class: "I",
    division: "1",
    hazardFamily: "gas",
    description: "Area with flammable gases or vapours where the hazard may exist in normal operation.",
    typicalMeaning: "Gas/vapour hazard expected during normal operations or due to frequent maintenance, repair, or leakage conditions.",
    nearestAtexEquivalent: ["Zone 1", "Zone 0 (in limited cases, but not a direct match)"],
    comparisonConfidence: "medium",
    notes: [
      "Often compared with ATEX Zone 1.",
      "Not a clean one-to-one conversion to ATEX."
    ]
  },
  {
    id: "us-class-i-div-2",
    system: "US",
    class: "I",
    division: "2",
    hazardFamily: "gas",
    description: "Area with flammable gases or vapours not normally present, but possible under abnormal conditions.",
    typicalMeaning: "Gas/vapour hazard is usually contained and would appear only if something goes wrong.",
    nearestAtexEquivalent: ["Zone 2"],
    comparisonConfidence: "medium",
    notes: [
      "Often compared with ATEX Zone 2.",
      "Certification and installation approach may still differ."
    ]
  },
  {
    id: "us-class-ii-div-1",
    system: "US",
    class: "II",
    division: "1",
    hazardFamily: "dust",
    description: "Area with combustible dust hazard present in normal operation.",
    typicalMeaning: "Dust may be present in sufficient quantity to create an ignitable mixture during normal operation.",
    nearestAtexEquivalent: ["Zone 21", "Zone 20 in severe continuous cases"],
    comparisonConfidence: "low",
    notes: [
      "Usually compared with ATEX Zone 21.",
      "Dust hazard mapping is approximate, not exact."
    ]
  },
  {
    id: "us-class-ii-div-2",
    system: "US",
    class: "II",
    division: "2",
    hazardFamily: "dust",
    description: "Area with combustible dust hazard not normally present, but possible under abnormal conditions.",
    typicalMeaning: "Dust is usually contained but may escape or accumulate in hazardous quantities.",
    nearestAtexEquivalent: ["Zone 22"],
    comparisonConfidence: "medium",
    notes: [
      "Usually compared with ATEX Zone 22.",
      "Still treat as an approximate engineering comparison."
    ]
  },
  {
    id: "us-class-iii-div-1",
    system: "US",
    class: "III",
    division: "1",
    hazardFamily: "fibres",
    description: "Area with ignitable fibres or flyings handled, manufactured, or used.",
    typicalMeaning: "Textile fibres, flyings, or similar materials may create a fire hazard.",
    nearestAtexEquivalent: [],
    comparisonConfidence: "low",
    notes: [
      "No clean ATEX Zone equivalent.",
      "Should be treated as a special comparison case."
    ]
  },
  {
    id: "us-class-iii-div-2",
    system: "US",
    class: "III",
    division: "2",
    hazardFamily: "fibres",
    description: "Area where ignitable fibres or flyings are stored or handled, but not likely to be in suspension in hazardous quantities.",
    typicalMeaning: "Fire hazard from fibres/flyings exists, but is lower than Division 1.",
    nearestAtexEquivalent: [],
    comparisonConfidence: "low",
    notes: [
      "No clean ATEX Zone equivalent.",
      "Useful to flag separately rather than forcing a bad mapping."
    ]
  }
]