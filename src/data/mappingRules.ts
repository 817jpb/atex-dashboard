export type MappingRuleRecord = {
  id: string
  sourceSystem: "ATEX" | "US"
  sourceKey: string
  targetSystem: "ATEX" | "US"
  targetKeys: string[]
  confidence: "high" | "medium" | "low"
  mappingType: "nearest-equivalent" | "conditional" | "not-direct"
  rationale: string
  warnings: string[]
}

export const mappingRules: MappingRuleRecord[] = [
  {
    id: "map-atex-zone-0-gas-to-us",
    sourceSystem: "ATEX",
    sourceKey: "atex-zone-0-gas",
    targetSystem: "US",
    targetKeys: [],
    confidence: "low",
    mappingType: "not-direct",
    rationale: "Zone 0 gas represents continuous or long-duration hazard and does not map neatly to US Class/Division.",
    warnings: [
      "Do not force a direct Division-based equivalent.",
      "If needed later, support US Class I Zone 0 separately."
    ]
  },
  {
    id: "map-atex-zone-1-gas-to-us",
    sourceSystem: "ATEX",
    sourceKey: "atex-zone-1-gas",
    targetSystem: "US",
    targetKeys: ["us-class-i-div-1"],
    confidence: "medium",
    mappingType: "nearest-equivalent",
    rationale: "Zone 1 gas is often compared with Class I Division 1 as a practical engineering comparison.",
    warnings: [
      "This is an approximate comparison, not a legal or certification equivalence."
    ]
  },
  {
    id: "map-atex-zone-2-gas-to-us",
    sourceSystem: "ATEX",
    sourceKey: "atex-zone-2-gas",
    targetSystem: "US",
    targetKeys: ["us-class-i-div-2"],
    confidence: "medium",
    mappingType: "nearest-equivalent",
    rationale: "Zone 2 gas is often compared with Class I Division 2.",
    warnings: [
      "Installation requirements and marking rules may differ."
    ]
  },
  {
    id: "map-atex-zone-20-dust-to-us",
    sourceSystem: "ATEX",
    sourceKey: "atex-zone-20-dust",
    targetSystem: "US",
    targetKeys: ["us-class-ii-div-1"],
    confidence: "low",
    mappingType: "conditional",
    rationale: "Zone 20 dust is sometimes loosely compared with severe Class II Division 1 dust hazard, but it is not a direct match.",
    warnings: [
      "Continuous dust hazard does not translate neatly into Class/Division language."
    ]
  },
  {
    id: "map-atex-zone-21-dust-to-us",
    sourceSystem: "ATEX",
    sourceKey: "atex-zone-21-dust",
    targetSystem: "US",
    targetKeys: ["us-class-ii-div-1"],
    confidence: "medium",
    mappingType: "nearest-equivalent",
    rationale: "Zone 21 dust is commonly compared with Class II Division 1.",
    warnings: [
      "Use as a comparison aid only."
    ]
  },
  {
    id: "map-atex-zone-22-dust-to-us",
    sourceSystem: "ATEX",
    sourceKey: "atex-zone-22-dust",
    targetSystem: "US",
    targetKeys: ["us-class-ii-div-2"],
    confidence: "medium",
    mappingType: "nearest-equivalent",
    rationale: "Zone 22 dust is commonly compared with Class II Division 2.",
    warnings: [
      "Still not a perfect one-to-one conversion."
    ]
  },
  {
    id: "map-us-class-i-div-1-to-atex",
    sourceSystem: "US",
    sourceKey: "us-class-i-div-1",
    targetSystem: "ATEX",
    targetKeys: ["atex-zone-1-gas"],
    confidence: "medium",
    mappingType: "nearest-equivalent",
    rationale: "Class I Division 1 is most often compared to ATEX Zone 1 for gas/vapour hazards.",
    warnings: [
      "May overlap conceptually with more severe cases, but is not a direct Zone 0 replacement."
    ]
  },
  {
    id: "map-us-class-i-div-2-to-atex",
    sourceSystem: "US",
    sourceKey: "us-class-i-div-2",
    targetSystem: "ATEX",
    targetKeys: ["atex-zone-2-gas"],
    confidence: "medium",
    mappingType: "nearest-equivalent",
    rationale: "Class I Division 2 is commonly compared with ATEX Zone 2.",
    warnings: [
      "Local code and equipment approvals still need checking."
    ]
  },
  {
    id: "map-us-class-ii-div-1-to-atex",
    sourceSystem: "US",
    sourceKey: "us-class-ii-div-1",
    targetSystem: "ATEX",
    targetKeys: ["atex-zone-21-dust"],
    confidence: "medium",
    mappingType: "nearest-equivalent",
    rationale: "Class II Division 1 is often compared with Zone 21 dust.",
    warnings: [
      "In more severe dust scenarios, Zone 20 may need to be considered separately."
    ]
  },
  {
    id: "map-us-class-ii-div-2-to-atex",
    sourceSystem: "US",
    sourceKey: "us-class-ii-div-2",
    targetSystem: "ATEX",
    targetKeys: ["atex-zone-22-dust"],
    confidence: "medium",
    mappingType: "nearest-equivalent",
    rationale: "Class II Division 2 is often compared with Zone 22 dust.",
    warnings: [
      "Comparison is still approximate rather than exact."
    ]
  },
  {
    id: "map-us-class-iii-div-1-to-atex",
    sourceSystem: "US",
    sourceKey: "us-class-iii-div-1",
    targetSystem: "ATEX",
    targetKeys: [],
    confidence: "low",
    mappingType: "not-direct",
    rationale: "Class III fibres/flyings do not have a clean ATEX Zone equivalent.",
    warnings: [
      "Show explanatory note rather than forcing a conversion."
    ]
  },
  {
    id: "map-us-class-iii-div-2-to-atex",
    sourceSystem: "US",
    sourceKey: "us-class-iii-div-2",
    targetSystem: "ATEX",
    targetKeys: [],
    confidence: "low",
    mappingType: "not-direct",
    rationale: "Class III Division 2 remains a poor direct fit for ATEX Zone mapping.",
    warnings: [
      "Keep as a separate classification concept in the app."
    ]
  }
]