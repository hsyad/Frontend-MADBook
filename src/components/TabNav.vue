<template>
    <div class="w-30%">
        <ul class="nav-tabs">
            <li v-for="tab in tabs" :key="tab" class="nav-item">
                <a href="" class="nav-link" :class="{ active: tab === selected }">{{ tab }}</a>
            </li>
        </ul>

        <slot>

        </slot>
    </div>

</template>

<script>
export default {
    props: {
        tabs: {
            type: Array,
            required: true,
        },
        selected: {
            type: String,
            required: true,
        },
    },
    methods: {
        setTab(tab) {
            this.$emit('selected', tab);
        }
    }
}
</script>

<style lang="scss" scoped></style>
