let activeEffect = null
class Dep {
    subscriber = new Set()
    depend() {
        if (activeEffect) {
            this.subscriber.add(activeEffect)
        }
    }

    notify() {
        this.subscriber.forEach(effect => {
            effect()
        })
    }
}

function watchEffect(effect) {
    activeEffect = effect
    effect()
    activeEffect = null
}


const targetMap = new WeakMap()
function getDep(target, key) {
    let depsMap = targetMap.get(target)
    if (!depsMap) {
        depsMap = new Map()
        targetMap.set(target, depsMap)
    }

    let dep = depsMap.get(key)
    if (!dep) {
        dep = new Dep()
        depsMap.set(key, dep)
    }
    return dep
}

const reactiveHandlers = {
    get(target, key, receiver) {
        let dep = getDep(target, key)
        dep.depend()
        return Reflect.get(target, key, receiver)
    },

    set(target, key, value) {
        let dep = getDep(target, key)
        const result = Reflect.set(target, key, value)
        dep.notify()
        return result
    }
}

function reactive(raw) {
    return new Proxy(raw, reactiveHandlers)
}

const state = reactive({
    count: 0
})

watchEffect(() => {
    console.log(state.msg)
})

state.count++
state.msg ="fjjfj"