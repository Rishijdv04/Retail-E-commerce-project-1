import { forwardRef, useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

const Field = forwardRef(function Field({ label, error, type = 'text', hint, ...rest }, ref) {
  const [show, setShow] = useState(false);
  const isPw = type === 'password';
  return (
    <label className="scx-field">
      <span className="scx-label">{label}</span>
      <span className="scx-inputwrap">
        <input ref={ref} type={isPw && show ? 'text' : type} aria-invalid={!!error} {...rest} />
        {isPw && (
          <button type="button" className="scx-eye" onClick={() => setShow((s) => !s)}
            aria-label={show ? 'Hide password' : 'Show password'}>
            {show ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        )}
      </span>
      {hint && !error && <span className="scx-hint">{hint}</span>}
      {error && <span className="scx-error" role="alert">{error}</span>}
    </label>
  );
});
export default Field;
