import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { createEvent } from '../redux/slices/eventSlice';
import { toast } from 'react-toastify';
import { HiOutlinePlus, HiOutlineTrash } from 'react-icons/hi';

const categories = ['conference', 'workshop', 'seminar', 'concert', 'sports', 'other'];

export default function CreateEvent() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '', description: '', date: '', endDate: '', location: '', category: 'conference', image: '', status: 'upcoming',
  });
  const [tickets, setTickets] = useState([{ tier: 'General', price: 0, quantity: 100 }]);
  const [loading, setLoading] = useState(false);

  const addTier = () => setTickets([...tickets, { tier: '', price: 0, quantity: 50 }]);
  const removeTier = (i) => setTickets(tickets.filter((_, idx) => idx !== i));
  const updateTier = (i, field, value) => {
    const updated = [...tickets];
    updated[i] = { ...updated[i], [field]: field === 'tier' ? value : Number(value) };
    setTickets(updated);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.description || !form.date || !form.location) {
      toast.error('Please fill all required fields');
      return;
    }
    if (tickets.some(t => !t.tier)) {
      toast.error('All ticket tiers must have a name');
      return;
    }
    setLoading(true);
    const result = await dispatch(createEvent({ ...form, tickets }));
    setLoading(false);
    if (result.meta.requestStatus === 'fulfilled') {
      toast.success('Event created successfully!');
      navigate('/dashboard');
    } else {
      toast.error('Failed to create event');
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Create Event</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Title *</label>
          <input type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-sm" placeholder="Event title" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Description *</label>
          <textarea value={form.description} onChange={e => setForm({...form, description: e.target.value})} rows={5}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-sm resize-none" placeholder="Event description..." />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Start Date *</label>
            <input type="datetime-local" value={form.date} onChange={e => setForm({...form, date: e.target.value})}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-sm" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">End Date</label>
            <input type="datetime-local" value={form.endDate} onChange={e => setForm({...form, endDate: e.target.value})}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-sm" />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Location *</label>
            <input type="text" value={form.location} onChange={e => setForm({...form, location: e.target.value})}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-sm" placeholder="Event location" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Category</label>
            <select value={form.category} onChange={e => setForm({...form, category: e.target.value})}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-sm capitalize bg-white">
              {categories.map(c => <option key={c} value={c} className="capitalize">{c}</option>)}
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Image URL</label>
          <input type="text" value={form.image} onChange={e => setForm({...form, image: e.target.value})}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-sm" placeholder="https://..." />
        </div>

        {/* Ticket Tiers */}
        <div>
          <div className="flex justify-between items-center mb-3">
            <label className="text-sm font-medium text-gray-700">Ticket Tiers</label>
            <button type="button" onClick={addTier} className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 font-medium">
              <HiOutlinePlus size={16} /> Add Tier
            </button>
          </div>
          <div className="space-y-3">
            {tickets.map((tier, i) => (
              <div key={i} className="flex gap-3 items-start p-3 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <input type="text" value={tier.tier} onChange={e => updateTier(i, 'tier', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" placeholder="Tier name" />
                </div>
                <div className="w-28">
                  <input type="number" value={tier.price} onChange={e => updateTier(i, 'price', e.target.value)} min={0}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" placeholder="Price" />
                </div>
                <div className="w-28">
                  <input type="number" value={tier.quantity} onChange={e => updateTier(i, 'quantity', e.target.value)} min={1}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" placeholder="Qty" />
                </div>
                {tickets.length > 1 && (
                  <button type="button" onClick={() => removeTier(i)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg">
                    <HiOutlineTrash size={16} />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        <button type="submit" disabled={loading}
          className="w-full py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 disabled:opacity-50 transition-colors">
          {loading ? 'Creating...' : 'Create Event'}
        </button>
      </form>
    </div>
  );
}
