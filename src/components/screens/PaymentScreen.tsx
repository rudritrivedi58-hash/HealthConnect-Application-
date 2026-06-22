import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CreditCard, Check, ShieldCheck, ChevronRight, Apple, 
  Smartphone, Plus, ArrowLeft, Landmark, FileText, RefreshCw
} from 'lucide-react';

interface PaymentScreenProps {
  doctorName?: string;
  specialty?: string;
  fee?: number;
  onPaymentSuccess: () => void;
}

export default function PaymentScreen({ 
  doctorName = "Dr. Sarah Jameson, MD", 
  specialty = "Allergy & Pulmonary Specialist", 
  fee = 95,
  onPaymentSuccess 
}: PaymentScreenProps) {
  const [selectedMethod, setSelectedMethod] = useState<'upi' | 'card' | 'gpay'>('card');
  const [cardNumber, setCardNumber] = useState('4111 2930 1489 2390');
  const [cardExpiry, setCardExpiry] = useState('09/29');
  const [cardCvv, setCardCvv] = useState('382');
  const [upiId, setUpiId] = useState('alex.rivera@okaxis');
  const [loading, setLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // Past payment history list
  const paymentHistory = [
    { id: 'tx_1', dName: 'Dr. Robert Chen', date: 'June 10, 2026', fee: 120, status: 'Success' },
    { id: 'tx_2', dName: 'Dr. Elizabeth Sarah', date: 'May 15, 2026', fee: 95, status: 'Success' },
    { id: 'tx_3', dName: 'CVS Pharmacy Rx Refill', date: 'Apr 02, 2026', fee: 20, status: 'Success' }
  ];

  const handlePay = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setIsSuccess(true);
      setTimeout(() => {
        onPaymentSuccess();
      }, 1600);
    }, 1800);
  };

  return (
    <div id="screen_payments" className="h-full w-full bg-slate-50 flex flex-col justify-between overflow-hidden relative">
      
      {!isSuccess ? (
        // MAIN PAYMENT PROCESS METHOD SCREEN
        <div className="flex-1 flex flex-col justify-between overflow-y-auto">
          
          <div className="p-5 space-y-4">
            {/* Header */}
            <div>
              <h2 className="text-base font-extrabold text-slate-900 tracking-tight">Checkout Invoice</h2>
              <p className="text-[10px] text-slate-505">Encrypted payment processor gateway</p>
            </div>

            {/* Dynamic Consultation Invoice Info */}
            <div className="bg-white border rounded-2xl p-4 shadow-sm space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400 block">Service Item</span>
                  <h4 className="font-extrabold text-xs text-slate-900 mt-0.5">Telehealth consult — {doctorName}</h4>
                  <p className="text-[10px] text-blue-600 font-medium">{specialty}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-black text-slate-800">${fee}.00</span>
                </div>
              </div>
              
              <div className="border-t border-slate-100 pt-2 flex justify-between items-center text-[10.5px]">
                <span className="text-slate-400 font-semibold uppercase tracking-wider text-[9px]">Total Billing</span>
                <span className="font-extrabold text-blue-600">${fee}.00</span>
              </div>
            </div>

            {/* Payment Method Select columns */}
            <div className="space-y-2">
              <label className="block text-[10px] uppercase font-bold text-slate-400 tracking-wider">Choose payment method</label>
              <div className="grid grid-cols-3 gap-2">
                
                <button
                  onClick={() => setSelectedMethod('card')}
                  className={`py-3.5 rounded-xl border flex flex-col items-center gap-1 cursor-pointer transition ${selectedMethod === 'card' ? 'border-blue-600 bg-blue-50/50 text-blue-700 font-bold' : 'border-slate-200 bg-white text-slate-400'}`}
                >
                  <CreditCard className="w-5 h-5 text-blue-600" />
                  <span className="text-[9px] font-bold uppercase tracking-wider">Debit/Credit</span>
                </button>

                <button
                  onClick={() => setSelectedMethod('upi')}
                  className={`py-3.5 rounded-xl border flex flex-col items-center gap-1 cursor-pointer transition ${selectedMethod === 'upi' ? 'border-emerald-600 bg-emerald-50/50 text-emerald-700 font-bold' : 'border-slate-200 bg-white text-slate-400'}`}
                >
                  <Smartphone className="w-5 h-5 text-emerald-600" />
                  <span className="text-[9px] font-bold uppercase tracking-wider">UPI App</span>
                </button>

                <button
                  onClick={() => setSelectedMethod('gpay')}
                  className={`py-3.5 rounded-xl border flex flex-col items-center gap-1 cursor-pointer transition ${selectedMethod === 'gpay' ? 'border-indigo-600 bg-indigo-50/50 text-indigo-700 font-bold' : 'border-slate-200 bg-white text-slate-400'}`}
                >
                  <Apple className="w-5 h-5 text-indigo-600" />
                  <span className="text-[9px] font-bold uppercase tracking-wider">G-Pay</span>
                </button>

              </div>
            </div>

            {/* Inputs based on payment method */}
            <div className="bg-white rounded-2xl p-4 border border-slate-100 shadow-sm space-y-3.5 text-left">
              <AnimatePresence mode="wait">
                {selectedMethod === 'card' ? (
                  <motion.div
                    key="card"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="space-y-3"
                  >
                    <div>
                      <label className="block text-[8px] uppercase font-bold text-slate-400 tracking-wider mb-1">Card number</label>
                      <input 
                        type="text" 
                        value={cardNumber}
                        onChange={(e) => setCardNumber(e.target.value)}
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs outline-none focus:border-blue-500 font-medium"
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[8px] uppercase font-bold text-slate-400 tracking-wider mb-1">Expiry date</label>
                        <input 
                          type="text" 
                          value={cardExpiry}
                          placeholder="MM/YY"
                          onChange={(e) => setCardExpiry(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs outline-none focus:border-blue-500 font-medium text-center"
                        />
                      </div>
                      <div>
                        <label className="block text-[8px] uppercase font-bold text-slate-400 tracking-wider mb-1">CVV Pin</label>
                        <input 
                          type="password" 
                          value={cardCvv}
                          placeholder="•••"
                          onChange={(e) => setCardCvv(e.target.value)}
                          className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs outline-none focus:border-blue-500 font-medium text-center"
                        />
                      </div>
                    </div>
                  </motion.div>
                ) : selectedMethod === 'upi' ? (
                  <motion.div
                    key="upi"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-2"
                  >
                    <div>
                      <label className="block text-[8px] uppercase font-bold text-slate-400 tracking-wider mb-1">Virtual Private UPI Handle</label>
                      <input 
                        type="text" 
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="e.g. name@okhdfc"
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl p-2.5 text-xs outline-none focus:border-emerald-500 font-medium"
                      />
                    </div>
                    <p className="text-[9px] text-slate-400 italic leading-snug">
                      *Tapping pay orders a synthetic request notification to your registered G-Pay or BHIM smartphone app.
                    </p>
                  </motion.div>
                ) : (
                  <motion.div
                    key="gpay"
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-1.5 py-2 text-center"
                  >
                    <Smartphone className="w-8 h-8 text-indigo-600 mx-auto animate-bounce mb-1" />
                    <h5 className="font-bold text-xs">G-Pay Express Sandbox check</h5>
                    <p className="text-[9.5px] text-slate-400">Instantly use saved credit details stored in Google Wallet profiles.</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Invoices Transaction History lists */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider text-left">Recent Settlements</h3>
              
              <div className="bg-white border rounded-2xl p-3 divide-y divide-slate-100 flex flex-col shadow-sm">
                {paymentHistory.map((h, idx) => (
                  <div key={idx} className="flex justify-between items-center py-2 text-xs">
                    <div className="text-left space-y-0.5">
                      <h5 className="font-bold text-slate-900 leading-none">{h.dName}</h5>
                      <span className="text-[9px] text-slate-400 font-medium">{h.date}</span>
                    </div>

                    <div className="text-right">
                      <span className="font-extrabold text-slate-800block">${h.fee}</span>
                      <span className="text-[8px] bg-emerald-50 text-emerald-700 font-bold px-1.5 py-0.5 rounded ml-1">
                        {h.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Checkout CTA triggers */}
          <div className="p-5 border-t bg-white space-y-3">
            <div className="flex gap-2 text-[10px] text-slate-500 justify-center">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>PCI-DSS Cryptographic Shield Active</span>
            </div>

            <button
              onClick={handlePay}
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:opacity-95 text-white font-semibold py-3.5 rounded-xl shadow-md cursor-pointer text-xs uppercase tracking-wider flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white/80" />
                  <span>Processing Checkout...</span>
                </>
              ) : (
                <>
                  <span>Settle Bill ${fee}.00</span>
                </>
              )}
            </button>
          </div>

        </div>
      ) : (
        // SUCCESS CHECKOUT SCREEN STEP
        <div className="h-full flex flex-col justify-between p-6 bg-gradient-to-b from-blue-50 to-white text-center">
          <div />

          <div className="flex flex-col items-center space-y-4">
            <motion.div
              initial={{ scale: 0.3, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 200 }}
              className="bg-emerald-500 text-white p-4 rounded-full shadow-lg shadow-emerald-500/20"
            >
              <Check className="w-12 h-12" />
            </motion.div>

            <div className="space-y-1">
              <h2 className="text-xl font-bold text-slate-900 tracking-tight">Invoice Settled</h2>
              <p className="text-xs text-emerald-600 font-bold">Transaction HC-TX-84920 completed successfully</p>
            </div>

            <div className="bg-slate-50 border border-slate-200/50 p-4 rounded-2xl w-full text-left font-mono text-xs text-slate-650 space-y-1 shadow-inner">
              <p>🧾 Recipient Name: {doctorName}</p>
              <p>💵 Paid Amount: ${fee}.00 USD</p>
              <p>⏰ Log Timestamp: {new Date().toLocaleDateString()}</p>
              <p>🔏 Cryptographic Receipt ID: HLTH-CNCT-920</p>
            </div>
          </div>

          <div className="space-y-1.5 text-[10px] text-slate-400">
            <span>Dispatched to verified insurance gateway.</span>
          </div>
        </div>
      )}

    </div>
  );
}
