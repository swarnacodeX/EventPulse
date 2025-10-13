// src/app/page.js
"use client";
import { useSelector } from "react-redux";

import { useDispatch } from "react-redux";
import { setCredentials, clearCredentials } from "../lib/redux/authSlice";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  MapPin, 
  Clock, 
  Ticket, 
  Search, 
  Menu, 
  X,
  Star,
  ArrowRight,
  User,
  ChevronRight,
  Filter,
  Heart,
  Share
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import useAuth  from '@/lib/auth';
import Link from 'next/link';

// Event data
const eventsData = [
  {
    id: 1,
    title: "Neon Nights Festival",
    date: "2025-09-15",
    time: "8:00 PM",
    venue: "Starlight Arena",
    location: "New York, NY",
    price: 75,
    image: "/api/placeholder/400/250",
    category: "Music",
    trending: true,
    featured: true,
    rating: 4.8,
    attendees: 12500
  },
  {
    id: 2,
    title: "Tech Summit 2025",
    date: "2025-10-05",
    time: "9:00 AM",
    venue: "Convention Center",
    location: "San Francisco, CA",
    price: 199,
    image: "/api/placeholder/400/250",
    category: "Conference",
    trending: true,
    rating: 4.7,
    attendees: 8500
  },
  {
    id: 3,
    title: "Cosmic Comedy Night",
    date: "2025-08-25",
    time: "7:30 PM",
    venue: "Laugh Factory",
    location: "Los Angeles, CA",
    price: 45,
    image: "/api/placeholder/400/250",
    category: "Comedy",
    trending: true,
    rating: 4.5,
    attendees: 3200
  },
  {
    id: 4,
    title: "Future Art Exhibition",
    date: "2025-09-08",
    time: "10:00 AM",
    venue: "Modern Art Museum",
    location: "Chicago, IL",
    price: 30,
    image: "/api/placeholder/400/250",
    category: "Art",
    rating: 4.6,
    attendees: 5400
  },
  {
    id: 5,
    title: "Cyberpunk Film Festival",
    date: "2025-10-12",
    time: "6:00 PM",
    venue: "Paramount Theater",
    location: "Austin, TX",
    price: 55,
    image: "/api/placeholder/400/250",
    category: "Film",
    rating: 4.9,
    attendees: 6800
  },
  {
    id: 6,
    title: "Virtual Reality Expo",
    date: "2025-09-22",
    time: "11:00 AM",
    venue: "Tech Hub",
    location: "Seattle, WA",
    price: 65,
    image: "/api/placeholder/400/250",
    category: "Technology",
    rating: 4.4,
    attendees: 9200
  }
];

const categories = [
  "All", "Music", "Conference", "Comedy", "Art", "Film", "Technology", "Sports"
];

const cities = [
  "New York", "Los Angeles", "Chicago", "San Francisco", "Miami", "Austin", "Seattle"
];

// Event Card Component
const EventCard = ({ event }) => {
  const [isLiked, setIsLiked] = useState(false);

  return (
    <motion.div 
      className="group bg-gradient-to-br from-slate-900 via-blue-900/20 to-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:shadow-2xl hover:shadow-blue-500/20 transition-all duration-300"
      whileHover={{ y: -5 }}
    >
      <div className="relative overflow-hidden">
        <div className="h-48 bg-gradient-to-r from-blue-700 to-cyan-500 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors"></div>
          <div className="absolute top-4 right-4 bg-blue-600 px-3 py-1 rounded-full text-xs font-medium">
            {event.category}
          </div>
          {event.trending && (
            <div className="absolute top-4 left-4 bg-rose-600 px-3 py-1 rounded-full text-xs font-medium flex items-center">
              <Star className="w-3 h-3 mr-1 fill-current" />
              Trending
            </div>
          )}
          <div className="absolute bottom-4 left-4 right-4 flex justify-between items-center">
            <div className="flex items-center text-white text-sm">
              <User className="w-4 h-4 mr-1" />
              {event.attendees.toLocaleString()}
            </div>
            <div className="flex space-x-2">
              <button 
                className="p-2 bg-slate-900/70 rounded-full hover:bg-slate-800 transition-colors"
                onClick={() => setIsLiked(!isLiked)}
              >
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500 text-rose-500' : 'text-white'}`} />
              </button>
              <button className="p-2 bg-slate-900/70 rounded-full hover:bg-slate-800 transition-colors">
                <Share className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <CardHeader className="pb-3">
        <CardTitle className="text-lg group-hover:text-blue-300 transition-colors">{event.title}</CardTitle>
        <div className="flex items-center text-sm text-slate-400">
          <Star className="w-4 h-4 mr-1 text-yellow-400 fill-yellow-400" />
          <span>{event.rating}</span>
        </div>
      </CardHeader>
      
      <CardContent className="pb-4">
        <div className="space-y-2 text-slate-300 text-sm">
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
            <span className="truncate">{event.venue}, {event.location}</span>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between items-center pt-0">
        <div className="text-2xl font-bold text-cyan-400">${event.price}</div>
        <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
          Book Now
        </Button>
      </CardFooter>
    </motion.div>
  );
};

// Bento Grid Component
const BentoGrid = ({ events }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </div>
  );
};

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { emailState, passwordStae, isLoggedIn,role } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();
  const filteredEvents = activeCategory === "All" 
    ? eventsData 
    : eventsData.filter(event => event.category === activeCategory);

  const trendingEvents = eventsData.filter(event => event.trending);
  const featuredEvent = eventsData.find(event => event.featured);
  const router=useRouter();
  function logout(){
    clearCredentials();
    localStorage.removeItem("email");
    router.push("/login");
  }
  // Filter events based on search query
  const searchedEvents = searchQuery 
    ? filteredEvents.filter(event => 
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.venue.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.location.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : filteredEvents;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-900 text-white">
      {/* Navigation */}
      <nav className="border-b border-slate-800/50 backdrop-blur-md bg-slate-900/30 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
              <Ticket className="w-5 h-5" />
            </div>
            <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">
              EVENTPULSE  {}
            </h1>
          </div>

          <div className="hidden md:flex space-x-8">
            {categories.slice(0, 5).map((category) => (
              <Button
                key={category}
                variant={activeCategory === category ? "default" : "ghost"}
                className={`transition-all ${activeCategory === category ? "bg-blue-600" : "text-slate-300 hover:text-white hover:bg-slate-800"}`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search events..."
                className="pl-10 w-64 bg-slate-800/50 border-slate-700 text-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            
            {isLoggedIn ? (
              <div className="flex items-center space-x-4">
                <Button variant="ghost" className="text-slate-300 hover:text-white">
                  <Link href="/profile">Profile</Link>
                </Button>
                <Button variant="ghost" className="text-slate-300 hover:text-white" 
                onClick={()=>logout()}>Logout
                </Button>
                { role=="ORGANIZER" && (
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Link href="/organizer/dashboard">Dashboard</Link>
                  </Button>
                )}
              </div>
            ) : (
              <div className="flex items-center space-x-2">
                <Button variant="ghost" className="text-slate-300 hover:text-white">
                  <Link href="/login">Sign In</Link>
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Link href="/signup">Sign Up</Link>
                </Button>
              </div>
            )}

            <Button 
              variant="ghost"
              size="icon"
              className="md:hidden text-slate-300 hover:text-white hover:bg-slate-800"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-slate-900/95 backdrop-blur-lg border-t border-slate-800/50">
            <div className="container mx-auto px-4 py-4 flex flex-col space-y-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <Input
                  type="text"
                  placeholder="Search events..."
                  className="pl-10 bg-slate-800/50 border-slate-700 text-white"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={activeCategory === category ? "default" : "ghost"}
                  className={`text-left ${activeCategory === category ? "bg-blue-600" : "text-slate-300 hover:text-white hover:bg-slate-800"}`}
                  onClick={() => {
                    setActiveCategory(category);
                    setMobileMenuOpen(false);
                  }}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        )}
      </nav>

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="mb-16">
          <div className="flex flex-col items-center text-center">
            <motion.h1 
              className="text-5xl md:text-7xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              Discover <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-400">Extraordinary</span> Events
            </motion.h1>
            <motion.p 
              className="text-xl text-slate-300 mb-10 max-w-2xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              Experience the future of event booking with cutting-edge technology and seamless discovery.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 w-full max-w-md"
            >
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <Input 
                  type="text" 
                  placeholder="Search events, artists, venues..." 
                  className="w-full pl-10 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent backdrop-blur-sm"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 rounded-lg transition-all flex items-center justify-center space-x-2">
                <span>Explore</span>
                <ArrowRight className="w-5 h-5" />
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Category Filter */}
        <section className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold">Browse Categories</h2>
            <Button variant="ghost" className="text-blue-400 hover:text-blue-300 flex items-center">
              View all <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
          <div className="flex overflow-x-auto pb-2 space-x-2 scrollbar-hide">
            {categories.map((category) => (
              <Button
                key={category}
                variant={activeCategory === category ? "default" : "outline"}
                className={`whitespace-nowrap rounded-full ${activeCategory === category ? "bg-blue-600" : "bg-slate-800/50 text-slate-300 hover:bg-slate-700/50 hover:text-white border-slate-700"}`}
                onClick={() => setActiveCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </section>

        {/* Trending Events */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Trending Events</h2>
            <Button variant="ghost" className="text-blue-400 hover:text-blue-300 flex items-center">
              View all <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
          
          <BentoGrid events={trendingEvents} />
        </section>

        {/* Featured Event */}
        {featuredEvent && (
          <section className="mb-16">
            <motion.div 
              className="bg-gradient-to-r from-blue-900/30 to-cyan-900/30 border border-slate-800 rounded-2xl p-8 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex flex-col md:flex-row gap-8">
                <div className="flex-1">
                  <div className="bg-blue-600 px-3 py-1 rounded-full text-sm font-medium inline-block mb-4">
                    FEATURED EVENT
                  </div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">{featuredEvent.title}</h2>
                  <p className="text-slate-300 mb-6">
                    Experience the ultimate fusion of music and technology at our flagship festival. 
                    Featuring world-class artists and cutting-edge visual productions.
                  </p>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="flex items-center">
                      <Calendar className="w-5 h-5 mr-2 text-blue-400" />
                      <span>{featuredEvent.date}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-5 h-5 mr-2 text-blue-400" />
                      <span>{featuredEvent.time}</span>
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-5 h-5 mr-2 text-blue-400" />
                      <span>{featuredEvent.venue}</span>
                    </div>
                    <div className="flex items-center">
                      <User className="w-5 h-5 mr-2 text-blue-400" />
                      <span>{featuredEvent.attendees.toLocaleString()} attendees</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4">
                    <Button className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 rounded-lg font-medium transition-all">
                      Book Tickets
                    </Button>
                    <div className="text-2xl font-bold text-cyan-400">${featuredEvent.price}</div>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="h-64 bg-gradient-to-r from-blue-700 to-cyan-500 rounded-xl flex items-center justify-center">
                    <div className="text-white text-center">
                      <Ticket className="w-12 h-12 mx-auto mb-2" />
                      <p className="text-lg">Event Image</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </section>
        )}

        {/* All Events */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">All Events</h2>
            <Button variant="outline" className="border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>
          
          {searchedEvents.length > 0 ? (
            <BentoGrid events={searchedEvents} />
          ) : (
            <div className="text-center py-12">
              <div className="text-blue-400 mb-4">
                <Search className="w-12 h-12 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold mb-2">No events found</h3>
              <p className="text-slate-400">Try adjusting your search or filter criteria</p>
            </div>
          )}
        </section>

        {/* Cities Section */}
        <section className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold">Popular Cities</h2>
            <Button variant="ghost" className="text-blue-400 hover:text-blue-300 flex items-center">
              View all <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {cities.map((city) => (
              <motion.div 
                key={city}
                className="bg-slate-800/50 border border-slate-700 rounded-xl p-6 text-center hover:bg-slate-700/50 transition-colors cursor-pointer"
                whileHover={{ scale: 1.05 }}
              >
                <MapPin className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                <h3 className="font-semibold">{city}</h3>
                <p className="text-sm text-slate-400">500+ events</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Newsletter Section */}
        <section className="mb-16">
          <div className="bg-gradient-to-r from-blue-900/30 to-slate-900/30 border border-slate-800 rounded-2xl p-8 text-center backdrop-blur-sm">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Never Miss an Event</h2>
            <p className="text-slate-300 mb-6 max-w-2xl mx-auto">
              Subscribe to our newsletter and be the first to know about exclusive events, 
              pre-sale tickets, and special offers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
              <Input 
                type="email" 
                placeholder="Your email address" 
                className="flex-1 bg-slate-800/50 border-slate-700 text-white"
              />
              <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700">
                Subscribe
              </Button>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 border-t border-slate-800">
        <div className="container mx-auto px-4 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Ticket className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-bold">EVENTPULSE</h3>
              </div>
              <p className="text-slate-400">
                The future of event discovery and booking. Experience events like never before.
              </p>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-slate-400">
                <li><Link href="/about" className="hover:text-blue-400 transition-colors">About Us</Link></li>
                <li><Link href="/careers" className="hover:text-blue-400 transition-colors">Careers</Link></li>
                <li><Link href="/contact" className="hover:text-blue-400 transition-colors">Contact</Link></li>
                <li><Link href="/blog" className="hover:text-blue-400 transition-colors">Blog</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-slate-400">
                <li><Link href="/help" className="hover:text-blue-400 transition-colors">Help Center</Link></li>
                <li><Link href="/faq" className="hover:text-blue-400 transition-colors">FAQs</Link></li>
                <li><Link href="/insurance" className="hover:text-blue-400 transition-colors">Ticket Insurance</Link></li>
                <li><Link href="/refund" className="hover:text-blue-400 transition-colors">Refund Policy</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Connect</h4>
              <ul className="space-y-2 text-slate-400">
                <li><Link href="#" className="hover:text-blue-400 transition-colors">Twitter</Link></li>
                <li><Link href="#" className="hover:text-blue-400 transition-colors">Instagram</Link></li>
                <li><Link href="#" className="hover:text-blue-400 transition-colors">Facebook</Link></li>
                <li><Link href="#" className="hover:text-blue-400 transition-colors">LinkedIn</Link></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-slate-800 mt-8 pt-8 text-center text-slate-500">
            <p>© 2025 EventPulse. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}