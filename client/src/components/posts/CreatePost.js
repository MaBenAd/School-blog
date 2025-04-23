import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import PostContext from '../../context/post/postContext';
import AuthContext from '../../context/auth/authContext';
import AlertContext from '../../context/alert/alertContext';

const CreatePost = () => {
  const postContext = useContext(PostContext);
  const authContext = useContext(AuthContext);
  const alertContext = useContext(AlertContext);

  const { addPost } = postContext;
  const { isAuthenticated } = authContext;
  const { setAlert } = alertContext;
  
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      setAlert('Please log in to create a post', 'danger');
      navigate('/login');
    }
    // eslint-disable-next-line
  }, [isAuthenticated, navigate]);

  const [post, setPost] = useState({
    title: '',
    content: '',
    imageUrl: ''
  });

  const [imagePreview, setImagePreview] = useState(null);

  const { title, content, imageUrl } = post;

  const onChange = e => {
    if (e.target.name === 'imageUrl') {
      setPost({ ...post, [e.target.name]: e.target.value });
    } else {
      setPost({ ...post, [e.target.name]: e.target.value });
    }
  };

  const handleImageChange = e => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setPost({ ...post, imageUrl: reader.result });
      };
      reader.readAsDataURL(file);
    }
  };

  const onSubmit = e => {
    e.preventDefault();
    if (title.trim() === '' || content.trim() === '') {
      setAlert('Please fill in both title and content', 'danger');
    } else {
      addPost(post);
      setAlert('Post Created Successfully', 'success');
      navigate('/');
    }
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-6 text-center">Create New Post</h1>
          <form onSubmit={onSubmit}>
            <div className="mb-4">
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                Title
              </label>
              <input
                id="title"
                type="text"
                placeholder="Enter post title"
                name="title"
                value={title}
                onChange={onChange}
                className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              />
            </div>

            <div className="mb-4">
              <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                Image (Optional)
              </label>
              <div className="flex items-center space-x-4">
                <input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
                />
                <input
                  type="text"
                  placeholder="Or enter image URL"
                  name="imageUrl"
                  value={imageUrl}
                  onChange={onChange}
                  className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
              {imagePreview && (
                <div className="mt-2">
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="max-h-40 rounded-md object-cover"
                  />
                </div>
              )}
            </div>

            <div className="mb-6">
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-1">
                Content
              </label>
              <textarea
                id="content"
                placeholder="Write your post content here..."
                name="content"
                value={content}
                onChange={onChange}
                rows="10"
                className="w-full px-3 py-2 text-gray-700 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
                required
              ></textarea>
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
              >
                Create Post
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreatePost; 