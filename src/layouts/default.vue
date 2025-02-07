<script setup>
</script>

<template>
    <div class="main__wrapper h-100 w-100">
        <RouterView v-slot="{ Component }">
            <Transition name="fade" mode="out-in">
                    <component :is="Component" />
            </Transition>
        </RouterView>
    </div>
</template>

<style scoped>
.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.1s ease-out;
}
</style>