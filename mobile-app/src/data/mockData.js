export const mockUser = {
  name: "Benjamin",
  role: "Supervisor",
  shift: "Turno manana",
};

export const tasks = [
  {
    id: "OT-1042",
    title: "Revisar nivel hidraulico",
    machine: "Excavadora Volvo",
    priority: "Alta",
    status: "Pendiente",
  },
  {
    id: "OT-1043",
    title: "Control de stock de filtros",
    machine: "Deposito central",
    priority: "Media",
    status: "En proceso",
  },
  {
    id: "OT-1044",
    title: "Verificar horas de horometro",
    machine: "Pala cargadora CAT",
    priority: "Baja",
    status: "Programada",
  },
];

export const fallbackStock = [
  { Id: 1, Repuesto: "Filtro de aceite", Cantidad: 12, StockMinimo: 6 },
  { Id: 2, Repuesto: "Correa alternador", Cantidad: 4, StockMinimo: 5 },
  { Id: 3, Repuesto: "Manguera hidraulica", Cantidad: 9, StockMinimo: 3 },
];
