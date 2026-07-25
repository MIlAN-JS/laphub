import multer from "multer"


const storage = multer.diskStorage({
    destination : function(req , file , cb){
        cb(null, "./public/temp")
    },

    filename : function (req , file , cb){
        cb(null , file.originalname) // try to change the original name later becasue a there ccan be multiple files of single name
    }
})

const upload  = multer({
    storage , 
    
})