import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ActivityType } from "@/types";
import { activityService } from "@/services/activityService";
import { useAuthStore } from "@/store/useAuthStore";
import { useDemoStore } from "@/store/useDemoStore";
import { toast } from "sonner";
import { Dumbbell, Flame, Timer, Sparkles, CheckCircle2 } from "lucide-react";

const activitySchema = z.object({
  type: z.nativeEnum(ActivityType),
  duration: z.number().min(1, "Duration must be at least 1 minute"),
  caloriesBurned: z.number().min(0, "Calories must be positive"),
  notes: z.string().optional(),
});

type ActivityFormValues = z.infer<typeof activitySchema>;

interface ActivityFormModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

const activityIcons: Record<string, string> = {
  RUNNING: "🏃",
  CYCLING: "🚴",
  JOGGING: "👟",
  SWIMMING: "🏊",
  WALKING: "🚶",
  HIKING: "🥾",
  YOGA: "🧘",
  CARDIO: "🫀",
  STREAKING: "⚡",
  OTHER: "💪",
};

export function ActivityFormModal({
  open,
  onOpenChange,
  onSuccess,
}: ActivityFormModalProps) {
  const [submitting, setSubmitting] = useState(false);
  const { user, keycloakId } = useAuthStore();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<ActivityFormValues>({
    resolver: zodResolver(activitySchema),
    defaultValues: {
      type: ActivityType.RUNNING,
      duration: 30,
      caloriesBurned: 300,
    },
  });

  const selectedType = watch("type");

  const onSubmit = async (values: ActivityFormValues) => {
    // Block activity creation in demo mode
    if (useDemoStore.getState().isDemoMode) {
      toast.info("Creating activities is not available in demo mode.", {
        description: "This feature requires the backend microservices to be running.",
      });
      onOpenChange(false);
      return;
    }

    try {
      // Use keycloakId as userid — this is what the backend Activity entity stores
      const userId = keycloakId || user?.keycloakId || user?.id;
      if (!userId) {
        toast.error("You must be logged in to submit an activity.");
        return;
      }
      setSubmitting(true);

      await activityService.createActivity({
        userid: userId,
        type: values.type,
        duration: Number(values.duration),
        caloriesBurned: Number(values.caloriesBurned),
        startTime: new Date().toISOString(),
        additionalMatrics: values.notes ? { notes: values.notes } : undefined,
      });

      toast.success("Workout logged successfully!");
      reset();
      onOpenChange(false);
      onSuccess?.();
    } catch (error: any) {
      console.error("Error logging workout:", error);
      toast.error(error?.response?.data?.message || error?.response?.data || "Failed to log workout. Check API Gateway connection.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-[#0B0E17] border-[#1E2436] text-white rounded-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl font-extrabold text-white font-['Plus_Jakarta_Sans']">
            <div className="w-9 h-9 rounded-2xl bg-[#1E2BD9] text-[#D8FC00] flex items-center justify-center border border-[#1E2BD9]/50">
              <Dumbbell className="w-5 h-5" />
            </div>
            Log New Workout
          </DialogTitle>
          <DialogDescription className="text-slate-400 text-xs">
            Records your workout and triggers the AI recommendation engine automatically.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 py-2">
          {/* Activity Type Grid Selection - All Exercises */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-2">
              Select Workout Type ({Object.values(ActivityType).length} Available)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 max-h-48 overflow-y-auto p-1 bg-[#05060A] border border-[#1E2436] rounded-2xl">
              {Object.values(ActivityType).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setValue("type", type)}
                  className={`p-2.5 rounded-xl border text-xs font-bold transition-all flex flex-col items-center justify-center gap-1 ${
                    selectedType === type
                      ? "bg-[#D8FC00] text-[#05060A] border-[#D8FC00] shadow-md shadow-[#D8FC00]/20"
                      : "bg-[#121624] border-[#1E2436] hover:border-[#1E2BD9] text-slate-300"
                  }`}
                >
                  <span className="text-base">{activityIcons[type] || "🏃"}</span>
                  <span className="text-[9px] font-black truncate w-full text-center">{type}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Duration & Calories Input Row */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5 mb-1.5">
                <Timer className="w-3.5 h-3.5 text-sky-400" /> Duration (mins)
              </label>
              <Input
                type="number"
                {...register("duration", { valueAsNumber: true })}
                placeholder="30"
                className="h-11 rounded-2xl bg-[#05060A] border-[#1E2436] text-white placeholder:text-slate-500 focus-visible:ring-[#D8FC00] text-sm font-bold"
              />
              {errors.duration && (
                <p className="text-[11px] text-red-400 mt-1">{errors.duration.message}</p>
              )}
            </div>

            <div>
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5 mb-1.5">
                <Flame className="w-3.5 h-3.5 text-orange-400" /> Calories (kcal)
              </label>
              <Input
                type="number"
                {...register("caloriesBurned", { valueAsNumber: true })}
                placeholder="300"
                className="h-11 rounded-2xl bg-[#05060A] border-[#1E2436] text-white placeholder:text-slate-500 focus-visible:ring-[#D8FC00] text-sm font-bold"
              />
              {errors.caloriesBurned && (
                <p className="text-[11px] text-red-400 mt-1">{errors.caloriesBurned.message}</p>
              )}
            </div>
          </div>

          {/* Notes Field */}
          <div>
            <label className="text-xs font-bold text-slate-300 block mb-1.5">
              Notes (Optional)
            </label>
            <Input
              {...register("notes")}
              placeholder="e.g., Avg heart rate 145 bpm, felt great"
              className="h-11 rounded-2xl bg-[#05060A] border-[#1E2436] text-white placeholder:text-slate-500 focus-visible:ring-[#D8FC00]"
            />
          </div>

          <div className="pt-1 flex items-center justify-end gap-2">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="text-slate-400 hover:text-white hover:bg-[#121624] rounded-2xl font-bold"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={submitting}
              className="gap-2 bg-[#D8FC00] text-[#05060A] hover:bg-[#c2e400] rounded-2xl font-extrabold shadow-lg shadow-[#D8FC00]/15 active:scale-95 transition-transform min-w-[140px]"
            >
              {submitting ? (
                <>
                  <Sparkles className="w-4 h-4 animate-spin" /> Submitting...
                </>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4 stroke-[2.5]" /> Log Workout
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
