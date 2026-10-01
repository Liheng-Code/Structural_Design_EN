#!/usr/bin/env python3
"""Build or check a NotebookLM source pack from repo design material.

Build:
  build_pack.py --name pile-cap --title "2-Pile Cap" --input "docs/Pilecap 2 Pile" \
      [--input more/paths ...] [--rules-sections 12,14,17] [--out notebooklm]

Check an existing pack:
  build_pack.py --check notebooklm/pile-cap
"""
from __future__ import annotations

import argparse
import csv
import re
import shutil
import sys
import zipfile
import xml.etree.ElementTree as ET
from pathlib import Path

IMPL_HEADING = re.compile(
    r"\b(app implementation|implementation|components?|files?|ui|ux|tech stack|front[- ]?end|"
    r"react|routes?|code structure)\b",
    re.I,
)
# Headings that contain "implementation" but are engineering content, e.g. "Design Implementation Plan".
IMPL_KEEP = re.compile(r"\b(design|plan|construction|site|method)\b", re.I)
FLAGS = ("ASSUMED", "INPUT REQUIRED", "NOT VERIFIED", "PRELIMINARY")
TEXT_EXT = {".md", ".markdown", ".txt"}
COPY_EXT = {".pdf"}
NOTE_EXT = {
    ".jfif": "Image (JFIF). Convert to .jpg/.png if uploading; describe it in images-described.md.",
    ".jpg": "Image. Describe it in images-described.md; upload the original only if useful.",
    ".jpeg": "Image. Describe it in images-described.md; upload the original only if useful.",
    ".png": "Image. Describe it in images-described.md; upload the original only if useful.",
    ".docx": "Word file. Export to PDF (or paste into a Google Doc) before uploading.",
}

GREEK = {
    "alpha": "α", "beta": "β", "gamma": "γ", "delta": "δ", "Delta": "Δ", "epsilon": "ε",
    "varepsilon": "ε", "zeta": "ζ", "eta": "η", "theta": "θ", "lambda": "λ", "mu": "μ",
    "nu": "ν", "xi": "ξ", "pi": "π", "rho": "ρ", "sigma": "σ", "Sigma": "Σ", "tau": "τ",
    "phi": "φ", "varphi": "φ", "psi": "ψ", "omega": "ω", "chi": "χ", "kappa": "κ",
}
OPS = {
    "le": "≤", "leq": "≤", "ge": "≥", "geq": "≥", "cdot": "·", "times": "×", "approx": "≈",
    "neq": "≠", "pm": "±", "infty": "∞", "sum": "Σ", "deg": "°", "circ": "°",
    "rightarrow": "→", "to": "→", "sin": "sin ", "cos": "cos ", "tan": "tan ", "arctan": "arctan ",
    "ln": "ln ", "log": "log ", "max": "max", "min": "min", "prime": "'", "quad": " ", "qquad": " ", ",": " ", ";": " ",
}


# ---------------------------------------------------------------- text cleaning
def _replace_braced(text: str, cmd: str, fn) -> str:
    """Replace \\cmd{a}{b}... handling nested braces. fn receives the list of args."""
    nargs = 2 if cmd == "frac" else 1
    out, i, token = [], 0, "\\" + cmd + "{"
    while True:
        j = text.find(token, i)
        if j < 0:
            out.append(text[i:])
            return "".join(out)
        out.append(text[i:j])
        k, args = j + len(token) - 1, []
        for _ in range(nargs):
            while args and k < len(text) and text[k] in " \t\r\n":
                k += 1
            if k >= len(text) or text[k] != "{":
                break
            depth, start = 0, k + 1
            while k < len(text):
                if text[k] == "{":
                    depth += 1
                elif text[k] == "}":
                    depth -= 1
                    if depth == 0:
                        break
                k += 1
            args.append(text[start:k])
            k += 1
        if len(args) < nargs:
            out.append(text[j:k])
        else:
            out.append(fn(args))
        i = k


def delatex(text: str) -> str:
    for _ in range(3):  # nested constructs
        text = _replace_braced(text, "frac", lambda a: f"({a[0]})/({a[1]})")
        text = _replace_braced(text, "sqrt", lambda a: f"√({a[0]})")
        for cmd in ("text", "mathrm", "mathbf", "mathit", "operatorname", "textbf", "rm"):
            text = _replace_braced(text, cmd, lambda a: a[0])
    text = re.sub(r"\\left|\\right", "", text)
    text = re.sub(r"\\([A-Za-z]+)", lambda m: GREEK.get(m.group(1), OPS.get(m.group(1), m.group(0))), text)
    text = re.sub(r"\\([,;])", " ", text)
    text = re.sub(r"_\{([^{}]*)\}", r"_\1", text)
    text = re.sub(r"\^\{([^{}]*)\}", r"^\1", text)
    text = text.replace("^°", "°")
    # strip math delimiters ($$...$$ and inline $...$) once their content is plain
    text = re.sub(r"\$\$(.+?)\$\$", r"\1", text, flags=re.S)
    text = re.sub(r"(?<![\w$])\$([^$\n]+?)\$(?!\w)", r"\1", text)
    return text


def heading_level(line: str) -> int:
    m = re.match(r"^(#{1,6})\s", line)
    return len(m.group(1)) if m else 0


def drop_implementation(text: str) -> tuple[str, list[str]]:
    lines, out, dropped, skip_level, in_code = text.splitlines(), [], [], 0, False
    for line in lines:
        if line.lstrip().startswith("```"):
            in_code = not in_code
        lvl = 0 if in_code else heading_level(line)
        if skip_level and lvl and lvl <= skip_level:
            skip_level = 0
        if lvl and not skip_level:
            title = line.lstrip("#").strip()
            if IMPL_HEADING.search(title) and not IMPL_KEEP.search(title):
                skip_level, _ = lvl, dropped.append(title)
        if not skip_level:
            out.append(line)
    return "\n".join(out), dropped


def word_count(text: str) -> int:
    return len(re.findall(r"\S+", text))


def split_sections(text: str, max_words: int) -> list[str]:
    """Split at H1, then H2, boundaries so each part stays under max_words where possible."""
    if word_count(text) <= max_words:
        return [text]
    for level in (1, 2, 3):
        parts, cur, in_code = [], [], False
        for line in text.splitlines():
            if line.lstrip().startswith("```"):
                in_code = not in_code
            if not in_code and heading_level(line) == level and cur:
                parts.append("\n".join(cur))
                cur = []
            cur.append(line)
        parts.append("\n".join(cur))
        if len(parts) > 1:
            merged, buf = [], ""
            for p in parts:
                if buf and word_count(buf) + word_count(p) > max_words:
                    merged.append(buf)
                    buf = p
                else:
                    buf = f"{buf}\n{p}" if buf else p
            merged.append(buf)
            if len(merged) > 1 and word_count(merged[-1]) < max_words * 0.2:
                tail = merged.pop()
                merged[-1] += "\n" + tail
            if len(merged) > 1:
                return merged
    return [text]


# ---------------------------------------------------------------- metadata detection
def detect_meta(text: str) -> dict[str, str]:
    meta = {}
    m = re.search(r"^\s*\**Status\**\s*:\s*\**(.+)$", text, re.M | re.I)
    if m:
        meta["status"] = m.group(1).strip(" *")
    else:
        found = [f for f in ("PRELIMINARY", "INCOMPLETE", "COMPLETE") if re.search(rf"\b{f}\b", text)]
        meta["status"] = f"{found[0]} (auto-detected — verify)" if found else ""
    codes = sorted(set(re.findall(r"\bEN\s?\d{4}(?:-\d+){0,2}(?::\d{4})?", text)))
    meta["codes"] = ", ".join(c.replace("EN", "EN ").replace("EN  ", "EN ") for c in codes[:12])
    m = re.search(r"National Annex\**\s*:\s*\**([^\n]+)", text, re.I) or re.search(
        r"\b((?:UK|Cambodia\w*|French|German|Singapore|Malaysian?)\s+NA\b[^\n.;]*)", text
    )
    meta["na"] = m.group(1).strip(" *") if m else ""
    sits = [s for s in ("persistent", "transient", "accidental", "seismic", "construction")
            if re.search(rf"\b{s}\b", text, re.I)]
    meta["situation"] = ", ".join(sits)
    return meta


def header(title: str, project: str, src: str, meta: dict[str, str]) -> str:
    req = "INPUT REQUIRED — not stated in source"
    return (
        f"# {title}\n\n"
        f"> **Project:** {project}\n"
        f"> **Source file:** {src}\n"
        f"> **Status:** {meta.get('status') or req}\n"
        f"> **Codes:** {meta.get('codes') or req}\n"
        f"> **National Annex:** {meta.get('na') or req}\n"
        f"> **Design situation:** {meta.get('situation') or req}\n"
        f"> **Note:** Engineering calculation material for review. Values marked ASSUMED or\n"
        f"> INPUT REQUIRED are not verified project data.\n\n"
    )


SYMBOL = re.compile(r"(?<![\w/.])([A-Za-zγνθσεφρτψαβδΔ][A-Za-z]?_[A-Za-z0-9,.]{1,10})(?![\w/])")


def symbols(text: str) -> set[str]:
    return {s.rstrip(".,") for s in SYMBOL.findall(text) if not s.lower().startswith(("http", "src_"))}


def slug(s: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")[:60] or "source"


# ---------------------------------------------------------------- build
def extract_rules(rules_file: Path, sections: list[str]) -> str:
    text = rules_file.read_text(encoding="utf-8")
    blocks, cur, num = {}, [], None
    for line in text.splitlines():
        m = re.match(r"^#\s+(\d+)\.\s", line)
        if m:
            if num:
                blocks[num] = "\n".join(cur)
            num, cur = m.group(1), [line]
        elif num:
            cur.append(line)
    if num:
        blocks[num] = "\n".join(cur)
    missing = [s for s in sections if s not in blocks]
    if missing:
        print(f"warning: rules sections not found: {', '.join(missing)}", file=sys.stderr)
    # demote each "# N. TITLE" to H2 so the source keeps a single H1 (its header)
    return "\n\n".join(re.sub(r"^# ", "## ", blocks[s], count=1) for s in sections if s in blocks)


def csv_to_md(path: Path) -> str:
    raw = path.read_bytes()
    try:
        data = raw.decode("utf-8-sig")
    except UnicodeDecodeError:  # Excel exports are often Windows-1252
        data = raw.decode("cp1252", errors="replace")
    return table_md([r for r in csv.reader(data.splitlines()) if any(c.strip() for c in r)])


def table_md(rows: list[list[str]]) -> str:
    if not rows:
        return "_Empty CSV._\n"
    width = max(len(r) for r in rows)
    rows = [[tidy(c) for c in r] + [""] * (width - len(r)) for r in rows]
    keep = [i for i in range(width) if any(r[i] for r in rows)]  # drop all-empty columns
    rows = [[r[i] for i in keep] for r in rows]
    lines = ["| " + " | ".join(rows[0]) + " |", "|" + "---|" * len(keep)]
    lines += ["| " + " | ".join(r) + " |" for r in rows[1:]]
    return f"Rows: {len(rows) - 1}.\n\n" + "\n".join(lines) + "\n"


def tidy(cell) -> str:
    c = " ".join(str(cell).split()).replace("|", "\\|")
    if re.fullmatch(r"-?\d+\.\d{6,}", c):  # float noise from Excel, e.g. 9.2100000000000009
        c = f"{float(c):.6g}"
    return c


def xlsx_to_md(path: Path) -> str:
    """Read every sheet of an .xlsx with the standard library (cached values, no formulas)."""
    ns = {"m": "http://schemas.openxmlformats.org/spreadsheetml/2006/main",
          "r": "http://schemas.openxmlformats.org/officeDocument/2006/relationships"}
    with zipfile.ZipFile(path) as z:
        shared = []
        if "xl/sharedStrings.xml" in z.namelist():
            for si in ET.fromstring(z.read("xl/sharedStrings.xml")).findall("m:si", ns):
                shared.append("".join(t.text or "" for t in si.iter(f"{{{ns['m']}}}t")))
        rels = {r.get("Id"): r.get("Target") for r in ET.fromstring(z.read("xl/_rels/workbook.xml.rels"))}
        out = []
        for sh in ET.fromstring(z.read("xl/workbook.xml")).find("m:sheets", ns):
            target = rels[sh.get(f"{{{ns['r']}}}id")].lstrip("/")
            target = target if target.startswith("xl/") else "xl/" + target
            rows = []
            for row in ET.fromstring(z.read(target)).iter(f"{{{ns['m']}}}row"):
                cells = {}
                for c in row.findall("m:c", ns):
                    col = re.match(r"[A-Z]+", c.get("r", "A")).group(0)
                    idx = 0
                    for ch in col:
                        idx = idx * 26 + ord(ch) - 64
                    v, t = c.find("m:v", ns), c.get("t")
                    if t == "inlineStr":
                        val = "".join(x.text or "" for x in c.iter(f"{{{ns['m']}}}t"))
                    elif v is None:
                        val = ""
                    elif t == "s":
                        val = shared[int(v.text)]
                    else:
                        val = v.text or ""
                    cells[idx] = val
                if any(str(x).strip() for x in cells.values()):
                    rows.append([cells.get(i, "") for i in range(1, max(cells) + 1)])
            out.append(f"## Sheet: {sh.get('name')}\n\n" + table_md(rows))
    return "\n".join(out)


def collect(inputs: list[str]) -> list[Path]:
    files = []
    for raw in inputs:
        p = Path(raw)
        if p.is_dir():
            files += sorted(f for f in p.rglob("*") if f.is_file())
        elif p.is_file():
            files.append(p)
        else:
            print(f"warning: input not found: {raw}", file=sys.stderr)
    return files


def build(a: argparse.Namespace) -> int:
    out = Path(a.out) / slug(a.name)
    if out.exists() and not a.force:
        print(f"error: {out} exists — pass --force to rebuild it", file=sys.stderr)
        return 1
    if out.exists():
        shutil.rmtree(out)
    out.mkdir(parents=True)
    manifest, all_syms, n = [], set(), 2  # 00 rules, 01 glossary reserved

    if a.rules_sections:
        secs = [s.strip() for s in a.rules_sections.split(",") if s.strip()]
        body = delatex(extract_rules(Path(a.rules_file), secs))
        meta = detect_meta(body)
        meta["status"] = "Design rules (calculation procedure) — not a calculation"
        text = header("Design rules — " + a.title, a.title, f"{a.rules_file} §{', §'.join(secs)}", meta) + body
        (out / "00-design-rules.md").write_text(text, encoding="utf-8")
        all_syms |= symbols(body)
        manifest.append(("00-design-rules.md", "upload", word_count(text), "Calculation rules"))

    for f in collect(a.input):
        ext, rel = f.suffix.lower(), f.as_posix()
        if ext in TEXT_EXT:
            raw = f.read_text(encoding="utf-8", errors="replace")
            body, dropped = (raw, []) if a.keep_implementation else drop_implementation(raw)
            body = delatex(body)
            meta, all_syms = detect_meta(body), all_syms | symbols(body)
            parts = split_sections(body, a.max_words)
            for i, part in enumerate(parts, 1):
                t = f.stem + (f" (part {i} of {len(parts)})" if len(parts) > 1 else "")
                name = f"{n:02d}-{slug(t)}.md"
                text = header(t, a.title, rel, meta) + part.strip() + "\n"
                (out / name).write_text(text, encoding="utf-8")
                note = "Dropped app sections: " + "; ".join(dropped) if dropped and i == 1 else ""
                manifest.append((name, "upload", word_count(text), note))
                n += 1
        elif ext in (".csv", ".xlsx"):
            # some ".csv" files in this repo are really Excel workbooks (zip) — sniff the bytes
            is_xlsx = f.read_bytes()[:4] == b"PK\x03\x04"
            name = f"{n:02d}-{slug(f.stem)}.md"
            table = xlsx_to_md(f) if is_xlsx else csv_to_md(f)
            text = header(f.stem + " (data table)", a.title, rel, {"status": "Data — verify against original"}) + table
            (out / name).write_text(text, encoding="utf-8")
            note = "Excel workbook (despite .csv name) converted" if is_xlsx and ext == ".csv" else f"Converted from {ext[1:].upper()}"
            manifest.append((name, "upload", word_count(text), note))
            n += 1
        elif ext in COPY_EXT:
            name = f"{n:02d}-{f.name}"
            shutil.copy2(f, out / name)
            manifest.append((name, "upload", 0, "PDF copied as-is"))
            n += 1
        else:
            manifest.append((rel, "action", 0, NOTE_EXT.get(ext, "Unsupported type — skipped.")))

    gl = ["# Glossary of symbols — " + a.title, "",
          "> Seeded automatically. Fill meaning, unit and clause for each symbol; delete false hits.", "",
          "| Symbol | Meaning | Unit | Clause / source |", "|---|---|---|---|"]
    gl += [f"| {s} | TODO | TODO | TODO |" for s in sorted(all_syms, key=str.lower)]
    (out / "01-glossary.md").write_text("\n".join(gl) + "\n", encoding="utf-8")
    manifest.insert(1 if a.rules_sections else 0, ("01-glossary.md", "upload", 0, "Complete before upload"))

    m = [f"# Upload manifest — {a.title}", "",
         "Upload the `upload` rows in this order (NotebookLM → Add sources → Upload).", "",
         "| # | File | Action | Words | Notes |", "|---|---|---|---|---|"]
    m += [f"| {i} | {f} | {act} | {w or ''} | {note} |" for i, (f, act, w, note) in enumerate(manifest, 1)]
    (out / "MANIFEST.md").write_text("\n".join(m) + "\n", encoding="utf-8")
    print(f"pack written: {out}  ({sum(1 for r in manifest if r[1] == 'upload')} sources, "
          f"{len(all_syms)} glossary symbols)")
    return 0


# ---------------------------------------------------------------- check
def check(pack: Path, max_words: int) -> int:
    problems, warnings = [], []
    sources = sorted(pack.glob("[0-9][0-9]-*.md"))
    if not sources:
        problems.append("no numbered sources found")
    for s in sources:
        t = s.read_text(encoding="utf-8")
        wc = word_count(t)
        if wc < 30:
            problems.append(f"{s.name}: nearly empty ({wc} words)")
        if wc > max_words * 1.5:
            warnings.append(f"{s.name}: {wc} words — consider splitting")
        if re.search(r"\\(frac|gamma|sigma|le|ge|text|sqrt)\b", t):
            warnings.append(f"{s.name}: leftover LaTeX")
        if s.name != "01-glossary.md" and "> **Status:**" not in t:
            problems.append(f"{s.name}: missing header block")
        if "TODO" in t and s.name == "01-glossary.md":
            warnings.append("01-glossary.md: TODO entries remain")
        for line in t.splitlines():
            if heading_level(line) and IMPL_HEADING.search(line) and not IMPL_KEEP.search(line):
                warnings.append(f"{s.name}: implementation heading remains: {line.strip()}")
    flags = {f: sum(s.read_text(encoding='utf-8').count(f) for s in sources) for f in FLAGS}
    for msg in problems:
        print("FAIL ", msg)
    for msg in warnings:
        print("WARN ", msg)
    print("flags:", ", ".join(f"{k}={v}" for k, v in flags.items()))
    for need in ("MANIFEST.md", "NOTEBOOK-GUIDE.md"):
        if not (pack / need).exists():
            print("WARN ", f"{need} missing")
    print("OK" if not problems else "FAILED")
    return 1 if problems else 0


def main() -> int:
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--name", help="pack folder name, e.g. pile-cap-2-pile")
    ap.add_argument("--title", help="human title used in source headers")
    ap.add_argument("--input", action="append", default=[], help="file or folder (repeatable)")
    ap.add_argument("--rules-sections", default="", help="AGENTS.project.md top-level section numbers, e.g. 12,14,17")
    ap.add_argument("--rules-file", default="AGENTS.project.md")
    ap.add_argument("--out", default="notebooklm")
    ap.add_argument("--max-words", type=int, default=12000)
    ap.add_argument("--keep-implementation", action="store_true", help="keep app/code sections")
    ap.add_argument("--force", action="store_true", help="overwrite an existing pack")
    ap.add_argument("--check", metavar="PACK_DIR", help="validate an existing pack and exit")
    a = ap.parse_args()
    if a.check:
        return check(Path(a.check), a.max_words)
    if not (a.name and a.title and (a.input or a.rules_sections)):
        ap.error("--name, --title and at least one --input or --rules-sections are required")
    return build(a)


if __name__ == "__main__":
    sys.exit(main())
