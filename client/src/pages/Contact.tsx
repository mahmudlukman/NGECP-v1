import React, { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  Clock,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "Inspection Inquiry",
    message: "",
  });

  const [status, setStatus] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("submitting");

    setTimeout(() => {
      setStatus("success");
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "Inspection Inquiry",
        message: "",
      });
    }, 1200);
  };

  const inputClasses =
    "w-full px-3.5 py-2.5 rounded-lg border border-[#0B1F1A]/15 focus:outline-none focus:ring-2 focus:ring-[#16785A]/20 focus:border-[#16785A] transition-all text-[#0B1F1A] bg-white placeholder:text-[#0B1F1A]/35";
  const labelClasses = "block font-semibold text-[#0B1F1A]/80 mb-1";

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#F7F6F1] px-4 py-16 font-[Figtree,ui-sans-serif,system-ui,sans-serif] text-[#0B1F1A] sm:px-6 lg:px-8">
      {/* Faint dot texture */}
      <div
        aria-hidden="true"
        className="absolute inset-0 opacity-[0.3] [background-image:radial-gradient(#0B1F1A_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]"
      />

      <div className="relative mx-auto max-w-6xl">
        {/* Header */}
        <div className="mx-auto mb-14 max-w-2xl text-center">
          <div className="mb-5 flex items-center justify-center gap-3">
            <span className="h-px w-10 bg-[#16785A]" />
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-[#16785A]">
              Contact
            </span>
            <span className="h-px w-10 bg-[#16785A]" />
          </div>
          <h1 className="font-[Newsreader,Georgia,serif] text-3xl font-normal tracking-tight sm:text-4xl">
            Get in touch
          </h1>
          <p className="mt-4 text-sm leading-relaxed text-[#0B1F1A]/65 sm:text-base">
            Have questions regarding generator registrations, emission
            checks, or platform technical support? Reach out to our team.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Contact Information Sidebar */}
          <div className="space-y-5 lg:col-span-1">
            <div className="relative overflow-hidden rounded-2xl bg-[#0B1F1A] p-8 text-[#F3F1EA] shadow-[0_30px_60px_-25px_rgba(11,31,26,0.4)]">
              <div
                aria-hidden="true"
                className="absolute inset-0 opacity-[0.3] [background-image:radial-gradient(rgba(243,241,234,0.5)_1px,transparent_1px)] [background-size:22px_22px] [mask-image:radial-gradient(ellipse_at_top_right,black,transparent_65%)]"
              />
              <div className="relative space-y-6">
                <h2 className="font-[Newsreader,Georgia,serif] text-xl font-normal">
                  Contact Details
                </h2>
                <p className="text-xs text-[#F3F1EA]/60">
                  Fill out the form or reach us via our direct communication
                  channels below.
                </p>

                <div className="space-y-5 pt-2 text-xs sm:text-sm">
                  <div className="flex items-start gap-3">
                    <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-[#7FD1AE]/30 text-[#7FD1AE]">
                      <MapPin className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="font-semibold text-[#F3F1EA]">
                        Head Office
                      </p>
                      <p className="mt-0.5 text-[#F3F1EA]/60">
                        Plot 1024, Central Business District, Abuja, Nigeria
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-[#7FD1AE]/30 text-[#7FD1AE]">
                      <Phone className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="font-semibold text-[#F3F1EA]">Phone</p>
                      <p className="mt-0.5 text-[#F3F1EA]/60">
                        +234 (0) 800 364 7746
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-[#7FD1AE]/30 text-[#7FD1AE]">
                      <Mail className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="font-semibold text-[#F3F1EA]">Email</p>
                      <p className="mt-0.5 text-[#F3F1EA]/60">
                        support@ngecp.com.ng
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 pt-1">
                    <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-[#7FD1AE]/30 text-[#7FD1AE]">
                      <Clock className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="font-semibold text-[#F3F1EA]">
                        Working Hours
                      </p>
                      <p className="mt-0.5 text-[#F3F1EA]/60">
                        Monday – Friday: 8:00 AM – 5:00 PM WAT
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-[#16785A]/20 bg-[#16785A]/[0.05] p-6 text-xs">
              <h3 className="mb-1.5 text-sm font-semibold text-[#16785A]">
                Need Urgent Field Support?
              </h3>
              <p className="leading-relaxed text-[#0B1F1A]/65">
                For urgent inspector re-assignments or site verification
                emergencies, call our direct priority line.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="rounded-2xl border border-[#0B1F1A]/10 bg-white p-8 shadow-[0_20px_50px_-30px_rgba(11,31,26,0.25)] lg:col-span-2">
            <h2 className="mb-6 font-[Newsreader,Georgia,serif] text-xl font-normal">
              Send Us a Message
            </h2>

            {status === "success" && (
              <div className="mb-6 flex items-center gap-3 rounded-xl border border-[#16785A]/25 bg-[#16785A]/[0.06] p-4 text-sm text-[#0B1F1A]">
                <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-[#16785A]" />
                <span>
                  Thank you! Your message has been sent successfully. We
                  will get back to you shortly.
                </span>
              </div>
            )}

            {status === "error" && (
              <div className="mb-6 flex items-center gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-800">
                <AlertCircle className="h-5 w-5 flex-shrink-0 text-rose-600" />
                <span>
                  Something went wrong while sending your message. Please
                  try again.
                </span>
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="space-y-5 text-xs sm:text-sm"
            >
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className={labelClasses}>
                    Full Name *
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g. John Doe"
                    className={inputClasses}
                  />
                </div>

                <div>
                  <label htmlFor="email" className={labelClasses}>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@company.com"
                    className={inputClasses}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <label htmlFor="phone" className={labelClasses}>
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+234 800 000 0000"
                    className={inputClasses}
                  />
                </div>

                <div>
                  <label htmlFor="subject" className={labelClasses}>
                    Subject *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className={inputClasses}
                  >
                    <option value="Inspection Inquiry">
                      Inspection Inquiry
                    </option>
                    <option value="Generator Registration">
                      Generator Registration
                    </option>
                    <option value="Billing & Receipts">
                      Billing & Receipts
                    </option>
                    <option value="Technical Support">
                      Technical Support
                    </option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="message" className={labelClasses}>
                  Message *
                </label>
                <textarea
                  id="message"
                  name="message"
                  required
                  rows={5}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="How can we assist you today?"
                  className={`${inputClasses} resize-none`}
                />
              </div>

              <button
                type="submit"
                disabled={status === "submitting"}
                className="group flex w-full items-center justify-center gap-2 rounded-full bg-[#0B1F1A] px-6 py-3.5 text-sm font-semibold text-[#F3F1EA] shadow-[0_10px_25px_-12px_rgba(11,31,26,0.5)] transition-all hover:-translate-y-0.5 hover:bg-[#12332b] disabled:translate-y-0 disabled:bg-[#0B1F1A]/50 sm:w-auto focus:outline-none"
              >
                {status === "submitting" ? (
                  <span>Sending Message...</span>
                ) : (
                  <>
                    <Send className="h-4 w-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none" />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;