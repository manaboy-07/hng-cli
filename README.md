# Insighta CLI

A powerful command-line interface for interacting with the **Insighta Profiles API**.
Built for speed, automation, and developer productivity.

---

## Features

- GitHub OAuth authentication
- List, filter, and search profiles
- Export data as CSV
- Pagination & sorting support
- Persistent login (stored locally)
- Smart query support
- Clean table output

---

## Installation

Install globally:

```bash
npm install -g insighta-cli
```

Then verify:

```bash
insighta --help
```

---

## Authentication

### Login

```bash
insighta login
```

- Opens your browser
- Authenticate with GitHub
- Tokens are saved locally at:

```bash
~/.insighta/credentials.json
```

---

### Check current user

```bash
insighta whoami
```

---

### Logout

```bash
insighta logout
```

---

## Profiles Commands

### List Profiles

```bash
insighta profiles list
```

---

### With Filters

```bash
insighta profiles list --gender male
insighta profiles list --country NG --age-group adult
insighta profiles list --min-age 25 --max-age 40
```

---

### Sorting

```bash
insighta profiles list --sort-by age --order desc
```

---

### Pagination

```bash
insighta profiles list --page 2 --limit 20
```

---

### Get Single Profile

```bash
insighta profiles get <id>
```

---

### Smart Search

```bash
insighta profiles search "young males from nigeria"
```

---

### Create Profile (Admin only)

```bash
insighta profiles create --name "Harriet Tubman"
```

---

### Export Profiles (CSV)

```bash
insighta profiles export --format csv
```

With filters:

```bash
insighta profiles export --format csv --gender male --country NG
```

✔ CSV is saved to your current working directory

---

## Configuration

The CLI uses the deployed backend:

```env
BACKEND_URL=https://hng1-production-f8e7.up.railway.app
```

You can modify this in your config or environment variables if needed.

---

## How Authentication Works

1. CLI opens browser → GitHub login
2. GitHub redirects → backend
3. Backend generates tokens
4. Backend redirects → local CLI server
5. CLI saves tokens locally

---

## File Storage

Credentials are stored securely at:

```bash
~/.insighta/credentials.json
```

Example:

```json
{
  "access_token": "...",
  "refresh_token": "..."
}
```

---

## Error Handling

The CLI gracefully handles:

- Unauthorized access
- Rate limits (429)
- Expired tokens
- Network failures

---

## 🛠 Development

Clone the repo:

```bash
git clone https://github.com/your-username/insighta-cli.git
cd insighta-cli
npm install
```

Run locally:

```bash
node bin/index.js
```

---

## Requirements

- Node.js 18+
- Internet connection
- GitHub account (for login)

---

## Roadmap

- Auto token refresh
- Better CLI UI (spinners, colors)
- Config profiles
- Advanced query parsing
- Testing suite

---

## Author

Built by **Manasseh Oruebor**

---

---

## Acknowledgements

- NestJS Backend API
- GitHub OAuth
- Node.js ecosystem

---

## Final Note

Insighta CLI is designed to feel like a real production-grade developer tool.
Fast, simple, and powerful.

---
