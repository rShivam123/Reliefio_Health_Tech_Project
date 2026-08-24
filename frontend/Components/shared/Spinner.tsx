export default function Spinner({ className = "w-5 h-5" }: { className?: string }) {
  return <span className={`inline-block ${className} border-2 border-white/60 border-t-transparent rounded-full animate-spin`} />;
}
