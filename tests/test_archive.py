from __future__ import annotations

import re
import subprocess
import sys
import unittest
from pathlib import Path


ROOT = Path(__file__).resolve().parents[1]
QUARANTINED_GTD_FILES = (
    "GTD_2026_Codebook.pdf",
    "GTD_2026_globalterrorismdb_2021Jan-June_1222dist.xlsx",
    "Israel_GTD_2026_Revised.xlsx",
)


def relative_luminance(hex_color: str) -> float:
    values = [int(hex_color[index : index + 2], 16) / 255 for index in (1, 3, 5)]
    channels = [
        value / 12.92
        if value <= 0.04045
        else ((value + 0.055) / 1.055) ** 2.4
        for value in values
    ]
    return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2]


class ArchiveReleaseTests(unittest.TestCase):
    def test_generated_record_counts_are_current(self) -> None:
        result = subprocess.run(
            [
                sys.executable,
                str(ROOT / "scripts" / "generate_record_counts.py"),
                "--check",
            ],
            cwd=ROOT,
            capture_output=True,
            text=True,
        )
        self.assertEqual(result.returncode, 0, result.stdout + result.stderr)

    def test_quarantined_gtd_files_are_not_deployed(self) -> None:
        ignore = (ROOT / ".gitignore").read_text(encoding="utf-8")
        for filename in QUARANTINED_GTD_FILES:
            self.assertFalse((ROOT / filename).exists(), filename)
            self.assertIn(f"/{filename}", ignore)

    def test_catalog_does_not_download_quarantined_gtd_files(self) -> None:
        catalog = (ROOT / "js" / "data.js").read_text(encoding="utf-8")
        for filename in QUARANTINED_GTD_FILES:
            self.assertNotIn(f'dl("{filename}"', catalog)
        self.assertIn("https://www.start.umd.edu/gtd-terms", catalog)

    def test_all_catalogued_local_downloads_exist(self) -> None:
        catalog = (ROOT / "js" / "data.js").read_text(encoding="utf-8")
        downloads = set(re.findall(r'dl\("([^"]+)"', catalog))
        missing = sorted(filename for filename in downloads if not (ROOT / filename).is_file())
        self.assertEqual(missing, [])

    def test_index_local_assets_exist(self) -> None:
        html = (ROOT / "index.html").read_text(encoding="utf-8")
        refs = re.findall(r'(?:href|src)="([^"]+)"', html)
        local_refs = [
            ref
            for ref in refs
            if not ref.startswith(("http://", "https://", "#"))
        ]
        missing = sorted(
            ref for ref in local_refs if not (ROOT / ref.split("?", 1)[0]).is_file()
        )
        self.assertEqual(missing, [])

    def test_october_7_appendix_is_visibly_draft(self) -> None:
        catalog = (ROOT / "js" / "data.js").read_text(encoding="utf-8")
        appendix = (ROOT / "Methodological_Appendix_Fallen_Oct7.md").read_text(
            encoding="utf-8"
        )
        self.assertIn('status: "Draft — verification pending"', catalog)
        self.assertIn('recordLabel: "draft method note"', catalog)
        self.assertRegex(
            catalog,
            re.compile(r'id:\s*"fallen-oct7".*?n:\s*null', re.DOTALL),
        )
        self.assertIn("**Draft — verification pending.**", appendix)

    def test_mobile_navigation_and_code_blocks_are_contained(self) -> None:
        app = (ROOT / "js" / "app.js").read_text(encoding="utf-8")
        css = (ROOT / "css" / "style.css").read_text(encoding="utf-8")
        self.assertIn('className = "toc-toggle"', app)
        self.assertIn('className = "toc-links"', app)
        self.assertIn(".toc-toggle", css)
        self.assertIn("nav#toc.open .toc-links", css)
        self.assertIn("grid-template-columns: minmax(0, 1fr)", css)
        self.assertIn(".qs-block { min-width: 0; }", css)
        self.assertIn("max-width: 100%", css)

    def test_restricted_status_text_meets_wcag_aa_contrast(self) -> None:
        css = (ROOT / "css" / "style.css").read_text(encoding="utf-8")
        colors = dict(re.findall(r"--([\w-]+):\s*(#[0-9a-fA-F]{6})", css))
        foreground = relative_luminance(colors["neg-text"])
        background = relative_luminance(colors["paper-hi"])
        contrast = (max(foreground, background) + 0.05) / (
            min(foreground, background) + 0.05
        )
        self.assertGreaterEqual(contrast, 4.5)

    def test_post_deploy_probe_covers_quarantined_files(self) -> None:
        probe = (ROOT / "scripts" / "check_live_rights.py").read_text(
            encoding="utf-8"
        )
        for filename in QUARANTINED_GTD_FILES:
            self.assertIn(filename, probe)
        self.assertIn("{404, 410}", probe)


if __name__ == "__main__":
    unittest.main()
