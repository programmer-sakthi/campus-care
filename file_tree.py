from pathlib import Path

# ======================================================
# Configuration
# ======================================================

# Folder names to ignore (case-sensitive)
IGNORE_FOLDERS = {
    ".git",
    "node_modules",
    "__pycache__",
    ".turbo",
    "dist",
    "build",
    ".agents",
    ".claude",
    ".windsurf"
}

# Include files in the output
SHOW_FILES = True

OUTPUT_FILE = "file_tree.txt"

# ======================================================

ROOT = Path(__file__).parent.resolve()


def build_tree(path: Path, prefix: str = "") -> list[str]:
    lines = []

    items = sorted(
        path.iterdir(),
        key=lambda p: (p.is_file(), p.name.lower())
    )

    # Remove ignored folders
    items = [
        item
        for item in items
        if not (item.is_dir() and item.name in IGNORE_FOLDERS)
    ]

    for index, item in enumerate(items):
        is_last = index == len(items) - 1

        connector = "└── " if is_last else "├── "
        lines.append(f"{prefix}{connector}{item.name}")

        if item.is_dir():
            extension = "    " if is_last else "│   "
            lines.extend(build_tree(item, prefix + extension))

    return lines


def main():
    tree = [ROOT.name]
    tree.extend(build_tree(ROOT))

    output = "\n".join(tree)

    print(output)

    with open(ROOT / OUTPUT_FILE, "w", encoding="utf-8") as f:
        f.write(output)

    print(f"\nTree saved to {OUTPUT_FILE}")


if __name__ == "__main__":
    main()