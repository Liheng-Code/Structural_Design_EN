import React from "react";

export type SoilTextureType =
  | "sand"
  | "clay"
  | "gravel"
  | "rock"
  | "silt"
  | "fill"
  | "generic";

export interface SoilTextureInfo {
  type: SoilTextureType;
  label: string;
  subLabel: string;
  texturePatternName: string;
  bgHex: string;
  borderHex: string;
  textHex: string;
}

export const SOIL_TEXTURE_CONFIG: Record<SoilTextureType, SoilTextureInfo> = {
  sand: {
    type: "sand",
    label: "Sand",
    subLabel: "Granular Stipple",
    texturePatternName: "Sand Grains",
    bgHex: "#d97706",
    borderHex: "#92400e",
    textHex: "#fef3c7",
  },
  clay: {
    type: "clay",
    label: "Clay",
    subLabel: "Cohesive Cross-Hatch",
    texturePatternName: "Clay Cross-Hatch",
    bgHex: "#475569",
    borderHex: "#334155",
    textHex: "#e2e8f0",
  },
  gravel: {
    type: "gravel",
    label: "Gravel",
    subLabel: "Rounded Cobbles",
    texturePatternName: "Gravel Pebbles",
    bgHex: "#9a3412",
    borderHex: "#7c2d12",
    textHex: "#ffedd5",
  },
  rock: {
    type: "rock",
    label: "Rock",
    subLabel: "Fracture Joints",
    texturePatternName: "Bedrock Fissures",
    bgHex: "#6b21a8",
    borderHex: "#581c87",
    textHex: "#f3e8ff",
  },
  silt: {
    type: "silt",
    label: "Silt",
    subLabel: "Sedimentary Laminations",
    texturePatternName: "Silt Laminations",
    bgHex: "#78716c",
    borderHex: "#57534e",
    textHex: "#f5f5f4",
  },
  fill: {
    type: "fill",
    label: "Fill",
    subLabel: "Made Ground Debris",
    texturePatternName: "Debris & Rubble",
    bgHex: "#854d0e",
    borderHex: "#713f12",
    textHex: "#fef9c3",
  },
  generic: {
    type: "generic",
    label: "Strata",
    subLabel: "Soil Material",
    texturePatternName: "Soil Stratum",
    bgHex: "#3b82f6",
    borderHex: "#1d4ed8",
    textHex: "#dbeafe",
  },
};

/**
 * Heuristic detector for soil texture based on stratum metadata.
 */
export function detectSoilTexture(layer: {
  name?: string;
  type?: string;
  soilType?: string;
  behaviorType?: string;
  description?: string;
  drainage?: string;
}): SoilTextureType {
  const text = `${layer.name || ""} ${layer.type || ""} ${layer.soilType || ""} ${layer.behaviorType || ""} ${layer.description || ""}`.toLowerCase();

  if (
    text.includes("rock") ||
    text.includes("granite") ||
    text.includes("sandstone") ||
    text.includes("limestone") ||
    text.includes("shale") ||
    text.includes("basalt") ||
    layer.behaviorType === "rock"
  ) {
    return "rock";
  }

  if (
    text.includes("gravel") ||
    text.includes("cobble") ||
    text.includes("boulder") ||
    text.includes("pebble") ||
    layer.type === "gravel"
  ) {
    return "gravel";
  }

  if (
    text.includes("clay") ||
    text.includes("mud") ||
    layer.behaviorType === "cohesive" ||
    layer.drainage === "undrained" ||
    layer.type === "clay" ||
    layer.type === "stiff-clay"
  ) {
    return "clay";
  }

  if (
    text.includes("silt") ||
    text.includes("loess") ||
    text.includes("loam")
  ) {
    return "silt";
  }

  if (
    text.includes("sand") ||
    text.includes("granular") ||
    layer.behaviorType === "granular" ||
    layer.type === "sand" ||
    layer.type === "dense-sand"
  ) {
    return "sand";
  }

  if (
    text.includes("fill") ||
    text.includes("made ground") ||
    text.includes("waste") ||
    layer.type === "fill"
  ) {
    return "fill";
  }

  return "generic";
}

export interface SoilTextureIconProps {
  /**
   * The layer object or explicit texture type
   */
  layerOrType?:
    | {
        name?: string;
        type?: string;
        soilType?: string;
        behaviorType?: string;
        description?: string;
        drainage?: string;
      }
    | SoilTextureType;
  /**
   * Icon size variant
   * xs: 18x18, sm: 22x22, md: 30x30, lg: 38x38
   */
  size?: "xs" | "sm" | "md" | "lg";
  /**
   * Whether to display a pill badge with the soil classification text
   */
  showLabel?: boolean;
  /**
   * Custom CSS class name
   */
  className?: string;
  /**
   * Custom tooltip text
   */
  tooltip?: string;
}

export const SoilTextureIcon: React.FC<SoilTextureIconProps> = ({
  layerOrType = "generic",
  size = "sm",
  showLabel = false,
  className = "",
  tooltip,
}) => {
  const textureType: SoilTextureType =
    typeof layerOrType === "string"
      ? layerOrType
      : detectSoilTexture(layerOrType);

  const config = SOIL_TEXTURE_CONFIG[textureType] || SOIL_TEXTURE_CONFIG.generic;

  const sizeDimensions = {
    xs: { px: 18, rx: 3, labelSize: "text-[9px]" },
    sm: { px: 22, rx: 4, labelSize: "text-[10px]" },
    md: { px: 30, rx: 5, labelSize: "text-xs" },
    lg: { px: 38, rx: 6, labelSize: "text-xs" },
  }[size];

  const defaultTitle =
    tooltip || `${config.label} Texture: ${config.texturePatternName} (${config.subLabel})`;

  return (
    <div
      className={`inline-flex items-center gap-1.5 shrink-0 select-none ${className}`}
      title={defaultTitle}
    >
      <svg
        width={sizeDimensions.px}
        height={sizeDimensions.px}
        viewBox="0 0 32 32"
        className="shrink-0 overflow-hidden shadow-xs transition-transform hover:scale-110"
        style={{
          borderRadius: sizeDimensions.rx,
          border: `1px solid ${config.borderHex}`,
        }}
        aria-label={defaultTitle}
        role="img"
      >
        <defs>
          {/* Subtle 3D Bevel Gradient */}
          <linearGradient id={`bezel-${textureType}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.25" />
          </linearGradient>
        </defs>

        {/* Base Material Color Fill */}
        <rect width="32" height="32" fill={config.bgHex} rx={sizeDimensions.rx} />

        {/* GEOTECHNICAL TEXTURE PATTERNS */}
        {textureType === "sand" && (
          /* ASTM Sand Grains: Stipple dots and particles of varying grain sizes */
          <g>
            {/* Fine background grains */}
            <circle cx="4" cy="5" r="1.1" fill="#fef08a" opacity="0.9" />
            <circle cx="11" cy="4" r="1.4" fill="#fde047" />
            <circle cx="19" cy="5" r="1.1" fill="#fef08a" opacity="0.85" />
            <circle cx="26" cy="4" r="1.3" fill="#fde047" />

            <circle cx="7" cy="11" r="1.5" fill="#fef9c3" />
            <circle cx="15" cy="10" r="1.2" fill="#fef08a" opacity="0.9" />
            <circle cx="23" cy="11" r="1.6" fill="#fef9c3" />
            <circle cx="29" cy="12" r="1.0" fill="#fef08a" />

            <circle cx="3" cy="17" r="1.3" fill="#fde047" />
            <circle cx="11" cy="17" r="1.7" fill="#fef9c3" />
            <circle cx="19" cy="16" r="1.3" fill="#fde047" />
            <circle cx="27" cy="18" r="1.4" fill="#fef9c3" />

            <circle cx="6" cy="23" r="1.2" fill="#fef08a" opacity="0.9" />
            <circle cx="14" cy="24" r="1.6" fill="#fef9c3" />
            <circle cx="22" cy="23" r="1.3" fill="#fde047" />
            <circle cx="29" cy="25" r="1.1" fill="#fef08a" />

            <circle cx="4" cy="29" r="1.4" fill="#fde047" />
            <circle cx="11" cy="29" r="1.0" fill="#fef08a" />
            <circle cx="18" cy="29" r="1.5" fill="#fef9c3" />
            <circle cx="25" cy="29" r="1.2" fill="#fef08a" />
          </g>
        )}

        {textureType === "clay" && (
          /* ASTM Clay Cross-Hatching: 45° intersecting laminar shear lines */
          <g stroke="#cbd5e1" strokeWidth="1.2" strokeLinecap="round" opacity="0.9">
            {/* Primary 45° Diagonal Lines */}
            <line x1="-4" y1="6" x2="10" y2="-8" />
            <line x1="-4" y1="16" x2="20" y2="-8" />
            <line x1="-4" y1="26" x2="30" y2="-8" />
            <line x1="2" y1="36" x2="36" y2="2" />
            <line x1="12" y1="36" x2="36" y2="12" />
            <line x1="22" y1="36" x2="36" y2="22" />

            {/* Opposing Cross-Hatch Lines (Geotechnical Cohesive Clay pattern) */}
            <line x1="26" y1="-4" x2="40" y2="10" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="16" y1="-4" x2="40" y2="20" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="6" y1="-4" x2="40" y2="30" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="-4" y1="6" x2="30" y2="40" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="-4" y1="16" x2="20" y2="40" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 3" />
            <line x1="-4" y1="26" x2="10" y2="40" stroke="#94a3b8" strokeWidth="1" strokeDasharray="3 3" />
          </g>
        )}

        {textureType === "gravel" && (
          /* ASTM Gravel & Cobbles: Rounded pebbles and stone contours */
          <g stroke="#ffedd5" strokeWidth="1.1" fill="#fed7aa" fillOpacity="0.85">
            <ellipse cx="10" cy="10" rx="5" ry="3.5" transform="rotate(-15 10 10)" />
            <ellipse cx="23" cy="9" rx="4" ry="2.8" transform="rotate(25 23 9)" />
            <ellipse cx="17" cy="18" rx="4.5" ry="3.2" transform="rotate(-30 17 18)" />
            <ellipse cx="7" cy="23" rx="4.2" ry="3" transform="rotate(20 7 23)" />
            <ellipse cx="25" cy="24" rx="4.8" ry="3.2" transform="rotate(-10 25 24)" />
            {/* Small interstitial gravel particles */}
            <circle cx="16" cy="7" r="1.3" fill="#ffedd5" stroke="none" />
            <circle cx="8" cy="17" r="1.4" fill="#ffedd5" stroke="none" />
            <circle cx="26" cy="16" r="1.3" fill="#ffedd5" stroke="none" />
            <circle cx="17" cy="27" r="1.2" fill="#ffedd5" stroke="none" />
          </g>
        )}

        {textureType === "rock" && (
          /* Competent Bedrock: Angular fracture joints & fissures */
          <g stroke="#e9d5ff" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
            {/* Primary jagged joint fracture 1 */}
            <path d="M 2 8 L 10 14 L 18 7 L 30 13" fill="none" />
            {/* Secondary joint fracture 2 */}
            <path d="M 4 25 L 14 19 L 21 27 L 30 21" fill="none" />
            {/* Cross vertical bedding fracture */}
            <path d="M 10 14 L 14 19" fill="none" strokeWidth="1.2" />
            <path d="M 18 7 L 21 16" fill="none" strokeWidth="1" strokeDasharray="2 2" />
            <path d="M 2 18 L 8 20" fill="none" strokeWidth="1" />
          </g>
        )}

        {textureType === "silt" && (
          /* Sedimentary Silt: Fine wavy parallel horizontal sediment ribbons */
          <g stroke="#f5f5f4" strokeWidth="1.1" fill="none" opacity="0.95">
            <path d="M 1 6 Q 8 3 16 6 T 31 6" />
            <path d="M 1 12 Q 8 9 16 12 T 31 12" strokeDasharray="3 2" />
            <path d="M 1 18 Q 8 15 16 18 T 31 18" />
            <path d="M 1 24 Q 8 21 16 24 T 31 24" strokeDasharray="3 2" />
            <path d="M 1 29 Q 8 26 16 29 T 31 29" />
          </g>
        )}

        {textureType === "fill" && (
          /* Fill / Made Ground: Heterogeneous debris, brick fragments and hashes */
          <g stroke="#fef08a" strokeWidth="0.9" fill="#fef08a" fillOpacity="0.8">
            <polygon points="4,8 9,5 11,10 5,11" />
            <polygon points="20,6 26,8 24,14 18,12" />
            <polygon points="6,21 12,24 8,27 3,24" />
            <polygon points="19,19 25,18 26,24 20,25" />
            {/* Random debris scatter */}
            <line x1="13" y1="8" x2="16" y2="15" strokeWidth="1.3" />
            <line x1="12" y1="18" x2="16" y2="24" strokeWidth="1.3" />
            <circle cx="15" cy="13" r="1.3" fill="#ffffff" stroke="none" />
          </g>
        )}

        {textureType === "generic" && (
          /* Generic Soil: Multi-grain and laminar hatch */
          <g stroke="#dbeafe" strokeWidth="1.1" opacity="0.85">
            <line x1="0" y1="8" x2="32" y2="8" strokeDasharray="4 2" />
            <line x1="0" y1="16" x2="32" y2="16" strokeDasharray="4 2" />
            <line x1="0" y1="24" x2="32" y2="24" strokeDasharray="4 2" />
            <circle cx="8" cy="12" r="1.4" fill="#dbeafe" stroke="none" />
            <circle cx="24" cy="12" r="1.4" fill="#dbeafe" stroke="none" />
            <circle cx="16" cy="20" r="1.4" fill="#dbeafe" stroke="none" />
          </g>
        )}

        {/* Outer 3D Bezel Overlay */}
        <rect
          width="32"
          height="32"
          fill={`url(#bezel-${textureType})`}
          rx={sizeDimensions.rx}
          pointerEvents="none"
        />
      </svg>

      {/* Optional Tag Label */}
      {showLabel && (
        <span
          className={`font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded border ${sizeDimensions.labelSize}`}
          style={{
            backgroundColor: `${config.bgHex}25`,
            borderColor: `${config.borderHex}80`,
            color: config.textHex,
          }}
        >
          {config.label}
        </span>
      )}
    </div>
  );
};

export default SoilTextureIcon;
