--
-- PostgreSQL database dump
--

-- Dumped from database version 17.2
-- Dumped by pg_dump version 17.2

-- Started on 2025-04-21 14:48:27

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- TOC entry 223 (class 1259 OID 16718)
-- Name: devices; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id SERIAL PRIMARY KEY,
    username character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);

-- ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);



CREATE TABLE public.devices (
    id integer NOT NULL,
    feed_name character varying(255) NOT NULL,
    value character varying(255) NOT NULL,
    "timestamp" timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


ALTER TABLE public.devices OWNER TO postgres;

--
-- TOC entry 222 (class 1259 OID 16717)
-- Name: devices_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.devices_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
-- TOC entry 4901 (class 0 OID 0)
-- Dependencies: 222
-- Name: devices_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.devices_id_seq OWNED BY public.devices.id;


--
-- TOC entry 227 (class 1259 OID 16808)
-- Name: reminders; Type: TABLE; Schema: public; Owner: postgres
--

DROP TABLE IF EXISTS public.reminders;
CREATE TABLE public.reminders (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    index_name VARCHAR(50) NOT NULL,
    higher_than_value NUMERIC,
    higher_than_status BOOLEAN DEFAULT FALSE,
    lower_than_value NUMERIC,
    lower_than_status BOOLEAN DEFAULT FALSE,
    repeat_after_value INTEGER, -- Thời gian lặp lại cảnh báo (phút)
    repeat_after_status BOOLEAN DEFAULT FALSE,
    last_triggered_at TIMESTAMP WITHOUT TIME ZONE,
    active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE
);

--
-- TOC entry 226 (class 1259 OID 16807)
-- Name: reminders_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.reminders_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
-- TOC entry 4902 (class 0 OID 0)
-- Dependencies: 226
-- Name: reminders_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.reminders_id_seq OWNED BY public.reminders.id;


--
-- TOC entry 225 (class 1259 OID 16791)
-- Name: schedule_tasks; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.schedule_tasks (
    id integer NOT NULL,
    user_id integer NOT NULL,
    feed_key character varying(255) NOT NULL,
    payload character varying(255) NOT NULL,
    execute_at timestamp without time zone NOT NULL,
    status character varying(255) DEFAULT 'PENDING'::character varying NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);



--
-- TOC entry 224 (class 1259 OID 16790)
-- Name: schedule_tasks_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.schedule_tasks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
-- TOC entry 4903 (class 0 OID 0)
-- Dependencies: 224
-- Name: schedule_tasks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.schedule_tasks_id_seq OWNED BY public.schedule_tasks.id;


--
-- TOC entry 221 (class 1259 OID 16708)
-- Name: sensors; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.sensors (
    id integer NOT NULL,
    feed_name character varying(255) NOT NULL,
    value character varying(255) NOT NULL,
    "timestamp" timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);



--
-- TOC entry 220 (class 1259 OID 16707)
-- Name: sensors_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.sensors_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;



--
-- TOC entry 4904 (class 0 OID 0)
-- Dependencies: 220
-- Name: sensors_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.sensors_id_seq OWNED BY public.sensors.id;


--
-- TOC entry 219 (class 1259 OID 16700)
-- Name: threshold; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.threshold (
    feed_name character varying(255) NOT NULL,
    upper_value character varying(255) NOT NULL,
    lower_value character varying(255) NOT NULL
);




--
-- TOC entry 218 (class 1259 OID 16689)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--




--
-- TOC entry 217 (class 1259 OID 16688)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;




--
-- TOC entry 4905 (class 0 OID 0)
-- Dependencies: 217
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 4723 (class 2604 OID 16721)
-- Name: devices id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.devices ALTER COLUMN id SET DEFAULT nextval('public.devices_id_seq'::regclass);


--
-- TOC entry 4729 (class 2604 OID 16811)
-- Name: reminders id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reminders ALTER COLUMN id SET DEFAULT nextval('public.reminders_id_seq'::regclass);


--
-- TOC entry 4725 (class 2604 OID 16794)
-- Name: schedule_tasks id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.schedule_tasks ALTER COLUMN id SET DEFAULT nextval('public.schedule_tasks_id_seq'::regclass);


--
-- TOC entry 4721 (class 2604 OID 16711)
-- Name: sensors id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sensors ALTER COLUMN id SET DEFAULT nextval('public.sensors_id_seq'::regclass);


--
-- TOC entry 4719 (class 2604 OID 16692)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--


--
-- TOC entry 4745 (class 2606 OID 16726)
-- Name: devices devices_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.devices
    ADD CONSTRAINT devices_pkey PRIMARY KEY (id);


--
-- TOC entry 4749 (class 2606 OID 16821)
-- Name: reminders reminders_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.reminders
    ADD CONSTRAINT reminders_pkey PRIMARY KEY (id);


--
-- TOC entry 4747 (class 2606 OID 16801)
-- Name: schedule_tasks schedule_tasks_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.schedule_tasks
    ADD CONSTRAINT schedule_tasks_pkey PRIMARY KEY (id);


--
-- TOC entry 4743 (class 2606 OID 16716)
-- Name: sensors sensors_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.sensors
    ADD CONSTRAINT sensors_pkey PRIMARY KEY (id);


--
-- TOC entry 4741 (class 2606 OID 16706)
-- Name: threshold threshold_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.threshold
    ADD CONSTRAINT threshold_pkey PRIMARY KEY (feed_name);


--
-- TOC entry 4737 (class 2606 OID 16697)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 4739 (class 2606 OID 16699)
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- TOC entry 4750 (class 2606 OID 16802)
-- Name: schedule_tasks schedule_tasks_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.schedule_tasks
    ADD CONSTRAINT schedule_tasks_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id);


-- Completed on 2025-04-21 14:48:28

--
-- PostgreSQL database dump complete
--

-- bảng cho api /settings
DROP TABLE IF EXISTS device_configurations;
CREATE TABLE device_configurations (
    name VARCHAR(50) PRIMARY KEY,
    mode VARCHAR(20) NOT NULL DEFAULT 'manual' CHECK (mode IN ('manual', 'scheduled', 'automatic')),
    status BOOLEAN NOT NULL DEFAULT FALSE, -- true: on, false: off
    intensity INTEGER NOT NULL DEFAULT 0 CHECK (intensity >= 0 AND intensity <= 100),
    turn_off_after INTEGER, -- In minutes, NULL allowed only for manual/automatic
    turn_on_at TIME, -- Only for 'scheduled' mode
    repeat VARCHAR(10) CHECK (repeat IN ('today', 'everyday', 'custom')), -- Only for 'scheduled' mode
    dates TEXT[], -- Array of 'YYYY-MM-DD' strings, only for 'scheduled' with 'custom' repeat
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO device_configurations (name, mode, status, intensity, turn_off_after) VALUES
('led', 'manual', false, 50, null),
('fan', 'manual', false, 0, null),
('pump', 'manual', false, 0, null)
ON CONFLICT (name) DO NOTHING;


-- hàm để update update_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ language 'plpgsql';

-- trigger cho device_configurations
CREATE TRIGGER update_device_configurations_updated_at
BEFORE UPDATE ON device_configurations
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

SET search_path TO public;


-- update 05/05/2025 - notifications
DROP TABLE IF EXISTS notifications;
CREATE TABLE public.notifications (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    message TEXT NOT NULL,
    type VARCHAR(50), -- 'DEVICE_UPDATE', 'SENSOR_ALERT', 'SCHEDULE_COMPLETED', 'REMINDER'...
    is_read BOOLEAN DEFAULT FALSE,
    related_entity_id VARCHAR(255),
    timestamp TIMESTAMP WITHOUT TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE -- xoá user -> xoá notification của user
);