import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Trash2, Plus, Tv, Pencil } from "lucide-react";
import { toast } from "sonner";
import data from "@/data.json";

interface AdminProps {
  sidebarExpanded: boolean;
}

const CATEGORIES = data.categories.filter((c) => c !== "All");
const TYPES = ["mpd", "hls", "youtube"];

const emptyForm = {
  name: "", logo: "", category: "Local", type: "mpd", url: "",
  clearKeyId: "", clearKeyValue: "", subscribers: "", views: "",
};

const Admin = ({ sidebarExpanded }: AdminProps) => {
  const queryClient = useQueryClient();
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState(emptyForm);
  const [editDialogOpen, setEditDialogOpen] = useState(false);

  const { data: channels = [], isLoading } = useQuery({
    queryKey: ["admin-channels"],
    queryFn: async () => {
      const { data: rows, error } = await supabase
        .from("channels")
        .select("*")
        .order("name", { ascending: true });
      if (error) throw error;
      return rows || [];
    },
  });

  const addMutation = useMutation({
    mutationFn: async () => {
      const clearKey = form.clearKeyId && form.clearKeyValue
        ? { [form.clearKeyId]: form.clearKeyValue } : null;
      const { error } = await supabase.from("channels").insert({
        name: form.name, logo: form.logo, category: form.category,
        type: form.type, url: form.url, clear_key: clearKey,
        subscribers: form.subscribers || "0", views: form.views || "0 watching",
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-channels"] });
      queryClient.invalidateQueries({ queryKey: ["channels"] });
      setForm(emptyForm);
      toast.success("Channel added!");
    },
    onError: (e: any) => toast.error(e.message),
  });

  const updateMutation = useMutation({
    mutationFn: async () => {
      if (!editingId) return;
      const clearKey = editForm.clearKeyId && editForm.clearKeyValue
        ? { [editForm.clearKeyId]: editForm.clearKeyValue } : null;
      const { error } = await supabase.from("channels").update({
        name: editForm.name, logo: editForm.logo, category: editForm.category,
        type: editForm.type, url: editForm.url, clear_key: clearKey,
        subscribers: editForm.subscribers || "0", views: editForm.views || "0 watching",
      }).eq("id", editingId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-channels"] });
      queryClient.invalidateQueries({ queryKey: ["channels"] });
      setEditDialogOpen(false);
      setEditingId(null);
      toast.success("Channel updated!");
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
    if (!form.name || !form.url) { toast.error("Name and URL are required"); return; }
    addMutation.mutate();
  };

  const openEdit = (ch: any) => {
    const ck = ch.clear_key ? Object.entries(ch.clear_key)[0] : [undefined, undefined];
    setEditingId(ch.id);
    setEditForm({
      name: ch.name || "", logo: ch.logo || "", category: ch.category || "Local",
      type: ch.type || "mpd", url: ch.url || "",
      clearKeyId: (ck?.[0] as string) || "", clearKeyValue: (ck?.[1] as string) || "",
      subscribers: ch.subscribers || "", views: ch.views || "",
    });
    setEditDialogOpen(true);
  };

  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editForm.name || !editForm.url) { toast.error("Name and URL are required"); return; }
    updateMutation.mutate();
  };

  const FormFields = ({ f, setF }: { f: typeof form; setF: React.Dispatch<React.SetStateAction<typeof form>> }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      <Input placeholder="Channel Name *" value={f.name} onChange={(e) => setF((p) => ({ ...p, name: e.target.value }))} />
      <Input placeholder="Logo URL" value={f.logo} onChange={(e) => setF((p) => ({ ...p, logo: e.target.value }))} />
      <Select value={f.category} onValueChange={(v) => setF((p) => ({ ...p, category: v }))}>
        <SelectTrigger><SelectValue /></SelectTrigger>
        <SelectContent>{CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
      </Select>
      <Select value={f.type} onValueChange={(v) => setF((p) => ({ ...p, type: v }))}>
        <SelectTrigger><SelectValue /></SelectTrigger>
        <SelectContent>{TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
      </Select>
      <Input placeholder="Stream URL *" className="sm:col-span-2" value={f.url} onChange={(e) => setF((p) => ({ ...p, url: e.target.value }))} />
      <Input placeholder="ClearKey ID (optional)" value={f.clearKeyId} onChange={(e) => setF((p) => ({ ...p, clearKeyId: e.target.value }))} />
      <Input placeholder="ClearKey Value (optional)" value={f.clearKeyValue} onChange={(e) => setF((p) => ({ ...p, clearKeyValue: e.target.value }))} />
      <Input placeholder="Subscribers (e.g. 1.5M)" value={f.subscribers} onChange={(e) => setF((p) => ({ ...p, subscribers: e.target.value }))} />
      <Input placeholder="Views (e.g. 5K watching)" value={f.views} onChange={(e) => setF((p) => ({ ...p, views: e.target.value }))} />
    </div>
  );

  return (
    <div className={`min-h-screen pt-14 pb-20 sm:pb-8 transition-all duration-200 ${sidebarExpanded ? "md:ml-60" : "md:ml-[72px]"}`}>
      <div className="mx-auto max-w-4xl px-4 py-6">
        <div className="flex items-center gap-3 mb-6">
          <Tv className="h-7 w-7 text-primary" />
          <h1 className="text-2xl font-bold">Admin Panel</h1>
        </div>

        <form onSubmit={handleSubmit} className="rounded-xl border border-border bg-card p-4 sm:p-6 mb-8">
          <h2 className="text-lg font-semibold mb-4">Add New Channel</h2>
          <FormFields f={form} setF={setForm} />
          <Button type="submit" className="mt-4 w-full sm:w-auto" disabled={addMutation.isPending}>
            <Plus className="h-4 w-4 mr-2" />{addMutation.isPending ? "Adding..." : "Add Channel"}
          </Button>
        </form>

        <div className="rounded-xl border border-border bg-card">
          <div className="p-4 sm:p-6 border-b border-border">
            <h2 className="text-lg font-semibold">Database Channels ({channels.length})</h2>
          </div>
          {isLoading ? (
            <div className="p-8 text-center text-muted-foreground">Loading...</div>
          ) : channels.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground">No channels yet.</div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead className="hidden sm:table-cell">Category</TableHead>
                    <TableHead className="hidden sm:table-cell">Type</TableHead>
                    <TableHead className="w-[100px]"></TableHead>
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
                        <div className="flex gap-1">
                          <Button variant="ghost" size="icon" onClick={() => openEdit(ch)}>
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => deleteMutation.mutate(ch.id)} disabled={deleteMutation.isPending}>
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </div>
      </div>

      <Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Channel</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit}>
            <FormFields f={editForm} setF={setEditForm} />
            <Button type="submit" className="mt-4 w-full" disabled={updateMutation.isPending}>
              {updateMutation.isPending ? "Saving..." : "Save Changes"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Admin;
