import { useState } from "react";
import { ChevronDown, X, MoreVertical } from "lucide-react";

// Fake comments para may display
const dummyComments = [
  { id: 1, user: "@JuanDelaCruz", text: "Wow, the stream is very smooth!", time: "2 mins ago", avatar: "J" },
  { id: 2, user: "@MariaClara", text: "Watching live from Baguio City!", time: "5 mins ago", avatar: "M" },
  { id: 3, user: "@TechGeek", text: "Sana walang buffer. Setup looks good.", time: "10 mins ago", avatar: "T" },
];

const CommentSection = () => {
  const [isMobileExpanded, setIsMobileExpanded] = useState(false);
  const [newComment, setNewComment] = useState("");

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    setNewComment("");
  };

  return (
    <>
      {/* MOBILE COLLAPSED PREVIEW (Nakatago kapag malaki ang screen lg:hidden) */}
      {!isMobileExpanded && (
        <div 
          onClick={() => setIsMobileExpanded(true)}
          className="mt-4 cursor-pointer rounded-xl bg-accent p-3 hover:bg-accent/80 lg:hidden"
        >
          <div className="flex items-center justify-between">
            <span className="font-semibold text-sm">
              Comments <span className="text-muted-foreground font-normal ml-1">124</span>
            </span>
            <ChevronDown className="h-5 w-5" />
          </div>
          <div className="mt-2 flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white shrink-0">
              {dummyComments[0].avatar}
            </div>
            <p className="text-xs text-foreground line-clamp-1">
              <span className="font-medium text-muted-foreground mr-2">{dummyComments[0].user}</span>
              {dummyComments[0].text}
            </p>
          </div>
        </div>
      )}

      {/* FULL COMMENT SECTION (Nakatago sa mobile kapag naka-minimize, pero laging bukas sa desktop) */}
      <div className={`mt-4 rounded-xl lg:block ${isMobileExpanded ? "block bg-background" : "hidden"}`}>
        
        {/* Header with Close Button (Para lang sa mobile) */}
        <div className="mb-4 flex items-center justify-between lg:mb-6">
          <h3 className="text-lg font-bold">
            Comments <span className="text-sm font-normal text-muted-foreground ml-1">124</span>
          </h3>
          <button 
            onClick={() => setIsMobileExpanded(false)} 
            className="rounded-full p-2 hover:bg-accent lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Input Box */}
        <form onSubmit={handleComment} className="mb-6 flex gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple-600 text-white font-bold">
            U
          </div>
          <div className="flex-1">
            <input
              type="text"
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="w-full border-b border-border bg-transparent pb-1 text-sm focus:border-foreground focus:outline-none"
            />
            <div className="mt-2 flex justify-end gap-2">
              <button 
                type="button" 
                className="rounded-full px-4 py-2 text-sm font-medium hover:bg-accent"
                onClick={() => setNewComment("")}
              >
                Cancel
              </button>
              <button 
                type="submit" 
                className={`rounded-full px-4 py-2 text-sm font-medium ${newComment ? 'bg-blue-600 text-white' : 'bg-accent text-muted-foreground'}`}
                disabled={!newComment}
              >
                Comment
              </button>
            </div>
          </div>
        </form>

        {/* Comment List */}
        <div className="flex flex-col gap-4">
          {dummyComments.map((comment) => (
            <div key={comment.id} className="flex gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">
                {comment.avatar}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[13px] font-medium text-muted-foreground">{comment.user}</span>
                  <span className="text-[12px] text-muted-foreground">{comment.time}</span>
                </div>
                <p className="mt-1 text-[14px]">{comment.text}</p>
              </div>
              <button className="h-fit rounded-full p-2 hover:bg-accent">
                <MoreVertical className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default CommentSection;
