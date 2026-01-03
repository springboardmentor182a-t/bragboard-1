import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { z } from "zod";
import { Loader2, ArrowLeft } from "lucide-react";

const forgotPasswordSchema = z.object({
    email: z.string().email("Invalid email address"),
});

export default function ForgotPassword() {
    const [email, setEmail] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const validatedData = forgotPasswordSchema.parse({ email });

            const { error } = await supabase.auth.resetPasswordForEmail(validatedData.email, {
                redirectTo: `${window.location.origin}/update-password`,
            });

            if (error) throw error;

            setIsSubmitted(true);
            toast({
                title: "Email sent",
                description: "Check your inbox for a password reset link.",
            });
        } catch (error) {
            if (error instanceof z.ZodError) {
                toast({
                    title: "Validation error",
                    description: error.errors[0].message,
                    variant: "destructive",
                });
            } else {
                toast({
                    title: "Request failed",
                    description: error instanceof Error ? error.message : "An error occurred",
                    variant: "destructive",
                });
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950 animate-gradient-xy relative overflow-hidden">

            {/* Abstract Background Elements */}
            <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '0s' }}></div>
            <div className="absolute bottom-20 right-20 w-72 h-72 bg-indigo-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-float" style={{ animationDelay: '2s' }}></div>

            {/* Glass Card */}
            <div className="w-full max-w-md relative z-10">
                <div className="backdrop-blur-xl bg-white/10 rounded-2xl shadow-2xl border border-white/20 p-8 space-y-6">

                    <Link to="/login" className="inline-flex items-center text-sm text-indigo-300 hover:text-white transition-colors">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to Login
                    </Link>

                    {/* Header */}
                    <div className="space-y-2">
                        <h1 className="text-3xl font-bold tracking-tight text-white">Reset Password</h1>
                        <p className="text-indigo-200">
                            Enter your email and we'll send you a link to reset your password.
                        </p>
                    </div>

                    {!isSubmitted ? (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2 text-white">
                                <Label htmlFor="email" className="text-indigo-100">Email Address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="m@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                    className="bg-white/5 border-white/10 text-white placeholder:text-white/50 focus:border-indigo-500/50 focus:ring-indigo-500/50"
                                />
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold h-11"
                                disabled={isLoading}
                            >
                                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Send Reset Link"}
                            </Button>
                        </form>
                    ) : (
                        <div className="bg-indigo-500/20 border border-indigo-500/50 rounded-lg p-4 text-center">
                            <p className="text-white font-medium">Check your inbox</p>
                            <p className="text-indigo-200 text-sm mt-1">
                                We have sent a password reset link to <span className="text-white font-semibold">{email}</span>.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}


