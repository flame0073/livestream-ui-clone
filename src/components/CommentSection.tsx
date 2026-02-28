import { useState } from "react";
import { ThumbsUp, ThumbsDown, User } from "lucide-react";

const dummyComments = [
  {
    id: 1,
    user: "Alex Rivera",
    avatar: null,
    text: "Stream is very smooth! Great quality 🔥",
    time: "2 minutes ago",
    likes: 42,
  },
  {
    id: 2,
    user: "Sarah Chen",
    avatar: null,
    text: "Watching live now, this is amazing content!",
    time: "5 minutes ago",
    likes: 18,
  },
  {
    id: 3,
    user: "Mike Johnson",
    avatar: null,
    text: "Best live stream on the platform 👏",
    time: "12 minutes ago",
    likes: 7,
  },
  {
    id: 4,
    user: "Priya Sharma",
    avatar: null,
    text: "Can someone share the schedule for tomorrow?",
    time: "20 minutes ago",
    likes: 3,
  },
  {
    id: 5,
    user: "James Lee",
    avatar: null,
    text: "Just tuned in. What did I miss?",
    time: "31 minutes ago",
    likes: 1,
  },
];

const CommentSection = () => {
  const [comments, setComments] = useState(dummyComments);
  const [newComment, setNewComment] = useState("");

  const handleSubmit = () => {
    if (!newComment.trim()) return;
    setComments([
      {
        id: Date.now(),
        user: "You",
        avatar: null,
        text: newComment,
        time: "Just now",
        likes: 0,
      },
      ...comments,
    ]);
    setNewComment("");
  };

  return (
    <div className="mt-6">
      <h2 className="mb-5 text-base font-medium">
        {comments.length} Comments
      </h2>

      {/* Add comment */}
      <div className="mb-6 flex gap-3">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-accent">
          <User className="h-5 w-5" />
        </div>
        <div className="flex-1">
          <input
            type="text"
            placeholder="Add a comment..."
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
            className="w-full border-b border-border bg-transparent py-1 text-sm text-foreground placeholder:text-muted-foreground focus:border-foreground focus:outline-none"
          />
          {newComment && (
            <div className="mt-2 flex justify-end gap-2">
              <button
                onClick={() => setNewComment("")}
                className="rounded-full px-4 py-2 text-sm font-medium hover:bg-accent"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                className="rounded-full bg-blue-500 px-4 py-2 text-sm font-medium text-foreground hover:bg-blue-600"
              >
                Comment
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Comments list */}
      <div className="space-y-4">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-3">
            <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-accent text-xs font-medium">
              {comment.user.charAt(0)}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-[13px] font-medium">
                  @{comment.user.replace(/\s/g, "").toLowerCase()}
                </span>
                <span className="text-xs text-muted-foreground">
                  {comment.time}
                </span>
              </div>
              <p className="mt-0.5 text-sm">{comment.text}</p>
              <div className="mt-1 flex items-center gap-3">
                <button className="flex items-center gap-1 text-muted-foreground hover:text-foreground">
                  <ThumbsUp className="h-4 w-4" />
                  <span className="text-xs">{comment.likes || ""}</span>
                </button>
                <button className="text-muted-foreground hover:text-foreground">
                  <ThumbsDown className="h-4 w-4" />
                </button>
                <button className="text-xs font-medium text-muted-foreground hover:text-foreground">
                  Reply
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CommentSection;
