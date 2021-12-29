let activeEffect = null
function watchEffect(eff) {
    activeEffect = eff
    activeEffect()
    activeEffect = null
}


const targetMap = new WeakMap()
function tracker(target,key) {
    if (activeEffect) {
        let depsMap = targetMap.get(target)
        if (!depsMap) {
            targetMap.set(target,(depsMap = new Map()))
        }
        let dep = depsMap.get(key)
        if (!dep) {
           
            depsMap.set(key,( dep = new Set()))
        }
        dep.add(activeEffect)
    }
}
function trigger(target,key) {
    const depsMap = targetMap.get(target)
    if (!depsMap) {
        return
    }
    let dep = depsMap.get(key)
    if (dep) {
        dep.forEach(effect => {effect()})
    }

}



function reactive(raw) {
    return new Proxy(raw, {
        get(target,key,receiver) {
            console.log("Get was called with key = "+ key)
            let result = Reflect.get(target,key,receiver)
            tracker(target,key)
            return result
        },
        set(target,key,value,receiver) {
            let oldValue = target[key]
            console.log("SET was called with key = "+ key+" value = "+value)
            let result = Reflect.set(target,key,value,receiver)
            if (oldValue != value) {
                trigger(target,key)
            }
            return result
        }
    })
}

function ref(raw) {
    const r = {
        get value() {
            tracker(r,'value')
            return raw
        },
        set value(newValue) {
            raw = newValue
            trigger(r,'value')
        }
    }
    return r
}

function computed(getter) {
    let result = ref()
    watchEffect(() => {result.value =getter()})
    return result
}



let product = reactive({price:5,quantity:2})
let salePrice = computed(()=> {
    return product.price * 0.9
})
let total = computed(()=>{
    return salePrice.value * product.quantity
})


console.log(`befor updated total 10 = ${total.value}, salePrice (sb 4.5) = ${salePrice.value}`)
product.quantity =3
console.log(`after updated total 15 = ${total.value}, salePrice (sb 4.5) = ${salePrice.value}`)
product.price =10
console.log(`after2 updated total 30 = ${total.value}, salePrice (sb 9) = ${salePrice.value}`)
