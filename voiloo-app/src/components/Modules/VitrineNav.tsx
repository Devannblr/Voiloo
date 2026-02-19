export default function VitrineNav({ items, isOwner, primary, textColor, onSelect }: any) {
    if (!items.length) return null;
    return (
        <nav className="sticky z-40 border-b border-gray-100 bg-white/80 backdrop-blur-md"
             style={{ top: isOwner ? '48px' : '0' }}>
            <div className="max-w-3xl mx-auto px-6 flex items-center gap-1 overflow-x-auto">
                {items.map((item: any) => (
                    <button key={item.id} onClick={() => onSelect(item.id)}
                            className="px-4 py-3 text-sm font-semibold whitespace-nowrap transition-colors opacity-60 hover:opacity-100"
                            style={{ color: textColor }}>
                        {item.label}
                    </button>
                ))}
            </div>
            <div className="h-0.5" style={{ backgroundColor: primary, opacity: 0.3 }} />
        </nav>
    );
}