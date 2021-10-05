const schema = new mongoose.Schema({
	from: { type: mongoose.Types.ObjectId, ref: 'Wallet' },
	to: { type: mongoose.Types.ObjectId, ref: 'Wallet' },
	amount: { type:Number, required:true, min:0, },
	fee: { type:Number, required:true, min:0, },
	description: { type:String, maxlength:256, },
},mongoose.schemaOptions);

module.exports = mongoose.model("Transaction", schema, "transactions");