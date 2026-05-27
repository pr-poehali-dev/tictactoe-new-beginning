CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL REFERENCES users(id),
    yukassa_payment_id VARCHAR(64) UNIQUE,
    package_id VARCHAR(32) NOT NULL,
    coins INTEGER NOT NULL,
    amount_rub NUMERIC(10,2) NOT NULL,
    status VARCHAR(16) NOT NULL DEFAULT 'pending',
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    paid_at TIMESTAMP
);

CREATE INDEX idx_payments_user_id ON payments(user_id);
CREATE INDEX idx_payments_yukassa_id ON payments(yukassa_payment_id);
