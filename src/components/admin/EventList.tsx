import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash, Share2, QrCode, ExternalLink, Calendar } from "lucide-react";
import type { Event } from "@/lib/database";
import { useToast } from "@/hooks/use-toast";

interface EventListProps {
  events: Event[];
  onEdit: (event: Event) => void;
  onDelete: (eventId: string) => void;
}

export default function EventList({ events, onEdit, onDelete }: EventListProps) {
  const { toast } = useToast();

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast({
      title: "Berhasil Disalin!",
      description: `${type} telah disalin ke clipboard.`,
    });
  };
  
  if (events.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
        <p>Belum ada event yang dibuat. Buat event pertama Anda!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {events.map((event) => (
        <Card key={event.id} className="border-wedding-gold/20">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between space-y-4 md:space-y-0">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="text-lg font-semibold">{event.name}</h3>
                  {event.is_premium && (
                    <Badge className="bg-wedding-gold text-white">Premium</Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  Tanggal: {new Date(event.date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}
                </p>
                <p className="text-sm text-muted-foreground mb-3">
                  Kode Akses: <code className="bg-gray-100 px-2 py-1 rounded">{event.access_code}</code>
                </p>
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" variant="outline" onClick={() => copyToClipboard(event.shareable_link, "Link Share")}>
                    <Share2 className="w-3 h-3 mr-1" /> Copy Link
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => window.open(event.qr_code, '_blank')}>
                    <QrCode className="w-3 h-3 mr-1" /> QR Code
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => window.open(`/event/${event.id}`, '_blank')}>
                    <ExternalLink className="w-3 h-3 mr-1" /> Lihat Event
                  </Button>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button size="sm" variant="outline" onClick={() => onEdit(event)}>
                  <Edit className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="destructive" onClick={() => {
                  if (confirm('Yakin ingin menghapus event ini? Semua foto dan pesan akan ikut terhapus.')) {
                    onDelete(event.id);
                  }
                }}>
                  <Trash className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}