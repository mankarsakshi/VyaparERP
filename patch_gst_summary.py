with open('MyApp/src/screens/CreditNoteScreen.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

old_calc = '''  const calculateSummary = () => {
    let subtotal = 0;
    let discount = 0;
    let taxableAmount = 0;
    let totalGstAmount = 0;
    
    items.forEach(item => {
      if (item.product.trim()) {
        const qty = Number(item.returnQty) || 0;
        const rate = Number(item.rate) || 0;
        const discPercent = Number(item.disc) || 0;
        const gstPercent = Number(item.gst) || 0;

        const itemSub = qty * rate;
        const itemDisc = (itemSub * discPercent) / 100;
        const itemTax = itemSub - itemDisc;
        const itemGst = (itemTax * gstPercent) / 100;

        subtotal += itemSub;
        discount += itemDisc;
        taxableAmount += itemTax;
        totalGstAmount += itemGst;
      }
    });

    const isInterState = state.trim() !== '' && state.trim().toLowerCase() !== 'maharashtra';
    
    const cgst = isInterState ? 0 : totalGstAmount / 2;
    const sgst = isInterState ? 0 : totalGstAmount / 2;
    const igst = isInterState ? totalGstAmount : 0;
    
    const totalCreditAmount = Math.round(taxableAmount + totalGstAmount);

    return {
      subtotal: subtotal.toFixed(2),
      discount: discount.toFixed(2),
      taxableAmount: taxableAmount.toFixed(2),
      cgst: cgst.toFixed(2),
      sgst: sgst.toFixed(2),
      igst: igst.toFixed(2),
      totalCreditAmount: totalCreditAmount.toFixed(2),
    };
  };'''

new_calc = '''  const calculateSummary = () => {
    let subtotal = 0;
    let discount = 0;
    let taxableAmount = 0;
    let totalGstAmount = 0;
    
    const gstMap: Record<string, { taxable: number; gstAmt: number }> = {};
    
    items.forEach(item => {
      if (item.product.trim()) {
        const qty = Number(item.returnQty) || 0;
        const rate = Number(item.rate) || 0;
        const discPercent = Number(item.disc) || 0;
        const gstStr = item.gst || '0';
        const gstPercent = Number(gstStr.replace('%', '')) || 0;

        const itemSub = qty * rate;
        const itemDisc = (itemSub * discPercent) / 100;
        const itemTax = itemSub - itemDisc;
        const itemGst = (itemTax * gstPercent) / 100;

        subtotal += itemSub;
        discount += itemDisc;
        taxableAmount += itemTax;
        totalGstAmount += itemGst;

        if (!gstMap[gstPercent]) {
          gstMap[gstPercent] = { taxable: 0, gstAmt: 0 };
        }
        gstMap[gstPercent].taxable += itemTax;
        gstMap[gstPercent].gstAmt += itemGst;
      }
    });

    const isInterState = state.trim() !== '' && state.trim().toLowerCase() !== 'maharashtra';
    
    const cgst = isInterState ? 0 : totalGstAmount / 2;
    const sgst = isInterState ? 0 : totalGstAmount / 2;
    const igst = isInterState ? totalGstAmount : 0;
    
    const totalCreditAmount = Math.round(taxableAmount + totalGstAmount);

    const breakdown = Object.keys(gstMap).map(rate => {
      const gVal = Number(rate);
      const taxVal = gstMap[rate].taxable;
      const gstVal = gstMap[rate].gstAmt;
      const cAmt = isInterState ? 0 : gstVal / 2;
      const sAmt = isInterState ? 0 : gstVal / 2;
      const iAmt = isInterState ? gstVal : 0;
      return {
        rate: gVal,
        taxable: taxVal,
        cgst: cAmt,
        sgst: sAmt,
        igst: iAmt
      };
    }).filter(b => b.taxable > 0);

    return {
      subtotal: subtotal.toFixed(2),
      discount: discount.toFixed(2),
      taxableAmount: taxableAmount.toFixed(2),
      cgst: cgst.toFixed(2),
      sgst: sgst.toFixed(2),
      igst: igst.toFixed(2),
      totalCreditAmount: totalCreditAmount.toFixed(2),
      breakdown
    };
  };'''

content = content.replace(old_calc, new_calc)

old_ui = '''          {/* ADJUSTMENT */}'''
new_ui = '''          {/* GST BREAKDOWN SUMMARY */}
          <View style={styles.formCard}>
            <Text style={styles.cardHeaderTitle}>GST Breakdown Summary</Text>
            
            <View style={{borderWidth: 1, borderColor: '#e2e8f0', borderRadius: 12, overflow: 'hidden'}}>
              <View style={{flexDirection: 'row', backgroundColor: '#fff7ed', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#fed7aa'}}>
                <Text style={{flex: 1, fontSize: 11, fontWeight: '800', color: '#c2410c', textAlign: 'center'}}>GST RATE</Text>
                <Text style={{flex: 1.5, fontSize: 11, fontWeight: '800', color: '#c2410c', textAlign: 'center'}}>TAXABLE AMOUNT</Text>
                <Text style={{flex: 1, fontSize: 11, fontWeight: '800', color: '#c2410c', textAlign: 'center'}}>CGST</Text>
                <Text style={{flex: 1, fontSize: 11, fontWeight: '800', color: '#c2410c', textAlign: 'center'}}>SGST</Text>
                <Text style={{flex: 1, fontSize: 11, fontWeight: '800', color: '#c2410c', textAlign: 'center'}}>IGST</Text>
              </View>

              {summary.breakdown.length === 0 ? (
                <View style={{paddingVertical: 24, alignItems: 'center'}}>
                  <Text style={{color: '#94a3b8', fontSize: 14, fontWeight: '600'}}>No GST applicable</Text>
                </View>
              ) : (
                summary.breakdown.map((b, i) => (
                  <View key={i} style={{flexDirection: 'row', paddingVertical: 14, borderBottomWidth: i === summary.breakdown.length - 1 ? 0 : 1, borderBottomColor: '#f1f5f9'}}>
                    <Text style={{flex: 1, fontSize: 12, color: '#1e293b', textAlign: 'center', fontWeight: '600'}}>{b.rate}%</Text>
                    <Text style={{flex: 1.5, fontSize: 12, color: '#1e293b', textAlign: 'center', fontWeight: '500'}}>\u20B9{b.taxable.toFixed(2)}</Text>
                    <Text style={{flex: 1, fontSize: 12, color: '#1e293b', textAlign: 'center', fontWeight: '500'}}>\u20B9{b.cgst.toFixed(2)}</Text>
                    <Text style={{flex: 1, fontSize: 12, color: '#1e293b', textAlign: 'center', fontWeight: '500'}}>\u20B9{b.sgst.toFixed(2)}</Text>
                    <Text style={{flex: 1, fontSize: 12, color: '#1e293b', textAlign: 'center', fontWeight: '500'}}>\u20B9{b.igst.toFixed(2)}</Text>
                  </View>
                ))
              )}
            </View>
          </View>

          {/* ADJUSTMENT */}'''

content = content.replace(old_ui, new_ui)

with open('MyApp/src/screens/CreditNoteScreen.tsx', 'w', encoding='utf-8') as f:
    f.write(content)
print("Added GST summary")
