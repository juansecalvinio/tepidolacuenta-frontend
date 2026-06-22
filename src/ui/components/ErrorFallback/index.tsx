export const ErrorFallback = () => (
  <div className="min-h-dvh flex items-center justify-center bg-base-200 px-6 text-center">
    <div className="max-w-sm flex flex-col items-center gap-4">
      <div className="w-14 h-14 rounded-full flex items-center justify-center bg-base-100 border border-base-content/10">
        <svg
          aria-hidden="true"
          className="w-7 h-7 text-warning"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1.5}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z"
          />
        </svg>
      </div>

      <div className="flex flex-col gap-1.5">
        <h1 className="font-display text-2xl font-semibold text-base-content">
          Algo salió mal
        </h1>
        <p className="text-sm leading-relaxed text-fg-soft">
          Tuvimos un problema inesperado. Ya nos enteramos y lo estamos
          revisando. Probá recargar la página.
        </p>
      </div>

      <button
        className="btn btn-primary btn-sm"
        onClick={() => window.location.reload()}
      >
        Reintentar
      </button>
    </div>
  </div>
);
