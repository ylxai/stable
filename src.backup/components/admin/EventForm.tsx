// file: components/admin/EventForm.tsx

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import LoadingSpinner from "@/components/ui/loading-spinner";
import type { Event } from "@/lib/database";
import { useToast } from "@/hooks/use-toast";

// Definisikan tipe untuk data yang akan dikirim
export type EventFormData = {
  name: string;
  date: string;
  access_code: string;
  is_premium: boolean;
};

// Tipe untuk props komponen
interface EventFormProps {
  editingEvent: Event | null;
  onSave: (data: EventFormData & { id?: string }) => void;
  onCancel: () => void;
  isSaving: boolean;
}

export default function EventForm({ editingEvent, onSave, onCancel, isSaving }: EventFormProps) {
  const { toast } = useToast();
  const [name, setName] = useState("");
  const [date, setDate] = useState("");
  const [accessCode, setAccessCode] = useState("");
  const [isPremium, setIsPremium] = useState(false);

  // useEffect untuk mengisi form saat mode edit
  useEffect(() => {
    if (editingEvent) {
      setName(editingEvent.name);
      // Format tanggal YYYY-MM-DD untuk input type="date"
      setDate(new Date(editingEvent.date).toISOString().split('T')[0]);
      setAccessCode(editingEvent.access_code);
      setIsPremium(editingEvent.is_premium);
    } else {
      // Reset form jika tidak dalam mode edit
      setName("");
      setDate("");
      setAccessCode("");
      setIsPremium(false);
    }
  }, [editingEvent]);

  const handleSubmit = () => {
    if (!name || !date || !accessCode) {
      toast({
        title: "Data Tidak Lengkap",
        description: "Mohon isi semua field yang diperlukan.",
        variant: "destructive",
      });
      return;
    }
    
    onSave({
      id: editingEvent?.id,
      name,
      date,
      access_code: accessCode,
      is_premium: isPremium,
    });
  };

  return (
    <Card className="mb-6 border-wedding-gold/20">
      <CardHeader>
        <CardTitle className="text-lg">
          {editingEvent ? "Edit Event" : "Buat Event Baru"}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="eventName">Nama Event</Label>
            <Input id="eventName" value={name} onChange={(e) => setName(e.target.value)} placeholder="Masukkan nama event" />
          </div>
          <div>
            <Label htmlFor="eventDate">Tanggal Event</Label>
            <Input id="eventDate" type="date" value={date} onChange={(e) => setDate(e.target.value)} />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end">
          <div>
            <Label htmlFor="accessCode">Kode Akses</Label>
            <Input id="accessCode" value={accessCode} onChange={(e) => setAccessCode(e.target.value)} placeholder="Masukkan kode akses" />
          </div>
          <div className="flex items-center space-x-2 pb-2">
            <input type="checkbox" id="isPremium" checked={isPremium} onChange={(e) => setIsPremium(e.target.checked)} className="h-4 w-4 rounded" />
            <Label htmlFor="isPremium">Event Premium</Label>
          </div>
        </div>
        <div className="flex space-x-2">
          <Button onClick={handleSubmit} disabled={isSaving} className="bg-wedding-gold hover:bg-wedding-gold/90 text-white">
            {isSaving ? <LoadingSpinner /> : (editingEvent ? "Update Event" : "Buat Event")}
          </Button>
          <Button variant="outline" onClick={onCancel}>
            Batal
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}