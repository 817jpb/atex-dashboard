// ─── Types ───────────────────────────────────────────────────────────────────

export type ProductVariant = "manual" | "automated"
export type GasGroup = "IIA" | "IIB" | "IIC"
export type TClass = "T1" | "T2" | "T3" | "T4" | "T5" | "T6"

export type Product = {
  id: string
  name: string
  variant: ProductVariant
  // The most hazardous zone the product is ATEX-certified for.
  // A Zone 1 product is also suitable for Zone 2 (less hazardous).
  // null = no ATEX certification for this atmosphere (manual products).
  atexGasZone: "0" | "1" | "2" | null
  atexDustZone: "20" | "21" | "22" | null
  // Gas group from the equipment marking (IIC covers IIA+IIB+IIC atmospheres)
  atexGasGroup: GasGroup | null
  // T-class from the equipment marking (T4 = max surface 135°C)
  atexTClass: TClass | null
  atexGasMarking: string | null
  atexDustMarking: string | null
  // True if markings are placeholder values pending confirmation
  markingsUnconfirmed: boolean
  notes: string[]
}

// ─── Suitability helpers ──────────────────────────────────────────────────────

const GAS_ZONE_RANK: Record<string, number> = { "0": 0, "1": 1, "2": 2 }
const DUST_ZONE_RANK: Record<string, number> = { "20": 0, "21": 1, "22": 2 }
// Higher rank = more restrictive (lower max surface temp = safer)
const TCLASS_RANK: Record<TClass, number> = { T1: 1, T2: 2, T3: 3, T4: 4, T5: 5, T6: 6 }
// Higher rank = covers more hazardous gas groups
const GAS_GROUP_RANK: Record<GasGroup, number> = { IIA: 1, IIB: 2, IIC: 3 }

export type CheckResult = "suitable" | "self-assess" | "not-suitable" | "not-required"

export type ProductSuitabilityResult = {
  product: Product
  gas: CheckResult
  dust: CheckResult
  gasGroup: CheckResult
  tClass: CheckResult
  overall: "suitable" | "self-assess" | "not-suitable"
}

export function assessProduct(
  product: Product,
  requiredGasZone: string | null,
  requiredDustZone: string | null,
  requiredGasGroup: GasGroup | null,
  requiredTClass: TClass | null,
): ProductSuitabilityResult {
  function checkZone(
    required: string | null,
    productZone: string | null,
    rankMap: Record<string, number>,
  ): CheckResult {
    if (!required) return "not-required"
    if (product.variant === "manual") return "self-assess"
    if (!productZone) return "not-suitable"
    return rankMap[productZone] <= rankMap[required] ? "suitable" : "not-suitable"
  }

  function checkGasGroup(required: GasGroup | null): CheckResult {
    if (!required) return "not-required"
    if (product.variant === "manual") return "self-assess"
    if (!product.atexGasGroup) return "not-suitable"
    // Equipment covers the required group if its rank is >= required rank
    return GAS_GROUP_RANK[product.atexGasGroup] >= GAS_GROUP_RANK[required]
      ? "suitable"
      : "not-suitable"
  }

  function checkTClass(required: TClass | null): CheckResult {
    if (!required) return "not-required"
    if (product.variant === "manual") return "self-assess"
    if (!product.atexTClass) return "not-suitable"
    // Equipment is suitable if its T-class rank is >= required rank
    // (more restrictive max surface temp is always safe)
    return TCLASS_RANK[product.atexTClass] >= TCLASS_RANK[required]
      ? "suitable"
      : "not-suitable"
  }

  const gas = checkZone(requiredGasZone, product.atexGasZone, GAS_ZONE_RANK)
  const dust = checkZone(requiredDustZone, product.atexDustZone, DUST_ZONE_RANK)
  const gasGroup = checkGasGroup(requiredGasGroup)
  const tClass = checkTClass(requiredTClass)

  const statuses = [gas, dust, gasGroup, tClass].filter((s) => s !== "not-required")
  let overall: ProductSuitabilityResult["overall"]
  if (statuses.length === 0) overall = "suitable"
  else if (statuses.every((s) => s === "suitable")) overall = "suitable"
  else if (statuses.some((s) => s === "not-suitable")) overall = "not-suitable"
  else overall = "self-assess"

  return { product, gas, dust, gasGroup, tClass, overall }
}

// ─── T-class derivation from auto-ignition temperature ───────────────────────

const TCLASS_MAX_TEMP: Record<TClass, number> = {
  T1: 450, T2: 300, T3: 200, T4: 135, T5: 100, T6: 85,
}

export function requiredTClassFromAit(ait: number): TClass | null {
  const ordered: TClass[] = ["T1", "T2", "T3", "T4", "T5", "T6"]
  for (const tClass of ordered) {
    if (TCLASS_MAX_TEMP[tClass] < ait) return tClass
  }
  return null
}

// ─── Product catalog ──────────────────────────────────────────────────────────
// ATEX markings for automated products are PLACEHOLDERS.
// Please replace with confirmed certificate markings before use.

const PLACEHOLDER_GAS_MARKING = "II 2G Ex db IIC T4 Gb"
const PLACEHOLDER_DUST_MARKING = "II 2D Ex tb IIIC T135°C Db"

const MANUAL_NOTES = [
  "Manual (non-electrical) equipment — not subject to ATEX electrical equipment certification.",
  "Designed for use in Zone 1 / Zone 21 environments.",
  "Customer must verify suitability under their applicable ATEX directive and site basis of safety.",
]

export const products: Product[] = [
  {
    id: "pharmasafe-manual",
    name: "PharmaSafe Manual",
    variant: "manual",
    atexGasZone: null,
    atexDustZone: null,
    atexGasGroup: null,
    atexTClass: null,
    atexGasMarking: null,
    atexDustMarking: null,
    markingsUnconfirmed: false,
    notes: MANUAL_NOTES,
  },
  {
    id: "pharmasafe-pro-manual",
    name: "PharmaSafe Pro Manual",
    variant: "manual",
    atexGasZone: null,
    atexDustZone: null,
    atexGasGroup: null,
    atexTClass: null,
    atexGasMarking: null,
    atexDustMarking: null,
    markingsUnconfirmed: false,
    notes: MANUAL_NOTES,
  },
  {
    id: "pharmasafe-automated",
    name: "PharmaSafe Automated",
    variant: "automated",
    atexGasZone: "1",
    atexDustZone: "21",
    atexGasGroup: "IIC",
    atexTClass: "T4",
    atexGasMarking: PLACEHOLDER_GAS_MARKING,
    atexDustMarking: PLACEHOLDER_DUST_MARKING,
    markingsUnconfirmed: true,
    notes: [],
  },
  {
    id: "pharmasafe-pro-automated",
    name: "PharmaSafe Pro Automated",
    variant: "automated",
    atexGasZone: "1",
    atexDustZone: "21",
    atexGasGroup: "IIC",
    atexTClass: "T4",
    atexGasMarking: PLACEHOLDER_GAS_MARKING,
    atexDustMarking: PLACEHOLDER_DUST_MARKING,
    markingsUnconfirmed: true,
    notes: [],
  },
  {
    id: "aseptisafe-manual",
    name: "AseptiSafe Manual",
    variant: "manual",
    atexGasZone: null,
    atexDustZone: null,
    atexGasGroup: null,
    atexTClass: null,
    atexGasMarking: null,
    atexDustMarking: null,
    markingsUnconfirmed: false,
    notes: MANUAL_NOTES,
  },
  {
    id: "aseptisafe-bio-manual",
    name: "AseptiSafe Bio Manual",
    variant: "manual",
    atexGasZone: null,
    atexDustZone: null,
    atexGasGroup: null,
    atexTClass: null,
    atexGasMarking: null,
    atexDustMarking: null,
    markingsUnconfirmed: false,
    notes: MANUAL_NOTES,
  },
  {
    id: "aseptisafe-automated",
    name: "AseptiSafe Automated",
    variant: "automated",
    atexGasZone: "1",
    atexDustZone: "21",
    atexGasGroup: "IIC",
    atexTClass: "T4",
    atexGasMarking: PLACEHOLDER_GAS_MARKING,
    atexDustMarking: PLACEHOLDER_DUST_MARKING,
    markingsUnconfirmed: true,
    notes: [],
  },
  {
    id: "aseptisafe-bio-automated",
    name: "AseptiSafe Bio Automated",
    variant: "automated",
    atexGasZone: "1",
    atexDustZone: "21",
    atexGasGroup: "IIC",
    atexTClass: "T4",
    atexGasMarking: PLACEHOLDER_GAS_MARKING,
    atexDustMarking: PLACEHOLDER_DUST_MARKING,
    markingsUnconfirmed: true,
    notes: [],
  },
]
