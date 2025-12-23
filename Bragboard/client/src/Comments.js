import React, { useEffect, useState } from 'react';

function Comments() {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [newComment, setNewComment] = useState('');
  const [usingMock, setUsingMock] = useState(false);

  const fetchComments = async () => {
    try {
      const response = await fetch('http://localhost:8000/comments/1');
      if (!response.ok) {
        throw new Error('API server not running');
      }
      const data = await response.json();
      setComments(data);
      setUsingMock(false);
    } catch (error) {
      // Fallback to mock data for demo
      setComments([
        { id: 1, shoutout_id: 1, user_id: 1, content: "This is a mock comment - API not running" }
      ]);
      setUsingMock(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const handleAddComment = (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    if (usingMock) {
      // Mock add for demo
      const newCommentObj = {
        id: comments.length + 1,
        shoutout_id: 1,
        user_id: 1,
        content: newComment
      };
      setComments([...comments, newCommentObj]);
      setNewComment('');
      return;
    }

    // Real API call
    fetch('http://localhost:8000/comments/1', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ content: newComment })
    })
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to add comment');
        }
        return response.json();
      })
      .then(() => {
        setNewComment('');
        fetchComments();
      })
      .catch(error => {
        setError(error.message);
      });
  };

  if (loading) return <div>Loading comments...</div>;

  return (
    <div>
      <h1>Comments for Shoutout 1</h1>
      {usingMock && <p style={{color: 'orange'}}>⚠️ Using mock data - API server not running</p>}
      {error && <p style={{color: 'red'}}>Error: {error}</p>}
      <ul>
        {comments.map(comment => (
          <li key={comment.id}>
            <strong>User {comment.user_id}:</strong> {comment.content}
          </li>
        ))}
      </ul>
      <form onSubmit={handleAddComment}>
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment"
          required
        />
        <button type="submit">Add Comment</button>
      </form>
    </div>
  );
}

export default Comments;
