<template>
    <main>
        <!-- TITLE -->
        <div class="bg-white p-3 rounded-md mb-3">
            <h3 class="font-bold mt-2 mb-4 border-b-2 pb-3">Create New Invoice</h3>
            <div class="d-flex gap-2 align-middle">
                <p class="fw-semibold">Subject:</p>
                <p class="text-gray-600">{{ quote.subject }}</p>
            </div>
        </div>

        <!-- MAIN CONTAINER -->
        <div class="d-flex overflow-auto bg-white rounded-3">

            <!-- LIVE PREVIEW COLUMN -->
            <div class="d-flex flex-column p-3 border-end" style="flex:0.8" v-html="sanitizedContent"></div>

            <!-- FORM COLUMN -->
            <div v-if="inv" class="p-3 flex-1">

                <!-- FORM INPUT -->
                <form @submit.prevent="generateDocument">
                    <div class="d-flex gap-2 align-baseline">
                        <div class="flex-1">
                            <label for="name">Bill To:</label>
                            <input type="text" v-model="quote.c_name" placeholder="Enter customer name" disabled />
                            <input type="text" v-model="quote.c_no" placeholder="Enter customer phone number"
                                disabled />
                            <textarea rows="3" v-model="quote.c_address"
                                placeholder="Eg: 456 Client Road,&#10;Town, 12345,&#10;State" disabled />
                        </div>
                        <div class="flex-1">
                            <label for="date">Issue Date: </label>
                            <input type="date" v-model="issue_date" required />
                            <label class="mt-2" for="date">Delivery Date: </label>
                            <input type="date" v-model="qdo.delivery_date" disabled />
                            <label class="mt-2" for="date">Due Date: </label>
                            <input type="date" v-model="qdo.due_date" disabled />
                        </div>
                    </div>

                    <!-- TABLE -->
                    <table class="rounded-md mt-4">
                        <thead>
                            <tr>
                                <th>No.</th>
                                <th>Items</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Amount</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, index) in items" :key="index">
                                <td>{{ index + 1 }}</td>
                                <td><input class="mt-2" type="text" v-model="item.name" disabled /></td>
                                <td><input type="number" v-model="item.price" disabled /></td>
                                <td><input type="number" v-model="item.quantity" disabled /></td>
                                <td>{{ (item.quantity * item.price).toFixed(2) || 0 }}</td>
                                <td><button type="button"
                                        class="btn text-danger border-0 rounded-3 p-2 cursor-pointer d-block mx-auto"
                                        @click="removeItem(index)" disabled><i class="fas fa-trash"></i></button></td>
                            </tr>
                        </tbody>
                    </table>

                    <!-- SHIPPING -->
                    <div class="d-flex mt-3 gap-2 items-center align-baseline">
                        <label class="whitespace-nowrap" for="name">Ship By:</label>
                        <input type="text" v-model="qdo.ship_by" placeholder="Ninjavan" disabled />
                        <label class="whitespace-nowrap" for="name">Shipping Fee: </label>
                        <input type="number" v-model="qdo.ship_fee" placeholder="RM10" disabled />
                    </div>

                    <!-- NOTES -->
                    <div class="mt-2">
                        <label for="notes">Notes: <i class="text-xs font-light text-gray-400">(optional*)</i></label>
                        <textarea placeholder="Enter notes here..." v-model="notes"></textarea>
                    </div>

                    <!-- ADD BANK DETAILS -->
                    <div class="mt-2 mb-3">
                        <button type="button"
                            class="btn btn-outline-success mb-3 gap-2 d-inline-flex align-items-center text-green-800 hover-bg-success-text-white"
                            @click="toggleForm">
                            <i class="fas fa-plus"></i>Add Bank Details
                        </button>

                        <div v-if="showForm">
                            <div>
                                <label for="bank_name">Bank Name:</label>
                                <input class="mb-2 p-2 w-100%" type="text" v-model="bankDetails.bank_name"
                                    id="bank_name" placeholder="Enter bank name" disabled />
                            </div>
                            <div>
                                <label for="acc_holder">Account Holder Name:</label>
                                <input class="mb-2 p-2 w-100%" type="text" v-model="bankDetails.acc_holder"
                                    id="acc_holder" placeholder="Enter account holder name" disabled />
                            </div>
                            <div>
                                <label for="acc_num">Account Number:</label>
                                <input class="mb-2 p-2 w-100%" type="text" v-model="bankDetails.acc_num" id="acc_num"
                                    placeholder="Enter your account number" disabled />
                            </div>
                        </div>
                    </div>

                    <!-- CALCULATE TOTAL -->
                    <div class="text-lg text-right mt-3 mb-5 font-bold">
                        <span>Total: RM{{ calculate_total }}</span>
                    </div>

                    <button type="submit"
                        class="btn btn-success w-full mb-3 gap-2 d-inline-flex justify-content-center hover-bg-success-text-white">Generate
                        Document</button>
                </form>

            </div>
        </div>
    </main>
</template>

<script setup>
import { computed, onMounted, onUnmounted, ref, watch, watchEffect } from 'vue';
import DOMPurify from 'dompurify';
import axios from 'axios';
import Swal from 'sweetalert2';
import router from '@/router';
import { onBeforeRouteLeave } from 'vue-router';


//DATES
const issue_date = ref("2025-01-28");

//NOTES
const notes = ref("Please ensure payment within the validity period.");

const quote = ref({});
const items = ref([]);
const qdo = ref({});

const showForm = ref(false);
const bankDetails = ref({});

const inv = ref({});

const previewContent = ref('');
const sanitizedContent = computed(() => DOMPurify.sanitize(previewContent.value));

const quoteId = defineProps({
    id: {
        required: true,
        type: String
    }
});

const invData = ref({
    quoteId: quoteId.value,
    doId: doId.value
});

const calculate_total = computed(() => {
    const i_total = qdo.do_total;
    return i_total;
});

const toggleForm = () => {
    showForm.value = !showForm.value;
};

const fetchDetails = async () => {
    if (!quoteId) {  // Corrected: Use `.value` if invoiceId is a ref
        console.error("Error: Quote ID is undefined");
        return;
    }

    try {
        const response = await axios.get(`http://quotation.test/api/Quotation/${quoteId.id}`);
        console.log(response.data);

        // Ensure response contains expected data before assigning
        if (response.data) {
            qdo.value = response.data.q_delivery_orders || [];
            quote.value = response.data.quotations || [];
            items.value = response.data.q_items || [];
            bankDetails.value = response.data.q_bank_details || [];

            updatePreview(); // Ensure updatePreview() exists
        } else {
            console.error("Error: Empty response data");
        }
    } catch (error) {
        console.error("Error fetching details:", error);
    }
};

const generatePreviewContent = () => {
    return `
        <div class="border border-dark rounded p-3">
            <div class="px-3">
                <h2 class="mt-4 text-end fw-semibold">Invoice</h2>

                <div class="d-flex justify-flex-start items-center my-4">
                    ${quote.value?.logo ? `
                    <div class="d-inline-block overflow-hidden h-20">
                        <img src="${quote.value.logo}" alt="logo" class="h-100 object-contain">
                    </div>
                    ` : ""}
                </div>

                <p class="text-secondary small">
                    ${quote.value.address || "No Address"} | ${quote.value.email || "No Email"}
                </p>

                <div class="d-flex justify-between my-4">
                    <div class="text-start flex-grow-1">
                        <p class="mb-1"><strong>Bill To:</strong></p>
                        <p class="mb-1 fs-7">${quote.value.c_name || "No Name"}</p>
                        <p class="mb-1 fs-7">${quote.value.c_no || "No Contact"}</p>
                        <p class="mb-1 fs-7 whitespace-pre">${quote.value.c_address || "No Address"}</p>
                    </div>

                    <div class="d-flex gap-2 justify-end">
                        <div class="text-end">
                            <p class="mb-1"><strong>Issue Date: </strong></p>
                            <p class="mb-1"><strong>Delivery Date: </strong></p>
                            <p class="mb-1"><strong>Due Date: </strong></p>
                        </div>
                        <div class="text-start">
                            <p class="mb-1">${issue_date.value || "N/A"}</p>
                            <p class="mb-1">${qdo.value.delivery_date || "N/A"}</p>
                            <p class="mb-1">${qdo.value.due_date || "N/A"}</p>
                        </div>
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
                    <tbody class="border-bottom">
                        ${items.value.length > 0
            ? items.value.map((item, index) => `
                            <tr>
                                <td>${index + 1}</td>
                                <td class="text-start">${item.name}</td>
                                <td>${item.price}</td>
                                <td>${item.quantity}</td>
                                <td>${(item.price * item.quantity).toFixed(2)}</td>

                        `).join("")
            : `<tr><td colspan="2" class="text-center">No items found</td></tr>`}
                    </tbody>
                </table>

                <div class="d-flex gap-3 justify-end m-1">
                    <p class="mb-1 text-end">Ship By: </p>
                    <p class="mb-1 text-start">${qdo.value.ship_by || "N/A"}</p>
                </div>
                <div class="d-flex gap-3 justify-end m-1">
                    <p class="mb-1 text-end">Shipping Fee: </p>
                    <p class="mb-1 text-start">RM${qdo.value.ship_fee}</p>
                </div>
                <div class="d-flex gap-3 justify-end m-1 text-lg">
                    <p class="fw-bold">Total: </p>
                    <p class="fw-bold">RM${calculate_total.value}</p>
                </div>

                <p class="mt-5"><strong>Notes:</strong> ${notes.value || "No Notes"}</p>

                <div class="mt-4 mb-4 border-s-8 border-emerald-500 pl-4">
                    <p class="mt-3 mb-px text-sm">${bankDetails.value.bank_name}</p>
                    <p class="mb-px text-sm">${bankDetails.value.acc_holder}</p>
                    <p class="mb-px text-sm">${bankDetails.value.acc_num}</p>
                </div>
            </div>
        </div>
    `;
};


const updatePreview = () => {
    previewContent.value = generatePreviewContent();
};

watch(inv, (newVal) => {
    if (newVal) {
        updatePreview();
    }
});

const validateForm = () => {
    if (!issue_date.value || items.value.length === 0) {
        Swal.fire({
            icon: "error",
            title: "Validation Error",
            text: "Please fill in all required fields.",
            confirmButtonColor: "#d33",
        });
        return false;
    }
    return true;
};

const saveInvToDatabase = async () => {
    try {
        // Simulate saving the Invoice data to a database
        const response = await axios.post('http://quotation.test/api/Invoice/Store', invData); // Adjust URL to match your backend
        const invoiceId = response.data.inv.id;
        Swal.fire("Success", "Invoice has been saved to the database!", "success");
        router.push(`/Invoice/${invoiceId}`);
    } catch (error) {
        console.error("Error saving invoice: ", error);
        Swal.fire("Error", "Failed to save invoice. Please try again.", "error");
    }
};

// Handle document generation
const generateDocument = () => {
    if (validateForm()) {
        const invData = {
            issue_date: issue_date.value.trim(),
            i_total: (parseFloat(calculate_total.value) + parseFloat(ship_fee.value)).toFixed(2),
            notes: notes.value.trim() || "",
            quoteId: quoteId.value,
            doId: doId.value,
        };
        console.log(invData)
        saveInvToDatabase(invData);
    }
};

const handleBeforeUnload = (event) => {
    event.preventDefault();
    event.returnValue = ";"
};

onBeforeRouteLeave((to, from, next) => {
    Swal.fire({
        title: "Are you sure?",
        text: "The data will not be saved!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#d33",
        cancelButtonColor: "#3085d6",
        confirmButtonText: "Yes, leave",
        cancelButtonText: "Stay",
    }).then((result) => {
        if (result.isConfirmed) {
            next(); // Allow navigation
        } else {
            next(false); // Cancel navigation
        }
    });
});

watchEffect(() => {
    updatePreview();
});

onMounted(() => {
    fetchDetails();
    updatePreview();
    window.removeEventListener("beforeunload", handleBeforeUnload);
});

onUnmounted(() => {
    window.removeEventListener("beforeunload", handleBeforeUnload);
});
</script>
