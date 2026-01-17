"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Card, CardHeader, CardContent, CardFooter, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Clock, MapPin, Edit, Trash2, PlusCircle } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";

const myEvents = [
  {
    id: 1,
    title: "AI Hackathon 2025",
    date: "2025-11-12",
    time: "9:00 AM",
    venue: "Tech Hub Arena",
    location: "Bangalore, IN",
    price: 150,
    category: "Technology",
  },
  {
    id: 2,
    title: "Startup Expo",
    date: "2025-12-02",
    time: "10:00 AM",
    venue: "Innovation Center",
    location: "Mumbai, IN",
    price: 120,
    category: "Business",
  },
];

export default function DashboardPage() {
  const [events, setEvents] = useState(myEvents);
  const [showForm, setShowForm] = useState(false);
  const [step, setStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [newEvent, setNewEvent] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    venue: "",
    location: "",
    price: "",
    category: "",
    artists: "",
    image: null,
  });
  const router = useRouter();

  useEffect(() => {
    async function fetchEvents() {
      const email = localStorage.getItem("email");
      if (!email) return;
      await axios.post("http://localhost:8080/get-events", { email });
    }
    fetchEvents();
  }, []);

  function handleDelete(id) {
    setEvents(events.filter((e) => e.id !== id));
  }

  function handleEdit(id) {
    router.push(`/custom/organizer/edit/${id}`);
  }

  function handleCreate() {
    setShowForm(true);
  }

  function handleCancel() {
    setShowForm(false);
    setStep(1);
    setErrors({});
    setNewEvent({
      title: "",
      description: "",
      date: "",
      time: "",
      venue: "",
      location: "",
      price: "",
      category: "",
      artists: "",
      image: null,
    });
  }

  function validateStep() {
    const newErrors = {};
    if (step === 1) {
      if (!newEvent.title.trim()) newErrors.title = "Required field";
      if (!newEvent.description.trim()) newErrors.description = "Required field";
      if (newEvent.description.length <= 200)
        newErrors.description = "Description should have more than 50 words.";
    } else if (step === 2) {
      if (!newEvent.date) newErrors.date = "Required field";
      if (!newEvent.time) newErrors.time = "Required field";
      if (!newEvent.venue.trim()) newErrors.venue = "Required field";
      if (!newEvent.location.trim()) newErrors.location = "Required field";
    } else if (step === 3) {
      if (!newEvent.price) newErrors.price = "Required field";
      if (!newEvent.category.trim()) newErrors.category = "Required field";
      if (!newEvent.image) newErrors.image = "Event promo image is required";
      if (
        newEvent.image &&
        !["image/jpeg", "image/jpg"].includes(newEvent.image.type)
      ) {
        newErrors.image = "Only JPEG/JPG images are allowed";
      }
      if (newEvent.category === "Musical" && !newEvent.artists.trim())
        newErrors.artists = "Artists field required for musical events";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  function handleNext() {
    if (validateStep() && step < 3) setStep(step + 1);
  }

  function handleBack() {
    if (step > 1) setStep(step - 1);
  }

  function handleSave() {
    if (!validateStep()) return;
    setEvents([...events, { id: Date.now(), ...newEvent }]);
    handleCancel();
  }

  function handleImageUpload(e) {
    const file = e.target.files[0];
    if (file && ["image/jpeg", "image/jpg"].includes(file.type)) {
      setNewEvent({ ...newEvent, image: file });
      setErrors((prev) => ({ ...prev, image: "" }));
    } else {
      setErrors((prev) => ({
        ...prev,
        image: "Only JPEG/JPG images are allowed",
      }));
      setNewEvent({ ...newEvent, image: null });
    }
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white p-8 overflow-hidden">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
          Organizer Dashboard
        </h1>
        <Button
          onClick={handleCreate}
          className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 flex items-center space-x-2"
        >
          <PlusCircle className="w-5 h-5" />
          <span>Create Event</span>
        </Button>
      </div>

      {events.length === 0 ? (
        <div className="text-center text-slate-400 mt-20">No events posted yet.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <motion.div
              key={event.id}
              className="bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300"
              whileHover={{ y: -5 }}
            >
              <CardHeader>
                <CardTitle className="text-lg text-blue-300">{event.title}</CardTitle>
                <p className="text-slate-400 text-sm">{event.category}</p>
              </CardHeader>

              <CardContent className="text-slate-300 text-sm space-y-2">
                <div className="flex items-center">
                  <Calendar className="w-4 h-4 mr-2 text-blue-400" />
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center">
                  <Clock className="w-4 h-4 mr-2 text-blue-400" />
                  <span>{event.time}</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-blue-400" />
                  <span>
                    {event.venue}, {event.location}
                  </span>
                </div>
              </CardContent>

              <CardFooter className="flex justify-between items-center border-t border-slate-800 pt-4">
                <div className="text-xl font-bold text-cyan-400">${event.price}</div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    className="border-slate-600 text-blue-400 hover:text-blue-300"
                    onClick={() => handleEdit(event.id)}
                  >
                    <Edit className="w-4 h-4 mr-1" /> Edit
                  </Button>
                  <Button
                    variant="outline"
                    className="border-slate-600 text-rose-400 hover:text-rose-300"
                    onClick={() => handleDelete(event.id)}
                  >
                    <Trash2 className="w-4 h-4 mr-1" /> Delete
                  </Button>
                </div>
              </CardFooter>
            </motion.div>
          ))}
        </div>
      )}

      {/* Slide-in Stepper Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 80, damping: 18 }}
            className="absolute top-0 right-0 w-full md:w-[45%] h-full bg-slate-900/95 backdrop-blur-lg border-l border-slate-800 p-8 overflow-y-auto z-50 shadow-[0_0_30px_rgba(56,189,248,0.2)]"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                Create New Event
              </h2>
              <Button
                onClick={handleCancel}
                className="bg-slate-800 hover:bg-slate-700 text-slate-300 px-3"
              >
                ✕
              </Button>
            </div>

            {/* Stepper */}
            <div className="flex items-center justify-between mb-10 relative">
              {[1, 2, 3].map((num, idx) => (
                <div key={num} className="flex-1 flex items-center">
                  <div
                    className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold ${
                      step >= num
                        ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white shadow-lg shadow-cyan-500/30"
                        : "bg-slate-800 text-slate-500 border border-slate-700"
                    }`}
                  >
                    {num}
                  </div>
                  {idx < 2 && (
                    <div
                      className={`flex-1 h-[2px] ${
                        step > num
                          ? "bg-gradient-to-r from-cyan-400 to-blue-500"
                          : "bg-slate-700"
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Step Content */}
            <motion.div
              key={step}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-6"
            >
              {/* STEP 1 */}
              {step === 1 && (
                <>
                  <div>
                    <label className="block text-slate-400 mb-1">Event Name</label>
                    <input
                      type="text"
                      placeholder="Enter event name"
                      className={`w-full bg-slate-800 p-3 rounded-xl border ${
                        errors.title ? "border-red-500" : "border-slate-700"
                      } text-white focus:ring-2 focus:ring-cyan-500 outline-none`}
                      value={newEvent.title}
                      onChange={(e) =>
                        setNewEvent({ ...newEvent, title: e.target.value })
                      }
                    />
                    {errors.title && (
                      <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                    )}
                  </div>
                  <div>
                    <label className="block text-slate-400 mb-1">
                      Event Description
                    </label>
                    <textarea
                      placeholder="Describe your event..."
                      className={`w-full bg-slate-800 p-3 rounded-xl border ${
                        errors.description ? "border-red-500" : "border-slate-700"
                      } text-white focus:ring-2 focus:ring-cyan-500 outline-none`}
                      rows="4"
                      value={newEvent.description}
                      onChange={(e) =>
                        setNewEvent({ ...newEvent, description: e.target.value })
                      }
                    />
                    {errors.description && (
                      <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                    )}
                  </div>
                </>
              )}

              {/* STEP 2 */}
              {step === 2 && (
                <>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-slate-400 mb-1">Date</label>
                      <input
                        type="date"
                        className={`w-full bg-slate-800 p-3 rounded-xl border ${
                          errors.date ? "border-red-500" : "border-slate-700"
                        } text-white focus:ring-2 focus:ring-cyan-500 outline-none`}
                        value={newEvent.date}
                        onChange={(e) =>
                          setNewEvent({ ...newEvent, date: e.target.value })
                        }
                      />
                      {errors.date && (
                        <p className="text-red-500 text-sm mt-1">{errors.date}</p>
                      )}
                    </div>
                    <div>
                      <label className="block text-slate-400 mb-1">Time</label>
                      <input
                        type="time"
                        className={`w-full bg-slate-800 p-3 rounded-xl border ${
                          errors.time ? "border-red-500" : "border-slate-700"
                        } text-white focus:ring-2 focus:ring-cyan-500 outline-none`}
                        value={newEvent.time}
                        onChange={(e) =>
                          setNewEvent({ ...newEvent, time: e.target.value })
                        }
                      />
                      {errors.time && (
                        <p className="text-red-500 text-sm mt-1">{errors.time}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Venue</label>
                    <input
                      type="text"
                      placeholder="Event venue"
                      className={`w-full bg-slate-800 p-3 rounded-xl border ${
                        errors.venue ? "border-red-500" : "border-slate-700"
                      } text-white focus:ring-2 focus:ring-cyan-500 outline-none`}
                      value={newEvent.venue}
                      onChange={(e) =>
                        setNewEvent({ ...newEvent, venue: e.target.value })
                      }
                    />
                    {errors.venue && (
                      <p className="text-red-500 text-sm mt-1">{errors.venue}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Location</label>
                    <input
                      type="text"
                      placeholder="City, Country"
                      className={`w-full bg-slate-800 p-3 rounded-xl border ${
                        errors.location ? "border-red-500" : "border-slate-700"
                      } text-white focus:ring-2 focus:ring-cyan-500 outline-none`}
                      value={newEvent.location}
                      onChange={(e) =>
                        setNewEvent({ ...newEvent, location: e.target.value })
                      }
                    />
                    {errors.location && (
                      <p className="text-red-500 text-sm mt-1">{errors.location}</p>
                    )}
                  </div>
                </>
              )}

              {/* STEP 3 */}
              {step === 3 && (
                <>
                  <div>
                    <label className="block text-slate-400 mb-1">Price (USD)</label>
                    <input
                      type="number"
                      placeholder="Enter ticket price"
                      className={`w-full bg-slate-800 p-3 rounded-xl border ${
                        errors.price ? "border-red-500" : "border-slate-700"
                      } text-white focus:ring-2 focus:ring-cyan-500 outline-none`}
                      value={newEvent.price}
                      onChange={(e) =>
                        setNewEvent({ ...newEvent, price: e.target.value })
                      }
                    />
                    {errors.price && (
                      <p className="text-red-500 text-sm mt-1">{errors.price}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-slate-400 mb-1">Category</label>
                    <select
                      className={`w-full bg-slate-800 p-3 rounded-xl border ${
                        errors.category ? "border-red-500" : "border-slate-700"
                      } text-white focus:ring-2 focus:ring-cyan-500 outline-none`}
                      value={newEvent.category}
                      onChange={(e) =>
                        setNewEvent({ ...newEvent, category: e.target.value })
                      }
                    >
                      <option value="">Select Category</option>
                      <option value="Technology">Technology</option>
                      <option value="Business">Business</option>
                      <option value="Musical">Musical</option>
                      <option value="Art">Art</option>
                      <option value="Sports">Sports</option>
                    </select>
                    {errors.category && (
                      <p className="text-red-500 text-sm mt-1">{errors.category}</p>
                    )}
                  </div>

                  {/* Artists field if category is musical */}
                  {newEvent.category === "Musical" && (
                    <div>
                      <label className="block text-slate-400 mb-1">Artists</label>
                      <input
                        type="text"
                        placeholder="Enter performing artists"
                        className={`w-full bg-slate-800 p-3 rounded-xl border ${
                          errors.artists ? "border-red-500" : "border-slate-700"
                        } text-white focus:ring-2 focus:ring-cyan-500 outline-none`}
                        value={newEvent.artists}
                        onChange={(e) =>
                          setNewEvent({ ...newEvent, artists: e.target.value })
                        }
                      />
                      {errors.artists && (
                        <p className="text-red-500 text-sm mt-1">{errors.artists}</p>
                      )}
                    </div>
                  )}

                  {/* Event Promo Image */}
                  <div>
                    <label className="block text-slate-400 mb-1">
                      Event Promo Image (JPEG/JPG)
                    </label>
                    <input
                      type="file"
                      accept=".jpeg,.jpg"
                      onChange={handleImageUpload}
                      className="w-full text-slate-300 bg-slate-800 p-3 rounded-xl border border-slate-700"
                    />
                    {errors.image && (
                      <p className="text-red-500 text-sm mt-1">{errors.image}</p>
                    )}
                    {newEvent.image && (
                      <p className="text-emerald-400 text-sm mt-1">
                        Uploaded: {newEvent.image.name}
                      </p>
                    )}
                  </div>

                  {/* Preview */}
                  <div>
                    <label className="block text-slate-400 mb-1">Preview</label>
                    <div className="bg-slate-800 p-4 rounded-xl text-slate-300 border border-slate-700">
                      <p className="text-cyan-400 font-semibold">{newEvent.title}</p>
                      <p className="text-sm text-slate-400">{newEvent.description}</p>
                      <p className="mt-2 text-sm">
                        {newEvent.date} at {newEvent.time}
                      </p>
                      <p className="text-sm">
                        {newEvent.venue}, {newEvent.location}
                      </p>
                      <p className="text-sm text-emerald-400 font-semibold mt-1">
                        ${newEvent.price}
                      </p>
                      {newEvent.category === "Musical" && (
                        <p className="text-sm text-sky-400 mt-1">
                          Artists: {newEvent.artists}
                        </p>
                      )}
                    </div>
                  </div>
                </>
              )}
            </motion.div>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-10">
              {step > 1 && (
                <Button
                  onClick={handleBack}
                  className="bg-slate-800 border border-slate-700 hover:bg-slate-700 px-6"
                >
                  Back
                </Button>
              )}
              {step < 3 ? (
                <Button
                  onClick={handleNext}
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 px-6 ml-auto"
                >
                  Next
                </Button>
              ) : (
                <div className="ml-auto flex space-x-3">
                  <Button
                    onClick={handleSave}
                    className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 px-6"
                  >
                    Save
                  </Button>
                  <Button
                    onClick={handleCancel}
                    className="bg-slate-700 hover:bg-slate-600 px-6"
                  >
                    Cancel
                  </Button>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
