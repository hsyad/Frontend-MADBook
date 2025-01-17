<template>
    <main>
        <div class="page">
            <div class="live-preview" v-html="sanitizedContent">
            </div>

            <div class="form">
                <!-- <p v-if="referenceNumber">Quote No: {{ referenceNumber }}</p> -->
                <p class="mb-5"><strong>Quote No: <span class="auto-generate"> #{{ referenceNumber }}</span></strong>
                </p>

                <button type="button" class="add-logo-btn">
                    <span class="material-icons">upload</span>
                    <span class="text">Add your logo</span>
                </button>


                <form @submit.prevent="" generateDocument>
                    <div class="form-row">
                        <div style="flex: 1;">
                            <label for="name">From:</label>
                            <input type="text" v-model="emailFrom" placeholder="Enter your email" />
                            <textarea v-model="businessAddress" placeholder="Enter your business address" />
                        </div>

                        <div style="flex: 1;">
                            <label for="name">For:</label>
                            <input type="text" v-model="customerName" placeholder="Enter customer name" />
                            <input type="text" v-model="emailCustomer" placeholder="Enter customer email" />
                            <textarea v-model="customerDetails" placeholder="Enter your customer address" />
                        </div>
                    </div>

                    <div class="form-row">
                        <div style="flex: 1">
                            <label for="date">Issue Date: </label>
                            <input type="date" v-model="issueDate" />
                        </div>

                        <div style="flex: 1">
                            <label for="date">Valid Until: </label>
                            <input type="date" v-model="validUntil" />
                        </div>
                    </div>

                    <table>
                        <thead>
                            <tr>
                                <th>No.</th>
                                <th>Items</th>
                                <th>Price</th>
                                <th>Quantity</th>
                                <th>Total</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, index) in items" :key="index">
                                <td>{{ index + 1 }}</td>
                                <td><input class="mt-1.5" type="text" v-model="item.name" /></td>
                                <td><input class="mt-1.5" type="number" v-model="item.price" /></td>
                                <td><input class="mt-1.5" type="number" v-model="item.quantity" /></td>
                                <td>{{ (item.quantity * item.price) || 0 }}</td>
                                <td><button type="button" class="icon-btn" @click="removeItem(index)"><i
                                            class="fas fa-trash"></i></button></td>
                            </tr>
                        </tbody>
                    </table>

                    <button type="button" class="add-item-btn icon-btn" @click="addItem">
                        <i class="fas fa-plus"></i>Add Item
                    </button>

                    <div>
                        <label for="notes">Notes: <i
                                style="font-size: 12px; font-weight: 400; color: #9ca2a9">(optional*)</i></label>
                        <textarea placeholder="Enter notes here..." v-model="notes"></textarea>
                    </div>

                    <div class="total">
                        <span>Total: RM{{ total }}</span>
                    </div>

                    <button type="submit" class="generate-btn">Generate Document</button>
                </form>

            </div>
        </div>
    </main>
</template>

<script>
import { watch } from 'vue';
import DOMPurify from 'dompurify';

export default {
    data() {
        return {
            referenceNumber: "",

            emailFrom: "",
            businessAddress: "",
            customerName: "",
            emailCustomer: "",
            customerDetails: "",
            issueDate: "",
            validUntil: "",
            items: [
                { name: "", price: 0, quantity: 0 },
            ],
            notes: "",
            previewContent: "",
        };
    },
    methods: {
        // API INTEGRATION
        // async fetchReferenceNumber() {
        //     try {
        //         const response = await fetch("https://api.example.com/quotation");
        //         const data = await response.json();
        //         this.referenceNumber = data.referenceNumber; // adjust key based on API response
        //     } catch (error) {
        //         console.error("Error fetching reference number:", error);
        //     }
        // },
        generatedRandNum() {
            const randomNumber = Math.floor(Math.random() * 10000);
            this.referenceNumber = `${randomNumber}`;
        },
        addItem() {
            this.items.push({ name: "", price: 0, quantity: 0 });
        },
        removeItem(index) {
            this.items.splice(index, 1);
        },
        generateDocument() {
            alert("Document generated successfully!");
        },
        generatePreviewContent() {
            return `
            <h2 style="text-align: right;">Quote</h2>

            <p style="color: grey; font-size: 14px;">${this.businessAddress} | ${this.emailFrom}</p>
            <p><strong>For:</strong> ${this.customerName}</p>
                    <p>${this.customerDetails}</p>

            <p><strong>Quote No:</strong> ${this.referenceNumber}</p>
            <p><strong>Issue Date:</strong> ${this.issueDate}</p>
            <p><strong>Valid Until:</strong> ${this.validUntil}</p>

            <table style="border-collapse: collapse; width: 100%; margin-top: 50px; box-shadow: none;">
                <thead style="background-color: lightgrey; color: black;">
                    <tr>
                        <th style="border: 1px solid #ddd; padding: 8px; font-size: 12px;">No.</th>
                        <th style="border: 1px solid #ddd; padding: 8px; font-size: 12px;">Items</th>
                        <th style="border: 1px solid #ddd; padding: 8px; font-size: 12px;">Price</th>
                        <th style="border: 1px solid #ddd; padding: 8px; font-size: 12px;">Quantity</th>
                        <th style="border: 1px solid #ddd; padding: 8px; font-size: 12px;">Total</th>
                    </tr>
                </thead>
                <tbody>
                    ${this.items
                    .map(
                        (item, index) => `
                                <tr>
                                    <td style="border: 1px solid #ddd; padding: 8px;">${index + 1}</td>
                                    <td style="border: 1px solid #ddd; padding: 8px; text-align: left;">${item.name}</td>
                                    <td style="border: 1px solid #ddd; padding: 8px;">${item.price}</td>
                                    <td style="border: 1px solid #ddd; padding: 8px;">${item.quantity}</td>
                                    <td style="border: 1px solid #ddd; padding: 8px;">${item.price * item.quantity || 0}</td>
                                </tr>
                            `
                    )
                    .join("")}
                </tbody>
            </table>

            <p style="margin-top: 20px;"><strong>Notes:</strong> ${this.notes}</p>
            <p style="text-align: right; font-size: 18px; font-weight: bold;">Total: RM${this.total}</p>
        `;
        },
        updatePreview() {
            this.previewContent = this.generatePreviewContent();
        },
    },
    computed: {
        sanitizedContent() {
            return DOMPurify.sanitize(this.previewContent);
        },
        total() {
            return this.items.reduce((sum, item) => sum + item.price * item.quantity, 0);
        },
    },
    watch: {
        emailFrom: "updatePreview",
        businessAddress: "updatePreview",
        customerName: "updatePreview",
        emailCustomer: "updatePreview",
        customerDetails: "updatePreview",
        issueDate: "updatePreview",
        validUntil: "updatePreview",
        items: {
            deep: true,
            handler: "updatePreview",
        },
        notes: "updatePreview",
    },
    mounted() {
        // API INTEGRATION
        // this.fetchReferenceNumber();
        this.generatedRandNum();
        this.updatePreview();
    },
};
</script>

<style lang="scss" scoped>
.page {
    display: flex;
    height: 100vh;
    background-color: white;
    border-radius: 10px;
}

.live-preview {
    flex: 0.8;
    padding: 20px;
    border-right: 1px solid #ddd;
}

.form {
    flex: 1;
    padding: 20px;
}

input {
    margin-bottom: 5px;
}

.add-logo-btn {
    background-color: #fff;
    border: 1px dashed #00a000;
    padding: 8px 10px;
    cursor: pointer;
    color: #00a000;
    margin-bottom: 20px;
    align-items: center;

    display: inline-flex;

    .material-icons {
        margin-right: 10px;
    }
}

.form-row {
    display: flex;
    gap: 10px;
    align-items: first baseline;

    label {
        display: flex;
    }

    input {
        width: 100%;
        padding: 10px;
        border: 1px solid #ccc;
        border-radius: 7px;
        box-shadow: none;
    }
}

textarea {
    box-shadow: none;
    border: 1px solid #ccc;
    border-radius: 7px;
    margin-bottom: 15px;

}

table {
    border-collapse: collapse;
    width: 100%;
    border-radius: 12px;
    margin-top: 15px;

    th,
    td {
        border: 1px solid #ddd;
        text-align: center;
        vertical-align: middle;
        padding: 10px;
    }

    th {
        background-color: #172554;
        color: white;
        font-weight: bold;
    }

    td input {
        width: 100%;
        box-sizing: border-box;
        padding: 5px;
        border: 1px solid #ccc;
        border-radius: 5px;
        box-shadow: none;
    }

    td button {
        background-color: transparent;
        border: none;
        color: red;
        cursor: pointer;
    }
}

.add-item-btn {
    margin-bottom: 15px;
    padding: 5px 12px;
    background-color: #00a000;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 5px;
}

.total {
    font-size: 18px;
    text-align: right;
    margin-bottom: 20px;
    font-weight: bold;
}

.generate-btn {
    width: 100%;
    background-color: #00a000;
    color: #fff;
    padding: 10px;
    border: none;
    border-radius: 5px;
    font-size: 16px;
    cursor: pointer;
}
</style>
