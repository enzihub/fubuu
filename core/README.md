# InboxClarity Core Backend

https://inboxclarity.io

A powerful backend service that transforms email chaos into clarity by delivering intelligent daily summaries. InboxClarity helps professionals reclaim their time with AI-powered email organization and prioritization.

## 🚀 Features

- **Email Processing**
  - Daily executive summaries at 7am
  - Priority inbox management
  - Action item extraction
  - Deadline tracking
- **AI-Powered Analysis**
  - OpenAI integration
  - Custom prompt engineering
  - Intelligent categorization
- **Smart Summaries**
  - Executive overviews
  - Action items & deadlines
  - Strategic initiatives
  - Resource status
  - Team updates
- **Automated Newsletters**
  - Scheduled delivery
  - Customizable templates
  - Rich HTML formatting

## 🛠️ Tech Stack

- Python FastAPI
- Gmail API
- Docker

## 💻 Local Development

### Prerequisites

- Python 3.8+
- pip
- Virtual environment

### Quick Start

1. **Clone the Repository**

```bash
git clone https://github.com/enzihub/inboxclarity-core
cd inboxclarity-core
```

2. **Set Up Virtual Environment**

```bash
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
```

3. **Configure Environment Variables**
   Create a `.env` file in the project root:

```bash
GMAIL_API_KEY=your_gmail_api_key
```

4. **Run Local Server**

```bash
./venv/bin/uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

## 📁 Project Structure

```
├── app/
│   ├── ai/                 # AI integration
│   │   ├── openai.py      # OpenAI client
│   │   └── prompts.py     # Prompt templates
│   ├── database/          # Database layer
│   ├── emailing/          # Email services
│   ├── gmail/             # Gmail integration
│   ├── newsletter/        # Newsletter system
│   ├── subscription/      # Subscription management
│   ├── routes.py          # API endpoints
│   └── schemas.py         # Data models
├── templates/             # Email templates
├── tests/                 # Test suite
├── Dockerfile
└── main.py               # Application entry
```

## 🐳 Docker Deployment

1. **Build Image**

```bash
docker build -t inboxclarity-core .
```

2. **Run Container**

```bash
docker run -p 8000:8000 --env-file .env inboxclarity-core
```

## 🧪 Testing

Run the test suite:

```bash
python -m pytest tests/
```

```
pytest tests/test_response_generator.py -v
```

## 📝 API Documentation

API documentation is available at:

- Development: `http://localhost:8000/docs`
- Production: `https://api.inboxclarity.io/docs`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

MIT

## 📧 Support

For support or inquiries, contact support@inboxclarity.io

## Stored procedures

```
CREATE OR REPLACE FUNCTION get_scheduled_users(lookahead_minutes integer, target_hours integer[])
RETURNS TABLE (
    user_id uuid,
    email text,
    phone text,
    timezone text,
    scheduled_for timestamptz,
    target_hour integer,
    local_time text
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        u.id::uuid,
        u.email::text,
        up.phone::text,
        up.timezone::text,
        t2.target_utc,
        th,
        to_char(t0.target_time, 'HH24:MI')::text
    FROM
        users u
    JOIN
        user_prefs up ON u.id = up.user_id
    CROSS JOIN LATERAL unnest(target_hours) AS th
    CROSS JOIN LATERAL (
        SELECT make_time((th / 100)::int, (th % 100)::int, 0) AS target_time
    ) t0
    CROSS JOIN LATERAL (
        SELECT
            CASE
                WHEN (NOW() AT TIME ZONE up.timezone)::time < t0.target_time
                THEN (NOW() AT TIME ZONE up.timezone)::date + t0.target_time
                ELSE (NOW() AT TIME ZONE up.timezone)::date + t0.target_time + interval '1 day'
            END AS next_local_time
    ) t1
    CROSS JOIN LATERAL (
        SELECT (t1.next_local_time AT TIME ZONE up.timezone) AS target_utc
    ) t2
    WHERE
        t2.target_utc BETWEEN NOW() AND NOW() + (lookahead_minutes * interval '1 minute');
END;
$$;
```

SQL

```
DROP FUNCTION get_scheduled_users(INT, INT[]);
```

```
SELECT proname, proargtypes, prorettype
FROM pg_proc
JOIN pg_namespace ON pg_proc.pronamespace = pg_namespace.oid
WHERE nspname = 'public' AND proname = 'get_scheduled_users';

```

---

Built with ❤️ for professionals who value their inbox sanity.
