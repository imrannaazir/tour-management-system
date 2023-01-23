const { postProductService, getProductService, updateProductService, bulkUpdateProductService, deleteProductByIdService, bulkDeleteProductService } = require("../services/product.service")

exports.getProducts = async (req, res, next) => {
    try {
        console.log(req.query);

        // coping the query object because obj is ref type
        let filters = { ...req.query }

        //fields that we want to exclude
        const excludeFields = ["sort", "page", "limit"]
        // exclude from query object
        excludeFields.forEach(field => delete filters[field])

        const queries = {}

        // get sort string from query
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ')
            queries.sortBy = sortBy
        }

        // get select string from query
        if (req.query.field) {
            const select = req.query.field.split(',').join(' ')
            queries.select = select
        }

        // pagination
        if (req.query.page) {
            const { page = 1, limit = 10 } = req.query
            //total 50 product
            // each page 10 products
            // page 1 -> 1-10
            // page 2 -> 11-20 
            //page 3 -> 21-30(skip for page 3 first 20 product , 3-1*10= page -1 * limit )
            // page 4 -> 31-40
            //page 5 -> 41-50
            const skip = (Number(page) - 1) * Number(limit)

            queries.skip = skip
            queries.limit = Number(limit)
        }

        console.log(filters);
        let filtersString = JSON.stringify(filters)
        filtersString = filtersString.replace(/\b(gt|gte|lt|lte)\b/g, match => `$${match}`)
        filters = JSON.parse(filtersString)
        console.log(filters);
        const products = await getProductService(filters, queries)

        res.status(200).send({
            success: true,
            products: products
        })
    } catch (error) {
        res.status(400).send({
            success: false,
            error: error.message
        })
    }
}


exports.postProducts = async (req, res, next) => {
    try {
        // two way to post.
        //1. create
        const result = await postProductService(req.body)
        result.logger()
        //2.save
        // const product = new Product(req.body)
        // const result = await product.save()
        res.status(200).send({
            success: true,
            message: "successfully posted to database",
            data: result
        })
    } catch (error) {
        res.status(400).send({
            success: false,
            error: error.message
        })

    }
}

exports.updateProduct = async (req, res, next) => {
    try {
        const { id } = req.params
        const result = await updateProductService(id, req.body)
        res.status(200).send({
            success: true,
            message: "successfully updated",
            result: result
        })

    } catch (error) {
        res.status(400).send({
            success: false,
            error: error.message
        })
    }
}

exports.bulkUpdateProduct = async (req, res, next) => {
    try {
        const result = await bulkUpdateProductService(req.body)
        res.status(200).send({
            success: true,
            message: "successfully updated",
            result: result
        })

    } catch (error) {
        res.status(400).send({
            success: false,
            error: error.message
        })
    }
}

exports.deleteProductById = async (req, res, next) => {
    try {
        const { id } = req.params
        const result = await deleteProductByIdService(id)
        res.status(200).send({
            message: `Successfully deleted the product by id ${id}`,
            result: result
        })
    } catch (error) {
        res.status(400).send({
            message: `Couldn't deleted the product!`,
            error: error.message
        })

    }
}

exports.bulkDeleteProduct = async (req, res, next) => {
    try {
        const { ids } = req.body
        console.log(ids);
        const result = await bulkDeleteProductService(ids)
        if (!result.deletedCount) {
            res.status(400).send({
                message: `Couldn't deleted the products!`,
                error: error.message
            })
        }
        else {
            res.status(200).send({
                message: `Successfully deleted the product by id ${ids}`,
                result: result
            })
        }

    } catch (error) {
        res.status(400).send({
            message: `Couldn't deleted the products!`,
            error: error.message
        })
    }
}