// Initialisation quand la page est chargée
document.addEventListener('DOMContentLoaded', () => {
    // Initialise Three.js
    const threeJS = factory.initThreeJS();
    if (!threeJS) return; // WebGL non disponible

    // Initialise l'UI
    ui.setupEventListeners();
    ui.startProductionUpdates();

    // Crée les robots initiaux
    factory.createRobots(ui.currentState);

    // Démarre l'animation
    factory.animate();

    // Gère le redimensionnement
    window.addEventListener('resize', factory.onWindowResize);

    // Nettoyage au déchargement
    window.addEventListener('beforeunload', factory.cleanup);

    // Démo automatique (optionnel)
    setTimeout(() => {
        ui.transitionToState('semi-auto');
        setTimeout(() => {
            ui.transitionToState('automated');
            setTimeout(() => {
                document.querySelector('[data-state="automated"]').classList.add('glowing');
            }, 2000);
        }, 3000);
    }, 1000);
});
