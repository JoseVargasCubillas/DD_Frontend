import { useQuery } from '@tanstack/react-query';
import BlogCard from '@molecules/BlogCard';
import Spinner from '@atoms/Spinner';
import * as blogApi from '@api/blog.api';

export default function BlogList() {
  const { data, isLoading } = useQuery({ queryKey: ['posts'], queryFn: () => blogApi.getPosts() });

  return (
    <div className="container-app py-12">
      <h1 className="section-title mb-8">Blog</h1>
      {isLoading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" /></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.data.map((post) => <BlogCard key={post.id ?? post._id} post={post} />)}
        </div>
      )}
    </div>
  );
}
