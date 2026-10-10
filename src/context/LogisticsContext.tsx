import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  Package, 
  Courier, 
  DeliveryRoute, 
  AppNotification, 
  TrackingStatus, 
  TimelineEvent, 
  UserRole, 
  UserProfile 
} from '../types/logistics';
import { 
  INITIAL_PACKAGES, 
  INITIAL_COURIERS, 
  INITIAL_ROUTES, 
  INITIAL_NOTIFICATIONS, 
  CURRENT_USER 
} from '../data/mockData';

interface LogisticsContextType {
  packages: Package[];
  couriers: Courier[];
  routes: DeliveryRoute[];
  notifications: AppNotification[];
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedPackageId: string;
  setSelectedPackageId: (id: string) => void;
  user: UserProfile;
  setUser: (user: UserProfile) => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  soundEnabled: boolean;
  setSoundEnabled: (val: boolean) => void;
  showInternshipModal: boolean;
  setShowInternshipModal: (val: boolean) => void;
  showAddPackageModal: boolean;
  setShowAddPackageModal: (val: boolean) => void;
  showAddCourierModal: boolean;
  setShowAddCourierModal: (val: boolean) => void;
  feedbackPackageId: string | null;
  setFeedbackPackageId: (id: string | null) => void;
  // Actions
  addPackage: (pkgData: Partial<Package>) => Package;
  updatePackage: (id: string, updates: Partial<Package>) => void;
  deletePackage: (id: string) => void;
  updatePackageStatus: (id: string, newStatus: TrackingStatus, courierNotes?: string) => void;
  addTimelineCheckpoint: (packageId: string, title: string, description: string, location: string, status: TrackingStatus) => void;
  addCourier: (courierData: Partial<Courier>) => void;
  updateCourier: (id: string, updates: Partial<Courier>) => void;
  advanceRouteStop: (routeId: string, stopId: string, outcome: 'Completed' | 'Attempted') => void;
  sendNotification: (packageId: string, recipient: string, channel: 'SMS' | 'WhatsApp' | 'Email' | 'Push', title: string, message: string) => void;
  markNotificationAsRead: (id: string) => void;
  submitCustomerRating: (packageId: string, score: number, comment: string) => void;
  exportPackagesCSV: () => void;
  resetAllData: () => void;
}

const LogisticsContext = createContext<LogisticsContextType | undefined>(undefined);

// Web Audio synthesizer for dispatch alerts
function playDispatchChime() {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const now = ctx.currentTime;
    
    // Note 1
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    osc1.frequency.setValueAtTime(587.33, now); // D5
    gain1.gain.setValueAtTime(0.08, now);
    gain1.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
    osc1.connect(gain1);
    gain1.connect(ctx.destination);
    osc1.start(now);
    osc1.stop(now + 0.18);

    // Note 2
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(880, now + 0.12); // A5
    gain2.gain.setValueAtTime(0.1, now + 0.12);
    gain2.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
    osc2.connect(gain2);
    gain2.connect(ctx.destination);
    osc2.start(now + 0.12);
    osc2.stop(now + 0.35);
  } catch {
    // Ignore audio errors if blocked by browser policy
  }
}

export const LogisticsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [packages, setPackages] = useState<Package[]>(() => {
    const saved = localStorage.getItem('trackpro_packages');
    return saved ? JSON.parse(saved) : INITIAL_PACKAGES;
  });

  const [couriers, setCouriers] = useState<Courier[]>(() => {
    const saved = localStorage.getItem('trackpro_couriers');
    return saved ? JSON.parse(saved) : INITIAL_COURIERS;
  });

  const [routes, setRoutes] = useState<DeliveryRoute[]>(() => {
    const saved = localStorage.getItem('trackpro_routes');
    return saved ? JSON.parse(saved) : INITIAL_ROUTES;
  });

  const [notifications, setNotifications] = useState<AppNotification[]>(() => {
    const saved = localStorage.getItem('trackpro_notifications');
    return saved ? JSON.parse(saved) : INITIAL_NOTIFICATIONS;
  });

  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [selectedPackageId, setSelectedPackageId] = useState<string>('TRK-8924-IN');
  const [user, setUser] = useState<UserProfile>(CURRENT_USER);
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('trackpro_theme') === 'dark';
  });
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [showInternshipModal, setShowInternshipModal] = useState<boolean>(false);
  const [showAddPackageModal, setShowAddPackageModal] = useState<boolean>(false);
  const [showAddCourierModal, setShowAddCourierModal] = useState<boolean>(false);
  const [feedbackPackageId, setFeedbackPackageId] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('trackpro_packages', JSON.stringify(packages));
  }, [packages]);

  useEffect(() => {
    localStorage.setItem('trackpro_couriers', JSON.stringify(couriers));
  }, [couriers]);

  useEffect(() => {
    localStorage.setItem('trackpro_routes', JSON.stringify(routes));
  }, [routes]);

  useEffect(() => {
    localStorage.setItem('trackpro_notifications', JSON.stringify(notifications));
  }, [notifications]);

  useEffect(() => {
    localStorage.setItem('trackpro_theme', darkMode ? 'dark' : 'light');
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const addPackage = (pkgData: Partial<Package>): Package => {
    const randomNum = Math.floor(1000 + Math.random() * 9000);
    const newId = `TRK-${randomNum}-IN`;
    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-GB') + ' ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newPackage: Package = {
      id: newId,
      senderName: pkgData.senderName || 'Data Alcott Logistics Depot',
      senderAddress: pkgData.senderAddress || 'Technology Park, Chennai',
      senderCity: pkgData.senderCity || 'Chennai, TN',
      receiverName: pkgData.receiverName || 'Recipient Customer',
      receiverAddress: pkgData.receiverAddress || 'Commercial Street, Bangalore',
      receiverCity: pkgData.receiverCity || 'Bengaluru, KA',
      receiverPhone: pkgData.receiverPhone || '+91 98400 00000',
      receiverEmail: pkgData.receiverEmail || 'recipient@customer.com',
      status: 'Pending',
      priority: pkgData.priority || 'Standard',
      weightKg: pkgData.weightKg || 1.5,
      dimensions: pkgData.dimensions || '25 x 15 x 10 cm',
      serviceType: pkgData.serviceType || 'Standard Ground Express',
      estimatedDelivery: pkgData.estimatedDelivery || new Date(Date.now() + 2 * 86400000).toISOString(),
      assignedCourierId: pkgData.assignedCourierId || 'CR-101',
      assignedCourierName: pkgData.assignedCourierName || 'Rajesh Kumar',
      routeId: pkgData.routeId || 'RT-OMR-01',
      currentLocationName: 'Intake Sorting Station, Chennai',
      originLocationName: pkgData.senderCity || 'Chennai, TN',
      destinationLocationName: pkgData.receiverCity || 'Bengaluru, KA',
      notes: pkgData.notes || 'Package created via logistics console.',
      createdAt: now.toISOString(),
      updatedAt: now.toISOString(),
      timeline: [
        {
          id: `EVT-${randomNum}-1`,
          status: 'Pending',
          title: 'Shipment Created & Booked',
          description: 'Package manifest created and scheduled for sorting.',
          location: 'Chennai Dispatch Center',
          timestamp: formattedDate,
          completed: true,
        }
      ]
    };

    setPackages(prev => [newPackage, ...prev]);

    // Add notification
    sendNotification(
      newId,
      `${newPackage.receiverName} (${newPackage.receiverPhone})`,
      'SMS',
      'Shipment Manifest Created',
      `Your TrackPro package ${newId} has been created. Follow live updates at trackpro.in/${newId}`
    );

    if (soundEnabled) playDispatchChime();
    return newPackage;
  };

  const updatePackage = (id: string, updates: Partial<Package>) => {
    setPackages(prev => prev.map(p => {
      if (p.id === id) {
        return {
          ...p,
          ...updates,
          updatedAt: new Date().toISOString()
        };
      }
      return p;
    }));
  };

  const deletePackage = (id: string) => {
    setPackages(prev => prev.filter(p => p.id !== id));
  };

  const updatePackageStatus = (id: string, newStatus: TrackingStatus, courierNotes?: string) => {
    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-GB') + ' ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    let statusTitle = '';
    let statusDesc = '';

    switch (newStatus) {
      case 'Pending':
        statusTitle = 'Shipment On Hold / Scheduled';
        statusDesc = courierNotes || 'Package queued for sorting and processing.';
        break;
      case 'In Transit':
        statusTitle = 'Package In Transit to Regional Center';
        statusDesc = courierNotes || 'Consignment sorted and dispatched on express transport route.';
        break;
      case 'Out for Delivery':
        statusTitle = 'Out for Final Delivery';
        statusDesc = courierNotes || 'Courier is on the way to recipient address.';
        break;
      case 'Delivered':
        statusTitle = 'Delivered & Handover Complete';
        statusDesc = courierNotes || 'Package delivered successfully to recipient with digital proof.';
        break;
      case 'Failed':
        statusTitle = 'Delivery Attempt Unsuccessful';
        statusDesc = courierNotes || 'Delivery was attempted but could not be completed. Reattempt scheduled.';
        break;
    }

    setPackages(prev => prev.map(p => {
      if (p.id === id) {
        const newEvent: TimelineEvent = {
          id: `EVT-${Date.now()}`,
          status: newStatus,
          title: statusTitle,
          description: statusDesc,
          location: p.currentLocationName || 'Distribution Depot',
          timestamp: formattedDate,
          completed: true,
          courierNotes: courierNotes
        };

        const updatedTimeline = [...p.timeline, newEvent];

        return {
          ...p,
          status: newStatus,
          updatedAt: now.toISOString(),
          timeline: updatedTimeline,
          signatureProof: newStatus === 'Delivered' ? {
            recipientName: p.receiverName,
            signedAt: formattedDate
          } : p.signatureProof
        };
      }
      return p;
    }));

    // Trigger notification
    const targetPkg = packages.find(p => p.id === id);
    if (targetPkg) {
      sendNotification(
        id,
        `${targetPkg.receiverName} (${targetPkg.receiverPhone})`,
        newStatus === 'Delivered' ? 'WhatsApp' : 'SMS',
        `Status Updated: ${newStatus}`,
        `Your delivery ${id} status is now: ${newStatus}. ${courierNotes ? `Note: ${courierNotes}` : ''}`
      );
    }

    if (soundEnabled) playDispatchChime();
  };

  const addTimelineCheckpoint = (
    packageId: string, 
    title: string, 
    description: string, 
    location: string, 
    status: TrackingStatus
  ) => {
    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-GB') + ' ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setPackages(prev => prev.map(p => {
      if (p.id === packageId) {
        const newEvent: TimelineEvent = {
          id: `EVT-${Date.now()}`,
          status,
          title,
          description,
          location,
          timestamp: formattedDate,
          completed: true
        };
        return {
          ...p,
          status,
          currentLocationName: location,
          updatedAt: now.toISOString(),
          timeline: [...p.timeline, newEvent]
        };
      }
      return p;
    }));

    if (soundEnabled) playDispatchChime();
  };

  const addCourier = (courierData: Partial<Courier>) => {
    const newId = `CR-${100 + couriers.length + 1}`;
    const newCourier: Courier = {
      id: newId,
      name: courierData.name || 'New Courier Specialist',
      phone: courierData.phone || '+91 98400 11223',
      email: courierData.email || 'courier@trackpro-logistics.in',
      avatar: courierData.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&q=80',
      vehicleType: courierData.vehicleType || 'Electric Van',
      vehiclePlate: courierData.vehiclePlate || 'TN-09-EV-8899',
      status: courierData.status || 'Available',
      rating: 5.0,
      deliveriesCount: 0,
      onTimeRate: 100,
      activePackagesCount: 0,
      currentZone: courierData.currentZone || 'Central Zone',
    };

    setCouriers(prev => [...prev, newCourier]);
  };

  const updateCourier = (id: string, updates: Partial<Courier>) => {
    setCouriers(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
  };

  const advanceRouteStop = (routeId: string, stopId: string, outcome: 'Completed' | 'Attempted') => {
    setRoutes(prev => prev.map(r => {
      if (r.id === routeId) {
        const updatedWaypoints = r.waypoints.map(wp => {
          if (wp.id === stopId) {
            return { ...wp, status: outcome };
          }
          return wp;
        });
        const completedCount = updatedWaypoints.filter(wp => wp.status === 'Completed').length;
        const allFinished = updatedWaypoints.every(wp => wp.status !== 'Pending');

        // Also update matching package status if applicable
        const targetStop = r.waypoints.find(wp => wp.id === stopId);
        if (targetStop && targetStop.packageId) {
          updatePackageStatus(
            targetStop.packageId,
            outcome === 'Completed' ? 'Delivered' : 'Failed',
            outcome === 'Completed' 
              ? `Delivered on route stop #${targetStop.stopNumber} by ${r.courierName}`
              : `Attempted stop #${targetStop.stopNumber} - Customer unavailable`
          );
        }

        return {
          ...r,
          waypoints: updatedWaypoints,
          completedStops: completedCount,
          status: allFinished ? 'Completed' : 'In Progress'
        };
      }
      return r;
    }));

    if (soundEnabled) playDispatchChime();
  };

  const sendNotification = (
    packageId: string,
    recipient: string,
    channel: 'SMS' | 'WhatsApp' | 'Email' | 'Push',
    title: string,
    message: string
  ) => {
    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-GB') + ' ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const newNotif: AppNotification = {
      id: `NOTIF-${Date.now()}-${Math.floor(Math.random() * 100)}`,
      packageId,
      recipient,
      channel,
      title,
      message,
      timestamp: formattedDate,
      read: false
    };

    setNotifications(prev => [newNotif, ...prev]);
  };

  const markNotificationAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const submitCustomerRating = (packageId: string, score: number, comment: string) => {
    const now = new Date();
    const formattedDate = now.toLocaleDateString('en-GB') + ' ' + now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    setPackages(prev => prev.map(p => {
      if (p.id === packageId) {
        return {
          ...p,
          customerRating: {
            score,
            comment,
            date: formattedDate
          }
        };
      }
      return p;
    }));
  };

  const exportPackagesCSV = () => {
    const headers = ['Tracking ID', 'Status', 'Priority', 'Sender', 'Receiver', 'Destination City', 'Weight (kg)', 'Courier', 'Estimated Delivery', 'Created At'];
    const rows = packages.map(p => [
      `"${p.id}"`,
      `"${p.status}"`,
      `"${p.priority}"`,
      `"${p.senderName.replace(/"/g, '""')}"`,
      `"${p.receiverName.replace(/"/g, '""')}"`,
      `"${p.receiverCity.replace(/"/g, '""')}"`,
      p.weightKg,
      `"${p.assignedCourierName}"`,
      `"${p.estimatedDelivery}"`,
      `"${p.createdAt}"`
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `TrackPro_Packages_Report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const resetAllData = () => {
    localStorage.removeItem('trackpro_packages');
    localStorage.removeItem('trackpro_couriers');
    localStorage.removeItem('trackpro_routes');
    localStorage.removeItem('trackpro_notifications');
    setPackages(INITIAL_PACKAGES);
    setCouriers(INITIAL_COURIERS);
    setRoutes(INITIAL_ROUTES);
    setNotifications(INITIAL_NOTIFICATIONS);
  };

  return (
    <LogisticsContext.Provider
      value={{
        packages,
        couriers,
        routes,
        notifications,
        activeTab,
        setActiveTab,
        selectedPackageId,
        setSelectedPackageId,
        user,
        setUser,
        darkMode,
        setDarkMode,
        soundEnabled,
        setSoundEnabled,
        showInternshipModal,
        setShowInternshipModal,
        showAddPackageModal,
        setShowAddPackageModal,
        showAddCourierModal,
        setShowAddCourierModal,
        feedbackPackageId,
        setFeedbackPackageId,
        addPackage,
        updatePackage,
        deletePackage,
        updatePackageStatus,
        addTimelineCheckpoint,
        addCourier,
        updateCourier,
        advanceRouteStop,
        sendNotification,
        markNotificationAsRead,
        submitCustomerRating,
        exportPackagesCSV,
        resetAllData,
      }}
    >
      {children}
    </LogisticsContext.Provider>
  );
};

export const useLogistics = () => {
  const context = useContext(LogisticsContext);
  if (!context) {
    throw new Error('useLogistics must be used within a LogisticsProvider');
  }
  return context;
};
