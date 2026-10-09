from app.integrations.response_generator import MessageType, ResponseGenerator


def gen():
    return ResponseGenerator()


def test_input_received_message():
    assert gen().generate_response(MessageType.INPUT_RECEIVED) == "Your wisdom is being processed 🔨"


def test_success_message_lists_each_platform():
    results = [
        {"platform": "Twitter", "status": "success", "content": "Ship small, ship daily."},
        {"platform": "LinkedIn", "status": "success", "content": "Ship small, ship daily."},
    ]
    out = gen().generate_response(MessageType.POST_SUCCESS, results, current_time="9:41am", date="01/03/2025")
    assert len(out) == 2
    assert out[0].startswith("Twitter Posted")
    assert '"Ship small, ship daily."' in out[0]


def test_rate_limited_platform_is_explained():
    results = [{"platform": "Twitter", "status": "rate_limited", "retry_after": 7200}]
    out = gen().generate_response(MessageType.POST_SUCCESS, results, current_time="9:41am", date="01/03/2025")
    assert out == ["Oops! It looks like you've hit your daily limit for Twitter! Try again in 2.0h."]


def test_all_failed_falls_back_to_error():
    results = [{"platform": "Twitter", "status": "posting_failed", "error": "boom"}]
    out = gen().generate_response(MessageType.POST_SUCCESS, results, current_time="9:41am", date="01/03/2025")
    assert out.startswith("Oops, system hiccup!")


def test_no_platforms_connected():
    out = gen().generate_response(MessageType.POST_SUCCESS, [], current_time="9:41am", date="01/03/2025")
    assert "No social media accounts connected" in out


def test_daily_prompts_are_unique():
    prompts = gen().get_prompts_for_schedule()
    assert len(prompts) == 3
    assert len(set(prompts.values())) == 3
