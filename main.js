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
