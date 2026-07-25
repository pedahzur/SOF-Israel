#!/usr/bin/env python3
"""Verify that restricted GTD files are absent from the deployed appendix."""

from __future__ import annotations

import argparse
import ssl
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.parse import quote
from urllib.request import Request, urlopen


DEFAULT_BASE_URL = "https://pedahzur.github.io/SOF-APPENDIX/"
FORBIDDEN_PATHS = (
    "GTD_2026_Codebook.pdf",
    "GTD_2026_globalterrorismdb_2021Jan-June_1222dist.xlsx",
    "Israel_GTD_2026_Revised.xlsx",
)
ABSENT_STATUSES = {404, 410}


def tls_context() -> ssl.SSLContext:
    """Use Python's configured CA bundle, falling back to the macOS system bundle."""
    configured = ssl.get_default_verify_paths().cafile
    if configured and Path(configured).is_file():
        return ssl.create_default_context()
    system_bundle = Path("/etc/ssl/cert.pem")
    if system_bundle.is_file():
        return ssl.create_default_context(cafile=str(system_bundle))
    return ssl.create_default_context()


def status_for(url: str) -> int:
    request = Request(
        url,
        method="HEAD",
        headers={"User-Agent": "SOF-APPENDIX-release-check"},
    )
    try:
        with urlopen(request, timeout=20, context=tls_context()) as response:
            return response.status
    except HTTPError as error:
        return error.code


def main() -> int:
    parser = argparse.ArgumentParser()
    parser.add_argument("--base-url", default=DEFAULT_BASE_URL)
    args = parser.parse_args()
    base_url = args.base_url.rstrip("/") + "/"

    failures: list[str] = []
    for path in FORBIDDEN_PATHS:
        url = base_url + quote(path)
        try:
            status = status_for(url)
        except URLError as error:
            failures.append(f"{path}: network check failed ({error.reason})")
            continue
        print(f"{status}  {url}")
        if status not in ABSENT_STATUSES:
            failures.append(f"{path}: expected 404 or 410, received {status}")

    if failures:
        print("Rights quarantine is not verified:")
        for failure in failures:
            print(f"  - {failure}")
        return 1

    print("Rights quarantine verified on the deployed site.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
