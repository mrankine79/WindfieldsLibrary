'use client';

export default function ConfirmSubmitButton({ children, confirmText, className, ...rest }) {
  return (
    <button
      {...rest}
      className={className || 'btn danger small'}
      onClick={(e) => {
        if (!window.confirm(confirmText || 'Are you sure?')) {
          e.preventDefault();
        }
      }}
    >
      {children}
    </button>
  );
}
