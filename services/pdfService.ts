import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import { BudgetItem, Guest, Task, EventItem, DashboardStats } from "../types";

// Helper to format currency
const formatCurrency = (val: number) => 'Rs. ' + val.toLocaleString('en-IN');

// Common Header & Footer Template
const addTemplate = (doc: jsPDF, title: string) => {
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const brandColor = "#ec4899"; // brand-500
  
  // Header Background
  doc.setFillColor(brandColor);
  doc.rect(0, 0, pageWidth, 25, "F");

  // Logo / Brand Text
  doc.setTextColor("#ffffff");
  doc.setFont("helvetica", "bold");
  doc.setFontSize(22);
  doc.text("My Wedding Planner", 14, 16);

  // Report Title
  doc.setFontSize(14);
  doc.setFont("helvetica", "normal");
  doc.text(title.toUpperCase(), pageWidth - 14, 16, { align: "right" });

  // Date Generated
  doc.setTextColor("#64748b");
  doc.setFontSize(10);
  doc.text(`Generated on: ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}`, 14, 32);

  // Footer
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor("#94a3b8");
    
    // Left aligned app name
    doc.text("My Wedding Planner", 14, pageHeight - 10);
    
    // Center aligned website and contact info
    const footerContact = `www.myweddingclicks.com    |    Phone: +91 78273 78274`;
    doc.text(footerContact, pageWidth / 2, pageHeight - 10, { align: "center" });
    
    // Page numbering
    doc.text(`Page ${i} of ${totalPages}`, pageWidth - 14, pageHeight - 10, { align: "right" });
  }
};

// --- Budget ---
export const createBudgetPDF = (items: BudgetItem[]): jsPDF => {
  const doc = new jsPDF();
  const title = "Budget Report";

  const tableColumn = ["Category", "Estimated", "Actual", "Paid", "Variance"];
  const tableRows: any[] = [];

  let totalEst = 0;
  let totalAct = 0;
  let totalPaid = 0;

  items.forEach(item => {
    const variance = item.estimated - item.actual;
    totalEst += item.estimated;
    totalAct += item.actual;
    totalPaid += item.paid;

    const rowData = [
      item.category,
      formatCurrency(item.estimated),
      formatCurrency(item.actual),
      formatCurrency(item.paid),
      formatCurrency(variance)
    ];
    tableRows.push(rowData);
  });

  // Summary Row
  tableRows.push([
    "TOTAL",
    formatCurrency(totalEst),
    formatCurrency(totalAct),
    formatCurrency(totalPaid),
    formatCurrency(totalEst - totalAct)
  ]);

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 40,
    headStyles: { fillColor: [236, 72, 153], textColor: [255, 255, 255], fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [253, 242, 248] },
    styles: { font: "helvetica", fontSize: 10, cellPadding: 3 },
    columnStyles: {
      0: { fontStyle: 'bold' },
      1: { halign: 'right' },
      2: { halign: 'right' },
      3: { halign: 'right' },
      4: { halign: 'right' },
    },
    didParseCell: function(data) {
        if (data.row.index === tableRows.length - 1) {
            data.cell.styles.fontStyle = 'bold';
            data.cell.styles.fillColor = [250, 250, 250];
        }
    }
  });

  addTemplate(doc, title);
  return doc;
};

export const exportBudgetPDF = (items: BudgetItem[]) => {
  const doc = createBudgetPDF(items);
  doc.save("Wedding_Budget_Report.pdf");
};

// --- Guest List ---
export const createGuestListPDF = (guests: Guest[]): jsPDF => {
  const doc = new jsPDF();
  const title = "Guest List Report";

  const tableColumn = ["Name", "Email", "RSVP", "Meal", "Plus One", "Details"];
  const tableRows: any[] = [];

  guests.forEach(guest => {
    const rowData = [
      guest.name,
      guest.email,
      guest.rsvpStatus.toUpperCase(),
      guest.mealPreference,
      guest.plusOne ? "Yes" : "No",
      guest.mobileOrCity || "-"
    ];
    tableRows.push(rowData);
  });

  const confirmed = guests.filter(g => g.rsvpStatus === 'accepted').length;
  const pending = guests.filter(g => g.rsvpStatus === 'pending').length;
  const declined = guests.filter(g => g.rsvpStatus === 'declined').length;

  doc.setFontSize(11);
  doc.setTextColor("#334155");
  doc.text(`Total Guests: ${guests.length} | Confirmed: ${confirmed} | Pending: ${pending} | Declined: ${declined}`, 14, 40);

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 45,
    headStyles: { fillColor: [236, 72, 153] },
    alternateRowStyles: { fillColor: [253, 242, 248] },
    styles: { fontSize: 9 },
  });

  addTemplate(doc, title);
  return doc;
};

export const exportGuestListPDF = (guests: Guest[]) => {
  const doc = createGuestListPDF(guests);
  doc.save("Wedding_Guest_List.pdf");
};

// --- Checklist ---
export const createChecklistPDF = (tasks: Task[]): jsPDF => {
  const doc = new jsPDF();
  const title = "Wedding Checklist";

  const tableColumn = ["Status", "Task", "Category", "Due Date"];
  const tableRows: any[] = [];

  const sortedTasks = [...tasks].sort((a, b) => (a.completed === b.completed ? 0 : a.completed ? 1 : -1));

  sortedTasks.forEach(task => {
    const rowData = [
      task.completed ? "DONE" : "PENDING",
      task.title,
      task.category,
      task.dueDate ? new Date(task.dueDate).toLocaleDateString() : "-"
    ];
    tableRows.push(rowData);
  });

  const progress = Math.round((tasks.filter(t => t.completed).length / tasks.length) * 100);
  doc.setFontSize(11);
  doc.text(`Overall Progress: ${progress}% Completed`, 14, 40);

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 45,
    headStyles: { fillColor: [236, 72, 153] },
    alternateRowStyles: { fillColor: [253, 242, 248] },
    styles: { fontSize: 10 },
    columnStyles: {
        0: { fontStyle: 'bold', textColor: [100, 100, 100] }
    },
    didParseCell: function(data) {
        if (data.column.index === 0 && data.cell.raw === "DONE") {
            data.cell.styles.textColor = [16, 185, 129];
        } else if (data.column.index === 0 && data.cell.raw === "PENDING") {
             data.cell.styles.textColor = [239, 68, 68];
        }
    }
  });

  addTemplate(doc, title);
  return doc;
};

export const exportChecklistPDF = (tasks: Task[]) => {
  const doc = createChecklistPDF(tasks);
  doc.save("Wedding_Checklist.pdf");
};

// --- Timeline ---
export const createTimelinePDF = (events: EventItem[]): jsPDF => {
  const doc = new jsPDF();
  const title = "Event Timeline";

  const sortedEvents = [...events].sort((a, b) => {
    const dateA = a.date || '9999-12-31';
    const dateB = b.date || '9999-12-31';
    if (dateA !== dateB) return dateA.localeCompare(dateB);
    return a.time.localeCompare(b.time);
  });

  const tableColumn = ["Date", "Time", "Event Name", "Details"];
  const tableRows: any[] = [];

  sortedEvents.forEach(event => {
    const rowData = [
      event.date ? new Date(event.date).toLocaleDateString() : "-",
      event.time,
      event.name,
      event.details || "-"
    ];
    tableRows.push(rowData);
  });

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 40,
    headStyles: { fillColor: [236, 72, 153] },
    alternateRowStyles: { fillColor: [253, 242, 248] },
    styles: { fontSize: 10 },
    columnStyles: {
        1: { fontStyle: 'bold' }
    }
  });

  addTemplate(doc, title);
  return doc;
};

export const exportTimelinePDF = (events: EventItem[]) => {
  const doc = createTimelinePDF(events);
  doc.save("Wedding_Timeline.pdf");
};

// --- Dashboard ---
export const createDashboardPDF = (stats: DashboardStats): jsPDF => {
    const doc = new jsPDF();
    const title = "Planning Summary";
  
    doc.setFontSize(14);
    doc.setTextColor(0, 0, 0);
    doc.text("Executive Summary", 14, 45);

    const startY = 55;
    const lineHeight = 12;
    
    const statsData = [
        { label: "Days Until Wedding", value: stats.daysLeft.toString() },
        { label: "Total Estimated Budget", value: formatCurrency(stats.totalBudget) },
        { label: "Total Spent So Far", value: formatCurrency(stats.spentBudget) },
        { label: "Remaining Budget", value: formatCurrency(stats.totalBudget - stats.spentBudget) },
        { label: "Total Guests Invited", value: stats.totalGuests.toString() },
        { label: "Confirmed Guests", value: stats.confirmedGuests.toString() },
        { label: "Pending Tasks", value: stats.pendingTasks.toString() }
    ];

    statsData.forEach((stat, index) => {
        doc.setFont("helvetica", "bold");
        doc.text(stat.label + ":", 14, startY + (index * lineHeight));
        doc.setFont("helvetica", "normal");
        doc.text(stat.value, 80, startY + (index * lineHeight));
    });

    doc.setDrawColor(200, 200, 200);
    doc.line(14, startY + (statsData.length * lineHeight) + 10, 196, startY + (statsData.length * lineHeight) + 10);
    
    doc.setFontSize(11);
    doc.setTextColor(100, 100, 100);
    doc.text("Notes:", 14, startY + (statsData.length * lineHeight) + 20);

    addTemplate(doc, title);
    return doc;
};

export const exportDashboardPDF = (stats: DashboardStats) => {
    const doc = createDashboardPDF(stats);
    doc.save("Wedding_Dashboard_Summary.pdf");
};