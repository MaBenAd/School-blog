import React, { useContext, useEffect } from 'react';
import PostContext from '../../context/post/postContext';
import Post from '../posts/Post';
import AuthContext from '../../context/auth/authContext';
import Spinner from '../layout/Spinner';

const Home = () => {
  const postContext = useContext(PostContext);
  const authContext = useContext(AuthContext);
  
  const { posts, getPosts, loading } = postContext;
  const { isAuthenticated } = authContext;

  useEffect(() => {
    if (localStorage.token) {
      authContext.loadUser();
    }
    getPosts();
    // eslint-disable-next-line
  }, []);

  if (loading && posts.length === 0) {
    return <Spinner />;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Latest Posts</h1>
        {posts.length === 0 ? (
          <p className="text-gray-500">No posts to display. Be the first to create one!</p>
        ) : (
          <div className="space-y-6">
            {posts.map(post => (
              <Post key={post._id} post={post} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home; 