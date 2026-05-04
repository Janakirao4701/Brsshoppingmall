import * as React from "react";
import { 
  MapPin, 
  Phone, 
  Clock, 
  ExternalLink 
} from "lucide-react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const STORES = [
  {
    name: "BSR Shopping Mall - Sompeta",
    address: "Main Road, Sompeta, Srikakulam Dist, AP - 532284",
    phone: "+91 78293 33444",
    hours: "Daily: 9:00 AM – 9:00 PM",
    mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d15119.529323789394!2d84.58474251738281!3d18.892200400000004!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a3d13543d4f5555%3A0x6d9f3f9f9f9f9f9f!2sSompeta%2C%20Andhra%20Pradesh!5e0!3m2!1sen!2sin!4v1714820000000!5m2!1sen!2sin",
    mapLink: "https://maps.google.com/?q=BSR+Shopping+Mall+Sompeta",
  },
  {
    name: "BSR Shopping Mall - Palasa",
    address: "NH-16, Palasa, Srikakulam Dist, AP - 532221",
    phone: "+91 78293 33444",
    hours: "Daily: 9:00 AM – 9:00 PM",
    mapEmbed: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3780.892834!2d84.417834!3d18.874834!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a3d1b543d4f5555%3A0x7d9f3f9f9f9f9f9f!2sPalasa%2C%20Andhra%20Pradesh!5e0!3m2!1sen!2sin!4v1714820000001!5m2!1sen!2sin",
    mapLink: "https://maps.google.com/?q=BSR+Shopping+Mall+Palasa",
  },
];

export function StoreLocator() {
  return (
    <section className="py-16 px-4 bg-slate-50">
      <div className="container mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-heading font-bold mb-4">Visit Our Stores</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Experience our premium collection in person. Visit our branches in Sompeta and Palasa for the best readymade garments.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {STORES.map((store, index) => (
            <Card key={index} className="overflow-hidden shadow-lg border-none">
              <div className="aspect-video w-full">
                <iframe
                  src={store.mapEmbed}
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={store.name}
                ></iframe>
              </div>
              <CardHeader>
                <CardTitle className="text-brand-red">{store.name}</CardTitle>
                <CardDescription className="flex items-start mt-2">
                  <MapPin className="size-4 mr-2 text-brand-orange shrink-0" />
                  {store.address}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
                  <div className="space-y-2">
                    <div className="flex items-center text-sm">
                      <Phone className="size-4 mr-2 text-slate-500" />
                      <a href={`tel:${store.phone}`} className="hover:text-brand-red transition-colors font-medium">
                        {store.phone}
                      </a>
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="size-4 mr-2 text-slate-500" />
                      {store.hours}
                    </div>
                  </div>
                  <Button 
                    variant="outline" 
                    asChild 
                    className="border-brand-orange text-brand-orange hover:bg-brand-orange hover:text-white"
                  >
                    <a href={store.mapLink} target="_blank" rel="noopener noreferrer">
                      Get Directions <ExternalLink className="size-4 ml-2" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
