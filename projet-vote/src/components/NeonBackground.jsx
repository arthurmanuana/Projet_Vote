// Le fond neon : trois halos flous, rouge et or, qui flottent
// derriere l'interface. Purement decoratif, jamais cliquable.
export default function NeonBackground() {
  return (
    <div aria-hidden className="fixed inset-0 overflow-hidden pointer-events-none">
      <div className="absolute -top-24 -left-20 w-72 h-72 rounded-full bg-brand/25 blur-3xl" />
      <div className="absolute top-1/3 -right-24 w-64 h-64 rounded-full bg-gold/20 blur-3xl" />
      <div className="absolute -bottom-28 left-1/4 w-80 h-80 rounded-full bg-brand/15 blur-3xl" />
    </div>
  )
}