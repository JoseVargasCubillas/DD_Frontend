import { Link } from 'react-router-dom';
import Badge from '@atoms/Badge';
import type { BlogPost } from '@types/index';
import { formatDate } from '@utils/formatters';

interface BlogCardProps { post: BlogPost }

export default function BlogCard({ post }: BlogCardProps) {
  return (
    <Link to={`/blog/${post.slug}`} className="card group hover:border-brand-500 transition-all duration-300 block">
      <div className="aspect-video overflow-hidden">
        <img src={post.thumbnail || '/placeholder-blog.jpg'} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
      </div>
      <div className="p-5 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <Badge label={post.category} />
          <span className="text-gray-500 text-xs">{post.readTime} min lectura</span>
        </div>
        <h3 className="font-bold text-white line-clamp-2 group-hover:text-brand-400 transition-colors">{post.title}</h3>
        <p className="text-gray-400 text-sm line-clamp-3">{post.excerpt}</p>
        <p className="text-gray-500 text-xs">{post.publishedAt ? formatDate(post.publishedAt) : ''}</p>
      </div>
    </Link>
  );
}
