import ProductoModel from '../models/product.js';
const ProductController = {
    home:(req,res)=>{
        return res.status(200).send({response:"La ruta para los productos funciona correctamente"});
    },
    createProduct: async(req, res)=>{
        const {product_name, product_stock, product_description, product_category, product_price} = req.body;
        const productImage = req.file.path;
        try{
            /* Se hace una solicitud asincrona para determinar si el producto ya existe, se utiliza await para saber la espera de este resultado,
            y para verificar la existencia de un usuario se utiliza el correo, ya que para cada usuario este va a ser unico 
            */
            
            const productoExistente = await ProductoModel.findOne({product_name:product_name});
            //Si este existe no se creara uno nuevo
            if (productoExistente){
               return res.status(404).send({error:"Este producto ya ha sido creado"});
            }
            //en el caso de que no exista el producto en la base de datos, se va a crear un producto nuevo y almacenar en la BD
            const newProduct = await new ProductoModel({
                product_name:product_name,
                product_stock:product_stock,
                product_description:product_description,
                product_category:product_category,
                product_price:product_price,
                product_image:productImage
            });
            
            // se envian los datos almacenados en la BD al servidor como respuesta
            await newProduct.save();
            return res.status(201).send({product:newProduct});
        }
        // se capturan posibles errores 
        catch(err){
            res.status(500).send({message:`Ha ocurrido un error con la solicitud ${err}`});  
        }
    },
    //se declara como una funcion async ya que esperara ejecutarse despues de recibir los datos esperados por el await
    updateProductById: async (req, res)=>{
        // id del producto a actualizar
        var product_id = req.params.id;

        const productToUpdate = req.body;
        //Se solicita los datos a la bd
        const productExists =  await ProductoModel.findOne({_id:product_id});
        
        //Se hace una solicitud a la bd para saber si ya el producto esta creado
        if(!productExists){
            return res.status(404).send("El producto no existe")
        }
        await ProductoModel.updateOne({_id:product_id},{$set:{productToUpdate}})
        .then((productUpdated)=>{
            // Se verifica si modifiedCount no es mayor a 0 quiere decir que no se hicieron cambios en el documento
            if(!productUpdated.modifiedCount > 0 ){
                return res.status(409).send({errorUpdate:"No se ha podido actualizar el producto"});
            }
            //De lo contrario se manda el producto creado
            return res.status(201).send({productUpdated:productUpdated});

        })
        .catch(err=>{
            //Se capturan posibles errores
            return res.status(500).send({serverError:`Ha ocurrido un error en el servidor lo sentimos ${err}`});
        })
    },
    deleteProductById: async (req, res)=>{
        // Producto a eliminar
        const product_id = req.params.id;
        // Consulta para verificar si el producto a eliminar existe en la base de datos
        const productExists = await ProductoModel.findOne({_id:product_id});
        // Si no existe, se manda la respuesta
        if(!productExists){
            return res.status(404).send({error:"No se puede eliminar el producto ya que no existe"});
        }
        // Si existe, se elimina
        await ProductoModel.deleteOne({_id:product_id})
        .then((productDeleted)=>{
            //En el caso de que el producto no se pueda eliminar 
            if(!productDeleted.deletedCount > 0){
                return res.status(409).send({error:"No se ha podido elminar el documento"});
            }
            // Producto eliminado
            return res.status(204).send("Se ha eliminado correctamente el producto");

        })
        //Posibles errores
        .catch(err=>{
            return res.status(500).send({serverError:`Ha ocurrido un error con el servidor ${err}`});
        })
    },
    getProductById: async (req,res)=>{
        const productId = req.params.id;
        const product = await ProductoModel.findById(productId)
        .then((product)=>{
            if(!product){
                return res.status(404).send({invalidId:"El producto consultado no existe"});
            }
            return res.status(200).send({product:product});
        })
        .catch(err=>{
            return res.status(500).send({error:`Ha ocurrido un error con su solicitud ${err}`});
        })
        
    },
    getProducts: async (req,res)=>{
        const products = await ProductoModel.find();
        try{
            if(!products){
                return res.status(409).send({conflictError:'No se pueden obtener los productos'});
            }
            return res.status(200).send({products:products});
        }
        catch(err){
            return res.status(500).send({serverError:`Ha ocurrido un error con el servidor ${err}`});
        }
        
    },
    createMultipleProducts: async (req,res)=>{
        const products = req.body;
        await ProductoModel.insertMany(products)
        .then((productsStoreds)=>{
            if(productsStoreds.result.ok === 1){
                return res.status(201).send({productsStoreds:`Se han insertado los productos de manera correcta ${productsStoreds}`});
            }
            return res.status(409).send({conflictError:"No se pudieron insertar los documentos"})
        })
        .catch((err)=>{
            return res.status(500).send({err:`Ha ocurrido un error: ${err}`});
        })
    }
}
//Insertar varios productos
//Se exporta la configuracion del productController
export default ProductController;



