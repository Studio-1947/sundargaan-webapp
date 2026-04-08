import re

def analyze_jsx(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Strip comments to avoid false matches
    content = re.sub(r'\{/\*.*?\*/\}', '', content, flags=re.DOTALL)
    content = re.sub(r'//.*', '', content)
    
    tags = []
    # Match opening tags that are not self-closing
    # Using a negative lookahead for /> at the end of the tag
    open_regex = re.compile(r'<(div|motion\.div|section|aside|main|AnimatePresence|ul|li|form|button|span|h[1-6]|p|label|select|textarea)(?![^>]*/>)[^>]*>')
    close_regex = re.compile(r'</(div|motion\.div|section|aside|main|AnimatePresence|ul|li|form|button|span|h[1-6]|p|label|select|textarea)>')
    
    for m in open_regex.finditer(content):
        line_no = content.count('\n', 0, m.start()) + 1
        tags.append(('OPEN', m.group(1), line_no, m.start()))
        
    for m in close_regex.finditer(content):
        line_no = content.count('\n', 0, m.start()) + 1
        tags.append(('CLOSE', m.group(1), line_no, m.start()))
        
    # Sort by position in file
    tags.sort(key=lambda x: x[3])
    
    stack = []
    for type, tag, lno, pos in tags:
        if type == 'OPEN':
            stack.append((tag, lno))
        else:
            if not stack:
                print(f"ERROR: Unexpected closure </{tag}> at line {lno}")
            else:
                last_tag, last_lno = stack.pop()
                if last_tag != tag:
                    print(f"ERROR: Mismatched tag! Opened <{last_tag}> at {last_lno}, but closed </{tag}> at {lno}")
                    # Push it back to try to recover? No, just keep going
                    
    for tag, lno in stack:
        print(f"ERROR: Unclosed <{tag}> opened at line {lno}")

if __name__ == "__main__":
    analyze_jsx('src/pages/MeetTheArtistPage.tsx')
