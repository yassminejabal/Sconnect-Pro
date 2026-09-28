

CREATE TABLE families (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL
);


CREATE TABLE facilities (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    type VARCHAR(50) NOT NULL,
    address VARCHAR(255),
    erp_capacity INTEGER NOT NULL,
    CONSTRAINT facilities_erp_capacity_check CHECK (erp_capacity > 0)
);


CREATE TABLE associations (
    id SERIAL PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    contact_email VARCHAR(255)
);


CREATE TABLE members (
    id SERIAL PRIMARY KEY,
    family_id INTEGER,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    birth_date DATE NOT NULL,
    is_resident BOOLEAN DEFAULT true NOT NULL,
    quotient_familial NUMERIC(10,2),
    medical_certificate_date DATE,
    passport_sport_code VARCHAR(100),
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT members_family_fk FOREIGN KEY (family_id) REFERENCES families(id) ON DELETE SET NULL,
    CONSTRAINT members_quotient_check CHECK ((quotient_familial IS NULL) OR (quotient_familial >= 0))
);


CREATE TABLE activities (
    id SERIAL PRIMARY KEY,
    association_id INTEGER NOT NULL,
    facility_id INTEGER NOT NULL,
    name VARCHAR(150) NOT NULL,
    description TEXT,
    base_price NUMERIC(10,2) NOT NULL,
    max_capacity INTEGER NOT NULL,
    day_of_week INTEGER NOT NULL,
    start_time TIME WITHOUT TIME ZONE NOT NULL,
    end_time TIME WITHOUT TIME ZONE NOT NULL,
    age_category VARCHAR(30) NOT NULL,
    CONSTRAINT activities_association_fk FOREIGN KEY (association_id) REFERENCES associations(id) ON DELETE CASCADE,
    CONSTRAINT activities_facility_fk FOREIGN KEY (facility_id) REFERENCES facilities(id) ON DELETE CASCADE,
    CONSTRAINT activities_base_price_check CHECK (base_price >= 0),
    CONSTRAINT activities_capacity_check CHECK (max_capacity > 0),
    CONSTRAINT activities_day_check CHECK (day_of_week >= 1 AND day_of_week <= 7),
    CONSTRAINT activities_time_check CHECK (end_time > start_time),
    CONSTRAINT activities_age_category_check CHECK (
        age_category IN ('Baby', 'U9', 'U11', 'U13', 'U15', 'U18', 'Senior', 'Master', 'Tous publics')
    )
);


CREATE TABLE registrations (
    id SERIAL PRIMARY KEY,
    member_id INTEGER NOT NULL,
    activity_id INTEGER NOT NULL,
    final_price NUMERIC(10,2) NOT NULL,
    status VARCHAR(30) DEFAULT 'confirmed' NOT NULL,
    payment_option INTEGER DEFAULT 1 NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    CONSTRAINT registrations_member_fk FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,
    CONSTRAINT registrations_activity_fk FOREIGN KEY (activity_id) REFERENCES activities(id) ON DELETE CASCADE,
    CONSTRAINT registrations_payment_check CHECK (payment_option IN (1, 3)),
    CONSTRAINT registrations_price_check CHECK (final_price >= 15),
    CONSTRAINT registrations_status_check CHECK (status IN ('confirmed', 'cancelled')),
    CONSTRAINT registrations_unique_member_activity UNIQUE (member_id, activity_id)
);


CREATE TABLE waiting_list (
    id SERIAL PRIMARY KEY,
    activity_id INTEGER NOT NULL,
    member_id INTEGER NOT NULL,
    priority_score INTEGER DEFAULT 0 NOT NULL,
    status VARCHAR(30) DEFAULT 'waiting' NOT NULL,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    deadline_confirmation TIMESTAMP WITHOUT TIME ZONE,
    CONSTRAINT waiting_list_activity_fk FOREIGN KEY (activity_id) REFERENCES activities(id) ON DELETE CASCADE,
    CONSTRAINT waiting_list_member_fk FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE CASCADE,
    CONSTRAINT waiting_list_priority_check CHECK (priority_score >= 0),
    CONSTRAINT waiting_list_status_check CHECK (
        status IN ('waiting', 'promoted_pending', 'confirmed', 'expired')
    )
);

CREATE INDEX idx_members_family_id ON members(family_id);
CREATE INDEX idx_activities_association_id ON activities(association_id);
CREATE INDEX idx_activities_facility_id ON activities(facility_id);
CREATE INDEX idx_registrations_member_id ON registrations(member_id);
CREATE INDEX idx_registrations_activity_id ON registrations(activity_id);
CREATE INDEX idx_waiting_list_activity_id ON waiting_list(activity_id);
CREATE INDEX idx_waiting_list_priority ON waiting_list(activity_id, priority_score);