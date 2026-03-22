import os
import json
import shutil
from pathlib import Path
from pdf2image import convert_from_path

def main():
    """
    Processes all PDF files found in the 'pdf-source' directory, converting each
    page into a high-resolution JPG image saved in a corresponding subdirectory
    within 'pdf-image'. Also generates a 'books.json' file for the frontend.
    """
    # Get the absolute path of the project's root directory
    project_root = Path(__file__).resolve().parent

    source_dir = project_root / 'pdf-source'
    output_dir = project_root / 'pdf-image'
    books_json_path = project_root / 'books.json'

    # Ensure the output directory exists
    output_dir.mkdir(exist_ok=True)

    print(f"Searching for PDF files in: {source_dir}")

    # Ensure source directory exists
    if not source_dir.exists():
        print(f"Source directory '{source_dir}' not found. Creating it.")
        source_dir.mkdir()

    pdf_files = list(source_dir.glob('*.pdf'))

    if not pdf_files:
        print("No PDF files found to process.")
        return

    books_data = []

    for pdf_path in pdf_files:
        print(f"Processing '{pdf_path.name}'...")

        # Create a subdirectory for the current PDF
        book_name = pdf_path.stem
        book_output_dir = output_dir / book_name
        book_output_dir.mkdir(exist_ok=True)

        page_offset = 0
        cover_source_path = source_dir / f"{book_name}-cover.png"
        if cover_source_path.exists():
            print(f"  Found cover image: {cover_source_path.name}")
            cover_dest_path = book_output_dir / 'page-01.jpg'
            shutil.copy(str(cover_source_path), str(cover_dest_path))
            print(f"  -> Copied cover to '{cover_dest_path}'")
            page_offset = 1
        
        # Metadata for this book
        book_info = {
            "id": book_name,
            "title": book_name.replace('-', ' ').title(),
            "cover": f"pdf-image/{book_name}/page-01.jpg",
            "folder": f"pdf-image/{book_name}/"
        }

        try:
            # Check if images already exist to avoid reprocessing (optional optimization)
            # For now, we'll just overwrite or process again to be safe
            
            # Convert PDF to a list of images (PIL objects) at 300 DPI
            print("  Converting PDF to images...")
            images = convert_from_path(pdf_path, dpi=300)

            # Save each page as a JPG file with zero-padded numbers
            for i, image in enumerate(images):
                image_filename = f'page-{i + 1 + page_offset:02d}.jpg'
                image_path = book_output_dir / image_filename
                print(f"  -> Saving page {i+1} to '{image_path}'")
                image.save(image_path, 'JPEG')

            print(f"Finished processing '{pdf_path.name}'.")
            book_info['pages'] = len(images) + page_offset
            books_data.append(book_info)

        except Exception as e:
            print(f"An error occurred while processing {pdf_path.name}: {e}")

    # Generate books.json
    with open(books_json_path, 'w', encoding='utf-8') as f:
        json.dump(books_data, f, indent=4, ensure_ascii=False)
    
    print(f"Generated books.json with {len(books_data)} books.")

if __name__ == '__main__':
    main()
