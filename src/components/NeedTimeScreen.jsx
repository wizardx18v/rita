import { siteConfig } from '../data/siteConfig'

// Respectful response when she chooses "I need some time."
export default function NeedTimeScreen({ open }) {
  return (
    <div className={`thanks${open ? ' is-open' : ''}`} aria-hidden={!open} role="dialog" aria-modal="true" aria-label="Thank you">
      <div className="thanks__inner">
        <p>That&rsquo;s okay.</p>
        <p>You don&rsquo;t have to answer right now.</p>
        <p>Take whatever time you need.</p>
        <p>Thank you for reading all of this.</p>
        <p className="small">— {siteConfig.myName}</p>
      </div>
    </div>
  )
}
