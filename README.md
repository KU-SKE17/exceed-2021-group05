# LET IT GO!

Exceed project (group 5)

## Repository description

- directory `frontend/`: contains frontend code.
  - directory `./scripts/`: contains scripts for all HTML files.
  - directory `./photo/`: contains photos of group members.
  - directory `./css/`: contains stylesheets.
- `backend/back_end.py`: contains backend code.
- `hardware/iot_code.ino`: contains hardware code.

## Installation

```
git clone https://github.com/ZEZAY/exceed-2021-group05.git
cd exceed-2021-group05/
```

### Back-end

```
python3 backend/back_end.py
```

### Front-end

```
npm install http-server -g http-server
```

## Requirements

### Front-end

- GET แสดงผล อุณหภูมิ CO2 ค่า gas (LPG , CH4 , H2)
- POST สามารถตั้งค่าของ Hardware ได้จาก Web
- แสดงการแจ้งเตือนคุณภาพอากาศ

### Back-end

- เป็นตัวกลางรหะว่าง front-end และ back-end เข้าถึง database
- PUT setting (for front-end) สำหรับส่งค่าจาก frontend ไปตั้งค่า hardware
- POST sensor value (for hardware) สำหรับการส่งค่าจาก sensor ไปยัง database
- GET setting (for hardware) สำหรับการตั้งค่าค่าอันตราย
- GET sensor value (for front-end) สำหรับการแสดงผลที่
- GET sensor value (for hardware) สำหรับการเปิดหน้าต่าง
- Trigger function to line notify
- เมื่อค่าเกินค่าที่กำหนดจะสั่งhardwareให้เปิดหน้าต่างอัตโนมัติได้
