var data = {
	appTitle: "Coin App",
	appText: "An Experimental Coin Application",
	apiURL: "/api",
	topbar:{
		public: [
			{text:"Transactions", icon:"far fa-list-alt", route:"/transactions"},
			{text:"Wallets", icon:"fas fa-wallet", route:"/wallets"},
			{text:"Create Wallet", icon:"fas fa-plus-square", route:"/create-wallet"},
			{text:"Login", icon:"fas fa-sign-in-alt", route:"/login"},
		],
		private: [
			{text:"Transactions", icon:"far fa-list-alt", route:"/transactions"},
			{text:"Wallets", icon:"fas fa-wallet", route:"/wallets"},
			{text:"My Wallet", icon:"fas fa-user", route:"/my-wallet"},
			{text:"Send Coin", icon:"fas fa-money-bill-wave", route:"/send-coin"},
			{text:"Logout", icon:"fas fa-sign-out-alt", route:"/logout"},
		],
	},
	myWallet: null,
	goBack(){ window.history.length > 1 ? this.$router.go(-1) : this.$router.push('/') },
	api(method,query,component){
		if(component) component.isSent = true;
		return fetch(this.apiURL+"/"+method+"?"+new URLSearchParams(query).toString())
		.then(response => response.json())
		.then(response=>{
			if(component) component.isLoaded=true;
			if(component) component.response=response;
			return response;
		})
	},
	login(wallet){
		if(wallet)
			localStorage.myWallet = JSON.stringify({id:wallet.id,password:wallet.password});
		if(localStorage.myWallet)
			this.myWallet = JSON.parse(localStorage.myWallet);
	},
	logout(){
		delete localStorage.myWallet;
		this.myWallet = null;
	},
	togglePassType(element){
		var input = element.parentElement.querySelector("input");
		var icon = element.parentElement.querySelector("i");
		if(input.type=="password"){
			input.type="text";
			icon.classList.remove("fa-eye-slash");
			icon.classList.add("fa-eye");
		}else{
			input.type="password";
			icon.classList.remove("fa-eye");
			icon.classList.add("fa-eye-slash");
		}
	},
}
document.addEventListener("DOMContentLoaded", function(event) {
	// Page Components
	Vue.component("main",{
		data(){ return {response:{}} },
		template: document.querySelector("component-template[name=main]").innerHTML,
	})
	Vue.component("transactions",{
		data(){ return {
			isLoaded: false,
			response: {},
		}},
		created(){ data.api("list-transaction",{limit:128},this); },
		template: document.querySelector("component-template[name=transactions]").innerHTML,
	})
	Vue.component("wallets",{
		data(){ return {
			isLoaded: false,
			response: {},
		}},
		created(){ data.api("list-wallet",{limit:128},this); },
		template: document.querySelector("component-template[name=wallets]").innerHTML,
	})
	Vue.component("create-wallet",{
		data(){ return {
			form: {name:"",password:""},
			isSent: false,
			response: {},
			reset(){
				this.form = {name:"",password:""};
				this.isSent = false;
				this.response = {};
			},
			create(){
				if(this.form.name && this.form.password)
					data.api("add-wallet",this.form,this)
			}
		}},
		template: document.querySelector("component-template[name=create-wallet]").innerHTML,
	})
	Vue.component("login",{
		data(){ return {
			form: {account:"",password:""},
			isSent: false,
			response: {},
			reset(){
				this.form = {account:"",password:""};
				this.isSent = false;
				this.response = {};
			},
			login(){
				if(this.form.account && this.form.password)
					data.api("get-wallet",this.form,this)
					.then(response=>{
						if(response.data){
							this.$root.login(Object.assign({},response.data,this.form));
							this.$router.replace("/my-wallet");
						}
					});
			}
		}},
		template: document.querySelector("component-template[name=login]").innerHTML,
	})
	Vue.component("logout",{
		created(){
			this.$root.logout();
			this.$router.replace("/");
		},
		template: document.querySelector("component-template[name=logout]").innerHTML,
	})
	Vue.component("my-wallet",{
		data(){ return {
			isLoaded: false,
			response: {},
		}},
		created(){ 
			data.api("get-wallet",{account:this.$root.myWallet.id,password:this.$root.myWallet.password},this)
		},
		template: document.querySelector("component-template[name=my-wallet]").innerHTML,
	})
	Vue.component("send-coin",{
		data(){ return {
			isLoaded: false,
			response: {},
			form: { id:this.$root.myWallet.id, password:this.$root.myWallet.password,
				targetId:"", amount:"0", fee:"0", description:"" },
			send(){
				if(this.form.targetId && this.form.amount>0)
				data.api("send",this.form)
				.then(response=>{
					alert(response.msg||response.err);
					if(response.msg) location.reload();
				});
			}
		}},
		watch: {
			"form.amount"(val){this.form.fee=this.form.amount*0.025}
		},
		created(){ data.api("list-wallet",{limit:128},this); },
		template: document.querySelector("component-template[name=send-coin]").innerHTML,
	})

	// Inner Components
	Vue.component("coin-card",{
		props: ["wallet"],
		template: document.querySelector("component-template[name=coin-card]").innerHTML,
	})
	Vue.component("loading",{
		props: {
			color:{default:"info"}
		},
		template: document.querySelector("component-template[name=loading]").innerHTML,
	})
	Vue.component("edit-wallet",{
		props: ["wallet"],
		data(){return{
			form: {name:this.wallet.name, password:this.wallet.password},
			isSent: false,
			response: {},
			reset(){
				this.form = {name:this.wallet.name, password:this.$root.myWallet.password};
				this.isSent = false;
				this.response = {};
			},
			edit(key){
				data.api("set-wallet",
					{id:this.$root.myWallet.id,password:this.$root.myWallet.password,key,value:this.form[key]},this)
				.then(response=>{
					alert(response.msg||response.err);
					this.$root.logout();
					this.$router.push("/login");
				});
			},
		}},
		created(){
			this.reset();
		},
		template: document.querySelector("component-template[name=edit-wallet]").innerHTML,
	})
	Vue.component("navbar",{
		template: document.querySelector("component-template[name=navbar]").innerHTML,
	})

	routes= [
		{ path: '/', component: Vue.component("main") },
		{ path: '/transactions', component: Vue.component("transactions") },
		{ path: '/wallets', component: Vue.component("wallets") },
		{ path: '/create-wallet', component: Vue.component("create-wallet") },
		{ path: '/login', component: Vue.component("login") },
		{ path: '/logout', component: Vue.component("logout") },
		{ path: '/my-wallet', component: Vue.component("my-wallet") },
		{ path: '/send-coin', component: Vue.component("send-coin") },
	]

	app = new Vue({
		data,
		router: new VueRouter({routes,mode:"history"}),
		created(){
			this.login();
		},
	});
	app.$mount("#app");
})