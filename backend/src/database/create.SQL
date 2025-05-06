-- Bảng users
CREATE TABLE public.users (
    id SERIAL PRIMARY KEY,
    username character varying(255) NOT NULL UNIQUE,
    password character varying(255) NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);

-- Bảng devices
CREATE TABLE public.devices (
    id SERIAL PRIMARY KEY,
    feed_name character varying(255) NOT NULL,
    value character varying(255) NOT NULL,
    "timestamp" timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);

-- Bảng reminders
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

-- Bảng schedule_tasks
CREATE TABLE public.schedule_tasks (
    id SERIAL PRIMARY KEY,
    user_id integer NOT NULL,
    feed_key character varying(255) NOT NULL,
    payload character varying(255) NOT NULL,
    execute_at timestamp without time zone NOT NULL,
    status character varying(255) DEFAULT 'PENDING'::character varying NOT NULL,
    created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES public.users(id)
);

-- Bảng sensors
CREATE TABLE public.sensors (
    id SERIAL PRIMARY KEY,
    feed_name character varying(255) NOT NULL,
    value character varying(255) NOT NULL,
    "timestamp" timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);

-- Bảng threshold
CREATE TABLE public.threshold (
    feed_name character varying(255) PRIMARY KEY NOT NULL,
    upper_value character varying(255) NOT NULL,
    lower_value character varying(255) NOT NULL
);

-- Bảng device_configurations
DROP TABLE IF EXISTS public.device_configurations;
CREATE TABLE public.device_configurations (
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

-- Dữ liệu mẫu cho device_configurations
INSERT INTO public.device_configurations (name, mode, status, intensity, turn_off_after) VALUES
('led', 'manual', false, 50, null),
('fan', 'manual', false, 0, null),
('pump', 'manual', false, 0, null)
ON CONFLICT (name) DO NOTHING;

-- Bảng notifications
DROP TABLE IF EXISTS public.notifications;
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


-- Hàm để update updated_at (từ phần thêm của bạn)
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
   NEW.updated_at = NOW();
   RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

-- Trigger cho device_configurations (từ phần thêm của bạn)
CREATE TRIGGER update_device_configurations_updated_at
BEFORE UPDATE ON public.device_configurations
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger cho bảng reminders để cập nhật updated_at (thêm mới dựa trên cấu trúc bảng)
CREATE TRIGGER update_reminders_updated_at
BEFORE UPDATE ON public.reminders
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Trigger cho bảng schedule_tasks để cập nhật updated_at (thêm mới dựa trên cấu trúc bảng)
CREATE TRIGGER update_schedule_tasks_updated_at
BEFORE UPDATE ON public.schedule_tasks
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();