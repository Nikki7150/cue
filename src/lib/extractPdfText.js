import pdfToText from "react-pdftotext";

export async function extractPdfText(file) {
    try {
        const text = await pdfToText(file);
        return text;
    } catch (error) {
        console.error('extractPdfText failed: ', error);
        throw error;
    }
}