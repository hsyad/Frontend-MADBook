<template>
    <div v-if="showEditModal" class="modal fade show d-block">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Edit Quotation</h5>
                </div>
                <div class="modal-body">
                    <form @submit.prevent="saveEdit">
                        <!-- EDIT SUBJECT -->
                        <div class="d-flex gap-2 align-middle items-center mb-3">
                            <label class="fw-semibold m-0">Subject: </label>
                            <input class="m-0" type="text" v-model="quote.subject" placeholder="Enter quote subject" />
                        </div>

                        <!-- EDIT LOGO -->
                        <div class="d-flex items-center gap-3 mb-3">
                            <div v-if="logoPreview" class="overflow-hidden h-28 border rounded-md">
                                <img :src="logoPreview" alt="Logo Preview" class="h-full object-contain p-2">
                            </div>

                            <input class="d-none" type="file" id="edit_logo_upload" accept="image/*"
                                @change="handleEditLogoInput" />

                            <button type="button"
                                class="btn btn-outline-success  gap-2 h-10 d-inline-flex align-items-center text-green-800 hover-bg-success-white"
                                @click="triggerEditLogoUpload">
                                <i class="fas fa-upload"></i>
                                <span>Change logo</span>
                            </button>
                        </div>

                        <!-- EDIT BORROWER AND CLIENT DETAILS -->
                        <div class="d-flex gap-2 align-baseline">
                            <div class="flex-1">
                                <label>From:</label>
                                <input type="text" v-model="quote.address" placeholder="Enter business name">
                                <input type="email" v-model="quote.email" placeholder="Enter business email">
                            </div>
                            <div class="flex-1">
                                <label>For:</label>
                                <input type="text" v-model="quote.c_name" placeholder="Enter customer name">
                                <input type="text" v-model="quote.c_no" placeholder="Enter customer phone number">
                                <textarea rows="3" id="c_address" v-model="quote.c_address"
                                    placeholder="Eg: 456 Client Road,&#10;Town, 12345,&#10;State"></textarea>
                            </div>
                        </div>

                        <!-- EDIT DATES -->
                        <div class="mt-2 d-flex gap-2 align-baseline">
                            <div class="flex-1">
                                <label for="date">Issue Date:</label>
                                <input type="date" v-model="quote.issue_date">
                            </div>
                            <div class="flex-1">
                                <label for="date">Valid Until:</label>
                                <input type="date" v-model="quote.valid_date">
                            </div>
                        </div>

                        <!-- EDIT ITEMS -->
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
                                <tr v-for="(item, index) in quote.items" :key="index">
                                    <td class="align-middle">{{ index + 1 }}</td>
                                    <td><input type="text" v-model="item.name"></td>
                                    <td><input type="number" v-model="item.price" step="0.01"
                                            @input="updateAmount(index)"></td>
                                    <td><input type="number" v-model="item.quantity" @input="updateAmount(index)"></td>
                                    <td class="align-middle">{{ (item.quantity * parseFloat(item.price)).toFixed(2) }}
                                    </td>
                                </tr>
                            </tbody>
                        </table>

                        <!-- ADD ITEM -->
                        <button type="button"
                            class="btn btn-success mb-3 gap-2 d-inline-flex align-items-center text-green-800 hover-bg-success-text-white icon-btn"
                            @click="addItem">
                            <i class="fas fa-plus"></i>Add Item
                        </button>

                        <!-- EDIT NOTES -->
                        <div>
                            <label>Notes: <i class="text-xs font-light text-gray-400">(optional*)</i></label>
                            <textarea placeholder="Enter notes here..." v-model="quote.notes"></textarea>
                        </div>

                        <!-- ACTION BUTTONS -->
                        <div class="modal-footer">
                            <button class="btn btn-secondary" @click="closeModal">Cancel</button>
                            <button type="submit" class="btn btn-success">Save</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <!-- OVERLAY -->
    <div v-if="showEditModal" class="modal-backdrop fade show"></div>
</template>

<script setup>
import axios from 'axios';
import Swal from 'sweetalert2';
import { ref, watch, defineEmits, defineProps, onMounted } from 'vue';

const props = defineProps({
    showEditModal: Boolean,
    quote: Object,
    items: Array,
});

const emit = defineEmits(["saveEdit", "update:showEditModal", "close", "save"]);

const quote = ref({ ...props.quote });
const logoPreview = ref(null);

// Fetch quotation details on mount
const fetchQuoteDetails = async () => {
    try {
        const response = await axios.get(`http://quotation.test/api/Quotation/${quote.value.id}`);
        if (response.data) {
            quote.value = response.data;
            quote.value.items = response.data.q_items ? [...response.data.q_items] : [];
        }
    } catch (error) {
        console.error("Error fetching quotation:", error);
    }
};

// Watch for changes in the 'props.quote' and update 'quote.value'
watch(() => props.quote, async (newQuote) => {
    if (newQuote.id) {
        await fetchQuoteDetails();
    }
});

// Add a new item to the quote
const addItem = () => {
    quote.value.items.push({ name: "", price: 0, quantity: 1, amount: 0 });
};

// Update the amount for a given item
const updateAmount = (index) => {
    const item = quote.value.items[index];
    item.amount = (parseFloat(item.price) * parseFloat(item.quantity)).toFixed(2);
};

// Save edited quote
const saveEdit = async () => {
    try {
        const quoteId = quote.value.id;
        const response = await axios.put(`http://quotation.test/api/Quotation/Update/${quoteId}`, {
            ...quote.value,
            items: quote.value.items,
        }, {
            headers: { "Content-Type": "application/json" }
        });

        if (response.status === 200) {
            Swal.fire({
                title: "Success",
                text: "Quotation updated successfully",
                icon: "success",
                confirmButtonColor: "#4cbb17",
            });
            closeModal();
        } else {
            throw new Error("Failed to update quotation");
        }
    } catch (error) {
        Swal.fire("Error", error.response?.data?.message || "Failed to update quotation", "error");
    }
};

// Close modal
const closeModal = () => {
    emit("update:showEditModal", false);
};

// Handle logo input change
const handleEditLogoInput = (event) => {
    const file = event.target.files[0];
    if (file) {
        logoPreview.value = URL.createObjectURL(file);
        quote.value.logo = logoPreview.value;
    }
};

// Trigger file input for logo upload
const triggerEditLogoUpload = () => {
    document.getElementById('edit_logo_upload').click();
};

onMounted(async () => {
    if (props.quote.id) {
        await fetchQuoteDetails();
    }
});
</script>
