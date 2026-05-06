import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  AlertTriangle,
  CalendarCheck,
  Check,
  ChevronRight,
  Clock,
  Download,
  FileSpreadsheet,
  Home,
  Mail,
  Search,
  Settings,
  Users,
} from "lucide-react";
import "./styles.css";

const programmes = [
  { id: "m1-finance-dijon", name: "M1 Finance Dijon", academicYear: "2026-2027" },
  { id: "m2-finance-dijon", name: "M2 Finance Dijon", academicYear: "2026-2027" },
];

const teachers = [
  { id: "nicolas", name: "Nicolas Boitout", email: "nicolas.boitout@ube.fr" },
  { id: "claire", name: "Claire Martin", email: "claire.martin@ube.fr" },
];

const campaigns = [
  {
    id: "m1-decembre",
    programmeId: "m1-finance-dijon",
    name: "Campagne décembre",
    month: "Décembre",
    status: "validated",
    courses: [
      {
        id: "m1-finance",
        programmeId: "m1-finance-dijon",
        title: "Finance / cours M1",
        teacherId: "nicolas",
        requiredHours: 17.5,
        slotDuration: 3.5,
      },
    ],
    slots: [
      slot("m1-1", "2026-12-08", "Mardi 8 décembre", "13:30", "17:00", "validated", "m1-finance"),
      slot("m1-2", "2026-12-09", "Mercredi 9 décembre", "13:30", "17:00", "validated", "m1-finance"),
      slot("m1-3", "2026-12-10", "Jeudi 10 décembre", "13:30", "17:00", "validated", "m1-finance"),
      slot("m1-4", "2026-12-11", "Vendredi 11 décembre", "09:00", "12:30", "validated", "m1-finance"),
      slot("m1-5", "2026-12-11", "Vendredi 11 décembre", "13:30", "17:00", "validated", "m1-finance"),
    ],
  },
  {
    id: "m2-janvier",
    programmeId: "m2-finance-dijon",
    name: "Campagne janvier",
    month: "Janvier",
    status: "ready_to_validate",
    courses: [
      {
        id: "m2-finance",
        programmeId: "m2-finance-dijon",
        title: "Finance / cours M2",
        teacherId: "nicolas",
        requiredHours: 17.5,
        slotDuration: 3.5,
      },
    ],
    slots: [
      slot("m2-1", "2027-01-04", "Lundi 4 janvier", "09:00", "12:30", "available"),
      slot("m2-2", "2027-01-04", "Lundi 4 janvier", "13:30", "17:00", "selected", "m2-finance"),
      slot("m2-3", "2027-01-05", "Mardi 5 janvier", "09:00", "12:30", "selected", "m2-finance"),
      slot("m2-4", "2027-01-05", "Mardi 5 janvier", "13:30", "17:00", "selected", "m2-finance"),
      slot("m2-5", "2027-01-06", "Mercredi 6 janvier", "09:00", "12:30", "selected", "m2-finance"),
      slot("m2-6", "2027-01-06", "Mercredi 6 janvier", "13:30", "17:00", "selected", "m2-finance"),
      slot("m2-7", "2027-01-07", "Jeudi 7 janvier", "09:00", "12:30", "unavailable"),
      slot("m2-8", "2027-01-07", "Jeudi 7 janvier", "13:30", "17:00", "available"),
      slot("m2-9", "2027-01-08", "Vendredi 8 janvier", "09:00", "12:30", "conflict"),
      slot("m2-10", "2027-01-08", "Vendredi 8 janvier", "13:30", "17:00", "available"),
    ],
  },
];

function slot(id, date, label, startTime, endTime, availability, courseId) {
  return { id, date, label, startTime, endTime, duration: 3.5, availability, courseId };
}

function App() {
  const [path, setPath] = useState(toAppPath(window.location.pathname));
  const [toast, setToast] = useState("");

  const navigate = (nextPath) => {
    window.history.pushState({}, "", toBrowserPath(nextPath));
    setPath(nextPath);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  window.onpopstate = () => setPath(toAppPath(window.location.pathname));

  const notify = (message) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 2400);
  };

  let screen = <EntryScreen navigate={navigate} />;
  if (path === "/admin") screen = <AdminDashboard navigate={navigate} />;
  if (path.startsWith("/admin/campaigns/")) {
    const id = path.split("/").at(-1);
    screen = <CampaignDetail id={id} navigate={navigate} notify={notify} />;
  }
  if (path.startsWith("/teacher/")) screen = <TeacherView notify={notify} navigate={navigate} />;
  if (path.startsWith("/export/")) screen = <ExportPreview notify={notify} navigate={navigate} />;

  return (
    <>
      {screen}
      {toast ? <Toast message={toast} /> : null}
    </>
  );
}

function EntryScreen({ navigate }) {
  return (
    <main className="entry">
      <section className="entryPanel">
        <div className="entryBrand">
          <CalendarCheck size={30} />
          <span>CrénoFac</span>
        </div>
        <h1>CrénoFac</h1>
        <p className="tagline">Planifier les cours sans échanger dix versions d’Excel.</p>
        <p className="entryText">
          Préparez les créneaux, invitez les enseignants, suivez les réponses et exportez un planning fiable.
        </p>
        <div className="entryActions">
          <button className="primaryButton" onClick={() => navigate("/admin")}>
            Ouvrir le tableau de bord <ChevronRight size={18} />
          </button>
          <button className="secondaryButton" onClick={() => navigate("/teacher/demo-m2-finance-janvier")}>
            Voir la vue enseignant
          </button>
        </div>
      </section>
      <section className="entryPreview" aria-label="Aperçu du planning">
        <PlanningGrid slots={campaigns[1].slots} readonly compact />
      </section>
    </main>
  );
}

function AppShell({ children, active = "Tableau de bord", navigate }) {
  const items = [
    ["Tableau de bord", Home, "/admin"],
    ["Campagnes", CalendarCheck, "/admin/campaigns/m2-janvier"],
    ["Créneaux", Clock, "/admin/campaigns/m2-janvier"],
    ["Enseignants", Users, "/admin"],
    ["Exports", Download, "/export/m2-janvier"],
    ["Paramètres", Settings, "/admin"],
  ];

  return (
    <div className="appShell">
      <aside className="sidebar">
        <button className="brandButton" onClick={() => navigate("/")}>
          <CalendarCheck size={24} />
          <span>CrénoFac</span>
        </button>
        <nav>
          {items.map(([label, Icon, href]) => (
            <button key={label} className={label === active ? "navItem active" : "navItem"} onClick={() => navigate(href)}>
              <Icon size={18} />
              <span>{label}</span>
            </button>
          ))}
        </nav>
      </aside>
      <div className="mainColumn">
        <header className="topbar">
          <div>
            <span className="eyebrow">Année universitaire</span>
            <strong>2026-2027</strong>
          </div>
          <div className="topbarTools">
            <div className="searchBox" aria-label="Rechercher un enseignant">
              <Search size={16} />
              <span>Rechercher un enseignant</span>
            </div>
            <div className="avatar">AD</div>
          </div>
        </header>
        <main className="content">{children}</main>
      </div>
    </div>
  );
}

function AdminDashboard({ navigate }) {
  const rows = campaigns.map(enrichCampaign);
  return (
    <AppShell navigate={navigate}>
      <PageHeader title="Tableau de bord" subtitle="Suivi des campagnes de planification en cours." />
      <section className="kpiGrid">
        <KpiCard label="Programmes actifs" value="2" />
        <KpiCard label="Enseignants sollicités" value="12" />
        <KpiCard label="Réponses reçues" value="8" />
        <KpiCard label="Créneaux validés" value="14" />
        <KpiCard label="Conflits détectés" value="1" tone="error" />
      </section>
      <section className="sectionCard">
        <div className="sectionHeader">
          <div>
            <h2>Campagnes</h2>
            <p>Programmes actifs, volumes placés et réponses à suivre.</p>
          </div>
          <button className="outlineButton" onClick={() => navigate("/teacher/demo-m2-finance-janvier")}>
            Vue enseignant
          </button>
        </div>
        <div className="tableWrap">
          <table>
            <thead>
              <tr>
                <th>Programme</th>
                <th>Campagne</th>
                <th>Heures à placer</th>
                <th>Heures placées</th>
                <th>Statut</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((campaign) => (
                <tr key={campaign.id}>
                  <td>{campaign.programme.name}</td>
                  <td>{campaign.month}</td>
                  <td>{formatHours(campaign.requiredHours)}</td>
                  <td>{formatHours(campaign.selectedHours)}</td>
                  <td><StatusBadge status={campaign.displayStatus} /></td>
                  <td>
                    <button className="tableButton" onClick={() => navigate(`/admin/campaigns/${campaign.id}`)}>
                      Ouvrir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </AppShell>
  );
}

function CampaignDetail({ id, navigate, notify }) {
  const campaign = enrichCampaign(campaigns.find((item) => item.id === id) || campaigns[1]);
  const course = campaign.courses[0];
  const teacher = teachers.find((item) => item.id === course.teacherId);
  const status = deriveStatus(campaign.selectedHours, campaign.requiredHours, campaign.status);

  return (
    <AppShell active="Campagnes" navigate={navigate}>
      <PageHeader title={`${campaign.programme.name} — ${campaign.name}`} subtitle="Volume, créneaux et validation." />
      <section className="summaryGrid">
        <SummaryItem label="Volume demandé" value={formatHours(campaign.requiredHours)} />
        <SummaryItem label="Volume placé" value={formatHours(campaign.selectedHours)} />
        <SummaryItem label="Reste à placer" value={formatHours(Math.max(campaign.requiredHours - campaign.selectedHours, 0))} />
        <SummaryItem label="Créneau standard" value="3h30" />
        <SummaryItem label="Statut" value={<StatusBadge status={status} />} />
      </section>
      {campaign.selectedHours > campaign.requiredHours ? <WarningBanner tone="error" text="Le volume placé dépasse le volume demandé." /> : null}
      <section className="sectionCard">
        <div className="sectionHeader">
          <div>
            <h2>Enseignant et matière</h2>
            <p>Volume placé calculé automatiquement.</p>
          </div>
        </div>
        <div className="tableWrap">
          <table>
            <thead>
              <tr>
                <th>Enseignant</th>
                <th>Matière</th>
                <th>Volume demandé</th>
                <th>Volume placé</th>
                <th>Reste</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>{teacher.name}</td>
                <td>{course.title}</td>
                <td>{formatHours(course.requiredHours)}</td>
                <td>{formatHours(campaign.selectedHours)}</td>
                <td>{formatHours(Math.max(course.requiredHours - campaign.selectedHours, 0))}</td>
                <td><StatusBadge status={status === "ready_to_validate" ? "complete" : status} /></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
      <section className="sectionCard">
        <div className="sectionHeader">
          <div>
            <h2>Grille de planning</h2>
            <p>Semaine du 4 janvier.</p>
          </div>
          <SlotLegend />
        </div>
        <PlanningGrid slots={campaign.slots} readonly />
      </section>
      <section className="actionBar">
        <button className="secondaryButton" onClick={() => notify("Invitation simulée pour la démo.")}>
          <Mail size={18} /> Inviter les enseignants
        </button>
        <button className="primaryButton" onClick={() => notify("Planning marqué comme validé pour la démo.")}>
          <Check size={18} /> Valider le planning
        </button>
        <button className="secondaryButton" onClick={() => navigate(`/export/${campaign.id}`)}>
          <FileSpreadsheet size={18} /> Exporter en Excel
        </button>
        <button className="outlineButton" onClick={() => notify("Synchronisation calendrier simulée pour la démo.")}>
          <CalendarCheck size={18} /> Synchroniser calendrier
        </button>
      </section>
    </AppShell>
  );
}

function TeacherView({ notify, navigate }) {
  const source = campaigns[1];
  const initialSlots = source.slots.map((item) =>
    item.id === "m2-2" ? { ...item, availability: "available", courseId: undefined } : item
  );
  const [slots, setSlots] = useState(initialSlots);
  const [comment, setComment] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const requiredHours = 17.5;
  const selectedHours = sumSelected(slots);
  const remainingHours = requiredHours - selectedHours;
  const exact = remainingHours === 0;
  const tooMany = remainingHours < 0;

  const toggleSlot = (slotId) => {
    setSlots((current) =>
      current.map((item) => {
        if (item.id !== slotId || item.availability === "unavailable") return item;
        if (item.availability === "conflict") {
          notify("Conflit détecté : ce créneau est déjà utilisé.");
          return item;
        }
        if (item.availability === "selected") return { ...item, availability: "available", courseId: undefined };
        if (item.availability === "available") return { ...item, availability: "selected", courseId: "m2-finance" };
        return item;
      })
    );
  };

  if (confirmed) {
    return (
      <main className="teacherPage">
        <SuccessPanel title="Vos créneaux ont été enregistrés. Merci." text="L’administration peut désormais intégrer votre réponse au planning de M2 Finance Dijon." />
        <button className="secondaryButton" onClick={() => navigate("/admin/campaigns/m2-janvier")}>
          Retour côté administration
        </button>
      </main>
    );
  }

  return (
    <main className="teacherPage">
      <header className="teacherHeader">
        <button className="brandButton compactBrand" onClick={() => navigate("/")}>
          <CalendarCheck size={23} /> CrénoFac
        </button>
        <button className="outlineButton" onClick={() => navigate("/admin")}>Administration</button>
      </header>
      <PageHeader title="Bonjour Nicolas" subtitle="Merci de sélectionner vos créneaux pour M2 Finance Dijon." />
      <section className="teacherLayout">
        <div>
          <HoursSummary selectedHours={selectedHours} remainingHours={remainingHours} requiredHours={requiredHours} />
          {remainingHours > 0 ? <WarningBanner text={`Il reste ${formatHours(remainingHours)} à placer.`} /> : null}
          {tooMany ? <WarningBanner tone="error" text="Vous avez sélectionné trop d’heures." /> : null}
          {exact ? <WarningBanner tone="success" text="Volume complet. Vous pouvez valider vos horaires." /> : null}
        </div>
        <section className="sectionCard teacherGridCard">
          <div className="sectionHeader">
            <div>
              <h2>Choix des créneaux</h2>
              <p>Sélectionnez les créneaux disponibles.</p>
            </div>
            <SlotLegend />
          </div>
          <PlanningGrid slots={slots} onToggle={toggleSlot} />
        </section>
      </section>
      <section className="sectionCard">
        <label className="fieldLabel" htmlFor="comment">Commentaire optionnel</label>
        <textarea
          id="comment"
          value={comment}
          onChange={(event) => setComment(event.target.value)}
          placeholder="Ex. Je peux faire ce créneau uniquement si la salle est confirmée."
        />
      </section>
      <section className="teacherActions">
        <button className="primaryButton" disabled={!exact} onClick={() => setConfirmed(true)}>
          Valider mes horaires
        </button>
      </section>
    </main>
  );
}

function ExportPreview({ notify, navigate }) {
  const rows = [
    ["Lundi 4 janvier", "13h30-17h", "M2 Finance Dijon", "Nicolas Boitout", "Finance", "Validé"],
    ["Mardi 5 janvier", "9h-12h30", "M2 Finance Dijon", "Nicolas Boitout", "Finance", "Validé"],
    ["Mardi 5 janvier", "13h30-17h", "M2 Finance Dijon", "Nicolas Boitout", "Finance", "Validé"],
    ["Mercredi 6 janvier", "9h-12h30", "M2 Finance Dijon", "Nicolas Boitout", "Finance", "Validé"],
    ["Mercredi 6 janvier", "13h30-17h", "M2 Finance Dijon", "Nicolas Boitout", "Finance", "Validé"],
  ];

  return (
    <AppShell active="Exports" navigate={navigate}>
      <PageHeader title="Export du planning" subtitle="Aperçu propre et consolidé avant téléchargement." />
      <section className="sectionCard">
        <div className="sectionHeader">
          <div>
            <h2>Prévisualisation</h2>
            <p>Excel reste un format de sortie, pas l’outil de collaboration.</p>
          </div>
        </div>
        <div className="tableWrap">
          <table>
            <thead>
              <tr>
                <th>Jour</th>
                <th>Horaire</th>
                <th>Programme</th>
                <th>Enseignant</th>
                <th>Matière</th>
                <th>Statut</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.join("-")}>
                  {row.slice(0, 5).map((cell) => <td key={cell}>{cell}</td>)}
                  <td><StatusBadge status="validated" /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
      <section className="actionBar">
        <button className="primaryButton" onClick={() => notify("Export simulé pour la démo.")}>
          <Download size={18} /> Télécharger Excel
        </button>
        <button className="secondaryButton" onClick={() => notify("Export simulé pour la démo.")}>
          Télécharger PDF
        </button>
        <button className="outlineButton" onClick={() => notify("Export simulé pour la démo.")}>
          Exporter ICS
        </button>
      </section>
    </AppShell>
  );
}

function PlanningGrid({ slots, onToggle, readonly = false, compact = false }) {
  const days = [...new Map(slots.map((item) => [item.label, item])).values()];
  const rows = ["09:00-12:30", "13:30-17:00"];
  const byKey = useMemo(() => {
    const map = new Map();
    slots.forEach((item) => map.set(`${item.label}-${item.startTime}-${item.endTime}`, item));
    return map;
  }, [slots]);

  return (
    <div className={compact ? "planningGrid compact" : "planningGrid"}>
      <div className="gridCorner">Horaire</div>
      {days.map((day) => <div className="gridHead" key={day.label}>{formatGridDay(day.label)}</div>)}
      {rows.map((row) => (
        <React.Fragment key={row}>
          <div className="timeHead">{row.replace("-", " - ")}</div>
          {days.map((day) => {
            const [start, end] = row.split("-");
            const item = byKey.get(`${day.label}-${start}-${end}`);
            return item ? (
              <button
                key={`${day.label}-${row}`}
                className={`slotCard ${item.availability}`}
                onClick={() => !readonly && onToggle?.(item.id)}
                disabled={readonly || item.availability === "unavailable"}
              >
                <span>{item.startTime} - {item.endTime}</span>
                <strong>{slotLabel(item.availability)}</strong>
                {item.availability === "validated" ? <Check size={15} /> : null}
                {item.availability === "conflict" ? <AlertTriangle size={15} /> : null}
              </button>
            ) : (
              <div className="slotCard unavailable" key={`${day.label}-${row}`}>Indisponible</div>
            );
          })}
        </React.Fragment>
      ))}
    </div>
  );
}

function PageHeader({ title, subtitle }) {
  return (
    <div className="pageHeader">
      <h1>{title}</h1>
      <p>{subtitle}</p>
    </div>
  );
}

function KpiCard({ label, value, tone }) {
  return (
    <article className={`kpiCard ${tone || ""}`}>
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}

function SummaryItem({ label, value }) {
  return (
    <article className="summaryItem">
      <span>{label}</span>
      <strong>{value}</strong>
    </article>
  );
}

function StatusBadge({ status }) {
  const labels = {
    pending: "En attente",
    partial: "À compléter",
    complete: "Complet",
    ready_to_validate: "À valider",
    validated: "Validé",
    exported: "Exporté",
    conflict: "Conflit",
  };
  return <span className={`statusBadge ${status}`}>{labels[status] || status}</span>;
}

function SlotLegend() {
  return (
    <div className="legend">
      {["available", "selected", "validated", "unavailable", "conflict"].map((state) => (
        <span key={state}><i className={state} />{slotLabel(state)}</span>
      ))}
    </div>
  );
}

function HoursSummary({ selectedHours, remainingHours, requiredHours }) {
  return (
    <section className="hoursCard">
      <h2>Volume horaire</h2>
      <SummaryItem label="Volume à placer" value={formatHours(requiredHours)} />
      <SummaryItem label="Créneau standard" value="3h30" />
      <SummaryItem label="Volume sélectionné" value={formatHours(selectedHours)} />
      <SummaryItem label="Reste à placer" value={formatHours(Math.max(remainingHours, 0))} />
    </section>
  );
}

function WarningBanner({ text, tone = "warning" }) {
  return (
    <div className={`warningBanner ${tone}`}>
      {tone === "error" ? <AlertTriangle size={18} /> : <Check size={18} />}
      <span>{text}</span>
    </div>
  );
}

function SuccessPanel({ title, text }) {
  return (
    <section className="successPanel">
      <div><Check size={38} /></div>
      <h1>{title}</h1>
      <p>{text}</p>
    </section>
  );
}

function Toast({ message }) {
  return <div className="toast">{message}</div>;
}

function enrichCampaign(campaign) {
  const programme = programmes.find((item) => item.id === campaign.programmeId);
  const requiredHours = campaign.courses.reduce((sum, course) => sum + course.requiredHours, 0);
  const selectedHours = sumSelected(campaign.slots);
  const displayStatus = deriveStatus(selectedHours, requiredHours, campaign.status);
  return { ...campaign, programme, requiredHours, selectedHours, displayStatus };
}

function sumSelected(slots) {
  return slots
    .filter((item) => item.availability === "selected" || item.availability === "validated")
    .reduce((sum, item) => sum + item.duration, 0);
}

function deriveStatus(selectedHours, requiredHours, persistedStatus) {
  if (persistedStatus === "validated" || persistedStatus === "exported") return persistedStatus;
  if (selectedHours === 0) return "pending";
  if (selectedHours < requiredHours) return "partial";
  if (selectedHours === requiredHours) return persistedStatus === "ready_to_validate" ? "ready_to_validate" : "complete";
  return "conflict";
}

function formatHours(value) {
  return Number.isInteger(value) ? `${value} h` : `${value.toFixed(1)} h`;
}

function slotLabel(status) {
  return {
    available: "Disponible",
    unavailable: "Indisponible",
    selected: "Sélectionné",
    conflict: "Conflit",
    validated: "Validé",
  }[status];
}

function formatGridDay(label) {
  return label
    .replace("Lundi", "Lun.")
    .replace("Mardi", "Mar.")
    .replace("Mercredi", "Mer.")
    .replace("Jeudi", "Jeu.")
    .replace("Vendredi", "Ven.");
}

function toAppPath(pathname) {
  const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");
  if (!basePath || basePath === "") return pathname || "/";
  if (pathname === basePath) return "/";
  if (pathname.startsWith(`${basePath}/`)) return pathname.slice(basePath.length) || "/";
  return pathname || "/";
}

function toBrowserPath(appPath) {
  const basePath = import.meta.env.BASE_URL.replace(/\/$/, "");
  if (!basePath) return appPath;
  if (appPath === "/") return `${basePath}/`;
  return `${basePath}${appPath}`;
}

createRoot(document.getElementById("root")).render(<App />);
