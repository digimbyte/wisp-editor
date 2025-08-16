import argparse, sys, time

def compile_file(src: str, out: str, dbg: str | None):
    # Placeholder: just writes a tiny file to prove the pipe works
    data = b"WSBC\x00\x00demo\n"
    with open(out, "wb") as f:
        f.write(data)
    if dbg:
        with open(dbg, "w", encoding="utf-8") as f:
            f.write("{\n  \"pc\":0, \"line\":1\n}\n")
    print(f"Compiled {src} -> {out} ({len(data)} bytes)")

def main():
    ap = argparse.ArgumentParser(prog="wbc")
    sub = ap.add_subparsers(dest="cmd", required=True)
    c = sub.add_parser("compile")
    c.add_argument("src")
    c.add_argument("-o", "--out", required=True)
    c.add_argument("--map")
    args = ap.parse_args()
    if args.cmd == "compile":
        compile_file(args.src, args.out, args.map)

if __name__ == "__main__":
    main()
