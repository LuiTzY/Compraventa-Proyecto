const ProductoModel = require('../models/producto');

const ProductoController = {
    home:(req,res)=>{
        return res.status(200).send({response:"La ruta para los productos funciona correctamente"})
    },
    createProducto: async(req, res)=>{
        const {nombre, } = req.body;

        try{
            /* Se hace una solicitud asincrona para determinar si el producto ya existe, se utiliza await para saber la espera de este resultado,
            y para verificar la existencia de un usuario se utiliza el correo, ya que para cada usuario este va a ser unico 
            */
            
            const productoExistente = await ProductoModel.findOne({where:{nombre:product.nombre}})
            //Si este existe no se creara uno nuevo
            if (productoExistente){
               return res.status(404).send({error:"Este producto ya ha sido creado"})
            }
            //en el caso de que no exista el correo en la base de datos, se va a crear un usuario y almacenar en la BD
            const producto = await ProductoModel.create({
                nombre: nombre,
                email: email,
                password: password
            })
            // se envian los datos almacenados en la BD al servidor como respuesta
            return res.status(200).send({user:user})
        }
        // se capturan posibles errores 
        catch(err){
            res.status(500).send({message:`Ha ocurrido un error con la solicitud ${err}`})  
        }
    }
}

module.exports = ProductoController;



