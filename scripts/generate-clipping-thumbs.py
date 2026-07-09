"""
Generate lightweight collage thumbnails for newspaper clippings.
Full-resolution scans stay in newspaper-clippings/; thumbs go in thumbs/.
"""

from __future__ import annotations

from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
SRC = ROOT / "assets" / "media" / "newspaper-clippings"
OUT = SRC / "thumbs"
MAX_EDGE = 480
JPEG_QUALITY = 72

SKIP_DIRS = {"thumbs"}


def thumb_name(src: Path) -> str:
    return f"{src.stem}.jpg"


def process(src: Path, dest: Path) -> None:
    with Image.open(src) as im:
        im = im.convert("RGB")
        im.thumbnail((MAX_EDGE, MAX_EDGE), Image.Resampling.LANCZOS)
        dest.parent.mkdir(parents=True, exist_ok=True)
        im.save(dest, format="JPEG", quality=JPEG_QUALITY, optimize=True, progressive=True)


def main() -> None:
    files = [
        p
        for p in SRC.iterdir()
        if p.is_file() and p.suffix.lower() in {".jpg", ".jpeg", ".png", ".webp"}
    ]
    files.sort(key=lambda p: p.name.lower())

    written = 0
    skipped = 0
    for src in files:
        dest = OUT / thumb_name(src)
        if dest.exists() and dest.stat().st_mtime >= src.stat().st_mtime:
            skipped += 1
            continue
        process(src, dest)
        written += 1
        print(f"ok  {src.name} -> thumbs/{dest.name} ({dest.stat().st_size // 1024} KB)")

    print(f"\nDone: {written} written, {skipped} up-to-date, {len(files)} source files.")


if __name__ == "__main__":
    main()
