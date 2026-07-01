# OTP Integration Recommendation – Bodax SACCO

**Document type:** Technical recommendation  
**Version:** 1.0  
**Date:** July 2026  
**Prepared for:** Bodax SACCO management team

---

## 1. Overview

This document recommends integrating One-Time Password (OTP) verification into the Bodax SACCO login flow to protect member and treasurer accounts from unauthorised access. OTP provides a second layer of identity confirmation beyond the password.

---

## 2. Proposed SMS Provider

### **Africa's Talking (AT)**

| Attribute | Detail |
|-----------|--------|
| Provider | Africa's Talking |
| Website | https://africastalking.com |
| Coverage | Uganda (MTN, Airtel), Kenya, Tanzania, Rwanda, and 35+ African markets |
| API type | REST API (JSON) |
| SDK | Node.js (`africastalking` npm package) |
| Sandbox | Yes — free testing environment |
| Support | 24/7 email + chat |

**Why Africa's Talking?**
- Established Ugandan presence with direct carrier connections to MTN Uganda and Airtel Uganda, the two networks most Boda Boda operators use.
- Simple REST API with a well-maintained Node.js SDK that integrates directly into the existing Express server.
- Competitive pricing and transparent billing dashboard.

---

## 3. Estimated Cost Per OTP (Uganda)

| Network | Cost per SMS | Notes |
|---------|-------------|-------|
| MTN Uganda | ~UGX 35–50 per SMS | Bulk rates available |
| Airtel Uganda | ~UGX 35–50 per SMS | Bulk rates available |
| **Estimated per OTP** | **UGX 40–50** | One SMS = one OTP |

> **Note:** Rates are approximate and subject to Africa's Talking's current Uganda pricing. Sign up for a sandbox account at https://africastalking.com to get exact current rates. Monthly OTP costs will depend on active login frequency — a SACCO with 200 members logging in once per day would spend approximately **UGX 240,000–300,000 per month**.

---

## 4. Required Login Flow Change

### Current flow (password only)
```
1. User enters phone number / email
2. User enters password
3. System authenticates → session created
```

### Proposed flow (password + OTP)
```
1. User enters phone number / email
2. User enters password
3. Server validates credentials → generates 6-digit OTP
4. Server sends OTP via SMS to registered phone number (Africa's Talking)
5. User is redirected to OTP entry screen
6. User enters OTP within 5-minute window
7. Server validates OTP → session created
8. User is redirected to their dashboard
```

### New screens required
| Screen | Description |
|--------|-------------|
| OTP Entry | Input field for 6-digit code + "Resend OTP" button |
| OTP Expired | Error state with resend option |

### Server-side changes required
| Change | Description |
|--------|-------------|
| OTP table | New `otp_tokens` DB table: `member_id`, `token_hash`, `expires_at`, `used` |
| `/auth/login` modification | On successful password check, generate OTP, send SMS, return `{ otp_required: true }` |
| New route: `POST /auth/verify-otp` | Accepts `{ identifier, otp }`, validates token, issues JWT |
| OTP expiry | 5-minute TTL; invalidate after single use |
| Rate limiting | Max 3 OTP attempts per 15 minutes to prevent brute force |

---

## 5. Implementation Timeline Estimate

| Task | Estimated effort |
|------|-----------------|
| Africa's Talking account setup | 1 hour |
| OTP tokens DB table + migration | 2 hours |
| Server OTP generation + SMS send | 3 hours |
| OTP verification endpoint | 2 hours |
| Frontend OTP entry screen | 3 hours |
| Testing (sandbox + live) | 4 hours |
| **Total** | **~15 hours** |

---

## 6. Recommendation

Implement OTP for **treasurer and chairman logins first** as a priority, since these roles can approve loans and withdrawals. Member OTP can be rolled out in a subsequent sprint.

---

*Bodax SACCO – Mbarara Boda Boda Savings and Loans*
