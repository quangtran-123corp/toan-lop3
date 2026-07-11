# 🔢 Toán Lớp 3 — Kết nối tri thức

App luyện Toán **Cơ bản + Nâng cao** cho học sinh chuẩn bị / đang học **Lớp 3**, bám định hướng SGK **Kết nối tri thức với cuộc sống**.

Bé có thể tự luyện **mỗi ngày**: thử thách 10 câu, chọn chủ đề, nhận sao, giữ chuỗi ngày luyện (streak).

## Link cho bé (iPad / laptop)

| | URL |
|---|-----|
| **Repo GitHub** | https://github.com/quangtran-123corp/toan-lop3 |
| **App online (GitHub Pages)** | https://quangtran-123corp.github.io/toan-lop3/ |
| **File gộp 1 trang** | https://quangtran-123corp.github.io/toan-lop3/ToanLop3.html |

> Trên iPad: mở Safari → dán link app → **Chia sẻ** → **Thêm vào Màn hình chính**.  
> Nếu link Pages báo 404: vào repo → **Settings → Pages** → Source **Deploy from a branch** → Branch **main** / **/(root)** → Save, đợi 1–2 phút.

## Cách mở app trên máy (local)

1. Mở thư mục `toan-lop3`
2. **Double-click** file `index.html` hoặc `ToanLop3.html`
3. Chọn trình duyệt **Chrome** hoặc **Microsoft Edge**

Trên trang chủ bạn sẽ thấy ngay:

- Ô **👶 Tên bé** + nút **Lưu**
- Nút tím **Bắt đầu thử thách 🚀**

> Hoặc double-click `start.bat` nếu muốn chạy qua máy chủ local.

## Cập nhật code lên GitHub (phụ huynh)

Sau khi sửa app trên máy:

```powershell
cd C:\AIBTest\toan-lop3
node build-single.js
git add .
git commit -m "Cap nhat app"
git push
```

Hướng dẫn chi tiết: xem file `HUONG-DAN-GITHUB.md`.

## Tính năng

| Tính năng | Mô tả |
|-----------|--------|
| 🎯 **Thử thách mỗi ngày** | 10 câu hỗn hợp (Cơ bản + Nâng cao), thưởng +5⭐ khi hoàn thành |
| 🌱 **Cơ bản** | Bám dạng bài SGK, 1 bước, số vừa phải |
| 🚀 **Nâng cao** | Số lớn hơn, nhiều bước, toán lời văn |
| 📚 **10 chủ đề** | Theo chương trình lớp 3 KNTT |
| ⭐ **Sao & streak** | Khuyến khích luyện đều |
| 📊 **Tiến độ** | Theo dõi đúng/sai từng chủ đề |
| ⚙️ **Tên bé** | Hiển thị lời chào cá nhân |
| 💾 **Lưu máy** | Dữ liệu trên trình duyệt (localStorage), không cần mạng sau khi mở |

## Chủ đề luyện

1. Số đến 10 000  
2. Cộng · Trừ  
3. Bảng nhân · Bảng chia  
4. Nhân · Chia số lớn  
5. Hình học  
6. Chu vi · Diện tích  
7. Đo lường (thời gian, tiền, độ dài, kg…)  
8. Phân số đơn giản  
9. Toán có lời văn  
10. Hỗn hợp (ôn nhiều dạng)

## Gợi ý dùng hàng ngày (phụ huynh)

1. Đặt **tên bé** trong ⚙️ Cài đặt  
2. Mỗi ngày làm **Thử thách hôm nay** (khoảng 10–15 phút)  
3. Nếu sai nhiều → chọn chủ đề yếu, mức **Cơ bản**  
4. Khi vững → chuyển **Nâng cao**  
5. Giữ **streak** (ngày liên tiếp) để tạo thói quen  

## Cấu trúc thư mục

```
toan-lop3/
├── index.html
├── README.md
├── css/styles.css
└── js/
    ├── app.js         # Giao diện & luồng luyện
    ├── questions.js   # Sinh câu hỏi CB / NC
    ├── topics.js      # Danh mục chủ đề
    └── storage.js     # Lưu tiến độ
```

## Ghi chú

- App **tự sinh câu hỏi** theo dạng bài lớp 3 (không chép nguyên từng trang SGK).  
- Phù hợp **ôn hè / trước khi vào lớp 3** và **luyện song song năm học**.  
- Hoạt động tốt trên **máy tính bảng / điện thoại** (giao diện hẹp, chạm lớn).

Chúc bé học vui và ngày càng giỏi Toán! 🌟
