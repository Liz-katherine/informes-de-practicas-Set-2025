const fotos = ['cakecoco2.jpg','Rollofresaycrema2.jpg','Tiramisu2.jpg','Arrozdeleche2.jpg','cheesecakefresa2.jpg','payduraznomini.jpg','torta3leches.jpg'];
    const titulos = ['Pastel de coco','Pionono de fresas cubierto de merengue','Tiramisu','Arroz de leche','Cheesecake de fresa','Mini Pay de Durazno','Torta 3 leches'];
    let presentacion=0
    let intervalo = null;  
    function mostrarfoto(){
        const img=document.getElementById('foto');
        img.src="imagenes/" + fotos[presentacion];
        const titulo= document.getElementById('titulo');
        titulo.innerText=titulos[presentacion];
        actualizarIndicadores();
    }
    function imgsiguiente(){
        presentacion++;
        if(presentacion>=fotos.length){
            presentacion=0;
        }
        mostrarfoto();
    }

    function imganterior(){
        presentacion--;
       if(presentacion<0){
        presentacion=fotos.length-1;

       } 
        mostrarfoto();
    }
    function crearindicadores(){
        const crear=document.getElementById('indicador');
        for(let i=0;i<fotos.length;i++){
            const punto=document.createElement('span');
            punto.classList.add('punto');
            punto.addEventListener('click',() => {
            presentacion=i;
                mostrarfoto();
            });
            crear.appendChild(punto);
        }
    }
    function actualizarIndicadores(){
        const puntos= document.querySelectorAll('.punto');
        puntos.forEach((punto, index) =>{
            if (index===presentacion){
                punto.classList.add('activo');
            }
            else{
                punto.classList.remove('activo')
            }
        });

     }
    function reproducirCarrusel() {
         if (!intervalo) {
            intervalo = setInterval(() => {
            presentacion = (presentacion + 1) % fotos.length;
            mostrarfoto();
            actualizarIndicadores();
         }, 3000); 
        }
    }
    function detenerCarrusel() {
        clearInterval(intervalo);
        intervalo = null;
    }
        document.addEventListener('load',crearindicadores());
        document.addEventListener('load', mostrarfoto());

    console.log(presentacion);

