# ubase.kr 도메인 & 호스팅 설정

## 1. 도메인 (가비아)

| 항목 | 값 |
|------|---|
| 도메인 | ubase.kr |
| 등록일 | 2025-05-16 |
| 만기일 | 2026-05-16 |
| 요금 | 21,000원/년 |
| 소유자 | 프로네시스 (jjy@prnss.io) |
| 관리자 | 진주영 (jjy@prnss.io) |

### 네임서버 (카페24로 위임)

| 순서 | 호스트 | IP |
|------|--------|-----|
| 1차 | ns1.cafe24.com | - |
| 2차 | ns1.cafe24.co.kr | 112.175.246.232 |
| 3차 | ns2.cafe24.com | - |
| 4차 | ns2.cafe24.co.kr | 112.175.247.232 |

- DNS 호스트: 미사용
- DNSSEC: 미사용

---

## 2. DNS 레코드 (카페24 네임서버에서 관리)

| 타입 | 호스트 | 값 | TTL |
|------|--------|---|-----|
| A | ubase.kr | 211.34.104.137 | 30m |
| NS | ubase.kr | ns1.cafe24.com, ns1.cafe24.co.kr, ns2.cafe24.com, ns2.cafe24.co.kr | 30m |
| MX | ubase.kr | spam.cafe24.com (우선순위 10) | 30m |
| TXT (SPF) | ubase.kr | v=spf1 include:spf.cafe24.com ~all | 30m |
| TXT | ubase.kr | Google 사이트 인증 3건 | 30m |
| SOA | ubase.kr | postmaster@ubase.kr / Serial: 20220810 | 30m |
| AAAA | - | 없음 | - |
| CNAME | - | 없음 | - |

---

## 3. 호스팅 (카페24)

| 항목 | 값 |
|------|---|
| 아이디 | dvubase |
| 서비스 | 매니지드 워드프레스 비즈니스 |
| 기간 | 2025-05-08 ~ 2026-12-07 |
| 서버IP | 211.34.104.137 (uws8-wpm-118) |
| 서버환경 | PHP 8.4 / MariaDB 10.x / UTF-8 |
| 하드 | 3,000MB |
| 트래픽 | 3,500MB |
| 운영사이트 | ubase.kr (WordPress LIVE) |
| 관리자 URL | ubase.kr/wp-admin |
| 서브도메인 | dvubase.mycafe24.com |
| SSL | 무료 인증서 (만료 2026-04-12) |
| 도메인 약정 | 6개 / 사용중 2개 |

---

## 4. 접속정보

### FTP/SSH

| 항목 | 값 |
|------|---|
| 주소 | ubase.kr |
| 아이디 | dvubase |
| FTP 포트 | 21 |
| SSH 포트 | 22 |

### DB

| 항목 | 값 |
|------|---|
| 주소 | localhost |
| 아이디 | dvubase |
| 포트 | 3306 |
| 종류 | MariaDB |

---

## 5. 구조 요약

```
ubase.kr (가비아 도메인)
  └─ 네임서버: 카페24
       └─ A 레코드 → 211.34.104.137 (카페24 서버)
            └─ 매니지드 워드프레스 (dvubase)

techownerns.github.io/ubase-website (GitHub Pages)
  └─ 별도 운영 (커스텀 도메인 미연결)
```

---

*최종 확인: 2026-03-03*
