const Product = require("../models/Products")

exports.getProductService = async (filters, queries) => {
    const product = await Product.find(filters)
        .skip(queries.skip)
        .limit(queries.limit)
        .sort(queries.sortBy)
        .select(queries.select)
    const totalProducts = await Product.countDocuments(filters)
    return { totalProducts, product }
}

exports.postProductService = async (data) => {
    const result = await Product.create(data)
    return result
}

exports.updateProductService = async (productId, data) => {
    const product = await Product.findById(productId)
    const result = await product.set(data).save()
    return result
}

exports.bulkUpdateProductService = async (data) => {
    console.log(data);
    const products = []
    data.products.forEach(product => {
        products.push(Product.updateOne({ _id: product.id }, product.data))
    })
    const result = await Promise.all(products)
    return result
}

exports.deleteProductByIdService = async (id) => {
    const result = await Product.deleteOne({ _id: id })
    return result;
}

exports.bulkDeleteProductService = async (ids) => {
    console.log(ids);
    const result = await Product.deleteMany({ _id: ids })
    return result;

}