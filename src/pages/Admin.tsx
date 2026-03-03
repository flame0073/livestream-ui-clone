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

// FIX 1: Inilabas ko ang FormFields sa labas ng Admin component para hindi mag-glitch at mawalan ng focus kapag nagta-type ka!
const FormFields = ({ f, setF }: { f: typeof emptyForm; setF: React.Dispatch<React.SetStateAction<typeof emptyForm>> }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
    <Input placeholder="Channel Name *" value={f.name} onChange={(e) => setF((p) => ({ ...p, name: e.target.value }))} />
    <Input placeholder="Logo URL" value={f.logo} onChange={(e) => setF((p) => ({ ...p, logo: e.target.value }))} />
    <Select value={f.category} onValueChange={(v) => setF((p) => ({ ...p, category: v }))}>
      <SelectTrigger><SelectValue placeholder="Category" /></SelectTrigger>
      <SelectContent>{CATEGORIES.map((c) => <SelectItem key={c} value={c}>{c}</SelectItem>)}</SelectContent>
    </Select>
    <Select value={f.type} onValueChange={(v) => setF((p) => ({ ...p, type: v }))}>
      <SelectTrigger><SelectValue placeholder="Stream Type" /></SelectTrigger>
      <SelectContent>{TYPES.map((t) => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
    </Select>
    <Input placeholder="Stream URL *" className="sm:col-span-2" value={f.url} onChange={(e) => setF((p) => ({ ...p, url: e.target.value }))} />
    <Input placeholder="ClearKey ID (optional)" value={f.clearKeyId} onChange={(e) => setF((p) => ({ ...p, clearKeyId: e.target.value }))} />
    <Input placeholder="ClearKey Value (optional)" value={f.clearKeyValue} onChange={(e) => setF((p) => ({ ...p, clearKeyValue: e.target.value }))} />
    <Input placeholder="Subscribers (e.g. 1.5M)" value={f.subscribers} onChange={(e) => setF((p) => ({ ...p, subscribers: e.target.value }))} />
    <Input placeholder="Views (e.g. 5K watching)" value={f.views} onChange={(e) => setF((p) => ({ ...p, views: e.target.value }))} />
  </div>
);

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
    mutationFn: async (formData: typeof emptyForm) => {
      const clearKey = formData.clearKeyId && formData.clearKeyValue
        ? { [formData.clearKeyId]: formData.clearKeyValue } : null;
      const { error } = await supabase.from("channels").insert({
        name: formData.name, logo: formData.logo, category: formData.category,
        type: formData.type, url: formData.url, clear_key: clearKey,
        subscribers: formData.subscribers || "0", views: formData.views || "0 watching",
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-channels"] });
      queryClient.invalidateQueries({ queryKey: ["channels"] });
      setForm(emptyForm);
      toast.success("Channel added!");
    },
    onError: (e: any) => toast.error(e.message || "Failed to add channel"),
  });

  const updateMutation = useMutation({
    // FIX 2: Pinapasa na natin ang id at formData directly sa mutation para siguradong hindi null
    mutationFn: async (vars: { id: string; formData: typeof emptyForm }) => {
      const clearKey = vars.formData.clearKeyId && vars.formData.clearKeyValue
        ? { [vars.formData.clearKeyId]: vars.formData.clearKeyValue } : null;
        
      // FIX 3: Dinagdag ko ang .select() sa dulo para siguradong babalik yung data kung successful
      const { data: updatedData, error } = await supabase.from("channels").update({
        name: vars.formData.name, logo: vars.formData.logo, category: vars.formData.category,
        type: vars.formData.type, url: vars.formData.url, clear_key: clearKey,
        subscribers: vars.formData.subscribers || "0", views: vars.formData.views || "0 watching",
      }).eq("id", vars.id).select();

      if (error) throw error;
      
      // FIX 4: Kung empty ang bumalik, ibig sabihin hinarang ito ng Row Level Security (RLS) ng Supabase
      if (!updatedData || updatedData.length === 0) {
        throw new Error("Update blocked! You might not have permission to edit this channel.");
      }
      return updatedData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-channels"] });
      queryClient.invalidateQueries({ queryKey: ["channels"] });
      setEditDialogOpen(false);
      setEditingId(null);
      toast.success("Channel updated successfully!");
    },
    onError: (e: any) => toast.error(e.message || "Failed to update channel"),
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
    onError: (e: any) => toast.error(e.message || "Failed to delete channel"),
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.url) { toast.error("Name and URL are required"); return; }
    addMutation.mutate(form);
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
    if (!editingId) { toast.error("Error: Missing channel ID"); return; }
    
    // Pass the variables directly to prevent getting stuck
    updateMutation.mutate({ id: editingId, formData: editForm });
  };

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
