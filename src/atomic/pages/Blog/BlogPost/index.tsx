import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import * as blogApi from '@api/blog.api';
import Spinner from '@atoms/Spinner';
import { formatDate } from '@utils/formatters';

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const { data: post, isLoading } = useQuery({ queryKey: ['post', slug], queryFn: () => blogApi.getPostBySlug(slug!) });

  if (isLoading) return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;
  if (!post) return <div className="container-app py-20 text-center text-gray-400">Artículo no encontrado.</div>;

  const author = typeof post.author === 'object' ? post.author : null;

  return (
    <article className="container-app py-12 max-w-3xl">
      <header className="mb-8">
        <h1 className="section-title mb-4">{post.title}</h1>
        <div className="flex items-center gap-4 text-sm text-gray-400">
          {author && <span>{author.name}</span>}
          {post.publishedAt && <span>{formatDate(post.publishedAt)}</span>}
          <span>{post.readTime} min de lectura</span>
        </div>
      </header>
      {post.thumbnail && <img src={post.thumbnail} alt={post.title} className="w-full rounded-xl mb-8 aspect-video object-cover" />}
      <div className="prose prose-invert max-w-none text-gray-300 leading-relaxed" dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  );
}
