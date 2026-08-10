import s from './BottomSheet.module.css'

export default function BottomSheet({ title, options, onClose }) {
  return (
    <div className={s.overlay} onClick={onClose}>
      <div className={s.sheet} onClick={e => e.stopPropagation()}>
        <div className={s.handle} />
        {title && <p className={s.title}>{title}</p>}
        {options.map((opt, i) => (
          <button key={i} className={s.option} onClick={() => { opt.action(); onClose(); }}>
            <span className={s.optionIcon}>{opt.icon}</span>
            {opt.label}
          </button>
        ))}
        <button className={s.cancel} onClick={onClose}>Cancel</button>
      </div>
    </div>
  )
}
