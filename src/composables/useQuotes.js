import axios from "axios";
import { ref } from "vue";
import { useRoute } from "vue-router";

export function useQuote() {
    const route = useRoute();
    const quote = ref({});
    const items = ref({});
    const borrower = ref({});

    //Fetch quotation details
    const fetchQuoteDetails = async () => {
        try {
            const quoteId = route.params.id;
            const response = await axios.get(`http://quotation.test/api/Quotation/${quoteId}`);

            if (response.data) {
                quote.value = response.data;
                items.value = response.data;

                if (quote.value.borrower_id) {
                    fetchBorrowerDetails(quote.value.borrower_id);
                }
            }
        } catch (error) {
            console.error("Error fetching quotation: ", error);
        }
    };

    //Fetch borrower details
    const fetchBorrowerDetails = async (borrowerId) => {
        try {
            const response = await axios.get(`http://quotation.test/api/borrowers/${borrowerId}`);
            borrower.value = response.data;
        } catch (error) {
            console.error("Error fetching borrower details: ", error);
        }
    };

    return { quote, items, borrower, fetchQuoteDetails };
}
