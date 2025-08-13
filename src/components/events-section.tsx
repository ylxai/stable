'use client';

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, Camera, MapPin, Clock, ArrowRight, Play, CheckCircle, Clock3 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import LoadingSpinner from "@/components/ui/loading-spinner";
import type { Event } from "@/lib/database";
import { EventCardsLoader, FloatingParticles, PulsingDots } from "./ui/engaging-loading";
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

// Function to determine event status
function getEventStatus(eventDate: string): 'live' | 'upcoming' | 'completed' {
  const now = new Date();
  const eventDateTime = new Date(eventDate);
  const eventEndTime = new Date(eventDateTime.getTime() + (12 * 60 * 60 * 1000)); // Assume 12 hours duration
  
  if (now >= eventDateTime && now <= eventEndTime) {
    return 'live';
  } else if (now < eventDateTime) {
    return 'upcoming';
  } else {
    return 'completed';
  }
}

// Function to get status badge styling
function getStatusBadge(status: 'live' | 'upcoming' | 'completed') {
  switch (status) {
    case 'live':
      return {
        icon: <Play className="w-3 h-3 mr-1" />,
        text: 'Live',
        className: 'bg-red-500 text-white animate-pulse'
      };
    case 'upcoming':
      return {
        icon: <Clock3 className="w-3 h-3 mr-1" />,
        text: 'Upcoming',
        className: 'bg-blue-500 text-white'
      };
    case 'completed':
      return {
        icon: <CheckCircle className="w-3 h-3 mr-1" />,
        text: 'Completed',
        className: 'bg-green-500 text-white'
      };
  }
}

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
    <section id="events" className="py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12 md:mb-16">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 mb-3 md:mb-4"> 
            Event Terbaru
          </h2>
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto px-4">
            Lihat event-event terbaru yang telah menggunakan layanan kami
          </p>
        </div>
        
        {isLoading && (
          <div className="space-y-8">
            <div className="flex justify-center">
              <PulsingDots size="lg" />
            </div>
            <EventCardsLoader count={6} />
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
          <>
            {/* Mobile: Horizontal Scroll */}
            <div className="md:hidden">
              <div className="flex gap-4 overflow-x-auto pb-4 px-1 scrollbar-hide">
                {events
                  .sort((a, b) => {
                    // Sort by status: live > upcoming > completed
                    const statusOrder = { live: 0, upcoming: 1, completed: 2 };
                    const statusA = getEventStatus(a.date);
                    const statusB = getEventStatus(b.date);
                    return statusOrder[statusA] - statusOrder[statusB];
                  })
                  .map((event, index) => {
                    const eventStatus = getEventStatus(event.date);
                    const statusBadge = getStatusBadge(eventStatus);
                    
                    return (
                      <div key={event.id} className="flex-none w-80 animate-fade-in-up" style={{ animationDelay: `${index * 100}ms` }}>
                        <Card className="border-wedding-gold/20 shadow-md hover:shadow-lg transition-all duration-300 h-full hover:animate-pulse-glow">
                          <CardHeader className="pb-3">
                            <div className="flex items-start justify-between">
                              <CardTitle className="text-lg font-semibold text-gray-900 pr-2 leading-tight">
                                {event.name}
                              </CardTitle>
                              <Badge className={`${statusBadge.className} flex items-center text-xs font-medium shrink-0`}>
                                {statusBadge.icon}
                                {statusBadge.text}
                              </Badge>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-3 pt-0">
                            <div className="flex items-center text-sm text-gray-600">
                              <Calendar className="w-4 h-4 mr-2 text-wedding-gold shrink-0" />
                              <span className="truncate">
                                {new Date(event.date).toLocaleDateString('id-ID', { 
                                  year: 'numeric', 
                                  month: 'short', 
                                  day: 'numeric' 
                                })}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              {event.is_premium && (
                                <Badge className="bg-wedding-gold text-white text-xs">
                                  <Camera className="w-3 h-3 mr-1" />
                                  Premium
                                </Badge>
                              )}
                            </div>
                            <Button 
                              asChild 
                              className="w-full bg-wedding-gold hover:bg-wedding-gold/90 text-white h-10 text-sm font-medium"
                            >
                              <a href={`/event/${event.id}`} target="_blank" rel="noopener noreferrer">
                                Lihat Event 
                                <ArrowRight className="w-4 h-4 ml-2" />
                              </a>
                            </Button>
                          </CardContent>
                        </Card>
                      </div>
                    );
                  })}
              </div>
            </div>

            {/* Desktop: Grid Layout */}
            <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {events
                .sort((a, b) => {
                  // Sort by status: live > upcoming > completed
                  const statusOrder = { live: 0, upcoming: 1, completed: 2 };
                  const statusA = getEventStatus(a.date);
                  const statusB = getEventStatus(b.date);
                  return statusOrder[statusA] - statusOrder[statusB];
                })
                .map((event, index) => {
                  const eventStatus = getEventStatus(event.date);
                  const statusBadge = getStatusBadge(eventStatus);
              
              return (
                <div key={event.id} className="group animate-fade-in-up" style={{ animationDelay: `${index * 150}ms` }}>
                  <Card className="border-wedding-gold/20 shadow-md hover:shadow-xl transition-all duration-300 group-hover:scale-[1.02] overflow-hidden hover:animate-pulse-glow">
                    <CardHeader className="relative pb-3">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg md:text-xl font-semibold text-gray-900 pr-2 leading-tight">
                          {event.name}
                        </CardTitle>
                        {/* Status Badge */}
                        <Badge className={`${statusBadge.className} flex items-center text-xs font-medium shrink-0`}>
                          {statusBadge.icon}
                          {statusBadge.text}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3 pt-0">
                      {/* Event Date */}
                      <div className="flex items-center text-sm text-gray-600">
                        <Calendar className="w-4 h-4 mr-2 text-wedding-gold shrink-0" />
                        <span className="truncate">
                          {new Date(event.date).toLocaleDateString('id-ID', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}
                        </span>
                      </div>

                      {/* Premium Badge */}
                      <div className="flex items-center gap-2">
                        {event.is_premium && (
                          <Badge className="bg-wedding-gold text-white text-xs">
                            <Camera className="w-3 h-3 mr-1" />
                            Premium Event
                          </Badge>
                        )}
                        {/* Photo Count Indicator */}
                        <div className="flex items-center text-xs text-gray-500">
                          <Users className="w-3 h-3 mr-1" />
                          <span>Event Aktif</span>
                        </div>
                      </div>

                      {/* Mobile-Optimized Button */}
                      <Button 
                        asChild 
                        className="w-full bg-wedding-gold hover:bg-wedding-gold/90 text-white mt-4 h-10 md:h-11 text-sm md:text-base font-medium"
                      >
                        <a href={`/event/${event.id}`} target="_blank" rel="noopener noreferrer">
                          <span className="flex items-center justify-center">
                            Lihat Event 
                            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                          </span>
                        </a>
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
            </div>
          </>
        )}
        
        {/* Mobile Scroll Indicator */}
        {!isLoading && !isError && events && events.length > 2 && (
          <div className="md:hidden text-center mt-4">
            <p className="text-xs text-gray-500 flex items-center justify-center">
              <ArrowRight className="w-3 h-3 mr-1 animate-pulse" />
              Geser untuk melihat event lainnya
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
