import glob, re

for filepath in glob.glob('src/screens/*.tsx'):
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    out_lines = []
    in_stylesheet = False
    level = 0
    
    for i, line in enumerate(lines):
        stripped = line.strip()
        
        if 'StyleSheet.create({' in line and not in_stylesheet:
            in_stylesheet = True
            level = 1
            out_lines.append(line)
            continue
            
        if not in_stylesheet:
            out_lines.append(line)
            continue
            
        if stripped == '});' and level == 1:
            in_stylesheet = False
            level = 0
            out_lines.append(line)
            continue
            
        if stripped.startswith('//'):
            out_lines.append(line)
            continue
            
        if not stripped:
            out_lines.append(line)
            continue
            
        if level == 1:
            if re.match(r'^[a-zA-Z0-9_\"\'\.]+\s*:\s*\{', stripped):
                level += line.count('{') - line.count('}')
                out_lines.append(line)
            elif stripped == '});' or stripped == '}':
                level += line.count('{') - line.count('}')
                out_lines.append(line)
            else:
                out_lines.append('// ' + line)
        else:
            new_level = level + line.count('{') - line.count('}')
            if new_level < 1:
                if stripped == '});' or stripped == '})':
                    level = new_level
                    out_lines.append(line)
                else:
                    out_lines.append('// ' + line)
            else:
                level = new_level
                out_lines.append(line)
                
    with open(filepath, 'w', encoding='utf-8') as f:
        f.writelines(out_lines)
print('Fixed with robust logic!')
