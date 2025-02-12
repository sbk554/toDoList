document.addEventListener("DOMContentLoaded", () => {
    updateListDisplay();

    document.querySelector("#modalAdd").addEventListener("click", function () {
        document.querySelector(".list-wrap").setAttribute("style","display:none;")
        document.querySelector(".list-add-wrap").setAttribute("style","display:flex;")
    });

    document.querySelector("#modalClose").addEventListener("click", function () {
        document.querySelector(".list-wrap").setAttribute("style","display:block;")
        document.querySelector(".list-add-wrap").setAttribute("style","display:none;")

        updateListDisplay();
    });

    document.querySelector("#listAddSubmit").addEventListener("click", function () {
        var listAddText = document.getElementById("listAddText").value;
        var getLocalSt = localStorage.getItem("list");

        // localStorage 값이 null이면 빈 배열로 초기화
        var listArray = getLocalSt ? JSON.parse(getLocalSt) : [];

        // 배열 길이를 pk 값으로 사용
        var list = {
            pk: listArray.length,
            title: listAddText,
            ck: "N"
        };

        // 리스트에 새 항목 추가
        listArray.push(list);

        // localStorage에 저장
        localStorage.setItem("list", JSON.stringify(listArray));
        document.getElementById("listAddText").value = "";
    });
});

function listDel(){
    //list 제거
    document.querySelectorAll(".listDel").forEach(function(item){
        item.addEventListener("click", function () {
            var num = Number(item.getAttribute("num"));
            var getLocalStList = localStorage.getItem("list");
            var listArray = getLocalStList ? JSON.parse(getLocalStList) : [];

            // pk가 num과 일치하는 항목을 제외한 배열 생성
            listArray = listArray.filter(function(subItem) {
                return subItem.pk !== num; // pk가 num과 다르면 새로운 배열에 포함
            });

            // pk를 0부터 다시 순차적으로 할당
            listArray = listArray.map(function(subItem, index) {
                return { ...subItem, pk: index };
            });
            console.log(listArray)
            // 변경된 배열을 localStorage에 다시 저장
            localStorage.setItem("list", JSON.stringify(listArray));

            updateListDisplay();
        });
    })
}

//list html 생성
function updateListDisplay() {
    var getLocalStList = localStorage.getItem("list");
    
    var resultHtml = "";
    // JSON 문자열을 배열로 변환
    var listArray = getLocalStList ? JSON.parse(getLocalStList) : [];

    listArray.forEach(function(item) {
        resultHtml += `
                    <div class="list-item">
                        <input type="checkbox" class="task-checkbox" value="${item.pk}" ${item.ck === "Y" ? "checked" : ""}/>
                        <span style="text-decoration:${item.ck === "Y" ? "line-through" : "none"}">${item.title}</span>
                        <button class="listDel" num="${item.pk}">&#128465;</button>
                    </div>
                    `;
    });
    
    document.getElementById("list-content").innerHTML = resultHtml;
    checkBoxYn();
    listDel();
};

//checkBox 이벤트
function checkBoxYn(){
    var getLocalStList = localStorage.getItem("list");
    var listArray = JSON.parse(getLocalStList) || [];
    var cb = document.querySelectorAll(".task-checkbox");
    
    cb.forEach(function (item) {
        item.addEventListener("change",(event) => {
            // 체크박스 상태 확인
            var value = event.target.checked;
            
            listArray.forEach(function (subItem) {
                if (subItem.pk == event.target.value) {
                    subItem.ck = value ? "Y" : "N";
                }
            });
            
            //checked 된것들은 아래로 내려보내게 순서정렬
            listArray.sort(function(a, b) {
                if (a.ck === 'Y' && b.ck !== 'Y') return 1;
                if (a.ck !== 'Y' && b.ck === 'Y') return -1;
                return 0;
            });

            localStorage.setItem("list", JSON.stringify(listArray));
            updateListDisplay();
        })
    });
}