#!/usr/bin/env python3
import csv, json
from collections import defaultdict, Counter
from scipy import stats

rows=[]
with open("/Users/amipedahzur/SOF-APPENDIX/UNITSLongevityN_90.csv", newline="", encoding="utf-8-sig") as f:
    for r in csv.DictReader(f):
        r["std"]=float(r["Standardized Longevity"]); r["ent"]=r["Entrepreneur"].strip().lower()
        r["fate"]=r["Fate"].strip().lower(); r["status"]=r["Status"].strip()
        rows.append(r)

N=len(rows)
ent_groups=defaultdict(list)
for r in rows: ent_groups[r["ent"]].append(r)
print("N =",N)
print("Entrepreneur distribution:", {k:len(v) for k,v in ent_groups.items()})

# 1. Std longevity by entrepreneur
print("\n-- Standardized longevity by entrepreneur (mean / median / n) --")
for k in ["none","founder","transformative"]:
    v=[r["std"] for r in ent_groups.get(k,[])]
    if v: print(f"  {k:15s} mean={sum(v)/len(v):.3f} median={sorted(v)[len(v)//2]:.3f} n={len(v)}")
kw=stats.kruskal(*[[r["std"] for r in ent_groups[k]] for k in ["none","founder","transformative"] if ent_groups[k]])
print(f"  Kruskal-Wallis H={kw.statistic:.3f} p={kw.pvalue:.4f}")

# 2. Fate x entrepreneur
print("\n-- Fate x entrepreneur (counts) --")
fates=["expanded","endured","merged","demised"]
print(f"  {'ent':15s}"+"".join(f"{x:>10s}" for x in fates))
for k in ["none","founder","transformative"]:
    c=Counter(r["fate"] for r in ent_groups.get(k,[]))
    print(f"  {k:15s}"+"".join(f"{c.get(x,0):>10d}" for x in fates))

# 3. Expanded vs not, entrepreneur-present vs none  (Fisher)
ent_present=[r for r in rows if r["ent"] in ("founder","transformative")]
ent_none=[r for r in rows if r["ent"]=="none"]
a=sum(1 for r in ent_present if r["fate"]=="expanded")   # ent & expanded
b=len(ent_present)-a                                      # ent & not
c=sum(1 for r in ent_none if r["fate"]=="expanded")       # none & expanded
d=len(ent_none)-c
odds,p=stats.fisher_exact([[a,b],[c,d]])
print(f"\n-- Expanded x entrepreneur-present (Fisher) --")
print(f"  entrepreneur-led & expanded: {a}/{len(ent_present)}   none & expanded: {c}/{len(ent_none)}")
print(f"  Fisher exact p={p:.5f}  (odds ratio={'inf' if d==0 or a*d==0 and b*c==0 else odds})")
print(f"  All expanded units: "+", ".join(r['ID']+' ('+r['ent']+')' for r in rows if r['fate']=='expanded'))

# 4. 'Success' = expanded OR endured, vs entrepreneur-present
succ=lambda r: r["fate"] in ("expanded","endured")
a=sum(1 for r in ent_present if succ(r)); b=len(ent_present)-a
c=sum(1 for r in ent_none if succ(r)); d=len(ent_none)-c
odds,p=stats.fisher_exact([[a,b],[c,d]])
print(f"\n-- Survival(expanded/endured) x entrepreneur (Fisher) --")
print(f"  ent-led survived: {a}/{len(ent_present)} ({a/len(ent_present):.0%})   none survived: {c}/{len(ent_none)} ({c/len(ent_none):.0%})")
print(f"  Fisher p={p:.4f} odds={odds:.2f}")

# 5. Status (professionalization) x entrepreneur
print("\n-- Status x entrepreneur --")
for k in ["none","founder","transformative"]:
    print(f"  {k:15s}", dict(Counter(r['status'] for r in ent_groups.get(k,[]))))
# professionalization vs longevity
pro=[r["std"] for r in rows if r["status"] in ("Pro","Semi-Pro")]
nonpro=[r["std"] for r in rows if r["status"] not in ("Pro","Semi-Pro")]
mw=stats.mannwhitneyu(pro,nonpro)
print(f"  Std longevity: Pro/Semi-Pro mean={sum(pro)/len(pro):.3f} (n={len(pro)}) vs others mean={sum(nonpro)/len(nonpro):.3f} (n={len(nonpro)}); Mann-Whitney p={mw.pvalue:.4f}")
