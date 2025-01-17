<script setup>
import Sidebar from "./components/Sidebar.vue";
import { RouterView } from "vue-router";
</script>

<template>
    <div class="app">
        <Sidebar />
        <RouterView />
    </div>
</template>

<style lang="scss">
:root {
    /*===== Colors =====*/
    --body-color: #d2dde8; //rgb(245, 239, 255); //#F8F9FA
    --sidebar-color: #ffffff;
    --primary: #84aed9;
    --grey: #8995a5;
    --dark: #385c80;
    --dark-alt: #243f5a;
    --light: #000000;
    --sidebar-width: 300px;

    /*===== Transition =====*/
    --tran-03: all 0.2s ease;
    --tran-03: all 0.3s ease;
    --tran-04: all 0.4s ease;
    --tran-05: all 0.5s ease;
}


* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Poppins', sans-serif;
}

body {
    height: 100vh;
    background: var(--body-color);
}

button {
    cursor: pointer;
    appearance: none;
    border: none;
    outline: none;
    background: none;
}

.app {
    display: flex;

    main {
        flex: 1 1 0;
        padding: 2rem;

        @media (max-width: 768px) {
            padding: 6rem;
        }
    }
}
</style>
