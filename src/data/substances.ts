// ─── Types ────────────────────────────────────────────────────────────────────

export type ElastomerRating = "excellent" | "good" | "limited" | "poor"

export interface Substance {
  name: string
  casNumber: string
  type: "gas" | "dust"
  // Flammability
  isFlammable: boolean
  flashPoint: number | null     // °C — null if non-flammable or cryogenic gas
  autoIgnition: number          // °C
  gasGroup: "IIA" | "IIB" | "IIC" | null  // null if non-flammable or dust
  lel: number | null            // % v/v lower explosive limit
  uel: number | null            // % v/v upper explosive limit
  // Elastomer compatibility
  elastomers: {
    epdm: ElastomerRating
    fkm: ElastomerRating
    ffkm: ElastomerRating
  }
  notes: string[]
}

// ─── Elastomer rating helpers ─────────────────────────────────────────────────

export const elastomerRatingLabel: Record<ElastomerRating, string> = {
  excellent: "Excellent",
  good: "Good",
  limited: "Limited — verify with supplier",
  poor: "Poor — not recommended",
}

export const elastomerRatingColor: Record<ElastomerRating, string> = {
  excellent: "#185c37",
  good: "#2d6cdf",
  limited: "#8a5a00",
  poor: "#9f1d1d",
}

export const elastomerRatingBg: Record<ElastomerRating, string> = {
  excellent: "#effcf3",
  good: "#eef5ff",
  limited: "#fff8eb",
  poor: "#fff1f1",
}

export const elastomerRatingBorder: Record<ElastomerRating, string> = {
  excellent: "#b7ebc6",
  good: "#c8dcff",
  limited: "#f4d39c",
  poor: "#f3b3b3",
}

// ─── Substance catalog ────────────────────────────────────────────────────────

export const substances: Substance[] = [
  // ── Pharmaceutical / cleanroom solvents ─────────────────────────────────────
  {
    name: "Ethanol",
    casNumber: "64-17-5",
    type: "gas",
    isFlammable: true,
    flashPoint: 13,
    autoIgnition: 365,
    gasGroup: "IIA",
    lel: 3.1,
    uel: 19.0,
    elastomers: {
      epdm: "good",
      fkm: "limited",
      ffkm: "excellent",
    },
    notes: [
      "Very common pharmaceutical solvent. Low flash point — handle with care.",
      "FKM (Viton) can swell with prolonged ethanol contact; verify with supplier.",
    ],
  },
  {
    name: "Isopropanol (IPA)",
    casNumber: "67-63-0",
    type: "gas",
    isFlammable: true,
    flashPoint: 12,
    autoIgnition: 399,
    gasGroup: "IIA",
    lel: 2.0,
    uel: 12.7,
    elastomers: {
      epdm: "good",
      fkm: "limited",
      ffkm: "excellent",
    },
    notes: [
      "Extremely common in pharmaceutical cleaning and processing.",
      "FKM shows limited resistance; FFKM recommended for frequent or prolonged contact.",
    ],
  },
  {
    name: "Methanol",
    casNumber: "67-56-1",
    type: "gas",
    isFlammable: true,
    flashPoint: 11,
    autoIgnition: 385,
    gasGroup: "IIA",
    lel: 6.0,
    uel: 36.5,
    elastomers: {
      epdm: "good",
      fkm: "poor",
      ffkm: "excellent",
    },
    notes: [
      "Highly toxic — special handling and PPE required beyond flammability considerations.",
      "FKM is not recommended; EPDM or FFKM preferred.",
    ],
  },
  {
    name: "Acetone",
    casNumber: "67-64-1",
    type: "gas",
    isFlammable: true,
    flashPoint: -20,
    autoIgnition: 465,
    gasGroup: "IIA",
    lel: 2.5,
    uel: 12.8,
    elastomers: {
      epdm: "good",
      fkm: "poor",
      ffkm: "excellent",
    },
    notes: [
      "Very low flash point — significant flammability risk even at low temperatures.",
      "FKM (Viton) has poor ketone resistance; avoid for acetone service.",
    ],
  },
  {
    name: "Ethyl Acetate",
    casNumber: "141-78-6",
    type: "gas",
    isFlammable: true,
    flashPoint: -4,
    autoIgnition: 426,
    gasGroup: "IIA",
    lel: 2.0,
    uel: 11.5,
    elastomers: {
      epdm: "good",
      fkm: "poor",
      ffkm: "excellent",
    },
    notes: [
      "Common extraction and formulation solvent in pharmaceutical manufacturing.",
      "FKM (Viton) has poor ester resistance; EPDM or FFKM recommended.",
    ],
  },
  {
    name: "Methyl Ethyl Ketone (MEK)",
    casNumber: "78-93-3",
    type: "gas",
    isFlammable: true,
    flashPoint: -9,
    autoIgnition: 404,
    gasGroup: "IIA",
    lel: 1.8,
    uel: 10.0,
    elastomers: {
      epdm: "good",
      fkm: "poor",
      ffkm: "excellent",
    },
    notes: [
      "Used as a solvent in coatings and pharmaceutical processes.",
      "FKM has poor ketone resistance; EPDM or FFKM preferred.",
    ],
  },
  {
    name: "Acetonitrile (MeCN)",
    casNumber: "75-05-8",
    type: "gas",
    isFlammable: true,
    flashPoint: 2,
    autoIgnition: 524,
    gasGroup: "IIA",
    lel: 3.0,
    uel: 16.0,
    elastomers: {
      epdm: "good",
      fkm: "limited",
      ffkm: "excellent",
    },
    notes: [
      "Widely used in HPLC and pharmaceutical synthesis.",
      "Toxic — inhalation and skin absorption hazards beyond flammability.",
      "FKM shows limited resistance; FFKM preferred for process equipment.",
    ],
  },
  {
    name: "Tetrahydrofuran (THF)",
    casNumber: "109-99-9",
    type: "gas",
    isFlammable: true,
    flashPoint: -14,
    autoIgnition: 321,
    gasGroup: "IIB",
    lel: 2.0,
    uel: 11.8,
    elastomers: {
      epdm: "limited",
      fkm: "poor",
      ffkm: "excellent",
    },
    notes: [
      "IIB gas group — requires higher-rated equipment than most common solvents.",
      "Can form explosive peroxides on storage; peroxide-tested grades recommended.",
      "FKM and EPDM both have limited resistance; FFKM is strongly recommended.",
    ],
  },
  {
    name: "Diethyl Ether",
    casNumber: "60-29-7",
    type: "gas",
    isFlammable: true,
    flashPoint: -45,
    autoIgnition: 160,
    gasGroup: "IIB",
    lel: 1.9,
    uel: 36.0,
    elastomers: {
      epdm: "good",
      fkm: "poor",
      ffkm: "excellent",
    },
    notes: [
      "Extremely low flash point and auto-ignition temperature — very high fire risk.",
      "IIB gas group. Low AIT requires careful T-class selection.",
      "Can form explosive peroxides; peroxide testing required.",
    ],
  },
  {
    name: "Toluene",
    casNumber: "108-88-3",
    type: "gas",
    isFlammable: true,
    flashPoint: 4,
    autoIgnition: 480,
    gasGroup: "IIA",
    lel: 1.1,
    uel: 7.1,
    elastomers: {
      epdm: "poor",
      fkm: "good",
      ffkm: "excellent",
    },
    notes: [
      "Aromatic solvent — EPDM not suitable; FKM or FFKM required.",
      "Neurotoxic with chronic exposure — ensure adequate ventilation.",
    ],
  },
  {
    name: "n-Hexane",
    casNumber: "110-54-3",
    type: "gas",
    isFlammable: true,
    flashPoint: -22,
    autoIgnition: 225,
    gasGroup: "IIA",
    lel: 1.1,
    uel: 7.5,
    elastomers: {
      epdm: "poor",
      fkm: "good",
      ffkm: "excellent",
    },
    notes: [
      "Low auto-ignition temperature — T-class selection is critical.",
      "Aliphatic hydrocarbon — EPDM not suitable; FKM or FFKM required.",
      "Neurotoxic with chronic exposure.",
    ],
  },
  {
    name: "DMSO",
    casNumber: "67-68-5",
    type: "gas",
    isFlammable: true,
    flashPoint: 89,
    autoIgnition: 215,
    gasGroup: "IIA",
    lel: 3.5,
    uel: 28.5,
    elastomers: {
      epdm: "good",
      fkm: "limited",
      ffkm: "excellent",
    },
    notes: [
      "Higher flash point than most solvents but low auto-ignition temperature.",
      "Known skin penetrant — can carry dissolved substances through skin.",
    ],
  },
  {
    name: "Dichloromethane (DCM)",
    casNumber: "75-09-2",
    type: "gas",
    isFlammable: false,
    flashPoint: null,
    autoIgnition: 556,
    gasGroup: null,
    lel: 13.0,
    uel: 23.0,
    elastomers: {
      epdm: "poor",
      fkm: "excellent",
      ffkm: "excellent",
    },
    notes: [
      "Not classified as flammable under normal ambient conditions — ATEX zone classification not typically required for DCM alone.",
      "Very high LEL (13%) means large concentrations are needed for ignition risk.",
      "EPDM is not compatible; FKM or FFKM required.",
      "Suspected carcinogen — regulatory restrictions in some regions.",
    ],
  },
  // ── Common industrial gases ──────────────────────────────────────────────────
  {
    name: "Hydrogen",
    casNumber: "1333-74-0",
    type: "gas",
    isFlammable: true,
    flashPoint: null,
    autoIgnition: 560,
    gasGroup: "IIC",
    lel: 4.0,
    uel: 75.0,
    elastomers: {
      epdm: "good",
      fkm: "good",
      ffkm: "excellent",
    },
    notes: [
      "IIC gas group — most stringent equipment classification required.",
      "Extremely wide explosive range (4–75%). Very high ignition risk.",
      "Colourless and odourless — gas detection essential.",
    ],
  },
  {
    name: "Methane",
    casNumber: "74-82-8",
    type: "gas",
    isFlammable: true,
    flashPoint: null,
    autoIgnition: 537,
    gasGroup: "IIA",
    lel: 5.0,
    uel: 15.0,
    elastomers: {
      epdm: "good",
      fkm: "good",
      ffkm: "excellent",
    },
    notes: ["Main component of natural gas.", "Colourless and odourless — gas detection essential."],
  },
  {
    name: "Propane",
    casNumber: "74-98-6",
    type: "gas",
    isFlammable: true,
    flashPoint: null,
    autoIgnition: 470,
    gasGroup: "IIA",
    lel: 2.1,
    uel: 9.5,
    elastomers: {
      epdm: "poor",
      fkm: "good",
      ffkm: "excellent",
    },
    notes: [
      "Heavier than air — accumulates at low points.",
      "EPDM not suitable for hydrocarbon gases; FKM or FFKM required.",
    ],
  },
  // ── Dusts ────────────────────────────────────────────────────────────────────
  {
    name: "Flour Dust",
    casNumber: "N/A",
    type: "dust",
    isFlammable: true,
    flashPoint: null,
    autoIgnition: 380,
    gasGroup: null,
    lel: null,
    uel: null,
    elastomers: {
      epdm: "good",
      fkm: "good",
      ffkm: "excellent",
    },
    notes: [
      "Combustible dust — Zone 20/21/22 classification applies.",
      "Minimum ignition energy is low; static discharge can be an ignition source.",
    ],
  },
]
