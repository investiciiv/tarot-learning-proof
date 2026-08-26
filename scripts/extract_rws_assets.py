#!/usr/bin/env python3
"""Extract the 78 RWS plates from the supplied S01 scan.

Usage: python extract_rws_assets.py SOURCE.pdf OUTPUT_DIR
"""

from __future__ import annotations

import hashlib
import json
import shutil
import subprocess
import sys
import tempfile
from pathlib import Path

from PIL import Image, ImageOps


MAJOR_PAGES = [166, 86, 90, 94, 98, 102, 106, 110, 114, 118, 122, 126, 130, 134, 138, 142, 146, 150, 154, 158, 162, 170]
RANKS = ["ace", "2", "3", "4", "5", "6", "7", "8", "9", "10", "page", "knight", "queen", "king"]
MINOR_PAGES = {
    "wands": [210, 208, 206, 204, 202, 200, 198, 196, 194, 192, 190, 188, 186, 184],
    "cups": [238, 236, 234, 232, 230, 228, 226, 224, 222, 220, 218, 216, 214, 212],
    "swords": [266, 264, 262, 260, 258, 256, 254, 252, 250, 248, 246, 244, 242, 240],
    "pentacles": [294, 292, 290, 288, 286, 284, 282, 280, 278, 276, 274, 272, 270, 268],
}


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def render_plate(pdftoppm: str, pdf: Path, page: int, target: Path, temp_dir: Path) -> None:
    prefix = temp_dir / f"page-{page}"
    subprocess.run(
        [pdftoppm, "-png", "-r", "180", "-f", str(page), "-l", str(page), "-singlefile", str(pdf), str(prefix)],
        check=True,
        stdout=subprocess.DEVNULL,
    )
    with Image.open(prefix.with_suffix(".png")) as source:
        width, height = source.size
        crop = source.crop((int(width * 0.15), int(height * 0.12), int(width * 0.84), int(height * 0.82)))
        cleaned = ImageOps.autocontrast(ImageOps.grayscale(crop), cutoff=1)
        fitted = ImageOps.contain(cleaned, (560, 880), method=Image.Resampling.LANCZOS)
        canvas = Image.new("L", (560, 880), 248)
        canvas.paste(fitted, ((560 - fitted.width) // 2, (880 - fitted.height) // 2))
        canvas.save(target, "WEBP", quality=86, method=6)


def main() -> None:
    if len(sys.argv) != 3:
        raise SystemExit("Expected SOURCE.pdf and OUTPUT_DIR")

    source = Path(sys.argv[1]).resolve()
    output = Path(sys.argv[2]).resolve()
    output.mkdir(parents=True, exist_ok=True)

    pdftoppm = shutil.which("pdftoppm")
    if not pdftoppm:
        bundled = Path.home() / ".cache/codex-runtimes/codex-primary-runtime/dependencies/native/poppler/poppler/bin/pdftoppm"
        if bundled.exists():
            pdftoppm = str(bundled)
    if not pdftoppm:
        raise SystemExit("pdftoppm is required")

    records: list[dict[str, object]] = []
    with tempfile.TemporaryDirectory(prefix="tarot-rws-") as raw_temp:
        temp_dir = Path(raw_temp)
        for index, page in enumerate(MAJOR_PAGES):
            file_name = f"major-{index:02d}.webp"
            render_plate(pdftoppm, source, page, output / file_name, temp_dir)
            records.append({"file": file_name, "pdfPage": page, "sourceId": "S01"})

        for suit, pages in MINOR_PAGES.items():
            for rank, page in zip(RANKS, pages, strict=True):
                file_name = f"{suit}-{rank}.webp"
                render_plate(pdftoppm, source, page, output / file_name, temp_dir)
                records.append({"file": file_name, "pdfPage": page, "sourceId": "S01"})

    provenance = {
        "sourceId": "S01",
        "title": "The Pictorial Key to the Tarot",
        "author": "Arthur Edward Waite",
        "artist": "Pamela Colman Smith",
        "edition": "William Rider & Son, 1922 scan",
        "sourcePdfSha256": sha256(source),
        "transform": "Rendered at 180 dpi; fixed plate crop; grayscale autocontrast; 560x880 WebP",
        "assets": records,
    }
    (output / "provenance.json").write_text(json.dumps(provenance, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"Extracted {len(records)} S01 assets to {output}")


if __name__ == "__main__":
    main()
