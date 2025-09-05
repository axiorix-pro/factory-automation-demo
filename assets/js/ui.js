// État courant (manuel, semi-auto, automated)
let currentState = 'manual';

// Métriques initiales
const metrics = {
    productionRate: 12,
    efficiency: 45,
    errorRate: 28,
    costPerUnit: 4.20,
    produced: 0
};

// Configurations des états (pour les métriques)
const stateMetrics = {
    manual: {
        efficiency: 45,
        errorRate: 28,
        costPerUnit: 4.20,
        status: "🔴 MODE MANUEL ACTIF - Productivité limitée"
    },
    'semi-auto': {
        efficiency: 78,
        errorRate: 8,
        costPerUnit: 2.80,
        status: "🟡 SEMI-AUTO ACTIF - Assistance IA en cours"
    },
    automated: {
        efficiency: 94,
        errorRate: 1,
        costPerUnit: 1.20,
        status: "🟢 FULL AUTO ACTIF - IA Optimisée x10"
    }
};

/**
 * Met à jour les métriques à l'écran
 */
function updateMetrics() {
    const config = stateMetrics[currentState];

    // Efficacité
    document.getElementById('efficiency').textContent = `${config.efficiency}%`;
    utils.updateTrend(
        document.getElementById('efficiency-trend'),
        metrics.efficiency,
        config.efficiency
    );
    metrics.efficiency = config.efficiency;

    // Erreurs/h
    document.getElementById('error-rate').textContent = config.errorRate;
    utils.updateTrend(
        document.getElementById('error-trend'),
        metrics.errorRate,
        config.errorRate
    );
    metrics.errorRate = config.errorRate;

    // Coût/unité
    document.getElementById('cost-per-unit').textContent = utils.formatCurrency(config.costPerUnit);
    utils.updateTrend(
        document.getElementById('cost-trend'),
        metrics.costPerUnit,
        config.costPerUnit
    );
    metrics.costPerUnit = config.costPerUnit;

    // Statut
    document.getElementById('status-text').textContent = config.status;
    document.getElementById('status-text').className =
        `status-text status-${currentState === 'semi-auto' ? 'semi' : currentState}`;
}

/**
 * Passe à un nouvel état (manuel/semi-auto/automated)
 * @param {string} newState
 */
function transitionToState(newState) {
    if (currentState === newState) return;

    currentState = newState;
    updateMetrics();

    // Mise à jour des boutons
    document.querySelectorAll('.control-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.state === newState);
        btn.setAttribute('aria-pressed', btn.dataset.state === newState);
    });

    // Re-crée les robots avec la nouvelle config
    factory.createRobots(newState);
}

/**
 * Initialise les écouteurs d'événements
 */
function setupEventListeners() {
    // Boutons de contrôle
    document.querySelectorAll('.control-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            transitionToState(btn.dataset.state);
        });
    });

    // Touches clavier (1/2/3)
    document.addEventListener('keydown', (e) => {
        if (e.key === '1') transitionToState('manual');
        if (e.key === '2') transitionToState('semi-auto');
        if (e.key === '3') transitionToState('automated');
    });

    // Visibilité de l'onglet
    document.addEventListener('visibilitychange', () => {
        isVisible = !document.hidden;
        if (isVisible) factory.animate();
    });
}

/**
 * Met à jour la production/min aléatoirement
 */
function startProductionUpdates() {
    setInterval(() => {
        const config = stateConfigs[currentState];
        const baseRate = config.productionSpeed * 20;
        const variation = (Math.random() - 0.5) * 4;
        const newRate = Math.max(1, Math.round(baseRate + variation));

        document.getElementById('production-rate').textContent = newRate;
        metrics.productionRate = newRate;

        // Crée un nouveau produit aléatoirement
        if (Math.random() < config.productionSpeed / 10) {
            factory.createProduct(-10, Math.random() * 2);
        }
    }, 1500);
}

// Exporte les fonctions et variables pour main.js
window.ui = {
    currentState,
    transitionToState,
    setupEventListeners,
    startProductionUpdates,
    updateMetrics
};
