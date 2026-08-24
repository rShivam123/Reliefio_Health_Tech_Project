export default function SupportSection() {
  return (
    <div className="mt-16 rounded-3xl bg-white border border-slate-100 shadow-sm px-8 py-10 text-center">
      <p className="text-slate-600">Not sure which option is right for you?</p>

      <a
        href="mailto:support@reliefio.health"
        className="mt-3 inline-flex items-center gap-2 text-blue-600 font-semibold hover:text-blue-700 hover:underline"
      >
        Contact Support
        <span aria-hidden>→</span>
      </a>

      <div className="mt-8 flex items-center justify-center gap-2 text-sm text-emerald-700">
        <span aria-hidden>🔒</span>
        <span>Your data is encrypted and never shared without consent.</span>
      </div>
    </div>
  );
}
