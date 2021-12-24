let activeEffect = null
class Dep{
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
    activeEffect =null
}


function reactive(raw) {
    Object.keys(raw).forEach(key => {
        const dep = new Dep()
        let value = raw[key]

        Object.defineProperty(raw, key, {
            get() {
                dep.depend()
                return value
            },
            set(newValue) {
                value =newValue
                dep.notify()
            }
        })
    })

    return raw
}

const state = reactive({
    count:0
})

watchEffect(() => {
    console.log(state.count)
})

state.count++