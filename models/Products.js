const { Schema, model } = require("mongoose");

//schema design
const partsSchema = Schema({
    name: {
        type: String,
        required: [true, "Please provide a name of this parts"],
        unique: [true, "Name must be unique!"],
        trim: true,
        minLength: [3, "Name must be at least 3 character!"],
        maxLength: [100, "Name is large"]
    },
    description: {
        type: String,
        required: true
    },
    price: {
        type: Number,
        required: true,
        min: [0, "price can't be negative"]
    },
    unit: {
        type: String,
        required: true,
        enum: {
            values: ["kg", "liter", "pcs"],
            message: "Unit value can't be {VALUE} , must be kg/liter/pcs."
        }
    },
    quantity: {
        type: Number,
        required: true,
        min: [0, "quantity can't be negative."],
        validate: {
            validator: (value) => {
                const isInteger = Number.isInteger(value)
                if (isInteger) {
                    return true;
                }
                else {
                    return false
                }
            },
            message: "Quantity must be integer!"
        }
    },
    status: {
        type: String,
        required: true,
        enum: {
            values: ["in-stock", "out-of-stock", "discontinued"],
            message: "status can't be {VALUE} "
        }
    },
    /* createdAt:{
      type:Date,
      default:Date.now
    },
    updatedAt:{
      type:Date,
      default:Date.now
    } 
    supplier: {
      type: Schema.Types.ObjectId,
      ref: "supplier"
    },
    categories: [{
      name: {
        type: String,
        required: true
      },
      _id: Schema.Types.ObjectId
    }]
    */
}, { timestamps: true })

//mongoose middleware for saving data: pre / post

// pre middleware

partsSchema.pre("save", function (next) {
    if (this.quantity === 0) {
        this.status = "out-of-stock"
    }
    next()
})

//post middleware

partsSchema.post("save", function (doc, next) {
    console.log("after saving data!");
    next()
})

// instance methods

partsSchema.methods.logger = function () {
    console.log(`Data save for ${this.name}`);
}
//SCHEMA -> MODEL -> QUERY
//create a model
const Product = model("Product", partsSchema)

module.exports = Product