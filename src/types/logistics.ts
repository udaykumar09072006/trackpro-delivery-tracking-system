export type TrackingStatus = 
  | 'Pending' 
  | 'In Transit' 
  | 'Out for Delivery' 
  | 'Delivered' 
  | 'Failed';

export type PackagePriority = 'Standard' | 'Express' | 'Overnight' | 'Fragile';

export interface TimelineEvent {
  id: string;
  status: TrackingStatus;
  title: string;
  description: string;
  location: string;
  timestamp: string;
  completed: boolean;
  courierNotes?: string;
}

export interface Package {
  id: string; // e.g. TRK-8924-IN
  senderName: string;
  senderAddress: string;
  senderCity: string;
  receiverName: string;
  receiverAddress: string;
  receiverCity: string;
  receiverPhone: string;
  receiverEmail: string;
  status: TrackingStatus;
  priority: PackagePriority;
  weightKg: number;
  dimensions: string;
  serviceType: string;
  estimatedDelivery: string;
  assignedCourierId: string;
  assignedCourierName: string;
  routeId: string;
  currentLocationName: string;
  originLocationName: string;
  destinationLocationName: string;
  timeline: TimelineEvent[];
  notes?: string;
  customerRating?: {
    score: number;
    comment: string;
    date: string;
  };
  signatureProof?: {
    recipientName: string;
    signedAt: string;
    photoUrl?: string;
  };
  createdAt: string;
  updatedAt: string;
}

export interface Courier {
  id: string;
  name: string;
  phone: string;
  email: string;
  avatar: string;
  vehicleType: 'Electric Van' | 'Cargo Bike' | 'Motorcycle' | 'Heavy Van';
  vehiclePlate: string;
  status: 'Available' | 'On Route' | 'On Break' | 'Off Duty';
  rating: number;
  deliveriesCount: number;
  onTimeRate: number;
  activePackagesCount: number;
  currentZone: string;
}

export interface RouteWaypoint {
  id: string;
  stopNumber: number;
  address: string;
  recipient: string;
  packageId: string;
  status: 'Pending' | 'Completed' | 'Attempted';
  coordinates: { x: number; y: number }; // SVG map coordinates 0-100%
  etaMinutes: number;
}

export interface DeliveryRoute {
  id: string;
  name: string;
  zone: string;
  courierId: string;
  courierName: string;
  totalStops: number;
  completedStops: number;
  distanceKm: number;
  estimatedDuration: string;
  status: 'Planned' | 'In Progress' | 'Completed';
  waypoints: RouteWaypoint[];
}

export interface AppNotification {
  id: string;
  packageId: string;
  recipient: string;
  channel: 'SMS' | 'WhatsApp' | 'Email' | 'Push';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

export type UserRole = 'admin' | 'dispatcher' | 'courier' | 'customer';

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  email: string;
  avatar: string;
}
