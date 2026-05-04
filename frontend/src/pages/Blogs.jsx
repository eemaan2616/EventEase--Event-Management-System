import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBlogs } from '../redux/slices/blogSlice';
import LoadingSpinner from '../components/LoadingSpinner';
import { HiOutlineDocumentText, HiOutlineUser, HiOutlineClock } from 'react-icons/hi';

export default function Blogs() {
  const dispatch = useDispatch();
  const { blogs, loading } = useSelector(state => state.blogs);

  useEffect(() => { dispatch(fetchBlogs()); }, [dispatch]);

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Blog</h1>
        <p className="text-gray-500">Insights, updates, and stories from our community</p>
      </div>

      {blogs.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <HiOutlineDocumentText className="mx-auto mb-3" size={48} />
          <p className="text-lg font-medium">No blog posts yet</p>
          <p className="text-sm mt-1">Check back soon for new content</p>
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
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
