# Notebook guide template

Copy into `notebooklm/<name>/NOTEBOOK-GUIDE.md` and replace every `<…>` with topic-specific
content. Delete any section that doesn't apply. Keep prompts concrete: name the real governing
checks, members and open inputs of this topic.

---

# <Topic title> — NotebookLM guide

## 1. Upload
Upload the sources in the order listed in `MANIFEST.md`. Start with `00-design-rules.md` and
`01-glossary.md` so answers anchor on them.

## 2. Custom chat instructions
Paste into NotebookLM → *Configure chat* → *Custom* (keep under NotebookLM's length limit):

```
You are a checking structural engineer reviewing a Eurocode calculation package for <topic>.
Answer only from the uploaded sources. For every value, give the source file and the Eurocode
clause it relies on. Always state whether an input is GIVEN, DERIVED, ASSUMED or INPUT REQUIRED,
exactly as the sources label it. If the sources do not contain the answer, say "Not in sources"
— do not supply typical values from general knowledge. Report checks as Demand, Resistance,
Utilisation, PASS/FAIL/NOT VERIFIED. National Annex: <as stated in sources>. Units: SI (kN, kNm,
MPa, mm).
```

## 3. Audio Overview
*Customise* box:

```
Audience: <e.g. site engineer / reviewing engineer / client PM>. Explain how load travels from
<start> to <end>, the governing checks (<list 3–5 real checks with clauses>), and which inputs
are still ASSUMED or INPUT REQUIRED and why they matter. Do not present preliminary values as
final. About <N> minutes.
```

## 4. Study guide / FAQ / quiz prompts
- Study guide: "Build a study guide on <topic> organised by limit state (ULS, SLS, durability,
  geotechnical), with the clause for each check."
- FAQ: "Write an FAQ a checking engineer would ask about <topic>, focusing on <governing checks>."
- Quiz: "Write 10 questions testing understanding of <specific mechanisms, e.g. strut angle θ and
  tie force>, with answers citing the source."

## 5. Review questions to ask the notebook
1. Which inputs are ASSUMED or INPUT REQUIRED, and which checks depend on each?
2. What is the governing check and its utilisation? Which source states it?
3. Which partial factors are used, and do they come from the National Annex or EN defaults?
4. <topic-specific question>
5. <topic-specific question>
6. Where do the sources contradict each other (values, codes, NA)?
7. What is NOT VERIFIED in this package?
8. What load combinations are considered, and is any design situation missing?
