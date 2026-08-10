import { useNavigate } from 'react-router-dom'
import BottomNav from '../components/BottomNav'
import s from './Home.module.css'

export default function Home() {
  const navigate = useNavigate()
  return (
    <>
      <div className={s.page}>
        <div className={s.bgLayer}>
          <img src="/home-background.svg" alt="" className={s.bgImg} />
        </div>
        <div className={s.content}>
          <img src="/logo.png" alt="A Minute for Mental Health" className={s.logo} />
          <p className={s.tagline}>You matter.<br />Your mind matters.<br />One minute can change everything.</p>
          <button className={s.resetBtn} onClick={() => navigate('/reset')}>Reset Now</button>
          <p className={s.moodLabel}>How are you feeling?</p>
          <div className={s.moodRow}>
            {['Okay', 'Anxious', 'Overwhelmed'].map(m => (
              <button key={m} className={s.moodBtn}>{m}</button>
            ))}
          </div>
        </div>
      </div>
      <BottomNav />
    </>
  )
}
