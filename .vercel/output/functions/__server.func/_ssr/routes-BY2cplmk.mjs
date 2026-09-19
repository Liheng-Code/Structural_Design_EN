import { i as __toESM } from "../_runtime.mjs";
import { K as require_react, b as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { A as ChevronRight, C as Download, D as CircleDot, E as Compass, M as Calculator, N as ArrowRight, O as CircleCheck, P as ArrowLeft, S as EyeOff, T as Cpu, _ as Layers, a as TrendingUp, b as FileText, c as ShieldCheck, d as Printer, f as Plus, g as Lock, h as LogOut, i as TriangleAlert, j as Check, k as CircleAlert, l as Save, m as Mail, n as Waves, o as Trash2, p as Menu, r as Upload, s as SlidersVertical, t as X, u as RotateCcw, v as HardHat, w as Database, x as Eye, y as FolderOpen } from "../_libs/lucide-react.mjs";
import { t as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { n as persist, r as create, t as createJSONStorage } from "../_libs/zustand.mjs";
import { t as katex } from "../_libs/katex.mjs";
import { n as utils, r as writeSync, t as readSync } from "../_libs/xlsx.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-BY2cplmk.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function CrossSection({ project, water, traffic }) {
	const H = project.geometry.retainedHeight;
	const D = project.geometry.embedment;
	const B = project.geometry.totalWidth;
	const t = project.geometry.wallThickness;
	const road = project.geometry.roadWidth;
	const capH = project.capping.enabled ? project.capping.h : 0;
	const capB = project.capping.enabled ? project.capping.b : 0;
	const rb = project.geometry.riverbed;
	const pav = project.pavement.asphalt + project.pavement.subbase;
	const isCbp = project.wallSystem === "cbp";
	const cbp = project.cbp ?? {
		diameter: .8,
		spacing: .95,
		lateralModel: "individual-pile"
	};
	const top = rb + H + capH + .2;
	const bot = rb - D - .8;
	const xL = -B / 2;
	const xR = B / 2;
	const padL = 4.2;
	const padR = 4.2;
	const W = 920;
	const Ht = 520;
	const xMin = xL - padL;
	const xMax = xR + padR;
	const sx = (x) => (x - xMin) / (xMax - xMin) * W;
	const sy = (z) => (top - z) / (top - bot) * Ht;
	const leftFace = xL;
	const rightFace = xR - t;
	const waterPoly = (side, wl) => {
		if (wl <= rb) return "";
		const x0 = side === "L" ? xMin : xR;
		const x1 = side === "L" ? leftFace : xMax;
		return `${sx(x0)},${sy(wl)} ${sx(x1)},${sy(wl)} ${sx(x1)},${sy(rb)} ${sx(x0)},${sy(rb)}`;
	};
	const soilColours = [
		"#dbc49b",
		"#c7a876",
		"#b89462",
		"#a97e52",
		"#879b72",
		"#9e8970"
	];
	const visibleLayers = project.nativeLayers.map((layer, index) => ({
		...layer,
		index,
		top: Math.min(layer.zTop, rb),
		bottom: Math.max(layer.zBot, bot)
	})).filter((layer) => layer.top > layer.bottom);
	const soilLayerRects = (x, width, label) => visibleLayers.map((layer) => {
		const y = sy(layer.top);
		const height = sy(layer.bottom) - y;
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x,
				y,
				width,
				height,
				fill: soilColours[layer.index % soilColours.length],
				opacity: "0.82"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x,
				y,
				width,
				height,
				fill: "url(#hatch-soil)",
				opacity: "0.28"
			}),
			label && height > 24 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("text", {
				x: x + 7,
				y: y + 15,
				fill: "#382e21",
				fontSize: "10",
				fontFamily: "IBM Plex Sans, sans-serif",
				children: [
					layer.name,
					" | phi' ",
					layer.phi.toFixed(0),
					" deg | N ",
					layer.sptN.toFixed(0)
				]
			}) : null
		] }, `${x}-${layer.id}`);
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: `0 0 ${W} ${Ht}`,
		className: "w-full h-auto max-w-full bg-panel",
		role: "img",
		"aria-label": `${isCbp ? "Contiguous bored pile" : "Sheet pile"} excavation support cross-section with soil layers`,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("defs", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pattern", {
					id: "hatch-soil",
					width: "8",
					height: "8",
					patternUnits: "userSpaceOnUse",
					patternTransform: "rotate(45)",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
						x1: "0",
						y1: "0",
						x2: "0",
						y2: "8",
						stroke: "#b08968",
						strokeWidth: "1.2"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pattern", {
					id: "hatch-fill",
					width: "6",
					height: "6",
					patternUnits: "userSpaceOnUse",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
						cx: "1",
						cy: "1",
						r: "0.8",
						fill: "#8a7b5a",
						opacity: "0.45"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("linearGradient", {
					id: "waterGrad",
					x1: "0",
					y1: "0",
					x2: "0",
					y2: "1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
						offset: "0%",
						stopColor: "#7eabcc",
						stopOpacity: "0.75"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("stop", {
						offset: "100%",
						stopColor: "#4d7a9c",
						stopOpacity: "0.55"
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pattern", {
					id: "cbpPile",
					width: "18",
					height: "18",
					patternUnits: "userSpaceOnUse",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
						cx: "9",
						cy: "9",
						r: "7",
						fill: "#75808a",
						stroke: "#28323b",
						strokeWidth: "1.2"
					})
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: "0",
				y: "0",
				width: W,
				height: Ht,
				fill: "#f7f4ec"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
				x1: "0",
				y1: sy(rb),
				x2: W,
				y2: sy(rb),
				stroke: "#c9c0b0",
				strokeWidth: "1"
			}),
			soilLayerRects(sx(xMin), sx(leftFace) - sx(xMin), true),
			soilLayerRects(sx(xR), sx(xMax) - sx(xR), false),
			soilLayerRects(sx(leftFace + t), sx(rightFace) - sx(leftFace + t), false),
			water.up > rb ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("polygon", {
				points: waterPoly("L", water.up),
				fill: "url(#waterGrad)"
			}) : null,
			water.down > rb ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("polygon", {
				points: waterPoly("R", water.down),
				fill: "url(#waterGrad)"
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: sx(leftFace + t),
				y: sy(rb + H),
				width: sx(rightFace) - sx(leftFace + t),
				height: sy(rb) - sy(rb + H),
				fill: "url(#hatch-fill)",
				stroke: "#8a7b5a",
				strokeWidth: "0.6"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: sx(leftFace + t),
				y: sy(rb + H),
				width: sx(rightFace) - sx(leftFace + t),
				height: sy(rb + H - pav) - sy(rb + H),
				fill: "#3a3f46"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: sx(leftFace + t),
				y: sy(rb + H - project.pavement.subbase),
				width: sx(rightFace) - sx(leftFace + t),
				height: sy(rb + H - pav) - sy(rb + H - project.pavement.subbase),
				fill: "#9a9386"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: sx(leftFace),
				y: sy(rb + H),
				width: sx(leftFace + t) - sx(leftFace),
				height: sy(rb - D) - sy(rb + H),
				fill: isCbp ? "url(#cbpPile)" : "#5f656c",
				stroke: "#2c3036",
				strokeWidth: "1"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: sx(rightFace),
				y: sy(rb + H),
				width: sx(rightFace + t) - sx(rightFace),
				height: sy(rb - D) - sy(rb + H),
				fill: isCbp ? "url(#cbpPile)" : "#5f656c",
				stroke: "#2c3036",
				strokeWidth: "1"
			}),
			project.capping.enabled ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: sx(leftFace - (capB - t) / 2),
				y: sy(rb + H + capH),
				width: sx(capB) - sx(0),
				height: sy(rb + H) - sy(rb + H + capH),
				fill: "#2a3138"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: sx(rightFace - (capB - t) / 2),
				y: sy(rb + H + capH),
				width: sx(capB) - sx(0),
				height: sy(rb + H) - sy(rb + H + capH),
				fill: "#2a3138"
			})] }) : null,
			project.ties.filter((tr) => tr.enabled).map((tr, i) => {
				const y = sy(tr.elevation);
				const dash = i === 0 ? void 0 : "6 4";
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
						x1: sx(leftFace + t),
						y1: y,
						x2: sx(rightFace),
						y2: y,
						stroke: "#9b2f28",
						strokeWidth: "2.4",
						strokeDasharray: dash
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
						cx: sx(leftFace + t),
						cy: y,
						r: "3.5",
						fill: "#9b2f28"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
						cx: sx(rightFace),
						cy: y,
						r: "3.5",
						fill: "#9b2f28"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("text", {
						x: (sx(leftFace + t) + sx(rightFace)) / 2,
						y: y - 6,
						textAnchor: "middle",
						fill: "#9b2f28",
						fontSize: "11",
						fontFamily: "IBM Plex Sans Condensed, sans-serif",
						children: [
							tr.name,
							" Ø",
							tr.diameter,
							" mm @ y=+",
							tr.elevation.toFixed(2),
							" m"
						]
					})
				] }, tr.id);
			}),
			traffic ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
					x: sx(-2.6),
					y: sy(rb + H + .05 + 1.4),
					width: sx(2.1) - sx(0),
					height: sy(0) - sy(1.4),
					fill: "#c45c2a",
					rx: "3"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
					x: sx(-2.4),
					y: sy(rb + H + .05 + 2.1),
					width: sx(1.2) - sx(0),
					height: sy(0) - sy(.7),
					fill: "#d9e6f2"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
					x: sx(.7),
					y: sy(rb + H + .05 + 1.15),
					width: sx(1.6) - sx(0),
					height: sy(0) - sy(1.15),
					fill: "#2f5f8a",
					rx: "3"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
					x: sx(.85),
					y: sy(rb + H + .05 + 1.75),
					width: sx(1.1) - sx(0),
					height: sy(0) - sy(.55),
					fill: "#d9e6f2"
				})
			] }) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
				x1: sx(xMin + .2),
				y1: sy(rb),
				x2: sx(xMax - .2),
				y2: sy(rb),
				stroke: "#5c564e",
				strokeWidth: "1.2"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dim$1, {
				x1: sx(leftFace),
				x2: sx(xR),
				y: sy(rb + H + capH + 1.55),
				label: `${B.toFixed(2)} m OUT-TO-OUT`
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dim$1, {
				x1: sx(leftFace + t),
				x2: sx(rightFace),
				y: sy(rb + H + capH + .85),
				label: `${road.toFixed(2)} m ROADWAY`
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VDim, {
				x: sx(leftFace) - 36,
				y1: sy(rb + H),
				y2: sy(rb),
				label: `${H.toFixed(2)} m H`
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(VDim, {
				x: sx(leftFace) - 36,
				y1: sy(rb),
				y2: sy(rb - D),
				label: `${D.toFixed(2)} m D`
			}),
			water.up > rb ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("text", {
				x: sx((xMin + leftFace) / 2),
				y: sy(water.up) - 8,
				textAnchor: "middle",
				fill: "#163a5f",
				fontSize: "11",
				fontFamily: "IBM Plex Sans Condensed",
				children: [
					"UP HWL = +",
					water.up.toFixed(2),
					" m"
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: sx((xMin + leftFace) / 2),
				y: sy(rb) - 10,
				textAnchor: "middle",
				fill: "#9b2f28",
				fontSize: "10",
				fontFamily: "IBM Plex Sans",
				children: "Dry season · no inundation"
			}),
			water.down > rb ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("text", {
				x: sx((xR + xMax) / 2),
				y: sy(water.down) - 8,
				textAnchor: "middle",
				fill: "#163a5f",
				fontSize: "11",
				fontFamily: "IBM Plex Sans Condensed",
				children: [
					"DOWN = +",
					water.down.toFixed(2),
					" m"
				]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("text", {
				x: sx(0),
				y: sy((rb + H) / 2),
				textAnchor: "middle",
				fill: "#5c564e",
				fontSize: "12",
				fontFamily: "IBM Plex Sans Condensed",
				children: [
					"Compacted granular fill · ",
					project.coreFill.compaction,
					"% MDD"
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: sx(0),
				y: 506,
				textAnchor: "middle",
				fill: "#5c564e",
				fontSize: "11",
				fontFamily: "IBM Plex Sans",
				children: isCbp ? `CBP D=${cbp.diameter.toFixed(2)} m @ ${cbp.spacing.toFixed(2)} m | ${cbp.lateralModel.replace("-", " ")}` : `Riverbed / original ground y = ${rb.toFixed(2)} m | precast RC T&G ${project.sheetPile.sectionName}`
			})
		]
	});
}
function Dim$1({ x1, x2, y, label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
			x1,
			y1: y,
			x2,
			y2: y,
			stroke: "#1c1917",
			strokeWidth: "1"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
			x1,
			y1: y - 5,
			x2: x1,
			y2: y + 5,
			stroke: "#1c1917",
			strokeWidth: "1"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
			x1: x2,
			y1: y - 5,
			x2,
			y2: y + 5,
			stroke: "#1c1917",
			strokeWidth: "1"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
			x: (x1 + x2) / 2 - 70,
			y: y - 14,
			width: "140",
			height: "16",
			fill: "#f7f4ec"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
			x: (x1 + x2) / 2,
			y: y - 2,
			textAnchor: "middle",
			fontSize: "11",
			fontFamily: "IBM Plex Sans Condensed",
			fill: "#1c1917",
			children: label
		})
	] });
}
function VDim({ x, y1, y2, label }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
			x1: x,
			y1,
			x2: x,
			y2,
			stroke: "#1c1917",
			strokeWidth: "1"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
			x1: x - 5,
			y1,
			x2: x + 5,
			y2: y1,
			stroke: "#1c1917",
			strokeWidth: "1"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
			x1: x - 5,
			y1: y2,
			x2: x + 5,
			y2,
			stroke: "#1c1917",
			strokeWidth: "1"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
			x: x - 8,
			y: (y1 + y2) / 2,
			textAnchor: "end",
			fontSize: "11",
			fontFamily: "IBM Plex Sans Condensed",
			fill: "#1c1917",
			children: label
		})
	] });
}
function cn(...inputs) {
	return twMerge(clsx(inputs));
}
function fmt(n, digits = 2) {
	if (n === null || n === void 0 || !Number.isFinite(n)) return "—";
	return n.toFixed(digits);
}
function uid(prefix = "id") {
	return `${prefix}-${Math.random().toString(36).slice(2, 9)}`;
}
function downloadText(filename, text, mime = "application/json") {
	const blob = new Blob([text], { type: mime });
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	a.click();
	URL.revokeObjectURL(url);
}
function FreeBody({ project, lc }) {
	const H = project.geometry.retainedHeight;
	const D = project.geometry.embedment;
	const W = 560;
	const Ht = 460;
	const top = H + .6;
	const bot = -D - .4;
	const sx = (x) => 280 + x * 28;
	const sy = (z) => 24 + (top - z) / (top - bot) * 412;
	const wallX = 0;
	const arrows = (n, z0, z1, dir, color) => {
		const items = [];
		for (let i = 0; i < n; i++) {
			const z = z0 - (i + .5) / n * (z0 - z1);
			const len = 18 + i * 7;
			const x1 = sx(wallX);
			const x2 = x1 + dir * len;
			items.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("g", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
				x1,
				y1: sy(z),
				x2,
				y2: sy(z),
				stroke: color,
				strokeWidth: "1.6",
				markerEnd: "url(#ah)"
			}) }, `${z}-${dir}-${color}`));
		}
		return items;
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: `0 0 ${W} ${Ht}`,
		className: "w-full h-auto bg-panel",
		role: "img",
		"aria-label": "Free body diagram",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("marker", {
				id: "ah",
				markerWidth: "8",
				markerHeight: "8",
				refX: "7",
				refY: "4",
				orient: "auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: "M0,0 L8,4 L0,8 Z",
					fill: "#1c1917"
				})
			}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				width: W,
				height: Ht,
				fill: "#f7f4ec"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: sx(wallX) - 10,
				y: sy(H),
				width: "20",
				height: sy(-D) - sy(H),
				fill: "#5f656c",
				stroke: "#1c1917"
			}),
			arrows(5, H, 0, -1, "#2f5f8a"),
			arrows(4, H, 0, 1, "#8a6a3a"),
			arrows(4, 0, -D, 1, "#1f6b45"),
			lc.left.ties.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
				x1: sx(wallX) + 10,
				y1: sy(t.elevation),
				x2: sx(wallX) + 70,
				y2: sy(t.elevation),
				stroke: "#9b2f28",
				strokeWidth: "2",
				markerEnd: "url(#ah)"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("text", {
				x: sx(wallX) + 76,
				y: sy(t.elevation) + 4,
				fontSize: "10",
				fill: "#9b2f28",
				fontFamily: "IBM Plex Sans",
				children: [
					t.name,
					" ",
					fmt(t.T_kN, 1),
					" kN"
				]
			})] }, t.id)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("text", {
				x: 40,
				y: sy(H / 2),
				fontSize: "11",
				fill: "#2f5f8a",
				fontFamily: "IBM Plex Sans Condensed",
				children: [
					"WATER ",
					fmt(lc.forces.PwL, 0),
					" kN/m"
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("text", {
				x: 410,
				y: sy(H / 2),
				fontSize: "11",
				fill: "#8a6a3a",
				fontFamily: "IBM Plex Sans Condensed",
				children: [
					"FILL ",
					fmt(lc.forces.PaL, 0),
					" kN/m"
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("text", {
				x: 390,
				y: sy(-D / 2),
				fontSize: "11",
				fill: "#1f6b45",
				fontFamily: "IBM Plex Sans Condensed",
				children: [
					"PASSIVE ",
					fmt(lc.forces.Pp, 0),
					" kN/m"
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("text", {
				x: sx(wallX),
				y: 450,
				textAnchor: "middle",
				fontSize: "11",
				fill: "#5c564e",
				fontFamily: "IBM Plex Sans",
				children: ["Upstream wall FBD · ", lc.name]
			})
		]
	});
}
function MVDiagram({ analysis, mode }) {
	const st = analysis.stations;
	if (!st.length) return null;
	const zTop = st[0].z;
	const zBot = st[st.length - 1].z;
	const pick = (s) => mode === "M" ? s.M : mode === "V" ? s.V : s.dmm;
	const vals = st.map(pick);
	const maxAbs = Math.max(10, ...vals.map((v) => Math.abs(v)));
	const W = 420;
	const H = 420;
	const mt = 16;
	const mid = 228;
	const sx = (v) => mid + v / maxAbs * 180;
	const sy = (z) => mt + (zTop - z) / (zTop - zBot) * 376;
	const d = st.map((s, i) => `${i === 0 ? "M" : "L"} ${sx(pick(s)).toFixed(1)} ${sy(s.z).toFixed(1)}`).join(" ");
	const title = mode === "M" ? "Bending M (kNm/m)" : mode === "V" ? "Shear V (kN/m)" : "Deflection δ (mm)";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: `0 0 ${W} ${H}`,
		className: "w-full h-auto bg-panel",
		role: "img",
		"aria-label": title,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				width: W,
				height: H,
				fill: "#f7f4ec"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
				x1: mid,
				y1: mt,
				x2: mid,
				y2: 392,
				stroke: "#1c1917"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: `${d} L ${mid} ${sy(zBot)} L ${mid} ${sy(zTop)} Z`,
				fill: "#1a4a7a",
				fillOpacity: "0.18",
				stroke: "#1a4a7a",
				strokeWidth: "1.8"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: W / 2,
				y: 412,
				textAnchor: "middle",
				fontSize: "11",
				fill: "#5c564e",
				fontFamily: "IBM Plex Sans",
				children: title
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: 12,
				y: 24,
				fontSize: "10",
				fill: "#5c564e",
				fontFamily: "IBM Plex Mono",
				children: zTop.toFixed(1)
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: 12,
				y: 392,
				fontSize: "10",
				fill: "#5c564e",
				fontFamily: "IBM Plex Mono",
				children: zBot.toFixed(1)
			})
		]
	});
}
function NMInteractionDiagram({ interaction, title }) {
	const { envelope, operating, utilization } = interaction;
	if (!envelope.length) return null;
	const maxM = Math.max(10, ...envelope.map((p) => p.M), Math.abs(operating.MEd));
	const Ns = envelope.map((p) => p.N);
	const maxN = Math.max(...Ns, operating.NEd, 0);
	const minN = Math.min(...Ns, operating.NEd, 0);
	const W = 420;
	const H = 420;
	const ml = 56;
	const mt = 16;
	const midX = 230;
	const sx = (m) => midX + m / maxM * 174;
	const sy = (n) => mt + (maxN - n) / Math.max(maxN - minN, 1e-6) * 372;
	const path = `${envelope.map((p, i) => `${i === 0 ? "M" : "L"} ${sx(p.M).toFixed(1)} ${sy(p.N).toFixed(1)}`).join(" ")} ${[...envelope].reverse().map((p) => `L ${sx(-p.M).toFixed(1)} ${sy(p.N).toFixed(1)}`).join(" ")} Z`;
	const opX = sx(operating.MEd);
	const opY = sy(operating.NEd);
	const color = utilization > 1 ? "#9b2f28" : utilization >= .9 ? "#8a6414" : "#1f6b45";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: `0 0 ${W} ${H}`,
		className: "w-full h-auto bg-panel",
		role: "img",
		"aria-label": title,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				width: W,
				height: H,
				fill: "#f7f4ec"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
				x1: ml,
				y1: sy(0),
				x2: 404,
				y2: sy(0),
				stroke: "#c9c0b0"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
				x1: midX,
				y1: mt,
				x2: midX,
				y2: 388,
				stroke: "#c9c0b0"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: path,
				fill: "#1a4a7a",
				fillOpacity: "0.12",
				stroke: "#1a4a7a",
				strokeWidth: "1.8"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
				x1: midX,
				y1: sy(0),
				x2: opX,
				y2: opY,
				stroke: color,
				strokeWidth: "1.2",
				strokeDasharray: "4 3"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: opX,
				cy: opY,
				r: "4.5",
				fill: color,
				stroke: "#1c1917",
				strokeWidth: "0.75"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("text", {
				x: W / 2,
				y: 412,
				textAnchor: "middle",
				fontSize: "11",
				fill: "#5c564e",
				fontFamily: "IBM Plex Sans",
				children: [
					title,
					" · η = ",
					fmt(utilization, 2)
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("text", {
				x: 6,
				y: 24,
				fontSize: "10",
				fill: "#5c564e",
				fontFamily: "IBM Plex Mono",
				children: ["N=", fmt(maxN, 0)]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("text", {
				x: 6,
				y: 388,
				fontSize: "10",
				fill: "#5c564e",
				fontFamily: "IBM Plex Mono",
				children: ["N=", fmt(minN, 0)]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: midX,
				y: 12,
				textAnchor: "middle",
				fontSize: "9",
				fill: "#5c564e",
				fontFamily: "IBM Plex Mono",
				children: "M (kNm)"
			})
		]
	});
}
function PressureDiagram({ stations, side = "L" }) {
	if (!stations.length) return null;
	const zTop = stations[0].z;
	const zBot = stations[stations.length - 1].z;
	const values = stations.flatMap((s) => [
		s.pSoilCore,
		s.pPassive,
		side === "L" ? s.uUp : s.uDown,
		Math.abs(side === "L" ? s.pNetL : s.pNetR),
		s.pSur
	]);
	const pMax = Math.max(20, ...values, 1);
	const W = 640;
	const H = 480;
	const ml = 54;
	const mt = 18;
	const sx = (p) => ml + p / pMax * 570;
	const sy = (z) => mt + (zTop - z) / (zTop - zBot) * 426;
	const path = (pick) => {
		const pts = stations.map((s) => `${sx(Math.max(pick(s), 0)).toFixed(1)},${sy(s.z).toFixed(1)}`);
		return `M ${sx(0)} ${sy(zTop)} L ${pts.join(" L ")} L ${sx(0)} ${sy(zBot)}`;
	};
	const net = (s) => side === "L" ? s.pNetL : s.pNetR;
	const water = (s) => side === "L" ? s.uUp : s.uDown;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: `0 0 ${W} ${H}`,
		className: "w-full h-auto bg-panel",
		role: "img",
		"aria-label": "Lateral pressure diagram",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				width: W,
				height: H,
				fill: "#f7f4ec"
			}),
			[
				0,
				.25,
				.5,
				.75,
				1
			].map((t) => {
				const p = t * pMax;
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
					x1: sx(p),
					y1: mt,
					x2: sx(p),
					y2: 444,
					stroke: "#e0d8c8"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
					x: sx(p),
					y: 468,
					textAnchor: "middle",
					fontSize: "10",
					fill: "#5c564e",
					fontFamily: "IBM Plex Mono",
					children: p.toFixed(0)
				})] }, t);
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: W / 2,
				y: 478,
				textAnchor: "middle",
				fontSize: "10",
				fill: "#5c564e",
				fontFamily: "IBM Plex Sans",
				children: "Pressure (kPa)"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("text", {
				x: 12,
				y: 26,
				fontSize: "10",
				fill: "#5c564e",
				fontFamily: "IBM Plex Mono",
				children: [zTop.toFixed(1), " m"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("text", {
				x: 12,
				y: 444,
				fontSize: "10",
				fill: "#5c564e",
				fontFamily: "IBM Plex Mono",
				children: [zBot.toFixed(1), " m"]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: path((s) => s.pSoilCore),
				fill: "#c4a574",
				fillOpacity: "0.28",
				stroke: "#8a6a3a",
				strokeWidth: "1.5"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: path(water),
				fill: "#6a93b5",
				fillOpacity: "0.28",
				stroke: "#2f5f8a",
				strokeWidth: "1.5"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: path((s) => s.pSur),
				fill: "none",
				stroke: "#8a6414",
				strokeWidth: "1.4",
				strokeDasharray: "4 3"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: path((s) => s.pPassive),
				fill: "none",
				stroke: "#1f6b45",
				strokeWidth: "1.4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: stations.map((s, i) => `${i === 0 ? "M" : "L"} ${sx(net(s)).toFixed(1)} ${sy(s.z).toFixed(1)}`).join(" "),
				fill: "none",
				stroke: "#9b2f28",
				strokeWidth: "2.2"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
				x1: sx(0),
				y1: mt,
				x2: sx(0),
				y2: 444,
				stroke: "#1c1917",
				strokeWidth: "1.2"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Legend, {
				x: 470,
				y: 24
			})
		]
	});
}
function Legend({ x, y }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("g", { children: [
		{
			c: "#8a6a3a",
			t: "Active fill (soil)"
		},
		{
			c: "#2f5f8a",
			t: "Water"
		},
		{
			c: "#8a6414",
			t: "Surcharge"
		},
		{
			c: "#1f6b45",
			t: "Passive (embedment)"
		},
		{
			c: "#9b2f28",
			t: "Net on wall"
		}
	].map((it, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
		transform: `translate(${x}, ${y + i * 16})`,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
			width: "14",
			height: "3",
			y: "4",
			fill: it.c
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
			x: "20",
			y: "9",
			fontSize: "10",
			fill: "#1c1917",
			fontFamily: "IBM Plex Sans",
			children: it.t
		})]
	}, it.t)) });
}
function Button({ variant = "primary", className, ...props }) {
	const v = {
		primary: "bg-navy text-paper hover:bg-navy-mid",
		ghost: "bg-transparent text-navy hover:bg-paper-2",
		outline: "bg-panel text-ink border border-rule hover:border-rule-strong",
		danger: "bg-fail text-paper hover:opacity-90"
	}[variant];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
		className: cn("inline-flex items-center justify-center gap-1.5 rounded-sm px-3 py-2 text-sm font-medium transition-colors duration-150 disabled:opacity-50 min-h-10", v, className),
		...props
	});
}
function Field$1({ label, unit, hint, source, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "flex flex-col gap-1 min-w-0",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
				className: "flex items-baseline justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-sm font-medium text-navy",
					children: label
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "flex items-center gap-1.5 shrink-0",
					children: [unit ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-mono text-xs text-muted",
						children: unit
					}) : null, source ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-[10px] uppercase tracking-wide text-muted",
						children: source
					}) : null]
				})]
			}),
			children,
			hint ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-xs text-muted",
				children: hint
			}) : null
		]
	});
}
function NumInput({ value, onChange, step = .1, min, max, className, ...rest }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		type: "number",
		step,
		min,
		max,
		value: Number.isFinite(value) ? value : 0,
		onChange: (e) => onChange(parseFloat(e.target.value)),
		className: cn("w-full min-h-10 rounded-sm border border-rule bg-panel px-2.5 font-mono text-sm tabular-nums text-ink", "focus:border-accent", className),
		...rest
	});
}
function TextInput({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
		className: cn("w-full min-h-10 rounded-sm border border-rule bg-panel px-2.5 text-sm text-ink focus:border-accent", className),
		...props
	});
}
function Select({ className, children, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
		className: cn("w-full min-h-10 rounded-sm border border-rule bg-panel px-2.5 text-sm text-ink focus:border-accent", className),
		...props,
		children
	});
}
function StatusPill({ status }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("inline-flex items-center rounded-sm px-2 py-0.5 text-[11px] font-semibold tracking-wide", status === "PASS" ? "status-pass" : status === "FAIL" ? "status-fail" : status === "WARNING" || status === "INPUT REQUIRED" ? "status-warning" : "status-info"),
		children: status
	});
}
function Card({ title, action, children, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: cn("calc-sheet rounded-md p-4", className),
		children: [title ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "mb-3 flex items-center justify-between gap-2 border-b border-rule pb-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "font-display text-sm font-semibold uppercase tracking-wider text-navy",
				children: title
			}), action]
		}) : null, children]
	});
}
function UtilBar({ eta, label }) {
	const pct = Math.max(0, Math.min(eta, 1.6)) * 100 / 1.6;
	const mark = 62.5;
	const tone = eta > 1 ? "bg-fail" : eta >= .9 ? "bg-warn" : "bg-pass";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-1",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex justify-between gap-2 text-xs",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "text-navy font-medium",
				children: label
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "font-mono tabular-nums",
				children: Number.isFinite(eta) ? eta.toFixed(2) : "—"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "relative h-3 rounded-sm bg-paper-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: cn("absolute inset-y-0 left-0 rounded-sm", tone),
				style: { width: `${pct.toFixed(2)}%` }
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "absolute inset-y-0 w-px bg-ink",
				style: { left: `${mark}%` },
				title: "100%"
			})]
		})]
	});
}
function today() {
	return (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
}
function layer(p) {
	return {
		description: p.description ?? p.name,
		gamma: 18,
		gammaSat: 20,
		phi: 30,
		c: 0,
		cu: 0,
		E: 2e4,
		nu: .3,
		kPerm: 1e-5,
		OCR: 1,
		sptN: 10,
		drainage: "drained",
		soilType: "alluvium",
		...p
	};
}
function tie(p) {
	return {
		diameter: 40,
		spacing: 1.5,
		fy: 500,
		fu: 560,
		corrosion: 1,
		threadEff: .9,
		connectionEff: .9,
		inclination: 0,
		enabled: true,
		...p
	};
}
var defaultLoadCases = [
	{
		id: "LC-01",
		name: "Dry season / no water",
		situation: "permanent",
		waterMode: "dry",
		trafficOn: false,
		constructionOn: false,
		accidentalTieFail: false,
		oneSidedExcavation: false,
		enabled: true
	},
	{
		id: "LC-02",
		name: "Rain season / upstream flood",
		situation: "flood",
		waterMode: "flood-up",
		trafficOn: false,
		constructionOn: false,
		accidentalTieFail: false,
		oneSidedExcavation: false,
		enabled: true
	},
	{
		id: "LC-03",
		name: "Rain season / downstream flood",
		situation: "flood",
		waterMode: "flood-down",
		trafficOn: false,
		constructionOn: false,
		accidentalTieFail: false,
		oneSidedExcavation: false,
		enabled: true
	},
	{
		id: "LC-04",
		name: "Maximum differential water",
		situation: "flood",
		waterMode: "max-diff",
		trafficOn: false,
		constructionOn: false,
		accidentalTieFail: false,
		oneSidedExcavation: false,
		enabled: true
	},
	{
		id: "LC-05",
		name: "Heavy traffic + flood",
		situation: "flood",
		waterMode: "flood",
		trafficOn: true,
		constructionOn: false,
		accidentalTieFail: false,
		oneSidedExcavation: false,
		enabled: true
	},
	{
		id: "LC-06",
		name: "Heavy traffic + dry season",
		situation: "permanent",
		waterMode: "dry",
		trafficOn: true,
		constructionOn: false,
		accidentalTieFail: false,
		oneSidedExcavation: false,
		enabled: true
	},
	{
		id: "LC-07",
		name: "Construction stage",
		situation: "construction",
		waterMode: "dry",
		trafficOn: false,
		constructionOn: true,
		accidentalTieFail: false,
		oneSidedExcavation: false,
		enabled: true
	},
	{
		id: "LC-08",
		name: "One-sided excavation / temporary",
		situation: "temporary",
		waterMode: "dry",
		trafficOn: false,
		constructionOn: false,
		accidentalTieFail: false,
		oneSidedExcavation: true,
		enabled: true
	},
	{
		id: "LC-09",
		name: "Rapid drawdown",
		situation: "extreme",
		waterMode: "rapid-drawdown",
		trafficOn: false,
		constructionOn: false,
		accidentalTieFail: false,
		oneSidedExcavation: false,
		enabled: true
	},
	{
		id: "LC-10",
		name: "Tie-rod failure / accidental",
		situation: "accidental",
		waterMode: "flood",
		trafficOn: true,
		constructionOn: false,
		accidentalTieFail: true,
		oneSidedExcavation: false,
		enabled: true
	}
];
var defaultStages = [
	{
		id: "ST-01",
		name: "Existing ground",
		description: "Baseline undeveloped riverbed. Informational only.",
		tiesInstalled: 0,
		fillPlaced: false,
		cappingPlaced: false,
		roadPlaced: false,
		trafficOn: false,
		waterMode: "dry",
		enabled: true
	},
	{
		id: "ST-02",
		name: "Sheet pile installation",
		description: "Driving / press-in and lifting of precast units. Handling governs.",
		tiesInstalled: 0,
		fillPlaced: false,
		cappingPlaced: false,
		roadPlaced: false,
		trafficOn: false,
		waterMode: "dry",
		enabled: true
	},
	{
		id: "ST-03",
		name: "Excavation / river preparation",
		description: "Temporary unsupported or partially supported excavation.",
		tiesInstalled: 0,
		fillPlaced: false,
		cappingPlaced: false,
		roadPlaced: false,
		trafficOn: false,
		waterMode: "dry",
		enabled: true
	},
	{
		id: "ST-04",
		name: "Granular fill placement",
		description: "Core fill placed in layers up to the first tie. Outward pressure before the second tie is locked off.",
		tiesInstalled: 1,
		fillPlaced: true,
		cappingPlaced: false,
		roadPlaced: false,
		trafficOn: false,
		waterMode: "dry",
		enabled: true
	},
	{
		id: "ST-05",
		name: "Tie installation",
		description: "First and second tie levels installed and locked off.",
		tiesInstalled: 2,
		fillPlaced: true,
		cappingPlaced: false,
		roadPlaced: false,
		trafficOn: false,
		waterMode: "dry",
		enabled: true
	},
	{
		id: "ST-06",
		name: "Capping beam",
		description: "Cast-in-place capping beam tying the wall heads.",
		tiesInstalled: 2,
		fillPlaced: true,
		cappingPlaced: true,
		roadPlaced: false,
		trafficOn: false,
		waterMode: "dry",
		enabled: true
	},
	{
		id: "ST-07",
		name: "Road construction",
		description: "Pavement self-weight applied; no live traffic yet.",
		tiesInstalled: 2,
		fillPlaced: true,
		cappingPlaced: true,
		roadPlaced: true,
		trafficOn: false,
		waterMode: "dry",
		enabled: true
	},
	{
		id: "ST-08",
		name: "Construction traffic",
		description: "Heavy plant on the platform during construction.",
		tiesInstalled: 2,
		fillPlaced: true,
		cappingPlaced: true,
		roadPlaced: true,
		trafficOn: true,
		waterMode: "dry",
		enabled: true
	},
	{
		id: "ST-09",
		name: "Flood season",
		description: "Permanent geometry with wet-season water levels.",
		tiesInstalled: 2,
		fillPlaced: true,
		cappingPlaced: true,
		roadPlaced: true,
		trafficOn: false,
		waterMode: "flood",
		enabled: true
	},
	{
		id: "ST-10",
		name: "Permanent operation",
		description: "In-service condition with traffic and dry or wet season as selected.",
		tiesInstalled: 2,
		fillPlaced: true,
		cappingPlaced: true,
		roadPlaced: true,
		trafficOn: true,
		waterMode: "flood",
		enabled: true
	}
];
function defaultProject() {
	return {
		meta: {
			projectName: "Precast RC U-Shape Sheet Pile Flood Protection & Construction Access Road",
			structure: "Double precast RC sheet pile U-embankment with granular core, dual tie rods and RC capping beams",
			option: "Option 3 — Direct Precast RC Sheet Pile & Capping Beam Embankment Dam",
			revision: "A",
			preparedBy: "",
			checkedBy: "",
			date: today(),
			status: "PRELIMINARY DESIGN",
			notes: "Default geometry taken from the Option 3 dry-season and rain-season concept cross-sections."
		},
		designType: "u-shape-flood",
		wallSystem: "sheet-pile",
		codes: {
			nationalAnnex: "None provided — recommended Eurocode values used provisionally",
			edition: "EN 1990:2002+A1, EN 1991-1-1:2002, EN 1991-2:2003, EN 1992-1-1:2004, EN 1997-1:2004 (first generation)",
			designApproach: "DA2",
			designLife: 50,
			consequenceClass: "CC2",
			reliabilityClass: "RC2",
			executionClass: "EXC2",
			seismic: false,
			includeEn1998: false
		},
		geometry: {
			retainedHeight: 6,
			embedment: 6,
			roadWidth: 8,
			totalWidth: 8.7,
			wallThickness: .35,
			riverbed: 0,
			wallSpacing: 8,
			autoEmbedment: false,
			dMin: 3,
			dMax: 10,
			dStep: .25
		},
		capping: {
			enabled: true,
			b: .6,
			h: .6,
			cover: 40,
			fck: 32,
			asTop: 1508,
			asBot: 1508
		},
		pavement: {
			asphalt: .2,
			gammaAsphalt: 23,
			subbase: .3,
			gammaSubbase: 21
		},
		sheetPile: {
			fcu: 40,
			fck: 32,
			fyk: 500,
			cover: 40,
			deltaCdev: 10,
			asMainEachFace: 2094,
			asDist: 565,
			barDia: 20,
			barSpacing: 150,
			Ioverride: null,
			Aoverride: null,
			sectionName: "350 mm T&G precast RC sheet pile",
			EcmOverride: null,
			IeffFactor: .5,
			nh: 8e3,
			khUser: null
		},
		cbp: {
			diameter: .8,
			spacing: .95,
			pileLength: 12,
			fck: 35,
			fyk: 500,
			cover: 75,
			barDiameter: 25,
			barCount: 12,
			stirrupDiameter: 12,
			clearGap: .15,
			waterCutoff: "none",
			lateralModel: "individual-pile",
			nh: 8e3,
			khUser: null
		},
		coreFill: {
			name: "Compacted granular fill (97% MDD)",
			gamma: 19,
			gammaSat: 21,
			phi: 34,
			c: 0,
			compaction: 97,
			permeability: 1e-4,
			drained: true
		},
		nativeLayers: [layer({
			id: "nat-1",
			name: "Native alluvial soil",
			description: "Upper alluvium at and below riverbed",
			zTop: 0,
			zBot: -3,
			gamma: 18,
			gammaSat: 20,
			phi: 30,
			c: 0,
			E: 15e3,
			sptN: 8,
			soilType: "alluvial sand/silt"
		}), layer({
			id: "nat-2",
			name: "Medium dense alluvium",
			description: "Lower native founding stratum",
			zTop: -3,
			zBot: -16,
			gamma: 19,
			gammaSat: 21,
			phi: 32,
			c: 0,
			E: 3e4,
			sptN: 18,
			soilType: "medium dense sand"
		})],
		water: {
			gammaW: 9.81,
			dryUp: 0,
			dryDown: 0,
			floodUp: 5.2,
			floodDown: 4.2,
			coreDry: 0,
			coreFlood: 0,
			gwlNative: 0
		},
		traffic: {
			model: "uniform",
			q: 20,
			axleLoad: 130,
			nAxles: 3,
			axleSpacing: 1.5,
			wheelSpacing: 2,
			footprintB: .4,
			footprintL: .4,
			DAF: 1.3,
			distWidth: 3,
			offsetFromWall: .5,
			plantLoad: 15,
			craneLoad: 0,
			stockpile: 0
		},
		ties: [tie({
			id: "tie-u",
			name: "Upper tie rod",
			elevation: 5.1
		}), tie({
			id: "tie-l",
			name: "Lower tie rod",
			elevation: 3.2
		})],
		earth: {
			method: "rankine",
			userKa: .3,
			userKp: 3,
			wallFriction: 0,
			backfillSlope: 0,
			passiveReduction: 1,
			assumeHorizontal: true,
			assumeDrained: true,
			assumeNoCohesion: true,
			assumeHydrostatic: true,
			assumeNoScour: true,
			assumePassiveMobilised: true,
			useK0IfRestrained: false
		},
		factors: {
			source: "recommended",
			gammaG: 1.35,
			gammaQ: 1.5,
			gammaGinf: 1,
			gammaPhi: 1.25,
			gammaC: 1.25,
			gammaCu: 1.4,
			gammaGamma: 1,
			gammaW: 1.35,
			gammaCconc: 1.5,
			gammaS: 1.15,
			alphaCc: 1,
			psi0: .7,
			psi1: .5,
			psi2: .3
		},
		limits: {
			etaPass: 1,
			etaWarn: .9,
			deflAbs: 50,
			deflSpanRatio: 300,
			wkLimit: .2,
			iAllow: .5,
			exposure: "XC4 / XF3 (flood structure — confirm)",
			crackForWaterRetaining: true
		},
		structuralModel: "winkler",
		loadCases: defaultLoadCases,
		stages: defaultStages,
		assumptions: {
			horizontalBackfill: true,
			drainedGranularFill: true,
			noCohesion: true,
			hydrostaticWater: true,
			noSeismic: true,
			uniformTraffic: true,
			passiveMobilised: true,
			noScour: true,
			coreNotRigidDiaphragm: true,
			recommendedNA: true
		}
	};
}
var SECTION_LIBRARY = [
	{
		name: "300 × 150 mm",
		t: .3,
		b: .15
	},
	{
		name: "350 × 200 mm",
		t: .35,
		b: .2
	},
	{
		name: "350 × 250 mm",
		t: .35,
		b: .25
	},
	{
		name: "350 × 300 mm",
		t: .35,
		b: .3
	},
	{
		name: "350 mm T&G (project default)",
		t: .35,
		b: 1
	},
	{
		name: "400 mm T&G",
		t: .4,
		b: 1
	},
	{
		name: "Custom",
		t: .35,
		b: 1
	}
];
var TIE_DIAMETERS = [
	20,
	25,
	32,
	36,
	40,
	45,
	50
];
var DESIGN_TYPE_LABEL = {
	"single-cantilever": "Single cantilever sheet pile",
	"single-anchored": "Single anchored sheet pile",
	"double-sheet": "Double sheet pile",
	"u-shape-core": "U-shape sheet pile + granular core",
	"u-shape-ties": "U-shape sheet pile + tie rods",
	"u-shape-flood": "U-shape flood embankment (ties + capping + core)",
	custom: "Custom configuration"
};
var DEG = Math.PI / 180;
function toRad(deg) {
	return deg * DEG;
}
function kaRankine(phiDeg) {
	const p = toRad(phiDeg);
	const t = Math.tan(Math.PI / 4 - p / 2);
	return t * t;
}
function kpRankine(phiDeg) {
	const p = toRad(phiDeg);
	const t = Math.tan(Math.PI / 4 + p / 2);
	return t * t;
}
function k0Jak(phiDeg) {
	return 1 - Math.sin(toRad(phiDeg));
}
/** Coulomb active coefficient. Angles in degrees. β wall, i backfill, δ wall friction. */
function kaCoulomb(phi, beta = 0, i = 0, delta = 0) {
	const p = toRad(phi);
	const b = toRad(beta);
	const ii = toRad(i);
	const d = toRad(delta);
	const num = Math.cos(p - b) ** 2;
	const inner = Math.sin(p + d) * Math.sin(p - ii) / (Math.cos(d + b) * Math.cos(b - ii));
	if (inner < 0) return kaRankine(phi);
	const den = Math.cos(b) ** 2 * Math.cos(d + b) * (1 + Math.sqrt(inner)) ** 2;
	if (den <= 1e-12) return kaRankine(phi);
	return num / den;
}
function kpCoulomb(phi, beta = 0, i = 0, delta = 0) {
	const p = toRad(phi);
	const b = toRad(beta);
	const ii = toRad(i);
	const d = toRad(delta);
	const num = Math.cos(p + b) ** 2;
	const inner = Math.sin(p + d) * Math.sin(p + ii) / (Math.cos(d - b) * Math.cos(b - ii));
	if (inner < 0) return kpRankine(phi);
	const den = Math.cos(b) ** 2 * Math.cos(d - b) * (1 - Math.sqrt(inner)) ** 2;
	if (den <= 1e-12) return kpRankine(phi);
	return num / den;
}
function trap(y, x) {
	let s = 0;
	for (let i = 1; i < x.length; i++) s += .5 * (y[i] + y[i - 1]) * (x[i] - x[i - 1]);
	return s;
}
function solveGauss(A, b) {
	const n = b.length;
	const M = new Array(n);
	for (let i = 0; i < n; i++) {
		const row = new Array(n + 1);
		const Ai = A[i];
		for (let j = 0; j < n; j++) row[j] = Ai[j] ?? 0;
		row[n] = b[i] ?? 0;
		M[i] = row;
	}
	for (let k = 0; k < n; k++) {
		let piv = k;
		let best = Math.abs(M[k][k]);
		for (let i = k + 1; i < n; i++) {
			const v = Math.abs(M[i][k]);
			if (v > best) {
				best = v;
				piv = i;
			}
		}
		if (best < 1e-18) continue;
		if (piv !== k) {
			const tmp = M[k];
			M[k] = M[piv];
			M[piv] = tmp;
		}
		const pk = M[k][k];
		for (let j = k; j <= n; j++) M[k][j] /= pk;
		for (let i = 0; i < n; i++) {
			if (i === k) continue;
			const f = M[i][k];
			if (f === 0) continue;
			for (let j = k; j <= n; j++) M[i][j] -= f * M[k][j];
		}
	}
	return M.map((row) => row[n]);
}
/**
* Hermitian beam FEM, 2 DOF/node (deflection m, rotation rad).
* z from head (index 0) to toe. p(z) in kN/m² = kPa, positive in +y.
* kSoil[i] Winkler modulus kN/m³ at node i (reaction -k*y).
* springs: concentrated kN/m per metre of wall at given z.
* EI in kN·m².
*/
function beamFem(opts) {
	const z = opts.z;
	const n = z.length;
	const ndof = 2 * n;
	const K = Array.from({ length: ndof }, () => Array(ndof).fill(0));
	const F = Array(ndof).fill(0);
	const add = (i, j, v) => {
		if (i < 0 || j < 0 || i >= ndof || j >= ndof) return;
		K[i][j] += v;
	};
	for (let e = 0; e < n - 1; e++) {
		const L = Math.abs(z[e + 1] - z[e]);
		if (L < 1e-9) continue;
		const a = opts.EI / L ** 3;
		const ke = [
			[
				12 * a,
				6 * a * L,
				-12 * a,
				6 * a * L
			],
			[
				6 * a * L,
				4 * a * L * L,
				-6 * a * L,
				2 * a * L * L
			],
			[
				-12 * a,
				-6 * a * L,
				12 * a,
				-6 * a * L
			],
			[
				6 * a * L,
				2 * a * L * L,
				-6 * a * L,
				4 * a * L * L
			]
		];
		const idx = [
			2 * e,
			2 * e + 1,
			2 * e + 2,
			2 * e + 3
		];
		for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) add(idx[i], idx[j], ke[i][j]);
		const p1 = opts.p[e] ?? 0;
		const p2 = opts.p[e + 1] ?? 0;
		const V1 = L / 20 * (7 * p1 + 3 * p2);
		const M1 = L * L / 60 * (3 * p1 + 2 * p2);
		const V2 = L / 20 * (3 * p1 + 7 * p2);
		const M2 = -(L * L / 60) * (2 * p1 + 3 * p2);
		F[2 * e] += V1;
		F[2 * e + 1] += M1;
		F[2 * e + 2] += V2;
		F[2 * e + 3] += M2;
		const kavg = .5 * ((opts.kSoil[e] ?? 0) + (opts.kSoil[e + 1] ?? 0));
		add(2 * e, 2 * e, kavg * L / 3);
		add(2 * e + 2, 2 * e + 2, kavg * L / 3);
		add(2 * e, 2 * e + 2, kavg * L / 6);
		add(2 * e + 2, 2 * e, kavg * L / 6);
	}
	for (const s of opts.springs) {
		let nearest = 0;
		let best = Infinity;
		for (let i = 0; i < n; i++) {
			const d = Math.abs(z[i] - s.z);
			if (d < best) {
				best = d;
				nearest = i;
			}
		}
		add(2 * nearest, 2 * nearest, s.k);
	}
	add(0, 0, 1e-4);
	add(ndof - 2, ndof - 2, 1e-4);
	const u = solveGauss(K, F);
	const y = Array(n).fill(0);
	const th = Array(n).fill(0);
	for (let i = 0; i < n; i++) {
		y[i] = u[2 * i] ?? 0;
		th[i] = u[2 * i + 1] ?? 0;
	}
	const M = Array(n).fill(0);
	const V = Array(n).fill(0);
	for (let e = 0; e < n - 1; e++) {
		const L = Math.abs(z[e + 1] - z[e]);
		if (L < 1e-9) continue;
		const EI = opts.EI;
		const y1 = y[e];
		const t1 = th[e];
		const y2 = y[e + 1];
		const t2 = th[e + 1];
		const Me1 = EI * (6 / L ** 2) * (y1 - y2) + EI * (4 / L) * t1 + EI * (2 / L) * t2;
		const Me2 = EI * (6 / L ** 2) * (y2 - y1) + EI * (2 / L) * t1 + EI * (4 / L) * t2;
		M[e] = e === 0 ? Me1 : .5 * (M[e] + Me1);
		M[e + 1] = Me2;
		const p1 = opts.p[e] ?? 0;
		const p2 = opts.p[e + 1] ?? 0;
		const Ve = (Me1 + Me2) / L + .5 * (p1 + p2) * L;
		V[e] = e === 0 ? Ve : .5 * (V[e] + Ve);
		V[e + 1] = Ve - .5 * (p1 + p2) * L;
	}
	return {
		z,
		y,
		th,
		V,
		M,
		p: opts.p
	};
}
function ecmFromFck(fck) {
	return 22 * ((fck + 8) / 10) ** .3 * 1e3;
}
function fctm(fck) {
	return .3 * fck ** (2 / 3);
}
function statusFromEta(eta, pass = 1, warn = .9) {
	if (!Number.isFinite(eta)) return "FAIL";
	if (eta > pass) return "FAIL";
	if (eta >= warn) return "WARNING";
	return "PASS";
}
function mkCheck(partial, limits) {
	const eta = partial.utilization;
	const status = partial.status ?? (!partial.applicable ? "N/A" : !Number.isFinite(eta) ? "NOT VERIFIED" : statusFromEta(eta, limits.etaPass, limits.etaWarn));
	return {
		...partial,
		status
	};
}
function circularGeometry(s) {
	const Dmm = s.diameter * 1e3;
	const R = Dmm / 2;
	const Ac_mm2 = Math.PI / 4 * Dmm * Dmm;
	const barArea = Math.PI / 4 * s.barDiameter * s.barDiameter;
	const As_mm2 = s.barCount * barArea;
	const Ig_m4 = Math.PI / 64 * s.diameter ** 4;
	const rBar = Math.max(R - s.cover - s.stirrupDiameter - s.barDiameter / 2, 1);
	const n = Math.max(Math.round(s.barCount), 0);
	return {
		Dmm,
		R,
		Ac_mm2,
		As_mm2,
		Ig_m4,
		rBar,
		barPositions: Array.from({ length: n }, (_, i) => {
			const angle = 2 * Math.PI * i / Math.max(n, 1);
			return {
				angle,
				ymm: rBar * Math.cos(angle),
				area: barArea
			};
		})
	};
}
function cbpSolidRatio(diameter, spacing) {
	return spacing > 0 ? diameter / spacing : 0;
}
/** EN 1992-1-1 §3.1.7 parabola-rectangle law, fck ≤ 50 MPa (εc2 = 0.002, εcu2 = 0.0035). */
function concreteStress(strain, fcd) {
	const ec2 = .002;
	const ecu2 = .0035;
	if (strain <= 0) return 0;
	if (strain >= ecu2) return fcd;
	if (strain <= ec2) return fcd * (1 - (1 - strain / ec2) ** 2);
	return fcd;
}
/** Moment capacity read off the envelope at a given axial force (vertical-line method). */
function capacityMAtN(envelope, NTarget) {
	return interpAtN(envelope, NTarget);
}
function interpAtN(envelope, NTarget) {
	for (let i = 1; i < envelope.length; i++) {
		const a = envelope[i - 1];
		const b = envelope[i];
		if (a.N <= NTarget && b.N >= NTarget || a.N >= NTarget && b.N <= NTarget) {
			const t = b.N === a.N ? 0 : (NTarget - a.N) / (b.N - a.N);
			return a.M + t * (b.M - a.M);
		}
	}
	return envelope[0]?.M ?? 0;
}
/**
* N-M interaction envelope for a circular RC pile section, by fibre discretisation
* (EN 1992-1-1 §3.1.7 stress-strain law), sweeping the neutral-axis depth `c` from the
* extreme compression fibre with the compression-fibre strain fixed at ε_cu2. Only the
* M ≥ 0 half is returned (N-M is symmetric about M=0 for a uniformly spaced bar cage) —
* callers should use |M_Ed| against this envelope.
*
* ASSUMPTION: concrete compression is integrated over the gross circular area without
* deducting the area occupied by the bars (standard simplification for a screening
* interaction diagram; the effect is small relative to typical CBP reinforcement ratios).
*/
function nmInteractionEnvelope(s, opts) {
	const geo = circularGeometry(s);
	const { R, Ac_mm2, As_mm2, barPositions } = geo;
	const fcd = s.alphaCc * s.fck / s.gammaCconc;
	const fyd = s.fyk / s.gammaS;
	const Es = 2e5;
	const ecu2 = .0035;
	const nSteps = opts?.nSteps ?? 150;
	const nStrips = 150;
	const dy = 2 * R / nStrips;
	function forcesAt(c) {
		let Fc = 0;
		let Mc = 0;
		for (let i = 0; i < nStrips; i++) {
			const yMid = R - i * dy - .5 * dy;
			const width = 2 * Math.sqrt(Math.max(R * R - yMid * yMid, 0));
			const dF = concreteStress(ecu2 * (yMid - (R - c)) / c, fcd) * width * dy;
			Fc += dF;
			Mc += dF * yMid;
		}
		let Fs = 0;
		let Ms = 0;
		for (const bar of barPositions) {
			const strain = ecu2 * (bar.ymm - (R - c)) / c;
			const dF = Math.max(-fyd, Math.min(fyd, Es * strain)) * bar.area;
			Fs += dF;
			Ms += dF * bar.ymm;
		}
		return {
			N: (Fc + Fs) / 1e3,
			M: (Mc + Ms) / 1e6
		};
	}
	const NRd0 = Ac_mm2 * fcd / 1e3 + As_mm2 * fyd / 1e3;
	const NtRd = As_mm2 * fyd / 1e3;
	const points = [];
	const cMin = .02 * geo.Dmm;
	const cMax = 30 * geo.Dmm;
	for (let i = 0; i <= nSteps; i++) {
		const t = i / nSteps;
		const { N, M } = forcesAt(cMin * (cMax / cMin) ** t);
		points.push({
			N: Math.min(Math.max(N, -NtRd), NRd0),
			M: Math.abs(M)
		});
	}
	points.sort((a, b) => a.N - b.N);
	const envelope = [
		{
			N: -NtRd,
			M: 0
		},
		...points,
		{
			N: NRd0,
			M: 0
		}
	];
	let balanced = envelope[0];
	for (const p of envelope) if (p.M > balanced.M) balanced = p;
	return {
		envelope,
		NRd0,
		MRd0: interpAtN(envelope, 0),
		balanced
	};
}
function raySegmentT(dx, dy, ax, ay, bx, by) {
	const ex = bx - ax;
	const ey = by - ay;
	const det = ex * dy - ey * dx;
	if (Math.abs(det) < 1e-12) return null;
	const t = (ex * ay - ey * ax) / det;
	const s = (dx * ay - dy * ax) / det;
	if (s < -1e-9 || s > 1 + 1e-9 || t < 0) return null;
	return t;
}
/**
* Radial-scaling utilization: the ratio of the origin-to-operating-point distance to the
* origin-to-envelope-boundary distance along the same ray through (M_Ed, N_Ed). Handles
* points outside the envelope (utilization > 1).
*/
function nmUtilization(envelope, NEd, MEd) {
	const dM = Math.abs(MEd);
	const dN = NEd;
	if (dM < 1e-9 && Math.abs(dN) < 1e-9) return 0;
	const upper = envelope;
	const lower = [...envelope].reverse().map((p) => ({
		N: p.N,
		M: -p.M
	}));
	const poly = [...upper, ...lower];
	let best = Infinity;
	for (let i = 0; i < poly.length; i++) {
		const A = poly[i];
		const B = poly[(i + 1) % poly.length];
		const t = raySegmentT(dM, dN, A.M, A.N, B.M, B.N);
		if (t !== null && t > 1e-9 && t < best) best = t;
	}
	if (!Number.isFinite(best) || best <= 0) return 99;
	return 1 / best;
}
/**
* EN 1992-1-1 §6.2.2 shear resistance without designed shear reinforcement, generalised
* with the axial-compression enhancement term (eq 6.2.a, k1 = 0.15).
* ASSUMPTION: circular section reduced to an effective rectangular chord, bw ≈ 0.9D,
* d ≈ 0.8D, pending a validated circular-section shear method — flag for engineering
* confirmation.
*/
function vrdCircular(D_mm, As_mm2, fck, gammaC, NEdCompression_kN, Ac_mm2) {
	const bw = .9 * D_mm;
	const d = .8 * D_mm;
	const k = Math.min(1 + Math.sqrt(200 / d), 2);
	const rho = Math.min(As_mm2 / 2 / (bw * d), .02);
	const Crd = .18 / gammaC;
	const fcd = fck / gammaC;
	const sigmaCp = Math.min(Math.max(NEdCompression_kN, 0) * 1e3 / Math.max(Ac_mm2, 1), .2 * fcd);
	const k1 = .15;
	const v = Crd * k * (100 * rho * fck) ** (1 / 3) + k1 * sigmaCp;
	const vmin = .035 * k ** 1.5 * Math.sqrt(fck) + k1 * sigmaCp;
	return Math.max(v, vmin) * bw * d / 1e3;
}
/**
* EN 1992-1-1 §9.8.5 pile-specific minimum longitudinal reinforcement (0.5% Ac for
* Ac ≤ 0.5 m², 0.25% Ac for Ac ≥ 1.0 m², linear interpolation between), cross-checked
* against the general column minimum of §9.5.2 (0.10 N_Ed/f_yd, not less than 0.002 Ac).
* Maximum per §9.5.2 (0.04 Ac outside laps).
*/
function minMaxLongitudinalRatio(NEd_kN, Ac_mm2, fyd) {
	const Ac_m2 = Ac_mm2 / 1e6;
	const asMinPile = (.005 + Math.min(Math.max((Ac_m2 - .5) / .5, 0), 1) * -.0025) * Ac_mm2;
	const asMinColumn = Math.max(.1 * Math.max(NEd_kN, 0) * 1e3 / Math.max(fyd, 1), .002 * Ac_mm2);
	return {
		asMin: Math.max(asMinPile, asMinColumn),
		asMax: .04 * Ac_mm2
	};
}
/** EN 1992-1-1 §9.5.3 general column transverse reinforcement provisions. */
function transverseCheck(barDiameter, stirrupDiameter, Dmm) {
	return {
		diaMin: Math.max(6, barDiameter / 4),
		spacingMax: Math.min(20 * barDiameter, Dmm, 400)
	};
}
/** Adapted from the sheet-pile crackWidth() pattern for a circular tension chord. */
function crackWidthCircular(s, MEd_kNm) {
	const geo = circularGeometry(s);
	const Dmm = geo.Dmm;
	const dEff = .8 * Dmm;
	const As = geo.As_mm2 / 2;
	const z = .9 * dEff;
	const sigmaS = Math.abs(MEd_kNm) * 1e6 / Math.max(As * z, 1);
	const Es = 2e5;
	const fct = fctm(s.fck);
	const hcEff = Math.min(2.5 * (Dmm - dEff), Dmm / 2);
	const AcEff = Math.max(hcEff, 20) * Dmm;
	const rhoP = As / Math.max(AcEff, 1);
	const kt = .4;
	const ae = Es / Math.max(ecmFromFck(s.fck), 1);
	let eps = (sigmaS - kt * (fct / Math.max(rhoP, 1e-6)) * (1 + ae * rhoP)) / Es;
	eps = Math.max(eps, .6 * sigmaS / Es);
	const wk = (3.4 * s.cover + .17 * s.barDiameter / Math.max(rhoP, 1e-6)) * eps;
	return Math.max(wk, 0);
}
/** EN 1992-1-1 §8.4 basic anchorage length. ASSUMPTION: good bond conditions, η1=η2=1. */
function anchorageLength(barDiameter, fck, fyk, gammaC, gammaS) {
	const fbd = 2.25 * (.7 * fctm(fck) / gammaC);
	const fyd = fyk / gammaS;
	return barDiameter / 4 * (fyd / fbd);
}
/** EN 1992-1-1 §8.7 lap length. ASSUMPTION: α1=α2=α3=α5=1 (straight bars, no transverse pressure/confinement credit). */
function lapLength(barDiameter, fck, fyk, gammaC, gammaS, pctLapped) {
	const lbrqd = anchorageLength(barDiameter, fck, fyk, gammaC, gammaS);
	const alpha6 = pctLapped <= 25 ? 1 : pctLapped <= 33 ? 1.15 : pctLapped <= 50 ? 1.4 : 1.5;
	const l0min = Math.max(.3 * alpha6 * lbrqd, 15 * barDiameter, 200);
	return Math.max(alpha6 * lbrqd, l0min);
}
var NAV_ITEMS = [
	{
		id: "project",
		n: "1",
		label: "Project"
	},
	{
		id: "design",
		n: "2",
		label: "Design type"
	},
	{
		id: "geometry",
		n: "3",
		label: "Geometry"
	},
	{
		id: "soil",
		n: "4",
		label: "Soil"
	},
	{
		id: "water",
		n: "5",
		label: "Groundwater"
	},
	{
		id: "flood",
		n: "6",
		label: "Flood"
	},
	{
		id: "traffic",
		n: "7",
		label: "Traffic"
	},
	{
		id: "sheet",
		n: "8",
		label: "Sheet pile"
	},
	{
		id: "ties",
		n: "9",
		label: "Tie rods"
	},
	{
		id: "capping",
		n: "10",
		label: "Capping beam"
	},
	{
		id: "materials",
		n: "11",
		label: "Materials"
	},
	{
		id: "loads",
		n: "12",
		label: "Load cases"
	},
	{
		id: "approach",
		n: "13",
		label: "Design approach"
	},
	{
		id: "limits",
		n: "14",
		label: "Limits"
	},
	{
		id: "stages",
		n: "15",
		label: "Construction stages"
	},
	{
		id: "results",
		n: "16",
		label: "Results"
	},
	{
		id: "parametric",
		n: "17",
		label: "Parametric study"
	},
	{
		id: "sensitivity",
		n: "18",
		label: "Sensitivity"
	},
	{
		id: "report",
		n: "19",
		label: "Report"
	}
];
var useProject = create()(persist((set) => ({
	project: defaultProject(),
	nav: "results",
	loadCaseId: "LC-05",
	highlight: null,
	isAuthenticated: false,
	userEmail: "str.design.test",
	activeModule: "modules",
	setNav: (nav) => set({ nav }),
	setLoadCase: (loadCaseId) => set({ loadCaseId }),
	setHighlight: (highlight) => set({ highlight }),
	setProject: (project) => set({ project }),
	setActiveModule: (activeModule) => set((s) => ({
		activeModule,
		project: activeModule === "cbp" ? {
			...s.project,
			wallSystem: "cbp",
			cbp: s.project.cbp ?? defaultProject().cbp
		} : activeModule === "sheet-pile" ? {
			...s.project,
			wallSystem: "sheet-pile"
		} : s.project
	})),
	patch: (fn) => set((s) => {
		const project = structuredClone(s.project);
		fn(project);
		return { project };
	}),
	reset: () => set({
		project: defaultProject(),
		loadCaseId: "LC-05"
	}),
	login: (email, pass) => {
		if (pass === "123!test") {
			set({
				isAuthenticated: true,
				userEmail: email || "str.design.test",
				activeModule: "modules"
			});
			return true;
		}
		return false;
	},
	logout: () => set({
		isAuthenticated: false,
		activeModule: "modules"
	})
}), {
	name: "eurocode-u-sheet-pile-v2",
	storage: createJSONStorage(() => typeof window === "undefined" ? {
		getItem: () => null,
		setItem: () => {},
		removeItem: () => {}
	} : localStorage),
	partialize: (s) => ({
		project: s.project,
		loadCaseId: s.loadCaseId,
		isAuthenticated: s.isAuthenticated,
		userEmail: s.userEmail,
		activeModule: s.activeModule
	}),
	skipHydration: true
}));
function ProjectPanel() {
	const p = useProject((s) => s.project);
	const patch = useProject((s) => s.patch);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		title: "Document information",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-3 sm:grid-cols-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
					label: "Retaining wall system",
					hint: "CBP is a conceptual configuration until its separate EC2/EC7 checks are implemented.",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: p.wallSystem ?? "sheet-pile",
						onChange: (e) => patch((q) => {
							q.wallSystem = e.target.value;
							q.cbp ??= defaultProject().cbp;
						}),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "sheet-pile",
							children: "Sheet pile wall"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "cbp",
							children: "Contiguous bored pile (CBP) wall"
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
					label: "Project name",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
						value: p.meta.projectName,
						onChange: (e) => patch((q) => q.meta.projectName = e.target.value)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
					label: "Option",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
						value: p.meta.option,
						onChange: (e) => patch((q) => q.meta.option = e.target.value)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
					label: "Prepared by",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
						value: p.meta.preparedBy,
						onChange: (e) => patch((q) => q.meta.preparedBy = e.target.value)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
					label: "Checked by",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
						value: p.meta.checkedBy,
						onChange: (e) => patch((q) => q.meta.checkedBy = e.target.value)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
					label: "Revision",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
						value: p.meta.revision,
						onChange: (e) => patch((q) => q.meta.revision = e.target.value)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
					label: "Date",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
						type: "date",
						value: p.meta.date,
						onChange: (e) => patch((q) => q.meta.date = e.target.value)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
					label: "Issue status",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
						value: p.meta.status,
						onChange: (e) => patch((q) => q.meta.status = e.target.value)
					})
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
			label: "Notes",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
				className: "mt-2 w-full min-h-24 rounded-sm border border-rule bg-panel px-2.5 py-2 text-sm",
				value: p.meta.notes,
				onChange: (e) => patch((q) => q.meta.notes = e.target.value)
			})
		})]
	});
}
function DesignPanel() {
	const p = useProject((s) => s.project);
	const patch = useProject((s) => s.patch);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
		title: "Design type and structural model",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-3 sm:grid-cols-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
					label: "System",
					hint: "Changing type shows/hides relevant checks. Formulas are not forced to be identical.",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
						value: p.designType,
						onChange: (e) => patch((q) => q.designType = e.target.value),
						children: Object.entries(DESIGN_TYPE_LABEL).map(([k, v]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: k,
							children: v
						}, k))
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
					label: "Structural model",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: p.structuralModel,
						onChange: (e) => patch((q) => q.structuralModel = e.target.value),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "cantilever",
								children: "Simplified equivalent cantilever"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "anchored-beam",
								children: "Anchored beam"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "multi-anchor",
								children: "Multi-anchor beam"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "winkler",
								children: "Beam on elastic foundation (default)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "user-mv",
								children: "User-defined M/V (not active)"
							})
						]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
					label: "Earth pressure method",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: p.earth.method,
						onChange: (e) => patch((q) => q.earth.method = e.target.value),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "rankine",
								children: "Rankine (preliminary default)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "coulomb",
								children: "Coulomb"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "user-ka",
								children: "User-defined Ka / Kp"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "at-rest",
								children: "At-rest K0"
							})
						]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
					label: "Restrained wall uses K0",
					hint: "Stiff ties may prevent Ka mobilisation.",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: p.earth.useK0IfRestrained ? "yes" : "no",
						onChange: (e) => patch((q) => q.earth.useK0IfRestrained = e.target.value === "yes"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "no",
							children: "No — use Ka"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "yes",
							children: "Yes — use K0 on core"
						})]
					})
				})
			]
		})
	});
}
function GeometryPanel() {
	const p = useProject((s) => s.project);
	const patch = useProject((s) => s.patch);
	const g = p.geometry;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
		title: "Geometry",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-3 sm:grid-cols-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
					label: "Retained height H",
					unit: "m",
					source: "USER INPUT",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumInput, {
						value: g.retainedHeight,
						onChange: (n) => patch((q) => q.geometry.retainedHeight = n)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
					label: "Embedment D",
					unit: "m",
					source: "USER INPUT",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumInput, {
						value: g.embedment,
						onChange: (n) => patch((q) => q.geometry.embedment = n)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
					label: "Total length L",
					unit: "m",
					source: "DERIVED",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumInput, {
						value: g.retainedHeight + g.embedment,
						onChange: () => {},
						disabled: true
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
					label: "Road width",
					unit: "m",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumInput, {
						value: g.roadWidth,
						onChange: (n) => patch((q) => q.geometry.roadWidth = n)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
					label: "Out-to-out width",
					unit: "m",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumInput, {
						value: g.totalWidth,
						onChange: (n) => patch((q) => q.geometry.totalWidth = n)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
					label: "Wall thickness t",
					unit: "m",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumInput, {
						step: .01,
						value: g.wallThickness,
						onChange: (n) => patch((q) => q.geometry.wallThickness = n)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
					label: "Riverbed elevation",
					unit: "m",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumInput, {
						value: g.riverbed,
						onChange: (n) => patch((q) => q.geometry.riverbed = n)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
					label: "D min (auto)",
					unit: "m",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumInput, {
						value: g.dMin,
						onChange: (n) => patch((q) => q.geometry.dMin = n)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
					label: "D max (auto)",
					unit: "m",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumInput, {
						value: g.dMax,
						onChange: (n) => patch((q) => q.geometry.dMax = n)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
					label: "D step",
					unit: "m",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumInput, {
						step: .05,
						value: g.dStep,
						onChange: (n) => patch((q) => q.geometry.dStep = n)
					})
				})
			]
		})
	});
}
function SoilPanel() {
	const p = useProject((s) => s.project);
	const patch = useProject((s) => s.patch);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			title: "Core granular fill (inside U)",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 sm:grid-cols-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
						label: "Description",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
							value: p.coreFill.name,
							onChange: (e) => patch((q) => q.coreFill.name = e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
						label: "γ bulk",
						unit: "kN/m³",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumInput, {
							value: p.coreFill.gamma,
							onChange: (n) => patch((q) => q.coreFill.gamma = n)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
						label: "γ sat",
						unit: "kN/m³",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumInput, {
							value: p.coreFill.gammaSat,
							onChange: (n) => patch((q) => q.coreFill.gammaSat = n)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
						label: "φ'",
						unit: "°",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumInput, {
							value: p.coreFill.phi,
							onChange: (n) => patch((q) => q.coreFill.phi = n)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
						label: "c'",
						unit: "kPa",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumInput, {
							value: p.coreFill.c,
							onChange: (n) => patch((q) => q.coreFill.c = n)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
						label: "Compaction",
						unit: "% MDD",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumInput, {
							value: p.coreFill.compaction,
							onChange: (n) => patch((q) => q.coreFill.compaction = n)
						})
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-xs text-muted",
				children: "Core self-weight is used as a stabilising action on the U-block. It is not treated as a rigid diaphragm."
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
			title: "Native soil layers",
			action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				variant: "outline",
				onClick: () => patch((q) => q.nativeLayers.push({
					id: uid("nat"),
					name: "New layer",
					description: "",
					zTop: q.nativeLayers.at(-1)?.zBot ?? 0,
					zBot: (q.nativeLayers.at(-1)?.zBot ?? 0) - 3,
					gamma: 18,
					gammaSat: 20,
					phi: 30,
					c: 0,
					cu: 0,
					E: 2e4,
					nu: .3,
					kPerm: 1e-5,
					OCR: 1,
					sptN: 10,
					drainage: "drained",
					soilType: "alluvium"
				})),
				children: "Add layer"
			}),
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-x-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "eng-table",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Name" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "num",
							children: "z top"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "num",
							children: "z bot"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "num",
							children: "γ"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "num",
							children: "γsat"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "num",
							children: "φ'"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "num",
							children: "c'"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "num",
							children: "E"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {})
					] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: p.nativeLayers.map((L, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
							value: L.name,
							onChange: (e) => patch((q) => q.nativeLayers[i].name = e.target.value)
						}) }),
						[
							"zTop",
							"zBot",
							"gamma",
							"gammaSat",
							"phi",
							"c",
							"E"
						].map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumInput, {
							step: k === "E" ? 1e3 : .1,
							value: L[k],
							onChange: (n) => patch((q) => {
								q.nativeLayers[i][k] = n;
							})
						}) }, k)),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							onClick: () => patch((q) => q.nativeLayers.splice(i, 1)),
							children: "Remove"
						}) })
					] }, L.id)) })]
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-xs text-muted",
				children: "Layer colours in the section are tied to this ordered ground model. Check that layer boundaries are continuous and cover the wall toe before relying on any pressure result."
			})]
		})]
	});
}
function WaterPanel() {
	const p = useProject((s) => s.project);
	const patch = useProject((s) => s.patch);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
		title: "Groundwater and unit weights",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-3 sm:grid-cols-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
					label: "γw",
					unit: "kN/m³",
					source: "CODE",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumInput, {
						step: .01,
						value: p.water.gammaW,
						onChange: (n) => patch((q) => q.water.gammaW = n)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
					label: "Native GWL",
					unit: "m",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumInput, {
						value: p.water.gwlNative,
						onChange: (n) => patch((q) => q.water.gwlNative = n)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
					label: "Core water (dry)",
					unit: "m",
					hint: "Well-drained granular core default 0.00 — ASSUMPTION",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumInput, {
						value: p.water.coreDry,
						onChange: (n) => patch((q) => q.water.coreDry = n)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
					label: "Core water (flood)",
					unit: "m",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumInput, {
						value: p.water.coreFlood,
						onChange: (n) => patch((q) => q.water.coreFlood = n)
					})
				})
			]
		})
	});
}
function FloodPanel() {
	const p = useProject((s) => s.project);
	const patch = useProject((s) => s.patch);
	const dh = p.water.floodUp - p.water.floodDown;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		title: "Flood and dry-season water levels",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-3 sm:grid-cols-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
					label: "Dry upstream",
					unit: "m",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumInput, {
						value: p.water.dryUp,
						onChange: (n) => patch((q) => q.water.dryUp = n)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
					label: "Dry downstream",
					unit: "m",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumInput, {
						value: p.water.dryDown,
						onChange: (n) => patch((q) => q.water.dryDown = n)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
					label: "Flood upstream HWL",
					unit: "m",
					source: "USER INPUT",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumInput, {
						value: p.water.floodUp,
						onChange: (n) => patch((q) => q.water.floodUp = n)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
					label: "Flood downstream HWL",
					unit: "m",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumInput, {
						value: p.water.floodDown,
						onChange: (n) => patch((q) => q.water.floodDown = n)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
					label: "Δh flood",
					unit: "m",
					source: "DERIVED",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumInput, {
						value: Number(dh.toFixed(2)),
						onChange: () => {},
						disabled: true
					})
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-3 text-sm text-muted",
			children: "Hydrostatic pressure is calculated independently on each side. Net water pressure Δp_w(z) = p_up(z) − p_down(z). Do not apply the full upstream head to both faces."
		})]
	});
}
function TrafficPanel() {
	const p = useProject((s) => s.project);
	const patch = useProject((s) => s.patch);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
		title: "Roadway and traffic",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-3 sm:grid-cols-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
					label: "Load model",
					hint: "Uniform q is an ASSUMPTION unless calibrated to a vehicle model.",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: p.traffic.model,
						onChange: (e) => patch((q) => q.traffic.model = e.target.value),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "uniform",
								children: "Uniform surcharge"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "vehicle",
								children: "Vehicle / axle"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "strip",
								children: "Equivalent strip"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "user",
								children: "User-defined"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "combined",
								children: "Combined"
							})
						]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
					label: "Uniform q",
					unit: "kPa",
					source: "ASSUMPTION",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumInput, {
						value: p.traffic.q,
						onChange: (n) => patch((q) => q.traffic.q = n)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
					label: "Axle load",
					unit: "kN",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumInput, {
						value: p.traffic.axleLoad,
						onChange: (n) => patch((q) => q.traffic.axleLoad = n)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
					label: "No. of axles",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumInput, {
						step: 1,
						value: p.traffic.nAxles,
						onChange: (n) => patch((q) => q.traffic.nAxles = n)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
					label: "Axle spacing",
					unit: "m",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumInput, {
						value: p.traffic.axleSpacing,
						onChange: (n) => patch((q) => q.traffic.axleSpacing = n)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
					label: "DAF",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumInput, {
						step: .05,
						value: p.traffic.DAF,
						onChange: (n) => patch((q) => q.traffic.DAF = n)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
					label: "Distribution width",
					unit: "m",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumInput, {
						value: p.traffic.distWidth,
						onChange: (n) => patch((q) => q.traffic.distWidth = n)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
					label: "Plant load",
					unit: "kPa",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumInput, {
						value: p.traffic.plantLoad,
						onChange: (n) => patch((q) => q.traffic.plantLoad = n)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
					label: "Asphalt thickness",
					unit: "m",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumInput, {
						step: .05,
						value: p.pavement.asphalt,
						onChange: (n) => patch((q) => q.pavement.asphalt = n)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
					label: "Subbase thickness",
					unit: "m",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumInput, {
						step: .05,
						value: p.pavement.subbase,
						onChange: (n) => patch((q) => q.pavement.subbase = n)
					})
				})
			]
		})
	});
}
function SheetPanel() {
	const p = useProject((s) => s.project);
	const patch = useProject((s) => s.patch);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
		title: "Precast RC sheet pile",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-3 sm:grid-cols-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
					label: "Section library",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
						value: p.sheetPile.sectionName,
						onChange: (e) => {
							const sec = SECTION_LIBRARY.find((s) => s.name === e.target.value);
							patch((q) => {
								q.sheetPile.sectionName = e.target.value;
								if (sec && e.target.value !== "Custom") q.geometry.wallThickness = sec.t;
							});
						},
						children: SECTION_LIBRARY.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: s.name }, s.name))
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
					label: "fcu",
					unit: "MPa",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumInput, {
						value: p.sheetPile.fcu,
						onChange: (n) => patch((q) => {
							q.sheetPile.fcu = n;
							q.sheetPile.fck = Math.round(.8 * n);
						})
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
					label: "fck",
					unit: "MPa",
					source: "DERIVED",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumInput, {
						value: p.sheetPile.fck,
						onChange: (n) => patch((q) => q.sheetPile.fck = n)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
					label: "fyk",
					unit: "MPa",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumInput, {
						value: p.sheetPile.fyk,
						onChange: (n) => patch((q) => q.sheetPile.fyk = n)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
					label: "c_min",
					unit: "mm",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumInput, {
						step: 5,
						value: p.sheetPile.cover,
						onChange: (n) => patch((q) => q.sheetPile.cover = n)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
					label: "Δc_dev",
					unit: "mm",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumInput, {
						step: 5,
						value: p.sheetPile.deltaCdev,
						onChange: (n) => patch((q) => q.sheetPile.deltaCdev = n)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
					label: "Bar diameter",
					unit: "mm",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumInput, {
						step: 1,
						value: p.sheetPile.barDia,
						onChange: (n) => patch((q) => q.sheetPile.barDia = n)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
					label: "Bar spacing",
					unit: "mm",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumInput, {
						step: 10,
						value: p.sheetPile.barSpacing,
						onChange: (n) => patch((q) => {
							q.sheetPile.barSpacing = n;
							const a = Math.PI * .25 * q.sheetPile.barDia ** 2;
							q.sheetPile.asMainEachFace = 1e3 / Math.max(n, 1) * a;
						})
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
					label: "As each face",
					unit: "mm²/m",
					source: "DERIVED",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumInput, {
						step: 10,
						value: p.sheetPile.asMainEachFace,
						onChange: (n) => patch((q) => q.sheetPile.asMainEachFace = n)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
					label: "I_eff / I_g",
					source: "ASSUMPTION",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumInput, {
						step: .05,
						value: p.sheetPile.IeffFactor,
						onChange: (n) => patch((q) => q.sheetPile.IeffFactor = n)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
					label: "n_h subgrade",
					unit: "kN/m³",
					source: "ASSUMPTION",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumInput, {
						step: 500,
						value: p.sheetPile.nh,
						onChange: (n) => patch((q) => q.sheetPile.nh = n)
					})
				})
			]
		})
	});
}
function CbpPanel() {
	const p = useProject((s) => s.project);
	const patch = useProject((s) => s.patch);
	const c = p.cbp ?? defaultProject().cbp;
	const solidRatio = cbpSolidRatio(c.diameter, c.spacing);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		title: "Contiguous bored pile (CBP) wall",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mb-3 text-sm text-muted",
			children: "Spaced piles are not assumed to be a continuous diaphragm or a water cut-off. Select the lateral-interaction model and water-control measure explicitly."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-3 sm:grid-cols-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
					label: "Pile diameter D",
					unit: "m",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumInput, {
						step: .05,
						value: c.diameter,
						onChange: (n) => patch((q) => q.cbp.diameter = n)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
					label: "Centre spacing s",
					unit: "m",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumInput, {
						step: .05,
						value: c.spacing,
						onChange: (n) => patch((q) => {
							q.cbp.spacing = n;
							q.cbp.clearGap = n - q.cbp.diameter;
						})
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
					label: "Pile length",
					unit: "m",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumInput, {
						step: .25,
						value: c.pileLength,
						onChange: (n) => patch((q) => q.cbp.pileLength = n)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
					label: "Clear gap",
					unit: "m",
					source: "DERIVED",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumInput, {
						value: c.clearGap,
						onChange: () => {},
						disabled: true
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
					label: "Projected solid ratio",
					source: "DERIVED",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumInput, {
						value: solidRatio,
						onChange: () => {},
						disabled: true
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
					label: "Lateral interaction model",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: c.lateralModel,
						onChange: (e) => patch((q) => q.cbp.lateralModel = e.target.value),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "individual-pile",
							children: "Individual pile behaviour"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: "equivalent-wall",
							children: "Equivalent wall (justify)"
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
					label: "Concrete fck",
					unit: "MPa",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumInput, {
						value: c.fck,
						onChange: (n) => patch((q) => q.cbp.fck = n)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
					label: "Steel fyk",
					unit: "MPa",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumInput, {
						value: c.fyk,
						onChange: (n) => patch((q) => q.cbp.fyk = n)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
					label: "Nominal cover",
					unit: "mm",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumInput, {
						step: 5,
						value: c.cover,
						onChange: (n) => patch((q) => q.cbp.cover = n)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
					label: "Longitudinal bars",
					unit: "number",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumInput, {
						step: 1,
						value: c.barCount,
						onChange: (n) => patch((q) => q.cbp.barCount = n)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
					label: "Bar diameter",
					unit: "mm",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumInput, {
						step: 1,
						value: c.barDiameter,
						onChange: (n) => patch((q) => q.cbp.barDiameter = n)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
					label: "Stirrup diameter",
					unit: "mm",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumInput, {
						step: 1,
						value: c.stirrupDiameter,
						onChange: (n) => patch((q) => q.cbp.stirrupDiameter = n)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
					label: "Water-control measure",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: c.waterCutoff,
						onChange: (e) => patch((q) => q.cbp.waterCutoff = e.target.value),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "none",
								children: "None — seepage assessment required"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "grout",
								children: "Inter-pile grouting"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "cutoff-wall",
								children: "Separate cut-off wall"
							})
						]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
					label: "n_h subgrade",
					unit: "kN/m³",
					source: "ASSUMPTION",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumInput, {
						step: 500,
						value: c.nh,
						onChange: (n) => patch((q) => q.cbp.nh = n)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
					label: "k_h override",
					unit: "kN/m³",
					hint: "Leave 0 to use n_h·z",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumInput, {
						step: 500,
						value: c.khUser ?? 0,
						onChange: (n) => patch((q) => q.cbp.khUser = n > 0 ? n : null)
					})
				})
			]
		})]
	});
}
function TiesPanel() {
	const p = useProject((s) => s.project);
	const patch = useProject((s) => s.patch);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
		title: "Tie rods",
		action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			variant: "outline",
			onClick: () => patch((q) => q.ties.push({
				id: uid("tie"),
				name: `Tie ${q.ties.length + 1}`,
				elevation: 2,
				diameter: 40,
				spacing: 1.5,
				fy: 500,
				fu: 560,
				corrosion: 1,
				threadEff: .9,
				connectionEff: .9,
				inclination: 0,
				enabled: true
			})),
			children: "Add tie level"
		}),
		children: p.ties.map((tr, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-4 grid gap-3 border-b border-rule pb-4 sm:grid-cols-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
					label: "Name",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
						value: tr.name,
						onChange: (e) => patch((q) => q.ties[i].name = e.target.value)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
					label: "Elevation y",
					unit: "m",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumInput, {
						value: tr.elevation,
						onChange: (n) => patch((q) => q.ties[i].elevation = n)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
					label: "Diameter",
					unit: "mm",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: String(tr.diameter),
						onChange: (e) => patch((q) => q.ties[i].diameter = parseFloat(e.target.value)),
						children: [TIE_DIAMETERS.map((d) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
							value: d,
							children: ["Ø", d]
						}, d)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
							value: tr.diameter,
							children: ["Custom ", tr.diameter]
						})]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
					label: "Spacing s",
					unit: "m",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumInput, {
						value: tr.spacing,
						onChange: (n) => patch((q) => q.ties[i].spacing = n)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
					label: "fy",
					unit: "MPa",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumInput, {
						value: tr.fy,
						onChange: (n) => patch((q) => q.ties[i].fy = n)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
					label: "Corrosion",
					unit: "mm",
					hint: "Radial allowance",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumInput, {
						step: .5,
						value: tr.corrosion,
						onChange: (n) => patch((q) => q.ties[i].corrosion = n)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
					label: "Thread efficiency",
					source: "ASSUMPTION",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumInput, {
						step: .05,
						value: tr.threadEff,
						onChange: (n) => patch((q) => q.ties[i].threadEff = n)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-end gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex min-h-10 items-center gap-2 text-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: tr.enabled,
							onChange: (e) => patch((q) => q.ties[i].enabled = e.target.checked)
						}), "Enabled"]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "ghost",
						onClick: () => patch((q) => q.ties.splice(i, 1)),
						children: "Remove"
					})]
				})
			]
		}, tr.id))
	});
}
function CappingPanel() {
	const p = useProject((s) => s.project);
	const patch = useProject((s) => s.patch);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		title: "RC capping beam",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
			className: "mb-3 flex items-center gap-2 text-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
				type: "checkbox",
				checked: p.capping.enabled,
				onChange: (e) => patch((q) => q.capping.enabled = e.target.checked)
			}), "Include capping beam"]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-3 sm:grid-cols-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
					label: "Width b",
					unit: "m",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumInput, {
						step: .05,
						value: p.capping.b,
						onChange: (n) => patch((q) => q.capping.b = n)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
					label: "Depth h",
					unit: "m",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumInput, {
						step: .05,
						value: p.capping.h,
						onChange: (n) => patch((q) => q.capping.h = n)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
					label: "Cover",
					unit: "mm",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumInput, {
						step: 5,
						value: p.capping.cover,
						onChange: (n) => patch((q) => q.capping.cover = n)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
					label: "fck",
					unit: "MPa",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumInput, {
						value: p.capping.fck,
						onChange: (n) => patch((q) => q.capping.fck = n)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
					label: "As bottom",
					unit: "mm²",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumInput, {
						step: 50,
						value: p.capping.asBot,
						onChange: (n) => patch((q) => q.capping.asBot = n)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
					label: "As top",
					unit: "mm²",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumInput, {
						step: 50,
						value: p.capping.asTop,
						onChange: (n) => patch((q) => q.capping.asTop = n)
					})
				})
			]
		})]
	});
}
function MaterialsPanel() {
	const p = useProject((s) => s.project);
	const patch = useProject((s) => s.patch);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
		title: "Partial factors and materials",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-3 sm:grid-cols-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
					label: "Factor source",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: p.factors.source,
						onChange: (e) => patch((q) => q.factors.source = e.target.value),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "recommended",
								children: "Recommended Eurocode"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "national-annex",
								children: "National Annex"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "user",
								children: "User-defined"
							})
						]
					})
				}),
				[
					"gammaG",
					"gammaQ",
					"gammaGinf",
					"gammaPhi",
					"gammaC",
					"gammaW",
					"gammaCconc",
					"gammaS",
					"alphaCc"
				].map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
					label: k,
					source: p.factors.source === "user" ? "USER INPUT" : "CODE PARAMETER",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumInput, {
						step: .05,
						value: p.factors[k],
						onChange: (n) => patch((q) => q.factors[k] = n)
					})
				}, k)),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
					label: "Passive reduction",
					source: "USER-DEFINED / PROJECT-SPECIFIC",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumInput, {
						step: .05,
						value: p.earth.passiveReduction,
						onChange: (n) => patch((q) => q.earth.passiveReduction = n)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
					label: "Wall friction δ",
					unit: "°",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumInput, {
						value: p.earth.wallFriction,
						onChange: (n) => patch((q) => q.earth.wallFriction = n)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
					label: "User Ka",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumInput, {
						step: .01,
						value: p.earth.userKa,
						onChange: (n) => patch((q) => q.earth.userKa = n)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
					label: "User Kp",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumInput, {
						step: .1,
						value: p.earth.userKp,
						onChange: (n) => patch((q) => q.earth.userKp = n)
					})
				})
			]
		})
	});
}
function LoadsPanel() {
	const p = useProject((s) => s.project);
	const patch = useProject((s) => s.patch);
	const setLc = useProject((s) => s.setLoadCase);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		title: "Design load cases",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mb-3 text-sm text-muted",
			children: "Load cases are physically consistent situations — maxima are not stacked into an impossible combination."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "overflow-x-auto",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
				className: "eng-table",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "ID" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Name" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Situation" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Water" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Traffic" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "On" })
				] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: p.loadCases.map((lc, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "cursor-pointer",
					onClick: () => setLc(lc.id),
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "font-mono",
							children: lc.id
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: lc.name }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: lc.situation }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: lc.waterMode }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: lc.trafficOn ? "yes" : "no" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: lc.enabled,
							onChange: (e) => patch((q) => q.loadCases[i].enabled = e.target.checked)
						}) })
					]
				}, lc.id)) })]
			})
		})]
	});
}
function ApproachPanel() {
	const p = useProject((s) => s.project);
	const patch = useProject((s) => s.patch);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		title: "Codes, National Annex, design approach",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-3 sm:grid-cols-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
					label: "National Annex",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
						value: p.codes.nationalAnnex,
						onChange: (e) => patch((q) => q.codes.nationalAnnex = e.target.value)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
					label: "Edition",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
						value: p.codes.edition,
						onChange: (e) => patch((q) => q.codes.edition = e.target.value)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
					label: "EN 1997 Design Approach",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: p.codes.designApproach,
						onChange: (e) => patch((q) => q.codes.designApproach = e.target.value),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "DA1",
								children: "DA1 (Combinations 1 and 2 — screening uses DA1-2 soil factors)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "DA2",
								children: "DA2 (recommended default)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "DA3",
								children: "DA3"
							})
						]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
					label: "Design working life",
					unit: "years",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumInput, {
						step: 5,
						value: p.codes.designLife,
						onChange: (n) => patch((q) => q.codes.designLife = n)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
					label: "Consequence class",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: p.codes.consequenceClass,
						onChange: (e) => patch((q) => q.codes.consequenceClass = e.target.value),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "CC1" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "CC2" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "CC3" })
						]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
					label: "Execution class",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: p.codes.executionClass,
						onChange: (e) => patch((q) => q.codes.executionClass = e.target.value),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "EXC1" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "EXC2" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", { children: "EXC3" })
						]
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex items-center gap-2 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "checkbox",
						checked: p.codes.seismic,
						onChange: (e) => patch((q) => q.codes.seismic = e.target.checked)
					}), "Include seismic (EN 1998) — not calculated unless enabled"]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-3 text-xs text-muted",
			children: "First-generation Eurocodes are used. Do not mix second-generation factors without changing the edition field. Clause numbers are not invented; confirm against the adopted NA."
		})]
	});
}
function LimitsPanel() {
	const p = useProject((s) => s.project);
	const patch = useProject((s) => s.patch);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		title: "Acceptance limits and durability",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-3 sm:grid-cols-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
					label: "η PASS limit",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumInput, {
						step: .05,
						value: p.limits.etaPass,
						onChange: (n) => patch((q) => q.limits.etaPass = n)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
					label: "η WARNING",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumInput, {
						step: .05,
						value: p.limits.etaWarn,
						onChange: (n) => patch((q) => q.limits.etaWarn = n)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
					label: "δ absolute",
					unit: "mm",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumInput, {
						value: p.limits.deflAbs,
						onChange: (n) => patch((q) => q.limits.deflAbs = n)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
					label: "δ span ratio H/n",
					unit: "n",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumInput, {
						value: p.limits.deflSpanRatio,
						onChange: (n) => patch((q) => q.limits.deflSpanRatio = n)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
					label: "wk limit",
					unit: "mm",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumInput, {
						step: .05,
						value: p.limits.wkLimit,
						onChange: (n) => patch((q) => q.limits.wkLimit = n)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
					label: "Allowable i",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumInput, {
						step: .05,
						value: p.limits.iAllow,
						onChange: (n) => patch((q) => q.limits.iAllow = n)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
					label: "Exposure",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
						value: p.limits.exposure,
						onChange: (e) => patch((q) => q.limits.exposure = e.target.value)
					})
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "mt-4 space-y-2 text-sm",
			children: [
				["horizontalBackfill", "Horizontal backfill"],
				["drainedGranularFill", "Drained granular fill"],
				["noCohesion", "No cohesion assumed"],
				["hydrostaticWater", "Hydrostatic water pressure"],
				["noSeismic", "No seismic loading"],
				["uniformTraffic", "Uniform traffic surcharge"],
				["passiveMobilised", "Passive resistance mobilised"],
				["noScour", "No scour considered"],
				["coreNotRigidDiaphragm", "Core is not a rigid diaphragm"]
			].map(([k, lab]) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "checkbox",
					checked: !!p.assumptions[k],
					onChange: (e) => patch((q) => q.assumptions[k] = e.target.checked)
				}), lab]
			}, k))
		})]
	});
}
function StagesPanel() {
	const p = useProject((s) => s.project);
	const patch = useProject((s) => s.patch);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		title: "Construction stages",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mb-3 text-sm text-muted",
			children: "Each stage is analysed with its own support and water condition. The critical stage may not be the completed structure."
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
			className: "eng-table",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Stage" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Ties" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Fill" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Road" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "On" })
			] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: p.stages.map((s, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "font-medium",
					children: s.name
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-xs text-muted",
					children: s.description
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
					className: "num",
					children: s.tiesInstalled
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: s.fillPlaced ? "yes" : "no" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: s.roadPlaced ? "yes" : "no" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "checkbox",
					checked: s.enabled,
					onChange: (e) => patch((q) => q.stages[i].enabled = e.target.checked)
				}) })
			] }, s.id)) })]
		})]
	});
}
function Equation({ latex, display = true, tag }) {
	const html = (0, import_react.useMemo)(() => {
		try {
			return katex.renderToString(latex, {
				displayMode: display,
				throwOnError: false,
				output: "html"
			});
		} catch {
			return latex;
		}
	}, [latex, display]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative my-2 overflow-x-auto",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { dangerouslySetInnerHTML: { __html: html } }), tag !== void 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "absolute right-0 top-1/2 -translate-y-1/2 font-mono text-xs text-muted",
			children: [
				"(",
				tag,
				")"
			]
		}) : null]
	});
}
function Report({ project, bundle, lc }) {
	let eq = 1;
	const next = () => eq++;
	const d = bundle.derived;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
		className: "calc-sheet rounded-md p-5 space-y-6 print:border-0 print:shadow-none",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "border-b-2 border-navy pb-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "font-display text-xs uppercase tracking-[0.2em] text-muted",
						children: ["Calculation report · ", project.meta.status]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "mt-1 font-display text-2xl font-semibold text-navy",
						children: project.meta.projectName
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: project.meta.option
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("dl", {
						className: "mt-3 grid grid-cols-2 gap-x-6 gap-y-1 text-sm sm:grid-cols-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-muted",
								children: "Revision"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: project.meta.revision })] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-muted",
								children: "Date"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: project.meta.date })] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-muted",
								children: "Prepared"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: project.meta.preparedBy || "—" })] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("dt", {
								className: "text-muted",
								children: "Checked"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("dd", { children: project.meta.checkedBy || "INPUT REQUIRED" })] })
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Callout, { children: "PRELIMINARY ENGINEERING DESIGN TOOL. This calculation depends on the accuracy of the input soil parameters, groundwater conditions, hydraulic assumptions, structural properties, load models, construction sequence and adopted design standards. The results shall be reviewed by a suitably qualified structural/geotechnical engineer before construction. A PASS on one check does not imply the flood protection structure is verified as a system." }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section$1, {
				title: "1. Design objective",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Verify the Option 3 U-shaped precast RC sheet-pile flood embankment with granular core, dual tie rods and RC capping beams for persistent, flood, construction, rapid-drawdown and accidental (tie failure) situations, separating structural, geotechnical and hydraulic limit states." })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section$1, {
				title: "2. Design basis",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "list-disc pl-5 space-y-1 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "EN 1990 — Basis of structural design" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "EN 1991-1-1 — Densities, self-weight and imposed loads" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "EN 1991-2 — Traffic loads on bridges (only if the user calibrates a traffic model)" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "EN 1992-1-1 — Design of concrete structures" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: ["EN 1997-1 — Geotechnical design · Design Approach ", project.codes.designApproach] }),
							project.codes.seismic ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "EN 1998 — Seismic (selected)" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "EN 1998 not applied" })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "National Annex:" }),
							" ",
							project.codes.nationalAnnex
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "Edition:" }),
							" ",
							project.codes.edition
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm",
						children: [
							"Design life ",
							project.codes.designLife,
							" years · ",
							project.codes.consequenceClass,
							" · ",
							project.codes.reliabilityClass,
							" ·",
							" ",
							project.codes.executionClass
						]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section$1, {
				title: "3. Geometry and materials",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "eng-table",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Symbol" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Description" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "num",
							children: "Value"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Unit" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Source" })
					] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: bundle.variables.map((v) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Equation, {
							latex: v.symbol,
							display: false
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: v.description }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "num",
							children: v.value
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: v.unit }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "text-xs",
							children: v.source
						})
					] }, v.symbol)) })]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section$1, {
				title: "4. Earth pressure",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm",
						children: "Rankine (or selected) coefficients on the design friction angle φ'_d = arctan(tan φ'_k / γ_φ)."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Equation, {
						latex: `K_a = \\tan^2\\left(45^\\circ - \\frac{\\varphi'_d}{2}\\right) = ${fmt(d.KaFill, 3)}`,
						tag: next()
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Equation, {
						latex: `K_p = \\tan^2\\left(45^\\circ + \\frac{\\varphi'_d}{2}\\right)\\,\\eta_p = ${fmt(d.KpNative, 2)}`,
						tag: next()
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Equation, {
						latex: `K_0 = 1-\\sin\\varphi'_d = ${fmt(d.K0Fill, 3)}`,
						tag: next()
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm",
						children: "Vertical effective stress and horizontal soil pressure are computed layer-wise. Water pressure is stored separately and not mixed into φ'-based coefficients."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Equation, {
						latex: `\\sigma'_h = K_a \\sigma'_v - 2c'_d\\sqrt{K_a}`,
						tag: next()
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Equation, {
						latex: `p_w(z) = \\gamma_w h_w(z)`,
						tag: next()
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Equation, {
						latex: `p_{net}(z) = p_{soil,in} + p_{sur} + u_{core} - (p_{soil,out} + u_{out})`,
						tag: next()
					}),
					lc ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm",
						children: [
							"For ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: lc.name }),
							": fill resultant P_a = ",
							fmt(lc.forces.PaL, 1),
							" kN/m, upstream water P_w = ",
							fmt(lc.forces.PwL, 1),
							" ",
							"kN/m, surcharge P_q = ",
							fmt(lc.forces.PsL, 1),
							" kN/m, passive (embedment) P_p = ",
							fmt(lc.forces.Pp, 1),
							" kN/m."
						]
					}) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section$1, {
				title: "5. Structural analysis",
				children: [
					project.wallSystem === "cbp" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm",
						children: [
							"Each CBP pile line is a beam-on-elastic-foundation model with flexural rigidity derived per the selected lateral model (",
							project.cbp.lateralModel,
							") — see Master Prompt §20. Winkler springs below riverbed use the CBP subgrade modulus n_h. The granular core is not a rigid diaphragm."
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm",
						children: "Each sheet-pile line is a metre-strip beam with flexural rigidity E_cm I_eff, Winkler springs below riverbed (n_h z) and elastic tie springs. The granular core is not a rigid diaphragm. Reference clause to be confirmed against the project-adopted National Annex / Eurocode edition."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Equation, {
						latex: project.wallSystem === "cbp" ? `EI = E_{cm} I_g\\,/\\,s = ${fmt(d.Ecm, 0)}\\,\\text{MPa}\\times I_g\\,/\\,${fmt(project.cbp.spacing, 2)}\\,\\text{m (individual-pile model)}` : `EI = E_{cm} I_{eff} = ${fmt(d.Ecm, 0)}\\,\\text{MPa}\\times ${fmt(d.Ig * d.Ecm ? project.sheetPile.IeffFactor : 1, 2)} I_g`,
						tag: next()
					}),
					lc ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm",
						children: [
							"Upstream wall: M_Ed,max = ",
							fmt(Math.max(Math.abs(lc.left.Mmax), Math.abs(lc.left.Mmin)), 1),
							" kNm/m at z =",
							" ",
							fmt(lc.left.zMmax, 2),
							" m; V_Ed,max = ",
							fmt(Math.abs(lc.left.Vmax), 1),
							" kN/m; δ_max = ",
							fmt(lc.left.dmax, 1),
							" mm."
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm",
						children: [
							"Downstream wall: M_Ed,max = ",
							fmt(Math.max(Math.abs(lc.right.Mmax), Math.abs(lc.right.Mmin)), 1),
							" kNm/m; V_Ed,max =",
							" ",
							fmt(Math.abs(lc.right.Vmax), 1),
							" kN/m; δ_max = ",
							fmt(lc.right.dmax, 1),
							" mm."
						]
					})] }) : null
				]
			}),
			project.wallSystem === "cbp" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section$1, {
				title: "6. CBP structural check (EN 1992-1-1, circular section)",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm",
						children: "Flexure, shear and axial resistance are computed for the circular pile section by fibre discretisation of the EN 1992-1-1 §3.1.7 stress-strain law, generating an N-M interaction envelope. Reinforcement detailing (minimum/ maximum longitudinal, transverse, anchorage, lap length) follows EN 1992-1-1 §8/§9."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Equation, {
						latex: `f_{cd} = \\alpha_{cc} f_{ck}/\\gamma_C = ${fmt(d.fcd, 2)}\\,\\text{MPa},\\quad f_{yd}=f_{yk}/\\gamma_S=${fmt(d.fyd, 0)}\\,\\text{MPa}`,
						tag: next()
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Equation, {
						latex: `V_{Rd,c}=[C_{Rd,c} k (100\\rho_l f_{ck})^{1/3}+k_1\\sigma_{cp}]\\,b_w d,\\quad b_w\\approx0.9D,\\ d\\approx0.8D`,
						tag: next()
					}),
					lc?.cbp ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-3 grid gap-3 sm:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mb-1 text-xs uppercase tracking-wide text-muted",
							children: "Upstream pile"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NMInteractionDiagram, {
							interaction: lc.cbp.upstream,
							title: "Upstream pile"
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mb-1 text-xs uppercase tracking-wide text-muted",
							children: "Downstream pile"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NMInteractionDiagram, {
							interaction: lc.cbp.downstream,
							title: "Downstream pile"
						})] })]
					}) : null
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section$1, {
				title: "6. RC section (EN 1992-1-1)",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Equation, {
						latex: `f_{cd} = \\alpha_{cc} f_{ck}/\\gamma_C = ${fmt(d.fcd, 2)}\\,\\text{MPa},\\quad f_{yd}=f_{yk}/\\gamma_S=${fmt(d.fyd, 0)}\\,\\text{MPa}`,
						tag: next()
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Equation, {
						latex: `d = t - c_{nom} - \\phi/2 = ${fmt(d.dEff, 0)}\\,\\text{mm}`,
						tag: next()
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Equation, {
						latex: `x = \\frac{A_s f_{yd}}{0.8 f_{cd} b},\\quad z = d - 0.4x,\\quad M_{Rd}=A_s f_{yd} z`,
						tag: next()
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Equation, {
						latex: `V_{Rd,c}=[C_{Rd,c} k (100\\rho_l f_{ck})^{1/3}]bd \\ge v_{min}bd`,
						tag: next()
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section$1, {
				title: "7. Verification of the selected load case",
				children: lc ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckTable, { checks: lc.checks }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Select a load case." })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section$1, {
				title: "8. Utilization summary (governing across enabled cases)",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckTable, { checks: bundle.summary }), bundle.governing ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-3 text-sm",
					children: [
						"Highest reported utilization: ",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: bundle.governing.name }),
						" η = ",
						fmt(bundle.governing.eta, 2),
						" (",
						bundle.governing.loadCase,
						"). This is the largest ratio among completed checks; it is not automatically the unique governing mechanism of the structure."
					]
				}) : null]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section$1, {
				title: "9. Calculation QC",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "eng-table",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "ID" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Check" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Status" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Detail" })
					] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: bundle.qc.map((q) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "font-mono",
							children: q.id
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: q.name }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, { status: q.status }) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: q.detail })
					] }, q.id)) })]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section$1, {
				title: "10. Warnings and limitations",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "list-disc pl-5 space-y-1 text-sm",
					children: bundle.warnings.map((w) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: w }, w))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section$1, {
				title: "11. Engineering conclusion",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["Based on the stated geometry, material properties, design actions, assumptions, applicable Eurocode provisions and National Annex parameters, the proposed U-shaped sheet-pile embankment has been verified for the checks identified in this calculation. Overall status: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, { status: bundle.overall })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2",
						children: [
							"Critical reported utilization η_max = ",
							fmt(bundle.governing?.eta ?? 0, 2),
							" (",
							bundle.governing?.name ?? "—",
							"). Outstanding items: independent geotechnical investigation, National Annex confirmation, specialist seepage analysis, installation contractor verification, and a qualified engineer’s review before construction."
						]
					}),
					bundle.overall !== "PASS" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 font-medium",
						children: "The design cannot be considered fully verified until every FAIL / WARNING / INPUT REQUIRED item has been closed."
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2",
						children: "Completed checks return PASS against the selected criteria. This is not a statutory approval."
					})
				]
			})
		]
	});
}
function Section$1({ title, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
		className: "mb-2 font-display text-sm font-semibold uppercase tracking-wider text-navy border-b border-rule pb-1",
		children: title
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "text-sm leading-relaxed",
		children
	})] });
}
function Callout({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "border border-warn bg-warn-bg px-3 py-2 text-sm text-ink",
		children
	});
}
function CheckTable({ checks }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "overflow-x-auto",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
			className: "eng-table",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Check" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
					className: "num",
					children: "Demand"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
					className: "num",
					children: "Resistance"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Unit" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
					className: "num",
					children: "η"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Status" })
			] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: checks.filter((c) => c.applicable).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: c.name }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
					className: "num",
					children: fmt(c.demand, 2)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
					className: "num",
					children: fmt(c.resistance, 2)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: c.unit }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
					className: "num",
					children: fmt(c.utilization, 2)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, { status: c.status }) })
			] }, c.id)) })]
		})
	});
}
function CheckDetail({ c }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "calc-sheet rounded-md p-4 space-y-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start justify-between gap-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h4", {
					className: "font-display font-semibold text-navy",
					children: c.name
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, { status: c.status })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm",
				children: c.explanation
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs uppercase tracking-wide text-muted",
				children: "What loads act · what resists · demand vs resistance"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Equation, { latex: c.formula }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "font-mono text-xs text-muted",
				children: c.substitution
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm",
				children: [
					"Demand ",
					fmt(c.demand, 2),
					" ",
					c.unit,
					" · Resistance ",
					fmt(c.resistance, 2),
					" ",
					c.unit,
					" · η = ",
					fmt(c.utilization, 2)
				]
			}),
			c.assumptions.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "list-disc pl-5 text-xs text-muted",
				children: c.assumptions.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: a }, a))
			}) : null
		]
	});
}
function sectionInput(p) {
	return {
		diameter: p.cbp.diameter,
		cover: p.cbp.cover,
		barDiameter: p.cbp.barDiameter,
		barCount: p.cbp.barCount,
		stirrupDiameter: p.cbp.stirrupDiameter,
		fck: p.cbp.fck,
		fyk: p.cbp.fyk,
		gammaCconc: p.factors.gammaCconc,
		gammaS: p.factors.gammaS,
		alphaCc: p.factors.alphaCc
	};
}
function cbpWallChecks(p, lc, analysis, side) {
	const sIn = sectionInput(p);
	const geo = circularGeometry(sIn);
	const fyd = p.cbp.fyk / p.factors.gammaS;
	const spacing = p.cbp.spacing;
	const MEd = Math.max(Math.abs(analysis.Mmax), Math.abs(analysis.Mmin)) * spacing;
	const VEd = Math.abs(analysis.Vmax) * spacing;
	const NEd = 25 * (geo.Ac_mm2 / 1e6) * (p.geometry.retainedHeight + p.geometry.embedment) * .5 * p.factors.gammaG;
	const { envelope, NRd0, MRd0, balanced } = nmInteractionEnvelope(sIn);
	const utilization = nmUtilization(envelope, NEd, MEd);
	const MRdAtNEd = capacityMAtN(envelope, NEd);
	const out = [];
	out.push(mkCheck({
		id: `${lc.id}-${side}-cbp-axial`,
		name: `CBP pile axial (${side})`,
		category: "ULS",
		demand: NEd,
		resistance: NRd0,
		unit: "kN",
		utilization: NRd0 > 0 ? NEd / NRd0 : 99,
		explanation: "Axial force from the pile's own self-weight above the critical section, compared with the pure-axial (squash) capacity of the circular RC section.",
		formula: "N_{Rd0}=A_c f_{cd}+A_s f_{yd}",
		substitution: `N_Ed=${fmt(NEd, 1)} kN, A_c=${fmt(geo.Ac_mm2 / 1e6, 3)} m², N_Rd0=${fmt(NRd0, 1)} kN`,
		assumptions: ["Self-weight only; no designed vertical prestress or superstructure load transfer modelled"],
		applicable: true,
		loadCaseId: lc.id
	}, p.limits));
	out.push(mkCheck({
		id: `${lc.id}-${side}-cbp-flexure`,
		name: `CBP pile flexure (${side})`,
		category: "ULS",
		demand: MEd,
		resistance: MRdAtNEd,
		unit: "kNm",
		utilization: MRdAtNEd > 0 ? MEd / MRdAtNEd : 99,
		explanation: "The net lateral pressure on the wall is applied to a beam-on-elastic-foundation model of a single pile (per-metre demand scaled by pile spacing). Peak moment is compared with the circular-section moment capacity at the concurrent axial force, read off the EN 1992-1-1 N-M interaction envelope (fibre discretisation, parabola-rectangle stress block).",
		formula: "M_{Rd}(N_{Ed}) \\text{ read off the } N\\text{-}M \\text{ interaction envelope}",
		substitution: `M_Ed=${fmt(MEd, 1)} kNm/pile, N_Ed=${fmt(NEd, 1)} kN, M_Rd(N_Ed)=${fmt(MRdAtNEd, 1)} kNm`,
		assumptions: [`Lateral model: ${p.cbp.lateralModel} (Master Prompt §20 — individual pile vs equivalent wall)`, "Concrete compression integrated over gross circular area, no bar-hole deduction (ASSUMPTION)"],
		applicable: true,
		loadCaseId: lc.id
	}, p.limits));
	out.push(mkCheck({
		id: `${lc.id}-${side}-cbp-nm`,
		name: `CBP combined N-M (${side})`,
		category: "ULS",
		demand: MEd,
		resistance: utilization > 1e-9 ? MEd / utilization : MRdAtNEd,
		unit: "kNm",
		utilization,
		explanation: "Radial-scaling utilization on the N-M interaction envelope: the ratio of the origin-to-operating-point distance to the origin-to-envelope distance along the same (N_Ed, M_Ed) ray. This accounts for the combined effect of axial force and moment, not moment alone.",
		formula: "\\eta = |OP_{Ed}| / |OP_{Rd}| \\text{ along the ray through } (N_{Ed}, M_{Ed})",
		substitution: `N_Ed=${fmt(NEd, 1)} kN, M_Ed=${fmt(MEd, 1)} kNm, η=${fmt(utilization, 2)}, balanced point N_bal=${fmt(balanced.N, 1)} kN / M_bal=${fmt(balanced.M, 1)} kNm, M_Rd0=${fmt(MRd0, 1)} kNm`,
		assumptions: ["EN 1992-1-1 methodology; National Annex partial factors as adopted elsewhere in this calculation"],
		applicable: true,
		loadCaseId: lc.id
	}, p.limits));
	const VRd = vrdCircular(geo.Dmm, geo.As_mm2, p.cbp.fck, p.factors.gammaCconc, NEd, geo.Ac_mm2);
	out.push(mkCheck({
		id: `${lc.id}-${side}-cbp-shear`,
		name: `CBP pile shear (${side})`,
		category: "ULS",
		demand: VEd,
		resistance: VRd,
		unit: "kN",
		utilization: VRd > 0 ? VEd / VRd : 99,
		explanation: "Peak shear (per pile) compared with V_Rd,c of EN 1992-1-1 §6.2.2 for members without shear reinforcement, generalised for a circular section and enhanced for the concurrent axial compression.",
		formula: "V_{Rd,c}=[C_{Rd,c} k (100\\rho_l f_{ck})^{1/3}+k_1\\sigma_{cp}]\\,b_w d",
		substitution: `V_Ed=${fmt(VEd, 1)} kN, V_Rd,c=${fmt(VRd, 1)} kN`,
		assumptions: ["Effective rectangular chord bw≈0.9D, d≈0.8D (ASSUMPTION — circular-section shear reduction pending validated method)", "No designed shear reinforcement (stirrups/spiral provide confinement and buildability, not a designed shear resistance)"],
		applicable: true,
		loadCaseId: lc.id
	}, p.limits));
	const { asMin, asMax } = minMaxLongitudinalRatio(NEd, geo.Ac_mm2, fyd);
	out.push(mkCheck({
		id: `${lc.id}-${side}-cbp-asmin`,
		name: `CBP minimum longitudinal reinforcement (${side})`,
		category: "DET",
		demand: asMin,
		resistance: geo.As_mm2,
		unit: "mm²",
		utilization: geo.As_mm2 > 0 ? asMin / geo.As_mm2 : 99,
		explanation: "EN 1992-1-1 §9.8.5 pile-specific minimum longitudinal reinforcement (0.5% Ac tapering to 0.25% Ac for Ac ≥ 1.0 m²), cross-checked against the §9.5.2 general column minimum.",
		formula: "A_{s,min}=\\max(0.10 N_{Ed}/f_{yd},\\,0.002 A_c,\\,\\rho_{pile}A_c)",
		substitution: `A_s,min=${fmt(asMin, 0)} mm², A_s,provided=${fmt(geo.As_mm2, 0)} mm² (${p.cbp.barCount}×${p.cbp.barDiameter} mm)`,
		assumptions: ["Reference clause to be confirmed against the project-adopted National Annex / Eurocode edition."],
		applicable: true,
		loadCaseId: lc.id
	}, p.limits));
	out.push(mkCheck({
		id: `${lc.id}-${side}-cbp-asmax`,
		name: `CBP maximum longitudinal reinforcement (${side})`,
		category: "DET",
		demand: geo.As_mm2,
		resistance: asMax,
		unit: "mm²",
		utilization: asMax > 0 ? geo.As_mm2 / asMax : 99,
		explanation: "EN 1992-1-1 §9.5.2 maximum longitudinal reinforcement ratio, 4% of the gross concrete area outside lap zones.",
		formula: "A_{s,max}=0.04 A_c",
		substitution: `A_s,provided=${fmt(geo.As_mm2, 0)} mm², A_s,max=${fmt(asMax, 0)} mm²`,
		assumptions: ["Outside lap zones; lapped sections may permit up to 0.08 A_c per the National Annex"],
		applicable: true,
		loadCaseId: lc.id
	}, p.limits));
	const { diaMin, spacingMax } = transverseCheck(p.cbp.barDiameter, p.cbp.stirrupDiameter, geo.Dmm);
	out.push(mkCheck({
		id: `${lc.id}-${side}-cbp-transverse`,
		name: `CBP transverse reinforcement (${side})`,
		category: "DET",
		demand: diaMin,
		resistance: p.cbp.stirrupDiameter,
		unit: "mm",
		utilization: p.cbp.stirrupDiameter > 0 ? diaMin / p.cbp.stirrupDiameter : 99,
		explanation: "EN 1992-1-1 §9.5.3 general column transverse reinforcement provisions (minimum diameter and maximum pitch).",
		formula: "\\phi_{t,min}=\\max(6\\,\\text{mm},\\,\\phi_l/4),\\quad s_{cl,t,max}=\\min(20\\phi_l, D, 400\\,\\text{mm})",
		substitution: `φ_t,min=${fmt(diaMin, 0)} mm, φ_t,provided=${p.cbp.stirrupDiameter} mm, s_max=${fmt(spacingMax, 0)} mm`,
		assumptions: ["Stirrup/spiral pitch is not currently a modelled input — verify the provided pitch ≤ s_max on the pile shop drawings"],
		applicable: true,
		loadCaseId: lc.id
	}, p.limits));
	const lb = anchorageLength(p.cbp.barDiameter, p.cbp.fck, p.cbp.fyk, p.factors.gammaCconc, p.factors.gammaS);
	const cappingDepth = p.capping.enabled ? Math.max(p.capping.h * 1e3 - p.capping.cover, 1) : 0;
	out.push(mkCheck({
		id: `${lc.id}-${side}-cbp-anchorage`,
		name: `CBP bar anchorage into capping beam (${side})`,
		category: "DET",
		demand: lb,
		resistance: cappingDepth,
		unit: "mm",
		utilization: cappingDepth > 0 ? lb / cappingDepth : 99,
		explanation: "EN 1992-1-1 §8.4 basic anchorage length for the pile main bars, checked against the available embedment depth into the capping beam.",
		formula: "l_{b,rqd}=(\\phi/4)(f_{yd}/f_{bd}),\\quad f_{bd}=2.25 f_{ctd}",
		substitution: `l_b,rqd=${fmt(lb, 0)} mm, available depth=${fmt(cappingDepth, 0)} mm`,
		assumptions: ["Good bond conditions, η1=η2=1 (ASSUMPTION)", "Pile main bars assumed to anchor directly into the capping beam"],
		applicable: p.capping.enabled,
		loadCaseId: lc.id
	}, p.limits));
	const l0 = lapLength(p.cbp.barDiameter, p.cbp.fck, p.cbp.fyk, p.factors.gammaCconc, p.factors.gammaS, 50);
	out.push(mkCheck({
		id: `${lc.id}-${side}-cbp-lap`,
		name: `CBP lap length (${side})`,
		category: "DET",
		demand: l0,
		resistance: l0,
		unit: "mm",
		status: "NOT VERIFIED",
		utilization: 1,
		explanation: "EN 1992-1-1 §8.7 required lap length for the pile main bars (50% lapped at one section assumed). Actual lap detailing is not a modelled input and must be confirmed against the reinforcement shop drawings.",
		formula: "l_0=\\max(\\alpha_6\\, l_{b,rqd},\\,15\\phi,\\,200\\,\\text{mm})",
		substitution: `l_0=${fmt(l0, 0)} mm (α_6 for 50% lapped)`,
		assumptions: ["α1=α2=α3=α5=1 (straight bars, no confinement credit) (ASSUMPTION)", "SPECIALIST CHECK REQUIRED against actual bar detailing"],
		applicable: true,
		loadCaseId: lc.id
	}, p.limits));
	const wk = crackWidthCircular(sIn, MEd / Math.max(p.factors.gammaG, 1));
	out.push(mkCheck({
		id: `${lc.id}-${side}-cbp-crack`,
		name: `CBP crack width (${side})`,
		category: "SLS",
		demand: wk,
		resistance: p.limits.wkLimit,
		unit: "mm",
		utilization: p.limits.wkLimit > 0 ? wk / p.limits.wkLimit : 99,
		explanation: "Simplified EN 1992-1-1 crack-width estimate for the circular section's tension chord, using quasi-permanent steel stress from the unfactored moment.",
		formula: "w_k=s_{r,max}(\\varepsilon_{sm}-\\varepsilon_{cm})",
		substitution: `w_k=${fmt(wk, 3)} mm, w_lim=${p.limits.wkLimit} mm`,
		assumptions: ["Tension-side steel taken as half the pile cage, effective tension area referenced to the full diameter (ASSUMPTION)", "Reference clause to be confirmed against the project-adopted National Annex / Eurocode edition."],
		applicable: true,
		loadCaseId: lc.id
	}, p.limits));
	const cmin = p.limits.crackForWaterRetaining ? 40 : 30;
	out.push(mkCheck({
		id: `${lc.id}-${side}-cbp-cover`,
		name: `CBP durability cover (${side})`,
		category: "DUR",
		demand: cmin,
		resistance: p.cbp.cover,
		unit: "mm",
		utilization: p.cbp.cover > 0 ? cmin / p.cbp.cover : 99,
		explanation: "Nominal cover to the pile main bars. Water-retaining/flood exposure is more onerous than internal XC1. Confirm exposure class with the project specification.",
		formula: "c_{nom}\\ge c_{min}",
		substitution: `c_min=${cmin} mm, c_nom=${p.cbp.cover} mm, exposure ${p.limits.exposure}`,
		assumptions: ["c_min provisionally 40 mm for XC4/XF3 flood structure (ASSUMPTION)"],
		applicable: true,
		loadCaseId: lc.id
	}, p.limits));
	for (const T of analysis.ties) out.push(mkCheck({
		id: `${lc.id}-${side}-${T.id}`,
		name: `${T.name} (${side})`,
		category: "ULS",
		demand: Math.abs(T.T_kN),
		resistance: T.TRd,
		unit: "kN",
		utilization: T.eta,
		explanation: "Tie force is the Winkler-beam support reaction at the tie elevation, converted from force per metre of wall to force per bar using the tributary spacing.",
		formula: "T_{Ed}=k_{tie} \\, \\delta_{tie}\\, s,\\quad T_{Rd}=A_{net} f_{yd} k_{th} k_{conn}",
		substitution: `T_Ed=${fmt(T.T_kN, 1)} kN/bar, T_Rd=${fmt(T.TRd, 1)} kN, z=${fmt(T.elevation, 2)} m`,
		assumptions: ["Symmetric U-system: extension ≈ 2δ (both walls)", "No lock-off preload modelled"],
		applicable: true,
		loadCaseId: lc.id
	}, p.limits));
	return {
		checks: out,
		interaction: {
			envelope,
			NRd0,
			MRd0,
			balanced,
			operating: {
				NEd,
				MEd
			},
			utilization
		}
	};
}
function variablesCbp(p, d) {
	const geo = circularGeometry(sectionInput(p));
	return [
		{
			symbol: "H",
			description: "Retained / exposed height",
			value: fmt(p.geometry.retainedHeight, 2),
			unit: "m",
			source: "USER INPUT"
		},
		{
			symbol: "D_{emb}",
			description: "Embedment below riverbed",
			value: fmt(p.geometry.embedment, 2),
			unit: "m",
			source: "USER INPUT"
		},
		{
			symbol: "D",
			description: "Pile diameter",
			value: fmt(p.cbp.diameter, 2),
			unit: "m",
			source: "USER INPUT"
		},
		{
			symbol: "s",
			description: "Pile centre spacing",
			value: fmt(p.cbp.spacing, 2),
			unit: "m",
			source: "USER INPUT"
		},
		{
			symbol: "D/s",
			description: "Wall solid ratio",
			value: fmt(cbpSolidRatio(p.cbp.diameter, p.cbp.spacing), 3),
			unit: "–",
			source: "DERIVED VALUE"
		},
		{
			symbol: "\\text{model}",
			description: "Lateral interaction model",
			value: p.cbp.lateralModel,
			unit: "–",
			source: "USER INPUT"
		},
		{
			symbol: "L_{pile}",
			description: "Pile length",
			value: fmt(p.cbp.pileLength, 2),
			unit: "m",
			source: "USER INPUT"
		},
		{
			symbol: "f_{ck}",
			description: "Concrete cylinder strength",
			value: fmt(p.cbp.fck, 0),
			unit: "MPa",
			source: "USER INPUT"
		},
		{
			symbol: "f_{yk}",
			description: "Reinforcement yield",
			value: fmt(p.cbp.fyk, 0),
			unit: "MPa",
			source: "USER INPUT"
		},
		{
			symbol: "c_{nom}",
			description: "Nominal cover",
			value: fmt(p.cbp.cover, 0),
			unit: "mm",
			source: "USER INPUT"
		},
		{
			symbol: "n\\times\\phi_l",
			description: "Longitudinal bars",
			value: `${p.cbp.barCount}×${p.cbp.barDiameter}`,
			unit: "mm",
			source: "USER INPUT"
		},
		{
			symbol: "\\phi_t",
			description: "Stirrup/spiral diameter",
			value: fmt(p.cbp.stirrupDiameter, 0),
			unit: "mm",
			source: "USER INPUT"
		},
		{
			symbol: "A_c",
			description: "Gross pile section area",
			value: fmt(geo.Ac_mm2 / 1e6, 3),
			unit: "m²",
			source: "DERIVED VALUE"
		},
		{
			symbol: "A_s",
			description: "Longitudinal reinforcement area",
			value: fmt(geo.As_mm2, 0),
			unit: "mm²",
			source: "DERIVED VALUE"
		},
		{
			symbol: "\\varphi'_{fill}",
			description: "Fill friction angle",
			value: fmt(p.coreFill.phi, 1),
			unit: "°",
			source: "USER INPUT"
		},
		{
			symbol: "\\gamma_{fill}",
			description: "Fill bulk unit weight",
			value: fmt(p.coreFill.gamma, 1),
			unit: "kN/m³",
			source: "USER INPUT"
		},
		{
			symbol: "K_a",
			description: "Active coefficient (fill, design φ)",
			value: fmt(d.KaFill, 3),
			unit: "–",
			source: "CALCULATED RESULT"
		},
		{
			symbol: "K_p",
			description: "Passive coefficient (native, design φ)",
			value: fmt(d.KpNative, 2),
			unit: "–",
			source: "CALCULATED RESULT"
		},
		{
			symbol: "K_0",
			description: "At-rest coefficient (fill)",
			value: fmt(d.K0Fill, 3),
			unit: "–",
			source: "CALCULATED RESULT"
		},
		{
			symbol: "\\gamma_w",
			description: "Unit weight of water",
			value: fmt(p.water.gammaW, 2),
			unit: "kN/m³",
			source: "CODE PARAMETER"
		},
		{
			symbol: "HWL_{up}",
			description: "Flood upstream water",
			value: fmt(p.water.floodUp, 2),
			unit: "m",
			source: "USER INPUT"
		},
		{
			symbol: "HWL_{down}",
			description: "Flood downstream water",
			value: fmt(p.water.floodDown, 2),
			unit: "m",
			source: "USER INPUT"
		},
		{
			symbol: "q",
			description: "Traffic surcharge",
			value: fmt(p.traffic.q, 1),
			unit: "kPa",
			source: "ASSUMPTION"
		},
		{
			symbol: "\\gamma_G",
			description: "Permanent action factor",
			value: fmt(p.factors.gammaG, 2),
			unit: "–",
			source: p.factors.source === "user" ? "USER INPUT" : "CODE PARAMETER"
		},
		{
			symbol: "\\gamma_Q",
			description: "Variable action factor",
			value: fmt(p.factors.gammaQ, 2),
			unit: "–",
			source: p.factors.source === "user" ? "USER INPUT" : "CODE PARAMETER"
		},
		{
			symbol: "\\gamma_{\\varphi}",
			description: "Friction factor (EN 1997)",
			value: fmt(p.factors.gammaPhi, 2),
			unit: "–",
			source: "CODE PARAMETER"
		},
		{
			symbol: "n_h",
			description: "Subgrade modulus rate",
			value: fmt(p.cbp.nh, 0),
			unit: "kN/m³",
			source: "ASSUMPTION"
		},
		{
			symbol: "E_{cm}",
			description: "Concrete secant modulus",
			value: fmt(d.Ecm, 0),
			unit: "MPa",
			source: "CODE PARAMETER"
		},
		{
			symbol: "I_g",
			description: "Gross pile section inertia",
			value: fmt(geo.Ig_m4 * 0xe8d4a51000, 0),
			unit: "mm⁴",
			source: "DERIVED VALUE"
		}
	];
}
var N = 49;
function nativeAt(layers, z) {
	const hit = layers.find((l) => z <= l.zTop + 1e-9 && z >= l.zBot - 1e-9);
	if (hit) return hit;
	const sorted = [...layers].sort((a, b) => b.zTop - a.zTop);
	if (!sorted.length) return null;
	if (z > sorted[0].zTop) return sorted[0];
	return sorted[sorted.length - 1];
}
function phiDesign(phi, gPhi) {
	return Math.atan(Math.tan(phi * Math.PI / 180) / gPhi) * 180 / Math.PI;
}
function coeffs(project, phi) {
	const pd = phiDesign(phi, project.factors.gammaPhi);
	const method = project.earth.method;
	const K0 = k0Jak(pd);
	if (method === "user-ka") return {
		Ka: project.earth.userKa,
		Kp: project.earth.userKp,
		K0
	};
	if (method === "coulomb") return {
		Ka: kaCoulomb(pd, 0, project.earth.backfillSlope, project.earth.wallFriction),
		Kp: kpCoulomb(pd, 0, project.earth.backfillSlope, project.earth.wallFriction) * project.earth.passiveReduction,
		K0
	};
	if (method === "at-rest" || project.earth.useK0IfRestrained) return {
		Ka: K0,
		Kp: kpRankine(pd) * project.earth.passiveReduction,
		K0
	};
	return {
		Ka: kaRankine(pd),
		Kp: kpRankine(pd) * project.earth.passiveReduction,
		K0
	};
}
function waterForCase(p, lc) {
	const w = p.water;
	switch (lc.waterMode) {
		case "dry": return {
			up: w.dryUp,
			down: w.dryDown,
			core: w.coreDry
		};
		case "flood": return {
			up: w.floodUp,
			down: w.floodDown,
			core: w.coreFlood
		};
		case "flood-up": return {
			up: w.floodUp,
			down: w.dryDown,
			core: w.coreFlood
		};
		case "flood-down": return {
			up: w.dryUp,
			down: w.floodDown,
			core: w.coreFlood
		};
		case "max-diff": return {
			up: Math.max(w.floodUp, w.dryUp),
			down: Math.min(w.floodDown, w.dryDown),
			core: w.coreFlood
		};
		case "rapid-drawdown": return {
			up: w.dryUp,
			down: w.dryDown,
			core: Math.max(w.coreFlood, w.floodUp * .7)
		};
		case "custom": return {
			up: lc.customUp ?? w.floodUp,
			down: lc.customDown ?? w.floodDown,
			core: lc.customCore ?? w.coreFlood
		};
		default: return {
			up: w.dryUp,
			down: w.dryDown,
			core: w.coreDry
		};
	}
}
function surcharge(p, trafficOn, constructionOn) {
	if (!trafficOn && !constructionOn) return 0;
	const t = p.traffic;
	let q = 0;
	if (t.model === "uniform" || t.model === "combined" || t.model === "user") q += t.q;
	if (t.model === "vehicle" || t.model === "combined") {
		const area = Math.max(t.distWidth * Math.max(t.axleSpacing * t.nAxles, 1), .5);
		q += t.axleLoad * t.nAxles * t.DAF / area;
	}
	if (t.model === "strip" || t.model === "combined") q += t.q;
	if (constructionOn) q += t.plantLoad + t.craneLoad + t.stockpile;
	return q;
}
function sigVNative(p, z, wl) {
	if (z >= p.geometry.riverbed) return {
		tot: 0,
		u: Math.max(0, wl - z) * p.water.gammaW,
		eff: 0
	};
	let tot = 0;
	const layers = [...p.nativeLayers].sort((a, b) => b.zTop - a.zTop);
	let cursor = p.geometry.riverbed;
	for (const L of layers) {
		const top = Math.min(cursor, L.zTop);
		const bot = Math.max(z, L.zBot);
		if (bot >= top) continue;
		const sat = .5 * (top + bot) < wl;
		tot += (sat ? L.gammaSat : L.gamma) * (top - bot);
		cursor = bot;
		if (cursor <= z + 1e-9) break;
	}
	const u = Math.max(0, wl - z) * p.water.gammaW;
	return {
		tot,
		u,
		eff: Math.max(0, tot - u)
	};
}
function sigVCore(p, z, fillPlaced, roadPlaced, coreWL) {
	const H = p.geometry.retainedHeight;
	const rb = p.geometry.riverbed;
	const topFill = rb + H;
	let tot = 0;
	if (roadPlaced) tot += p.pavement.asphalt * p.pavement.gammaAsphalt + p.pavement.subbase * p.pavement.gammaSubbase;
	if (fillPlaced && z < topFill) {
		const zTop = topFill;
		const zBot = Math.max(z, rb);
		if (zBot < zTop) {
			const sat = .5 * (zTop + zBot) < coreWL;
			tot += (sat ? p.coreFill.gammaSat : p.coreFill.gamma) * (zTop - zBot);
		}
	}
	if (z < rb) {
		const nat = sigVNative(p, z, Math.max(coreWL, p.water.gwlNative));
		tot += nat.tot;
		const u = Math.max(0, Math.max(coreWL, p.water.gwlNative) - z) * p.water.gammaW;
		return {
			tot,
			u,
			eff: Math.max(0, tot - u)
		};
	}
	const u = Math.max(0, coreWL - z) * p.water.gammaW;
	return {
		tot,
		u,
		eff: Math.max(0, tot - u)
	};
}
function buildStations(p, water, opts) {
	const top = p.geometry.riverbed + p.geometry.retainedHeight + (p.capping.enabled ? p.capping.h : 0);
	const toe = p.geometry.riverbed - p.geometry.embedment;
	const q = surcharge(p, opts.trafficOn, opts.constructionOn);
	const fillC = coeffs(p, p.coreFill.phi);
	const stations = [];
	for (let i = 0; i < N; i++) {
		const z = top - i / 48 * (top - toe);
		const nat = nativeAt(p.nativeLayers, Math.min(z, p.geometry.riverbed - .001));
		const outC = coeffs(p, z > p.geometry.riverbed ? p.coreFill.phi : nat?.phi ?? 30);
		const cCore = p.earth.assumeNoCohesion ? 0 : p.coreFill.c / p.factors.gammaC;
		const cOut = p.earth.assumeNoCohesion ? 0 : (nat?.c ?? 0) / p.factors.gammaC;
		const outL = sigVNative(p, z, water.up);
		const outR = sigVNative(p, z, water.down);
		const core = sigVCore(p, z, opts.fillPlaced, opts.roadPlaced, water.core);
		const uUp = Math.max(0, water.up - z) * p.water.gammaW;
		const uDown = Math.max(0, water.down - z) * p.water.gammaW;
		const uCore = Math.max(0, water.core - z) * p.water.gammaW;
		const KaOut = outC.Ka;
		const KaCore = fillC.Ka;
		const KpOut = outC.Kp;
		const K0Core = fillC.K0;
		const KhCore = p.earth.useK0IfRestrained ? K0Core : KaCore;
		const pSoilCore = Math.max(0, KhCore * core.eff - 2 * cCore * Math.sqrt(Math.max(KhCore, 0)));
		const pSoilOutL = z <= p.geometry.riverbed ? Math.max(0, KaOut * outL.eff - 2 * cOut * Math.sqrt(Math.max(KaOut, 0))) : 0;
		const pSoilOutR = z <= p.geometry.riverbed ? Math.max(0, KaOut * outR.eff - 2 * cOut * Math.sqrt(Math.max(KaOut, 0))) : 0;
		const pPassive = z <= p.geometry.riverbed ? Math.max(0, KpOut * outL.eff + 2 * cOut * Math.sqrt(Math.max(KpOut, 0))) : 0;
		const pSur = opts.fillPlaced ? KhCore * q : 0;
		const pWaterNetL = uUp - uCore;
		const pWaterNetR = uDown - uCore;
		const extL = z > p.geometry.riverbed ? uUp : pSoilOutL + uUp;
		const extR = z > p.geometry.riverbed ? uDown : pSoilOutR + uDown;
		const inn = (opts.fillPlaced ? pSoilCore + pSur : 0) + uCore;
		let pNetL = inn - extL;
		let pNetR = inn - extR;
		if (opts.oneSided) {
			pNetL = inn + (z <= p.geometry.riverbed ? 0 : 0) - 0;
			pNetR = 0;
		}
		stations.push({
			z,
			uUp,
			uDown,
			uCore,
			sigVOut: outL.tot,
			sigVCore: core.tot,
			sigEffOut: outL.eff,
			sigEffCore: core.eff,
			pSoilOut: pSoilOutL,
			pSoilCore,
			pWaterNetL,
			pWaterNetR,
			pSur,
			pNetL,
			pNetR,
			pPassive,
			KaOut,
			KaCore,
			KpOut
		});
	}
	return stations;
}
function analyseWall(p, stations, netKey, tiesEnabled, nTies, accidentalFail) {
	const t = p.geometry.wallThickness;
	const b = 1;
	let EI;
	let kSoil;
	if (p.wallSystem === "cbp") {
		const s = Math.max(p.cbp.spacing, .05);
		const Ecm = ecmFromFck(p.cbp.fck);
		if (p.cbp.lateralModel === "individual-pile") {
			EI = Ecm * (Math.PI / 64 * p.cbp.diameter ** 4) * 1e3 / s;
			kSoil = stations.map((st) => {
				if (st.z > p.geometry.riverbed) return 0;
				const depth = p.geometry.riverbed - st.z;
				return (p.cbp.khUser && p.cbp.khUser > 0 ? p.cbp.khUser : p.cbp.nh * Math.max(depth, .1)) * (p.cbp.diameter / s);
			});
		} else {
			EI = Ecm * (1 * p.cbp.diameter ** 3 / 12) * 1e3;
			kSoil = stations.map((st) => {
				if (st.z > p.geometry.riverbed) return 0;
				const depth = p.geometry.riverbed - st.z;
				return p.cbp.khUser && p.cbp.khUser > 0 ? p.cbp.khUser : p.cbp.nh * Math.max(depth, .1);
			});
		}
	} else {
		const Ig = p.sheetPile.Ioverride ?? b * t ** 3 / 12;
		EI = (p.sheetPile.EcmOverride ?? ecmFromFck(p.sheetPile.fck)) * Ig * p.sheetPile.IeffFactor * 1e3;
		kSoil = stations.map((st) => {
			if (st.z > p.geometry.riverbed) return 0;
			const depth = p.geometry.riverbed - st.z;
			if (p.sheetPile.khUser && p.sheetPile.khUser > 0) return p.sheetPile.khUser;
			return p.sheetPile.nh * Math.max(depth, .1);
		});
	}
	const z = stations.map((s) => s.z);
	const pNet = stations.map((s) => s[netKey]);
	const springs = [];
	const activeTies = tiesEnabled ? p.ties.filter((tr) => tr.enabled).slice(0, nTies < 0 ? 99 : nTies) : [];
	if (accidentalFail && activeTies.length) activeTies.pop();
	const Binner = p.geometry.totalWidth - 2 * p.geometry.wallThickness;
	const isU = p.designType.startsWith("u-shape") || p.designType === "double-sheet" || p.designType === "custom";
	for (const tr of activeTies) {
		const dNet = Math.max(tr.diameter - 2 * tr.corrosion, 1) / 1e3;
		const A = Math.PI / 4 * dNet * dNet;
		const Es = 21e7;
		const Ltie = Math.max(Binner, .5);
		const kOne = Es * A / Ltie;
		const kPerM = (isU ? 2 : 1) * kOne * tr.threadEff * tr.connectionEff / Math.max(tr.spacing, .3);
		springs.push({
			z: tr.elevation,
			k: kPerM
		});
	}
	const fem = beamFem({
		z,
		p: pNet,
		kSoil,
		springs,
		EI
	});
	const ties = activeTies.map((tr) => {
		let nearest = 0;
		let best = Infinity;
		for (let i = 0; i < fem.z.length; i++) {
			const d = Math.abs(fem.z[i] - tr.elevation);
			if (d < best) {
				best = d;
				nearest = i;
			}
		}
		const y = fem.y[nearest] ?? 0;
		const T_kNpm = (springs.find((s) => Math.abs(s.z - tr.elevation) < 1e-6)?.k ?? 0) * y;
		const T_kN = T_kNpm * tr.spacing;
		const dNet = Math.max(tr.diameter - 2 * tr.corrosion, 1);
		const TRd = Math.PI / 4 * dNet * dNet * (tr.fy / p.factors.gammaS) * tr.threadEff * tr.connectionEff / 1e3 * (accidentalFail ? 1 : 1);
		const eta = TRd > 0 ? Math.abs(T_kN) / TRd : 99;
		return {
			id: tr.id,
			name: tr.name,
			elevation: tr.elevation,
			T_kNpm,
			T_kN,
			TRd,
			eta,
			status: statusFromEta(eta, p.limits.etaPass, p.limits.etaWarn)
		};
	});
	let Mmax = -Infinity, Mmin = Infinity, Vmax = 0, dmax = 0, zMmax = 0, zVmax = 0, zDmax = 0;
	for (let i = 0; i < fem.z.length; i++) {
		const M = fem.M[i] ?? 0;
		const V = fem.V[i] ?? 0;
		const dmm = (fem.y[i] ?? 0) * 1e3;
		if (M > Mmax) {
			Mmax = M;
			zMmax = fem.z[i];
		}
		if (M < Mmin) Mmin = M;
		if (Math.abs(V) > Math.abs(Vmax)) {
			Vmax = V;
			zVmax = fem.z[i];
		}
		if (Math.abs(dmm) > Math.abs(dmax)) {
			dmax = dmm;
			zDmax = fem.z[i];
		}
	}
	let soilReaction = 0;
	for (let i = 1; i < stations.length; i++) {
		const z0 = stations[i - 1].z;
		const z1 = stations[i].z;
		const y0 = fem.y[i - 1] ?? 0;
		const y1 = fem.y[i] ?? 0;
		const k0 = kSoil[i - 1] ?? 0;
		const k1 = kSoil[i] ?? 0;
		soilReaction += .5 * (k0 * y0 + k1 * y1) * (z0 - z1);
	}
	return {
		stations: fem.z.map((zz, i) => ({
			z: zz,
			p: fem.p[i] ?? 0,
			V: fem.V[i] ?? 0,
			M: fem.M[i] ?? 0,
			dmm: (fem.y[i] ?? 0) * 1e3
		})),
		Mmax,
		Mmin,
		Vmax,
		dmax,
		zMmax,
		zVmax,
		zDmax,
		ties,
		soilReaction,
		EI
	};
}
function mrdRect(bmm, dmm, As, fck, fyk, gC, gS, aCc) {
	const fcd = aCc * fck / gC;
	const fyd = fyk / gS;
	const fcuN = fcd;
	let x = As * fyd / (1 * fcuN * bmm * .8);
	const d = dmm;
	if (x < 0) x = 0;
	const xuLim = .45 * d;
	let AsEff = As;
	if (x > xuLim) {
		x = xuLim;
		AsEff = 1 * fcuN * bmm * .8 * x / fyd;
	}
	const z = d - .4 * x;
	return AsEff * fyd * z / 1e6;
}
function vrdc(bmm, dmm, As, fck, gC) {
	const k = Math.min(1 + Math.sqrt(200 / dmm), 2);
	const rho = Math.min(As / (bmm * dmm), .02);
	const v = .18 / gC * k * (100 * rho * fck) ** (1 / 3);
	const vmin = .035 * k ** 1.5 * Math.sqrt(fck);
	return Math.max(v, vmin) * bmm * dmm / 1e3;
}
function crackWidth(p, MEd) {
	const t = p.geometry.wallThickness * 1e3;
	const cnom = p.sheetPile.cover + p.sheetPile.deltaCdev;
	const d = t - cnom - p.sheetPile.barDia / 2;
	const As = p.sheetPile.asMainEachFace;
	const z = .9 * d;
	const sigmaS = Math.abs(MEd) * 1e6 / Math.max(As * z, 1);
	const Es = 2e5;
	const fct = fctm(p.sheetPile.fck);
	const hcEff = Math.min(2.5 * (t - d), (t - p.sheetPile.cover) / 2, t / 2);
	const AcEff = Math.max(hcEff, 20) * 1e3;
	const rhoP = As / Math.max(AcEff, 1);
	const kt = .4;
	const ae = Es / Math.max(ecmFromFck(p.sheetPile.fck), 1);
	let eps = (sigmaS - kt * (fct / Math.max(rhoP, 1e-6)) * (1 + ae * rhoP)) / Es;
	eps = Math.max(eps, .6 * sigmaS / Es);
	const wk = (3.4 * cnom + .17 * p.sheetPile.barDia / Math.max(rhoP, 1e-6)) * eps;
	return Math.max(wk, 0);
}
function wallChecks(p, lc, analysis, side) {
	const dmm = p.geometry.wallThickness * 1e3 - (p.sheetPile.cover + p.sheetPile.deltaCdev) - p.sheetPile.barDia / 2;
	const As = p.sheetPile.asMainEachFace;
	const MEd = Math.max(Math.abs(analysis.Mmax), Math.abs(analysis.Mmin));
	const VEd = Math.abs(analysis.Vmax);
	const MRd = mrdRect(1e3, dmm, As, p.sheetPile.fck, p.sheetPile.fyk, p.factors.gammaCconc, p.factors.gammaS, p.factors.alphaCc);
	const VRd = vrdc(1e3, dmm, As, p.sheetPile.fck, p.factors.gammaCconc);
	const wk = crackWidth(p, MEd / Math.max(p.factors.gammaG, 1));
	const deflLim = Math.min(p.limits.deflAbs, p.geometry.retainedHeight * 1e3 / p.limits.deflSpanRatio);
	const NEd = 25 * p.geometry.wallThickness * (p.geometry.retainedHeight + p.geometry.embedment) * .5 * p.factors.gammaG;
	const out = [];
	out.push(mkCheck({
		id: `${lc.id}-${side}-flexure`,
		name: `Sheet pile flexure (${side})`,
		category: "ULS",
		demand: MEd,
		resistance: MRd,
		unit: "kNm/m",
		utilization: MRd > 0 ? MEd / MRd : 99,
		explanation: "The net lateral pressure on the wall (earth + water + surcharge) is applied to a beam-on-elastic-foundation model of the precast unit. The peak bending moment is compared with the EN 1992 rectangular-section design resistance of the vertical reinforcement.",
		formula: "M_{Rd}=A_s f_{yd} z,\\quad z=d-0.4x,\\quad x=A_s f_{yd}/(0.8 f_{cd} b)",
		substitution: `M_Ed=${fmt(MEd, 1)} kNm/m, d=${fmt(dmm, 0)} mm, A_s=${fmt(As, 0)} mm²/m, f_ck=${p.sheetPile.fck} MPa → M_Rd=${fmt(MRd, 1)} kNm/m`,
		assumptions: [
			"Singly reinforced rectangular metre-strip",
			`I_eff = ${p.sheetPile.IeffFactor} I_g (ASSUMPTION)`,
			"Reference clause to be confirmed against the project-adopted National Annex / Eurocode edition."
		],
		applicable: true,
		loadCaseId: lc.id
	}, p.limits));
	out.push(mkCheck({
		id: `${lc.id}-${side}-shear`,
		name: `Sheet pile shear (${side})`,
		category: "ULS",
		demand: VEd,
		resistance: VRd,
		unit: "kN/m",
		utilization: VRd > 0 ? VEd / VRd : 99,
		explanation: "Peak shear from the wall analysis is compared with V_Rd,c of EN 1992-1-1 for members without shear reinforcement. Precast sheet piles typically rely on concrete shear resistance plus distribution steel.",
		formula: "V_{Rd,c}=[C_{Rd,c} k (100\\rho_l f_{ck})^{1/3}] b d",
		substitution: `V_Ed=${fmt(VEd, 1)} kN/m, V_Rd,c=${fmt(VRd, 1)} kN/m, d=${fmt(dmm, 0)} mm`,
		assumptions: ["No designed shear links in the precast unit (typical T&G sheet pile)", "C_Rd,c = 0.18/γ_c recommended value"],
		applicable: true,
		loadCaseId: lc.id
	}, p.limits));
	out.push(mkCheck({
		id: `${lc.id}-${side}-nm`,
		name: `Combined N–M (${side})`,
		category: "ULS",
		demand: MEd,
		resistance: MRd,
		unit: "kNm/m",
		utilization: MRd > 0 ? MEd / MRd : 99,
		explanation: "Axial compression from wall self-weight is small relative to the squash load. The wall is flexure-governed; N–M interaction is reported as the flexural ratio with N noted.",
		formula: "N_{Ed}/N_{Rd}+M_{Ed}/M_{Rd}\\le 1",
		substitution: `N_Ed≈${fmt(NEd, 1)} kN/m (self-weight above critical section), M_Ed=${fmt(MEd, 1)} kNm/m`,
		assumptions: ["Self-weight only; no designed vertical prestress"],
		applicable: true,
		loadCaseId: lc.id
	}, p.limits));
	out.push(mkCheck({
		id: `${lc.id}-${side}-defl`,
		name: `Wall deflection (${side})`,
		category: "SLS",
		demand: Math.abs(analysis.dmax),
		resistance: deflLim,
		unit: "mm",
		utilization: deflLim > 0 ? Math.abs(analysis.dmax) / deflLim : 99,
		explanation: "Service deflection of the wall axis from the Winkler beam model, using I_eff. Limit is the more onerous of the absolute cap and H/n.",
		formula: "\\eta_\\delta=\\delta_{Ed}/\\delta_{lim},\\quad \\delta_{lim}=\\min(\\delta_{abs}, H/n)",
		substitution: `δ_Ed=${fmt(analysis.dmax, 1)} mm at z=${fmt(analysis.zDmax, 2)} m, δ_lim=${fmt(deflLim, 1)} mm`,
		assumptions: [`I_eff factor = ${p.sheetPile.IeffFactor}`, "Winkler n_h is a USER/ASSUMED subgrade modulus"],
		applicable: true,
		loadCaseId: lc.id
	}, p.limits));
	out.push(mkCheck({
		id: `${lc.id}-${side}-crack`,
		name: `Crack width (${side})`,
		category: "SLS",
		demand: wk,
		resistance: p.limits.wkLimit,
		unit: "mm",
		utilization: p.limits.wkLimit > 0 ? wk / p.limits.wkLimit : 99,
		explanation: "Simplified EN 1992-1-1 crack-width estimate using quasi-permanent steel stress from the unfactored moment. Water-retaining flood structures typically adopt a tighter limit than XC exposure alone.",
		formula: "w_k=s_{r,max}(\\varepsilon_{sm}-\\varepsilon_{cm})",
		substitution: `w_k=${fmt(wk, 3)} mm, w_lim=${p.limits.wkLimit} mm, exposure ${p.limits.exposure}`,
		assumptions: [p.limits.crackForWaterRetaining ? "Water-retaining crack limit applied" : "Standard XC crack limit", "Reference clause to be confirmed against the project-adopted National Annex / Eurocode edition."],
		applicable: true,
		loadCaseId: lc.id
	}, p.limits));
	for (const T of analysis.ties) out.push(mkCheck({
		id: `${lc.id}-${side}-${T.id}`,
		name: `${T.name} (${side})`,
		category: "ULS",
		demand: Math.abs(T.T_kN),
		resistance: T.TRd,
		unit: "kN",
		utilization: T.eta,
		explanation: "Tie force is the Winkler-beam support reaction at the tie elevation, converted from force per metre of wall to force per bar using the tributary spacing. Tension is positive (walls spreading). Compression means the wall is being pushed into the core; the bar is then slack unless lock-off preload is specified.",
		formula: "T_{Ed}=k_{tie} \\, \\delta_{tie}\\, s,\\quad T_{Rd}=A_{net} f_{yd} k_{th} k_{conn}",
		substitution: `T_Ed=${fmt(T.T_kN, 1)} kN/bar, T_Rd=${fmt(T.TRd, 1)} kN, z=${fmt(T.elevation, 2)} m`,
		assumptions: ["Symmetric U-system: extension ≈ 2δ (both walls)", "No lock-off preload modelled"],
		applicable: true,
		loadCaseId: lc.id
	}, p.limits));
	return out;
}
function globalChecks(p, lc, st, water, fillPlaced) {
	const z = st.map((s) => s.z);
	const rb = p.geometry.riverbed;
	const B = p.geometry.totalWidth;
	const t = p.geometry.wallThickness;
	const Binner = B - 2 * t;
	const H = p.geometry.retainedHeight;
	const D = p.geometry.embedment;
	st.map((s) => -s.pNetL);
	st.map((s) => -s.pNetR);
	trap(st.map((s) => s.pWaterNetL - s.pWaterNetR + (s.z <= rb ? s.pSoilOut : 0) * 0), z.map((zz, i) => i ? z[i - 1] - zz : 0));
	let FwaterL = 0;
	let FwaterR = 0;
	let FsoilOut = 0;
	let Ffill = 0;
	let Fsur = 0;
	let Pp = 0;
	for (let i = 1; i < st.length; i++) {
		const dz = st[i - 1].z - st[i].z;
		FwaterL += .5 * (st[i - 1].uUp + st[i].uUp) * dz;
		FwaterR += .5 * (st[i - 1].uDown + st[i].uDown) * dz;
		Ffill += .5 * (st[i - 1].pSoilCore + st[i].pSoilCore) * dz;
		Fsur += .5 * (st[i - 1].pSur + st[i].pSur) * dz;
		if (st[i].z <= rb) {
			Pp += .5 * (st[i - 1].pPassive + st[i].pPassive) * dz;
			FsoilOut += .5 * (st[i - 1].pSoilOut + st[i].pSoilOut) * dz;
		}
	}
	const Wfill = fillPlaced ? p.coreFill.gamma * Binner * H : 0;
	const Wpave = p.pavement.asphalt * p.pavement.gammaAsphalt * p.geometry.roadWidth + p.pavement.subbase * p.pavement.gammaSubbase * p.geometry.roadWidth;
	const Wwall = 25 * t * (H + D) * 2;
	const Wcap = p.capping.enabled ? 25 * p.capping.b * p.capping.h * 2 : 0;
	const W = Wfill + Wpave + Wwall + Wcap;
	const Fdst = Math.abs(FwaterL - FwaterR) * p.factors.gammaW;
	const delta = Math.min(p.coreFill.phi, 30) * (2 / 3);
	const tanD = Math.tan(delta * Math.PI / 180) / p.factors.gammaPhi;
	const Rslide = W * p.factors.gammaGinf * tanD + Pp * .5;
	const etaSlide = Rslide > 0 ? Fdst / Rslide : 99;
	const armW = B / 2;
	const Mstb = W * p.factors.gammaGinf * armW;
	const hUp = Math.max(water.up - rb, 0);
	const hDn = Math.max(water.down - rb, 0);
	const FwL = .5 * p.water.gammaW * hUp * hUp * p.factors.gammaW;
	.5 * p.water.gammaW * hDn * hDn * p.factors.gammaW;
	const Mdst = FwL * (hUp / 3) + Math.max(Ffill, 0) * .01;
	const etaOT = Mstb > 0 ? Mdst / Mstb : 99;
	const Nphi = phiDesign(p.nativeLayers.at(-1)?.phi ?? 32, p.factors.gammaPhi);
	const Nq = Math.exp(Math.PI * Math.tan(toRadSafe(Nphi))) * Math.tan(Math.PI / 4 + toRadSafe(Nphi) / 2) ** 2;
	const Ng = 2 * (Nq - 1) * Math.tan(toRadSafe(Nphi));
	const Btoe = t;
	const qPile = (Wwall + Wcap) / 2 / Math.max(Btoe, .1) * p.factors.gammaG;
	const sigmaRd = .5 * (p.nativeLayers.at(-1)?.gamma ?? 19) * Btoe * Ng + (p.nativeLayers.at(-1)?.gamma ?? 19) * D * Nq;
	const etaBrg = sigmaRd > 0 ? qPile / sigmaRd : 99;
	const qCore = fillPlaced ? (Wfill + Wpave) / Math.max(Binner, .5) * p.factors.gammaG : 0;
	const sigmaRdCore = (p.nativeLayers[0]?.gamma ?? 18) * Math.max(D, 1) * Math.min(Nq, 20);
	const etaCore = sigmaRdCore > 0 && qCore > 0 ? qCore / sigmaRdCore : 0;
	const U = p.water.gammaW * Math.max(Math.max(water.up, water.down) - (rb - D), 0) * B;
	const etaUplift = W > 0 ? U * .25 / W : 99;
	const creep = D + B + D;
	const dh = Math.abs(water.up - water.down);
	const i = creep > 0 ? dh / creep : 0;
	const Gs = 2.65;
	const gamSat = p.nativeLayers[0]?.gammaSat ?? 20;
	const e0 = Gs * 9.81 / Math.max(gamSat - p.water.gammaW, 1) - 1;
	const icr = 1.65 / (1 + Math.max(e0, .3));
	const etaPipe = icr > 0 ? i / Math.min(p.limits.iAllow, .5 * icr) : 99;
	const heave = (p.nativeLayers[0]?.gammaSat ?? 20) * D;
	const uToe = p.water.gammaW * Math.max(Math.max(water.up, water.down) - (rb - D), 0);
	const etaHeave = heave > 0 ? uToe / (heave + 1e-6) * .5 : 0;
	return [
		mkCheck({
			id: `${lc.id}-slide`,
			name: "Global sliding (U-block)",
			category: "GEO",
			demand: Fdst,
			resistance: Rslide,
			unit: "kN/m",
			utilization: etaSlide,
			explanation: "The U-shaped embankment is treated as a gravity block. Destabilising force is the factored net hydrostatic resultant. Resistance is base friction of the fill/wall weight plus a reduced passive contribution on the downstream embedment.",
			formula: "H_{dst}=\\gamma_w \\tfrac12 \\gamma_w (h_u^2-h_d^2),\\quad R_d=V_d \\tan\\delta_d + R_{p,d}",
			substitution: `H_dst=${fmt(Fdst, 1)} kN/m, W=${fmt(W, 0)} kN/m, δ=${fmt(delta, 1)}°, R_d=${fmt(Rslide, 1)} kN/m`,
			assumptions: [
				`Design Approach ${p.codes.designApproach}`,
				"Wall friction δ = (2/3)φ' of fill (ENGINEERING JUDGEMENT)",
				"Passive on embedment reduced (not full Kp mobilisation)"
			],
			applicable: p.designType !== "single-cantilever" && p.designType !== "single-anchored",
			loadCaseId: lc.id
		}, p.limits),
		mkCheck({
			id: `${lc.id}-ot`,
			name: "Global overturning",
			category: "GEO",
			demand: Mdst,
			resistance: Mstb,
			unit: "kNm/m",
			utilization: etaOT,
			explanation: "Overturning of the U-block about the downstream toe. Stabilising moment from self-weight of fill, walls, capping and pavement. Destabilising moment from upstream hydrostatic resultant.",
			formula: "M_{dst}=F_{w,up}\\, h_u/3,\\quad M_{stb}=W\\, B/2",
			substitution: `M_dst=${fmt(Mdst, 1)} kNm/m, M_stb=${fmt(Mstb, 1)} kNm/m, h_up=${fmt(hUp, 2)} m`,
			assumptions: ["EQU-style comparison using γ_G,inf on stabilising weight", "Recommended EN 1990 factors — confirm NA"],
			applicable: true,
			loadCaseId: lc.id
		}, p.limits),
		mkCheck({
			id: `${lc.id}-brg`,
			name: "Toe bearing",
			category: "GEO",
			demand: qPile,
			resistance: Math.max(sigmaRd, 1),
			unit: "kPa",
			utilization: etaBrg,
			explanation: "Vertical stress under each sheet-pile toe from wall and capping self-weight only. Granular core and pavement bear on the formation between the piles, not through the toes. Screening uses the EN 1997 Annex D drained bearing form.",
			formula: "R/A' = c N_c + q N_q + 0.5 \\gamma B' N_\\gamma",
			substitution: `σ_Ed,toe=${fmt(qPile, 1)} kPa, σ_Rd=${fmt(sigmaRd, 1)} kPa, D=${fmt(D, 2)} m, B'= ${fmt(Btoe, 2)} m. Core contact ${fmt(qCore, 1)} kPa (η=${fmt(etaCore, 2)}).`,
			assumptions: ["Drained bearing, strip footing analogue", "SPECIALIST CHECK REQUIRED for layered/soft soils"],
			applicable: true,
			loadCaseId: lc.id
		}, p.limits),
		mkCheck({
			id: `${lc.id}-uplift`,
			name: "Uplift of U-box",
			category: "GEO",
			demand: U * .25,
			resistance: W,
			unit: "kN/m",
			utilization: etaUplift,
			explanation: "Uplift screening uses a reduced hydrostatic area under the box (seepage dissipation). Full undissipated uplift would require a seepage analysis.",
			formula: "U=\\gamma_w h A_{eq},\\quad \\eta=U_d/W_d",
			substitution: `U_eq=${fmt(U * .25, 1)} kN/m, W=${fmt(W, 0)} kN/m`,
			assumptions: ["Equivalent uplift 25% of full hydrostatic (ASSUMPTION — seepage dependent)"],
			applicable: true,
			loadCaseId: lc.id
		}, p.limits),
		mkCheck({
			id: `${lc.id}-pipe`,
			name: "Piping / hydraulic gradient",
			category: "HYD",
			demand: i,
			resistance: Math.min(p.limits.iAllow, .5 * icr),
			unit: "–",
			utilization: etaPipe,
			explanation: "Lane weighted-creep screening: i = Δh / (D + B + D). Critical gradient from (G_s−1)/(1+e). This is a simplified screening check, not a finite-element seepage analysis.",
			formula: "i=\\Delta h / L_{creep},\\quad i_{cr}=(G_s-1)/(1+e)",
			substitution: `Δh=${fmt(dh, 2)} m, L=${fmt(creep, 2)} m, i=${fmt(i, 3)}, i_cr=${fmt(icr, 2)}, i_all=${fmt(Math.min(p.limits.iAllow, .5 * icr), 2)}`,
			assumptions: ["Simplified creep-length screening", "SPECIALIST CHECK REQUIRED for detailed seepage / filters"],
			applicable: true,
			loadCaseId: lc.id
		}, p.limits),
		mkCheck({
			id: `${lc.id}-heave`,
			name: "Hydraulic heave at toe",
			category: "HYD",
			demand: uToe * .5,
			resistance: heave,
			unit: "kPa",
			utilization: etaHeave,
			explanation: "Heave screening compares pore pressure at formation with the saturated overburden of the embedment prism. Full verification follows EN 1997 hydraulic-failure format with seepage exit gradients.",
			formula: "S_{dst,d}=u_{exit} A,\\quad S_{stb,d}=\\gamma' D A",
			substitution: `u_toe=${fmt(uToe, 1)} kPa, γ_sat D=${fmt(heave, 1)} kPa`,
			assumptions: ["Exit gradient approximated; confirm with seepage net"],
			applicable: true,
			loadCaseId: lc.id
		}, p.limits)
	];
}
function toRadSafe(d) {
	return d * Math.PI / 180;
}
function cappingChecks(p, lc, left) {
	if (!p.capping.enabled) return [];
	const bmm = p.capping.b * 1e3;
	const dmm = p.capping.h * 1e3 - p.capping.cover - 16;
	const cappingFyk = p.wallSystem === "cbp" ? p.cbp.fyk : p.sheetPile.fyk;
	const MRd = mrdRect(bmm, dmm, p.capping.asBot, p.capping.fck, cappingFyk, p.factors.gammaCconc, p.factors.gammaS, p.factors.alphaCc);
	const VRd = vrdc(bmm, dmm, p.capping.asBot, p.capping.fck, p.factors.gammaCconc);
	const T = left.ties[0]?.T_kNpm ?? 0;
	const s = p.ties[0]?.spacing ?? 1.5;
	const MEd = Math.abs(T) * s * s / 8;
	const VEd = Math.abs(T) * s / 2;
	return [mkCheck({
		id: `${lc.id}-cap-m`,
		name: "Capping beam flexure",
		category: "ULS",
		demand: MEd,
		resistance: MRd,
		unit: "kNm",
		utilization: MRd > 0 ? MEd / MRd : 99,
		explanation: "The capping beam is treated as a continuous beam spanning between tie / pile head reactions. Tributary tie force per spacing is applied as a concentrated load.",
		formula: "M_{Ed}=T s^2/8\\quad\\text{(continuous-beam screening)}",
		substitution: `T=${fmt(T, 1)} kN/m, s=${fmt(s, 2)} m, M_Ed=${fmt(MEd, 1)} kNm, M_Rd=${fmt(MRd, 1)} kNm`,
		assumptions: ["Screening continuous-beam model — refine with 3D frame if heads are rigidly connected"],
		applicable: true,
		loadCaseId: lc.id
	}, p.limits), mkCheck({
		id: `${lc.id}-cap-v`,
		name: "Capping beam shear",
		category: "ULS",
		demand: VEd,
		resistance: VRd,
		unit: "kN",
		utilization: VRd > 0 ? VEd / VRd : 99,
		explanation: "Shear screening of the capping beam under tributary tie / wall-head force.",
		formula: "V_{Ed}=T s/2",
		substitution: `V_Ed=${fmt(VEd, 1)} kN, V_Rd=${fmt(VRd, 1)} kN`,
		assumptions: ["No designed links unless specified by the user"],
		applicable: true,
		loadCaseId: lc.id
	}, p.limits)];
}
function handlingCheck(p) {
	const w = 25 * p.geometry.wallThickness;
	const L = p.geometry.retainedHeight + p.geometry.embedment;
	const Mlift = w * L * L / 40;
	const MRd = mrdRect(1e3, p.geometry.wallThickness * 1e3 - (p.sheetPile.cover + p.sheetPile.deltaCdev) - p.sheetPile.barDia / 2, p.sheetPile.asMainEachFace, p.sheetPile.fck, p.sheetPile.fyk, 1.5, 1.15, 1);
	return mkCheck({
		id: "handling",
		name: "Precast handling / two-point lift",
		category: "CON",
		demand: Mlift,
		resistance: MRd,
		unit: "kNm/m",
		utilization: MRd > 0 ? Mlift / MRd : 99,
		explanation: "Self-weight bending for a two-point lift near the 0.21L positions. Installation stresses depend on the driving method and must be confirmed by the specialist contractor.",
		formula: "M_{lift}\\approx w L^2/40",
		substitution: `w=${fmt(w, 2)} kN/m, L=${fmt(L, 2)} m, M_lift=${fmt(Mlift, 1)} kNm/m`,
		assumptions: ["Two-point lift ASSUMPTION", "SPECIALIST CHECK REQUIRED for driving / press-in"],
		applicable: true
	}, p.limits);
}
function durabilityCheck(p) {
	const cnom = p.sheetPile.cover + p.sheetPile.deltaCdev;
	const cmin = p.limits.crackForWaterRetaining ? 40 : 30;
	const req = cmin + p.sheetPile.deltaCdev;
	return mkCheck({
		id: "cover",
		name: "Durability cover",
		category: "DUR",
		demand: req,
		resistance: cnom,
		unit: "mm",
		utilization: cnom > 0 ? req / cnom : 99,
		explanation: "Nominal cover c_nom = c_min + Δc_dev. Water-retaining flood exposure is more onerous than internal XC1. Confirm exposure class with the project specification.",
		formula: "c_{nom}=c_{min}+\\Delta c_{dev}",
		substitution: `c_min=${cmin} mm, Δc_dev=${p.sheetPile.deltaCdev} mm, c_nom=${cnom} mm, exposure ${p.limits.exposure}`,
		assumptions: ["c_min provisionally 40 mm for XC4/XF3 flood structure (ASSUMPTION)"],
		applicable: true
	}, p.limits);
}
function runQC(p) {
	const items = [];
	const ok = (id, name, pass, detail) => ({
		id,
		name,
		status: pass ? "PASS" : "FAIL",
		detail
	});
	items.push(ok("QC-01", "Units consistent", true, "Internal SI: m, kN, kPa, kNm"));
	const mand = p.geometry.retainedHeight > 0 && p.geometry.embedment > 0 && p.geometry.wallThickness > 0;
	items.push(ok("QC-02", "Mandatory geometry present", mand, mand ? "H, D, t provided" : "H, D or t missing"));
	items.push(ok("QC-05", "Water levels valid", p.water.floodUp >= p.water.floodDown - 1e-6, `HWL_up=${p.water.floodUp}, HWL_down=${p.water.floodDown}`));
	const cont = p.nativeLayers.length > 0;
	items.push(ok("QC-06", "Soil layers present", cont, cont ? `${p.nativeLayers.length} native layer(s)` : "No native layers"));
	items.push(ok("QC-07", "Wall geometry valid", p.geometry.totalWidth > 2 * p.geometry.wallThickness, `B=${p.geometry.totalWidth} m, t=${p.geometry.wallThickness} m`));
	const tiesOk = p.ties.every((t) => t.elevation <= p.geometry.retainedHeight + p.capping.h + .5 && t.elevation >= -p.geometry.embedment);
	items.push(ok("QC-08", "Tie levels within wall", tiesOk, tiesOk ? "All tie elevations inside the wall" : "Tie elevation outside wall range"));
	items.push(ok("QC-09", "Embedment positive", p.geometry.embedment > 0, `D=${p.geometry.embedment} m`));
	const reinfOk = p.wallSystem === "cbp" ? p.cbp.barCount > 0 && p.cbp.barDiameter > 0 : p.sheetPile.asMainEachFace > 0;
	items.push(ok("QC-10", "Reinforcement area positive", reinfOk, p.wallSystem === "cbp" ? `${p.cbp.barCount}×${p.cbp.barDiameter} mm bars` : `As=${p.sheetPile.asMainEachFace} mm²/m`));
	items.push(ok("QC-11", "Design approach selected", !!p.codes.designApproach, p.codes.designApproach));
	const topWater = Math.max(p.water.floodUp, p.water.floodDown);
	const wallTop = p.geometry.retainedHeight + (p.capping.enabled ? p.capping.h : 0);
	items.push({
		id: "QC-water-top",
		name: "Water vs wall top",
		status: topWater > wallTop ? "WARNING" : "PASS",
		detail: topWater > wallTop ? "Water level exceeds wall top elevation." : "Water remains below structure top"
	});
	if (p.coreFill.phi < 0 || p.coreFill.phi > 50) items.push({
		id: "QC-phi",
		name: "Friction angle range",
		status: "WARNING",
		detail: "φ' outside typical 0–50° range"
	});
	if (p.codes.nationalAnnex.toLowerCase().includes("none")) items.push({
		id: "QC-na",
		name: "National Annex",
		status: "WARNING",
		detail: "No project-specific National Annex has been provided. Recommended Eurocode values are used provisionally and shall be confirmed against the governing national requirements."
	});
	return items;
}
function variables(p, d) {
	return [
		{
			symbol: "H",
			description: "Retained / exposed height",
			value: fmt(p.geometry.retainedHeight, 2),
			unit: "m",
			source: "USER INPUT"
		},
		{
			symbol: "D",
			description: "Embedment below riverbed",
			value: fmt(p.geometry.embedment, 2),
			unit: "m",
			source: "USER INPUT"
		},
		{
			symbol: "L",
			description: "Total sheet pile length",
			value: fmt(d.L, 2),
			unit: "m",
			source: "DERIVED VALUE"
		},
		{
			symbol: "B_{road}",
			description: "Roadway width",
			value: fmt(p.geometry.roadWidth, 2),
			unit: "m",
			source: "USER INPUT"
		},
		{
			symbol: "B_{tot}",
			description: "Out-to-out width",
			value: fmt(p.geometry.totalWidth, 2),
			unit: "m",
			source: "USER INPUT"
		},
		{
			symbol: "t",
			description: "Sheet pile thickness",
			value: fmt(p.geometry.wallThickness * 1e3, 0),
			unit: "mm",
			source: "USER INPUT"
		},
		{
			symbol: "f_{cu}",
			description: "Cube strength",
			value: fmt(p.sheetPile.fcu, 0),
			unit: "MPa",
			source: "USER INPUT"
		},
		{
			symbol: "f_{ck}",
			description: "Cylinder strength",
			value: fmt(p.sheetPile.fck, 0),
			unit: "MPa",
			source: "DERIVED VALUE"
		},
		{
			symbol: "f_{yk}",
			description: "Reinforcement yield",
			value: fmt(p.sheetPile.fyk, 0),
			unit: "MPa",
			source: "USER INPUT"
		},
		{
			symbol: "c_{nom}",
			description: "Nominal cover",
			value: fmt(d.cnom, 0),
			unit: "mm",
			source: "DERIVED VALUE"
		},
		{
			symbol: "\\varphi'_{fill}",
			description: "Fill friction angle",
			value: fmt(p.coreFill.phi, 1),
			unit: "°",
			source: "USER INPUT"
		},
		{
			symbol: "\\gamma_{fill}",
			description: "Fill bulk unit weight",
			value: fmt(p.coreFill.gamma, 1),
			unit: "kN/m³",
			source: "USER INPUT"
		},
		{
			symbol: "K_a",
			description: "Active coefficient (fill, design φ)",
			value: fmt(d.KaFill, 3),
			unit: "–",
			source: "CALCULATED RESULT"
		},
		{
			symbol: "K_p",
			description: "Passive coefficient (native, design φ)",
			value: fmt(d.KpNative, 2),
			unit: "–",
			source: "CALCULATED RESULT"
		},
		{
			symbol: "K_0",
			description: "At-rest coefficient (fill)",
			value: fmt(d.K0Fill, 3),
			unit: "–",
			source: "CALCULATED RESULT"
		},
		{
			symbol: "\\gamma_w",
			description: "Unit weight of water",
			value: fmt(p.water.gammaW, 2),
			unit: "kN/m³",
			source: "CODE PARAMETER"
		},
		{
			symbol: "HWL_{up}",
			description: "Flood upstream water",
			value: fmt(p.water.floodUp, 2),
			unit: "m",
			source: "USER INPUT"
		},
		{
			symbol: "HWL_{down}",
			description: "Flood downstream water",
			value: fmt(p.water.floodDown, 2),
			unit: "m",
			source: "USER INPUT"
		},
		{
			symbol: "q",
			description: "Traffic surcharge",
			value: fmt(p.traffic.q, 1),
			unit: "kPa",
			source: "ASSUMPTION"
		},
		{
			symbol: "\\gamma_G",
			description: "Permanent action factor",
			value: fmt(p.factors.gammaG, 2),
			unit: "–",
			source: p.factors.source === "user" ? "USER INPUT" : "CODE PARAMETER"
		},
		{
			symbol: "\\gamma_Q",
			description: "Variable action factor",
			value: fmt(p.factors.gammaQ, 2),
			unit: "–",
			source: p.factors.source === "user" ? "USER INPUT" : "CODE PARAMETER"
		},
		{
			symbol: "\\gamma_{\\varphi}",
			description: "Friction factor (EN 1997)",
			value: fmt(p.factors.gammaPhi, 2),
			unit: "–",
			source: "CODE PARAMETER"
		},
		{
			symbol: "n_h",
			description: "Subgrade modulus rate",
			value: fmt(p.sheetPile.nh, 0),
			unit: "kN/m³",
			source: "ASSUMPTION"
		},
		{
			symbol: "E_{cm}",
			description: "Concrete secant modulus",
			value: fmt(d.Ecm, 0),
			unit: "MPa",
			source: "CODE PARAMETER"
		},
		{
			symbol: "I_g",
			description: "Gross metre-strip inertia",
			value: fmt(d.Ig * 0xe8d4a51000, 0),
			unit: "mm⁴/m",
			source: "DERIVED VALUE"
		}
	];
}
function nTiesFor(p, stageTies) {
	if (typeof stageTies === "number") return stageTies;
	if (p.designType === "single-cantilever") return 0;
	return p.ties.filter((t) => t.enabled).length;
}
function analyseCase(p, lc, extras) {
	const water = waterForCase(p, lc);
	const fillPlaced = extras?.fillPlaced ?? true;
	const roadPlaced = extras?.roadPlaced ?? true;
	const stations = buildStations(p, water, {
		trafficOn: lc.trafficOn,
		constructionOn: lc.constructionOn,
		fillPlaced,
		roadPlaced,
		oneSided: lc.oneSidedExcavation
	});
	const nTies = extras?.nTies ?? nTiesFor(p);
	const tiesOn = nTies > 0 && p.designType !== "single-cantilever";
	const left = analyseWall(p, stations, "pNetL", tiesOn, nTies, lc.accidentalTieFail);
	const right = analyseWall(p, stations, "pNetR", tiesOn, nTies, lc.accidentalTieFail);
	let checks;
	let cbpResult;
	if (p.wallSystem === "cbp") {
		const up = cbpWallChecks(p, lc, left, "upstream");
		const down = cbpWallChecks(p, lc, right, "downstream");
		checks = [
			...up.checks,
			...down.checks,
			...globalChecks(p, lc, stations, water, fillPlaced),
			...cappingChecks(p, lc, left)
		];
		cbpResult = {
			solidRatio: cbpSolidRatio(p.cbp.diameter, p.cbp.spacing),
			lateralModel: p.cbp.lateralModel,
			upstream: up.interaction,
			downstream: down.interaction
		};
	} else checks = [
		...wallChecks(p, lc, left, "upstream"),
		...wallChecks(p, lc, right, "downstream"),
		...globalChecks(p, lc, stations, water, fillPlaced),
		...cappingChecks(p, lc, left)
	];
	let PaL = 0, PwL = 0, PwR = 0, PsL = 0, Pp = 0;
	for (let i = 1; i < stations.length; i++) {
		const dz = stations[i - 1].z - stations[i].z;
		PaL += .5 * (stations[i - 1].pSoilCore + stations[i].pSoilCore) * dz;
		PwL += .5 * (stations[i - 1].uUp + stations[i].uUp) * dz;
		PwR += .5 * (stations[i - 1].uDown + stations[i].uDown) * dz;
		PsL += .5 * (stations[i - 1].pSur + stations[i].pSur) * dz;
		if (stations[i].z <= p.geometry.riverbed) Pp += .5 * (stations[i - 1].pPassive + stations[i].pPassive) * dz;
	}
	const Binner = p.geometry.totalWidth - 2 * p.geometry.wallThickness;
	const Wfill = fillPlaced ? p.coreFill.gamma * Binner * p.geometry.retainedHeight : 0;
	const Wstruct = 25 * p.geometry.wallThickness * (p.geometry.retainedHeight + p.geometry.embedment) * 2 + (p.capping.enabled ? 25 * p.capping.b * p.capping.h * 2 : 0);
	const FnetGlobal = PwL - PwR;
	const Mdst = PwL * Math.max(water.up, 0) / 3;
	const Mstb = (Wfill + Wstruct) * (p.geometry.totalWidth / 2);
	const notes = [
		...extras?.notes ?? [],
		lc.waterMode === "rapid-drawdown" ? "Rapid drawdown: external water is lowered while the core remains saturated. Outward effective-stress imbalance can govern tie force and wall flexure." : "",
		lc.accidentalTieFail ? "Accidental case: one tie level removed (robustness). Remaining ties and embedment must redistributed the load." : "",
		p.earth.method === "rankine" && tiesOn ? "Rankine Ka assumes sufficient movement. Stiff ties may keep pressures closer to K0 — toggle ‘restrained wall uses K0’ if movement is locked off." : ""
	].filter(Boolean);
	return {
		id: lc.id,
		name: lc.name,
		situation: lc.situation,
		notes,
		stations,
		left,
		right,
		checks,
		cbp: cbpResult,
		forces: {
			PaL,
			PaR: PaL,
			PwL,
			PwR,
			PsL,
			Pp,
			Wfill,
			Wstruct,
			FnetGlobal,
			Mdst,
			Mstb
		}
	};
}
function runCalculation(p) {
	try {
		return runCalculationInner(p);
	} catch (err) {
		const msg = err instanceof Error ? err.message : "Calculation error";
		return {
			qc: [{
				id: "QC-crash",
				name: "Engine",
				status: "FAIL",
				detail: msg
			}],
			variables: [],
			loadCases: [],
			stageResults: [],
			summary: [],
			governing: null,
			warnings: [msg, "A calculation exception occurred. Check inputs (geometry, soil layers, tie elevations)."],
			overall: "FAIL",
			derived: {
				L: p.geometry.retainedHeight + p.geometry.embedment,
				Binner: p.geometry.totalWidth - 2 * p.geometry.wallThickness,
				cnom: p.sheetPile.cover + p.sheetPile.deltaCdev,
				dEff: 0,
				fcd: 0,
				fyd: 0,
				KaFill: 0,
				KpNative: 0,
				K0Fill: 0,
				Ecm: 0,
				Ig: 0,
				gammaSubFill: 0
			}
		};
	}
}
function runCalculationInner(p) {
	const qc = runQC(p);
	const t = p.geometry.wallThickness;
	const isCbp = p.wallSystem === "cbp";
	const derived = isCbp ? {
		L: p.cbp.pileLength,
		Binner: p.geometry.totalWidth - 2 * t,
		cnom: p.cbp.cover,
		dEff: .8 * (p.cbp.diameter * 1e3),
		fcd: p.factors.alphaCc * p.cbp.fck / p.factors.gammaCconc,
		fyd: p.cbp.fyk / p.factors.gammaS,
		KaFill: coeffs(p, p.coreFill.phi).Ka,
		KpNative: coeffs(p, p.nativeLayers[0]?.phi ?? 30).Kp,
		K0Fill: k0Jak(phiDesign(p.coreFill.phi, p.factors.gammaPhi)),
		Ecm: ecmFromFck(p.cbp.fck),
		Ig: Math.PI / 64 * p.cbp.diameter ** 4,
		gammaSubFill: p.coreFill.gammaSat - p.water.gammaW
	} : {
		L: p.geometry.retainedHeight + p.geometry.embedment,
		Binner: p.geometry.totalWidth - 2 * t,
		cnom: p.sheetPile.cover + p.sheetPile.deltaCdev,
		dEff: t * 1e3 - (p.sheetPile.cover + p.sheetPile.deltaCdev) - p.sheetPile.barDia / 2,
		fcd: p.factors.alphaCc * p.sheetPile.fck / p.factors.gammaCconc,
		fyd: p.sheetPile.fyk / p.factors.gammaS,
		KaFill: coeffs(p, p.coreFill.phi).Ka,
		KpNative: coeffs(p, p.nativeLayers[0]?.phi ?? 30).Kp,
		K0Fill: k0Jak(phiDesign(p.coreFill.phi, p.factors.gammaPhi)),
		Ecm: p.sheetPile.EcmOverride ?? ecmFromFck(p.sheetPile.fck),
		Ig: p.sheetPile.Ioverride ?? 1 * t ** 3 / 12,
		gammaSubFill: p.coreFill.gammaSat - p.water.gammaW
	};
	const loadCases = p.loadCases.filter((lc) => lc.enabled).map((lc) => analyseCase(p, lc));
	const stageResults = p.stages.filter((s) => s.enabled).map((s) => analyseCase(p, {
		id: s.id,
		name: s.name,
		situation: "construction",
		waterMode: s.waterMode,
		trafficOn: s.trafficOn,
		constructionOn: s.id === "ST-08",
		accidentalTieFail: false,
		oneSidedExcavation: s.id === "ST-03",
		enabled: true
	}, {
		fillPlaced: s.fillPlaced,
		roadPlaced: s.roadPlaced,
		nTies: s.tiesInstalled,
		notes: [s.description]
	}));
	const extraChecks = isCbp ? [] : [handlingCheck(p), durabilityCheck(p)];
	const applicable = [
		...loadCases.flatMap((lc) => lc.checks),
		...stageResults.flatMap((s) => s.checks),
		...extraChecks
	].filter((c) => c.applicable && c.status !== "N/A");
	const byId = /* @__PURE__ */ new Map();
	for (const c of applicable) {
		const key = c.name.replace(/ \((upstream|downstream)\)/, "");
		const prev = byId.get(key);
		if (!prev || c.utilization > prev.utilization) byId.set(key, c);
	}
	const summary = [...byId.values()].sort((a, b) => b.utilization - a.utilization);
	let governing = null;
	if (summary.length) {
		const g = summary[0];
		governing = {
			name: g.name,
			eta: g.utilization,
			loadCase: g.loadCaseId ?? "—",
			status: g.status
		};
	}
	const warnings = [];
	warnings.push("PRELIMINARY ENGINEERING DESIGN TOOL. Results shall be reviewed by a suitably qualified structural/geotechnical engineer before construction.");
	if (p.codes.nationalAnnex.toLowerCase().includes("none")) warnings.push("No project-specific National Annex has been provided. Recommended Eurocode values are used provisionally.");
	if (!p.codes.seismic) warnings.push("Seismic action is not included. Enable EN 1998 only when the site requires it.");
	if (p.earth.assumeNoScour) warnings.push("Scour at the riverbed is not modelled. Embedment may be unconservative if scour is credible.");
	if (p.traffic.model === "uniform") warnings.push("Traffic is a user-defined equivalent surcharge. It is not an EN 1991-2 Load Model 1 representation unless the user has calibrated q accordingly.");
	if (isCbp) {
		if (p.cbp.lateralModel === "equivalent-wall") warnings.push("CBP equivalent wall stiffness assumption requires engineering review.");
		warnings.push("Do not treat spaced CBP piles as a solid diaphragm wall unless the equivalent-wall model has been explicitly justified.");
		if (p.cbp.waterCutoff === "none") warnings.push("No water-control measure selected between CBP piles — seepage through the gaps has not been assessed.");
	} else if (p.sheetPile.IeffFactor < 1) warnings.push(`Effective inertia I_eff = ${p.sheetPile.IeffFactor} I_g is an ASSUMPTION for cracked RC.`);
	warnings.push("The granular core is not treated as a rigid structural diaphragm unless the user selects otherwise.");
	warnings.push("Passive resistance mobilisation depends on wall movement, construction disturbance and scour. A user-controlled reduction factor is provided.");
	if (qc.some((q) => q.status === "FAIL")) warnings.push("QC reported FAIL items — do not treat the calculation as complete.");
	let overall = "PASS";
	if (summary.some((c) => c.status === "FAIL")) overall = "FAIL";
	else if (summary.some((c) => c.status === "WARNING" || c.status === "INPUT REQUIRED")) overall = "WARNING";
	if (qc.some((q) => q.status === "FAIL")) overall = overall === "FAIL" ? "FAIL" : "WARNING";
	return {
		qc,
		variables: isCbp ? variablesCbp(p, derived) : variables(p, derived),
		loadCases,
		stageResults,
		summary,
		governing,
		warnings,
		overall,
		derived
	};
}
function runParametric(p, key, min, max, step) {
	const rows = [];
	const n = Math.max(1, Math.round((max - min) / step));
	for (let i = 0; i <= n; i++) {
		const value = min + i * step;
		const q = structuredClone(p);
		if (key === "embedment") q.geometry.embedment = value;
		if (key === "thickness") q.geometry.wallThickness = value / (value > 2 ? 1e3 : 1);
		if (key === "tieDia") q.ties.forEach((t) => t.diameter = value);
		if (key === "spacing") q.geometry.totalWidth = value + 2 * q.geometry.wallThickness;
		const r = runCalculation(q);
		const flex = r.summary.find((c) => c.name.toLowerCase().includes("flexure"));
		const shear = r.summary.find((c) => c.name.toLowerCase().includes("shear"));
		const tie = r.summary.find((c) => c.name.toLowerCase().includes("tie"));
		const defl = r.summary.find((c) => c.name.toLowerCase().includes("deflection"));
		const etaMax = r.governing?.eta ?? 0;
		rows.push({
			value,
			MEd: flex?.demand ?? 0,
			VEd: shear?.demand ?? 0,
			Tmax: tie?.demand ?? 0,
			dmax: defl?.demand ?? 0,
			etaMax,
			status: etaMax > 1 ? "FAIL" : etaMax >= .9 ? "WARNING" : "PASS"
		});
	}
	return rows;
}
function runSensitivity(p) {
	const base = runCalculation(p);
	const baseM = base.summary.find((c) => c.name.toLowerCase().includes("flexure"))?.demand ?? 0;
	const baseT = base.summary.find((c) => c.name.toLowerCase().includes("tie"))?.demand ?? 0;
	const baseE = base.governing?.eta ?? 0;
	return [
		{
			name: "φ' fill",
			delta: "−2°",
			mut: (q) => q.coreFill.phi -= 2
		},
		{
			name: "φ' fill",
			delta: "+2°",
			mut: (q) => q.coreFill.phi += 2
		},
		{
			name: "γ fill",
			delta: "+1 kN/m³",
			mut: (q) => q.coreFill.gamma += 1
		},
		{
			name: "Flood up",
			delta: "+0.50 m",
			mut: (q) => q.water.floodUp += .5
		},
		{
			name: "Flood down",
			delta: "−0.50 m",
			mut: (q) => q.water.floodDown -= .5
		},
		{
			name: "Traffic q",
			delta: "+10 kPa",
			mut: (q) => q.traffic.q += 10
		},
		{
			name: "Embedment",
			delta: "−1.00 m",
			mut: (q) => q.geometry.embedment -= 1
		},
		{
			name: "Tie level (upper)",
			delta: "−0.50 m",
			mut: (q) => {
				if (q.ties[0]) q.ties[0].elevation -= .5;
			}
		},
		{
			name: "Tie diameter",
			delta: "−8 mm",
			mut: (q) => q.ties.forEach((t) => t.diameter -= 8)
		}
	].map((t) => {
		const q = structuredClone(p);
		t.mut(q);
		const r = runCalculation(q);
		const M = r.summary.find((c) => c.name.toLowerCase().includes("flexure"))?.demand ?? 0;
		const T = r.summary.find((c) => c.name.toLowerCase().includes("tie"))?.demand ?? 0;
		const E = r.governing?.eta ?? 0;
		return {
			name: t.name,
			delta: t.delta,
			dM: baseM ? (M - baseM) / baseM * 100 : 0,
			dT: baseT ? (T - baseT) / baseT * 100 : 0,
			dEta: baseE ? (E - baseE) / baseE * 100 : 0
		};
	});
}
function CalculatorApp() {
	const project = useProject((s) => s.project);
	const nav = useProject((s) => s.nav);
	const setNav = useProject((s) => s.setNav);
	const loadCaseId = useProject((s) => s.loadCaseId);
	const setLoadCase = useProject((s) => s.setLoadCase);
	const setProject = useProject((s) => s.setProject);
	const reset = useProject((s) => s.reset);
	const logout = useProject((s) => s.logout);
	const setActiveModule = useProject((s) => s.setActiveModule);
	const [menu, setMenu] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		useProject.persist.rehydrate();
	}, []);
	const bundle = (0, import_react.useMemo)(() => runCalculation(project), [project]);
	const lc = bundle.loadCases.find((c) => c.id === loadCaseId) ?? bundle.loadCases[0];
	const water = (0, import_react.useMemo)(() => {
		const def = project.loadCases.find((c) => c.id === (lc?.id ?? loadCaseId));
		return def ? waterForCase(project, def) : {
			up: project.water.floodUp,
			down: project.water.floodDown,
			core: 0
		};
	}, [
		project,
		lc,
		loadCaseId
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-paper text-ink",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "title-block no-print sticky top-0 z-30",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3 px-3 py-2.5 sm:px-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setActiveModule("modules"),
						className: "flex items-center gap-1.5 rounded px-2.5 py-1 text-xs font-mono bg-navy-mid/80 hover:bg-navy-mid border border-cyan-500/40 text-paper transition",
						title: "Return to Modules Dashboard",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-3.5 text-cyan-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "hidden sm:inline",
							children: "Modules"
						})]
					}),
					project.wallSystem === "cbp" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => setActiveModule("cbp"),
						className: "flex items-center gap-1.5 rounded px-2.5 py-1 text-xs font-mono bg-navy-mid/80 hover:bg-navy-mid border border-cyan-500/40 text-paper transition",
						title: "Return to excavation concept workspace",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-3.5 text-cyan-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "hidden sm:inline",
							children: "Excavation concept"
						})]
					}) : null,
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "lg:hidden min-h-10 min-w-10",
						onClick: () => setMenu(true),
						"aria-label": "Open navigation",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "size-5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-display text-[10px] uppercase tracking-[0.22em] text-paper/70",
							children: "Eurocode · EN 1990 / 1991 / 1992 / 1997"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
							className: "truncate font-display text-base font-semibold leading-tight sm:text-lg",
							children: [project.wallSystem === "cbp" ? "CBP Excavation Support" : "Sheet Pile Excavation Support", " · Design Suite"]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, { status: bundle.overall }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "hidden items-center gap-1 sm:flex",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "ghost",
								className: "text-paper hover:bg-navy-mid",
								onClick: () => window.print(),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, { className: "size-4" }), " Print"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "ghost",
								className: "text-paper hover:bg-navy-mid",
								onClick: () => downloadText(`u-sheet-${project.meta.revision}.json`, JSON.stringify(project, null, 2)),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-4" }), " JSON"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "inline-flex min-h-10 cursor-pointer items-center gap-1.5 rounded-sm px-3 text-sm text-paper hover:bg-navy-mid",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FolderOpen, { className: "size-4" }),
									"Load",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "file",
										accept: "application/json",
										className: "hidden",
										onChange: async (e) => {
											const f = e.target.files?.[0];
											if (!f) return;
											const txt = await f.text();
											setProject({
												...defaultProject(),
												...JSON.parse(txt)
											});
										}
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "ghost",
								className: "text-paper hover:bg-navy-mid",
								onClick: () => reset(),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "size-4" }), " Reset"]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "ghost",
								className: "text-rose-300 hover:bg-rose-950/50 hover:text-rose-200",
								onClick: () => logout(),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "size-4" }), " Logout"]
							})
						]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between border-t border-white/10 px-3 py-1.5 text-[11px] text-paper/80 sm:px-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "truncate",
					children: project.meta.option
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "font-mono tabular-nums",
					children: [
						"H=",
						fmt(project.geometry.retainedHeight, 2),
						" m · D=",
						fmt(project.geometry.embedment, 2),
						" m · t=",
						(project.geometry.wallThickness * 1e3).toFixed(0),
						" mm"
					]
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex max-w-[1600px] flex-col lg:flex-row",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
					className: `no-print z-40 w-64 shrink-0 overflow-y-auto bg-navy-deep lg:sticky lg:top-0 lg:max-h-dvh lg:block ${menu ? "fixed inset-y-0 left-0 block pt-12" : "hidden lg:block"}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "absolute right-2 top-2 text-paper lg:hidden",
						onClick: () => setMenu(false),
						"aria-label": "Close",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "size-5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
						className: "flex flex-col py-2",
						children: NAV_ITEMS.map((it) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => {
								setNav(it.id);
								setMenu(false);
							},
							className: `flex items-center gap-2 px-3 py-2.5 text-left text-sm min-h-11 ${nav === it.id ? "bg-navy-mid text-paper" : "text-paper/80 hover:bg-navy hover:text-paper"}`,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "w-6 font-mono text-[11px] text-paper/50",
								children: it.n
							}), it.label]
						}, it.id))
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
					className: "min-w-0 flex-1 space-y-4 p-3 sm:p-4 order-1 lg:order-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "no-print text-xs text-muted",
							children: "Preliminary design tool — not a substitute for site investigation or statutory approval. Change any input and all diagrams, forces, utilizations and the report update immediately."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
							title: "Interactive cross-section",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "overflow-x-auto",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CrossSection, {
									project,
									water,
									traffic: !!lc?.checks && (project.loadCases.find((c) => c.id === lc.id)?.trafficOn ?? false)
								})
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-2 no-print",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-xs font-display uppercase tracking-wider text-muted",
								children: "Load case"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Select, {
								value: lc?.id ?? loadCaseId,
								onChange: (e) => setLoadCase(e.target.value),
								className: "max-w-md",
								children: bundle.loadCases.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("option", {
									value: c.id,
									children: [
										c.id,
										" · ",
										c.name
									]
								}, c.id))
							})]
						}),
						nav === "project" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProjectPanel, {}),
						nav === "design" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DesignPanel, {}),
						nav === "geometry" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GeometryPanel, {}),
						nav === "soil" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SoilPanel, {}),
						nav === "water" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WaterPanel, {}),
						nav === "flood" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FloodPanel, {}),
						nav === "traffic" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrafficPanel, {}),
						nav === "sheet" && (project.wallSystem === "cbp" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CbpPanel, {}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetPanel, {})),
						nav === "ties" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TiesPanel, {}),
						nav === "capping" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CappingPanel, {}),
						nav === "materials" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MaterialsPanel, {}),
						nav === "loads" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoadsPanel, {}),
						nav === "approach" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ApproachPanel, {}),
						nav === "limits" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LimitsPanel, {}),
						nav === "stages" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StagesPanel, {}),
						(nav === "results" || nav === "report" || nav === "parametric" || nav === "sensitivity") && null,
						nav === "results" && lc ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResultsBody, { bundleLc: lc }) : null,
						nav === "parametric" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ParametricBody, {}) : null,
						nav === "sensitivity" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SensitivityBody, {}) : null,
						nav === "report" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Report, {
							project,
							bundle,
							lc
						}) : null,
						nav !== "report" && lc ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid gap-3 lg:grid-cols-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
								title: `Pressure · ${lc.name}`,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PressureDiagram, {
									stations: lc.stations,
									side: "L"
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
								title: "Free body · upstream wall",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FreeBody, {
									project,
									lc
								})
							})]
						}) : null,
						lc && nav === "results" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-display text-sm font-semibold uppercase tracking-wider text-navy",
								children: "Traceable checks"
							}), lc.checks.filter((c) => c.applicable).slice(0, 12).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckDetail, { c }, c.id))]
						}) : null
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
					className: "no-print order-2 w-full shrink-0 space-y-3 border-t border-rule p-3 lg:order-3 lg:w-72 lg:border-l lg:border-t-0 lg:p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
							title: "Overall status",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "font-display text-lg text-navy",
									children: bundle.overall
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, { status: bundle.overall })]
							}), bundle.governing ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-2 text-sm",
								children: [
									"Highest η = ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "font-mono",
										children: fmt(bundle.governing.eta, 2)
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
									bundle.governing.name,
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs text-muted",
										children: bundle.governing.loadCase
									})
								]
							}) : null]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
							title: "Utilization",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "space-y-3",
								children: bundle.summary.slice(0, 10).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(UtilBar, {
									eta: c.utilization,
									label: c.name.replace(/ \((upstream|downstream)\)/, "")
								}, c.id))
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
							title: "QC",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "space-y-1 text-xs",
								children: bundle.qc.map((q) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
									className: "flex items-center justify-between gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: q.name }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, { status: q.status })]
								}, q.id))
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
							title: "Local save",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-xs text-muted mb-2",
								children: "Project is stored in this browser. Export JSON for archive."
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								className: "w-full",
								onClick: () => downloadText(`u-sheet-${project.meta.revision}.json`, JSON.stringify(project, null, 2)),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Save, { className: "size-4" }), " Save JSON"]
							})]
						})
					]
				})
			]
		})]
	});
}
function ResultsBody({ bundleLc }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "grid gap-3 sm:grid-cols-3",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				title: "Moment",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MVDiagram, {
					analysis: bundleLc.left,
					mode: "M"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 font-mono text-xs",
					children: [
						"M_max = ",
						fmt(Math.max(Math.abs(bundleLc.left.Mmax), Math.abs(bundleLc.left.Mmin)), 1),
						" kNm/m"
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				title: "Shear",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MVDiagram, {
					analysis: bundleLc.left,
					mode: "V"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 font-mono text-xs",
					children: [
						"V_max = ",
						fmt(Math.abs(bundleLc.left.Vmax), 1),
						" kN/m"
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				title: "Deflection",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MVDiagram, {
					analysis: bundleLc.left,
					mode: "d"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-1 font-mono text-xs",
					children: [
						"δ_max = ",
						fmt(bundleLc.left.dmax, 1),
						" mm"
					]
				})]
			}),
			bundleLc.cbp ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					title: "N-M interaction · upstream",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NMInteractionDiagram, {
						interaction: bundleLc.cbp.upstream,
						title: "Upstream pile"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
					title: "N-M interaction · downstream",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NMInteractionDiagram, {
						interaction: bundleLc.cbp.downstream,
						title: "Downstream pile"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					title: "CBP wall model",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm",
						children: ["Wall solid ratio D/s = ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono",
							children: fmt(bundleLc.cbp.solidRatio, 3)
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-sm",
						children: ["Lateral model: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "font-mono",
							children: bundleLc.cbp.lateralModel
						})]
					})]
				})
			] }) : null,
			bundleLc.notes.length ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				title: "Load-case notes",
				className: "sm:col-span-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "list-disc pl-5 text-sm space-y-1",
					children: bundleLc.notes.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: n }, n))
				})
			}) : null
		]
	});
}
function ParametricBody() {
	const project = useProject((s) => s.project);
	const [key, setKey] = (0, import_react.useState)("embedment");
	const [min, setMin] = (0, import_react.useState)(3);
	const [max, setMax] = (0, import_react.useState)(10);
	const [step, setStep] = (0, import_react.useState)(.5);
	const [rows, setRows] = (0, import_react.useState)(null);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		title: "Parametric study",
		action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			onClick: () => setRows(runParametric(project, key, min, max, step)),
			children: "Run study"
		}),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-3 text-sm text-muted",
				children: "Feasible combinations are listed. The tool does not pick a “best” engineering solution."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-3 sm:grid-cols-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
						label: "Variable",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: key,
							onChange: (e) => {
								const k = e.target.value;
								setKey(k);
								if (k === "embedment") {
									setMin(3);
									setMax(10);
									setStep(.5);
								}
								if (k === "thickness") {
									setMin(250);
									setMax(500);
									setStep(50);
								}
								if (k === "tieDia") {
									setMin(25);
									setMax(50);
									setStep(5);
								}
								if (k === "spacing") {
									setMin(6);
									setMax(10);
									setStep(.5);
								}
							},
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "embedment",
									children: "Embedment D (m)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "thickness",
									children: "Wall thickness (mm)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "tieDia",
									children: "Tie diameter (mm)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: "spacing",
									children: "Inner wall spacing (m)"
								})
							]
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
						label: "Min",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumInput, {
							value: min,
							onChange: setMin
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
						label: "Max",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumInput, {
							value: max,
							onChange: setMax
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
						label: "Step",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumInput, {
							value: step,
							onChange: setStep
						})
					})
				]
			}),
			rows ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 overflow-x-auto",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "eng-table",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "num",
							children: "Value"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "num",
							children: "MEd"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "num",
							children: "VEd"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "num",
							children: "Tmax"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "num",
							children: "δmax"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "num",
							children: "η max"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Status" })
					] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: rows.map((r) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "num",
							children: fmt(r.value, 2)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "num",
							children: fmt(r.MEd, 1)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "num",
							children: fmt(r.VEd, 1)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "num",
							children: fmt(r.Tmax, 1)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "num",
							children: fmt(r.dmax, 1)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "num",
							children: fmt(r.etaMax, 2)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, { status: r.status }) })
					] }, r.value)) })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 text-xs text-muted",
					children: [
						"Solutions satisfying η ≤ 1.00: ",
						rows.filter((r) => r.status === "PASS" || r.status === "WARNING").length,
						" of ",
						rows.length,
						"."
					]
				})]
			}) : null
		]
	});
}
function SensitivityBody() {
	const project = useProject((s) => s.project);
	const [rows, setRows] = (0, import_react.useState)(null);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		title: "Sensitivity",
		action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			onClick: () => setRows(runSensitivity(project)),
			children: "Run sensitivity"
		}),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mb-3 text-sm text-muted",
			children: "Each row is a single-parameter perturbation from the current design. Large |Δη| identifies sensitive inputs."
		}), rows ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
			className: "eng-table",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Parameter" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Perturbation" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
					className: "num",
					children: "ΔMEd %"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
					className: "num",
					children: "ΔT %"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
					className: "num",
					children: "Δη %"
				})
			] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: rows.map((r, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: r.name }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: r.delta }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
					className: "num",
					children: fmt(r.dM, 1)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
					className: "num",
					children: fmt(r.dT, 1)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
					className: "num",
					children: fmt(r.dEta, 1)
				})
			] }, i)) })]
		}) : null]
	});
}
function LandingLoginScreen() {
	const login = useProject((s) => s.login);
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [showPassword, setShowPassword] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)("");
	const [remember, setRemember] = (0, import_react.useState)(true);
	const [interactiveWaterLevel, setInteractiveWaterLevel] = (0, import_react.useState)(2.8);
	const [showSuccessAlert, setShowSuccessAlert] = (0, import_react.useState)(false);
	const isEmailCorrect = email.trim() === "str.design.test";
	const isPasswordCorrect = password === "123!test";
	const isReadyToLogin = isEmailCorrect && isPasswordCorrect;
	(0, import_react.useEffect)(() => {
		if (showSuccessAlert) {
			const timer = setTimeout(() => {
				const loginEmail = email.trim() === "" ? "str.design.test" : email.trim();
				const loginPass = password.trim() === "" ? "123!test" : password;
				login(loginEmail, loginPass);
			}, 1500);
			return () => clearTimeout(timer);
		}
	}, [
		showSuccessAlert,
		email,
		password,
		login
	]);
	const handleLogin = (e) => {
		e.preventDefault();
		setError("");
		const loginEmail = email.trim() === "" ? "str.design.test" : email.trim();
		const loginPass = password.trim() === "" ? "123!test" : password;
		if (loginEmail !== "str.design.test") {
			setError("Incorrect email. Default is: str.design.test");
			return;
		}
		if (loginPass !== "123!test") {
			setError("Wrong password. Default is: 123!test");
			return;
		}
		setShowSuccessAlert(true);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh w-full bg-[#07111f] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200 relative overflow-x-hidden",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-[linear-gradient(to_right,#16263d_1px,transparent_1px),linear-gradient(to_bottom,#16263d_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-45 pointer-events-none" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "relative z-20 w-full border-b border-[#1e3a5f]/80 bg-[#060e1a]/95 backdrop-blur-md px-6 sm:px-10 py-3.5 flex flex-wrap items-center justify-between gap-4 shadow-lg",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "size-8 rounded-lg bg-cyan-950 border border-cyan-500/50 flex items-center justify-center text-cyan-400 font-bold shadow-[0_0_15px_rgba(6,182,212,0.3)]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "size-4" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-lg sm:text-xl font-bold tracking-wider text-cyan-400 uppercase",
						children: "STRUCTURAL DESIGN PLATFORM"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] font-mono text-slate-400",
						children: "Integrated Geotechnical & Structural Engineering Analysis Suite"
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex items-center gap-3",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-700/50 text-cyan-300 text-xs font-mono",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-2 rounded-full bg-emerald-400 animate-pulse" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "EUROCODE VERIFIED PLATFORM" })]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative z-10 flex-1 flex flex-col lg:flex-row items-stretch",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1 lg:w-[58%] xl:w-[60%] flex flex-col justify-center items-center p-6 sm:p-8 lg:p-10 border-b lg:border-b-0 lg:border-r border-[#1e3a5f] bg-[#060e18]/70 backdrop-blur-sm relative",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "hidden lg:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-20 flex-col items-center gap-1 py-2 px-1 bg-[#07111f] border border-[#1e3a5f] rounded text-[9px] font-mono text-cyan-500/70 shadow",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "G" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "R" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "I" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "D" })
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "w-full max-w-2xl bg-[#040910]/95 border border-cyan-500/30 rounded-2xl p-5 sm:p-6 flex flex-col justify-between shadow-[0_0_50px_rgba(6,182,212,0.1)] h-[530px]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between text-xs font-mono text-cyan-300 border-b border-cyan-900/60 pb-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cpu, { className: "size-4 text-cyan-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "MODEL: FLOOD EMBANKMENT WALL (H = 4.50m)" })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex items-center gap-2",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-emerald-400 font-bold flex items-center gap-1.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-3.5 text-emerald-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "utilization: 78.4% (PASS)" })]
									})
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "relative flex-1 flex items-center justify-center py-2 min-h-[300px]",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
									className: "w-full h-full max-w-[480px]",
									viewBox: "0 0 500 300",
									fill: "none",
									stroke: "currentColor",
									strokeWidth: "1.5",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
											x: "50",
											y: "100",
											width: "400",
											height: "150",
											fill: "rgba(196, 165, 116, 0.08)",
											stroke: "#8f8676",
											strokeWidth: "1",
											strokeDasharray: "4 4"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
											x: "60",
											y: "120",
											fill: "#c4a574",
											fontSize: "10",
											fontFamily: "monospace",
											stroke: "none",
											children: "Layer 1: Compact Sand (φ=34°, γ=18 kN/m³)"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
											x: "50",
											y: "250",
											width: "400",
											height: "40",
											fill: "rgba(120, 100, 70, 0.15)",
											stroke: "#6d7278",
											strokeWidth: "1"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
											x: "60",
											y: "270",
											fill: "#a09070",
											fontSize: "10",
											fontFamily: "monospace",
											stroke: "none",
											children: "Layer 2: Stiff Clay (cu=65 kPa)"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
											d: `M 50 ${220 - interactiveWaterLevel * 25} L 240 ${220 - interactiveWaterLevel * 25}`,
											stroke: "#6a93b5",
											strokeWidth: "2",
											strokeDasharray: "3 3"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("polygon", {
											points: `235,${216 - interactiveWaterLevel * 25} 245,${220 - interactiveWaterLevel * 25} 235,${224 - interactiveWaterLevel * 25}`,
											fill: "#6a93b5",
											stroke: "none"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("text", {
											x: "250",
											y: `${224 - interactiveWaterLevel * 25}`,
											fill: "#6a93b5",
											fontSize: "10",
											fontFamily: "monospace",
											stroke: "none",
											children: [
												"Water Level (+",
												interactiveWaterLevel.toFixed(1),
												"m)"
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
											d: "M 235 60 L 235 270",
											stroke: "#38bdf8",
											strokeWidth: "4"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
											d: "M 245 60 L 245 270",
											stroke: "#38bdf8",
											strokeWidth: "4"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
											d: "M 235 270 L 245 270",
											stroke: "#38bdf8",
											strokeWidth: "6"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
											x: "225",
											y: "50",
											width: "30",
											height: "15",
											fill: "#1e3a5f",
											stroke: "#38bdf8",
											strokeWidth: "2"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("polygon", {
											points: "50,220 235,220 235,130",
											fill: "rgba(106, 147, 181, 0.15)",
											stroke: "#6a93b5",
											strokeWidth: "1"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
											d: "M 240 65 Q 280 150 240 235 Q 210 260 240 270",
											fill: "rgba(6, 182, 212, 0.1)",
											stroke: "#38bdf8",
											strokeWidth: "2"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
											x: "290",
											y: "160",
											fill: "#38bdf8",
											fontSize: "10",
											fontFamily: "monospace",
											stroke: "none",
											children: "M_Ed = 142.8 kNm/m"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
											x1: "20",
											y1: "60",
											x2: "45",
											y2: "60",
											stroke: "#94a3b8",
											strokeWidth: "1"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
											x1: "20",
											y1: "270",
											x2: "45",
											y2: "270",
											stroke: "#94a3b8",
											strokeWidth: "1"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
											x1: "32.5",
											y1: "60",
											x2: "32.5",
											y2: "270",
											stroke: "#94a3b8",
											strokeWidth: "1"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
											x: "25",
											y: "170",
											fill: "#94a3b8",
											fontSize: "10",
											fontFamily: "monospace",
											stroke: "none",
											transform: "rotate(-90 25 170)",
											children: "Depth 7.50m"
										})
									]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "pt-3 border-t border-cyan-900/60 flex flex-wrap items-center justify-between gap-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlidersVertical, { className: "size-4 text-cyan-400" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs font-mono text-slate-300",
											children: "Simulate Water Level:"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "range",
											min: "0.5",
											max: "5.0",
											step: "0.1",
											value: interactiveWaterLevel,
											onChange: (e) => setInteractiveWaterLevel(parseFloat(e.target.value)),
											className: "w-28 sm:w-36 accent-cyan-500 cursor-pointer"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-mono text-xs text-cyan-400 font-bold",
											children: [interactiveWaterLevel.toFixed(1), "m"]
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center gap-2 font-mono text-xs text-emerald-400 bg-emerald-950/70 border border-emerald-600/70 px-3 py-1.5 rounded-lg shadow-[0_0_15px_rgba(16,185,129,0.2)]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TrendingUp, { className: "size-3.5 text-emerald-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["FS against overturning: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
										className: "text-emerald-300 font-bold",
										children: "2.14 (Safe)"
									})] })]
								})]
							})
						]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex-1 lg:w-[42%] xl:w-[40%] flex flex-col justify-center items-center p-6 sm:p-8 lg:p-10 bg-[#081222]/80 backdrop-blur-sm relative",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "w-full max-w-md bg-[#081222]/95 border border-cyan-500/30 rounded-2xl p-5 sm:p-6 flex flex-col justify-between shadow-[0_0_50px_rgba(6,182,212,0.1)] h-[530px]",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between border-b border-cyan-900/60 pb-3 mb-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "inline-flex items-center gap-2 px-3 py-1 bg-cyan-950/80 border border-cyan-600/50 rounded-lg font-mono text-xs text-cyan-300 font-semibold tracking-wider",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "size-3.5 text-cyan-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "IDENTITY SERVER" })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-[11px] font-mono text-slate-400",
									children: "AUTHORIZED ACCESS"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-center mb-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "font-display text-2xl font-bold tracking-tight text-white mb-1",
										children: "LOGIN"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "text-xs text-slate-400 font-mono",
										children: ["Sign in to continue to ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-cyan-400",
											children: "structural design"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-center gap-3 mt-3",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: `size-7 rounded-full flex items-center justify-center text-xs font-mono font-bold shadow transition-all duration-300 ${isEmailCorrect ? "bg-emerald-600 text-white" : "bg-cyan-500 text-slate-950 ring-4 ring-cyan-500/20"}`,
												children: isEmailCorrect ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4" }) : "1"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `w-10 sm:w-14 h-0.5 transition-colors duration-300 ${isEmailCorrect ? "bg-emerald-600" : "bg-slate-700"}` }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: `size-7 rounded-full flex items-center justify-center text-xs font-mono font-bold shadow transition-all duration-300 ${isPasswordCorrect ? "bg-emerald-600 text-white" : isEmailCorrect ? "bg-cyan-500 text-slate-950 ring-4 ring-cyan-500/20" : "bg-slate-800 text-slate-400"}`,
												children: isPasswordCorrect ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4" }) : "2"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: `w-10 sm:w-14 h-0.5 transition-colors duration-300 ${isPasswordCorrect ? "bg-emerald-600" : "bg-slate-700"}` }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: `size-7 rounded-full flex items-center justify-center text-xs font-mono font-bold shadow transition-all duration-300 ${isReadyToLogin ? "bg-emerald-600 text-white animate-pulse" : "bg-slate-800 text-slate-400"}`,
												children: isReadyToLogin ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "size-4" }) : "3"
											})
										]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
								onSubmit: handleLogin,
								className: "space-y-3.5",
								children: [
									error && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "p-2.5 bg-rose-950/80 border border-rose-600 text-rose-200 text-xs rounded-lg flex items-center gap-2 font-mono",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleAlert, { className: "size-4 shrink-0 text-rose-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: error })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between mb-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "block text-xs font-mono uppercase tracking-wider text-slate-400",
												children: "Email"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => {
													setEmail("str.design.test");
													setPassword("123!test");
												},
												className: "text-[11px] font-mono text-cyan-400 hover:text-cyan-300 underline cursor-pointer transition",
												title: "Click or press Tab in box to autofill",
												children: "Default: str.design.test (Click or Tab)"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "relative",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "size-4" })
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "text",
												value: email,
												onChange: (e) => {
													setEmail(e.target.value);
													if (error) setError("");
												},
												onKeyDown: (e) => {
													if (e.key === "Tab") {
														setEmail("str.design.test");
														setPassword("123!test");
													}
												},
												required: true,
												className: "w-full pl-10 pr-4 py-2 bg-[#040910] border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 font-mono",
												placeholder: "str.design.test"
											})]
										}),
										email.length > 0 && !isEmailCorrect && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[11px] font-mono text-rose-400 mt-0.5",
											children: "Wrong email (default: str.design.test)"
										})
									] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center justify-between mb-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
												className: "block text-xs font-mono uppercase tracking-wider text-slate-400",
												children: "Password"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "button",
												onClick: () => {
													setEmail("str.design.test");
													setPassword("123!test");
												},
												className: "text-[11px] font-mono text-cyan-400 hover:text-cyan-300 underline cursor-pointer transition",
												title: "Click to autofill",
												children: "Default: 123!test"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "relative",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "size-4" })
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: showPassword ? "text" : "password",
													value: password,
													onChange: (e) => {
														setPassword(e.target.value);
														if (error) setError("");
													},
													onKeyDown: (e) => {
														if (e.key === "Tab") {
															setEmail("str.design.test");
															setPassword("123!test");
														}
													},
													required: true,
													className: "w-full pl-10 pr-10 py-2 bg-[#040910] border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500 font-mono",
													placeholder: "123!test"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													onClick: () => setShowPassword(!showPassword),
													className: "absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-200",
													"aria-label": "Toggle password visibility",
													children: showPassword ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EyeOff, { className: "size-4" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Eye, { className: "size-4" })
												})
											]
										}),
										password.length > 0 && !isPasswordCorrect && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[11px] font-mono text-rose-400 mt-0.5",
											children: "Wrong password (default: 123!test)"
										})
									] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between text-xs text-slate-400 pt-0.5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											className: "flex items-center gap-2 cursor-pointer",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "checkbox",
												checked: remember,
												onChange: (e) => setRemember(e.target.checked),
												className: "rounded bg-[#040910] border-slate-700 text-cyan-600 focus:ring-cyan-500 size-4"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "font-mono",
												children: "Remember me"
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											type: "button",
											onClick: () => alert("Contact system administrator to reset password."),
											className: "hover:text-cyan-400 font-mono transition",
											children: "Forgot password? →"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										type: "submit",
										className: "w-full py-2.5 px-4 bg-cyan-600 hover:bg-cyan-500 text-white font-semibold rounded-lg shadow-lg flex items-center justify-center gap-2 transition duration-200 font-mono tracking-wide mt-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Login" })]
									})
								]
							})
						] })
					})
				})]
			}),
			showSuccessAlert && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-200",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "w-full max-w-md bg-[#081222] border-2 border-emerald-500/80 rounded-2xl p-6 sm:p-8 shadow-[0_0_60px_rgba(16,185,129,0.35)] text-center relative overflow-hidden",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-cyan-400 via-emerald-400 to-cyan-400 animate-pulse" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mx-auto size-16 rounded-full bg-emerald-950/90 border-2 border-emerald-400 flex items-center justify-center mb-5 text-emerald-400 shadow-[0_0_25px_rgba(16,185,129,0.5)]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-9" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-display text-2xl font-bold text-white mb-2 tracking-wide",
							children: "Login Success"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-cyan-300 text-sm sm:text-base font-semibold mb-6",
							children: "Welcome to Structural Design Platform"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "w-full bg-slate-900 rounded-full h-1.5 mb-5 overflow-hidden border border-slate-800",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "bg-gradient-to-r from-emerald-500 to-cyan-400 h-full rounded-full transition-all duration-1000 ease-out",
								style: { width: "100%" }
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => {
								const loginEmail = email.trim() === "" ? "str.design.test" : email.trim();
								const loginPass = password.trim() === "" ? "123!test" : password;
								login(loginEmail, loginPass);
							},
							className: "w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-mono text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition duration-150 shadow-md",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Entering Platform... (Click to Continue)" })
						})
					]
				})
			})
		]
	});
}
function ModuleDashboard() {
	const userEmail = useProject((s) => s.userEmail);
	const logout = useProject((s) => s.logout);
	const setActiveModule = useProject((s) => s.setActiveModule);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-[#07111f] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200 relative overflow-x-hidden",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-[linear-gradient(to_right,#16263d_1px,transparent_1px),linear-gradient(to_bottom,#16263d_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-35 pointer-events-none" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "relative z-20 border-b border-[#1e3a5f]/60 bg-[#060e18]/90 backdrop-blur-md px-6 py-4 flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "p-2 bg-cyan-950/80 border border-cyan-500/40 rounded-lg text-cyan-400",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "size-5" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-sm sm:text-base font-bold tracking-wider text-cyan-400 uppercase",
						children: "STRUCTURAL DESIGN PLATFORM"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] font-mono text-slate-400",
						children: "Integrated Foundation & Geotechnical Suite"
					})] })]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3 font-mono text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0b192c] border border-slate-700/70 text-slate-300",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-2 rounded-full bg-emerald-500 animate-pulse" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: userEmail || "str.design.test" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: logout,
						className: "flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-rose-950/80 hover:border-rose-700/60 border border-slate-700 text-slate-300 hover:text-rose-300 transition duration-150",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "size-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Logout" })]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "relative z-10 flex-1 max-w-7xl w-full mx-auto p-6 sm:p-10 flex flex-col justify-center",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-10 text-center sm:text-left",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/70 border border-cyan-700/50 text-cyan-300 text-xs font-mono font-medium mb-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "size-3.5 text-cyan-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "EUROCODE VERIFIED PLATFORM" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-display text-2xl sm:text-4xl font-bold tracking-tight text-white mb-2",
							children: "Structural Design Modules"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-slate-400 text-sm sm:text-base max-w-2xl font-mono",
							children: "Select a specialized engineering module below to execute finite element analysis, geotechnical verification, and detailed calculation reports."
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							onClick: () => setActiveModule("sheet-pile"),
							className: "group relative flex flex-col justify-between bg-[#081222]/90 hover:bg-[#0b1b33] border border-cyan-500/40 hover:border-cyan-400 rounded-2xl p-6 transition-all duration-300 cursor-pointer shadow-[0_4px_25px_rgba(6,182,212,0.1)] hover:shadow-[0_8px_35px_rgba(6,182,212,0.25)] hover:-translate-y-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "absolute top-4 right-4",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "inline-flex items-center gap-1 text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-600/60 text-emerald-400 font-semibold",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-3" }), " Ready"]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "w-full h-44 bg-[#03070e] border border-cyan-900/60 rounded-xl mt-3 mb-5 overflow-hidden flex items-center justify-center p-3 relative",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
											viewBox: "0 0 240 140",
											className: "w-full h-full",
											fill: "none",
											stroke: "currentColor",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
													x: "20",
													y: "45",
													width: "200",
													height: "85",
													fill: "rgba(196,165,116,0.08)",
													stroke: "#8f8676",
													strokeDasharray: "3 3",
													strokeWidth: "1"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
													x1: "20",
													y1: "45",
													x2: "220",
													y2: "45",
													stroke: "#94a3b8",
													strokeWidth: "1.5"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
													x1: "20",
													y1: "65",
													x2: "110",
													y2: "65",
													stroke: "#38bdf8",
													strokeWidth: "1.5",
													strokeDasharray: "4 2"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
													x: "25",
													y: "60",
													fill: "#38bdf8",
													fontSize: "8",
													fontFamily: "monospace",
													children: "WL +2.8m"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
													d: "M 110 25 L 110 130 M 116 25 L 116 130",
													stroke: "#38bdf8",
													strokeWidth: "3"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
													x: "105",
													y: "20",
													width: "16",
													height: "8",
													fill: "#1e3a5f",
													stroke: "#38bdf8",
													strokeWidth: "1.5"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("polygon", {
													points: "25,100 110,100 110,65",
													fill: "rgba(56,189,248,0.15)",
													stroke: "#38bdf8",
													strokeWidth: "1"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
													d: "M 116 30 Q 145 75 116 120",
													stroke: "#06b6d4",
													strokeWidth: "2",
													strokeDasharray: "2 2"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
													x: "125",
													y: "75",
													fill: "#06b6d4",
													fontSize: "8",
													fontFamily: "monospace",
													children: "M_Ed"
												})
											]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mb-4",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "font-mono text-xs uppercase tracking-wider text-cyan-400 font-semibold mb-1",
												children: "Earth Retaining & Flood Wall"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
												className: "font-display text-xl font-bold text-white group-hover:text-cyan-300 transition-colors",
												children: "Sheet Pile Design"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs text-slate-400 font-mono mt-2 leading-relaxed",
												children: "Excavation support with staged earth and water pressures, sheet-pile checks, movement review and calculation reporting."
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-wrap gap-1.5 mb-6",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800/80 text-cyan-300 border border-slate-700",
												children: "EC7 Geotechnical"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800/80 text-cyan-300 border border-slate-700",
												children: "EC2 Structural"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800/80 text-cyan-300 border border-slate-700",
												children: "Interactive HUD"
											})
										]
									})
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									className: "w-full py-2.5 px-4 bg-cyan-600 group-hover:bg-cyan-500 text-white font-mono text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors duration-200 shadow-lg",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Open Design Suite" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4 group-hover:translate-x-1 transition-transform" })]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							onClick: () => setActiveModule("cbp"),
							className: "group relative flex flex-col justify-between bg-[#081222]/90 hover:bg-[#0b1b33] border border-violet-500/40 hover:border-violet-400 rounded-2xl p-6 transition-all duration-300 cursor-pointer shadow-[0_4px_25px_rgba(139,92,246,0.1)] hover:shadow-[0_8px_35px_rgba(139,92,246,0.25)] hover:-translate-y-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "absolute top-4 right-4",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "inline-flex items-center gap-1 text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-violet-950/80 border border-violet-600/60 text-violet-300 font-semibold",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleDot, { className: "size-3" }), " Ready"]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "w-full h-44 bg-[#03070e] border border-violet-900/60 rounded-xl mt-3 mb-5 overflow-hidden flex items-center justify-center p-3 relative",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
											viewBox: "0 0 240 140",
											className: "w-full h-full",
											"aria-label": "Contiguous bored pile wall and soil layers",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
													x: "18",
													y: "30",
													width: "204",
													height: "34",
													fill: "#c7a876",
													opacity: ".55"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
													x: "18",
													y: "64",
													width: "204",
													height: "50",
													fill: "#879b72",
													opacity: ".55"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
													x1: "18",
													y1: "64",
													x2: "222",
													y2: "64",
													stroke: "#e2c589",
													strokeDasharray: "4 3"
												}),
												[
													58,
													82,
													106,
													130,
													154,
													178
												].map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
													cx: x,
													cy: "74",
													r: "13",
													fill: "#596775",
													stroke: "#c4b5fd",
													strokeWidth: "2"
												}, x)),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
													x: "44",
													y: "16",
													width: "150",
													height: "11",
													rx: "2",
													fill: "#7c6b9c",
													stroke: "#c4b5fd"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
													x1: "18",
													y1: "48",
													x2: "222",
													y2: "48",
													stroke: "#38bdf8",
													strokeDasharray: "4 3"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
													x: "22",
													y: "43",
													fill: "#7dd3fc",
													fontSize: "8",
													fontFamily: "monospace",
													children: "GROUNDWATER"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
													x: "22",
													y: "59",
													fill: "#f1dfb5",
													fontSize: "8",
													fontFamily: "monospace",
													children: "ALLUVIUM"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
													x: "22",
													y: "108",
													fill: "#d8efd0",
													fontSize: "8",
													fontFamily: "monospace",
													children: "DENSE STRATUM"
												})
											]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mb-4",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "font-mono text-xs uppercase tracking-wider text-violet-300 font-semibold mb-1",
												children: "Excavation Retaining Wall"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
												className: "font-display text-xl font-bold text-white group-hover:text-violet-200 transition-colors",
												children: "CBP Wall Design"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs text-slate-400 font-mono mt-2 leading-relaxed",
												children: "Contiguous bored-pile geometry, layer-based ground model, water-control strategy and staged excavation configuration."
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-wrap gap-1.5 mb-6",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800/80 text-violet-200 border border-slate-700",
											children: "CBP Geometry"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800/80 text-violet-200 border border-slate-700",
											children: "Soil Layers"
										})]
									})
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									className: "w-full py-2.5 px-4 bg-violet-700 group-hover:bg-violet-600 text-white font-mono text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors duration-200 shadow-lg",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Open CBP Design" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4 group-hover:translate-x-1 transition-transform" })]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							onClick: () => setActiveModule("bored-pile"),
							className: "group relative flex flex-col justify-between bg-[#081222]/90 hover:bg-[#0b1b33] border border-slate-700/60 hover:border-cyan-500/70 rounded-2xl p-6 transition-all duration-300 cursor-pointer shadow-[0_4px_25px_rgba(0,0,0,0.4)] hover:shadow-[0_8px_35px_rgba(6,182,212,0.15)] hover:-translate-y-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "absolute top-4 right-4",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "inline-flex items-center gap-1 text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-700/60 text-cyan-300 font-semibold",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Compass, { className: "size-3" }), " Active"]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "w-full h-44 bg-[#03070e] border border-slate-800 rounded-xl mt-3 mb-5 overflow-hidden flex items-center justify-center p-3 relative",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
											viewBox: "0 0 240 140",
											className: "w-full h-full",
											fill: "none",
											stroke: "currentColor",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
													x1: "20",
													y1: "40",
													x2: "220",
													y2: "40",
													stroke: "#64748b",
													strokeWidth: "1",
													strokeDasharray: "2 2"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
													x: "25",
													y: "35",
													fill: "#94a3b8",
													fontSize: "8",
													fontFamily: "monospace",
													children: "Clay Layer (cu=45kPa)"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
													x1: "20",
													y1: "85",
													x2: "220",
													y2: "85",
													stroke: "#64748b",
													strokeWidth: "1",
													strokeDasharray: "2 2"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
													x: "25",
													y: "80",
													fill: "#94a3b8",
													fontSize: "8",
													fontFamily: "monospace",
													children: "Dense Sand (N=35)"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
													x: "100",
													y: "15",
													width: "40",
													height: "110",
													fill: "rgba(30,58,95,0.25)",
													stroke: "#38bdf8",
													strokeWidth: "2"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
													x1: "106",
													y1: "20",
													x2: "106",
													y2: "120",
													stroke: "#0ea5e9",
													strokeWidth: "1.5",
													strokeDasharray: "3 2"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
													x1: "134",
													y1: "20",
													x2: "134",
													y2: "120",
													stroke: "#0ea5e9",
													strokeWidth: "1.5",
													strokeDasharray: "3 2"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
													x1: "120",
													y1: "2",
													x2: "120",
													y2: "14",
													stroke: "#f59e0b",
													strokeWidth: "2"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("polygon", {
													points: "117,12 120,16 123,12",
													fill: "#f59e0b"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
													x: "127",
													y: "12",
													fill: "#f59e0b",
													fontSize: "8",
													fontFamily: "monospace",
													children: "N_Ed"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
													d: "M 94 50 L 98 45 M 94 70 L 98 65 M 146 50 L 142 45 M 146 70 L 142 65",
													stroke: "#38bdf8",
													strokeWidth: "1.5"
												})
											]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mb-4",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "font-mono text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1",
												children: "Deep Foundation System"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
												className: "font-display text-xl font-bold text-white group-hover:text-cyan-300 transition-colors",
												children: "Bored Pile Design"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs text-slate-400 font-mono mt-2 leading-relaxed",
												children: "Deep foundation geotechnical and structural verification for cast-in-place bored piles. Skin friction (alpha & beta methods), end-bearing resistance, and rebar reinforcement design."
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-wrap gap-1.5 mb-6",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800/80 text-slate-300 border border-slate-700",
												children: "Axial & Lateral"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800/80 text-slate-300 border border-slate-700",
												children: "Shaft Resistance"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800/80 text-slate-300 border border-slate-700",
												children: "Reinforcement Cage"
											})
										]
									})
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									className: "w-full py-2.5 px-4 bg-slate-800 hover:bg-cyan-700 text-white font-mono text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors duration-200 border border-slate-700 hover:border-cyan-500",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "View Module" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4 group-hover:translate-x-1 transition-transform" })]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							onClick: () => setActiveModule("pile-cap"),
							className: "group relative flex flex-col justify-between bg-[#081222]/90 hover:bg-[#0b1b33] border border-slate-700/60 hover:border-cyan-500/70 rounded-2xl p-6 transition-all duration-300 cursor-pointer shadow-[0_4px_25px_rgba(0,0,0,0.4)] hover:shadow-[0_8px_35px_rgba(6,182,212,0.15)] hover:-translate-y-1",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "absolute top-4 right-4",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "inline-flex items-center gap-1 text-[11px] font-mono px-2.5 py-0.5 rounded-full bg-cyan-950/80 border border-cyan-700/60 text-cyan-300 font-semibold",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(HardHat, { className: "size-3" }), " Active"]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "w-full h-44 bg-[#03070e] border border-slate-800 rounded-xl mt-3 mb-5 overflow-hidden flex items-center justify-center p-3 relative",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
											viewBox: "0 0 240 140",
											className: "w-full h-full",
											fill: "none",
											stroke: "currentColor",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
													x: "95",
													y: "10",
													width: "50",
													height: "25",
													fill: "#1e293b",
													stroke: "#38bdf8",
													strokeWidth: "1.5"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
													x: "105",
													y: "26",
													fill: "#94a3b8",
													fontSize: "8",
													fontFamily: "monospace",
													children: "Column"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
													x: "35",
													y: "35",
													width: "170",
													height: "50",
													fill: "rgba(30,58,95,0.3)",
													stroke: "#38bdf8",
													strokeWidth: "2"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
													x: "50",
													y: "85",
													width: "30",
													height: "45",
													fill: "#0f172a",
													stroke: "#0ea5e9",
													strokeWidth: "1.5"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
													x: "160",
													y: "85",
													width: "30",
													height: "45",
													fill: "#0f172a",
													stroke: "#0ea5e9",
													strokeWidth: "1.5"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
													x1: "120",
													y1: "35",
													x2: "65",
													y2: "80",
													stroke: "#f59e0b",
													strokeWidth: "2",
													strokeDasharray: "3 2"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
													x1: "120",
													y1: "35",
													x2: "175",
													y2: "80",
													stroke: "#f59e0b",
													strokeWidth: "2",
													strokeDasharray: "3 2"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
													x1: "65",
													y1: "80",
													x2: "175",
													y2: "80",
													stroke: "#06b6d4",
													strokeWidth: "2"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
													x: "100",
													y: "75",
													fill: "#06b6d4",
													fontSize: "8",
													fontFamily: "monospace",
													children: "Tension Tie"
												})
											]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mb-4",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "font-mono text-xs uppercase tracking-wider text-slate-400 font-semibold mb-1",
												children: "Substructure & Load Transfer"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
												className: "font-display text-xl font-bold text-white group-hover:text-cyan-300 transition-colors",
												children: "Pile Cap Design"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs text-slate-400 font-mono mt-2 leading-relaxed",
												children: "Reinforced concrete pile cap structural design with multi-pile configurations (2, 3, 4, and 5-pile arrangements). Strut-and-Tie Modeling (STM), punching shear, and nodal zone stress checks."
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-wrap gap-1.5 mb-6",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800/80 text-slate-300 border border-slate-700",
												children: "Strut-and-Tie (STM)"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800/80 text-slate-300 border border-slate-700",
												children: "Punching Shear"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
												className: "text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800/80 text-slate-300 border border-slate-700",
												children: "Multi-Pile Layouts"
											})
										]
									})
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									type: "button",
									className: "w-full py-2.5 px-4 bg-slate-800 hover:bg-cyan-700 text-white font-mono text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition-colors duration-200 border border-slate-700 hover:border-cyan-500",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "View Module" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4 group-hover:translate-x-1 transition-transform" })]
								})
							]
						})
					]
				})]
			})
		]
	});
}
function defaultBoredPileProject() {
	return {
		projectName: "Demonstration Building Foundation",
		projectNumber: "BP-2026-EC7",
		client: "Structural & Geotechnical Consultants Ltd",
		designer: "Lead Geotechnical Engineer",
		groundLevel: 0,
		waterLevel: 2,
		diameter: 800,
		length: 25,
		concreteGrade: "C30/37",
		steelGrade: "B500B",
		fck: 30,
		fyk: 500,
		cover: 75,
		nEd: 2e3,
		mEd: 120,
		safetyFactor: 2.5,
		designApproach: "DA1-C2",
		numBars: 12,
		barDiameter: 25,
		spiralBarDiameter: 12,
		spiralSpacing: 200,
		stiffenerBarDiameter: 16,
		stiffenerSpacing: 1500,
		layers: [
			{
				id: "L1",
				name: "Made ground / fill",
				type: "fill",
				topDepth: 0,
				bottomDepth: 2,
				gamma: 18,
				gammaSat: 19,
				phi: 28,
				c: 0,
				cu: 0,
				sptN: 8,
				e50: 15e3,
				eoed: 12e3,
				eur: 45e3,
				nu: .3,
				permeability: 1e-5,
				ocr: 1,
				k0: .53,
				rInter: .7,
				drainage: "drained",
				method: "beta"
			},
			{
				id: "L2",
				name: "Soft clay",
				type: "clay",
				topDepth: 2,
				bottomDepth: 6,
				gamma: 17,
				gammaSat: 18,
				phi: 0,
				c: 0,
				cu: 25,
				sptN: 4,
				e50: 5e3,
				eoed: 4e3,
				eur: 15e3,
				nu: .45,
				permeability: 1e-9,
				ocr: 1,
				k0: .55,
				rInter: .6,
				drainage: "undrained",
				method: "alpha"
			},
			{
				id: "L3",
				name: "Medium-dense sand",
				type: "sand",
				topDepth: 6,
				bottomDepth: 12,
				gamma: 19,
				gammaSat: 20,
				phi: 32,
				c: 0,
				cu: 0,
				sptN: 22,
				e50: 3e4,
				eoed: 24e3,
				eur: 9e4,
				nu: .28,
				permeability: 1e-5,
				ocr: 1,
				k0: .47,
				rInter: .75,
				drainage: "drained",
				method: "beta"
			},
			{
				id: "L4",
				name: "Stiff clay",
				type: "stiff-clay",
				topDepth: 12,
				bottomDepth: 18,
				gamma: 19,
				gammaSat: 20,
				phi: 0,
				c: 0,
				cu: 100,
				sptN: 28,
				e50: 2e4,
				eoed: 16e3,
				eur: 6e4,
				nu: .42,
				permeability: 1e-9,
				ocr: 2,
				k0: .75,
				rInter: .65,
				drainage: "undrained",
				method: "alpha"
			},
			{
				id: "L5",
				name: "Dense sand (Toe founding)",
				type: "dense-sand",
				topDepth: 18,
				bottomDepth: 25,
				gamma: 20,
				gammaSat: 21,
				phi: 36,
				c: 0,
				cu: 0,
				sptN: 42,
				e50: 5e4,
				eoed: 4e4,
				eur: 15e4,
				nu: .25,
				permeability: 1e-4,
				ocr: 1,
				k0: .41,
				rInter: .8,
				drainage: "drained",
				method: "beta"
			}
		]
	};
}
function analyzeBoredPile(proj) {
	const D = proj.diameter / 1e3;
	const r = D / 2;
	const pileArea = Math.PI * r * r;
	const pilePerimeter = Math.PI * D;
	const resultsLayers = [];
	let totalShaft = 0;
	const pileLength = proj.length;
	for (const layer of proj.layers) {
		if (layer.topDepth >= pileLength) continue;
		const effectiveBottom = Math.min(layer.bottomDepth, pileLength);
		const effectiveLength = Math.max(0, effectiveBottom - layer.topDepth);
		if (effectiveLength <= 0) continue;
		const midDepth = layer.topDepth + effectiveLength / 2;
		const zWater = proj.waterLevel;
		let sigmaV0 = 0;
		if (midDepth <= zWater) sigmaV0 = layer.gamma * midDepth;
		else {
			const dryPart = layer.gamma * zWater;
			const subDepth = midDepth - zWater;
			sigmaV0 = dryPart + Math.max(1, (layer.gammaSat ?? layer.gamma) - 9.81) * subDepth;
		}
		sigmaV0 = Math.max(10, sigmaV0);
		let unitResistance = 0;
		let methodUsed = "";
		if (layer.method === "alpha" && layer.cu > 0) {
			const alpha = layer.cu <= 40 ? .55 : .45;
			unitResistance = alpha * layer.cu * 1e3;
			unitResistance = alpha * layer.cu;
			methodUsed = `Alpha method (α = ${alpha}, cu = ${layer.cu} kPa)`;
		} else {
			const phiRad = layer.phi * Math.PI / 180;
			const beta = .8 * Math.tan(phiRad * .75);
			unitResistance = beta * sigmaV0;
			methodUsed = `Beta method (β = ${beta.toFixed(2)}, σ'v0 = ${sigmaV0.toFixed(1)} kPa)`;
		}
		const shaftResLayer = unitResistance * pilePerimeter * effectiveLength;
		totalShaft += shaftResLayer;
		resultsLayers.push({
			layerId: layer.id,
			name: layer.name,
			thickness: layer.bottomDepth - layer.topDepth,
			effectiveLength,
			unitResistance,
			shaftResistance: Math.round(shaftResLayer * 10) / 10,
			methodUsed
		});
	}
	const toeLayer = proj.layers.find((l) => proj.length >= l.topDepth && proj.length <= l.bottomDepth) || proj.layers[proj.layers.length - 1];
	let baseUnitResistance = 0;
	if (toeLayer && toeLayer.phi > 0) {
		const phiRad = toeLayer.phi * Math.PI / 180;
		const Nq = Math.exp(Math.PI * Math.tan(phiRad)) * Math.pow(Math.tan(Math.PI / 4 + phiRad / 2), 2);
		const zToe = proj.length;
		const sigmaToe = toeLayer.gamma * Math.min(proj.waterLevel, zToe) + Math.max(0, zToe - proj.waterLevel) * ((toeLayer.gammaSat ?? toeLayer.gamma) - 9.81);
		baseUnitResistance = Math.min(5e3, sigmaToe * Math.min(Nq, 40));
	} else if (toeLayer) baseUnitResistance = 9 * (toeLayer.cu > 0 ? toeLayer.cu : 100);
	const baseResistance = baseUnitResistance * pileArea;
	const totalCharacteristicResistance = Math.round((totalShaft + baseResistance) * 10) / 10;
	const gammaT = Math.min(5, Math.max(2, proj.safetyFactor || 2.5));
	const designResistance = Math.round(totalCharacteristicResistance / gammaT * 10) / 10;
	const utilizationGeotechnical = designResistance > 0 ? Math.round(proj.nEd / designResistance * 1e3) / 1e3 : Number.POSITIVE_INFINITY;
	const Ec = 3e4;
	const grossAreaM2 = pileArea;
	const pileElasticSettlement = proj.nEd * proj.length / (grossAreaM2 * Ec * 1e3) * 1e3;
	const soilSettlement = totalCharacteristicResistance > 0 ? proj.nEd / (totalCharacteristicResistance * .7) * 4.5 : 0;
	const settlementTotal = Math.round((pileElasticSettlement + soilSettlement) * 10) / 10;
	const allowableSettlement = 25;
	const Ac = grossAreaM2 * 1e6;
	const barArea = Math.PI * Math.pow(proj.barDiameter / 2, 2);
	const rebarArea = proj.numBars * barArea;
	const reinforcementRatio = rebarArea / Ac * 100;
	const fcd = proj.fck / 1.5;
	const fyd = proj.fyk / 1.15;
	const structuralAxialResistance = Math.round((Ac * fcd + rebarArea * fyd) / 1e3 * 10) / 10;
	const utilizationStructural = Math.round(proj.nEd / structuralAxialResistance * 1e3) / 1e3;
	const kgPerMetre = (diameter) => diameter * diameter / 162;
	const cageDiameter = Math.max(.1, D - 2 * proj.cover / 1e3);
	const mainBarWeight = proj.numBars * proj.length * kgPerMetre(proj.barDiameter);
	const spiralWeight = Math.max(1, proj.length * 1e3 / proj.spiralSpacing) * Math.PI * cageDiameter * kgPerMetre(proj.spiralBarDiameter);
	const stiffenerWeight = Math.max(1, Math.ceil(proj.length * 1e3 / proj.stiffenerSpacing)) * Math.PI * cageDiameter * kgPerMetre(proj.stiffenerBarDiameter);
	const totalRebarWeight = mainBarWeight + spiralWeight + stiffenerWeight;
	let overallStatus = "PASS";
	if (utilizationGeotechnical > 1 || utilizationStructural > 1 || settlementTotal > allowableSettlement) overallStatus = "FAIL";
	else if (utilizationGeotechnical > .85 || utilizationStructural > .85) overallStatus = "WARNING";
	return {
		pileArea,
		pilePerimeter,
		layers: resultsLayers,
		totalShaftResistance: Math.round(totalShaft * 10) / 10,
		baseUnitResistance: Math.round(baseUnitResistance * 10) / 10,
		baseResistance: Math.round(baseResistance * 10) / 10,
		totalCharacteristicResistance,
		designResistance,
		utilizationGeotechnical,
		settlementElastic: Math.round(pileElasticSettlement * 10) / 10,
		settlementSoil: Math.round(soilSettlement * 10) / 10,
		settlementTotal,
		allowableSettlement,
		grossArea: Math.round(Ac),
		rebarArea: Math.round(rebarArea),
		reinforcementRatio: Math.round(reinforcementRatio * 100) / 100,
		structuralAxialResistance,
		utilizationStructural,
		mainBarWeight: Math.round(mainBarWeight * 10) / 10,
		spiralWeight: Math.round(spiralWeight * 10) / 10,
		stiffenerWeight: Math.round(stiffenerWeight * 10) / 10,
		totalRebarWeight: Math.round(totalRebarWeight * 10) / 10,
		overallStatus
	};
}
var emptyLayer = (index, topDepth) => ({
	id: `L${index}`,
	name: "Custom soil layer",
	type: "custom",
	behaviorType: "custom",
	topDepth,
	bottomDepth: topDepth + 2,
	gamma: 18,
	gammaSat: 19,
	gammaEffective: 9.2,
	phi: 30,
	c: 0,
	cu: 0,
	sptN: 0,
	cptQc: 0,
	e50: 2e4,
	eoed: 16e3,
	eur: 6e4,
	nu: .3,
	permeability: 1e-7,
	ocr: 1,
	initialVoidRatio: .7,
	compressionIndex: .2,
	recompressionIndex: .03,
	preconsolidationStress: 100,
	k0: .5,
	rInter: .7,
	characteristicShaftFriction: 0,
	characteristicBaseResistance: 0,
	drainage: "drained",
	method: "beta"
});
function csvCell(value) {
	const text = String(value ?? "");
	return /[",\n]/.test(text) ? `"${text.replaceAll("\"", "\"\"")}"` : text;
}
function parseCsvLine(line) {
	const cells = [];
	let cell = "";
	let quoted = false;
	for (let index = 0; index < line.length; index += 1) {
		const character = line[index];
		if (character === "\"" && line[index + 1] === "\"") {
			cell += "\"";
			index += 1;
		} else if (character === "\"") quoted = !quoted;
		else if (character === "," && !quoted) {
			cells.push(cell.trim());
			cell = "";
		} else cell += character;
	}
	cells.push(cell.trim());
	return cells;
}
function numberFrom(row, ...keys) {
	for (const key of keys) {
		const value = Number(row[key]);
		if (row[key] !== void 0 && Number.isFinite(value)) return value;
	}
}
function parseSoilCsv(text) {
	const lines = text.replace(/^\uFEFF/, "").split(/\r?\n/).filter((line) => line.trim());
	if (lines.length < 2 || lines[0].trim().startsWith("PK")) throw new Error("This file is an Excel workbook, not a CSV text file.");
	const headers = parseCsvLine(lines[0]).map((header) => header.toLowerCase().replace(/[^a-z0-9]/g, ""));
	return lines.slice(1).map((line, index) => {
		const values = parseCsvLine(line);
		const row = Object.fromEntries(headers.map((header, column) => [header, values[column] ?? ""]));
		const layer = emptyLayer(index + 1, numberFrom(row, "topdepth", "topdepthmbgl", "top", "depthtop") ?? index * 2);
		return {
			...layer,
			id: row.id || row.layer || `L${index + 1}`,
			name: row.name || row.soildescription || row.soildescriptionclassificationuscs || row.description || layer.name,
			type: row.type || (row.behaviortype?.toLowerCase().includes("cohesive") ? "clay" : row.behaviortype?.toLowerCase().includes("granular") ? "sand" : "custom"),
			behaviorType: row.behaviortype?.toLowerCase().includes("rock") ? "rock" : row.behaviortype?.toLowerCase().includes("cohesive") ? "cohesive" : row.behaviortype?.toLowerCase().includes("granular") ? "granular" : "custom",
			topDepth: numberFrom(row, "topdepth", "topdepthmbgl", "top", "depthtop") ?? layer.topDepth,
			bottomDepth: numberFrom(row, "bottomdepth", "bottomdepthmbgl", "bottom", "depthbottom") ?? layer.bottomDepth,
			gamma: numberFrom(row, "gamma", "gammatotal", "bulkunitweight", "bulkunitweightgamma", "unitweight") ?? layer.gamma,
			gammaSat: numberFrom(row, "gammasat", "saturatedunitweight") ?? (numberFrom(row, "effectiveunitweight", "effectiveunitweightgamma") !== void 0 ? numberFrom(row, "effectiveunitweight", "effectiveunitweightgamma") + 9.81 : layer.gammaSat),
			gammaEffective: numberFrom(row, "gammaeffective", "effectiveunitweight", "effectiveunitweightgamma", "gammaseffective") ?? layer.gammaEffective,
			phi: numberFrom(row, "phi", "phieffective", "effectivefrictionangle", "frictionangle") ?? layer.phi,
			c: numberFrom(row, "c", "cohesion", "effectivecohesionc") ?? layer.c,
			cu: numberFrom(row, "cu", "undrainedshearstrength", "undrainedshearstrengthcu") ?? layer.cu,
			sptN: numberFrom(row, "sptn", "spt", "sptnvalueblows300mm") ?? layer.sptN,
			cptQc: numberFrom(row, "cptqc", "qc", "cptconeres", "cptconeresqc") ?? layer.cptQc,
			e50: row.youngsmoduluse ? (numberFrom(row, "youngsmoduluse") ?? 0) * 1e3 : numberFrom(row, "e50", "e50ref") ?? layer.e50,
			eoed: row.oedometermoduluseoed ? (numberFrom(row, "oedometermoduluseoed") ?? 0) * 1e3 : numberFrom(row, "eoed", "oedometerstiffness") ?? layer.eoed,
			eur: numberFrom(row, "eur", "eurref") ?? layer.eur,
			nu: numberFrom(row, "nu", "poissonsratio") ?? layer.nu,
			permeability: numberFrom(row, "permeability", "k") ?? layer.permeability,
			ocr: numberFrom(row, "ocr") ?? layer.ocr,
			initialVoidRatio: numberFrom(row, "initialvoidratio", "initialvoidratioe0", "e0") ?? layer.initialVoidRatio,
			compressionIndex: numberFrom(row, "compressionindex", "compressionindexcc", "cc") ?? layer.compressionIndex,
			recompressionIndex: numberFrom(row, "recompressionindex", "recompressionindexcs", "cs") ?? layer.recompressionIndex,
			preconsolidationStress: numberFrom(row, "preconsolidationstress", "preconsolidationstressp0", "p0") ?? layer.preconsolidationStress,
			k0: numberFrom(row, "k0") ?? layer.k0,
			rInter: numberFrom(row, "rinter", "interfacefactor") ?? layer.rInter,
			characteristicShaftFriction: numberFrom(row, "characteristicshaftfriction", "charshaftfrictionqsk", "qsk") ?? layer.characteristicShaftFriction,
			characteristicBaseResistance: numberFrom(row, "characteristicbaseresistance", "charbaseresistanceqbk", "qbk") ?? layer.characteristicBaseResistance,
			drainage: (row.drainage || row.drainageconditionundraineddrained || "").toLowerCase().includes("undrained") ? "undrained" : layer.drainage,
			method: row.method === "alpha" || row.method === "empirical" ? row.method : layer.method
		};
	});
}
function parseSoilWorkbook(buffer) {
	const workbook = readSync(buffer, { type: "array" });
	const sheetName = workbook.SheetNames.find((name) => name.toLowerCase().includes("custom ground profile")) || workbook.SheetNames[0];
	const sheet = workbook.Sheets[sheetName];
	if (!sheet) throw new Error("The workbook does not contain a worksheet.");
	const matrix = utils.sheet_to_json(sheet, {
		header: 1,
		defval: ""
	});
	const headerIndex = matrix.findIndex((row) => String(row[0]).toLowerCase().replace(/[^a-z0-9]/g, "") === "layerid");
	if (headerIndex < 0) throw new Error("Could not find the v2 Layer ID header row.");
	const headers = (matrix[headerIndex] ?? []).map((header) => String(header));
	const dataRows = matrix.slice(headerIndex + 1).filter((row) => String(row[0]).trim());
	return parseSoilCsv([headers.map(csvCell).join(","), ...dataRows.map((row) => headers.map((_, index) => csvCell(row[index])).join(","))].join("\n"));
}
var v2TemplateHeaders = [
	"Layer ID",
	"Top Depth (m bgl)",
	"Bottom Depth (m bgl)",
	"Thickness (m)",
	"Soil Description & Classification (USCS)",
	"Behavior Type (Cohesive/Granular/Rock)",
	"Drainage Condition (Undrained/Drained)",
	"Bulk Unit Weight gamma (kN/m3)",
	"Effective Unit Weight gamma' (kN/m3)",
	"SPT N-value (blows/300mm)",
	"CPT Cone Res. qc (MPa)",
	"Undrained Shear Strength cu (kPa)",
	"Effective Friction Angle phi' (deg)",
	"Effective Cohesion c' (kPa)",
	"Young's Modulus E' (MPa)",
	"Oedometer Modulus Eoed (MPa)",
	"Initial Void Ratio e0",
	"Compression Index Cc",
	"Recompression Index Cs",
	"Preconsolidation Stress p0 (kPa)",
	"Overconsolidation Ratio OCR",
	"Char. Shaft Friction qs,k (kPa)",
	"Char. Base Resistance qb,k (kPa)"
];
function v2Row(layer) {
	return [
		layer.id,
		layer.topDepth,
		layer.bottomDepth,
		layer.bottomDepth - layer.topDepth,
		layer.name,
		layer.behaviorType ?? "custom",
		layer.drainage,
		layer.gamma,
		layer.gammaEffective ?? layer.gammaSat,
		layer.sptN ?? "",
		layer.cptQc ?? "",
		layer.cu,
		layer.phi,
		layer.c,
		layer.e50 ? layer.e50 / 1e3 : "",
		layer.eoed ? layer.eoed / 1e3 : "",
		layer.initialVoidRatio ?? "",
		layer.compressionIndex ?? "",
		layer.recompressionIndex ?? "",
		layer.preconsolidationStress ?? "",
		layer.ocr ?? "",
		layer.characteristicShaftFriction ?? "",
		layer.characteristicBaseResistance ?? ""
	];
}
function downloadV2Template(layers) {
	const workbook = utils.book_new();
	const sheet = utils.aoa_to_sheet([
		["EUROCODE 7 - BOREHOLE SOIL STRATA MODEL"],
		["Fill the layer table below, save as .xlsx, then import it into the bored pile soil model."],
		[],
		v2TemplateHeaders,
		...layers.map(v2Row)
	]);
	utils.book_append_sheet(workbook, sheet, "Custom Ground Profile");
	const output = writeSync(workbook, {
		bookType: "xlsx",
		type: "array"
	});
	const url = URL.createObjectURL(new Blob([output], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" }));
	const link = document.createElement("a");
	link.href = url;
	link.download = "borehole_soil_data_template-v2.xlsx";
	link.click();
	URL.revokeObjectURL(url);
}
function soilLayerColor(layer) {
	if (layer.type === "clay" || layer.type === "stiff-clay" || layer.drainage === "undrained") return {
		fill: "#64748b",
		stroke: "#94a3b8"
	};
	if (layer.type === "sand" || layer.type === "dense-sand") return {
		fill: "#b38b55",
		stroke: "#e1b978"
	};
	if (layer.type === "fill") return {
		fill: "#7d6650",
		stroke: "#c4a574"
	};
	return {
		fill: "#386477",
		stroke: "#67e8f9"
	};
}
function soilPatternId(layer) {
	if (layer.behaviorType === "rock" || layer.type === "custom" && layer.name.toLowerCase().includes("rock")) return "soil-pattern-rock";
	if (layer.type === "clay" || layer.type === "stiff-clay" || layer.drainage === "undrained") return "soil-pattern-clay";
	if (layer.type === "sand" || layer.type === "dense-sand") return "soil-pattern-sand";
	if (layer.type === "fill") return "soil-pattern-fill";
	return "soil-pattern-custom";
}
function BoredPileView() {
	const userEmail = useProject((s) => s.userEmail);
	const logout = useProject((s) => s.logout);
	const setActiveModule = useProject((s) => s.setActiveModule);
	const [project, setProject] = (0, import_react.useState)(defaultBoredPileProject());
	const [activeTab, setActiveTab] = (0, import_react.useState)("overview");
	const [soilMessage, setSoilMessage] = (0, import_react.useState)("");
	const [selectedLayerId, setSelectedLayerId] = (0, import_react.useState)(null);
	const results = (0, import_react.useMemo)(() => analyzeBoredPile(project), [project]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-[#07111f] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200 relative overflow-x-hidden",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-[linear-gradient(to_right,#16263d_1px,transparent_1px),linear-gradient(to_bottom,#16263d_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-35 pointer-events-none" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "relative z-20 border-b border-[#1e3a5f]/60 bg-[#060e18]/95 backdrop-blur-md px-6 py-4 flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setActiveModule("modules"),
							className: "flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 font-mono text-xs transition duration-150",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Modules Dashboard" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-5 w-px bg-slate-700 hidden sm:block" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "font-display text-sm sm:text-base font-bold tracking-wider text-white uppercase",
							children: "BORED PILE DESIGN & VERIFICATION"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] font-mono text-cyan-400",
							children: "EN 1997-1 Geotechnical & EN 1992-1-1 Structural Design Suite"
						})] })
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3 font-mono text-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0b192c] border border-slate-700/70 text-slate-300",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-2 rounded-full bg-emerald-500 animate-pulse" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: userEmail || "str.design.test" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: logout,
						className: "flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-rose-950/80 hover:border-rose-700/60 border border-slate-700 text-slate-300 hover:text-rose-300 transition duration-150",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "size-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Logout" })]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "relative z-15 bg-[#040910]/90 border-b border-[#1e3a5f]/80 px-6 flex overflow-x-auto gap-1 font-mono text-xs",
				children: [
					{
						id: "overview",
						label: "1. Overview & HUD",
						icon: Compass
					},
					{
						id: "soil",
						label: "2. Soil Strata & Water",
						icon: Database
					},
					{
						id: "geometry",
						label: "3. Geometry & Loads",
						icon: SlidersVertical
					},
					{
						id: "geotechnical",
						label: "4. Geotechnical ULS",
						icon: ShieldCheck
					},
					{
						id: "settlement",
						label: "5. Settlement SLS",
						icon: Calculator
					},
					{
						id: "rc",
						label: "6. RC Structural (EC2)",
						icon: Layers
					},
					{
						id: "report",
						label: "7. Calculation Report",
						icon: FileText
					}
				].map((tab) => {
					const Icon = tab.icon;
					const isActive = activeTab === tab.id;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setActiveTab(tab.id),
						className: `flex items-center gap-2 px-4 py-3 border-b-2 font-medium transition whitespace-nowrap ${isActive ? "border-cyan-400 text-cyan-300 bg-cyan-950/40" : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: `size-4 ${isActive ? "text-cyan-400" : "text-slate-500"}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: tab.label })]
					}, tab.id);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "relative z-10 flex-1 w-full max-w-none mx-auto p-4 sm:p-6 flex flex-col",
				children: [
					activeTab === "overview" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "w-full max-w-none space-y-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "bg-[#081222]/90 border border-cyan-500/30 rounded-xl p-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs font-mono text-slate-400",
											children: "Design Axial Load (N_Ed)"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-2xl font-mono font-bold text-white mt-1",
											children: [
												project.nEd,
												" ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-xs text-cyan-400",
													children: "kN"
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[11px] font-mono text-slate-500 mt-1",
											children: "Applied ULS compression"
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "bg-[#081222]/90 border border-cyan-500/30 rounded-xl p-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs font-mono text-slate-400",
											children: "End Bearing (R_b,k)"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-2xl font-mono font-bold text-cyan-300 mt-1",
											children: [
												results.baseResistance,
												" ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-xs text-cyan-400",
													children: "kN"
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-[11px] font-mono text-slate-500 mt-1",
											children: [
												"q_b,k = ",
												results.baseUnitResistance,
												" kPa"
											]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "bg-[#081222]/90 border border-cyan-500/30 rounded-xl p-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs font-mono text-slate-400",
											children: "Shaft Friction (R_s,k)"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-2xl font-mono font-bold text-cyan-300 mt-1",
											children: [
												results.totalShaftResistance,
												" ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-xs text-cyan-400",
													children: "kN"
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[11px] font-mono text-slate-500 mt-1",
											children: "Layer-by-layer integration"
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "bg-[#081222]/90 border border-cyan-500/30 rounded-xl p-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs font-mono text-slate-400",
											children: "Total Characteristic (R_c,k)"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-2xl font-mono font-bold text-cyan-300 mt-1",
											children: [
												results.totalCharacteristicResistance,
												" ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-xs text-cyan-400",
													children: "kN"
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[11px] font-mono text-slate-500 mt-1",
											children: "End bearing + shaft friction"
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "bg-[#081222]/90 border border-amber-500/30 rounded-xl p-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs font-mono text-slate-400",
											children: "Design Resistance (R_c,d)"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-2xl font-mono font-bold text-amber-300 mt-1",
											children: [
												results.designResistance,
												" ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-xs text-amber-400",
													children: "kN"
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-[11px] font-mono text-slate-500 mt-1",
											children: [
												"R_c,k / SF ",
												project.safetyFactor.toFixed(1),
												" · ",
												project.designApproach
											]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "bg-[#081222]/90 border border-cyan-500/30 rounded-xl p-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs font-mono text-slate-400",
											children: "Geotechnical Utilization"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: `text-2xl font-mono font-bold mt-1 ${results.utilizationGeotechnical <= 1 ? "text-emerald-400" : "text-rose-400"}`,
											children: [(results.utilizationGeotechnical * 100).toFixed(1), "%"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-[11px] font-mono text-slate-500 mt-1",
											children: results.utilizationGeotechnical <= 1 ? "PASS (Adequate)" : "FAIL (Overstressed)"
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "bg-[#081222]/90 border border-cyan-500/30 rounded-xl p-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs font-mono text-slate-400",
											children: "Total Settlement (SLS)"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: `text-2xl font-mono font-bold mt-1 ${results.settlementTotal <= results.allowableSettlement ? "text-cyan-300" : "text-amber-400"}`,
											children: [
												results.settlementTotal,
												" ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-xs text-cyan-400",
													children: "mm"
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-[11px] font-mono text-slate-500 mt-1",
											children: [
												"Limit: ",
												results.allowableSettlement,
												" mm"
											]
										})
									]
								})
							]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-1 lg:grid-cols-12 gap-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "lg:col-span-8 bg-[#040910]/95 border border-cyan-500/30 rounded-2xl p-6 flex flex-col justify-between",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between text-xs font-mono text-cyan-300 border-b border-cyan-900/60 pb-3 mb-4",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "BORED PILE SOIL PROFILE & STRATIFICATION" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-emerald-400 font-bold",
											children: "EC7 COMPLIANT"
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "relative flex-1 flex items-center justify-center py-4 min-h-[560px]",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
											viewBox: "0 0 760 560",
											className: "w-full h-[540px]",
											role: "img",
											"aria-label": "Bored pile soil profile and stratification overview",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("defs", { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pattern", {
													id: "soil-pattern-fill",
													width: "18",
													height: "18",
													patternUnits: "userSpaceOnUse",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
														d: "M2 4l3-2M11 8l4-3M5 15l4-2M15 16l2-2",
														stroke: "#e2c99b",
														strokeWidth: "1.4",
														opacity: "0.7"
													})
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pattern", {
													id: "soil-pattern-clay",
													width: "20",
													height: "20",
													patternUnits: "userSpaceOnUse",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
														d: "M0 5c4-3 7 3 10 0s6 3 10 0M0 15c4-3 7 3 10 0s6 3 10 0",
														fill: "none",
														stroke: "#cbd5e1",
														strokeWidth: "1.1",
														opacity: "0.55"
													})
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("pattern", {
													id: "soil-pattern-sand",
													width: "18",
													height: "18",
													patternUnits: "userSpaceOnUse",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
															cx: "3",
															cy: "4",
															r: "1.3",
															fill: "#f1d19a"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
															cx: "11",
															cy: "8",
															r: "1.1",
															fill: "#f1d19a"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
															cx: "6",
															cy: "15",
															r: "1.2",
															fill: "#f1d19a"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
															cx: "16",
															cy: "14",
															r: "1",
															fill: "#f1d19a"
														})
													]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pattern", {
													id: "soil-pattern-rock",
													width: "24",
													height: "24",
													patternUnits: "userSpaceOnUse",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
														d: "M1 17L8 4l7 5 7-6M4 23l6-8 6 3 7-7",
														fill: "none",
														stroke: "#d6d3d1",
														strokeWidth: "1.3",
														opacity: "0.65"
													})
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pattern", {
													id: "soil-pattern-custom",
													width: "20",
													height: "20",
													patternUnits: "userSpaceOnUse",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
														d: "M0 10h20M10 0v20",
														stroke: "#a5f3fc",
														strokeWidth: "0.8",
														opacity: "0.35"
													})
												})
											] }), (() => {
												const maxDepth = Math.max(project.length, ...project.layers.map((layer) => layer.bottomDepth), 1);
												const top = 48;
												const bottom = 510;
												const scale = 462 / maxDepth;
												return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
														x: "120",
														y: top,
														width: "300",
														height: 462,
														fill: "#0a1525",
														stroke: "#334155"
													}),
													project.layers.map((layer) => {
														const y = top + Math.max(0, layer.topDepth) * scale;
														const height = Math.max(5, (Math.min(maxDepth, layer.bottomDepth) - Math.max(0, layer.topDepth)) * scale);
														const colors = soilLayerColor(layer);
														return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
																x: "120",
																y,
																width: "300",
																height,
																fill: colors.fill,
																fillOpacity: "0.55",
																stroke: colors.stroke
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
																x: "120",
																y,
																width: "300",
																height,
																fill: `url(#${soilPatternId(layer)})`
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
																x1: "420",
																y1: y + height / 2,
																x2: "450",
																y2: y + height / 2,
																stroke: colors.stroke
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("text", {
																x: "460",
																y: y + height / 2 + 5,
																fill: "#f8fafc",
																fontSize: "14",
																fontFamily: "monospace",
																children: [
																	layer.id,
																	" · ",
																	layer.name.slice(0, 30)
																]
															})
														] }, layer.id);
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
														x1: "120",
														y1: top + project.waterLevel * scale,
														x2: "420",
														y2: top + project.waterLevel * scale,
														stroke: "#38bdf8",
														strokeWidth: "3",
														strokeDasharray: "8 5"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("text", {
														x: "130",
														y: top + project.waterLevel * scale - 10,
														fill: "#7dd3fc",
														fontSize: "13",
														fontFamily: "monospace",
														children: [
															"GWL -",
															project.waterLevel.toFixed(1),
															" m"
														]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
														x: 270 - Math.max(26, Math.min(54, project.diameter / 22)) / 2,
														y: top,
														width: Math.max(26, Math.min(54, project.diameter / 22)),
														height: Math.min(project.length, maxDepth) * scale,
														fill: "#22d3ee",
														fillOpacity: "0.28",
														stroke: "#67e8f9",
														strokeWidth: "3"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
														x1: "270",
														y1: "14",
														x2: "270",
														y2: 46,
														stroke: "#fbbf24",
														strokeWidth: "4"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("polygon", {
														points: `262,38 270,${top} 278,38`,
														fill: "#fbbf24"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("text", {
														x: "290",
														y: "25",
														fill: "#fbbf24",
														fontSize: "14",
														fontFamily: "monospace",
														fontWeight: "bold",
														children: [
															"N_Ed ",
															project.nEd,
															" kN"
														]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
														x1: "120",
														y1: top + project.length * scale,
														x2: "420",
														y2: top + project.length * scale,
														stroke: "#fbbf24",
														strokeWidth: "2",
														strokeDasharray: "4 3"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("text", {
														x: "130",
														y: Math.min(545, top + project.length * scale + 18),
														fill: "#fbbf24",
														fontSize: "13",
														fontFamily: "monospace",
														children: [
															"PILE TOE ",
															project.length.toFixed(1),
															" m"
														]
													}),
													Array.from({ length: Math.floor(maxDepth / 5) + 1 }, (_, index) => index * 5).map((depth) => {
														const y = top + depth * scale;
														return y <= bottom ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("text", {
															x: "74",
															y: y + 5,
															fill: "#64748b",
															fontSize: "11",
															fontFamily: "monospace",
															children: [depth, "m"]
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
															x1: "105",
															y1: y,
															x2: "120",
															y2: y,
															stroke: "#64748b"
														})] }, depth) : null;
													})
												] });
											})()]
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "pt-3 border-t border-cyan-900/60 flex items-center justify-between text-xs font-mono text-slate-300",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Pile Diameter: ", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", {
												className: "text-cyan-400",
												children: [project.diameter, " mm"]
											})] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Pile Length: ", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", {
												className: "text-cyan-400",
												children: [project.length, " m"]
											})] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
												"Overall Status:",
												" ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
													className: "text-emerald-400",
													children: results.overallStatus
												})
											] })
										]
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "lg:col-span-4 bg-[#081222]/95 border border-cyan-500/30 rounded-2xl p-6 flex flex-col justify-between",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
									className: "font-display text-base font-bold text-white mb-4 flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlidersVertical, { className: "size-4 text-cyan-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Quick Pile Parameters" })]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-4 font-mono text-xs",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-between text-slate-300 mb-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Pile Diameter (D):" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-cyan-400 font-bold",
												children: [project.diameter, " mm"]
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "range",
											min: "600",
											max: "1500",
											step: "100",
											value: project.diameter,
											onChange: (e) => setProject({
												...project,
												diameter: parseInt(e.target.value)
											}),
											className: "w-full accent-cyan-500 cursor-pointer"
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-between text-slate-300 mb-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Pile Length (L):" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-cyan-400 font-bold",
												children: [project.length, " m"]
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "range",
											min: "10",
											max: "35",
											step: "1",
											value: project.length,
											onChange: (e) => setProject({
												...project,
												length: parseFloat(e.target.value)
											}),
											className: "w-full accent-cyan-500 cursor-pointer"
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex justify-between text-slate-300 mb-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Design Axial Load (N_Ed):" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-cyan-400 font-bold",
												children: [project.nEd, " kN"]
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "range",
											min: "1000",
											max: "5000",
											step: "100",
											value: project.nEd,
											onChange: (e) => setProject({
												...project,
												nEd: parseFloat(e.target.value)
											}),
											className: "w-full accent-cyan-500 cursor-pointer"
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "border-t border-cyan-900/60 pt-4 space-y-3",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center justify-between text-slate-300",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Safety factor for pile resistance" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", {
														className: "text-amber-300",
														children: ["SF ", project.safetyFactor.toFixed(1)]
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "range",
													min: "2",
													max: "5",
													step: "0.1",
													value: project.safetyFactor,
													onChange: (e) => setProject({
														...project,
														safetyFactor: Number(e.target.value)
													}),
													className: "w-full accent-amber-500 cursor-pointer"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex justify-between text-[10px] text-slate-500",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "2.0" }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "EN 1997 project selection" }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "5.0" })
													]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
													className: "block",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "mb-1 block text-slate-400",
														children: "Design approach"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
														value: project.designApproach,
														onChange: (e) => setProject({
															...project,
															designApproach: e.target.value
														}),
														className: "w-full rounded border border-slate-700 bg-[#040910] p-2 text-white",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
																value: "DA1-C1",
																children: "DA1 Combination 1"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
																value: "DA1-C2",
																children: "DA1 Combination 2"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
																value: "DA2",
																children: "DA2"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
																value: "DA3",
																children: "DA3"
															})
														]
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-[10px] leading-relaxed text-amber-200/70",
													children: "Preliminary selection only. Confirm the resistance factor and National Annex rules for the adopted EN 1997 design approach."
												})
											]
										})
									]
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "pt-4 border-t border-cyan-900/60 mt-6",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: () => setActiveTab("geotechnical"),
										className: "w-full py-2.5 px-4 bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-semibold rounded-lg flex items-center justify-center gap-2 transition shadow-lg",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "View Geotechnical ULS Analysis" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-4 rotate-180" })]
									})
								})]
							})]
						})]
					}),
					activeTab === "soil" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-6",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "bg-[#081222]/95 border border-cyan-500/30 rounded-2xl p-6",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-between border-b border-cyan-900/60 pb-4 mb-6",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "font-display text-xl font-bold text-white",
									children: "Custom Soil Model"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-mono text-slate-400 mt-1",
									children: "Layered ground profile with GEO5 / PLAXIS-style material inputs"
								})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-wrap justify-end gap-2 font-mono text-xs",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
											className: "inline-flex items-center gap-2 px-3 py-2 rounded bg-cyan-950/80 border border-cyan-700 text-cyan-300 cursor-pointer",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "size-3.5" }),
												" Import Excel / CSV",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "file",
													accept: ".csv,.xlsx,text/csv,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
													className: "hidden",
													onChange: async (event) => {
														const file = event.target.files?.[0];
														if (!file) return;
														try {
															const buffer = await file.arrayBuffer();
															const layers = new TextDecoder().decode(buffer.slice(0, 2)) === "PK" ? parseSoilWorkbook(buffer) : parseSoilCsv(new TextDecoder().decode(buffer));
															setProject({
																...project,
																layers
															});
															setSoilMessage(`${layers.length} layer(s) imported from ${file.name}`);
														} catch (error) {
															setSoilMessage(error instanceof Error ? error.message : "Could not read the soil file.");
														}
														event.target.value = "";
													}
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											onClick: () => downloadV2Template(project.layers),
											className: "inline-flex items-center gap-2 px-3 py-2 rounded bg-cyan-950 border border-cyan-700 text-cyan-200 hover:bg-cyan-900",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-3.5" }), " Download v2 Template"]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											onClick: () => {
												const headers = [
													"id",
													"name",
													"type",
													"topDepth",
													"bottomDepth",
													"gamma",
													"gammaSat",
													"phi",
													"c",
													"cu",
													"sptN",
													"e50",
													"eoed",
													"eur",
													"nu",
													"permeability",
													"ocr",
													"k0",
													"rInter",
													"drainage",
													"method"
												];
												const rows = project.layers.map((layer) => headers.map((header) => csvCell(layer[header])).join(","));
												const blob = new Blob([[headers.join(","), ...rows].join("\n")], { type: "text/csv;charset=utf-8" });
												const url = URL.createObjectURL(blob);
												const link = document.createElement("a");
												link.href = url;
												link.download = "bored-pile-soil-model.csv";
												link.click();
												URL.revokeObjectURL(url);
											},
											className: "inline-flex items-center gap-2 px-3 py-2 rounded bg-slate-800 border border-slate-600 text-slate-200 hover:bg-slate-700",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Download, { className: "size-3.5" }), " Export CSV"]
										})
									]
								})]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid grid-cols-1 xl:grid-cols-[minmax(0,1fr)_minmax(600px,1.25fr)] 2xl:grid-cols-[minmax(0,0.92fr)_minmax(680px,1.35fr)] gap-6 items-start",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "bg-[#081222]/95 border border-cyan-500/30 rounded-2xl p-6",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mb-5 grid grid-cols-1 md:grid-cols-3 gap-3 font-mono text-xs",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "p-3 rounded-lg bg-[#040910] border border-slate-800 text-slate-300",
												children: ["Layers: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
													className: "text-cyan-300",
													children: project.layers.length
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
												className: "rounded-lg border border-cyan-700/70 bg-cyan-950/40 p-3 text-slate-300",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "mb-1 block text-[10px] uppercase tracking-wide text-cyan-300",
														children: "Groundwater level (m bgl)"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
														type: "number",
														min: "0",
														step: "0.1",
														value: project.waterLevel,
														onChange: (event) => setProject({
															...project,
															waterLevel: Math.max(0, Number(event.target.value) || 0)
														}),
														className: "w-full rounded border border-cyan-700 bg-[#040910] px-2 py-1.5 text-base font-bold text-cyan-200"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "mt-1 block text-[10px] text-slate-500",
														children: "Below ground level; updates effective stress and diagrams."
													})
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "p-3 rounded-lg bg-[#040910] border border-slate-800 text-slate-300",
												children: [
													"Pile toe:",
													" ",
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", {
														className: "text-cyan-300",
														children: [project.length.toFixed(2), " m"]
													})
												]
											})
										]
									}),
									soilMessage && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mb-4 rounded-lg border border-amber-500/40 bg-amber-950/30 p-3 font-mono text-xs text-amber-200",
										children: soilMessage
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "space-y-4",
										children: project.layers.map((layer, index) => {
											const updateLayer = (patch) => {
												setProject({
													...project,
													layers: project.layers.map((item, itemIndex) => itemIndex === index ? {
														...item,
														...patch
													} : item)
												});
											};
											const input = (label, key, unit = "") => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
												className: "block",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "mb-1 block text-[10px] uppercase tracking-wide text-slate-500",
													children: [label, unit && ` (${unit})`]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "number",
													step: "any",
													value: typeof layer[key] === "number" ? layer[key] : "",
													onChange: (event) => updateLayer({ [key]: Number(event.target.value) }),
													className: "w-full rounded border border-slate-700 bg-[#040910] px-2 py-1.5 text-white"
												})]
											});
											return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
												className: "rounded-xl border border-cyan-900/60 bg-[#040910]/80 p-4",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "mb-4 flex items-center justify-between gap-3",
														children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
															className: "flex items-center gap-3",
															children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "rounded bg-cyan-950 px-2 py-1 font-mono text-xs font-bold text-cyan-300",
																children: layer.id
															}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
																value: layer.name,
																onChange: (event) => updateLayer({ name: event.target.value }),
																className: "min-w-0 border-b border-slate-700 bg-transparent px-1 py-1 font-semibold text-white outline-none focus:border-cyan-400"
															})]
														}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
															title: "Remove layer",
															onClick: () => setProject({
																...project,
																layers: project.layers.filter((_, itemIndex) => itemIndex !== index)
															}),
															className: "rounded p-2 text-slate-500 hover:bg-rose-950/60 hover:text-rose-300",
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
														})]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "mb-3 border-b border-slate-800 pb-2 font-mono text-[10px] uppercase tracking-[0.14em] text-cyan-400",
														children: "1. Stratum geometry and basic classification"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-8 font-mono text-xs",
														children: [
															input("Top", "topDepth", "m"),
															input("Bottom", "bottomDepth", "m"),
															input("γ total", "gamma", "kN/m³"),
															input("γ saturated", "gammaSat", "kN/m³"),
															input("SPT N", "sptN"),
															input("CPT qc", "cptQc", "MPa"),
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "mb-1 block text-[10px] uppercase tracking-wide text-slate-500",
																children: "Behavior type"
															}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
																value: layer.behaviorType ?? "custom",
																onChange: (event) => updateLayer({ behaviorType: event.target.value }),
																className: "w-full rounded border border-slate-700 bg-[#040910] px-2 py-1.5 text-white",
																children: [
																	/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
																		value: "cohesive",
																		children: "Cohesive"
																	}),
																	/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
																		value: "granular",
																		children: "Granular"
																	}),
																	/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
																		value: "rock",
																		children: "Rock"
																	}),
																	/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
																		value: "custom",
																		children: "Custom"
																	})
																]
															})] }),
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "mb-1 block text-[10px] uppercase tracking-wide text-slate-500",
																children: "Drainage condition"
															}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
																value: layer.drainage ?? "drained",
																onChange: (event) => updateLayer({
																	drainage: event.target.value,
																	method: event.target.value === "undrained" ? "alpha" : "beta"
																}),
																className: "w-full rounded border border-slate-700 bg-[#040910] px-2 py-1.5 text-white",
																children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
																	value: "drained",
																	children: "Drained"
																}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
																	value: "undrained",
																	children: "Undrained"
																})]
															})] })
														]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "mb-3 mt-5 border-b border-slate-800 pb-2 font-mono text-[10px] uppercase tracking-[0.14em] text-cyan-400",
														children: "2. Strength and stiffness parameters"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-8 font-mono text-xs",
														children: [
															input("φ'", "phi", "°"),
															input("c'", "c", "kPa"),
															input("cu", "cu", "kPa"),
															input("E' / E50", "e50", "kPa"),
															input("Eoed", "eoed", "kPa"),
															input("Eur", "eur", "kPa"),
															input("ν", "nu"),
															input("Permeability", "permeability", "m/s")
														]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "mb-3 mt-5 border-b border-slate-800 pb-2 font-mono text-[10px] uppercase tracking-[0.14em] text-cyan-400",
														children: "3. Consolidation and pile resistance"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-8 font-mono text-xs",
														children: [
															input("OCR", "ocr"),
															input("K0", "k0"),
															input("Rinter", "rInter"),
															input("e0", "initialVoidRatio"),
															input("Cc", "compressionIndex"),
															input("Cs", "recompressionIndex"),
															input("p0", "preconsolidationStress", "kPa"),
															input("qs,k", "characteristicShaftFriction", "kPa"),
															input("qb,k", "characteristicBaseResistance", "kPa"),
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "mb-1 block text-[10px] uppercase tracking-wide text-slate-500",
																children: "Material type"
															}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
																value: layer.type,
																onChange: (event) => updateLayer({ type: event.target.value }),
																className: "w-full rounded border border-slate-700 bg-[#040910] px-2 py-1.5 text-white",
																children: [
																	/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
																		value: "custom",
																		children: "Custom"
																	}),
																	/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
																		value: "fill",
																		children: "Fill"
																	}),
																	/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
																		value: "sand",
																		children: "Sand"
																	}),
																	/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
																		value: "dense-sand",
																		children: "Dense sand"
																	}),
																	/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
																		value: "clay",
																		children: "Clay"
																	}),
																	/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
																		value: "stiff-clay",
																		children: "Stiff clay"
																	})
																]
															})] })
														]
													})
												]
											}, layer.id);
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-5 flex flex-wrap items-center gap-3 font-mono text-xs",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											onClick: () => setProject({
												...project,
												layers: [...project.layers, emptyLayer(project.layers.length + 1, project.layers.at(-1)?.bottomDepth ?? 0)]
											}),
											className: "inline-flex items-center gap-2 rounded-lg bg-cyan-600 px-4 py-2 font-semibold text-white hover:bg-cyan-500",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), " Add soil layer"]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-slate-500",
											children: "Parameters are user inputs; verify values against the geotechnical investigation before issuing design."
										})]
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
								className: "xl:sticky xl:top-6 min-h-[900px] bg-[#081222]/95 border border-cyan-500/30 rounded-2xl p-6",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start justify-between gap-4 border-b border-cyan-900/60 pb-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "font-display text-xl font-bold text-white",
										children: "Ground Cross-Section"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 font-mono text-xs text-slate-400",
										children: "Live profile preview • click a stratum to focus it"
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "rounded border border-emerald-500/40 bg-emerald-950/40 px-2 py-1 font-mono text-[10px] text-emerald-300",
										children: "LIVE"
									})]
								}), (() => {
									const maxDepth = Math.max(project.length, ...project.layers.map((layer) => layer.bottomDepth), 1);
									const top = 48;
									const bottom = 770;
									const scale = 722 / maxDepth;
									const pileWidth = Math.max(22, Math.min(48, project.diameter / 25));
									const waterY = top + Math.max(0, project.waterLevel) * scale;
									return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-4",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
											viewBox: "0 0 760 820",
											className: "h-[820px] w-full overflow-visible",
											role: "img",
											"aria-label": "Interactive bored pile soil cross-section",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("defs", { children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pattern", {
														id: "soil-pattern-fill",
														width: "18",
														height: "18",
														patternUnits: "userSpaceOnUse",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
															d: "M2 4l3-2M11 8l4-3M5 15l4-2M15 16l2-2",
															stroke: "#e2c99b",
															strokeWidth: "1.4",
															opacity: "0.7"
														})
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pattern", {
														id: "soil-pattern-clay",
														width: "20",
														height: "20",
														patternUnits: "userSpaceOnUse",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
															d: "M0 5c4-3 7 3 10 0s6 3 10 0M0 15c4-3 7 3 10 0s6 3 10 0",
															fill: "none",
															stroke: "#cbd5e1",
															strokeWidth: "1.1",
															opacity: "0.55"
														})
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("pattern", {
														id: "soil-pattern-sand",
														width: "18",
														height: "18",
														patternUnits: "userSpaceOnUse",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
																cx: "3",
																cy: "4",
																r: "1.3",
																fill: "#f1d19a"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
																cx: "11",
																cy: "8",
																r: "1.1",
																fill: "#f1d19a"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
																cx: "6",
																cy: "15",
																r: "1.2",
																fill: "#f1d19a"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
																cx: "16",
																cy: "14",
																r: "1",
																fill: "#f1d19a"
															})
														]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pattern", {
														id: "soil-pattern-rock",
														width: "24",
														height: "24",
														patternUnits: "userSpaceOnUse",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
															d: "M1 17L8 4l7 5 7-6M4 23l6-8 6 3 7-7",
															fill: "none",
															stroke: "#d6d3d1",
															strokeWidth: "1.3",
															opacity: "0.65"
														})
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pattern", {
														id: "soil-pattern-custom",
														width: "20",
														height: "20",
														patternUnits: "userSpaceOnUse",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
															d: "M0 10h20M10 0v20",
															stroke: "#a5f3fc",
															strokeWidth: "0.8",
															opacity: "0.35"
														})
													})
												] }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
													x: "160",
													y: top,
													width: "360",
													height: 722,
													rx: "3",
													fill: "#0a1525",
													stroke: "#334155"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
													x: "160",
													y: top,
													width: "360",
													height: 722,
													fill: "url(#soil-hatch)",
													pointerEvents: "none"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
													x1: "160",
													y1: top,
													x2: "520",
													y2: top,
													stroke: "#f8fafc",
													strokeWidth: "2"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
													x: "160",
													y: "26",
													fill: "#cbd5e1",
													fontSize: "13",
													fontFamily: "monospace",
													children: "GROUND LEVEL 0.00 m"
												}),
												project.layers.map((layer) => {
													const y = top + Math.max(0, layer.topDepth) * scale;
													const height = Math.max(4, (Math.min(maxDepth, layer.bottomDepth) - Math.max(0, layer.topDepth)) * scale);
													const colors = soilLayerColor(layer);
													const selected = selectedLayerId === layer.id;
													return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", {
														onClick: () => setSelectedLayerId(layer.id),
														className: "cursor-pointer",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
																x: "160",
																y,
																width: "360",
																height,
																fill: colors.fill,
																fillOpacity: selected ? .72 : .42,
																stroke: selected ? "#f8fafc" : colors.stroke,
																strokeWidth: selected ? 2 : 1
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
																x: "160",
																y,
																width: "360",
																height,
																fill: `url(#${soilPatternId(layer)})`
															}),
															height > 8 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
																x1: "520",
																y1: y + Math.min(height / 2, 12),
																x2: "542",
																y2: y + Math.min(height / 2, 12),
																stroke: selected ? "#f8fafc" : colors.stroke
															}),
															height > 8 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("text", {
																x: "550",
																y: y + Math.min(height / 2 + 4, height - 2),
																fill: "#f8fafc",
																fontSize: "13",
																fontFamily: "monospace",
																pointerEvents: "none",
																children: [
																	layer.id,
																	" · ",
																	layer.name.slice(0, 30)
																]
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
																x: "530",
																y: y + 13,
																fill: "#94a3b8",
																fontSize: "10",
																fontFamily: "monospace",
																children: layer.topDepth.toFixed(1)
															})
														]
													}, layer.id);
												}),
												waterY <= bottom && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
													x1: "160",
													y1: waterY,
													x2: "520",
													y2: waterY,
													stroke: "#38bdf8",
													strokeWidth: "2",
													strokeDasharray: "7 4"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("text", {
													x: "174",
													y: waterY - 8,
													fill: "#7dd3fc",
													fontSize: "13",
													fontFamily: "monospace",
													children: [
														"GWL -",
														project.waterLevel.toFixed(2),
														" m"
													]
												})] }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
													x: 340 - pileWidth / 2,
													y: top,
													width: pileWidth,
													height: Math.min(project.length, maxDepth) * scale,
													fill: "#22d3ee",
													fillOpacity: "0.2",
													stroke: "#67e8f9",
													strokeWidth: "2"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
													x1: "340",
													y1: "12",
													x2: "340",
													y2: 46,
													stroke: "#fbbf24",
													strokeWidth: "3"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("polygon", {
													points: `334,40 340,${top} 346,40`,
													fill: "#fbbf24"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("text", {
													x: "355",
													y: "24",
													fill: "#fbbf24",
													fontSize: "13",
													fontFamily: "monospace",
													fontWeight: "bold",
													children: [
														"N_Ed ",
														project.nEd,
														" kN"
													]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
													x1: "160",
													y1: top + project.length * scale,
													x2: "520",
													y2: top + project.length * scale,
													stroke: "#fbbf24",
													strokeWidth: "1",
													strokeDasharray: "3 3"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("text", {
													x: "174",
													y: Math.min(805, top + project.length * scale + 20),
													fill: "#fbbf24",
													fontSize: "13",
													fontFamily: "monospace",
													children: [
														"PILE TOE ",
														project.length.toFixed(2),
														" m"
													]
												}),
												Array.from({ length: Math.floor(maxDepth / 5) + 1 }, (_, index) => index * 5).map((depth) => {
													const y = top + depth * scale;
													return y <= bottom ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
														x1: "144",
														y1: y,
														x2: "160",
														y2: y,
														stroke: "#64748b"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("text", {
														x: "92",
														y: y + 4,
														fill: "#64748b",
														fontSize: "11",
														fontFamily: "monospace",
														children: [depth, "m"]
													})] }, depth) : null;
												})
											]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-4 grid grid-cols-2 gap-2 font-mono text-[11px] text-slate-300",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "rounded border border-slate-700 bg-[#040910] p-2",
													children: [
														"Pile diameter",
														" ",
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", {
															className: "text-cyan-300",
															children: [project.diameter, " mm"]
														})
													]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "rounded border border-slate-700 bg-[#040910] p-2",
													children: ["Pile length ", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", {
														className: "text-cyan-300",
														children: [project.length, " m"]
													})]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "rounded border border-slate-700 bg-[#040910] p-2",
													children: [
														"Selected",
														" ",
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
															className: "text-cyan-300",
															children: selectedLayerId ?? "none"
														})
													]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "rounded border border-slate-700 bg-[#040910] p-2",
													children: [
														"Toe layer",
														" ",
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
															className: "text-cyan-300",
															children: project.layers.find((layer) => project.length >= layer.topDepth && project.length <= layer.bottomDepth)?.id ?? "outside profile"
														})
													]
												})
											]
										})]
									});
								})()]
							})]
						})]
					}),
					activeTab === "geometry" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-1 xl:grid-cols-[minmax(360px,0.78fr)_minmax(560px,1.22fr)] gap-6 items-start",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "bg-[#081222]/95 border border-cyan-500/30 rounded-2xl p-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "border-b border-cyan-900/60 pb-4 mb-6",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-mono text-[10px] uppercase tracking-[0.18em] text-cyan-400",
										children: "Input panel / geometry & actions"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "font-display text-xl font-bold text-white mt-1",
										children: "Pile Design Parameters"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs font-mono text-slate-400 mt-1",
										children: "Edit the pile and the diagrams update immediately."
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-5 font-mono text-xs",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mb-3 text-[10px] uppercase tracking-widest text-slate-500",
										children: "Pile geometry"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-2 gap-3",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
												className: "block",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "mb-1 block text-slate-400",
													children: "Diameter (mm)"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "number",
													min: "300",
													step: "50",
													value: project.diameter,
													onChange: (e) => setProject({
														...project,
														diameter: parseFloat(e.target.value) || 800
													}),
													className: "w-full rounded border border-slate-700 bg-[#040910] p-2 text-white"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
												className: "block",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "mb-1 block text-slate-400",
													children: "Length (m)"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "number",
													min: "1",
													step: "0.5",
													value: project.length,
													onChange: (e) => setProject({
														...project,
														length: parseFloat(e.target.value) || 25
													}),
													className: "w-full rounded border border-slate-700 bg-[#040910] p-2 text-white"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
												className: "col-span-2 block",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "mb-1 block text-slate-400",
													children: "Concrete grade"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "text",
													value: project.concreteGrade,
													onChange: (e) => setProject({
														...project,
														concreteGrade: e.target.value
													}),
													className: "w-full rounded border border-slate-700 bg-[#040910] p-2 text-white"
												})]
											})
										]
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mb-3 text-[10px] uppercase tracking-widest text-slate-500",
										children: "Design actions"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-2 gap-3",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
												className: "block",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "mb-1 block text-slate-400",
													children: [
														"N",
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sub", { children: "Ed" }),
														" (kN)"
													]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "number",
													min: "0",
													step: "50",
													value: project.nEd,
													onChange: (e) => setProject({
														...project,
														nEd: parseFloat(e.target.value) || 0
													}),
													className: "w-full rounded border border-slate-700 bg-[#040910] p-2 text-white"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
												className: "block",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "mb-1 block text-slate-400",
													children: [
														"M",
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sub", { children: "Ed" }),
														" (kNm)"
													]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "number",
													min: "0",
													step: "10",
													value: project.mEd,
													onChange: (e) => setProject({
														...project,
														mEd: parseFloat(e.target.value) || 0
													}),
													className: "w-full rounded border border-slate-700 bg-[#040910] p-2 text-white"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
												className: "block",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "mb-1 block text-slate-400",
													children: "Nominal cover (mm)"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "number",
													min: "0",
													step: "5",
													value: project.cover,
													onChange: (e) => setProject({
														...project,
														cover: parseFloat(e.target.value) || 0
													}),
													className: "w-full rounded border border-slate-700 bg-[#040910] p-2 text-white"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
												className: "block",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "mb-1 block text-slate-400",
													children: "Groundwater (m bgl)"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "number",
													min: "0",
													step: "0.1",
													value: project.waterLevel,
													onChange: (e) => setProject({
														...project,
														waterLevel: parseFloat(e.target.value) || 0
													}),
													className: "w-full rounded border border-slate-700 bg-[#040910] p-2 text-white"
												})]
											})
										]
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-2 gap-3 border-t border-cyan-900/60 pt-5",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "rounded-lg border border-cyan-900/60 bg-[#040910] p-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-slate-500",
												children: "Toe layer"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "mt-1 font-bold text-cyan-300",
												children: project.layers.find((layer) => project.length >= layer.topDepth && project.length <= layer.bottomDepth)?.id ?? "Outside profile"
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "rounded-lg border border-cyan-900/60 bg-[#040910] p-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-slate-500",
												children: "ULS utilization"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: `mt-1 font-bold ${results.utilizationGeotechnical <= 1 ? "text-emerald-400" : "text-rose-400"}`,
												children: Number.isFinite(results.utilizationGeotechnical) ? `${(results.utilizationGeotechnical * 100).toFixed(1)}%` : "INPUT REQUIRED"
											})]
										})]
									})
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "xl:sticky xl:top-6 bg-[#081222]/95 border border-cyan-500/30 rounded-2xl p-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-start justify-between border-b border-cyan-900/60 pb-4 mb-5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-mono text-[10px] uppercase tracking-[0.18em] text-cyan-400",
										children: "Live visualization / scale model"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "font-display text-xl font-bold text-white mt-1",
										children: "Bored Pile Geometry"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs font-mono text-slate-400 mt-1",
										children: "Plan view and longitudinal section through every soil stratum."
									})
								] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded border border-emerald-500/40 bg-emerald-950/40 px-2 py-1 font-mono text-[10px] text-emerald-300",
									children: "LIVE"
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-1 lg:grid-cols-[0.72fr_1.28fr] gap-5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl border border-slate-700 bg-[#040910] p-4",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mb-3 flex items-center justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
												className: "font-mono text-xs font-bold text-slate-200",
												children: "PLAN VIEW"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "font-mono text-[10px] text-slate-500",
												children: [
													"Ø ",
													project.diameter,
													" mm"
												]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
											viewBox: "0 0 260 260",
											className: "mx-auto w-full max-w-[280px]",
											role: "img",
											"aria-label": "Bored pile plan view",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pattern", {
													id: "plan-grid",
													width: "16",
													height: "16",
													patternUnits: "userSpaceOnUse",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
														d: "M 16 0 L 0 0 0 16",
														fill: "none",
														stroke: "#1e3a5f",
														strokeWidth: "0.7",
														opacity: "0.5"
													})
												}) }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
													x: "8",
													y: "8",
													width: "244",
													height: "244",
													fill: "url(#plan-grid)",
													stroke: "#334155"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
													cx: "130",
													cy: "130",
													r: "92",
													fill: "#0b192c",
													stroke: "#64748b",
													strokeDasharray: "3 3"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
													cx: "130",
													cy: "130",
													r: Math.min(82, Math.max(20, project.diameter / 11)),
													fill: "#155e75",
													fillOpacity: "0.75",
													stroke: "#67e8f9",
													strokeWidth: "3"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
													cx: "130",
													cy: "130",
													r: Math.min(68, Math.max(14, project.diameter / 14)),
													fill: "#07111f",
													stroke: "#22d3ee",
													strokeOpacity: "0.5"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
													x1: "38",
													y1: "130",
													x2: "222",
													y2: "130",
													stroke: "#94a3b8",
													strokeDasharray: "5 4"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
													x1: "130",
													y1: "38",
													x2: "130",
													y2: "222",
													stroke: "#94a3b8",
													strokeDasharray: "5 4"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
													x1: "130",
													y1: "130",
													x2: "130",
													y2: 130 - Math.min(82, Math.max(20, project.diameter / 11)),
													stroke: "#fbbf24",
													strokeWidth: "2"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
													x: "130",
													y: "238",
													textAnchor: "middle",
													fill: "#cbd5e1",
													fontSize: "10",
													fontFamily: "monospace",
													children: "SECTION A-A"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
													x: "130",
													y: "25",
													textAnchor: "middle",
													fill: "#fbbf24",
													fontSize: "10",
													fontFamily: "monospace",
													children: "N_Ed"
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-3 grid grid-cols-2 gap-2 font-mono text-[10px] text-slate-400",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
												"Area",
												" ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", {
													className: "text-cyan-300",
													children: [results.pileArea.toFixed(3), " m²"]
												})
											] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
												"Perimeter",
												" ",
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", {
													className: "text-cyan-300",
													children: [results.pilePerimeter.toFixed(2), " m"]
												})
											] })]
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "rounded-xl border border-slate-700 bg-[#040910] p-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mb-3 flex items-center justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
											className: "font-mono text-xs font-bold text-slate-200",
											children: "SECTION A-A"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "font-mono text-[10px] text-slate-500",
											children: [
												"0.00 to ",
												project.length.toFixed(1),
												" m"
											]
										})]
									}), (() => {
										const maxDepth = Math.max(project.length, ...project.layers.map((layer) => layer.bottomDepth), 1);
										const topDepth = 28;
										const bottomDepth = 510;
										const depthScale = 482 / maxDepth;
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
											viewBox: "0 0 360 550",
											className: "h-[520px] w-full",
											role: "img",
											"aria-label": "Bored pile longitudinal section through soil strata",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("defs", { children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pattern", {
														id: "section-pattern-fill",
														width: "18",
														height: "18",
														patternUnits: "userSpaceOnUse",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
															d: "M2 4l3-2M11 8l4-3M5 15l4-2M15 16l2-2",
															stroke: "#e2c99b",
															strokeWidth: "1.4",
															opacity: "0.7"
														})
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pattern", {
														id: "section-pattern-clay",
														width: "20",
														height: "20",
														patternUnits: "userSpaceOnUse",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
															d: "M0 5c4-3 7 3 10 0s6 3 10 0M0 15c4-3 7 3 10 0s6 3 10 0",
															fill: "none",
															stroke: "#cbd5e1",
															strokeWidth: "1.1",
															opacity: "0.55"
														})
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("pattern", {
														id: "section-pattern-sand",
														width: "18",
														height: "18",
														patternUnits: "userSpaceOnUse",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
																cx: "3",
																cy: "4",
																r: "1.3",
																fill: "#f1d19a"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
																cx: "11",
																cy: "8",
																r: "1.1",
																fill: "#f1d19a"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
																cx: "6",
																cy: "15",
																r: "1.2",
																fill: "#f1d19a"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
																cx: "16",
																cy: "14",
																r: "1",
																fill: "#f1d19a"
															})
														]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pattern", {
														id: "section-pattern-rock",
														width: "24",
														height: "24",
														patternUnits: "userSpaceOnUse",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
															d: "M1 17L8 4l7 5 7-6M4 23l6-8 6 3 7-7",
															fill: "none",
															stroke: "#d6d3d1",
															strokeWidth: "1.3",
															opacity: "0.65"
														})
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pattern", {
														id: "section-pattern-custom",
														width: "20",
														height: "20",
														patternUnits: "userSpaceOnUse",
														children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
															d: "M0 10h20M10 0v20",
															stroke: "#a5f3fc",
															strokeWidth: "0.8",
															opacity: "0.35"
														})
													})
												] }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
													x: "72",
													y: topDepth,
													width: "190",
													height: 482,
													fill: "#0a1525",
													stroke: "#334155"
												}),
												project.layers.map((layer) => {
													const y = topDepth + Math.max(0, layer.topDepth) * depthScale;
													const height = Math.max(3, (Math.min(maxDepth, layer.bottomDepth) - Math.max(0, layer.topDepth)) * depthScale);
													const colors = soilLayerColor(layer);
													const patternId = soilPatternId(layer).replace("soil-pattern", "section-pattern");
													return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
															x: "72",
															y,
															width: "190",
															height,
															fill: colors.fill,
															fillOpacity: "0.5",
															stroke: colors.stroke
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
															x: "72",
															y,
															width: "190",
															height,
															fill: `url(#${patternId})`
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("text", {
															x: "82",
															y: y + Math.min(height - 3, 14),
															fill: "#f8fafc",
															fontSize: "9",
															fontFamily: "monospace",
															children: [
																layer.id,
																" ",
																layer.name.slice(0, 20)
															]
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
															x: "270",
															y: y + 11,
															fill: "#94a3b8",
															fontSize: "9",
															fontFamily: "monospace",
															children: layer.topDepth.toFixed(1)
														})
													] }, layer.id);
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
													x1: "72",
													y1: topDepth + project.waterLevel * depthScale,
													x2: "262",
													y2: topDepth + project.waterLevel * depthScale,
													stroke: "#38bdf8",
													strokeWidth: "2",
													strokeDasharray: "7 4"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("text", {
													x: "80",
													y: topDepth + project.waterLevel * depthScale - 6,
													fill: "#7dd3fc",
													fontSize: "9",
													fontFamily: "monospace",
													children: [
														"GWL -",
														project.waterLevel.toFixed(1),
														" m"
													]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
													x: "150",
													y: topDepth,
													width: Math.max(22, Math.min(44, project.diameter / 25)),
													height: Math.min(project.length, maxDepth) * depthScale,
													fill: "#22d3ee",
													fillOpacity: "0.25",
													stroke: "#67e8f9",
													strokeWidth: "2"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
													x1: "171",
													y1: "7",
													x2: "171",
													y2: "24",
													stroke: "#fbbf24",
													strokeWidth: "3"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("polygon", {
													points: "165,20 171,28 177,20",
													fill: "#fbbf24"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
													x1: "72",
													y1: topDepth + project.length * depthScale,
													x2: "262",
													y2: topDepth + project.length * depthScale,
													stroke: "#fbbf24",
													strokeDasharray: "3 3"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("text", {
													x: "80",
													y: Math.min(542, topDepth + project.length * depthScale + 15),
													fill: "#fbbf24",
													fontSize: "9",
													fontFamily: "monospace",
													children: [
														"TOE ",
														project.length.toFixed(1),
														" m"
													]
												}),
												Array.from({ length: Math.floor(maxDepth / 5) + 1 }, (_, index) => index * 5).map((depth) => {
													const y = topDepth + depth * depthScale;
													return y <= bottomDepth ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
														x1: "60",
														y1: y,
														x2: "72",
														y2: y,
														stroke: "#64748b"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("text", {
														x: "28",
														y: y + 4,
														fill: "#64748b",
														fontSize: "9",
														fontFamily: "monospace",
														children: [depth, "m"]
													})] }, depth) : null;
												})
											]
										});
									})()]
								})]
							})]
						})]
					}),
					activeTab === "geotechnical" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "bg-[#081222]/95 border border-cyan-500/30 rounded-2xl p-6",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between border-b border-cyan-900/60 pb-4 mb-6",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "font-display text-xl font-bold text-white",
										children: "Geotechnical Ultimate Limit State (EN 1997-1)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs font-mono text-slate-400 mt-1",
										children: "Shaft friction and base bearing capacity breakdown"
									})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "text-right font-mono",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs text-slate-400",
											children: "Total Characteristic Resistance R_c,k:"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-lg font-bold text-cyan-300",
											children: [results.totalCharacteristicResistance, " kN"]
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "overflow-x-auto mb-6",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
										className: "w-full text-left font-mono text-xs",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
											className: "border-b border-slate-700 text-cyan-400 bg-cyan-950/30",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "p-3",
													children: "Layer"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "p-3",
													children: "Effective Length"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "p-3",
													children: "Calculation Method"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "p-3 text-right",
													children: "Shaft Resistance R_s,i (kN)"
												})
											]
										}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
											className: "divide-y divide-slate-800",
											children: results.layers.map((l) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
												className: "hover:bg-slate-900/50",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
														className: "p-3 font-bold text-white",
														children: [
															l.layerId,
															": ",
															l.name
														]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
														className: "p-3 text-cyan-300",
														children: [l.effectiveLength.toFixed(1), " m"]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
														className: "p-3 text-slate-400",
														children: l.methodUsed
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
														className: "p-3 text-right font-bold text-white",
														children: [l.shaftResistance.toFixed(1), " kN"]
													})
												]
											}, l.layerId))
										})]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-1 md:grid-cols-3 gap-4 font-mono",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "p-4 rounded-xl bg-[#040910] border border-cyan-900/60",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs text-slate-400",
												children: "Total Shaft Resistance (R_sk):"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-xl font-bold text-cyan-300 mt-1",
												children: [results.totalShaftResistance, " kN"]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "p-4 rounded-xl bg-[#040910] border border-cyan-900/60",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs text-slate-400",
												children: "Base Bearing Resistance (R_bk):"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-xl font-bold text-cyan-300 mt-1",
												children: [results.baseResistance, " kN"]
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "p-4 rounded-xl bg-cyan-950/60 border border-cyan-600/60",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "text-xs text-cyan-200",
												children: "Design Resistance (R_c,d / γ_t):"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-xl font-bold text-cyan-400 mt-1",
												children: [results.designResistance, " kN"]
											})]
										})
									]
								})
							]
						})
					}),
					activeTab === "settlement" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "bg-[#081222]/95 border border-cyan-500/30 rounded-2xl p-6",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "font-display text-xl font-bold text-white mb-2",
									children: "Single-Pile Settlement Analysis (SLS)"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs font-mono text-slate-400 mb-6",
									children: "Evaluation under serviceability load combinations"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-1 md:grid-cols-3 gap-6 font-mono",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "p-5 rounded-xl bg-[#040910] border border-slate-800",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-xs text-slate-400",
													children: "Pile Elastic Shortening:"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
													className: "text-2xl font-bold text-white mt-1",
													children: [results.settlementElastic, " mm"]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-[11px] text-slate-500 mt-1",
													children: "ΔL = N × L / (A_c × E_c)"
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "p-5 rounded-xl bg-[#040910] border border-slate-800",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-xs text-slate-400",
													children: "Soil Deformation & Base Settlement:"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
													className: "text-2xl font-bold text-white mt-1",
													children: [results.settlementSoil, " mm"]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-[11px] text-slate-500 mt-1",
													children: "Load transfer & consolidation"
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "p-5 rounded-xl bg-cyan-950/60 border border-cyan-600/60",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-xs text-cyan-200",
													children: "Total Calculated Settlement:"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
													className: "text-2xl font-bold text-cyan-400 mt-1",
													children: [results.settlementTotal, " mm"]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
													className: "text-[11px] text-cyan-300 mt-1",
													children: [
														"Allowable limit: ",
														results.allowableSettlement,
														" mm (PASS)"
													]
												})
											]
										})
									]
								})
							]
						})
					}),
					activeTab === "rc" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-1 xl:grid-cols-[minmax(360px,0.78fr)_minmax(620px,1.22fr)] gap-6 items-start",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "bg-[#081222]/95 border border-cyan-500/30 rounded-2xl p-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "border-b border-cyan-900/60 pb-4 mb-6",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "font-mono text-[10px] uppercase tracking-[0.18em] text-cyan-400",
										children: "Input panel / EN 1992-1-1"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "font-display text-xl font-bold text-white mt-1",
										children: "RC Reinforcement Cage"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs font-mono text-slate-400 mt-1",
										children: "Adjust the reinforcement arrangement and inspect the cage on the right."
									})
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-5 font-mono text-xs",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mb-3 text-[10px] uppercase tracking-widest text-slate-500",
										children: "Concrete and durability"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-2 gap-3",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
												className: "col-span-2 block",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "mb-1 block text-slate-400",
													children: "Concrete grade"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "text",
													value: project.concreteGrade,
													onChange: (e) => setProject({
														...project,
														concreteGrade: e.target.value
													}),
													className: "w-full rounded border border-slate-700 bg-[#040910] p-2 text-white"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
												className: "block",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "mb-1 block text-slate-400",
													children: [
														"f",
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sub", { children: "ck" }),
														" (MPa)"
													]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "number",
													min: "20",
													step: "5",
													value: project.fck,
													onChange: (e) => setProject({
														...project,
														fck: Number(e.target.value) || 30
													}),
													className: "w-full rounded border border-slate-700 bg-[#040910] p-2 text-white"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
												className: "block",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "mb-1 block text-slate-400",
													children: "Nominal cover (mm)"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "number",
													min: "25",
													step: "5",
													value: project.cover,
													onChange: (e) => setProject({
														...project,
														cover: Number(e.target.value) || 75
													}),
													className: "w-full rounded border border-slate-700 bg-[#040910] p-2 text-white"
												})]
											})
										]
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mb-3 text-[10px] uppercase tracking-widest text-slate-500",
										children: "Longitudinal reinforcement"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-2 gap-3",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
												className: "block",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "mb-1 block text-slate-400",
													children: "Number of bars"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "number",
													min: "4",
													max: "40",
													step: "1",
													value: project.numBars,
													onChange: (e) => setProject({
														...project,
														numBars: Math.max(4, Number(e.target.value) || 4)
													}),
													className: "w-full rounded border border-slate-700 bg-[#040910] p-2 text-white"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
												className: "block",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "mb-1 block text-slate-400",
													children: "Bar diameter (mm)"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "number",
													min: "8",
													max: "50",
													step: "1",
													value: project.barDiameter,
													onChange: (e) => setProject({
														...project,
														barDiameter: Math.max(8, Number(e.target.value) || 8)
													}),
													className: "w-full rounded border border-slate-700 bg-[#040910] p-2 text-white"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
												className: "block",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "mb-1 block text-slate-400",
													children: "Spiral diameter (mm)"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "number",
													min: "6",
													max: "25",
													step: "1",
													value: project.spiralBarDiameter,
													onChange: (e) => setProject({
														...project,
														spiralBarDiameter: Math.max(6, Number(e.target.value) || 6)
													}),
													className: "w-full rounded border border-slate-700 bg-[#040910] p-2 text-white"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
												className: "block",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "mb-1 block text-slate-400",
													children: "Spiral spacing (mm)"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "number",
													min: "50",
													max: "500",
													step: "10",
													value: project.spiralSpacing,
													onChange: (e) => setProject({
														...project,
														spiralSpacing: Math.max(50, Number(e.target.value) || 50)
													}),
													className: "w-full rounded border border-slate-700 bg-[#040910] p-2 text-white"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
												className: "block",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "mb-1 block text-slate-400",
													children: "Stiffener diameter (mm)"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "number",
													min: "8",
													max: "32",
													step: "1",
													value: project.stiffenerBarDiameter,
													onChange: (e) => setProject({
														...project,
														stiffenerBarDiameter: Math.max(8, Number(e.target.value) || 8)
													}),
													className: "w-full rounded border border-slate-700 bg-[#040910] p-2 text-white"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
												className: "block",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "mb-1 block text-slate-400",
													children: "Stiffener spacing (mm)"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "number",
													min: "300",
													max: "3000",
													step: "50",
													value: project.stiffenerSpacing,
													onChange: (e) => setProject({
														...project,
														stiffenerSpacing: Math.max(300, Number(e.target.value) || 300)
													}),
													className: "w-full rounded border border-slate-700 bg-[#040910] p-2 text-white"
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
												className: "col-span-2 block",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "mb-1 block text-slate-400",
													children: "Steel grade"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "text",
													value: project.steelGrade,
													onChange: (e) => setProject({
														...project,
														steelGrade: e.target.value
													}),
													className: "w-full rounded border border-slate-700 bg-[#040910] p-2 text-white"
												})]
											})
										]
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-2 gap-3 border-t border-cyan-900/60 pt-5",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "rounded-lg border border-cyan-900/60 bg-[#040910] p-3",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-slate-500",
													children: "Pile diameter"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
													className: "mt-1 font-bold text-cyan-300",
													children: [project.diameter, " mm"]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "rounded-lg border border-cyan-900/60 bg-[#040910] p-3",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-slate-500",
													children: "Pile length"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
													className: "mt-1 font-bold text-cyan-300",
													children: [project.length, " m"]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "rounded-lg border border-cyan-900/60 bg-[#040910] p-3",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
													className: "text-slate-500",
													children: [
														"A",
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sub", { children: "s" }),
														" provided"
													]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
													className: "mt-1 font-bold text-cyan-300",
													children: [results.rebarArea, " mm²"]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "rounded-lg border border-cyan-900/60 bg-[#040910] p-3",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-slate-500",
													children: "Utilization"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
													className: `mt-1 font-bold ${results.utilizationStructural <= 1 ? "text-emerald-400" : "text-rose-400"}`,
													children: [(results.utilizationStructural * 100).toFixed(1), "%"]
												})]
											})
										]
									})
								]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
							className: "xl:sticky xl:top-6 bg-[#081222]/95 border border-cyan-500/30 rounded-2xl p-6",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-start justify-between border-b border-cyan-900/60 pb-4 mb-5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "font-mono text-[10px] uppercase tracking-[0.18em] text-cyan-400",
											children: "Live visualization / reinforcement cage"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
											className: "font-display text-xl font-bold text-white mt-1",
											children: "Bored Pile RC Detailing"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs font-mono text-slate-400 mt-1",
											children: "Plan arrangement and longitudinal cage section."
										})
									] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "rounded border border-emerald-500/40 bg-emerald-950/40 px-2 py-1 font-mono text-[10px] text-emerald-300",
										children: "LIVE"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "grid grid-cols-1 lg:grid-cols-[0.8fr_1.2fr] gap-5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-xl border border-slate-700 bg-[#040910] p-4",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mb-3 flex items-center justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
												className: "font-mono text-xs font-bold text-slate-200",
												children: "PLAN VIEW"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "font-mono text-[10px] text-slate-500",
												children: [project.numBars, " bars"]
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
											viewBox: "0 0 440 360",
											className: "mx-auto w-full max-w-[480px]",
											role: "img",
											"aria-label": "Bored pile reinforcement plan view",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("marker", {
													id: "rebar-arrow",
													markerWidth: "7",
													markerHeight: "7",
													refX: "6",
													refY: "3.5",
													orient: "auto",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
														d: "M0 0L7 3.5L0 7z",
														fill: "#cbd5e1"
													})
												}) }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
													cx: "170",
													cy: "170",
													r: "126",
													fill: "#0a1525",
													stroke: "#64748b",
													strokeWidth: "2"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
													cx: "170",
													cy: "170",
													r: "105",
													fill: "#155e75",
													fillOpacity: "0.35",
													stroke: "#67e8f9",
													strokeDasharray: "5 4"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
													cx: "170",
													cy: "170",
													r: "96",
													fill: "none",
													stroke: "#fb7185",
													strokeWidth: Math.max(2, Math.min(5, project.spiralBarDiameter / 4)),
													strokeDasharray: "3 3"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
													cx: "170",
													cy: "170",
													r: "82",
													fill: "#07111f",
													stroke: "#94a3b8",
													strokeWidth: "2"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
													cx: "170",
													cy: "170",
													r: "70",
													fill: "none",
													stroke: "#a78bfa",
													strokeWidth: Math.max(2, Math.min(5, project.stiffenerBarDiameter / 4)),
													strokeDasharray: "10 5"
												}),
												Array.from({ length: project.numBars }, (_, index) => {
													const angle = index / project.numBars * Math.PI * 2 - Math.PI / 2;
													const radius = 82;
													return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
														cx: 170 + Math.cos(angle) * radius,
														cy: 170 + Math.sin(angle) * radius,
														r: Math.max(4, Math.min(8, project.barDiameter / 4)),
														fill: "#fbbf24",
														stroke: "#fde68a",
														strokeWidth: "1.5"
													}, index);
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
													cx: "170",
													cy: "170",
													r: "5",
													fill: "#fbbf24"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
													x1: "44",
													y1: "170",
													x2: "296",
													y2: "170",
													stroke: "#64748b",
													strokeDasharray: "5 4"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
													x1: "170",
													y1: "44",
													x2: "170",
													y2: "296",
													stroke: "#64748b",
													strokeDasharray: "5 4"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
													x1: "68",
													y1: "70",
													x2: "121",
													y2: "121",
													stroke: "#a78bfa",
													strokeWidth: "1.5",
													markerEnd: "url(#rebar-arrow)"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
													x: "8",
													y: "62",
													fill: "#c4b5fd",
													fontSize: "11",
													fontFamily: "monospace",
													children: "STIFFENER"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("text", {
													x: "8",
													y: "76",
													fill: "#c4b5fd",
													fontSize: "10",
													fontFamily: "monospace",
													children: [
														"Ø",
														project.stiffenerBarDiameter,
														" @ ",
														project.stiffenerSpacing
													]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
													x1: "296",
													y1: "106",
													x2: "252",
													y2: "116",
													stroke: "#fb7185",
													strokeWidth: "1.5",
													markerEnd: "url(#rebar-arrow)"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
													x: "300",
													y: "104",
													fill: "#fda4af",
													fontSize: "11",
													fontFamily: "monospace",
													children: "SPIRAL"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("text", {
													x: "300",
													y: "118",
													fill: "#fda4af",
													fontSize: "10",
													fontFamily: "monospace",
													children: [
														"Ø",
														project.spiralBarDiameter,
														" @ ",
														project.spiralSpacing
													]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
													x1: "296",
													y1: "236",
													x2: "241",
													y2: "211",
													stroke: "#fbbf24",
													strokeWidth: "1.5",
													markerEnd: "url(#rebar-arrow)"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
													x: "300",
													y: "234",
													fill: "#fde68a",
													fontSize: "11",
													fontFamily: "monospace",
													children: "MAIN BARS"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("text", {
													x: "300",
													y: "248",
													fill: "#fde68a",
													fontSize: "10",
													fontFamily: "monospace",
													children: [
														project.numBars,
														" x Ø",
														project.barDiameter
													]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("text", {
													x: "170",
													y: "330",
													textAnchor: "middle",
													fill: "#cbd5e1",
													fontSize: "11",
													fontFamily: "monospace",
													children: [
														"Ø",
														project.diameter,
														" mm / COVER ",
														project.cover,
														" mm"
													]
												})
											]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "rounded-xl border border-slate-700 bg-[#040910] p-4",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mb-3 flex items-center justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
												className: "font-mono text-xs font-bold text-slate-200",
												children: "LONGITUDINAL SECTION"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "font-mono text-[10px] text-slate-500",
												children: [
													"CAGE LENGTH ",
													project.length,
													" m"
												]
											})]
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
											viewBox: "0 0 420 620",
											className: "h-[600px] w-full",
											role: "img",
											"aria-label": "Bored pile reinforcement longitudinal section",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
													x: "112",
													y: "34",
													width: "150",
													height: "540",
													fill: "#334155",
													fillOpacity: "0.45",
													stroke: "#94a3b8",
													strokeWidth: "2"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
													x: "126",
													y: "48",
													width: "122",
													height: "512",
													fill: "#22d3ee",
													fillOpacity: "0.08",
													stroke: "#67e8f9",
													strokeDasharray: "5 4"
												}),
												Array.from({ length: Math.min(project.numBars, 12) }, (_, index) => {
													const x = 136 + index / Math.max(1, Math.min(project.numBars, 12) - 1) * 102;
													return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
														x1: x,
														y1: "52",
														x2: x,
														y2: "556",
														stroke: "#fbbf24",
														strokeWidth: Math.max(2, Math.min(4, project.barDiameter / 6))
													}, index);
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("polyline", {
													points: Array.from({ length: Math.max(24, Math.ceil(project.length * 1e3 / project.spiralSpacing) * 16) }, (_, index) => {
														const turns = Math.max(1, project.length * 1e3 / project.spiralSpacing);
														const progress = index / Math.max(1, Math.ceil(turns * 16) - 1);
														const y = 52 + progress * 504;
														return `${187 + 56 * Math.sin(progress * turns * Math.PI * 2)},${y}`;
													}).join(" "),
													fill: "none",
													stroke: "#fb7185",
													strokeWidth: Math.max(1.5, Math.min(3, project.spiralBarDiameter / 6)),
													opacity: "0.95"
												}),
												Array.from({ length: Math.max(1, Math.ceil(project.length * 1e3 / project.stiffenerSpacing)) }, (_, index) => {
													const y = 52 + index / Math.max(1, Math.ceil(project.length * 1e3 / project.stiffenerSpacing) - 1) * 504;
													return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
														x1: "132",
														y1: y + 3,
														x2: "242",
														y2: y + 3,
														stroke: "#a78bfa",
														strokeWidth: Math.max(1.5, Math.min(3, project.stiffenerBarDiameter / 6)),
														opacity: "0.9"
													}, `stiffener-${index}`);
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
													x1: "112",
													y1: "34",
													x2: "262",
													y2: "34",
													stroke: "#f8fafc",
													strokeWidth: "3"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
													x1: "112",
													y1: "574",
													x2: "262",
													y2: "574",
													stroke: "#fbbf24",
													strokeDasharray: "4 3"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
													x1: "76",
													y1: "34",
													x2: "76",
													y2: "574",
													stroke: "#64748b"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("text", {
													x: "44",
													y: "310",
													fill: "#94a3b8",
													fontSize: "11",
													fontFamily: "monospace",
													transform: "rotate(-90 44 310)",
													children: [
														"PILE LENGTH ",
														project.length,
														" m"
													]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("text", {
													x: "278",
													y: "70",
													fill: "#fbbf24",
													fontSize: "11",
													fontFamily: "monospace",
													children: [
														"Ø",
														project.barDiameter,
														" LONGITUDINAL"
													]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("text", {
													x: "278",
													y: "88",
													fill: "#cbd5e1",
													fontSize: "11",
													fontFamily: "monospace",
													children: [project.numBars, " BARS"]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("text", {
													x: "278",
													y: "106",
													fill: "#fb7185",
													fontSize: "11",
													fontFamily: "monospace",
													children: [
														"Ø",
														project.spiralBarDiameter,
														" SPIRAL @ ",
														project.spiralSpacing,
														" mm"
													]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("text", {
													x: "278",
													y: "124",
													fill: "#a78bfa",
													fontSize: "11",
													fontFamily: "monospace",
													children: [
														"Ø",
														project.stiffenerBarDiameter,
														" STIFFENER @ ",
														project.stiffenerSpacing,
														" mm"
													]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("text", {
													x: "278",
													y: "142",
													fill: "#67e8f9",
													fontSize: "11",
													fontFamily: "monospace",
													children: [
														"COVER ",
														project.cover,
														" mm"
													]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
													x: "278",
													y: "160",
													fill: "#cbd5e1",
													fontSize: "11",
													fontFamily: "monospace",
													children: project.concreteGrade
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("polygon", {
													points: "181,16 190,34 172,34",
													fill: "#fbbf24"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("text", {
													x: "198",
													y: "27",
													fill: "#fbbf24",
													fontSize: "11",
													fontFamily: "monospace",
													children: [
														"N_Ed ",
														project.nEd,
														" kN"
													]
												})
											]
										})]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-5 grid grid-cols-1 md:grid-cols-3 gap-4 font-mono",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "rounded-xl border border-slate-800 bg-[#040910] p-4",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-xs text-slate-400",
													children: "Reinforcement ratio ρ"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
													className: "mt-1 text-xl font-bold text-white",
													children: [results.reinforcementRatio, "%"]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-[11px] text-slate-500",
													children: "Typical range 0.3%–4.0%"
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "rounded-xl border border-slate-800 bg-[#040910] p-4",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
													className: "text-xs text-slate-400",
													children: ["Structural axial capacity N", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("sub", { children: "Rd" })]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
													className: "mt-1 text-xl font-bold text-cyan-300",
													children: [results.structuralAxialResistance, " kN"]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-[11px] text-slate-500",
													children: "Simplified EC2 verification"
												})
											]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "rounded-xl border border-cyan-600/60 bg-cyan-950/40 p-4",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-xs text-cyan-200",
													children: "RC status"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "mt-1 text-xl font-bold text-emerald-400",
													children: results.utilizationStructural <= 1 ? "PASS" : "FAIL"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
													className: "text-[11px] text-cyan-300",
													children: [
														"Utilization ",
														(results.utilizationStructural * 100).toFixed(1),
														"%"
													]
												})
											]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-5 rounded-xl border border-cyan-900/60 bg-[#040910] p-4 font-mono",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mb-3 flex items-center justify-between border-b border-slate-800 pb-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
											className: "text-sm font-bold text-white",
											children: "Rebar Weight Schedule"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-xs text-cyan-300",
											children: [
												"Total ",
												results.totalRebarWeight.toFixed(1),
												" kg"
											]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-2 gap-x-6 gap-y-2 text-xs md:grid-cols-4",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-amber-300",
													children: "Main bars"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
													className: "mt-1 text-lg font-bold text-white",
													children: [results.mainBarWeight.toFixed(1), " kg"]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
													className: "text-[10px] text-slate-500",
													children: [
														project.numBars,
														" × Ø",
														project.barDiameter
													]
												})
											] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-rose-300",
													children: "Spiral"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
													className: "mt-1 text-lg font-bold text-white",
													children: [results.spiralWeight.toFixed(1), " kg"]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
													className: "text-[10px] text-slate-500",
													children: [
														"Ø",
														project.spiralBarDiameter,
														" @ ",
														project.spiralSpacing
													]
												})
											] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-violet-300",
													children: "Stiffeners"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
													className: "mt-1 text-lg font-bold text-white",
													children: [results.stiffenerWeight.toFixed(1), " kg"]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
													className: "text-[10px] text-slate-500",
													children: [
														"Ø",
														project.stiffenerBarDiameter,
														" @ ",
														project.stiffenerSpacing
													]
												})
											] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-cyan-300",
													children: "Total reinforcement"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
													className: "mt-1 text-lg font-bold text-cyan-200",
													children: [results.totalRebarWeight.toFixed(1), " kg"]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-[10px] text-slate-500",
													children: "Nominal steel mass"
												})
											] })
										]
									})]
								})
							]
						})]
					}),
					activeTab === "report" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "report-document space-y-6 bg-[#f4f0e6] text-slate-900 p-4 sm:p-8 rounded-2xl shadow-2xl font-sans text-xs leading-relaxed",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex justify-end gap-2 font-sans no-print",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => window.print(),
									className: "px-3 py-1.5 bg-slate-900 text-white rounded text-xs flex items-center gap-1.5",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, { className: "size-3.5" }), " Print / Save PDF"]
								})
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
								className: "report-cover min-h-[620px] flex flex-col justify-between border-8 border-double border-[#173b5f] bg-[#f8f5ed] p-10 text-center",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "font-mono text-xs tracking-[0.25em] text-[#173b5f]",
										children: "STRUCTURAL DESIGN PLATFORM"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mx-auto mb-6 h-1 w-24 bg-[#b8863b]" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
											className: "text-4xl font-bold tracking-wide text-[#173b5f]",
											children: "CALCULATION REPORT"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-3 font-mono text-sm uppercase tracking-[0.16em]",
											children: "Bored Pile Design & Verification"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "mt-8 text-2xl font-semibold",
											children: project.projectName
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "mt-2 font-mono text-sm",
											children: ["Project No. ", project.projectNumber]
										})
									] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-2 gap-4 border-t border-[#173b5f]/30 pt-5 text-left font-mono text-xs",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
											"DESIGN STANDARD",
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "EN 1990 / EN 1997 / EN 1992" })
										] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-right",
											children: [
												"STATUS",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: results.overallStatus })
											]
										})]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
								className: "report-page min-h-[520px] bg-[#f8f5ed] p-10",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "border-b-2 border-[#173b5f] pb-2 text-2xl font-bold text-[#173b5f]",
									children: "Table of Contents"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-8 space-y-5 text-xs",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "flex justify-between border-b border-dotted border-slate-400",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "1. Design basis and input summary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "3" })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "flex justify-between border-b border-dotted border-slate-400",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "2. Executive summary and verification" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "4" })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "flex justify-between border-b border-dotted border-slate-400",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "3. Geotechnical resistance calculation" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "5" })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "flex justify-between border-b border-dotted border-slate-400",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "4. Settlement serviceability calculation" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "6" })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "flex justify-between border-b border-dotted border-slate-400",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "5. RC pile and reinforcement calculation" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "7" })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "flex justify-between border-b border-dotted border-slate-400",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "6. Soil strata and resistance schedule" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "8" })]
										})
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
								className: "report-page bg-[#f8f5ed] p-10",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "border-b-2 border-[#173b5f] pb-2 text-2xl font-bold text-[#173b5f]",
										children: "1. Design Basis & Input Summary"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-5 grid grid-cols-1 md:grid-cols-2 gap-4 text-xs",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["Project: ", project.projectName] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["Designer: ", project.designer] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
												"Diameter: ",
												project.diameter,
												" mm"
											] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
												"Length: ",
												project.length,
												" m"
											] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
												"Design load N",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sub", { children: "Ed" }),
												": ",
												project.nEd,
												" kN"
											] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
												"Moment M",
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sub", { children: "Ed" }),
												": ",
												project.mEd,
												" kNm"
											] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
												"Water level: ",
												project.waterLevel,
												" m bgl"
											] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
												"Design approach: ",
												project.designApproach,
												", SF ",
												project.safetyFactor.toFixed(1)
											] })
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-8 border-t border-[#173b5f]/30 pt-5",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
												className: "text-base font-bold text-[#173b5f]",
												children: "1.1 Soil Parameters and Ground Profile"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "mt-4 grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-5",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "grid grid-cols-2 gap-3 font-sans text-xs",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["Layers: ", project.layers.length] }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
															"Groundwater: ",
															project.waterLevel,
															" m bgl"
														] }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
															"Toe depth: ",
															project.length,
															" m"
														] }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
															"Toe layer:",
															" ",
															project.layers.find((layer) => project.length >= layer.topDepth && project.length <= layer.bottomDepth)?.id ?? "INPUT REQUIRED"
														] }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
															"Profile depth:",
															" ",
															Math.max(0, ...project.layers.map((layer) => layer.bottomDepth)),
															" m"
														] }),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Analysis: EC7 shaft + base" })
													]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
													viewBox: "0 0 520 220",
													className: "h-56 w-full rounded border border-slate-300 bg-white",
													role: "img",
													"aria-label": "Soil strata report diagram",
													children: (() => {
														const maxDepth = Math.max(project.length, ...project.layers.map((layer) => layer.bottomDepth), 1);
														const top = 22;
														const scale = 176 / maxDepth;
														return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
																x: "54",
																y: top,
																width: "190",
																height: 176,
																fill: "#eef2f7",
																stroke: "#173b5f"
															}),
															project.layers.map((layer) => {
																const y = top + layer.topDepth * scale;
																const height = Math.max(3, (Math.min(maxDepth, layer.bottomDepth) - layer.topDepth) * scale);
																const colors = soilLayerColor(layer);
																return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
																	x: "54",
																	y,
																	width: "190",
																	height,
																	fill: colors.fill,
																	fillOpacity: "0.62",
																	stroke: colors.stroke
																}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("text", {
																	x: "62",
																	y: y + Math.min(13, Math.max(9, height - 2)),
																	fontSize: "9",
																	fontFamily: "Arial, sans-serif",
																	fill: "#172033",
																	children: [
																		layer.id,
																		" ",
																		layer.name.slice(0, 22)
																	]
																})] }, layer.id);
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
																x1: "54",
																y1: top + project.waterLevel * scale,
																x2: "244",
																y2: top + project.waterLevel * scale,
																stroke: "#147fa3",
																strokeWidth: "2",
																strokeDasharray: "6 4"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("text", {
																x: "262",
																y: top + project.waterLevel * scale + 4,
																fontSize: "10",
																fill: "#147fa3",
																children: [
																	"GWL ",
																	project.waterLevel,
																	" m"
																]
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
																x: "137",
																y: top,
																width: "24",
																height: Math.min(project.length, maxDepth) * scale,
																fill: "#22a6bd",
																fillOpacity: "0.3",
																stroke: "#0d7185",
																strokeWidth: "2"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
																x: "262",
																y: "28",
																fontSize: "10",
																fill: "#173b5f",
																children: "Bored pile"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("text", {
																x: "262",
																y: "42",
																fontSize: "10",
																fill: "#173b5f",
																children: [
																	"L = ",
																	project.length,
																	" m"
																]
															})
														] });
													})()
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
												className: "mt-4 w-full border border-slate-300 text-left text-[11px]",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
													className: "bg-slate-200",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
															className: "p-2",
															children: "Layer"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
															className: "p-2",
															children: "Depth"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
															className: "p-2",
															children: "Material"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
															className: "p-2",
															children: "γ / γ′"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
															className: "p-2",
															children: "φ′"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
															className: "p-2",
															children: "cu"
														})
													] })
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: project.layers.map((layer) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
													className: "border-t border-slate-300",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
															className: "p-2",
															children: layer.id
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
															className: "p-2",
															children: [
																layer.topDepth,
																"–",
																layer.bottomDepth,
																" m"
															]
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
															className: "p-2",
															children: layer.name
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
															className: "p-2",
															children: [
																layer.gamma,
																" / ",
																(layer.gammaSat ?? layer.gamma) - 9.81,
																" kN/m³"
															]
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
															className: "p-2",
															children: [layer.phi, "°"]
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
															className: "p-2",
															children: [layer.cu, " kPa"]
														})
													]
												}, `basis-${layer.id}`)) })]
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-8 border-t border-[#173b5f]/30 pt-5",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
												className: "text-base font-bold text-[#173b5f]",
												children: "1.2 Geometry and Load Inputs"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "mt-4 grid grid-cols-2 md:grid-cols-4 gap-3",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
														"Diameter: ",
														project.diameter,
														" mm"
													] }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
														"Length: ",
														project.length,
														" m"
													] }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
														"N",
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sub", { children: "Ed" }),
														": ",
														project.nEd,
														" kN"
													] }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
														"M",
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sub", { children: "Ed" }),
														": ",
														project.mEd,
														" kNm"
													] }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["Concrete: ", project.concreteGrade] }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
														"Ground level: ",
														project.groundLevel,
														" m"
													] }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
														"Water: ",
														project.waterLevel,
														" m bgl"
													] }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["Approach: ", project.designApproach] })
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "mt-3 border-l-4 border-[#b8863b] bg-white/60 p-3",
												children: [
													"Design load N",
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sub", { children: "Ed" }),
													" is checked against geotechnical design resistance and RC axial resistance. Bending moment M",
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sub", { children: "Ed" }),
													" is retained as a design action input for structural review."
												]
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-8 border-t border-[#173b5f]/30 pt-5",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
												className: "text-base font-bold text-[#173b5f]",
												children: "1.3 RC Structural Design (EN2)"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "mt-4 grid grid-cols-2 md:grid-cols-4 gap-3",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["Concrete grade: ", project.concreteGrade] }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
														"f",
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sub", { children: "ck" }),
														": ",
														project.fck,
														" MPa"
													] }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["Steel grade: ", project.steelGrade] }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
														"f",
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sub", { children: "yk" }),
														": ",
														project.fyk,
														" MPa"
													] }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
														"Main bars: ",
														project.numBars,
														" × Ø",
														project.barDiameter
													] }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
														"Spiral: Ø",
														project.spiralBarDiameter,
														" @ ",
														project.spiralSpacing,
														" mm"
													] }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
														"Stiffener: Ø",
														project.stiffenerBarDiameter,
														" @ ",
														project.stiffenerSpacing,
														" mm"
													] }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
														"Cover: ",
														project.cover,
														" mm"
													] })
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "mt-5 grid grid-cols-1 lg:grid-cols-2 gap-4",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "border border-slate-300 bg-white p-3",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "mb-2 text-xs",
														children: "Reinforcement plan view"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
														viewBox: "0 0 360 240",
														className: "h-56 w-full",
														role: "img",
														"aria-label": "RC reinforcement plan for calculation report",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
																cx: "125",
																cy: "120",
																r: "92",
																fill: "#dbe4ea",
																stroke: "#173b5f",
																strokeWidth: "2"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
																cx: "125",
																cy: "120",
																r: "72",
																fill: "none",
																stroke: "#d66a7a",
																strokeWidth: "3",
																strokeDasharray: "4 4"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
																cx: "125",
																cy: "120",
																r: "57",
																fill: "none",
																stroke: "#8b6fc4",
																strokeWidth: "3",
																strokeDasharray: "9 5"
															}),
															Array.from({ length: project.numBars }, (_, index) => {
																const angle = index / project.numBars * Math.PI * 2 - Math.PI / 2;
																return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
																	cx: 125 + Math.cos(angle) * 66,
																	cy: 120 + Math.sin(angle) * 66,
																	r: "5",
																	fill: "#c4912f"
																}, index);
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
																x1: "225",
																y1: "70",
																x2: "181",
																y2: "83",
																stroke: "#8b6fc4"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("text", {
																x: "232",
																y: "68",
																fontSize: "10",
																fill: "#513c86",
																children: [
																	"Stiffener Ø",
																	project.stiffenerBarDiameter,
																	" @ ",
																	project.stiffenerSpacing
																]
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
																x1: "225",
																y1: "115",
																x2: "197",
																y2: "105",
																stroke: "#d66a7a"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("text", {
																x: "232",
																y: "113",
																fontSize: "10",
																fill: "#9d3d4e",
																children: [
																	"Spiral Ø",
																	project.spiralBarDiameter,
																	" @ ",
																	project.spiralSpacing
																]
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
																x1: "225",
																y1: "160",
																x2: "183",
																y2: "158",
																stroke: "#c4912f"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("text", {
																x: "232",
																y: "158",
																fontSize: "10",
																fill: "#805c14",
																children: [
																	project.numBars,
																	" main bars Ø",
																	project.barDiameter
																]
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("text", {
																x: "125",
																y: "230",
																textAnchor: "middle",
																fontSize: "10",
																fill: "#173b5f",
																children: [
																	"Pile Ø",
																	project.diameter,
																	" mm / cover ",
																	project.cover,
																	" mm"
																]
															})
														]
													})]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "border border-slate-300 bg-white p-3",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "mb-2 text-xs",
														children: "Longitudinal cage elevation"
													}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
														viewBox: "0 0 360 240",
														className: "h-56 w-full",
														role: "img",
														"aria-label": "RC reinforcement elevation for calculation report",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
																x: "70",
																y: "18",
																width: "90",
																height: "195",
																fill: "#dbe4ea",
																stroke: "#173b5f"
															}),
															Array.from({ length: Math.min(project.numBars, 8) }, (_, index) => {
																const x = 82 + index / Math.max(1, Math.min(project.numBars, 8) - 1) * 66;
																return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
																	x1: x,
																	y1: "23",
																	x2: x,
																	y2: "208",
																	stroke: "#c4912f",
																	strokeWidth: "2"
																}, index);
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("polyline", {
																points: Array.from({ length: 80 }, (_, index) => {
																	const progress = index / 79;
																	return `${115 + 28 * Math.sin(progress * Math.max(1, project.length * 1e3 / project.spiralSpacing) * Math.PI * 2)},${23 + progress * 185}`;
																}).join(" "),
																fill: "none",
																stroke: "#d66a7a",
																strokeWidth: "1.5"
															}),
															Array.from({ length: Math.max(1, Math.ceil(project.length * 1e3 / project.stiffenerSpacing)) }, (_, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
																x1: "78",
																y1: 28 + index * (180 / Math.max(1, Math.ceil(project.length * 1e3 / project.stiffenerSpacing) - 1)),
																x2: "152",
																y2: 28 + index * (180 / Math.max(1, Math.ceil(project.length * 1e3 / project.stiffenerSpacing) - 1)),
																stroke: "#8b6fc4",
																strokeWidth: "1.5"
															}, index)),
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("text", {
																x: "180",
																y: "48",
																fontSize: "10",
																fill: "#805c14",
																children: [
																	"Main: ",
																	project.numBars,
																	" × Ø",
																	project.barDiameter
																]
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("text", {
																x: "180",
																y: "72",
																fontSize: "10",
																fill: "#9d3d4e",
																children: [
																	"Spiral: Ø",
																	project.spiralBarDiameter,
																	" @ ",
																	project.spiralSpacing
																]
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("text", {
																x: "180",
																y: "96",
																fontSize: "10",
																fill: "#513c86",
																children: [
																	"Stiffener: Ø",
																	project.stiffenerBarDiameter,
																	" @ ",
																	project.stiffenerSpacing
																]
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("text", {
																x: "180",
																y: "120",
																fontSize: "10",
																fill: "#173b5f",
																children: [
																	"Length: ",
																	project.length,
																	" m"
																]
															})
														]
													})]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
												className: "mt-4 w-full border border-slate-300 text-left text-[11px]",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
													className: "bg-slate-200",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
															className: "p-2",
															children: "Reinforcement type"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
															className: "p-2",
															children: "Quantity / spacing"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
															className: "p-2",
															children: "Diameter"
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
															className: "p-2",
															children: "Calculated weight"
														})
													] })
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
														className: "border-t border-slate-300",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
																className: "p-2",
																children: "Main longitudinal bars"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
																className: "p-2",
																children: [
																	project.numBars,
																	" bars × ",
																	project.length,
																	" m"
																]
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
																className: "p-2",
																children: ["Ø", project.barDiameter]
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
																className: "p-2",
																children: [results.mainBarWeight.toFixed(1), " kg"]
															})
														]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
														className: "border-t border-slate-300",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
																className: "p-2",
																children: "Spiral reinforcement"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
																className: "p-2",
																children: [
																	"@ ",
																	project.spiralSpacing,
																	" mm over ",
																	project.length,
																	" m"
																]
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
																className: "p-2",
																children: ["Ø", project.spiralBarDiameter]
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
																className: "p-2",
																children: [results.spiralWeight.toFixed(1), " kg"]
															})
														]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
														className: "border-t border-slate-300",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
																className: "p-2",
																children: "Stiffener reinforcement"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
																className: "p-2",
																children: [
																	"@ ",
																	project.stiffenerSpacing,
																	" mm over ",
																	project.length,
																	" m"
																]
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
																className: "p-2",
																children: ["Ø", project.stiffenerBarDiameter]
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
																className: "p-2",
																children: [results.stiffenerWeight.toFixed(1), " kg"]
															})
														]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
														className: "border-t border-slate-300",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
																className: "p-2",
																children: "Total reinforcement"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
																className: "p-2",
																children: "Main + spiral + stiffener"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
																className: "p-2",
																children: "-"
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
																className: "p-2",
																children: [results.totalRebarWeight.toFixed(1), " kg"]
															})
														]
													})
												] })]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "mt-3 grid grid-cols-2 md:grid-cols-4 gap-3 border border-slate-300 bg-white p-3",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
														"As: ",
														results.rebarArea,
														" mm²"
													] }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
														"ρ: ",
														results.reinforcementRatio,
														"%"
													] }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
														"N",
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("sub", { children: "Rd" }),
														": ",
														results.structuralAxialResistance,
														" kN"
													] }),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
														"RC utilization: ",
														(results.utilizationStructural * 100).toFixed(1),
														"%"
													] })
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "mt-3",
												children: "Reference basis: EN 1992-1-1 concrete compression and reinforcement provisions. Exact clause and National Annex values shall be confirmed for the adopted project edition."
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "mt-6 border-l-4 border-[#b8863b] bg-white/60 p-4 text-xs leading-relaxed",
										children: "Applicable basis: EN 1990, EN 1997-1, EN 1997-2 and EN 1992-1-1. Exact clause references and National Annex parameters shall be confirmed against the adopted project edition. This report is a preliminary calculation aid and does not replace geotechnical investigation or engineering approval."
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
								className: "report-page bg-[#f8f5ed] p-10",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "border-b-2 border-[#173b5f] pb-2 text-2xl font-bold text-[#173b5f]",
										children: "2. Executive Summary & Verification"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-5 grid grid-cols-1 md:grid-cols-4 gap-3 text-xs",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "border border-slate-300 bg-white p-4",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["End bearing R", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("sub", { children: "b,k" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "mt-2 block",
													children: [results.baseResistance, " kN"]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "border border-slate-300 bg-white p-4",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Shaft friction R", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("sub", { children: "s,k" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "mt-2 block",
													children: [results.totalShaftResistance, " kN"]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "border border-slate-300 bg-white p-4",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Total R", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("sub", { children: "c,k" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "mt-2 block",
													children: [results.totalCharacteristicResistance, " kN"]
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "border border-[#b8863b] bg-[#fffaf0] p-4",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Design R", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("sub", { children: "c,d" })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
													className: "mt-2 block",
													children: [results.designResistance, " kN"]
												})]
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
										className: "mt-6 w-full border border-slate-300 text-left text-xs",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
											className: "bg-slate-200",
											children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "p-2",
													children: "Check"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "p-2",
													children: "Demand"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "p-2",
													children: "Resistance / limit"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "p-2",
													children: "Utilization"
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
													className: "p-2",
													children: "Status"
												})
											] })
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
												className: "border-t border-slate-300",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
														className: "p-2",
														children: "EC7 compression"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
														className: "p-2",
														children: [project.nEd, " kN"]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
														className: "p-2",
														children: [results.designResistance, " kN"]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
														className: "p-2",
														children: [(results.utilizationGeotechnical * 100).toFixed(1), "%"]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
														className: "p-2",
														children: results.utilizationGeotechnical <= 1 ? "PASS" : "FAIL"
													})
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
												className: "border-t border-slate-300",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
														className: "p-2",
														children: "Settlement SLS"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
														className: "p-2",
														children: [results.settlementTotal, " mm"]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
														className: "p-2",
														children: [results.allowableSettlement, " mm"]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
														className: "p-2",
														children: [(results.settlementTotal / results.allowableSettlement * 100).toFixed(1), "%"]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
														className: "p-2",
														children: results.settlementTotal <= results.allowableSettlement ? "PASS" : "FAIL"
													})
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
												className: "border-t border-slate-300",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
														className: "p-2",
														children: "RC axial resistance"
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
														className: "p-2",
														children: [project.nEd, " kN"]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
														className: "p-2",
														children: [results.structuralAxialResistance, " kN"]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
														className: "p-2",
														children: [(results.utilizationStructural * 100).toFixed(1), "%"]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
														className: "p-2",
														children: results.utilizationStructural <= 1 ? "PASS" : "FAIL"
													})
												]
											})
										] })]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
								className: "report-page bg-[#f8f5ed] p-10",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
										className: "border-b-2 border-[#173b5f] pb-2 text-2xl font-bold text-[#173b5f]",
										children: "3. Detailed Calculation"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-3 text-xs leading-relaxed",
										children: "Detailed calculation trail with implemented parameters, substituted values, formulas, and results. Exact Eurocode clause references shall be confirmed against the adopted edition and National Annex before issue."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "mt-6 text-lg font-bold text-[#173b5f]",
										children: "3.1 Geometry and section properties"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs",
										children: "Reference: EN 1997-1 pile geometry model and EN 1992-1-1 concrete section properties."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Equation, {
										latex: `D=${project.diameter}\\,\\text{mm},\\quad A_b=${results.pileArea.toFixed(3)}\\,\\text{m}^2,\\quad u=${results.pilePerimeter.toFixed(3)}\\,\\text{m}`,
										tag: "3.1.1"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "mt-6 text-lg font-bold text-[#173b5f]",
										children: "3.2 Effective stress by layer"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs",
										children: "Reference: EN 1997-1 effective-stress approach. Below groundwater, γ′ = γsat − γw; a minimum effective stress of 10 kPa is applied."
									}),
									results.layers.map((resultLayer) => {
										const layer = project.layers.find((item) => item.id === resultLayer.layerId);
										if (!layer) return null;
										const midpoint = layer.topDepth + resultLayer.effectiveLength / 2;
										const submergedGamma = Math.max(1, (layer.gammaSat ?? layer.gamma) - 9.81);
										const stress = midpoint <= project.waterLevel ? layer.gamma * midpoint : layer.gamma * project.waterLevel + submergedGamma * (midpoint - project.waterLevel);
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-3 border-l-2 border-[#b8863b] pl-4",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
													className: "font-mono text-xs font-bold",
													children: [
														resultLayer.layerId,
														" · ",
														layer.name
													]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Equation, {
													latex: `L_{eff}=${resultLayer.effectiveLength.toFixed(2)}\\,\\text{m},\\quad z_m=${midpoint.toFixed(2)}\\,\\text{m},\\quad \\sigma'_{v0}=${Math.max(10, stress).toFixed(1)}\\,\\text{kPa}`,
													tag: `${resultLayer.layerId}.1`
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
													className: "text-[11px] text-slate-600",
													children: [
														"Inputs: γ = ",
														layer.gamma,
														" kN/m³, γ′ = ",
														submergedGamma.toFixed(2),
														" kN/m³, GWL =",
														" ",
														project.waterLevel,
														" m bgl."
													]
												})
											]
										}, `stress-${resultLayer.layerId}`);
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "mt-6 text-lg font-bold text-[#173b5f]",
										children: "3.3 Shaft friction by layer"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs",
										children: "Reference: EN 1997-1 pile shaft resistance provisions. Alpha/beta correlations are preliminary and require geotechnical confirmation."
									}),
									results.layers.map((resultLayer) => {
										const layer = project.layers.find((item) => item.id === resultLayer.layerId);
										if (!layer) return null;
										const alpha = layer.cu <= 40 ? .55 : .45;
										const beta = .8 * Math.tan(layer.phi * Math.PI / 180 * .75);
										const alphaMethod = layer.method === "alpha" && layer.cu > 0;
										return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-3 border-l-2 border-cyan-700 pl-4",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
													className: "font-mono text-xs font-bold",
													children: [
														resultLayer.layerId,
														" · ",
														alphaMethod ? "Alpha / undrained" : "Beta / drained"
													]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Equation, {
													latex: alphaMethod ? `q_{s,k}=\\alpha c_u=${alpha.toFixed(2)}\\times${layer.cu}=${resultLayer.unitResistance.toFixed(2)}\\,\\text{kPa}` : `\\beta=K\\tan(0.75\\varphi')=${beta.toFixed(3)},\\quad q_{s,k}=\\beta\\sigma'_{v0}=${resultLayer.unitResistance.toFixed(2)}\\,\\text{kPa}`,
													tag: `${resultLayer.layerId}.2`
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Equation, {
													latex: `R_{s,i}=q_{s,k}uL_{eff}=${resultLayer.shaftResistance.toFixed(1)}\\,\\text{kN}`,
													tag: `${resultLayer.layerId}.3`
												})
											]
										}, `shaft-detail-${resultLayer.layerId}`);
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Equation, {
										latex: `R_{s,k}=\\sum R_{s,i}=${results.totalShaftResistance}\\,\\text{kN}`,
										tag: "3.3.4"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "mt-6 text-lg font-bold text-[#173b5f]",
										children: "3.4 Toe resistance and design factor"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs",
										children: "Reference: EN 1997-1 pile base resistance and design resistance provisions. Confirm exact clause and National Annex values before issue."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Equation, {
										latex: `q_{b,k}=${results.baseUnitResistance}\\,\\text{kPa},\\quad R_{b,k}=q_{b,k}A_b=${results.baseResistance}\\,\\text{kN}`,
										tag: "3.4.1"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Equation, {
										latex: `R_{c,k}=R_{s,k}+R_{b,k}=${results.totalCharacteristicResistance}\\,\\text{kN}`,
										tag: "3.4.2"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Equation, {
										latex: `R_{c,d}=R_{c,k}/\\gamma_R=${results.totalCharacteristicResistance}/${project.safetyFactor.toFixed(1)}=${results.designResistance}\\,\\text{kN}`,
										tag: "3.4.3"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Equation, {
										latex: `\\eta_{GEO}=N_{Ed}/R_{c,d}=${project.nEd}/${results.designResistance}=${Number.isFinite(results.utilizationGeotechnical) ? results.utilizationGeotechnical.toFixed(3) : "INPUT REQUIRED"}`,
										tag: "3.4.4"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "mt-6 text-lg font-bold text-[#173b5f]",
										children: "3.5 Settlement verification"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs",
										children: "Reference: EN 1997-1 serviceability verification; soil settlement is the application's preliminary empirical estimate."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Equation, {
										latex: `s_{elastic}=${results.settlementElastic}\\,\\text{mm},\\quad s_{soil}=${results.settlementSoil}\\,\\text{mm}`,
										tag: "3.5.1"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Equation, {
										latex: `s_{tot}=s_{elastic}+s_{soil}=${results.settlementTotal}\\,\\text{mm}\\leq${results.allowableSettlement}\\,\\text{mm}`,
										tag: "3.5.2"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "mt-6 text-lg font-bold text-[#173b5f]",
										children: "3.6 RC axial resistance and reinforcement"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs",
										children: "Reference: EN 1992-1-1 concrete compression and reinforcement resistance provisions; exact clause to be confirmed for the adopted project edition."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Equation, {
										latex: `f_{cd}=${(project.fck / 1.5).toFixed(2)}\\,\\text{MPa},\\quad f_{yd}=${(project.fyk / 1.15).toFixed(1)}\\,\\text{MPa}`,
										tag: "3.6.1"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Equation, {
										latex: `A_s=${project.numBars}\\pi(${project.barDiameter}/2)^2=${results.rebarArea}\\,\\text{mm}^2`,
										tag: "3.6.2"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Equation, {
										latex: `N_{Rd}=A_cf_{cd}+A_sf_{yd}=${results.structuralAxialResistance}\\,\\text{kN},\\quad \\eta_{RC}=${(results.utilizationStructural * 100).toFixed(1)}\\%`,
										tag: "3.6.3"
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
								className: "bg-[#f8f5ed] p-10",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
									className: "border-b-2 border-[#173b5f] pb-2 text-2xl font-bold text-[#173b5f]",
									children: "4. Soil Strata Schedule"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
									className: "mt-5 w-full border border-slate-300 text-left font-mono text-[11px]",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
										className: "bg-slate-200",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "p-2",
												children: "Layer"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "p-2",
												children: "Depth"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "p-2",
												children: "Material"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "p-2",
												children: "γ"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "p-2",
												children: "φ'"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "p-2",
												children: "cu"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("th", {
												className: "p-2",
												children: ["R", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("sub", { children: "s,k" })]
											})
										] })
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: results.layers.map((layer) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
										className: "border-t border-slate-300",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "p-2",
												children: layer.layerId
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
												className: "p-2",
												children: [layer.effectiveLength.toFixed(2), " m"]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "p-2",
												children: layer.name
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "p-2",
												children: project.layers.find((item) => item.id === layer.layerId)?.gamma ?? "-"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "p-2",
												children: project.layers.find((item) => item.id === layer.layerId)?.phi ?? "-"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
												className: "p-2",
												children: project.layers.find((item) => item.id === layer.layerId)?.cu ?? "-"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
												className: "p-2",
												children: [layer.shaftResistance.toFixed(1), " kN"]
											})
										]
									}, layer.layerId)) })]
								})]
							})
						]
					})
				]
			})
		]
	});
}
var UNIT_WEIGHT_CONCRETE = 25;
var ES = 2e5;
function round(value, decimals = 1) {
	return Math.round(value * 10 ** decimals) / 10 ** decimals;
}
function barArea(diameter) {
	return Math.PI * diameter * diameter / 4;
}
function pos(x, fallback) {
	return Number.isFinite(x) && x > 0 ? x : fallback;
}
function nonNeg(x, fallback) {
	return Number.isFinite(x) && x >= 0 ? x : fallback;
}
function analyzePileCap(project) {
	const checks = [];
	const push = (id, name, category, demand, demandUnit, resistance, resistanceUnit, utilization, status, clause) => {
		checks.push({
			id,
			name,
			category,
			demand,
			demandUnit,
			resistance,
			resistanceUnit,
			utilization,
			status,
			clause
		});
	};
	const p = {
		fck: Math.max(10, pos(project.fck, 30)),
		fyk: Math.max(400, pos(project.fyk, 500)),
		gammaC: pos(project.gammaC, 1.5),
		gammaS: pos(project.gammaS, 1.15),
		alphaCC: Number.isFinite(project.alphaCC) ? project.alphaCC : .85,
		cNom: Math.max(10, pos(project.cNom, 40)),
		wMax: nonNeg(project.wMax, .3),
		columnLengthX: pos(project.columnLengthX, 600),
		columnWidthY: pos(project.columnWidthY, 400),
		nEd: nonNeg(project.nEd, 0),
		mEd: nonNeg(project.mEd, 0),
		hEd: nonNeg(project.hEd, 0),
		pileDiameter: pos(project.pileDiameter, 800),
		pileSpacing: pos(project.pileSpacing, 2400),
		capLength: pos(project.capLength, 3500),
		capWidth: pos(project.capWidth, 1100),
		capDepth: pos(project.capDepth, 1400),
		tieBarDiameter: pos(project.tieBarDiameter, 25),
		tieBarCount: Math.max(1, Math.round(pos(project.tieBarCount, 7))),
		tieBandWidth: pos(project.tieBandWidth, 800),
		nQp: nonNeg(project.nQp, 0),
		mQp: nonNeg(project.mQp, 0)
	};
	const fcd = p.alphaCC * (p.fck / p.gammaC);
	const fyd = p.fyk / p.gammaS;
	const fctm = .3 * Math.cbrt(p.fck * p.fck);
	const fctk005 = .7 * fctm;
	const nu1 = .6 * (1 - p.fck / 250);
	const ecm = 22e3 * Math.pow((p.fck + 8) / 10, .3);
	const d = Math.max(50, p.capDepth - p.cNom - p.tieBarDiameter / 2);
	const strutAngleRad = Math.atan(2 * d / p.pileSpacing);
	const strutAngleDeg = strutAngleRad * 180 / Math.PI;
	const cotTheta = 1 / Math.tan(strutAngleRad);
	const strutAngleOK = strutAngleDeg >= 45;
	const capSelfWeight = p.capLength / 1e3 * (p.capWidth / 1e3) * (p.capDepth / 1e3) * UNIT_WEIGHT_CONCRETE;
	const totalN = p.nEd + 1.35 * capSelfWeight;
	const totalM = p.mEd + p.hEd * (p.capDepth / 1e3);
	const meanPerPile = totalN / 2;
	const momentEffect = p.mEd > 0 || p.hEd > 0 ? totalM / (p.pileSpacing / 1e3) : 0;
	const reactionHigh = meanPerPile + momentEffect;
	const reactionLow = Math.max(0, meanPerPile - momentEffect);
	const hasUplift = meanPerPile - momentEffect < 0;
	const tieForce = reactionHigh * cotTheta;
	const strutForce = reactionHigh / Math.sin(strutAngleRad);
	const asRequired = tieForce * 1e3 / fyd;
	const asProvided = p.tieBarCount * barArea(p.tieBarDiameter);
	const rebarRatio = asProvided / (p.capWidth * d) * 100;
	const asMin = Math.max(.26 * (fctm / p.fyk) * p.tieBandWidth * d, .0013 * p.tieBandWidth * d);
	const strutArea = p.pileDiameter * p.capWidth;
	const strutStressEd = strutForce * 1e3 / strutArea;
	const strutStressRd = .6 * nu1 * fcd;
	const nodeColStressEd = totalN * 1e3 / (p.columnLengthX * p.columnWidthY);
	const nodeColStressRd = fcd;
	const pileArea = Math.PI * p.pileDiameter * p.pileDiameter / 4;
	const nodePileStressEd = reactionHigh * 1e3 / pileArea;
	const nodePileStressRd = .8 * fcd;
	const k = Math.min(2, 1 + Math.sqrt(200 / d));
	const rhoL = Math.min(.02, asProvided / (p.capWidth * d));
	const vRdc = Math.max(.18 / p.gammaC * k * Math.cbrt(100 * rhoL * p.fck), .035 * Math.sqrt(k * k * k) * Math.sqrt(p.fck));
	const vRdmax = .5 * nu1 * fcd;
	const clearPileToColumn = p.pileSpacing / 2 - p.pileDiameter / 2 - p.columnLengthX / 2;
	const avEff = Math.max(.5 * d, Math.min(Math.max(0, clearPileToColumn), 2 * d));
	const beta = clearPileToColumn > 0 ? 2 * d / avEff : 1;
	const beamShearEd = reactionHigh;
	const beamShearRd = beta * vRdc * p.capWidth * d / 1e3;
	const uCol = 2 * (p.columnLengthX + p.columnWidthY) + 2 * Math.PI * 2 * d;
	const colPunchEd = totalN * 1e3 / (uCol * d);
	const colPunchRd = vRdc;
	const uPile = Math.PI * (p.pileDiameter + 4 * d);
	const pilePunchEd = reactionHigh * 1e3 / (uPile * d);
	const pilePunchRd = vRdc;
	const sigmaSqp = (p.nQp / 2 + p.mQp / (p.pileSpacing / 1e3)) * cotTheta * 1e3 / asProvided;
	const hMinusD = Math.max(10, p.capDepth - d);
	const rhoPeff = slot(asProvided / (p.tieBandWidth * Math.min(2.5 * hMinusD, 100, p.capDepth / 2)));
	const alphaE = ES / ecm;
	const kt = .4;
	const srmax = 3.4 * p.cNom + .17 * p.tieBarDiameter / rhoPeff;
	const crackWidth = srmax * Math.max((sigmaSqp - kt * (fctm / rhoPeff) * (1 + alphaE * rhoPeff)) / ES, .6 * sigmaSqp / ES);
	const fbd = 2.25 * (fctk005 / p.gammaC);
	const anchorageLength = p.tieBarDiameter / 4 * (Math.min(sigmaSqp, fyd) / fbd);
	const lengthPastPile = Math.max(0, (p.pileSpacing - p.pileDiameter) / 2 - p.cNom);
	push("EQ-01", "Reaction equilibrium & uplift", "Geometry", reactionLow, "kN", 0, "kN", hasUplift ? 1 : safeRatio(reactionLow, reactionHigh), hasUplift ? "FAIL" : "PASS", "EN 1990 · ΣV");
	push("GE-02", "Strut angle θ ≥ 45°", "Geometry", strutAngleDeg, "°", 45, "°", strutAngleOK ? safeRatio(45, strutAngleDeg) : 1, strutAngleOK ? "PASS" : "WARNING", "EC2 §6.5 · UK practice");
	push("UL-03", "Tension tie As ≥ F_td/fyd", "ULS", asRequired, "mm²", asProvided, "mm²", safeRatio(asRequired, asProvided), passFail(asRequired, asProvided), "EN 1992-1-1 §6.5.3");
	push("UL-04", "Strut compression (transverse tension)", "ULS", strutStressEd, "MPa", strutStressRd, "MPa", safeRatio(strutStressEd, strutStressRd), passFail(strutStressEd, strutStressRd), "EN 1992-1-1 §6.5.2 / (6.14)");
	push("UL-05", "Column CCC node bearing", "ULS", nodeColStressEd, "MPa", nodeColStressRd, "MPa", safeRatio(nodeColStressEd, nodeColStressRd), passFail(nodeColStressEd, nodeColStressRd), "EN 1992-1-1 §6.5.4");
	push("UL-06", "Pile CCT node bearing", "ULS", nodePileStressEd, "MPa", nodePileStressRd, "MPa", safeRatio(nodePileStressEd, nodePileStressRd), passFail(nodePileStressEd, nodePileStressRd), "EN 1992-1-1 §6.5.4");
	push("UL-07", "Wide beam shear (enhanced)", "ULS", beamShearEd, "kN", beamShearRd, "kN", safeRatio(beamShearEd, beamShearRd), passFail(beamShearEd, beamShearRd), "EN 1992-1-1 §6.2.2(6)");
	push("UL-08", "Column punching (2.0d perimeter)", "ULS", colPunchEd, "MPa", colPunchRd, "MPa", safeRatio(colPunchEd, colPunchRd), passFail(colPunchEd, colPunchRd), "EN 1992-1-1 §6.4.3/6.4.4");
	push("UL-09", "Pile punching (2.0d perimeter)", "ULS", pilePunchEd, "MPa", pilePunchRd, "MPa", safeRatio(pilePunchEd, pilePunchRd), passFail(pilePunchEd, pilePunchRd), "EN 1992-1-1 §6.4.7");
	push("UL-10", "Minimum reinforcement", "ULS", asMin, "mm²", asProvided, "mm²", safeRatio(asMin, asProvided), passFail(asMin, asProvided), "EN 1992-1-1 §9.2.1.1");
	push("SL-11", "Tie steel stress (QP)", "SLS", sigmaSqp, "MPa", .8 * p.fyk, "MPa", safeRatio(sigmaSqp, .8 * p.fyk), passFail(sigmaSqp, .8 * p.fyk), "EN 1992-1-1 §7.2(2)");
	push("SL-12", "Crack width (QP)", "SLS", crackWidth, "mm", p.wMax, "mm", safeRatio(crackWidth, p.wMax), passFail(crackWidth, p.wMax), "EN 1992-1-1 §7.3.4");
	const listing = sortChecks(checks);
	const utilizationMax = utilizationMaxOf(listing);
	const failed = listing.find((c) => c.status === "FAIL");
	let overallStatus = "PASS";
	if (failed || hasUplift) overallStatus = "FAIL";
	else if (listing.some((c) => c.status === "WARNING") || utilizationMax > .9) overallStatus = "WARNING";
	return {
		fcd: round(fcd),
		fyd: round(fyd, 1),
		fctm: round(fctm, 2),
		fctk005: round(fctk005, 2),
		nu1: round(nu1, 3),
		ecm: Math.round(ecm),
		effectiveDepth: round(d),
		strutAngleDeg: round(strutAngleDeg),
		strutAngleOK,
		capSelfWeight: round(capSelfWeight),
		totalN: round(totalN),
		totalM: round(totalM),
		reactionHigh: round(reactionHigh),
		reactionLow: round(reactionLow),
		hasUplift,
		tieForce: round(tieForce),
		strutForce: round(strutForce),
		asRequired: Math.round(asRequired),
		asProvided: Math.round(asProvided),
		rebarRatio: round(rebarRatio, 2),
		strutStressEd: round(strutStressEd, 2),
		strutStressRd: round(strutStressRd, 2),
		nodeColStressEd: round(nodeColStressEd, 2),
		nodeColStressRd: round(nodeColStressRd, 2),
		nodePileStressEd: round(nodePileStressEd, 2),
		nodePileStressRd: round(nodePileStressRd, 2),
		vRdc: round(vRdc, 3),
		vRdmax: round(vRdmax, 2),
		beamShearEd: round(beamShearEd),
		beamShearRd: round(beamShearRd),
		colPunchEd: round(colPunchEd, 3),
		colPunchRd: round(colPunchRd, 3),
		pilePunchEd: round(pilePunchEd, 3),
		pilePunchRd: round(pilePunchRd, 3),
		asMin: Math.round(asMin),
		sigmaSqp: round(sigmaSqp),
		crackWidth: round(crackWidth, 3),
		crackLimit: p.wMax,
		srmax: Math.round(srmax),
		anchorageLength: Math.round(anchorageLength),
		lengthPastPile: Math.round(lengthPastPile),
		checks: listing,
		utilizationMax: round(utilizationMax, 2),
		governingName: listing[0]?.name ?? "—",
		overallStatus
	};
}
function slot(value) {
	return Math.max(1e-4, value);
}
function safeRatio(demand, resistance) {
	if (!Number.isFinite(demand) || !Number.isFinite(resistance)) return 1;
	if (resistance <= 0) return 1;
	return round(demand / resistance, 3);
}
function passFail(demand, resistance) {
	if (!Number.isFinite(demand) || !Number.isFinite(resistance)) return "NOT VERIFIED";
	return demand > resistance ? "FAIL" : "PASS";
}
function utilizationMaxOf(list) {
	return list.reduce((a, b) => Math.max(a, b.utilization), 0);
}
function sortChecks(list) {
	return [...list].sort((a, b) => b.utilization - a.utilization);
}
var defaultPileCapProject = () => ({
	projectName: "Demonstration Building Foundation",
	projectNumber: "PC-2026-STM",
	client: "Structural & Geotechnical Consultants Ltd",
	designer: "Lead Structural Engineer",
	concreteGrade: "C30/37",
	steelGrade: "B500C",
	fck: 30,
	fyk: 500,
	gammaC: 1.5,
	gammaS: 1.15,
	alphaCC: .85,
	exposureClass: "XC2",
	designLife: 50,
	cNom: 40,
	wMax: .3,
	columnLengthX: 600,
	columnWidthY: 400,
	nEd: 2400,
	mEd: 250,
	hEd: 80,
	pileDiameter: 800,
	pileSpacing: 2400,
	capLength: 3500,
	capWidth: 1100,
	capDepth: 1400,
	tieBarDiameter: 25,
	tieBarCount: 7,
	tieBandWidth: 800,
	topMesh: "Ø12 @ 200 B (nominal mesh)",
	nQp: 1800,
	mQp: 120
});
function StatusBadge({ status }) {
	const cls = status === "PASS" ? "bg-emerald-950 border-emerald-600 text-emerald-400" : status === "WARNING" ? "bg-amber-950 border-amber-600 text-amber-300" : status === "FAIL" ? "bg-rose-950 border-rose-600 text-rose-400" : "bg-slate-800 border-slate-600 text-slate-300";
	const icon = status === "PASS" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "size-3" }) : status === "WARNING" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "size-3" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HardHat, { className: "size-3" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: `inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[11px] font-mono ${cls}`,
		children: [icon, status]
	});
}
function StatCard({ label, value, unit, sub, tone = "cyan" }) {
	const color = {
		cyan: "text-cyan-300",
		white: "text-white",
		emerald: "text-emerald-400",
		amber: "text-amber-400",
		rose: "text-rose-400"
	}[tone];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "bg-[#081222]/90 border border-cyan-500/30 rounded-xl p-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-mono text-slate-400",
				children: label
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: `text-2xl font-mono font-bold mt-1 ${color}`,
				children: [
					value,
					" ",
					unit && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs text-cyan-400",
						children: unit
					})
				]
			}),
			sub && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-[11px] font-mono text-slate-500 mt-1",
				children: sub
			})
		]
	});
}
function NumField({ label, value, unit, onChange, min, max, step = 1 }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "block",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
			className: "mb-1 block text-[10px] uppercase tracking-wide text-slate-500",
			children: [label, unit && ` (${unit})`]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			type: "number",
			value: Number.isFinite(value) ? value : 0,
			min,
			max,
			step,
			onChange: (e) => onChange(Number(e.target.value)),
			className: "w-full rounded border border-slate-700 bg-[#040910] px-2 py-1.5 text-white"
		})]
	});
}
function Field({ label, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "block",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "mb-1 block text-[10px] uppercase tracking-wide text-slate-500",
			children: label
		}), children]
	});
}
function Section({ title, hint, children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "bg-[#081222]/95 border border-cyan-500/30 rounded-2xl p-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex items-center justify-between border-b border-cyan-900/60 pb-4 mb-6 gap-3 flex-wrap",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-xl font-bold text-white",
				children: title
			}), hint && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs font-mono text-slate-400 mt-1",
				children: hint
			})] })
		}), children]
	});
}
function ChecksTable({ checks }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "overflow-x-auto",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
			className: "w-full text-left font-mono text-xs",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
				className: "border-b border-slate-700 text-cyan-400 bg-cyan-950/30",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "p-3",
						children: "Check"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "p-3 text-right",
						children: "Demand"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "p-3 text-right",
						children: "Resistance"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "p-3 text-right",
						children: "UR"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "p-3",
						children: "Status"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
						className: "p-3",
						children: "Clause"
					})
				]
			}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
				className: "divide-y divide-slate-800",
				children: checks.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
					className: "hover:bg-slate-900/50",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
							className: "p-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "rounded bg-cyan-950 px-1.5 py-0.5 text-[10px] text-cyan-300",
									children: c.id
								}),
								" ",
								c.name
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
							className: "p-3 text-right text-slate-200",
							children: [
								c.demand.toFixed(2),
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-slate-500",
									children: c.demandUnit
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
							className: "p-3 text-right text-slate-200",
							children: [
								c.resistance.toFixed(2),
								" ",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-slate-500",
									children: c.resistanceUnit
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: `p-3 text-right font-bold ${c.utilization > 1 ? "text-rose-400" : c.utilization > .9 ? "text-amber-400" : "text-emerald-400"}`,
							children: c.utilization.toFixed(2)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "p-3",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusBadge, { status: c.status })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
							className: "p-3 text-slate-500",
							children: c.clause
						})
					]
				}, c.id))
			})]
		})
	});
}
function Eq({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "rounded-lg bg-[#03070e] border border-cyan-900/60 p-3 font-mono text-xs text-cyan-100 overflow-x-auto",
		children
	});
}
var MONO = "JetBrains Mono, monospace";
function PileCapElevation({ project, result }) {
	const W = 760;
	const H = 400;
	const padX = 60;
	const padTop = 46;
	const scaleX = (x) => padX + x / project.capLength * 640;
	const scaleY = (y) => padTop + y / project.capDepth * 304;
	const pileX1 = scaleX((project.capLength - project.pileSpacing) / 2);
	const pileX2 = scaleX((project.capLength + project.pileSpacing) / 2);
	const pileR = project.pileDiameter / project.capLength * 640 * .5;
	const colR = project.columnLengthX / project.capLength * 640 * .5;
	const colX = W / 2;
	const tieY = scaleY(project.capDepth - result.effectiveDepth);
	const colBaseY = scaleY(0);
	const pileTopY = scaleY(project.capDepth);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: `0 0 ${W} ${H}`,
		className: "w-full h-auto max-w-full",
		role: "img",
		"aria-label": "2-pile pile cap strut-and-tie elevation",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("defs", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pattern", {
				id: "pcSoil",
				width: "8",
				height: "8",
				patternUnits: "userSpaceOnUse",
				patternTransform: "rotate(45)",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
					x1: "0",
					y1: "0",
					x2: "0",
					y2: "8",
					stroke: "#7d6650",
					strokeWidth: "1.2",
					strokeOpacity: "0.5"
				})
			}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: 40,
				y: pileTopY,
				width: 680,
				height: H - pileTopY,
				fill: "url(#pcSoil)"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: pileX1 - pileR,
				y: pileTopY,
				width: 2 * pileR,
				height: H - pileTopY,
				fill: "#0f172a",
				stroke: "#0ea5e9",
				strokeWidth: "1.5"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: pileX2 - pileR,
				y: pileTopY,
				width: 2 * pileR,
				height: H - pileTopY,
				fill: "#0f172a",
				stroke: "#0ea5e9",
				strokeWidth: "1.5"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("text", {
				x: pileX1,
				y: 388,
				textAnchor: "middle",
				fill: "#7dd3fc",
				fontSize: "11",
				fontFamily: MONO,
				children: [
					"R-max ",
					result.reactionHigh.toFixed(0),
					" kN"
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("text", {
				x: pileX2,
				y: 388,
				textAnchor: "middle",
				fill: "#7dd3fc",
				fontSize: "11",
				fontFamily: MONO,
				children: [
					"R-min ",
					result.reactionLow.toFixed(0),
					" kN"
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: scaleX(0),
				y: colBaseY - 26,
				width: 640,
				height: pileTopY - colBaseY + 26,
				fill: "rgba(6,182,212,0.10)",
				stroke: "#38bdf8",
				strokeWidth: "2"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: colX - colR,
				y: 16,
				width: 2 * colR,
				height: 30,
				fill: "#1e293b",
				stroke: "#38bdf8",
				strokeWidth: "1.5"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("text", {
				x: colX,
				y: 30,
				textAnchor: "middle",
				fill: "#cbd5e1",
				fontSize: "11",
				fontFamily: MONO,
				children: [
					"Column N=",
					project.nEd,
					" kN"
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
				x1: colX,
				y1: colBaseY,
				x2: pileX1,
				y2: pileTopY,
				stroke: "#f59e0b",
				strokeWidth: "2.5",
				strokeDasharray: "6 3"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
				x1: colX,
				y1: colBaseY,
				x2: pileX2,
				y2: pileTopY,
				stroke: "#f59e0b",
				strokeWidth: "2.5",
				strokeDasharray: "6 3"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
				x1: pileX1 - pileR,
				y1: tieY,
				x2: pileX2 + pileR,
				y2: tieY,
				stroke: "#22d3ee",
				strokeWidth: "3.5"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("text", {
				x: colX,
				y: tieY - 8,
				textAnchor: "middle",
				fill: "#22d3ee",
				fontSize: "11",
				fontFamily: MONO,
				children: [
					"T = ",
					result.tieForce.toFixed(0),
					" kN → As ",
					result.asProvided,
					" mm²"
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
					d: `M ${colX} ${colBaseY} L 450 ${colBaseY} L ${pileX1} ${pileTopY}`,
					fill: "none",
					stroke: "#94a3b8",
					strokeWidth: "1",
					strokeDasharray: "3 3",
					opacity: "0.7"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: 422,
					cy: colBaseY - 10,
					r: "10",
					fill: "none",
					stroke: "#94a3b8",
					strokeWidth: "1",
					opacity: "0.8"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
					x: 422,
					y: colBaseY - 12,
					textAnchor: "middle",
					fill: "#cbd5e1",
					fontSize: "10",
					fontFamily: MONO,
					children: "θ"
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("text", {
				x: pileX1 + 18,
				y: (colBaseY + pileTopY) / 2 - 10,
				fill: "#f59e0b",
				fontSize: "10",
				fontFamily: MONO,
				children: [
					"θ = ",
					result.strutAngleDeg.toFixed(1),
					"°"
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dim, {
				label: `s = ${project.pileSpacing} mm c/c`,
				x1: scaleX(project.capLength / 2),
				x2: pileX2 + 0,
				cx: colX,
				y: 370
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Line, {
				label: "c",
				x: scaleX(project.capLength),
				y1: colBaseY - 26,
				y2: pileTopY,
				cy: (colBaseY - 26 + pileTopY) / 2
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: 13,
				y: colBaseY + 8,
				fill: "#94a3b8",
				fontSize: "10",
				fontFamily: MONO,
				children: "G.L."
			})
		]
	});
}
function PileCapPlan({ project, result }) {
	const W = 520;
	const H = 360;
	const pad = 40;
	const capW = project.capWidth;
	const capL = project.capLength;
	const sx = (x) => pad + x / capL * 440;
	const sy = (y) => pad + y / capW * 280;
	const pileR = Math.min(project.pileDiameter / capL, project.pileDiameter / capW) * 440 / 2;
	const columnW = project.columnWidthY / capW * 280 / 2;
	const columnH = project.columnLengthX / capL * 440 / 2;
	const pileY = 180;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: `0 0 ${W} ${H}`,
		className: "w-full h-auto max-w-full",
		role: "img",
		"aria-label": "2-pile pile cap plan layout",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: sx(0),
				y: sy(0),
				width: 440,
				height: 280,
				fill: "rgba(6,182,212,0.08)",
				stroke: "#38bdf8",
				strokeWidth: "2"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: sx((capL - project.pileSpacing) / 2),
				cy: pileY,
				r: pileR,
				fill: "#0f172a",
				stroke: "#0ea5e9",
				strokeWidth: "1.5"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: sx((capL + project.pileSpacing) / 2),
				cy: pileY,
				r: pileR,
				fill: "#0f172a",
				stroke: "#0ea5e9",
				strokeWidth: "1.5"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("text", {
				x: sx((capL - project.pileSpacing) / 2),
				y: 184,
				textAnchor: "middle",
				fill: "#7dd3fc",
				fontSize: "9",
				fontFamily: MONO,
				children: ["Ø", project.pileDiameter]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("text", {
				x: sx((capL + project.pileSpacing) / 2),
				y: 184,
				textAnchor: "middle",
				fill: "#7dd3fc",
				fontSize: "9",
				fontFamily: MONO,
				children: ["Ø", project.pileDiameter]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: W / 2 - columnH,
				y: H / 2 - columnW,
				width: 2 * columnH,
				height: 2 * columnW,
				fill: "#1e293b",
				stroke: "#38bdf8",
				strokeWidth: "1.5"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("text", {
				x: W / 2,
				y: 183,
				textAnchor: "middle",
				fill: "#cbd5e1",
				fontSize: "9",
				fontFamily: MONO,
				children: [
					project.columnLengthX,
					"×",
					project.columnWidthY
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: sx((capL - project.pileSpacing) / 2),
				y: H / 2 - project.tieBandWidth / capW * 280 / 2,
				width: sx((capL + project.pileSpacing) / 2) - sx((capL - project.pileSpacing) / 2),
				height: project.tieBandWidth / capW * 280,
				fill: "rgba(34,211,238,0.10)",
				stroke: "#22d3ee",
				strokeWidth: "1",
				strokeDasharray: "4 3"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("text", {
				x: sx((capL - project.pileSpacing) / 2),
				y: H / 2 - project.tieBandWidth / capW * 280 / 2 - 6,
				fill: "#22d3ee",
				fontSize: "9",
				fontFamily: MONO,
				children: [
					"tie band ",
					project.tieBandWidth,
					" mm"
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dim, {
				label: `B = ${capW} mm`,
				x1: sx(capL / 2),
				x2: 514,
				cx: sx(capL),
				y: 192
			})
		]
	});
}
function Dim({ label, x1, x2, cx, y }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
			x1: x1 + 18,
			y1: y,
			x2: x2 - 10,
			y2: y,
			stroke: "#94a3b8",
			strokeWidth: "1"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
			x1: x1 + 18,
			y1: y - 4,
			x2: x1 + 18,
			y2: y + 4,
			stroke: "#94a3b8",
			strokeWidth: "1"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
			x1: x2 - 10,
			y1: y - 4,
			x2: x2 - 10,
			y2: y + 4,
			stroke: "#94a3b8",
			strokeWidth: "1"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
			x: cx - 110,
			y: y - 12,
			width: "220",
			height: "16",
			fill: "#07111f",
			rx: "3"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
			x: cx,
			y: y - 1,
			textAnchor: "middle",
			fill: "#cbd5e1",
			fontSize: "10",
			fontFamily: MONO,
			children: label
		})
	] });
}
function Line({ label, x, y1, y2, cy }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
			x1: x,
			y1,
			x2: x,
			y2,
			stroke: "#94a3b8",
			strokeWidth: "1"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
			x1: x - 4,
			y1,
			x2: x + 4,
			y2: y1,
			stroke: "#94a3b8",
			strokeWidth: "1"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
			x1: x - 4,
			y1: y2,
			x2: x + 4,
			y2,
			stroke: "#94a3b8",
			strokeWidth: "1"
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
			x: x - 8,
			y: cy + 4,
			textAnchor: "end",
			fill: "#cbd5e1",
			fontSize: "10",
			fontFamily: MONO,
			children: label
		})
	] });
}
function OverviewTab({ body, setActiveTab }) {
	const { project, res, pad } = body;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 md:grid-cols-4 gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Design Axial (N_Ed)",
						value: `${project.nEd}`,
						unit: "kN",
						sub: "ULS compression, input"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Tie Force (F_td)",
						value: `${res.tieForce}`,
						unit: "kN",
						sub: `θ = ${res.strutAngleDeg}° · cotθ = ${res.reactionHigh > 0 ? (res.tieForce / res.reactionHigh).toFixed(3) : "—"}`
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Tie Reinforcement",
						value: `${res.asProvided}`,
						unit: "mm²",
						sub: `required ${res.asRequired} mm²`,
						tone: res.asProvided >= res.asRequired ? "emerald" : "rose"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
						label: "Overall Status",
						value: res.overallStatus,
						sub: `max UR ${res.utilizationMax}`,
						tone: res.overallStatus === "PASS" ? "emerald" : res.overallStatus === "WARNING" ? "amber" : "rose"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 lg:grid-cols-12 gap-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "lg:col-span-7 bg-[#040910]/95 border border-cyan-500/30 rounded-2xl p-6 flex flex-col justify-between",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center justify-between text-xs font-mono text-cyan-300 border-b border-cyan-900/60 pb-3 mb-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "STRUT-AND-TIE ELEVATION · 2-PILE CAP" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-emerald-400 font-bold",
								children: res.overallStatus
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PileCapElevation, {
							project,
							result: res
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "pt-3 border-t border-cyan-900/60 flex items-center justify-between text-xs font-mono text-slate-300 flex-wrap gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									"Cap ",
									project.capLength,
									" × ",
									project.capWidth,
									" × ",
									project.capDepth,
									" mm"
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									"Piles Ø",
									project.pileDiameter,
									" @ ",
									project.pileSpacing,
									" c/c"
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
									"Reactions: ",
									res.reactionHigh,
									" / ",
									res.reactionLow,
									" kN"
								] })
							]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "lg:col-span-5 bg-[#081222]/95 border border-cyan-500/30 rounded-2xl p-6 flex flex-col justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
						className: "font-display text-base font-bold text-white mb-4 flex items-center gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlidersVertical, { className: "size-4 text-cyan-400" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Quick Parameters" })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4 font-mono text-xs",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between text-slate-300 mb-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Cap Depth (h):" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-cyan-400 font-bold",
									children: [project.capDepth, " mm"]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "range",
								min: "1000",
								max: "2000",
								step: "50",
								value: project.capDepth,
								onChange: (e) => pad({ capDepth: Number(e.target.value) }),
								className: "w-full accent-cyan-500 cursor-pointer"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between text-slate-300 mb-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Pile Spacing (s, c/c):" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-cyan-400 font-bold",
									children: [project.pileSpacing, " mm"]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "range",
								min: "1600",
								max: "3200",
								step: "100",
								value: project.pileSpacing,
								onChange: (e) => pad({ pileSpacing: Number(e.target.value) }),
								className: "w-full accent-cyan-500 cursor-pointer"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between text-slate-300 mb-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Factored Column Load (N_Ed):" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-cyan-400 font-bold",
									children: [project.nEd, " kN"]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "range",
								min: "1000",
								max: "6000",
								step: "100",
								value: project.nEd,
								onChange: (e) => pad({ nEd: Number(e.target.value) }),
								className: "w-full accent-cyan-500 cursor-pointer"
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between text-slate-300 mb-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Tie Bars:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-cyan-400 font-bold",
									children: [
										project.tieBarCount,
										" Ø",
										project.tieBarDiameter,
										" (",
										res.asProvided,
										" mm²)"
									]
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "range",
								min: "3",
								max: "14",
								step: "1",
								value: project.tieBarCount,
								onChange: (e) => pad({ tieBarCount: Number(e.target.value) }),
								className: "w-full accent-cyan-500 cursor-pointer"
							})] })
						]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "pt-4 border-t border-cyan-900/60 mt-6 grid grid-cols-2 gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setActiveTab("stm"),
							className: "py-2.5 px-4 bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-semibold rounded-lg transition shadow-lg",
							children: "STM ULS Checks"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: () => setActiveTab("sls"),
							className: "py-2.5 px-4 bg-slate-800 hover:bg-cyan-700 border border-slate-700 hover:border-cyan-500 text-white font-mono text-xs font-semibold rounded-lg transition",
							children: "SLS Cracks"
						})]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid grid-cols-1 lg:grid-cols-12 gap-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "lg:col-span-8 bg-[#040910]/95 border border-cyan-500/30 rounded-2xl p-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center justify-between text-xs font-mono text-cyan-300 border-b border-cyan-900/60 pb-3 mb-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "PLAN LAYOUT · TIE BAND" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
							project.tieBarCount,
							" Ø",
							project.tieBarDiameter,
							" CONCENTRATED IN BAND"
						] })]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PileCapPlan, {
						project,
						result: res
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "lg:col-span-4 bg-[#081222]/95 border border-cyan-500/30 rounded-2xl p-6 flex flex-col justify-between gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-3 font-mono text-xs text-slate-300",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between border-b border-slate-800 pb-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Effective depth (d)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-cyan-400 font-bold",
									children: [res.effectiveDepth, " mm"]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between border-b border-slate-800 pb-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Strut angle (θ)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-cyan-400 font-bold",
									children: [res.strutAngleDeg, "°"]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between border-b border-slate-800 pb-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Strut force (C)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-cyan-400 font-bold",
									children: [res.strutForce, " kN"]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between border-b border-slate-800 pb-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "As required / provided" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-cyan-400 font-bold",
									children: [
										res.asRequired,
										" / ",
										res.asProvided,
										" mm²"
									]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex justify-between border-b border-slate-800 pb-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Governing check" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-cyan-400 font-bold",
									children: res.governingName
								})]
							})
						]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "rounded-lg bg-slate-950/60 border border-slate-800 p-3 font-mono text-[11px] text-slate-400 leading-relaxed",
						children: "Load path: column → cap → diagonal struts → pile tops → bottom tension tie. Pile geotechnical capacity is verified separately in the Bored Pile module using these reactions."
					})]
				})]
			})
		]
	});
}
var CONCRETE_GRADES = [
	["C25/30", 25],
	["C30/37", 30],
	["C35/45", 35],
	["C40/50", 40],
	["C50/60", 50]
];
var STEEL_GRADES = [
	["B500A", 500],
	["B500B", 500],
	["B500C", 500]
];
var EXPOSURE = [
	["XC1", .4],
	["XC2", .3],
	["XC3", .3],
	["XC4", .3],
	["XD1/XS1", .3]
];
function GeometryTab({ body }) {
	const { project, res, pad } = body;
	const setGrade = (fck) => {
		const grade = CONCRETE_GRADES.find(([, f]) => f === fck);
		pad({
			fck,
			concreteGrade: grade ? grade[0] : project.concreteGrade
		});
	};
	const setSteel = (fyk) => pad({
		fyk,
		steelGrade: fyk === 500 ? "B500C" : project.steelGrade
	});
	const setExposure = (exposureClass) => {
		const found = EXPOSURE.find(([e]) => e === exposureClass);
		pad({
			exposureClass,
			wMax: found ? found[1] : project.wMax
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
				title: "Column & Design Actions",
				hint: "Factored ULS actions applied at the base of the column (top of cap)",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 md:grid-cols-5 gap-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumField, {
							label: "Column length X",
							value: project.columnLengthX,
							unit: "mm",
							onChange: (v) => pad({ columnLengthX: v })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumField, {
							label: "Column width Y",
							value: project.columnWidthY,
							unit: "mm",
							onChange: (v) => pad({ columnWidthY: v })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumField, {
							label: "N_Ed",
							value: project.nEd,
							unit: "kN",
							onChange: (v) => pad({ nEd: v })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumField, {
							label: "M_Ed",
							value: project.mEd,
							unit: "kNm",
							onChange: (v) => pad({ mEd: v })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumField, {
							label: "H_Ed (at cap top)",
							value: project.hEd,
							unit: "kN",
							onChange: (v) => pad({ hEd: v })
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-3 font-mono text-[11px] text-slate-500",
					children: "X is parallel to the line of piles. M_Ed and H_Ed act in that plane. H_Ed adds a lever-arm moment to the cap base."
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
				title: "Piles & Cap Geometry",
				hint: "Two bored piles, concentrated bottom tie in the band between them",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 md:grid-cols-5 gap-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumField, {
							label: "Pile diameter",
							value: project.pileDiameter,
							unit: "mm",
							onChange: (v) => pad({ pileDiameter: v })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumField, {
							label: "Pile spacing s",
							value: project.pileSpacing,
							unit: "mm",
							onChange: (v) => pad({ pileSpacing: v })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumField, {
							label: "Cap length",
							value: project.capLength,
							unit: "mm",
							onChange: (v) => pad({ capLength: v })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumField, {
							label: "Cap width",
							value: project.capWidth,
							unit: "mm",
							onChange: (v) => pad({ capWidth: v })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumField, {
							label: "Cap depth h",
							value: project.capDepth,
							unit: "mm",
							onChange: (v) => pad({ capDepth: v })
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
				title: "Materials",
				hint: "Concrete and reinforcement grades. αcc = 0.85 (UK NA).",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 md:grid-cols-4 gap-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Concrete grade",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
								value: project.fck,
								onChange: (e) => setGrade(Number(e.target.value)),
								className: "w-full rounded border border-slate-700 bg-[#040910] px-2 py-1.5 text-white",
								children: CONCRETE_GRADES.map(([g, f]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: f,
									children: g
								}, g))
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumField, {
							label: "fck",
							value: project.fck,
							unit: "MPa",
							onChange: setGrade
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Steel grade",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
								value: project.fyk,
								onChange: (e) => setSteel(Number(e.target.value)),
								className: "w-full rounded border border-slate-700 bg-[#040910] px-2 py-1.5 text-white",
								children: STEEL_GRADES.map(([g, f]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: f,
									children: g
								}, g))
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumField, {
							label: "fyk",
							value: project.fyk,
							unit: "MPa",
							onChange: setSteel
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 grid grid-cols-2 md:grid-cols-4 gap-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumField, {
							label: "γC",
							value: project.gammaC,
							step: .05,
							onChange: (v) => pad({ gammaC: v })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumField, {
							label: "γS",
							value: project.gammaS,
							step: .05,
							onChange: (v) => pad({ gammaS: v })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumField, {
							label: "αcc (UK NA)",
							value: project.alphaCC,
							step: .05,
							onChange: (v) => pad({ alphaCC: v })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
							label: "Design strengths",
							value: `${res.fcd}`,
							unit: `/ ${res.fyd}`,
							sub: "fcd / fyd MPa",
							tone: "white"
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
				title: "Durability & SLS",
				hint: "Exposure class fixes the crack limit used in §7.3.4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 md:grid-cols-4 gap-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
							label: "Exposure class",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
								value: project.exposureClass,
								onChange: (e) => setExposure(e.target.value),
								className: "w-full rounded border border-slate-700 bg-[#040910] px-2 py-1.5 text-white",
								children: EXPOSURE.map(([e]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
									value: e.replace("/", "_"),
									children: e
								}, e))
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumField, {
							label: "Nominal cover c_nom",
							value: project.cNom,
							unit: "mm",
							onChange: (v) => pad({ cNom: v })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumField, {
							label: "Crack limit w_max",
							value: project.wMax,
							unit: "mm",
							step: .05,
							onChange: (v) => pad({ wMax: v })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumField, {
							label: "Design life",
							value: project.designLife,
							unit: "y",
							onChange: (v) => pad({ designLife: v })
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
				title: "Quasi-permanent SLS actions",
				hint: "Used for crack width and steel stress checks (§7.3.4)",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 md:grid-cols-2 gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumField, {
						label: "N_Qp (axial)",
						value: project.nQp,
						unit: "kN",
						onChange: (v) => pad({ nQp: v })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumField, {
						label: "M_Qp (moment)",
						value: project.mQp,
						unit: "kNm",
						onChange: (v) => pad({ mQp: v })
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
				title: "Derived Geometry & Actions",
				hint: "Live traceable derivation",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-2 md:grid-cols-4 gap-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
							label: "Effective depth (d)",
							value: `${res.effectiveDepth}`,
							unit: "mm",
							sub: "h − c_nom − Ø/2"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
							label: "Cap self weight",
							value: `${res.capSelfWeight}`,
							unit: "kN",
							sub: "25 kN/m³ · characteristic"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
							label: "Total design N + M",
							value: `${res.totalN}`,
							unit: "kN",
							sub: `M = ${res.totalM} kNm`,
							tone: "white"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
							label: "Pile reactions",
							value: `${res.reactionHigh}`,
							unit: "kN",
							sub: `lowest ${res.reactionLow} kN · uplift ${res.hasUplift ? "YES" : "no"}`,
							tone: res.hasUplift ? "rose" : "emerald"
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 grid gap-3 lg:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Eq, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						"R₁ = N_tot/2 + M_tot/s = ",
						res.totalN,
						"/2 + ",
						res.totalM,
						"/(",
						project.pileSpacing,
						"/1000) = ",
						res.reactionHigh,
						" kN"
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-slate-400 mt-1",
						children: [
							"N_tot = N_Ed + γG·G_cap = ",
							project.nEd,
							" + 1.35×",
							res.capSelfWeight,
							" = ",
							res.totalN,
							" kN"
						]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Eq, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						"θ = atan(2d/s) = atan(2×",
						res.effectiveDepth,
						"/",
						project.pileSpacing,
						") = ",
						res.strutAngleDeg,
						"°"
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-slate-400 mt-1",
						children: [
							"d = h − c_nom − Ø/2 = ",
							project.capDepth,
							" − ",
							project.cNom,
							" − ",
							project.tieBarDiameter,
							"/2"
						]
					})] })]
				})]
			})
		]
	});
}
function StmTab({ body }) {
	const { project, res } = body;
	const uls = res.checks.filter((c) => c.category === "ULS");
	const geometry = res.checks.filter((c) => c.category === "Geometry");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
				title: "Strut-and-Tie Model",
				hint: "EN 1992-1-1 §6.5 — column load carried by two diagonal struts to the pile tops; bottom tension tie between piles",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(PileCapElevation, {
						project,
						result: res
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 md:grid-cols-5 gap-4 mt-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
								label: "Strut angle θ",
								value: `${res.strutAngleDeg}`,
								unit: "°",
								sub: "≥ 45° UK practice",
								tone: res.strutAngleOK ? "emerald" : "amber"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
								label: "Tie force F_td",
								value: `${res.tieForce}`,
								unit: "kN",
								sub: "governing pile side"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
								label: "Strut force C",
								value: `${res.strutForce}`,
								unit: "kN",
								sub: "per governing strut"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
								label: "As required",
								value: `${res.asRequired}`,
								unit: "mm²",
								sub: "F_td / fyd"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
								label: "As provided",
								value: `${res.asProvided}`,
								unit: "mm²",
								sub: `${res.rebarRatio}% over width`,
								tone: res.asProvided >= res.asRequired ? "emerald" : "rose"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 grid gap-3 lg:grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Eq, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							"T = R_max·cotθ = ",
							res.reactionHigh,
							" × ",
							res.reactionHigh > 0 ? (res.tieForce / res.reactionHigh).toFixed(3) : "—",
							" = ",
							res.tieForce,
							" kN"
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-slate-400 mt-1",
							children: [
								"cotθ = s/(2d) = ",
								project.pileSpacing,
								"/(2×",
								res.effectiveDepth,
								")"
							]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Eq, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							"C = R_max / sinθ = ",
							res.reactionHigh,
							" / ",
							(res.strutForce > 0 ? res.reactionHigh / res.strutForce : 0).toFixed(3),
							" = ",
							res.strutForce,
							" kN"
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-slate-400 mt-1",
							children: [
								"As,n = F_td / fyd = ",
								res.tieForce,
								"×1000 / ",
								res.fyd,
								" = ",
								res.asRequired,
								" mm²"
							]
						})] })]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
				title: "ULS Verification Matrix",
				hint: "Every ULS check with demand / resistance / utilization / status",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChecksTable, { checks: [...geometry, ...uls] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
				title: "Strut & Node Stresses",
				hint: "Concrete efficiency factors — transverse-tension strut 0.6·ν1, CCC node 1.0·fcd, CCT node 0.8·fcd",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-1 md:grid-cols-3 gap-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-4 rounded-xl bg-[#040910] border border-cyan-900/60",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-slate-400",
									children: "Strut compression σ_Ed ≤ σ_Rd,max"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xl font-bold text-cyan-300 mt-1",
									children: [
										res.strutStressEd,
										" ≤ ",
										res.strutStressRd,
										" MPa"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-[11px] font-mono text-slate-500 mt-1",
									children: [
										"ν1 = 0.6(1−fck/250) = ",
										res.nu1,
										" · fcd = ",
										res.fcd,
										" MPa"
									]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-4 rounded-xl bg-[#040910] border border-cyan-900/60",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-slate-400",
									children: "Column CCC node bearing"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xl font-bold text-cyan-300 mt-1",
									children: [
										res.nodeColStressEd,
										" ≤ ",
										res.nodeColStressRd,
										" MPa"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-[11px] font-mono text-slate-500 mt-1",
									children: [
										"σ = N_tot/(a·b) · area = ",
										project.columnLengthX,
										"×",
										project.columnWidthY,
										" mm²"
									]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "p-4 rounded-xl bg-[#040910] border border-cyan-900/60",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-slate-400",
									children: "Pile CCT node bearing"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "text-xl font-bold text-cyan-300 mt-1",
									children: [
										res.nodePileStressEd,
										" ≤ ",
										res.nodePileStressRd,
										" MPa"
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] font-mono text-slate-500 mt-1",
									children: "σ = R_max/A_pile · A = πØ²/4"
								})
							]
						})
					]
				})
			})
		]
	});
}
function ShearTab({ body }) {
	const { res } = body;
	const uls = res.checks.filter((c) => [
		"UL-07",
		"UL-08",
		"UL-09"
	].includes(c.id));
	const uColDemand = res.checks.find((c) => c.id === "UL-08");
	const uPileDemand = res.checks.find((c) => c.id === "UL-09");
	const uBeamDemand = res.checks.find((c) => c.id === "UL-07");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
				title: "Concrete Shear Resistance",
				hint: "v_Rd,c per §6.4.4 — governing denominator for both beam shear and punching",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-1 md:grid-cols-3 gap-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
							label: "v_Rd,c (basic)",
							value: `${res.vRdc}`,
							unit: "MPa",
							sub: "max(k·…, v_min) without shear steel"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
							label: "v_Rd,max (crushing)",
							value: `${res.vRdmax}`,
							unit: "MPa",
							sub: "0.5·ν1·fcd — adjacent to loaded area"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
							label: "Reinforcement ρl",
							value: `${res.rebarRatio}`,
							unit: "%",
							sub: "As/(b·d) over cap width"
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
				title: "Wide Beam Shear",
				hint: "§6.2 / §6.2.2(6) — vertical plane at distance d from the pile face; enhancement β = 2d/a_v since load sits within 2.5d",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-1 md:grid-cols-3 gap-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
							label: "V_Ed (critical section)",
							value: `${res.beamShearEd}`,
							unit: "kN",
							sub: "governing pile reaction"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
							label: "V_Rd (enhanced)",
							value: `${res.beamShearRd}`,
							unit: "kN",
							sub: "β·v_Rd,c·b·d",
							tone: res.beamShearRd >= res.beamShearEd ? "emerald" : "rose"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
							label: "Utilization",
							value: `${uBeamDemand ? uBeamDemand.utilization.toFixed(2) : "—"}`,
							sub: uBeamDemand?.status ?? "—",
							tone: uBeamDemand && uBeamDemand.utilization > 1 ? "rose" : "emerald"
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
				title: "Punching Shear",
				hint: "§6.4 — control perimeter at 2.0d from column and pile faces; pile caps §6.4.7",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-1 md:grid-cols-2 gap-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-cyan-900/60 bg-[#040910]/70 p-5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-display text-base font-semibold text-white mb-3",
							children: "Around the column"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2 font-mono text-xs text-slate-300",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "v_Ed = N_tot/(u₀·d)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-cyan-300 font-bold",
										children: [res.colPunchEd, " MPa"]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "v_Rd,c" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "text-cyan-300 font-bold",
										children: [res.colPunchRd, " MPa"]
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex justify-between border-t border-slate-800 pt-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Utilization" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: `font-bold ${uColDemand && uColDemand.utilization > 1 ? "text-rose-400" : "text-emerald-400"}`,
										children: uColDemand?.utilization.toFixed(2)
									})]
								})
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-xl border border-cyan-900/60 bg-[#040910]/70 p-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
								className: "font-display text-base font-semibold text-white mb-3",
								children: "Around each pile"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-2 font-mono text-xs text-slate-300",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "v_Ed = R_max/(u·d)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-cyan-300 font-bold",
											children: [res.pilePunchEd, " MPa"]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "v_Rd,c" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
											className: "text-cyan-300 font-bold",
											children: [res.pilePunchRd, " MPa"]
										})]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex justify-between border-t border-slate-800 pt-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Utilization" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: `font-bold ${uPileDemand && uPileDemand.utilization > 1 ? "text-rose-400" : "text-emerald-400"}`,
											children: uPileDemand?.utilization.toFixed(2)
										})]
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 text-[11px] font-mono text-slate-500",
								children: "Bored piles are cast into the cap; full force transfer via the strut model. §6.4.7 perimeter reduction applies where the pile is near a free edge — perimeter here is well inside the cap."
							})
						]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
				title: "Check Detail",
				hint: "Traceable demand / resistance pairings",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChecksTable, { checks: uls })
			})
		]
	});
}
function SlsTab({ body }) {
	const { res, project } = body;
	const sls = res.checks.filter((c) => c.category === "SLS");
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
			title: "Crack Width — Tension Tie (§7.3.4)",
			hint: "Quasi-permanent combination; semi-empirical method against the exposure-dependent limit",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-1 md:grid-cols-4 gap-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
							label: "Steel stress σs (QP)",
							value: `${res.sigmaSqp}`,
							unit: "MPa",
							sub: "F_td,Qp / As,prov",
							tone: res.sigmaSqp > .8 * project.fyk ? "rose" : "cyan"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
							label: "Crack width w_k",
							value: `${res.crackWidth}`,
							unit: "mm",
							sub: `s_r,max × Δε`,
							tone: res.crackWidth <= res.crackLimit ? "emerald" : "rose"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
							label: "Limit w_max",
							value: `${res.crackLimit}`,
							unit: "mm",
							sub: `exposure ${project.exposureClass}`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
							label: "Spacing s_r,max",
							value: `${res.srmax}`,
							unit: "mm",
							sub: "3.4c + 0.425·k1·k2·Ø/ρp,eff"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 grid gap-3 lg:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Eq, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { children: "εsm − εcm = (σs − kt·(fctm/ρp,eff)·(1+αe·ρp,eff)) / Es" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-slate-400 mt-1",
						children: [
							"σs = ",
							res.sigmaSqp,
							" MPa · fctm = ",
							res.fctm,
							" MPa · αe = Es/Ecm = ",
							res.ecm > 0 ? (2e5 / res.ecm).toFixed(2) : "—"
						]
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Eq, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						"w_k = 3.4c + 0.425·k1·k2·Ø/ρp,eff × Δε = ",
						res.srmax,
						" × … = ",
						res.crackWidth,
						" mm"
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "text-slate-400 mt-1",
						children: [
							"kt = 0.4 (long term) · k2 = 0.5 (flexural band) · c = ",
							project.cNom,
							" mm · Ø = ",
							project.tieBarDiameter,
							" mm"
						]
					})] })]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-3 font-mono text-[11px] text-slate-500",
					children: [
						"The tie activates over the band width of ",
						project.tieBandWidth,
						" mm. Settlement is assessed in the Bored Pile module (geotechnical SLS) — NOT VERIFIED within this element calculation."
					]
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
			title: "Check Detail",
			hint: "Traceable demand / resistance pairings",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChecksTable, { checks: sls })
		})]
	});
}
function DetailingTab({ body }) {
	const { project, res, pad } = body;
	const minCheck = res.checks.find((c) => c.id === "UL-10");
	const barsAcross = project.tieBarCount;
	const layers = Math.max(1, Math.ceil(barsAcross / 5));
	const barsPerLayer = Math.ceil(barsAcross / layers);
	const clearSpacingLayer = barsPerLayer > 1 ? (project.tieBandWidth - 2 * (project.cNom + 8) - barsPerLayer * project.tieBarDiameter) / (barsPerLayer - 1) : 8888;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
				title: "Bottom Tie Rebar Schedule",
				hint: "Concentrated band between the piles — placement, spacing and minimum steel",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 md:grid-cols-4 gap-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumField, {
								label: "Bar diameter",
								value: project.tieBarDiameter,
								unit: "mm",
								onChange: (v) => pad({ tieBarDiameter: v })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumField, {
								label: "Number of bars",
								value: project.tieBarCount,
								onChange: (v) => pad({ tieBarCount: v })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumField, {
								label: "Band width",
								value: project.tieBandWidth,
								unit: "mm",
								onChange: (v) => pad({ tieBandWidth: v })
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumField, {
								label: "Nominal cover",
								value: project.cNom,
								unit: "mm",
								onChange: (v) => pad({ cNom: v })
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid grid-cols-2 md:grid-cols-4 gap-4 mt-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
								label: "As provided",
								value: `${res.asProvided}`,
								unit: "mm²",
								sub: `required ${res.asRequired}`,
								tone: res.asProvided >= res.asRequired ? "emerald" : "rose"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
								label: "As,min (§9.2.1.1)",
								value: `${res.asMin}`,
								unit: "mm²",
								sub: `max(0.26fctm/fyk·bd, 0.0013bd)`,
								tone: minCheck?.status === "PASS" ? "emerald" : "rose"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
								label: "Layers / bars",
								value: `${layers} × ${barsPerLayer}`,
								sub: "staggered within band",
								tone: "white"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
								label: "Clear spacing",
								value: `${clearSpacingLayer > 80 ? clearSpacingLayer.toFixed(0) : clearSpacingLayer.toFixed(0)}`,
								unit: "mm",
								sub: "within a layer",
								tone: clearSpacingLayer >= 25 ? "emerald" : "amber"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Eq, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							"As,min = max(0.26×(fctm/fyk)×b×d, 0.0013×b×d) = max(0.26×",
							res.fctm,
							"/",
							project.fyk,
							"×",
							project.tieBandWidth,
							"×",
							res.effectiveDepth,
							", 0.0013×",
							project.tieBandWidth,
							"×",
							res.effectiveDepth,
							") = ",
							res.asMin,
							" mm²"
						] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "text-slate-400 mt-1",
							children: [
								"Provided ",
								project.tieBarCount,
								" Ø",
								project.tieBarDiameter,
								" = ",
								res.asProvided,
								" mm² in the ",
								project.tieBandWidth,
								" mm band between piles. Minimum 2 layers where bar count > 5."
							]
						})] })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 font-mono text-[11px] text-slate-500",
						children: "Bar spacing shown assumes evenly distributed bars across the band; adjust count/diameter so clear spacing ≥ 25 mm (max aggregate) and ≤ 150–200 mm for crack control per §7.3.3."
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
				title: "Anchorage & Detailing",
				hint: "Tie bars must develop their force beyond the pile faces",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid grid-cols-1 md:grid-cols-3 gap-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
							label: "Anchorage l_bd (basic)",
							value: `${res.anchorageLength}`,
							unit: "mm",
							sub: `(Ø/4)·(σs_lim/fbd), fbd = 2.25·fctk,0.05/γC`
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
							label: "Straight length past pile",
							value: `${res.lengthPastPile}`,
							unit: "mm",
							sub: "(s − Ø_pile)/2 − cover",
							tone: res.lengthPastPile >= .6 * res.anchorageLength ? "emerald" : res.lengthPastPile >= res.anchorageLength ? "emerald" : "amber"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatCard, {
							label: "Anchorage ratio",
							value: `${res.lengthPastPile > 0 ? (res.lengthPastPile / Math.max(1, res.anchorageLength)).toFixed(2) : "—"}`,
							sub: "available / required",
							tone: res.lengthPastPile >= res.anchorageLength ? "emerald" : "amber"
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-3 rounded-lg bg-slate-950/60 border border-slate-800 p-3 font-mono text-[11px] text-slate-400 leading-relaxed",
					children: [
						"Extend tie bars into the anchorage zone beyond the pile centreline; provide standard hooks/anchorage heads where the straight length is insufficient. Bored-pile reinforcement cages must project into the cap to the fixity length and the cap bottom bearing casting is one operation. Top nominal mesh ",
						project.topMesh,
						" per §9.7 deep-member surface rule. Provide bursting/tee links at the column zone if node stress is critical."
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
				title: "Check Detail",
				hint: "Minimum reinforcement verification",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChecksTable, { checks: res.checks.filter((c) => [
					"UL-10",
					"EQ-01",
					"GE-02"
				].includes(c.id)) })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-xl border border-amber-500/40 bg-amber-950/20 p-4 font-mono text-xs text-amber-200 leading-relaxed",
				children: "INPUT REQUIRED — confirm site exposure class (true cover), design working life, consequence class, verified column action envelope and pile geotechnical capacities (Bored Pile module) before issuing. This tool is a preliminary design aid; a qualified engineer shall check and approve the issuing design."
			})
		]
	});
}
function ReportTab({ body }) {
	const { project, res } = body;
	const row = (id, descr, demand, resistance) => {
		const u = res.checks.find((x) => x.id === id)?.utilization ?? 0;
		return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
			className: "border-b border-slate-200",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
					className: "p-2 border-r border-slate-300",
					children: descr
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
					className: "p-2 border-r border-slate-300 text-right",
					children: demand
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
					className: "p-2 border-r border-slate-300 text-right",
					children: resistance
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
					className: `p-2 border-r border-slate-300 text-right font-bold ${u > 1 ? "text-rose-700" : ""}`,
					children: u.toFixed(2)
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
					className: `p-2 font-bold ${u > 1 ? "text-rose-700" : "text-emerald-700"}`,
					children: u > 1 ? "FAIL" : "PASS"
				})
			]
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6 bg-white text-slate-900 p-8 rounded-2xl shadow-2xl font-serif print-area",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "border-b-2 border-slate-900 pb-4 flex justify-between items-start no-print",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-bold tracking-wide",
				children: "ENGINEERING CALCULATION SHEET"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-xs font-mono text-slate-600 mt-1",
				children: [
					project.projectName,
					" — 2-Pile Pile Cap (",
					project.projectNumber,
					")"
				]
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: () => window.print(),
				className: "flex items-center gap-1.5 rounded bg-slate-900 px-3 py-1.5 text-xs text-white",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Printer, { className: "size-3.5" }), " Print PDF"]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-7 text-sm",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-bold border-b border-slate-300 pb-1 mb-2 text-base",
					children: "1. Design Basis"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
					className: "list-none font-mono text-xs space-y-1",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Standard: EN 1990 · EN 1992-1-1 (EC2) · EN 1997-1 (EC7, pile loads)" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: ["National Annex: UK NA (provisional) · αcc = ", project.alphaCC] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
							"Design working life: ",
							project.designLife,
							" y · Consequence class CC2 (assumed)"
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
							"Exposure: ",
							project.exposureClass,
							" · w_max = ",
							project.wMax,
							" mm · c_nom = ",
							project.cNom,
							" mm"
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
							"Concrete ",
							project.concreteGrade,
							" (fck = ",
							project.fck,
							" MPa) · ",
							project.steelGrade,
							" (fyk = ",
							project.fyk,
							" MPa)"
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: [
							"γC = ",
							project.gammaC,
							" · γS = ",
							project.gammaS,
							" · fcd = ",
							res.fcd,
							" MPa · fyd = ",
							res.fyd,
							" MPa · fctm = ",
							res.fctm,
							" MPa"
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "Status: PRELIMINARY — NOT VERIFIED until exposure / NA / geotech inputs are confirmed." })
					]
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-bold border-b border-slate-300 pb-1 mb-2 text-base",
						children: "2. Actions & Pile Reactions"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "font-mono text-xs",
						children: [
							"R₁,₂ = N_tot/2 ± M_tot/s \xA0·\xA0 N_tot = N_Ed + γG·G_cap = ",
							project.nEd,
							" + 1.35×",
							res.capSelfWeight,
							" = ",
							res.totalN,
							" kN \xA0·\xA0 M_tot = ",
							res.totalM,
							" kNm"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "font-mono text-xs mt-1",
						children: [
							"R_max = ",
							res.reactionHigh,
							" kN \xA0·\xA0 R_min = ",
							res.reactionLow,
							" kN \xA0·\xA0 uplift: ",
							res.hasUplift ? "YES — FAIL" : "none"
						]
					})
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-bold border-b border-slate-300 pb-1 mb-2 text-base",
						children: "3. Strut-and-Tie Model (§6.5)"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "font-mono text-xs",
						children: [
							"d = h − c − Ø/2 = ",
							project.capDepth,
							" − ",
							project.cNom,
							" − ",
							project.tieBarDiameter,
							"/2 = ",
							res.effectiveDepth,
							" mm \xA0·\xA0 θ = atan(2d/s) = ",
							res.strutAngleDeg,
							"° ",
							res.strutAngleOK ? "(≥ 45°, OK)" : "(< 45° — flag)"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "font-mono text-xs mt-1",
						children: [
							"T = R_max·cotθ = ",
							res.tieForce,
							" kN \xA0·\xA0 C = R_max/sinθ = ",
							res.strutForce,
							" kN \xA0·\xA0 As,n = ",
							res.asRequired,
							" mm² → provided ",
							project.tieBarCount,
							" Ø",
							project.tieBarDiameter,
							" = ",
							res.asProvided,
							" mm² in ",
							project.tieBandWidth,
							" mm band"
						]
					})
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-bold border-b border-slate-300 pb-1 mb-2 text-base",
					children: "4. Verification Table"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full text-left font-mono text-xs border border-slate-300",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "bg-slate-100 border-b border-slate-300",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-2 border-r border-slate-300",
								children: "Check"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-2 border-r border-slate-300 text-right",
								children: "Demand"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-2 border-r border-slate-300 text-right",
								children: "Capacity"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-2 border-r border-slate-300 text-right",
								children: "UR"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "p-2",
								children: "Status"
							})
						]
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tbody", { children: [
						row("UL-03", "Tension tie", `${res.asRequired} mm²`, `${res.asProvided} mm²`),
						row("UL-04", "Strut compression", `${res.strutStressEd} MPa`, `${res.strutStressRd} MPa`),
						row("UL-05", "Column CCC node", `${res.nodeColStressEd} MPa`, `${res.nodeColStressRd} MPa`),
						row("UL-06", "Pile CCT node", `${res.nodePileStressEd} MPa`, `${res.nodePileStressRd} MPa`),
						row("UL-07", "Wide beam shear", `${res.beamShearEd} kN`, `${res.beamShearRd} kN`),
						row("UL-08", "Column punching", `${res.colPunchEd} MPa`, `${res.colPunchRd} MPa`),
						row("UL-09", "Pile punching", `${res.pilePunchEd} MPa`, `${res.pilePunchRd} MPa`),
						row("UL-10", "Minimum rebar", `${res.asMin} mm²`, `${res.asProvided} mm²`),
						row("SL-11", "Steel stress (QP)", `${res.sigmaSqp} MPa`, `${.8 * project.fyk} MPa`),
						row("SL-12", "Crack width", `${res.crackWidth} mm`, `${res.crackLimit} mm`)
					] })]
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-bold border-b border-slate-300 pb-1 mb-2 text-base",
					children: "5. SLS — Crack Width (§7.3.4)"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "font-mono text-xs",
					children: [
						"σs,Qp = ",
						res.sigmaSqp,
						" MPa · s_r,max = ",
						res.srmax,
						" mm · w_k = ",
						res.crackWidth,
						" mm ≤ ",
						res.crackLimit,
						" mm"
					]
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-bold border-b border-slate-300 pb-1 mb-2 text-base",
						children: "6. Durability & Detailing"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "font-mono text-xs",
						children: [
							"Anchorage l_bd = ",
							res.anchorageLength,
							" mm · straight length past pile ",
							res.lengthPastPile,
							" mm · top mesh ",
							project.topMesh
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-mono text-xs mt-1",
						children: "Note: settlement and geotechnical resistance are assessed in the Bored Pile module using reactions R_max / R_min — NOT verified in this sheet."
					})
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-bold border-b border-slate-300 pb-1 mb-2 text-base",
					children: "7. Conclusion"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
					"Maximum utilization ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "font-bold",
						children: ["UR_max = ", res.utilizationMax]
					}),
					" (",
					res.governingName,
					"). Overall status:",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: `font-bold ${res.overallStatus === "FAIL" ? "text-rose-700" : res.overallStatus === "WARNING" ? "text-amber-700" : "text-emerald-700"}`,
						children: res.overallStatus
					}),
					". This AI-generated calculation is an engineering support document and shall not replace independent engineering judgement, checking, approval, or statutory responsibility."
				] })] })
			]
		})]
	});
}
var TABS = [
	{
		id: "overview",
		label: "1. Overview & HUD",
		icon: Compass
	},
	{
		id: "geometry",
		label: "2. Loads & Geometry",
		icon: SlidersVertical
	},
	{
		id: "stm",
		label: "3. STM ULS",
		icon: Database
	},
	{
		id: "shear",
		label: "4. Shear & Punching",
		icon: ShieldCheck
	},
	{
		id: "sls",
		label: "5. SLS & Durability",
		icon: Calculator
	},
	{
		id: "detailing",
		label: "6. Detailing & Rebar",
		icon: Layers
	},
	{
		id: "report",
		label: "7. Calculation Report",
		icon: FileText
	}
];
function PileCapView() {
	const userEmail = useProject((s) => s.userEmail);
	const logout = useProject((s) => s.logout);
	const setActiveModule = useProject((s) => s.setActiveModule);
	const [project, setProject] = (0, import_react.useState)(defaultPileCapProject());
	const [activeTab, setActiveTab] = (0, import_react.useState)("overview");
	const pad = (patch) => setProject((prev) => ({
		...prev,
		...patch
	}));
	const res = (0, import_react.useMemo)(() => analyzePileCap(project), [project]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-[#07111f] text-slate-100 flex flex-col font-sans selection:bg-cyan-500/30 selection:text-cyan-200 relative overflow-x-hidden",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 bg-[linear-gradient(to_right,#16263d_1px,transparent_1px),linear-gradient(to_bottom,#16263d_1px,transparent_1px)] bg-[size:4rem_4rem] opacity-35 pointer-events-none" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "relative z-20 border-b border-[#1e3a5f]/60 bg-[#060e18]/95 backdrop-blur-md px-6 py-4 flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: () => setActiveModule("modules"),
							className: "flex items-center gap-2 px-3 py-1.5 rounded-lg bg-cyan-950/80 hover:bg-cyan-900 border border-cyan-500/40 text-cyan-300 font-mono text-xs transition duration-150",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Modules Dashboard" })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-5 w-px bg-slate-700 hidden sm:block" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "font-display text-sm sm:text-base font-bold tracking-wider text-white uppercase",
							children: "PILE CAP DESIGN — 2 PILES"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-[11px] font-mono text-cyan-400",
							children: "EN 1992-1-1 Strut-and-Tie · UK NA · 2 × Bored Piles"
						})] })
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3 font-mono text-xs",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0b192c] border border-slate-700/70 text-slate-300",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: `size-2 rounded-full ${res.overallStatus === "FAIL" ? "bg-rose-500" : res.overallStatus === "WARNING" ? "bg-amber-400" : "bg-emerald-500"} animate-pulse` }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								res.overallStatus,
								" · UR ",
								res.utilizationMax
							] })]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#0b192c] border border-slate-700/70 text-slate-300",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: userEmail || "str.design.test" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							onClick: logout,
							className: "flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-rose-950/80 hover:border-rose-700/60 border border-slate-700 text-slate-300 hover:text-rose-300 transition duration-150",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "size-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Logout" })]
						})
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "relative z-15 bg-[#040910]/90 border-b border-[#1e3a5f]/80 px-6 flex overflow-x-auto gap-1 font-mono text-xs",
				children: TABS.map((tab) => {
					const Icon = tab.icon;
					const isActive = activeTab === tab.id;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						onClick: () => setActiveTab(tab.id),
						className: `flex items-center gap-2 px-4 py-3 border-b-2 font-medium transition whitespace-nowrap ${isActive ? "border-cyan-400 text-cyan-300 bg-cyan-950/40" : "border-transparent text-slate-400 hover:text-slate-200 hover:bg-slate-900/40"}`,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: `size-4 ${isActive ? "text-cyan-400" : "text-slate-500"}` }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: tab.label })]
					}, tab.id);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "relative z-10 flex-1 max-w-7xl w-full mx-auto p-6 sm:p-8 flex flex-col",
				children: [
					activeTab === "overview" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OverviewTab, {
						body: {
							project,
							res,
							pad
						},
						setActiveTab
					}),
					activeTab === "geometry" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GeometryTab, { body: {
						project,
						res,
						pad
					} }),
					activeTab === "stm" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StmTab, { body: {
						project,
						res,
						pad
					} }),
					activeTab === "shear" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShearTab, { body: {
						project,
						res,
						pad
					} }),
					activeTab === "sls" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlsTab, { body: {
						project,
						res,
						pad
					} }),
					activeTab === "detailing" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DetailingTab, { body: {
						project,
						res,
						pad
					} }),
					activeTab === "report" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ReportTab, { body: {
						project,
						res,
						pad
					} })
				]
			})
		]
	});
}
function plaxisLessonStages(depth, method) {
	const cut = Math.max(.25, depth / 3);
	const permanentProp = method === "top-down" ? "permanent slab prop" : method === "semi-top-down" ? "intermediate slab / prop" : "strut";
	return [
		{
			id: "P0",
			title: "Initial phase — K₀ stresses",
			action: "Generate initial effective stresses and pore pressures; soil is active and structural elements are inactive.",
			excavationDepth: 0,
			wallActive: false,
			interfacesActive: false,
			surchargeActive: false,
			supportsActive: 0,
			waterInExcavation: true
		},
		{
			id: "P1",
			title: "Install wall, interfaces and surcharge",
			action: "Activate retaining wall, soil–structure interfaces and crest surcharge without removing soil.",
			excavationDepth: 0,
			wallActive: true,
			interfacesActive: true,
			surchargeActive: true,
			supportsActive: 0,
			waterInExcavation: true
		},
		{
			id: "P2",
			title: "Excavation stage 1",
			action: "Deactivate the first excavation cluster; retain the modelled pore-pressure field.",
			excavationDepth: cut,
			wallActive: true,
			interfacesActive: true,
			surchargeActive: true,
			supportsActive: 0,
			waterInExcavation: true
		},
		{
			id: "P3",
			title: `Activate ${permanentProp}`,
			action: `Activate the ${permanentProp} at the designed level before the next excavation cut.`,
			excavationDepth: cut,
			wallActive: true,
			interfacesActive: true,
			surchargeActive: true,
			supportsActive: 1,
			waterInExcavation: true
		},
		{
			id: "P4",
			title: "Excavation stage 2",
			action: "Deactivate the second excavation cluster. Do not remove pore pressures unless a separately modelled dewatering phase applies.",
			excavationDepth: cut * 2,
			wallActive: true,
			interfacesActive: true,
			surchargeActive: true,
			supportsActive: 1,
			waterInExcavation: true
		},
		{
			id: "P5",
			title: "Final excavation stage",
			action: "Deactivate the final excavation cluster to formation level; assess wall actions, movements, base stability and seepage.",
			excavationDepth: depth,
			wallActive: true,
			interfacesActive: true,
			surchargeActive: true,
			supportsActive: 1,
			waterInExcavation: true
		},
		{
			id: "P6",
			title: "Base slab / load transfer",
			action: "Activate base slab and transfer the temporary restraint only after verifying the permanent load path.",
			excavationDepth: depth,
			wallActive: true,
			interfacesActive: true,
			surchargeActive: true,
			supportsActive: 1,
			waterInExcavation: true
		}
	];
}
function screenPhases(args) {
	return plaxisLessonStages(args.depth, args.method).map((phase) => {
		const H = phase.excavationDepth;
		const governing = args.layers.find((layer) => -layer.zTop <= H && -layer.zBot >= 0) ?? args.layers[0];
		const phi = governing?.phi ?? 0;
		const ka = Math.tan((45 - phi / 2) * Math.PI / 180) ** 2;
		const gamma = governing?.gamma ?? 0;
		const soilResultant = .5 * ka * gamma * H ** 2;
		const waterHead = phase.waterInExcavation ? 0 : Math.max(0, H - args.waterLevel);
		const waterDifferential = .5 * args.gammaW * waterHead ** 2;
		const surchargeResultant = phase.surchargeActive ? ka * args.surcharge * H : 0;
		const momentProxy = (soilResultant + waterDifferential + surchargeResultant) * H / 3;
		return {
			...phase,
			ka,
			soilResultant,
			waterDifferential,
			surchargeResultant,
			momentProxy,
			status: phase.id === "P0" ? "INPUT REQUIRED" : "NOT VERIFIED"
		};
	});
}
var STRATA = [
	"#d7bd8a",
	"#c99f67",
	"#9ba87b",
	"#a5816b",
	"#879a9e"
];
var methodStages = {
	"bottom-up": [
		{
			title: "Install retaining wall",
			detail: "Install sheet piles or CBP wall, guide wall/capping beam and verified toe level."
		},
		{
			title: "Dewater and excavate in lifts",
			detail: "Excavate to the first support level while controlling water and crest loading."
		},
		{
			title: "Install temporary supports",
			detail: "Install/preload struts or anchors before each lower excavation stage."
		},
		{
			title: "Reach formation level",
			detail: "Inspect formation, assess basal heave/uplift and complete the blinding/base preparation."
		},
		{
			title: "Construct basement from base up",
			detail: "Cast base slab, walls and floors; remove temporary supports only after load transfer is verified."
		}
	],
	"top-down": [
		{
			title: "Install wall and foundation elements",
			detail: "Construct retaining wall plus plunge columns/barrettes/piles and capping system."
		},
		{
			title: "Cast ground-level slab",
			detail: "Cast permanent ground floor/transfer slab to act as the first lateral prop."
		},
		{
			title: "Excavate beneath slab in stages",
			detail: "Excavate through controlled openings; each completed basement slab becomes a permanent prop."
		},
		{
			title: "Complete lower slabs and base",
			detail: "Form each basement level, verify slab-to-wall connection and construct the base slab at formation."
		},
		{
			title: "Complete superstructure and closure",
			detail: "Close openings and transfer final loads in the designed sequence."
		}
	],
	"semi-top-down": [
		{
			title: "Install wall and primary supports",
			detail: "Construct the retaining wall, foundation elements and the selected first permanent/temporary support level."
		},
		{
			title: "Excavate to intermediate level",
			detail: "Use an open excavation or partial slab zone while monitoring wall and groundwater response."
		},
		{
			title: "Cast intermediate slab / prop",
			detail: "Complete the designated slab or waler/strut level before excavating below it."
		},
		{
			title: "Excavate to formation",
			detail: "Continue in supported lifts, with water control and basal-stability checks at every stage."
		},
		{
			title: "Construct base and remaining basement",
			detail: "Build upward from the base while maintaining the approved support-removal sequence."
		}
	]
};
function ExcavationSupportView() {
	const project = useProject((s) => s.project);
	const patch = useProject((s) => s.patch);
	const setActiveModule = useProject((s) => s.setActiveModule);
	const [method, setMethod] = (0, import_react.useState)("bottom-up");
	const [stage, setStage] = (0, import_react.useState)(0);
	const [excavationDepth, setExcavationDepth] = (0, import_react.useState)(8);
	const [wallToe, setWallToe] = (0, import_react.useState)(15);
	const [waterLevel, setWaterLevel] = (0, import_react.useState)(2.5);
	const [basementLevels, setBasementLevels] = (0, import_react.useState)(3);
	const isCbp = project.wallSystem === "cbp";
	const cbp = project.cbp ?? {
		diameter: .8,
		spacing: .95,
		clearGap: .15,
		waterCutoff: "none"
	};
	const stages = methodStages[method];
	const plaxisPhases = (0, import_react.useMemo)(() => screenPhases({
		layers: project.nativeLayers,
		depth: excavationDepth,
		waterLevel,
		surcharge: 5,
		gammaW: project.water.gammaW,
		method
	}), [
		project.nativeLayers,
		project.water.gammaW,
		excavationDepth,
		waterLevel,
		method
	]);
	const levelDepths = (0, import_react.useMemo)(() => Array.from({ length: Math.max(1, basementLevels) }, (_, i) => (i + 1) * excavationDepth / basementLevels), [basementLevels, excavationDepth]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-paper text-ink",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
			className: "title-block sticky top-0 z-30",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto flex max-w-[1600px] items-center gap-3 px-4 py-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						variant: "ghost",
						className: "text-paper hover:bg-navy-mid",
						onClick: () => setActiveModule("modules"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowLeft, { className: "size-4" }), " Modules"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "min-w-0 flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-mono text-[10px] uppercase tracking-[.18em] text-paper/65",
							children: "Basement excavation support · EN 1997 / EN 1992 / EN 1993 workflow"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
							className: "truncate font-display text-lg font-semibold",
							children: [isCbp ? "CBP Wall" : "Sheet Pile", " · Basement Excavation Design"]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, { status: "INPUT REQUIRED" })
				]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
			className: "mx-auto grid max-w-[1600px] gap-4 p-4 xl:grid-cols-[330px_minmax(0,1fr)_310px]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						title: "Excavation concept",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
									label: "Retaining wall",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: isCbp ? "cbp" : "sheet-pile",
										onChange: (e) => patch((q) => {
											q.wallSystem = e.target.value;
										}),
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "sheet-pile",
											children: "Sheet pile wall"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
											value: "cbp",
											children: "Contiguous bored pile wall"
										})]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
									label: "Construction method",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
										value: method,
										onChange: (e) => {
											setMethod(e.target.value);
											setStage(0);
										},
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "bottom-up",
												children: "Bottom-up"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "top-down",
												children: "Top-down"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "semi-top-down",
												children: "Semi-top-down"
											})
										]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
									label: "Excavation depth below GL",
									unit: "m",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumInput, {
										value: excavationDepth,
										step: .25,
										onChange: setExcavationDepth
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
									label: "Wall toe below GL",
									unit: "m",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumInput, {
										value: wallToe,
										step: .25,
										onChange: setWallToe
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
									label: "Basement levels",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumInput, {
										value: basementLevels,
										step: 1,
										onChange: (n) => setBasementLevels(Math.max(1, Math.round(n)))
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field$1, {
									label: "Design groundwater below GL",
									unit: "m",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumInput, {
										value: waterLevel,
										step: .25,
										onChange: setWaterLevel
									})
								})
							]
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
						title: isCbp ? "CBP wall input" : "Sheet-pile wall input",
						children: isCbp ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
									"D = ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", { children: [cbp.diameter.toFixed(2), " m"] }),
									" · spacing = ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", { children: [cbp.spacing.toFixed(2), " m"] })
								] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["Clear gap = ", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", { children: [cbp.clearGap.toFixed(2), " m"] })] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["Water cut-off: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: cbp.waterCutoff })] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted",
									children: "This workspace controls the basement support concept and sequence. Pile diameter/spacing, reinforcement and the N-M structural check live in the detailed CBP design workspace."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
									variant: "outline",
									className: "w-full",
									onClick: () => setActiveModule("cbp-detail"),
									children: ["Open detailed CBP structural design ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "size-4" })]
								})
							]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-2 text-sm",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["Section: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: project.sheetPile.sectionName })] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: ["Wall thickness: ", /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("b", { children: [(project.geometry.wallThickness * 1e3).toFixed(0), " mm"] })] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-xs text-muted",
									children: "Manufacturer section properties, installation method and corrosion allowance are still required before structural verification."
								})
							]
						})
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "min-w-0 space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
							title: "Basement excavation section",
							action: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "font-mono text-xs text-muted",
								children: [
									"Stage ",
									stage + 1,
									" / ",
									stages.length
								]
							}),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BasementSection, {
								layers: project.nativeLayers,
								excavationDepth,
								wallToe,
								waterLevel,
								levelDepths,
								wallType: isCbp ? "cbp" : "sheet",
								method,
								activeStage: stage
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 flex flex-wrap gap-2 text-xs text-muted",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "inline-flex items-center gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-3 rounded-sm bg-[#d7bd8a]" }), " Soil layer"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "inline-flex items-center gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "size-3 rounded-sm bg-[#596775]" }), " Retaining wall"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "inline-flex items-center gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-0.5 w-4 bg-[#9b2f28]" }), " Temporary prop / permanent slab"]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "inline-flex items-center gap-1",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { className: "h-0.5 w-4 bg-water" }), " Design water level"]
									})
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
							title: "PLAXIS-style staged construction",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid gap-2 md:grid-cols-5",
								children: stages.map((item, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
									onClick: () => setStage(index),
									className: `rounded border p-3 text-left transition ${stage === index ? "border-accent bg-info-bg" : "border-rule bg-panel hover:border-rule-strong"}`,
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
										className: "font-mono text-[10px] text-muted",
										children: ["STAGE ", index + 1]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-sm font-semibold text-navy",
										children: item.title
									})]
								}, item.title))
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "mt-3 rounded border-l-4 border-accent bg-paper-2 p-3",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "font-display text-sm font-semibold text-navy",
									children: stages[stage].title
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-sm",
									children: stages[stage].detail
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
							title: "Phase calculation register",
							action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "font-mono text-xs text-muted",
								children: "Screening only · not a FEM output"
							}),
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mb-3 text-sm text-muted",
									children: "The sequence follows Lesson 02: initial K₀ state → wall/interfaces/surcharge → excavation cut → prop activation → subsequent cuts. Water remains active in the excavation to represent a submerged construction phase."
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "overflow-x-auto",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
										className: "eng-table",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Phase" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Activation / action" }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "num",
												children: "Excav."
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "num",
												children: "Pₐ"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "num",
												children: "ΔPᵥ"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "num",
												children: "Pq"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
												className: "num",
												children: "M proxy"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Status" })
										] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: plaxisPhases.map((phase, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
											className: index === stage ? "bg-info-bg" : "",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
													className: "font-mono",
													children: phase.id
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													onClick: () => setStage(Math.min(index, stages.length - 1)),
													className: "text-left text-accent hover:underline",
													children: phase.title
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
													className: "mt-0.5 text-xs text-muted",
													children: [
														phase.wallActive ? "Wall" : "Soil only",
														" · ",
														phase.interfacesActive ? "interfaces" : "no interfaces",
														" · ",
														phase.supportsActive ? `${phase.supportsActive} prop` : "no prop"
													]
												})] }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
													className: "num",
													children: [phase.excavationDepth.toFixed(2), " m"]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
													className: "num",
													children: [phase.soilResultant.toFixed(1), " kN/m"]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
													className: "num",
													children: [phase.waterDifferential.toFixed(1), " kN/m"]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
													className: "num",
													children: [phase.surchargeResultant.toFixed(1), " kN/m"]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", {
													className: "num",
													children: [phase.momentProxy.toFixed(1), " kNm/m"]
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StatusPill, { status: phase.status }) })
											]
										}, phase.id)) })]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-3 text-xs text-muted",
									children: "Pₐ uses a transparent Rankine screening coefficient for the layer at the active cut. M proxy is not wall bending resistance or PLAXIS output. It is included only to make stage effects traceable until a validated beam-on-springs or FEM solver is connected."
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SoilStrataBuilder, {})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
					className: "space-y-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
							title: "Required design checks",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Checklist, {})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
							title: "Critical input gaps",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-3 text-sm",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Warning, {
										icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Layers, { className: "size-4" }),
										text: "Confirm ground model and borehole/CPT coverage beyond the excavation."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Warning, {
										icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Waves, { className: "size-4" }),
										text: "Confirm seasonal piezometric levels and dewatering discharge route."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Warning, {
										icon: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "size-4" }),
										text: "Set movement limits and survey nearby foundations, roads and utilities."
									})
								]
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
							title: "Design status",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-semibold text-warn",
								children: "NOT VERIFIED"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-xs text-muted",
								children: "This is the correct basement-excavation concept workspace. It will not issue PASS until construction stages, soil/water actions, wall/support resistance, basal heave, seepage and global stability are verified."
							})]
						})
					]
				})
			]
		})]
	});
}
function SoilStrataBuilder() {
	const layers = useProject((s) => s.project.nativeLayers);
	const patch = useProject((s) => s.patch);
	const gaps = layers.slice(0, -1).filter((layer, index) => Math.abs(layer.zBot - layers[index + 1].zTop) > .01);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		title: "Step 1 · Soil strata / ground-model builder",
		action: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			variant: "outline",
			onClick: () => patch((p) => {
				const top = p.nativeLayers.at(-1)?.zBot ?? 0;
				p.nativeLayers.push({
					id: uid("stratum"),
					name: `Layer ${p.nativeLayers.length + 1}`,
					description: "User-defined stratum",
					zTop: top,
					zBot: top - 3,
					gamma: 18,
					gammaSat: 20,
					phi: 30,
					c: 0,
					cu: 0,
					E: 2e4,
					nu: .3,
					kPerm: 1e-5,
					OCR: 1,
					sptN: 10,
					drainage: "drained",
					soilType: "soil"
				});
			}),
			children: "Add stratum"
		}),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mb-3 text-sm text-muted",
				children: "Define strata from ground level downward. The coloured section above is generated directly from these elevations. Elevations are in metres relative to the project datum; the top elevation must be greater than the bottom elevation."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "overflow-x-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "eng-table min-w-[1120px]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Stratum" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Material / description" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "num",
							children: "Top z"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "num",
							children: "Bottom z"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "num",
							children: "γ"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "num",
							children: "γsat"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "num",
							children: "φ′"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "num",
							children: "c′"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "num",
							children: "cu"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "num",
							children: "E"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
							className: "num",
							children: "SPT N"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", { children: "Drainage" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {})
					] }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: layers.map((layer, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "mr-1.5 inline-block size-3 rounded-sm align-middle",
							style: { background: STRATA[index % STRATA.length] }
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
							className: "inline-flex w-32",
							value: layer.name,
							onChange: (e) => patch((p) => p.nativeLayers[index].name = e.target.value)
						})] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
							className: "w-32",
							value: layer.soilType,
							onChange: (e) => patch((p) => p.nativeLayers[index].soilType = e.target.value)
						}) }),
						[
							"zTop",
							"zBot",
							"gamma",
							"gammaSat",
							"phi",
							"c",
							"cu",
							"E",
							"sptN"
						].map((field) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumInput, {
							value: layer[field],
							step: field === "E" ? 1e3 : .1,
							onChange: (n) => patch((p) => p.nativeLayers[index][field] = n)
						}) }, field)),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: layer.drainage,
							onChange: (e) => patch((p) => p.nativeLayers[index].drainage = e.target.value),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "drained",
								children: "Drained"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
								value: "undrained",
								children: "Undrained"
							})]
						}) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							className: "text-fail",
							onClick: () => patch((p) => p.nativeLayers.splice(index, 1)),
							disabled: layers.length === 1,
							children: "Remove"
						}) })
					] }, layer.id)) })]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-3 grid gap-2 sm:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: `rounded p-2 text-xs ${gaps.length ? "bg-warn-bg text-warn" : "bg-pass-bg text-pass"}`,
					children: gaps.length ? `${gaps.length} layer boundary gap or overlap detected. Align each layer bottom with the next layer top.` : "Layer boundaries are continuous."
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "rounded bg-info-bg p-2 text-xs text-info",
					children: "Enter only approved characteristic/design soil parameters. Raw SPT/CPT values need interpretation before being used as design values."
				})]
			})
		]
	});
}
function BasementSection({ layers, excavationDepth, wallToe, waterLevel, levelDepths, wallType, method, activeStage }) {
	const W = 760;
	const H = 520;
	const maxDepth = Math.max(wallToe + 1, excavationDepth + 2);
	const scaleY = (d) => 54 + d / maxDepth * 430;
	const xL = 190;
	const xR = 570;
	const wallWidth = 18;
	const strata = layers.map((layer, index) => ({
		...layer,
		index,
		top: Math.max(0, -layer.zTop),
		bottom: Math.min(maxDepth, -layer.zBot)
	})).filter((layer) => layer.bottom > layer.top);
	const propDepths = method === "top-down" ? levelDepths : method === "semi-top-down" ? levelDepths.slice(0, Math.max(1, levelDepths.length - 1)) : levelDepths.slice(0, Math.max(0, activeStage - 1));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: `0 0 ${W} ${H}`,
		className: "w-full bg-panel",
		role: "img",
		"aria-label": "Basement excavation support section",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("defs", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("pattern", {
				id: "cbpPattern",
				width: "18",
				height: "18",
				patternUnits: "userSpaceOnUse",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
					cx: "9",
					cy: "9",
					r: "6.5",
					fill: "#596775",
					stroke: "#2c3036",
					strokeWidth: "1.2"
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pattern", {
				id: "soilHatch",
				width: "9",
				height: "9",
				patternUnits: "userSpaceOnUse",
				patternTransform: "rotate(45)",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
					x1: "0",
					y1: "0",
					x2: "0",
					y2: "9",
					stroke: "#6e573d",
					opacity: ".25"
				})
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				width: W,
				height: H,
				fill: "#f7f4ec"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
				x1: "55",
				y1: "54",
				x2: "705",
				y2: "54",
				stroke: "#4b5563",
				strokeWidth: "2"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "62",
				y: "43",
				fontSize: "11",
				fill: "#374151",
				fontFamily: "monospace",
				children: "EXISTING GROUND LEVEL ±0.00"
			}),
			strata.map((layer) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
					x: "55",
					y: scaleY(layer.top),
					width: "650",
					height: scaleY(layer.bottom) - scaleY(layer.top),
					fill: STRATA[layer.index % STRATA.length],
					opacity: ".72"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
					x: "55",
					y: scaleY(layer.top),
					width: "650",
					height: scaleY(layer.bottom) - scaleY(layer.top),
					fill: "url(#soilHatch)"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
					x: "65",
					y: scaleY(layer.top) + 15,
					fontSize: "10",
					fill: "#382e21",
					children: layer.name
				})
			] }, layer.id)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: xL - wallWidth / 2,
				y: "54",
				width: wallWidth,
				height: scaleY(wallToe) - 54,
				fill: wallType === "cbp" ? "url(#cbpPattern)" : "#596775",
				stroke: "#2c3036"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: xR - wallWidth / 2,
				y: "54",
				width: wallWidth,
				height: scaleY(wallToe) - 54,
				fill: wallType === "cbp" ? "url(#cbpPattern)" : "#596775",
				stroke: "#2c3036"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: xL,
				y: "54",
				width: 380,
				height: scaleY(excavationDepth) - 54,
				fill: "#f7f4ec"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
				x1: xL,
				y1: scaleY(excavationDepth),
				x2: xR,
				y2: scaleY(excavationDepth),
				stroke: "#9b2f28",
				strokeWidth: "4"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: 380,
				y: scaleY(excavationDepth) + 18,
				textAnchor: "middle",
				fontSize: "11",
				fill: "#7f1d1d",
				children: "FORMATION / BASE SLAB LEVEL"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
				x1: "55",
				y1: scaleY(waterLevel),
				x2: 180,
				y2: scaleY(waterLevel),
				stroke: "#4d7a9c",
				strokeWidth: "2",
				strokeDasharray: "6 3"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
				x1: 580,
				y1: scaleY(waterLevel),
				x2: "705",
				y2: scaleY(waterLevel),
				stroke: "#4d7a9c",
				strokeWidth: "2",
				strokeDasharray: "6 3"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: "585",
				y: scaleY(waterLevel) - 5,
				fontSize: "10",
				fill: "#285a7c",
				children: "DESIGN GWL"
			}),
			propDepths.map((depth, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("g", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
				x1: 199,
				y1: scaleY(depth),
				x2: 561,
				y2: scaleY(depth),
				stroke: "#9b2f28",
				strokeWidth: "5"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("text", {
				x: 380,
				y: scaleY(depth) - 7,
				textAnchor: "middle",
				fontSize: "10",
				fill: "#7f1d1d",
				children: method === "top-down" || method === "semi-top-down" ? `B${index + 1} SLAB / PERMANENT PROP` : `STRUT LEVEL ${index + 1}`
			})] }, depth)),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
				x1: "120",
				y1: "54",
				x2: "120",
				y2: scaleY(excavationDepth),
				stroke: "#1c1917"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("text", {
				x: "113",
				y: (54 + scaleY(excavationDepth)) / 2,
				textAnchor: "end",
				fontSize: "11",
				fill: "#1c1917",
				children: [
					"H = ",
					excavationDepth.toFixed(2),
					" m"
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("line", {
				x1: "635",
				y1: "54",
				x2: "635",
				y2: scaleY(wallToe),
				stroke: "#1c1917"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("text", {
				x: "642",
				y: (54 + scaleY(wallToe)) / 2,
				fontSize: "11",
				fill: "#1c1917",
				children: [
					"Toe ",
					wallToe.toFixed(2),
					" m"
				]
			})
		]
	});
}
function Checklist() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
		className: "space-y-2",
		children: [
			"Earth, water and surcharge actions by stage",
			"Wall embedment and passive resistance",
			"Anchor/strut/slab prop and connection design",
			"Wall bending, shear and N-M resistance",
			"Wall movement and adjacent-asset settlement",
			"Basal heave, uplift, piping and seepage",
			"Global / deep-seated stability",
			"Execution, monitoring and trigger-action plan"
		].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", {
			className: "flex gap-2 text-sm",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "mt-0.5 size-4 shrink-0 text-accent" }), item]
		}, item))
	});
}
function Warning({ icon, text }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex gap-2",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "mt-0.5 size-4 shrink-0 text-warn" }),
			icon,
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs",
				children: text
			})
		]
	});
}
function Home() {
	const isAuthenticated = useProject((s) => s.isAuthenticated);
	const activeModule = useProject((s) => s.activeModule);
	if (!isAuthenticated) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LandingLoginScreen, {});
	if (activeModule === "sheet-pile" || activeModule === "cbp") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ExcavationSupportView, {});
	if (activeModule === "cbp-detail") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalculatorApp, {});
	if (activeModule === "bored-pile") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BoredPileView, {});
	if (activeModule === "pile-cap") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PileCapView, {});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ModuleDashboard, {});
}
//#endregion
export { Home as component };
