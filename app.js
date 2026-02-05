const API = "http://localhost:8081/api";

function downloadFile(blob, filename) {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
}

function setStatus(msg) {
    document.getElementById("status").innerText = msg;
}

/* Image → PDF */
async function imageToPdf() {
    const files = document.getElementById("imgFiles").files;
    if (!files.length) return alert("Select images");

    const formData = new FormData();
    for (let file of files) {
        formData.append("files", file);
    }

    setStatus("Converting...");
    const res = await fetch(`${API}/img-to-pdf`, {
        method: "POST",
        body: formData
    });

    const blob = await res.blob();
    downloadFile(blob, "images.pdf");
    setStatus("Done");
}

/* PDF → Text */
async function pdfToText() {
    const file = document.getElementById("pdfFile").files[0];
    if (!file) {
        alert("Select PDF");
        return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setStatus("Extracting...");

    try {
        const res = await fetch(`${API}/pdf-to-txt`, {
            method: "POST",
            body: formData
        });

        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(errorText || "Server error");
        }

        const blob = await res.blob();
        downloadFile(blob, "output.txt");
        setStatus("Done");

    } catch (err) {
        console.error("PDF → TEXT ERROR:", err);
        setStatus("Failed");
        alert(err.message);
    }
}


/* Text → PDF */
async function txtToPdf() {
    const file = document.getElementById("txtFile").files[0];
    if (!file) {
        alert("Select text file");
        return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setStatus("Converting...");

    try {
        const res = await fetch(`${API}/txt-to-pdf`, {
            method: "POST",
            body: formData
        });

        if (!res.ok) {
            const errorText = await res.text();
            throw new Error(errorText || "Server error");
        }

        const blob = await res.blob();
        downloadFile(blob, "text.pdf");
        setStatus("Done");

    } catch (err) {
        console.error("TEXT → PDF ERROR:", err);
        setStatus("Failed");
        alert(err.message);
    }
}


/* DOCX → PDF */
async function docxToPdf() {
    const file = document.getElementById("docxFile").files[0];
    if (!file) return alert("Select DOCX file");

    const formData = new FormData();
    formData.append("file", file);

    setStatus("Converting...");
    const res = await fetch(`${API}/docx-to-pdf`, {
        method: "POST",
        body: formData
    });

    const blob = await res.blob();
    downloadFile(blob, "word.pdf");
    setStatus("Done");
}

/* Compress PDF */
async function compressPdf() {
    const file = document.getElementById("compressFile").files[0];
    if (!file) return alert("Select PDF");

    const formData = new FormData();
    formData.append("file", file);

    setStatus("Compressing...");
    const res = await fetch(`${API}/compress`, {
        method: "POST",
        body: formData
    });

    const blob = await res.blob();
    downloadFile(blob, "compressed.pdf");
    setStatus("Done");
}

// merge PDFs
async function mergePdf() {
    const files = document.getElementById("mergeFiles").files;

    if (files.length < 2) {
        alert("Select at least two PDF files");
        return;
    }

    const formData = new FormData();

    for (let file of files) {
        formData.append("files", file); // MUST be "files"
    }

    setStatus("Merging...");

    try {
        const res = await fetch(`${API}/merge`, {
            method: "POST",
            body: formData
        });

        if (!res.ok) {
            const err = await res.text();
            throw new Error(err);
        }

        const blob = await res.blob();
        downloadFile(blob, "merged.pdf");
        setStatus("Done");

    } catch (err) {
        console.error(err);
        setStatus("Merge failed");
        alert(err.message);
    }
}

