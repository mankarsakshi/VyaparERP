def restore_file(filepath, start_line, end_line):
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    out_lines = []
    for i, line in enumerate(lines):
        line_num = i + 1
        if start_line <= line_num <= end_line:
            if line.startswith('// '):
                out_lines.append(line[3:])
            else:
                out_lines.append(line)
        else:
            out_lines.append(line)
            
    with open(filepath, 'w', encoding='utf-8') as f:
        f.writelines(out_lines)

restore_file('src/screens/CustomerMasterScreen.tsx', 1864, 2126)
