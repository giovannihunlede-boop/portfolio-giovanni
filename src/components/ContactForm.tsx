import React, { useState } from 'react'

const ContactForm: React.FC = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [statusMessage, setStatusMessage] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const subject = encodeURIComponent(`Contact portfolio - ${name}`)
    const body = encodeURIComponent(`Nom : ${name}\nEmail : ${email}\n\n${message}`)
    window.location.href = `mailto:giovannihunlede@gmail.com?subject=${subject}&body=${body}`
    setStatus('success')
    setStatusMessage('Votre messagerie va s’ouvrir pour finaliser l’envoi.')
  }

  return (
    <section id="contact" className="section contact">
      <h2>Discutons de votre projet</h2>

      <div className="contact-container">
        {/* Bloc Informations (Gauche) */}
        <div className="contact-info">
          <h3>Contactez-moi</h3>
          <p>
            Vous avez une idée en tête, un projet à développer ou besoin d&apos;un développeur pour renforcer votre équipe ? 
            N&apos;hésitez pas à m&apos;envoyer un message. Je vous répondrai dans les plus brefs délais.
          </p>

          <div className="info-item">
            <span className="icon">✉</span>
            <div className="info-text">
              <h4>Email</h4>
              <a href="mailto:giovannihunlede@gmail.com">giovannihunlede@gmail.com</a>
            </div>
          </div>

          <div className="info-item">
            <span className="icon">↗</span>
            <div className="info-text">
              <h4>WhatsApp</h4>
              <a href="https://wa.me/22899256495" target="_blank" rel="noreferrer">+228 99 25 64 95</a>
            </div>
          </div>
        </div>

        {/* Formulaire (Droite) */}
        <form className="contact-form" onSubmit={handleSubmit}>
          {status !== 'idle' && (
            <div className={`form-status form-status-${status}`}>
              {statusMessage}
            </div>
          )}

          <div className="input-group">
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder=" "
            />
            <label htmlFor="name">Votre Nom</label>
          </div>

          <div className="input-group">
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder=" "
            />
            <label htmlFor="email">Votre Email</label>
          </div>

          <div className="input-group">
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={5}
              required
              placeholder=" "
            ></textarea>
            <label htmlFor="message">Votre Message</label>
          </div>

          <button type="submit" className="btn-submit">
            Ouvrir ma messagerie <span>→</span>
          </button>
        </form>
      </div>
    </section>
  )
}

export default ContactForm