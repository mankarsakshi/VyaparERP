import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Platform,
  Modal,
  Alert,
} from 'react-native';
import {generatePurePDF, saveFileToDevice} from '../utils/exportHelper';
import {
  loadCreditNotes,
  deleteCreditNoteRecord,
  CreditNoteRecord,
  ProductLineItem,
} from '../utils/creditNoteStore';

type Props = {
  navigation: any;
};

const numberToWords = (num: number) => {
  const a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

  const inWords = (n: number) => {
    let numStr = n.toString();
    if (numStr.length > 9) return 'overflow';
    let nArray = ('000000000' + n).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!nArray) return '';
    let str = '';
    str += (nArray[1] !== '00') ? (a[Number(nArray[1])] || b[Number(nArray[1][0])] + ' ' + a[Number(nArray[1][1])]) + 'Crore ' : '';
    str += (nArray[2] !== '00') ? (a[Number(nArray[2])] || b[Number(nArray[2][0])] + ' ' + a[Number(nArray[2][1])]) + 'Lakh ' : '';
    str += (nArray[3] !== '00') ? (a[Number(nArray[3])] || b[Number(nArray[3][0])] + ' ' + a[Number(nArray[3][1])]) + 'Thousand ' : '';
    str += (nArray[4] !== '0') ? (a[Number(nArray[4])] || b[Number(nArray[4][0])] + ' ' + a[Number(nArray[4][1])]) + 'Hundred ' : '';
    str += (nArray[5] !== '00') ? ((str !== '') ? 'and ' : '') + (a[Number(nArray[5])] || b[Number(nArray[5][0])] + ' ' + a[Number(nArray[5][1])]) : '';
    return str.trim();
  };

  const intPart = Math.floor(num);
  const decPart = Math.round((num - intPart) * 100);

  if (intPart === 0 && decPart === 0) return 'Zero Rupees Only';

  let result = inWords(intPart) + ' Rupees';
  if (decPart > 0) {
    result += ' and ' + inWords(decPart) + ' Paise';
  }
  return result + ' Only';
};

const BackArrowIcon = () => (
  <View style={{width: 24, height: 24, justifyContent: 'center', alignItems: 'center'}}>
    <View style={{position: 'absolute', width: 14, height: 2.6, backgroundColor: '#1e293b', borderRadius: 1.3}} />
    <View
      style={{
        position: 'absolute',
        left: 4,
        width: 9,
        height: 9,
        borderLeftWidth: 2.6,
        borderTopWidth: 2.6,
        borderColor: '#1e293b',
        borderRadius: 1.2,
        transform: [{rotate: '-45deg'}],
      }}
    />
  </View>
);

const DocumentIcon = () => (
  <View style={{width: 18, height: 20, justifyContent: 'center', alignItems: 'center'}}>
    <View style={{width: 14, height: 17, borderWidth: 1.8, borderColor: '#ffffff', borderRadius: 2, padding: 2}}>
      <View style={{width: 7, height: 1.5, backgroundColor: '#ffffff', marginBottom: 2}} />
      <View style={{width: 9, height: 1.5, backgroundColor: '#ffffff', marginBottom: 2}} />
      <View style={{width: 6, height: 1.5, backgroundColor: '#ffffff'}} />
    </View>
  </View>
);

const EyeIcon = ({size = 14, color = '#6366f1'}: {size?: number; color?: string}) => (
  <View style={{width: size, height: size, alignItems: 'center', justifyContent: 'center'}}>
    <View
      style={{
        width: size * 0.85,
        height: size * 0.85,
        borderWidth: 1.5,
        borderColor: color,
        borderTopLeftRadius: size * 0.6,
        borderBottomRightRadius: size * 0.6,
        borderTopRightRadius: size * 0.1,
        borderBottomLeftRadius: size * 0.1,
        transform: [{rotate: '45deg'}],
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <View
        style={{
          width: size * 0.35,
          height: size * 0.35,
          borderRadius: size * 0.2,
          backgroundColor: color,
        }}
      />
    </View>
  </View>
);

const PencilIcon = ({size = 14, color = '#ea7e30'}: {size?: number; color?: string}) => (
  <View style={{width: size, height: size, alignItems: 'center', justifyContent: 'center'}}>
    <View
      style={{
        width: size * 0.85,
        height: size * 0.85,
        alignItems: 'center',
        justifyContent: 'center',
        transform: [{rotate: '45deg'}],
      }}>
      <View
        style={{
          width: size * 0.36,
          height: size * 0.14,
          borderWidth: 1.2,
          borderColor: color,
          borderBottomWidth: 0,
          borderTopLeftRadius: 1.5,
          borderTopRightRadius: 1.5,
          marginBottom: 0.5,
        }}
      />
      <View
        style={{
          width: size * 0.36,
          height: size * 0.44,
          borderWidth: 1.2,
          borderColor: color,
          borderBottomWidth: 0,
        }}
      />
      <View
        style={{
          width: 0,
          height: 0,
          borderLeftWidth: size * 0.18,
          borderRightWidth: size * 0.18,
          borderTopWidth: size * 0.22,
          borderLeftColor: 'transparent',
          borderRightColor: 'transparent',
          borderTopColor: color,
        }}
      />
    </View>
  </View>
);

const DustbinIcon = ({size = 14, color = '#ef4444'}: {size?: number; color?: string}) => (
  <View style={{width: size, height: size + 2, alignItems: 'center', justifyContent: 'center'}}>
    <View
      style={{
        width: size * 0.36,
        height: 1.5,
        backgroundColor: color,
        borderRadius: 1,
        marginBottom: 1,
      }}
    />
    <View
      style={{
        width: size * 0.75,
        height: size * 0.65,
        borderWidth: 1.2,
        borderColor: color,
        borderTopWidth: 0,
        borderBottomLeftRadius: 2,
        borderBottomRightRadius: 2,
        alignItems: 'center',
        justifyContent: 'space-evenly',
        flexDirection: 'row',
      }}>
      <View style={{width: 1, height: size * 0.35, backgroundColor: color}} />
      <View style={{width: 1, height: size * 0.35, backgroundColor: color}} />
    </View>
  </View>
);

const INITIAL_CREDIT_NOTES: CreditNoteRecord[] = [
  {
    id: '1',
    billNo: 'CN-001',
    billDate: '21/09/2026',
    invoiceNo: 'INV-001',
    invoiceDate: '15/09/2026',
    customerName: 'Ramesh Traders',
    phone: '9823012345',
    state: 'Maharashtra',
    city: 'Pune',
    defaultGstRate: '18%',
    taxType: 'CGST + SGST (Intra-state)',
    subtotal: 14000.00,
    discount: 700.00,
    taxableAmount: 13300.00,
    cgst: 1197.00,
    sgst: 1197.00,
    igst: 0.00,
    creditNoteTotal: 15694.00,
    adjustmentType: 'Customer Credit',
    items: [
      {
        product: 'Wireless Router 150Mbps',
        batchNo: 'BATCH-4821',
        reason: 'Sales Return',
        sold: 10,
        returnQty: 2,
        rate: 7000.00,
        disc: 5,
        gst: 18,
        hsn: '8517',
        taxableAmt: 13300.00,
        cgstAmt: 1197.00,
        sgstAmt: 1197.00,
        igstAmt: 0.00,
        totalAmt: 15694.00,
      }
    ]
  },
  {
    id: '2',
    billNo: 'CN-002',
    billDate: '22/09/2026',
    invoiceNo: 'INV-004',
    invoiceDate: '19/09/2026',
    customerName: 'Suresh Enterprises',
    phone: '9890123456',
    state: 'Maharashtra',
    city: 'Mumbai',
    defaultGstRate: '18%',
    taxType: 'CGST + SGST (Intra-state)',
    subtotal: 4000.00,
    discount: 200.00,
    taxableAmount: 3800.00,
    cgst: 342.00,
    sgst: 342.00,
    igst: 0.00,
    creditNoteTotal: 4484.00,
    adjustmentType: 'Refund',
    items: [
      {
        product: 'USB Type-C Adapter',
        batchNo: 'BATCH-1092',
        reason: 'Post Sale Discount',
        sold: 15,
        returnQty: 5,
        rate: 800.00,
        disc: 5,
        gst: 18,
        hsn: '8504',
        taxableAmt: 3800.00,
        cgstAmt: 342.00,
        sgstAmt: 342.00,
        igstAmt: 0.00,
        totalAmt: 4484.00,
      }
    ]
  },
  {
    id: '3',
    billNo: 'CN-003',
    billDate: '23/09/2026',
    invoiceNo: 'INV-005',
    invoiceDate: '20/09/2026',
    customerName: 'Vinod Hardware',
    phone: '9123456789',
    state: 'Karnataka',
    city: 'Bengaluru',
    defaultGstRate: '18%',
    taxType: 'IGST (Inter-state)',
    subtotal: 8000.00,
    discount: 400.00,
    taxableAmount: 7600.00,
    cgst: 0.00,
    sgst: 0.00,
    igst: 1368.00,
    creditNoteTotal: 8968.00,
    adjustmentType: 'Adjust Against Invoice',
    items: [
      {
        product: 'Mechanical Keyboard RGB',
        batchNo: 'BATCH-3011',
        reason: 'Deficiency in services',
        sold: 4,
        returnQty: 2,
        rate: 4000.00,
        disc: 5,
        gst: 18,
        hsn: '8471',
        taxableAmt: 7600.00,
        cgstAmt: 0.00,
        sgstAmt: 0.00,
        igstAmt: 1368.00,
        totalAmt: 8968.00,
      }
    ]
  }
];

const ITEMS_PER_PAGE = 10;

const CreditNoteHistoryScreen = ({navigation}: Props) => {
  const [notes, setNotes] = useState<CreditNoteRecord[]>(INITIAL_CREDIT_NOTES);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedNote, setSelectedNote] = useState<CreditNoteRecord | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [downloadMenuVisible, setDownloadMenuVisible] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const fetchNotes = async () => {
      const data = await loadCreditNotes();
      if (isMounted) {
        setNotes([...data]);
      }
    };
    fetchNotes();
    const unsubscribe = navigation.addListener('focus', () => {
      fetchNotes();
    });
    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [navigation]);

  const filteredNotes = notes.filter(cn => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    const firstItem = cn.items[0] || {};
    return (
      cn.billNo.toLowerCase().includes(q) ||
      cn.invoiceNo.toLowerCase().includes(q) ||
      cn.customerName.toLowerCase().includes(q) ||
      cn.phone.toLowerCase().includes(q) ||
      cn.state.toLowerCase().includes(q) ||
      cn.city.toLowerCase().includes(q) ||
      cn.adjustmentType.toLowerCase().includes(q) ||
      (firstItem.product && firstItem.product.toLowerCase().includes(q))
    );
  });

  const totalPages = Math.max(1, Math.ceil(filteredNotes.length / ITEMS_PER_PAGE));
  const safeCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (safeCurrentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, filteredNotes.length);
  const currentNotes = filteredNotes.slice(startIndex, endIndex);

  const handleDelete = (id: string, billNo: string) => {
    Alert.alert(
      'Delete Credit Note',
      `Are you sure you want to delete ${billNo}?`,
      [
        {text: 'Cancel', style: 'cancel'},
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            const updated = await deleteCreditNoteRecord(id);
            setNotes([...updated]);
          },
        },
      ],
    );
  };

  const handleExportPDF = async () => {
    try {
      setDownloadMenuVisible(false);
      const columns = [
        {title: 'CN No', width: 80},
        {title: 'Date', width: 80},
        {title: 'Customer', width: 140},
        {title: 'Product', width: 130},
        {title: 'Return Qty', width: 65, align: 'center' as const},
        {title: 'Total (Rs)', width: 80, align: 'right' as const},
      ];
      const rows = filteredNotes.map(n => [
        n.billNo,
        n.billDate,
        n.customerName,
        n.items[0]?.product || '-',
        String(n.items[0]?.returnQty || 0),
        `Rs. ${n.creditNoteTotal.toFixed(2)}`,
      ]);
      const pdfBase64 = generatePurePDF('Credit Note History Report', columns, rows);
      const filename = `CreditNote_History_${Date.now()}.pdf`;
      const filePath = await saveFileToDevice(filename, pdfBase64, 'base64');
      Alert.alert('Export Successful', `Saved report to:\n${filePath}`);
    } catch (err: any) {
      Alert.alert('Export Error', err?.message || 'Failed to export PDF');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 1. HEADER */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
          activeOpacity={0.7}
          hitSlop={{top: 12, bottom: 12, left: 12, right: 12}}>
          <BackArrowIcon />
        </TouchableOpacity>
        <View style={styles.headerTitleArea}>
          <Text style={styles.headerTitle}>Credit Note History</Text>
        </View>
      </View>

      {/* 2. SEARCH BAR & EXPORT BUTTON */}
      <View style={styles.searchRow}>
        <View style={styles.searchContainer}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Search by customer, CN no..."
            placeholderTextColor="#94a3b8"
            value={searchQuery}
            onChangeText={t => {
              setSearchQuery(t);
              setCurrentPage(1);
            }}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity
              onPress={() => {
                setSearchQuery('');
                setCurrentPage(1);
              }}
              style={styles.clearBtn}>
              <Text style={styles.clearBtnText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={styles.exportButton}
          activeOpacity={0.85}
          onPress={() => setDownloadMenuVisible(true)}>
          <DocumentIcon />
        </TouchableOpacity>
      </View>

      {/* 3. SWIPE HINT */}
      <View style={styles.swipeHintRow}>
        <Text style={styles.swipeHintText}>
          ← Horizontally Scrollable →
        </Text>
      </View>

      {/* 4. MAIN DATA TABLE CARD */}
      <View style={styles.tableCard}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.horizontalTableScroll}>
          <View>
            {/* TABLE HEADER */}
            <View style={styles.tableHeaderRow}>
              <Text style={[styles.columnHeader, styles.colIndex]}>#</Text>
              <Text style={[styles.columnHeader, styles.colBillNo]}>CN NO.</Text>
              <Text style={[styles.columnHeader, styles.colDate]}>CN DATE</Text>
              <Text style={[styles.columnHeader, styles.colInvoice]}>ORIGINAL INVOICE NO.</Text>
              <Text style={[styles.columnHeader, styles.colInvoiceDate]}>INVOICE DATE</Text>
              <Text style={[styles.columnHeader, styles.colCustomer]}>CUSTOMER NAME</Text>
              <Text style={[styles.columnHeader, styles.colPhone]}>PHONE NO.</Text>
              <Text style={[styles.columnHeader, styles.colState]}>STATE</Text>
              <Text style={[styles.columnHeader, styles.colCity]}>CITY</Text>
              <Text style={[styles.columnHeader, styles.colDefaultGst]}>DEFAULT GST</Text>
              <Text style={[styles.columnHeader, styles.colTaxType]}>TAX TYPE</Text>
              <Text style={[styles.columnHeader, styles.colProduct]}>PRODUCT NAME</Text>
              <Text style={[styles.columnHeader, styles.colBatch]}>BATCH NO.</Text>
              <Text style={[styles.columnHeader, styles.colHsn]}>HSN CODE</Text>
              <Text style={[styles.columnHeader, styles.colSold]}>SOLD QTY</Text>
              <Text style={[styles.columnHeader, styles.colReturnQty]}>RETURN QTY</Text>
              <Text style={[styles.columnHeader, styles.colRate]}>RATE (₹)</Text>
              <Text style={[styles.columnHeader, styles.colDisc]}>DISC (%)</Text>
              <Text style={[styles.columnHeader, styles.colGstRate]}>GST (%)</Text>
              <Text style={[styles.columnHeader, styles.colReason]}>REASON</Text>
              <Text style={[styles.columnHeader, styles.colItemsCount]}>ITEMS</Text>
              <Text style={[styles.columnHeader, styles.colSubtotal]}>SUBTOTAL (₹)</Text>
              <Text style={[styles.columnHeader, styles.colDiscount]}>DISCOUNT (₹)</Text>
              <Text style={[styles.columnHeader, styles.colTaxable]}>TAXABLE AMT (₹)</Text>
              <Text style={[styles.columnHeader, styles.colCGST]}>CGST (₹)</Text>
              <Text style={[styles.columnHeader, styles.colSGST]}>SGST (₹)</Text>
              <Text style={[styles.columnHeader, styles.colIGST]}>IGST (₹)</Text>
              <Text style={[styles.columnHeader, styles.colTotal]}>CREDIT NOTE TOTAL (₹)</Text>
              <Text style={[styles.columnHeader, styles.colAdjustment]}>ADJUSTMENT TYPE</Text>
              <Text style={[styles.columnHeader, styles.colActions]}>ACTIONS</Text>
            </View>

            {/* TABLE BODY */}
            {currentNotes.length === 0 ? (
              <View style={styles.emptyContainer}>
                <Text style={styles.emptyText}>No credit notes found.</Text>
              </View>
            ) : (
              currentNotes.map((item, index) => {
                const globalIdx = startIndex + index + 1;
                const pItem = item.items[0] || {
                  product: '-',
                  batchNo: '-',
                  hsn: '-',
                  sold: 0,
                  returnQty: 0,
                  rate: 0,
                  disc: 0,
                  gst: 18,
                  reason: '-',
                };
                return (
                  <TouchableOpacity
                    key={item.id}
                    activeOpacity={0.85}
                    onPress={() => {
                      setSelectedNote(item);
                      setModalVisible(true);
                    }}
                    style={[
                      styles.tableRow,
                      index === currentNotes.length - 1 && styles.tableRowLast,
                    ]}>
                    <View style={styles.colIndex}>
                      <Text style={styles.cellIndexText}>{globalIdx}</Text>
                    </View>
                    <View style={styles.colBillNo}>
                      <Text style={styles.cellBoldText}>{item.billNo}</Text>
                    </View>
                    <View style={styles.colDate}>
                      <Text style={styles.cellText}>{item.billDate}</Text>
                    </View>
                    <View style={styles.colInvoice}>
                      <Text style={styles.cellText}>{item.invoiceNo}</Text>
                    </View>
                    <View style={styles.colInvoiceDate}>
                      <Text style={styles.cellText}>{item.invoiceDate}</Text>
                    </View>
                    <View style={styles.colCustomer}>
                      <Text style={styles.cellBoldText} numberOfLines={1}>
                        {item.customerName}
                      </Text>
                    </View>
                    <View style={styles.colPhone}>
                      <Text style={styles.cellText}>{item.phone || '-'}</Text>
                    </View>
                    <View style={styles.colState}>
                      <Text style={styles.cellText}>{item.state || '-'}</Text>
                    </View>
                    <View style={styles.colCity}>
                      <Text style={styles.cellText}>{item.city || '-'}</Text>
                    </View>
                    <View style={styles.colDefaultGst}>
                      <Text style={styles.cellText}>{item.defaultGstRate || '18%'}</Text>
                    </View>
                    <View style={styles.colTaxType}>
                      <View style={styles.taxBadge}>
                        <Text style={styles.taxBadgeText}>{item.taxType}</Text>
                      </View>
                    </View>

                    {/* PRODUCT FIELDS */}
                    <View style={styles.colProduct}>
                      <Text style={styles.cellBoldText} numberOfLines={1}>
                        {pItem.product}
                      </Text>
                    </View>
                    <View style={styles.colBatch}>
                      <Text style={styles.cellText}>{pItem.batchNo || '-'}</Text>
                    </View>
                    <View style={styles.colHsn}>
                      <Text style={styles.cellText}>{pItem.hsn || '-'}</Text>
                    </View>
                    <View style={styles.colSold}>
                      <Text style={styles.cellText}>{pItem.sold ?? 0}</Text>
                    </View>
                    <View style={styles.colReturnQty}>
                      <Text style={styles.cellBoldText}>{pItem.returnQty}</Text>
                    </View>
                    <View style={styles.colRate}>
                      <Text style={styles.cellText}>₹{pItem.rate.toFixed(2)}</Text>
                    </View>
                    <View style={styles.colDisc}>
                      <Text style={styles.cellText}>{pItem.disc}%</Text>
                    </View>
                    <View style={styles.colGstRate}>
                      <Text style={styles.cellText}>{pItem.gst ?? 18}%</Text>
                    </View>
                    <View style={styles.colReason}>
                      <Text style={styles.cellText} numberOfLines={1}>
                        {pItem.reason || '-'}
                      </Text>
                    </View>

                    <View style={styles.colItemsCount}>
                      <Text style={styles.cellText}>{item.items.length} Item(s)</Text>
                    </View>
                    <View style={styles.colSubtotal}>
                      <Text style={styles.cellText}>₹{item.subtotal.toFixed(2)}</Text>
                    </View>
                    <View style={styles.colDiscount}>
                      <Text style={styles.discountCellText}>- ₹{item.discount.toFixed(2)}</Text>
                    </View>
                    <View style={styles.colTaxable}>
                      <Text style={styles.cellText}>₹{item.taxableAmount.toFixed(2)}</Text>
                    </View>
                    <View style={styles.colCGST}>
                      <Text style={styles.cellText}>₹{item.cgst.toFixed(2)}</Text>
                    </View>
                    <View style={styles.colSGST}>
                      <Text style={styles.cellText}>₹{item.sgst.toFixed(2)}</Text>
                    </View>
                    <View style={styles.colIGST}>
                      <Text style={styles.cellText}>₹{item.igst.toFixed(2)}</Text>
                    </View>
                    <View style={styles.colTotal}>
                      <Text style={styles.cellAmountText}>₹{item.creditNoteTotal.toFixed(2)}</Text>
                    </View>
                    <View style={styles.colAdjustment}>
                      <View style={styles.badgeContainer}>
                        <Text style={styles.badgeText}>{item.adjustmentType}</Text>
                      </View>
                    </View>

                    {/* ACTION BUTTONS */}
                    <View style={styles.colActions}>
                      <TouchableOpacity
                        style={styles.actionBtn}
                        onPress={() => {
                          setSelectedNote(item);
                          setModalVisible(true);
                        }}>
                        <EyeIcon />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.actionBtn}
                        onPress={() => navigation.navigate('CreditNote', {creditNote: item})}>
                        <PencilIcon />
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.actionBtn}
                        onPress={() => handleDelete(item.id, item.billNo)}>
                        <DustbinIcon />
                      </TouchableOpacity>
                    </View>
                  </TouchableOpacity>
                );
              })
            )}
          </View>
        </ScrollView>
      </View>

      {/* 5. PAGINATION CONTROLS */}
      {filteredNotes.length > 0 && (
        <View style={styles.paginationRow}>
          <Text style={styles.paginationInfo}>
            Showing {startIndex + 1}–{endIndex} of {filteredNotes.length}
          </Text>
          <View style={styles.paginationBtns}>
            <TouchableOpacity
              style={[styles.pageBtn, safeCurrentPage === 1 && styles.pageBtnDisabled]}
              disabled={safeCurrentPage === 1}
              onPress={() => setCurrentPage(prev => Math.max(1, prev - 1))}>
              <Text style={styles.pageBtnText}>◀ Prev</Text>
            </TouchableOpacity>
            <Text style={styles.pageIndicator}>
              {safeCurrentPage} / {totalPages}
            </Text>
            <TouchableOpacity
              style={[styles.pageBtn, safeCurrentPage === totalPages && styles.pageBtnDisabled]}
              disabled={safeCurrentPage === totalPages}
              onPress={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}>
              <Text style={styles.pageBtnText}>Next ▶</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* 6. FLOATING ADD CREDIT NOTE BUTTON */}
      <TouchableOpacity
        style={styles.floatingAddButton}
        activeOpacity={0.85}
        onPress={() => navigation.navigate('CreditNote')}>
        <View style={styles.addIconH} />
        <View style={styles.addIconV} />
      </TouchableOpacity>

      {/* 7. VIEW DETAILS / GRAPHIC BILL MODAL */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.billGraphicOverlay}>
          <View style={styles.billGraphicContainer}>
            {selectedNote && (
              <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.billGraphicScroll}>
                {/* 1. HEADER ROW */}
                <View style={styles.billGraphicHeaderRow}>
                  <View style={styles.billGraphicLogoCircle}>
                    <Text style={{fontSize: 28, color: '#ea7e30'}}>🛒</Text>
                  </View>
                  <View style={styles.billGraphicHeaderText}>
                    <Text style={styles.billGraphicLogoText}>YOUR LOGO</Text>
                    <Text style={styles.billGraphicBusinessName}>BUSINESS NAME</Text>
                    <Text style={styles.billGraphicBusinessSub}>Address | Phone | GSTIN</Text>
                  </View>
                </View>

                {/* 2. CREDIT NOTE BANNER */}
                <View style={styles.billGraphicBanner}>
                  <Text style={styles.billGraphicBannerText}>CREDIT NOTE</Text>
                </View>

                {/* 3. INVOICE META ROW */}
                <View style={styles.billGraphicMetaRow}>
                  <View style={{flexDirection: 'row'}}>
                    <Text style={styles.billGraphicMetaLabel}>Invoice No: </Text>
                    <Text style={styles.billGraphicMetaValue}>{selectedNote.billNo}</Text>
                  </View>
                  <View style={{flexDirection: 'row'}}>
                    <Text style={styles.billGraphicMetaLabel}>Date: </Text>
                    <Text style={styles.billGraphicMetaValue}>{selectedNote.billDate}</Text>
                  </View>
                </View>

                {!!selectedNote.invoiceNo && (
                  <View style={[styles.billGraphicMetaRow, {marginTop: -10}]}>
                    <View style={{flexDirection: 'row'}}>
                      <Text style={styles.billGraphicMetaLabel}>Original Invoice: </Text>
                      <Text style={styles.billGraphicMetaValue}>{selectedNote.invoiceNo}</Text>
                    </View>
                    <View style={{flexDirection: 'row'}}>
                      <Text style={styles.billGraphicMetaLabel}>Invoice Date: </Text>
                      <Text style={styles.billGraphicMetaValue}>{selectedNote.invoiceDate}</Text>
                    </View>
                  </View>
                )}

                {/* 4. CUSTOMER BOX */}
                <View style={styles.billGraphicCustomerBox}>
                  <Text style={styles.billGraphicCustomerHeader}>Customer:</Text>
                  <View style={styles.billGraphicCustomerDetails}>
                    <Text style={styles.billGraphicCustomerValue}>{selectedNote.customerName}</Text>
                    {!!selectedNote.phone && (
                      <View style={styles.billGraphicCustomerRow}>
                        <Text style={styles.billGraphicCustomerRowLabel}>Phone: </Text>
                        <Text style={styles.billGraphicCustomerRowValue}>{selectedNote.phone}</Text>
                      </View>
                    )}
                    {(!!selectedNote.city || !!selectedNote.state) && (
                      <View style={styles.billGraphicCustomerRow}>
                        <Text style={styles.billGraphicCustomerRowLabel}>Address: </Text>
                        <Text style={styles.billGraphicCustomerRowValue}>
                          {[selectedNote.city, selectedNote.state].filter(Boolean).join(', ')}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>

                {/* 5. PRODUCT TABLE */}
                <View style={styles.billGraphicTable}>
                  <View style={styles.billGraphicTableHeader}>
                    <Text style={[styles.billGraphicTableColHeader, {flex: 0.5, borderLeftWidth: 0}]}>#</Text>
                    <Text style={[styles.billGraphicTableColHeader, {flex: 2}]}>Product</Text>
                    <Text style={[styles.billGraphicTableColHeader, {flex: 1}]}>HSN</Text>
                    <Text style={[styles.billGraphicTableColHeader, {flex: 0.9}]}>Qty</Text>
                    <Text style={[styles.billGraphicTableColHeader, {flex: 1.2}]}>Rate</Text>
                    <Text style={[styles.billGraphicTableColHeader, {flex: 1}]}>Disc</Text>
                    <Text style={[styles.billGraphicTableColHeader, {flex: 1}]}>GST</Text>
                    <Text style={[styles.billGraphicTableColHeader, {flex: 1.5}]}>Amount</Text>
                  </View>

                  {selectedNote.items.map((prod, idx) => {
                    const itemTotal = prod.totalAmt || (prod.taxableAmt ? prod.taxableAmt + prod.cgstAmt + prod.sgstAmt + prod.igstAmt : prod.rate * prod.returnQty);
                    return (
                      <View key={idx} style={styles.billGraphicTableRow}>
                        <Text style={[styles.billGraphicTableCol, {flex: 0.5, borderLeftWidth: 0}]}>{idx + 1}</Text>
                        <Text style={[styles.billGraphicTableCol, {flex: 2}]} numberOfLines={2}>{prod.product}</Text>
                        <Text style={[styles.billGraphicTableCol, {flex: 1}]} numberOfLines={1}>{prod.hsn || '-'}</Text>
                        <Text style={[styles.billGraphicTableCol, {flex: 0.9}]}>{prod.returnQty}</Text>
                        <Text style={[styles.billGraphicTableCol, {flex: 1.2}]}>{prod.rate.toFixed(2)}</Text>
                        <Text style={[styles.billGraphicTableCol, {flex: 1}]}>{prod.disc ? `${prod.disc}%` : '0%'}</Text>
                        <Text style={[styles.billGraphicTableCol, {flex: 1}]}>{prod.gst ? `${prod.gst}%` : '0%'}</Text>
                        <Text style={[styles.billGraphicTableCol, {flex: 1.5, textAlign: 'right', paddingRight: 6}]}>
                          {itemTotal.toFixed(2)}
                        </Text>
                      </View>
                    );
                  })}
                </View>

                {/* 5.5 TOTALS TABLE */}
                <View style={styles.billGraphicTable}>
                  <View style={styles.billGraphicTableHeader}>
                    <Text style={[styles.billGraphicTableColHeader, {flex: 1, borderLeftWidth: 0}]}>Subtotal</Text>
                    <Text style={[styles.billGraphicTableColHeader, {flex: 1}]}>Discount</Text>
                    <Text style={[styles.billGraphicTableColHeader, {flex: 1.2}]}>Taxable</Text>
                    {selectedNote.cgst > 0 && <Text style={[styles.billGraphicTableColHeader, {flex: 1}]}>CGST</Text>}
                    {selectedNote.sgst > 0 && <Text style={[styles.billGraphicTableColHeader, {flex: 1}]}>SGST</Text>}
                    {selectedNote.igst > 0 && <Text style={[styles.billGraphicTableColHeader, {flex: 1}]}>IGST</Text>}
                    <Text style={[styles.billGraphicTableColHeader, {flex: 1.2}]}>Total</Text>
                  </View>
                  <View style={[styles.billGraphicTableRow, {borderBottomWidth: 0}]}>
                    <Text style={[styles.billGraphicTableCol, {flex: 1, borderLeftWidth: 0}]}>₹{selectedNote.subtotal.toFixed(2)}</Text>
                    <Text style={[styles.billGraphicTableCol, {flex: 1}]}>₹{selectedNote.discount.toFixed(2)}</Text>
                    <Text style={[styles.billGraphicTableCol, {flex: 1.2}]}>₹{selectedNote.taxableAmount.toFixed(2)}</Text>
                    {selectedNote.cgst > 0 && <Text style={[styles.billGraphicTableCol, {flex: 1}]}>₹{selectedNote.cgst.toFixed(2)}</Text>}
                    {selectedNote.sgst > 0 && <Text style={[styles.billGraphicTableCol, {flex: 1}]}>₹{selectedNote.sgst.toFixed(2)}</Text>}
                    {selectedNote.igst > 0 && <Text style={[styles.billGraphicTableCol, {flex: 1}]}>₹{selectedNote.igst.toFixed(2)}</Text>}
                    <Text style={[styles.billGraphicTableCol, {flex: 1.2, fontWeight: 'bold', color: '#ea7e30'}]}>₹{selectedNote.creditNoteTotal.toFixed(2)}</Text>
                  </View>
                </View>

                {/* 6. PAYMENT / ADJUSTMENT INFO */}
                <View style={styles.billGraphicPaymentWrapper}>
                  <View style={styles.billGraphicPaymentBox}>
                    <Text style={styles.billGraphicPaymentLabel}>Adjustment Type:</Text>
                    <Text style={styles.billGraphicPaymentValue}>{selectedNote.adjustmentType}</Text>
                  </View>
                  <View style={styles.billGraphicPaymentBox}>
                    <Text style={styles.billGraphicPaymentLabel}>Tax Type:</Text>
                    <Text style={styles.billGraphicPaymentValue}>{selectedNote.taxType}</Text>
                  </View>
                </View>

                {/* 7. AMOUNT IN WORDS */}
                <View style={styles.billGraphicWordsBox}>
                  <Text style={styles.billGraphicWordsLabel}>Amount in Words:</Text>
                  <Text style={styles.billGraphicWordsValue}>{numberToWords(selectedNote.creditNoteTotal)}</Text>
                </View>

                {/* 8. FOOTER */}
                <View style={styles.billGraphicFooter}>
                  <View style={styles.billGraphicFooterLine} />
                  <Text style={styles.billGraphicFooterText}>Thank You For Your Business</Text>
                  <View style={styles.billGraphicFooterLine} />
                </View>
              </ScrollView>
            )}

            <TouchableOpacity
              style={styles.billGraphicCloseBtn}
              onPress={() => setModalVisible(false)}>
              <Text style={styles.billGraphicCloseBtnText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* 8. DOWNLOAD/EXPORT REPORT MODAL */}
      <Modal visible={downloadMenuVisible} transparent animationType="fade" onRequestClose={() => setDownloadMenuVisible(false)}>
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setDownloadMenuVisible(false)}>
          <View style={styles.exportMenuCard}>
            <Text style={styles.exportMenuTitle}>Export Credit Note History</Text>
            <TouchableOpacity style={styles.exportOptionBtn} onPress={handleExportPDF}>
              <Text style={styles.exportOptionIcon}>📄</Text>
              <Text style={styles.exportOptionText}>Export as PDF Report</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.exportOptionBtn} onPress={handleExportPDF}>
              <Text style={styles.exportOptionIcon}>📊</Text>
              <Text style={styles.exportOptionText}>Export Data Table</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

export default CreditNoteHistoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: Platform.OS === 'android' ? 28 : 22,
    paddingBottom: 14,
    backgroundColor: '#f8fafc',
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    borderWidth: 1.5,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 3,
  },
  headerTitleArea: {
    flex: 1,
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0f172a',
    letterSpacing: -0.2,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 8,
    gap: 10,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
  },
  searchIcon: {
    fontSize: 14,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#0f172a',
  },
  clearBtn: {
    padding: 4,
  },
  clearBtnText: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '700',
  },
  exportButton: {
    width: 44,
    height: 44,
    backgroundColor: '#ea7e30',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#ea7e30',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  swipeHintRow: {
    paddingHorizontal: 16,
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  swipeHintText: {
    fontSize: 12,
    color: '#94a3b8',
    fontWeight: '500',
  },
  tableCard: {
    flex: 1,
    marginHorizontal: 16,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.05,
    shadowRadius: 8,
    marginBottom: 10,
  },
  horizontalTableScroll: {
    paddingBottom: 4,
  },
  tableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#fff7ed',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#fed7aa',
    alignItems: 'center',
  },
  columnHeader: {
    fontSize: 12,
    fontWeight: '700',
    color: '#c2410c',
    paddingHorizontal: 8,
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  colIndex: {width: 44, textAlign: 'center'},
  colBillNo: {width: 100},
  colDate: {width: 100},
  colInvoice: {width: 140},
  colInvoiceDate: {width: 110},
  colCustomer: {width: 150},
  colPhone: {width: 110},
  colState: {width: 110},
  colCity: {width: 100},
  colDefaultGst: {width: 100},
  colTaxType: {width: 160},
  colProduct: {width: 150},
  colBatch: {width: 110},
  colHsn: {width: 90},
  colSold: {width: 80, textAlign: 'center'},
  colReturnQty: {width: 90, textAlign: 'center'},
  colRate: {width: 100, textAlign: 'right'},
  colDisc: {width: 80, textAlign: 'right'},
  colGstRate: {width: 80, textAlign: 'right'},
  colReason: {width: 140},
  colItemsCount: {width: 80, textAlign: 'center'},
  colSubtotal: {width: 110, textAlign: 'right'},
  colDiscount: {width: 100, textAlign: 'right'},
  colTaxable: {width: 120, textAlign: 'right'},
  colCGST: {width: 90, textAlign: 'right'},
  colSGST: {width: 90, textAlign: 'right'},
  colIGST: {width: 90, textAlign: 'right'},
  colTotal: {width: 140, textAlign: 'right'},
  colAdjustment: {width: 160},
  colActions: {
    width: 110,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  tableRowLast: {
    borderBottomWidth: 0,
  },
  cellIndexText: {
    fontSize: 14,
    color: '#475569',
    textAlign: 'center',
    fontWeight: '500',
  },
  cellBoldText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1e293b',
    paddingHorizontal: 8,
  },
  cellText: {
    fontSize: 13,
    color: '#475569',
    paddingHorizontal: 8,
    fontWeight: '500',
  },
  discountCellText: {
    fontSize: 13,
    color: '#22c55e',
    fontWeight: '700',
    paddingHorizontal: 8,
    textAlign: 'right',
  },
  taxBadge: {
    backgroundColor: '#fff7ed',
    borderWidth: 1,
    borderColor: '#fed7aa',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: 'flex-start',
    marginLeft: 8,
  },
  taxBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#c2410c',
  },
  badgeContainer: {
    backgroundColor: '#f1f5f9',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: 'flex-start',
    marginLeft: 8,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  cellAmountText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#ea7e30',
    textAlign: 'right',
    paddingHorizontal: 8,
  },
  actionBtn: {
    padding: 4,
    marginHorizontal: 3,
  },
  emptyContainer: {
    padding: 40,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#94a3b8',
    fontWeight: '600',
  },
  paginationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 20,
  },
  paginationInfo: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '600',
  },
  paginationBtns: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  pageBtn: {
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  pageBtnDisabled: {
    opacity: 0.4,
  },
  pageBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#334155',
  },
  pageIndicator: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0f172a',
  },
  floatingAddButton: {
    position: 'absolute',
    right: 20,
    bottom: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#ea7e30',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    shadowColor: '#ea7e30',
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.35,
    shadowRadius: 8,
  },
  addIconH: {
    position: 'absolute',
    width: 20,
    height: 3,
    backgroundColor: '#ffffff',
    borderRadius: 1.5,
  },
  addIconV: {
    position: 'absolute',
    width: 3,
    height: 20,
    backgroundColor: '#ffffff',
    borderRadius: 1.5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  exportMenuCard: {
    backgroundColor: '#ffffff',
    borderRadius: 16,
    padding: 20,
    width: 280,
    elevation: 8,
  },
  exportMenuTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: '#0f172a',
    marginBottom: 14,
    textAlign: 'center',
  },
  exportOptionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 10,
  },
  exportOptionIcon: {
    fontSize: 18,
    marginRight: 10,
  },
  exportOptionText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1e293b',
  },

  // GRAPHIC BILL PREVIEW MODAL STYLES
  billGraphicOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  billGraphicContainer: {
    width: '100%',
    maxWidth: 540,
    backgroundColor: '#fff',
    borderRadius: 8,
    maxHeight: '92%',
    borderWidth: 1.5,
    borderColor: '#475569',
    overflow: 'hidden',
  },
  billGraphicScroll: {
    padding: 16,
    paddingBottom: 24,
  },
  billGraphicHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  billGraphicLogoCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 3,
    borderColor: '#ea7e30',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  billGraphicHeaderText: {
    flex: 1,
  },
  billGraphicLogoText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#ea7e30',
  },
  billGraphicBusinessName: {
    fontSize: 22,
    fontWeight: '900',
    color: '#0f172a',
    marginTop: -2,
  },
  billGraphicBusinessSub: {
    fontSize: 12,
    color: '#475569',
  },
  billGraphicBanner: {
    backgroundColor: '#ea7e30',
    paddingVertical: 8,
    alignItems: 'center',
    marginBottom: 16,
  },
  billGraphicBannerText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  billGraphicMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  billGraphicMetaLabel: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  billGraphicMetaValue: {
    fontSize: 13,
    color: '#334155',
  },
  billGraphicCustomerBox: {
    backgroundColor: '#f1f5f9',
    borderRadius: 6,
    padding: 12,
    marginBottom: 16,
  },
  billGraphicCustomerHeader: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 6,
  },
  billGraphicCustomerDetails: {
    paddingLeft: 2,
  },
  billGraphicCustomerValue: {
    fontSize: 13,
    color: '#334155',
    marginBottom: 4,
    fontWeight: '600',
  },
  billGraphicCustomerRow: {
    flexDirection: 'row',
    marginBottom: 2,
  },
  billGraphicCustomerRowLabel: {
    fontSize: 13,
    color: '#334155',
    width: 65,
  },
  billGraphicCustomerRowValue: {
    fontSize: 13,
    color: '#334155',
    flex: 1,
  },
  billGraphicTable: {
    borderWidth: 1,
    borderColor: '#e2e8f0',
    marginBottom: 16,
  },
  billGraphicTableHeader: {
    flexDirection: 'row',
    backgroundColor: '#ea7e30',
  },
  billGraphicTableColHeader: {
    color: '#fff',
    fontSize: 11,
    fontWeight: 'bold',
    paddingVertical: 8,
    paddingHorizontal: 4,
    textAlign: 'center',
    borderLeftWidth: 1,
    borderLeftColor: '#fbd38d',
  },
  billGraphicTableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  billGraphicTableCol: {
    fontSize: 11,
    color: '#334155',
    paddingVertical: 8,
    paddingHorizontal: 4,
    textAlign: 'center',
    borderLeftWidth: 1,
    borderLeftColor: '#e2e8f0',
  },
  billGraphicPaymentWrapper: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  billGraphicPaymentBox: {
    backgroundColor: '#f1f5f9',
    padding: 12,
    borderRadius: 6,
    flex: 0.48,
  },
  billGraphicPaymentLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 4,
  },
  billGraphicPaymentValue: {
    fontSize: 13,
    color: '#334155',
  },
  billGraphicWordsBox: {
    backgroundColor: '#f1f5f9',
    padding: 12,
    borderRadius: 6,
    marginBottom: 20,
  },
  billGraphicWordsLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#0f172a',
    marginBottom: 4,
  },
  billGraphicWordsValue: {
    fontSize: 13,
    color: '#334155',
  },
  billGraphicFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  billGraphicFooterLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#ea7e30',
  },
  billGraphicFooterText: {
    marginHorizontal: 12,
    fontSize: 13,
    fontStyle: 'italic',
    color: '#0f172a',
  },
  billGraphicCloseBtn: {
    backgroundColor: '#ea7e30',
    paddingVertical: 14,
    alignItems: 'center',
  },
  billGraphicCloseBtnText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});
