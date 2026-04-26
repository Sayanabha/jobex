export function HeroOrb() {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[420px] animate-float">
      <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(0,255,194,0.8),rgba(0,255,194,0.1)_34%,transparent_60%)] blur-3xl" />
      <div className="absolute inset-12 rounded-full border border-white/10 bg-white/5 shadow-glow" />
      <div className="absolute inset-20 rounded-full bg-[radial-gradient(circle_at_center,rgba(255,149,77,0.8),rgba(255,149,77,0.08)_36%,transparent_62%)] blur-2xl" />
      <div className="absolute inset-24 rounded-full border border-white/10 bg-background/70" />
      <div className="absolute inset-0 grid-lines rounded-full opacity-30" />
    </div>
  );
}
