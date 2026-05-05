import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBlogs, deleteBlog } from '../redux/slices/blogSlice';
import LoadingSpinner from '../components/LoadingSpinner';
import { toast } from 'react-toastify';
import { HiOutlineDocumentText, HiOutlineUser, HiOutlineClock } from 'react-icons/hi';

export default function Blogs() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { blogs, loading } = useSelector(state => state.blogs);
  const { user } = useSelector(state => state.auth);
  const [deletingId, setDeletingId] = useState(null);
  const [search, setSearch] = useState('');

  useEffect(() => {
    dispatch(fetchBlogs({ search }));
  }, [dispatch, search]);

  const canManageBlog = (blog) => {
    if (!user) return false;
    return user.role === 'admin' || blog.author?._id === user._id;
  };

  const handleDelete = async (e, blogId) => {
    e.preventDefault();
    e.stopPropagation();

    if (deletingId) return;
    const confirmed = window.confirm('Are you sure you want to delete this blog post?');
    if (!confirmed) return;

    setDeletingId(blogId);
    const result = await dispatch(deleteBlog(blogId));
    setDeletingId(null);

    if (result.meta.requestStatus === 'fulfilled') {
      toast.success('Blog post deleted');
    } else {
      toast.error(result.payload || 'Failed to delete blog post');
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    dispatch(fetchBlogs({ search }));
  };

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Blog</h1>
        <p className="text-gray-500">Insights, updates, and stories from our community</p>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-8">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent outline-none text-sm"
            placeholder="Search blogs by title or content..."
          />
          <button
            type="submit"
            className="px-6 py-2.5 bg-primary-600 text-white rounded-lg font-medium hover:bg-primary-700 text-sm"
          >
            Search
          </button>
        </form>
      </div>

      {blogs.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <HiOutlineDocumentText className="mx-auto mb-3" size={48} />
          <p className="text-lg font-medium">{search ? 'No matching blog posts' : 'No blog posts yet'}</p>
          <p className="text-sm mt-1">{search ? 'Try a different keyword' : 'Check back soon for new content'}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogs.map(blog => (
            <Link key={blog._id} to={`/blogs/${blog._id}`}
              className="group bg-white rounded-xl overflow-hidden border border-gray-200 hover:shadow-lg transition-all">
              <div className="h-40 bg-gradient-to-br from-purple-400 to-primary-600 flex items-center justify-center">
                <HiOutlineDocumentText className="text-white/40" size={48} />
              </div>
              <div className="p-5">
                {blog.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-2">
                    {blog.tags.slice(0, 3).map(tag => (
                      <span key={tag} className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-xs">{tag}</span>
                    ))}
                  </div>
                )}
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-primary-600 mb-2 line-clamp-2">{blog.title}</h3>
                <p className="text-sm text-gray-500 line-clamp-2 mb-3">{blog.content?.substring(0, 120)}...</p>
                <div className="flex items-center justify-between text-sm text-gray-400">
                  <span className="flex items-center gap-1"><HiOutlineUser size={14} /> {blog.author?.name}</span>
                  <span className="flex items-center gap-1"><HiOutlineClock size={14} /> {new Date(blog.createdAt).toLocaleDateString()}</span>
                </div>
                {canManageBlog(blog) && (
                  <div className="mt-4 flex gap-2" onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}>
                    <button
                      type="button"
                      onClick={() => navigate(`/blogs/edit/${blog._id}`)}
                      className="px-3 py-1.5 text-xs font-medium bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={(e) => handleDelete(e, blog._id)}
                      disabled={deletingId === blog._id}
                      className="px-3 py-1.5 text-xs font-medium border border-red-300 text-red-600 rounded-md hover:bg-red-50 disabled:opacity-50 transition-colors"
                    >
                      {deletingId === blog._id ? 'Deleting...' : 'Delete'}
                    </button>
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
