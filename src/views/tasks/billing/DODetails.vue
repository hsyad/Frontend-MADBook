<template>
    <main>
        <div class="p-3 bg-white rounded-md">
            <!-- HEADER -->
            <div class="d-flex mb-4 justify-content-between align-items-center">
                <div>
                    <h2 class="fw-semibold mb-2">Delivery Order Details</h2>
                    <p class="mb-0">Subject: {{ quote.subject }}</p>
                </div>
                <div class="d-flex gap-2">
                    <button @click="downloadDoc" class="btn btn-primary rounded-md text-white font-bold">
                        <span class="material-icons text-white align-middle">
                            download
                        </span>
                    </button>
                    <button @click="openModal" class="btn btn-success rounded-md text-white font-bold">Edit</button>
                    <button class="btn btn-danger">Delete</button>

                    <DoEdit v-if="showEditModal" :showEditModal="showEditModal" :devOr="devOr"
                        @update:items="items = $event" @update:showEditModal="showEditModal = $event"
                        @close="showEditModal = false" @save="saveEdit" />
                </div>
            </div>

            <!-- DELIVERY ORDER CONTENT -->
            <div class="border border-dark rounded p-4" v-if="devOr">
                <div class="px-3">
                    <h2 class="mt-4 text-end fw-semibold">Delivery Order</h2>

                    <!-- LOGO -->
                    <div class="d-flex align-items-center my-4">
                        <div v-if="quote?.logo" class="d-inline-block overflow-hidden"
                            style="height: 80px; width: 80px;">
                            <img :src="quote.logo" alt="logo" class="h-100 w-100 object-contain">
                        </div>
                    </div>

                    <p class="text-secondary small">
                        {{ quote.address || "No Address" }} | {{ quote.email || "No Email" }}
                    </p>

                    <!-- CUSTOMER & DO DETAILS -->
                    <div class="d-flex justify-content-between my-4">
                        <!-- CUSTOMER DETAILS -->
                        <div class="text-start flex-grow-1">
                            <p class="mb-1"><strong>Delivery To:</strong></p>
                            <p class="mb-1 fs-6">{{ devOr.c_name }}</p>
                            <p class="mb-1 fs-6">{{ devOr.c_no }}</p>
                            <p class="mb-1 fs-6">{{ devOr.c_address }}</p>
                        </div>

                        <!-- DO DETAILS -->
                        <div class="text-end">
                            <p class="mb-1"><strong class="mr-2">DO No:</strong> {{ delivery_order_id }}</p>
                            <p class="mb-1"><strong class="mr-2">Issue Date:</strong> {{ devOr.issue_date }}</p>
                            <p class="mb-1"><strong class="mr-2">Delivery Date:</strong> {{ devOr.delivery_date }}</p>
                            <p class="mb-1"><strong class="mr-2">Due Date:</strong> {{ devOr.due_date }}</p>
                        </div>
                    </div>

                    <!-- ITEMS TABLE -->
                    <table class="table table-borderless shadow-none">
                        <thead class="table-secondary">
                            <tr>
                                <th class="text-start">Items</th>
                                <th class="text-center">Quantity</th>
                            </tr>
                        </thead>
                        <tbody class="border-bottom">
                            <tr v-for="(item, index) in items" :key="index">
                                <td class="text-start">{{ item.name }}</td>
                                <td class="text-center">{{ item.quantity }}</td>
                            </tr>
                        </tbody>
                    </table>

                    <!-- SHIPPING DETAILS -->
                    <div class="d-flex flex-column align-items-end gap-2 mt-4">
                        <p class="mb-1 text-end">Ship By: {{ devOr.ship_by }}</p>
                        <p class="mb-1 text-end">Shipping Fee: RM{{ devOr.ship_fee }}</p>
                        <p class="fw-semibold text-end">
                            Total: RM{{ parseFloat(devOr.do_total || 0).toFixed(2) }}
                        </p>
                    </div>

                    <!-- NOTES -->
                    <p class="mt-5"><strong>Notes:</strong> {{ devOr.notes }}</p>

                    <!-- BANK DETAILS -->
                    <div v-if="bankDetails" class="mt-4 mb-4 border-s-8 border-emerald-500 pl-4">
                        <p class="mt-3 mb-1 text-sm"> {{ bankDetails.bank_name }}</p>
                        <p class="mb-1 text-sm"> {{ bankDetails.acc_holder }}</p>
                        <p class="mb-1 text-sm"> {{ bankDetails.acc_num }}</p>
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>


<script setup>
import axios from 'axios';
import Swal from 'sweetalert2';
import { onMounted, ref, watch, watchEffect } from 'vue';
import { useRoute } from 'vue-router';
import DoEdit from '@/components/DoEdit.vue';
const borrower_id = defineProps({
    id:{
        required: true,
        type: String
    }
})
const route = useRoute();
const delivery_order_id = ref(); // Gunakan ref untuk boleh dikemas kini
const quote = ref({});
const items = ref([]);
const devOr = ref({});
const bankDetails = ref({});
const total = ref(0); // Deklarasikan total supaya tidak undefined
const showEditModal = ref(false);

const fetchDetails = async ($id) => {
    if (!$id) {
        console.error("Error: DO ID is undefined");
        return;
    }

    try {
        console.log("Fetching delivery order for ID:", $id);
        const response = await axios.get(`http://quotation.test/api/DO/`+borrower_id.id);
        console.log("Fetched Data:", response.data);
        

        devOr.value = response.data
        quote.value = response.data.quotations
        items.value = response.data.q_items
        bankDetails.value = response.data.q_bank_details
        total.value = response.data.do_total

    } catch (error) {
        console.error("Error fetching details:", error);
    }
};

// **Gunakan watch untuk monitor perubahan ID dalam route**
watchEffect(() => {
    console.log("Delivery order:", devOr);
});

// **Download Dokumen PDF**
const downloadDoc = async () => {
    try {
        if (!devOr.value.id) {
            Swal.fire({ title: 'Error', text: 'Invalid document ID', icon: 'error' });
            return;
        }

        const response = await axios.get(`http://quotation.test/api/DO/${devOr.value.id}/download`, {
            responseType: 'blob'
        });

        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', `Quotation-${quote.value.id}.pdf`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);

        Swal.fire({ title: 'Success', text: 'Document downloaded successfully', icon: 'success', confirmButtonColor: '#4cbb17' });

    } catch (error) {
        Swal.fire({ title: 'Error', text: 'Failed to download document', icon: 'error' });
        console.error("Error downloading document:", error);
    }
};

// **Modal Open & Close**
const openModal = () => showEditModal.value = true;
const closeModal = () => showEditModal.value = false;

// **Simpan Edit**
const saveEdit = async (updatedData) => {
    try {
        if (!devOr.value.id) {
            Swal.fire({ title: 'Error', text: 'Invalid delivery order ID', icon: 'error' });
            return;
        }

        await axios.put(`http://quotation.test/api/DO/${devOr.value.id}`, updatedData);

        Swal.fire({ title: 'Success', text: 'Delivery order updated successfully', icon: 'success', confirmButtonColor: '#4cbb17' });
        closeModal();
        fetchDetails(devOr.value.id); // Refresh data selepas update

    } catch (error) {
        Swal.fire({ title: 'Error', text: error.response?.data?.message || 'Failed to update delivery order', icon: 'error' });
        console.error("Error saving data:", error);
    }
};

// **Panggil API bila komponen dimuatkan**
onMounted(() => {
    const route = useRoute();
    delivery_order_id.value = route.params.id;  // Ambil ID dari route params
    console.log("Delivery Order ID:", delivery_order_id.value);  // Pastikan ID ada

    if (delivery_order_id.value) {
        fetchDetails(delivery_order_id.value);  // Panggil fetchDetails dengan ID
    } else {
        console.error("Delivery order ID is undefined");
    }
});
</script>

<style lang="scss" scoped>
.material-icons {
    font-size: 1.6rem; // icons size
    color: var(--light);
    transition: 0.2s ease-out;
}
</style>
