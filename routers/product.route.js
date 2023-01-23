const express = require("express")
const { getProducts, postProducts, updateProduct, bulkUpdateProduct, deleteProductById, bulkDeleteProduct } = require("../controllers/product.controller")
const router = express.Router()

router.route("/")
    .get(getProducts)
    .post(postProducts)

router.route("/bulk-update")
    .patch(bulkUpdateProduct)

router.route("/bulk-delete")
    .delete(bulkDeleteProduct)

router.route("/:id")
    .delete(deleteProductById)
    .patch(updateProduct)
module.exports = router