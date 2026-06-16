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

const UBE_LOGO_URL = "https://www.ube.fr/wp-content/themes/ub-theme/static/logo-negatif-ok.svg";

const programmes = [
  { id: "m1-finance-dijon", name: "M1 Finance Dijon", academicYear: "2026-2027" },
  { id: "m2-finance-dijon", name: "M2 Finance Dijon", academicYear: "2026-2027" },
  {
    id: "imbs-m1-2026",
    name: "International Master in Business Studies",
    shortName: "M1 IMBS / IMS",
    campus: "Dijon",
    academicYear: "2026-2027",
    semester: "S1",
  },
];

const teachers = [
  { id: "nicolas", name: "Nicolas Boitout", email: "nicolas.boitout@ube.fr" },
  { id: "claire", name: "Claire Martin", email: "claire.martin@ube.fr" },
  { id: "imbs-visiting", name: "Enseignant invité", email: "visiting.teacher@university.example" },
];

const imbsExistingCourses = [
  {
    id: "existing-intro-economics-2026-12-14-pm",
    label: "Introduction to Economics",
    date: "2026-12-14",
    dayLabel: "Monday 14 December",
    startTime: "13:00",
    endTime: "17:00",
    duration: 4,
    availability: "occupied",
  },
  {
    id: "existing-management-accounting-2026-12-16-am",
    label: "Management Accounting",
    date: "2026-12-16",
    dayLabel: "Wednesday 16 December",
    startTime: "09:00",
    endTime: "13:00",
    duration: 4,
    availability: "occupied",
  },
  {
    id: "existing-international-marketing-2026-12-18-am",
    label: "International Marketing",
    date: "2026-12-18",
    dayLabel: "Friday 18 December",
    startTime: "09:00",
    endTime: "13:00",
    duration: 4,
    availability: "occupied",
  },
];

const imbsBlockedPeriods = [
  {
    id: "holiday-all-saints-2026",
    type: "holiday",
    label: "All-Saints holiday",
    startDate: "2026-10-26",
    endDate: "2026-10-30",
  },
  {
    id: "bank-holiday-armistice-2026",
    type: "holiday",
    label: "Armistice bank holiday",
    startDate: "2026-11-11",
    endDate: "2026-11-11",
  },
  {
    id: "business-game-2026",
    type: "occupied",
    label: "Business Game",
    startDate: "2026-11-25",
    endDate: "2026-11-27",
  },
];

const imbsProposals = [
  {
    id: "proposal-a-compact-week",
    name: "Proposition A - Semaine de cours regroupée",
    recommendationLevel: "recommended",
    travelEfficiency: "high",
    studentLoad: "balanced",
    totalHours: 20,
    reasoning: "Recommandée : les 20 h sont placées sur une seule semaine, avec une charge quotidienne équilibrée.",
    sessions: [
      proposed("iis-a-2026-12-14-am", "2026-12-14", "Monday 14 December", "09:00", "13:00"),
      proposed("iis-a-2026-12-15-am", "2026-12-15", "Tuesday 15 December", "09:00", "13:00"),
      proposed("iis-a-2026-12-16-pm", "2026-12-16", "Wednesday 16 December", "13:00", "17:00"),
      proposed("iis-a-2026-12-17-am", "2026-12-17", "Thursday 17 December", "09:00", "13:00"),
      proposed("iis-a-2026-12-18-pm", "2026-12-18", "Friday 18 December", "13:00", "17:00"),
    ],
  },
  {
    id: "proposal-b-intensive-block",
    name: "Proposition B - Bloc intensif sur trois jours",
    recommendationLevel: "alternative",
    travelEfficiency: "very_high",
    studentLoad: "heavy",
    totalHours: 20,
    reasoning: "Alternative : déplacement plus court, mais journées d'enseignement plus lourdes.",
    sessions: [
      proposed("iis-b-2026-12-15-am", "2026-12-15", "Tuesday 15 December", "09:00", "13:00"),
      proposed("iis-b-2026-12-15-pm", "2026-12-15", "Tuesday 15 December", "14:00", "18:00"),
      proposed("iis-b-2026-12-16-pm", "2026-12-16", "Wednesday 16 December", "13:00", "17:00"),
      proposed("iis-b-2026-12-17-am", "2026-12-17", "Thursday 17 December", "09:00", "13:00"),
      proposed("iis-b-2026-12-17-pm", "2026-12-17", "Thursday 17 December", "14:00", "18:00"),
    ],
  },
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
  {
    id: "campaign-imbs-iis-s1-2026",
    programmeId: "imbs-m1-2026",
    name: "International Information System - S1 2026",
    month: "Sept.-déc. 2026",
    status: "proposal_ready",
    period: "Septembre-décembre 2026",
    teacherConstraint: "Contrainte enseignant : privilégier des blocs de cours regroupés",
    constraintDescription:
      "L'enseignant doit se déplacer en France. CrénoFac privilégie donc des blocs de cours regroupés plutôt que des séances dispersées.",
    proposals: imbsProposals,
    existingCourses: imbsExistingCourses,
    blockedPeriods: imbsBlockedPeriods,
    periodStart: "2026-09-01",
    periodEnd: "2026-12-20",
    courses: [
      {
        id: "imbs-iis",
        programmeId: "imbs-m1-2026",
        title: "International Information System",
        teacherId: "imbs-visiting",
        requiredHours: 20,
        slotDuration: 4,
      },
    ],
    slots: makeProposalGridSlots(imbsProposals[0], imbsExistingCourses, imbsBlockedPeriods),
  },
];

function slot(id, date, label, startTime, endTime, availability, courseId, duration = 3.5) {
  return { id, date, label, startTime, endTime, duration, availability, courseId };
}

function proposed(id, date, label, startTime, endTime) {
  return { id, date, dayLabel: label, label, startTime, endTime, duration: 4, availability: "proposed" };
}

function getWeekdayRange(startDate, endDate) {
  const days = [];
  const cursor = parseIsoDate(startDate);
  const end = parseIsoDate(endDate);
  while (cursor <= end) {
    const day = cursor.getDay();
    if (day >= 1 && day <= 5) {
      const iso = toIsoDate(cursor);
      days.push({ date: iso, label: formatFullDate(cursor) });
    }
    cursor.setDate(cursor.getDate() + 1);
  }
  return days;
}

function makeProposalGridSlots(proposal, existingCourses = [], blockedPeriods = []) {
  const days = getWeekdayRange("2026-09-01", "2026-12-20");
  const rows = [
    ["09:00", "13:00"],
    ["13:00", "17:00"],
    ["14:00", "18:00"],
  ];
  const baseSlots = days.flatMap(({ date, label }) =>
    rows.map(([startTime, endTime]) =>
      slot(`imbs-${date}-${startTime}`, date, label, startTime, endTime, "available", undefined, 4)
    )
  );
  const blockedSlots = baseSlots.flatMap((baseSlot) => {
    const period = blockedPeriods.find((item) => isDateWithin(baseSlot.date, item.startDate, item.endDate));
    return period
      ? [{
          ...baseSlot,
          id: `${period.id}-${baseSlot.id}`,
          availability: period.type === "holiday" ? "holiday" : "occupied",
          courseLabel: period.label,
        }]
      : [];
  });
  const overlay = [...blockedSlots, ...existingCourses, ...proposal.sessions];
  return baseSlots.map((baseSlot) => {
    const match = overlay.find(
      (item) =>
        item.date === baseSlot.date &&
        item.startTime === baseSlot.startTime &&
        item.endTime === baseSlot.endTime
    );
    if (!match) return baseSlot;
    return {
      ...baseSlot,
      id: match.id,
      availability: match.availability,
      label: match.dayLabel || baseSlot.label,
      courseLabel: match.label,
    };
  });
}

function getSlotWeeks(slots = []) {
  const weeks = new Map();
  slots.forEach((slotItem) => {
    const weekStart = getMondayIso(slotItem.date);
    if (!weeks.has(weekStart)) {
      weeks.set(weekStart, {
        id: weekStart,
        label: `Semaine du ${formatShortDate(parseIsoDate(weekStart))}`,
      });
    }
  });
  return [...weeks.values()];
}

function isSlotInWeek(slotItem, weekStart) {
  const monday = parseIsoDate(weekStart);
  const friday = parseIsoDate(weekStart);
  friday.setDate(friday.getDate() + 4);
  return isDateWithin(slotItem.date, toIsoDate(monday), toIsoDate(friday));
}

function getMondayIso(dateString) {
  const date = parseIsoDate(dateString);
  const day = date.getDay() || 7;
  date.setDate(date.getDate() - day + 1);
  return toIsoDate(date);
}

function isDateWithin(dateString, startDate, endDate) {
  return dateString >= startDate && dateString <= endDate;
}

function parseIsoDate(dateString) {
  return new Date(`${dateString}T00:00:00`);
}

function toIsoDate(date) {
  return date.toISOString().slice(0, 10);
}

function formatFullDate(date) {
  return new Intl.DateTimeFormat("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(date);
}

function formatShortDate(date) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "short",
  }).format(date);
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
  if (path.startsWith("/export/")) {
    const campaignId = path.split("/").at(-1);
    screen = <ExportPreview campaignId={campaignId} notify={notify} navigate={navigate} />;
  }

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
          <span className="ubeLogoPlate">
            <img src={UBE_LOGO_URL} alt="Université Bourgogne Europe" />
          </span>
          <span className="productMark">
            <CalendarCheck size={28} />
            <span>CrénoFac</span>
          </span>
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
      <AppFooter />
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
          <img className="ubeSidebarLogo" src={UBE_LOGO_URL} alt="Université Bourgogne Europe" />
          <span className="sidebarProduct">
            <CalendarCheck size={20} />
            <span>CrénoFac</span>
          </span>
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
        <AppFooter inset />
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
        <KpiCard label="Programmes actifs" value="3" />
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
  const [selectedProposalId, setSelectedProposalId] = useState(campaign.proposals?.[0]?.id || "");
  const course = campaign.courses[0];
  const teacher = teachers.find((item) => item.id === course.teacherId);
  const selectedProposal =
    campaign.proposals?.find((proposal) => proposal.id === selectedProposalId) || campaign.proposals?.[0];
  const [proposalSlots, setProposalSlots] = useState(() =>
    selectedProposal ? makeProposalGridSlots(selectedProposal, campaign.existingCourses, campaign.blockedPeriods) : null
  );
  const [selectedWeekId, setSelectedWeekId] = useState(() =>
    selectedProposal ? getMondayIso(selectedProposal.sessions[0].date) : ""
  );
  const proposalWeeks = selectedProposal ? getSlotWeeks(proposalSlots) : [];
  const planningSlots = selectedProposal
    ? proposalSlots.filter((slotItem) => isSlotInWeek(slotItem, selectedWeekId))
    : campaign.slots;
  const placedHours = selectedProposal ? sumProposedSlots(proposalSlots) : campaign.selectedHours;
  const remainingHours = Math.max(campaign.requiredHours - placedHours, 0);
  const canValidate = !selectedProposal || placedHours === campaign.requiredHours;
  const status = deriveStatus(campaign.selectedHours, campaign.requiredHours, campaign.status);

  const handleProposalSelect = (proposalId) => {
    const nextProposal = campaign.proposals.find((proposal) => proposal.id === proposalId);
    setSelectedProposalId(proposalId);
    setProposalSlots(makeProposalGridSlots(nextProposal, campaign.existingCourses, campaign.blockedPeriods));
    setSelectedWeekId(getMondayIso(nextProposal.sessions[0].date));
  };

  const toggleProposalSlot = (slotId) => {
    setProposalSlots((current) =>
      current.map((item) => {
        if (item.id !== slotId || item.availability === "occupied" || item.availability === "holiday" || item.availability === "unavailable") return item;
        if (item.availability === "proposed") return { ...item, availability: "available", courseLabel: undefined };
        if (item.availability === "available") return { ...item, availability: "proposed", courseLabel: course.title };
        return item;
      })
    );
  };

  return (
    <AppShell active="Campagnes" navigate={navigate}>
      <PageHeader title={`${campaign.programme.name} — ${campaign.name}`} subtitle="Volume, créneaux et validation." />
      <section className="summaryGrid">
        <SummaryItem label="Volume demandé" value={formatHours(campaign.requiredHours)} />
        <SummaryItem label={selectedProposal ? "Volume proposé" : "Volume placé"} value={formatHours(placedHours)} />
        <SummaryItem label="Reste à placer" value={formatHours(remainingHours)} />
        <SummaryItem label={selectedProposal ? "Durée préférée" : "Créneau standard"} value={selectedProposal ? "4h" : "3h30"} />
        <SummaryItem label="Statut" value={<StatusBadge status={status} />} />
      </section>
      {campaign.teacherConstraint ? <WarningBanner text={campaign.teacherConstraint} /> : null}
      {campaign.constraintDescription ? <section className="constraintPanel">{campaign.constraintDescription}</section> : null}
      {selectedProposal ? (
        <ProposalComparison
          proposals={campaign.proposals}
          selectedProposalId={selectedProposal.id}
          onSelect={handleProposalSelect}
        />
      ) : null}
      {selectedProposal && remainingHours > 0 ? <WarningBanner text={`Il reste ${formatHours(remainingHours)} à placer dans la proposition.`} /> : null}
      {placedHours > campaign.requiredHours ? <WarningBanner tone="error" text="La proposition dépasse le volume demandé." /> : null}
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
                <td>{formatHours(placedHours)}</td>
                <td>{formatHours(Math.max(course.requiredHours - placedHours, 0))}</td>
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
            <p>{selectedProposal ? "Cliquez sur les créneaux disponibles pour ajuster la proposition." : "Semaine du 4 janvier."}</p>
          </div>
          <SlotLegend />
        </div>
        {selectedProposal ? (
          <WeekSelector
            weeks={proposalWeeks}
            selectedWeekId={selectedWeekId}
            onSelect={setSelectedWeekId}
          />
        ) : null}
        <PlanningGrid slots={planningSlots} readonly={!selectedProposal} onToggle={toggleProposalSlot} />
      </section>
      <section className="actionBar">
        <button className="secondaryButton" onClick={() => notify("Invitation simulée pour la démo.")}>
          <Mail size={18} /> Inviter les enseignants
        </button>
        <button className="primaryButton" disabled={!canValidate} onClick={() => notify(selectedProposal ? "Proposition validée pour la démo." : "Planning marqué comme validé pour la démo.")}>
          <Check size={18} /> {selectedProposal ? "Valider la proposition" : "Valider le planning"}
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

function ProposalComparison({ proposals, selectedProposalId, onSelect }) {
  return (
    <section className="proposalGrid">
      {proposals.map((proposal) => {
        const isSelected = proposal.id === selectedProposalId;
        return (
          <article className={isSelected ? "proposalCard selected" : "proposalCard"} key={proposal.id}>
            <div className="proposalHeader">
              <div>
                <h2>{proposal.name}</h2>
                <p>{proposal.reasoning}</p>
              </div>
              <StatusBadge status={proposal.recommendationLevel} />
            </div>
            <div className="proposalMetrics">
              <SummaryItem label="Efficacité déplacement" value={proposalMetricLabel(proposal.travelEfficiency)} />
              <SummaryItem label="Charge étudiants" value={proposalMetricLabel(proposal.studentLoad)} />
              <SummaryItem label="Total" value={formatHours(proposalHours(proposal))} />
            </div>
            <button className={isSelected ? "primaryButton" : "secondaryButton"} onClick={() => onSelect(proposal.id)}>
              {isSelected ? "Proposition sélectionnée" : "Sélectionner la proposition"}
            </button>
          </article>
        );
      })}
    </section>
  );
}

function WeekSelector({ weeks, selectedWeekId, onSelect }) {
  return (
    <div className="weekSelector" aria-label="Choisir une semaine de cours">
      <span>Période septembre-décembre 2026</span>
      <div>
        {weeks.map((week) => (
          <button
            key={week.id}
            className={week.id === selectedWeekId ? "weekButton active" : "weekButton"}
            onClick={() => onSelect(week.id)}
          >
            {week.label}
          </button>
        ))}
      </div>
    </div>
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
        <AppFooter />
      </main>
    );
  }

  return (
    <main className="teacherPage">
      <header className="teacherHeader">
        <button className="brandButton compactBrand" onClick={() => navigate("/")}>
          <span className="ubeLogoPlate small">
            <img src={UBE_LOGO_URL} alt="Université Bourgogne Europe" />
          </span>
          <span className="productMark">
            <CalendarCheck size={22} /> CrénoFac
          </span>
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
      <AppFooter />
    </main>
  );
}

function ExportPreview({ campaignId, notify, navigate }) {
  const campaign = enrichCampaign(campaigns.find((item) => item.id === campaignId) || campaigns[1]);
  let rows = [
    ["Lundi 4 janvier", "13h30-17h", "M2 Finance Dijon", "Nicolas Boitout", "Finance", "Validé"],
    ["Mardi 5 janvier", "9h-12h30", "M2 Finance Dijon", "Nicolas Boitout", "Finance", "Validé"],
    ["Mardi 5 janvier", "13h30-17h", "M2 Finance Dijon", "Nicolas Boitout", "Finance", "Validé"],
    ["Mercredi 6 janvier", "9h-12h30", "M2 Finance Dijon", "Nicolas Boitout", "Finance", "Validé"],
    ["Mercredi 6 janvier", "13h30-17h", "M2 Finance Dijon", "Nicolas Boitout", "Finance", "Validé"],
  ];

  if (campaign.proposals?.[0]) {
    const teacher = teachers.find((item) => item.id === campaign.courses[0].teacherId);
    rows = campaign.proposals[0].sessions.map((session) => [
      session.dayLabel,
      `${session.startTime}-${session.endTime}`,
      campaign.programme.name,
      teacher.name,
      campaign.courses[0].title,
      "Proposition",
    ]);
  }

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
                  <td><StatusBadge status={campaign.proposals?.[0] ? "proposal_ready" : "validated"} /></td>
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
  const rows = [...new Set(slots.map((item) => `${item.startTime}-${item.endTime}`))].sort((a, b) =>
    a.localeCompare(b)
  );
  const byKey = useMemo(() => {
    const map = new Map();
    slots.forEach((item) => map.set(`${item.label}-${item.startTime}-${item.endTime}`, item));
    return map;
  }, [slots]);

  return (
    <div
      className={compact ? "planningGrid compact" : "planningGrid"}
      style={{ gridTemplateColumns: `116px repeat(${days.length}, minmax(138px, 1fr))` }}
    >
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
                disabled={readonly || item.availability === "unavailable" || item.availability === "occupied" || item.availability === "holiday"}
              >
                <span>{item.startTime} - {item.endTime}</span>
                <strong>{slotLabel(item.availability)}</strong>
                {item.courseLabel ? <small>{item.courseLabel}</small> : null}
                {item.availability === "validated" ? <Check size={15} /> : null}
                {item.availability === "conflict" || item.availability === "occupied" || item.availability === "holiday" ? <AlertTriangle size={15} /> : null}
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
    proposal_ready: "Proposition prête",
    recommended: "Recommandée",
    alternative: "Alternative",
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
      {["available", "proposed", "selected", "validated", "occupied", "holiday", "unavailable", "conflict"].map((state) => (
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

function AppFooter({ inset = false }) {
  return (
    <footer className={inset ? "appFooter inset" : "appFooter"}>
      Développé gracieusement par{" "}
      <a href="https://www.studentcentral.ai/" target="_blank" rel="noreferrer">
        StudentCentral.ai
      </a>{" "}
      pour les besoins de planification dans l’enseignement supérieur.
    </footer>
  );
}

function enrichCampaign(campaign) {
  const programme = programmes.find((item) => item.id === campaign.programmeId);
  const requiredHours = campaign.courses.reduce((sum, course) => sum + course.requiredHours, 0);
  const selectedHours = campaign.proposals?.[0] ? proposalHours(campaign.proposals[0]) : sumSelected(campaign.slots);
  const displayStatus = deriveStatus(selectedHours, requiredHours, campaign.status);
  return { ...campaign, programme, requiredHours, selectedHours, displayStatus };
}

function sumSelected(slots) {
  return slots
    .filter((item) => item.availability === "selected" || item.availability === "validated")
    .reduce((sum, item) => sum + item.duration, 0);
}

function proposalHours(proposal) {
  return proposal.sessions.reduce((sum, session) => sum + session.duration, 0);
}

function sumProposedSlots(slots = []) {
  return slots
    .filter((item) => item.availability === "proposed" || item.availability === "selected" || item.availability === "validated")
    .reduce((sum, item) => sum + item.duration, 0);
}

function proposalMetricLabel(value) {
  return {
    high: "Élevée",
    very_high: "Très élevée",
    balanced: "Équilibrée",
    heavy: "Forte",
  }[value] || value;
}

function deriveStatus(selectedHours, requiredHours, persistedStatus) {
  if (persistedStatus === "validated" || persistedStatus === "exported") return persistedStatus;
  if (persistedStatus === "proposal_ready") return "proposal_ready";
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
    proposed: "Proposé",
    occupied: "Occupé",
    holiday: "Vacances",
    special_week: "Semaine spéciale",
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
    .replace("Vendredi", "Ven.")
    .replace("Monday", "Mon.")
    .replace("Tuesday", "Tue.")
    .replace("Wednesday", "Wed.")
    .replace("Thursday", "Thu.")
    .replace("Friday", "Fri.");
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
