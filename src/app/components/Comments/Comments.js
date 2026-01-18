"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { UserCircle, Heart } from "lucide-react";

export default function Comments({ slug, user }) {
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [replyText, setReplyText] = useState({});
  const [replyOpen, setReplyOpen] = useState({});

  // Fetch all comments for this post
  const fetchComments = async () => {
    if (!slug) return; // prevent fetch if slug not ready
    try {
      const res = await axios.get(`/api/posts/${slug}/comments`, { withCredentials: true });
      setComments(res.data);
    } catch (err) {
      console.error("Fetch Comments Error:", err);
    }
  };

 
    const [currentUser, setCurrentUser] = useState(null);
    const [userLoading, setUserLoading] = useState(true);

    useEffect(() => {
      fetchComments();
    }, [slug]); 

    useEffect(() => {
      const fetchUser = async () => {
        try {
          const res = await axios.get(`/api/auth/me`, { withCredentials: true });
          setCurrentUser(res.data.user || null);
        } catch (err) {
          setCurrentUser(null);
        } finally {
          setUserLoading(false);
        }
      };

      fetchUser();
    }, []);

    const handleComment = async (parentComment = null) => {
    try {
        if (!currentUser) {
          alert("You must be logged in to comment.");
          return;
        }

        const content = parentComment ? replyText[parentComment] : text;
        if (!content?.trim()) return;

        await axios.post(
          `/api/posts/${slug}/comments`,
          { text: content, parentComment },
          { withCredentials: true }
        );

        if (parentComment) {
          setReplyText(prev => ({ ...prev, [parentComment]: "" }));
          setReplyOpen(prev => ({ ...prev, [parentComment]: false }));
        } else {
          setText("");
        }

        fetchComments(); // refresh comments
    } catch (err) {
      console.error("Add Comment Error:", err);
    }
  };

  // Like / unlike a comment or reply
  const toggleLike = async (commentId) => {
    try {
      if (!currentUser) {
        alert("You must be logged in to like comments.");
        return;
      }

      await axios.put(
        `/api/posts/${slug}/comments`,
        { commentId },
        { withCredentials: true }
      );

      // Re-fetch comments to get authoritative like counts
      fetchComments();
    } catch (err) {
      console.error("Like Comment Error:", err);
    }
  };

  return (
    <div className="mt-6">
      <h3 className="font-semibold mb-4 text-lg">Comments</h3>

      {/* Add new comment */}
      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Add a comment..."
          className="flex-1 border rounded px-3 py-2 focus:outline-none"
          value={text}
          onChange={(e) => setText(e.target.value)}
          disabled={!currentUser}
        />
        <button
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition disabled:opacity-60"
          onClick={() => handleComment()}
          disabled={!currentUser}
        >
          {currentUser ? "Comment" : "Login to comment"}
        </button>
      </div>

      {/* List comments */}
      {comments.map(c => (
        <div key={c._id} className="mb-4 border-b pb-2">
          <div className="flex items-center gap-2 mb-1">
            <UserCircle size={18} />
            <span className="font-medium">{c.user.name}</span>
            <span className="text-xs text-gray-500">
              {new Date(c.createdAt).toLocaleString()}
            </span>
          </div>
          <p className="mb-1">{c.text}</p>

          <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
            <button
              onClick={() => toggleLike(c._id)}
              className="flex items-center gap-1 hover:text-red-500 transition"
            >
              <Heart size={12} className={c.likes?.some(id => id?.toString() === currentUser?._id?.toString()) ? "text-red-500" : ""} />
              <span>{c.likes?.length || 0}</span>
            </button>
            <button onClick={() => setReplyOpen(prev => ({ ...prev, [c._id]: !prev[c._id] }))}>
              {currentUser ? "Reply" : "Login to reply"}
            </button>
          </div>

          {/* Reply input */}
          {replyOpen[c._id] && (
            <div className="flex gap-2 mb-2 ml-6">
              <input
                type="text"
                placeholder="Write a reply..."
                className="flex-1 border rounded px-3 py-1 focus:outline-none"
                value={replyText[c._id] || ""}
                onChange={(e) => setReplyText(prev => ({ ...prev, [c._id]: e.target.value }))}
              />
              <button
                className="px-3 py-1 bg-indigo-500 text-white rounded hover:bg-indigo-600 transition"
                onClick={() => handleComment(c._id)}
              >
                Reply
              </button>
            </div>
          )}

          {/* Nested replies */}
          {c.replies?.map(r => (
            <div key={r._id} className="ml-6 border-l pl-2 mb-1">
              <div className="flex items-center gap-2 mb-1">
                <UserCircle size={16} />
                <span className="font-medium">{r.user.name}</span>
                <span className="text-xs text-gray-500">
                  {new Date(r.createdAt).toLocaleString()}
                </span>
              </div>
              <p>{r.text}</p>
              <div className="flex items-center gap-4 text-xs text-gray-500 mb-2">
                <button
                  onClick={() => toggleLike(r._id)}
                  className="flex items-center gap-1 hover:text-red-500 transition"
                >
                  <Heart size={12} className={r.likes?.some(id => id?.toString() === currentUser?._id?.toString()) ? "text-red-500" : ""} />
                  <span>{r.likes?.length || 0}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      ))}
    </div>
  );
}
