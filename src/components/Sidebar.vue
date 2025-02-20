<template>
    <aside :class="`${is_expanded && 'is_expanded'}`">

        <!-- Logo section
        <div class="logo">
            <img src="../assets/images/logo_school.png" alt="school">
            <span class="sidebar-text" v-if="is_expanded">Logo</span>
        </div> -->

        <!-- Menu Icon -->
        <div class="menu-toggle-wrap">
            <button class="menu-toggle" @click="ToggleMenu">
                <span class="material-icons">
                    {{ is_expanded ? 'close' : 'menu' }}
                </span>
            </button>
        </div>

        <!-- Pages/Links -->
        <!-- <h3 class="font-bold text-xl mb-2">Mentor's</h3> -->

        <!-- <div class="divider"></div> -->

        <div class="sidebar-links">
            <!-- <router-link class="button" to="/">
                <span class="material-icons">home</span>
                <span class="text">Dashboard</span>
            </router-link> -->
            <!-- <router-link class="button" to="/courses">
                <span class="material-icons">school</span>
                <span class="text">Courses</span>
            </router-link>
            <router-link class="button" to="/resources">
                <span class="material-icons">book</span>
                <span class="text">Resources</span>
            </router-link>
            <router-link class="button mb-5" to="/schedule">
                <span class="material-icons">schedule</span>
                <span class="text">Schedule</span>
            </router-link> -->
        </div>


        <!-- <div class="divider"></div> -->

        <!-- <h3 class="font-bold text-xl mb-2">User's</h3> -->

        <!-- <div class="divider"></div> -->

        <!-- MAINPAGE -->
        <div class="sidebar-links">
            <router-link class="button" to="/madbook">
                <span class="material-icons">filter_1</span>
                <span class="text">MADBook</span>
            </router-link>
        </div>
        <!-- CREATE QUOTE -->
        <div class="sidebar-links">
            <router-link class="button" to="/create-quotation/2">
                <span class="material-icons">filter_2</span>
                <span class="text">Create Quote</span>
            </router-link>
        </div>
        <!-- QUOTE DETAILS -->
        <div class="sidebar-links">
            <router-link class="button" to="/quotation/:id">
                <span class="material-icons">filter_3</span>
                <span class="text">Quote Details</span>
            </router-link>
        </div>
        <!-- CREATE DO -->
        <div class="sidebar-links">
            <router-link class="button" to="/create-delivery-order/:id">
                <span class="material-icons">filter_4</span>
                <span class="text">Create DO</span>
            </router-link>
        </div>
        <!-- DO DETAILS -->
        <div class="sidebar-links">
            <router-link class="button" to="/do/:id">
                <span class="material-icons">filter_5</span>
                <span class="text">DO Details</span>
            </router-link>
        </div>
        <!-- CREATE INVOICE -->
        <div class="sidebar-links">
            <router-link class="button" to="/create-invoice/:id">
                <span class="material-icons">filter_6</span>
                <span class="text">Create Invoice</span>
            </router-link>
        </div>
        <!-- INVOICE DETAILS -->
        <div class="sidebar-links">
            <router-link class="button" to="/invoice/:id">
                <span class="material-icons">filter_7</span>
                <span class="text">Invoice Details</span>
            </router-link>
        </div>
        <!-- TESTING -->
        <!-- <div class="sidebar-links">
            <router-link class="button" to="/testing">
                <span class="material-icons">priority_high</span>
                <span class="text">Testing: Quote Details</span>
            </router-link>
        </div> -->


        <!-- <div class="user-menu">
            <button class="user-toggle" @click="toggleUsers">
                <span class="material-icons">person</span>
                <span class="text">User</span>
            </button>
            <div v-if="showUsers" class="user-sublinks">
                <router-link class="sublinks" to="/quotation">
                    <span class="material-icons">folder</span>
                    <span class="text">Quotation</span>
                </router-link>
                <router-link class="sublinks" to="/delivery-order">
                    <span class="material-icons">folder</span>
                    <span class="text text-sm">Delivery Order</span>
                </router-link>
                <router-link class="sublinks" to="/invoice">
                    <span class="material-icons">folder</span>
                    <span class="text text-sm">Invoice</span>
                </router-link>
            </div>
        </div> -->

        <div class="flex"></div>

        <!-- <div class="sidebar-links">
            <router-link class="button" to="/settings">
                <span class="material-icons">settings</span>
                <span class="text">Settings</span>
            </router-link>
        </div> -->
    </aside>
</template>

<script>
import { ref } from 'vue';

export default {
    setup() {
        const is_expanded = ref(localStorage.getItem("is_expanded") === "true");

        const ToggleMenu = () => {
            is_expanded.value = !is_expanded.value;
            localStorage.setItem("is_expanded", is_expanded.value);
        };

        return {
            is_expanded,
            ToggleMenu,
        }
    },
    // data() {
    //     return {
    //         showUsers: false,
    //     };
    // },
    // methods: {
    //     toggleUsers() {
    //         this.showUsers = !this.showUsers;
    //     },
    // },
};
</script>

<style lang="scss" scoped>
aside {
    display: flex;
    flex-direction: column;
    width: calc(2rem + 32px);
    // width: 200px;
    min-height: 100vh;
    overflow: hidden;
    padding: 1rem;
    overflow: hidden;

    background-color: var(--sidebar-color);
    color: var(--light);

    transition: 0.2s ease-out;
    ;

    .flex {
        flex: 1 1 0;
    }

    .logo {
        display: flex;
        align-items: center;
        margin-bottom: 1rem;
        gap: 1rem;

        img {
            width: 2rem;
        }
    }

    .menu-toggle-wrap {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        // margin-bottom: 1rem;

        position: relative;
        top: 0;

        transition: 0.2s ease-out;

        .menu-toggle {
            background: none;
            border: none;
            cursor: pointer;

            transition: 0.2s ease-out;

            .material-icons {
                // font-size: 2rem;
                color: var(--light);
            }
        }
    }

    h3,
    .button .text {
        opacity: 0;
        transition: 0.3s ease-out;
    }

    h3 {
        color: var(--light);
        font-size: 1.1rem;
        margin-bottom: 0.5rem;
        text-transform: uppercase;
    }

    .sidebar-links {
        margin: 0 -1rem;

        .button {
            display: flex; // align icon and text in a row
            align-items: center; // center items
            text-decoration: none; // remove underline

            gap: 0.5rem;
            padding: 0.5rem 1rem; // add spacing around items
            transition: 0.2s ease-out; // smooth effect when hovering

            .material-icons {
                font-size: 1.8rem; // icons size
                color: var(--light);
                transition: 0.2s ease-out;
            }

            .text {
                color: var(--light);
                transition: 0.2s ease-out;
            }

            &:hover,
            &.router-link-exact-active {
                background-color: #d2dde8;

                .material-icons,
                .text {
                    color: var(--light);
                }
            }

            &.router-link-exact-active {
                border-right: 3px solid var(--light);
            }
        }
    }


    .divider {
        opacity: 0;
    }

    .divider {
        height: 1px; // thin line
        background-color: rgb(164, 194, 224);
        margin-bottom: 2rem;
    }

    &.is_expanded {
        // aside (sidebar) bila dia expanded
        width: var(--sidebar-width); // lebarkan dia

        .menu-toggle-wrap {

            .menu-toggle {
                right: 1rem; // ntah
            }
        }

        h3,
        .button .text {
            opacity: 1;
        }

        .button {
            .material-icons {
                margin-right: 1rem; // jarak antara logo and text button
            }
        }

        .divider {
            opacity: 1;
        }
    }

    @media (max-width: 768px) {
        position: fixed;
        z-index: 99;
    }
}
</style>
