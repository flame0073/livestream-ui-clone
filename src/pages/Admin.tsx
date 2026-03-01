import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Trash2, Plus, Tv } from "lucide-react";
import { toast } from "sonner";
import data from "@/data.json";

interface AdminProps {
  sidebarExpanded: boolean;
}

const CATEGORIES = data.categories.filter((c) => c !== "All");
const TYPES = ["mpd", "hls", "youtube"];

const Admin = ({ sidebarExpanded }: AdminProps) => {
  const queryClient = useQueryClient();
  const [form, setForm] = useState({
    name: "",
    logo: "",
    category: "Local",
    type: "mpd",
    url: "",
    clearKeyId: "",
    clearKeyValue: "",
    subscribers: "",
    views: "",
  });

  const { data: channels = [], isLoading } = useQuery({
    queryKey: ["admin-channels"],
    queryFn: async () => {
      const { data: rows, error } = await supabase
        .from("channels")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return rows || [];
    },
  });

  const addMutation = useMutation({
    mutationFn: async () => {
      const clearKey =
        form.clearKeyId && form.clearKeyValue
          ? { [form.clearKeyId]: form.clearKeyValue }
          : null;

      const { error } = await supabase.from("channels").insert({
        name: form.name,
        logo: form.logo,
        category: form.category,
        type: form.type,
        url: form.url,
        clear_key: clearKey,
        subscribers: form.subscribers || "0",
        views: form.views || "0 watching",
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-channels"] });
      queryClient.invalidateQueries({ queryKey: ["channels"] });
      setForm({ name: "", logo: "", category: "Local", type: "mpd", url: "", clearKeyId: "", clearKeyValue: "", subscribers: "", views: "" });
      toast.success("Channel added!");
    },
    onError: (e: any) => toast.error(e.message),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("channels").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-channels"] });
      queryClient.invalidateQueries({ queryKey: ["channels"] });
      toast.success("Channel deleted!");
    },
    onError: (e: any) => toast.error(e.message),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.url) {
      toast.error("Name and URL are required");
      return;
    }
    addMutation.mutate();
  };

  return (
    <div className={`min-h-screen pt-14 pb-20 sm:pb-8 transition-all duration-200 ${sidebarExpanded ? "md:ml-60" : "md:ml-[72px]"}`}>
      <div className="mx-auto max-w-4xl px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <Tv className="h-7 w-7 text-primary" />
          <h1 className="text-2xl font-bold">Admin Panel</h1>
        </div>

        {/* Add Channel Form */}
        <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-card p-4 sm:p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Add New Channel</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input placeholder="Channel Name *" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} />
            <Input placeholder="Logo URL" value={form.logo} onChange={(e) => setForm((f) => ({ ...f, logo: e.target.value }))} />
            <Select value={form.category} onValueChange={(v) => setForm((f) => ({ ...f, category: v }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>{c}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={form.type} onValueChange={(v) => setForm((f) => ({ ...f, type: v }))}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                {TYPES.map((t) => (
                  <SelectItem key={t} value={t}>{t}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Input placeholder="Stream URL *" className="sm:col-span-2" value={form.url} onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))} />
            <Input placeholder="ClearKey ID (optional)" value={form.clearKeyId} onChange={(e) => setForm((f) => ({ ...f, clearKeyId: e.target.value }))} />
            <Input placeholder="ClearKey Value (optional)" value={form.clearKeyValue} onChange={(e) => setForm((f) => ({ ...f, clearKeyValue: e.target.value }))} />
            <Input placeholder="Subscribers (e.g. 1.5M)" value={form.subscribers} onChange={(e) => setForm((f) => ({ ...f, subscribers: e.target.value }))} />
            <Input placeholder="Views (e.g. 5K watching)" value={form.views} onChange={(e) => setForm((f) => ({ ...f, views: e.target.value }))} />
          </div>
          <Button type="submit" className="mt-4 w-full sm:w-auto" disabled={addMutation.isPending}>
            <Plus className="h-4 w-4 mr-2" />
            {addMutation.isPending ? "Adding..." : "Add Channel"}
          </Button>
        </form>

        {/* Channel List */}
        <div className="rounded-xl border border-border bg-card">
          <div className="p-4 sm:p-6 border-b border-border">
            <h2 className="text-lg font-semibold">Database Channels ({channels.length})</h2>
            <p className="text-sm text-muted-foreground mt-1">Channels added via admin panel. JSON channels are not shown here.</p>
          </div>
          {isLoading ? (
            <div className="p-8 text-center text-muted-foreground">Loading...</div>
          ) : channels.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">No channels added yet. Use the form above to add one.</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead className="hidden sm:table-cell">Category</TableHead>
                    <TableHead className="hidden sm:table-cell">Type</TableHead>
                    <TableHead className="w-[60px]"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {channels.map((ch: any) => (
                    <TableRow key={ch.id}>
                      <TableCell className="font-medium">
                        <div className="flex items-center gap-2">
                          {ch.logo && <img src={ch.logo} alt="" className="h-6 w-6 rounded object-contain" />}
                          {ch.name}
                        </div>
                      </TableCell>
                      <TableCell className="hidden sm:table-cell">{ch.category}</TableCell>
                      <TableCell className="hidden sm:table-cell">{ch.type}</TableCell>
                      <TableCell>
                        <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(ch.id)} disabled={deleteMutation.isPending}>
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Admin;
