-- ============================================================================
-- UNIRAAH PRODUCTION DATABASE SCHEMA & MIGRATIONS
-- Karachi Higher Secondary Undergraduate Admission Decision-Support Platform
-- Dialect: PostgreSQL 15+ (with Row-Level Security and UUID-OSSP)
-- ============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "citext";

-- ----------------------------------------------------------------------------
-- 1. ENUMS & DOMAIN TYPES
-- ----------------------------------------------------------------------------

DO $$ BEGIN
    CREATE TYPE hsc_group_enum AS ENUM (
        'Pre-Engineering',
        'Pre-Medical',
        'Computer Science',
        'General Science',
        'Commerce',
        'Arts & Humanities'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE examination_board_enum AS ENUM (
        'Board of Intermediate Education Karachi (BIEK)',
        'Federal Board of Intermediate & Secondary Education (FBISE)',
        'Aga Khan University Examination Board (AKU-EB)',
        'Cambridge International (A-Levels)',
        'Sindh Board'
    );
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE sector_enum AS ENUM ('Public', 'Private', 'Semi-Government');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
    CREATE TYPE match_category_enum AS ENUM ('Safety', 'Target', 'Reach');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- ----------------------------------------------------------------------------
-- 2. CORE CATALOG ENTITIES (UNIVERSITIES & PROGRAMMES)
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS universities (
    id VARCHAR(64) PRIMARY KEY, -- e.g. 'ned-uet', 'fast-nuces'
    name VARCHAR(255) NOT NULL,
    short_name VARCHAR(64) NOT NULL,
    sector sector_enum NOT NULL,
    address TEXT NOT NULL,
    location_zone VARCHAR(128) NOT NULL,
    established_year INT NOT NULL,
    accreditations TEXT[] NOT NULL DEFAULT '{}',
    website_url TEXT NOT NULL,
    admissions_email CITEXT NOT NULL,
    admissions_helpline VARCHAR(64) NOT NULL,
    overview TEXT NOT NULL,
    active_programmes_count INT NOT NULL DEFAULT 0,
    status VARCHAR(32) NOT NULL DEFAULT 'admissions_open',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS programmes (
    id VARCHAR(64) PRIMARY KEY, -- e.g. 'ned-cs', 'fast-cs'
    university_id VARCHAR(64) NOT NULL REFERENCES universities(id) ON DELETE RESTRICT,
    name VARCHAR(255) NOT NULL,
    degree_type VARCHAR(64) NOT NULL DEFAULT 'Undergraduate BS',
    discipline VARCHAR(128) NOT NULL,
    eligible_hsc_groups hsc_group_enum[] NOT NULL,
    min_hsc_percentage NUMERIC(5, 2) NOT NULL CHECK (min_hsc_percentage >= 33 AND min_hsc_percentage <= 100),
    test_name VARCHAR(128) NOT NULL,
    entry_test_percentage NUMERIC(5, 2) NOT NULL CHECK (entry_test_percentage >= 0 AND entry_test_percentage <= 100),
    hsc_percentage_weight NUMERIC(5, 2) NOT NULL CHECK (hsc_percentage_weight >= 0 AND hsc_percentage_weight <= 100),
    ssc_percentage_weight NUMERIC(5, 2) NOT NULL DEFAULT 0 CHECK (ssc_percentage_weight >= 0 AND ssc_percentage_weight <= 100),
    annual_tuition_fee_pkr BIGINT NOT NULL CHECK (annual_tuition_fee_pkr >= 0),
    semester_tuition_fee_pkr BIGINT CHECK (semester_tuition_fee_pkr >= 0),
    duration_years INT NOT NULL DEFAULT 4,
    total_seats INT NOT NULL DEFAULT 0,
    shifts VARCHAR(32)[] NOT NULL DEFAULT '{"Morning"}',
    accreditation_body VARCHAR(64) NOT NULL,
    campus_zone VARCHAR(128) NOT NULL,
    overview TEXT NOT NULL,
    career_paths TEXT[] NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_programmes_university ON programmes(university_id);
CREATE INDEX IF NOT EXISTS idx_programmes_discipline ON programmes(discipline);

-- ----------------------------------------------------------------------------
-- 3. STUDENT IDENTITY & ACADEMIC PROFILES
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS students (
    id VARCHAR(64) PRIMARY KEY, -- Matches auth provider user ID e.g. 'student-hamza'
    full_name VARCHAR(255) NOT NULL,
    email CITEXT NOT NULL UNIQUE,
    role VARCHAR(32) NOT NULL DEFAULT 'student',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS student_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id VARCHAR(64) NOT NULL UNIQUE REFERENCES students(id) ON DELETE CASCADE,
    hsc_group hsc_group_enum NOT NULL,
    board examination_board_enum NOT NULL,
    ssc_percentage NUMERIC(5, 2) NOT NULL CHECK (ssc_percentage >= 33 AND ssc_percentage <= 100),
    hsc_part1_percentage NUMERIC(5, 2) NOT NULL CHECK (hsc_part1_percentage >= 33 AND hsc_part1_percentage <= 100),
    hsc_total_predicted_percentage NUMERIC(5, 2) NOT NULL CHECK (hsc_total_predicted_percentage >= 33 AND hsc_total_predicted_percentage <= 100),
    subject_marks JSONB NOT NULL DEFAULT '{}'::jsonb,
    preferred_disciplines TEXT[] NOT NULL DEFAULT '{}',
    max_annual_budget_pkr BIGINT NOT NULL DEFAULT 500000 CHECK (max_annual_budget_pkr >= 10000),
    budget_period VARCHAR(16) NOT NULL DEFAULT 'annual',
    home_location VARCHAR(128) NOT NULL DEFAULT 'Gulshan-e-Iqbal',
    sector_preference VARCHAR(32) NOT NULL DEFAULT 'all',
    shift_preference VARCHAR(32) NOT NULL DEFAULT 'morning',
    priorities JSONB NOT NULL DEFAULT '{"merit": 50, "affordability": 30, "distance": 20}'::jsonb,
    version INT NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_student_profiles_student ON student_profiles(student_id);

-- ----------------------------------------------------------------------------
-- 4. SAVED PROGRAMMES & SAVED UNIVERSITIES
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS saved_programmes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id VARCHAR(64) NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    programme_id VARCHAR(64) NOT NULL REFERENCES programmes(id) ON DELETE CASCADE,
    saved_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    notes TEXT,
    CONSTRAINT uq_student_saved_programme UNIQUE (student_id, programme_id)
);

CREATE INDEX IF NOT EXISTS idx_saved_programmes_student ON saved_programmes(student_id);

CREATE TABLE IF NOT EXISTS saved_universities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id VARCHAR(64) NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    university_id VARCHAR(64) NOT NULL REFERENCES universities(id) ON DELETE CASCADE,
    saved_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    notes TEXT,
    CONSTRAINT uq_student_saved_university UNIQUE (student_id, university_id)
);

CREATE INDEX IF NOT EXISTS idx_saved_universities_student ON saved_universities(student_id);

-- ----------------------------------------------------------------------------
-- 5. RECOMMENDATION SESSIONS & AUDIT TRAIL (Requirement D)
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS recommendation_sessions (
    id VARCHAR(64) PRIMARY KEY, -- e.g. 'recsess-1729680000-abcd'
    student_id VARCHAR(64) NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    profile_snapshot JSONB NOT NULL,
    criteria_weights JSONB NOT NULL,
    results_count INT NOT NULL DEFAULT 0,
    top_recommendation_title VARCHAR(255) NOT NULL,
    results JSONB NOT NULL DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_recommendation_sessions_student ON recommendation_sessions(student_id, created_at DESC);

-- ----------------------------------------------------------------------------
-- 6. RECENT VIEWS & COMPARISON LISTS (Requirements E & F)
-- ----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS student_recent_views (
    id VARCHAR(64) PRIMARY KEY,
    student_id VARCHAR(64) NOT NULL REFERENCES students(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255),
    path VARCHAR(255) NOT NULL,
    item_type VARCHAR(32) NOT NULL, -- 'programme', 'university', 'filter', 'advisor'
    viewed_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_recent_views_student ON student_recent_views(student_id, viewed_at DESC);

CREATE TABLE IF NOT EXISTS student_comparisons (
    student_id VARCHAR(64) PRIMARY KEY REFERENCES students(id) ON DELETE CASCADE,
    programme_ids VARCHAR(64)[] NOT NULL DEFAULT '{}',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT chk_max_four_programmes CHECK (cardinality(programme_ids) <= 4)
);

-- ----------------------------------------------------------------------------
-- 7. ROW-LEVEL SECURITY (RLS) FOR MULTI-TENANT ISOLATION
-- ----------------------------------------------------------------------------

ALTER TABLE student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_programmes ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_universities ENABLE ROW LEVEL SECURITY;
ALTER TABLE recommendation_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_recent_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_comparisons ENABLE ROW LEVEL SECURITY;

-- Students can only inspect and mutate their own data
CREATE POLICY student_profiles_policy ON student_profiles
    FOR ALL
    USING (student_id = current_setting('app.current_student_id', true))
    WITH CHECK (student_id = current_setting('app.current_student_id', true));

CREATE POLICY saved_programmes_policy ON saved_programmes
    FOR ALL
    USING (student_id = current_setting('app.current_student_id', true))
    WITH CHECK (student_id = current_setting('app.current_student_id', true));

CREATE POLICY saved_universities_policy ON saved_universities
    FOR ALL
    USING (student_id = current_setting('app.current_student_id', true))
    WITH CHECK (student_id = current_setting('app.current_student_id', true));

CREATE POLICY recommendation_sessions_policy ON recommendation_sessions
    FOR ALL
    USING (student_id = current_setting('app.current_student_id', true))
    WITH CHECK (student_id = current_setting('app.current_student_id', true));

CREATE POLICY student_recent_views_policy ON student_recent_views
    FOR ALL
    USING (student_id = current_setting('app.current_student_id', true))
    WITH CHECK (student_id = current_setting('app.current_student_id', true));

CREATE POLICY student_comparisons_policy ON student_comparisons
    FOR ALL
    USING (student_id = current_setting('app.current_student_id', true))
    WITH CHECK (student_id = current_setting('app.current_student_id', true));
