def clean_file(filepath, end_line):
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    out_lines = []
    for i, line in enumerate(lines):
        if i + 1 <= end_line:
            stripped = line.strip()
            if stripped and not stripped.startswith('//'):
                out_lines.append('// ' + line)
            else:
                out_lines.append(line)
        else:
            out_lines.append(line)
            
    with open(filepath, 'w', encoding='utf-8') as f:
        f.writelines(out_lines)

clean_file('src/screens/ProductCategoryMasterScreen.tsx', 1801)
