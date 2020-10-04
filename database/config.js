const mongoose = require('mongoose');

const dbConnection = async() => {

    try {
        
        await mongoose.connect( process.env.DB_CNN, {
            useNewUrlParser: true, 
            useUnifiedTopology: true,
            useCreateIndex: true
        });

        console.log('Success: Estoy conectado a la base de datos');

    } catch (error) {
        console.log(error);
        throw new Error('Error: No me puedo conectar con la base de datos');
    }

}

module.exports = {
    dbConnection
}