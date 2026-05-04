import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { createBlog } from '../redux/slices/blogSlice';
import { toast } from 'react-toastify';

export default function CreateBlog() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [form, setForm] = useState({ title: '', content: '', image: '', tags: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.content) { toast.error('Title and content are required'); return; }
    setLoading(true);
    const blogData = {
      ...form,
      tags: form.tags ? form.tags.split(',').map(t => t.trim()).filter(Boolean) : [],
    };
    const result = await dispatch(createBlog(blogData));
    setLoading(false);
    if (result.meta.requestStatus === 'fulfilled') {
      toast.success('Blog post published!');
      navigate('/blogs');
    } else {
      toast.error('Failed to create blog post');
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Write a Blog Post</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Title *</label>
          <input type="text" value={form.title} onChange={e => setForm({...form, title: e.target.value})}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-sm"
            placeholder="Blog post title" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Content *</label>
          <textarea value={form.content} onChange={e => setForm({...form, content: e.target.value})} rows={12}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-sm resize-none"
            placeholder="Write your blog post content here..." />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Image URL</label>
          <input type="text" value={form.image} onChange={e => setForm({...form, image: e.target.value})}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-sm"
            placeholder="https://..." />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Tags (comma separated)</label>
          <input type="text" value={form.tags} onChange={e => setForm({...form, tags: e.target.value})}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-sm"
            placeholder="events, technology, workshops" />
        </div>
        <button type="submit" disabled={loading}
          className="w-full py-3 bg-primary-600 text-white rounded-lg font-semibold hover:bg-primary-700 disabled:opacity-50 transition-colors">
          {loading ? 'Publishing...' : 'Publish Blog Post'}
        </button>
      </form>
    </div>
  );
}
