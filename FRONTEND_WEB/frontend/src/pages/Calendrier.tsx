import { useState, useRef, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin, { DateClickArg } from "@fullcalendar/interaction";
import { EventInput } from "@fullcalendar/core";
import PageMeta from "../components/common/PageMeta";
import api from "../services/api";

interface DetectionEvent extends EventInput {
  extendedProps: {
    calendar: string;
    alert_id?: number;
    person?: string;
    camera?: string;
  };
}

const Calendrier: React.FC = () => {
  const [events, setEvents] = useState<DetectionEvent[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [dayAlerts, setDayAlerts] = useState<any[]>([]);
  const [loadingAlerts, setLoadingAlerts] = useState(false);
  const calendarRef = useRef<FullCalendar>(null);

  // Charger toutes les alertes et les convertir en événements FullCalendar
  useEffect(() => {
    api.get("/api/v1/alerts")
      .then((res) => {
        const alerts = res.data as any[];
        // Grouper par date pour afficher le count
        const countByDate: Record<string, { count: number; critical: number }> = {};
        alerts.forEach((a) => {
          const date = a.created_at?.split("T")[0] ?? "";
          if (!countByDate[date]) countByDate[date] = { count: 0, critical: 0 };
          countByDate[date].count++;
          if (a.gravity_level === "critical") countByDate[date].critical++;
        });

        const calEvents: DetectionEvent[] = Object.entries(countByDate).map(([date, info]) => ({
          id: date,
          title: `${info.count} détection${info.count > 1 ? "s" : ""}${info.critical > 0 ? ` · ${info.critical} 🔴` : ""}`,
          start: date,
          allDay: true,
          extendedProps: {
            calendar: info.critical > 0 ? "Danger" : "Primary",
          },
        }));
        setEvents(calEvents);
      })
      .catch(() => {
        // Données démo si backend non disponible
        const today = new Date().toISOString().split("T")[0];
        const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0];
        setEvents([
          { id: today, title: "3 détections · 1 🔴", start: today, allDay: true, extendedProps: { calendar: "Danger" } },
          { id: yesterday, title: "2 détections", start: yesterday, allDay: true, extendedProps: { calendar: "Primary" } },
        ]);
      });
  }, []);

  const handleDateClick = (info: DateClickArg) => {
    const clickedDate = info.dateStr;
    setSelectedDate(clickedDate);
    setLoadingAlerts(true);
    api.get(`/api/v1/alerts?date=${clickedDate}`)
      .then((res) => setDayAlerts(res.data))
      .catch(() => setDayAlerts([]))
      .finally(() => setLoadingAlerts(false));
  };

  const gravityColor = (level: string) => {
    if (level === "critical") return "text-error-600 bg-error-50 dark:bg-error-500/15 dark:text-error-400";
    if (level === "high") return "text-orange-600 bg-orange-50 dark:bg-orange-500/15 dark:text-orange-400";
    return "text-warning-600 bg-warning-50 dark:bg-warning-500/15 dark:text-warning-400";
  };

  return (
    <>
      <PageMeta
        title="Calendrier des Détections | TOGO-SecureNet"
        description="Historique des détections faciales par date dans TOGO-SecureNet"
      />
      <div className="space-y-5">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white/90">📅 Calendrier des Détections</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Cliquez sur une date pour voir toutes les détections effectuées ce jour-là
          </p>
        </div>

        <div className="grid grid-cols-12 gap-5">
          {/* Calendrier */}
          <div className="col-span-12 xl:col-span-8 rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="custom-calendar p-4">
              <FullCalendar
                ref={calendarRef}
                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                initialView="dayGridMonth"
                locale="fr"
                headerToolbar={{
                  left: "prev,next",
                  center: "title",
                  right: "dayGridMonth,timeGridWeek",
                }}
                events={events}
                dateClick={handleDateClick}
                eventContent={renderEventContent}
              />
            </div>
          </div>

          {/* Panneau latéral - détails du jour */}
          <div className="col-span-12 xl:col-span-4 rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-white/[0.03]">
            <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800">
              <h2 className="font-semibold text-gray-800 dark:text-white/90 flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                {selectedDate
                  ? new Date(selectedDate + "T12:00:00").toLocaleDateString("fr-FR", { weekday: "long", day: "numeric", month: "long", year: "numeric" })
                  : "Sélectionnez une date"}
              </h2>
            </div>
            <div className="p-5">
              {!selectedDate ? (
                <div className="text-center text-gray-400 py-12">
                  <div className="text-4xl mb-3">📅</div>
                  <p className="text-sm">Cliquez sur un jour du calendrier pour voir les détections</p>
                </div>
              ) : loadingAlerts ? (
                <p className="text-sm text-gray-400 text-center py-8">Chargement...</p>
              ) : dayAlerts.length === 0 ? (
                <div className="text-center text-gray-400 py-12">
                  <div className="text-4xl mb-3">
                    <svg className="w-16 h-16 mx-auto text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <p className="text-sm">Aucune détection ce jour-là</p>
                </div>
              ) : (
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{dayAlerts.length} détection{dayAlerts.length > 1 ? "s" : ""}</p>
                  {dayAlerts.map((alert) => (
                    <div key={alert.id} className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-white/[0.03]">
                      <span className={`shrink-0 rounded-lg px-2 py-1 text-[10px] font-bold uppercase ${gravityColor(alert.gravity_level)}`}>
                        {alert.gravity_level}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-800 dark:text-white/90">
                          Personne #{alert.person_id} · Cam #{alert.camera_id}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          {new Date(alert.created_at).toLocaleTimeString("fr-FR")} · Confiance: {(alert.confidence * 100).toFixed(0)}%
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

const renderEventContent = (eventInfo: any) => {
  const colorClass = `fc-bg-${eventInfo.event.extendedProps.calendar.toLowerCase()}`;
  return (
    <div className={`event-fc-color flex fc-event-main ${colorClass} p-1 rounded-sm text-xs`}>
      <div className="fc-daygrid-event-dot mr-1"></div>
      <div className="fc-event-title truncate">{eventInfo.event.title}</div>
    </div>
  );
};

export default Calendrier;
