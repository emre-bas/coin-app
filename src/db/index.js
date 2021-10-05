mongoose.schemaOptions = {
	timestamps: { createdAt:"created_date", updatedAt:"updated_date", },
	toJSON: { virtuals:true, },
};

const filterWallet = (doc) => {
	return {id:doc.id, name:doc.name, balance:doc.balance, created_date:doc.created_date, updated_date:doc.updated_date };
}
const filterTransaction = (doc) => {
	return {id:doc.id, from:filterWallet(doc.from), to:filterWallet(doc.to), amount:doc.amount, fee:doc.fee, description:doc.description, created_date:doc.created_date };
}
const filterAccount = (account) => {
	return (mongoose.Types.ObjectId.isValid(account)) ? {_id:account} : {name:account};
}

const db = {
	models: {
		wallet: require("./models/wallet.js"),
		transaction: require("./models/transaction.js"),
	}
};

db.methods = {
	listWallet(limit=100,skip=0){
		return db.models.wallet.find().limit(limit*1).skip(skip*1)
		.then(wallets=>wallets.map(x=>filterWallet(x)))
		.catch(err=>null);
	},
	getWallet(account,password){
		var filter = (!password) ? filterAccount(account) : {...filterAccount(account),password};
		return db.models.wallet.findOne(filter)
		.then(wallet=>filterWallet(wallet))
		.catch(err=>null);
	},
	addWallet(name,password){
		return new db.models.wallet({name,password}).save()
		.then(wallet=>filterWallet(wallet))
		.catch(err=>false);
	},
	setWallet(id,password,key,value){
		if(!["name","password"].includes(key)) return false;
		return db.models.wallet.updateOne({_id:id,password},{[key]:value},{runValidators:true})
		.then(res=>{
			if(res.modifiedCount>0) return true;
			return false;
		})
		.catch(err=>false);
	},
	listTransaction(limit=100,skip=0){
		return db.models.transaction.find().populate(["from","to"]).limit(limit*1).skip(skip*1).sort({created_date:-1})
		.then(transactions=>transactions.map(x=>filterTransaction(x)))
		.catch(err=>null);
	},
	send(id,password,targetId,amount,fee,description){
		console.log({id,password,targetId,amount,fee,description});
		amount = Math.max(amount,0);
		fee = Math.max(fee,0);
		return db.models.wallet.findOne({_id:id,password})
		.then(wallet=>{
			if(wallet.id!="000000000000000000000000" && wallet.balance<(amount+fee)) throw false;
			return wallet;
		})
		.then(res=>new db.models.transaction({from:id,to:targetId,amount,fee,description}).save())
		.then(transaction=>{
			return db.models.wallet.updateOne({_id:"000000000000000000000000"},{$inc:{balance:fee}},{runValidators:true})
		})
		.then(res=>{
			if(res.modifiedCount>0) return db.models.wallet.updateOne({_id:id},{$inc:{balance:-(amount+fee)}})
		})
		.then(res=>{
			if(res.modifiedCount>0) return db.models.wallet.updateOne({_id:targetId},{$inc:{balance:amount}})
		})
		.then(res=>{
			if(res.modifiedCount>0) return true;
			return false;
		})
		.catch(err=>false);
	},
};

module.exports = db;