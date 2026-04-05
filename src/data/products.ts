// ─── Types ───────────────────────────────────────────────────────────────────

export type ProductVariant = "manual" | "automated"

export type Product = {
  id: string
  name: string
  variant: ProductVariant
  // The most hazardous zone the product is ATEX-certified for.
  // A Zone 1 product is also suitable for Zone 2 (less hazardous).
  // null = no ATEX certification for this atmosphere (manual products).
  atexGasZone: "0" | "1" | "2" | null
  atexDustZone: "20" | "21" | "22" | null
  atexGasMarking: string | null
  atexDustMarking: string | null
  // True if markings are placeholder values pending confirmation
  markingsUnconfirmed: boolean
  notes: string[]
}

// ─── Suitability helpers ──────────────────────────────────────────────────────

const GAS_ZONE_RANK: Record<string, number> = { "0": 0, "1": 1, "2": 2 }
const DUST_ZONE_RANK: Record<string, number> = { "20": 0, "21": 1, "22": 2 }

export type AtmosphereSuitability = "suitable" | "self-assess" | "not-suitable" | "not-required"

export type ProductSuitabilityResult = {
  product: Product
  gas: AtmosphereSuitability
  dust: AtmosphereSuitability
  overall: "suitable" | "self-assess" | "not-suitable"
}

export function assessProduct(
  product: Product,
  requiredGasZone: string | null,
  requiredDustZone: string | null,
): ProductSuitabilityResult {
  function checkAtmosphere(
    required: string | null,
    productZone: string | null,
    rankMap: Record<string, number>,
  ): AtmosphereSuitability {
    if (!required) return "not-required"
    if (product.variant === "manual") return "self-assess"
    if (!productZone) return "not-suitable"
    return rankMap[productZone] <= rankMap[required] ? "suitable" : "not-suitable"
  }

  const gas = checkAtmosphere(requiredGasZone, product.atexGasZone, GAS_ZONE_RANK)
  const dust = checkAtmosphere(requiredDustZone, product.atexDustZone, DUST_ZONE_RANK)

  const statuses = [gas, dust].filter((s) => s !== "not-required")
  let overall: ProductSuitabilityResult["overall"]
  if (statuses.every((s) => s === "suitable")) overall = "suitable"
  else if (statuses.some((s) => s === "not-suitable")) overall = "not-suitable"
  else overall = "self-assess"

  return { product, gas, dust, overall }
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
    atexGasMarking: PLACEHOLDER_GAS_MARKING,
    atexDustMarking: PLACEHOLDER_DUST_MARKING,
    markingsUnconfirmed: true,
    notes: [],
  },
]
