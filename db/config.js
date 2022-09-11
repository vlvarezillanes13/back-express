const  mongoose  = require("mongoose");

const dbConnection = async() => {
    try{
        await mongoose.connect( process.env.BD_CNN);

        console.log('Base de datos Online');
    }catch(errors){
        console.log(errors);
        throw new Error('El error a la hora de inicializar DB');
    }
}


module.exports = {
    dbConnection,
}