/**
 * Google Apps Script Backend for Pixel Quiz Game
 * 
 * 部署步骤：
 * 1. 在 Google Sheets 中点击 "扩展功能" -> "Apps Script"
 * 2. 贴入这段程序代码
 * 3. 点击右上方 "部署" -> "新增部署"
 * 4. 选区类型：网络应用程式 (Web App)
 * 5. 执行身份：我 (Me)
 * 6. 存取权限：所有人 (Anyone)
 * 7. 部署后取得 Web App URL，填入前端专案的 .env 档中的 VITE_GOOGLE_APP_SCRIPT_URL
 */

// 取得 Sheet reference
function getSheet(sheetName) {
    return SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
}

// 处理 GET 请求 (获取题目)
function doGet(e) {
    try {
        const action = e.parameter.action;

        if (action === 'getQuestions') {
            const count = parseInt(e.parameter.count || '5', 10);
            const sheet = getSheet("题目");
            const data = sheet.getDataRange().getValues();

            // 假设第一行是标题：['题号', '题目', 'A', 'B', 'C', 'D', '解答']
            const headers = data[0];
            const items = data.slice(1).map(row => {
                let obj = {};
                headers.forEach((h, i) => {
                    // 防止中文对照问题，直接转成英文key
                    if (h === '题号') obj.id = row[i];
                    else if (h === '题目') obj.question = row[i];
                    else if (h === 'A') obj.A = row[i];
                    else if (h === 'B') obj.B = row[i];
                    else if (h === 'C') obj.C = row[i];
                    else if (h === 'D') obj.D = row[i];
                    else if (h === '解答') obj.answer = row[i];
                });
                return obj;
            });

            // 随机抽取 count 题
            const shuffled = items.sort(() => 0.5 - Math.random());
            const selected = shuffled.slice(0, count);

            return ContentService.createTextOutput(JSON.stringify(selected))
                .setMimeType(ContentService.MimeType.JSON);
        }

        return ContentService.createTextOutput(JSON.stringify({ error: "Invalid action" }))
            .setMimeType(ContentService.MimeType.JSON);

    } catch (error) {
        return ContentService.createTextOutput(JSON.stringify({ error: error.toString() }))
            .setMimeType(ContentService.MimeType.JSON);
    }
}

// 处理 POST 请求 (提交成绩)
// 为了避免复杂的 CORS preflight(OPTIONS)，前端请使用 text/plain 送出 JSON 字串
function doPost(e) {
    try {
        const payload = JSON.parse(e.postData.contents);
        const { action, userId, score, totalQuestions, passed, attempts, timeTaken, timestamp } = payload;

        if (action === 'submitScore') {
            const sheet = getSheet("回答");
            const data = sheet.getDataRange().getValues();
            const headers = data[0];

            // 寻找是否已有相同 ID 的纪录
            let rowIndex = -1;
            for (let i = 1; i < data.length; i++) {
                if (data[i][0] == userId) {
                    rowIndex = i + 1; // Apps Script is 1-indexed
                    break;
                }
            }

            if (rowIndex !== -1) {
                // 更新现有纪录
                // 栏位假设：ID、闯关次数、总分、最高分、第一次通关分数、花了几次通关、最近游戏时间
                const rowData = data[rowIndex - 1];
                let [currentId, currentAttempts, totalScore, maxScore, firstPassScore, passAttempts, lastTime] = rowData;

                currentAttempts = (parseInt(currentAttempts) || 0) + 1;
                totalScore = (parseInt(totalScore) || 0) + score;
                maxScore = Math.max(parseInt(maxScore) || 0, score);

                if (passed && (!firstPassScore || firstPassScore === "")) {
                    firstPassScore = score;
                    passAttempts = currentAttempts; // 这是第几次才通关的
                }

                sheet.getRange(rowIndex, 2).setValue(currentAttempts);
                sheet.getRange(rowIndex, 3).setValue(totalScore);
                sheet.getRange(rowIndex, 4).setValue(maxScore);
                sheet.getRange(rowIndex, 5).setValue(firstPassScore || "");
                sheet.getRange(rowIndex, 6).setValue(passAttempts || "");
                sheet.getRange(rowIndex, 7).setValue(timestamp); // 最近时间

            } else {
                // 新增一笔
                let firstPassScore = passed ? score : "";
                let passAttempts = passed ? 1 : "";

                // 依照：ID、闯关次数、总分、最高分、第一次通关分数、花了几次通关、最近游戏时间
                sheet.appendRow([userId, 1, score, score, firstPassScore, passAttempts, timestamp]);
            }

            return ContentService.createTextOutput(JSON.stringify({ success: true }))
                .setMimeType(ContentService.MimeType.JSON);
        }
    } catch (error) {
        return ContentService.createTextOutput(JSON.stringify({ error: error.toString() }))
            .setMimeType(ContentService.MimeType.JSON);
    }
}
