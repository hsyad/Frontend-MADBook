<template>
    <main>
        <div>
            <h2>Quotation Details</h2>
        </div>

        <div class="border border-dark rounded p-4">
            <div class="px-3">
                <h2 class="mt-4 text-end fw-semibold">Quote</h2>

                <div class="d-flex items-center my-4">
                    <div v-if="quote?.logo" class="d-inline-block overflow-hidden h-20">
                        <img :src="quote.logo" alt="logo" class="h-full object-contain">
                    </div>
                </div>

                <p class="text-secondary small">{{ quote?.address }} | {{ quote.email }}</p>

                <div class="d-flex justify-between my-4">
                    <div class="text-start flex-grow-1">
                        <p class="mb-1"><strong>For:</strong></p>
                        <p class="mb-1 fs-6">{{ quote.c_name }}</p>
                        <p class="mb-1 fs-6">{{ quote.c_no }}</p>
                        <p class="mb-1 fs-6">{{ quote.c_address }}</p>
                    </div>

                    <div class="container d-flex gap-2 justify-end">
                        <div class="text-end">
                            <p class="mb-1"><strong>Quote No:</strong></p>
                            <p class="mb-1"><strong>Issue Date:</strong></p>
                            <p class="mb-1"><strong>Valid Date:</strong></p>
                        </div>
                        <div class="text-start">
                            <p class="mb-1">{{ quote.id }}</p>
                            <p class="mb-1">{{ quote.issue_date }}</p>
                            <p class="mb-1">{{ quote.valid_date }}</p>
                        </div>
                    </div>

                    <table class="table table-borderless shadow-none">
                        <thead class="table-secondary">
                            <tr>
                                <th class="w-14">No.</th>
                                <th class="w-auto text-start">Items</th>
                                <th class="w-20">Price</th>
                                <th class="w-25">Quantity</th>
                                <th class="w-20">Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, index) in items" :key="index">
                                <td>{{ index + 1 }}</td>
                                <td>{{ item.name }}</td>
                                <td>RM{{ item.price }}</td>
                                <td>{{ item.quantity }}</td>
                                <td>RM{{ (item.price * item.quantity) || 0 }}</td>
                            </tr>
                        </tbody>
                    </table>

                    <div class="d-flex gap-3 justify-end mt-6">
                        <div class="text-end">
                            <p class="fw-semibold">Total:</p>
                        </div>
                        <div class="text-end">
                            <p class="fw-semibold">RM{{ calculate_total }}</p>
                        </div>
                    </div>

                    <p class="mt-5"><strong>Notes: </strong> {{ quote.notes }}</p>
                </div>
            </div>
        </div>
    </main>
</template>

<script setup>
import axios from 'axios';
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const quote = ref({});
const items = ref([]);

const fetchQuote = async () => {
    try {
        const quoteId = route.params.id;
        console.log("Quote ID: ", quoteId);
        const response = await axios.get(`http://mentor.test/api/quotations/${quoteId}`);

        if (response.data) {
            quote.value = response.data;
            items.value = response.data.items || [];
        }
    } catch (error) {
        console.error("Error fetching quotation: ", error);
    }
};

const calculate_total = computed(() => {
    return items.value.reduce((sum, item) => sum + (item.price * item.quantity || 0), 0).toFixed(2);
});

onMounted(fetchQuote);
</script>
