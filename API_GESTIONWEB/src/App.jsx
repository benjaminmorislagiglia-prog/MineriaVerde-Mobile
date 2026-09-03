import { Fragment, useEffect, useMemo, useRef, useState } from "react";
import {
  Boxes,
  ChevronDown,
  ClipboardList,
  Eye,
  EyeOff,
  Gauge,
  Leaf,
  LogOut,
  Mountain,
  Package,
  Pencil,
  Plus,
  RotateCcw,
  Search,
  ShieldCheck,
  Trash2,
  Truck,
  UserRound,
  Wrench
} from "lucide-react";

const API_BASES = ["https://localhost:44320/api", "http://localhost:51941/api"];

async function apiRequest(path, options = {}) {
  let lastError;

  for (const baseUrl of API_BASES) {
    try {
      const response = await fetch(`${baseUrl}${path}`, {
        ...options,
        headers: {
          Accept: "application/json",
          ...(options.body ? { "Content-Type": "application/json" } : {}),
          ...options.headers
        }
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || `La API respondio con estado ${response.status}.`);
      }

      return response;
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError || new Error("No se pudo conectar con la API.");
}

const resources = {
  empleados: {
    label: "Empleados",
    icon: UserRound,
    path: "/empleados",
    title: "Gestion de empleados",
    description: "Personal operativo y administrativo registrado en el sistema.",
    empty: "Todavia no hay empleados cargados.",
    fields: [
      { key: "Nombre", label: "Nombre", type: "text", lettersOnly: true, minLength: 2, maxLength: 25 },
      { key: "Apellido", label: "Apellido", type: "text", lettersOnly: true, minLength: 2, maxLength: 25 },
      { key: "Legajo", label: "Legajo", type: "number", min: 1, integer: true },
      {
        key: "Puesto",
        label: "Puesto",
        type: "text",
        lettersOnly: true,
        minLength: 2,
        maxLength: 30,
        options: ["Administrativo", "Mecanico", "Operario", "Encargado", "Sereno", "Supervisor"]
      },
      {
        key: "Id_Provincia",
        label: "Provincia",
        type: "number",
        min: 1,
        integer: true,
        lookup: "provincias"
      },
      {
        key: "Id_Ciudad",
        label: "Ciudad",
        type: "number",
        min: 1,
        integer: true,
        lookup: "ciudades"
      },
      { key: "Calle", label: "Calle", type: "text", minLength: 2, maxLength: 30 },
      { key: "Numero", label: "Numero", type: "number", min: 1, integer: true }
    ],
    table: ["Nombre", "Apellido", "Legajo", "Puesto", "Provincia", "Ciudad", "Direccion"]
  },
  maquinaria: {
    label: "Maquinaria",
    icon: Truck,
    path: "/maquinas",
    title: "Gestion de maquinaria",
    description: "Equipos, dominios y modelos asociados a la operacion.",
    empty: "Todavia no hay maquinaria cargada.",
    fields: [
      {
        key: "Nombre",
        label: "Nombre",
        type: "text",
        lettersOnly: true,
        minLength: 2,
        maxLength: 20,
        options: ["Retroexcavadora", "Pala mecanica", "Autoelevador", "Camion", "Excavadora", "Motoniveladora"]
      },
      {
        key: "Dominio",
        label: "Dominio",
        type: "text",
        uppercase: true,
        noSpaces: true,
        pattern: "[A-Z0-9\\x2d]{5,10}",
        title: "El dominio debe tener entre 5 y 10 caracteres, solo letras, numeros o guiones.",
        minLength: 5,
        maxLength: 10
      },
      { key: "Anio", label: "Anio", type: "number", min: 1950, max: new Date().getFullYear() + 1, integer: true },
      { key: "Modelo", label: "Modelo", type: "text", minLength: 2, maxLength: 20 }
    ],
    table: ["Nombre", "Dominio", "Anio", "Modelo"]
  },
  proveedores: {
    label: "Proveedores",
    icon: ShieldCheck,
    path: "/proveedores",
    title: "Gestion de proveedores",
    description: "Contactos comerciales y datos fiscales de proveedores.",
    empty: "Todavia no hay proveedores cargados.",
    fields: [
      {
        key: "Cuit",
        label: "CUIT",
        type: "text",
        digitsOnly: true,
        exactLength: 11,
        maxLength: 11,
        inputMode: "numeric",
        pattern: "[0-9]{11}",
        title: "El CUIT debe tener 11 numeros, sin guiones."
      },
      { key: "Razon_Social", label: "Razon social", type: "text", minLength: 2, maxLength: 30 },
      {
        key: "Condicion_Iva",
        label: "Condicion IVA",
        type: "text",
        minLength: 2,
        maxLength: 20,
        options: ["Responsable Inscripto", "Monotributista", "Exento", "Consumidor Final"]
      },
      { key: "Email", label: "Email", type: "email", maxLength: 80 },
      {
        key: "Telefono",
        label: "Telefono",
        type: "text",
        digitsOnly: true,
        minLength: 8,
        maxLength: 15,
        inputMode: "numeric",
        pattern: "[0-9]{8,15}",
        title: "El telefono debe tener entre 8 y 15 numeros."
      }
    ],
    table: ["Cuit", "Razon_Social", "Condicion_Iva", "Email", "Telefono"]
  },
  repuestos: {
    label: "Repuestos",
    icon: Wrench,
    path: "/repuestos",
    title: "Gestion de repuestos",
    description: "Catalogo tecnico de piezas, cantidades y proveedor asociado.",
    empty: "Todavia no hay repuestos cargados.",
    fields: [
      { key: "Nombre", label: "Nombre", type: "text", minLength: 2, maxLength: 30 },
      { key: "Precio", label: "Precio", type: "number", min: 0, integer: true },
      { key: "OEM", label: "OEM", type: "text", uppercase: true, noSpaces: true, minLength: 2, maxLength: 20 },
      {
        key: "Unidad_de_Medida",
        label: "Unidad de medida",
        type: "text",
        minLength: 2,
        maxLength: 20,
        options: ["Unidad", "Litro", "Metro", "Caja", "Kit", "Par"]
      },
      { key: "Cantidad", label: "Cantidad", type: "number", min: 0, integer: true },
      { key: "Id_Proveedor", label: "Proveedor", type: "number", min: 1, integer: true }
    ],
    table: ["Nombre", "Precio", "OEM", "Unidad_de_Medida", "Cantidad", "Id_Proveedor"]
  },
  stock: {
    label: "Stock",
    icon: Boxes,
    path: "/Stock",
    title: "Control de stock",
    description: "Existencias actuales vinculadas a repuestos y maquinaria.",
    empty: "Todavia no hay stock cargado.",
    fields: [
      {
        key: "Nombre",
        label: "Nombre",
        type: "text",
        minLength: 2,
        maxLength: 20,
        options: ["Filtro", "Correa", "Manguera", "Aceite", "Balde", "Motor", "Rodamiento"]
      },
      { key: "Cantidad", label: "Cantidad", type: "number", min: 0, integer: true },
      { key: "Id_Repuesto", label: "Repuesto", type: "number", min: 1, integer: true },
      { key: "Id_Maquina", label: "Maquinaria", type: "number", min: 1, integer: true }
    ],
    table: ["Nombre", "Cantidad", "Id_Repuesto", "Id_Maquina"]
  },
  movimientos: {
    label: "Movimientos",
    icon: ClipboardList,
    path: "/movimientos",
    title: "Movimientos de inventario",
    description: "Ingresos, egresos, ajustes y prestamos registrados.",
    empty: "Todavia no hay movimientos cargados.",
    fields: [
      { key: "IdEmpleado", label: "Empleado", type: "number", min: 1, integer: true },
      {
        key: "Tipo_de_Movimiento",
        label: "Tipo",
        type: "text",
        lettersOnly: true,
        minLength: 2,
        maxLength: 20,
        options: ["Compra", "Reparacion", "Ajuste", "Prestamo", "Devolucion", "Baja"]
      },
      { key: "Fecha", label: "Fecha", type: "date", maxToday: true },
      { key: "Cantidad", label: "Cantidad", type: "number", min: 1, integer: true },
      {
        key: "Prestamo",
        label: "Prestamo",
        type: "text",
        lettersOnly: true,
        pattern: "[Ss][Ii]|[Nn][Oo]",
        title: "Ingrese Si o No.",
        minLength: 2,
        maxLength: 2,
        options: ["No", "Si"]
      },
      { key: "Ajuste", label: "Ajuste", type: "number", min: 0, step: "0.01" },
      { key: "IdRepuesto", label: "Repuesto", type: "number", min: 1, integer: true },
      { key: "IdMaquina", label: "Maquinaria", type: "number", min: 1, integer: true },
      { key: "IdStock", label: "Stock", type: "number", min: 1, integer: true }
    ],
    table: [
      "IdEmpleado",
      "Tipo_de_Movimiento",
      "Fecha",
      "Cantidad",
      "Prestamo",
      "Ajuste",
      "IdRepuesto",
      "IdMaquina",
      "IdStock"
    ]
  }
};

const navItems = [
  { key: "dashboard", label: "Dashboard", icon: Gauge },
  ...Object.entries(resources).map(([key, resource]) => ({ key, ...resource }))
];

function toFormState(fields, item = {}) {
  return fields.reduce((state, field) => {
    state[field.key] = item[field.key] ?? "";
    return state;
  }, {});
}

function normalizeValue(value, type) {
  const cleanValue = typeof value === "string" ? value.trim() : value;
  if (type === "number") return cleanValue === "" ? "" : Number(cleanValue);
  return cleanValue;
}

function sanitizeFieldValue(field, value) {
  let nextValue = value;

  if (field.digitsOnly) nextValue = nextValue.replace(/\D/g, "");
  if (field.lettersOnly) nextValue = nextValue.replace(/[0-9]/g, "");
  if (field.noSpaces) nextValue = nextValue.replace(/\s/g, "");
  if (field.uppercase) nextValue = nextValue.toUpperCase();
  if (field.maxLength) nextValue = nextValue.slice(0, field.maxLength);

  return nextValue;
}

function getTodayInputValue() {
  const today = new Date();
  const localDate = new Date(today.getTime() - today.getTimezoneOffset() * 60000);
  return localDate.toISOString().slice(0, 10);
}

function getInputProps(field) {
  return {
    type: field.type,
    min: field.min,
    max: field.maxToday ? getTodayInputValue() : field.max,
    step: field.step ?? (field.type === "number" && field.integer ? "1" : undefined),
    minLength: field.minLength,
    maxLength: field.maxLength,
    pattern: field.pattern,
    title:
      field.title ??
      (field.lettersOnly
        ? "Este campo no debe contener numeros."
        : field.min !== undefined
          ? `El valor minimo permitido es ${field.min}.`
          : undefined),
    inputMode: field.inputMode
  };
}

function getFieldOptions(field, currentValue) {
  if (!field.options) return [];
  if (!currentValue || field.options.includes(currentValue)) return field.options;
  return [currentValue, ...field.options];
}

function getTableValue(item, field) {
  if (field === "Direccion") {
    return [item.Calle, item.Numero].filter((value) => value !== null && value !== undefined && value !== "").join(" ");
  }
  return item[field];
}

function getTableLabel(resource, field) {
  return resource.fields.find((item) => item.key === field)?.label ?? field;
}

function validateFormData(fields, formData) {
  for (const field of fields) {
    const value = String(formData[field.key] ?? "").trim();

    if (!value) return `Complete el campo ${field.label}.`;

    if (field.minLength && value.length < field.minLength) {
      return `${field.label} debe tener al menos ${field.minLength} caracteres.`;
    }

    if (field.exactLength && value.length !== field.exactLength) {
      return `${field.label} debe tener exactamente ${field.exactLength} caracteres.`;
    }

    if (field.pattern) {
      const regex = new RegExp(`^(?:${field.pattern})$`);
      if (!regex.test(value)) return field.title || `Revise el formato de ${field.label}.`;
    }

    if (field.type === "number") {
      const numberValue = Number(value);
      if (!Number.isFinite(numberValue)) return `${field.label} debe ser un numero valido.`;
      if (field.integer && !Number.isInteger(numberValue)) return `${field.label} debe ser un numero entero.`;
      if (field.min !== undefined && numberValue < field.min) {
        return `${field.label} no puede ser menor que ${field.min}.`;
      }
      if (field.max !== undefined && numberValue > field.max) {
        return `${field.label} no puede ser mayor que ${field.max}.`;
      }
    }

    if (field.type === "date" && field.maxToday && value > getTodayInputValue()) {
      return `${field.label} no puede ser una fecha futura.`;
    }
  }

  return "";
}

function getInactiveStorageKey(resourceKey) {
  return `mineria-verde-inactivos-${resourceKey}`;
}

function readInactiveItems(resourceKey) {
  try {
    return JSON.parse(localStorage.getItem(getInactiveStorageKey(resourceKey)) || "[]");
  } catch (error) {
    return [];
  }
}

function writeInactiveItems(resourceKey, items) {
  localStorage.setItem(getInactiveStorageKey(resourceKey), JSON.stringify(items));
}

function BrandMark() {
  return (
    <div className="brand-mark" aria-hidden="true">
      <Mountain size={25} strokeWidth={2.1} />
      <Leaf className="brand-leaf" size={14} strokeWidth={2.4} />
    </div>
  );
}

function LoginScreen({ onLogin }) {
  const [credentials, setCredentials] = useState({ user: "", pass: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (credentials.user.trim().toLowerCase() !== "benjamin" || credentials.pass !== "1234") {
      setError("Usuario o contrasena incorrectos.");
      return;
    }

    onLogin({
      username: "benjamin",
      name: "Benjamin",
      role: "admin",
      roleLabel: "Administrador"
    });
  }

  return (
    <main className="login-page">
      <section className="login-panel">
        <BrandMark />
        <p className="eyebrow">Mineria Verde</p>
        <h1>Gestion de depositos</h1>

        <form className="login-form" onSubmit={handleSubmit}>
          <label>
            Usuario
            <input
              value={credentials.user}
              onChange={(event) => setCredentials({ ...credentials, user: event.target.value })}
              placeholder="Ingrese su usuario"
              autoComplete="username"
              required
            />
          </label>
          <label>
            Contrasena
            <span className="password-field">
              <input
                type={showPassword ? "text" : "password"}
                value={credentials.pass}
                onChange={(event) => setCredentials({ ...credentials, pass: event.target.value })}
                placeholder="Ingrese su contrasena"
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((current) => !current)}
                title={showPassword ? "Ocultar contrasena" : "Mostrar contrasena"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </span>
          </label>
          {error ? <p className="form-error">{error}</p> : null}
          <button className="primary-button" type="submit">
            Ingresar
          </button>
        </form>
      </section>
      <aside className="login-aside">
        <div>
          <span className="status-pill">Operacion minera verde</span>
          <h2>Inventario tecnico para una operacion mas eficiente.</h2>
        </div>
      </aside>
    </main>
  );
}

function AppShell({ activeSection, setActiveSection, user, roleLabel, onLogout, children }) {
  return (
    <div className="app-shell">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <BrandMark />
          <div>
            <strong>Mineria Verde</strong>
            <span>Gestion de stock</span>
          </div>
        </div>

        <nav className="sidebar-nav" aria-label="Principal">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                className={activeSection === item.key ? "active" : ""}
                key={item.key}
                onClick={() => setActiveSection(item.key)}
                type="button"
                title={item.label}
              >
                <Icon size={18} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="sidebar-footer">
          <div className="user-chip">
            <UserRound size={18} />
            <span>
              {user}
              <small>{roleLabel}</small>
            </span>
          </div>
          <button className="ghost-button" onClick={onLogout} type="button">
            <LogOut size={18} />
            <span>Salir</span>
          </button>
        </div>
      </aside>

      <main className="content-area">{children}</main>
    </div>
  );
}

function Dashboard({ resourceData }) {
  const stats = [
    { label: "Empleados", value: resourceData.empleados?.length ?? 0, icon: UserRound },
    { label: "Maquinaria", value: resourceData.maquinaria?.length ?? 0, icon: Truck },
    { label: "Repuestos", value: resourceData.repuestos?.length ?? 0, icon: Wrench },
    { label: "Movimientos", value: resourceData.movimientos?.length ?? 0, icon: ClipboardList }
  ];

  const lowStock = (resourceData.stock ?? []).filter((item) => Number(item.Cantidad) <= 2);

  return (
    <section className="page-stack">
      <div className="page-header">
        <div>
          <p className="eyebrow">Panel general</p>
          <h1>Resumen operativo</h1>
          <p className="muted">Vista rapida del estado actual del sistema conectado a la API existente.</p>
        </div>
      </div>

      <div className="stat-grid">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <article className="metric-card" key={stat.label}>
              <Icon size={22} />
              <span>{stat.label}</span>
              <strong>{stat.value}</strong>
            </article>
          );
        })}
      </div>

      <section className="panel">
        <div className="panel-header">
          <div>
            <h2>Stock critico</h2>
            <p className="muted">Elementos con dos unidades o menos.</p>
          </div>
          <Package size={22} />
        </div>

        {lowStock.length ? (
          <div className="compact-list">
            {lowStock.slice(0, 6).map((item) => (
              <div className="compact-row" key={item.Id ?? item.Nombre}>
                <strong>{item.Nombre}</strong>
                <span>{item.Cantidad} unidades</span>
              </div>
            ))}
          </div>
        ) : (
          <p className="empty-state">No hay alertas de stock bajo para mostrar.</p>
        )}
      </section>
    </section>
  );
}

function LookupSelect({ label, value, options, placeholder, disabled, loading, onChange }) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const selectedOption = options.find((option) => String(option.Id) === String(value));

  useEffect(() => {
    function handleOutsideClick(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  useEffect(() => {
    if (disabled) setOpen(false);
  }, [disabled]);

  return (
    <div className="lookup-select" ref={containerRef}>
      <button
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={label}
        className="lookup-select-trigger"
        disabled={disabled}
        onClick={() => setOpen((current) => !current)}
        role="combobox"
        type="button"
      >
        <span>{loading ? "Cargando..." : selectedOption?.Nombre ?? placeholder}</span>
        <ChevronDown className={open ? "open" : ""} size={18} />
      </button>

      {open ? (
        <div aria-label={`Opciones de ${label}`} className="lookup-select-menu" role="listbox">
          <button
            className={!value ? "selected" : ""}
            onClick={() => {
              onChange("");
              setOpen(false);
            }}
            role="option"
            type="button"
          >
            {placeholder}
          </button>
          {options.map((option) => (
            <button
              aria-selected={String(option.Id) === String(value)}
              className={String(option.Id) === String(value) ? "selected" : ""}
              key={option.Id}
              onClick={() => {
                onChange(String(option.Id));
                setOpen(false);
              }}
              role="option"
              type="button"
            >
              {option.Nombre}
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function getEmployeeFieldSection(fieldKey) {
  if (fieldKey === "Nombre") return "Datos personales";
  if (fieldKey === "Id_Provincia") return "Ubicacion";
  return null;
}

function ResourcePage({ resourceKey, resource, items, setItems, canEdit }) {
  const [formData, setFormData] = useState(() => toFormState(resource.fields));
  const [editingId, setEditingId] = useState(null);
  const [inactiveItems, setInactiveItems] = useState(() => readInactiveItems(resourceKey));
  const [inactiveError, setInactiveError] = useState("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [provincias, setProvincias] = useState([]);
  const [ciudades, setCiudades] = useState([]);
  const [loadingProvincias, setLoadingProvincias] = useState(false);
  const [loadingCiudades, setLoadingCiudades] = useState(false);

  useEffect(() => {
    let ignore = false;

    async function loadItems() {
      setLoading(true);
      setError("");
      try {
        const response = await apiRequest(resource.path);
        if (!response.ok) throw new Error("No se pudo cargar la informacion.");
        const data = await response.json();
        if (!ignore) setItems(Array.isArray(data) ? data : []);
      } catch (err) {
        if (!ignore) setError("No se pudo conectar con la API. Verifica que el backend este iniciado.");
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    loadItems();
    return () => {
      ignore = true;
    };
  }, [resource.path]);

  useEffect(() => {
    setInactiveItems(readInactiveItems(resourceKey));
    setInactiveError("");
  }, [resourceKey]);

  useEffect(() => {
    if (resourceKey !== "empleados") return undefined;

    let ignore = false;

    async function loadProvincias() {
      setLoadingProvincias(true);
      try {
        const response = await apiRequest("/provincias");
        const data = await response.json();
        if (!ignore) setProvincias(Array.isArray(data) ? data : []);
      } catch (err) {
        if (!ignore) setError("No se pudieron cargar las provincias.");
      } finally {
        if (!ignore) setLoadingProvincias(false);
      }
    }

    loadProvincias();
    return () => {
      ignore = true;
    };
  }, [resourceKey]);

  useEffect(() => {
    if (resourceKey !== "empleados" || !formData.Id_Provincia) {
      setCiudades([]);
      setLoadingCiudades(false);
      return undefined;
    }

    let ignore = false;

    async function loadCiudades() {
      setLoadingCiudades(true);
      try {
        const response = await apiRequest(`/ciudades/provincia/${formData.Id_Provincia}`);
        const data = await response.json();
        if (!ignore) setCiudades(Array.isArray(data) ? data : []);
      } catch (err) {
        if (!ignore) setError("No se pudieron cargar las ciudades.");
      } finally {
        if (!ignore) setLoadingCiudades(false);
      }
    }

    loadCiudades();
    return () => {
      ignore = true;
    };
  }, [resourceKey, formData.Id_Provincia]);

  async function reloadLists() {
    const activeResponse = await apiRequest(resource.path);
    const activeData = await activeResponse.json();
    setItems(Array.isArray(activeData) ? activeData : []);
  }

  function loadInactiveItems() {
    setInactiveError("");
    setInactiveItems(readInactiveItems(resourceKey));
  }

  const filteredItems = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return items;
    return items.filter((item) =>
      resource.table.some((field) => String(getTableValue(item, field) ?? "").toLowerCase().includes(query))
    );
  }, [items, resource.table, search]);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    const validationMessage = validateFormData(resource.fields, formData);
    if (validationMessage) {
      setError(validationMessage);
      return;
    }

    const payload = resource.fields.reduce((data, field) => {
      data[field.key] = normalizeValue(formData[field.key], field.type);
      return data;
    }, {});

    try {
      const url = editingId ? `${resource.path}/${editingId}` : resource.path;
      const method = editingId ? "PUT" : "POST";
      const response = await apiRequest(url, {
        method,
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error("No se pudo guardar el registro.");

      await reloadLists();
      setFormData(toFormState(resource.fields));
      setEditingId(null);
    } catch (err) {
      setError("No se pudo guardar el registro. Revisa la API e intenta nuevamente.");
    }
  }

  async function handleDelete(id) {
    const confirmed = window.confirm("Desea desactivar este registro?");
    if (!confirmed) return;

    try {
      const itemToDeactivate = items.find((item) => item.Id === id);
      const response = await apiRequest(`${resource.path}/${id}`, { method: "DELETE" });
      if (!response.ok) throw new Error("No se pudo desactivar el registro.");

      if (itemToDeactivate) {
        const nextInactiveItems = [
          itemToDeactivate,
          ...inactiveItems.filter((item) => item.Id !== id)
        ];
        setInactiveItems(nextInactiveItems);
        writeInactiveItems(resourceKey, nextInactiveItems);
      }

      await reloadLists();
    } catch (err) {
      setError("No se pudo desactivar el registro. Revisa la API e intenta nuevamente.");
    }
  }

  function handleEdit(item) {
    setEditingId(item.Id);
    setFormData(toFormState(resource.fields, item));
  }

  function handleFieldChange(field, value) {
    const nextValue = sanitizeFieldValue(field, value);
    setFormData((current) => {
      const nextFormData = { ...current, [field.key]: nextValue };
      if (resourceKey === "empleados" && field.key === "Id_Provincia") {
        nextFormData.Id_Ciudad = "";
      }
      return nextFormData;
    });
  }

  async function handleReactivate(id) {
    try {
      const response = await apiRequest(`${resource.path}/${id}/reactivar`, { method: "PUT" });
      if (!response.ok) throw new Error("No se pudo reactivar el registro.");
      const nextInactiveItems = inactiveItems.filter((item) => item.Id !== id);
      setInactiveItems(nextInactiveItems);
      writeInactiveItems(resourceKey, nextInactiveItems);
      await reloadLists();
    } catch (err) {
      setInactiveError("No se pudo reactivar el registro. Revisa la API e intenta nuevamente.");
    }
  }

  return (
    <section className="page-stack">
      <div className="page-header">
        <div>
          <p className="eyebrow">{resource.label}</p>
          <h1>{resource.title}</h1>
          <p className="muted">{resource.description}</p>
        </div>
        <div className="header-counter">
          <span>{items.length}</span>
          <small>registros</small>
        </div>
      </div>

      <div className="workspace-grid">
        {canEdit ? (
          <section className="panel">
            <div className="panel-header">
              <div>
                <h2>{editingId ? "Editar registro" : "Nuevo registro"}</h2>
              </div>
              <Plus size={22} />
            </div>

            <form className="data-form" onSubmit={handleSubmit}>
              {resource.fields.map((field) => {
                const sectionTitle =
                  resourceKey === "empleados" ? getEmployeeFieldSection(field.key) : null;
                const fieldValue = formData[field.key];
                const commonProps = {
                  value: fieldValue,
                  onChange: (event) => handleFieldChange(field, event.target.value),
                  required: true
                };
                const lookupOptions =
                  field.lookup === "provincias"
                    ? provincias
                    : field.lookup === "ciudades"
                      ? ciudades
                      : [];

                if (field.lookup) {
                  const isCity = field.lookup === "ciudades";
                  return (
                    <Fragment key={`${resourceKey}-${field.key}`}>
                      {sectionTitle ? <h3 className="form-section-title">{sectionTitle}</h3> : null}
                      <div className="field-group">
                        <span className="field-label">{field.label}</span>
                        <LookupSelect
                          disabled={
                            loadingProvincias ||
                            (isCity && (!formData.Id_Provincia || loadingCiudades))
                          }
                          label={field.label}
                          loading={isCity ? loadingCiudades : loadingProvincias}
                          onChange={(value) => handleFieldChange(field, value)}
                          options={lookupOptions}
                          placeholder={
                            isCity && !formData.Id_Provincia
                              ? "Primero seleccione una provincia"
                              : `Seleccionar ${field.label.toLowerCase()}`
                          }
                          value={fieldValue}
                        />
                      </div>
                    </Fragment>
                  );
                }

                return (
                  <Fragment key={`${resourceKey}-${field.key}`}>
                    {sectionTitle ? <h3 className="form-section-title">{sectionTitle}</h3> : null}
                    <label>
                      {field.label}
                      {field.options ? (
                        <select {...commonProps}>
                          <option value="">Seleccionar</option>
                          {getFieldOptions(field, fieldValue).map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input {...getInputProps(field)} {...commonProps} />
                      )}
                    </label>
                  </Fragment>
                );
              })}

              {error ? <p className="form-error">{error}</p> : null}

              <div className="form-actions">
                <button className="primary-button" type="submit">
                  {editingId ? "Actualizar" : "Guardar"}
                </button>
                {editingId ? (
                  <button
                    className="secondary-button"
                    type="button"
                    onClick={() => {
                      setEditingId(null);
                      setFormData(toFormState(resource.fields));
                    }}
                  >
                    Cancelar
                  </button>
                ) : null}
              </div>
            </form>
          </section>
        ) : (
          <section className="panel read-only-panel">
            <div className="panel-header">
              <div>
                <h2>Acceso de consulta</h2>
                <p className="muted">
                  Este perfil permite revisar la informacion operativa. Las altas, ediciones y desactivaciones quedan
                  reservadas a usuarios administradores.
                </p>
              </div>
              <ShieldCheck size={22} />
            </div>
          </section>
        )}

        <section className="panel table-panel">
          <div className="table-toolbar">
            <div>
              <h2>Listado</h2>
              {loading ? <p className="muted">Cargando informacion...</p> : null}
            </div>
            <label className="search-box">
              <Search size={18} />
              <input
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Buscar"
              />
            </label>
          </div>

          <div className="table-scroll">
            <table>
              <thead>
                <tr>
                  {resource.table.map((field) => (
                    <th key={field}>{getTableLabel(resource, field)}</th>
                  ))}
                  {canEdit ? <th>Acciones</th> : null}
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item) => (
                  <tr key={item.Id ?? JSON.stringify(item)}>
                    {resource.table.map((field) => (
                      <td key={`${item.Id}-${field}`}>{String(getTableValue(item, field) || "-")}</td>
                    ))}
                    {canEdit ? (
                      <td>
                        <div className="row-actions">
                          <button type="button" onClick={() => handleEdit(item)} title="Editar">
                            <Pencil size={16} />
                          </button>
                          <button type="button" onClick={() => handleDelete(item.Id)} title="Desactivar">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    ) : null}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {!loading && !filteredItems.length ? (
            <p className="empty-state">
              {items.length ? "No hay resultados para la busqueda." : resource.empty}
            </p>
          ) : null}
        </section>
      </div>

      {canEdit ? (
        <section className="panel table-panel inactive-panel">
          <div className="table-toolbar">
            <div>
              <h2>Registros desactivados</h2>
            </div>
            <button className="secondary-button" type="button" onClick={loadInactiveItems}>
              <RotateCcw size={18} />
              <span>Actualizar</span>
            </button>
          </div>

          {inactiveError ? <p className="form-error">{inactiveError}</p> : null}

          {inactiveItems.length ? (
            <div className="table-scroll">
              <table>
                <thead>
                  <tr>
                    {resource.table.map((field) => (
                      <th key={`inactive-${field}`}>{getTableLabel(resource, field)}</th>
                    ))}
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {inactiveItems.map((item) => (
                    <tr key={`inactive-${item.Id ?? JSON.stringify(item)}`}>
                      {resource.table.map((field) => (
                        <td key={`inactive-${item.Id}-${field}`}>
                          {String(getTableValue(item, field) || "-")}
                        </td>
                      ))}
                      <td>
                        <div className="row-actions">
                          <button type="button" onClick={() => handleEdit(item)} title="Editar">
                            <Pencil size={16} />
                          </button>
                          <button type="button" onClick={() => handleReactivate(item.Id)} title="Reactivar">
                            <RotateCcw size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="empty-state">No hay registros desactivados cargados.</p>
          )}
        </section>
      ) : null}

    </section>
  );
}

export default function App() {
  const [session, setSession] = useState(null);
  const [activeSection, setActiveSection] = useState("dashboard");
  const [resourceData, setResourceData] = useState(() =>
    Object.keys(resources).reduce((state, key) => ({ ...state, [key]: [] }), {})
  );

  useEffect(() => {
    if (!session) return undefined;

    let ignore = false;

    async function loadInitialData() {
      const entries = await Promise.allSettled(
        Object.entries(resources).map(async ([key, resource]) => {
          const response = await apiRequest(resource.path);
          if (!response.ok) return [key, []];
          const data = await response.json();
          return [key, Array.isArray(data) ? data : []];
        })
      );

      if (ignore) return;

      setResourceData((current) => {
        const next = { ...current };
        entries.forEach((entry) => {
          if (entry.status === "fulfilled") {
            const [key, value] = entry.value;
            next[key] = value;
          }
        });
        return next;
      });
    }

    loadInitialData();

    return () => {
      ignore = true;
    };
  }, [session]);

  function updateResource(key, value) {
    setResourceData((current) => ({ ...current, [key]: value }));
  }

  if (!session) {
    return <LoginScreen onLogin={setSession} />;
  }

  return (
    <AppShell
      activeSection={activeSection}
      setActiveSection={setActiveSection}
      user={session.name}
      roleLabel={session.roleLabel}
      onLogout={() => setSession(null)}
    >
      {activeSection === "dashboard" ? (
        <Dashboard resourceData={resourceData} />
      ) : (
        <ResourcePage
          key={activeSection}
          resourceKey={activeSection}
          resource={resources[activeSection]}
          items={resourceData[activeSection]}
          setItems={(items) => updateResource(activeSection, items)}
          canEdit={session.role === "admin"}
        />
      )}
    </AppShell>
  );
}
