const firebaseConfig = {
    apiKey: "AIzaSyCFa-AAOve_7gsoFiOYso8RsMQedzzmG3s",
    authDomain: "e-mail-verify-52219.firebaseapp.com",
    projectId: "e-mail-verify-52219",
    messagingSenderId: "959626034390",
    appId: "1:959626034390:web:348eae947b13b862ca5d77"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

async function sendToFirestore() {
    const target = document.getElementById('target').value;
    const reason = document.getElementById('reason').value;
    const proofUrl = document.getElementById('proofUrl').value;
    const status = document.getElementById('status');

    if (!target || !reason) {
        status.innerText = "Error: All required fields must be filled.";
        status.style.color = "#f85149";
        return;
    }

    status.innerText = "MDDECN AI is evaluating your request...";
    status.style.color = "#e3b341";

    let finalStatus = "REJECTED";
    let aiNote = "Insufficient or invalid justification.";

    const professionalKeywords = ["work", "job", "business", "proposal", "contract", "partnership", "hiring", "urgent"];
    const containsKeyword = professionalKeywords.some(word => reason.toLowerCase().includes(word));
    const isDescriptive = reason.length > 35;
    const hasLink = proofUrl.startsWith("http");

    if (isDescriptive && containsKeyword && hasLink) {
        finalStatus = "APPROVED";
        aiNote = "Identity and professional intent verified.";
    } else if (isDescriptive && containsKeyword) {
        finalStatus = "PENDING_REVIEW";
        aiNote = "Strong justification, but proof link is unverified.";
    }

    try {
        await db.collection("contact_requests").add({
            target_user: target,
            justification: reason,
            proof_link: proofUrl || "None provided",
            status: finalStatus,
            ai_score: aiNote,
            created_at: firebase.firestore.FieldValue.serverTimestamp()
        });

        if (finalStatus === "APPROVED") {
            status.innerText = "✅ Request approved by AI. Data stored.";
            status.style.color = "#3fb950";
        } else if (finalStatus === "PENDING_REVIEW") {
            status.innerText = "⚠️ Under review. AI needs more evidence.";
            status.style.color = "#e3b341";
        } else {
            status.innerText = "❌ Denied: " + aiNote;
            status.style.color = "#f85149";
        }

        document.getElementById('target').value = '';
        document.getElementById('reason').value = '';
        document.getElementById('proofUrl').value = '';

    } catch (error) {
        status.innerText = "Database Error: " + error.message;
        status.style.color = "#f85149";
    }
}
