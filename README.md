# VaccineSearchApp(Backend) README
* Deploy Method (Be Careful)
`gcloud app deploy --project causal-flame-316510 app.yaml ./frontend/frontend.yaml ./backend/backend.yaml`

* Log
service 有 frontend, backend
```
gcloud app logs tail -s <service>
gcloud app logs -s <service>
```
* 查詢mongo DB 資料
在gcp
```
mongo <IP> //連線

show dbs //顯示db

use test //使用db

db.usermodels.find() //query 空的就代表找全部

db.usermodels.find({name: "Shine"}) //找名字為Shine的usermodel
```

# VaccineSearch Report

# 期末專題報告_第四組_疫苗護照
###### tags: `CNL`
## 開發者
|姓名|學號|貢獻度|負責項目|
|---|---|---|---|
|楊宗賢|B06901031|25%|前端開發、數位簽章設計|
|張翔文|B07902109|25%|後端開發、部署、DB測試|
|李智源|B07902089|15%|概念提出、架構規劃、協助測試|
|周俊廷|B07902091|15%|實驗環境架設、DB部署、防火墻調整|
|陳君翰|B07902059|12%|創意發想、資料搜尋、報告撰寫|
|柯建宇|B06902009|8%|資料搜尋、報告撰寫|

## 發想起點
疫苗，其向來都是在國際往返間的重要安全保證，已施打疫苗者可以降低本國疾病帶到他國的風險，也可以降低疾病從他國疾病帶回本國的風險，有效阻隔病原體於國際間流動。舉例而言，台灣針對長期居留的外國人會要求施打德國麻疹疫苗，且針對前往不同疫區國家者建議施打不同疫苗，如黃熱病疫苗、傷寒疫苗等，可見疫苗的重要性。

於2020~2021期間，新冠肺炎疫情籠罩全球，造成國際運輸、國際觀光產業大受打擊，隨著疫苗的開發及施打，有些人已經獲得免疫力，既不怕遭受感染也不會傳染新冠肺炎給其他人，這些人已經可以恢復國際觀光與商務旅行，對於國際金融的恢復是極度重要的。因此，許多國家已開始疫苗護照的計畫，頒發疫苗施打證明給已施打者，並檢驗外國旅客的已施打疫苗與否。

我們認為，台灣在這樣的國際情勢下也應儘速發展出能與國際接軌的疫苗護照，一方面保持資料的安全又能兼顧方便及透明度是很重要的，因此有了疫苗護照電子化的發想！不只是在申請簽證上會更加的便利，在未來，國內商家甚至也能夠過疫苗護照的服務檢視其顧客的疫苗施打紀錄，進而訂定不同規定，對於民眾的健康管理也會有很好的效果！
<p style="page-break-after:always"></p>

## 使用介紹
網頁網址：https://frontend-dot-causal-flame-316510.df.r.appspot.com/
展演影片：
1. https://youtu.be/jRXiA73ZDCY
2. https://www.youtube.com/watch?v=pdup_GqjKH4

疫苗護照提供三方服務：
- 施打者（醫療機構）：登記疫苗施打資料
- 被施打者（一般民眾）：查詢疫苗施打紀錄、產生QR Code
- 其他單位：掃描被施打者所產生的QR Code，進而瀏覽被施打者的紀錄

![](https://i.imgur.com/iK5P1iv.png)

<p style="page-break-after:always"></p>

### 特色-醫療院所
使用RSA非對稱性加密技術進行**數位簽章**，醫療院所與伺服器之間有數位簽章，確保資料的不可否認性，醫療院所必須為其登記背書，確保資料的可信度

### 特色-一般民眾與其他單位
本服務中QR Code的特性：
1. 伺服器所產生出的QR Code只有伺服器能解讀，對其他QR Code掃瞄器而言只是亂碼
2. QR Code本身具有時效性，產生一定時間後伺服器便視為無效

基於上述特性，達成**防止盜用**、**防止造假**、**保護隱私**的效果
- **防止盜用**：由於QR Code本身具有時效性，時效一過便需重新登入產生新QR Code，即使拿著舊QR Code也沒有意義
- **防止造假**：由於僅能使用本服務提供的QR Code掃瞄器才能向伺服器索取資料，可阻止有心人士惡意仿造本服務的資訊頁面，使用專用伺服器掃描後僅會顯示錯誤，就算能在其他QR Code掃瞄器中產生出頁面也是毫無意義的
- **保護隱私**：無法直接透過對QR Code解碼獲得他人醫療隱私，解碼後僅有亂碼，只有伺服器才能夠用它來調用資料

### 範例
![](https://i.imgur.com/y2naLn5.png)
（圖一）首頁

<p style="page-break-after:always"></p>

![](https://i.imgur.com/ydAUGNW.png)
（圖二）醫療院所上傳資料

![](https://i.imgur.com/fJDXXVO.png =550x400)
（圖三）民眾查詢自身紀錄、生成QR Code

<p style="page-break-after:always"></p>

![](https://i.imgur.com/Zlyh1ua.png =400x400)
（圖四）掃描QR Code

![](https://i.imgur.com/KOalnmZ.jpg =200x400)
（圖五）使用他來源掃瞄器會出現亂碼

<p style="page-break-after:always"></p>

## 數位簽章及資料加密
- 簽章方式: RSA PKCS #1
- 使用模組: crypto (Server), SubtleCrypto (Client)
- 使用數位簽章的部分
    - 醫療院所登記施打紀錄
        1. 醫療院所登記施打紀錄時會從醫療院所的local端使用private key對資料進行簽章
        2. server會使用該醫療院所的public key對其進行驗章
        3. 驗章一旦通過就會把該筆施打紀錄加入資料庫，否則拒絕此次動作 
    - server產生QR Code
        1. 當一般民眾點擊GENERATE QR CODE的按鈕時，server會對該民眾的施打紀錄產生對應的QR Code
        2. **此QR Code是經過server加密後再以private key簽章**
        3. 一般民眾接收到QR Code以後，會使用固定的public key對其進行驗章
        4. 驗章通過才會把QR Code顯示在畫面上，否則拒絕
        5. 第三方單位掃描該QR Code以取得相對應的施打紀錄時，server會對QR Code進行解密
        6. 解密成功就顯示施打紀錄，否則拒絕

## 環境架設
- 這一次實驗我們所使用的平臺是 Google Cloud Platform （GCP）
- 選擇這一平臺有以下幾種考量
    - 方便部署
        - 在GCP這一平臺上，我們可以很方便的創建一個VM instances，並在這些VM上安裝我們所需要的套件。
            - ![](https://i.imgur.com/8bSzuFN.png)

        - 此外，針對創建特定功用VM instance，GCP上也有許多的開源套件可以使用。例如Mongo DB的部署可以使用以下套件來完成，免除安裝與後期調整的麻煩。
            - ![](https://i.imgur.com/AauCuF9.png)

        - 在部署服務方面，只需要將程式在VM instances裏寫好，便可以使用GCP上的App Engine這一功能實現快速部署。
            - ![](https://i.imgur.com/CMuTn1r.png)
 
    - 内建防火墻
        - 在GCP中内建有對應的防火墻供使用者使用。防火墻並不局限於VM instance之間的連綫、VM instance與外部網絡的連綫，部署在App Engine上的Service也有對應的防火墻可以使用。
        - 如此不但可以將後端的Server與Database使用防火墻進行保護，更可以直接使用App Engine的防火墻對連綫到Service的IP進行管控。
        
## 前端開發
- 伺服器執行環境: Node.js
- 網頁渲染: EJS模板引擎
- JavaScript函式庫:
    - 數位簽章: SubtleCrypto `window.crypto.subtle`
    - QR Code生成: `github.com/davidshimjs/qrcodejs`
    - QR Code掃描: `github.com/mebjas/html5-qrcode`
- 身分驗證:
    - 醫療機構: 帳號、密碼
    - 一般民眾: 姓名、身分證字號
- router
    - `GET /`
        - 首頁，提供QR Code掃描器，以及醫療機構與一般民眾的登入連結
    - `GET /logout`
        - 登出頁面，刪除所有session後跳轉回首頁
    - `POST /scan`
        - 第三方單位掃描QR Code後，顯示被施打者的所有紀錄
        - 如果Token無效或已經過期，則拒絕顯示紀錄
        - 參數`t`: QR Code中所含的Token
    - `GET /idv`
        - 一般民眾登入後的選單頁面
    - `GET /idv/query`
        - 一般民眾查詢自己的所有施打紀錄
    - `GET /idv/qr-gen`
        - 一般民眾向伺服器請求產生QR Code
        - 網頁載入時呼叫`/javascripts/main.js`中的`generateQR()`
        - 以Fetch API向伺服器取得Token
        - 以寫死在`main.js`中的固定公鑰對Token驗章
        - 驗章成功時，才會把Token繪製成QR Code顯示出來
    - `PUT /idv/qr-gen`
        - 一般民眾的session有效時，伺服器回傳含有下列參數的JSON：
            - `expiry`: Token的時效，設定為request的5分鐘以後
            - `name`: 民眾的姓名
            - `token`: 身分證字號、`name`、`expiry`三者以AES對稱式加密後，形成Token
            - `signature`: 對`expiry`、`name`、`token`以固定的私鑰簽章
    - `GET /idv/login`
        - 一般民眾的登入頁面，session無效時一律跳轉到此頁
    - `POST /idv/login`
        - 向後端執行民眾登入驗證，若該民眾有施打紀錄則將登入資訊寫入session
    - `GET /med`
        - 醫療機構登入後的選單頁面
    - `GET /med/init`
        - 醫療機構第一次登入尚未設定public key時，跳轉到此頁
        - 伺服器在網頁中渲染專屬於該醫療機構的`<input id='challenge'>`
        - 網頁載入時呼叫`medInit()`
        - 以SubtleCrypto產生RSA金鑰對後，將public key連同`challenge`的簽章提交至伺服器
        - 如果public key被接受，將private key存入localStorage且存成備份金鑰檔
        - 存好private key後，跳轉至`/med`
    - `POST /med/init`
        - 前端伺服器以提交的public key對`challenge`驗章
        - 前端伺服器檢查`challenge`是否對應至目前的session
        - 若前兩者皆通過，則將public key提交至後端
    - `GET /med/create`
        - 醫療機構新增疫苗施打紀錄的表單
        - 表單提交前，呼叫`createOnSubmit()`產生簽章
        - localStorage中不存在private key時，呼叫`privKeyImport()`匯入備份金鑰檔
    - `POST /med/create`
        - 如果表單格式正確，則向後端請求新增疫苗施打紀錄
        - 若成功新增紀錄則跳轉至`/med`，否則跳回原頁以供修改
    - `GET /med/login`
        - 醫療機構的登入頁面，session無效時一律跳轉到此頁
    - `POST /idv/login`
        - 向後端執行醫療機構登入驗證，若帳號密碼正確則將登入資訊寫入session
        - 若醫療機構尚未設定public key則跳轉至`/med/init`，否則跳轉至`/med`

## 後端開發
- 銜接: MongoDB和Frontend server
- 執行環境: Node.js
- 使用函式庫: bcrypt(密碼加密), crypto(驗章)
- 和DB的銜接: 
    - 使用MongoDB的API mongoose來和DB溝通
    - 建立兩個Schema分別為UserModel和HospitalModel
    - UserModel儲存施打疫苗的民眾的基本資料和疫苗施打資料
    - UserModel欄位: `name`, `id`, `injection:[Vaccine]`
        - Vaccine欄位: 
        - `name`, `date`, `duration`, `count`, `hospitalName`, `doctorName`
    - HospitalModel儲存施打單位的資料
    - HospitalModel欄位: `name`, `password`
- 和前端的銜接
    - url: `/loginUser`
        - 查詢DB裡**有沒有**該民眾的施打紀錄
    - url: `/userData`
        - 根據查詢的id**回傳**民眾的施打紀錄
    - url: `/addEntry`
        - 接收醫院傳送的加入疫苗施打資料請求
        - 施打資料裡包含簽章signature，若簽章和public key驗章以後和資料不相同，則回傳false且不加入DB
        - 反之若驗章成功就加入DB
    - url: `/loginHospital`
        - 接收到醫院方傳來的帳密後驗證，如果不正確就會傳'Failed'
        - 若登入帳號在資料庫中無public key，則回傳'Public key not found'
    - url: `/setPublicKey`
        - 若前端接到'Public key not found'，回傳送這個request
        - 接收前端傳來的public key並存入資料庫中
    - url: `/addHospital`
        - 僅供內部維護人員使用
        - 加入醫院的帳號和密碼

## 未來展望
1. 應用block chain技術，使資料達到去中心化且不可否認，公開且安全
2. 加入使用者入境前幾天的PCR檢驗陰性證明
3. 除新冠疫苗之外，其他疫苗資料亦能夠寫入系統
4. 新冠肺炎已康復者的資訊亦能寫入系統，因其已有抗體
5. 除了目前系統上提供的有時效性的QR Code，之後期望能夠建立另一種永久性的QR Code供政府單位使用並且印製於身分證、護照等證件上以供檢查

## 開發者心得

### 陳君翰
//隱藏
### 張翔文
**gcp:**
本次期末project讓我學到在GCP上工作的好處和壞處，好處是大家擁有一個共同的VM可以一起作業，壞處是權限設定、部署設定等稍微有些麻煩，這次單純部署兩個server上去沒用到太多GCP複雜的服務，和別組相比是小巫見大巫，以後應該會繼續探索GCP的服務。
**Nodejs backend server:**
這台server做的都是DB access和前端串接的作業，完全沒有處理到web的各種傳參數，這次作業讓我意識到前後端要先溝通好API的功能是很重要的，我們在快截止的時候才決定簽章的API要怎麼溝通其實有一點晚，若一開始就定義好那前後端會好溝通很多； DB管理的部分我學到了一課，就是資料管理要設好限制，有些欄位要先判斷有無重複、有些欄位不能為空，這些管理若沒設好測試的時候就會出bug，解決不了只能把資料先清空，實在是非常粗糙的做法。
### 李智源
//隱藏

### 周俊廷
//隱藏

### 柯建宇
//隱藏

### 楊宗賢
//隱藏
