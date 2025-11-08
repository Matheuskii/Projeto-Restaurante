document.addEventListener('DOMContentLoaded', () => {
    const carousel = document.querySelector('.carousel');
    const items = document.querySelectorAll('.carousel-item');
    const indicators = document.querySelectorAll('.indicator');
    let currentIndex = 0;

    // Pratos destacados
    const dishes = [
        {
            name: "Risoto Especial",
            description: "Risoto cremoso preparado com arroz arbóreo, cogumelos frescos, aspargos e parmesão. Finalizado com azeite extra virgem e ervas finas.",
            price: "R$ 79,00",
            image: "imgs/pratos/risoto.jpg"
        },
        {
            name: "Parmegiana",
            description: "Filé empanado coberto com molho de tomate caseiro, queijo muçarela gratinado e parmesão. Servido com arroz e batatas.",
            price: "R$ 89,00",
            image: "imgs/pratos/parmeggiana.jpg"
        },
        {
            name: "Salmão Grelhado",
            description: "Filé de salmão grelhado na manteiga, acompanhado de legumes salteados e purê de batatas. Finalizado com molho de ervas finas.",
            price: "R$ 95,00",
            image: "imgs/pratos/Salmao-Grelhado.webp"
        },
        {
            name: "Massa Especial",
            description: "Massa fresca artesanal ao molho pomodoro, manjericão fresco e parmesão. Uma explosão de sabores da cozinha italiana.",
            price: "R$ 65,00",
            image: "imgs/pratos/macaarrao.jpg"
        }
    ];

    function updateCarousel(index) {
        // Remove active class from all items
        items.forEach(item => item.classList.remove('active'));
        indicators.forEach(ind => ind.classList.remove('active'));

        // Add active class to current item
        items[index].classList.add('active');
        indicators[index].classList.add('active');

        // Update transform
        carousel.style.transform = `translateX(-${index * 100}%)`;
    }

    // Next and Previous buttons
    document.querySelector('.carousel-btn.next').addEventListener('click', () => {
        currentIndex = (currentIndex + 1) % items.length;
        updateCarousel(currentIndex);
    });

    document.querySelector('.carousel-btn.prev').addEventListener('click', () => {
        currentIndex = (currentIndex - 1 + items.length) % items.length;
        updateCarousel(currentIndex);
    });

    // Indicator clicks
    indicators.forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            currentIndex = index;
            updateCarousel(currentIndex);
        });
    });

    // Auto advance carousel
    setInterval(() => {
        currentIndex = (currentIndex + 1) % items.length;
        updateCarousel(currentIndex);
    }, 5000);

    // Initial state
    updateCarousel(0);
});