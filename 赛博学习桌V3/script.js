let pomodoroInterval;
let isPomodoroActive = false;
let timeLeft = 1500; // 25分钟
let isBreakTime = false;
let totalPomodoros = 0;

// 存储任务和剩余时间
let tasks = [];
let remainingTime = 0;

// 显示全屏提示框
document.getElementById('fullscreen-prompt').style.display = 'block';

document.getElementById('confirm-button').addEventListener('click', function() {
    this.parentElement.style.display = 'none'; // 隐藏提示框
});

// 监听 F11 键
document.addEventListener('keydown', function(event) {
    if (event.key === 'F11') {
        enterFullScreen();
    }
});

function enterFullScreen() {
    if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen();
    }
}

document.getElementById('pomodoro-button').addEventListener('click', function() {
    if (isPomodoroActive) {
        clearInterval(pomodoroInterval);
        isPomodoroActive = false;
        this.textContent = "开始";
        this.style.backgroundColor = "#4CAF50"; // 绿色
    } else {
        totalPomodoros++;
        startPomodoro();
        this.textContent = "暂停";
        this.style.backgroundColor = "#f44336"; // 红色
    }
});

function startPomodoro() {
    isPomodoroActive = true;
    pomodoroInterval = setInterval(function() {
        if (timeLeft <= 0) {
            clearInterval(pomodoroInterval);
            isBreakTime = true;
            alert("25分钟专注完成！请休息5分钟。");
            timeLeft = 300; // 5分钟
            startBreak();
        } else {
            timeLeft--;
            updateTimerDisplay();
        }
    }, 1000);
}

function startBreak() {
    pomodoroInterval = setInterval(function() {
        if (timeLeft <= 0) {
            clearInterval(pomodoroInterval);
            if (confirm("是否需要再次开启番茄钟？")) {
                timeLeft = 1500; // 重新设置为25分钟
                startPomodoro();
            } else {
                isPomodoroActive = false;
                document.getElementById('pomodoro-button').textContent = "开始";
                document.getElementById('pomodoro-button').style.backgroundColor = "#4CAF50"; // 绿色
            }
        } else {
            timeLeft--;
            updateTimerDisplay();
        }
    }, 1000);
}

function updateTimerDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    document.getElementById('timer-display').textContent = 
        `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
}

// 桌布替换功能
document.getElementById('change-background-button').addEventListener('click', function() {
    document.getElementById('background-upload').click(); // 触发文件选择
});

document.getElementById('background-upload').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function(e) {
            document.body.style.backgroundImage = `url(${e.target.result})`;
            document.body.style.backgroundSize = 'cover';
            document.body.style.backgroundPosition = 'center';
            localStorage.setItem('backgroundImage', e.target.result); // 保存到本地存储
        };
        reader.readAsDataURL(file);
    }
});

// 页面加载时检查本地存储并设置背景
window.onload = function() {
    const savedBackground = localStorage.getItem('backgroundImage');
    if (savedBackground) {
        document.body.style.backgroundImage = `url(${savedBackground})`;
        document.body.style.backgroundSize = 'cover';
        document.body.style.backgroundPosition = 'center';
    }
    loadUrlsFromLocalStorage();
    loadAppsFromLocalStorage(); // 加载软件
};

document.getElementById('reset-button').addEventListener('click', function() {
    clearInterval(pomodoroInterval);
    isPomodoroActive = false;
    timeLeft = 1500; // 重置为25分钟
    updateTimerDisplay();
    document.getElementById('pomodoro-button').textContent = "开始";
    document.getElementById('pomodoro-button').style.backgroundColor = "#f44336"; // 红色
});

// 显示添加网址的弹出窗口
document.getElementById('add-url-button').addEventListener('click', function() {
    document.getElementById('url-modal').style.display = 'block';
});

// 关闭弹出窗口
document.querySelector('.close-button').addEventListener('click', function() {
    document.getElementById('url-modal').style.display = 'none';
});

// 保存网址
document.getElementById('save-url-button').addEventListener('click', function() {
    const url = document.getElementById('url-input').value.trim();
    const shortcut = document.getElementById('shortcut-input').value.trim();
    if (url && shortcut) {
        addUrlToList(url, shortcut);
        saveUrlToLocalStorage(url, shortcut); // 保存到 localStorage
        document.getElementById('url-input').value = ''; // 清空输入框
        document.getElementById('shortcut-input').value = ''; // 清空输入框
    }
});

// 添加网址到列表
function addUrlToList(url, shortcut) {
    const urlList = document.getElementById('url-list');
    const li = document.createElement('li');
    li.textContent = shortcut;

    const openButton = document.createElement('button');
    openButton.textContent = '打开';
    openButton.onclick = () => window.open(url, '_blank'); // 打开网址

    const deleteButton = document.createElement('button');
    deleteButton.textContent = '删除';
    deleteButton.onclick = () => {
        urlList.removeChild(li); // 删除网址
        removeUrlFromLocalStorage(shortcut); // 从 localStorage 中删除
    };

    li.appendChild(openButton);
    li.appendChild(deleteButton);
    urlList.appendChild(li);
}

// 保存网址到 localStorage
function saveUrlToLocalStorage(url, shortcut) {
    const urls = JSON.parse(localStorage.getItem('urls')) || [];
    urls.push({ url, shortcut });
    localStorage.setItem('urls', JSON.stringify(urls));
}

// 从 localStorage 中加载网址
function loadUrlsFromLocalStorage() {
    const urls = JSON.parse(localStorage.getItem('urls')) || [];
    urls.forEach(item => {
        addUrlToList(item.url, item.shortcut);
    });
}

// 从 localStorage 中删除网址
function removeUrlFromLocalStorage(shortcut) {
    const urls = JSON.parse(localStorage.getItem('urls')) || [];
    const updatedUrls = urls.filter(item => item.shortcut !== shortcut);
    localStorage.setItem('urls', JSON.stringify(updatedUrls));
}

// 显示添加软件的弹出窗口
// document.getElementById('add-app-button').addEventListener('click', function() {
//     document.getElementById('app-modal').style.display = 'block';
// });

// 关闭弹出窗口
document.querySelectorAll('.close-button').forEach(button => {
    button.addEventListener('click', function() {
        this.parentElement.parentElement.style.display = 'none'; // 隐藏对应的弹出窗口
    });
});

// 添加软件到列表
function addAppToList(appPath, appShortcut) {
    const appList = document.getElementById('app-list');
    const li = document.createElement('li');
    li.textContent = appShortcut;

    const openButton = document.createElement('button');
    openButton.textContent = '打开';
    openButton.onclick = () => {
        // 使用 file:// 协议打开本地软件
        const filePath = appPath.startsWith('file://') ? appPath : `file://${appPath}`;
        window.open(filePath); 
    };

    const deleteButton = document.createElement('button');
    deleteButton.textContent = '删除';
    deleteButton.onclick = () => {
        appList.removeChild(li); // 删除软件
        removeAppFromLocalStorage(appShortcut); // 从 localStorage 中删除
    };

    li.appendChild(openButton);
    li.appendChild(deleteButton);
    appList.appendChild(li);
}

// 保存软件到 localStorage
function saveAppToLocalStorage(appPath, appShortcut) {
    const apps = JSON.parse(localStorage.getItem('apps')) || [];
    apps.push({ appPath, appShortcut });
    localStorage.setItem('apps', JSON.stringify(apps));
}

// 从 localStorage 中加载软件
function loadAppsFromLocalStorage() {
    const apps = JSON.parse(localStorage.getItem('apps')) || [];
    apps.forEach(item => {
        addAppToList(item.appPath, item.appShortcut);
    });
}

// 从 localStorage 中删除软件
function removeAppFromLocalStorage(appShortcut) {
    const apps = JSON.parse(localStorage.getItem('apps')) || [];
    const updatedApps = apps.filter(item => item.appShortcut !== appShortcut);
    localStorage.setItem('apps', JSON.stringify(updatedApps));
}

// 任务栏折叠功能
document.getElementById('collapse-button').addEventListener('click', function() {
    const taskbar = document.getElementById('taskbar');
    taskbar.classList.toggle('collapsed');
    
    // 保存折叠状态到 localStorage
    localStorage.setItem('taskbarCollapsed', taskbar.classList.contains('collapsed'));
});

// 页面加载时恢复折叠状态
window.addEventListener('load', function() {
    const taskbar = document.getElementById('taskbar');
    const isCollapsed = localStorage.getItem('taskbarCollapsed') === 'true';
    if (isCollapsed) {
        taskbar.classList.add('collapsed');
    }
});

// 拖动功能
let isDragging = false;
let offsetX, offsetY;

const remainingTimeDisplay = document.getElementById('remaining-time-display');

remainingTimeDisplay.addEventListener('mousedown', function(e) {
    isDragging = true;
    offsetX = e.clientX - remainingTimeDisplay.getBoundingClientRect().left;
    offsetY = e.clientY - remainingTimeDisplay.getBoundingClientRect().top;
});

document.addEventListener('mousemove', function(e) {
    if (isDragging) {
        remainingTimeDisplay.style.left = (e.clientX - offsetX) + 'px';
        remainingTimeDisplay.style.top = (e.clientY - offsetY) + 'px';
    }
});

document.addEventListener('mouseup', function() {
    isDragging = false;
});

// 更新剩余可用时长
function updateRemainingTime(availableTime) {
    const totalTaskTime = tasks.reduce((sum, task) => sum + task.time, 0);
    remainingTime = availableTime - totalTaskTime;
    document.getElementById('remaining-time-value').textContent = remainingTime;

    // 检查可用时长是否少于 40 分钟
    if (remainingTime < 40) {
        alert("请留出40分钟的额外时间以确保能够完成全部任务。");
    }

    // 隐藏输入框和提示
    if (availableTime > 0) {
        document.getElementById('available-time-container').style.display = 'none'; // 隐藏可用时长输入框和提示
    }
}

let totalAvailableTime = 0; // 添加总可用时长变量

// 修改监听可用时长输入框的变化
document.getElementById('available-time').addEventListener('change', function() {
    const availableTime = parseInt(this.value) || 0;
    totalAvailableTime = availableTime; // 保存总可用时长
    updateRemainingTime(availableTime);
    updateStatistics(); // 更新统计数据
});

// 添加任务功能
document.getElementById('add-task-button').addEventListener('click', function() {
    const availableTimeInput = document.getElementById('available-time');
    const taskInput = document.getElementById('task-input');
    const taskTimeInput = document.getElementById('task-time');
    
    const availableTime = parseInt(availableTimeInput.value) || 0;
    const taskName = taskInput.value.trim();
    const taskTime = parseInt(taskTimeInput.value) || 0;

    if (!taskName || taskTime <= 0) {
        alert('请输入有效的任务名称和时间！');
        return;
    }

    // 添加任务到数组
    const task = {
        name: taskName,
        time: taskTime,
        id: Date.now(),
        completed: false
    };
    tasks.push(task);

    // 更新剩余可用时长
    updateRemainingTime(availableTime);

    // 添加任务到显示列表
    addTaskToList(task);

    // 清空输入框
    taskInput.value = '';
    taskTimeInput.value = '';
});

// 修改添加任务到显示列表的函数
function addTaskToList(task) {
    const taskList = document.getElementById('task-list');
    const li = document.createElement('li');
    
    const taskInfo = document.createElement('div');
    taskInfo.className = 'task-info';
    
    const taskName = document.createElement('div');
    taskName.className = 'task-name';
    taskName.textContent = task.name;
    
    const taskTime = document.createElement('div');
    taskTime.className = 'task-time';
    taskTime.textContent = `预计用时：${task.time} 分钟`;

    // 添加完成按钮
    const completeButton = document.createElement('button');
    completeButton.className = 'complete-task';
    completeButton.textContent = '完成';
    completeButton.onclick = () => {
        task.completed = !task.completed;
        li.classList.toggle('completed');
        completeButton.textContent = task.completed ? '取消完成' : '完成';
        updateStatistics(); // 当任务状态改变时更新统计
    };
    
    const deleteButton = document.createElement('button');
    deleteButton.className = 'delete-task';
    deleteButton.textContent = '删除';
    deleteButton.onclick = () => {
        taskList.removeChild(li);
        tasks = tasks.filter(t => t.id !== task.id);
        const availableTime = parseInt(document.getElementById('available-time').value) || 0;
        updateRemainingTime(availableTime);
        updateStatistics(); // 当删除任务时更新统计
    };

    taskInfo.appendChild(taskName);
    taskInfo.appendChild(taskTime);
    li.appendChild(taskInfo);
    li.appendChild(completeButton);
    li.appendChild(deleteButton);
    taskList.appendChild(li);
}

// 页面加载时加载任务
window.addEventListener('load', function() {
    // 不再加载任务
});

// 数据统计按钮的点击事件
document.getElementById('data-statistics-button').addEventListener('click', function() {
    const statisticsSidebar = document.getElementById('statistics-sidebar');
    statisticsSidebar.style.display = 'flex'; // 显示统计边栏
    updateStatistics(); // 更新统计数据
});

// 统计边栏折叠功能
document.getElementById('statistics-collapse-button').addEventListener('click', function() {
    const statisticsSidebar = document.getElementById('statistics-sidebar');
    statisticsSidebar.classList.toggle('collapsed');
    
    // 保存折叠状态到 localStorage
    localStorage.setItem('statisticsSidebarCollapsed', statisticsSidebar.classList.contains('collapsed'));
});

// 页面加载时恢复统计边栏的折叠状态
window.addEventListener('load', function() {
    const statisticsSidebar = document.getElementById('statistics-sidebar');
    const isCollapsed = localStorage.getItem('statisticsSidebarCollapsed') === 'true';
    if (isCollapsed) {
        statisticsSidebar.classList.add('collapsed');
    }
});

// 更新统计数据
function updateStatistics() {
    const completedTasks = tasks.filter(task => task.completed);
    const completedCount = completedTasks.length;
    
    // 更新任务计数
    document.getElementById('completed-tasks-count').textContent = completedCount;
    
    // 更新时间统计
    document.getElementById('total-available-time').textContent = totalAvailableTime;
    document.getElementById('remaining-time-stats').textContent = remainingTime;

    // 更新已完成任务列表
    const completedTasksList = document.getElementById('completed-tasks-list');
    completedTasksList.innerHTML = '';
    completedTasks.forEach(task => {
        const li = document.createElement('li');
        li.textContent = `${task.name} (${task.time}分钟)`;
        completedTasksList.appendChild(li);
    });

    // 计算时间分配
    const completedTime = completedTasks.reduce((sum, task) => sum + task.time, 0);
    const uncompletedTasks = tasks.filter(task => !task.completed);
    const uncompletedTime = uncompletedTasks.reduce((sum, task) => sum + task.time, 0);

    // 更新饼图
    updateTimeDistributionChart(completedTime, uncompletedTime, remainingTime);
}

// 创建和更新饼图
function updateTimeDistributionChart(completedTime, uncompletedTime, remainingTime) {
    const ctx = document.getElementById('time-distribution-chart').getContext('2d');
    
    // 如果已经存在图表，先销毁它
    if (window.timeDistributionChart) {
        window.timeDistributionChart.destroy();
    }

    // 计算百分比
    const total = totalAvailableTime || 1; // 防止除以0
    const completedPercentage = (completedTime / total * 100).toFixed(1);
    const uncompletedPercentage = (uncompletedTime / total * 100).toFixed(1);
    const remainingPercentage = (remainingTime / total * 100).toFixed(1);

    // 创建新的饼图
    window.timeDistributionChart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: [
                `已完成任务 (${completedPercentage}%)`,
                `未完成任务 (${uncompletedPercentage}%)`,
                `剩余时间 (${remainingPercentage}%)`
            ],
            datasets: [{
                data: [completedTime, uncompletedTime, remainingTime],
                backgroundColor: ['#4CAF50', '#FF6384', '#36A2EB'],
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
        }
    });
} 