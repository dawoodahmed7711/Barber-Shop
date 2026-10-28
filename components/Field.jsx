// Accessible labelled form control wrapper. Pass the control as children via render prop.
export default function Field({ id, label, error, hint, required = false, children }) {
  const describedBy = [error ? `${id}-error` : null, hint ? `${id}-hint` : null]
    .filter(Boolean)
    .join(" ") || undefined;
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block text-sm font-medium text-navy">
        {label}
        {required ? (
          <span className="text-royal" aria-hidden="true"> *</span>
        ) : (
          <span className="font-normal text-slate"> (optional)</span>
        )}
      </label>
      {children({
        id,
        "aria-invalid": error ? "true" : undefined,
        "aria-describedby": describedBy,
        "aria-required": required ? "true" : undefined,
        className: `field ${error ? "field-error" : ""}`,
      })}
      {hint && !error && (
        <p id={`${id}-hint`} className="mt-1.5 text-xs text-slate">{hint}</p>
      )}
      {error && (
        <p id={`${id}-error`} role="alert" className="mt-1.5 text-xs font-medium text-red-600">
          {error}
        </p>
      )}
    </div>
  );
}
