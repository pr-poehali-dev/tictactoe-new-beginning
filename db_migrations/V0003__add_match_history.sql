CREATE TABLE match_history (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    mode VARCHAR(32) NOT NULL,
    result VARCHAR(8) NOT NULL,
    opponent VARCHAR(64) NOT NULL DEFAULT 'Bot',
    elo_before INTEGER NOT NULL DEFAULT 1000,
    elo_after INTEGER NOT NULL DEFAULT 1000,
    elo_delta INTEGER NOT NULL DEFAULT 0,
    coins_earned INTEGER NOT NULL DEFAULT 0,
    duration_sec INTEGER,
    created_at TIMESTAMP NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_match_history_user_id ON match_history(user_id);
CREATE INDEX idx_match_history_created_at ON match_history(created_at);
