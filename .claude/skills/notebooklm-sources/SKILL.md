---
name: notebooklm-sources
description: |
  Packages this repo's Eurocode design material (docs/ design plans, calc packages, master
  prompts, AGENTS.project.md rules, borehole sheets, PDFs, photos) into a NotebookLM-ready source
  pack: clean Markdown sources with status/code/National Annex headers, a symbol glossary, an
  upload manifest, and a notebook guide with chat instructions plus Audio Overview, study-guide
  and quiz prompts. Also brings NotebookLM answers back into the repo, flagged unverified. Use
  whenever the user mentions NotebookLM, notebook sources, an audio overview / podcast / study
  guide / quiz of a design topic, or wants a calc or docs folder (pile cap, bored pile, sheet
  pile / CBP, basement wall, wind load) turned into material to study, brief or share — even
  without naming NotebookLM. To query an existing notebook in the browser, use the
  notebooklm-connector plugin instead.
---

# NotebookLM Source Packs (Eurocode design)

NotebookLM answers only from the sources uploaded to a notebook, and it cites them. That makes it
a good review and briefing tool for calculation packages — **if** the sources are clean. Raw repo
files work badly: app-implementation sections (React components, file paths) pollute answers,
LaTeX and unicode subscripts get garbled, `ASSUMED` / `INPUT REQUIRED` flags lose their meaning
without context, and a 40 kB master prompt becomes one blob NotebookLM cites vaguely. This skill
turns repo material into a pack that NotebookLM can cite precisely and that keeps the engineering
status of every number visible.

There is no NotebookLM API in this environment. The deliverable is a folder of files the user
uploads themselves (NotebookLM → *Add sources* → *Upload*). Say so once; don't promise automation.

## Workflow

### 1. Scope the pack
Work out the **topic** (one notebook = one design subject, e.g. "2-pile cap", "sheet pile & CBP
excavation"). Mixing unrelated structures in one notebook makes NotebookLM blend their inputs.
Gather candidate inputs:

- `docs/<topic>/**` — design plans, master prompts, CSVs, PDFs, images
- `attachments/` — project sheets and photos referenced by the topic
- `AGENTS.project.md` — the calculation rules; include only the sections the topic uses
  (e.g. §12 load combinations, §14 ULS, §17 geotechnical, §19 earth pressure) as one
  "Design rules" source, not the whole 1,500-line file
- Any calculation output the user just produced in chat — save it as a Markdown file first

If the topic is ambiguous, list the candidate folders and ask which one. Otherwise proceed.

### 2. Build the Markdown sources
Run the bundled script; it does the mechanical part deterministically:

```bash
python3 .claude/skills/notebooklm-sources/scripts/build_pack.py \
  --name "pile-cap-2-pile" \
  --title "2-Pile Cap on Bored Piles (EC2 STM)" \
  --input "docs/Pilecap 2 Pile" \
  --input "docs/bored pile" \
  --rules-sections "12,14,16,17,20" \
  --out notebooklm
```

What it does (read `scripts/build_pack.py --help` for all flags):
- Converts each `.md` input into a source with a standard header block (see below).
- Drops app-implementation sections (headings matching *App implementation*, *Implementation*,
  *Components*, *Files*, *UI*, *Tech stack*) — pass `--keep-implementation` to keep them.
- Rewrites common LaTeX (`\gamma_G`, `\frac{a}{b}`, `\le`, `\sqrt{}`) into plain readable text.
- Splits any source above `--max-words` (default 12,000) at H1/H2 boundaries, so citations
  point to a focused part rather than a whole master prompt.
- Turns `.csv` files into Markdown tables with a short column description.
- Extracts the chosen `AGENTS.project.md` sections into `00-design-rules.md`.
- Copies PDFs as-is and lists images, `.docx`, `.jfif` in the manifest with an action note.
- Writes `MANIFEST.md` (upload order, file sizes, word counts, what to do with each non-text file).

### 3. Edit what the script can't judge
Open the generated sources and fix, by hand:

- **Header facts** — fill `Status`, `Codes`, `National Annex`, `Design situation` from the
  content. Never invent them: if a plan says "UK NA (provisional)", write exactly that; if the
  source is silent, write `INPUT REQUIRED — not stated in source`. NotebookLM will repeat whatever
  the header says with confidence, so a guessed NA becomes a "fact" in every answer.
- **Glossary** — complete `01-glossary.md` (the script seeds it with symbols it found, e.g.
  `N_Ed`, `γ_G`, `ν1`, `UR`). Give each symbol its meaning, unit and clause. This is what lets
  NotebookLM explain a check instead of parroting the symbol.
- **Assumption flags** — keep every `ASSUMED`, `INPUT REQUIRED`, `NOT VERIFIED`,
  `PRELIMINARY` marker verbatim. These are the most important tokens in the pack.
- **Images** — NotebookLM may not read site photos or `.jfif` usefully. For each relevant image,
  write a short `images-described.md` entry (what it shows, which element, dimensions if legible)
  and tell the user which originals to upload separately if they want them.

### 4. Write the notebook guide
Create `NOTEBOOK-GUIDE.md` in the pack using the template in
`references/notebook-guide-template.md`. It contains:
- **Custom chat instructions** to paste into NotebookLM's *Configure chat* box — makes NotebookLM
  answer like a checking engineer: cite clause + source, separate given vs assumed inputs, say
  "not in sources" rather than filling gaps from general knowledge.
- **Audio Overview** customisation prompt (who the listener is, what to emphasise).
- **Study guide / FAQ / quiz** prompts targeted at the governing checks and open inputs.
- **Review questions** — 8–12 specific questions the user can ask to stress-test the package
  (e.g. "Which inputs are ASSUMED and what checks depend on each?").

Tailor every prompt to the topic's real governing checks. Generic prompts waste the tool.

### 5. Check and hand over
- Run `python3 .claude/skills/notebooklm-sources/scripts/build_pack.py --check notebooklm/<name>`
  — it verifies word counts, that no source is empty, that flags survived, and that no leftover
  LaTeX or implementation headings remain.
- Report to the user: pack location, number of sources, upload order, and the 2–3 `INPUT
  REQUIRED` items NotebookLM will keep surfacing. If the repo is a git branch, commit the pack
  when the user asked for it to be saved.

## Source header format

Every generated source starts with this block, so a source stays meaningful when NotebookLM
quotes it in isolation:

```markdown
# <Source title>

> **Project:** <project / topic>
> **Source file:** <repo-relative path>
> **Status:** <PRELIMINARY | COMPLETE | INCOMPLETE — from the source, never guessed>
> **Codes:** <EN 1990, EN 1992-1-1, …>
> **National Annex:** <as stated, or INPUT REQUIRED>
> **Design situation:** <persistent / transient / …, or INPUT REQUIRED>
> **Note:** Engineering calculation material for review. Values marked ASSUMED or
> INPUT REQUIRED are not verified project data.
```

## Bringing NotebookLM output back

When the user pastes or exports NotebookLM answers, notes, or a study guide and wants them in the
repo:
1. Save under `notebooklm/<name>/imported/<date>-<slug>.md` with a header
   `> Origin: NotebookLM output — UNVERIFIED. Not a calculation.`
2. Cross-check each numerical value or clause reference against the original repo source and
   `AGENTS.project.md`. Mark each as `✔ matches <file>`, `✖ differs from <file>: <value>`, or
   `? not found in sources`.
3. Never merge NotebookLM text into a design plan or calculation as if it were verified —
   NotebookLM summarises, it does not check Eurocode compliance.

## NotebookLM limits (verify if the user hits one — they change)
- Per source: up to ~500,000 words / 200 MB.
- Sources per notebook: 50 on the free tier, more on paid tiers.
- Upload types include PDF, Markdown/text, Google Docs/Slides, audio, URLs, YouTube; support for
  other types (images, .docx) has changed over time. When unsure, convert to PDF or Markdown.
