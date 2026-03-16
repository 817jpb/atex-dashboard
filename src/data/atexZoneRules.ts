type ZoneResult = {
  gas: string[];
  dust: string[];
  notes: string[];
  matched: {
    gasCategory?: string;
    dustCategory?: string;
    gasEpl?: string;
    dustEpl?: string;
  };
};

const GAS_CATEGORY_ZONES: Record<string, string[]> = {
  "1G": ["Zone 0", "Zone 1", "Zone 2"],
  "2G": ["Zone 1", "Zone 2"],
  "3G": ["Zone 2"],
};

const DUST_CATEGORY_ZONES: Record<string, string[]> = {
  "1D": ["Zone 20", "Zone 21", "Zone 22"],
  "2D": ["Zone 21", "Zone 22"],
  "3D": ["Zone 22"],
};

const GAS_EPL_ZONES: Record<string, string[]> = {
  Ga: ["Zone 0", "Zone 1", "Zone 2"],
  Gb: ["Zone 1", "Zone 2"],
  Gc: ["Zone 2"],
};

const DUST_EPL_ZONES: Record<string, string[]> = {
  Da: ["Zone 20", "Zone 21", "Zone 22"],
  Db: ["Zone 21", "Zone 22"],
  Dc: ["Zone 22"],
};

function uniqueZones(zones: string[]) {
  return [...new Set(zones)];
}

function intersectZones(a: string[], b: string[]) {
  return a.filter((zone) => b.includes(zone));
}

export function determineAtexZonesFromMarking(marking: string): ZoneResult {
  const text = marking.trim();

  const gasCategoryMatch = text.match(/\b([123]G)\b/i);
  const dustCategoryMatch = text.match(/\b([123]D)\b/i);

  const gasEplMatch = text.match(/\b(Ga|Gb|Gc)\b/);
  const dustEplMatch = text.match(/\b(Da|Db|Dc)\b/);

  const gasCategory = gasCategoryMatch?.[1]?.toUpperCase();
  const dustCategory = dustCategoryMatch?.[1]?.toUpperCase();
  const gasEpl = gasEplMatch?.[1];
  const dustEpl = dustEplMatch?.[1];

  let gasZones: string[] = [];
  let dustZones: string[] = [];
  const notes: string[] = [];

  if (gasCategory && GAS_CATEGORY_ZONES[gasCategory]) {
    gasZones = GAS_CATEGORY_ZONES[gasCategory];
    notes.push(`Gas category ${gasCategory} detected.`);
  }

  if (dustCategory && DUST_CATEGORY_ZONES[dustCategory]) {
    dustZones = DUST_CATEGORY_ZONES[dustCategory];
    notes.push(`Dust category ${dustCategory} detected.`);
  }

  if (gasEpl && GAS_EPL_ZONES[gasEpl]) {
    notes.push(`Gas EPL ${gasEpl} detected.`);
    gasZones = gasZones.length
      ? intersectZones(gasZones, GAS_EPL_ZONES[gasEpl])
      : GAS_EPL_ZONES[gasEpl];
  }

  if (dustEpl && DUST_EPL_ZONES[dustEpl]) {
    notes.push(`Dust EPL ${dustEpl} detected.`);
    dustZones = dustZones.length
      ? intersectZones(dustZones, DUST_EPL_ZONES[dustEpl])
      : DUST_EPL_ZONES[dustEpl];
  }

  gasZones = uniqueZones(gasZones);
  dustZones = uniqueZones(dustZones);

  if (!gasZones.length && !dustZones.length) {
    notes.push("No usable ATEX category or EPL could be identified from the marking.");
  }

  return {
    gas: gasZones,
    dust: dustZones,
    notes,
    matched: {
      gasCategory,
      dustCategory,
      gasEpl,
      dustEpl,
    },
  };
}