import {body , validationResult } from "express-validator"


const validateResult =  (req , res , next)=>{

    const errors = validationResult(req);

   if (!errors.isEmpty()){

    return res.status(400).json({
        errors : errors.array()
    })
   }

   next()

}


const validateCreateProduct = [

 body("title")
    .trim()
    .notEmpty()
    .withMessage("Title is required.")
    .isLength({ min: 3, max: 100 })
    .withMessage("Title must be between 3 and 100 characters."),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Description is required.")
    .isLength({ min: 20, max: 2000 })
    .withMessage("Description must be between 20 and 2000 characters."),

  body("brand")
    .trim()
    .notEmpty()
    .withMessage("Brand is required.")
    .isLength({ min: 2, max: 50 })
    .withMessage("Brand must be between 2 and 50 characters."),

  body("battery")
    .trim()
    .notEmpty()
    .withMessage("Battery information is required.")
    .isLength({ min: 2, max: 100 })
    .withMessage("Battery information is too long."),

  body("display")
    .trim()
    .notEmpty()
    .withMessage("Display information is required.")
    .isLength({ min: 2, max: 100 })
    .withMessage("Display information is too long."),

  body("categoryId")
    .notEmpty()
    .withMessage("Category is required.")
    .isMongoId()
    .withMessage("Invalid category."),
    validateResult




]



 const validateProductVariant = [
//   body("variants")
//     .isArray({ min: 1 })
//     .withMessage("At least one product variant is required."),

  body("variants.*.color")
    .trim()
    .notEmpty()
    .withMessage("Color is required.")
    .isLength({ min: 2, max: 30 })
    .withMessage("Color must be between 2 and 30 characters."),

  body("variants.*.ram")
    .trim()
    .notEmpty()
    .withMessage("RAM is required.")
    .isLength({ min: 2, max: 20 })
    .withMessage("Invalid RAM value."),

  body("variants.*.storage")
    .trim()
    .notEmpty()
    .withMessage("Storage is required.")
    .isLength({ min: 2, max: 20 })
    .withMessage("Invalid storage value."),

  body("variants.*.price")
    .notEmpty()
    .withMessage("Price is required.")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number."),

  body("variants.*.compareAtPrice")
    .optional({ nullable: true })
    .isFloat({ min: 0 })
    .withMessage("Compare at price must be a positive number."),

  body("variants.*.stock")
    .notEmpty()
    .withMessage("Stock is required.")
    .isInt({ min: 0 })
    .withMessage("Stock must be 0 or greater."),

  body("variants.*.sku")
    .trim()
    .notEmpty()
    .withMessage("SKU is required.")
    .isLength({ min: 3, max: 50 })
    .withMessage("SKU must be between 3 and 50 characters."),

  body("variants.*.images")
    .isArray({ min: 1 })
    .withMessage("At least one image is required."),

  body("variants.*.images.*")
    .isURL()
    .withMessage("Each image must be a valid URL."),

  body("variants.*.status")
    .optional()
    .isIn(["active", "out_of_stock", "archived"])
    .withMessage("Invalid status."),

  body("variants.*.soldCount")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Sold count must be 0 or greater."),

  body("variants.*.isDefaultVariant")
    .optional()
    .isBoolean()
    .withMessage("isDefaultVariant must be a boolean."),
    validateResult
];


const validateAddVariant = [

  body("color")
    .trim()
    .notEmpty()
    .withMessage("Color is required.")
    .isLength({ min: 2, max: 30 })
    .withMessage("Color must be between 2 and 30 characters."),

  body("ram")
    .trim()
    .notEmpty()
    .withMessage("RAM is required.")
    .isLength({ min: 2, max: 20 })
    .withMessage("Invalid RAM value."),

  body("storage")
    .trim()
    .notEmpty()
    .withMessage("Storage is required.")
    .isLength({ min: 2, max: 20 })
    .withMessage("Invalid storage value."),

  body("price")
    .notEmpty()
    .withMessage("Price is required.")
    .isFloat({ min: 0 })
    .withMessage("Price must be a positive number."),

  body("currency")
    .trim()
    .notEmpty()
    .withMessage("Currency is required.")
    .isIn(["NPR", "USD", "EUR"])
    .withMessage("Invalid currency."),

  body("compareAtPrice")
    .optional({ nullable: true, checkFalsy: true })
    .isFloat({ min: 0 })
    .withMessage("Compare at price must be a positive number."),

  body("stock")
    .notEmpty()
    .withMessage("Stock is required.")
    .isInt({ min: 0 })
    .withMessage("Stock must be 0 or greater."),

  body("sku")
    .trim()
    .notEmpty()
    .withMessage("SKU is required.")
    .isLength({ min: 3, max: 50 })
    .withMessage("SKU must be between 3 and 50 characters."),

  body("isDefaultVariant")
    .optional()
    .isBoolean()
    .withMessage("isDefaultVariant must be a boolean."),

  validateResult
];


export {
    validateCreateProduct,
    validateProductVariant,
    validateAddVariant
}