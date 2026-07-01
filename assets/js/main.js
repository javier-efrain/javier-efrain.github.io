// ================================================================
//  MAPA INTERACTIVO (Canvas)
// ================================================================
document.addEventListener('DOMContentLoaded', function() {
    const canvas = document.getElementById('mapCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const W = 1600, H = 1000;

    const coords = {
        israel:  { x: 850, y: 520 },
        jope:    { x: 780, y: 500 },
        ninive:  { x: 1250, y: 280 },
        tarsis:  { x: 120, y: 490 }
    };

    function drawMap() {
        ctx.clearRect(0, 0, W, H);
        ctx.fillStyle = '#0e1625';
        ctx.fillRect(0, 0, W, H);

        // Rutas
        ctx.save();
        ctx.shadowColor = 'rgba(232, 184, 75, 0.3)';
        ctx.shadowBlur = 20;
        ctx.beginPath();
        ctx.moveTo(coords.israel.x, coords.israel.y);
        ctx.quadraticCurveTo(800, 500, coords.jope.x, coords.jope.y);
        ctx.quadraticCurveTo(1050, 380, coords.ninive.x, coords.ninive.y);
        ctx.strokeStyle = '#e8b84b';
        ctx.lineWidth = 5;
        ctx.stroke();
        ctx.restore();

        ctx.save();
        ctx.shadowColor = 'rgba(214, 79, 79, 0.25)';
        ctx.shadowBlur = 18;
        ctx.beginPath();
        ctx.moveTo(coords.israel.x, coords.israel.y);
        ctx.quadraticCurveTo(600, 550, coords.jope.x, coords.jope.y);
        ctx.quadraticCurveTo(350, 550, coords.tarsis.x, coords.tarsis.y);
        ctx.strokeStyle = '#d64f4f';
        ctx.lineWidth = 4;
        ctx.setLineDash([18, 16]);
        ctx.stroke();
        ctx.restore();

        // Puntos
        function drawCity(x, y, color, label) {
            ctx.save();
            ctx.shadowBlur = 20;
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(x, y, 18, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#fff';
            ctx.beginPath();
            ctx.arc(x, y, 8, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = color;
            ctx.beginPath();
            ctx.arc(x, y, 5, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
            ctx.save();
            ctx.shadowColor = 'rgba(0,0,0,0.9)';
            ctx.shadowBlur = 12;
            ctx.fillStyle = '#f0e8d8';
            ctx.font = 'bold 22px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'bottom';
            ctx.fillText(label, x, y - 28);
            ctx.restore();
        }

        drawCity(coords.israel.x, coords.israel.y, '#4caf7a', 'Israel');
        drawCity(coords.jope.x, coords.jope.y, '#4d8fc5', 'Jope');
        drawCity(coords.ninive.x, coords.ninive.y, '#e8b84b', 'Nínive');
        drawCity(coords.tarsis.x, coords.tarsis.y, '#d64f4f', 'Tarsis');

        // Etiquetas de ruta
        function drawLabel(x, y, text, color) {
            ctx.save();
            ctx.shadowColor = 'rgba(0,0,0,0.8)';
            ctx.shadowBlur = 10;
            ctx.font = 'bold 20px sans-serif';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'bottom';
            const metrics = ctx.measureText(text);
            const w = metrics.width + 24, h = 40;
            ctx.fillStyle = 'rgba(10, 15, 25, 0.75)';
            ctx.shadowBlur = 0;
            ctx.beginPath();
            ctx.roundRect((x - w/2), (y - 10 - h + 6), w, h, 10);
            ctx.fill();
            ctx.shadowBlur = 8;
            ctx.fillStyle = color;
            ctx.fillText(text, x, y + 2);
            ctx.restore();
        }
        drawLabel((coords.jope.x + coords.ninive.x)/2 + 40, (coords.jope.y + coords.ninive.y)/2 - 120, 'Ruta de Dios', '#e8b84b');
        drawLabel((coords.jope.x + coords.tarsis.x)/2 - 60, (coords.jope.y + coords.tarsis.y)/2 - 100, 'Huida de Jonás', '#d64f4f');
    }

    if (typeof CanvasRenderingContext2D.prototype.roundRect === 'undefined') {
        CanvasRenderingContext2D.prototype.roundRect = function(x, y, w, h, r) {
            if (r > w/2) r = w/2;
            if (r > h/2) r = h/2;
            this.moveTo(x + r, y);
            this.arcTo(x + w, y, x + w, y + h, r);
            this.arcTo(x + w, y + h, x, y + h, r);
            this.arcTo(x, y + h, x, y, r);
            this.arcTo(x, y, x + w, y, r);
            return this;
        };
    }

    drawMap();

    canvas.addEventListener('click', function(e) {
        const rect = canvas.getBoundingClientRect();
        const scaleX = W / rect.width;
        const scaleY = H / rect.height;
        const mx = (e.clientX - rect.left) * scaleX;
        const my = (e.clientY - rect.top) * scaleY;
        const puntos = [
            { ...coords.israel, nombre: 'Israel', color: '#4caf7a' },
            { ...coords.jope, nombre: 'Jope', color: '#4d8fc5' },
            { ...coords.ninive, nombre: 'Nínive', color: '#e8b84b' },
            { ...coords.tarsis, nombre: 'Tarsis', color: '#d64f4f' }
        ];
        for (const p of puntos) {
            if (Math.hypot(mx - p.x, my - p.y) < 35) {
                alert(`📍 ${p.nombre}`);
                return;
            }
        }
    });

    canvas.addEventListener('mousemove', function(e) {
        const rect = canvas.getBoundingClientRect();
        const scaleX = W / rect.width;
        const scaleY = H / rect.height;
        const mx = (e.clientX - rect.left) * scaleX;
        const my = (e.clientY - rect.top) * scaleY;
        const puntos = [coords.israel, coords.jope, coords.ninive, coords.tarsis];
        let hover = false;
        for (const p of puntos) {
            if (Math.hypot(mx - p.x, my - p.y) < 35) { hover = true; break; }
        }
        canvas.style.cursor = hover ? 'pointer' : 'default';
    });
});

// ================================================================
//  LÍNEA DE TIEMPO
// ================================================================
document.addEventListener('DOMContentLoaded', function() {
    const events = [
        { year: '800 a.C.', label: 'Imperio Asirio', title: '🏛️ Apogeo del Imperio Asirio', desc: 'Asiria se convierte en la superpotencia del Cercano Oriente.' },
        { year: '760 a.C.', label: '⭐ Jonás', title: '📖 Jonás es llamado por Dios', desc: 'Dios envía a Jonás a predicar a Nínive.' },
        { year: '722 a.C.', label: 'Caída Samaria', title: '⚔️ Asiria conquista Israel', desc: 'El reino del Norte cae ante los asirios.' },
        { year: '701 a.C.', label: 'Senaquerib', title: '🛡️ Senaquerib asedia Jerusalén', desc: 'El ángel del Señor salva a Jerusalén.' },
        { year: '612 a.C.', label: 'Caída Nínive', title: '🔥 Nínive es destruida', desc: 'Una coalición destruye Nínive.' }
    ];

    const infoDiv = document.getElementById('timelineInfo');
    const progress = document.getElementById('timelineProgress');
    const eventsEls = document.querySelectorAll('.timeline-event');

    function updateTimeline(index) {
        const ev = events[index];
        if (infoDiv) {
            infoDiv.innerHTML = `<div style="color:#e8d5b0;font-weight:600;font-size:0.95rem;">${ev.title}</div>
                                <div style="color:#b8c7e0;font-size:0.85rem;">${ev.desc}</div>`;
        }
        if (progress) {
            progress.style.width = ((index / (events.length - 1)) * 100) + '%';
        }
        eventsEls.forEach((el, i) => {
            const dot = el.querySelector('div');
            if (dot) {
                dot.style.background = (i <= index) ? '#e8b84b' : '#1a2538';
                dot.style.borderColor = (i <= index) ? '#e8b84b' : 'rgba(255,255,255,0.15)';
                dot.style.boxShadow = (i === index) ? '0 0 20px rgba(232,184,75,0.4)' : 'none';
            }
        });
    }

    eventsEls.forEach((el, idx) => {
        el.addEventListener('click', () => updateTimeline(idx));
        el.addEventListener('touchend', (e) => { e.preventDefault(); updateTimeline(idx); });
    });

    // Mostrar el primer evento por defecto
    if (eventsEls.length > 0) updateTimeline(0);
});

// ================================================================
//  TARJETAS HEBREO (Acordeón)
// ================================================================
document.addEventListener('DOMContentLoaded', function() {
    const cards = document.querySelectorAll('.hebreo-card');
    cards.forEach(card => {
        card.addEventListener('click', function() {
            cards.forEach(c => c !== this && c.classList.remove('activa'));
            this.classList.toggle('activa');
        });
        card.addEventListener('touchend', function(e) {
            e.preventDefault();
            cards.forEach(c => c !== this && c.classList.remove('activa'));
            this.classList.toggle('activa');
        });
    });
    if (cards.length > 0) cards[0].classList.add('activa');
});

// ================================================================
//  DIAGRAMA DE ANILLOS (Acordeón)
// ================================================================
document.addEventListener('DOMContentLoaded', function() {
    const anillos = document.querySelectorAll('.anillo-item');
    anillos.forEach(item => {
        item.addEventListener('click', function() {
            anillos.forEach(a => a !== this && a.classList.remove('activo'));
            this.classList.toggle('activo');
        });
        item.addEventListener('touchend', function(e) {
            e.preventDefault();
            anillos.forEach(a => a !== this && a.classList.remove('activo'));
            this.classList.toggle('activo');
        });
    });
    if (anillos.length > 0) anillos[0].classList.add('activo');
});
