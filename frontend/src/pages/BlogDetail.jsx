import { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBlog, clearBlog } from '../redux/slices/blogSlice';
import LoadingSpinner from '../components/LoadingSpinner';
import { HiOutlineArrowLeft, HiOutlineUser, HiOutlineClock } from 'react-icons/hi';

export default function BlogDetail() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { blog, loading } = useSelector(state => state.blogs);

  useEffect(() => {
    dispatch(fetchBlog(id));
    return () => dispatch(clearBlog());
  }, [dispatch, id]);

  if (loading || !blog) return <LoadingSpinner />;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Link to="/blogs" className="inline-flex items-center gap-1 text-primary-600 hover:text-primary-700 text-sm font-medium mb-6">
        <HiOutlineArrowLeft size={16} /> Back to Blog
      </Link>

      <article>
        <div className="h-64 bg-gradient-to-br from-purple-400 to-primary-600 rounded-2xl flex items-center justify-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-white text-center px-8">{blog.title}</h1>
        </div>

        <div className="flex items-center gap-4 mb-8 text-sm text-gray-500">
          <span className="flex items-center gap-1"><HiOutlineUser size={16} /> {blog.author?.name}</span>
          <span className="flex items-center gap-1"><HiOutlineClock size={16} /> {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
        </div>

        {blog.tags?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-6">
            {blog.tags.map(tag => (
              <span key={tag} className="px-3 py-1 bg-primary-50 text-primary-700 rounded-full text-xs font-medium">{tag}</span>
            ))}
          </div>
        )}

        <div className="prose prose-lg max-w-none text-gray-700 leading-relaxed whitespace-pre-wrap">
          {blog.content}
        </div>
      </article>
    </div>
  );
}
