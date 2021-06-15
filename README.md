# VaccineSearchApp
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