'use client';

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, Camera, MapPin, Clock, ArrowRight } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import LoadingSpinner from "@/components/ui/loading-spinner";
import type { Event } from "@/lib/database";
// import { motion, Easing } from "framer-motion"; // Komentar/hapus impor ini untuk menguji

// easeOutCubicBezier: Easing = [0, 0, 0.58, 1]; // Komentari atau hapus definisi ini

// containerVariants: { // Komentari atau hapus definisi ini
//   hidden: { opacity: 0 },
//   visible: {
//     opacity: 1,
//     transition: {
//       staggerChildren: 0.1,
//       delayChildren: 0.2
//     }
//   }
// };

// itemVariants: { // Komentari atau hapus definisi ini
//   hidden: { opacity: 0, y: 50, rotateX: -10 },
//   visible: {
//     opacity: 1,
//     y: 0,
//     rotateX: 0,
//     transition: {
//       duration: 0.6,
//       ease: easeOutCubicBezier
//     }
//   }
// };

export default function EventsSection() {
  // Menggunakan useQuery untuk mengambil data event
  const { data: events, isLoading, isError, error } = useQuery<Event[]>({
    queryKey: ['events'],
    queryFn: async () => {
      try {
        const response = await apiRequest('GET', '/api/events');
        // Pastikan respons itu sendiri "ok" sebelum mencoba mengurai JSON
        if (!response.ok) {
          const errorBody = await response.text(); // Ambil teks error jika tidak ok
          throw new Error(`HTTP error! status: ${response.status}, body: ${errorBody}`);
        }
        const data = await response.json();
        
        // Pastikan data adalah array
        if (!Array.isArray(data)) {
          console.warn('API response is not an array:', data);
          return [];
        }
        console.log("EventsSection: Data API berhasil diambil:", data); // LOG BARU
        return data;
      } catch (e) {
        console.error("EventsSection: Error saat mengambil data API:", e);
        throw e; // Lanjutkan melempar error agar useQuery menangkapnya
      }
    }, // Ganti dengan endpoint API yang benar untuk mengambil event
  });

  // LOG BARU: Pastikan status dan data sebelum render
  console.log("EventsSection: Status Render", {
    isLoading,
    isError,
    eventsLength: events?.length,
    eventsData: events // Tampilkan data jika ada
  });

  return (
    <section id="events" className="py-20 bg-white">
      {/* Ganti motion.div menjadi div biasa sementara */}
      <div
        // Hapus properties variants, initial, whileInView, viewport sementara
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"
      >
        <div className="text-center mb-16">
          {/* Ganti motion.h2 dan motion.p menjadi h2 dan p biasa */}
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4"> 
            Event Terbaru
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Lihat event-event terbaru yang telah menggunakan layanakan kami
          </p>
        </div>
        
        {isLoading && (
          <div className="flex justify-center py-8">
            <LoadingSpinner />
          </div>
        )}

        {isError && (
          <div className="text-center py-8 text-red-500">
            <p>Gagal memuat event. Silakan coba lagi nanti.</p>
          </div>
        )}

        {/* Cek apakah events itu ada dan memiliki panjang > 0 */}
        {!isLoading && !isError && events && events.length === 0 && ( // HANYA tampilkan jika array kosong
          <div className="text-center py-12 text-gray-500">
            <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p>Belum ada event yang tersedia saat ini.</p>
          </div>
        )}

        {/* Cek apakah events itu ada dan memiliki panjang > 0 */}
        {!isLoading && !isError && events && events.length > 0 && ( // HANYA tampilkan jika array TIDAK kosong
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              // Ganti motion.div menjadi div biasa sementara, hapus variants
              <div key={event.id}>
                <Card className="border-wedding-gold/20 shadow-md hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <CardTitle className="text-xl font-semibold text-gray-900">{event.name}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="w-4 h-4 mr-2 text-wedding-gold" />
                      <span>{new Date(event.date).toLocaleDateString('id-ID', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                    {event.is_premium && (
                      <Badge className="bg-wedding-gold text-white">Premium Event</Badge>
                    )}
                    <p className="text-sm text-gray-700">Kode Akses: <code className="bg-gray-100 px-2 py-1 rounded font-mono">{event.access_code}</code></p>
                    <Button 
                      asChild 
                      className="w-full bg-wedding-gold hover:bg-wedding-gold/90 text-white mt-4"
                    >
                      <a href={`/event/${event.id}`} target="_blank" rel="noopener noreferrer">
                        Lihat Event <ArrowRight className="w-4 h-4 ml-2" />
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
