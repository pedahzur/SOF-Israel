import csv
from collections import defaultdict
import math
from scipy import stats

rows=[]
with open("UNITSLongevityN_90.csv", newline="", encoding="utf-8-sig") as f:
    for r in csv.DictReader(f):
        rows.append({
            "id": r["ID"],
            "time": float(r["Overall Longevity"]),
            "fate": r["Fate"].strip().lower(),
            "ent": r["Entrepreneur"].strip().lower(),
        })

# event = demised or merged (unit "died"); endured/expanded = censored (still alive)
for r in rows:
    r["event"] = 1 if r["fate"] in ("demised","merged") else 0
    r["grp"] = "none" if r["ent"]=="none" else "entrepreneur"  # founder+transformative pooled

def logrank(rows, gA, gB):
    # standard two-group log-rank
    times = sorted(set(r["time"] for r in rows if r["event"]==1))
    O_A=E_A=V=0.0
    for t in times:
        at_risk = [r for r in rows if r["time"]>=t]
        nA = sum(1 for r in at_risk if r["grp"]==gA)
        nB = sum(1 for r in at_risk if r["grp"]==gB)
        n = nA+nB
        d = sum(1 for r in rows if r["time"]==t and r["event"]==1)
        dA = sum(1 for r in rows if r["time"]==t and r["event"]==1 and r["grp"]==gA)
        if n<=1: continue
        E_A += d*nA/n
        O_A += dA
        V += d*(nA/n)*(nB/n)*(n-d)/(n-1)
    chi = (O_A-E_A)**2 / V if V>0 else 0
    p = 1-stats.chi2.cdf(chi,1)
    return O_A,E_A,V,chi,p

def km_median(rows, grp):
    sub = sorted([r for r in rows if r["grp"]==grp], key=lambda r:r["time"])
    times = sorted(set(r["time"] for r in sub if r["event"]==1))
    S=1.0; median=None
    for t in times:
        n = sum(1 for r in sub if r["time"]>=t)
        d = sum(1 for r in sub if r["time"]==t and r["event"]==1)
        if n>0: S*= (1-d/n)
        if median is None and S<=0.5: median=t
    return median, S  # final S = survival at last event time

print("Group sizes / events:")
for g in ("none","entrepreneur"):
    sub=[r for r in rows if r["grp"]==g]
    print(f"  {g:12s} n={len(sub):3d}  events(died)={sum(r['event'] for r in sub):3d}  censored(alive)={sum(1-r['event'] for r in sub)}")

O,E,V,chi,p = logrank(rows,"entrepreneur","none")
print(f"\nLog-rank entrepreneur vs none: chi2={chi:.3f}  p={p:.4f}")
for g in ("none","entrepreneur"):
    m,Sfin = km_median(rows,g)
    print(f"  KM {g:12s}: median survival = {m if m is not None else 'NOT REACHED (>50% alive)'}   final S={Sfin:.2f}")

# also transformative separation check
print("\nTransformative units events:", [(r['id'],r['fate']) for r in rows if r['ent']=='transformative'])
print("Founder units events:", [(r['id'],r['fate']) for r in rows if r['ent']=='founder'])
