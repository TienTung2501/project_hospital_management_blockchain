Người tạo hồ sơ (Owner)
     |
     | --> Mã hóa file (AES) --> Upload lên IPFS --> CID
     | --> Mã hóa AES key bằng publicKey của chính Owner --> Lưu CID + AESKeyEncrypted lên Blockchain
     |
     v
+------------------------------------+
|          Smart Contract            |
| (lưu CID, AESKeyEncrypted, owner)  |
+------------------------------------+

Người nhận yêu cầu quyền
     |
     v
Owner duyệt --> Backend tạo accessNonce
     |
     v
Backend tính sharedKey từ (accessNonce + publicKeyNgườiNhận)
     |
     |--> proxyAESKey = AESKeyGốc được mã hóa lại bằng sharedKey
     v
Lưu proxyAESKey và accessNonce (gắn với user đó) trong backend (hoặc gửi tạm thời)

Khi người nhận truy cập:
     |
     v
Người nhận gửi accessNonce + privateKey
     |
Backend dùng accessNonce + privateKey để tính sharedKey
     |
     v
Giải mã proxyAESKey --> AESKeyGốc
     |
     v
Dùng AESKeyGốc giải mã file từ IPFS --> Trả về bản xem trực tiếp (PDF/ảnh)

/*
                       ┌─────────────────────────────┐
                       │       Chủ sở hữu (Grantor)  │
                       │ ───────────────             │
                       │ AES key (gốc)               │
                       │ PublicKey RSA, PrivateKey   │
                       │ PublicKey EC, PrivateKey    │
                       └────────────┬────────────────┘
                                    │
                        Mã hóa AES key bằng RSA (public)
                                    ▼
                          Lưu AES key mã hóa lên Blockchain
                                    │
                ╔═══════════════════╩═══════════════════╗
                ║        Khi có người yêu cầu truy cập ║
                ╚═══════════════════╦═══════════════════╝
                                    │
        ┌──────────────────────────┴─────────────────────────┐
        │        Tạo nonce & sharedKey từ EC keypair         │
        │        grantKey(priv) + requestKey(pub)            │
        │         sharedKey = SHA256(ECDH + nonce)           │
        └──────────────────────────┬─────────────────────────┘
                                   │
                          Mã hóa AES key bằng sharedKey
                                   │
                          Gửi cho người yêu cầu:
                    { accessNonce, encryptedAESKey }
                                   ▼
               ┌──────────────────────────────┐
               │      Người yêu cầu (Requestor)│
               │ ───────────────────────────── │
               │ PublicKey EC, PrivateKey      │
               └───────────────────────────────┘
                                   │
        Dùng privateKey + publicKey bên kia để tính sharedKey
        sharedKey = SHA256(ECDH + nonce)
                                   │
                  Giải mã aesKey = AES.decrypt(encryptedAESKey, sharedKey)
                                   ▼
                            Truy cập file gốc

Thu hồi quyền? ❌ → Xoá accessNonce đó khỏi backend → Không ai giải mã lại được


*/

🧠 Giải thích ngắn gọn:
RSA là hệ mật mã bất đối xứng hỗ trợ:

✅ Mã hóa bằng publicKey → Giải mã bằng privateKey

✅ Hoặc ký bằng privateKey → Xác minh bằng publicKey

Elliptic Curve Cryptography (ECC) (vd: secp256k1, curve25519) lại hoạt động theo cách khác:

ECC không có cơ chế mã hóa/giải mã trực tiếp như RSA

Mà nó dùng cho:

✅ ECDSA: Chữ ký số

✅ ECDH: Tạo shared key (key exchange)

🧩 Vậy EC dùng để làm gì trong hệ thống của bạn?
Trong mô hình bạn đang xây:

✅ RSA dùng để:

Mã hóa AES key gốc → Lưu trong metadata NFT (publicKey chủ sở hữu)

✅ EC (ECDH) dùng để:

Khi cấp quyền truy cập: Tạo sharedKey giữa 2 bên (dùng để mã hóa lại AES key gốc)

Có thể thu hồi: Bằng cách chỉ hủy nonce → không còn dùng được sharedKey đó nữa
