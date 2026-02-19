export function SectionTitle({ icon, label, primary }: { icon: React.ReactNode; label: string; primary: string }) {
    return (
        <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                 style={{ backgroundColor: `${primary}20`, color: primary }}>
                {icon}
            </div>
            <h2 className="text-xl font-black italic">{label}</h2>
            <div className="flex-1 h-px" style={{ backgroundColor: `${primary}20` }} />
        </div>
    );
}