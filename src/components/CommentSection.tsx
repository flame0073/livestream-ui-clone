import { useState, useEffect } from "react";
import { X, SlidersHorizontal } from "lucide-react";

// Fake comments list
const dummyComments = [
  { id: 1, user: "@JuanDelaCruz", text: "Wow, the stream is very smooth!", time: "2 mins ago", avatar: "J" },
  { id: 2, user: "@MariaClara", text: "Watching live from Baguio City!", time: "5 mins ago", avatar: "M" },
  { id: 3, user: "@TechGeek", text: "Sana walang buffer. Setup looks good.", time: "10 mins ago", avatar: "T" },
  { id: 4, user: "@Flame143", text: "Ganda ng UI, parang totoo!", time: "15 mins ago", avatar: "F" },
  { id: 5, user: "@PinoyDev", text: "Keep it up bro!", time: "25 mins ago", avatar: "P" },
  { id: 6, user: "@StreamerHub", text: "Galing ng pagkaka-code nito.", time: "30 mins ago", avatar: "S" },
  { id: 7, user: "@User9921", text: "Testing comment section kung gumagana ba yung scroll.", time: "1 hr ago", avatar: "U" }
];

const CommentSection = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState(dummyComments);

  // Pinipigilan natin ang pag-scroll ng background kapag nakabukas ang comments sa mobile
  useEffect(() => {
    if (isOpen && window.innerWidth < 1024) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const myMsg = {
      id: Date.now(),
      user: "@You",
      text: newComment,
      time: "Just now",
      avatar: "Y",
    };

    setComments([myMsg, ...comments]); // Idadagdag ang comment mo sa pinakataas
    setNewComment("");
  };

  const topComment = comments[0]; // Kukunin natin ang pinakaunang comment para sa preview

  return (
    <>
      {/* 1. MOBILE PREVIEW BOX (Ito yung maliit na box bago mo i-click) */}
      <div 
        onClick={() => setIsOpen(true)}
        className="mt-4 cursor-pointer rounded-xl bg-accent p-3 hover:bg-accent/80 lg:hidden"
      >
        <div className="flex items-center justify-between">
          <span className="font-bold text-sm">
            Comments <span className="text-muted-foreground font-normal ml-1">{comments.length}</span>
          </span>
        </div>
        <div className="mt-2 flex items-center gap-2">
          <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
            {topComment.avatar}
          </div>
          <p className="text-xs text-foreground line-clamp-2">
            <span className="font-medium text-muted-foreground mr-2">{topComment.user}</span>
            {topComment.text}
          </p>
        </div>
      </div>

      {/* 2. FULL COMMENT MODAL (Bottom Sheet sa Mobile / Normal List sa Desktop) */}
      <div className={`
        fixed bottom-0 left-0 right-0 z-50 flex flex-col bg-background transition-transform duration-300 ease-in-out
        top-[56.25vw] sm:top-14 /* top-[56.25vw] ang saktong height ng video sa mobile para hindi niya matabunan ang player */
        lg:static lg:block lg:h-auto lg:w-full lg:transform-none lg:bg-transparent lg:z-auto lg:mt-6 lg:border-none
        ${isOpen ? 'translate-y-0' : 'translate-y-full lg:translate-y-0'}
      `}>
        
        {/* Header nung nag-pop up na comment box */}
        <div className="flex shrink-0 items-center justify-between border-b border-border p-4 lg:p-0 lg:mb-6 lg:border-none">
          <h3 className="text-lg font-bold flex items-center gap-2">
            Comments <span className="text-sm font-normal text-muted-foreground">{comments.length}</span>
          </h3>
          <div className="flex items-center gap-4">
            <button className="hidden lg:flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground">
              <SlidersHorizontal className="h-4 w-4" />
              Sort by
            </button>
            {/* Close Button (Lilitaw lang sa Mobile) */}
            <button 
              onClick={() => setIsOpen(false)} 
              className="rounded-full p-2 hover:bg-accent lg:hidden"
            >
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Desktop Input Box (Nakatago sa Mobile) */}
        <form onSubmit={handleComment} className="hidden lg:flex gap-4 mb-8">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple-600 text-white font-bold">
            Y
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

        {/* Listahan ng mga Comments */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-0 pb-[72px] lg:pb-0">
          <div className="flex flex-col gap-6">
            {comments.map((comment) => (
              <div key={comment.id} className="flex gap-3 lg:gap-4">
                <div className="flex h-8 w-8 lg:h-10 lg:w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs lg:text-sm font-bold text-white">
                  {comment.avatar}
                </div>
                <div className="flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-[13px] font-medium text-muted-foreground">{comment.user}</span>
                    <span className="text-[12px] text-muted-foreground">{comment.time}</span>
                  </div>
                  <p className="mt-0.5 text-[14px]">{comment.text}</p>
                  
                  {/* YouTube Comment Action Buttons */}
                  <div className="mt-2 flex items-center gap-4 text-muted-foreground">
                    <button className="flex items-center gap-1 hover:text-foreground">
                        <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current"><path d="M1 21h4V9H1v12zm22-11c0-1.1-.9-2-2-2h-6.31l.95-4.57.03-.32c0-.41-.17-.79-.44-1.06L14.17 1 7.59 7.59C7.22 7.95 7 8.45 7 9v10c0 1.1.9 2 2 2h9c.83 0 1.54-.5 1.84-1.22l3.02-7.05c.09-.23.14-.47.14-.73v-2z"></path></svg>
                    </button>
                    <button className="flex items-center gap-1 hover:text-foreground">
                        <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current"><path d="M15 3H6c-.83 0-1.54.5-1.84 1.22l-3.02 7.05c-.09.23-.14.47-.14.73v2c0 1.1.9 2 2 2h6.31l-.95 4.57-.03.32c0 .41.17.79.44 1.06L9.83 23l6.59-6.59c.36-.36.58-.86.58-1.41V5c0-1.1-.9-2-2-2zm4 0v12h4V3h-4z"></path></svg>
                    </button>
                    <button className="text-[12px] font-medium hover:text-foreground">Reply</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Mobile Input Box (Laging nakadikit sa ilalim ng comment box) */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-border bg-background p-3 lg:hidden">
          <form onSubmit={handleComment} className="flex gap-3 items-center">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple-600 text-white text-xs font-bold">
              Y
            </div>
            <input
              type="text"
              placeholder="Add a comment..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="flex-1 rounded-full border border-border bg-accent/50 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
            />
            <button 
              type="submit" 
              disabled={!newComment.trim()}
              className="font-medium text-sm text-blue-500 disabled:opacity-50 px-2"
            >
              <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path></svg>
            </button>
          </form>
        </div>
      </div>

      {/* 3. DARK OVERLAY BACKGROUND (Para lalong maging kitang-kita yung comment box) */}
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          style={{ top: '56.25vw' }} /* Magsisimula lang ang itim na overlay sa ilalim ng video */
        />
      )}
    </>
  );
};

export default CommentSection;
