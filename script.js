// Inicialização Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBjwCjJ-JEQOB5BfRUcvMfy0UvD9ouWcz8",
    authDomain: "faltasctbm.firebaseapp.com",
    projectId: "faltasctbm",
    storageBucket: "faltasctbm.firebasestorage.app",
    messagingSenderId: "319223493687",
    appId: "1:319223493687:web:d640edc2b6b3026831fbb2"
};

firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();




async function listaNomes(turmaAluno) {
    const snapshot = await db.collection("Alunos")
      .where("turma", "==", turmaAluno)
      .orderBy("nome", "asc")  // <-- Ordenação aqui
      .get();


      snapshot.forEach(doc => {
        const dados = doc.data();
      
        //console.log(dados)

        var option = document.createElement("option");
        option.value = dados.nome;
        option.innerHTML = dados.nome;

        var option2 = document.createElement("option");
        option2.value = dados.nome;
        option2.innerHTML = dados.nome;

        const query = 'optgroup[label="Turma ' + dados.turma + '"]';
        const optgroup = document.querySelector(query);

        var qualturma = "t"+dados.turma;
        document.getElementById(qualturma).appendChild(option2);

        if (optgroup) {
          optgroup.appendChild(option);
        } else {
          console.warn("Optgroup não encontrado para: Turma " + dados.turma);
        }
      
      })
}



listaNomes("11")
listaNomes("12")
listaNomes("13")
listaNomes("14")
listaNomes("21")
listaNomes("22")
listaNomes("23")
listaNomes("31")
listaNomes("32")




// Criar falta
const createDocumentWithAutoID = async (collectionName) => {
    
    //Verificação dos inputs
    var nome = document.getElementById("name").value;
    var turma;
    var data = document.getElementById("data").value;
    var justificada = document.getElementById("justificada").checked;
    var manha = document.getElementById("manha").checked;
    var tarde = document.getElementById("tarde").checked;
    var cal;

    
    const snapshots = await db.collection("Alunos")
      .where("nome", "==", nome)
      .orderBy("nome", "asc")  // <-- Ordenação aqui
      .get();


    snapshots.forEach(doc => {
      const dado = doc.data();
      turma = dado.turma;
      cal = dado.cal;

    })



    if(nome == "" || turma == "" || data == "" || cal == ""){
        alert("Todas as informações devem ser preenchidas.")
    }
    
    else{


    //Criar documento

    try {
      const newDoc = {
        nome: nome,
        turma: turma,
        data: data,
        justificada: justificada,
        manha: manha,
        tarde: tarde,
        cal: cal
      };
  
      const docRef = await db.collection(collectionName).add(newDoc);
      console.log("Documento criado com ID:", docRef.id);
      alert("Falta cadastrada com sucesso!");
      //document.getElementById("justificada").checked = false;
      //document.getElementById("manha").checked = false;
      //document.getElementById("tarde").checked = false;
    } catch (error) {
      console.error("Erro ao criar documento:", error);
    }


    }

};










async function buscarPorAluno(nomeDoAluno) {
    const snapshot = await db.collection("Faltas")
      .where("nome", "==", nomeDoAluno)
      .orderBy("data", "asc")  // <-- Ordenação aqui
      .get();
  
    if (snapshot.empty) {
      alert(`Não foram encontradas faltas cadastradas no nome desse aluno: ${nomeDoAluno}`);
      return;
    }
  
    verfaltasaluno.className = "verfaltasaluno";
  
    var section = document.getElementById("faltasalunosection");
    var turma;

    var contagemFaltas = 0;
    var faltasSemJus = 0;
  
    var faltasTotais = document.getElementById("faltasTotais");

    snapshot.forEach(doc => {
      const dados = doc.data();
      console.log(`Turma: ${dados.turma} | Data: ${dados.data} | Justificada: ${dados.justificada}`);
      
      turma = dados.turma;
      cal = dados.cal;
    
      contagemFaltas += 1;
      if(dados.justificada == false){
        faltasSemJus += 1;
      }
      
      // Assumindo que 'dados.data' é uma string no formato 'YYYY-MM-DD'
      var date = `${dados.data[8]}${dados.data[9]}/${dados.data[5]}${dados.data[6]}/${dados.data[0]}${dados.data[1]}${dados.data[2]}${dados.data[3]}`;
  
      var p = document.createElement("p");
      p.innerHTML = `Data: ${date}`;
  
      var div = document.createElement("div");
  
      var p2 = document.createElement("p");
      p2.innerHTML = "Justificada? ";
  
      var check = document.createElement("input");
      check.type = "checkbox";
      check.checked = dados.justificada;
      
      var p3 = document.createElement("p");
      if(dados.manha == true && dados.tarde == true){
        p3.innerHTML = "Periodo: manhã e tarde";
      } else if(dados.manha == true && dados.tarde == false){
        p3.innerHTML = "Periodo: manhã";
      } else if(dados.manha == false && dados.tarde == true){
        p3.innerHTML = "Periodo: tarde";
      }

      var excluir = document.createElement("button");
      excluir.innerHTML = "Excluir falta";
      excluir.id = "excluirBtn";
      
      var br = document.createElement("br");
      var br2 = document.createElement("br");
  
      section.appendChild(p);
      section.appendChild(div);
      div.appendChild(p2);
      div.appendChild(check);
      section.appendChild(p3);
      section.appendChild(excluir);
      section.appendChild(br);
      section.appendChild(br2);
      faltasTotais.innerHTML = `Faltas sem justificativa: ${faltasSemJus} | Totais: ${contagemFaltas}`

      check.addEventListener("change",()=>{
        
            db.collection("Faltas").doc(doc.id).update({
                justificada: check.checked
            })
            
            if(check.checked == true){
                faltasSemJus -= 1;
            }else if(check.checked == false){
                faltasSemJus += 1;
            }

            faltasTotais.innerHTML = `Faltas sem justificativa: ${faltasSemJus} | Totais: ${contagemFaltas}`
    })

    document.querySelector("h1").addEventListener("click",()=>{
        p.style.display = "none";
        div.style.display = "none";
        p2.style.display = "none";
        check.style.display = "none";
        p3.style.display = "none";
        excluir.style.display = "none";
        br.style.display = "none";
        br2.style.display = "none";
    })
      
    excluir.addEventListener("click",()=>{
      var resposta = prompt("Tem certeza que deseja excluir essa falta? Se sim, digte 's' ")
      if(resposta === 's'){

          var erajustificada = dados.justificada;

          db.collection("Faltas").doc(doc.id).delete()
            .then(() => {
              //console.log("Documento removido com sucesso!");
              p.style.display = "none";
              div.style.display = "none";
              p2.style.display = "none";
              check.style.display = "none";
              p3.style.display = "none";
              excluir.style.display = "none";
              br.style.display = "none";
              br2.style.display = "none";

              contagemFaltas -= 1;
              
              if(erajustificada == false){
                faltasSemJus -= 1;
              }
              
              faltasTotais.innerHTML = `Faltas sem justificativa: ${faltasSemJus} | Totais: ${contagemFaltas}`;

            })
            .catch((error) => {
              console.error("Erro ao remover documento: ", error);
              alert("Erro!")
            });
        
          }
    

      })
    
    });
  
    document.getElementById("nomeExibido").innerHTML = "Aluno: " + nomeDoAluno;
    document.getElementById("turmaExibida").innerHTML = "Turma: " + turma;
    document.getElementById("calExibido").innerHTML = "Número no CAl: " + cal;
}












async function buscarPorDia(dataDia) {
    const snapshot = await db.collection("Faltas")
      .where("data", "==", dataDia)
      .get();

    
    var date = `${dataDia[8]}${dataDia[9]}/${dataDia[5]}${dataDia[6]}/${dataDia[0]}${dataDia[1]}${dataDia[2]}${dataDia[3]}`;
    
    if (snapshot.empty) {
      alert(`Não foram encontradas faltas cadastradas nessa data: ${date}`);
      return;
    }
  
    verfaltasdia.className = "verfaltasdia";
    
    var dataespecifica = document.getElementById("dataespecifica")
    dataespecifica.innerHTML += date

    snapshot.forEach(doc => {
      const dados = doc.data();
      //console.log(`Turma: ${dados.turma} | Data: ${dados.data} | Justificada: ${dados.justificada}`);
    
      turma = dados.turma;

      idTurma = "turma" + turma

      if(dados.justificada == true){
        
        if(dados.manha == true && dados.tarde == true){
          document.getElementById(idTurma).innerHTML += dados.nome + " - " + dados.cal + " - (manha e tarde)" + " (justificada)" + '<br>'
        } else if(dados.manha == true && dados.tarde == false){
          document.getElementById(idTurma).innerHTML += dados.nome + " - " + dados.cal + " - (manha)" + " (justificada)" + '<br>'
        } else if(dados.manha == false && dados.tarde == true){
          document.getElementById(idTurma).innerHTML += dados.nome + " - " + dados.cal + " - (tarde)" + " (justificada)" + '<br>'
        }
      
      }else if(dados.justificada == false){
        
        if(dados.manha == true && dados.tarde == true){
          document.getElementById(idTurma).innerHTML += dados.nome + " - " + dados.cal + " - (manha e tarde)" + " (NÃO justificada)" + '<br>'
        } else if(dados.manha == true && dados.tarde == false){
          document.getElementById(idTurma).innerHTML += dados.nome + " - " + dados.cal + " - (manha)" + " (NÃO justificada)" + '<br>'
        } else if(dados.manha == false && dados.tarde == true){
          document.getElementById(idTurma).innerHTML += dados.nome + " - " + dados.cal + " - (tarde)" + " (NÃO justificada)" + '<br>'
        }
      
      }
      
      
      document.querySelector("h1").addEventListener("click",()=>{
        document.getElementById("turma11").innerHTML = ""
        document.getElementById("turma12").innerHTML = ""
        document.getElementById("turma13").innerHTML = ""
        document.getElementById("turma14").innerHTML = ""
        document.getElementById("turma21").innerHTML = ""
        document.getElementById("turma22").innerHTML = ""
        document.getElementById("turma23").innerHTML = ""
        document.getElementById("turma31").innerHTML = ""
        document.getElementById("turma32").innerHTML = ""
        dataespecifica.innerHTML = "Data: "
    })
    
    });
  
    document.getElementById("nomeExibido").innerHTML = "Aluno: " + dataDia;
    document.getElementById("turmaExibida").innerHTML = "Turma: " + turma;
}
















async function excluirColecao(colecao) {
  try {
    const snapshot = await db.collection(colecao).get();

    snapshot.forEach(doc => {
      //console.log(`${doc.id}:`, doc.data());
      db.collection(colecao).doc(doc.id).delete()
    });

    alert("Excluído com sucesso!")
  } catch (error) {
    //console.error(`❌ Erro ao listar documentos da coleção "${colecao}":`, error);
    alert("Erro ao excluir!")
  }
}




document.getElementById("excluirfaltas").addEventListener("click",()=>{
  var respostas = prompt("Tem certeza que deseja excluir TODAS as falta? Se sim, digte 's' ")
  if(respostas === 's'){
    
    excluirColecao("Faltas")

    }

})





document.getElementById("excluiralunos").addEventListener("click", ()=>{
  var respostass = prompt("Tem certeza que deseja excluir TODOS os alunos cadastrados? Se sim, digte 's' ")
  if(respostass === 's'){
    
    excluirColecao("Alunos")

    }
})







const createAluno = async (collectionName) => {
    
    //Verificação dos inputs
      var cadastrarname = document.getElementById("cadastrarname").value;
      var cadastrarturma = document.getElementById("cadastrarturma").value;
      var cadastrarcal = document.getElementById("cadastrarcal").value;


    //Criar documento

    try {
      
      const newDoc = {
        nome: cadastrarname,
        turma: cadastrarturma,
        cal: cadastrarcal
      };
  
      const docRef = await db.collection(collectionName).add(newDoc);
      console.log("Documento criado com ID:", docRef.id);
      alert("Aluno cadastrado com sucesso!")
    
    } 
    
    catch (error) {
      console.error("Erro ao criar documento:", error);
    }


};

document.getElementById("cadastraraluno").addEventListener("click",()=>{
  createAluno("Alunos")
  document.getElementById("cadastrarname").value = "";
  document.getElementById("cadastrarturma").value = "";
  document.getElementById("cadastrarcal").value = "";
})







var telainicio = document.querySelector(".telainicio")
var cadastrar = document.querySelector(".cadastrar")
var escolherdia = document.querySelector(".escolherdia")
var verfaltasdia = document.querySelector(".verfaltasdia")
var escolheraluno = document.querySelector(".escolheraluno")
var verfaltasaluno = document.querySelector(".verfaltasaluno")
var admcadastar = document.querySelector(".admcadastar")


cadastrar.className = "none"
escolherdia.className = "none"
verfaltasdia.className = "none"
escolheraluno.className = "none"
verfaltasaluno.className = "none"
admcadastar.className = "none"


document.getElementById("cadastrarbtn").addEventListener("click",()=>{
    telainicio.className = "none"
    cadastrar.className = "cadastrar"
})

document.getElementById("faltasdiabtn").addEventListener("click",()=>{
    telainicio.className = "none"
    escolherdia.className = "cadastrar"
    document.getElementById("inpdia").value = ""
})

document.getElementById("faltasalunobtn").addEventListener("click",()=>{
    telainicio.className = "none"
    escolheraluno.className = "cadastrar"
    document.getElementById("inpaluno").value = ""
})

document.getElementById("admcadastro").addEventListener("click",()=>{
    telainicio.className = "none"
    admcadastar.className = "admcadastrar"
})

document.getElementById("sendfaltas").addEventListener("click",()=>{
    createDocumentWithAutoID("Faltas")

    //document.getElementById("name").value = ""
    //document.getElementById("turma").value = ""
    //document.getElementById("data").value = ""
    document.getElementById("justificada").checked = false
    //document.getElementById("cal").value = ""
    document.getElementById("manha").checked = false
    document.getElementById("tarde").checked = false
})


document.getElementById("verfaltasalunobtn").addEventListener("click",()=>{
    escolheraluno.className = "none"
    var inpAluno = document.getElementById("inpaluno").value;

    if(inpAluno == ""){
        alert("Digite algum nome");
        window.location.reload();
    }else{
        buscarPorAluno(inpAluno)
    }
})

document.getElementById("verfaltasdiabtn").addEventListener("click",()=>{
    escolherdia.className = "none"
    verfaltasdia.className = "verfaltasdia"
    var inpDia = document.getElementById("inpdia").value;

    if(inpDia == ""){
        alert("Selecione alguma data");
        window.location.reload();
    }else{
        buscarPorDia(inpDia)
    }
})


document.querySelector("h1").addEventListener("click",()=>{
    cadastrar.className = "none"
    escolherdia.className = "none"
    verfaltasdia.className = "none"
    escolheraluno.className = "none"
    verfaltasaluno.className = "none"
    admcadastar.className = "none"
    telainicio.className = "telainicio"
})