export type ZoneRecord = {
  id: string
  system: "ATEX"
  hazardFamily: "gas" | "dust"
  zone: "0" | "1" | "2" | "20" | "21" | "22"
  description: string
  likelyPresence: string
  minimumCategory: string
  minimumEpl: string
  commonProtectionTypes: string[]
  notes: string[]
}

export const zones: ZoneRecord[] = [
  {
    id: "atex-zone-0-gas",
    system: "ATEX",
    hazardFamily: "gas",
    zone: "0",
    description: "Explosive gas atmosphere present continuously, for long periods, or frequently.",
    likelyPresence: "Continuous / long duration / frequent",
    minimumCategory: "1G",
    minimumEpl: "Ga",
    commonProtectionTypes: ["Ex ia", "Ex ma"],
    notes: [
      "Highest protection level normally required for gas atmospheres.",
      "Not all protection concepts are suitable for Zone 0."
    ]
  },
  {
    id: "atex-zone-1-gas",
    system: "ATEX",
    hazardFamily: "gas",
    zone: "1",
    description: "Explosive gas atmosphere likely to occur occasionally in normal operation.",
    likelyPresence: "Occasional",
    minimumCategory: "2G",
    minimumEpl: "Gb",
    commonProtectionTypes: ["Ex db", "Ex eb", "Ex ib", "Ex mb", "Ex pxb", "Ex pyb"],
    notes: [
      "Common area for flameproof, increased safety, and intrinsic safety solutions.",
      "Always confirm certification marking for actual use."
    ]
  },
  {
    id: "atex-zone-2-gas",
    system: "ATEX",
    hazardFamily: "gas",
    zone: "2",
    description: "Explosive gas atmosphere not likely in normal operation, and if it occurs it will exist only for a short time.",
    likelyPresence: "Infrequent / short duration",
    minimumCategory: "3G",
    minimumEpl: "Gc",
    commonProtectionTypes: ["Ex ec", "Ex ic", "Ex nA", "Ex nR", "Ex pzc"],
    notes: [
      "Lower likelihood gas area than Zone 1.",
      "Some legacy protection concept labels may still appear on older equipment."
    ]
  },
  {
    id: "atex-zone-20-dust",
    system: "ATEX",
    hazardFamily: "dust",
    zone: "20",
    description: "Explosive dust atmosphere present continuously, for long periods, or frequently.",
    likelyPresence: "Continuous / long duration / frequent",
    minimumCategory: "1D",
    minimumEpl: "Da",
    commonProtectionTypes: ["Ex ia Da", "Ex ta"],
    notes: [
      "Highest protection level normally required for dust atmospheres.",
      "Dust ingress and surface temperature control are critical."
    ]
  },
  {
    id: "atex-zone-21-dust",
    system: "ATEX",
    hazardFamily: "dust",
    zone: "21",
    description: "Explosive dust atmosphere likely to occur occasionally in normal operation.",
    likelyPresence: "Occasional",
    minimumCategory: "2D",
    minimumEpl: "Db",
    commonProtectionTypes: ["Ex tb", "Ex ib Db"],
    notes: [
      "Equipment enclosure protection is often central in dust applications.",
      "Always check dust group and maximum surface temperature."
    ]
  },
  {
    id: "atex-zone-22-dust",
    system: "ATEX",
    hazardFamily: "dust",
    zone: "22",
    description: "Explosive dust atmosphere not likely in normal operation, and if it occurs it will exist only for a short time.",
    likelyPresence: "Infrequent / short duration",
    minimumCategory: "3D",
    minimumEpl: "Dc",
    commonProtectionTypes: ["Ex tc", "Ex ic Dc"],
    notes: [
      "Lower likelihood dust area than Zone 21.",
      "Still requires suitable certified equipment where applicable."
    ]
  }
]