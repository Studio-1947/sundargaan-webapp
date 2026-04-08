import re

def check_tags(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    lines = content.splitlines()
    stack = []
    
    opening_pattern = re.compile(r'<(div|motion\.div|section|aside|main|AnimatePresence|motion\.p|motion\.h1)')
    closing_pattern = re.compile(r'</(div|motion\.div|section|aside|main|AnimatePresence|motion\.p|motion\.h1)>')
    self_closing_pattern = re.compile(r'<[^>]+/>')
    
    for line_no, line in enumerate(lines, 1):
        # Ignore comments
        line = re.sub(r'\{/\*.*?\*/\}', '', line)
        line = re.sub(r'//.*', '', line)
        
        # Find all openings, closings, and self-closings
        tags = []
        for match in opening_pattern.finditer(line):
            if not any(sc.start() <= match.start() < sc.end() for sc in self_closing_pattern.finditer(line)):
                tags.append(('OPEN', match.group(1), line_no))
        
        for match in closing_pattern.finditer(line):
            tags.append(('CLOSE', match.group(1), line_no))
        
        # Sort matches by position in line
        tags.sort(key=lambda x: re.search(re.escape(f'<{x[1]}') if x[0] == 'OPEN' else re.escape(f'</{x[1]}>'), line).start())
        
        for type, tag, lno in tags:
            if type == 'OPEN':
                stack.append((tag, lno))
            else:
                if not stack:
                    print(f"Error: Unexpected closing tag </{tag}> at line {lno}")
                else:
                    last_tag, last_lno = stack.pop()
                    if last_tag != tag:
                        print(f"Error: Mismatched tag. Opened <{last_tag}> at line {last_lno}, but closed </{tag}> at line {lno}")
    
    for tag, lno in stack:
        print(f"Error: Unclosed tag <{tag}> opened at line {lno}")

if __name__ == "__main__":
    check_tags('src/pages/MeetTheArtistPage.tsx')
