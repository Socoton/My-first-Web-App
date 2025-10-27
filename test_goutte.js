// Récupération du contexte du canvas
const canvas = document.getElementById('waterDropCanvas');
const ctx = canvas.getContext('2d');

// Paramètres de la goutte
let drop = {
    x: canvas.width / 2,     // Position X initiale (milieu)
    y: canvas.height / 2,    // Position Y initiale (milieu)
    radius: 30,              // Rayon de base
    maxRadius: 40,           // Rayon maximal
    minRadius: 20,           // Rayon minimal
    speedY: 0.5,             // Vitesse de déplacement vertical (lent)
    pulsingDirection: 1,     // 1 pour grandir, -1 pour rétrécir
    alpha: 0.8               // Transparence de base (opacité)
};

/**
 * Fonction pour dessiner la goutte d'eau
 * @param {CanvasRenderingContext2D} context - Contexte de dessin du canvas
 * @param {object} d - Objet contenant les propriétés de la goutte (x, y, radius, alpha)
 */
function drawDrop(context, d) {
    context.beginPath();

    // 1. Créer un gradient radial pour l'effet de transparence et de lumière
    // Ce gradient simule la lumière (centre plus clair) et le volume (bords plus sombres/opaques)
    const gradient = context.createRadialGradient(
        d.x - d.radius * 0.3, // Décalage léger du centre pour simuler la lumière
        d.y - d.radius * 0.3,
        d.radius * 0.1,       // Rayon de départ très petit
        d.x, d.y,
        d.radius              // Rayon d'arrivée
    );

    // Couleur de l'eau (Bleu très clair, presque blanc au centre, plus opaque aux bords)
    const baseColor = 'rgba(100, 150, 255, 0.0)'; // Centre : très transparent
    const edgeColor = `rgba(50, 100, 200, ${d.alpha})`; // Bord : plus opaque/coloré

    // Les arrêts de couleur définissent la transition
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.6)'); // Point de lumière
    gradient.addColorStop(0.3, baseColor);
    gradient.addColorStop(0.8, edgeColor);
    gradient.addColorStop(1, `rgba(50, 100, 200, ${d.alpha * 0.5})`); // Bord extérieur, moins opaque

    // 2. Appliquer le gradient
    context.fillStyle = gradient;
    
    // 3. Dessiner le cercle/goutte
    context.arc(d.x, d.y, d.radius, 0, Math.PI * 2, false);
    context.fill();

    // 4. (Optionnel) Ajouter un petit reflet blanc pour un effet mouillé
    context.fillStyle = `rgba(255, 255, 255, ${d.alpha * 0.9})`; // Réflexion blanche
    context.beginPath();
    context.arc(d.x - d.radius * 0.5, d.y - d.radius * 0.5, d.radius * 0.1, 0, Math.PI * 2, false);
    context.fill();
    
    context.closePath();
}

/**
 * Fonction de mise à jour de l'état de la goutte
 */
function update() {
    // 1. Mouvement vertical (simple oscillation)
    drop.y += drop.speedY;

    // Inverser la direction si elle atteint les bords
    if (drop.y + drop.radius > canvas.height || drop.y - drop.radius < 0) {
        drop.speedY *= -1;
    }

    // 2. Effet de pulsation (changement de rayon pour simuler une déformation/vibration)
    drop.radius += drop.pulsingDirection * 0.15;

    // Inverser la direction de pulsation
    if (drop.radius > drop.maxRadius) {
        drop.pulsingDirection = -1;
    } else if (drop.radius < drop.minRadius) {
        drop.pulsingDirection = 1;
    }
    
    // 3. Lier la transparence au rayon (la plus petite est la plus transparente)
    // Cela accentue l'effet de "goutte" qui s'écrase et devient plus opaque.
    drop.alpha = 0.6 + 0.4 * ((drop.radius - drop.minRadius) / (drop.maxRadius - drop.minRadius));
}

/**
 * Boucle principale de l'animation
 */
function animate() {
    // Effacer le canvas à chaque frame pour l'animation
    // Utiliser une légère transparence pour un effet de "traînée" subtile (motion blur)
    ctx.fillStyle = 'rgba(224, 224, 255, 0.1)'; 
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    update();
    drawDrop(ctx, drop);

    // Demander la prochaine frame d'animation
    requestAnimationFrame(animate);
}

// Lancer l'animation
animate();