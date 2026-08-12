import { Vote, ShieldCheck } from "lucide-react";

function App() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-2xl p-8 text-center shadow-xl">
        <img
          src="/logo-ulc.png"
          alt="Logo ULC ICAM"
          className="h-20 mx-auto mb-6 object-contain"
        />
        <div className="flex items-center justify-center gap-3 mb-4">
          <Vote className="w-8 h-8 text-blue-500" />
          <h1 className="text-3xl font-bold text-white">Projet VOTE</h1>
        </div>
        <p className="text-slate-400">
          React + Vite + Tailwind CSS + Lucide Icons : environnement
          opérationnel.
        </p>
        <div className="mt-6 flex items-center justify-center gap-2 text-emerald-400 text-sm">
          <ShieldCheck className="w-4 h-4" />
          <span>Pret pour la suite du projet</span>
        </div>
      </div>
    </div>
  );
}

export default App;
