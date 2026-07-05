#!/usr/bin/env python3
"""Generate the PWA raster icons (192, 512, plus a maskable 512) from code.

No third-party deps: builds opaque RGB PNGs with the stdlib (zlib + struct).
The mark is an original 2x2 "decision quadrant" grid on a deep-ink field with
one lit cell — echoing the app's quadrant navigation. Run:

    python3 scripts/gen-icons.py

Writes icons/icon-192.png, icons/icon-512.png, icons/icon-maskable-512.png.
"""
import os
import struct
import zlib

OUT_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "icons")

# Palette (matches the app dark-theme brand tokens)
INK = (18, 20, 28)          # background field
CELL = (39, 44, 63)         # quadrant cell
CELL_EDGE = (58, 64, 92)    # cell border
LIT = (240, 180, 41)        # gold — the chosen quadrant
LIT_EDGE = (255, 205, 92)


def _png(width, height, rgb_rows):
    """rgb_rows: list of bytearray rows, each width*3 bytes."""
    raw = bytearray()
    for row in rgb_rows:
        raw.append(0)  # filter type 0 (None) per scanline
        raw.extend(row)

    def chunk(tag, data):
        out = struct.pack(">I", len(data)) + tag + data
        crc = zlib.crc32(tag + data) & 0xFFFFFFFF
        return out + struct.pack(">I", crc)

    sig = b"\x89PNG\r\n\x1a\n"
    ihdr = struct.pack(">IIBBBBB", width, height, 8, 2, 0, 0, 0)  # 8-bit, color type 2 (RGB)
    idat = zlib.compress(bytes(raw), 9)
    return sig + chunk(b"IHDR", ihdr) + chunk(b"IDAT", idat) + chunk(b"IEND", b"")


def draw(size, pad_ratio):
    rows = [bytearray(INK * size) for _ in range(size)]

    def put(x, y, c):
        if 0 <= x < size and 0 <= y < size:
            i = x * 3
            rows[y][i:i + 3] = bytes(c)

    pad = int(size * pad_ratio)
    inner = size - 2 * pad
    gap = max(2, int(inner * 0.06))
    cell = (inner - gap) // 2
    radius = max(2, int(cell * 0.16))

    def rounded_cell(ox, oy, fill, edge):
        for yy in range(cell):
            for xx in range(cell):
                # rounded-corner mask
                dx = min(xx, cell - 1 - xx)
                dy = min(yy, cell - 1 - yy)
                if dx < radius and dy < radius:
                    if (radius - dx) ** 2 + (radius - dy) ** 2 > radius ** 2:
                        continue
                on_edge = dx < 2 or dy < 2 or (dx < radius and dy < radius and
                                               (radius - dx) ** 2 + (radius - dy) ** 2 > (radius - 2) ** 2)
                put(pad + ox + xx, pad + oy + yy, edge if on_edge else fill)

    positions = [(0, 0), (cell + gap, 0), (0, cell + gap), (cell + gap, cell + gap)]
    lit_index = 1  # top-right cell is the chosen quadrant
    for idx, (ox, oy) in enumerate(positions):
        if idx == lit_index:
            rounded_cell(ox, oy, LIT, LIT_EDGE)
        else:
            rounded_cell(ox, oy, CELL, CELL_EDGE)

    return _png(size, size, rows)


def main():
    os.makedirs(OUT_DIR, exist_ok=True)
    targets = [
        ("icon-192.png", 192, 0.16),
        ("icon-512.png", 512, 0.16),
        ("icon-maskable-512.png", 512, 0.24),  # extra safe-zone padding for maskable
    ]
    for name, size, pad in targets:
        data = draw(size, pad)
        with open(os.path.join(OUT_DIR, name), "wb") as f:
            f.write(data)
        print(f"wrote {name} ({size}x{size}, {len(data)} bytes)")


if __name__ == "__main__":
    main()
