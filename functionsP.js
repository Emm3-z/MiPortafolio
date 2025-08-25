document.getElementById('year').textContent = new Date().getFullYear();

    // Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(a=>{
      a.addEventListener('click', e=>{
        const id = a.getAttribute('href');
        if(id.length > 1){
          e.preventDefault();
          document.querySelector(id)?.scrollIntoView({behavior:'smooth'});
          history.pushState(null,'',id);
        }
      });
    });

    // Indicador (punto) bajo el link activo
    const menu = document.getElementById('menu');
    const dot = document.getElementById('activeDot');
    function moveDotTo(el){
      const rect = el.getBoundingClientRect();
      const parent = menu.getBoundingClientRect();
      const x = rect.left - parent.left + rect.width/2 - 3; // 3 = radio
      dot.style.transform = `translateX(${x}px)`;
    }
    // Set inicial
    const firstLink = menu.querySelector('a');
    if(firstLink) moveDotTo(firstLink);

    // Actualiza al hacer hover/click
    menu.querySelectorAll('a').forEach(link=>{
      link.addEventListener('mouseenter', ()=> moveDotTo(link));
      link.addEventListener('focus', ()=> moveDotTo(link));
    });

    // Observa secciones para activar el punto automáticamente
    const sections = ['#proyectos','#about','#contacto'].map(id=>document.querySelector(id));
    const observer = new IntersectionObserver((entries)=>{
      const visible = entries.filter(e=>e.isIntersecting).sort((a,b)=> b.intersectionRatio - a.intersectionRatio)[0];
      if(visible){
        const link = menu.querySelector(`a[href="#${visible.target.id}"]`);
        if(link) moveDotTo(link);
      }
    },{rootMargin:'-30% 0px -60% 0px', threshold:[0, .25, .5, .75, 1]});
    sections.forEach(s=>s && observer.observe(s));

    // Filtros de proyectos
    const chips = document.querySelectorAll('.chip');
    const cards = document.querySelectorAll('.card');
    chips.forEach(ch=> ch.addEventListener('click',()=>{
      chips.forEach(c=>c.dataset.active=false);
      ch.dataset.active=true;
      const f = ch.dataset.filter;
      cards.forEach(card=>{
        const tags = card.dataset.tags.split(' ');
        const show = f==='all' || tags.includes(f);
        card.style.display = show ? '' : 'none';
      });
    }));

    // Diálogos (modales)
    document.querySelectorAll('[data-open-modal]')?.forEach(btn=>{
      btn.addEventListener('click', (e)=>{
        e.preventDefault();
        const sel = btn.getAttribute('data-open-modal');
        document.querySelector(sel)?.showModal();
      })
    })
    document.querySelectorAll('dialog [data-close]')?.forEach(b=> b.addEventListener('click',()=> b.closest('dialog').close()))

    // Canvas de portada simple (placeholder animado para la primera card)
    const canvas = document.querySelector('.card canvas');
    if(canvas){
      const ctx = canvas.getContext('2d');
      let t = 0; const DPR = Math.min(2, window.devicePixelRatio||1);
      function resize(){
        const {width, height} = canvas.getBoundingClientRect();
        canvas.width = width * DPR; canvas.height = height * DPR; canvas.style.width = width+'px'; canvas.style.height = height+'px';
      }
      resize();
      window.addEventListener('resize', resize);
      function loop(){
        const w = canvas.width, h = canvas.height;
        ctx.clearRect(0,0,w,h);
        for(let i=0;i<80;i++){
          const x = (Math.sin((i*0.21)+t)*0.5+0.5)*w;
          const y = (Math.cos((i*0.17)+t*1.2)*0.5+0.5)*h;
          const r = 2 + (Math.sin(i+t)*0.5+0.5)*8;
          ctx.beginPath();
          ctx.arc(x,y,r,0,Math.PI*2);
          ctx.fillStyle = `hsla(${(i*9+t*20)%360}, 80%, 60%, .55)`;
          ctx.fill();
        }
        t+=0.008; requestAnimationFrame(loop);
      }
      loop();
    }