<script setup>

</script>

<template>
    <RouterView v-slot="{ Component }">
        <component :is="Component" />
    </RouterView>
</template>

<style lang="scss"></style>