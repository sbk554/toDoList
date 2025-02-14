document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("dateTime").value = getToday();
    updateListDisplay();

    document.querySelector("#modalAdd").addEventListener("click", function () {
        document.querySelector(".list-wrap").setAttribute("style","display:none;")
        document.querySelector(".list-add-wrap").setAttribute("style","display:flex;")
    });

    document.querySelector("#modalClose").addEventListener("click", function () {
        document.querySelector(".list-wrap").setAttribute("style","display:block;")
        document.querySelector(".list-add-wrap").setAttribute("style","display:none;")

        updateListDisplay();

        document.getElementById("listAddContent").innerHTML = "";
    });

    document.querySelector("#listAddSubmit").addEventListener("click", function () {
        var listAddText = document.getElementById("listAddText").value;
        var getLocalSt = localStorage.getItem("list");
        var dataValue = document.getElementById("dateTime").value;
        // localStorage 값이 null이면 빈 배열로 초기화
        //JSON 문자열에서 객체로 변환
        var listArray = getLocalSt ? JSON.parse(getLocalSt) : [];

        // 배열 길이를 pk 값으로 사용
        var list = {
            pk: listArray.length,
            title: listAddText,
            ck: "N",
            date:dataValue
        };

        // 배열 맨 앞에 추가
        listArray.unshift(list);

        // localStorage에 저장
        // JSON 문자열로 변환
        localStorage.setItem("list", JSON.stringify(listArray));
        document.getElementById("listAddText").value = "";
        document.getElementById("listAddContent").innerHTML += `
                                                                <div style="display:flex; gap:10px;">
                                                                    <a class="a-task-checkbox"></a>
                                                                    <span>${list.title}</span>
                                                                </div>`;
    });

    document.getElementById("dateTime").addEventListener("change", function () {
        updateListDisplay()
    })
    // 1초마다 시간 업데이트
    setInterval(updateTime, 1000);
    updateTime();
});

function updateTime() {
    const now = new Date();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    document.getElementById('time-div').innerHTML = `${hours}:${minutes}:${seconds}`;
}

//현재날짜 불러오기
function getToday(){
    var date = new Date();
    var year = date.getFullYear();
    var month = ("0" + (1 + date.getMonth())).slice(-2);
    var day = ("0" + date.getDate()).slice(-2);

    return year +"-"+ month +"-"+ day;
}

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
        if(item.date == document.getElementById("dateTime").value){
            resultHtml += `
                        <div class="list-item">
                            <input type="checkbox" class="task-checkbox" value="${item.pk}" ${item.ck === "Y" ? "checked" : ""}/>
                            <span style="text-decoration:${item.ck === "Y" ? "line-through" : "none"}">${item.title}</span>
                            <button class="listDel" num="${item.pk}">&#128465;</button>
                        </div>
                        `;
        }
    });
    
    document.getElementById("list-content").innerHTML = resultHtml;
    checkBoxYn();
    listDel();
    modalAdd();
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

function modalAdd(){
    var getLocalStList = localStorage.getItem("list");
    var listArray = getLocalStList ? JSON.parse(getLocalStList) : [];
    var modal = document.getElementById("modal");
    var modalButton = document.getElementById("modalbtn");
    var closeModal = document.getElementsByClassName("close")[0];
    var dayBoxes = document.querySelectorAll('.day-box');
    var dateGrid = document.querySelector('.date-grid');
    var months = [
        { name: 'January', days: 31 },
        { name: 'February', days: 28 },
        { name: 'March', days: 31 },
        { name: 'April', days: 30 },
        { name: 'May', days: 31 },
        { name: 'June', days: 30 },
        { name: 'July', days: 31 },
        { name: 'August', days: 31 },
        { name: 'September', days: 30 },
        { name: 'October', days: 31 },
        { name: 'November', days: 30 },
        { name: 'December', days: 31 }
    ];

    dateGrid.innerHTML = "";

    //date-grid에 날짜박스 생성하기
    var monthsContainer = document.createElement('div');
    monthsContainer.classList.add('months-container');

    months.forEach((month, monthIndex) => {
        var monthSection = document.createElement('div');
        monthSection.classList.add('month-section');
        
        var monthName = document.createElement('h3');
        monthName.innerText = month.name;
        monthSection.appendChild(monthName);

        var monthGrid = document.createElement('div');
        monthGrid.classList.add('month-grid');

        var dayCounter = 1;
        while (dayCounter <= month.days) {
            var weekRow = document.createElement('div');
            weekRow.classList.add('week-row');
            
            for (let i = 0; i < 7; i++) {
                if (dayCounter <= month.days) {
                    const dayBox = document.createElement('div');
                    dayBox.classList.add('day-box');
                    dayBox.dataset.date = `2025-${(monthIndex + 1).toString().padStart(2, '0')}-${dayCounter.toString().padStart(2, '0')}`;
                    dayBox.innerText = dayCounter;
                    weekRow.appendChild(dayBox);
                    dayCounter++;

                    listArray.forEach(function(item) {
                        if(dayBox.dataset.date == item.date){
                            dayBox.classList.add('has-task');
                            var count = listArray.filter(item => dayBox.dataset.date == item.date && item.ck === "Y").length;
                            if(count >= 1 && count < 3){
                                dayBox.classList.add('has-task2');
                            }else if(count >= 3 && count < 5){
                                dayBox.classList.add('has-task3');
                            }else if(count >= 5){
                                dayBox.classList.add('has-task4');
                            }
                        }
                    })
                }
            }
            
            monthGrid.appendChild(weekRow);
        }

        monthSection.appendChild(monthGrid);
        monthsContainer.appendChild(monthSection);
    });

    dateGrid.appendChild(monthsContainer);

    dayBoxes.forEach(dayBox => {
        // 날짜에 정보가있으면 class 추가
        dayBox.classList.toggle('has-task'); 
    });

    modalButton.onclick = function() {
        modal.style.display = "flex";
    }

    closeModal.onclick = function() {
        modal.style.display = "none";
    }

    window.onclick = function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
    
    document.querySelectorAll(".has-task").forEach(function(item){
        item.addEventListener("click",function(event){
            modal.style.display = "none";
            document.getElementById("dateTime").value = item.getAttribute("data-date");
            updateListDisplay()
        })
    })
}