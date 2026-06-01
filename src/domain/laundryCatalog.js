export const navItems = [
  { label: "Services", href: "#services" },
  { label: "Process", href: "#process" },
  { label: "Pricing", href: "#pricing" },
  { label: "Contact", href: "#contact" },
];

export const services = [
  {
    title: "Normal Iron",
    text: "Professional ironing service for daily wear clothes, ensuring a crisp, wrinkle-free finish and neat presentation.",
    price: "From Rs. 12/piece",
  },
  {
    title: "Steam Iron",
    text: "Sharp finishing for office wear, school uniforms, sarees, shirts, and occasion pieces.",
    price: "From Rs. 8/item",
  },
  {
    title: "Dry Clean",
    text: "Careful handling for blazers, lehengas, coats, silk, wool, and delicate fabrics.",
    price: "From Rs. 120/item",
  },
];

export const processSteps = [
  "Book pickup",
  "Tag garments",
  "Wash and finish",
  "Quality check",
  "Deliver fresh",
];

export const pricingRows = [
  ["Shirt / T-shirt", "Wash + iron", "Rs. 20"],
  ["Trouser / Jeans", "Wash + iron", "Rs. 30"],
  ["Saree", "Steam press", "Rs. 80"],
  ["Blanket", "Deep wash", "Rs. 180"],
  ["Suit", "Dry clean", "Rs. 280"],
];

export const dashboardStats = [
  { label: "Today Orders", value: "18", trend: "+6 from yesterday" },
  { label: "Pending", value: "7", trend: "Needs follow-up" },
  { label: "Completed", value: "42", trend: "This week" },
  { label: "Revenue", value: "Rs. 12.8k", trend: "Estimated" },
];

export const initialOrders = [
  {
    id: "GPL-1048",
    customer: "Ramesh Kumar",
    phone: "98765 43210",
    service: "Wash and Fold",
    items: 14,
    amount: 520,
    due: "Today, 7:00 PM",
    status: "Pending",
  },
  {
    id: "GPL-1049",
    customer: "Aarti Sharma",
    phone: "98765 12780",
    service: "Steam Iron",
    items: 22,
    amount: 310,
    due: "Tomorrow, 11:00 AM",
    status: "In Process",
  },
  {
    id: "GPL-1050",
    customer: "Mehta Textiles",
    phone: "98888 77441",
    service: "Dry Clean",
    items: 8,
    amount: 1680,
    due: "May 24, 5:00 PM",
    status: "Completed",
  },
  {
    id: "GPL-1051",
    customer: "Priya Nair",
    phone: "91234 56780",
    service: "Wash and Fold",
    items: 11,
    amount: 460,
    due: "Today, 9:00 PM",
    status: "Pending",
  },
];

export const orderStatuses = ["Pending", "In Process", "Completed"];
