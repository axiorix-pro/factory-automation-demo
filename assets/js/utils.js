/**
 * Vérifie si WebGL est disponible
 * @returns {boolean}
 */
function isWebGLAvailable() {
    try {
        const canvas = document.createElement('canvas');
        return !!(window.WebGLRenderingContext && canvas.getContext('webgl'));
    } catch (e) {
        return false;
    }
}

/**
 * Nettoie les ressources Three.js pour éviter les fuites mémoire
 * @param {THREE.Scene} scene
 * @param {THREE.WebGLRenderer} renderer
 */
function cleanupThreeJS(scene, renderer) {
    if (!scene || !renderer) return;

    // Supprime tous les objets de la scène
    while(scene.children.length > 0) {
        const object = scene.children[0];
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
            if (Array.isArray(object.material)) {
                object.material.forEach(m => m.dispose());
            } else {
                object.material.dispose();
            }
        }
        scene.remove(object);
    }

    // Libère le renderer
    renderer.dispose();
    renderer.forceContextLoss();
    renderer.domElement = null;
}

/**
 * Formate une valeur monétaire
 * @param {number} value
 * @returns {string}
 */
function formatCurrency(value) {
    return `€${value.toFixed(2)}`;
}

/**
 * Met à jour une tendance (↑/↓)
 * @param {HTMLElement} element
 * @param {number} startValue
 * @param {number} targetValue
 */
function updateTrend(element, startValue, targetValue) {
    const change = targetValue - startValue;
    const percentChange = Math.round((change / startValue) * 100);
    const isPositive = change >= 0;

    element.textContent = isPositive
        ? `↑ +${percentChange}%`
        : `↓ ${Math.abs(percentChange)}%`;
    element.className = `metric-trend ${isPositive ? 'trend-up' : 'trend-down'}`;
}

// Exporte les fonctions pour les autres modules
window.utils = {
    isWebGLAvailable,
    cleanupThreeJS,
    formatCurrency,
    updateTrend
};
