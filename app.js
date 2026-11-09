const nombresPasos = ["Bienvenida","Rutas","Culturas","Pueblo Raizal","Territorio","Encuentro","Memoria","Final"];
function irA(id){
  document.querySelectorAll(".pantalla").forEach(p=>p.classList.remove("activa"));
  const destino=document.getElementById(id);
  if(!destino)return;
  destino.classList.add("activa");
  const paso=Number(destino.dataset.paso||0);
  document.getElementById("pasoTexto").textContent=nombresPasos[paso]||"Viaje";
  document.getElementById("progresoBarra").style.width=((paso+1)/nombresPasos.length*100)+"%";
  window.scrollTo({top:0,behavior:"smooth"});
  if(id==="memoria") iniciarMemoria();
}
function mostrarAviso(nombre){
  const pantalla=document.querySelector(".pantalla.activa");
  const aviso=pantalla.querySelector(".aviso");
  if(aviso) aviso.textContent=`La ruta ${nombre} hará parte de una próxima versión. En este piloto exploraremos el pueblo Raizal.`;
}
function responder(opcion){
  const retro=document.getElementById("retroalimentacion");
  const boton=document.getElementById("continuarMemoria");
  const mensajes={
    imponer:"Podemos intentarlo de otra manera. Una persona no tiene que cambiar su lengua para conversar con nosotros. Las lenguas merecen respeto.",
    ignorar:"Si no entendemos, podemos acercarnos con respeto. Escuchar y preguntar nos ayuda a conocer a otras personas.",
    escuchar:"¡Buena elección! Escuchar y preguntar con respeto nos permite conocer otras lenguas y aprender de quienes las hablan."
  };
  retro.textContent=mensajes[opcion];
  boton.classList.remove("oculto");
  document.querySelectorAll(".respuesta").forEach(b=>b.disabled=true);
}
const elementosMemoria=["🌊","🏠","🗣️","🎶","🌊","🏠","🗣️","🎶"];
let primera=null, bloqueado=false, parejas=0, fichas=[];
function iniciarMemoria(){
  primera=null;bloqueado=false;parejas=0;
  document.getElementById("contadorParejas").textContent="0";
  document.getElementById("mensajeMemoria").textContent="Busca las cuatro parejas.";
  document.getElementById("finMemoria").classList.add("oculto");
  const mezcla=[...elementosMemoria].sort(()=>Math.random()-.5);
  const tablero=document.getElementById("tableroMemoria");
  tablero.innerHTML="";
  fichas=mezcla.map((valor,i)=>{
    const b=document.createElement("button");
    b.className="ficha";b.textContent="✦";b.setAttribute("aria-label","Ficha oculta");
    b.dataset.valor=valor;b.dataset.indice=i;
    b.addEventListener("click",()=>voltear(b));
    tablero.appendChild(b);return b;
  });
}
function voltear(ficha){
  if(bloqueado||ficha.classList.contains("volteada")||ficha.classList.contains("acertada"))return;
  ficha.textContent=ficha.dataset.valor;ficha.classList.add("volteada");
  if(!primera){primera=ficha;return;}
  if(primera.dataset.valor===ficha.dataset.valor){
    primera.classList.add("acertada");ficha.classList.add("acertada");
    primera.classList.remove("volteada");ficha.classList.remove("volteada");
    primera.disabled=true;ficha.disabled=true;primera=null;parejas++;
    document.getElementById("contadorParejas").textContent=parejas;
    if(parejas===4){
      document.getElementById("mensajeMemoria").textContent="¡Lo lograste! Encontraste todas las parejas.";
      document.getElementById("finMemoria").classList.remove("oculto");
    }
  }else{
    bloqueado=true;const anterior=primera;primera=null;
    setTimeout(()=>{anterior.textContent="✦";ficha.textContent="✦";anterior.classList.remove("volteada");ficha.classList.remove("volteada");bloqueado=false;},850);
  }
}
function reiniciar(){
  document.querySelectorAll(".respuesta").forEach(b=>b.disabled=false);
  document.getElementById("retroalimentacion").textContent="";
  document.getElementById("continuarMemoria").classList.add("oculto");
  irA("bienvenida");
}
