import { useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchEvents } from '../redux/slices/eventSlice';
import LoadingSpinner from '../components/LoadingSpinner';
import { HiOutlineSearch, HiOutlineCalendar, HiOutlineLocationMarker, HiOutlineClock } from 'react-icons/hi';

const categories = ['all', 'conference', 'workshop', 'seminar', 'concert', 'sports', 'other'];

export default function Events() {
  const dispatch = useDispatch();
  const { events, loading, page, pages } = useSelector(state => state.events);
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState(searchParams.get('category') || 'all');
  const [currentPage, setCurrentPage] = useState(Number(searchParams.get('page')) || 1);

  useEffect(() => {
    const params = { page: currentPage, limit: 12 };
    if (search) params.search = search;
    if (category && category !== 'all') params.category = category;
    dispatch(fetchEvents(params));
  }, [dispatch, currentPage, category]);

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    const params = { page: 1, limit: 12 };
    if (search) params.search = search;
    if (category && category !== 'all') params.category = category;
    dispatch(fetchEvents(params));
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Browse Events</h1>
        <p className="text-gray-500">Discover events happening around you</p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-8">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-sm"
              placeholder="Search events..." />
          </div>
          <select value={category} onChange={e => { setCategory(e.target.value); setCurrentPage(1); }}
            className="px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-sm capitalize bg-white">
            {categories.map(c => <option key={c} value={c} className="capitalize">{c === 'all' ? 'All Categories' : c}</option>)}
          </select>
          <button type="submit" className="px-6 py-2.5 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 text-sm">
            Search
          </button>
        </form>
      </div>

      {loading ? <LoadingSpinner /> : events.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {events.map(event => (
              <Link key={event._id} to={`/events/${event._id}`}
                className="group bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition-all">
                <div className="h-44 bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center relative">
                  <HiOutlineCalendar className="text-white/40" size={56} />
                  <span className="absolute top-3 left-3 px-2.5 py-0.5 rounded-full text-xs font-medium bg-white/90 text-primary-700 capitalize">{event.category}</span>
                  <span className={`absolute top-3 right-3 px-2.5 py-0.5 rounded-full text-xs font-medium ${event.status === 'upcoming' ? 'bg-green-100 text-green-700' : event.status === 'ongoing' ? 'bg-blue-100 text-blue-700' : 'bg-gray-100 text-gray-700'}`}>
                    {event.status}
                  </span>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 mb-2 line-clamp-1">{event.title}</h3>
                  <p className="text-sm text-gray-500 mb-3 line-clamp-2">{event.description}</p>
                  <div className="space-y-1.5">
                    <p className="text-sm text-gray-500 flex items-center gap-1.5"><HiOutlineClock size={14} /> {new Date(event.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</p>
                    <p className="text-sm text-gray-500 flex items-center gap-1.5"><HiOutlineLocationMarker size={14} /> {event.location}</p>
                  </div>
                  {event.tickets?.length > 0 && (
                    <div className="mt-3 flex justify-between items-center">
                      <p className="text-lg font-bold text-primary-600">From ${Math.min(...event.tickets.map(t => t.price))}</p>
                      <span className="text-xs text-gray-400">{event.tickets.reduce((sum, t) => sum + t.quantity - t.sold, 0)} tickets left</span>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          {pages > 1 && (
            <div className="flex justify-center gap-2">
              {Array.from({ length: pages }, (_, i) => i + 1).map(p => (
                <button key={p} onClick={() => setCurrentPage(p)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium ${p === page ? 'bg-primary-600 text-white' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'}`}>
                  {p}
                </button>
              ))}
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-16 text-gray-500">
          <HiOutlineCalendar className="mx-auto mb-3" size={48} />
          <p className="text-lg font-medium">No events found</p>
          <p className="text-sm mt-1">Try adjusting your search or filters</p>
        </div>
      )}
    </div>
  );
}
