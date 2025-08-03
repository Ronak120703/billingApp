import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useThemeColor } from '@/hooks/useThemeColor';
import DateTimePicker from '@react-native-community/datetimepicker';
import * as Print from 'expo-print';
import * as Sharing from 'expo-sharing';
import React, { useEffect, useState } from 'react';
import { Alert, Platform, ScrollView, StyleSheet, TextInput, TouchableOpacity, View } from 'react-native';

interface InvoiceFormData {
  customerName: string;
  customerPhone: string;
  invoiceNumber: string;
  date: string;
  wheatWeightKg: string;
  wheatWeightMaund: string;
  cutPieces: string;
  number2: string;
  number5: string;
  totalWeightKg: string;
  totalWeightMaund: string;
  bagQuantity: string;
  pricePerKg: string;
  bagAmount: string;
  totalBagPrice: string;
  totalAmount: string;
}

export default function CreateInvoiceScreen() {
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [selectedDate, setSelectedDate] = useState(new Date());

  const [formData, setFormData] = useState<InvoiceFormData>({
    customerName: '',
    customerPhone: '',
    invoiceNumber: 'INV-001',
    date: new Date().toLocaleDateString('en-GB'),
    wheatWeightKg: '',
    wheatWeightMaund: '',
    cutPieces: '',
    number2: '',
    number5: '',
    totalWeightKg: '0',
    totalWeightMaund: '૦ મણ',
    bagQuantity: '',
    pricePerKg: '',
    bagAmount: '',
    totalBagPrice: '',
    totalAmount: '',
  });

  const updateFormData = (field: keyof InvoiceFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Convert kg to maund (1 maund = 20 kg)
  const kgToMaund = (kg: number): number => {
    return kg / 20;
  };

  // Convert maund to kg
  const maundToKg = (maund: number): number => {
    return maund * 20;
  };

  // Convert number to Gujarati numerals
  const toGujaratiNumerals = (num: number): string => {
    const gujaratiNumerals = ['૦', '૧', '૨', '૩', '૪', '૫', '૬', '૭', '૮', '૯'];
    return num.toString().split('').map(digit => gujaratiNumerals[parseInt(digit)]).join('');
  };

  // Convert kg to Gujarati maund format
  const kgToGujaratiMaund = (kg: number): string => {
    if (kg === 0) return '૦ મણ';
    
    const maund = Math.floor(kg / 20);
    const remainingKg = kg % 20;
    
    let result = '';
    
    if (maund > 0) {
      result += toGujaratiNumerals(maund) + ' મણ';
    }
    
    if (remainingKg > 0) {
      if (result) result += ' ';
      result += toGujaratiNumerals(remainingKg) + ' કિલો';
    }
    
    return result || '૦ મણ';
  };

  const calculateTotalBagPrice = () => {
    const bagQty = parseFloat(formData.bagQuantity) || 0;
    const bagAmount = parseFloat(formData.bagAmount) || 0;
    const totalBagPrice = bagQty * bagAmount;
    updateFormData('totalBagPrice', totalBagPrice.toString());
    return totalBagPrice;
  };

  const calculateTotal = () => {
    const totalWeightKg = parseFloat(formData.totalWeightKg) || 0;
    const pricePerKg = parseFloat(formData.pricePerKg) || 0;
    const bagQty = parseFloat(formData.bagQuantity) || 0;
    const bagAmount = parseFloat(formData.bagAmount) || 0;
    const totalBagPrice = bagQty * bagAmount;
    const totalKgPrice = totalWeightKg * pricePerKg;
    updateFormData('totalBagPrice', totalBagPrice.toString());
    const total = totalKgPrice + totalBagPrice;
    updateFormData('totalAmount', total.toString());
  };

  const calculateTotalWeight = () => {
    const wheatKg = parseFloat(formData.wheatWeightKg) || 0;
    const cutPieces = parseFloat(formData.cutPieces) || 0;
    const number2 = parseFloat(formData.number2) || 0;
    const number5 = parseFloat(formData.number5) || 0;
    
    // Combine 2 number and 5 number into one total
    const number2Plus5 = number2 + number5;
    
    // Sum all weights in kg
    const totalKg = wheatKg + cutPieces + number2Plus5;
    const totalGujaratiMaund = kgToGujaratiMaund(totalKg);
    
    setFormData(prev => ({
      ...prev,
      totalWeightKg: totalKg.toString(),
      totalWeightMaund: totalGujaratiMaund
    }));
  };

  const handleWheatWeightChange = (value: string) => {
    updateFormData('wheatWeightKg', value);
    const kg = parseFloat(value) || 0;
    const gujaratiMaund = kgToGujaratiMaund(kg);
    updateFormData('wheatWeightMaund', gujaratiMaund);
    calculateTotalWeight();
  };

  const handleSave = () => {
    if (!formData.customerName || !formData.invoiceNumber) {
      Alert.alert('Error', 'Please fill in customer name and invoice number');
      return;
    }
    Alert.alert('Success', 'Invoice saved successfully!');
  };

  const handleDownload = async () => {
    // Generate a professional HTML invoice
    const html = `
      <html>
        <head>
          <meta charset="utf-8" />
          <style>
            body { font-family: Arial, sans-serif; background: #f6f8fa; }
            .invoice-box {
              max-width: 700px;
              margin: 32px auto;
              padding: 32px 24px;
              border: 1.5px solid #eee;
              background: #fff;
              border-radius: 12px;
              box-shadow: 0 2px 8px rgba(0,0,0,0.04);
            }
            .heading {
              text-align: center;
              font-size: 32px;
              font-weight: bold;
              color: #0a7ea4;
              margin-bottom: 32px;
            }
            .section-title { font-size: 18px; font-weight: bold; color: #0a7ea4; margin: 24px 0 12px 0; border-bottom: 1px solid #eee; padding-bottom: 4px; }
            .row { display: flex; justify-content: space-between; margin-bottom: 8px; }
            .label { font-weight: bold; color: #333; }
            .value { color: #222; }
            .table { width: 100%; border-collapse: collapse; margin: 12px 0 24px 0; }
            .table th, .table td { border: 1px solid #e0e0e0; padding: 8px 12px; text-align: left; }
            .table th { background: #f0f4f8; font-weight: bold; }
            .amount-row { background: #f9fafb; }
            .total-label { font-size: 20px; font-weight: bold; color: #0a7ea4; }
            .total-value { font-size: 22px; font-weight: bold; color: #0a7ea4; }
            .footer { margin-top: 40px; text-align: right; color: #888; font-size: 14px; }
            .signature { margin-top: 48px; text-align: right; font-size: 16px; color: #333; }
          </style>
        </head>
        <body>
          <div class="invoice-box">
            <div class="heading">પ્રાઇમ એગ્રો ઇન્ડસ્ટ્રીઝ</div>
            <div class="section-title">ઇન્વોઇસ વિગતો</div>
            <div class="row"><div><span class="label">ઇન્વોઇસ નંબર:</span> <span class="value">${formData.invoiceNumber}</span></div><div><span class="label">તારીખ:</span> <span class="value">${formData.date}</span></div></div>
            <div class="section-title">ગ્રાહક વિગતો</div>
            <div class="row"><div><span class="label">ગ્રાહકનું નામ:</span> <span class="value">${formData.customerName}</span></div></div>
            <div class="row"><div><span class="label">ફોન નંબર:</span> <span class="value">${formData.customerPhone}</span></div></div>
            <div class="section-title">ઉત્પાદન અને બેગ વિગતો</div>
            <table class="table">
              <tr><th>વિગત</th><th>કિંમત</th></tr>
              <tr><td>સાફ ઘઉંનું વજન</td><td>${formData.wheatWeightKg}કિ.ગ્રા (મણ: ${formData.wheatWeightMaund})</td></tr>
              <tr><td>કટકી</td><td>${formData.cutPieces} કિ.ગ્રા.</td></tr>
              <tr><td>૨+૫ નંબર કુલ</td><td>${(parseFloat(formData.number2)||0)+(parseFloat(formData.number5)||0)} કિ.ગ્રા.</td></tr>
              <tr><td>કુલ વજન</td><td>${formData.totalWeightKg}કિ.ગ્રા. (મણ: ${formData.totalWeightMaund})</td></tr>
              <tr><td>નવી બેગ</td><td>${formData.bagQuantity}</td></tr>
              <tr><td>બેગ રકમ</td><td>${formData.bagAmount}</td></tr>
              <tr class="amount-row"><td>કુલ બેગ રકમ</td><td>₹${formData.totalBagPrice}</td></tr>
              <tr><td>પ્રતિ કિ.ગ્રા. ભાવ</td><td>₹${formData.pricePerKg}</td></tr>
            </table>
            <div class="row" style="margin-top:24px;">
              <div class="total-label">કુલ રકમ</div>
              <div class="total-value">₹${formData.totalAmount}</div>
            </div>
            <div class="footer">
              તમારા વ્યવસાય માટે આભાર!<br/>
              <span style="font-size:12px;">Billing App દ્વારા જનરેટેડ</span>
            </div>
            <div class="signature">
              સહી: ______________________
            </div>
          </div>
        </body>
      </html>
    `;
    try {
      const { uri } = await Print.printToFileAsync({ html });
      await Sharing.shareAsync(uri, { UTI: '.pdf', mimeType: 'application/pdf' });
    } catch (e) {
      Alert.alert('Error', 'Could not generate PDF.');
    }
  };

  const handlePrint = () => {
    Alert.alert('Print', 'Invoice sent to printer!');
  };

  const handleDateChange = (event: any, date?: Date) => {
    setShowDatePicker(false);
    if (date) {
      setSelectedDate(date);
      updateFormData('date', date.toLocaleDateString('en-GB'));
    }
  };

  const showDatePickerModal = () => {
    setShowDatePicker(true);
  };

  // Calculate total weight whenever weight fields change
  useEffect(() => {
    calculateTotalWeight();
  }, [formData.wheatWeightKg, formData.cutPieces, formData.number2, formData.number5]);

  // Calculate total amount whenever any relevant field changes
  useEffect(() => {
    calculateTotal();
  }, [formData.totalWeightKg, formData.pricePerKg, formData.bagQuantity, formData.bagAmount]);

  const handleBin = () => {
    Alert.alert(
      'Delete Invoice',
      'Are you sure you want to delete this invoice?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: () => {
                                                      setFormData({
                 customerName: '',
                 customerPhone: '',
                 invoiceNumber: 'INV-001',
                 date: new Date().toLocaleDateString('en-GB'),
                 wheatWeightKg: '',
                 wheatWeightMaund: '',
                 cutPieces: '',
                 number2: '',
                 number5: '',
                 totalWeightKg: '0',
                 totalWeightMaund: '૦ મણ',
                 bagQuantity: '',
                 pricePerKg: '',
                 bagAmount: '',
                 totalBagPrice: '',
                 totalAmount: '',
               });
            Alert.alert('Deleted', 'Invoice has been deleted');
          }
        }
      ]
    );
  };

  return (
    <ScrollView 
      style={[styles.container, { backgroundColor }]}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.header}>
        <ThemedText style={[styles.title, { color: textColor }]}>
          Create Invoice
        </ThemedText>
        <ThemedText style={[styles.subtitle, { color: textColor }]}>
          Prime Agro Industries
        </ThemedText>
      </View>

      <View style={styles.formContainer}>
                 {/* Invoice Header Section */}
         <View style={styles.section}>
           <ThemedText style={[styles.sectionTitle, { color: textColor }]}>
             Invoice Details
           </ThemedText>
           
                       <View style={styles.row}>
              <View style={styles.fieldContainer}>
                <ThemedText style={[styles.label, { color: textColor }]}>
                  નંબર (Number)
                </ThemedText>
                <ThemedText style={[styles.invoiceNumberText, { color: textColor }]}>
                  {formData.invoiceNumber}
                </ThemedText>
              </View>
              
                             <View style={styles.fieldContainer}>
                 <ThemedText style={[styles.label, { color: textColor }]}>
                   તારીખ (Date)
                 </ThemedText>
                 <TouchableOpacity
                   style={[styles.dateButton, { borderColor: textColor }]}
                   onPress={showDatePickerModal}
                 >
                   <ThemedText style={[styles.dateButtonText, { color: textColor }]}>
                     {formData.date || 'Select Date'}
                   </ThemedText>
                   <IconSymbol size={16} name="calendar" color={textColor} />
                 </TouchableOpacity>
               </View>
            </View>
         </View>

         {/* Customer Details Section */}
         <View style={styles.section}>
           <ThemedText style={[styles.sectionTitle, { color: textColor }]}>
             Customer Details
           </ThemedText>
           
           <View style={styles.fieldContainer}>
             <ThemedText style={[styles.label, { color: textColor }]}>
               નામ (Name)
             </ThemedText>
             <TextInput
               style={[styles.input, { color: textColor, borderColor: textColor }]}
               value={formData.customerName}
               onChangeText={(value) => updateFormData('customerName', value)}
               placeholder="Enter customer name"
               placeholderTextColor={textColor + '80'}
             />
           </View>
           <View style={styles.fieldContainer}>
             <ThemedText style={[styles.label, { color: textColor }]}>ફોન નંબર (Phone Number)</ThemedText>
             <TextInput
               style={[styles.input, { color: textColor, borderColor: textColor }]}
               value={formData.customerPhone}
               onChangeText={(value) => updateFormData('customerPhone', value)}
               placeholder="Enter phone number"
               placeholderTextColor={textColor + '80'}
               keyboardType="phone-pad"
               maxLength={15}
             />
           </View>
         </View>

        {/* Product Details Section */}
        <View style={styles.section}>
          <ThemedText style={[styles.sectionTitle, { color: textColor }]}>
            વિગત (Details)
          </ThemedText>
          
                     <View style={styles.fieldContainer}>
             <ThemedText style={[styles.label, { color: textColor }]}>
               સાફ ઘઉંનું વજન (Weight of cleaned wheat)
             </ThemedText>
             <View style={styles.row}>
               <TextInput
                 style={[styles.input, { flex: 1, color: textColor, borderColor: textColor }]}
                 value={formData.wheatWeightKg}
                 onChangeText={handleWheatWeightChange}
                 placeholder="Kg"
                 placeholderTextColor={textColor + '80'}
                 keyboardType="numeric"
               />
                               <TextInput
                  style={[styles.input, { flex: 1, marginLeft: 8, color: textColor, borderColor: textColor }]}
                  value={formData.wheatWeightMaund}
                  editable={false}
                  placeholder="મણ (Auto)"
                  placeholderTextColor={textColor + '80'}
                />
             </View>
           </View>

                     <View style={styles.fieldContainer}>
             <ThemedText style={[styles.label, { color: textColor }]}>
               કટકી (Cut/Pieces)
             </ThemedText>
                           <TextInput
                style={[styles.input, { color: textColor, borderColor: textColor }]}
                value={formData.cutPieces}
                onChangeText={(value) => {
                  setFormData(prev => ({
                    ...prev,
                    cutPieces: value
                  }));
                }}
                placeholder="Enter pieces"
                placeholderTextColor={textColor + '80'}
                keyboardType="numeric"
              />
           </View>
           
                       <View style={styles.fieldContainer}>
              <ThemedText style={[styles.label, { color: textColor }]}>
                ૨+૫ નંબર કુલ (2+5 Number Total)
              </ThemedText>
                             <TextInput
                 style={[styles.input, { color: textColor, borderColor: textColor }]}
                 value={((parseFloat(formData.number2) || 0) + (parseFloat(formData.number5) || 0)).toString()}
                 onChangeText={(value) => {
                   // Split the total value equally between 2 and 5 number
                   const total = parseFloat(value) || 0;
                   const half = total / 2;
                   setFormData(prev => ({
                     ...prev,
                     number2: half.toString(),
                     number5: half.toString()
                   }));
                   // Calculate total weight after a short delay to ensure state is updated
                   setTimeout(() => calculateTotalWeight(), 0);
                 }}
                 placeholder="Enter total 2+5 number"
                 placeholderTextColor={textColor + '80'}
                 keyboardType="numeric"
               />
            </View>

                     <View style={styles.fieldContainer}>
             <ThemedText style={[styles.label, { color: textColor }]}>
               કુલ વજન = (Total Weight =)
             </ThemedText>
             <View style={styles.row}>
               <TextInput
                 style={[styles.input, { flex: 1, color: textColor, borderColor: textColor }]}
                 value={formData.totalWeightKg}
                 editable={false}
                 placeholder="Kg (Auto)"
                 placeholderTextColor={textColor + '80'}
               />
                               <TextInput
                  style={[styles.input, { flex: 1, marginLeft: 8, color: textColor, borderColor: textColor }]}
                  value={formData.totalWeightMaund}
                  editable={false}
                  placeholder="મણ (Auto)"
                  placeholderTextColor={textColor + '80'}
                />
             </View>
           </View>
        </View>

                 {/* Amount Section */}
         <View style={styles.section}>
           <ThemedText style={[styles.sectionTitle, { color: textColor }]}>
             Amount Details
           </ThemedText>
           
           <View style={styles.fieldContainer}>
             <ThemedText style={[styles.label, { color: textColor }]}>
               ભાવ (Price per Kg)
             </ThemedText>
             <TextInput
               style={[styles.input, { color: textColor, borderColor: textColor }]}
               value={formData.pricePerKg}
               onChangeText={(value) => {
                 updateFormData('pricePerKg', value);
               }}
               placeholder="₹ per Kg"
               placeholderTextColor={textColor + '80'}
               keyboardType="numeric"
             />
           </View>

                       <View style={styles.row}>
              <View style={styles.fieldContainer}>
                <ThemedText style={[styles.label, { color: textColor }]}>
                  બેગ માત્રા (Bag Quantity)
                </ThemedText>
                <TextInput
                  style={[styles.input, { color: textColor, borderColor: textColor }]}
                  value={formData.bagQuantity}
                  onChangeText={(value) => {
                    updateFormData('bagQuantity', value);
                    calculateTotal();
                  }}
                  placeholder="Enter bags"
                  placeholderTextColor={textColor + '80'}
                  keyboardType="numeric"
                />
              </View>
              
              <View style={styles.fieldContainer}>
                <ThemedText style={[styles.label, { color: textColor }]}>
                  બેગ રકમ (Bag Amount)
                </ThemedText>
                <View style={styles.row}>
                  <TextInput
                    style={[styles.input, { flex: 1, color: textColor, borderColor: textColor }]}
                    value={formData.bagAmount}
                    onChangeText={(value) => {
                      updateFormData('bagAmount', value);
                      calculateTotal();
                    }}
                    placeholder="₹ per bag"
                    placeholderTextColor={textColor + '80'}
                    keyboardType="numeric"
                  />
                  <ThemedText style={[styles.smallText, { color: textColor, marginLeft: 8 }]}>
                    = ₹{formData.totalBagPrice || '0'}
                  </ThemedText>
                </View>
              </View>
            </View>

           <View style={styles.fieldContainer}>
             <ThemedText style={[styles.label, { color: textColor }]}>કુલ રકમ (Total Amount)</ThemedText>
             <TextInput
               style={[styles.input, { color: textColor, borderColor: textColor, fontWeight: 'bold' }]}
               value={
                 (formData.pricePerKg !== '' || formData.bagAmount !== '')
                   ? formData.totalAmount
                   : ''
               }
               editable={false}
               placeholder="₹ (Auto)"
               placeholderTextColor={textColor + '80'}
             />
           </View>
         </View>
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.saveButton, { backgroundColor: tintColor }]}
          onPress={handleSave}
        >
          <IconSymbol size={20} name="square.and.arrow.down" color="#fff" />
          <ThemedText style={styles.buttonText}>Save</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.downloadButton, { backgroundColor: '#22C55E' }]}
          onPress={handleDownload}
        >
          <IconSymbol size={20} name="arrow.down.circle" color="#fff" />
          <ThemedText style={styles.buttonText}>Download</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.printButton, { backgroundColor: '#F59E0B' }]}
          onPress={handlePrint}
        >
          <IconSymbol size={20} name="printer" color="#fff" />
          <ThemedText style={styles.buttonText}>Print</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[styles.button, styles.binButton, { backgroundColor: '#EF4444' }]}
          onPress={handleBin}
        >
          <IconSymbol size={20} name="trash" color="#fff" />
          <ThemedText style={styles.buttonText}>Delete</ThemedText>
                 </TouchableOpacity>
       </View>

       {/* Date Picker Modal */}
       {showDatePicker && (
         <DateTimePicker
           value={selectedDate}
           mode="date"
           display={Platform.OS === 'ios' ? 'spinner' : 'default'}
           onChange={handleDateChange}
         />
       )}
     </ScrollView>
   );
 }

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
  },
  header: {
    marginBottom: 24,
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    opacity: 0.7,
  },
  formContainer: {
    marginBottom: 24,
  },
  section: {
    marginBottom: 24,
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(10, 126, 164, 0.1)',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  fieldContainer: {
    flex: 1,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    justifyContent: 'center',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 100,
    justifyContent: 'center',
    gap: 8,
  },
  saveButton: {
    // tintColor
  },
  downloadButton: {
    // green
  },
  printButton: {
    // orange
  },
  binButton: {
    // red
  },
     buttonText: {
     color: '#fff',
     fontSize: 14,
     fontWeight: '600',
   },
   dateButton: {
     borderWidth: 1,
     borderRadius: 8,
     padding: 12,
     flexDirection: 'row',
     justifyContent: 'space-between',
     alignItems: 'center',
   },
       dateButtonText: {
      fontSize: 16,
    },
         invoiceNumberText: {
       fontSize: 18,
       fontWeight: 'bold',
       marginTop: 4,
     },
     smallText: {
       fontSize: 12,
       opacity: 0.8,
       alignSelf: 'center',
     },
}); 