<template>
    <main>
        <!-- TITLE/SUBJECT -->
        <div class="bg-white p-3 rounded-md mb-3">
            <h3 class="font-bold mt-2 mb-4 border-b-2 pb-3">Create New Delivery Order</h3>
            <div class="d-flex gap-2 align-middle">
                <!-- <label for="subject">Subject: </label> -->
                <p class="fw-semibold">Subject:</p>
                <p class="text-gray-600">{{ qdo.subject }}</p>
            </div>
        </div>

        <!-- MAIN CONTAINER -->
        <div class="d-flex overflow-auto bg-white rounded-3">

            <!-- LIVE PREVIEW COLUMN -->
            <div class="d-flex flex-column p-3 border-end" style="flex:0.8" v-html="sanitizedContent"></div>

            <!-- FORM COLUMN -->
            <div v-if="qdo" class="p-3 flex-1">
                <p class="my-3 mb-5"><strong>DO No: <span class="auto-generate">
                            {{ "#MAD00" + doId.id }}</span></strong>
                </p>

                <!-- FORM INPUT -->
                <form @submit.prevent="generateDocument">
                    <div class="d-flex gap-2 align-baseline">
                        <div class="flex-1">
                            <label for="name">Delivery To:</label>
                            <input type="text" v-model="c_name" placeholder="Enter customer name" />
                            <input type="text" v-model="c_no" placeholder="Enter customer phone number" />
                            <textarea rows="3" v-model="c_address"
                                placeholder="Eg: 456 Client Road,&#10;Town, 12345,&#10;State" />
                        </div>
                        <div class="flex-1">
                            <label for="date">Issue Date: </label>
                            <input type="date" v-model="issue_date" />
                            <label class="mt-2" for="date">Delivery Date: </label>
                            <input type="date" v-model="delivery_date" />
                            <label class="mt-2" for="date">Due Date: </label>
                            <input type="date" v-model="due_date" />
                        </div>
                    </div>

                    <!-- TABLE -->
                    <table class="rounded-md mt-4">
                        <thead>
                            <tr>
                                <th class="text-start">Items</th>
                                <th class="h-10 w-52">Quantity</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, index) in items" :key="index">
                                <td class="text-start py-2 px-3">{{ item.name }}</td>
                                <td class="text-center col border-l-2 border-gray-200">{{ item.quantity }}</td>
                            </tr>
                        </tbody>
                    </table>

                    <!-- SHIPPING -->
                    <div class="d-flex mt-3 gap-2 items-center align-baseline">
                        <label class="whitespace-nowrap" for="name">Ship By:</label>
                        <input type="text" v-model="ship_by" placeholder="Ninjavan" />
                        <label class="whitespace-nowrap" for="name">Shipping Fee: </label>
                        <input type="number" v-model="ship_fee" placeholder="RM10" />
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
                                    id="bank_name" placeholder="Enter bank name" />
                            </div>
                            <div>
                                <label for="acc_holder">Account Holder Name:</label>
                                <input class="mb-2 p-2 w-100%" type="text" v-model="bankDetails.acc_holder"
                                    id="acc_holder" placeholder="Enter account holder name" />
                            </div>
                            <div>
                                <label for="acc_num">Account Number:</label>
                                <input class="mb-2 p-2 w-100%" type="text" v-model="bankDetails.acc_num" id="acc_num"
                                    placeholder="Enter your account number" />
                            </div>

                        </div>
                    </div>

                    <!-- CALCULATE TOTAL -->
                    <div class="text-lg text-right mt-3 mb-5 font-bold">
                        <span>Total: RM{{ calculate_total }}</span>
                    </div>

                    <!-- GENERATE/SAVE DOCUMENT -->
                    <button type="submit" @click="goToHome"
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
import { onBeforeRouteLeave } from 'vue-router';

//CLIENT DETAILS
const c_name = ref('Hasya');
const c_no = ref('0123456789');
const c_address = ref('alamat mana2');

//DATES
const issue_date = ref('2025-02-20');
const delivery_date = ref('2025-02-26');
const due_date = ref('2025-02-28');

//SHIPPING
const ship_by = ref('Ninja Hatori');
const ship_fee = ref(10);

const notes = ref('Sila buat pembayaran sebelum tarikh akhir. Terima kasih!');

// BANK DETAILS
const showForm = ref(false);
const bankDetails = ref({
    bank_name: 'CIMB Bank',
    acc_holder: 'Hasya',
    acc_num: '1234567890',
});

// const delivery_order_id = ref(); // Gunakan ref untuk boleh dikemas kini
const quote = ref({});
const items = ref([]);
const qdo = ref({});
const total = ref(0); // Deklarasikan total supaya tidak undefined

const previewContent = ref('');
const sanitizedContent = computed(() => DOMPurify.sanitize(previewContent.value));

const quoteId = ref('');
const doId = defineProps({
    id: {
        required: true,
        type: String
    }
})

const doData = ref({
    quoteId: quoteId.value
});

// Calculate the total of the items amount + ship_fee
const calculate_total = computed(() => {
    const q_total = items.value.reduce((sum, item) => sum + item.price * item.quantity, 0);
    return (q_total + parseFloat(ship_fee.value)).toFixed(2);
});

const toggleForm = () => {
    showForm.value = !showForm.value;
};

const fetchDetails = async () => {
    if (!doId.id) {
        console.error("Error: DO ID is undefined");
        return;
    }

    try {
        const response = await axios.get(`http://quotation.test/api/Quotation/${doId.id}`);
        console.log(response.data);

        quoteId.value = response.data.quotation_id;
        qdo.value = response.data;
        quote.value = response.data.quotations;
        items.value = response.data.q_items;
        // total.value = response.data.do_total || 0;

        updatePreview();
    } catch (error) {
        console.error("Error fetching details:", error);
    }
};

const generatePreviewContent = () => {
    return `
        <div class="border border-dark rounded p-3">
            <div class="px-3">
                <h2 class="mt-4 text-end fw-semibold">Delivery Order</h2>

                <div class="d-flex justify-flex-start items-center my-4">
                    ${quote.value?.logo ? `
                        <div class="d-inline-block overflow-hidden h-20">
                            <img src="${quote.value.logo}" alt="logo" class="h-100 object-contain">
                        </div>
                        ` : ""}
                </div>

                <p class="text-secondary small">
                    ${qdo.value.address || "No Address"} | ${qdo.value.email || "No Email"}
                </p>

                <div class="d-flex justify-between my-4">
                    <div class="text-start flex-grow-1">
                        <p class="mb-1"><strong>Delivery To:</strong></p>
                        <p class="mb-1 fs-7">${c_name.value}</p>
                        <p class="mb-1 fs-7">${c_no.value}</p>
                        <p class="mb-1 fs-7 whitespace-pre">${c_address.value}</p>
                    </div>

                    <div class=" d-flex gap-2 justify-end">
                        <div class="text-end">
                            <p class="mb-1"><strong>DO No: </strong></p>
                            <p class="mb-1"><strong>Issue Date: </strong></p>
                            <p class="mb-1"><strong>Delivery Date: </strong></p>
                            <p class="mb-1"><strong>Due Date: </strong></p>
                        </div>
                        <div class="text-start">
                            <p class="mb-1">#MAD00${doId.id}</p>
                            <p class="mb-1">${issue_date.value}</p>
                            <p class="mb-1">${delivery_date.value}</p>
                            <p class="mb-1">${due_date.value}</p>
                        </div>
                    </div>
                </div>

                <table class="table table-borderless shadow-none">
                    <thead class="table-secondary">
                        <tr>
                            <th class="w-auto text-start">Items</th>
                            <th class="w-20">Quantity</th>
                        </tr>
                    </thead>
                    <tbody class="border-bottom">
                        ${items.value.length > 0
            ? items.value
                .map(item => `
                                            <tr>
                                                <td class="text-start">${item.name}</td>
                                                <td class="w-10 text-center">${item.quantity}</td>
                                            </tr>
                                        `
                )
                .join("")
            : `<tr><td colspan="2" class="text-center">No items found</td></tr>`}
                    </tbody>
                </table>

                <div class="d-flex flex-column align-items-end gap-2 mt-10">
                    <div v-if="ship_by.value" class="d-flex justify-content-end w-100">
                        <p class="mb-px text-end">Ship By:</p>
                        <p class="mb-px text-end ms-2">${ship_by.value}</p>
                    </div>
                    <div class="d-flex justify-content-end w-100 fw-semibold">
                        <p class="text-end">Shipping Fee:</p>
                        <p class="text-end ms-2">RM${ship_fee.value}</p>
                    </div>
                    <div class="d-flex justify-content-end w-100 fw-semibold">
                        <p class="text-end">Total:</p>
                        <p class="text-end ms-2">RM${calculate_total.value}</p>
                    </div>
                </div>


                <p class="mt-5"><strong>Notes:</strong> ${notes.value}</p>
                <div class="mt-4 mb-4 border-s-8 border-emerald-500 pl-4">
                    <p class="mt-3 mb-px text-sm"> ${bankDetails.value.bank_name}</p>
                    <p class="mb-px text-sm"> ${bankDetails.value.acc_holder}</p>
                    <p class="mb-px text-sm"> ${bankDetails.value.acc_num}</p>
                </div>

            </div>
        </div>
    `;
};

const updatePreview = () => {
    previewContent.value = generatePreviewContent();
};

watch(qdo, (newVal) => {
    if (newVal) {
        updatePreview();
    }
});

// Validate form inputs
const validateForm = () => {
    if (!c_name.value || items.value.length === 0) {
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

const saveDOToDatabase = async () => {
    try {
        // Simulate saving the DO data to a database
        const response = await axios.post('http://quotation.test/api/DO/Store', doData); // Adjust URL to match your backend
        const doId = response.data.qdo.id;
        Swal.fire("Success", "Delivery order has been saved to the database!", "success");
        router.push(`/DO/${doId}`);
    } catch (error) {
        console.error("Error saving delivery order: ", error);
        Swal.fire("Error", "Failed to save delivery order. Please try again.", "error");
    }
};

// Handle document generation
const generateDocument = () => {
    if (validateForm()) {
        const doData = {
            issue_date: issue_date.value.trim(),
            delivery_date: delivery_date.value.trim(),
            due_date: due_date.value.trim(),
            ship_by: ship_by.value.trim(),
            ship_fee: parseFloat(ship_fee.value) || 0,
            c_name: c_name.value.trim(),
            c_no: c_no.value.trim(),
            c_address: c_address.value.trim(),
            do_total: (parseFloat(calculate_total.value) + parseFloat(ship_fee.value)).toFixed(2),
            notes: notes.value.trim() || "",
            quoteId: quoteId.value,
        };
        console.log(doData)
        saveDOToDatabase(doData);
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

// Update preview when any field changes
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
