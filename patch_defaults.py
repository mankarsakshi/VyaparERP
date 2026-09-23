with open('MyApp/src/screens/CreditNoteScreen.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

content = content.replace(\"const emptyItem = (): ProductItem => ({ product: '', hsn: '', sold: '0', returnQty: '0', rate: '0.00', disc: '0', gst: '0', amt: '0.00' });\",
\"const emptyItem = (): ProductItem => ({ product: '', hsn: '', sold: '0', returnQty: '1', rate: '0.00', disc: '0', gst: '18', amt: '0.00' });\")

content = content.replace(\"const [mReturnQty, setMReturnQty] = useState('1');\", \"const [mReturnQty, setMReturnQty] = useState('1');\") # this is already 1

content = content.replace(\"const [mGst, setMGst] = useState('0');\", \"const [mGst, setMGst] = useState('18');\")

content = content.replace(\"setMGst('0');\", \"setMGst('18');\")

with open('MyApp/src/screens/CreditNoteScreen.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
