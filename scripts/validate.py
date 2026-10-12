#!/usr/bin/env python3
"""Gate: required fields + at least one signal + non-empty website. Optional --check-links."""
from __future__ import annotations

import argparse
import json
import sys
import urllib.error
import urllib.request
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
DATA = ROOT / "data" / "companies.json"
REQUIRED = [
    "id",
    "name_zh",
    "name_en",
    "tagline",
    "round",
    "region",
    "sector",
    "why_potential",
    "signals",
    "website",
    "listed_at",
    "status",
]
STATUSES = {"watching", "graduated", "archived"}


def fail(msg: str) -> None:
    print(f"FAIL: {msg}", file=sys.stderr)


def check_url(url: str, timeout: float = 8.0) -> tuple[bool, str]:
    req = urllib.request.Request(
        url,
        method="GET",
        headers={"User-Agent": "StartupCradleLinkCheck/1.0"},
    )
    try:
        with urllib.request.urlopen(req, timeout=timeout) as resp:
            code = getattr(resp, "status", 200) or 200
            if code >= 400:
                return False, f"HTTP {code}"
            return True, f"HTTP {code}"
    except urllib.error.HTTPError as e:
        return False, f"HTTP {e.code}"
    except Exception as e:  # noqa: BLE001 — gate script
        return False, str(e)


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--check-links", action="store_true")
    args = parser.parse_args()

    raw = json.loads(DATA.read_text(encoding="utf-8"))
    companies = raw.get("companies")
    if not isinstance(companies, list):
        fail("companies must be a list")
        return 1

    errors = 0
    ids: set[str] = set()
    for i, c in enumerate(companies):
        prefix = f"[{i}] {c.get('id', '?')}"
        if not isinstance(c, dict):
            fail(f"{prefix}: not an object")
            errors += 1
            continue
        for key in REQUIRED:
            if key not in c or c[key] in (None, "", []):
                fail(f"{prefix}: missing required field `{key}`")
                errors += 1
        cid = c.get("id")
        if isinstance(cid, str):
            if cid in ids:
                fail(f"{prefix}: duplicate id")
                errors += 1
            ids.add(cid)
        if c.get("status") not in STATUSES:
            fail(f"{prefix}: invalid status")
            errors += 1
        why = c.get("why_potential") or ""
        if isinstance(why, str) and len(why.strip()) < 20:
            fail(f"{prefix}: why_potential too short / empty talk risk")
            errors += 1
        signals = c.get("signals") or []
        if not isinstance(signals, list) or len(signals) < 1:
            fail(f"{prefix}: need ≥1 public signal")
            errors += 1
        else:
            for j, s in enumerate(signals):
                if not isinstance(s, dict) or not s.get("label") or not s.get("url"):
                    fail(f"{prefix}: signal[{j}] needs label+url")
                    errors += 1
        website = c.get("website")
        if not isinstance(website, str) or not website.startswith(("http://", "https://")):
            fail(f"{prefix}: website must be http(s) URL")
            errors += 1
        elif args.check_links:
            ok, detail = check_url(website)
            if not ok:
                fail(f"{prefix}: website dead ({detail}) → {website}")
                errors += 1
            for j, s in enumerate(signals):
                if isinstance(s, dict) and s.get("url"):
                    ok, detail = check_url(s["url"])
                    if not ok:
                        fail(f"{prefix}: signal[{j}] dead ({detail}) → {s['url']}")
                        errors += 1

    if errors:
        print(f"{errors} gate error(s). Do not publish.", file=sys.stderr)
        return 1
    print(f"OK: {len(companies)} compan(y/ies) passed field gate.")
    if args.check_links:
        print("OK: link checks passed.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
