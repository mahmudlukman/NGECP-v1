import React, { useState } from "react";
import { Mail, CheckCircle2, ArrowRight } from "lucide-react";

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
    <section className="bg-[#F7F6F1] py-16 font-[Figtree,ui-sans-serif,system-ui,sans-serif] sm:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="relative overflow-hidden rounded-3xl bg-[#0B1F1A] p-8 text-center text-[#F3F1EA] shadow-[0_30px_70px_-25px_rgba(11,31,26,0.45)] sm:p-14">
          {/* Fine dot texture + soft glow, same language as the other sections */}
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-[0.35] [background-image:radial-gradient(rgba(243,241,234,0.5)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-[radial-gradient(closest-side,rgba(127,209,174,0.18),transparent)]"
          />

          <div className="relative mx-auto max-w-2xl">
            <div className="mb-6 flex items-center justify-center gap-3">
              <span className="h-px w-10 bg-[#7FD1AE]/50" />
              <span className="flex h-11 w-11 items-center justify-center rounded-full border border-[#7FD1AE]/30 text-[#7FD1AE]">
                <Mail className="h-5 w-5" />
              </span>
              <span className="h-px w-10 bg-[#7FD1AE]/50" />
            </div>

            <h2 className="font-[Newsreader,Georgia,serif] text-2xl font-normal tracking-tight sm:text-3xl">
              Stay updated on environmental guidelines
            </h2>

            <p className="mx-auto mt-4 max-w-lg text-sm leading-relaxed text-[#F3F1EA]/65">
              Subscribe to receive policy updates, quarterly compliance
              stats, and technical guidance directly in your inbox.
            </p>

            {subscribed ? (
              <div className="mt-8 inline-flex items-center gap-2.5 rounded-xl border border-[#7FD1AE]/30 bg-white/5 px-5 py-3.5 text-sm font-medium">
                <CheckCircle2 className="h-5 w-5 text-[#7FD1AE]" />
                <span>Thank you for subscribing!</span>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="mx-auto mt-8 flex max-w-md flex-col items-center gap-3 sm:flex-row"
              >
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full rounded-xl border border-white/10 bg-white/[0.07] px-4 py-3.5 text-sm text-[#F3F1EA] placeholder:text-[#F3F1EA]/40 focus:border-[#7FD1AE]/50 focus:outline-none focus:ring-2 focus:ring-[#7FD1AE]/25"
                />
                <button
                  type="submit"
                  className="group inline-flex w-full flex-shrink-0 items-center justify-center gap-2 rounded-xl bg-[#F3F1EA] px-6 py-3.5 text-sm font-semibold text-[#0B1F1A] shadow-[0_10px_25px_-10px_rgba(0,0,0,0.5)] transition-all hover:-translate-y-0.5 hover:bg-white sm:w-auto"
                >
                  Subscribe
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" />
                </button>
              </form>
            )}

            <p className="relative mt-5 text-xs text-[#F3F1EA]/40">
              No spam. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsLetter;