
function cargar() {
    var datos = { 
        usuarios : [
            {clave : 1, nombre: "m", contraseña: "m", tipo: "maestro"},
            {clave : 2, nombre: "a", contraseña: "a", tipo: "aprendiz"},
            {clave : 3, nombre: "b", contraseña: "b", tipo: "aprendiz"},
            {clave : 4, nombre: "c", contraseña: "c", tipo: "aprendiz"},
            ],
         cuestiones : [ 
            {clave: 0, enunciado: "A es a?", disponible: false},
		    {clave: 1, "enunciado":"B es b?","disponible":true,"soluciones":[{"solucion":"Si, pero en minusculas","correcta": false,"razonamientos":[{"justificacion":"Justificacion ingeniosa", "justificada": false, "errortexto":"Error texto"},{"justificacion":"Justificacion  2", "justificada": false,"errortexto":"Error"}]},{"solucion":"Si, pero en mayusuclas","correcta": true,"razonamientos":[{"justificacion":"Justificacion","justificada": false,"errortexto":"Error no correcta"}]}]},
            {clave: 2, enunciado: "C es b?", disponible: true,soluciones:[{solucion:"No son lo mismo",correcta:true,razonamientos:[]}] },
            
		],
    }
     datos.propuestas=new Array();   
    window.localStorage.setItem("datos", JSON.stringify(datos));    
}

function validacion(){
    var datos = JSON.parse(window.localStorage.getItem("datos"));
    console.log(datos);
    var nombre = document.getElementById("nombre").value;
    var contraseña = document.getElementById("contraseña").value;
    var usuario = getUsuario(datos, nombre, contraseña);
    if (usuario == null){
        nombre.value = "";
        contraseña.value = "";
        login.action = "./login.html";
    } else {
        window.localStorage.setItem("usuarioRegistrado", JSON.stringify(usuario));
        var login = document.getElementById("login");
        if (usuario.tipo == "maestro"){
            login.action = "./cuestionesMaestro.html";
        } else {
            login.action = "./cuestionesAprendiz.html";
        }
    }
    return usuario != null;
}

function getUsuario(datos, nombre, contraseña){
    for(usuario of datos.usuarios){
        if (usuario.nombre == nombre &&
           usuario.contraseña == contraseña){
            return usuario;
        }
    }
    return null;
}

function listaenunciadomaestro(){
	var datos = JSON.parse(window.localStorage.getItem("datos"));
    var conjuntoenunciado = document.getElementById("conjuntoenunciado");
	for(cuestion of datos.cuestiones){
        var div=document.createElement("div");
        conjuntoenunciado.appendChild(div);
        var a=document.createElement("a");
        div.appendChild(a);
        a.setAttribute("href","./cuestionMaestro.html");
        a.setAttribute("onclick","cuestionlistado(event)");
        a.innerHTML=cuestion.enunciado;
        var input=document.createElement("input");
        div.appendChild(input);
        input.setAttribute("type","button");
        input.setAttribute("value","Eliminar cuestion");       
        input.setAttribute("onclick","eliminarcuestion(event)"); 
    }
}

function eliminarcuestion(event){
    
    var datos = JSON.parse(window.localStorage.getItem("datos"));
    var conjuntoenunciado = document.getElementById("conjuntoenunciado");
    conjuntoenunciado.removeChild(event.target.parentElement);
    var enunciado=event.target.parentElement.firstChild.innerHTML;
    var index=datos.cuestiones.map(function(x){return  x.enunciado}).indexOf(enunciado);
    datos.cuestiones.splice(index, 1);
    window.localStorage.setItem("datos", JSON.stringify(datos));
    var enunciado=event.target.parentElement.getElementsByTagName("a")[0].innerHTML;
    eliminarpropuesta(enunciado);           
}

 function eliminarpropuesta(enunciado){
      var datos = JSON.parse(window.localStorage.getItem("datos"));
     for (var i=datos.propuestas.length-1; i>=0; i--) {
    if (datos.propuestas[i].enunciado ==enunciado) {
        datos.propuestas.splice(i, 1);
    }       
  }
window.localStorage.setItem("datos", JSON.stringify(datos));
 }

function listadoenunciadosalumno(){
    
	var datos = JSON.parse(window.localStorage.getItem("datos"));
    var conjuntoenunciado = document.getElementById("enunciadosalumno");
	for(cuestion of datos.cuestiones){
        if(cuestion.disponible){
            var div=document.createElement("div");
            conjuntoenunciado.appendChild(div);
            var a=document.createElement("a");
            div.appendChild(a);
            a.setAttribute("href","./cuestionAprendiz.html");
            a.innerHTML=cuestion.enunciado;
            a.setAttribute("onclick","cuestionlistadoalumno(event)");
        }
    }
}

function nuevasolucion(){
        var soluciones = document.getElementById("soluciones");
        var div=document.createElement("div");
        soluciones.appendChild(div);
        div.setAttribute("class","solucion");
        var nuevasol=document.createTextNode("Nueva Solucion");
        div.appendChild(nuevasol);
        var cajatexto=document.createElement("input");
        div.appendChild(cajatexto);
        cajatexto.setAttribute("type","text");
        cajatexto.setAttribute("class","textosolucion");
        var checkbox=document.createElement("input");
        div.appendChild(checkbox);
        checkbox.setAttribute("type","checkbox");
        checkbox.setAttribute("name","correcta");
        checkbox.setAttribute("checked",true);
        checkbox.setAttribute("onchange",'handleChange(this);');
        var correcta=document.createTextNode("Correcta");
        div.appendChild(correcta);
        var botoneliminar=document.createElement("input");
        div.appendChild(botoneliminar);
        botoneliminar.setAttribute("type","button");
        botoneliminar.setAttribute("value","Eliminar solucion");
        botoneliminar.setAttribute("onclick","eliminarsolucion(event)");
     
    }

function eliminarsolucion(event){   
    var soluciones = document.getElementById("soluciones");
    soluciones.removeChild(event.target.parentElement);
    var enunciado=document.getElementById("Enunciado");
    if(soluciones.getElementsByClassName("solucion")[0]==undefined){
        enunciado.getElementsByTagName("input")[1].checked=false;
    }
}

function cuestionlistadoalumno(event){
    var enunciado=event.target.innerHTML;
     window.localStorage.setItem("seleccionadaalumno", enunciado);
}

function cuestionlistado(event){
    var enunciado=event.target.innerHTML;
     window.localStorage.setItem("enunciadoalmacenado", enunciado);
}

function almacenaenunciado(){
    var enunciado=document.getElementById("cajatexto").value;
    window.localStorage.setItem("enunciadoalmacenado", enunciado);
}

function cajatextoenunciado(){
    var datos = JSON.parse(window.localStorage.getItem("datos"));
    var enunciadoc=document.getElementById("enunciadocuestion");
    var enunciadoenviado= window.localStorage.getItem("enunciadoalmacenado");
    var index=datos.cuestiones.map(function(x){return  x.enunciado}).indexOf(enunciadoenviado);
    if(index==-1) enunciadoc.value=enunciadoenviado;
    else{ 
        cuestion=datos.cuestiones[index];
        enunciadoc.value=cuestion.enunciado; 
        var disponible =document.getElementById("disponible");
        disponible.checked=cuestion.disponible;
        var soluciones=document.getElementById("soluciones");
        soluciones.removeChild(soluciones.getElementsByClassName("solucion")[0]);
        solucionescuestion(datos.cuestiones[index]);
    }  
}

function solucionescuestion(cuestion){
    var divpadre=document.getElementById("soluciones");
    var enunciado=window.localStorage.getItem("enunciadoalmacenado");
    var i=0;
    var j=0;
    for (solucion of cuestion.soluciones){
            var divsolucion=document.createElement("div");
            divpadre.appendChild(divsolucion);
            divsolucion.setAttribute("class","solucion");
            var Id="solucion"+i;
            divsolucion.setAttribute("id",Id);
            var nuevasol=document.createTextNode("Solucion");
            divsolucion.appendChild(nuevasol);
            var cajatexto=document.createElement("input");
            divsolucion.appendChild(cajatexto);
            cajatexto.setAttribute("type","text");
            cajatexto.setAttribute("class","textosolucion");
            cajatexto.setAttribute("value",solucion.solucion);
            var checkbox=document.createElement("input");
            divsolucion.appendChild(checkbox);
            checkbox.setAttribute("type","checkbox");
            checkbox.checked=solucion.correcta;
            checkbox.setAttribute("onchange",'handleChange(this);');
            var correcta=document.createTextNode("Correcta");
            divsolucion.appendChild(correcta);
            var botoneliminar=document.createElement("input");
            divsolucion.appendChild(botoneliminar);
            botoneliminar.setAttribute("type","button");
            botoneliminar.setAttribute("value","Eliminar solucion");
            botoneliminar.setAttribute("onclick","eliminarsolucion(event)");
        if(solucion.correcta!=true) razonamientosolucion(solucion,Id);
            i++;
 }
     var datos = JSON.parse(window.localStorage.getItem("datos"));
    for( i=0;i< datos.propuestas.length;i++){
        if(datos.propuestas[i].enunciado==enunciado && !datos.propuestas[i].solucionpropuesta.pscorregida){
            if(datos.propuestas[i].solucionpropuesta.sprop=!"") propuestasalumno(i);    
        }
    }
}

function propuestasalumno(posicion){
    var datos = JSON.parse(window.localStorage.getItem("datos"));
    var s=document.getElementById("soluciones");
    var div=document.createElement("div");
    s.appendChild(div);
    div.setAttribute("class","razonamientoalumno-profe");
    var propuesa=datos.propuestas[posicion];
    soluciones.appendChild(div);
    var propuestasol=document.createTextNode("Propuesta de solucion");
    div.appendChild(propuestasol);
    var cajatexto=document.createElement("input");
    div.appendChild(cajatexto);
    cajatexto.setAttribute("type","text");
    cajatexto.setAttribute("class","textosolucion");
    cajatexto.setAttribute("value",propuesa.solucionpropuesta.sprop);
    cajatexto.setAttribute("readOnly",true);
    var checkbox=document.createElement("input");
    div.appendChild(checkbox);
    checkbox.setAttribute("type","checkbox");
    checkbox.setAttribute("checked",true);
    checkbox.setAttribute("onchange",'razonamientoincorrecto(this);');
    var correcta=document.createTextNode("Correcta");
     div.appendChild(correcta);
    var botoncorregir=document.createElement("input");
    div.appendChild(botoncorregir);
    botoncorregir.setAttribute("type","button");
    botoncorregir.setAttribute("value","Corregir");
    botoncorregir.setAttribute("onclick","corregirpropuesta("+posicion+",event);");
            
}

function corregirpropuesta(numero,event){
    var padre=event.target.parentElement;
    var datos = JSON.parse(window.localStorage.getItem("datos"));
    var propuesta=datos.propuestas[numero].solucionpropuesta;
    var razonamientoprofe=padre.getElementsByClassName("error")[0];
    if(razonamientoprofe!=null)
        propuesta.serror="Incorrecta." + razonamientoprofe.getElementsByTagName("input")[0].value;
    propuesta.pscorregida=true;
    datos.propuestas.slice(numero,1,propuesta);
     window.localStorage.setItem("datos", JSON.stringify(datos));
     var soluciones = document.getElementById("soluciones");
    soluciones.removeChild(event.target.parentElement);   
}


function razonamientosolucion(solucion,Id){
     var enunciado= window.localStorage.getItem("enunciadoalmacenado");
    var nrazonaminetos=solucion.razonamientos.length; 
    var divsolucion=document.getElementById(Id);
    var divrazonamientos=document.createElement("div");
    divsolucion.appendChild(divrazonamientos);
    divrazonamientos.setAttribute("class","todoslosrazonamientos");
    var botonaniadir=document.createElement("input");
    divrazonamientos.appendChild(botonaniadir);
    botonaniadir.setAttribute("type","button");
    botonaniadir.setAttribute("value","añadir razonamiento");  
     botonaniadir.setAttribute("onclick","nuevorazonamiento(event)");
    
    for(i=0;i<nrazonaminetos;i++){
        var divrazonamiento=document.createElement("div");
        divrazonamientos.appendChild(divrazonamiento);
        divrazonamiento.setAttribute("class","razonamiento");
        var razonamiento=document.createTextNode("Razonamiento");
        divrazonamiento.appendChild(razonamiento);
        var cajatexto=document.createElement("input");
        divrazonamiento.appendChild(cajatexto);
        cajatexto.setAttribute("type","text");
        cajatexto.setAttribute("class","razonamientotexto");
        cajatexto.setAttribute("value",solucion.razonamientos[i].justificacion);
        var checkbox=document.createElement("input");
        divrazonamiento.appendChild(checkbox);
        checkbox.setAttribute("type","checkbox");
        var justificado=document.createTextNode("Justificado");
        checkbox.setAttribute("onchange",'razonamientoincorrecto(this);');
        checkbox.checked=solucion.razonamientos[i].justificada;
        divrazonamiento.appendChild(justificado);
        var botoneliminar=document.createElement("input");
        botoneliminar.setAttribute("type","button");
        botoneliminar.setAttribute("value","Eliminar razonamiento");  
        botoneliminar.setAttribute("onclick","elimarrazonamiento(event)");
        if(!solucion.razonamientos[i].justificada){
            var div=document.createElement("div");
            divrazonamiento.appendChild(div);
            div.setAttribute("class","error");
            var error=document.createTextNode("Error");
            div.appendChild(error);
            var errorcajatexto=document.createElement("input");
            div.appendChild(errorcajatexto);
            errorcajatexto.setAttribute("class","textoerror");
            errorcajatexto.setAttribute("type","text");
            errorcajatexto.setAttribute("value",solucion.razonamientos[i].errortexto);
            divrazonamiento.insertBefore(botoneliminar,  divrazonamiento.lastChild);
        }else divrazonamiento.appendChild(botoneliminar);
       }
    
     var datos = JSON.parse(window.localStorage.getItem("datos"));
  
    for( i=0;i< datos.propuestas.length;i++){
        if(datos.propuestas[i].enunciado==enunciado){
            var propuesta=datos.propuestas[i];
            for( var j=0; j<propuesta.soluciones.length;j++){
                if(propuesta.soluciones[j].razonamientopropuesto.razprorp!=""){
                if(propuesta.soluciones[j].solucion==solucion.solucion && !propuesta.soluciones[j].razonamientopropuesto.prcorregido)  
                    propuestarazonamientoalumno(propuesta.soluciones[j],i,j);
                
            }
            }
        }
    }
}

function propuestarazonamientoalumno(razpropuesta,posicion,possolucion){
   
    var s=document.getElementById("soluciones");
    var div=document.createElement("div");
    s.appendChild(div);
    div.setAttribute("class","Propuestarazonamientoalumno");
    soluciones.appendChild(div);
    var propuestaraz=document.createTextNode("Propuesta de razonamiento");
    div.appendChild(propuestaraz);
    var cajatexto=document.createElement("input");
    div.appendChild(cajatexto);
    cajatexto.setAttribute("type","text");
    cajatexto.setAttribute("class","textosolucion");
    cajatexto.setAttribute("value",razpropuesta.razonamientopropuesto.razprorp);
    var checkbox=document.createElement("input");
    div.appendChild(checkbox);
    checkbox.setAttribute("type","checkbox");
    checkbox.setAttribute("onchange",'razonamientoincorrecto(this);');
    checkbox.setAttribute("checked",true);
    var correcta=document.createTextNode("Correcta");
    div.appendChild(correcta);
    var botoncorregir=document.createElement("input");
    div.appendChild(botoncorregir);
    botoncorregir.setAttribute("type","button");
    botoncorregir.setAttribute("value","Corregir");
    botoncorregir.setAttribute("onclick","corregirrazonamientomaestro("+posicion+","+possolucion+",event);");
                      
}

function corregirrazonamientomaestro(pos1,pos2,event){
    var padre=event.target.parentElement;
    var datos = JSON.parse(window.localStorage.getItem("datos"));
    var propuesta=datos.propuestas[pos1].soluciones[pos2];
    var razonamientoprofe=padre.getElementsByClassName("error")[0];
    if(razonamientoprofe!=null)
        propuesta.razonamientopropuesto.errorraz="Incorrecta." + razonamientoprofe.getElementsByTagName("input")[0].value;
    propuesta.razonamientopropuesto.prcorregido=true;
    window.localStorage.setItem("datos", JSON.stringify(datos));
    var soluciones = document.getElementById("soluciones");
    soluciones.removeChild(event.target.parentElement);   
}
    
function handleChange(checkbox) {
      var solucion=checkbox.parentElement;    
    if(checkbox.checked != true ){
        if(solucion.getElementsByClassName("todoslosrazonamientos")[0]==null){
                var divglobal=document.createElement("div");
                divglobal.setAttribute("class","todoslosrazonamientos");
                solucion.appendChild(divglobal);
                var botonaniadir=document.createElement("input");
                divglobal.appendChild(botonaniadir);
                botonaniadir.setAttribute("type","button");
                botonaniadir.setAttribute("value","añadir razonamiento");  
                botonaniadir.setAttribute("onclick","nuevorazonamiento(event)");
                var div=document.createElement("div");
                divglobal.appendChild(div);
                div.setAttribute("class","razonamiento");
                var razonamiento=document.createTextNode("Razonamiento");
                div.appendChild(razonamiento);
                var cajatexto=document.createElement("input");
                div.appendChild(cajatexto);
                cajatexto.setAttribute("type","text");
                cajatexto.setAttribute("class","razonamientotexto");
                var checkbox=document.createElement("input");
                div.appendChild(checkbox);
                checkbox.setAttribute("type","checkbox");
                checkbox.setAttribute("checked",true);
                checkbox.setAttribute("onchange",'razonamientoincorrecto(this);');
                var justificado=document.createTextNode("Justificado");
                div.appendChild(justificado);
                var botoneliminar=document.createElement("input");
                div.appendChild(botoneliminar);
                botoneliminar.setAttribute("type","button");
                botoneliminar.setAttribute("value","Eliminar razonamiento");  
                botoneliminar.setAttribute("onclick","elimarrazonamiento(event)");     
        }
    }else if(checkbox.checked == true ){ 
        if(solucion.getElementsByClassName("todoslosrazonamientos")[0]!=null)
            solucion.removeChild(solucion.getElementsByClassName("todoslosrazonamientos")[0]);
   }
}

function nuevorazonamiento(event){
    var todorazona=event.target.parentElement;
     var div=document.createElement("div");
        todorazona.appendChild(div);
        div.setAttribute("class","razonamiento");
        var razonamiento=document.createTextNode("Razonamiento");
        div.appendChild(razonamiento);
        var cajatexto=document.createElement("input");
        div.appendChild(cajatexto);
        cajatexto.setAttribute("type","text");
        cajatexto.setAttribute("class","razonamientotexto");
        var checkbox=document.createElement("input");
        div.appendChild(checkbox);
        checkbox.setAttribute("type","checkbox");
        checkbox.setAttribute("checked",true);
        var justificado=document.createTextNode("Justificado");
        div.appendChild(justificado);
        checkbox.setAttribute("onchange",'razonamientoincorrecto(this);');
        var botoneliminar=document.createElement("input");
        div.appendChild(botoneliminar);
        botoneliminar.setAttribute("type","button");
        botoneliminar.setAttribute("value","Eliminar razonamiento");  
        botoneliminar.setAttribute("onclick","elimarrazonamiento(event)");
}

function elimarrazonamiento(event){
    razonamiento=event.target.parentElement;
    solucion=razonamiento.parentElement;
    solucion.removeChild(razonamiento);
    if(solucion.getElementsByClassName("razonamiento")[0]==undefined){
        var padre= solucion.parentElement;
        padre.removeChild(solucion);
        padre.getElementsByTagName("input")[1].checked=true;
        
    }
}

function guardar(){
    var enunciadoenviado= window.localStorage.getItem("enunciadoalmacenado");
    var datos = JSON.parse(window.localStorage.getItem("datos"));
    var enunciado=document.getElementById("enunciadocuestion").value;
    var disponible =document.getElementById("disponible").checked;
    var h=[];
     var todaslassoluciones=document.getElementsByClassName("solucion");
    for(i=0;i<todaslassoluciones.length;i++){
        var solucion=todaslassoluciones[i].getElementsByClassName("textosolucion")[0].value;
        var scorrecta=todaslassoluciones[i].getElementsByTagName("input")[1].checked;
        var todoslosrazonamientos=todaslassoluciones[i].getElementsByClassName("razonamiento");
        var razonaminetos=[];
        for(j=0;j<todoslosrazonamientos.length;j++){
                var algo=todoslosrazonamientos[j].getElementsByClassName("razonamientotexto")[0].value;
                var justificada=todoslosrazonamientos[j].getElementsByTagName("input")[1].checked;
                var error="";
                if(!justificada){
                        var diverror=todoslosrazonamientos[j].getElementsByClassName("error");
                        error=diverror[0].getElementsByClassName("textoerror")[0].value;
                }
                razonaminetos.push({justificacion: algo, justificada: justificada, errortexto: error});
        }
        h.push({solucion : solucion, correcta: scorrecta, razonamientos: razonaminetos});
    }
   
     var index=datos.cuestiones.map(function(x){return  x.enunciado}).indexOf(enunciadoenviado);
    if(index==-1){
         var ncuestiones=datos.cuestiones.length;
        var calve;
        if(datos.cuestiones[0]==undefined)calve=0;
        else  calve=datos.cuestiones[ncuestiones-1].clave+1;
        datos.cuestiones.push({clave:calve, enunciado: enunciado, disponible: disponible, soluciones: h});
    }
        
     else
        datos.cuestiones.splice(index, 1,{clave:datos.cuestiones[index].clave,enunciado: enunciado, disponible: disponible, soluciones: h});
    window.localStorage.setItem("datos", JSON.stringify(datos));
    if(enunciadoenviado!=enunciado) eliminarpropuesta(enunciadoenviado);
}

function razonamientoincorrecto(checkbox){
     var solucion=checkbox.parentElement;
     if(checkbox.checked != true ){
            var div=document.createElement("div");
            solucion.appendChild(div);
            div.setAttribute("class","error");
            var error=document.createTextNode("Error");
            div.appendChild(error);
            var errorcajatexto=document.createElement("input");
            errorcajatexto.setAttribute("type","text");
            div.appendChild(errorcajatexto);
            errorcajatexto.setAttribute("class","textoerror");     
    }else if(checkbox.checked == true ){ 
            if(solucion.getElementsByClassName("error")[0]!=null)
                solucion.removeChild(solucion.getElementsByClassName("error")[0]);                             
    }
}

function cargacuestionalumno(){
    var enunciado=localStorage.getItem("seleccionadaalumno");
    var datos = JSON.parse(window.localStorage.getItem("datos"));
    var index=datos.cuestiones.map(function(x){return  x.enunciado}).indexOf(enunciado);
    var alumno=JSON.parse(window.localStorage.getItem("usuarioRegistrado")); 
    var cuestion=datos.cuestiones[index];
    var i=0;
    var cuestioncontestada=false;
    var alumno=JSON.parse(window.localStorage.getItem("usuarioRegistrado"));
    while((!cuestioncontestada)&&(i<datos.propuestas.length)){
        if((datos.propuestas[i].alumno==alumno.nombre)&&(datos.propuestas[i].enunciado==enunciado))
                cuestioncontestada=true;
        else i++;    
    }

    var enunciadomostrado=document.getElementById("enunciadoalumno");
    enunciadomostrado.innerHTML = cuestion.enunciado;
    if(cuestioncontestada) cargacorrecciones(i); 
    else cargasoluciones(datos.cuestiones[index]);
}

function cargasoluciones(cuestion){
     var divpadre=document.getElementById("solucionesalumno");
    var i=0;
    for (solucion of cuestion.soluciones){
            var divsolucion=document.createElement("div");
            divpadre.appendChild(divsolucion);
            divsolucion.setAttribute("class","solucion");
            var Id="solucion"+i;
            divsolucion.setAttribute("id",Id);
            var nuevasol=document.createTextNode("Solucion");
            divsolucion.appendChild(nuevasol);
            var p=document.createElement("p");
            divsolucion.appendChild(p);
            p.innerHTML=solucion.solucion;
            var checkbox=document.createElement("input");
            divsolucion.appendChild(checkbox);
            checkbox.setAttribute("type","checkbox");
            checkbox.setAttribute("name","correcta");
            checkbox.setAttribute("checked",true);
            var correcta=document.createTextNode("Correcta");
            divsolucion.appendChild(correcta);
            var botoncorregir=document.createElement("input");
            divsolucion.appendChild(botoncorregir);
            botoncorregir.setAttribute("value","Corregir");
            botoncorregir.setAttribute("onclick","corregirsolucion(event)");
            botoncorregir.setAttribute("type","button");

            if(solucion.correcta!=true) razonamientosalumno(solucion,Id);
            i++; 
    } 
}

function razonamientosalumno(solucion,Id){
    
    var nrazonaminetos=solucion.razonamientos.length; 
    var divsolucion=document.getElementById(Id);
    var divrazonamientos=document.createElement("div");
    divsolucion.appendChild(divrazonamientos);
    divrazonamientos.setAttribute("class","razonamientos");
    var divprpuesta=document.createElement("div");
    divrazonamientos.appendChild(divprpuesta);
    divprpuesta.setAttribute("class","propuestarazonamiento");
    var propuesta=document.createTextNode("Propuesta razonamiento");
    divprpuesta.appendChild(propuesta);
    var propuestatexto=document.createElement("input");
    propuestatexto.setAttribute("type","text");
    divprpuesta.appendChild(propuestatexto);
    propuestatexto.setAttribute("class","textopropuesta");
    var botoncorregir=document.createElement("input");
    divprpuesta.appendChild(botoncorregir);
    botoncorregir.setAttribute("value","Enviar respuesta");
    botoncorregir.setAttribute("type","button");
    botoncorregir.setAttribute("onclick","muestrarazonamientos(event)");
    
    for(i=0;i<nrazonaminetos;i++){
            var divrazonamiento=document.createElement("div");
            divrazonamientos.appendChild(divrazonamiento);
            divrazonamiento.setAttribute("class","razonamientoalumno");
            var razonamiento=document.createTextNode("Razonamiento");
            divrazonamiento.appendChild(razonamiento);
            var p=document.createElement("p");
            divrazonamiento.appendChild(p);
            p.innerHTML=solucion.razonamientos[i].justificacion;
            var checkbox=document.createElement("input");
            divrazonamiento.appendChild(checkbox);
            checkbox.setAttribute("type","checkbox");
            checkbox.setAttribute("checked","true");
            var justificado=document.createTextNode("Justificado");
            divrazonamiento.appendChild(justificado);
            var botoncorregir=document.createElement("input");
            divrazonamiento.appendChild(botoncorregir);
            botoncorregir.setAttribute("value","Corregir");
            botoncorregir.setAttribute("type","button");
            botoncorregir.setAttribute("onclick","corregirrazonamiento(event)");
        }
    }

function muestrasoluciones(){
    var solucionesamostrar=document.getElementById("solucionesalumno");
    solucionesamostrar.style.display = "block";
    var enviadoprofe=document.createTextNode("Enviado a profesor para corrección");
    var propuesta=document.getElementById("propuestadesolucion");
    propuesta.getElementsByTagName("input")[0].readOnly=true;
    var boton=propuesta.getElementsByTagName("input")[1];
    propuesta.removeChild(boton);
    propuesta.appendChild(enviadoprofe);
}

function muestrarazonamientos(event){
    var propuesta=event.target.parentElement;
    var razonamientos=propuesta.parentElement;
    var divrazonamientos=razonamientos.getElementsByClassName("razonamientoalumno");
    var longitud=divrazonamientos.length;
    for(var i=0;i<longitud;i++){
        divrazonamientos[i].style.display="block";
    }
    propuesta.getElementsByTagName("input")[0].readOnly=true;
     var boton=propuesta.getElementsByTagName("input")[1];
    var enviadoprofe=document.createTextNode("Enviado a profesor para corrección");
    propuesta.removeChild(boton);
    propuesta.appendChild(enviadoprofe);
}

function corregirsolucion(event){
    var enunciado=localStorage.getItem("seleccionadaalumno");
    var padre=event.target.parentElement;
    var solucioncorregir=padre.getElementsByTagName("p")[0].innerHTML;
    var datos = JSON.parse(window.localStorage.getItem("datos"));
    var index=datos.cuestiones.map(function(x){return  x.enunciado}).indexOf(enunciado);
    var cuestion=datos.cuestiones[index];
    var csol=cuestion.soluciones.map(function(x){return  x.solucion}).indexOf(solucioncorregir);
    var correcta=cuestion.soluciones[csol].correcta;
    var correctaalumno=padre.getElementsByTagName("input")[0].checked;
    var boton=padre.getElementsByTagName("input")[1];
    var checkbox=padre.getElementsByTagName("input")[0];
    boton.setAttribute("type","text");
    boton.setAttribute("readOnly",true);
    checkbox.setAttribute("disabled",true);
    boton.removeAttribute("onclick");
    if(correcta!=correctaalumno)
        boton.setAttribute("value","  ¡Fallo!"); 
    else
        boton.setAttribute("value","  ¡Acierto!");        
 if(!correcta) padre.getElementsByClassName("razonamientos")[0].style.display="block";
}

function corregirrazonamiento(event){
    var enunciado=localStorage.getItem("seleccionadaalumno");
    var padre=event.target.parentElement;
    var razonamientocorregir=padre.getElementsByTagName("p")[0].innerHTML;
    var datos = JSON.parse(window.localStorage.getItem("datos"));
    var index=datos.cuestiones.map(function(x){return  x.enunciado}).indexOf(enunciado);
    var cuestion=datos.cuestiones[index];
    var divrazonamientos=padre.parentElement;
    var divsolucion=divrazonamientos.parentElement;
    var solcuionrazonamiento=divsolucion.getElementsByTagName("p")[0].innerHTML;
    var csol=cuestion.soluciones.map(function(x){return  x.solucion}).indexOf(solcuionrazonamiento);
    var cuestionsolraz=cuestion.soluciones[csol];
    var indexraz=cuestionsolraz.razonamientos.map(function(x){return x.justificacion}).indexOf(razonamientocorregir);
    var correcta=cuestion.soluciones[csol].razonamientos[indexraz].justificada;
    var correctaalumno=padre.getElementsByTagName("input")[0].checked;
    var checkbox=padre.getElementsByTagName("input")[0];
    var boton=padre.getElementsByTagName("input")[1];
    boton.setAttribute("type","text");
    boton.setAttribute("readOnly",true);
    boton.removeAttribute("onclick");
    checkbox.setAttribute("disabled",true);
    if(correcta!=correctaalumno)
        boton.setAttribute("value","  ¡Fallo!");
    else
        boton.setAttribute("value","  ¡Acierto!");
            
}

function guardardatosalumno(){
     var enunciadoenviado= document.getElementById("enunciadoalumno").innerHTML;
    var datos = JSON.parse(window.localStorage.getItem("datos"));
    var alumno=JSON.parse(window.localStorage.getItem("usuarioRegistrado"));
    var nombrealumno=alumno.nombre;
    var solpropuesta=document.getElementById("solucion propuesta").value;
    var corregida=false;
    var h=[];
    var todaslassoluciones=document.getElementsByClassName("solucion");
    for(i=0;i<todaslassoluciones.length;i++){
        var solucion=todaslassoluciones[i].getElementsByTagName("p")[0].innerHTML;
        var correcta=todaslassoluciones[i].getElementsByTagName("input")[1].value;
        var propuestaraz="";
            if(todaslassoluciones[i].getElementsByClassName("propuestarazonamiento")[0]!=null)
                    propuestaraz=todaslassoluciones[i].getElementsByClassName("propuestarazonamiento")[0].getElementsByTagName("input")[0].value;
        var todoslosrazonamientos=todaslassoluciones[i].getElementsByClassName("razonamientoalumno");
        var razonaminetos=[];
        for(j=0;j<todoslosrazonamientos.length;j++){
                    var razonamiento=todoslosrazonamientos[j].getElementsByTagName("p")[0].innerHTML;
                    var marcadaalumno=todoslosrazonamientos[j].getElementsByTagName("input")[0].checked;
                    var rcorrecto=todoslosrazonamientos[j].getElementsByTagName("input")[1].value;
                    razonaminetos.push({razonamiento: razonamiento, correctoa:rcorrecto , marcada:marcadaalumno});
                }
        var marcadas=todaslassoluciones[i].getElementsByTagName("input")[0].checked;
        h.push({solucion : solucion, eleccioncorrecta: correcta, marcadaa:marcadas, razonamientos: razonaminetos, razonamientopropuesto:{razprorp:propuestaraz, prcorregido:false, errorraz:"Correcta"}});    
    }
     var npropuestas=datos.propuestas.length;
        var calve;
        if(datos.propuestas[0]==undefined)calve=0;
        else  calve=datos.propuestas[npropuestas-1].clave+1;
    datos.propuestas.push({clave: calve, alumno: nombrealumno,enunciado: enunciadoenviado, solucionpropuesta:{sprop: solpropuesta, pscorregida: false, serror:"Correcta"}, soluciones : h});
     window.localStorage.setItem("datos", JSON.stringify(datos));
    localStorage.removeItem("seleccionadaalumno");
}
 
function cargacorrecciones(posicion){
    var datos = JSON.parse(window.localStorage.getItem("datos"));
    var propuesa=datos.propuestas[posicion];
    var sopropuestad=document.getElementById("propuestadesolucion");
    var solucionnp=sopropuestad.getElementsByTagName("input")[0];
    solucionnp.value=propuesa.solucionpropuesta.sprop;
    solucionnp.setAttribute("readOnly",true);
    var botonp=sopropuestad.getElementsByTagName("input")[1];
    botonp.setAttribute("type","text");
    botonp.removeAttribute("onclick");
    if(!propuesa.solucionpropuesta.pscorregida) botonp.setAttribute("value","Pendiente de corrección");
    else botonp.setAttribute("value",propuesa.solucionpropuesta.serror);
    botonp.setAttribute("readOnly",true);
    var soluciones=document.getElementById("solucionesalumno");
    soluciones.style.display = "block";
    for(var i=0;i<propuesa.soluciones.length;i++){
            var div=document.createElement("div");
            soluciones.appendChild(div);
            var solutexto=document.createTextNode("solucion");
            div.appendChild(solutexto);
            var p=document.createElement("p");
            div.appendChild(p);
            p.innerHTML=propuesa.soluciones[i].solucion;
            var correct=document.createTextNode("Correcta");
            div.appendChild(correct);
            var checkbox=document.createElement("input");
            checkbox.setAttribute("type","checkbox");
            div.appendChild(checkbox);
            checkbox.checked=propuesa.soluciones[i].marcadaa;
            checkbox.setAttribute("disabled",true);
            var correccion=document.createTextNode(propuesa.soluciones[i].eleccioncorrecta);
            div.appendChild(correccion);
            var divraz=document.createElement("div");
            div.appendChild(divraz);
            divraz.setAttribute("class","todoslosrazonamientos");
            for(var j=0;j<propuesa.soluciones[i].razonamientos.length;j++){
                    var divrz=document.createElement("div");
                    divraz.appendChild(divrz);
                    var raztex=document.createTextNode("Razonamiento");
                    divrz.appendChild(raztex);
                    var razonamiento=document.createElement("input");
                    divrz.appendChild(razonamiento);
                    razonamiento.setAttribute("type","text");
                    razonamiento.setAttribute("readOnly",true);
                    razonamiento.setAttribute("value",propuesa.soluciones[i].razonamientos[j].razonamiento);
                    var chckbox=document.createElement("input");
                    divrz.appendChild(chckbox);
                    chckbox.checked=propuesa.soluciones[i].razonamientos[j].marcada;
                    chckbox.setAttribute("disabled",true);
                    chckbox.setAttribute("type","checkbox");
                    var c=document.createTextNode("Justificada");
                    divrz.appendChild(c);
                    var correccion=document.createTextNode(propuesa.soluciones[i].razonamientos[j].correctoa);
                    divrz.appendChild(correccion);
                }
       if(propuesa.soluciones[i].razonamientopropuesto.razprorp!=""){
                var divrpropuesto=document.createElement("div");
                divraz.appendChild(divrpropuesto);
                var texto=document.createTextNode("Propuesta razonamiento");
                divrpropuesto.appendChild(texto);
                var textorpropuesto=document.createElement("input");
                divrpropuesto.appendChild(textorpropuesto);
                textorpropuesto.setAttribute("readOnly",true);
                textorpropuesto.setAttribute("type","text");
                textorpropuesto.setAttribute("value",propuesa.soluciones[i].razonamientopropuesto.razprorp);
                var c=document.createElement("input");
                divrpropuesto.appendChild(c);
                c.setAttribute("readOnly",true);
                c.setAttribute("type","text");
                if(!propuesa.soluciones[i].razonamientopropuesto.prcorregido) c.setAttribute("value","Pendiente de corrección");
                    else c.setAttribute("value",propuesa.soluciones[i].razonamientopropuesto.errorraz);
       }
    }
    var form=document.getElementsByTagName("form")[0];
    var boton=form.getElementsByTagName("input")[0].removeAttribute("onclick");
}

