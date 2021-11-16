const express = require('express')
const app = express()
const port = 5000

app.set('view engine', 'ejs')

app.get('/', (req, res) => {
    Experiencia.findAll()
    .then((exp) => {
        console.log(exp)
        res.render('index', {
            experiencias:exp,
            tituloexp: 'EXPERIENCIA LABORAL'
        })
        console.log('hola mundo')
    })
    
})

app.use(express.static('https://bryanalexis19.github.io/paginapersonalheroku/static/'))

app.listen(port, () => {
  console.log(`Corriendo en http://localhost:${port}`)
})

//============SEQUELIZE====================
//-----Conectar a la bd
const Sequelize = require('sequelize');
/* const sequelize = new Sequelize({
    dialect:'sqlite',
    storage:'./database.sqlite'
}) */

const sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    }
  }
  );

sequelize.authenticate()
.then(()=>{
    console.log("conexion establecida");
})
.catch(err=>{
    console.log("error al conectarse");
})

//-----Creacion de un modelo
const Experiencia = sequelize.define(
    'experiencia',
    {
        puesto:Sequelize.STRING,        
        empresa:Sequelize.STRING,
        descripcion:Sequelize.STRING,
        periodo:Sequelize.STRING
    }
  );
  
  //migración y poblado de data
  sequelize.sync({force:true})
  .then
  (
    ()=>
    {
        console.log("BD y tabla creada")
        Experiencia.bulkCreate(
            [
                {puesto:'FullStack developer', empresa:'TI CONSULTORES', descripcion:'Desarrollador BackEnd y FrontEnd', periodo:'Diciembre 2017 - Julio 2018'},
                {puesto:'Front-end Developer', empresa:'FREELANCE', descripcion:'Desarrollador FrontEnd', periodo:'Agosto 2018 - Abril 2019'},
                {puesto:'Back-end Developer', empresa:'AGP CORP', descripcion:'Database Manager', periodo:'Marzo 2019 - Actualidad'},

            ]).then(function(){
                return Experiencia.findAll();
            }).then(function(experiencia){
                console.log(experiencia)
            })
    }
  )
