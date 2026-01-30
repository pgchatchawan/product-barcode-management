# Product Barcode Management

ระบบจัดการข้อมูลสินค้าด้วยบาร์โค้ด  
พัฒนาเพื่อแสดงความสามารถด้าน **Frontend (Angular)** และ **Backend (Golang)**  
เหมาะสำหรับใช้เป็น **Assignment / Technical Test / Portfolio**

---

## 📌 Overview

Product Barcode Management เป็นระบบสำหรับ
- เพิ่ม
- แสดง
- ลบ

ข้อมูลรหัสสินค้า พร้อมแสดงบาร์โค้ดตามมาตรฐานที่กำหนด  
ออกแบบโครงสร้างโค้ดให้แยกความรับผิดชอบชัดเจน (Clean Architecture Style)

---

## ✨ Features

### Product Management
- เพิ่มรหัสสินค้า
- แสดงรายการสินค้า
- ลบข้อมูลสินค้า

### Validation
- ตรวจสอบรูปแบบรหัสสินค้าอัตโนมัติ
  - ความยาว 16 ตัวอักษร
  - รูปแบบ `XXXX-XXXX-XXXX-XXXX`
  - อักษรภาษาอังกฤษตัวพิมพ์ใหญ่ (A–Z) และตัวเลข (0–9)
- Auto Uppercase + Auto Format ขณะพิมพ์
- ปุ่มเพิ่มรายการจะถูกปิดใช้งานเมื่อข้อมูลไม่ถูกต้อง

### Barcode
- แสดงบาร์โค้ดตามมาตรฐาน **Code 39**

### UX
- แสดงรายการสินค้าในรูปแบบตาราง
- ลบข้อมูลพร้อม Confirm Dialog
- Response รูปแบบเดียวกันทั้งระบบ (Custom API Response)

---

## 🖥️ UI Preview

ตัวอย่างหน้าจอการใช้งานระบบ

![UI Preview](docs/ui.png)

---

## 🛠️ Tech Stack

### Frontend
- Angular (Standalone Components)
- Angular Material
- Reactive Forms
- TypeScript

### Backend
- Golang (net/http)
- Swagger (swaggo)
- In-memory Repository
- Docker / Docker Compose

### Barcode
- JsBarcode
- Barcode Standard: **Code 39**

---

## 📋 Business Rules / System Specification

- รหัสสินค้าต้องประกอบด้วยตัวอักษร A–Z และตัวเลข 0–9 เท่านั้น
- ความยาวรหัสสินค้า 16 ตัวอักษร
- รูปแบบ `XXXX-XXXX-XXXX-XXXX`
- ระบบแสดงบาร์โค้ดตามมาตรฐาน **Code 39**
- ไม่อนุญาตให้เพิ่มข้อมูลที่ไม่ถูกต้องตามรูปแบบที่กำหนด

---

## 📂 Project Structure

```text
product-barcode-management
├── backend
│   ├── cmd/api            # Entry point
│   ├── docs               # Swagger docs
│   ├── internal
│   │   ├── app             # Router / Response
│   │   └── products        # Feature: products
│   │       ├── handler.go
│   │       ├── service.go
│   │       ├── repo.go
│   │       ├── model.go
│   │       └── routes.go
│   ├── Dockerfile
│   └── docker-compose.yml
│
├── frontend
│   ├── src
│   ├── angular.json
│   └── package.json
│
└── README.md
