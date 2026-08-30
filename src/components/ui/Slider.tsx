interface SliderProps {
  value: number;
  min: number;
  max: number;
  step?: number;
  color: string;
  onChange: (value: number) => void;
}

export function Slider({ value, min, max, step = 1, color, onChange }: SliderProps) {
  const pct = ((value - min) / (max - min)) * 100;

  return (
    <div className="relative flex items-center">
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="slider-input relative z-10 h-1.5 w-full cursor-pointer appearance-none rounded-full bg-transparent"
        style={{
          background: `linear-gradient(to right, ${color} 0%, ${color} ${pct}%, #334155 ${pct}%, #334155 100%)`,
        }}
      />
      <span
        className="pointer-events-none absolute -top-1.5 h-4 w-4 rounded-full border-2 border-slate-900 shadow-md transition-all"
        style={{
          left: `calc(${pct}% - 8px)`,
          backgroundColor: color,
        }}
      />
    </div>
  );
}
