// SIGNUP
async function signup() {
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const pass = document.getElementById("password").value;

    const user = await auth.createUserWithEmailAndPassword(email, pass);

    await db.collection("users").doc(user.user.uid).set({
        username: username,
        coins: 0,
        lastBonus: 0,
    });

    location.href = "dashboard.html";
}

// LOGIN
async function login() {
    const email = document.getElementById("email").value;
    const pass = document.getElementById("password").value;

    await auth.signInWithEmailAndPassword(email, pass);

    location.href = "dashboard.html";
}

// LOGOUT
function logout() {
    auth.signOut();
    location.href = "index.html";
}

// DASHBOARD LOADER
auth.onAuthStateChanged(async user => {
    if (!user) return;

    const snap = await db.collection("users").doc(user.uid).get();
    const data = snap.data();

    if (document.getElementById("welcome"))
        document.getElementById("welcome").innerText = "Welcome " + data.username;

    if (document.getElementById("coins"))
        document.getElementById("coins").innerText = data.coins;

    if (document.getElementById("refLink"))
        document.getElementById("refLink").innerText =
            location.origin + "/signup.html?ref=" + data.username;

    // REFERRAL
    const url = new URL(window.location.href);
    const ref = url.searchParams.get("ref");

    if (ref) {
        const q = await db.collection("users").where("username", "==", ref).get();

        if (!q.empty) {
            const refUser = q.docs[0];
            await refUser.ref.update({
                coins: firebase.firestore.FieldValue.increment(10)
            });
        }
    }
});

// DAILY BONUS
async function dailyBonus() {
    const user = auth.currentUser;
    const ref = db.collection("users").doc(user.uid);
    const snap = await ref.get();

    const data = snap.data();
    const now = Date.now();

    if (now - data.lastBonus < 86400000) {
        alert("Already claimed!");
        return;
    }

    await ref.update({
        coins: data.coins + 20,
        lastBonus: now
    });

    alert("Bonus added!");
    location.reload();
}

// API COST
async function useApi(url) {
    const user = auth.currentUser;
    const ref = db.collection("users").doc(user.uid);
    const snap = await ref.get();
    const data = snap.data();

    if (data.coins < 2) {
        alert("Not enough coins!");
        return;
    }

    await ref.update({
        coins: data.coins - 2
    });

    location.href = url;
}
