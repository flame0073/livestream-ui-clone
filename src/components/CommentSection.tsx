import { useState, useEffect, useCallback } from "react";
import { X, SlidersHorizontal } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

interface Comment {
  id: string;
  user_id: string;
  text: string;
  created_at: string;
  email?: string;
}

interface CommentSectionProps {
  channelName: string;
}

const CommentSection = ({ channelName }: CommentSectionProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [comments, setComments] = useState<Comment[]>([]);
  const { user } = useAuth();

  const fetchComments = useCallback(async () => {
    const { data } = await supabase
      .from("comments")
      .select("id, user_id, text, created_at")
      .eq("channel_name", channelName)
      .order("created_at", { ascending: false });

    if (data) {
      // Fetch emails from profiles
      const userIds = [...new Set(data.map(c => c.user_id))];
      const { data: profiles } = await supabase
        .from("profiles")
        .select("user_id, email")
        .in("user_id", userIds);

      const emailMap = new Map(profiles?.map(p => [p.user_id, p.email]) || []);
      setComments(data.map(c => ({ ...c, email: emailMap.get(c.user_id) || "User" })));
    }
  }, [channelName]);

  useEffect(() => { fetchComments(); }, [fetchComments]);

  // Realtime subscription
  useEffect(() => {
    const channel = supabase
      .channel(`comments-${channelName}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'comments', filter: `channel_name=eq.${channelName}` }, () => {
        fetchComments();
      })
      .subscribe();

    return () => { supabase.removeChannel(channel); };
  }, [channelName, fetchComments]);

  useEffect(() => {
    if (isOpen && window.innerWidth < 1024) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  const handleComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim() || !user) return;

    await supabase.from("comments").insert({
      user_id: user.id,
      channel_name: channelName,
      text: newComment,
    });
    setNewComment("");
  };

  const timeAgo = (date: string) => {
    const diff = Date.now() - new Date(date).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return "Just now";
    if (mins < 60) return `${mins}m ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}h ago`;
    return `${Math.floor(hrs / 24)}d ago`;
  };

  const getInitial = (email?: string) => (email ? email[0].toUpperCase() : "U");
  const getDisplayName = (email?: string) => {
    if (!email) return "@User";
    return `@${email.split("@")[0]}`;
  };

  const topComment = comments[0];

  return (
    <>
      {/* MOBILE PREVIEW BOX */}
      <div
        onClick={() => setIsOpen(true)}
        className="mt-4 cursor-pointer rounded-xl bg-accent p-3 hover:bg-accent/80 lg:hidden"
      >
        <div className="flex items-center justify-between">
          <span className="font-bold text-sm">
            Comments <span className="text-muted-foreground font-normal ml-1">{comments.length}</span>
          </span>
        </div>
        {topComment && (
          <div className="mt-2 flex items-center gap-2">
            <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue-600 text-[10px] font-bold text-white">
              {getInitial(topComment.email)}
            </div>
            <p className="text-xs text-foreground line-clamp-2">
              <span className="font-medium text-muted-foreground mr-2">{getDisplayName(topComment.email)}</span>
              {topComment.text}
            </p>
          </div>
        )}
      </div>

      {/* FULL COMMENT SECTION */}
      <div className={`
        fixed bottom-0 left-0 right-0 z-50 flex flex-col bg-background transition-transform duration-300 ease-in-out
        top-[56.25vw] sm:top-14
        lg:static lg:block lg:h-auto lg:w-full lg:transform-none lg:bg-transparent lg:z-auto lg:mt-6 lg:border-none
        ${isOpen ? 'translate-y-0' : 'translate-y-full lg:translate-y-0'}
      `}>
        <div className="flex shrink-0 items-center justify-between border-b border-border p-4 lg:p-0 lg:mb-6 lg:border-none">
          <h3 className="text-lg font-bold flex items-center gap-2">
            Comments <span className="text-sm font-normal text-muted-foreground">{comments.length}</span>
          </h3>
          <div className="flex items-center gap-4">
            <button className="hidden lg:flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground">
              <SlidersHorizontal className="h-4 w-4" />
              Sort by
            </button>
            <button onClick={() => setIsOpen(false)} className="rounded-full p-2 hover:bg-accent lg:hidden">
              <X className="h-6 w-6" />
            </button>
          </div>
        </div>

        {/* Desktop Input */}
        {user ? (
          <form onSubmit={handleComment} className="hidden lg:flex gap-4 mb-8">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple-600 text-white font-bold">
              {getInitial(user.email)}
            </div>
            <div className="flex-1">
              <input type="text" placeholder="Add a comment..." value={newComment} onChange={(e) => setNewComment(e.target.value)}
                className="w-full border-b border-border bg-transparent pb-1 text-sm focus:border-foreground focus:outline-none" />
              <div className="mt-2 flex justify-end gap-2">
                <button type="button" className="rounded-full px-4 py-2 text-sm font-medium hover:bg-accent" onClick={() => setNewComment("")}>Cancel</button>
                <button type="submit" className={`rounded-full px-4 py-2 text-sm font-medium ${newComment ? 'bg-blue-600 text-white' : 'bg-accent text-muted-foreground'}`} disabled={!newComment}>Comment</button>
              </div>
            </div>
          </form>
        ) : (
          <p className="hidden lg:block text-sm text-muted-foreground mb-8">
            <a href="/auth" className="text-primary hover:underline">Sign in</a> to comment.
          </p>
        )}

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto p-4 lg:p-0 pb-[72px] lg:pb-0">
          <div className="flex flex-col gap-6">
            {comments.map((comment) => (
              <div key={comment.id} className="flex gap-3 lg:gap-4">
                <div className="flex h-8 w-8 lg:h-10 lg:w-10 shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs lg:text-sm font-bold text-white">
                  {getInitial(comment.email)}
                </div>
                <div className="flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className="text-[13px] font-medium text-muted-foreground">{getDisplayName(comment.email)}</span>
                    <span className="text-[12px] text-muted-foreground">{timeAgo(comment.created_at)}</span>
                  </div>
                  <p className="mt-0.5 text-[14px]">{comment.text}</p>
                </div>
              </div>
            ))}
            {comments.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">No comments yet. Be the first!</p>
            )}
          </div>
        </div>

        {/* Mobile Input */}
        <div className="absolute bottom-0 left-0 right-0 border-t border-border bg-background p-3 lg:hidden">
          {user ? (
            <form onSubmit={handleComment} className="flex gap-3 items-center">
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-purple-600 text-white text-xs font-bold">
                {getInitial(user.email)}
              </div>
              <input type="text" placeholder="Add a comment..." value={newComment} onChange={(e) => setNewComment(e.target.value)}
                className="flex-1 rounded-full border border-border bg-accent/50 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none" />
              <button type="submit" disabled={!newComment.trim()} className="font-medium text-sm text-blue-500 disabled:opacity-50 px-2">
                <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path></svg>
              </button>
            </form>
          ) : (
            <p className="text-sm text-muted-foreground text-center">
              <a href="/auth" className="text-primary hover:underline">Sign in</a> to comment.
            </p>
          )}
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div onClick={() => setIsOpen(false)} className="fixed inset-0 z-40 bg-black/50 lg:hidden" style={{ top: '56.25vw' }} />
      )}
    </>
  );
};

export default CommentSection;
