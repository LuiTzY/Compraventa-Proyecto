import multer from "multer";
const uploadDir = '/src/uploads/';
const upload = multer({ dest: uploadDir });

export const uploadProductImage = async (req, res, next) => {
   
    try {
         await upload.single("productImage")(req, res, function (err) {
            if(!req.file){return res.status(404).send({message:"No image provided"})};
            if (err) {
                // Si ocurre un error al cargar la imagen, se maneja aqui
                return res.status(500).send({ message: "Error to load image" });
            }
            //se pasa al siguiente middleware
            next();
        });
        //se capturan errores
    } catch (error) {
        return res.status(500).send({ message: `Ha ocurrido un error ${error}` });
    }
};
