var count = 0
var array = []
var Element_Array = []


function Full_Color(tamanho){
    var Primeiro = "#"
    var Caracter = "0123456789abcdef"
    for(var i = 0 ; i < tamanho; i++){
        Primeiro += Caracter.charAt(Math.floor(Math.random() * Caracter.length))
    }
    return Primeiro
}

document.getElementById("Add_Inputs").addEventListener("click", function () {
        var Value = document.createElement("input")
        var Element = document.createElement("input")
        Element.placeholder = `Insira o Elemento ${count} (senha,codigo,img)`
        Value.placeholder = `Insira o Valor ${count} (035,nome,href)`
        Value.id = `value${count}`
        Element.id = `Element${count}`
        count++
        document.getElementById("Conteudo_Input").append(Value,Element)
})

document.getElementById("All_Delete").addEventListener("click",function(){
    document.getElementById("Conteudo_Input").innerHTML = ""
})

document.getElementById("Btn_Open_Close").addEventListener("click",function(){
    document.getElementById("Editar_Btn").style.display = "none"
    document.getElementById("Enviar").style.display = "block"
    var Verification = document.getElementById("Body_Input").className
    var Elemento = document.getElementById("Body_Input")
    if(Verification == 0){
        Elemento.style.display = "block"
        Elemento.className = "1"
    }else{
        Elemento.style.display = "none"
        Elemento.className = "0"
    }
})

document.getElementById("Diminuir_Inputs").addEventListener("click",function(){
    var Quantidade = document.querySelectorAll("#Conteudo_Input > input")
    var RemoveItem = (parseInt(Quantidade.length) / 2) - 1 
    console.log(RemoveItem);
    document.getElementById(`value${RemoveItem}`).remove()
    document.getElementById(`Element${RemoveItem}`).remove()
    array.slice(RemoveItem,1)
})

function Enviar() {
    alert("Item Inserido ")
    var Quantidade = document.querySelectorAll("#Conteudo_Input > input")

    for (var i = 0; i < parseInt(Quantidade.length ) - 1; i++) {
        var Valores = document.getElementById(`value${i}`).value
        array.push(Valores)
        var Elements = document.getElementById(`Element${i}`).value
        Element_Array.push(Elements)
    }

    $.ajax({
        url: "/Criar",
        type: "POST",
        contentType: "application/json",
        data: JSON.stringify({
            "url": document.getElementById("Url").value,
            "Element": Element_Array,
            "Conteudo": array,
            "Evento": document.getElementById("Evento").value
        })
    })

    array = []
    Element_Array = []
    location.reload()
}
fetch("/Fetch").then((response) => response.json().then((dados) => {
    for (var i = 0; i < dados.length; i++) {
        var Caixa = document.createElement("div")
        var Titulo = document.createElement("h1")
        var Conteudos = document.createElement("h2")
        var Conteudos2 = document.createElement("h4")
        var Event_Cont = document.createElement("h6")
        var Click = document.createElement("button")
        var Editar = document.createElement("button")
        var Remove = document.createElement("button")
        var Comandos = ["Access","Code_Download","CodeFont","Search_Content"]
        var Selecionar = document.createElement("select")
        Selecionar.id = `Escolhas${i}`
        for(var j = 0 ; j < Comandos.length; j++){
            var Opt = document.createElement("option")
            Opt.innerText = Opt.value = Comandos[j]
            Selecionar.append(Opt)
        }

        Click.innerText = "Enviar"
        Click.className = dados[i].id
        Click.id = Editar.id = i  
        Remove.id = Editar.classList = dados[i].id
        Editar.innerText = "Editar"
        Remove.innerText = "Remove"

        Editar.addEventListener("click",function(){
            document.getElementById("Editar_Btn").className = this.classList
            document.getElementById("Body_Input").style.display = "block"
            document.getElementById("Enviar").style.display = "none"
            document.getElementById("Editar_Btn").style.display = "block"
            document.getElementById("Editar_Btn").style.marginTop = "30vh"

            document.getElementById("Url").value = dados[this.id].Url
            document.getElementById("Evento").value = dados[this.id].Evento

            var Quantidade = String(dados[this.id].Element).replace("[","").replace("]","").split(",")
            var Quantidade_Conteudo = String(dados[this.id].Conteudo).replace("[","").replace("]","").split(",")
            for(var n = 0 ; n < Quantidade.length ; n++){
                var Value = document.createElement("input")
                var Element = document.createElement("input")
                Element.placeholder = `Insira o Elemento ${Quantidade} (senha,codigo,img)`
                Value.placeholder = `Insira o Valor ${Quantidade} (035,nome,href)`
                Value.id = `value${n}`
                Element.id = `Element${n}`
                document.getElementById("Conteudo_Input").append(Value,Element)
            }


            for (var i = 0; i < Quantidade.length; i++) {
                document.getElementById(`Element${i}`).value = String(Quantidade[i]).replace("[","").replace("]","").replace(/'/g,"").split(",")
                document.getElementById(`value${i}`).value = String(Quantidade_Conteudo[i]).replace("[","").replace("]","").replace(/'/g,"").split(",")
            }
        })

        document.getElementById("Editar_Btn").addEventListener("click",function(){
            var Length = document.querySelectorAll("#Conteudo_Input > input")
            for (var i = 0; i < (parseInt(Length.length) / 2) ; i++) {
                var Valores = document.getElementById(`value${i}`).value
                array.push(Valores)
                var Elements = document.getElementById(`Element${i}`).value
                Element_Array.push(Elements)
            }

            $.ajax({
                url: "/Editar",
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify({
                    "id": this.className,
                    "url": document.getElementById("Url").value,
                    "Element": Element_Array,
                    "Conteudo": array,
                    "Evento": document.getElementById("Evento").value
                })
            })
        
            array = []
            Element_Array = []
            location.reload()
        })

        Remove.addEventListener("click",function(){
            location.reload()
            $.ajax({
                url: `/Remove`,
                type: "POST",
                contentType: "application/json",
                data: JSON.stringify({
                    "Id_Buscar": parseInt(this.id) 
                })
            })
        })

        Click.addEventListener("click",function(){
           var Retornar =  document.getElementById(`Escolhas${this.id}`).value
           $.ajax({
            url: `/${Retornar}`,
            type: "POST",
            contentType: "application/json",
            data: JSON.stringify({
                "Id_Buscar": parseInt(this.className)
            })
        })
        })

        var ConteudoRenovalvel = String(dados[i].Conteudo).replace("[","").replace("]","").split(",")
        Titulo.innerText = "Url: " + dados[i].Url
        Conteudos.innerText = "Conteúdo: " + ConteudoRenovalvel
        Conteudos2.innerText = "Elementos: " + String(dados[i].Element).replace("[","").replace("]","").split(",")
        Caixa.style.background = Full_Color(6)
        Caixa.style.borderColor = Full_Color(6)
        Event_Cont.innerText = "Evento: " + String(dados[i].Evento).replace("[","").replace("]","").split(",")
        Caixa.append(Titulo,Conteudos,Conteudos2,Event_Cont,Selecionar,Click,Editar,Remove)
        document.getElementById("Conteudo").append(Caixa)
    }
}))


