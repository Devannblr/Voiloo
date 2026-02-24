import { Star } from "lucide-react";
import { SectionTitle } from "./SectionTitle";
import { ServiceItem } from "../types";

export default function SectionServices({ services, primary }: { services: ServiceItem[]; primary: string }) {
    return (
        <section id="services" className="scroll-mt-20">
            <SectionTitle icon={<Star size={18} />} label="Services" primary={primary} />
            <div className="mt-4 grid sm:grid-cols-2 gap-4">
                {services.map((s, i) => {
                    const name = s?.name || s?.titre || '';
                    const price = s?.price || s?.prix || '';
                    return (
                        <div key={i} className="p-5 rounded-2xl border-2" style={{ borderColor: `${primary}40` }}>
                            <div className="flex items-start justify-between gap-2">
                                <p className="font-bold">{name}</p>
                                {price && <span className="text-sm font-black" style={{ color: primary }}>{price}</span>}
                            </div>
                            {s?.description && <p className="text-sm opacity-60 mt-1">{s.description}</p>}
                        </div>
                    );
                })}
            </div>
        </section>
    );
}