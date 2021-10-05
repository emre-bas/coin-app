# Coin App
**An Experimental Coin Application**

---

**db:** `MongoDB(with mongoose)`

**ui:** `Vue.js`

---

~~~
db => fixed(id, created_date, updated_date)
	wallets => name, password, balance
	transactions => from, to, amount, fee, description

api =>
	list-wallet(?limit=100,?skip=0)
	get-wallet(account,?password)
	add-wallet(name,password)
	set-wallet(id,password,key,value)
	list-transaction(?limit=100,?skip=0)
	send(id,password,targetId,amount,fee,description)

ui =>
	everyone? => transactions, wallets, create-wallet, login
	logged-in? => transactions, wallets, my-wallet, send-coin, logout
~~~