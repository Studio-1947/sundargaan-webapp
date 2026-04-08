import re

def trace_divs(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Strip comments
    content = re.sub(r'\{/\*.*?\*/\}', lambda m: ' ' * len(m.group(0)), content, flags=re.DOTALL)
    content = re.sub(r'//.*', lambda m: ' ' * len(m.group(0)), content)
    
    stack = []
    # Match both opening and closing tags. 
    # Handle self-closing tags first.
    tags = []
    
    # regex for all tags
    for m in re.finditer(r'<(div|motion\.div|section|aside|main|AnimatePresence|motion\.p|motion\.h1|button|span|h[1-6]|p|label|select|textarea|form|head|body|li|ul|a)|</(div|motion\.div|section|aside|main|AnimatePresence|motion\.p|motion\.h1|button|span|h[1-6]|p|label|select|textarea|form|head|body|li|ul|a)>', content):
        tag_text = m.group(0)
        line_no = content.count('\n', 0, m.start()) + 1
        
        # Check if it's self-closing
        is_self_closing = False
        if tag_text.startswith('<') and not tag_text.startswith('</'):
            tag_end = content.find('>', m.start())
            if content[tag_end-1:tag_end+1] == '/>':
                is_self_closing = True
        
        if tag_text.startswith('</'):
            tag_name = m.group(2)
            tags.append(('CLOSE', tag_name, line_no))
        elif not is_self_closing:
            tag_name = m.group(1)
            tags.append(('OPEN', tag_name, line_no))
            
    for type, tag, lno in tags:
        if type == 'OPEN':
            stack.append((tag, lno))
        else:
            if not stack:
                print(f"ERROR: Extra </{tag}> at line {lno}")
            else:
                last_tag, last_lno = stack.pop()
                if last_tag != tag:
                    print(f"ERROR: Mismatch! Opened <{last_tag}> at {last_lno}, but closed </{tag}> at {lno}")
                    # Recovery: backtrack stack to find it
                    found = False
                    for i in range(len(stack)-1, -1, -1):
                        if stack[i][0] == tag:
                            print(f"  INFO: Found matching <{tag}> at line {stack[i][1]}. Popping skipped tags.")
                            stack = stack[:i]
                            found = True
                            break
                    if not found:
                        print(f"  INFO: Could not find matching <{tag}> for closure at {lno}. Pushing <{last_tag}> back.")
                        stack.append((last_tag, last_lno))
    
    if stack:
        print("Final Unclosed Tags:")
        for t, l in stack:
            print(f"  <{t}> at line {l}")
    else:
        print("All tags balanced!")

if __name__ == "__main__":
    trace_divs('src/pages/MeetTheArtistPage.tsx')
