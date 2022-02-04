const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database");
const Pergunta = require("./database/Pergunta");
const Resposta = require("./database/Resposta");

//DATABASE 
connection
    .authenticate()
    .then(() => {
        console.log("Banco Conectado!!!")
    })
    .catch((msgErro) => {
        console.log(msgErro);
    })


PORT = 8080;

app.set('view engine', 'ejs');  // Estou dizendo para o Express Usar o EJS com VIEW engine (renderizar HTML)
app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: false }))  //Traduz dados enviados pelo formulario (decodificaJS)
app.use(bodyParser.json());        //Comando opcional, ler dados enviados via JSON(API)


app.get("/", (req, res) => {
    Pergunta.findAll({ raw: true, order:[
        ['id','DESC']  // ASC = Crescente || DESC = Decrescente
    ]}).then(perguntas => {
        res.render("index",{
            perguntas: perguntas
        });   
    })
});

app.get("/perguntar", (req, res) => {
    res.render("perguntar");   
});

app.post("/salvarpergunta", (req, res) =>{
    var titulo = req.body.titulo;               //Body parser disponibiliza o objeto body
    var descricao = req.body.descricao;

    Pergunta.create({
        titulo: titulo, 
        descricao: descricao
    }).then(() => {
        res.redirect("/");                  //Caso esteja ok, irá redirecionar para /
    });       
});

app.get("/pergunta/:id", (req,res) => {
    var id = req.params.id;
    Pergunta.findOne({ 
        where: {id: id}
    }).then(pergunta => {
        if(pergunta != undefined) {  //Pergunta encontrada
            Resposta.findAll({
                where: {perguntaId: pergunta.id},
                order:[['id','DESC']]
            }).then(respostas => {
                res.render("pergunta",{
                    pergunta: pergunta,
                    respostas: respostas
                });
            });   
        }else{
            res.redirect("/");
        }
    });  
});


app.post("/responder", (req,res) => {
   var corpo = req.body.corpo;
   var perguntaId = req.body.pergunta;
   Resposta.create({
       corpo: corpo,
       perguntaId: perguntaId
   }).then(() => {
       res.redirect("/pergunta/" + perguntaId);
   })
})

app.listen(PORT, () => {
    console.log(`App rodando na porta ${PORT}`);
});