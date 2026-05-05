import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBlog, updateBlog, clearBlog } from '../redux/slices/blogSlice';
import { toast } from 'react-toastify';
import LoadingSpinner from '../components/LoadingSpinner';

export default function EditBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { blog, loading } = useSelector((state) => state.blogs);
  const { user } = useSelector((state) => state.auth);
  const [form, setForm] = useState({ title: '', content: '', image: '', tags: '' });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    dispatch(fetchBlog(id));
    return () => dispatch(clearBlog());
  }, [dispatch, id]);

  useEffect(() => {
    if (!blog) return;

    const isAuthor = blog.author?._id === user?._id;
    const isAdmin = user?.role === 'admin';
    if (!isAuthor && !isAdmin) {
      toast.error('You are not authorized to edit this post');
      navigate(`/blogs/${id}`);
      return;
    }

    setForm({
      title: blog.title || '',
      content: blog.content || '',
      image: blog.image || '',
      tags: blog.tags?.join(', ') || '',
    });
  }, [blog, user, navigate, id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.title || !form.content) {
      toast.error('Title and content are required');
      return;
    }

    setSaving(true);
    const blogData = {
      title: form.title,
      content: form.content,
      image: form.image,
      tags: form.tags ? form.tags.split(',').map((tag) => tag.trim()).filter(Boolean) : [],
    };
    const result = await dispatch(updateBlog({ id, blogData }));
    setSaving(false);

    if (result.meta.requestStatus === 'fulfilled') {
      toast.success('Blog post updated!');
      navigate(`/blogs/${id}`);
    } else {
      toast.error(result.payload || 'Failed to update blog post');
    }
  };

  if (loading || !blog) return <LoadingSpinner />;

  return (
    <div className="max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Edit Blog Post</h1>
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Title *</label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-sm"
            placeholder="Blog post title"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Content *</label>
          <textarea
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
            rows={12}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-sm resize-none"
            placeholder="Write your blog post content here..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Image URL</label>
          <input
            type="text"
            value={form.image}
            onChange={(e) => setForm({ ...form, image: e.target.value })}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-sm"
            placeholder="https://..."
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1.5">Tags (comma separated)</label>
          <input
            type="text"
            value={form.tags}
            onChange={(e) => setForm({ ...form, tags: e.target.value })}
            className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-sm"
            placeholder="events, technology, workshops"
          />
        </div>
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 disabled:opacity-50 transition-colors text-sm"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
          <button
            type="button"
            onClick={() => navigate(`/blogs/${id}`)}
            className="px-6 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 text-sm"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}
