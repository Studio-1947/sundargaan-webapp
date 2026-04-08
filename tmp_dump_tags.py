import re

def dump_tags(file_path, output_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    lines = content.splitlines()
    
    # Pattern to find tags (both opening and closing)
    pattern = re.compile(r'<(div|motion\.div|section|aside|main|AnimatePresence|motion\.p|motion\.h1|button|span|h[1-6]|p|img|input|select|textarea|label|ul|li|a|form)|</(div|motion\.div|section|aside|main|AnimatePresence|motion\.p|motion\.h1|button|span|h[1-6]|p|img|input|select|textarea|label|ul|li|a|form)>')
    
    with open(output_path, 'w', encoding='utf-8') as out:
        for line_no, line in enumerate(lines, 1):
            for match in pattern.finditer(line):
                out.write(f"{line_no}: {match.group(0)}\n")

if __name__ == "__main__":
    dump_tags('src/pages/MeetTheArtistPage.tsx', 'tmp_tags_dump.txt')
