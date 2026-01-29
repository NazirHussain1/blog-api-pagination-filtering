"use client";

import { useState, useEffect } from "react";
import {
  CheckCircle,
  AlertTriangle,
  XCircle,
  Clock,
  Server,
  Database,
  Globe,
  Zap,
  Shield,
  Activity,
  TrendingUp,
} from "lucide-react";

export default function StatusPage() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const services = [
    {
      name: "Website",
      description: "Main InsightHub website and web application",
      status: "operational",
      uptime: "99.9%",
      responseTime: "245ms",
      icon: Globe
    },
    {
      name: "API Services",
      description: "Backend API and data processing services",
      status: "operational",
      uptime: "99.8%",
      responseTime: "120ms",
      icon: Server
    },
    {
      name: "Database",
      description: "Primary database and data storage systems",
      status: "operational",
      uptime: "99.9%",
      responseTime: "45ms",
      icon: Database
    },
    {
      name: "Authentication",
      description: "User login and authentication services",
      status: "operational",
      uptime: "99.7%",
      responseTime: "180ms",
      icon: Shield
    },
    {
      name: "File Upload",
      description: "Image and file upload processing",
      status: "operational",
      uptime: "99.5%",
      responseTime: "320ms",
      icon: Zap
    },
    {
      name: "Email Services",
      description: "Newsletter and notification email delivery",
      status: "operational",
      uptime: "99.6%",
      responseTime: "890ms",
      icon: Activity
    }
  ];

  const incidents = [
    {
      date: "2026-01-28",
      title: "Brief API Slowdown",
      description: "API response times were elevated for approximately 15 minutes due to increased traffic.",
      status: "resolved",
      duration: "15 minutes",
      impact: "minor"
    },
    {
      date: "2026-01-25",
      title: "Scheduled Maintenance",
      description: "Planned database maintenance completed successfully with minimal downtime.",
      status: "resolved",
      duration: "30 minutes",
      impact: "minor"
    },
    {
      date: "2026-01-20",
      title: "Email Delivery Delays",
      description: "Newsletter emails experienced delivery delays due to third-party service issues.",
      status: "resolved",
      duration: "2 hours",
      impact: "minor"
    }
  ];

  const getStatusColor = (status) => {
    switch (status) {
      case "operational":
        return {
          bg: "bg-green-100",
          text: "text-green-800",
          icon: "text-green-600",
          dot: "bg-green-500"
        };
      case "degraded":
        return {
          bg: "bg-yellow-100",
          text: "text-yellow-800",
          icon: "text-yellow-600",
          dot: "bg-yellow-500"
        };
      case "outage":
        return {
          bg: "bg-red-100",
          text: "text-red-800",
          icon: "text-red-600",
          dot: "bg-red-500"
        };
      default:
        return {
          bg: "bg-gray-100",
          text: "text-gray-800",
          icon: "text-gray-600",
          dot: "bg-gray-500"
        };
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "operational":
        return CheckCircle;
      case "degraded":
        return AlertTriangle;
      case "outage":
        return XCircle;
      default:
        return Clock;
    }
  };

  const getIncidentColor = (impact) => {
    switch (impact) {
      case "minor":
        return "text-yellow-600 bg-yellow-100";
      case "major":
        return "text-red-600 bg-red-100";
      case "critical":
        return "text-red-800 bg-red-200";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const overallStatus = services.every(service => service.status === "operational") 
    ? "operational" 
    : services.some(service => service.status === "outage") 
    ? "outage" 
    : "degraded";

  const overallColors = getStatusColor(overallStatus);

  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 translate-y-1/2"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center space-x-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full mb-8">
              <Activity className="w-4 h-4 text-amber-300" />
              <span className="text-sm font-semibold">SYSTEM STATUS</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              System Status
            </h1>
            
            <p className="text-xl md:text-2xl text-indigo-100 mb-8 max-w-3xl mx-auto leading-relaxed">
              Real-time status and performance metrics for all InsightHub services
            </p>

            {/* Overall Status */}
            <div className={`inline-flex items-center space-x-3 ${overallColors.bg} px-6 py-3 rounded-xl`}>
              <div className={`w-3 h-3 ${overallColors.dot} rounded-full animate-pulse`}></div>
              <span className={`font-semibold ${overallColors.text}`}>
                {overallStatus === "operational" ? "All Systems Operational" : 
                 overallStatus === "degraded" ? "Some Systems Degraded" : 
                 "System Outage"}
              </span>
            </div>

            <div className="mt-4 text-indigo-200">
              Last updated: {currentTime.toLocaleString()}
            </div>
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-16 md:h-24 text-white" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path
              d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z"
              fill="currentColor"
            ></path>
          </svg>
        </div>
      </section>

      {/* Services Status */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Service Status</h2>
            
            <div className="space-y-4">
              {services.map((service, idx) => {
                const colors = getStatusColor(service.status);
                const StatusIcon = getStatusIcon(service.status);
                
                return (
                  <div key={idx} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-gray-100 rounded-xl">
                          <service.icon className="w-6 h-6 text-gray-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-gray-900">{service.name}</h3>
                          <p className="text-gray-600 text-sm">{service.description}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-6">
                        <div className="text-right">
                          <div className="text-sm text-gray-500">Uptime</div>
                          <div className="font-semibold text-gray-900">{service.uptime}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm text-gray-500">Response</div>
                          <div className="font-semibold text-gray-900">{service.responseTime}</div>
                        </div>
                        <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${colors.bg}`}>
                          <StatusIcon className={`w-4 h-4 ${colors.icon}`} />
                          <span className={`font-medium text-sm ${colors.text} capitalize`}>
                            {service.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Recent Incidents */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Recent Incidents</h2>
            
            {incidents.length === 0 ? (
              <div className="text-center py-12 bg-white rounded-2xl border border-gray-200">
                <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No Recent Incidents</h3>
                <p className="text-gray-600">All systems have been running smoothly!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {incidents.map((incident, idx) => (
                  <div key={idx} className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{incident.title}</h3>
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getIncidentColor(incident.impact)}`}>
                            {incident.impact}
                          </span>
                          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                            {incident.status}
                          </span>
                        </div>
                        <p className="text-gray-600 mb-3">{incident.description}</p>
                        <div className="flex items-center space-x-4 text-sm text-gray-500">
                          <span>📅 {incident.date}</span>
                          <span>⏱️ Duration: {incident.duration}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Performance Metrics */}
      <section className="py-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Performance Metrics</h2>
            
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl border border-gray-200 p-6 text-center shadow-sm">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 rounded-xl mb-4">
                  <TrendingUp className="w-6 h-6 text-green-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">99.8%</div>
                <div className="text-gray-600">Average Uptime</div>
                <div className="text-sm text-gray-500 mt-1">Last 30 days</div>
              </div>
              
              <div className="bg-white rounded-2xl border border-gray-200 p-6 text-center shadow-sm">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-xl mb-4">
                  <Zap className="w-6 h-6 text-blue-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">185ms</div>
                <div className="text-gray-600">Avg Response Time</div>
                <div className="text-sm text-gray-500 mt-1">Global average</div>
              </div>
              
              <div className="bg-white rounded-2xl border border-gray-200 p-6 text-center shadow-sm">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-xl mb-4">
                  <Activity className="w-6 h-6 text-purple-600" />
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">2.1M</div>
                <div className="text-gray-600">Requests Served</div>
                <div className="text-sm text-gray-500 mt-1">Last 24 hours</div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}