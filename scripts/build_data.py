"""Regenerate data.js from the saved Mixpanel funnel reports.

Usage:  MIXPANEL_PROJECT_ID=... MIXPANEL_SA_SECRET=... python3 scripts/build_data.py
Reads each saved Insights report (daily granularity) and rebuilds exact day-cohort
numerators/denominators per calendar month and for the last 28 days vs the 28 before.
"""
import json, os, re, time, datetime as dt
from collections import defaultdict
import requests

API = 'https://mixpanel.com/api'
OV = '$overall'

# id, product, platform, default segment, bookmark_id
REPORTS = [
    ('A Web',         'group',  'Web',     None,       '92476240'),
    ('A iOS LI',      'group',  'iOS',     'loggedin', '90742953'),
    ('A Android LI',  'group',  'Android', 'loggedin', '92869889'),
    ('A iOS LO',      'group',  'iOS',     'guest',    '90742954'),
    ('A Android LO',  'group',  'Android', 'guest',    '92888711'),
    ('B Web',         'oneone', 'Web',     None,       '92870367'),
    ('B iOS LI',      'oneone', 'iOS',     'loggedin', '90742955'),
    ('B Android LI',  'oneone', 'Android', 'loggedin', '92887037'),
    ('B iOS LO',      'oneone', 'iOS',     'guest',    '92887348'),
    ('B Android LO',  'oneone', 'Android', 'guest',    '92887058'),
]

def rc(product):
    return 'Register click' if product == 'group' else 'Confirm slot click'

def label(product, name):
    n = re.sub(r'^[A-Z]\. ', '', name)
    n = re.sub(r'\s*\((Guest|Logged in|Logged In)\)', '', n).strip()
    r = rc(product)
    table = [
        (r'^PV to RS$|^Overall', 'Overall: page view → purchase'),
        (r'^PV to RC$', f'Page view → {r}'),
        (r'^RC to Cart( Page)?$', f'{r} → Cart page'),
        (r'^RC to Login Success$', f'{r} → Login success'),
        (r'^RC to Login$', f'{r} → Login screen'),
        (r'^Cart to Login Success$', 'Cart page → Login success'),
        (r'^Cart to Login$', 'Cart page → Login screen'),
        (r'^Login to Send OTP$', 'Login screen → OTP sent'),
        (r'^Send OTP to Login Success$', 'OTP sent → Login success'),
        (r'^Login( Success)? to Proceed Checkout$', 'Login success → Proceed to checkout'),
        (r'^Cart to (Proceed Checkout|PC)$', 'Cart page → Proceed to checkout'),
        (r'^(Proceed Checkout|PC) to (RS|Register Succeed)$', 'Proceed to checkout → Purchase'),
    ]
    for pat, out in table:
        if re.search(pat, n):
            return out
    return n

def parse(s):
    for f in ('%b %d, %Y', '%B %d, %Y'):
        try:
            return dt.datetime.strptime(s, f).date()
        except ValueError:
            pass
    raise ValueError(s)

def fetch(pid, tok, bid, tries=4):
    for i in range(tries):
        try:
            r = requests.get(f'{API}/query/insights', params={'project_id': pid, 'bookmark_id': bid},
                             headers={'Authorization': f'Basic {tok}'}, timeout=240)
            if r.status_code == 200:
                return r.json()
            print('report', bid, 'HTTP', r.status_code, r.text[:120])
        except requests.exceptions.RequestException as e:
            print('report', bid, 'error', type(e).__name__)
        time.sleep(10 * (i + 1))
    raise RuntimeError(f'could not fetch bookmark {bid}')

def fetch_all(pid, tok):
    return {rid: fetch(pid, tok, bid) for rid, _, _, _, bid in REPORTS}

def render_js(data):
    return 'window.DASH_DATA = ' + json.dumps(data, separators=(',', ':')) + ';\n'

def build(raws):
    latest = max(parse(k) for j in raws.values() for m in j['series'].values() for k in m if k != OV)
    end = latest - dt.timedelta(days=1)            # drop the current, partial day
    l28 = (end - dt.timedelta(days=27), end)
    p28 = (end - dt.timedelta(days=55), end - dt.timedelta(days=28))
    first = min(parse(k) for j in raws.values() for m in j['series'].values() for k in m if k != OV)
    months, y, m_ = [], first.year, first.month
    while (y, m_) <= (end.year, end.month):
        months.append(f'{y}-{m_:02d}')
        y, m_ = (y + 1, 1) if m_ == 12 else (y, m_ + 1)

    def buckets(d):
        b = [d.strftime('%Y-%m'), 'ALL']
        if l28[0] <= d <= l28[1]: b.append('L28')
        if p28[0] <= d <= p28[1]: b.append('P28')
        return b

    funnels = []
    for rid, product, platform, seg_default, _ in REPORTS:
        prim, sec = raws[rid]['series'], raws[rid]['secondary']['series']
        chains, cur = [], None
        for m in sorted(prim):
            nm = re.sub(r'^[A-Z]\. ', '', m)
            if nm.startswith('PV') and ' to ' not in nm:
                cur = {'entry': m, 'steps': []}; chains.append(cur)
            else:
                cur['steps'].append(m)
        for ch in chains:
            steps, n = ch['steps'], len(ch['steps'])
            seg = seg_default
            if 'Guest' in ch['entry']: seg = 'guest'
            elif 'Logged' in ch['entry']: seg = 'loggedin'
            agg = {s: defaultdict(lambda: [0, 0]) for s in steps}
            ent = defaultdict(int)
            for k in prim[ch['entry']]:
                if k == OV: continue
                d = parse(k)
                if d > end: continue
                nums = [(sec[s].get(k, {}).get('all') or 0) for s in steps]
                rates = [(prim[s].get(k, {}).get('all') or 0) for s in steps]
                dens = [round(nums[i] / rates[i]) if nums[i] > 0 and rates[i] > 0 else None for i in range(n)]
                den1 = dens[0] if dens[0] is not None else (dens[-1] or 0)
                for i, s in enumerate(steps):
                    if i in (0, n - 1): dd = den1
                    else: dd = dens[i] if dens[i] is not None else nums[i - 1]
                    for b in buckets(d):
                        agg[s][b][0] += nums[i]; agg[s][b][1] += dd
                for b in buckets(d): ent[b] += den1
            out_steps = []
            for i, s in enumerate(steps):
                out_steps.append({
                    'label': label(product, s),
                    'overall': i == n - 1,
                    'months': [agg[s].get(mo, [0, 0]) for mo in months],
                    'l28': agg[s].get('L28', [0, 0]), 'p28': agg[s].get('P28', [0, 0]),
                    'all': agg[s].get('ALL', [0, 0]),
                })
            fid = f"{product}-{platform.lower()}-{seg}"
            funnels.append({
                'id': fid, 'product': product, 'platform': platform, 'segment': seg,
                'entrants': {'months': [ent.get(mo, 0) for mo in months], 'l28': ent.get('L28', 0),
                             'p28': ent.get('P28', 0), 'all': ent.get('ALL', 0)},
                'steps': out_steps,
            })

    fmt = lambda d: d.isoformat()
    data = {'generated': dt.date.today().isoformat(), 'through': fmt(end), 'months': months,
            'l28': [fmt(l28[0]), fmt(l28[1])], 'p28': [fmt(p28[0]), fmt(p28[1])], 'funnels': funnels}
    return data

def main():
    pid, tok = os.environ['MIXPANEL_PROJECT_ID'], os.environ['MIXPANEL_SA_SECRET']
    data = build(fetch_all(pid, tok))
    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    with open(os.path.join(root, 'data.js'), 'w') as f:
        f.write(render_js(data))
    print('wrote data.js:', len(data['funnels']), 'funnels, months', data['months'], 'through', data['through'])

if __name__ == '__main__':
    main()
