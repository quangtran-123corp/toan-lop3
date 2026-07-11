# Hướng dẫn tạo Repo GitHub + đưa app lên mạng (cho bé dùng iPad)

Mục tiêu: bé mở app bằng **đường link** trên iPad / laptop; anh sửa trên máy `C:\AIBTest\toan-lop3` rồi **đẩy lên GitHub**.

---

## Phần A — Chuẩn bị trên máy anh (một lần)

### 1. Cài Git (nếu chưa có)

1. Tải: https://git-scm.com/download/win  
2. Cài đặt (Next hết, giữ mặc định cũng được)  
3. Mở **PowerShell** mới, gõ:

```powershell
git --version
```

Thấy dạng `git version 2.x.x` là OK.

### 2. Tạo tài khoản GitHub (nếu chưa có)

1. Vào: https://github.com/signup  
2. Đăng ký bằng email  
3. Xác nhận email

### 3. Cài GitHub CLI (tuỳ chọn, giúp đăng nhập dễ)

Hoặc chỉ dùng trình duyệt + Git cũng được (phần B + C bên dưới).

---

## Phần B — Tạo Repository trên GitHub (trên web)

1. Đăng nhập https://github.com  
2. Bấm nút **+** (góc phải trên) → **New repository**  
3. Điền:

| Ô | Gợi ý điền |
|---|------------|
| **Repository name** | `toan-lop3` |
| **Description** | App luyện Toán lớp 3 KNTT cho bé |
| **Public / Private** | **Public** (dễ bật GitHub Pages miễn phí) |
| **Add a README** | **Không tích** (máy anh đã có code) |
| **Add .gitignore** | **Không** |
| **License** | None |

4. Bấm **Create repository**  
5. GitHub hiện trang trống — **giữ tab này**, sẽ cần URL dạng:

```text
https://github.com/TEN-USER-CUA-ANH/toan-lop3.git
```

*(Thay `TEN-USER-CUA-ANH` bằng username GitHub của anh.)*

---

## Phần C — Đẩy code từ máy anh lên GitHub (lần đầu)

Mở **PowerShell** và chạy lần lượt:

### 1. Vào thư mục app

```powershell
cd C:\AIBTest\toan-lop3
```

### 2. Khởi tạo Git (nếu chưa)

```powershell
git init
git branch -M main
```

### 3. Cấu hình tên & email (chỉ cần 1 lần trên máy)

```powershell
git config --global user.name "Ten Anh"
git config --global user.email "email-dung-dang-ky-github@example.com"
```

### 4. Thêm file & commit

```powershell
git add .
git status
git commit -m "Lan dau: app luyen Toan lop 3"
```

### 5. Gắn remote & đẩy lên

**Thay URL cho đúng repo của anh:**

```powershell
git remote add origin https://github.com/TEN-USER-CUA-ANH/toan-lop3.git
git push -u origin main
```

- Lần đầu Windows/GitHub sẽ hỏi **đăng nhập**.  
- Nên dùng **Personal Access Token** thay mật khẩu (GitHub không nhận password cũ):

  1. GitHub → avatar → **Settings** → **Developer settings**  
  2. **Personal access tokens** → **Tokens (classic)** → **Generate new token**  
  3. Tích quyền **repo**  
  4. Copy token → dán vào chỗ mật khẩu khi `git push`

Sau khi push xong, F5 trang repo trên GitHub: sẽ thấy các file `index.html`, `js/`, `css/`, …

---

## Phần D — Bật GitHub Pages (để có link cho bé)

1. Vào repo `toan-lop3` trên GitHub  
2. **Settings** → menu trái **Pages**  
3. **Build and deployment** → **Source**: chọn **Deploy from a branch**  
4. **Branch**: chọn `main`  
5. **Folder**: `/ (root)`  
6. Bấm **Save**  
7. Đợi 1–2 phút, refresh trang Pages — sẽ thấy link:

```text
https://TEN-USER-CUA-ANH.github.io/toan-lop3/
```

8. Mở link bằng Chrome trên máy anh thử trước  
9. Trên **iPad** của bé: Safari → dán link → **Chia sẻ** → **Thêm vào Màn hình chính** (như app)

> File chính đã gộp sẵn: có thể mở trực tiếp  
> `https://TEN-USER-CUA-ANH.github.io/toan-lop3/ToanLop3.html`  
> hoặc `index.html` (cùng nội dung).

---

## Phần E — Mỗi lần anh sửa app (thói quen 3 lệnh)

Trên máy làm việc:

```powershell
cd C:\AIBTest\toan-lop3
git add .
git commit -m "Mo ta sua loi / tinh nang"
git push
```

Rồi nhắn bé: **kéo trang xuống để tải lại** (hoặc đóng tab mở lại link).

---

## Phần F — Checklist khi bị kẹt

| Hiện tượng | Cách xử lý |
|------------|------------|
| `git` không nhận lệnh | Cài Git, **mở lại** PowerShell |
| `remote origin already exists` | `git remote remove origin` rồi `git remote add origin ...` lại |
| Push bị từ chối (auth) | Tạo Personal Access Token, dùng token làm mật khẩu |
| Pages 404 | Đợi 2–5 phút; kiểm tra Branch = `main`, folder = `/ (root)` |
| Sửa rồi bé chưa thấy | Bé hard refresh; anh kiểm tra `git push` đã thành công trên GitHub |
| Máy công ty chặn GitHub | Push từ laptop cá nhân, hoặc dùng USB mang code về nhà push |

---

## Sơ đồ nhớ nhanh

```
[Anh sửa code] → git add/commit/push → [GitHub] → GitHub Pages
                                              ↓
                                    [Bé mở link trên iPad]
                                              ↓
                                    [Bé báo lỗi] → Anh sửa → push lại
```

---

## Bước tiếp theo gợi ý

1. Làm **Phần B** (tạo repo trên web)  
2. Làm **Phần C** (push code)  
3. Làm **Phần D** (bật Pages)  
4. Gửi link cho bé thử trên iPad  

Nếu anh gửi **username GitHub** (hoặc dán URL repo vừa tạo), có thể được hướng dẫn đúng 2–3 lệnh `git remote` / `git push` khớp repo của anh.
