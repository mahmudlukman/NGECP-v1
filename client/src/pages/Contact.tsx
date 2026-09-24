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

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8 text-slate-700">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-800 tracking-tight">
            Get in Touch
          </h1>
          <p className="text-slate-500 text-sm sm:text-base mt-2">
            Have questions regarding generator registrations, emission checks,
            or platform technical support? Reach out to our team.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Information Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-emerald-700 text-white p-8 rounded-2xl shadow-xs space-y-6">
              <h2 className="text-xl font-bold">Contact Details</h2>
              <p className="text-xs text-emerald-100">
                Fill out the form or reach us via our direct communication
                channels below.
              </p>

              <div className="space-y-4 text-xs sm:text-sm pt-2">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-emerald-200 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-white">Head Office</p>
                    <p className="text-emerald-100 mt-0.5">
                      Plot 1024, Central Business District, Abuja, Nigeria
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="w-5 h-5 text-emerald-200 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-white">Phone</p>
                    <p className="text-emerald-100 mt-0.5">
                      +234 (0) 800 364 7746
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-emerald-200 flex-shrink-0" />
                  <div>
                    <p className="font-semibold text-white">Email</p>
                    <p className="text-emerald-100 mt-0.5">
                      support@emissioncontrol.gov.ng
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 pt-2">
                  <Clock className="w-5 h-5 text-emerald-200 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-semibold text-white">Working Hours</p>
                    <p className="text-emerald-100 mt-0.5">
                      Monday – Friday: 8:00 AM – 5:00 PM WAT
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-emerald-200 p-6 rounded-2xl text-xs text-slate-700">
              <h3 className="font-bold text-sm text-emerald-700 mb-1">
                Need Urgent Field Support?
              </h3>
              <p className="text-slate-600">
                For urgent inspector re-assignments or site verification
                emergencies, call our direct priority line.
              </p>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2 bg-white p-8 rounded-2xl border border-slate-200 shadow-xs">
            <h2 className="text-xl font-bold text-slate-800 mb-6">
              Send Us a Message
            </h2>

            {status === "success" && (
              <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl flex items-center gap-3 text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
                <span>
                  Thank you! Your message has been sent successfully. We will
                  get back to you shortly.
                </span>
              </div>
            )}

            {status === "error" && (
              <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl flex items-center gap-3 text-sm">
                <AlertCircle className="w-5 h-5 text-rose-600 flex-shrink-0" />
                <span>
                  Something went wrong while sending your message. Please try
                  again.
                </span>
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="space-y-5 text-xs sm:text-sm"
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label
                    htmlFor="name"
                    className="block font-semibold text-slate-700 mb-1"
                  >
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
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all text-slate-800 bg-white"
                  />
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block font-semibold text-slate-700 mb-1"
                  >
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
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all text-slate-800 bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label
                    htmlFor="phone"
                    className="block font-semibold text-slate-700 mb-1"
                  >
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+234 800 000 0000"
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all text-slate-800 bg-white"
                  />
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="block font-semibold text-slate-700 mb-1"
                  >
                    Subject *
                  </label>
                  <select
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all text-slate-800 bg-white"
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
                    <option value="Technical Support">Technical Support</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
              </div>

              <div>
                <label
                  htmlFor="message"
                  className="block font-semibold text-slate-700 mb-1"
                >
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
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-600 transition-all text-slate-800 bg-white resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={status === "submitting"}
                className="w-full sm:w-auto px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-400 text-white font-semibold text-sm rounded-lg transition-colors flex items-center justify-center gap-2 shadow-xs focus:outline-none"
              >
                {status === "submitting" ? (
                  <span>Sending Message...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
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
