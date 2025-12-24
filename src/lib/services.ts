export type Extra = { name: string; price: string };

export type Service = {
  id: string;
  title: string;
  priceFrom: string;
  idealFor: string;
  highlights: string[];
  mockupSrc: string;
  includes: string[];
  extras: Extra[];
};

export const SERVICES: Service[] = [
  {
    id: "landing",
    title: "Landing Page Profesional",
    priceFrom: "USD 150",
    idealFor: "Emprendedores y validación de ideas.",
    highlights: ["Landing responsive", "Diseño moderno", "CTA + SEO básico"],
    mockupSrc: "/mockups/landing.jpg",
    includes: [
      "Landing responsive (1 página)",
      "Diseño moderno",
      "Copy básico optimizado",
      "CTA a WhatsApp o formulario",
      "Optimización básica SEO",
    ],
    extras: [
      { name: "Sección extra", price: "+USD 30" },
      { name: "Formulario avanzado", price: "+USD 40" },
      { name: "Calendly / reservas", price: "+USD 60" },
    ],
  },
  {
    id: "website",
    title: "Sitio Web Profesional",
    priceFrom: "USD 350",
    idealFor: "Pymes y profesionales.",
    highlights: ["Multi-sección", "Diseño a medida", "WhatsApp + SEO básico"],
    mockupSrc: "/mockups/website.jpg",
    includes: [
      "Home + secciones (Servicios, Contacto, etc.)",
      "Diseño a medida",
      "Copy optimizado",
      "Responsive",
      "SEO básico",
      "Integración WhatsApp",
    ],
    extras: [
      { name: "Blog", price: "+USD 120" },
      { name: "Multilenguaje", price: "+USD 150" },
      { name: "Optimización SEO avanzada", price: "+USD 180" },
    ],
  },
  {
    id: "ecommerce",
    title: "E-commerce",
    priceFrom: "USD 800",
    idealFor: "Negocios que quieren vender online.",
    highlights: ["Catálogo + carrito", "Pagos integrados", "Panel de gestión"],
    mockupSrc: "/mockups/ecommerce.jpg",
    includes: [
      "Catálogo de productos",
      "Carrito de compras",
      "Pasarela de pago",
      "Panel de gestión",
      "Diseño personalizado",
      "Configuración inicial",
    ],
    extras: [
      { name: "Carga inicial de productos", price: "+USD 80" },
      { name: "Envíos / logística", price: "+USD 150" },
      { name: "Emails transaccionales", price: "+USD 120" },
    ],
  },
  {
    id: "webapps",
    title: "Web Apps / Sistemas",
    priceFrom: "USD 1.200",
    idealFor: "Empresas con procesos internos.",
    highlights: ["A medida", "Escalable", "Integraciones + seguridad"],
    mockupSrc: "/mockups/webapp.jpg",
    includes: [
      "Desarrollo a medida",
      "Arquitectura escalable",
      "Integraciones necesarias",
      "Seguridad y performance base",
    ],
    extras: [
      { name: "Dashboard avanzado", price: "+USD 250" },
      { name: "Roles/Permisos", price: "+USD 220" },
      { name: "Automatizaciones", price: "+USD 250" },
    ],
  },
];