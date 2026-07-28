import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Dumbbell, Mail, ArrowLeft, Send, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";

export function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    setSent(true);
    toast.success("Password reset instructions sent!");
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 bg-[#05060A] relative font-['Plus_Jakarta_Sans']">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-[#1E2BD9] text-[#D8FC00] flex items-center justify-center shadow-lg shadow-[#1E2BD9]/30 border border-[#1E2BD9]/50">
            <Dumbbell className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Reset Password
          </h1>
          <p className="text-xs text-slate-400">
            Enter your email to receive recovery instructions
          </p>
        </div>

        {/* Clean Card Form */}
        <Card className="border-[#1E2436] bg-[#0B0E17] shadow-xl rounded-3xl p-2">
          <CardContent className="pt-6 space-y-5 text-xs">
            {sent ? (
              <div className="p-4 rounded-2xl bg-[#05060A] border border-[#1E2BD9]/40 text-center space-y-2">
                <CheckCircle2 className="w-8 h-8 text-[#D8FC00] mx-auto" />
                <p className="font-extrabold text-white text-sm">Reset Link Sent</p>
                <p className="text-slate-400 text-xs">
                  If an account exists for <span className="font-mono text-[#D8FC00]">{email}</span>, you will receive a password reset link shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="font-bold text-slate-200 block mb-1.5">
                    Registered Email Address
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
                    <Input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="athlete@fitness.com"
                      className="pl-10 h-11 text-xs rounded-2xl bg-[#05060A] border-[#1E2436] text-white placeholder:text-slate-500 focus-visible:ring-[#D8FC00]"
                      required
                    />
                  </div>
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 text-xs font-extrabold gap-2 bg-[#D8FC00] text-[#05060A] hover:bg-[#c2e400] rounded-2xl shadow-lg shadow-[#D8FC00]/15 active:scale-95 transition-transform"
                >
                  <Send className="w-4 h-4 stroke-[2.5]" /> Send Reset Link
                </Button>
              </form>
            )}

            <div className="text-center pt-3 border-t border-[#1E2436]">
              <Link
                to="/login"
                className="inline-flex items-center gap-1.5 font-bold text-[#D8FC00] hover:underline"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to Sign In
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
