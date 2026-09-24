import React, { useState } from "react";
import { Mail, CheckCircle2 } from "lucide-react";

const NewsLetter: React.FC = () => {
  const [email, setEmail] = useState("");
  const [subscribed, setSubscribed] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail("");
    }
  };

  return (
    <section className="py-16 bg-slate-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-emerald-700 rounded-3xl p-8 sm:p-12 text-white text-center relative overflow-hidden shadow-xs">
          <div className="max-w-2xl mx-auto space-y-4 relative z-10">
            <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center mx-auto text-emerald-100">
              <Mail className="w-6 h-6" />
            </div>

            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Stay Updated on Environmental Guidelines
            </h2>

            <p className="text-emerald-100 text-xs sm:text-sm font-normal max-w-lg mx-auto">
              Subscribe to receive policy updates, quarterly compliance stats,
              and technical guidance directly in your inbox.
            </p>

            {subscribed ? (
              <div className="inline-flex items-center gap-2 px-5 py-3 bg-white text-emerald-800 rounded-xl font-medium text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Thank you for subscribing!</span>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="flex flex-col sm:flex-row items-center gap-3 max-w-md mx-auto pt-2"
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full px-4 py-3 rounded-xl text-slate-800 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-300 placeholder:text-slate-400"
                />
                <button
                  type="submit"
                  className="w-full sm:w-auto px-6 py-3 bg-slate-800 hover:bg-slate-900 text-white font-semibold text-sm rounded-xl transition-colors whitespace-nowrap shadow-xs"
                >
                  Subscribe
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsLetter;
