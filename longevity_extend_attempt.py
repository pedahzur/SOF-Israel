#!/usr/bin/env python3
import csv, re
from collections import Counter, defaultdict
from scipy import stats

def norm(s):
    s=(s or "").strip().lower()
    s=re.sub(r'[^a-z0-9֐-׿ ]','',s)  # keep alnum + hebrew
    s=re.sub(r'\s+',' ',s).strip()
    return s

# --- N=233 with Fate ---
fate_by={}
fates=[]
with open("/Users/amipedahzur/SOF-APPENDIX/Units_March_2026_1_all.csv",newline="",encoding="utf-8-sig") as f:
    for r in csv.DictReader(f):
        nm=norm(r.get("Unit","")); ft=(r.get("Fate","") or "").strip().lower()
        if nm: fate_by[nm]=ft
        if ft: fates.append(ft)
print("N=233 file: rows with Fate =",len(fates))
print("Full-N Fate base rates:", dict(Counter(fates)))
print("  expanded overall:", sum(1 for x in fates if x=="expanded"), "/", len(fates))

# --- N=194 with founder field ---
rows194=[]
with open("/Users/amipedahzur/SOF-APPENDIX/UNITSN_194.csv",newline="",encoding="utf-8-sig") as f:
    rd=csv.DictReader(f)
    foundercol=[c for c in rd.fieldnames if "מייסד" in c]
    foundercol=foundercol[0] if foundercol else None
    print("founder column:", repr(foundercol))
    for r in rd:
        rows194.append((norm(r.get("Name","")), (r.get(foundercol,"") or "").strip()))
have_founder=sum(1 for _,fnd in rows194 if fnd)
print(f"N=194 file: {len(rows194)} units; founder field populated for {have_founder} ({have_founder/len(rows194):.0%})")

# --- join by normalized name ---
matched=[]
for nm,fnd in rows194:
    if nm in fate_by:
        matched.append((nm, bool(fnd), fate_by[nm]))
print(f"\nName-matched (194 <-> 233): {len(matched)} / {len(rows194)} ({len(matched)/len(rows194):.0%})")

# 2x2 founder-present x expanded on matched
a=sum(1 for _,f,ft in matched if f and ft=="expanded")
b=sum(1 for _,f,ft in matched if f and ft!="expanded")
c=sum(1 for _,f,ft in matched if not f and ft=="expanded")
d=sum(1 for _,f,ft in matched if not f and ft!="expanded")
print(f"founder & expanded={a}  founder & not={b}  no-founder & expanded={c}  no-founder & not={d}")
if (a+b)>0 and (c+d)>0:
    odds,p=stats.fisher_exact([[a,b],[c,d]])
    print(f"Fisher exact p={p:.5f} odds={odds}")
exp_units=[nm for nm,f,ft in matched if ft=="expanded"]
print("expanded (matched):", exp_units)
print("  of which founder-coded:", [nm for nm,f,ft in matched if ft=='expanded' and f])
