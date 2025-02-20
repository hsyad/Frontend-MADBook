<template>
    <div v-if="showEditModal" class="modal fade show d-block">
        <div class="modal-dialog modal-lg">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">Edit Delivery Order</h5>
                </div>
                <div class="modal-body">
                    <form @submit.prevent="saveEdit">

                        <!-- EDIT DELIVERY DETAILS -->
                        <div class="d-flex gap-2 align-baseline">
                            <div class="flex-1">
                                <label>Delivery To: </label>
                                <input type="text" v-model="qdo.c_name" placeholder="Enter customer name" />
                                <input type="text" v-model="qdo.c_no" placeholder="Enter customer phone number" />
                                <textarea rows="3" id="c_address" v-model="qdo.c_address"
                                    placeholder="Eg: 456 Client Road, Town, 12345, State"></textarea>
                            </div>

                            <!-- EDIT DATES -->
                            <div class="flex-1">
                                <label for="date">Issue Date: </label>
                                <input type="date" v-model="qdo.issue_date" />
                                <label class="mt-2" for="date">Delivery Date: </label>
                                <input type="date" v-model="qdo.delivery_date" />
                                <label class="mt-2" for="date">Due Date: </label>
                                <input type="date" v-model="qdo.due_date" />
                            </div>
                        </div>

                        <!-- EDIT SHIPPING DETAILS -->
                        <div class="d-flex mt-3 gap-3 items-center align-baseline">
                            <label class="whitespace-nowrap" for="name">Ship By: </label>
                            <input type="text" v-model="qdo.ship_by" placeholder="Ninjavan" />
                            <label class="whitespace-nowrap" for="name">Shipping Fee: </label>
                            <input type="number" v-model="qdo.ship_fee" placeholder="RM10.00 " />
                        </div>

                        <!-- EDIT NOTES -->
                        <div>
                            <label for="notes">Notes: <i
                                    class="text-xs font-light text-gray-400">(optional*)</i></label>
                            <textarea placeholder="Enter notes here..." v-model="qdo.notes"></textarea>
                        </div>

                        <!-- ADD BANK DETAILS -->
                        <div class="mt-3 mb-3">
                            <button type="button" class="btn btn-outline-success mb-3" @click="toggleBankDetails">
                                <i>Add Bank Details</i>
                            </button>

                            <div v-if="showBankDetails">
                                <div>
                                    <label for="bank_name">Bank Name</label>
                                    <input type="text" v-model="bankDetails.bank_name" class="mb-2 p-2 w-100%"
                                        id="bank_name" placeholder="Enter bank name" />
                                </div>
                                <div>
                                    <label for="acc_holder">Account Holder</label>
                                    <input type="text" v-model="bankDetails.acc_holder" class="mb-2 p-2 w-100%"
                                        id="acc_holder" placeholder="Enter account holder name" />
                                </div>
                                <div>
                                    <label for="acc_num">Account Number</label>
                                    <input type="text" v-model="bankDetails.acc_num" class="mb-2 p-2 w-100%"
                                        id="acc_num" placeholder="Enter account number" />
                                </div>
                            </div>
                        </div>

                        <!-- EDIT ACTIONS -->
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" @click="closeModal">Cancel</button>
                            <button type="submit" class="btn btn-success">Save</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>

    <!-- Overlay -->
    <div v-if="showEditModal" class="modal-backdrop fade show"></div>
</template>

<script setup>
import axios from 'axios';
import Swal from 'sweetalert2';
import { ref, watch, defineEmits, defineProps, onMounted } from 'vue';

const props = defineProps({
    showEditModal: Boolean,
    qdo: Object,
    bankDetails: Object,
});

const emit = defineEmits(["saveEdit", "update:showEditModal", "close", "save"]);

// Reactive state for qdo and bank details
const qdo = ref({});

// Bank details reactive object
const bankDetails = ref({});

// Fetch delivery order details from API
const fetchDODetails = async () => {
    try {
        const response = await axios.get(`http://quotation.test/api/DO/${qdo.value.id}`);
        console.log("API Response:", response.data); // Debugging

        if (response.data) {
            qdo.value = response.data;

            if (response.data.q_bank_details) {
                bankDetails.value = {
                    bank_name: response.data.q_bank_details.bank_name || "",
                    acc_holder: response.data.q_bank_details.acc_holder || "",
                    acc_num: response.data.q_bank_details.acc_num || ""
                };
            }
        }

    } catch (error) {
        console.error("Error fetching delivery order:", error);
    }
};

// Watch for changes in props.qdo and update data
watch(() => props.qdo, async (newDO) => {
    if (newDO) {
        qdo.value = { ...newDO };

        bankDetails.value = {};

        if (newDO.id) await fetchDODetails();
    }
}, { immediate: true });


// Toggle bank details visibility
const showBankDetails = ref(false);
const toggleBankDetails = () => {
    showBankDetails.value = !showBankDetails.value;
};

// Save edited delivery order
const saveEdit = async () => {
    try {
        const doId = qdo.value.id;
        const saveData = {
            ...qdo.value,
            bank_name: bankDetails.value.bank_name,
            acc_holder: bankDetails.value.acc_holder,
            acc_num: bankDetails.value.acc_num,
        };

        const response = await axios.put(`http://quotation.test/api/DO/Update/${doId}`, saveData, {
            headers: { "Content-Type": "application/json" }
        });

        if (response.status === 200) {
            Swal.fire({
                title: "Success",
                text: "Delivery Order updated successfully",
                icon: "success",
                confirmButtonColor: "#4cbb17",
            });

            closeModal();
        } else {
            throw new Error("Failed to update delivery order");
        }
    } catch (error) {
        Swal.fire("Error", error.response?.data?.message || "Failed to update delivery order", "error");
    }
};

// Close modal
const closeModal = () => {
    emit("update:showEditModal", false);
};
</script>
