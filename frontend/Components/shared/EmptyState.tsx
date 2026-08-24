interface EmptyStateProps {
  title: string;
  message?: string;
  icon?: string;
  action?: React.ReactNode;
}

export default function EmptyState({ title, message, icon = "🔍", action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16 px-6 bg-white rounded-2xl border border-dashed border-gray-200">
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      {message && <p className="mt-2 text-gray-500 max-w-sm">{message}</p>}
      {action && <div className="mt-6">{action}</div>}
    </div>
  );
}
