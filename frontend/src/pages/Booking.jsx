import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEvent } from '../redux/slices/eventSlice';
import { createBooking, processPayment, clearCurrentBooking } from '../redux/slices/bookingSlice';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/LoadingSpinner';
import API from '../utils/api';
import { HiOutlineTicket, HiOutlineCheck, HiOutlineDownload, HiOutlineCreditCard } from 'react-icons/hi';

export default function Booking() {
  const { eventId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { event } = useSelector(state => state.events);
  const { currentBooking, loading } = useSelector(state => state.bookings);
  const [selectedTier, setSelectedTier] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [step, setStep] = useState('select');
  const [paymentForm, setPaymentForm] = useState({ cardNumber: '', expiry: '', cvv: '', name: '' });

  useEffect(() => {
    dispatch(fetchEvent(eventId));
    return () => dispatch(clearCurrentBooking());
  }, [dispatch, eventId]);

  const selectedTicket = event?.tickets?.find(t => t.tier === selectedTier);
  const totalPrice = selectedTicket ? selectedTicket.price * quantity : 0;

  const handleBook = async () => {
    if (!selectedTier) { toast.error('Please select a ticket tier'); return; }
    const result = await dispatch(createBooking({ eventId, ticketTier: selectedTier, quantity }));
    if (result.meta.requestStatus === 'fulfilled') {
      toast.success('Booking created!');
      setStep('payment');
    }
  };

  const handlePay = async () => {
    if (!paymentForm.cardNumber || !paymentForm.expiry || !paymentForm.cvv || !paymentForm.name) {
      toast.error('Please fill all payment fields');
      return;
    }
    if (currentBooking) {
      const result = await dispatch(processPayment(currentBooking._id));
      if (result.meta.requestStatus === 'fulfilled') {
        toast.success('Payment successful!');
        setStep('confirmed');
      }
    }
  };

  const handleDownloadTicket = async () => {
    try {
      const response = await API.get(`/bookings/${currentBooking._id}/ticket`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `ticket-${currentBooking.ticketId}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch {
      toast.error('Failed to download ticket');
    }
  };

  if (!event) return <LoadingSpinner />;

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Book Tickets</h1>

      {/* Steps indicator */}
      <div className="flex items-center gap-2 mb-8">
        {['Select', 'Payment', 'Confirmed'].map((s, i) => {
          const stepNames = ['select', 'payment', 'confirmed'];
          const currentIdx = stepNames.indexOf(step);
          const isActive = i <= currentIdx;
          return (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${isActive ? 'bg-primary-600 text-white' : 'bg-gray-200 text-gray-500'}`}>
                {i < currentIdx ? <HiOutlineCheck size={16} /> : i + 1}
              </div>
              <span className={`text-sm font-medium ${isActive ? 'text-gray-900' : 'text-gray-400'}`}>{s}</span>
              {i < 2 && <div className={`flex-1 h-0.5 ${i < currentIdx ? 'bg-primary-600' : 'bg-gray-200'}`} />}
            </div>
          );
        })}
      </div>

      {/* Step 1: Select Ticket */}
      {step === 'select' && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-1">{event.title}</h2>
            <p className="text-sm text-gray-500">{new Date(event.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })} &bull; {event.location}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-3">Select Ticket Tier</label>
            <div className="space-y-3">
              {event.tickets?.map(tier => (
                <button key={tier._id} onClick={() => setSelectedTier(tier.tier)} disabled={tier.sold >= tier.quantity}
                  className={`w-full p-4 rounded-lg border text-left transition-all ${selectedTier === tier.tier ? 'border-primary-500 bg-primary-50 ring-2 ring-primary-200' : 'border-gray-200 hover:border-gray-300'} ${tier.sold >= tier.quantity ? 'opacity-50 cursor-not-allowed' : ''}`}>
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="font-semibold text-gray-900">{tier.tier}</p>
                      <p className="text-sm text-gray-500">{tier.quantity - tier.sold} remaining</p>
                    </div>
                    <p className="text-xl font-bold text-primary-600">${tier.price}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>
          {selectedTier && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Quantity</label>
              <select value={quantity} onChange={e => setQuantity(Number(e.target.value))}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-sm bg-white">
                {Array.from({ length: Math.min(10, (selectedTicket?.quantity || 0) - (selectedTicket?.sold || 0)) }, (_, i) => i + 1).map(n => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </div>
          )}
          <div className="border-t border-gray-200 pt-4 flex justify-between items-center">
            <div><p className="text-sm text-gray-500">Total Price</p><p className="text-2xl font-bold text-gray-900">${totalPrice}</p></div>
            <button onClick={handleBook} disabled={!selectedTier || loading}
              className="px-8 py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 disabled:opacity-50 transition-colors flex items-center gap-2">
              <HiOutlineTicket size={18} /> {loading ? 'Booking...' : 'Proceed to Payment'}
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Payment */}
      {step === 'payment' && currentBooking && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-2">Booking Summary</h3>
            <div className="grid grid-cols-2 gap-2 text-sm">
              <span className="text-gray-500">Event:</span><span className="text-gray-900">{event.title}</span>
              <span className="text-gray-500">Tier:</span><span className="text-gray-900">{currentBooking.ticketTier}</span>
              <span className="text-gray-500">Quantity:</span><span className="text-gray-900">{currentBooking.quantity}</span>
              <span className="text-gray-500">Total:</span><span className="text-gray-900 font-bold">${currentBooking.totalPrice}</span>
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center gap-2"><HiOutlineCreditCard size={18} /> Payment Details</h3>
            <p className="text-xs text-gray-400 mb-4">This is a simulated payment. No real charges will be made.</p>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Cardholder Name</label>
                <input type="text" value={paymentForm.name} onChange={e => setPaymentForm({...paymentForm, name: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-sm"
                  placeholder="John Doe" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Card Number</label>
                <input type="text" value={paymentForm.cardNumber} onChange={e => setPaymentForm({...paymentForm, cardNumber: e.target.value})}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-sm"
                  placeholder="4242 4242 4242 4242" maxLength={19} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Expiry</label>
                  <input type="text" value={paymentForm.expiry} onChange={e => setPaymentForm({...paymentForm, expiry: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-sm"
                    placeholder="MM/YY" maxLength={5} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">CVV</label>
                  <input type="text" value={paymentForm.cvv} onChange={e => setPaymentForm({...paymentForm, cvv: e.target.value})}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-sm"
                    placeholder="123" maxLength={4} />
                </div>
              </div>
            </div>
          </div>
          <button onClick={handlePay} disabled={loading}
            className="w-full py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 disabled:opacity-50 transition-colors">
            {loading ? 'Processing...' : `Pay $${currentBooking.totalPrice}`}
          </button>
        </div>
      )}

      {/* Step 3: Confirmed */}
      {step === 'confirmed' && currentBooking && (
        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <HiOutlineCheck className="text-green-600" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
          <p className="text-gray-500 mb-6">Your ticket has been booked successfully.</p>
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left max-w-sm mx-auto">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <span className="text-gray-500">Ticket ID:</span><span className="text-gray-900 font-mono text-xs">{currentBooking.ticketId}</span>
              <span className="text-gray-500">Event:</span><span className="text-gray-900">{event.title}</span>
              <span className="text-gray-500">Tier:</span><span className="text-gray-900">{currentBooking.ticketTier}</span>
              <span className="text-gray-500">Status:</span><span className="text-green-600 font-medium">Paid</span>
            </div>
          </div>
          <div className="flex gap-3 justify-center">
            <button onClick={handleDownloadTicket}
              className="px-6 py-2.5 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 transition-colors flex items-center gap-2">
              <HiOutlineDownload size={18} /> Download Ticket
            </button>
            <button onClick={() => navigate('/my-bookings')}
              className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors">
              My Bookings
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
