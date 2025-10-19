"use client"

import Link from "next/link"
import { CheckCircle, AlertTriangle, Clock, Server, Database, Globe, ArrowRight } from "lucide-react"

export default function StatusPage() {
  const services = [
    {
      name: "Website & Dashboard",
      status: "operational",
      icon: <Globe className="w-5 h-5" />
    },
    {
      name: "API Services",
      status: "operational",
      icon: <Server className="w-5 h-5" />
    },
    {
      name: "Database",
      status: "operational",
      icon: <Database className="w-5 h-5" />
    },
    {
      name: "Authentication",
      status: "operational",
      icon: <CheckCircle className="w-5 h-5" />
    }
  ]

  const statusHistory = [
    {
      date: "Oct 18, 2023",
      title: "Scheduled Maintenance",
      description: "Planned maintenance completed successfully with no downtime.",
      status: "resolved"
    },
    {
      date: "Oct 10, 2023",
      title: "API Performance Degradation",
      description: "Experienced slower than usual response times for 2 hours.",
      status: "resolved"
    },
    {
      date: "Oct 5, 2023",
      title: "Database Connection Issues",
      description: "Intermittent connection issues resolved after 45 minutes.",
      status: "resolved"
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "operational":
        return "text-green-500";
      case "degraded":
        return "text-yellow-500";
      case "down":
        return "text-red-500";
      default:
        return "text-muted-foreground";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "operational":
        return "Operational";
      case "degraded":
        return "Degraded Performance";
      case "down":
        return "Down";
      default:
        return "Unknown";
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground mb-6">
          <Link href="/" className="hover:text-foreground">Home</Link>
          <span>/</span>
          <span className="text-foreground">System Status</span>
        </nav>
      </div>

      <div className="text-center mb-12">
        <h1 className="text-4xl font-bold text-foreground mb-4">System Status</h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Current operational status of all Baby Collab services.
        </p>
      </div>

      <div className="bg-card border border-border rounded-xl p-8 mb-12">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-2">All Systems Operational</h2>
            <p className="text-muted-foreground">
              All services are running normally. Last checked: Just now
            </p>
          </div>
          <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
            <CheckCircle className="w-6 h-6 text-green-500" />
          </div>
        </div>

        <div className="space-y-4">
          {services.map((service, index) => (
            <div key={index} className="flex items-center justify-between p-4 bg-muted rounded-lg">
              <div className="flex items-center gap-3">
                <div className="text-muted-foreground">
                  {service.icon}
                </div>
                <span className="font-medium text-foreground">{service.name}</span>
              </div>
              <div className={`flex items-center gap-2 ${getStatusColor(service.status)}`}>
                <span className="capitalize">{getStatusText(service.status)}</span>
                {service.status === "operational" && <CheckCircle className="w-4 h-4" />}
                {service.status === "degraded" && <AlertTriangle className="w-4 h-4" />}
                {service.status === "down" && <AlertTriangle className="w-4 h-4" />}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-card border border-border rounded-xl p-8 mb-12">
        <h2 className="text-2xl font-bold text-foreground mb-6">Recent Incidents</h2>
        <div className="space-y-6">
          {statusHistory.map((incident, index) => (
            <div key={index} className="flex gap-4">
              <div className="flex flex-col items-center">
                <div className="w-3 h-3 rounded-full bg-green-500 mt-2"></div>
                {index < statusHistory.length - 1 && <div className="w-0.5 h-full bg-border mt-2"></div>}
              </div>
              <div className="pb-6">
                <div className="flex items-center gap-3 mb-2">
                  <span className="text-sm font-medium text-muted-foreground">{incident.date}</span>
                  <span className="px-2 py-1 bg-green-500/10 text-green-500 text-xs rounded-full capitalize">
                    {incident.status}
                  </span>
                </div>
                <h3 className="text-lg font-bold text-foreground mb-1">{incident.title}</h3>
                <p className="text-muted-foreground">{incident.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-primary/5 border border-primary/20 rounded-xl p-8">
        <h2 className="text-2xl font-bold text-foreground mb-4">Subscribe to Updates</h2>
        <p className="text-muted-foreground mb-6">
          Get notified about system status changes and maintenance schedules.
        </p>
        <form className="flex flex-col sm:flex-row gap-4">
          <input
            type="email"
            placeholder="Your email address"
            className="flex-1 px-4 py-2 bg-background border border-border rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg font-medium hover:bg-primary/90 transition-colors"
          >
            Subscribe
          </button>
        </form>
      </div>
    </div>
  )
}