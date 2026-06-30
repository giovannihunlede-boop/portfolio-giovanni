import React, { useState } from 'react'

const ContactForm: React.FC = () => {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [statusMessage, setStatusMessage] = useState('')

  // Replace with your actual Formspree ID
  const FORMSPREE_ID = 'f/YOUR_FORMSPREE_ID' // You need to update this

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setStatus('idle')

    try {
      const response = await fetch(`https://formspree.io/${FORMSPREE_ID}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          email,
          message,
        }),
      })

      if (response.ok) {
        setStatus('success')
        setStatusMessage('✅ Message envoyé avec succès! Merci de nous avoir contacté.')
        setName('')
        setEmail('')
        setMessage('')
      } else {
        setStatus('error')
        setStatusMessage('❌ Erreur lors de l\'envoi du message. Veuillez réessayer.')
      }
    } catch (error) {
      setStatus('error')
      setStatusMessage('❌ Erreur de connexion. Veuillez vérifier votre connexion Internet.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <section id="contact" className="section contact">
      <h2>Discutons de votre projet</h2>

      <div className="contact-container">
        {/* Bloc Informations (Gauche) */}
        <div className="contact-info">
          <h3>Contactez-moi</h3>
          <p>
            Vous avez une idée en tête ou besoin d&apos;un développeur pour votre équipe ? N&apos;hésitez pas à
            m&apos;envoyer un message.
          </p>

          <div className="info-item">
            <span className="icon">📧</span>
            <div className="info-text">
              <h4>Email</h4>
              <p>giovannihunlede@gmail.com</p>
            </div>
          </div>

          <div className="info-item">
            <span className="icon">📍</span>
            <div className="info-text">
              <h4>Localisation</h4>
              <p>Lomé TOGO</p>
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

          <button type="submit" className="btn-submit" disabled={loading}>
            {loading ? 'Envoi en cours...' : 'Envoyer le message'} <span>🚀</span>
          </button>
        </form>
      </div>
    </section>
  )
}

export default ContactForm
