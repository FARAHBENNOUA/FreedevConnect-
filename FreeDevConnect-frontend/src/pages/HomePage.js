import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { db } from '../api/firebase';

import {
  collection,
  getDocs,
  addDoc,
  query,
  orderBy,
  limit,
} from 'firebase/firestore';
import '../styles/pages/home.css';

const HomePage = () => {
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  
  // États pour les témoignages
  const [testimonials, setTestimonials] = useState([]);
  const [loadingTestimonials, setLoadingTestimonials] = useState(true);
  const [showTestimonialForm, setShowTestimonialForm] = useState(false);
  const [newTestimonial, setNewTestimonial] = useState({
    rating: 5,
    comment: '',
    name: '',
    role: ''
  });

  const slides = [
    'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=1920&h=1080&fit=crop&q=80',
    'https://images.unsplash.com/photo-1553877522-43269d4ea984?w=1920&h=1080&fit=crop&q=80',
    'https://images.unsplash.com/photo-1600880292203-757bb62b4baf?w=1920&h=1080&fit=crop&q=80',
    'https://images.unsplash.com/photo-1556761175-5973dc0f32e7?w=1920&h=1080&fit=crop&q=80'
  ];

  // Timer du slider
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [slides.length]);

  // Charger les témoignages au montage du composant
  useEffect(() => {
    fetchTestimonials();
  }, []);

  // Récupérer les témoignages depuis Firebase
  const fetchTestimonials = async () => {
    try {
      const q = query(
        collection(db, 'testimonials'),
        orderBy('createdAt', 'desc'),
        limit(6)
      );
      const querySnapshot = await getDocs(q);
      const testimonialsData = [];
      
      querySnapshot.forEach((doc) => {
        testimonialsData.push({
          id: doc.id,
          ...doc.data()
        });
      });
      
      setTestimonials(testimonialsData);
    } catch (error) {
      console.error('Erreur lors de la récupération des témoignages:', error);
    } finally {
      setLoadingTestimonials(false);
    }
  };

  // Soumettre un nouveau témoignage
  const handleSubmitTestimonial = async (e) => {
    e.preventDefault();
    
    if (!currentUser) {
      alert('Vous devez être connecté pour laisser un avis');
      return;
    }

    try {
      const testimonialData = {
        ...newTestimonial,
        userId: currentUser.uid,
        userEmail: currentUser.email,
        createdAt: new Date(),
        verified: true
      };

      await addDoc(collection(db, 'testimonials'), testimonialData);
      
      // Reset form
      setNewTestimonial({
        rating: 5,
        comment: '',
        name: '',
        role: ''
      });
      setShowTestimonialForm(false);
      
      // Recharger les témoignages
      fetchTestimonials();
      
      alert('Merci pour votre témoignage !');
    } catch (error) {
      console.error('Erreur lors de l\'ajout du témoignage:', error);
      alert('Erreur lors de l\'envoi du témoignage');
    }
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/projects?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const renderStars = (rating) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  return (
    <div className="home-page">
      {/* Hero avec Slider PLEINE LARGEUR - SANS BLEU */}
      <section className="hero-section-fullwidth">
        <div className="hero-slider-fullwidth">
          <div className="slider-container">
            {slides.map((slide, index) => (
              <div
                key={index}
                className={`slide ${index === currentSlide ? 'active' : ''}`}
                style={{ backgroundImage: `url(${slide})` }}
              />
            ))}
          </div>

          <button className="slider-btn prev" onClick={prevSlide}>
            ‹
          </button>
          <button className="slider-btn next" onClick={nextSlide}>
            ›
          </button>

          <div className="slider-dots">
            {slides.map((_, index) => (
              <span
                key={index}
                className={`dot ${index === currentSlide ? 'active' : ''}`}
                onClick={() => setCurrentSlide(index)}
              />
            ))}
          </div>

          {/* Contenu Hero par-dessus le slider - OVERLAY SANS BLEU */}
          <div className="hero-content-overlay">
            <div className="hero-content-inner">
              <h1>Trouvez le freelance parfait pour votre projet</h1>
              <p>Connectez-vous avec des freelances talentueux partout en France</p>

              <form onSubmit={handleSearch} className="hero-search">
                <input
                  type="text"
                  placeholder="Rechercher un projet, une compétence..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <button type="submit">Rechercher</button>
              </form>

              <div className="hero-buttons">
                {currentUser ? (
                  <>
                    {currentUser.role === 'client' && (
                      <Link to="/client/dashboard" className="btn btn-primary btn-large">
                        Mon Dashboard
                      </Link>
                    )}
                    {currentUser.role === 'freelance' && (
                      <Link to="/freelance/dashboard" className="btn btn-primary btn-large">
                        Mon Dashboard
                      </Link>
                    )}
                    <Link to="/projects" className="btn btn-secondary btn-large">
                      Voir les projets
                    </Link>
                  </>
                ) : (
                  <>
                    <Link to="/register" className="btn btn-primary btn-large">
                      Créer un compte
                    </Link>
                    <Link to="/login" className="btn btn-secondary btn-large">
                      Se connecter
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comment ça marche */}
      <section id="how-it-works" className="how-it-works">
        <div className="container">
          <h2>Comment ça marche ?</h2>
          <div className="steps-grid">
            <Link to="/register" className="step-card">
              <span className="step-number">1</span>
              <div className="step-image">
                <svg width="300" height="200" viewBox="0 0 300 200" style={{background: 'linear-gradient(135deg, #e3f2fd 0%, #f1f8e9 100%)'}}>
                  <circle cx="150" cy="80" r="25" fill="#4fc3f7" stroke="#0277bd" strokeWidth="2"/>
                  <circle cx="145" cy="75" r="3" fill="#fff"/>
                  <circle cx="155" cy="75" r="3" fill="#fff"/>
                  <path d="M 140 85 Q 150 90 160 85" stroke="#fff" strokeWidth="2" fill="none"/>
                  <rect x="135" y="105" width="30" height="40" rx="15" fill="#66bb6a"/>
                  <rect x="125" y="115" width="15" height="25" rx="7" fill="#66bb6a"/>
                  <rect x="160" y="115" width="15" height="25" rx="7" fill="#66bb6a"/>
                  <rect x="140" y="145" width="8" height="30" rx="4" fill="#4fc3f7"/>
                  <rect x="152" y="145" width="8" height="30" rx="4" fill="#4fc3f7"/>
                  <rect x="200" y="120" width="60" height="40" rx="5" fill="#f8bbd9" stroke="#e91e63" strokeWidth="2"/>
                  <rect x="205" y="125" width="50" height="25" rx="2" fill="#fff"/>
                  <circle cx="220" cy="137" r="2" fill="#4fc3f7"/>
                  <circle cx="240" cy="137" r="2" fill="#66bb6a"/>
                  <polygon points="80,40 82,46 88,46 83,50 85,56 80,52 75,56 77,50 72,46 78,46" fill="#ffb74d"/>
                  <polygon points="250,60 251,64 255,64 252,67 253,71 250,68 247,71 248,67 245,64 249,64" fill="#f8bbd9"/>
                </svg>
              </div>
              <div className="step-icon">
                <i className="fas fa-user-plus"></i>
              </div>
              <h3>Créez votre profil</h3>
              <p>Inscrivez-vous en tant que client ou freelance en quelques clics</p>
            </Link>

            <Link to="/projects" className="step-card">
              <span className="step-number">2</span>
              <div className="step-image">
                <svg width="300" height="200" viewBox="0 0 300 200" style={{background: 'linear-gradient(135deg, #f1f8e9 0%, #e1f5fe 100%)'}}>
                  <circle cx="100" cy="70" r="20" fill="#4fc3f7" stroke="#0277bd" strokeWidth="2"/>
                  <circle cx="96" cy="66" r="2" fill="#fff"/>
                  <circle cx="104" cy="66" r="2" fill="#fff"/>
                  <path d="M 92 75 Q 100 78 108 75" stroke="#fff" strokeWidth="2" fill="none"/>
                  <rect x="88" y="90" width="24" height="35" rx="12" fill="#66bb6a"/>
                  <rect x="82" y="98" width="12" height="20" rx="6" fill="#66bb6a"/>
                  <rect x="106" y="98" width="12" height="20" rx="6" fill="#66bb6a"/>
                  <rect x="92" y="125" width="6" height="25" rx="3" fill="#4fc3f7"/>
                  <rect x="102" y="125" width="6" height="25" rx="3" fill="#4fc3f7"/>
                  <rect x="140" y="60" width="120" height="80" rx="8" fill="#fff" stroke="#0277bd" strokeWidth="3"/>
                  <rect x="150" y="75" width="30" height="20" rx="3" fill="#f8bbd9"/>
                  <rect x="185" y="75" width="30" height="20" rx="3" fill="#66bb6a"/>
                  <rect x="220" y="75" width="30" height="20" rx="3" fill="#4fc3f7"/>
                  <rect x="150" y="105" width="30" height="20" rx="3" fill="#ffb74d"/>
                  <rect x="185" y="105" width="30" height="20" rx="3" fill="#f8bbd9"/>
                  <rect x="220" y="105" width="30" height="20" rx="3" fill="#81c784"/>
                  <circle cx="70" cy="50" r="15" fill="none" stroke="#e91e63" strokeWidth="3"/>
                  <line x1="81" y1="61" x2="90" y2="70" stroke="#e91e63" strokeWidth="3"/>
                  <polygon points="200,30 201,34 205,34 202,37 203,41 200,38 197,41 198,37 195,34 199,34" fill="#ffb74d"/>
                </svg>
              </div>
              <div className="step-icon">
                <i className="fas fa-search"></i>
              </div>
              <h3>Trouvez des missions</h3>
              <p>Parcourez les projets ou publiez le vôtre pour trouver le talent parfait</p>
            </Link>

            <Link to="/contact" className="step-card">
              <span className="step-number">3</span>
              <div className="step-image">
                <svg width="300" height="200" viewBox="0 0 300 200" style={{background: 'linear-gradient(135deg, #e1f5fe 0%, #fce4ec 100%)'}}>
                  <circle cx="110" cy="60" r="18" fill="#4fc3f7" stroke="#0277bd" strokeWidth="2"/>
                  <circle cx="106" cy="56" r="2" fill="#fff"/>
                  <circle cx="114" cy="56" r="2" fill="#fff"/>
                  <path d="M 102 65 Q 110 68 118 65" stroke="#fff" strokeWidth="2" fill="none"/>
                  <rect x="98" y="78" width="24" height="30" rx="12" fill="#66bb6a"/>
                  <rect x="92" y="86" width="12" height="18" rx="6" fill="#66bb6a"/>
                  <rect x="116" y="86" width="12" height="18" rx="6" fill="#66bb6a"/>
                  <circle cx="190" cy="60" r="18" fill="#f8bbd9" stroke="#e91e63" strokeWidth="2"/>
                  <circle cx="186" cy="56" r="2" fill="#fff"/>
                  <circle cx="194" cy="56" r="2" fill="#fff"/>
                  <path d="M 182 65 Q 190 68 198 65" stroke="#fff" strokeWidth="2" fill="none"/>
                  <rect x="178" y="78" width="24" height="30" rx="12" fill="#81c784"/>
                  <rect x="172" y="86" width="12" height="18" rx="6" fill="#81c784"/>
                  <rect x="196" y="86" width="12" height="18" rx="6" fill="#81c784"/>
                  <ellipse cx="150" cy="95" rx="12" ry="8" fill="#ffb74d" stroke="#f57c00" strokeWidth="2"/>
                  <ellipse cx="150" cy="95" rx="8" ry="5" fill="#fff"/>
                  <rect x="130" y="130" width="40" height="25" rx="3" fill="#fff" stroke="#0277bd" strokeWidth="2"/>
                  <rect x="135" y="135" width="10" height="6" rx="1" fill="#4fc3f7"/>
                  <rect x="148" y="135" width="10" height="6" rx="1" fill="#66bb6a"/>
                  <rect x="135" y="143" width="15" height="6" rx="1" fill="#f8bbd9"/>
                  <rect x="153" y="143" width="12" height="6" rx="1" fill="#ffb74d"/>
                  <path d="M 80 40 Q 75 35 70 40 Q 75 45 80 40 Q 85 35 90 40 Q 85 45 80 40" fill="#e91e63"/>
                  <path d="M 220 40 Q 215 35 210 40 Q 215 45 220 40 Q 225 35 230 40 Q 225 45 220 40" fill="#e91e63"/>
                  <polygon points="150,25 151,29 155,29 152,32 153,36 150,33 147,36 148,32 145,29 149,29" fill="#ffb74d"/>
                </svg>
              </div>
              <div className="step-icon">
                <i className="fas fa-handshake"></i>
              </div>
              <h3>Collaborez</h3>
              <p>Travaillez ensemble et menez votre projet à bien</p>
            </Link>
          </div>
        </div>
      </section>

      {/* Villes */}
      <section className="cities-section">
        <div className="container">
          <h2>Trouvez des freelances par ville</h2>
          <div className="cities-grid">
            <Link to="/freelances?city=Paris" className="city-card">
              <img src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=600&h=400&fit=crop" alt="Paysage urbain moderne" />
              <div className="city-info">
                <h3>Paris</h3>
                <p>250+ freelances</p>
              </div>
            </Link>

            <Link to="/freelances?city=Lyon" className="city-card">
              <img src="https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=600&h=400&fit=crop" alt="Vue urbaine moderne" />
              <div className="city-info">
                <h3>Lyon</h3>
                <p>180+ freelances</p>
              </div>
            </Link>

            <Link to="/freelances?city=Marseille" className="city-card">
              <img src="https://images.unsplash.com/photo-1692118450510-3c1d8e7d1ae8?fm=jpg&q=60&w=3000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" alt="Marseille - Notre-Dame de la Garde" />
              <div className="city-info">
                <h3>Marseille</h3>
                <p>150+ freelances</p>
              </div>
            </Link>

            <Link to="/freelances?city=Toulouse" className="city-card">
              <img src="https://images.unsplash.com/photo-1486325212027-8081e485255e?w=600&h=400&fit=crop" alt="Architecture urbaine" />
              <div className="city-info">
                <h3>Toulouse</h3>
                <p>120+ freelances</p>
              </div>
            </Link>

            <Link to="/freelances?city=Bordeaux" className="city-card">
              <img src="https://images.unsplash.com/photo-1514565131-fce0801e5785?w=600&h=400&fit=crop" alt="Centre-ville moderne" />
              <div className="city-info">
                <h3>Bordeaux</h3>
                <p>100+ freelances</p>
              </div>
            </Link>

            <Link to="/freelances?city=Nantes" className="city-card">
              <img src="https://images.unsplash.com/photo-1542359649-31e03cd4d909?w=600&h=400&fit=crop" alt="Quartier d'affaires" />
              <div className="city-info">
                <h3>Nantes</h3>
                <p>90+ freelances</p>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Freelancers populaires */}
      <section className="freelancers-section">
        <div className="container">
          <h2>Freelancers populaires</h2>
          <div className="freelancers-grid">
            <div className="freelancer-card">
              <img src="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face" alt="Farah Bennaou" />
              <h4>Farah Bennaou</h4>
              <p>Chef de Projet</p>
              <div className="rating">★★★★★</div>
              <Link to="/freelances" className="view-profile">Voir le profil</Link>
            </div>

            <div className="freelancer-card">
              <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face" alt="Mario Ivanovic" />
              <h4>Mario Ivanovic</h4>
              <p>Formateur Développeur Freelance</p>
              <div className="rating">★★★★★</div>
              <Link to="/freelances" className="view-profile">Voir le profil</Link>
            </div>

            <div className="freelancer-card">
              <img src="https://images.unsplash.com/photo-1531123897727-8f129e1688ce?w=150&h=150&fit=crop&crop=face" alt="Maïmounia Dia" />
              <h4>Maïmounia Dia</h4>
              <p>Architecte Logiciel</p>
              <div className="rating">★★★★☆</div>
              <Link to="/freelances" className="view-profile">Voir le profil</Link>
            </div>

            <div className="freelancer-card">
              <img src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face" alt="Yassine Hammou" />
              <h4>Yassine Hammou</h4>
              <p>Développeur DevOps</p>
              <div className="rating">★★★★★</div>
              <Link to="/freelances" className="view-profile">Voir le profil</Link>
            </div>
          </div>

          <div className="view-all-btn">
            <Link to="/freelances" className="btn btn-primary btn-large">
              Voir tous les freelances
            </Link>
          </div>
        </div>
      </section>

      {/* NOUVELLE SECTION TÉMOIGNAGES AVEC FIREBASE */}
      <section className="testimonials-section">
        <div className="container">
          <div className="testimonials-header">
            <h2>Ce que disent nos utilisateurs</h2>
            <p>Découvrez les expériences de notre communauté</p>
            
            {/* Bouton pour ajouter un avis - seulement si connecté */}
            {currentUser && (
              <button 
                className="btn btn-secondary"
                onClick={() => setShowTestimonialForm(!showTestimonialForm)}
              >
                {showTestimonialForm ? 'Annuler' : 'Laisser un avis'}
              </button>
            )}
          </div>

          {/* Formulaire d'ajout d'avis - seulement si connecté */}
          {showTestimonialForm && currentUser && (
            <div className="testimonial-form-container">
              <form onSubmit={handleSubmitTestimonial} className="testimonial-form">
                <h3>Partagez votre expérience</h3>
                
                <div className="form-group">
                  <label>Nom d'affichage</label>
                  <input
                    type="text"
                    value={newTestimonial.name}
                    onChange={(e) => setNewTestimonial({...newTestimonial, name: e.target.value})}
                    required
                    placeholder="Votre nom"
                  />
                </div>

                <div className="form-group">
                  <label>Votre rôle</label>
                  <input
                    type="text"
                    value={newTestimonial.role}
                    onChange={(e) => setNewTestimonial({...newTestimonial, role: e.target.value})}
                    required
                    placeholder="Ex: Développeur React, CEO Startup..."
                  />
                </div>

                <div className="form-group">
                  <label>Note</label>
                  <div className="rating-input">
                    {[1,2,3,4,5].map((star) => (
                      <span
                        key={star}
                        className={`star ${star <= newTestimonial.rating ? 'active' : ''}`}
                        onClick={() => setNewTestimonial({...newTestimonial, rating: star})}
                      >
                        ★
                      </span>
                    ))}
                  </div>
                </div>

                <div className="form-group">
                  <label>Votre commentaire</label>
                  <textarea
                    value={newTestimonial.comment}
                    onChange={(e) => setNewTestimonial({...newTestimonial, comment: e.target.value})}
                    required
                    placeholder="Partagez votre expérience avec FreeDevConnect..."
                    rows="4"
                  />
                </div>

                <button type="submit" className="btn btn-primary">
                  Publier mon avis
                </button>
              </form>
            </div>
          )}

          {/* Affichage des témoignages */}
          {loadingTestimonials ? (
            <div className="testimonials-loading">
              <div className="loading-spinner">
                <i className="fas fa-spinner fa-spin"></i>
                <p>Chargement des témoignages...</p>
              </div>
            </div>
          ) : (
            <div className="testimonials-grid">
              {testimonials.map((testimonial) => (
                <div key={testimonial.id} className="testimonial-card">
                  <div className="testimonial-header">
                    <div className="testimonial-info">
                      <h4>{testimonial.name}</h4>
                      <p className="testimonial-role">{testimonial.role}</p>
                    </div>
                    <div className="testimonial-rating">
                      <span className="stars">{renderStars(testimonial.rating)}</span>
                    </div>
                  </div>
                  <div className="testimonial-content">
                    <p>"{testimonial.comment}"</p>
                  </div>
                  {testimonial.verified && (
                    <div className="testimonial-verified">
                      <i className="fas fa-check-circle"></i>
                      <span>Utilisateur vérifié</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Message si pas de témoignages */}
          {!loadingTestimonials && testimonials.length === 0 && (
            <div className="no-testimonials">
              <div className="no-testimonials-icon">
                <i className="fas fa-comments"></i>
              </div>
              <h3>Aucun témoignage pour le moment</h3>
              {currentUser ? (
                <p>Soyez le premier à partager votre expérience !</p>
              ) : (
                <p>Connectez-vous pour partager votre expérience</p>
              )}
            </div>
          )}

          {/* Bouton voir tous les avis */}
          {testimonials.length >= 6 && (
            <div className="view-all-testimonials">
              <button className="btn btn-outline">
                Voir tous les avis ({testimonials.length}+)
              </button>
            </div>
          )}
        </div>
      </section>

      {/* Partenaires */}
      <section className="partners-section">
        <div className="container">
          <h2>Ils nous font confiance</h2>
          <div className="partners-grid">
            <a href="https://careers.google.com" target="_blank" rel="noopener noreferrer" className="partner-logo">
              <img src="https://logo.clearbit.com/google.com" alt="Google Careers" />
            </a>
            <a href="https://careers.microsoft.com" target="_blank" rel="noopener noreferrer" className="partner-logo">
              <img src="https://logo.clearbit.com/microsoft.com" alt="Microsoft Careers" />
            </a>
            <a href="https://amazon.jobs" target="_blank" rel="noopener noreferrer" className="partner-logo">
              <img src="https://logo.clearbit.com/amazon.com" alt="Amazon Jobs" />
            </a>
            <a href="https://careers.meta.com" target="_blank" rel="noopener noreferrer" className="partner-logo">
              <img src="https://logo.clearbit.com/meta.com" alt="Meta Careers" />
            </a>
            <a href="https://jobs.apple.com" target="_blank" rel="noopener noreferrer" className="partner-logo">
              <img src="https://logo.clearbit.com/apple.com" alt="Apple Jobs" />
            </a>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="cta-section">
        <div className="cta-parallax"></div>
        <div className="cta-overlay"></div>
        <div className="cta-content">
          <h2>Prêt à commencer ?</h2>
          <p>Rejoignez des milliers de freelances et clients satisfaits</p>
          <Link to="/register" className="btn btn-large btn-cta">
            Créer un compte gratuitement
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;