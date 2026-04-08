import re

def find_unbalanced_tag(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Strip comments
    content = re.sub(r'\{/\*.*?\*/\}', '', content, flags=re.DOTALL)
    content = re.sub(r'//.*', '', content)
    
    # Simple tag matching
    pattern = re.compile(r'<(div|motion\.div|section|aside|main|AnimatePresence)(?![^>]*/>)[^>]*>|</(div|motion\.div|section|aside|main|AnimatePresence)>')
    
    stack = []
    for m in pattern.finditer(content):
        tag_text = m.group(0)
        line_no = content.count('\n', 0, m.start()) + 1
        
        if tag_text.startswith('</'):
            tag_name = re.match(r'</([^>]+)>', tag_text).group(1)
            if not stack:
                print(f"DEBUG: Extra closing tag </{tag_name}> at line {line_no}")
            else:
                last_tag, last_lno = stack.pop()
                if last_tag != tag_name:
                    print(f"DEBUG: Mismatch! Opened <{last_tag}> at {last_lno}, but closed </{tag_name}> at {line_no}")
                    # Recovery: assume the opening tag was what we wanted
                    # But actually we want to find WHERE the imbalance starts
        else:
            tag_name = re.match(r'<([^\s>]+)', tag_text).group(1)
            stack.append((tag_name, line_no))
            
    print(f"DEBUG: Final stack size: {len(stack)}")
    for t, l in stack:
        print(f"DEBUG: Unclosed <{t}> from line {l}")

if __name__ == "__main__":
    find_unbalanced_tag('src/pages/MeetTheArtistPage.tsx')
