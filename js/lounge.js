/* ── 인벤토리 슬롯 20개 생성 ── */
const grid = document.getElementById("inv-grid");
for (let i = 0; i < 20; i++) {
    const d = document.createElement("div");
    d.className = "inv-slot";
    d.id = "s" + i;
    grid.appendChild(d);
}

/* ── 아이템 데이터 ── */
const ITEMS = {
    sofaNote: {
        t: "e",
        icon: "📝",
        inv: "📝",
        name: "찢어진 메모",
        desc:
        "소파 밑에 끼어 있던 작은 메모.\n\n" +
        "「 ...110... 」\n\n" +
        "정체 모를 숫자가 적혀 있다.\n탈출 비밀번호와 관련이 있어 보인다."
    },

    serverNote: {
        t: "e",
        icon: "📝",
        inv: "📝",
        name: "메모 모음",
        desc:
        "서버실 벽에 붙어있는 메모.\n\n" +
        "「 ...... 」\n\n" +
        " ~~~ 가 적혀 있다.\n탈출 비밀번호와 관련이 있어 보인다."
    },

    locker415: {
        t: "e",
        icon: "📚",
        inv: "📚",
        name: "쌓여있는 책",
        desc:
        "지저분한 사물함 속 쌓여있는 책.\n\n" +
        "「 ...110... 」\n\n" +
        "정체 모를 숫자가 적혀 있다.\n탈출 비밀번호와 관련이 있어 보인다."
    },

    locker417: {
        t: "e",
        icon: "🥢🥄",
        inv: "🥢🥄",
        name: "수저포크",
        desc:
        "수저와 포크...\n\n" +
        "학생들이 배달 음식을 많이 시켜먹은 듯하다.\n이건 필요없겠지?"
    },

    letter: {
        t: "e",
        icon: "✉️",
        inv: "✉️",
        name: "편지",
        desc:
        "이 편지는 영국에서 최초로 시작되어...\n\n" +
        "에이씨...\n7통을 보내야 한다고?"
    },

/* 서버실 카드키 
    serverCard: {
        t: "e",
        icon: "🪪",
        inv: "🪪",
        name: "카드키",
        desc:
        "발견된 카드키.\n\n" +
        "어딘가 잠긴 곳이 있을 것 같다.\n잠긴 곳이 어디였지?"
    } */
};

/* ── 사물함 상세 페이지 이동 ── */
function goLocker() {
    window.location.href = "./locker.html";
}

/* ── 소파 상세 페이지 이동 ── */
function goSofa() {
    window.location.href = "./sofa.html";
}

/* ── 사진 팝업 ── */
function openImagePopup(imagePath) {
    const popup = document.getElementById("image-popup");
    const popupImage = document.getElementById("popup-image");

    popupImage.src = imagePath;
    popup.classList.add("show");
}

function closeImagePopup(event) {
    if (event && event.target !== event.currentTarget) return;

    const popup = document.getElementById("image-popup");
    const popupImage = document.getElementById("popup-image");

    popup.classList.remove("show");
    popupImage.src = "";
}

/* ── 쿨러 on/off + 화재 이벤트 ── */
let coolerOn = true;
let coolerTimer = null;
let fireTriggered = false;

const COOLER_LIMIT_MS = 5000;

function cool() {
    if (fireTriggered) return;

    const coolerHotspot = document.getElementById("cooler-hotspot");
    const guideMsg = document.getElementById("guide-msg");
    const toast = document.getElementById("toast");

    // ON -> OFF (위험 상태 시작)
    if (coolerOn) {
        coolerOn = false;

        if (coolerHotspot) coolerHotspot.classList.remove("cooler-on");
        if (guideMsg) guideMsg.textContent = "⚠ 쿨러가 꺼졌습니다. 5초 안에 다시 켜지 않으면 화재가 발생합니다.";
        if (toast) {
            toast.textContent = "⚠ 쿨러 OFF — 5초 안에 다시 켜야 합니다.";
            toast.classList.add("show");
            setTimeout(() => toast.classList.remove("show"), 1800);
        }

        clearTimeout(coolerTimer);
        coolerTimer = setTimeout(() => {
            triggerFireEvent();
        }, COOLER_LIMIT_MS);

        return;
    }

    // OFF -> ON (위기 해제)
    coolerOn = true;
    clearTimeout(coolerTimer);
    coolerTimer = null;

    if (coolerHotspot) coolerHotspot.classList.add("cooler-on");
    if (guideMsg) guideMsg.textContent = "✅ 쿨러가 다시 작동합니다. 서버실이 안정화되었습니다.";
    if (toast) {
        toast.textContent = "❄ 쿨러 ON — 정상 상태로 복구되었습니다.";
        toast.classList.add("show");
        setTimeout(() => toast.classList.remove("show"), 1800);
    }
}

function triggerFireEvent() {
    fireTriggered = true;
    coolerOn = false;
    coolerTimer = null;

    const coolerHotspot = document.getElementById("cooler-hotspot");
    const popupFire = document.getElementById("popup-fire");
    const guideMsg = document.getElementById("guide-msg");

    if (coolerHotspot) {
        coolerHotspot.classList.remove("cooler-on");
        coolerHotspot.classList.add("taken");
    }
    if (guideMsg) guideMsg.textContent = "🔥 쿨러 정지로 인해 서버실에 화재가 발생했습니다.";
    if (popupFire) popupFire.classList.add("show");

    setTimeout(() => {
        window.location.href = './mainscreen.html';
    }, 3000);
}

function goBack() {
    location.href = "lounge.html";
}

/* ── 정답 비밀번호 ── */
const PW = "0126";

/* ── [수정] cur, col 선언을 함수보다 위로 이동 ── */
let cur = null;
let col = [];

/* ── 아이템 팝업 열기 ── */
function showPopup(id, viewOnly) {
    const d = ITEMS[id];
    document.getElementById('p-icon').innerHTML = d.t === 'i' ? `<img src="${d.icon}" alt="${d.name}">` : d.icon;
    document.getElementById('p-title').textContent = d.name;
    document.getElementById('p-desc').textContent = d.desc;
    const popup = document.getElementById('popup');
    if (viewOnly) {
        popup.classList.add('view-mode');
    } else {
        popup.classList.remove('view-mode');
        cur = id;
    }
    popup.classList.add('show');
}

function openItem(id) {
    if (col.includes(id)) {
        showPopup(id, true);
        return;
    }
    showPopup(id, false);
}

function closePopup() {
    document.getElementById('popup').classList.remove('show', 'view-mode');
    cur = null;
}

function takeItem() {
    if (!cur) return;
    const d = ITEMS[cur], idx = col.length;
    col.push(cur);
    document.querySelectorAll('.hotspot').forEach(el => {
        if (el.getAttribute('onclick')?.includes(cur)) el.classList.add('taken');
    });
    const s = document.getElementById('s' + idx);
    if (s) {
        s.innerHTML = d.t === 'i' ? `<img src="${d.inv}" alt="${d.name}" title="${d.name}">` : d.inv;
        s.title = d.name;
        s.dataset.itemId = cur;
        s.classList.add('filled');
        s.onclick = () => openItem(s.dataset.itemId);
    }
    closePopup();
}

/* ── MAP ── */
function toggleMap() {
    document.getElementById("map-panel").classList.toggle("open");
}

/* [수정] hud-topright null 체크 추가 */
document.addEventListener("click", (e) => {
    const hud = document.getElementById("hud-topright");
    if (hud && !hud.contains(e.target)) {
        document.getElementById("map-panel").classList.remove("open");
    }
});

let tt;

function goRoom(roomName) {
    const roomPaths = {
        "강의실": "./classroom.html",
        "정원치 교수님 연구실": "./jungprofessor.html",
        "장석주 교수님 연구실": "./jangprofessorMain.html",
        "라운지": "./lounge.html",
        "서버실": "./server-room.html"
    };

    document.getElementById("map-panel").classList.remove("open");

    const t = document.getElementById("toast");
    const targetPath = roomPaths[roomName];

    if (!targetPath) {
        t.textContent = `❗ ${roomName} 페이지가 아직 없습니다.`;
        t.classList.add("show");
        clearTimeout(tt);
        tt = setTimeout(() => t.classList.remove("show"), 2300);
        return;
    }

    t.textContent = `📍 ${roomName} 으로 이동합니다…`;
    t.classList.add("show");

    /* [수정] 발소리를 goRoom() 안으로 이동 */
    const snd = new Audio('sound/footstep.mp3');
    snd.volume = 0.8;
    snd.play().catch(() => {});

    clearTimeout(tt);
    tt = setTimeout(() => {
        t.classList.remove("show");
        window.location.href = targetPath;
    }, 800);
}

/* ── 탈출 팝업 ── */
function openEsc() {
    [0, 1, 2, 3].forEach((i) => {
        document.getElementById("p" + i).value = "";
    });

    document.getElementById("pw-msg").textContent = "";
    document.getElementById("popup-esc").classList.add("show");

    setTimeout(() => document.getElementById("p0").focus(), 60);
}

function closeEsc() {
    document.getElementById("popup-esc").classList.remove("show");
}

function pi(i) {
    if (document.getElementById("p" + i).value.length === 1 && i < 3) {
        document.getElementById("p" + (i + 1)).focus();
    }
}

function pk(e, i) {
    if (e.key === "Backspace" && !document.getElementById("p" + i).value && i > 0) {
        document.getElementById("p" + (i - 1)).focus();
    }
    if (e.key === "Enter") {
        tryEscape();
    }
}

function tryEscape() {
    const pw = [0, 1, 2, 3].map((i) => document.getElementById("p" + i).value).join("");

    if (pw.length < 4) {
        document.getElementById("pw-msg").textContent = "4자리를 모두 입력해주세요.";
        return;
    }

    if (pw === PW) {
        closeEsc();
        document.getElementById("popup-success").classList.add("show");
    } else {
        document.getElementById("pw-msg").textContent = "🔒 비밀번호가 틀린 것 같다…";
        [0, 1, 2, 3].forEach((i) => {
            document.getElementById("p" + i).value = "";
        });
        document.getElementById("p0").focus();
    }
}

/* ── ESC 키로 팝업 닫기 ── */
document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
        closePopup();
        closeEsc();
    }
});

/* ── [수정] 클릭 사운드 경로 ../ 제거 ── */
let audioCtx = null;

document.addEventListener('click', () => {
    if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();

    const snd = new Audio('sound/click.mp3');
    snd.volume = 0.5;
    snd.play().catch(() => {});
});