(function (Vue) {
	'use strict';
	var STOREGE_KEY = "todo-items";
	//定义localstorege对象
	const itemStorage = {
		save: function (items) {
			//保存数据到本地，items就是需要保存的数据源,并且以JSON字符串的格式存储
			localStorage.setItem(STOREGE_KEY, JSON.stringify(items));
		},
		fetch: function () {
			//获取数据并且数据反序列化，变成数组对象，如果为空，则是空数组
			return JSON.parse(localStorage.getItem(STOREGE_KEY) || '[]')
		}
	}
	//自定义全局指令，获取焦点指令
	//定义时不要加v-，内部会帮你加上，使用时需要加上v-
	// Vue.directive("focus",{
	// 	inserted(el,binding){
	// 		//el表示作用的元素
	// 		//binding表示指令后输入的内容
	// 		el.focus()
	// 	}
	// });

	new Vue({
		el: '.todoapp',
		data: {
			items: itemStorage.fetch(),
			currentItem: null,
			filterState: 'all',
		},
		computed: {
			incomplete() {
				return this.items.filter(item => !item.completed).length
			},
			isSelectAll: {
				//循环数据源中的每一个对象，并且将通过v-model双向绑定获取的值赋给每一个item中的状态，从而根据input checkbox的状态去顶任务的状态
				set: function (newState) {
					this.items.forEach(function (item) {
						item.completed = newState;
					})
				},

				//根据任务完成的状态完成绑定v-model的input checkbox框的状态获取
				get: function () {
					return this.incomplete === 0
				}

			},
			filterItems() {
				switch (this.filterState) {
					case 'active':
						return this.items.filter(item => !item.completed);
						break
					case 'completed':
						return this.items.filter(item => item.completed);
						break
					default:
						return this.items;
						break
				}
			}
		},
		methods: {
			addItem(e) {
				const newValue = e.target.value.trim();
				if (!newValue.length) {
					return
				} else {
					const newObj = {
						id: this.items.length + 1,
						content: newValue,
						completed: false
					};
					this.items.push(newObj);
				}
				e.target.value = ''
			},
			destroyTodo(value) {
				this.items.splice(value, 1);
			},
			removeAllCompleted() {
				this.items = this.items.filter((item) => !item.completed);
			},
			clearAll() {
				this.items = [];
			},
			toEdit(item) {
				this.currentItem = item;
			},
			cancelEdit() {
				this.currentItem = null;
			},
			saveData(item, index, $event) {
				if ($event.target.value.trim() !== '') {
					item.content = $event.target.value.trim();
				}
				this.currentItem = null;
			},

		},
		mounted() {
			this.$nextTick(() => {
				this.$refs.todoInput.focus();
			});
			window.onhashchange = () => {
				this.filterState = window.location.hash.substring(2) || 'all';
			};
			window.onhashchange();
		},
		watch: {
			//监听items,一旦items发生变化就会执行
			items: {
				deep: true,//需要监听数组对象内部的变化，需要指定deep:true
				handler(newitems, olditems) {
					// newitems:新的数组对象
					// olditems：之前的数组对象
					itemStorage.save(newitems)
				}
			}
		},
		directives: {
			"focus": {
				//当指令的值更新后会调用此方法
				update(el, binding) {
					//el表示作用的元素
					//binding表示指令后输入的内容
					el.focus()
				}

			}
		},
	})
	// Your starting point. Enjoy the ride!

})(Vue);