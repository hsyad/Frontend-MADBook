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
                <label for="name">Delivery To: </label>
                <input type="text" v-model="devOr.c_name" placeholder="Enter customer name" />
                <input type="text" v-model="devOr.c_no" placeholder="Enter customer phone number" />
                <textarea rows="3" id="c_address" v-model="devOr.c_address" placeholder="Eg: 456 Client Road, Town, 12345, State"></textarea>
              </div>

              <!-- EDIT DATES -->
              <div class="flex-1">
                <label for="date">Issue Date: </label>
                <input type="date" v-model="devOr.issue_date" />
                <label class="mt-2" for="date">Delivery Date: </label>
                <input type="date" v-model="devOr.delivery_date" />
                <label class="mt-2" for="date">Due Date: </label>
                <input type="date" v-model="devOr.due_date" />
              </div>
            </div>

            <!-- EDIT SHIPPING DETAILS -->
            <div class="d-flex mt-3 gap-3 items-center align-baseline">
              <label class="whitespace-nowrap" for="name">Ship By: </label>
              <input type="text" v-model="devOr.ship_by" placeholder="Ninjavan" />
              <label class="whitespace-nowrap" for="name">Shipping Fee: </label>
              <input type="number" v-model="devOr.ship_fee" placeholder="RM10.00 " />
            </div>

            <!-- EDIT NOTES -->
            <div>
              <label for="notes">Notes: <i class="text-xs font-light text-gray-400">(optional*)</i></label>
              <textarea placeholder="Enter notes here..." v-model="devOr.notes"></textarea>
            </div>

            <!-- ADD BANK DETAILS -->
            <div class="mt-2 mb-3">
              <button type="button" class="btn btn-outline-success mb-3" @click="toggleBankDetails">
                <i>Add Bank Details</i>
              </button>

              <div v-if="showBankDetails">
                <div>
                  <label for="bank_name">Bank Name</label>
                  <input type="text" v-model="bankDetails.bank_name" class="mb-2 p-2 w-100%" id="bank_name" placeholder="Enter bank name" />
                </div>
                <div>
                  <label for="acc_holder">Account Holder</label>
                  <input type="text" v-model="bankDetails.acc_holder" class="mb-2 p-2 w-100%" id="acc_holder" placeholder="Enter account holder name" />
                </div>
                <div>
                  <label for="acc_num">Account Number</label>
                  <input type="text" v-model="bankDetails.acc_num" class="mb-2 p-2 w-100%" id="acc_num" placeholder="Enter account number" />
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
    do: Object, // The delivery order data
});

const emit = defineEmits(["saveEdit", "update:showEditModal", "close", "save"]);

const doOrder = ref({ ...props.do }); // Store the delivery order details
const showBankDetails = ref(false); // Toggle for bank details visibility

// Fetch delivery order details on mount
const fetchDODetails = async () => {
    try {
        const response = await axios.get(`http://quotation.test/api/DO/${doOrder.value.id}`);
        if (response.data) {
            doOrder.value = response.data;
        }
    } catch (error) {
        console.error("Error fetching delivery order:", error);
    }
};

// Watch for changes in props and update doOrder data
watch(() => props.do, async (newDO) => {
    if (newDO.id) {
        await fetchDODetails();
    }
});

// Toggle bank details visibility
const toggleBankDetails = () => {
    showBankDetails.value = !showBankDetails.value;
};

// Save edited delivery order
const saveEdit = async () => {
    try {
        const doId = doOrder.value.id;
        const response = await axios.put(`http://quotation.test/api/DO/Update/${doId}`, {
            ...doOrder.value, // Send updated delivery order data
            bank_name: doOrder.value.bank_name,
            acc_holder: doOrder.value.acc_holder,
            acc_num: doOrder.value.acc_num,
        }, {
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

// Fetch delivery order details on mounted
onMounted(async () => {
    if (props.do.id) {
        await fetchDODetails();
    }
});
</script>

