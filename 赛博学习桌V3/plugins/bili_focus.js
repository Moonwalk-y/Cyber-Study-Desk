function activateBiliFocus() {
    // 检测当前网址是否为哔哩哔哩
    if (window.location.hostname === "bilibili.com") {
        // 启动专注插件的逻辑
        console.log("启动哔哩哔哩视频专注插件");
    }
}

// 在页面加载时激活插件
window.onload = activateBiliFocus; 