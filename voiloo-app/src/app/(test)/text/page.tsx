import { H1, H2, P, TextAccent, Price } from "@/components/Base/Typography";


export default function TestTextPage() {
    return (
        <div className="min-h-screen bg-light p-10 space-y-10">
            <div className="bg-dark p-10 rounded-2xl">
                <H1>
                    Tout ce dont vous avez besoin est près de <TextAccent>chez vous !</TextAccent>
                </H1>
                <P className="mt-4">
                    Ceci est un test du texte sur fond sombre, comme dans ta maquette.
                </P>
            </div>

            <div className="p-10 border border-beige rounded-2xl">
                <H2>Commencez à chercher par là.</H2>
                <div className="mt-6 flex items-center gap-4">
                    <P className="text-dark">Exemple de prix :</P>
                    <Price>15-20€/h</Price>
                </div>
            </div>
        </div>
    );
}