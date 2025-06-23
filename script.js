// Firebase設定
    // Firebase SDKの中から、InitializeAppという関数の読み込み
    import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-app.js";

    // Firebaseで認証機能を使うために必要な関数を読み込んで使えるようにする
    // TODO: Add SDKs for Firebase products that you want to use
    import {
        getAuth,
        createUserWithEmailAndPassword,
        signInWithEmailAndPassword, // メアドとパスで新しいユーザーを登録するため
      } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-auth.js";

      // 追加SDKを組み込む必要があればimport、最新のバージョンに！
    import {
        getDatabase,
        ref,
        push,
        set,
        onChildAdded,
        remove,
        onChildRemoved,
    } from "https://www.gstatic.com/firebasejs/11.9.1/firebase-database.js";
  

    // Your web app's Firebase configuration
    const firebaseConfig = {

    };

    // Firebase初期化
    const app = initializeApp(firebaseConfig);
    // Firebase接続
    const auth = getAuth(app); // Firebase Authサービスを初期化
    const db = getDatabase(app); // RealtimeDatabase使うよ
    const dbRef = ref(db, "log"); // RealtimeDatabase内の”log“を使う
    console.log("dbRef:", dbRef);



// headerの高さ分をmargin-topに設定してcontainerを配置
window.onload = function() {
    const headerHeight = document.querySelector('header').offsetHeight;
    const footerHeight = document.querySelector('footer').offsetHeight;
    const container = document.querySelector('#container');
    container.style.marginTop = headerHeight + 'px';
    container.style.marginBottom = footerHeight + 'px';
};

// // container部分に読み込むhtmlファイルを指定する関数
// function loadHTML(filename) {
//     fetch(filename)
//       .then(response => response.text())
//       .then(html => {
//         document.getElementById('container').innerHTML = html;
//       });
//   }

/* --------------------------------　　　　　
　セクションHTMLの取得
-------------------------------- */
const registerSection = document.getElementById("register");
const loginSection = document.getElementById("login");
const postScreen = document.getElementById("post-screen");
const viewRecords = document.getElementById("view-records");


// HTMLセクション要素が「現在表示されてるか」を判定するための関数
function isVisible(section) {
    return !section.classList.contains("hidden");
  }

// 画面を切り替えるための共通関数
function showSection(sectionToShow) {
  // 引数名を sectionToShow に変更して分かりやすく、全て非表示に
  registerSection.classList.add("hidden");
  loginSection.classList.add("hidden");
  postScreen.classList.add("hidden");
  viewRecords.classList.add("hidden");

  // 指定されたセクションから hide を削除して表示
  sectionToShow.classList.remove("hidden"); // 引数で受け取ったセクションだけ表示

}

/* --------------------------------　　　　　
    初期画面
-------------------------------- */

document.addEventListener('DOMContentLoaded', function() {
    showSection(loginSection);
    const registerLink = document.querySelector('a[href="#register"]');
    if (registerLink) {
        registerLink.addEventListener('click', function(event) {
            event.preventDefault(); // デフォルトのリンク挙動を防止
        });
    } else {
        showSection(loginSection);
    }
});

/* --------------------------------　　　　　
  新規会員登録
-------------------------------- */
    // showSection(registerSection);    

//   HTML要素を取得
    const signupUserId = document.querySelector('#signup-userID');
    const signUpEmail = document.querySelector('#signup-email');
    const signupPassword = document.querySelector('#signup-password');
    const signupBtn = document.querySelector('#signup-btn');
    const loginLink = document.getElementById('login-link');

    if (loginLink) {
        loginLink.addEventListener('click', function(event) {
            event.preventDefault(); // デフォルトのリンク挙動を防止
            showSection(loginSection);
        });
    }

    if (signupBtn) {
        signupBtn.addEventListener("click", function () {
            const userID = signupUserId.value;
            const email = signUpEmail.value;
            const password = signupPassword.value;
            console.log(userID, email, password)

            if (!userID) {
                alert("ユーザーIDを入力してください");
                return;
            } else 
            if (!email) {
                alert("メールアドレスを入力してください");
                return;
            } else if (!password) {
                alert("6字以上のパスワードを入力してください");
                return;
            } 

            createUserWithEmailAndPassword(auth, email, password) // Firebaseでアカウント作成
                .then((userCredential) => {
                    const user = userCredential.user;
                    // Realtime DatabaseにuserIDを登録
                    set(ref(db, `users/${user.uid}`), {
                        userID: userID,
                        email: email,
                        password: password
                    });
                })
                .then((userCredential) => {
                alert("登録が完了しました");
                showSection(postScreen);// 登録成功後、投稿画面に切り替え
                })
                .catch((error) => {
                alert("登録できません");
                });
        });
    }

/* --------------------------------　　　　　
    ログイン
-------------------------------- */

const loginUserId = document.getElementById("login-userID");
const loginEmail = document.getElementById("login-email");
const loginPassword = document.getElementById("login-password");
const loginBtn = document.getElementById("login-btn");
const registerLink = document.getElementById('register-link');

if (registerLink) {
    registerLink.addEventListener('click', function(event) {
        event.preventDefault(); // デフォルトのリンク挙動を防止
        showSection(registerSection);
    });
}

if (loginBtn) {
    loginBtn.addEventListener("click", function () {
        const email = loginEmail.value;
        const password = loginPassword.value;
        const userID = loginUserId.value;

        if (!email && !userID) {
            alert("メールアドレスまたはユーザーIDを入力してください");
            return;
        } else if (!password) {
            alert("パスワードを入力してください");
            return;
        }

        // メールアドレスが入力されている場合は、メールアドレスでログイン
        if (email) {
            signInWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    // ログイン成功
                    const user = userCredential.user;
                    alert("ログインしました");
                    showSection(postScreen); // ログイン成功後、投稿画面に切り替え
                })
                .catch((error) => {
                    alert("ログインに失敗しました: " + error.message);
                });
        }
        // ユーザーIDが入力されている場合は、ユーザーIDでログイン
        else if (userID) {
            // ユーザーIDからメールアドレスを取得してログイン
            // ここでは、Realtime DatabaseからユーザーIDに対応するメールアドレスを取得する処理を記述する必要があります
            // 仮に、getMailAddressByUserID(userID) という関数でメールアドレスを取得できるとします
            getMailAddressByUserID(userID)
                .then((email) => {
                    if (!email) {
                        alert("ユーザーIDに対応するメールアドレスが見つかりませんでした");
                        return;
                    }
                    signInWithEmailAndPassword(auth, email, password)
                        .then((userCredential) => {
                            // ログイン成功
                            const user = userCredential.user;
                            alert("ログインしました");
                            showSection(postScreen); // ログイン成功後、投稿画面に切り替え
                        })
                        .catch((error) => {
                            alert("ログインに失敗しました: " + error.message);
                        });
                })
                .catch((error) => {
                    alert("ユーザーIDの検索に失敗しました: " + error.message);
                });
        }
    });
}

// ユーザーIDからメールアドレスを取得する関数（仮）
async function getMailAddressByUserID(userID) {
    // Realtime DatabaseからユーザーIDに対応するメールアドレスを取得する処理を記述
    // ここでは、仮に users コレクションにユーザーIDがキーとして登録されているとします
    const snapshot = await get(ref(db, `users/${userID}`));
    if (snapshot.exists()) {
        const userData = snapshot.val();
        return userData.email; // メールアドレスを返す
    } else {
        return null; // ユーザーIDに対応するデータが見つからなかった場合は null を返す
    }
}
  

/* --------------------------------　　　　　
　記録投稿
-------------------------------- */
const insectType = document.getElementById("insect-type");
const collectPlace = document.getElementById("collect-place");
const recordDate = document.getElementById("record-date");
const memo = document.getElementById("memo");
const submitBtn = document.getElementById("submit-btn");
const viewRecordsBtn = document.getElementById("view-records-btn")

if (viewRecordsBtn) {
    viewRecordsBtn.addEventListener('click', function(event) {
        event.preventDefault(); // デフォルトのリンク挙動を防止
        showSection(viewRecords);
    });
}

if (submitBtn) {
    submitBtn.addEventListener("click", function () {
        const type = insectType.value;
        const place = collectPlace.value;
        const date = recordDate.value;

        const memoElement = document.getElementById("memo");
        let memoValue = ""; // デフォルト値を空文字列に設定
        if (memoElement) {
          memoValue = memoElement.value; // memo の値を取得
        } else {
          console.error("id='memo' の要素が見つかりません");
        }

        // 画像ファイルの取得
        const imageFile = document.getElementById("upload-image").files[0];

        // 必須項目が入力されているか確認
        if (!type || !place || !date) {
            alert("必須項目を入力してください");
            return;
        }

        // データベースに記録を保存
        push(dbRef, {
            insectType: type,
            collectPlace: place,
            recordDate: date,
            memo: memoValue, // ここで memoValue を使用
            // ユーザーIDを追加
            userID: auth.currentUser ? auth.currentUser.uid : "unknown", // ログインしていなければ"unknown"
            imageUrl: imageFile ? 'images/' + imageFile.name : null, // 画像のURL
        })
            .then(() => {
                alert("記録を保存しました");
                // フォームをリセット
                insectType.value = "";
                collectPlace.value = "";
                recordDate.value = "";
                document.getElementById("upload-image").value = ""; // 画像選択をリセット
                showSection(viewRecords);
            })
            .catch((error) => {
                alert("記録の保存に失敗しました: " + error.message);
            });
    });
}

/* --------------------------------　　　　　
　投稿記録
-------------------------------- */
const viewRecordsSection = document.getElementById("view-records");
const postLinkBtn = document.getElementById("post-link-btn");

if (postLinkBtn) {
    postLinkBtn.addEventListener('click', function(event) {
        event.preventDefault(); // デフォルトのリンク挙動を防止
        showSection(postScreen);
    });
}

// データベースから記録を取得して表示
onChildAdded(dbRef, (data) => {
    const record = data.val();
    const recordKey = data.key; // 記録のキーを取得

    // 新しい記録の要素を作成
    const recordDiv = document.createElement("div");
    recordDiv.classList.add("flex", "flex-col", "w-4/5", "bg-white", "border", "border-gray-300", "items-center", "p-4", "pt-6", "pb-6", "rounded-lg", "mt-10");
    recordDiv.setAttribute("data-record-key", recordKey); // キーを要素に保存

    // 品種、場所、日付の要素を作成
    const typeDiv = document.createElement("div");
    typeDiv.classList.add("flex", "flex-col", "w-full", "items-center", "mb-6");
    typeDiv.innerHTML = `<p class="text-lg font-semibold">品種: <span>${record.insectType}</span></p>`;

    const placeDiv = document.createElement("div");
    placeDiv.classList.add("flex", "flex-col", "w-full", "items-center", "mb-6");
    placeDiv.innerHTML = `<p class="text-lg font-semibold">場所: <span>${record.collectPlace}</span></p>`;

    const dateDiv = document.createElement("div");
    dateDiv.classList.add("flex", "flex-col", "w-full", "items-center", "mb-6");
    dateDiv.innerHTML = `<p class="text-lg font-semibold">日付: <span>${record.recordDate}</span></p>`;

    // メモの要素を作成（メモがある場合のみ）
    let memoDiv = document.createElement("div");
    memoDiv.classList.add("flex", "flex-col", "w-full", "items-center", "mb-6");
    if (record.memo) {
        memoDiv.innerHTML = `<p class="text-lg font-semibold">メモ: <span>${record.memo}</span></p>`;
    } else {
        memoDiv.innerHTML = `<p class="text-lg font-semibold">メモ: <span></span></p>`; // 空のメモ
    }

    // 画像の要素を作成（画像URLがある場合のみ）
    let imageDiv = document.createElement("div");
    imageDiv.classList.add("flex", "flex-col", "w-full", "items-center", "mb-6");
    if (record.imageUrl) {
        imageDiv.innerHTML = `<img src="${record.imageUrl}" alt="記録画像" class="max-w-full h-auto">`;
    }

    // 削除ボタンを作成
    const deleteButton = document.createElement("button");
    deleteButton.textContent = "削除";
    deleteButton.classList.add("bg-red-500", "hover:bg-red-700", "text-white", "font-bold", "py-2", "px-4", "rounded");
    deleteButton.addEventListener("click", function () {
        // 削除処理
        remove(ref(db, `log/${recordKey}`))
            .then(() => {
                alert("記録を削除しました");
                recordDiv.remove(); // 画面から記録を削除
            })
            .catch((error) => {
                alert("記録の削除に失敗しました: " + error.message);
            });
    });

    // 各要素を記録の要素に追加
    recordDiv.appendChild(typeDiv);
    recordDiv.appendChild(placeDiv);
    recordDiv.appendChild(dateDiv);
    recordDiv.appendChild(memoDiv); // メモを追加
    recordDiv.appendChild(deleteButton); // 削除ボタンを追加

    // 記録の要素を記録表示セクションに追加
    viewRecordsSection.appendChild(recordDiv);
});

// 記録が削除されたときの処理
onChildRemoved(dbRef, (data) => {
    const recordKey = data.key;
    const recordDiv = document.querySelector(`[data-record-key="${recordKey}"]`);
    if (recordDiv) {
        recordDiv.remove(); // 画面から記録を削除
    }
});
