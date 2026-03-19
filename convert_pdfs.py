import os
import sys
import multiprocessing

def main():
    from marker.converters.pdf import PdfConverter
    from marker.models import create_model_dict
    from marker.output import text_from_rendered

    import sys
    if len(sys.argv) > 2:
        input_dir = sys.argv[1]
        output_dir = sys.argv[2]
    else:
        # Default: 练习册
        input_dir = "/root/.openclaw/workspace-gongbu/socrates-learning/materials/练习册"
        output_dir = "/root/.openclaw/workspace-gongbu/socrates-learning/materials/练习册_md"

    files = [
        "物理电磁C练习册-U1-P1-P86.pdf",
        "物理电磁C练习册-U2-P87-P116.pdf",
        "物理电磁C练习册-U3-P117-P182.pdf",
        "物理电磁C练习册-U4-P183-P236.pdf",
        "物理电磁C练习册-U5-P237-P300.pdf",
        "物理电磁C练习册-2018北美FRQ真题-P301-P328.pdf",
        "物理电磁C练习册-2019北美FRQ真题-P329-P392.pdf",
        "物理电磁C练习册-2021北美FRQ真题-P393-P416.pdf",
        "物理电磁C练习册-2022北美FRQ真题-P417-P474.pdf",
    ]

    print("Loading models (once)...")
    sys.stdout.flush()

    # workers=1 avoids multiprocessing spawn issues on macOS
    converter = PdfConverter(
        artifact_dict=create_model_dict(),
        config={"output_format": "markdown", "pdftext_workers": 1}
    )

    print("Models loaded. Starting conversion...\n")
    sys.stdout.flush()

    results = []

    for i, fname in enumerate(files, 1):
        input_path = os.path.join(input_dir, fname)
        output_fname = os.path.splitext(fname)[0] + ".md"
        output_path = os.path.join(output_dir, output_fname)

        print(f"[{i}/{len(files)}] Converting: {fname}")
        sys.stdout.flush()

        rendered = converter(input_path)
        text, _, _ = text_from_rendered(rendered)

        with open(output_path, "w", encoding="utf-8") as f:
            f.write(text)

        size = os.path.getsize(output_path)
        print(f"  -> Saved: {output_path} ({size:,} bytes)")
        sys.stdout.flush()
        results.append((output_path, size))

    print("\n=== Conversion Complete ===")
    for path, size in results:
        print(f"  {path}  ({size:,} bytes)")

if __name__ == '__main__':
    multiprocessing.freeze_support()
    main()
