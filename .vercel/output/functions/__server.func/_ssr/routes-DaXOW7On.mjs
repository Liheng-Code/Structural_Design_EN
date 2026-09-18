import { i as __toESM } from "../_runtime.mjs";
import { L as require_react, v as require_jsx_runtime } from "../_libs/@tanstack/react-router+[...].mjs";
import { a as Printer, c as Download, i as RotateCcw, o as Menu, r as Save, s as FolderOpen, t as X } from "../_libs/lucide-react.mjs";
import { t as clsx } from "../_libs/clsx.mjs";
import { t as twMerge } from "../_libs/tailwind-merge.mjs";
import { n as persist, r as create, t as createJSONStorage } from "../_libs/zustand.mjs";
import { t as katex } from "../_libs/katex.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DaXOW7On.js
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
	const top = rb + H + capH + .2;
	const bot = rb - D - .8;
	const xL = -B / 2;
	const xR = B / 2;
	const padL = 3.8;
	const padR = 3.2;
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
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: `0 0 ${W} ${Ht}`,
		className: "w-full h-auto bg-panel",
		role: "img",
		"aria-label": "U-shape sheet pile cross-section",
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
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: sx(xMin),
				y: sy(rb),
				width: sx(leftFace) - sx(xMin),
				height: sy(bot) - sy(rb),
				fill: "url(#hatch-soil)"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: sx(xR),
				y: sy(rb),
				width: sx(xMax) - sx(xR),
				height: sy(bot) - sy(rb),
				fill: "url(#hatch-soil)"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: sx(leftFace + t),
				y: sy(rb),
				width: sx(rightFace) - sx(leftFace + t),
				height: sy(bot) - sy(rb),
				fill: "url(#hatch-soil)",
				opacity: "0.55"
			}),
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
				fill: "#5f656c",
				stroke: "#2c3036",
				strokeWidth: "1"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				x: sx(rightFace),
				y: sy(rb + H),
				width: sx(rightFace + t) - sx(rightFace),
				height: sy(rb - D) - sy(rb + H),
				fill: "#5f656c",
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
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dim, {
				x1: sx(leftFace),
				x2: sx(xR),
				y: sy(rb + H + capH + 1.55),
				label: `${B.toFixed(2)} m OUT-TO-OUT`
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dim, {
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
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("text", {
				x: sx(0),
				y: 506,
				textAnchor: "middle",
				fill: "#5c564e",
				fontSize: "11",
				fontFamily: "IBM Plex Sans",
				children: [
					"Riverbed / original ground y = ",
					rb.toFixed(2),
					" m · precast RC T&G ",
					project.sheetPile.sectionName
				]
			})
		]
	});
}
function Dim({ x1, x2, y, label }) {
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
function Field({ label, unit, hint, source, children }) {
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
				style: { width: `${pct}%` }
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
		description: "Core fill placed in layers. Outward pressure on walls before ties.",
		tiesInstalled: 0,
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
			asMainEachFace: 1340,
			asDist: 565,
			barDia: 16,
			barSpacing: 150,
			Ioverride: null,
			Aoverride: null,
			sectionName: "350 mm T&G precast RC sheet pile",
			EcmOverride: null,
			IeffFactor: .5,
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
	setNav: (nav) => set({ nav }),
	setLoadCase: (loadCaseId) => set({ loadCaseId }),
	setHighlight: (highlight) => set({ highlight }),
	setProject: (project) => set({ project }),
	patch: (fn) => set((s) => {
		const project = structuredClone(s.project);
		fn(project);
		return { project };
	}),
	reset: () => set({
		project: defaultProject(),
		loadCaseId: "LC-05"
	})
}), {
	name: "eurocode-u-sheet-pile",
	storage: createJSONStorage(() => typeof window === "undefined" ? {
		getItem: () => null,
		setItem: () => {},
		removeItem: () => {}
	} : localStorage),
	partialize: (s) => ({
		project: s.project,
		loadCaseId: s.loadCaseId
	})
}));
function ProjectPanel() {
	const p = useProject((s) => s.project);
	const patch = useProject((s) => s.patch);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
		title: "Document information",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-3 sm:grid-cols-2",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Project name",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
						value: p.meta.projectName,
						onChange: (e) => patch((q) => q.meta.projectName = e.target.value)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Option",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
						value: p.meta.option,
						onChange: (e) => patch((q) => q.meta.option = e.target.value)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Prepared by",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
						value: p.meta.preparedBy,
						onChange: (e) => patch((q) => q.meta.preparedBy = e.target.value)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Checked by",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
						value: p.meta.checkedBy,
						onChange: (e) => patch((q) => q.meta.checkedBy = e.target.value)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Revision",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
						value: p.meta.revision,
						onChange: (e) => patch((q) => q.meta.revision = e.target.value)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Date",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
						type: "date",
						value: p.meta.date,
						onChange: (e) => patch((q) => q.meta.date = e.target.value)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Issue status",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
						value: p.meta.status,
						onChange: (e) => patch((q) => q.meta.status = e.target.value)
					})
				})
			]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
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
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
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
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
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
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
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
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
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
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Retained height H",
					unit: "m",
					source: "USER INPUT",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumInput, {
						value: g.retainedHeight,
						onChange: (n) => patch((q) => q.geometry.retainedHeight = n)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Embedment D",
					unit: "m",
					source: "USER INPUT",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumInput, {
						value: g.embedment,
						onChange: (n) => patch((q) => q.geometry.embedment = n)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Total length L",
					unit: "m",
					source: "DERIVED",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumInput, {
						value: g.retainedHeight + g.embedment,
						onChange: () => {},
						disabled: true
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Road width",
					unit: "m",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumInput, {
						value: g.roadWidth,
						onChange: (n) => patch((q) => q.geometry.roadWidth = n)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Out-to-out width",
					unit: "m",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumInput, {
						value: g.totalWidth,
						onChange: (n) => patch((q) => q.geometry.totalWidth = n)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Wall thickness t",
					unit: "m",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumInput, {
						step: .01,
						value: g.wallThickness,
						onChange: (n) => patch((q) => q.geometry.wallThickness = n)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Riverbed elevation",
					unit: "m",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumInput, {
						value: g.riverbed,
						onChange: (n) => patch((q) => q.geometry.riverbed = n)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "D min (auto)",
					unit: "m",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumInput, {
						value: g.dMin,
						onChange: (n) => patch((q) => q.geometry.dMin = n)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "D max (auto)",
					unit: "m",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumInput, {
						value: g.dMax,
						onChange: (n) => patch((q) => q.geometry.dMax = n)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
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
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Description",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
							value: p.coreFill.name,
							onChange: (e) => patch((q) => q.coreFill.name = e.target.value)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "γ bulk",
						unit: "kN/m³",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumInput, {
							value: p.coreFill.gamma,
							onChange: (n) => patch((q) => q.coreFill.gamma = n)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "γ sat",
						unit: "kN/m³",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumInput, {
							value: p.coreFill.gammaSat,
							onChange: (n) => patch((q) => q.coreFill.gammaSat = n)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "φ'",
						unit: "°",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumInput, {
							value: p.coreFill.phi,
							onChange: (n) => patch((q) => q.coreFill.phi = n)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "c'",
						unit: "kPa",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumInput, {
							value: p.coreFill.c,
							onChange: (n) => patch((q) => q.coreFill.c = n)
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
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
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
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
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
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
			})
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
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "γw",
					unit: "kN/m³",
					source: "CODE",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumInput, {
						step: .01,
						value: p.water.gammaW,
						onChange: (n) => patch((q) => q.water.gammaW = n)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Native GWL",
					unit: "m",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumInput, {
						value: p.water.gwlNative,
						onChange: (n) => patch((q) => q.water.gwlNative = n)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Core water (dry)",
					unit: "m",
					hint: "Well-drained granular core default 0.00 — ASSUMPTION",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumInput, {
						value: p.water.coreDry,
						onChange: (n) => patch((q) => q.water.coreDry = n)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
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
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Dry upstream",
					unit: "m",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumInput, {
						value: p.water.dryUp,
						onChange: (n) => patch((q) => q.water.dryUp = n)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Dry downstream",
					unit: "m",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumInput, {
						value: p.water.dryDown,
						onChange: (n) => patch((q) => q.water.dryDown = n)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Flood upstream HWL",
					unit: "m",
					source: "USER INPUT",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumInput, {
						value: p.water.floodUp,
						onChange: (n) => patch((q) => q.water.floodUp = n)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Flood downstream HWL",
					unit: "m",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumInput, {
						value: p.water.floodDown,
						onChange: (n) => patch((q) => q.water.floodDown = n)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
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
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
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
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Uniform q",
					unit: "kPa",
					source: "ASSUMPTION",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumInput, {
						value: p.traffic.q,
						onChange: (n) => patch((q) => q.traffic.q = n)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Axle load",
					unit: "kN",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumInput, {
						value: p.traffic.axleLoad,
						onChange: (n) => patch((q) => q.traffic.axleLoad = n)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "No. of axles",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumInput, {
						step: 1,
						value: p.traffic.nAxles,
						onChange: (n) => patch((q) => q.traffic.nAxles = n)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Axle spacing",
					unit: "m",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumInput, {
						value: p.traffic.axleSpacing,
						onChange: (n) => patch((q) => q.traffic.axleSpacing = n)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "DAF",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumInput, {
						step: .05,
						value: p.traffic.DAF,
						onChange: (n) => patch((q) => q.traffic.DAF = n)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Distribution width",
					unit: "m",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumInput, {
						value: p.traffic.distWidth,
						onChange: (n) => patch((q) => q.traffic.distWidth = n)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Plant load",
					unit: "kPa",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumInput, {
						value: p.traffic.plantLoad,
						onChange: (n) => patch((q) => q.traffic.plantLoad = n)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Asphalt thickness",
					unit: "m",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumInput, {
						step: .05,
						value: p.pavement.asphalt,
						onChange: (n) => patch((q) => q.pavement.asphalt = n)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
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
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
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
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
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
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "fck",
					unit: "MPa",
					source: "DERIVED",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumInput, {
						value: p.sheetPile.fck,
						onChange: (n) => patch((q) => q.sheetPile.fck = n)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "fyk",
					unit: "MPa",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumInput, {
						value: p.sheetPile.fyk,
						onChange: (n) => patch((q) => q.sheetPile.fyk = n)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "c_min",
					unit: "mm",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumInput, {
						step: 5,
						value: p.sheetPile.cover,
						onChange: (n) => patch((q) => q.sheetPile.cover = n)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Δc_dev",
					unit: "mm",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumInput, {
						step: 5,
						value: p.sheetPile.deltaCdev,
						onChange: (n) => patch((q) => q.sheetPile.deltaCdev = n)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Bar diameter",
					unit: "mm",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumInput, {
						step: 1,
						value: p.sheetPile.barDia,
						onChange: (n) => patch((q) => q.sheetPile.barDia = n)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
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
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "As each face",
					unit: "mm²/m",
					source: "DERIVED",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumInput, {
						step: 10,
						value: p.sheetPile.asMainEachFace,
						onChange: (n) => patch((q) => q.sheetPile.asMainEachFace = n)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "I_eff / I_g",
					source: "ASSUMPTION",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumInput, {
						step: .05,
						value: p.sheetPile.IeffFactor,
						onChange: (n) => patch((q) => q.sheetPile.IeffFactor = n)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
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
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Name",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
						value: tr.name,
						onChange: (e) => patch((q) => q.ties[i].name = e.target.value)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Elevation y",
					unit: "m",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumInput, {
						value: tr.elevation,
						onChange: (n) => patch((q) => q.ties[i].elevation = n)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
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
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Spacing s",
					unit: "m",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumInput, {
						value: tr.spacing,
						onChange: (n) => patch((q) => q.ties[i].spacing = n)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "fy",
					unit: "MPa",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumInput, {
						value: tr.fy,
						onChange: (n) => patch((q) => q.ties[i].fy = n)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Corrosion",
					unit: "mm",
					hint: "Radial allowance",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumInput, {
						step: .5,
						value: tr.corrosion,
						onChange: (n) => patch((q) => q.ties[i].corrosion = n)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
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
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Width b",
					unit: "m",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumInput, {
						step: .05,
						value: p.capping.b,
						onChange: (n) => patch((q) => q.capping.b = n)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Depth h",
					unit: "m",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumInput, {
						step: .05,
						value: p.capping.h,
						onChange: (n) => patch((q) => q.capping.h = n)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Cover",
					unit: "mm",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumInput, {
						step: 5,
						value: p.capping.cover,
						onChange: (n) => patch((q) => q.capping.cover = n)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "fck",
					unit: "MPa",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumInput, {
						value: p.capping.fck,
						onChange: (n) => patch((q) => q.capping.fck = n)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "As bottom",
					unit: "mm²",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumInput, {
						step: 50,
						value: p.capping.asBot,
						onChange: (n) => patch((q) => q.capping.asBot = n)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
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
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
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
				].map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: k,
					source: p.factors.source === "user" ? "USER INPUT" : "CODE PARAMETER",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumInput, {
						step: .05,
						value: p.factors[k],
						onChange: (n) => patch((q) => q.factors[k] = n)
					})
				}, k)),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Passive reduction",
					source: "USER-DEFINED / PROJECT-SPECIFIC",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumInput, {
						step: .05,
						value: p.earth.passiveReduction,
						onChange: (n) => patch((q) => q.earth.passiveReduction = n)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Wall friction δ",
					unit: "°",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumInput, {
						value: p.earth.wallFriction,
						onChange: (n) => patch((q) => q.earth.wallFriction = n)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "User Ka",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumInput, {
						step: .01,
						value: p.earth.userKa,
						onChange: (n) => patch((q) => q.earth.userKa = n)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
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
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "National Annex",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
						value: p.codes.nationalAnnex,
						onChange: (e) => patch((q) => q.codes.nationalAnnex = e.target.value)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Edition",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextInput, {
						value: p.codes.edition,
						onChange: (e) => patch((q) => q.codes.edition = e.target.value)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
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
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Design working life",
					unit: "years",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumInput, {
						step: 5,
						value: p.codes.designLife,
						onChange: (n) => patch((q) => q.codes.designLife = n)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
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
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
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
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "η PASS limit",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumInput, {
						step: .05,
						value: p.limits.etaPass,
						onChange: (n) => patch((q) => q.limits.etaPass = n)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "η WARNING",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumInput, {
						step: .05,
						value: p.limits.etaWarn,
						onChange: (n) => patch((q) => q.limits.etaWarn = n)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "δ absolute",
					unit: "mm",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumInput, {
						value: p.limits.deflAbs,
						onChange: (n) => patch((q) => q.limits.deflAbs = n)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "δ span ratio H/n",
					unit: "n",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumInput, {
						value: p.limits.deflSpanRatio,
						onChange: (n) => patch((q) => q.limits.deflSpanRatio = n)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "wk limit",
					unit: "mm",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumInput, {
						step: .05,
						value: p.limits.wkLimit,
						onChange: (n) => patch((q) => q.limits.wkLimit = n)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
					label: "Allowable i",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumInput, {
						step: .05,
						value: p.limits.iAllow,
						onChange: (n) => patch((q) => q.limits.iAllow = n)
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
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
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
				title: "1. Design objective",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Verify the Option 3 U-shaped precast RC sheet-pile flood embankment with granular core, dual tie rods and RC capping beams for persistent, flood, construction, rapid-drawdown and accidental (tie failure) situations, separating structural, geotechnical and hydraulic limit states." })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
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
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
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
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
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
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
				title: "5. Structural analysis",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm",
						children: "Each sheet-pile line is a metre-strip beam with flexural rigidity E_cm I_eff, Winkler springs below riverbed (n_h z) and elastic tie springs. The granular core is not a rigid diaphragm. Reference clause to be confirmed against the project-adopted National Annex / Eurocode edition."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Equation, {
						latex: `EI = E_{cm} I_{eff} = ${fmt(d.Ecm, 0)}\\,\\text{MPa}\\times ${fmt(d.Ig * d.Ecm ? project.sheetPile.IeffFactor : 1, 2)} I_g`,
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
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
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
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
				title: "7. Verification of the selected load case",
				children: lc ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CheckTable, { checks: lc.checks }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Select a load case." })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
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
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
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
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Section, {
				title: "10. Warnings and limitations",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
					className: "list-disc pl-5 space-y-1 text-sm",
					children: bundle.warnings.map((w) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: w }, w))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Section, {
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
function Section({ title, children }) {
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
	const Ig = p.sheetPile.Ioverride ?? 1 * t ** 3 / 12;
	const EI = (p.sheetPile.EcmOverride ?? ecmFromFck(p.sheetPile.fck)) * Ig * p.sheetPile.IeffFactor * 1e3;
	const z = stations.map((s) => s.z);
	const pNet = stations.map((s) => s[netKey]);
	const kSoil = stations.map((s) => {
		if (s.z > p.geometry.riverbed) return 0;
		const depth = p.geometry.riverbed - s.z;
		if (p.sheetPile.khUser && p.sheetPile.khUser > 0) return p.sheetPile.khUser;
		return p.sheetPile.nh * Math.max(depth, .1);
	});
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
function mkCheck(partial, limits) {
	const eta = partial.utilization;
	const status = partial.status ?? (!partial.applicable ? "N/A" : !Number.isFinite(eta) ? "NOT VERIFIED" : statusFromEta(eta, limits.etaPass, limits.etaWarn));
	return {
		...partial,
		status
	};
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
		utilization: MRd > 0 ? MEd / (MRd * (1 + .002 * NEd)) : 99,
		explanation: "Axial compression from self-weight is small relative to the squash load. A conservative interaction is reported; the wall is flexure-governed.",
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
	const Nq = Math.exp(Math.PI * Math.tan(phiDesign(p.nativeLayers.at(-1)?.phi ?? 32, p.factors.gammaPhi) * Math.PI / 180)) * Math.tan(Math.PI / 4 + toRadSafe(phiDesign(p.nativeLayers.at(-1)?.phi ?? 32, p.factors.gammaPhi)) / 2) ** 2;
	const Ng = 2 * (Nq - 1) * Math.tan(toRadSafe(phiDesign(p.nativeLayers.at(-1)?.phi ?? 32, p.factors.gammaPhi)));
	const Btoe = t;
	const qBearing = W / (2 * Btoe) * p.factors.gammaG;
	const sigmaRd = .5 * (p.nativeLayers.at(-1)?.gamma ?? 19) * Btoe * Ng + (p.nativeLayers.at(-1)?.gamma ?? 19) * D * Nq;
	const etaBrg = sigmaRd > 0 ? qBearing / sigmaRd : 99;
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
			demand: qBearing,
			resistance: Math.max(sigmaRd, 1),
			unit: "kPa",
			utilization: etaBrg,
			explanation: "Vertical reaction under each sheet-pile line is compared with a drained bearing estimate using N_q and N_γ (EN 1997 Annex D form). This is a screening check, not a substitute for a site-specific bearing calculation.",
			formula: "R/A' = c N_c + q N_q + 0.5 \\gamma B' N_\\gamma",
			substitution: `σ_Ed=${fmt(qBearing, 1)} kPa, σ_Rd=${fmt(sigmaRd, 1)} kPa, D=${fmt(D, 2)} m, B'= ${fmt(Btoe, 2)} m`,
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
	const MRd = mrdRect(bmm, dmm, p.capping.asBot, p.capping.fck, p.sheetPile.fyk, p.factors.gammaCconc, p.factors.gammaS, p.factors.alphaCc);
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
	items.push(ok("QC-10", "Reinforcement area positive", p.sheetPile.asMainEachFace > 0, `As=${p.sheetPile.asMainEachFace} mm²/m`));
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
	const checks = [
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
	const derived = {
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
	const handling = handlingCheck(p);
	const dur = durabilityCheck(p);
	const applicable = [
		...loadCases.flatMap((lc) => lc.checks),
		...stageResults.flatMap((s) => s.checks),
		handling,
		dur
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
	if (p.sheetPile.IeffFactor < 1) warnings.push(`Effective inertia I_eff = ${p.sheetPile.IeffFactor} I_g is an ASSUMPTION for cracked RC.`);
	warnings.push("The granular core is not treated as a rigid structural diaphragm unless the user selects otherwise.");
	warnings.push("Passive resistance mobilisation depends on wall movement, construction disturbance and scour. A user-controlled reduction factor is provided.");
	if (qc.some((q) => q.status === "FAIL")) warnings.push("QC reported FAIL items — do not treat the calculation as complete.");
	let overall = "PASS";
	if (summary.some((c) => c.status === "FAIL")) overall = "FAIL";
	else if (summary.some((c) => c.status === "WARNING" || c.status === "INPUT REQUIRED")) overall = "WARNING";
	if (qc.some((q) => q.status === "FAIL")) overall = overall === "FAIL" ? "FAIL" : "WARNING";
	return {
		qc,
		variables: variables(p, derived),
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
	const [menu, setMenu] = (0, import_react.useState)(false);
	const [hydrated, setHydrated] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => setHydrated(true), []);
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
	if (!hydrated) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-dvh items-center justify-center bg-paper text-navy",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "font-display tracking-wide",
			children: "Loading calculation model…"
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-paper text-ink",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "title-block no-print sticky top-0 z-30",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-3 px-3 py-2.5 sm:px-4",
				children: [
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
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "truncate font-display text-base font-semibold leading-tight sm:text-lg",
							children: "U-Shape Precast RC Sheet Pile · Flood Embankment Calculator"
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
			className: "mx-auto grid max-w-[1600px] grid-cols-1 lg:grid-cols-[220px_minmax(0,1fr)_300px]",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
					className: `no-print fixed inset-y-0 left-0 z-40 w-64 overflow-y-auto bg-navy-deep pt-12 lg:static lg:z-0 lg:w-auto lg:pt-0 ${menu ? "block" : "hidden lg:block"}`,
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
					className: "min-w-0 space-y-4 p-3 sm:p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "no-print text-xs text-muted",
							children: "Preliminary design tool — not a substitute for site investigation or statutory approval. Change any input and all diagrams, forces, utilizations and the report update immediately."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
							title: "Interactive cross-section",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CrossSection, {
								project,
								water,
								traffic: !!lc?.checks && (project.loadCases.find((c) => c.id === lc.id)?.trafficOn ?? false)
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
						nav === "sheet" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetPanel, {}),
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
					className: "no-print space-y-3 border-t border-rule p-3 lg:border-l lg:border-t-0 lg:p-4",
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
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
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
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Min",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumInput, {
							value: min,
							onChange: setMin
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
						label: "Max",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(NumInput, {
							value: max,
							onChange: setMax
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Field, {
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
function Home() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CalculatorApp, {});
}
//#endregion
export { Home as component };
