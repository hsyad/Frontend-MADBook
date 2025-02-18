<template>
    <main>
        <div class="p-3 bg-white rounded-md">
            <div class="d-flex mb-4 justify-between items-center">
                <div class="d-column gap-2 ">
                    <h2 class="fw-semibold mb-2">Quotation Details</h2>
                    <p class="mb-0">Subject: {{ quote.subject }}</p>
                </div>
                <div class="d-flex gap-2">
                    <button @click="downloadDoc" class="btn btn-primary h-12 w-20">
                        <span class="material-icons text-white align-middle">
                            download
                        </span>
                    </button>
                    <button @click="openModal" class="btn btn-success h-12 w-20">Edit</button>
                    <QuoteEdit v-if="showEditModal" :showEditModal="showEditModal" :quote="quote" :items="items"
                        @update:items="items = $event" @update:showEditModal="showEditModal = $event"
                        @close="showEditModal = false" @save="saveEdit" />

                    <button class="btn btn-danger h-12 w-20">Delete</button>
                </div>
            </div>

            <div class="border border-dark rounded p-4" v-if="quote">
                <div class="px-3">
                    <h2 class="mt-4 text-end fw-semibold">Quote</h2>

                    <!-- LOGO -->
                    <div class="d-flex items-center my-4">

                        <div v-if="quote?.logo" class="d-inline-block overflow-hidden h-20 w-20">
                            <img :src="quote.logo" alt="logo" class="h-full object-contain">
                        </div>
                    </div>

                    <p class="text-secondary small">
                        {{ quote.address || "No Address" }} | {{ quote.email || "No Email" }}
                    </p>

                    <!-- CUSTOMER DETAILS -->
                    <div class="d-flex justify-between my-4">
                        <div class="text-start flex-grow-1">
                            <p class="mb-1"><strong>For:</strong></p>
                            <p class="mb-1 fs-6">{{ quote.c_name }}</p>
                            <p class="mb-1 fs-6">{{ quote.c_no }}</p>
                            <p class="mb-1 fs-6 whitespace-pre">{{ quote.c_address }}</p>
                        </div>

                        <!-- QUOTE DETAILS -->
                        <div class="container d-flex gap-2 justify-end">
                            <div class="text-start">
                                <div class="d-flex gap-3">
                                    <p><strong>Quote No: </strong> </p>
                                    <p>{{ "#MAD00"+quoteId.id }}</p>
                                </div>
                                <div class="d-flex gap-2">
                                    <p><strong>Issue Date: </strong> </p>
                                    <p>{{ quote.issue_date }}</p>
                                </div>
                                <div class="d-flex gap-2">
                                    <p><strong>Valid Until: </strong></p>
                                    <p>{{ quote.valid_date }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- TABLE -->
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
                    <tbody class="border-bottom">
                        <tr v-for="(item, index) in items" :key="index">
                            <td>{{ index + 1 }}</td>
                            <td class="text-start">{{ item.name }}</td>
                            <td>RM{{ item.price }}</td>
                            <td>{{ item.quantity }}</td>
                            <td>RM{{ (item.price * item.quantity).toFixed(2) }}
                            </td>
                        </tr>
                    </tbody>
                </table>

                <div class="d-flex gap-3 justify-end mt-6">
                    <div class="text-end">
                        <p class="fw-semibold">Total: </p>
                    </div>
                    <div class="text-end">
                        <p class="fw-semibold">RM{{ quote.q_total }}</p>
                    </div>
                </div>

                <p class="mt-5"><strong>Notes: </strong> {{ quote.notes }}</p>
            </div>
        </div>
        <div class="flex m-2 justify-center">

        </div>
        <div class="d-flex gap-1 mb-2">
            <button @click="navigateToDO" class="btn btn-success rounded-md text-white font-bold w-full">
                Create Delivery Order</button>
            <button @click="navigateToInvoice" class="btn btn-success rounded-md text-white font-bold w-full">
                Create Invoice</button>
            <button @click="navigateToDODetails" class="btn btn-success rounded-md text-white font-bold w-full">
                DO Details</button>
            <button @click="navigateToInvDetails" class="btn btn-success rounded-md text-white font-bold w-full">
                Invoice Details</button>
        </div>
    </main>
</template>

<script setup>
import QuoteEdit from '@/components/QuoteEdit.vue';
import axios from 'axios';
import Swal from 'sweetalert2';
import { onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();
const quote = ref({});
const items = ref([]);
const devOr = ref({});
const inv = ref({});
const showEditModal = ref(false);
const quoteId = defineProps({
    id:{
        required: true,
        type: String
    }
})

//Fetch quotation details
const fetchQuoteDetails = async () => {
    try {
        console.log("Fetching quotation for ID: ", quoteId.id);

        const response = await axios.get(`http://quotation.test/api/Quotation/`+quoteId.id );

        if (response.data) {
            quote.value = response.data;
            items.value = response.data.q_items || [];
        }
    } catch (error) {
        console.error("Error fetching quotation: ", error);
    }
};

// Should able download the generated document in pdf
const downloadDoc = async () => {
    try {

        const response = await axios.get(`http://quotation.test/api/Quotations/${quote.value.id}/download`, {
            responseType: 'blob'
        });

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `Quotation-${quote.value.id}.pdf`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        Swal.fire({
            title: 'Success',
            text: 'Document downloaded successfully',
            icon: 'success',
            confirmButtonColor: '#4cbb17'
        });

    } catch (error) {
        Swal.fire({
            title: 'Error',
            text: 'Failed to download document',
            icon: 'error',
            confirmButtonText: 'OK',
        });

        console.error("Error downloading document: ", error);
    }
};

const openModal = () => showEditModal.value = true;
const closeModal = () => showEditModal.value = false;

// save the updated quotation into the DB
const saveEdit = async (updatedData) => {
    try {
        await axios.put(`http://quotation.test/api/Quotation/${quote.value.id}`, updatedData);

        if (response.status === 200) {
            quote.value = { ...quote.value, ...updatedData };
            Swal.fire({
                title: 'Success',
                text: 'Quotation updated successfully',
                icon: 'success',
                confirmButtonColor: '#4cbb17',
            });
            closeModal();

        } else {
            throw new Error('Failed to update quotation');
        }
    } catch (error) {
        console.error("Error saving data:", error);
        Swal.fire({
            title: 'Error',
            text: error.response?.data?.message || 'Failed to update quotation',
            icon: 'error',
            confirmButtonText: 'OK',
        });
    }
};

const navigateToDO = () => {
    router.push('/create-delivery-order');
}

const navigateToInvoice = () => {
    router.push('/create-invoice');
}

const navigateToDODetails = () => {
    if (devOr.value) {
        router.push(`/DO/${devOr.value.id}`);
    } else {
        alert("No Delivery Order linked to this Quotation");
    }
}

const navigateToInvDetails = () => {
    if (inv.value) {
        router.push(`/Invoice/${inv.value.id}`);
    } else {
        alert("No Invoice linked to this Quotation");
    }
}

onMounted(async () => {
    fetchQuoteDetails();
});
</script>

<style lang="scss" scoped>
.material-icons {
    font-size: 1.6rem; // icons size
    color: var(--light);
    transition: 0.2s ease-out;
}
</style>
