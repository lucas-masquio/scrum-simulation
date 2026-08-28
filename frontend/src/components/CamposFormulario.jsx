export function Campo({ label, value, onChange }) {
  return (
    <label className="field">
      <span>{label}</span>
      <input value={value} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

export function CampoNome({ label, value, onChange }) {
  return (
    <label className="field">
      <span>{label}</span>
      <input defaultValue={value} onBlur={(event) => onChange(event.target.value)} />
    </label>
  );
}

export function CampoSelecao({ value, options, onChange }) {
  return (
    <select value={value} onChange={(event) => onChange(event.target.value)}>
      <option value="">-</option>
      {options.map((option) => (
        <option key={option} value={option}>
          {option || "- não atribuído -"}
        </option>
      ))}
    </select>
  );
}

export function CaixaSelecao({ label, checked, onChange }) {
  return (
    <label className="checkbox-row">
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      <span>{label}</span>
    </label>
  );
}
