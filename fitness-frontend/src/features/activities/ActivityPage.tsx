import { useEffect, useState } from "react";
import {
  Activity as ActivityIcon,
  Plus,
  Search,
  Filter,
  Trash2,
  Calendar,
  Flame,
  Clock,
  Sparkles,
  Eye,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { activityService } from "@/services/activityService";
import type { ActivityResponse } from "@/types";
import { ActivityType } from "@/types";
import { ActivityFormModal } from "./components/ActivityFormModal";
import { toast } from "sonner";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";

export function ActivityPage() {
  const [activities, setActivities] = useState<ActivityResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("ALL");
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<ActivityResponse | null>(null);

  const fetchActivities = async () => {
    try {
      setLoading(true);
      const data = await activityService.getAllActivities(0, 50);
      setActivities(data.content || []);
    } catch (error) {
      console.error("Failed to fetch activities:", error);
      toast.error("Failed to load activities from API Gateway.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActivities();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await activityService.deleteActivity(id);
      toast.success("Activity deleted successfully.");
      setActivities((prev) => prev.filter((a) => a.id !== id));
    } catch (error) {
      toast.error("Failed to delete activity.");
    }
  };

  const filteredActivities = activities.filter((act) => {
    const matchesSearch =
      act.type?.toLowerCase().includes(search.toLowerCase()) ||
      act.id?.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === "ALL" || act.type === typeFilter;
    return matchesSearch && matchesType;
  });

  return (
    <div className="space-y-6 animate-in fade-in-50 pb-8">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-black tracking-tight text-white flex items-center gap-2 font-['Plus_Jakarta_Sans']">
            <ActivityIcon className="w-7 h-7 text-[#D8FC00]" /> Workout Telemetry Logs
          </h1>
          <p className="text-sm text-slate-400 mt-1 font-medium">
            Real-time telemetry stored in MongoDB & processed by Spring Cloud Microservices.
          </p>
        </div>

        <Button
          onClick={() => setIsLogModalOpen(true)}
          className="bg-[#D8FC00] hover:bg-[#c2e400] text-[#05060A] font-extrabold rounded-2xl shadow-xl shadow-[#D8FC00]/20 gap-2 h-11 px-5 active:scale-95 transition-transform"
        >
          <Plus className="w-4 h-4 stroke-[3]" /> Log New Workout
        </Button>
      </div>

      {/* Filter & Search Bar */}
      <Card className="p-4 bg-[#0B0E17] border-[#1E2436] rounded-3xl">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search workout type or telemetry ID..."
              className="pl-9 h-10 text-xs rounded-2xl bg-[#05060A] border-[#1E2436] text-white placeholder:text-slate-500 focus-visible:ring-[#D8FC00]"
            />
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            <Filter className="w-4 h-4 text-slate-400 shrink-0 mr-1" />
            <button
              onClick={() => setTypeFilter("ALL")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                typeFilter === "ALL"
                  ? "bg-[#D8FC00] text-[#05060A] shadow-md shadow-[#D8FC00]/20"
                  : "bg-[#121624] text-slate-300 hover:text-white border border-[#1E2436]"
              }`}
            >
              All
            </button>
            {Object.values(ActivityType).slice(0, 5).map((type) => (
              <button
                key={type}
                onClick={() => setTypeFilter(type)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-all ${
                  typeFilter === type
                    ? "bg-[#D8FC00] text-[#05060A] shadow-md shadow-[#D8FC00]/20"
                    : "bg-[#121624] text-slate-300 hover:text-white border border-[#1E2436]"
                }`}
              >
                {type}
              </button>
            ))}
          </div>
        </div>
      </Card>

      {/* Activities Data Table Card */}
      <Card className="bg-[#0B0E17] border-[#1E2436] rounded-3xl">
        <CardHeader>
          <CardTitle className="text-base font-extrabold text-white font-['Plus_Jakarta_Sans']">
            Activity Log Entries ({filteredActivities.length})
          </CardTitle>
          <CardDescription className="text-slate-400 text-xs">
            Backend API: GET /apis/activities
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-3">
              <Skeleton className="h-14 w-full bg-[#1E2436]" />
              <Skeleton className="h-14 w-full bg-[#1E2436]" />
              <Skeleton className="h-14 w-full bg-[#1E2436]" />
            </div>
          ) : filteredActivities.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <ActivityIcon className="w-10 h-10 mx-auto mb-3 opacity-40 text-[#D8FC00]" />
              <p className="font-bold text-sm text-white">No workout records found.</p>
              <p className="text-xs mt-1 text-slate-400">Try clearing filters or click "Log New Workout".</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="border-b border-[#1E2436] text-slate-400 uppercase font-bold text-[10px] tracking-wider">
                  <tr>
                    <th className="pb-3 px-3">Type</th>
                    <th className="pb-3 px-3">Calories</th>
                    <th className="pb-3 px-3">Duration</th>
                    <th className="pb-3 px-3">Start Time</th>
                    <th className="pb-3 px-3">Status</th>
                    <th className="pb-3 px-3 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1E2436]">
                  {filteredActivities.map((act) => (
                    <tr
                      key={act.id}
                      className="hover:bg-[#121624] transition-colors group"
                    >
                      <td className="py-3.5 px-3 font-bold flex items-center gap-3">
                        <div className="w-9 h-9 rounded-2xl bg-[#1E2BD9] text-[#D8FC00] border border-[#1E2BD9]/50 flex items-center justify-center font-black text-xs shrink-0">
                          {act.type?.[0] || "W"}
                        </div>
                        <div>
                          <span className="text-white text-sm block font-bold">{act.type}</span>
                          <span className="text-[10px] text-slate-400 block font-mono">
                            ID: {act.id?.slice(-6)}
                          </span>
                        </div>
                      </td>

                      <td className="py-3.5 px-3 font-extrabold text-[#D8FC00] text-sm">
                        <div className="flex items-center gap-1.5">
                          <Flame className="w-4 h-4 text-orange-400 fill-orange-400" />
                          {act.caloriesBurned} kcal
                        </div>
                      </td>

                      <td className="py-3.5 px-3 text-slate-200 font-bold">
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4 text-[#60A5FA]" />
                          {act.duration} mins
                        </div>
                      </td>

                      <td className="py-3.5 px-3 text-slate-400 font-medium">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(act.startTime || act.createdAt || Date.now()).toLocaleString([], {
                            dateStyle: "short",
                            timeStyle: "short",
                          })}
                        </div>
                      </td>

                      <td className="py-3.5 px-3">
                        <Badge className="bg-[#1E2BD9]/30 text-[#D8FC00] border border-[#1E2BD9]/60 font-bold text-[10px] uppercase">
                          Synced
                        </Badge>
                      </td>

                      <td className="py-3.5 px-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => setSelectedActivity(act)}
                            className="p-2 rounded-xl text-slate-400 hover:text-[#D8FC00] hover:bg-[#121624] transition-colors"
                            title="View Details"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(act.id)}
                            className="p-2 rounded-xl text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                            title="Delete Record"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Activity Detail Modal */}
      {selectedActivity && (
        <Dialog open={!!selectedActivity} onOpenChange={() => setSelectedActivity(null)}>
          <DialogContent className="sm:max-w-md bg-[#0B0E17] border-[#1E2436] text-white rounded-3xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 font-black text-lg text-white">
                <Sparkles className="w-5 h-5 text-[#D8FC00]" />
                {selectedActivity.type} Telemetry Detail
              </DialogTitle>
              <DialogDescription className="text-slate-400 text-xs font-mono">
                Activity ID: {selectedActivity.id}
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-3 py-2 text-xs">
              <div className="p-4 rounded-2xl bg-[#05060A] border border-[#1E2BD9]/40 flex justify-between items-center">
                <div>
                  <span className="text-slate-400 block font-bold text-[10px] uppercase">Calories Burned</span>
                  <span className="text-2xl font-black text-[#D8FC00]">{selectedActivity.caloriesBurned} kcal</span>
                </div>
                <div>
                  <span className="text-slate-400 block font-bold text-[10px] uppercase">Duration</span>
                  <span className="text-2xl font-black text-sky-400">{selectedActivity.duration} mins</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-[#121624] border border-[#1E2436] space-y-1">
                <p className="font-bold text-white text-xs">User ID:</p>
                <p className="font-mono text-slate-400 text-xs">{selectedActivity.userid}</p>
              </div>

              {selectedActivity.additionalMatrics && Object.keys(selectedActivity.additionalMatrics).length > 0 && (
                <div className="p-3.5 rounded-2xl bg-[#121624] border border-[#1E2436] space-y-2">
                  <p className="font-bold text-[#D8FC00] text-xs uppercase tracking-wider flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5" /> Additional Telemetry Metrics
                  </p>
                  <div className="grid grid-cols-1 gap-2">
                    {Object.entries(selectedActivity.additionalMatrics).map(([key, val]) => (
                      <div
                        key={key}
                        className="p-3 rounded-xl bg-[#05060A] border border-[#1E2436] flex items-center justify-between"
                      >
                        <span className="text-xs font-bold text-slate-400 capitalize">
                          {key.replace(/([A-Z])/g, " $1")}
                        </span>
                        <span className="text-xs font-extrabold text-white font-mono">
                          {typeof val === "object" ? JSON.stringify(val) : String(val)}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Activity Form Modal */}
      <ActivityFormModal
        open={isLogModalOpen}
        onOpenChange={setIsLogModalOpen}
        onSuccess={fetchActivities}
      />
    </div>
  );
}
