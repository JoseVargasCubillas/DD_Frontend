import { useState, type ChangeEvent } from "react";
import toast from "react-hot-toast";
import logoDD from "../../../../../assets/home/012_home_main logo_DD.png";

type PaymentProvider = "stripe" | "none";
type ServiceAgreement = "not_required" | "default" | "custom";
type PostPurchasePage = "library" | "landing";
type PreviewTab = "cart" | "checkout";

interface CartSettings {
  solidButtonBackground: string;
  buttonLabelColor: string;
  buttonOutlineColor: string;
  buttonBorderRadius: number;
  buttonText: string;
  paymentProvider: PaymentProvider;
  paypalEnabled: boolean;
  fields: {
    name: boolean;
    phone: boolean;
    address: boolean;
    email: true;
  };
  serviceAgreement: ServiceAgreement;
  serviceAgreementText: string;
  postPurchasePage: PostPurchasePage;
  skipAccountCreation: boolean;
  useOfferEmailSettings: boolean;
}

const STORAGE_KEY = "dd-sales-cart-settings";

const DEFAULT_CART_SETTINGS: CartSettings = {
  solidButtonBackground: "#000000",
  buttonLabelColor: "#ffffff",
  buttonOutlineColor: "#ffffff",
  buttonBorderRadius: 8,
  buttonText: "Continue to checkout",
  paymentProvider: "stripe",
  paypalEnabled: true,
  fields: {
    name: false,
    phone: false,
    address: false,
    email: true,
  },
  serviceAgreement: "not_required",
  serviceAgreementText: "",
  postPurchasePage: "library",
  skipAccountCreation: false,
  useOfferEmailSettings: true,
};

export default function SalesCart() {
  const [settings, setSettings] = useState<CartSettings>(() =>
    loadCartSettings(),
  );
  const [previewTab, setPreviewTab] = useState<PreviewTab>("cart");
  const update = (values: Partial<CartSettings>) =>
    setSettings((current) => ({ ...current, ...values }));
  const updateFields = (values: Partial<CartSettings["fields"]>) =>
    setSettings((current) => ({
      ...current,
      fields: { ...current.fields, ...values, email: true },
    }));
  const save = () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    toast.success("Configuración del carrito guardada");
  };

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <header className="flex items-center justify-between gap-4">
        <h1 className="font-serif text-4xl text-ink-900">Carrito</h1>
        <button
          type="button"
          onClick={save}
          className="min-h-11 rounded-full bg-ink-900 px-5 text-sm font-semibold text-cream"
        >
          Guardar
        </button>
      </header>

      <section className="grid gap-8 rounded-2xl border border-ink-900/10 bg-white p-6 shadow-sm lg:grid-cols-[320px_1fr]">
        <div className="space-y-4 lg:border-r lg:border-ink-900/10 lg:pr-6">
          <ColorField
            label="Fondo del botón sólido"
            value={settings.solidButtonBackground}
            onChange={(value) => update({ solidButtonBackground: value })}
          />
          <ColorField
            label="Texto del botón"
            value={settings.buttonLabelColor}
            onChange={(value) => update({ buttonLabelColor: value })}
          />
          <label className="block text-sm font-semibold">
            Etiqueta del botón
            <input
              value={settings.buttonText}
              onChange={(event) => update({ buttonText: event.target.value })}
              className="mt-2 min-h-10 w-full rounded-lg border border-ink-900/20 px-3"
            />
          </label>
          <ColorField
            label="Borde del botón"
            value={settings.buttonOutlineColor}
            onChange={(value) => update({ buttonOutlineColor: value })}
          />
          <label className="block text-sm font-semibold">
            Radio del borde del botón
            <input
              type="number"
              min={0}
              max={40}
              value={settings.buttonBorderRadius}
              onChange={(event) =>
                update({ buttonBorderRadius: Number(event.target.value) })
              }
              className="mt-2 min-h-10 w-full rounded-lg border border-ink-900/20 px-3"
            />
          </label>
        </div>

        <div>
          <div className="mb-5 flex gap-3">
            {[
              ["cart", "Carrito"],
              ["checkout", "Checkout"],
            ].map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setPreviewTab(value as PreviewTab)}
                className={`min-h-9 rounded-full px-4 text-sm font-semibold ${
                  previewTab === value
                    ? "bg-ink-900 text-cream"
                    : "bg-ink-900/6 text-ink-700"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          {previewTab === "cart" ? (
            <CartPreview settings={settings} />
          ) : (
            <CheckoutPreview settings={settings} />
          )}
        </div>
      </section>

      <SettingsRow
        title="Proveedores de pago"
        description="Selecciona las opciones de pago para tu carrito."
      >
        <RadioCard
          checked={settings.paymentProvider === "stripe"}
          onChange={() => update({ paymentProvider: "stripe" })}
          title="Stripe"
          description="Tarjetas de débito y crédito con Stripe."
          icon="S"
        />
        <RadioCard
          checked={settings.paymentProvider === "none"}
          onChange={() => update({ paymentProvider: "none" })}
          title="Ninguno"
          description="Sin pagos con tarjeta. Acepta compras gratuitas solamente."
          icon="⊘"
        />
        <div className="mt-6">
          <p className="mb-3 text-sm font-semibold">Opciones adicionales</p>
          <label className="flex cursor-pointer items-center gap-4 text-sm">
            <input
              type="checkbox"
              checked={settings.paypalEnabled}
              onChange={(event) =>
                update({ paypalEnabled: event.target.checked })
              }
              className="h-4 w-4 accent-indigo-500"
            />
            <span className="rounded bg-blue-50 px-3 py-1 font-semibold text-blue-700">
              PayPal
            </span>
          </label>
        </div>
      </SettingsRow>

      <SettingsRow
        title="Campos del cliente"
        description="Recopila información adicional sobre tu cliente."
      >
        <CheckboxField
          label="Nombre"
          checked={settings.fields.name}
          onChange={(checked) => updateFields({ name: checked })}
        />
        <CheckboxField
          label="Número de teléfono"
          checked={settings.fields.phone}
          onChange={(checked) => updateFields({ phone: checked })}
        />
        <CheckboxField
          label="Dirección"
          checked={settings.fields.address}
          onChange={(checked) => updateFields({ address: checked })}
        />
        <label className="flex items-center gap-3 text-sm text-ink-400">
          <input type="checkbox" checked disabled className="h-4 w-4" />
          Correo electrónico
        </label>
      </SettingsRow>

      <SettingsRow
        title="Acuerdo de servicio"
        description="Permite que los clientes acepten términos y condiciones."
      >
        <RadioLine
          label="No requerido"
          checked={settings.serviceAgreement === "not_required"}
          onChange={() => update({ serviceAgreement: "not_required" })}
        />
        <RadioLine
          label="Acuerdo de servicio predeterminado"
          checked={settings.serviceAgreement === "default"}
          onChange={() => update({ serviceAgreement: "default" })}
        />
        {settings.serviceAgreement === "default" && (
          <DefaultServiceAgreementPreview />
        )}
        <RadioLine
          label="Personalizado"
          checked={settings.serviceAgreement === "custom"}
          onChange={() => update({ serviceAgreement: "custom" })}
        />
        {settings.serviceAgreement === "custom" && (
          <ServiceAgreementEditor
            value={settings.serviceAgreementText}
            onChange={(serviceAgreementText) =>
              update({ serviceAgreementText })
            }
          />
        )}
      </SettingsRow>

      <SettingsRow
        title="Post-compra"
        description="Elige a dónde enviar a los miembros después de su compra."
      >
        <label className="block text-sm font-semibold">
          Página post-compra
          <select
            value={settings.postPurchasePage}
            onChange={(event) =>
              update({
                postPurchasePage: event.target.value as PostPurchasePage,
              })
            }
            className="mt-2 min-h-11 w-full rounded-lg border border-ink-900/20 bg-white px-3"
          >
            <option value="library">Biblioteca de productos del miembro</option>
            <option value="landing">Landing page existente</option>
          </select>
        </label>
        <ToggleRow
          title="Saltar página de creación de cuenta"
          description="Cuando está activo, los nuevos clientes omiten la creación de cuenta."
          checked={settings.skipAccountCreation}
          onChange={(checked) => update({ skipAccountCreation: checked })}
        />
        <div className="my-6 border-t border-ink-900/10" />
        <ToggleRow
          title="Usar ajustes de correo de la oferta"
          description="Cuando está activo, se usará la configuración de correo de cada oferta comprada."
          checked={settings.useOfferEmailSettings}
          onChange={(checked) => update({ useOfferEmailSettings: checked })}
        />
      </SettingsRow>

      <div className="flex justify-end">
        <button
          type="button"
          onClick={save}
          className="min-h-11 rounded-full bg-ink-900 px-5 text-sm font-semibold text-cream"
        >
          Guardar
        </button>
      </div>
    </div>
  );
}

function CartPreview({ settings }: { settings: CartSettings }) {
  return (
    <div className="rounded-2xl border border-ink-900/15 bg-white p-8 shadow-lg">
      <div className="flex items-center justify-between">
        <LogoMark />
        <div className="flex items-center gap-2">
          <CartIcon /> <span className="font-semibold">1</span>
        </div>
      </div>
      <h2 className="mt-8 text-center font-serif text-2xl">
        Carrito de compras
      </h2>
      <div className="mt-10 grid items-start gap-8 md:grid-cols-[1fr_300px]">
        <div>
          <div className="grid items-center gap-4 sm:grid-cols-[92px_1fr_auto]">
            <div className="flex h-14 w-24 items-center justify-center rounded-lg border border-ink-900/20">
              <ImageIcon />
            </div>
            <div className="flex-1">
              <p className="font-semibold">Course Product 1</p>
              <div className="mt-2 inline-flex overflow-hidden rounded-lg border border-ink-900/15">
                <span className="px-4 py-2">1</span>
                <button className="px-3 py-2">＋</button>
              </div>
            </div>
            <strong>50,00 $</strong>
          </div>
          <div className="mt-7 border-t border-ink-900/10" />
        </div>
        <div className="space-y-3">
          <PreviewTotal label="Total parcial" value="50,00 $" />
          <PreviewTotal label="Total del pedido" value="50,00 $" chip="USD" />
          <button
            type="button"
            style={{
              backgroundColor: settings.solidButtonBackground,
              color: settings.buttonLabelColor,
              borderColor: settings.buttonOutlineColor,
              borderRadius: settings.buttonBorderRadius,
            }}
            className="mt-4 min-h-11 w-full border px-4 text-sm font-semibold"
          >
            {settings.buttonText}
          </button>
        </div>
      </div>
    </div>
  );
}

function CheckoutPreview({ settings }: { settings: CartSettings }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-ink-900/15 bg-white shadow-lg">
      <div className="flex items-center justify-between border-b border-ink-900/15 p-7">
        <LogoMark />
        <div className="flex items-center gap-2">
          <CartIcon /> <span className="font-semibold">1</span>
        </div>
      </div>
      <div className="grid min-h-80 md:grid-cols-[1fr_315px]">
        <div className="p-7">
          <h3 className="text-lg font-semibold">Contacto</h3>
          <div className="mt-3 max-w-sm space-y-4">
            {settings.fields.name && <PreviewInput label="Nombre" />}
            <PreviewInput label="Correo electrónico" />
            {settings.fields.phone && <PreviewInput label="Teléfono" />}
            {settings.fields.address && <PreviewInput label="Dirección" />}
          </div>
        </div>
        <aside className="border-l border-ink-900/15 bg-cream-100/50 p-7">
          <div className="flex items-center gap-4">
            <div className="relative flex h-14 w-24 items-center justify-center rounded-lg border border-ink-900/20 bg-white">
              <ImageIcon />
              <span className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-ink-700 text-xs font-semibold text-white">
                1
              </span>
            </div>
            <div className="flex-1 font-semibold leading-tight">
              Course
              <br />
              Product 1
            </div>
            <strong>50,00 $</strong>
          </div>
          <div className="my-5 border-t border-ink-900/10" />
          <div className="flex gap-3">
            <input
              placeholder="Código de descuento o cupón"
              className="min-h-10 min-w-0 flex-1 rounded-lg border border-ink-900/15 bg-white px-3 text-sm"
            />
            <button className="rounded-full bg-ink-900/6 px-4 text-sm font-semibold text-ink-400">
              Aplicar
            </button>
          </div>
          <div className="mt-12 space-y-3">
            <PreviewTotal label="Total parcial" value="50,00 $" />
            <PreviewTotal label="Total del pedido" value="50,00 $" chip="USD" />
          </div>
          <button
            style={{
              backgroundColor: settings.solidButtonBackground,
              color: settings.buttonLabelColor,
              borderRadius: settings.buttonBorderRadius,
            }}
            className="mt-4 min-h-11 w-full px-4 text-sm font-semibold"
          >
            Pay now
          </button>
        </aside>
      </div>
    </div>
  );
}

function SettingsRow({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="grid gap-6 md:grid-cols-[300px_1fr]">
      <div>
        <h2 className="font-serif text-2xl">{title}</h2>
        <p className="mt-4 max-w-xs text-sm leading-relaxed text-ink-600">
          {description}
        </p>
      </div>
      <div className="rounded-2xl border border-ink-900/10 bg-white p-7 shadow-sm">
        {children}
      </div>
    </section>
  );
}

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const handleColor = (event: ChangeEvent<HTMLInputElement>) =>
    onChange(event.target.value.toUpperCase());
  return (
    <label className="block text-sm font-semibold">
      {label}
      <div className="mt-2 flex items-center gap-3">
        <input
          type="color"
          value={value}
          onChange={handleColor}
          className="h-10 w-10 rounded-full border border-ink-900/20 bg-transparent p-0"
        />
        <input
          value={value}
          onChange={(event) => onChange(normalizeHex(event.target.value))}
          className="min-h-10 flex-1 rounded-lg border border-ink-900/20 px-3 uppercase"
        />
      </div>
    </label>
  );
}

function RadioCard({
  checked,
  onChange,
  title,
  description,
  icon,
}: {
  checked: boolean;
  onChange: () => void;
  title: string;
  description: string;
  icon: string;
}) {
  return (
    <label className="mb-4 flex cursor-pointer items-center gap-4">
      <input
        type="radio"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 accent-indigo-500"
      />
      <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-ink-900/10 bg-cream-100 font-bold text-indigo-600">
        {icon}
      </span>
      <span>
        <strong className="block">{title}</strong>
        <span className="text-sm text-ink-600">{description}</span>
      </span>
    </label>
  );
}

function CheckboxField({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <label className="mb-3 flex cursor-pointer items-center gap-3 text-sm">
      <input
        type="checkbox"
        checked={checked}
        onChange={(event) => onChange(event.target.checked)}
        className="h-4 w-4 accent-indigo-500"
      />
      {label}
    </label>
  );
}

function RadioLine({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="mb-3 flex cursor-pointer items-center gap-3 text-sm">
      <input
        type="radio"
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 accent-indigo-500"
      />
      {label}
    </label>
  );
}

function DefaultServiceAgreementPreview() {
  return (
    <div className="mb-4 ml-7 mt-3 rounded-2xl border border-ink-900/15 p-7">
      <p className="text-sm text-ink-600">Vista previa:</p>
      <div className="my-4 border-t border-ink-900/10" />
      <label className="flex items-start gap-3 text-sm font-semibold">
        <input type="checkbox" className="mt-0.5 h-4 w-4" />
        <span>
          He leído y acepto los términos y condiciones de esta página.
        </span>
      </label>
    </div>
  );
}

function ServiceAgreementEditor({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  const append = (token: string) => onChange(`${value}${token}`);
  const tools = [
    { label: "↶", action: () => undefined, disabled: true },
    { label: "↷", action: () => undefined, disabled: true },
    { label: "B", action: () => append("<strong>texto</strong>") },
    { label: "I", action: () => append("<em>texto</em>") },
    { label: "S", action: () => append("<s>texto</s>") },
    { label: "🔗", action: () => append('<a href="#">enlace</a>') },
    { label: "•", action: () => append("\n- ") },
    { label: "1.", action: () => append("\n1. ") },
    { label: "—", action: () => append("\n---\n") },
    {
      label: "☰",
      action: () => append('\n<p style="text-align:left;">texto</p>'),
    },
    {
      label: "≡",
      action: () => append('\n<p style="text-align:center;">texto</p>'),
    },
    {
      label: "☷",
      action: () => append('\n<p style="text-align:right;">texto</p>'),
    },
  ];

  return (
    <div className="mb-4 ml-7 mt-3 overflow-hidden rounded-lg border border-blue-200">
      <div className="flex min-h-10 flex-wrap items-center border-b border-blue-200 bg-white">
        {tools.map((tool, index) => (
          <button
            key={`${tool.label}-${index}`}
            type="button"
            disabled={tool.disabled}
            onClick={tool.action}
            className="h-10 min-w-10 border-r border-blue-100 px-3 text-sm font-semibold text-ink-700 hover:bg-cream-100 disabled:text-ink-300"
          >
            {tool.label}
          </button>
        ))}
      </div>
      <textarea
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Escribe el texto del acuerdo personalizado..."
        className="min-h-80 w-full resize-y p-4 text-sm outline-none"
      />
    </div>
  );
}

function ToggleRow({
  title,
  description,
  checked,
  onChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="mt-6 flex items-center justify-between gap-6">
      <div>
        <p className="text-sm font-semibold">{title}</p>
        <p className="mt-1 text-xs text-ink-500">{description}</p>
      </div>
      <button
        type="button"
        onClick={() => onChange(!checked)}
        aria-pressed={checked}
        className={`flex h-6 w-11 items-center rounded-full p-1 transition ${
          checked ? "bg-indigo-500" : "bg-ink-900/15"
        }`}
      >
        <span
          className={`h-4 w-4 rounded-full bg-white transition ${
            checked ? "translate-x-5" : ""
          }`}
        />
      </button>
    </div>
  );
}

function PreviewTotal({
  label,
  value,
  chip,
}: {
  label: string;
  value: string;
  chip?: string;
}) {
  return (
    <div className="flex items-center justify-between gap-3 font-semibold">
      <span>{label}</span>
      <span className="flex items-center gap-2">
        {chip && (
          <span className="rounded-full border border-ink-900/15 px-2 py-0.5 text-xs">
            {chip}
          </span>
        )}
        {value}
      </span>
    </div>
  );
}

function PreviewInput({ label }: { label: string }) {
  return (
    <label className="block text-sm font-semibold">
      {label}
      <input
        placeholder={label}
        className="mt-2 min-h-10 w-full rounded-lg border border-ink-900/20 px-3"
      />
    </label>
  );
}

function LogoMark() {
  return (
    <img src={logoDD} alt="Diego Díaz" className="h-11 w-auto object-contain" />
  );
}

function loadCartSettings(): CartSettings {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? "null");
    return {
      ...DEFAULT_CART_SETTINGS,
      ...saved,
      fields: {
        ...DEFAULT_CART_SETTINGS.fields,
        ...(saved?.fields ?? {}),
        email: true,
      },
    };
  } catch {
    return DEFAULT_CART_SETTINGS;
  }
}

function normalizeHex(value: string) {
  const clean = value.startsWith("#") ? value : `#${value}`;
  return clean.slice(0, 7).toUpperCase();
}

function CartIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="currentColor"
      className="h-5 w-5"
    >
      <path d="M7 18a2 2 0 1 0 0 4 2 2 0 0 0 0-4Zm10 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4ZM3 3h2l2.1 10.4A3 3 0 0 0 10 16h7a3 3 0 0 0 2.8-2l1.5-5H7.4L6.8 6H3V3Z" />
    </svg>
  );
}

function ImageIcon() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      className="h-7 w-7 text-ink-500"
    >
      <rect x="5" y="5" width="14" height="14" rx="2" />
      <circle cx="9" cy="9" r="1.5" />
      <path d="m7 17 4-4 3 3 2-2 2 3" />
    </svg>
  );
}
