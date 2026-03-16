interface BlurWrapperProps {
  bgColor: string
  children: React.ReactNode
}

export default function BlurWrapper({ bgColor, children }: BlurWrapperProps) {
  return (
    <div className="relative">
      <div className="select-none" style={{ filter: 'blur(4px)', pointerEvents: 'none' }}>
        {children}
      </div>
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: `linear-gradient(to bottom, transparent, ${bgColor})` }}
      />
    </div>
  )
}
