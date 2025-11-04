import React, { useState, useEffect } from 'react';
import '../../styles/components/AccessibilitWidget.css';

const AccessibilityWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [settings, setSettings] = useState({
    fontSize: 'normal',
    contrast: 'normal',
    colorblind: false,
    animations: true,
    focus: false,
    // NOUVEAU : Mode pour sourds
    visualNotifications: false
  });

  // Appliquer les paramètres au DOM
  useEffect(() => {
    const root = document.documentElement;
    
    // Taille de police
    root.classList.remove('font-small', 'font-large', 'font-xlarge');
    if (settings.fontSize !== 'normal') {
      root.classList.add(`font-${settings.fontSize}`);
    }

    // Contraste
    root.classList.remove('high-contrast', 'dark-mode');
    if (settings.contrast !== 'normal') {
      root.classList.add(settings.contrast);
    }

    // Daltonisme
    root.classList.toggle('colorblind-mode', settings.colorblind);

    // Animations
    root.classList.toggle('reduced-motion', !settings.animations);

    // Focus visible
    root.classList.toggle('enhanced-focus', settings.focus);

    // NOUVEAU : Notifications visuelles (pour sourds)
    root.classList.toggle('visual-notifications', settings.visualNotifications);

  }, [settings]);

  const toggleWidget = () => {
    setIsOpen(!isOpen);
  };

  const updateSetting = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const resetSettings = () => {
    setSettings({
      fontSize: 'normal',
      contrast: 'normal',
      colorblind: false,
      animations: true,
      focus: false,
      visualNotifications: false
    });
  };

  return (
    <div className="accessibility-widget">
      <button
        className="accessibility-toggle"
        onClick={toggleWidget}
        aria-label="Options d'accessibilité"
        title="Options d'accessibilité"
      >
        <i className="fas fa-universal-access"></i>
      </button>

      {isOpen && (
        <div className="accessibility-panel">
          <div className="panel-header">
            <h3>♿ Accessibilité</h3>
            <button
              className="panel-close"
              onClick={toggleWidget}
              aria-label="Fermer le panel"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>

          <div className="panel-content">
            {/* Taille de police */}
            <div className="setting-group">
              <label className="setting-label">
                <i className="fas fa-font"></i> Taille du texte
              </label>
              <div className="setting-buttons">
                <button
                  className={settings.fontSize === 'small' ? 'active' : ''}
                  onClick={() => updateSetting('fontSize', 'small')}
                  aria-label="Petite taille de texte"
                >
                  <i className="fas fa-font" style={{fontSize: '12px'}}></i> A
                </button>
                <button
                  className={settings.fontSize === 'normal' ? 'active' : ''}
                  onClick={() => updateSetting('fontSize', 'normal')}
                  aria-label="Taille normale"
                >
                  <i className="fas fa-font" style={{fontSize: '14px'}}></i> A
                </button>
                <button
                  className={settings.fontSize === 'large' ? 'active' : ''}
                  onClick={() => updateSetting('fontSize', 'large')}
                  aria-label="Grande taille de texte"
                >
                  <i className="fas fa-font" style={{fontSize: '16px'}}></i> A
                </button>
                <button
                  className={settings.fontSize === 'xlarge' ? 'active' : ''}
                  onClick={() => updateSetting('fontSize', 'xlarge')}
                  aria-label="Très grande taille de texte"
                >
                  <i className="fas fa-font" style={{fontSize: '18px'}}></i> A
                </button>
              </div>
            </div>

            {/* Contraste */}
            <div className="setting-group">
              <label className="setting-label">
                <i className="fas fa-adjust"></i> Contraste
              </label>
              <div className="setting-buttons">
                <button
                  className={settings.contrast === 'normal' ? 'active' : ''}
                  onClick={() => updateSetting('contrast', 'normal')}
                  aria-label="Contraste normal"
                >
                  <i className="fas fa-circle" style={{color: '#666'}}></i> Normal
                </button>
                <button
                  className={settings.contrast === 'high-contrast' ? 'active' : ''}
                  onClick={() => updateSetting('contrast', 'high-contrast')}
                  aria-label="Contraste élevé"
                >
                  <i className="fas fa-circle" style={{color: '#000'}}></i> Élevé
                </button>
                <button
                  className={settings.contrast === 'dark-mode' ? 'active' : ''}
                  onClick={() => updateSetting('contrast', 'dark-mode')}
                  aria-label="Mode sombre"
                >
                  <i className="fas fa-moon"></i> Sombre
                </button>
              </div>
            </div>

            {/* Options à basculer */}
            <div className="setting-group">
              {/* Pour malvoyants */}
              <div className="toggle-setting">
                <label>
                  <input
                    type="checkbox"
                    checked={settings.colorblind}
                    onChange={(e) => updateSetting('colorblind', e.target.checked)}
                    aria-label="Activer le mode daltonisme"
                  />
                  <span className="toggle-label">
                    <i className="fas fa-eye"></i> Mode daltonisme
                    <small>Pour malvoyants des couleurs</small>
                  </span>
                </label>
              </div>

              {/* Pour sourds - NOUVEAU */}
              <div className="toggle-setting deaf-mode">
                <label>
                  <input
                    type="checkbox"
                    checked={settings.visualNotifications}
                    onChange={(e) => updateSetting('visualNotifications', e.target.checked)}
                    aria-label="Activer les notifications visuelles"
                  />
                  <span className="toggle-label">
                    <i className="fas fa-deaf"></i> Mode sourds
                    <small>Notifications visuelles au lieu de sons</small>
                  </span>
                </label>
              </div>

              {/* Réduire animations */}
              <div className="toggle-setting">
                <label>
                  <input
                    type="checkbox"
                    checked={!settings.animations}
                    onChange={(e) => updateSetting('animations', !e.target.checked)}
                    aria-label="Réduire les animations"
                  />
                  <span className="toggle-label">
                    <i className="fas fa-pause"></i> Réduire les animations
                    <small>Pour sensibilité au mouvement</small>
                  </span>
                </label>
              </div>

              {/* Focus renforcé */}
              <div className="toggle-setting">
                <label>
                  <input
                    type="checkbox"
                    checked={settings.focus}
                    onChange={(e) => updateSetting('focus', e.target.checked)}
                    aria-label="Activer le focus renforcé"
                  />
                  <span className="toggle-label">
                    <i className="fas fa-crosshairs"></i> Focus renforcé
                    <small>Navigation clavier facilitée</small>
                  </span>
                </label>
              </div>
            </div>

            {/* Info accessibilité */}
            <div className="accessibility-info">
              <p>
                <i className="fas fa-info-circle"></i>
                Ces options améliorent l'accessibilité pour tous les utilisateurs
              </p>
            </div>

            {/* Bouton reset */}
            <div className="setting-group">
              <button 
                className="reset-button" 
                onClick={resetSettings}
                aria-label="Réinitialiser tous les paramètres"
              >
                <i className="fas fa-undo"></i> Réinitialiser
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccessibilityWidget;