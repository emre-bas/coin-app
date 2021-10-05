const schema = new mongoose.Schema({
	name: { type:String, required:true, unique:true, minlength:1, maxlength:32, trim:true,
        match:/^([0-9a-z_]*)$/,
        validate: {
            validator: (v)=> (mongoose.Types.ObjectId.isValid(v))? false : true,
            message:"Name cannot be ObjectId!",
        },
    },
    password: { type:String, required:true, minlength:6, maxlength:64, },
    balance: { type:Number, required:true, min:0, default:0, },
},mongoose.schemaOptions);

module.exports = mongoose.model("Wallet", schema, "wallets");