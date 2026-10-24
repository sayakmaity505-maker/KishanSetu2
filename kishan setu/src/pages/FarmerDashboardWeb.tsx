import { useMemo, useState } from "react";
import { useAuth, FarmerUser } from "../auth";
import { useStore } from "../store";
import { CROPS } from "../i18n";
import { useLang } from "../hooks/useLang";
import KishanSetuLogo from "../components/KishanSetuLogo";
import BhashiniAssistant from "../components/BhashiniAssistant";
import {
  PROCUREMENT_AGENCIES,
  PROCUREMENT_DIRECTORY_META,
  ProcurementAgencyCategory,
} from "../data/procurement-agencies";

interface Props {
  onHome: () => void;
  onLogout: () => void;
}

type Screen = "home" | "book" | "bookings" | "sales" | "profile" | "bills" | "complaints" | "prices" | "centres" | "support";

const NEARBY_CENTRES = [
  { id:"C1", name:"State Agri Warehouse Complex", dist:"1.2 km", queue:6, slots:3, msp:2275, type:"Govt",
    lat:26.85, lng:80.95, state:"Uttar Pradesh", district:"Lucknow", block:"Sadar",
    address:"NH-28, Amausi, Lucknow", pincode:"226001",
    agentName:"Suresh Patel", agentPhone:"9988776655",
    docs:{ gst:"verified", fssai:"verified", apmc:"verified", pan:"verified" },
    activeSince:"2023-04-01" },
  { id:"C2", name:"UP Grain Processing Centre", dist:"3.8 km", queue:2, slots:8, msp:2275, type:"Private",
    lat:26.87, lng:80.92, state:"Uttar Pradesh", district:"Lucknow", block:"Mahanagar",
    address:"Ring Road, Mahanagar, Lucknow", pincode:"226006",
    agentName:"Rajesh Verma", agentPhone:"9876001122",
    docs:{ gst:"verified", fssai:"pending", apmc:"verified", pan:"verified" },
    activeSince:"2024-01-15" },
  { id:"C3", name:"Lucknow APMC Mandi", dist:"5.1 km", queue:11, slots:1, msp:2275, type:"Govt",
    lat:26.82, lng:80.93, state:"Uttar Pradesh", district:"Lucknow", block:"Hazratganj",
    address:"Mandi Parishad, Hazratganj, Lucknow", pincode:"226001",
    agentName:"Vivek Singh", agentPhone:"9812345678",
    docs:{ gst:"verified", fssai:"verified", apmc:"verified", pan:"verified" },
    activeSince:"2022-08-10" },
];

type Centre = typeof NEARBY_CENTRES[0];
type Coordinates = { lat: number; lng: number };
type DirectoryCategory = "All" | ProcurementAgencyCategory;

const DIRECTORY_STATES = Array.from(
  new Set(
    PROCUREMENT_AGENCIES
      .filter(agency => agency.category === "State")
      .map(agency => agency.jurisdiction)
  )
).sort();

function distanceBetween(from: Coordinates, to: Coordinates) {
  const radiusKm = 6371;
  const toRadians = (value: number) => value * Math.PI / 180;
  const latDelta = toRadians(to.lat - from.lat);
  const lngDelta = toRadians(to.lng - from.lng);
  const a = Math.sin(latDelta / 2) ** 2
    + Math.cos(toRadians(from.lat)) * Math.cos(toRadians(to.lat)) * Math.sin(lngDelta / 2) ** 2;
  return radiusKm * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function mapEmbedUrl(centre: Centre) {
  const query = encodeURIComponent(`${centre.lat},${centre.lng} ${centre.name}`);
  return `https://www.google.com/maps?q=${query}&z=14&output=embed`;
}

function directionsUrl(centre: Centre, origin?: Coordinates | null) {
  const destination = encodeURIComponent(`${centre.lat},${centre.lng}`);
  const from = origin ? `&origin=${encodeURIComponent(`${origin.lat},${origin.lng}`)}` : "";
  return `https://www.google.com/maps/dir/?api=1${from}&destination=${destination}&travelmode=driving`;
}

function agencyMapUrl(query: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

function CentreDetailModal({ centre, origin, distanceKm, onClose }: {
  centre: Centre;
  origin: Coordinates | null;
  distanceKm: number;
  onClose: () => void;
}) {
  return (
    <div className="confirm-overlay" onClick={onClose}>
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="h-1 flex">
          <div className="flex-1" style={{ background:"#FF6B00" }} />
          <div className="flex-1 bg-white" />
          <div className="flex-1" style={{ background:"#138808" }} />
        </div>
        <div className="p-6">
          <div className="flex items-start justify-between mb-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-2xl">{centre.type === "Govt" ? "🏛" : "🏬"}</span>
                <h3 className="font-display font-bold text-lg" style={{ color:"#1a0a00" }}>{centre.name}</h3>
              </div>
              <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${centre.type==="Govt"?"bg-blue-50 text-blue-700":"bg-purple-50 text-purple-700"}`}>{centre.type}</span>
            </div>
            <button onClick={onClose} className="text-gray-300 hover:text-gray-600 text-2xl leading-none">×</button>
          </div>

          <div className="grid sm:grid-cols-2 gap-4 mb-5">
            {[
              ["📍 Location", `${centre.block}, ${centre.district}, ${centre.state}`],
              ["🗂 Address", centre.address],
              ["📮 PIN", centre.pincode],
              ["📏 Distance", `${distanceKm.toFixed(1)} km by location`],
              ["👥 Queue", `${centre.queue} farmers waiting`],
              ["🕐 Slots Open", `${centre.slots} slots`],
              ["💰 MSP Rate", `₹${centre.msp}/Quintal`],
              ["📅 Active Since", new Date(centre.activeSince).toLocaleDateString("en-IN",{year:"numeric",month:"long"})],
            ].map(([k,v]) => (
              <div key={k as string} className="rounded-xl p-3" style={{ background:"#FFF9F3" }}>
                <div className="text-xs text-gray-400 mb-0.5">{k}</div>
                <div className="font-semibold text-sm" style={{ color:"#1a0a00" }}>{v}</div>
              </div>
            ))}
          </div>

          {/* Agent contact */}
          <div className="rounded-xl p-4 border-2 mb-4" style={{ background:"#E6F9E6", borderColor:"#138808" }}>
            <div className="font-bold text-sm mb-2" style={{ color:"#138808" }}>👤 Agent Contact Details</div>
            <div className="flex items-center justify-between">
              <div>
                <div className="font-semibold" style={{ color:"#1a0a00" }}>{centre.agentName}</div>
                <div className="text-sm" style={{ color:"#138808" }}>{centre.agentPhone}</div>
              </div>
              <a href={`tel:+91${centre.agentPhone}`}
                className="flex items-center gap-2 px-4 py-2 rounded-xl font-bold text-sm text-white"
                style={{ background:"#138808" }}>
                📞 Call Agent
              </a>
            </div>
          </div>

          {/* Document verification status */}
          <div className="rounded-xl p-4 border" style={{ borderColor:"#FFE0C0", background:"#FFF9F3" }}>
            <div className="font-bold text-sm mb-3" style={{ color:"#FF6B00" }}>📋 Document Verification Status</div>
            <div className="grid grid-cols-2 gap-2">
              {[
                ["GST Registration", centre.docs.gst],
                ["FSSAI License", centre.docs.fssai],
                ["APMC License", centre.docs.apmc],
                ["PAN Card", centre.docs.pan],
              ].map(([doc, status]) => (
                <div key={doc as string} className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">{doc}</span>
                  <span className={`badge-${status === "verified" ? "verified" : "pending"}`}>{status}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 overflow-hidden rounded-xl border-2 border-orange-100">
            <iframe
              title={`${centre.name} on Google Maps`}
              src={mapEmbedUrl(centre)}
              className="h-44 w-full border-0"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
            <div className="flex items-center justify-between gap-3 bg-white p-3">
              <div className="text-xs text-gray-500">
                GPS {centre.lat.toFixed(4)}°N, {centre.lng.toFixed(4)}°E
              </div>
              <a
                href={directionsUrl(centre, origin)}
                target="_blank"
                rel="noreferrer"
                className="rounded-lg bg-chakra-blue px-3 py-2 text-xs font-bold text-white transition-colors hover:bg-navy-dark"
              >
                Open directions
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FarmerDashboardWeb({ onHome, onLogout }: Props) {
  const { user } = useAuth();
  const { T } = useLang();
  const { state, dispatch } = useStore();
  const farmer = user as FarmerUser;
  const [screen, setScreen] = useState<Screen>("home");
  const [selectedCentre, setSelectedCentre] = useState<typeof NEARBY_CENTRES[0] | null>(null);
  const [mapCentre, setMapCentre] = useState<Centre>(NEARBY_CENTRES[0]);
  const [farmerLocation, setFarmerLocation] = useState<Coordinates | null>(
    farmer.lat != null && farmer.lng != null ? { lat: farmer.lat, lng: farmer.lng } : null
  );
  const [locationState, setLocationState] = useState<"idle" | "loading" | "ready" | "denied">(
    farmer.lat != null && farmer.lng != null ? "ready" : "idle"
  );
  const [bookCrop, setBookCrop] = useState("Wheat");
  const [bookQty, setBookQty] = useState("");
  const [bookDate, setBookDate] = useState("");
  const [bookSlot, setBookSlot] = useState("09:00-11:00");
  const [bookCentre, setBookCentre] = useState(NEARBY_CENTRES[0]);
  const [bookDone, setBookDone] = useState(false);
  const [complaintText, setComplaintText] = useState("");
  const [complaintDone, setComplaintDone] = useState(false);
  const [directoryQuery, setDirectoryQuery] = useState("");
  const [directoryCategory, setDirectoryCategory] = useState<DirectoryCategory>("All");
  const [directoryState, setDirectoryState] = useState("All");
  const [supportCategory, setSupportCategory] = useState("General question");
  const [supportMessage, setSupportMessage] = useState("");
  const [callbackRequested, setCallbackRequested] = useState(false);
  const [callbackTime, setCallbackTime] = useState("Any time");
  const [supportTicket, setSupportTicket] = useState("");

  const myBookings = state.bookings.filter(b => b.farmerId === farmer.id);
  const myTxns = state.transactions.filter(t => t.farmerId === farmer.id);
  const totalEarned = myTxns.reduce((s, t) => s + t.netAmount, 0);
  const mspPrice = state.cropPrices.find(cp => cp.crop === bookCrop)?.mspPerQ || 2275;
  const locationForDistance = farmerLocation ?? { lat: 26.8467, lng: 80.9462 };
  const nearbyCentres = useMemo(() => (
    NEARBY_CENTRES
      .map(centre => ({
        centre,
        distanceKm: distanceBetween(locationForDistance, { lat: centre.lat, lng: centre.lng }),
      }))
      .sort((a, b) => a.distanceKm - b.distanceKm)
  ), [locationForDistance.lat, locationForDistance.lng]);
  const filteredAgencies = useMemo(() => {
    const query = directoryQuery.trim().toLowerCase();
    return PROCUREMENT_AGENCIES.filter(agency => {
      const matchesCategory = directoryCategory === "All" || agency.category === directoryCategory;
      const matchesState = directoryState === "All" || agency.jurisdiction === directoryState;
      const searchable = [
        agency.name,
        agency.jurisdiction,
        agency.location,
        agency.commodities,
        agency.network,
        agency.privatePresence,
      ].join(" ").toLowerCase();
      return matchesCategory && matchesState && (!query || searchable.includes(query));
    });
  }, [directoryCategory, directoryQuery, directoryState]);

  function locateFarmer() {
    setLocationState("loading");
    if (!navigator.geolocation) {
      setLocationState("denied");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      position => {
        setFarmerLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
        setLocationState("ready");
      },
      () => setLocationState("denied"),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 300000 }
    );
  }

  const centreDistance = (centre: Centre) => (
    nearbyCentres.find(item => item.centre.id === centre.id)?.distanceKm ?? 0
  );

  function handleBook() {
    if (!bookQty || !bookDate) return;
    dispatch({
      type: "CREATE_BOOKING",
      booking: {
        id: "BK-" + Date.now(), farmerId: farmer.id, farmerName: farmer.name,
        centreId: bookCentre.id, centreName: bookCentre.name, crop: bookCrop,
        quantity: parseFloat(bookQty), date: bookDate, slot: bookSlot,
        status: "pending", kycVerified: farmer.kycStatus === "verified",
        createdAt: new Date().toISOString(),
      },
    });
    setBookDone(true);
  }

  function handleComplaint() {
    if (!complaintText.trim()) return;
    dispatch({
      type: "CREATE_GRIEVANCE",
      grievance: {
        id: "GRV-" + Date.now(), farmerId: farmer.id, farmerName: farmer.name,
        category: "general", description: complaintText, status: "registered",
        createdAt: new Date().toISOString(),
      },
    });
    setComplaintDone(true); setComplaintText("");
  }

  function sendSupportRequest() {
    if (!supportMessage.trim()) return;
    const ticketId = `KSS-${Date.now().toString().slice(-8)}`;
    dispatch({
      type: "CREATE_GRIEVANCE",
      grievance: {
        id: ticketId,
        farmerId: farmer.id,
        farmerName: farmer.name,
        category: `support:${supportCategory}`,
        description: `${supportMessage.trim()}${callbackRequested ? ` | Callback requested: ${callbackTime} on ${farmer.phone}` : ""}`,
        status: "registered",
        createdAt: new Date().toISOString(),
      },
    });
    setSupportTicket(ticketId);
    setSupportMessage("");
  }

  const nav = [
    { id:"home" as Screen, label:T("dashboard"), icon:"🏠" },
    { id:"book" as Screen, label:T("bookSlot"), icon:"📅" },
    { id:"bookings" as Screen, label:T("myBookings"), icon:"📋" },
    { id:"centres" as Screen, label:T("nearbyCentres"), icon:"📍" },
    { id:"sales" as Screen, label:T("salesHistory"), icon:"💰" },
    { id:"bills" as Screen, label:T("bills"), icon:"🧾" },
    { id:"prices" as Screen, label:"MSP", icon:"📊" },
    { id:"support" as Screen, label:"Connect & Support", icon:"☎" },
    { id:"complaints" as Screen, label:T("raiseComplaint"), icon:"📣" },
    { id:"profile" as Screen, label:T("profile"), icon:"👤" },
  ];

  const iLabel = (style: React.CSSProperties) => (props: React.InputHTMLAttributes<HTMLInputElement>) => (
    <input {...props} style={style} className={`w-full border-2 border-orange-100 focus:border-orange-400 rounded-xl px-4 py-3 text-sm focus:outline-none bg-white transition-colors ${props.className||""}`} />
  );

  return (
    <div className="min-h-screen flex" style={{ background:"#FFFDF9" }}>
      <BhashiniAssistant role="farmer" />
      {selectedCentre && (
        <CentreDetailModal
          centre={selectedCentre}
          origin={farmerLocation}
          distanceKm={centreDistance(selectedCentre)}
          onClose={() => setSelectedCentre(null)}
        />
      )}

      {/* Sidebar */}
      <div className="w-60 flex-shrink-0 flex flex-col bg-white border-r" style={{ borderColor:"#FFE0C0" }}>
        <div className="p-5 border-b" style={{ borderColor:"#FFE0C0" }}>
          <KishanSetuLogo size={36} />
          <div className="mt-3">
            <div className="text-xs text-gray-400 mb-0.5">Logged in as</div>
            <div className="font-bold text-sm" style={{ color:"#1a0a00" }}>{farmer.name}</div>
            <div className="text-xs text-gray-400">{farmer.farmerId}</div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-0.5">
          {nav.map(n => (
            <button key={n.id} onClick={() => setScreen(n.id)}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all"
              style={screen === n.id
                ? { background:"linear-gradient(135deg,#FF6B00,#FF8C2A)", color:"white", fontWeight:700 }
                : { color:"#7a5a3a" }}
              onMouseEnter={e => { if (screen !== n.id) e.currentTarget.style.background="#FFF5EB"; }}
              onMouseLeave={e => { if (screen !== n.id) e.currentTarget.style.background=""; }}>
              <span>{n.icon}</span><span>{n.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-3 border-t space-y-1" style={{ borderColor:"#FFE0C0" }}>
          <button onClick={onHome}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold rounded-xl transition-colors"
            style={{ color:"#000080" }}
            onMouseEnter={e => e.currentTarget.style.background="#eef0ff"}
            onMouseLeave={e => e.currentTarget.style.background=""}>
            🏠 {T("dashboard")}
          </button>
          <button onClick={onLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs rounded-xl transition-colors"
            style={{ color:"#b91c1c" }}
            onMouseEnter={e => e.currentTarget.style.background="#FFF0F0"}
            onMouseLeave={e => e.currentTarget.style.background=""}>
            🚪 {T("logout")}
          </button>
        </div>
      </div>

      {/* Main */}
      <div className="flex-1 overflow-y-auto">
        {/* Top bar */}
        <div className="sticky top-0 z-10 bg-white border-b flex items-center justify-between px-8 py-4" style={{ borderColor:"#FFE0C0" }}>
          <div className="flex items-center gap-3">
            <h1 className="font-display font-bold text-xl" style={{ color:"#1a0a00" }}>
              {nav.find(n => n.id === screen)?.icon} {nav.find(n => n.id === screen)?.label}
            </h1>
          </div>
          <span className={`text-xs px-2 py-1 rounded-full font-bold ${farmer.kycStatus==="verified"?"bg-green-50 text-green-700":"bg-yellow-50 text-yellow-700"}`}>
            {farmer.kycStatus==="verified"?"✓ KYC Verified":"⚠ KYC Pending"}
          </span>
        </div>
        <div className="h-1 flex">
          <div className="flex-1" style={{ background:"#FF6B00" }} />
          <div className="flex-1 bg-white" />
          <div className="flex-1" style={{ background:"#138808" }} />
        </div>

        <div className="p-8">

          {/* HOME */}
          {screen === "home" && (
            <div className="space-y-6">
              <div className="rounded-3xl overflow-hidden relative" style={{ minHeight:200 }}>
                <div className="absolute inset-0" style={{ background:"linear-gradient(135deg,#000080,#FF6B00 50%,#138808)" }} />
                <div className="absolute inset-0 opacity-10" style={{ backgroundImage:"url(https://images.unsplash.com/photo-1625246333195-78d9c38ad449?w=900&h=300&fit=crop&auto=format)", backgroundSize:"cover" }} />
                <div className="relative p-8 flex items-center justify-between text-white">
                  <div>
                    <p className="text-white/50 text-sm mb-1">Good morning,</p>
                    <h2 className="font-display font-bold text-3xl">{farmer.name}</h2>
                    <p className="text-white/40 text-sm mt-1">{farmer.village}, {farmer.district}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white/40 text-xs mb-1">Total Earned</p>
                    <p className="font-display font-bold text-3xl">₹{(totalEarned + 84200).toLocaleString()}</p>
                    <p className="text-white/30 text-xs mt-1">via PFMS/DBT</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { label:"Land Area", val:farmer.landAcres+" Ac", icon:"🌱", s:"profile" as Screen },
                  { label:"Active Bookings", val:myBookings.filter(b=>b.status==="pending").length, icon:"📅", s:"bookings" as Screen },
                  { label:"Total Sales", val:myTxns.length, icon:"💰", s:"sales" as Screen },
                  { label:"DBT Linked", val:farmer.dbtLinked?"Yes":"No", icon:"🏦", s:"profile" as Screen },
                ].map(k => (
                  <button key={k.label} onClick={() => setScreen(k.s)} className="kpi-card text-left hover:shadow-md transition-all">
                    <div className="text-2xl mb-2">{k.icon}</div>
                    <div className="font-display font-bold text-xl" style={{ color:"#1a0a00" }}>{k.val}</div>
                    <div className="text-xs text-gray-400 mt-1">{k.label}</div>
                  </button>
                ))}
              </div>

              <div className="bg-white rounded-2xl border p-5" style={{ borderColor:"#FFE0C0" }}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-bold" style={{ color:"#1a0a00" }}>Nearby Procurement Centres</h3>
                  <button onClick={() => setScreen("centres")} className="text-xs font-bold hover:underline" style={{ color:"#FF6B00" }}>View all →</button>
                </div>
                <div className="space-y-2">
                  {nearbyCentres.slice(0,3).map(({ centre: c, distanceKm }) => (
                    <button key={c.id} onClick={() => setSelectedCentre(c)}
                      className="w-full flex items-center gap-4 p-3 rounded-xl text-left transition-colors hover:bg-orange-50">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style={{ background:"#FFF5EB" }}>
                        {c.type==="Govt"?"🏛":"🏬"}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-bold text-sm truncate" style={{ color:"#1a0a00" }}>{c.name}</div>
                        <div className="text-xs text-gray-400">{distanceKm.toFixed(1)} km · {c.queue} in queue · {c.slots} slots</div>
                      </div>
                      <div className="text-right flex-shrink-0">
                        <div className="text-sm font-bold text-green-700">₹{c.msp}/Q</div>
                        <div className="text-[10px] text-gray-300">{c.type}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* NEARBY CENTRES SCREEN */}
          {screen === "centres" && (
            <div className="space-y-5">
              <div className="grid gap-5 xl:grid-cols-[minmax(0,1.45fr)_minmax(18rem,0.55fr)]">
                <div className="overflow-hidden rounded-2xl border border-orange-100 bg-white shadow-sm">
                  <iframe
                    title="Nearest procurement centre on Google Maps"
                    src={mapEmbedUrl(mapCentre)}
                    className="h-80 w-full border-0"
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  />
                  <div className="flex flex-wrap items-center justify-between gap-3 border-t border-orange-100 p-4">
                    <div>
                      <div className="text-xs font-bold uppercase tracking-wide text-saffron">Selected centre</div>
                      <div className="mt-0.5 font-bold text-gray-900">{mapCentre.name}</div>
                    </div>
                    <a
                      href={directionsUrl(mapCentre, farmerLocation)}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-xl bg-chakra-blue px-4 py-2.5 text-sm font-bold text-white transition-colors hover:bg-navy-dark"
                    >
                      Get Google Maps directions
                    </a>
                  </div>
                </div>
                <div className="rounded-2xl bg-chakra-blue p-6 text-white shadow-sm">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
                    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <path d="M12 21s6-5.2 6-11a6 6 0 1 0-12 0c0 5.8 6 11 6 11Z" />
                      <circle cx="12" cy="10" r="2" />
                    </svg>
                  </div>
                  <h2 className="mt-5 font-display text-2xl font-bold">Find the easiest centre to reach</h2>
                  <p className="mt-2 text-sm leading-relaxed text-white/70">
                    Allow location access to rank verified procurement centres by your live position and open turn-by-turn directions.
                  </p>
                  <button
                    type="button"
                    onClick={locateFarmer}
                    disabled={locationState === "loading"}
                    className="mt-6 w-full rounded-xl bg-white px-4 py-3 text-sm font-bold text-chakra-blue transition-colors hover:bg-blue-50 disabled:opacity-60"
                  >
                    {locationState === "loading"
                      ? "Finding your location…"
                      : locationState === "ready"
                        ? "Refresh my location"
                        : "Use my current location"}
                  </button>
                  <div className="mt-3 text-xs text-white/60">
                    {locationState === "ready" && farmerLocation
                      ? `Location ready · ${farmerLocation.lat.toFixed(4)}, ${farmerLocation.lng.toFixed(4)}`
                      : locationState === "denied"
                        ? "Location unavailable. Showing centres near your registered area."
                        : "Your precise location is used only to calculate distance and directions."}
                  </div>
                </div>
              </div>

              <div className="flex items-end justify-between gap-4">
                <div>
                  <h2 className="font-display text-xl font-bold text-gray-900">Nearest verified centres</h2>
                  <p className="mt-1 text-sm text-gray-500">Sorted by straight-line distance from your current or registered location.</p>
                </div>
                <span className="rounded-full bg-india-green-pale px-3 py-1.5 text-xs font-bold text-india-green">
                  {nearbyCentres.length} centres found
                </span>
              </div>

              {nearbyCentres.map(({ centre: c, distanceKm }, index) => (
                <div key={c.id}
                  className="w-full rounded-2xl border border-orange-100 bg-white p-5 transition-all hover:shadow-md">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                    <button type="button" onClick={() => setSelectedCentre(c)} className="flex min-w-0 flex-1 items-center gap-4 text-left">
                      <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-2xl bg-saffron-pale font-display text-lg font-bold text-saffron">
                        {index + 1}
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="font-bold text-gray-900">{c.name}</div>
                        <div className="mt-1 text-sm text-gray-400">{c.block}, {c.district} · {c.type}</div>
                        <div className="mt-2 flex flex-wrap gap-2 text-xs">
                          <span className="rounded-full bg-india-green-pale px-2 py-1 font-bold text-india-green">{distanceKm.toFixed(1)} km away</span>
                          <span className="rounded-full bg-blue-50 px-2 py-1 font-semibold text-chakra-blue">{c.slots} slots open</span>
                          <span className="rounded-full bg-orange-50 px-2 py-1 font-semibold text-saffron">{c.queue} in queue</span>
                        </div>
                      </div>
                    </button>
                    <div className="flex items-center gap-2 sm:flex-col sm:items-stretch">
                      <button
                        type="button"
                        onClick={() => setMapCentre(c)}
                        className="flex-1 rounded-xl border-2 border-chakra-blue px-4 py-2 text-xs font-bold text-chakra-blue transition-colors hover:bg-info-bg"
                      >
                        Show on map
                      </button>
                      <a
                        href={directionsUrl(c, farmerLocation)}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 rounded-xl bg-india-green px-4 py-2 text-center text-xs font-bold text-white transition-colors hover:bg-india-green-light"
                      >
                        Directions
                      </a>
                    </div>
                  </div>
                </div>
              ))}

              <section className="mt-10 space-y-5 border-t border-orange-100 pt-8">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                  <div className="max-w-3xl">
                    <div className="text-xs font-bold uppercase tracking-[0.18em] text-saffron">All-India directory</div>
                    <h2 className="mt-2 font-display text-3xl font-bold text-gray-900">
                      Government and private procurement agencies
                    </h2>
                    <p className="mt-2 text-sm leading-relaxed text-gray-500">
                      Explore every state/UT profile, central procurement agency, and national private player supplied in the procurement workbook.
                    </p>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {[
                      ["State / UT profiles", PROCUREMENT_DIRECTORY_META.stateProfiles],
                      ["Central agencies", PROCUREMENT_DIRECTORY_META.centralAgencies],
                      ["Private players", PROCUREMENT_DIRECTORY_META.privatePlayers],
                    ].map(([label, value]) => (
                      <div key={label as string} className="rounded-xl border border-orange-100 bg-white px-3 py-2 text-center">
                        <div className="font-display text-xl font-bold text-gray-900">{value}</div>
                        <div className="text-[10px] leading-tight text-gray-400">{label}</div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
                  <div className="flex items-start gap-3">
                    <svg viewBox="0 0 24 24" className="mt-0.5 h-5 w-5 flex-shrink-0 text-chakra-blue" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <circle cx="12" cy="12" r="9" />
                      <path d="M12 10v6M12 7h.01" />
                    </svg>
                    <div>
                      <div className="text-sm font-bold text-chakra-blue">Agency directory, not a live centre registry</div>
                      <p className="mt-1 text-xs leading-relaxed text-gray-600">
                        India has tens of thousands of seasonal mandis, PACS, and purchase centres, and the uploaded workbook states that no single official master list exists. Map buttons therefore open a Google Maps search, not an asserted exact pin. Confirm the centre and season before travelling.
                      </p>
                      <div className="mt-3 flex flex-wrap gap-3 text-xs font-bold">
                        <a href="https://fci.gov.in/" target="_blank" rel="noreferrer" className="text-chakra-blue hover:underline">FCI directory</a>
                        <a href="https://www.enam.gov.in/" target="_blank" rel="noreferrer" className="text-chakra-blue hover:underline">e-NAM mandis</a>
                        <a href="https://agmarknet.gov.in/" target="_blank" rel="noreferrer" className="text-chakra-blue hover:underline">Agmarknet</a>
                        <a href="https://www.nafed-india.com/" target="_blank" rel="noreferrer" className="text-chakra-blue hover:underline">NAFED</a>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl border border-orange-100 bg-white p-4 shadow-sm">
                  <div className="grid gap-3 lg:grid-cols-[minmax(15rem,1fr)_auto_minmax(12rem,0.35fr)]">
                    <div className="relative">
                      <svg viewBox="0 0 24 24" className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                        <circle cx="11" cy="11" r="7" />
                        <path d="m20 20-4-4" />
                      </svg>
                      <input
                        type="search"
                        value={directoryQuery}
                        onChange={event => setDirectoryQuery(event.target.value)}
                        placeholder="Search agency, crop, city, or state"
                        className="w-full rounded-xl border-2 border-orange-100 bg-white py-3 pl-11 pr-4 text-sm outline-none transition-colors focus:border-saffron"
                      />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(["All", "State", "Central", "Private"] as DirectoryCategory[]).map(category => (
                        <button
                          key={category}
                          type="button"
                          onClick={() => setDirectoryCategory(category)}
                          className={`rounded-xl px-4 py-2.5 text-xs font-bold transition-colors ${
                            directoryCategory === category
                              ? "bg-chakra-blue text-white"
                              : "bg-info-bg text-chakra-blue hover:bg-blue-100"
                          }`}
                        >
                          {category === "All" ? "All agencies" : category}
                        </button>
                      ))}
                    </div>
                    <select
                      value={directoryState}
                      onChange={event => setDirectoryState(event.target.value)}
                      className="w-full rounded-xl border-2 border-orange-100 bg-white px-3 py-2.5 text-sm outline-none transition-colors focus:border-saffron"
                    >
                      <option value="All">All states and UTs</option>
                      {DIRECTORY_STATES.map(stateName => (
                        <option key={stateName} value={stateName}>{stateName}</option>
                      ))}
                    </select>
                  </div>
                  <div className="mt-3 flex items-center justify-between text-xs text-gray-400">
                    <span>{filteredAgencies.length} of {PROCUREMENT_DIRECTORY_META.agencyRecords} agency records</span>
                    {(directoryQuery || directoryCategory !== "All" || directoryState !== "All") && (
                      <button
                        type="button"
                        onClick={() => {
                          setDirectoryQuery("");
                          setDirectoryCategory("All");
                          setDirectoryState("All");
                        }}
                        className="font-bold text-saffron hover:underline"
                      >
                        Clear filters
                      </button>
                    )}
                  </div>
                </div>

                {filteredAgencies.length > 0 ? (
                  <div className="grid gap-4 xl:grid-cols-2">
                    {filteredAgencies.map(agency => (
                      <article key={agency.id} className="flex flex-col rounded-2xl border border-orange-100 bg-white p-5 transition-all hover:shadow-md">
                        <div className="flex items-start justify-between gap-4">
                          <div className="min-w-0">
                            <span className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide ${
                              agency.category === "Central"
                                ? "bg-blue-50 text-chakra-blue"
                                : agency.category === "Private"
                                  ? "bg-purple-50 text-purple-700"
                                  : "bg-india-green-pale text-india-green"
                            }`}>
                              {agency.category} agency
                            </span>
                            <h3 className="mt-3 font-display text-lg font-bold leading-tight text-gray-900">{agency.name}</h3>
                            <p className="mt-1 text-xs text-gray-400">{agency.jurisdiction} · {agency.location}</p>
                          </div>
                          <a
                            href={agencyMapUrl(agency.mapsQuery)}
                            target="_blank"
                            rel="noreferrer"
                            className="flex-shrink-0 rounded-xl border-2 border-chakra-blue px-3 py-2 text-xs font-bold text-chakra-blue transition-colors hover:bg-info-bg"
                          >
                            Search map
                          </a>
                        </div>

                        <div className="mt-4 grid gap-3 sm:grid-cols-2">
                          <div className="rounded-xl bg-gov-bg p-3">
                            <div className="text-[10px] font-bold uppercase tracking-wide text-gray-400">Procurement / commodities</div>
                            <div className="mt-1 text-sm font-semibold leading-relaxed text-gray-700">{agency.commodities}</div>
                          </div>
                          <div className="rounded-xl bg-gov-bg p-3">
                            <div className="text-[10px] font-bold uppercase tracking-wide text-gray-400">Office / network</div>
                            <div className="mt-1 text-sm font-semibold leading-relaxed text-gray-700">{agency.office}</div>
                          </div>
                        </div>

                        {(agency.address || agency.network) && (
                          <div className="mt-3 border-t border-orange-100 pt-3 text-xs leading-relaxed text-gray-500">
                            {agency.address || agency.network}
                          </div>
                        )}
                        {agency.privatePresence && (
                          <div className="mt-2 text-xs leading-relaxed text-gray-500">
                            <span className="font-bold text-gray-700">Indicative private presence:</span> {agency.privatePresence}
                          </div>
                        )}
                      </article>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-dashed border-orange-200 bg-white py-14 text-center">
                    <div className="font-display text-lg font-bold text-gray-700">No matching agencies</div>
                    <p className="mt-1 text-sm text-gray-400">Try another state, crop, city, or agency name.</p>
                  </div>
                )}
              </section>
            </div>
          )}

          {/* BOOK SLOT */}
          {screen === "book" && (
            <div className="max-w-2xl">
              {bookDone ? (
                <div className="text-center py-16">
                  <div className="text-6xl mb-4">✅</div>
                  <h2 className="font-display font-bold text-2xl mb-2" style={{ color:"#1a0a00" }}>Booking Confirmed!</h2>
                  <p className="text-gray-500 mb-6">Your slot at {bookCentre.name} on {bookDate}</p>
                  <div className="inline-block rounded-2xl p-4 text-sm mb-6" style={{ background:"#E6F9E6", color:"#138808" }}>
                    <div className="font-bold mb-1">{bookCrop} · {bookQty} Q · Slot {bookSlot}</div>
                    <div>Estimated: ₹{(parseFloat(bookQty||"0")*mspPrice).toLocaleString()}</div>
                  </div>
                  <div className="flex gap-3 justify-center">
                    <button onClick={() => { setBookDone(false); setBookQty(""); setBookDate(""); }}
                      className="px-5 py-2.5 border-2 rounded-xl font-bold text-sm" style={{ borderColor:"#FF6B00", color:"#FF6B00" }}>Book Another</button>
                    <button onClick={() => setScreen("bookings")}
                      className="px-5 py-2.5 rounded-xl font-bold text-sm text-white" style={{ background:"#138808" }}>View Bookings →</button>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-2xl border p-6 space-y-5" style={{ borderColor:"#FFE0C0" }}>
                  <h2 className="font-bold text-lg" style={{ color:"#1a0a00" }}>New Slot Booking</h2>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-bold mb-1.5 uppercase tracking-wide" style={{ color:"#FF6B00" }}>Crop</label>
                      <select value={bookCrop} onChange={e => setBookCrop(e.target.value)}
                        className="w-full border-2 border-orange-100 focus:border-orange-400 rounded-xl px-4 py-3 text-sm focus:outline-none bg-white">
                        {CROPS.map(c => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-1.5 uppercase tracking-wide" style={{ color:"#FF6B00" }}>Quantity (Quintals)</label>
                      <input type="number" value={bookQty} onChange={e => setBookQty(e.target.value)} placeholder="e.g. 2.5"
                        className="w-full border-2 border-orange-100 focus:border-orange-400 rounded-xl px-4 py-3 text-sm focus:outline-none bg-white" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-1.5 uppercase tracking-wide" style={{ color:"#FF6B00" }}>Date</label>
                      <input type="date" value={bookDate} onChange={e => setBookDate(e.target.value)} min={new Date().toISOString().split("T")[0]}
                        className="w-full border-2 border-orange-100 focus:border-orange-400 rounded-xl px-4 py-3 text-sm focus:outline-none bg-white" />
                    </div>
                    <div>
                      <label className="block text-xs font-bold mb-1.5 uppercase tracking-wide" style={{ color:"#FF6B00" }}>Time Slot</label>
                      <select value={bookSlot} onChange={e => setBookSlot(e.target.value)}
                        className="w-full border-2 border-orange-100 focus:border-orange-400 rounded-xl px-4 py-3 text-sm focus:outline-none bg-white">
                        {["09:00-11:00","11:00-13:00","13:00-15:00","15:00-17:00"].map(s => <option key={s}>{s}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold mb-2 uppercase tracking-wide" style={{ color:"#FF6B00" }}>Select Centre</label>
                    <div className="space-y-2">
                      {nearbyCentres.map(({ centre: c, distanceKm }) => (
                        <button key={c.id} onClick={() => setBookCentre(c)}
                          className="w-full text-left p-4 rounded-xl border-2 transition-all"
                          style={bookCentre.id===c.id?{borderColor:"#FF6B00",background:"#FFF5EB"}:{borderColor:"#FFE0C0"}}>
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-bold text-sm" style={{ color:"#1a0a00" }}>{c.name}</div>
                              <div className="text-xs text-gray-400">{distanceKm.toFixed(1)} km · {c.queue} queue · {c.slots} slots</div>
                            </div>
                            <div className="text-right">
                              <div className="font-bold text-green-700 text-sm">₹{c.msp}/Q</div>
                              {bookCentre.id===c.id&&<div className="text-xs font-bold" style={{ color:"#FF6B00" }}>Selected ✓</div>}
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                  {bookQty && bookDate && (
                    <div className="rounded-xl p-4" style={{ background:"#E6F9E6" }}>
                      <div className="font-bold text-sm mb-1" style={{ color:"#138808" }}>Estimated Earnings</div>
                      <div className="font-display font-bold text-2xl" style={{ color:"#138808" }}>₹{(parseFloat(bookQty)*mspPrice).toLocaleString()}</div>
                      <div className="text-xs text-gray-400 mt-1">MSP ₹{mspPrice}/Q × {bookQty} Q</div>
                    </div>
                  )}
                  <button onClick={handleBook} disabled={!bookQty||!bookDate}
                    className="w-full py-3.5 rounded-xl font-bold text-white disabled:opacity-40"
                    style={{ background:"linear-gradient(135deg,#FF6B00,#FF8C2A)", boxShadow:"0 4px 16px rgba(255,107,0,0.3)" }}>
                    Confirm Booking →
                  </button>
                </div>
              )}
            </div>
          )}

          {/* BOOKINGS */}
          {screen === "bookings" && (
            <div>
              {myBookings.length === 0 ? (
                <div className="text-center py-16 text-gray-400">
                  <div className="text-5xl mb-4">📋</div>
                  <p className="font-bold text-lg">No bookings yet</p>
                  <button onClick={() => setScreen("book")} className="mt-4 px-5 py-2.5 rounded-xl font-bold text-sm text-white" style={{ background:"#FF6B00" }}>Book a Slot →</button>
                </div>
              ) : (
                <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor:"#FFE0C0" }}>
                  <table className="data-table w-full">
                    <thead><tr><th>Booking ID</th><th>Crop</th><th>Qty</th><th>Centre</th><th>Date</th><th>Status</th></tr></thead>
                    <tbody>
                      {myBookings.map(b => (
                        <tr key={b.id}>
                          <td className="font-mono text-xs">{b.id}</td>
                          <td className="font-bold">{b.crop}</td>
                          <td>{b.quantity} Q</td>
                          <td className="text-gray-400">{b.centreName}</td>
                          <td>{b.date}</td>
                          <td><span className={`text-xs font-bold ${b.status==="completed"?"text-green-600":b.status==="pending"?"text-yellow-600":"text-gray-400"}`}>{b.status}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* SALES */}
          {screen === "sales" && (
            <div className="space-y-5">
              <div className="grid grid-cols-3 gap-4">
                {[
                  ["Total Earned","₹"+(totalEarned+84200).toLocaleString()],
                  ["Sales Count",myTxns.length.toString()],
                  ["Avg per Sale",myTxns.length>0?"₹"+Math.round(totalEarned/myTxns.length).toLocaleString():"₹0"],
                ].map(([l,v])=>(
                  <div key={l as string} className="kpi-card">
                    <div className="text-xs text-gray-400 uppercase tracking-wide mb-1">{l}</div>
                    <div className="font-display font-bold text-xl" style={{ color:"#1a0a00" }}>{v}</div>
                  </div>
                ))}
              </div>
              {myTxns.length === 0 ? (
                <div className="text-center py-10 text-gray-400"><p>No transactions in this session. Demo data: ₹84,200 total.</p></div>
              ) : (
                <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor:"#FFE0C0" }}>
                  <table className="data-table w-full">
                    <thead><tr><th>TXN ID</th><th>Crop</th><th>Qty</th><th>Gross</th><th>Net</th><th>UTR</th><th>Status</th></tr></thead>
                    <tbody>
                      {myTxns.map(t => (
                        <tr key={t.id}>
                          <td className="font-mono text-xs">{t.id.slice(0,10)}…</td>
                          <td className="font-bold">{t.crop}</td><td>{t.actualQty} Q</td>
                          <td>₹{t.grossAmount.toLocaleString()}</td>
                          <td className="font-bold text-green-700">₹{t.netAmount.toLocaleString()}</td>
                          <td className="font-mono text-xs text-gray-400">{t.utrNumber}</td>
                          <td><span className={`badge-${t.paymentStatus==="credited"?"verified":"pending"}`}>{t.paymentStatus}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* BILLS */}
          {screen === "bills" && (
            <div className="max-w-2xl space-y-4">
              {myTxns.length === 0 ? (
                <div className="text-center py-12 text-gray-400"><div className="text-4xl mb-3">🧾</div><p>Complete a transaction to see bills here.</p></div>
              ) : myTxns.map(t => (
                <div key={t.id} className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor:"#FFE0C0" }}>
                  <div className="px-5 py-3 flex items-center justify-between" style={{ background:"linear-gradient(135deg,#FF6B00,#FF8C2A)" }}>
                    <span className="font-display font-bold text-white text-sm">PROCUREMENT BILL</span>
                    <span className="font-mono text-white/60 text-xs">{t.id.slice(0,12)}</span>
                  </div>
                  <div className="p-5 space-y-2 text-sm">
                    {[["Crop",t.crop],["Actual Qty",t.actualQty+" Q"],["Grade",t.qualityGrade],["Rate","₹"+t.pricePerQ+"/Q"],["Gross","₹"+t.grossAmount.toLocaleString()],["Deductions","−₹"+(t.qualityDeduction+t.otherDeduction)]].map(([k,v])=>(
                      <div key={k as string} className="flex justify-between border-b py-1.5" style={{ borderColor:"#FFE8D0" }}>
                        <span className="text-gray-400">{k}</span><span className="font-bold" style={{ color:"#1a0a00" }}>{v}</span>
                      </div>
                    ))}
                    <div className="flex justify-between font-bold text-base border-t pt-2 mt-1" style={{ borderColor:"#FFE0C0" }}>
                      <span>Net Payable</span><span className="text-green-700">₹{t.netAmount.toLocaleString()}</span>
                    </div>
                    <div className="text-center text-xs mt-2 p-2 rounded-xl" style={{ background:"#E6F9E6", color:"#138808" }}>
                      ✓ PFMS · UTR: {t.utrNumber}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* MSP PRICES */}
          {screen === "prices" && (
            <div className="max-w-2xl">
              <div className="bg-white rounded-2xl border overflow-hidden" style={{ borderColor:"#FFE0C0" }}>
                <div className="px-5 py-4 border-b" style={{ borderColor:"#FFE0C0" }}>
                  <h3 className="font-bold" style={{ color:"#1a0a00" }}>Current MSP Rates — 2026 Kharif/Rabi</h3>
                  <p className="text-xs text-gray-400 mt-0.5">Source: CACP · Government of India</p>
                </div>
                <table className="data-table w-full">
                  <thead><tr><th>Crop</th><th>MSP (₹/Quintal)</th><th>Season</th></tr></thead>
                  <tbody>
                    {state.cropPrices.map(cp => (
                      <tr key={cp.crop}><td className="font-bold">{cp.crop}</td><td className="font-mono font-bold text-green-700">₹{cp.mspPerQ.toLocaleString()}</td><td className="text-gray-400">{cp.season}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* GRIEVANCES */}
          {screen === "complaints" && (
            <div className="max-w-xl space-y-5">
              {complaintDone && (
                <div className="rounded-2xl p-4 text-sm border-2" style={{ background:"#E6F9E6", borderColor:"#138808", color:"#138808" }}>
                  ✓ Grievance submitted. You will be notified via SMS.
                </div>
              )}
              <div className="bg-white rounded-2xl border p-5" style={{ borderColor:"#FFE0C0" }}>
                <h3 className="font-bold mb-4" style={{ color:"#1a0a00" }}>Submit Grievance</h3>
                <textarea value={complaintText} onChange={e => setComplaintText(e.target.value)}
                  placeholder="Describe your issue (payment delay, quality dispute, centre dispute...)"
                  rows={5}
                  className="w-full border-2 border-orange-100 focus:border-orange-400 rounded-xl px-4 py-3 text-sm focus:outline-none resize-none bg-white" />
                <button onClick={handleComplaint} disabled={!complaintText.trim()}
                  className="mt-3 w-full py-3 rounded-xl font-bold text-white disabled:opacity-40"
                  style={{ background:"linear-gradient(135deg,#FF6B00,#FF8C2A)" }}>
                  Submit Grievance
                </button>
              </div>
            </div>
          )}

          {/* CONNECT & SUPPORT */}
          {screen === "support" && (
            <div className="space-y-6">
              <div className="overflow-hidden rounded-3xl bg-chakra-blue text-white">
                <div className="grid gap-6 p-7 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-[0.18em] text-white/60">Farmer-first support</div>
                    <h2 className="mt-2 font-display text-3xl font-bold">Connect with us freely, in your language</h2>
                    <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/70">
                      Ask a simple question, speak with the multilingual Bhashini assistant, or request a callback. You do not need to file a formal complaint to get help.
                    </p>
                  </div>
                  <div className="rounded-2xl bg-white/10 px-5 py-4 text-center">
                    <div className="text-xs text-white/50">Registered mobile</div>
                    <div className="mt-1 font-mono text-lg font-bold">+91 {farmer.phone}</div>
                    <div className="mt-1 text-[10px] text-white/50">Used only when you request a callback</div>
                  </div>
                </div>
              </div>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-2xl border border-orange-100 bg-white p-5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-info-bg text-chakra-blue">
                    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <path d="M4 12a8 8 0 0 1 16 0v5a2 2 0 0 1-2 2h-2v-6h4M4 13h4v6H6a2 2 0 0 1-2-2v-5Z" />
                    </svg>
                  </div>
                  <h3 className="mt-4 font-display text-lg font-bold text-gray-900">Bhashini voice assistant</h3>
                  <p className="mt-1 text-xs leading-relaxed text-gray-500">Use the blue voice button at the bottom-right to speak and hear answers in your selected language.</p>
                  <span className="mt-4 inline-flex rounded-full bg-india-green-pale px-3 py-1 text-[10px] font-bold text-india-green">11 languages available</span>
                </div>

                <div className="rounded-2xl border border-orange-100 bg-white p-5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-india-green-pale text-india-green">
                    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <path d="M7 4h3l2 5-2 1.5a14 14 0 0 0 3.5 3.5L15 12l5 2v3a3 3 0 0 1-3 3C9.8 20 4 14.2 4 7a3 3 0 0 1 3-3Z" />
                    </svg>
                  </div>
                  <h3 className="mt-4 font-display text-lg font-bold text-gray-900">Kisan Call Centre</h3>
                  <p className="mt-1 text-xs leading-relaxed text-gray-500">Call the official Government of India agricultural helpline for crop and farming guidance.</p>
                  <a href="tel:18001801551" className="mt-4 inline-flex rounded-xl bg-india-green px-4 py-2.5 text-xs font-bold text-white hover:bg-india-green-light">
                    Call 1800-180-1551
                  </a>
                </div>

                <div className="rounded-2xl border border-orange-100 bg-white p-5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-saffron-pale text-saffron">
                    <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                      <path d="M5 5h14v11H8l-3 3V5Z" />
                      <path d="M8 9h8M8 12h5" />
                    </svg>
                  </div>
                  <h3 className="mt-4 font-display text-lg font-bold text-gray-900">Message the support team</h3>
                  <p className="mt-1 text-xs leading-relaxed text-gray-500">Send a non-urgent question without starting a grievance. Your request receives a trackable support number.</p>
                  <span className="mt-4 inline-flex rounded-full bg-saffron-pale px-3 py-1 text-[10px] font-bold text-saffron">No complaint required</span>
                </div>
              </div>

              {supportTicket && (
                <div className="flex items-start gap-3 rounded-2xl border-2 border-india-green bg-india-green-pale p-4 text-india-green">
                  <svg viewBox="0 0 24 24" className="mt-0.5 h-5 w-5 flex-shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                    <path d="m5 12 4 4L19 6" />
                  </svg>
                  <div>
                    <div className="text-sm font-bold">Your message has reached KishanSetu support.</div>
                    <div className="mt-1 text-xs">Support request: <span className="font-mono font-bold">{supportTicket}</span>{callbackRequested ? ` · Callback requested for ${callbackTime}` : ""}</div>
                  </div>
                </div>
              )}

              <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_20rem]">
                <div className="rounded-2xl border border-orange-100 bg-white p-6">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h3 className="font-display text-xl font-bold text-gray-900">How can we help?</h3>
                      <p className="mt-1 text-xs text-gray-400">Write naturally in any supported language.</p>
                    </div>
                    <span className="rounded-full bg-info-bg px-3 py-1 text-[10px] font-bold text-chakra-blue">Private support request</span>
                  </div>
                  <div className="mt-5">
                    <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-saffron">Topic</label>
                    <select
                      value={supportCategory}
                      onChange={event => setSupportCategory(event.target.value)}
                      className="w-full rounded-xl border-2 border-orange-100 bg-white px-4 py-3 text-sm outline-none focus:border-saffron"
                    >
                      {["General question", "Registration & KYC", "Centre or slot help", "Payment & PFMS", "Document verification", "Technical problem"].map(category => (
                        <option key={category}>{category}</option>
                      ))}
                    </select>
                  </div>
                  <div className="mt-4">
                    <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-saffron">Your message</label>
                    <textarea
                      value={supportMessage}
                      onChange={event => setSupportMessage(event.target.value)}
                      placeholder="Tell us what you need help with. You can write in your selected language."
                      rows={6}
                      className="w-full resize-none rounded-xl border-2 border-orange-100 bg-white px-4 py-3 text-sm outline-none focus:border-saffron"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={sendSupportRequest}
                    disabled={!supportMessage.trim()}
                    className="mt-4 w-full rounded-xl bg-saffron px-5 py-3.5 text-sm font-bold text-white transition-colors hover:bg-saffron-light disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Send message to support
                  </button>
                </div>

                <div className="rounded-2xl border border-orange-100 bg-gov-bg p-5">
                  <label className="flex cursor-pointer items-start gap-3">
                    <input
                      type="checkbox"
                      checked={callbackRequested}
                      onChange={event => setCallbackRequested(event.target.checked)}
                      className="mt-0.5 h-4 w-4"
                    />
                    <span>
                      <span className="block text-sm font-bold text-gray-900">Please call me back</span>
                      <span className="mt-1 block text-xs leading-relaxed text-gray-500">A support request will include your registered mobile number.</span>
                    </span>
                  </label>
                  {callbackRequested && (
                    <div className="mt-5">
                      <label className="mb-2 block text-xs font-bold uppercase tracking-wide text-saffron">Preferred time</label>
                      <select
                        value={callbackTime}
                        onChange={event => setCallbackTime(event.target.value)}
                        className="w-full rounded-xl border-2 border-orange-100 bg-white px-3 py-3 text-sm outline-none focus:border-saffron"
                      >
                        {["Any time", "Morning · 8 AM–12 PM", "Afternoon · 12 PM–4 PM", "Evening · 4 PM–7 PM"].map(time => (
                          <option key={time}>{time}</option>
                        ))}
                      </select>
                    </div>
                  )}
                  <div className="mt-6 border-t border-orange-100 pt-5">
                    <div className="text-xs font-bold uppercase tracking-wide text-gray-400">For formal disputes</div>
                    <p className="mt-2 text-xs leading-relaxed text-gray-500">Payment delays, quality disputes, or misconduct should be filed through the grievance page for official tracking.</p>
                    <button type="button" onClick={() => setScreen("complaints")} className="mt-3 text-xs font-bold text-chakra-blue hover:underline">
                      Open grievance page →
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* PROFILE */}
          {screen === "profile" && (
            <div className="max-w-2xl">
              <div className="bg-white rounded-2xl border p-6" style={{ borderColor:"#FFE0C0" }}>
                <div className="flex items-center gap-5 mb-6 pb-6 border-b" style={{ borderColor:"#FFE0C0" }}>
                  <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-white font-display font-bold text-2xl" style={{ background:"linear-gradient(135deg,#FF6B00,#138808)" }}>
                    {farmer.name[0]}
                  </div>
                  <div>
                    <h2 className="font-display font-bold text-xl" style={{ color:"#1a0a00" }}>{farmer.name}</h2>
                    <p className="text-gray-400 text-sm">{farmer.farmerId}</p>
                    <span className={`text-xs px-2 py-0.5 rounded-full font-bold mt-1 inline-block ${farmer.kycStatus==="verified"?"bg-green-50 text-green-700":"bg-yellow-50 text-yellow-700"}`}>
                      {farmer.kycStatus==="verified"?"✓ KYC Verified":"⚠ KYC Pending"}
                    </span>
                    {farmer.digilockerVerified && (
                      <span className="ml-2 mt-1 inline-block rounded-full bg-blue-50 px-2 py-0.5 text-xs font-bold text-chakra-blue">
                        DigiLocker authenticated
                      </span>
                    )}
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  {[["Mobile",farmer.phone],["Aadhaar",farmer.aadhaarMasked],["Bank",farmer.bankMasked],["IFSC",farmer.ifscMasked],["PAN",farmer.panMasked],["Land",farmer.landAcres+" Acres"],["State",farmer.state],["District",farmer.district],["Block",farmer.block],["Village",farmer.village],["Kisan Card",farmer.kisanCard||"Not linked"],["DBT",farmer.dbtLinked?"✓ Linked":"Not linked"]].map(([k,v])=>(
                    <div key={k as string} className="rounded-xl p-3" style={{ background:"#FFF9F3" }}>
                      <div className="text-xs text-gray-400 mb-0.5">{k}</div>
                      <div className="font-bold text-sm" style={{ color:"#1a0a00" }}>{v}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
