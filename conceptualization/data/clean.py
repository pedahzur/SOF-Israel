"""Clean the SOF-definitions export into a canonical dataset.

Reads raw_export.csv (one workbook tab, 15 source columns), normalizes into a
canonical schema, normalizes years, tags faceted rows, quarantines anything
genuine-but-untitled, and writes clean_v2.csv / needs_review.csv / change_log.md.
"""
import csv
import re
import pathlib
from datetime import date

ROOT = pathlib.Path(__file__).parent
RAW = ROOT / "raw_export.csv"

# Source column index -> canonical field name (col 14 @dropdown intentionally dropped)
COLMAP = {
    0: "term_raw",
    1: "definition_verbatim",
    2: "explanation",
    3: "source_MLA",
    4: "page",
    5: "sub_source",
    6: "year",
    7: "profession",
    8: "discipline",
    9: "country",
    10: "definition_basis",
    11: "definition_basis_code",
    12: "universal_title",
    13: "title_code",
}

CANON_FIELDS = [
    "term_raw", "universal_title", "title_code", "definition_verbatim",
    "explanation", "definition_basis", "definition_basis_code", "author",
    "profession", "discipline", "country", "year", "source_MLA", "page",
    "sub_source", "provenance",
]

VALID_TITLES = {"Special Forces", "Elite Forces", "Tactical Teams",
                "Special Operations Forces", "Other Units"}

TANA_BLEED = re.compile(r"[\U0001F300-\U0001FAFF]")
ADDRESSY = re.compile(r"\b(Abingdon|Ec1y|Ox14|Milton Park|City Road)\b")

FACET = re.compile(
    r"\((Role|Missions?|Organization|Mode of Operation|Purposes?|"
    r"Responsibilities|Characteristics|Groups|Strategic Utility|"
    r"Areas of Collateral Activity|Capability Levels|Force Structure)\b", re.I)


def norm_year(v: str) -> str:
    m = re.search(r"\b(1[89]\d\d|20\d\d)\b", v or "")
    return m.group(1) if m else ""


def facet_tag(term_raw: str) -> str:
    m = FACET.search(term_raw or "")
    if not m:
        return ""
    base = (term_raw.split("(")[0]).strip()
    return f"facet_of:{base}"


def classify(rec: dict) -> str:
    term = (rec.get("term_raw") or "").strip()
    defn = (rec.get("definition_verbatim") or "").strip()
    title = (rec.get("universal_title") or "").strip()
    if term in {":-:", "Definition", "Term", ""} and len(defn) < 20:
        return "junk"
    if TANA_BLEED.search(title) or ADDRESSY.search(title):
        return "junk"
    if len(term) > 5 and len(defn) >= 40:
        if title in VALID_TITLES:
            return "ok"
        return "review"
    return "review"


def main() -> None:
    rows = list(csv.reader(RAW.open(encoding="utf-8")))
    body = rows[1:]
    ok, review, junk = [], [], []
    for raw in body:
        if not any(c.strip() for c in raw):
            continue
        rec = {f: "" for f in CANON_FIELDS}
        for idx, field in COLMAP.items():
            if idx < len(raw):
                rec[field] = raw[idx].strip()
        rec["year"] = norm_year(rec.get("year"))
        ft = facet_tag(rec.get("term_raw"))
        rec["provenance"] = "original" + (";" + ft if ft else "")
        verdict = classify(rec)
        (junk if verdict == "junk" else review if verdict == "review" else ok).append(rec)

    def write(path: pathlib.Path, recs: list) -> None:
        with path.open("w", newline="", encoding="utf-8") as f:
            w = csv.DictWriter(f, fieldnames=CANON_FIELDS)
            w.writeheader()
            w.writerows(recs)

    write(ROOT / "clean_v2.csv", ok)
    write(ROOT / "needs_review.csv", review)
    facets = sum(1 for r in ok if "facet_of:" in r["provenance"])
    (ROOT / "change_log.md").write_text(
        f"# Change log - {date.today()}\n\n"
        f"- Input rows (excl. header): {len(body)}\n"
        f"- Clean rows kept: {len(ok)}\n"
        f"- Quarantined (needs review): {len(review)}\n"
        f"- Dropped as junk: {len(junk)}\n"
        f"- Faceted rows tagged: {facets}\n",
        encoding="utf-8")
    print(f"ok={len(ok)} review={len(review)} junk={len(junk)} facets={facets}")


if __name__ == "__main__":
    main()
